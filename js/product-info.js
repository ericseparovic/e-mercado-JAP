//Variables
var productInfo;
var products;
var comments;
var addComment;


//Muestra la informacion del producto
function showInfoProducts() {

    let productNameHTML = document.getElementById("productName");
    let productPrecioHTML = document.getElementById("productPrecio");
    let productDescriptionHTML = document.getElementById("productDescription");
    let productCategoryHTML = document.getElementById("productCategory");
    let productCountHTML = document.getElementById("productCount");

    productNameHTML.innerHTML = productInfo.name;
    productPrecioHTML.innerHTML = `${productInfo.cost} ${productInfo.currency}`;
    productDescriptionHTML.innerHTML = productInfo.description;
    productCategoryHTML.innerHTML = productInfo.category;
    productCountHTML.innerHTML = productInfo.soldCount;

    //Carga los productos en la variable products y llama a la funcion showProductsRelated para mostrar los productos relacionados
    getJSONDataProductRelated(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            products = resultObj.data;
            //Muestra los productos relacionados
            showProductsRelated();
        }
    });
}


//Muestra la galeria de imagenes
function showImagesGallery(img) {

    let htmlContentToAppend = "";

    for (let i = 0; i < img.length; i++) {
        let imageSrc = img[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `
        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

//Muestra los pruductos relacionados
function showProductsRelated() {
    
    let ProductsRelated = productInfo.relatedProducts;

    if (products !== undefined && productInfo !== undefined) {
        let productRelatedHTML = "";

        for(let product of ProductsRelated){
            productRelatedHTML += `
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="${products[product].imgSrc}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${products[product].name}</h5>
                    <p class="card-text">${products[product].description}</p>
                    <a href="#" class="btn btn-primary">Ver</a>
                </div>
            </div>
            `
            document.getElementById("product-related").innerHTML = productRelatedHTML;
        }
    }
}

//Muestra los comentarios
function showComments(addComment) {
    
    if(addComment !== undefined){
        comments.push(addComment);
        addComment = undefined;
    }

    let commentsHTML = "";
    if (comments !== undefined) {
        
        for (let comment of comments) {
        let score = comment.score;
        let star = showStar(score);

        commentsHTML += `
    
            <div class="box-comment">
                <p class="name-user">${comment.user}</p>
                <span class="date">${comment.dateTime}</span>
                ${star}
                <blockquote>${comment.description}</blockquote>
            </div>                
            `
            document.getElementById('comments-list').innerHTML = commentsHTML;
        }
    }
}


//Retorna la calificacion en formato de estrellas
function showStar(score){
    
    let star = '';
    switch(score){
        case 1:
            star = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>`
        break;
        case 2:
            star = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>`
        break;
        case 3:
            star = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>`
        break;
        case 4:
            star = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>`
        break;
        case 5:
            star = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>`
        break;

    }

    return star;
}


//Boton enviar comentario
let btnSendComment = document.getElementById('button-comment');
    btnSendComment.addEventListener('click', newComment);

//Añade un nuevo comentario
function newComment(){
    let estrellas = document.getElementsByName('estrellas');
    let description = document.getElementById('description').value;
    let score = "";

    for(let estrella of estrellas){
        if(estrella.checked){
            score = Number(estrella.value);
        }
    }

    const comment = {
        dateTime: date(),
        description: description,
        score: score,
        user: localStorage.getItem('email')
    }


    addComment = comment;
    showComments(addComment);
}



//Retorna hora y fecha
function date(){
    let fecha = new Date();
    let dateAndHour;
    hour = fecha.toLocaleTimeString();
    year = fecha.getFullYear();
    month = fecha.getMonth();
    day = fecha.getDate();
    dateAndHour = `${year}-${month+1}-${day} ${hour}`;
    return dateAndHour;
}


document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productInfo = resultObj.data;
             
            //Muestra la informacion del producto
            showInfoProducts();
            //Muestro las imagenes en forma de galería
            showImagesGallery(productInfo.images);
        }
    });


    getJSONDataComments(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comments = resultObj.data;

            //Muestra los comentarios
            showComments();
        }
    });
});









