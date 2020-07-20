function ShoppingCart() {
    
    this.cart = [];

    this.populate = function() {
        this.cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
    }

    this.add = function(item) {
        this.cart.push(item);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.buildCart('cart-container');
    }

    this.get = function() {
        return this.cart;
    }

    this.buildProductsList = function() {
        let html = '';
        this.cart.forEach(product => {
            html = html + 
            `<div class="cart-row">
                <div class="cart-item cart-column">
                <span class="cart-item-title">${product.titulo}</span>
            </div>
            <span class="cart-price cart-column">$${product.precio}</span>
            <div class="cart-quantity cart-column">
                <div>
                    <i class="fas fa-chevron-up" data-id=${product.id}></i>
                    <p class="product-amount">${product.amount}</p>
                    <i class="fas fa-chevron-down" data-id=${product.id}></i>
                </div>
                <button class="btn btn-remove" type="button" data-id=${product.id}>X</button>
            </div>
        </div>`;
        });
        
        return html;
    }

    this.buildCart = function(containerId) {
        let container = document.getElementById(containerId);
        container.innerHTML = "";
        let html = `
            <h2>Carrito de compras <span class="cart-products">(${displayCartAmount()})</span></h2>
            <div class="cart-row">
                <span class="cart-item cart-header cart-column">Producto</span>
                <span class="cart-price cart-header cart-column">Precio</span>
                <span class="cart-quantity cart-header cart-column">Cantidad</span>
            </div>
            <div class="cart-items" id="cart-container">
                ${ this.buildProductsList() }    
            </div>
            <div class="total-container">
                <strong>Total:</strong> 
                <span class="cart-total">$${displayCartTotal()}</span>
            </div>
                
        `
        container.innerHTML = html;
    } 
}