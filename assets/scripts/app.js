//variables
let searchBoxInput;
let products;
let removeCartItemButtons;
let searchButton;
let clearCartBtn;
let buyCartBtn;
let cartItemContainer;
let searchBar;
let productDetailButtons;
let modal;
let closeSpan;
let cartRows;
let addToCartButtons;
let cartContent;
let cartTotal;
let cartProducts;

// buttons from the DOM
let addToCartBtnDOM = [];


$("#search-box-input").on("keyup", function() {
    let value = $(this).val().toLowerCase();
    $("#products-container .search-item").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});


function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCart() {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
}

function removeProduct(id) {
    shoppingCart.cart = shoppingCart.cart.filter(product => product.id !== id)
    setCartValues(shoppingCart.cart);
    saveCart(shoppingCart.cart);
    let button = getSingleButton(id);
    button.disabled = false;
    button.value = "Agregar al carrito";  
}

function getSingleButton(id) {
    return addToCartBtnDOM.find(button => button.dataset.id === id);
}

function addToCart() {
    addToCartButtons = [...$(".bag-btn")];
    addToCartBtnDOM = addToCartButtons;
    addToCartButtons.forEach(button => {
        let id = button.dataset.id;
        let inCart = shoppingCart.cart.find(product => product.id === id);
        if(inCart) {
            button.value = "En el carrito";
            button.disabled = true;
        }

        $(button).click(function(event) {
            event.target.value = "En el carrito";
            event.target.disabled = true;
            //get product from products adding an amount property 
            let cartProduct = {...getProduct(id), amount:1};
            //add product to the cart
            shoppingCart.cart = [...shoppingCart.cart, cartProduct];
            //save cart in local storage
            saveCart(shoppingCart.cart);
            //set cart values
            setCartValues(shoppingCart.cart);
            //display cart product
            shoppingCart.buildCart('cart-container');
        });      
    });
}

function renderProductDetail() {
    productDetailButtons = [...$(".detail-btn")];
    closeSpan = $(".close");
    modal = $("#modal-container");
    productDetailButtons.forEach(button => {
        $(button).click(function(event) {
            let id = button.dataset.id;
            products.buildProductDetail("modal-container", getProduct(id));
            $(modal).css("display", "block");
        });
    });

    $(closeSpan).click(function() {
        $(modal).css("display", "none");
    });

    $(window).click(function(event) {
        if(event.target === $(modal)[0]) {
            $(modal).css("display", "none");
        }
    });
}


cartTotal = $(".cart-total");
cartProducts = $(".cart-products");

function setCartValues(cart) {
    let tempTotal = 0;
    let productsTotal = 0;
    shoppingCart.cart.map(product => {
        tempTotal += product.precio * product.amount;
        productsTotal += product.amount;
    })
    cartTotal.innerText = tempTotal;
    cartProducts.innerText = productsTotal;
}

function displayCartTotal(){
    let tempTotal = 0;
    shoppingCart.cart.map(product => {
        tempTotal += product.precio * product.amount;
    })
    cartTotal.innerText = tempTotal;
    return tempTotal; 
}

function displayCartAmount(){
    let productsTotal = 0;
    shoppingCart.cart.map(product => {
        productsTotal += product.amount;
    })
    cartProducts.innerText = productsTotal;
    return productsTotal;
}

$(document).ready(() => {
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:5500/assets/data/data.json"
        
    }).done(function (data) {
        products = new Products();
        products.init(data);
        products.buildList('products-container', 'data');

        shoppingCart = new ShoppingCart();
        shoppingCart.populate();
        shoppingCart.buildCart('cart-container');

        saveProducts(products.data);
        addToCart();
        renderProductDetail();
        
    }).fail(function (error) {
        console.log(error);
    });

    cartContent = $('#cart-container')[0];
    clearCartBtn = $(".clear-cart");
    $(clearCartBtn).click(function() {
        let cartProducts = shoppingCart.cart.map(product => product.id);
        cartProducts.forEach(id => removeProduct(id));
        while(cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        shoppingCart.buildCart('cart-container');
    })

    cartContent = $('#cart-container')[0];
    buyCartBtn = $(".buy-btn");
    $(buyCartBtn).click(function() {
        if(displayCartAmount() === 0) {
            alert("Por favor, seleccione un producto");
        }
        else {
            let cartProducts = shoppingCart.cart.map(product => product.id);
            cartProducts.forEach(id => removeProduct(id));
            while(cartContent.children.length > 0) {
                cartContent.removeChild(cartContent.children[0]);
            }
            shoppingCart.buildCart('cart-container');
            alert("Gracias por su compra!");
        }        
           
    })

    $(cartContent).click(function(event) {
        if(event.target.classList.contains('btn-remove')) {
            let removeCartItem = event.target;
            let id = removeCartItem.dataset.id;
            removeCartItem.parentElement.parentElement.remove();
            removeProduct(id);
            shoppingCart.buildCart('cart-container');
        }
        else if(event.target.classList.contains('fa-chevron-up')) {
            let addAmount = event.target;
            let id = addAmount.dataset.id;
            let tempProduct = shoppingCart.cart.find(product => product.id === id);
            tempProduct.amount = tempProduct.amount + 1;
            saveCart(shoppingCart.cart);
            setCartValues(shoppingCart.cart);
            addAmount.nextElementSibling.innerText = tempProduct.amount;
            shoppingCart.buildCart('cart-container');
        }
        else if(event.target.classList.contains('fa-chevron-down')) {
            let lowerAmount = event.target;
            let id = lowerAmount.dataset.id;
            let tempProduct = shoppingCart.cart.find(product => product.id === id);
            tempProduct.amount = tempProduct.amount - 1;
            if(tempProduct.amount > 0) {
                saveCart(shoppingCart.cart);
                setCartValues(shoppingCart.cart);
                lowerAmount.previousElementSibling.innerText = tempProduct.amount;
                shoppingCart.buildCart('cart-container');
            }
            else {
                lowerAmount.parentElement.parentElement.remove();
                removeProduct(id);
                shoppingCart.buildCart('cart-container'); 
            }
        }
          
    });
    
});

