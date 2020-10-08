//Variables
var itemCarrito;
var articles;
var items;

//Funcion que agrupa eventos para agrupar eventos
eventListener();
function eventListener() {
    //Obtiene datos JSON
    document.addEventListener("DOMContentLoaded", getJSON);

    //Evento que se ejecuta cuando se aumenta o disminuye la cantidad
    let boxCarrito = document.querySelector("#articles");
    boxCarrito.addEventListener("change", increaseQuantity);
    
    //Evento que se ejecuta cuando se cambia el tipo de envio
    let typeShipping = document.getElementById('tipo-envio');
    typeShipping.addEventListener('change', getDateLocalStorage);

    //Evento que se ejecuta cuando se realiza clic en boton borrar
    boxCarrito.addEventListener('click', clearProductCart)
}

//Funcion que obtiene datos JSON
function getJSON(e) {
    getJSONData(CART).then(function (resultObj) {
        if (resultObj.status === "ok") {
            itemCarrito = resultObj.data;
            articles = itemCarrito.articles;            
            //Guarda datos en local storage
            syncUpLocalStorage();
        }
    });
}


//Funcion que muestra los productos agregados al carrito
function showCart(articles) {
    let itemHTML = "";

    for (let item of articles) {
        let subTotalItem = getSubTotalItem(item.unitCost, item.count);

        itemHTML += ` 
        <tr>
            <td>${item.name}</td>
            <td class="icon-product"><img src="${item.src}" alt=""></td>
            <td><input name="${item.name}" type="number" min="1" value="${item.count}" id="cantidad"></td>
            <td><span>${item.currency} </span><span>${subTotalItem}</span></td>
            <td><a href="#"><img src="img/papelera-de-reciclaje.png" alt="" id="clear-product" name="${item.name}"></td></a>
        </tr>
        `;
    }

    document.getElementById("articles").innerHTML = itemHTML;

    //Funcion que calcula detalle a pagar
    detailToPay(articles);

    //Muestra cantidad de productos en el carrito
    showCountCart();
}


//Funcion que calcula detalle a pagar
function detailToPay(articles) {
    var subTotalToPay = 0;
    var totalShipping = 0;
    var totalToPay = 0;
        subTotal = 0;


    articles.forEach((item) => {
        //Subtotal producto
        let subTotalItem = getSubTotalItem(item.unitCost, item.count);
        //Realiza la conversion de pesos a dolar
        let unitCostUSD = convertPesosToDollars(subTotalItem, item.currency);
        //Obtiene el subtotal a pagar de los productos
        subTotalToPay = getSubTotal(unitCostUSD);
        //Obtiene el costo de envio
        totalShipping = getCostOfShipping(subTotalToPay);
        //Obtiene el total a pagar
        totalToPay = getTotalToPay(subTotalToPay, totalShipping);

    });

    showDetailToPay(subTotalToPay, totalShipping, totalToPay);
}



//Funcion que muestra el detalle a pagar
function showDetailToPay(subTotalToPay, totalShipping, totalToPay) {
    let detailHTML = '';

    detailHTML = `
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Subtotal</th>
                <td scope="col">USD ${subTotalToPay}</td>
                </tr>
                <tr>
                <th scope="row">Costo Envio</th>
                <td>USD ${totalShipping}</td>
                </tr>
                <tr>
                <th scope="row">Total</th>
                <td>USD ${totalToPay}</td>
                </tr>
            </thead>
        </table>
    `

    document.getElementById('total-pagar').innerHTML = detailHTML;
}


//Incrementa la cantidad y crea un nuevo objeto con la cantidad actualizada
function increaseQuantity(event) {

    let quantity = Number(event.target.value);
    let product = event.target.name;

    //Actualiza la cantidad del producto y se crea un nuevo objeto con la cantidad acutalizada.
    const items = articles.map((item) => {
        if (item.name === product) {
            item.count = quantity;
            return item;
        } else {
            return item;
        }
    });
    
    showCart(items);

}


//Funcion que retorna el subtotal del producto
function getSubTotalItem(cost, count) {
    return cost * count;
}


//Funcion que covierte la moneda pesos a dolar
function convertPesosToDollars(unitCost, currency) {
    const dollarsPrice = 40;

    if (currency === "UYU") {
        return unitCost / dollarsPrice;
    } else {
        return unitCost;
    }
}

//Funcion que retorna el subtotal a pagar
function getSubTotal(cost) {
    subTotal += cost;
    return Number(subTotal.toFixed(2));
}

//Funcion que retorna el costo de envio a pagar
function getCostOfShipping(subTotal) {
    const inputCosto = document.getElementsByName("publicationType");

    for (input of inputCosto) {
        if (input.checked) {
            let shipping = subTotal * (input.value / 100);
            return Number(shipping.toFixed(2));
        }
    }
}

//Funcion que retorna total a pagar
function getTotalToPay(subTotal, shipping) {
    let total = subTotal + shipping;
    return Number(total.toFixed(2));
}

//Funcion que guarda los productos agregados al carrtio en el local storage
function syncUpLocalStorage(){
    localStorage.setItem('cart', JSON.stringify(articles));
    getDateLocalStorage();
}

//Obtiene datos del localStorage y muestra la cantidad de articulos agregados al carrito
function getDateLocalStorage(){
    let articles = JSON.parse(localStorage.getItem('cart'));
    showCart(articles);
}

//Eliminar producto del carrito
function clearProductCart(event){
    event.preventDefault();

    if(event.target.id === 'clear-product'){
        articles = articles.filter(item => item.name !== event.target.name);
    }

    showCart(articles);
}

//Muestra cantidad de productos
function showCountCart(){
    let badgeCount = articles.length;

    localStorage.setItem('cantidad', JSON.stringify(badgeCount));

    document.getElementById('badge-count').innerHTML = badgeCount;
}
