
function Products() {

    this.data = [];
    this.results = [];

    this.init = function(data) {
        this.data = data;
    }

    this.getById = function(id) {
        return this.data.filter((product)=> product.id === id)
    }

    this.saveProduct = function(products){
        localStorage.setItem('products', JSON.stringify(products));
    }

    this.buildHtmlProduct = function(product) {
        return `
                <article class="search-item">
                    <div class="col-3-12">
                        <img src="${product.imagen}" width="100">
                    </div>
                    <div class="col-8-12">
                        <h2>${product.titulo}</h2>
                        <p>$${product.precio}</p>
                        <div>
                            <input type="button" class="btn -primary open-modal" id="detail-btn" data-id=${product.id} value="Ver detalle">
                            <input type="button" class="btn -secondary bag-btn" data-id=${product.id} value="Agregar al carrito">
                        </div>
                    </div>
                </article>
                `
    }

    this.buildList = function(containerId, sourceData) {
        let container = document.getElementById(containerId);
        container.innerHTML = "";
        let html = '';

        this[sourceData].forEach(product => {
            html = html + this.buildHtmlProduct(product); 
        });
        
        container.innerHTML = html;
    }

    this.search = function(key) {
        this.results = [];
        this.data.forEach((product) => {
            if(product.titulo.toLowerCase().includes(key.toLowerCase())){
                this.results.push(product);
            }
        });
        return this.results;
    }

}
