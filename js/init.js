const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e) {

  
 //Función que ejecuta el login.
  function redirectLogin() {
    
    let url = location.href;
    let urlLogin= url.slice(0,-10) + "login.html";
  
    if (localStorage.getItem('email') == null && localStorage.getItem("password") == null) {
      if (location.href !== urlLogin) {
        location.href = "login.html"
      }
    }
  }

  redirectLogin();


  //Función que se ejecuta cuando se raliza clic en Cerrar sesión

      const buttonSignoff = document.getElementById("sign-off");
      buttonSignoff.addEventListener("click", signoff);
  
      function signoff() {
          localStorage.clear();
          location.reload();
      }


      //Funcion que ejecuta el nombre de usuario en pantalla

      const userName = document.getElementById("username");

      function user() {
        if(localStorage.getItem('email') != null || localStorage.getItem != undefined)
        userName.innerHTML = `<span id="username" class="user-name">`+ localStorage.getItem('email') + `</span>`
      }
      user();
});