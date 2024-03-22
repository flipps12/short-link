"use strict"
const userValue = document.getElementById('user');
const passwordValue = document.getElementById('password');
const labelError = document.getElementById('labelError');

const sendForm = async (apiLink) => {
	const requestOptions = {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json', },
	    body: JSON.stringify({ user: userValue.value, password: passwordValue.value }),
  	};
	fetch(apiLink, requestOptions)
  		.then(response => response.json())
  		.then(data => {
    		if (data.auth){
				location.href = '/'
			} else if (data.auth == false){
				labelError.textContent = 'El usuario o la contraseña es incorrecta';
			} else if (data.status == 'registered'){
				labelError.textContent = 'Usuario registrado';
			} else if (data.status !== false){
				labelError.innerHTML = 'Sesión Iniciada';
			} else {labelError.textContent = 'Error';}
  		})
  		.catch(error => { console.error('Error al enviar la solicitud:', error); });
}