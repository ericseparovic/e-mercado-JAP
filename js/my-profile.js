//Variables
const btnConfirmName = document.getElementById('btnConfirmName');
const btnConfirmAge = document.getElementById('btnConfirmAge');
const btnConfirmEmail = document.getElementById('btnConfirmEmail');
const btnConfirmNumber = document.getElementById('btnConfirmNumber');
const btnSaveData = document.getElementById('btnGuardarDatos');
const btnLoadAvatar = document.getElementById('btnConfirmAvatar');
const tdFullName = document.getElementById('fullName');
const tdAge = document.getElementById('age');
const tdEmail = document.getElementById('email');
const tdNumberTel = document.getElementById('numeroTelefono');
const alertConfirm = document.getElementById('alertDataConfirm');
const firstName = document.getElementById('inputPrimerNombre');
const middleName = document.getElementById('inputSegundoNombre');
const lastName = document.getElementById('inputPrimerApellido');
const seconSurname = document.getElementById('inputSegundoApellido');
const ageForm = document.getElementById('inputEdad');
const emailForm = document.getElementById('inputCorreo');
const inputTel = document.getElementById('inputTelefono');
const inputURLAvatar = document.getElementById('inputAvatar');
const boxAvatar = document.querySelector('#contenedorAvatar img');


//Objeto con datos de usuario
let userData = {
    name: {
        firstName: '',
        middleName: '',
        lastName: '',
        seconSurname: ''
    },
    age: "",
    email: "",
    phone: ""
}

//Funcion que agrupa eventos
eventListener();
function eventListener() {

    //Funcion que se ejecuta al confirmar datos nombes y apellidos en ventana modal
    btnConfirmName.addEventListener('click', getNames);

    //Funcion que se ejecuta al confirmar edad en ventana modal
    btnConfirmAge.addEventListener('click', getAge);

    //Funcion que se ejecuta al confirmar correo en ventana modal
    btnConfirmEmail.addEventListener('click', getEmail);

    //Funcion que se ejecuta al confirmar numero de telefono en ventana modal
    btnConfirmNumber.addEventListener('click', getNumber);

    btnLoadAvatar.addEventListener('click', getAvatar);

    //Funcion que se ejecuta al dar clic en guardar datos
    btnSaveData.addEventListener('click', syncLocalStorage);

    //Funcion que carga los datos guardados en el local storage.
    document.addEventListener("DOMContentLoaded", getDataLocalStorage);
}


//Funcion que obtiene los datos nombes y apellidos de los input modal y los agrega a la tabla de datoss
function getNames() {
    //Variables
    userData.name.firstName = firstName.value;
    userData.name.middleName = middleName.value;
    userData.name.lastName = lastName.value;
    userData.name.seconSurname = seconSurname.value;

    //Expresion regular string
    const er = /^[A-Za-z\s]+$/;

    //VALIDACION: Se verifica que al menos se ingrese primer nombre
    if (er.test(userData.name.firstName)) {
        //Limpia mensaje de error
        firstName.classList.remove('is-invalid');
    } else {
        //Agrega mensaje de error
        firstName.classList.add('is-invalid');
    }


    //VALIDACION: Se verifica que al menos se ingrese primer apellido
    if (er.test(userData.name.lastName)) {
        //Limpia mensaje de error
        lastName.classList.remove('is-invalid');

    } else {
        //Agrega mensaje de error
        lastName.classList.add('is-invalid');

    }



    //Cierra ventana modal si se ingreso primer nombre y primer apellido y agrega dato a la tabla
    if (er.test(userData.name.firstName) && er.test(userData.name.lastName)) {

        //Agrega nombres a la tabla
        tdFullName.innerHTML = `${userData.name.firstName} ${userData.name.middleName} ${userData.name.lastName} ${userData.name.seconSurname}`;


        //Cierra ventana modal
        $('#modalNombre').modal('hide');

        return true;

    } else {

        return false;
    }
}


//Funcion que obtiene la edad del input modal y agrega la edad a la tabla de datos
function getAge() {

    userData.age = Number(ageForm.value);

    //VALIDACION: Se verifica que la edad sea un numero mayor a cero
    if (userData.age > 0) {
        //Agrega edad a la tabla
        tdAge.innerHTML = `${userData.age} Años`;

        //Cierra ventana modal
        $('#modalEdad').modal('hide');

        //Limpia mensaje de error
        ageForm.classList.remove('is-invalid');

        return true;
    } else {
        //Muestra mensaje de error
        ageForm.classList.add('is-invalid');

        return false;
    }
}



//Funcion que obtiene correo del input del modal y los muestra en la tabla
function getEmail() {

    userData.email = emailForm.value;

    //Expresión regular para validar correo
    const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //Se verifica si es un email valido
    if (er.test(userData.email)) {
        //Agrega correo a la tabla
        tdEmail.innerHTML = userData.email;

        //Cierra ventana modal
        $('#modalCorreo').modal('hide');

        //Limpia mensaje de error
        emailForm.classList.remove('is-invalid');

        return true;
    } else {
        //Muestra mensaje de error
        emailForm.classList.add('is-invalid');

        return false;
    }
}


//Funcion que obtiene numero de telefono ingresado en input form modal
function getNumber() {


    userData.phone = inputTel.value;

    //Expresion regular para telefono de 9 digitos
    const er = /^\d{9}$/;

    //Validacion: Se verifica si el dato ingresado es un numero.
    if (er.test(userData.phone)) {
        //Agrega telefono a la tabla
        tdNumberTel.innerHTML = userData.phone;

        //Agrega numero de telefono al objeto userData
        userData.phone = userData.phone;

        //Cierra ventana modal
        $('#modalTelefono').modal('hide');

        //Limpia mensaje de error
        inputTel.classList.remove('is-invalid');

        return true;

    } else {
        //Muestra mensaje de error
        inputTel.classList.add('is-invalid');

        return false;
    }
}


//Funcion que guarda datos en local storage al realizar clic en btn guardar datos
function syncLocalStorage() {

    //Si todos los campos estan completos se guardan los datos en localStorage, de lo contrario se muestras las alertas correspondiente a los datos faltantes
    if (validationName() && validationAge() && validationEmail() && validationPhone()) {

        //Muestra alerta datos guardados correctamente
        alertConfirm.classList.remove('d-none');

        //Elimina la alerta
        setTimeout(function () {
            alertConfirm.classList.add('d-none');
        }, 2000);


        //Guarda los datos en el local storage
        localStorage.setItem('userData', JSON.stringify(userData));

        //Funcion que guarda imagen en localstorage
        avatarStorage();


    } else {
        //Validacion campo nombre
        validationName();

        //Validacion campo edad
        validationAge();

        //Validacion campo email
        validationEmail();

        //Validacion campo telefono
        validationPhone();
    }
}


//Funcion que se ejecuta al guardar los datos, verifica que el campo nombre no esta vacio
function validationName() {
    const alertName = document.getElementById('alertNombre');
    //Se verifica que el campo nombre no este vacio
    if (tdFullName.textContent == "") {
        alertName.classList.remove('d-none');
        return false;
    } else {
        alertName.classList.add('d-none');
        return true;
    }
}


//Funcion que se ejecuta al guardar los datos, verifica que el campo edad no esta vacio
function validationAge() {
    const alertAge = document.getElementById('alertEdad');
    
    //Se verifica que el campo edad no este vacio
    if (tdAge.textContent == "") {
        alertAge.classList.remove('d-none');

        return false;
    } else {
        alertAge.classList.add('d-none');

        return true;
    }
}


//Funcion que se ejecuta al guardar los datos, verifica que el campo email no este vacio
function validationEmail() {
    const alertEmail = document.getElementById('alertCorreo');

    //Se verifica que el campo email no este vacio
    if (tdEmail.textContent == "") {
        alertEmail.classList.remove('d-none');

        return false;
    } else {
        alertEmail.classList.add('d-none');

        return true;
    }
}


//Funcion que se ejecuta al guardar los datos, verifica que el campo telefono no este vacio.
function validationPhone() {
    const alertPhone = document.getElementById('alertTelefono');

    //Se verifica que el campo numero de telefono no este vacio
    if (tdNumberTel.textContent == "") {
        alertPhone.classList.remove('d-none');

        return false;
    } else {
        alertPhone.classList.add('d-none');

        return true;
    }
}


//Funcion que carga en html los datos del usuario guardados en el local storage
function getDataLocalStorage() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    //Se verifica que el local storage no este vacio
    if (userData !== null) {

        firstName.value = userData.name.firstName;
        middleName.value = userData.name.middleName;
        lastName.value = userData.name.lastName;
        seconSurname.value = userData.name.seconSurname;

        ageForm.value = userData.age;
        emailForm.value = userData.email;
        inputTel.value = userData.phone;

        //Se llama a la funcion para agregar los nombes a la tabla
        getNames();

        //Se llama a la funcion para agregar la edad a la tabla
        getAge();

        //Se llama a la funcion para agregar email a ala tabla 
        getEmail();

        //Se llama a la funcion para agregar numero de telefono a la tabla
        getNumber();

    }

}



//Funcion para cargar imagen en el html al confirmar imagen en el input del modal
function getAvatar() {
    boxAvatar.src = inputURLAvatar.value;


    //Cierra ventana modal
    $('#modalAvatar').modal('hide');
    
    //La funcion avatarStorage se ejecuta 1 segundo despues de cargar la imagen en el html, debido al error Uncaught DOMException: The operation is insecure. Al ejecutarse este error no se carga la imagen en el html. La solucion provisoria que pude implementar es que se ejecute 1 segundo despues de cargar la imagen en el html. Ademas esta funcion se vuelve a ejecutar cuando guarde los cambios, debido que por el mismo error la imagan no se guarda en local storage y al ejecutar la funcion por segunda vez si cumple su funcion de guardar la imgaen. Por lo que la solucion que implemente es que sea ejecutada tanto al dar clic en confirmar y al dar clic en guardar cambios. 
    setTimeout(function () {
        avatarStorage();
    }, 1000);
}


//Funcion que guarda imagen en local storage.
//imagen: https://i.ibb.co/MVHnqMT/profile.png
function avatarStorage() {

    var avatar = document.getElementById("avatar");

    avatar.crossOrigin = 'anonymous';
    var imgCanvas = document.createElement("canvas"),
        imgContext = imgCanvas.getContext("2d");



    imgCanvas.width = avatar.width;
    imgCanvas.height = avatar.height;


    imgContext.drawImage(avatar, 0, 0, avatar.width, avatar.height);


    let imgAsDataURL = imgCanvas.toDataURL();

    try {
        localStorage.setItem("avatar", imgAsDataURL);
    }
    catch (e) {
        console.log("Storage failed: " + e);
    }
}

//Funcion para cargar imagen guardada en local storage
window.onload = function () {
    let avatar = localStorage.getItem('avatar');
    if (avatar === null) {
        boxAvatar.src = 'img/agregar-usuario.png';
    } else {
        boxAvatar.src = avatar;
    }

    //Muestra tooltip para indicar al usuario que para cambiar la imagen debe dar clic sobre ella
    $('#avatar').tooltip('show');

    //Elimina tooltip
    setTimeout(function () {
        $('#avatar').tooltip('hide');
    }, 2000);
}; 


