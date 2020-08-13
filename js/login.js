//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e) {

  
    const buttonLogin = document.getElementById("button-login");
    buttonLogin.addEventListener("click", login);

    /*Funcion que se ejecuta cuando se realiza clic en Ingresar*/
    function login() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email == "" || password == "") {
            const showAlert = document.getElementById("alert-email-password");
            showAlert.style.visibility = "visible";       
        } else if (email !== "" && password !== ""){
            /*Guardando los datos en el LocalStorage*/
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            /*Redirecciona a index.html*/
            window.location.href = "index.html";
        } 
    }
});