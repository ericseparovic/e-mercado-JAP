//Variables
var itemCarrito;
var articles;
var items;


//Funcion que agrupa eventos
eventListener();
function eventListener() {
    //Funcion que se ejecuta cuando carga la pagina obtiene datos JSON
    document.addEventListener("DOMContentLoaded", getJSON);

    //Funcion que se ejecuta cuando se aumenta o disminuye la cantidad del articulos
    let boxCarrito = document.querySelector("#articles");
    boxCarrito.addEventListener('click', increaseQuantity);

    //Funcion  que se ejecuta cuando se modifica el tipo de envio
    let typeShipping = document.getElementById('tipo-envio');
    typeShipping.addEventListener('change', detailToPay);

    //Funcion que se ejecuta cuando se realiza clic en btn borrar articulo del carrito
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
        //Calcula el subtotal a pagar por producto
        let subTotalItem = getSubTotalItem(item.unitCost, item.count);

        itemHTML += ` 

        <tr>
            <td>${item.name}</td>
            <td class="icon-product">
                <img src="${item.src}" alt="">
            </td>
            <td>
                <div class="container-number" id="box-count">
                    <div class="image-number">
                        <a href="#">
                            <img name="${item.name}" src="img/anadir.png" id="increase" alt="">
                        </a>
                    </div>

                    <div id="box-cantidad">
                        <input  type="number" min="1" value="${item.count}" id="cantidad">
                    </div>

                    <div class="image-number">
                        <a href="#">
                            <img name="${item.name}" src="img/menos.png" id="decrease" alt="">
                        </a>
                    </div>
                </div>
            </td>
            <td class="box-subTotal">
                <span>${item.currency} </span><span>${subTotalItem}</span>
            </td>
            <td>
                <a href="#">
                    <img src="img/papelera-de-reciclaje.png" alt="" id="clear-product" name="${item.name}">
                </a>
            </td>
        </tr>
        `;
    }

    document.getElementById("articles").innerHTML = itemHTML;

    //Funcion que calcula detalle a pagar
    detailToPay();

    //Funcion que muestra la cantidad de articulos agregados al carrito
    showCountCart();
}


//Funcion que calcula detalle a pagar
function detailToPay() {
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


//Funcion que se ejecuta cuando se aumenta o disminuye la cantidad de articulos
function increaseQuantity(event) {
    event.preventDefault();

    //Obtiene el valor del input
    let i = valorCount(event);

    let product = event.target.name;

    //Actualiza la cantidad del producto y se crea un nuevo objeto con la cantidad acutalizada.
    const items = articles.map((item) => {

        if (item.name === product) {
            item.count = i;
            return item;
        } else {
            return item;
        }

    });

    showCart(items);
}

//Funcion que retora el nuevo valor del input si se modifica la cantidad
function valorCount(event) {
    event.preventDefault();

    let boxCount = event.target.parentElement.parentElement.parentElement;
    let inputCount = boxCount.querySelector('#cantidad');
    let value = inputCount.getAttribute('value');
    var i = Number(value);

    if (event.target.id === "increase") {
        i++;
    } else if (event.target.id === "decrease") {

        if (i > 1) {
            i--;
        }
    }
    return i;
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
function syncUpLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(articles));
    getDateLocalStorage();
}

//Obtiene datos del localStorage y muestra la cantidad de articulos agregados al carrito
function getDateLocalStorage() {
    let articles = JSON.parse(localStorage.getItem('cart'));
    showCart(articles);
}

//Eliminar producto del carrito
function clearProductCart(event) {
    event.preventDefault();

    if (event.target.id === 'clear-product') {
        articles = articles.filter(item => item.name !== event.target.name);
    }

    showCart(articles);
}

//Muestra cantidad de productos
function showCountCart() {
    let badgeCount = 0;

    articles.forEach(item => {
        badgeCount += item.count;
    });

    localStorage.setItem('cantidad', JSON.stringify(badgeCount));

    document.getElementById('badge-count').innerHTML = badgeCount;
}