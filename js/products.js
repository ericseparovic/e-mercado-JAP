const ORDER_ASC_BY_NAME = "AZ";
const ORDER_BY_PROD_COUNT_MAX = "PrecioMaximo.";
const ORDER_BY_PROD_COUNT_MIN = "PrecioMinimo.";
const ORDER_BY_RELEVANCE = "Relevancia";
const ORDER_SEARCH = "search";

var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

function sortProducts(criteria, array, arraySearch){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT_MAX){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);
            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT_MIN){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);
            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_RELEVANCE){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);
            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }  else if (criteria === ORDER_SEARCH) {
        const inputSearch = document.getElementById('search');
        const textSearch = inputSearch.value.toLowerCase();

        for(let producto of arraySearch) {
            let nameProduct = producto.name.toLowerCase();
            if(nameProduct.indexOf(textSearch) !== -1){
                result.push(producto);
            } else if(nameProduct.indexOf(textSearch) === -1){
                let htmlContentToAppend = `
                    <div id="result-not-found"><p>Resultado no encontrado</p></div>
                `;
                
                document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
            }
        }      
    }
   
    return result;
    
}


function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let products = currentProductsArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(products.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(products.cost) <= maxCount))){

            htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + products.imgSrc + `" alt="` + products.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ products.name + " - " + products.currency + " " + products.cost +`</h4>
                            <small class="text-muted">` + products.soldCount + ` artículos</small>
                        </div>
                        <p class="mb-1">` + products.description + `</p>
                    </div>
                </div>
            </a>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentProductsArray = categoriesArray;
        arraySearch = categoriesArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray, arraySearch);

    //Muestro las categorías ordenadas
    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowProducts(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });


    document.getElementById("sortByCountMax").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_COUNT_MAX);
    });

    //Ejecuta la funcion para ordenar de menor a mayor precio.
    document.getElementById("sortByCountMin").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_COUNT_MIN);

    });

    //Ordena productos por cantidad de ventas de mayor a menor
    document.getElementById("sortByRelevance").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_RELEVANCE);

    });

    //Ejecuta la funcion sortAndShowProducts(ORDER_SEARCH) cuando se escribe en el input search
    document.getElementById("form-search").addEventListener("keyup", function(){
        sortAndShowProducts(ORDER_SEARCH);
    });


    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProductsList();
    });
});