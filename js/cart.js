//Variables Globales
var subTotalProduct; //Contiene el subtotal por producto
var totalShipping;   //Contiene costo envio 
var subTotalToPay;   //Contiene subtotal a pagar
var totalToPay;      //Contiene total a pagar



//Funcion que agrupa eventos
eventListener();
function eventListener() {
    //Funcion que se ejecuta cuando carga la pagina obtiene datos JSON
    document.addEventListener("DOMContentLoaded", getJSON);

    //Funcion que se ejecuta cuando se aumenta o disminuye la cantidad del articulos
    const boxCarrito = document.querySelector("#articles");
    boxCarrito.addEventListener('click', increaseQuantity);

    //Funcion  que se ejecuta cuando se modifica el tipo de envio
    const typeShipping = document.getElementById('tipo-envio');
    typeShipping.addEventListener('change', calculationDetailToPay);

    //Funcion que se ejecuta cuando se realiza clic en btn borrar articulo del carrito
    boxCarrito.addEventListener('click', clearProductCart);

    //Funcion que se ejecuta cuando se realiza clic en finalizar compra.
    const btnFinalizarCompra = document.getElementById('finalizar-compra');
    btnFinalizarCompra.addEventListener('click', showAlert);

    //Desabilita input del formulario tipo de pago
    const inputCredito = document.querySelector('.tipoPagoCredito');
    const inputBanco = document.querySelector('.tipoPagoBanco');
    inputCredito.addEventListener('click', showAlertDisabled);
    inputBanco.addEventListener('click', showAlertDisabled);

    //Funcion que valida formulario tipo de pago
    const saveFormPay = document.getElementById('save-modal');
    saveFormPay.addEventListener('click', showAlertValidationPay)

    //Valida formulario de tipo de pago en tiempo real
    const boxModal = document.querySelector('#box-modal')
    boxModal.addEventListener('keyup', createIsValid);
    boxModal.addEventListener('click', createIsValid);
    boxModal.addEventListener('change', createIsValid);

    //Validar formulario datos de envio en tiempo real
    const dataEnvio = document.querySelector('.datos-envio');
    dataEnvio.addEventListener('keyup', createIsValid);
}


//Funcion que obtiene datos JSON
function getJSON(e) {
    getJSONData(CART).then(function (resultObj) {
        if (resultObj.status === "ok") {
            let articles = resultObj.data.articles;

            //Guarda datos en local storage
            syncUpLocalStorage(articles);
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
                            <img name="${item.name}" src="img/anadir.png" class="increase" alt="">
                        </a>
                    </div>

                    <div id="box-cantidad">
                        <input  type="number" min="1" value="${item.count}" class="cantidad">
                    </div>

                    <div class="image-number">
                        <a href="#">
                            <img name="${item.name}" src="img/menos.png" class="decrease" alt="">
                        </a>
                    </div>
                </div>
            </td>
            <td class="box-subTotal">
                <span>${item.currency} </span><span>${subTotalItem}</span>
            </td>
            <td>
                <a href="#">
                    <img src="img/papelera-de-reciclaje.png" alt="" class="clear-product" name="${item.name}">
                </a>
            </td>
        </tr>
        `;
    }

    //Muestra mensaje carrito vacio
    if (articles.length === 0) {
        itemHTML = `
        <tr>
            <td colspan="5" class="alert-warning h6"><strong>Carrito Vacio!</strong></td>
        </tr>
        `
    }

    document.getElementById("articles").innerHTML = itemHTML;

    //Funcion que calcula detalle a pagar
    calculationDetailToPay();

    //Funcion que muestra la cantidad de articulos agregados al carrito
    showCountCart();

    //Funcion que muestra el tipo de pago seleccionado, si no hay pago seleccionado muestra mensaje "no hay pago seleccionado".
    showTypePay();
}


//Funcion que calcula detalle a pagar
function calculationDetailToPay() {
    subTotalProduct = 0;
    totalShipping = 0;
    subTotalToPay = 0;
    totalToPay = 0;

    articles.forEach((item) => {
        //Subtotal producto
        let subTotalItem = getSubTotalItem(item.unitCost, item.count);
        //Realiza la conversion de pesos a dolar
        let unitCostUSD = convertPesosToDollars(subTotalItem, item.currency);
        //Obtiene el subtotal a pagar de los productos
        subTotalToPay = getSubTotal(unitCostUSD);
        //Obtiene el costo de envio
        totalShipping = getCostShipping();
        //Obtiene el total a pagar
        totalToPay = getTotalToPay();
    });

    //Muestra el detalle a pagar
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

    //Obtiene el valor del input
    let i = valorCount(event);

    let product = event.target.name;

    //Actualiza la cantidad del producto y se crea un nuevo objeto con la cantidad acutalizada.
    const item = articles.map((item) => {

        if (item.name === product) {
            item.count = i;
            //Retorna el producto con la nueva cantidad
            return item;
        } else {
            //Retorna el producto con la cantidad actual
            return item;
        }

    });

    showCart(item);
}


//Funcion que retora el nuevo valor del input si se modifica la cantidad
function valorCount(event) {
    event.preventDefault();

    const boxCount = event.target.parentElement.parentElement.parentElement;
    const inputCount = boxCount.querySelector('.cantidad');
    const value = inputCount.getAttribute('value');
    let i = Number(value);

    if (event.target.className === "increase") {
        //Incremeta la cantidad de articulos
        i++;
    } else if (event.target.className === "decrease") {
        if (i > 1) {
            //Decrementa la cantidad de articulos
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
    subTotalProduct += cost;
    return Number(subTotalProduct.toFixed(2));
}

//Funcion que retorna el costo de envio a pagar
function calcCostShipping(subTotal) {
    const inputTypeShipping = document.getElementsByName("publicationType");

    for (let input of inputTypeShipping) {
        if (input.checked) {
            let shipping = subTotal * (input.value / 100);
            return Number(shipping.toFixed(2));
        }
    }
}

//Retorna el costo del envio, si se eligio el tipo de envio retorna el costo total de envio, y si no esta
//elegido retorna cero. 
function getCostShipping() {
    let costShipping = calcCostShipping(subTotalToPay);
    if (costShipping === undefined) {
        return 0;
    } else {
        return costShipping;
    }
}

//Funcion que retorna total a pagar
function getTotalToPay() {
    let total = subTotalToPay + totalShipping;
    return Number(total.toFixed(2));
}

//Funcion que guarda los productos agregados al carrtio en el local storage
function syncUpLocalStorage(articles) {
    localStorage.setItem('cart', JSON.stringify(articles));
    
    getDateLocalStorage();
}

//Obtiene datos del localStorage y muestra la cantidad de articulos agregados al carrito
function getDateLocalStorage() {
    articles = JSON.parse(localStorage.getItem('cart'));
    showCart(articles);
}

//Eliminar producto del carrito
function clearProductCart(event) {

    if (event.target.className === 'clear-product') {
        articles = articles.filter(item => item.name !== event.target.name);

    }

    showCart(articles);
}

//Muestra cantidad de productos agregados al carrito
function showCountCart() {
    let badgeCount = 0;

    articles.forEach(item => {
        badgeCount += item.count;
    });

    //Guarda la cantidad de articulos agregados al carrito en el local storage para ser utilizados en las demas pestañas.
    localStorage.setItem('cantidad', JSON.stringify(badgeCount));

    document.getElementById('badge-count').innerHTML = badgeCount;
}





/**************VALIDACION BOTON FINALIZAR COMPRA**************/

//Funcion que se ejecuta cuando se reazlia clic en boton finalizar compra
function showAlert() {

    //Si se cumples con todas las condiciones para finalizar la compra se muestra el mensaje compra exitosa
    //de lo contrario se indicara las alertas correpondiente al dato que esta faltando
    if (showAlertDateShipping() && showCartEmpty() && showAlertTypeShipping() && showTypePay() && showAlertCount()) {
        //Muestra mensaje compra exitosa
        showBuy();

    } else {
        //Muestra alerta si los datos de envio estan vacios
        showAlertDateShipping();

        //Muestra alerta si el carrito esta vacio
        showCartEmpty();

        //Muestra alerta si no se selecciono tipo de envio
        showAlertTypeShipping();

        //Muestra alerta si no se selecciono medio de pago
        showAlertPay();

        //Muestra alerta si la cantidad de productos por articlo es igual o menor a cero
        showAlertCount();
    }
}


//Muestra confirmacion de compra
function showBuy() {

    const boxAlertBuy = document.querySelector('.box-confirmacion');
    const boxContainer = document.getElementById('opacityModal');
    boxContainer.style.opacity = '0.5';

    let message = '';

    //Muestra spinner
    boxAlertBuy.style.visibility = 'visible';

    //Muestra la confirmacion de la compra
    setTimeout(function () {
        message = `
                    <img src="img/comprobar.png" alt="">
                    <h5 id="compraExitosa">Compra exitosa!</h5>
                    <a href="products.html">Seguir Comprando</a>
                    `
        boxAlertBuy.innerHTML = message;
    }, 600);
}



//Muestra alertas de input de envio vacio
function showAlertDateShipping() {

    const inputCalle = document.querySelector('#inputCalle');
    const inputPuerta = document.querySelector('#inputPuerta');
    const inputEsquina = document.querySelector('#inputEsquina');

    //Se verifica que el input calle no este vacio
    if (inputCalle.value === "") {
        inputCalle.classList.add('is-invalid');
    } else {
        inputCalle.classList.remove('is-invalid');
        inputCalle.classList.add('is-valid');
    }

    //Se verifica que el input numero de puerta no este vacio
    if (inputPuerta.value === "") {
        inputPuerta.classList.add('is-invalid');
    } else {
        inputPuerta.classList.remove('is-invalid');
        inputPuerta.classList.add('is-valid');
    }

    //Se verifica que el input esquina no este vacio
    if (inputEsquina.value === "") {
        inputEsquina.classList.add('is-invalid');
    } else {
        inputEsquina.classList.remove('is-invalid');
        inputEsquina.classList.add('is-valid');
    }

    //Si todos los campos estan completos retorna true para realizar la validacion con el boton finalizar compra
    if (inputCalle.value !== "" && inputEsquina.value !== "" && inputPuerta.value !== "") {
        return true;
    } else {
        return false;
    }
}

//Muestra alerta si el carrito esta vacio
function showCartEmpty() {

    if (articles.length === 0) {
        itemHTML = `
        <tr>
            <td colspan="5" class="alert-danger h6"><strong>No hay articulos en el carrito!</strong></td>
        </tr>
        `
        document.getElementById("articles").innerHTML = itemHTML;
        //Retorna false si no hay elementos en el carrtio. Sera utilizado para realizar la validacion del boton finalizar compra        
        return false;
    } else {
        //Retorna true si hay elementos en el carrtio. Sera utilizado para realizar la validacion del boton finalizar compra
        return true;
    }
}


//Muestra alerta si no esta seleccionado el tipo de envio
function showAlertTypeShipping() {

    const formTypeShipping = document.getElementById('formTypeShipping');

    if (totalShipping === 0) {
        formTypeShipping.classList.add('was-validated');
        //Retorna false si el costo de envio es 0, esto indica que no se selecciono tipo de envio
        return false;
    } else {
        //Retorna true si el costo de envio es distinto de cero, esto indica que se selecciono tipo de envio
        return true;
    }

}


//Muestra alerta en caso de que no se seleccione forma de pago
function showAlertPay() {
    const alertPay = document.querySelector('.invalid-pay');

    if (showTypePay() === false) {
        alertPay.style.visibility = 'visible';
    } else {
        alertPay.style.visibility = 'hidden';
    }
}


//Funcion que muestra alerta si la cantidad de productos es menor o igual a cero.
//Nota: los valores de la cantidad solo se guardan si son mayor a cero (linea 226).
function showAlertCount(){
    const alertCount = document.querySelector('.invalid-count');

    for(let item of articles){
        if(item.count <= 0) {
            alertCount.style.visibility = 'visible';
            return false
        } else {
            alertCount.style.visibility = 'hidden';
            return true;
        }
    }
}



/********************VALIDACION FORMULARIO FORMA DE PAGO***********************/

//Funcion que desablita los input, del medio de pago NO seleccionado, valida el input seleccionado y borra la clase invalid en caso de estar presente en input desablitados.
function showAlertDisabled(event) {
    const inputRadio = event.target;
    //Desabilita los input de la forma de pago no seleccionado.
    showDisabled(inputRadio);

    //Valida el input type radio seleccionado
    showValidInputRadio();

    //Borra mensajes de error en caso de que los input esten desabilitados
    clearInvalid();
}


//Desabilita los input de la forma de pago no seleccionado.
function showDisabled(inputRadio) {

    const inputDatePay = document.querySelectorAll('.form-pay');

    for (let input of inputDatePay) {
        if (inputRadio.id === "tarjetaCredito" && input.classList[2] === 'tarjeta') {
            input.disabled = false;
        }

        if (inputRadio.id === "tarjetaCredito" && input.classList[2] === 'transferencia') {
            input.disabled = true;
        }

        if (inputRadio.id === "transferenciaBancaria" && input.classList[2] === 'transferencia') {
            input.disabled = false;
        }

        if (inputRadio.id === "transferenciaBancaria" && input.classList[2] === 'tarjeta') {
            input.disabled = true;
        }
    }
}

//Valida el input type radio seleccionado
function showValidInputRadio() {
    const arrayInputRadio = document.querySelectorAll('.typePay');

    for (input of arrayInputRadio) {
        if (input.checked) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        } else {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
    }
}


//Borra mensajes de error en caso de que los input esten desabilitados
function clearInvalid() {
    const inputDatePay = document.querySelectorAll('.form-pay');

    for (let input of inputDatePay) {
        if (input.disabled) {
            input.classList.remove('is-invalid');
            input.classList.remove('is-valid');
        }
    }
}


//Funcion que valida formulario del tipo de pago seleccionado
function showAlertValidationPay() {

    const inputTranferBank = document.getElementById('transferenciaBancaria');
    const inputCardCredit = document.getElementById('tarjetaCredito');

    if (inputTranferBank.checked || inputCardCredit.checked) {
        //Si selecciono un medio de pago, verifica si el formulario de tipo de pago seleccionado esta completo
        alertFormData();

    } else {
        //Si no selecciono medio de pago avisa que se debe seleccionar un medio de pago
        alertTypePay();

    }
}

//Verifica que se halla seleccioando tipo de pago
function alertTypePay() {
    const inputTranferBank = document.getElementById('transferenciaBancaria');
    const inputCardCredit = document.getElementById('tarjetaCredito');
    inputTranferBank.classList.remove('is-invalid');
    inputCardCredit.classList.remove('is-invalid');

    if (inputTranferBank.checked === false && inputCardCredit.checked === false) {
        inputTranferBank.classList.add('is-invalid');
        inputCardCredit.classList.add('is-invalid');
    }
}


//Verifica si los input del tipo de pago seleccionado estan compeletos
function alertFormData() {
    const inputDatePay = document.querySelectorAll('.form-pay');

    for (let input of inputDatePay) {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');

        if (input.disabled === false && input.value === "") {
            input.classList.add('is-invalid');
        } else if (input.disabled === false) {
            input.classList.add('is-valid');
        }
    }

    //Funcion que cierra la ventana modal y muestra el tipo de pago seleccionado
    saveTypePay();
}



//Valida el formulario en tiempo real, se ejecuta cuando el usuario escribe sobre el input o cuando realiza clic sobre el elemento y cuando selecciona una fecha.
function createIsValid(event) {
    const input = event.target;

    input.classList.remove('is-valid');
    input.classList.remove('is-invalid');

    if (input.value !== "") {
        input.classList.add('is-valid');
    }
}



//Funcion que se ejecuta cuando se raliza clic en guardar la forma de pago
function saveTypePay() {
    const inputNumberCard = document.getElementById('numeroTarjeta');
    const inputCodeSecurity = document.getElementById('codigoSeguridad');
    const inputDateCard = document.getElementById('fechaVencimiento');
    const inputNumberBank = document.getElementById('numeroCuenta');
    const btnSaveModal = document.getElementById('save-modal');

    if (inputNumberCard.disabled === false && inputNumberCard.value !== "") {
        if (inputCodeSecurity.disabled === false && inputCodeSecurity.value !== "") {
            if (inputDateCard.disabled === false && inputDateCard.value !== "") {
                //Agrega el atributo data-dismiss para que se cierre la ventana modal
                btnSaveModal.setAttribute('data-dismiss', 'modal');
                //Agrega al html el pago que fue seleccionado 
                showTypePay();
                //Borra mensaje de debe seleccionar pago en caso de que ya este seleccionado
                showAlertPay();

            }
        }
    }

    if (inputNumberBank.disabled === false && inputNumberBank.value !== "") {
        //Agrega el atributo data-dismiss para que se cierre la ventana modal
        btnSaveModal.setAttribute('data-dismiss', 'modal');
        //Agrega al html el pago que fue seleccionado 
        showTypePay();
        //Borra mensaje de debe seleccionar pago en caso de que ya este seleccionado
        showAlertPay();

    }
}


//Funcion que muestra la forma de pago seleccianda
function showTypePay() {
    const inputRadioCredito = document.querySelector('#tarjetaCredito');
    const inputRadioBanco = document.querySelector('#transferenciaBancaria');
    const paySelect = document.getElementById('pagoSeleccionado');
    const btnSaveModal = document.getElementById('save-modal');

    let message = '';

    if (inputRadioCredito.checked) {
        message = `<span class="badge badge-pill badge-success">Tarjeta de Credito</span>
            `
        paySelect.innerHTML = message;
        setTimeout(function () { btnSaveModal.removeAttribute('data-dismiss') }, 1000);
        //Retorna true en caso de que se seleccione un pago, para reutilizar la funcion en el boton finalizar compra
        return true;
    }

    if (inputRadioBanco.checked) {
        message = `<span class="badge badge-pill badge-success">Transferencia Bancaria</span>
            `
        paySelect.innerHTML = message;
        setTimeout(function () { btnSaveModal.removeAttribute('data-dismiss') }, 1000);
        //Retorna true en caso de que se seleccione un pago, para reutilizar la funcion en el boton finalizar compra
        return true;
    }

    if (inputRadioBanco.checked === false && inputRadioCredito.checked === false) {
        message = `<span class="badge badge-pill badge-danger">No hay pago seleccionado</span>`;

        paySelect.innerHTML = message;
        //Retorna false en caso de que no se seleccione un pago, para reutilizar la funcion en el boton finalizar compra
        return false;

    }
}



