"use strict"
const userValue = document.getElementById('user').value
const passwordValue = document.getElementById('password').value

const sendForm = (apiLink, user, password) => {
	const requestOptions = {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json', },
	    body: JSON.stringify({ user: user, password: password }),
  	};
	fetch(apiLink, requestOptions)
  		.then(response => response.json())
  		.then(data => {
    		console.log(data)
  		})
  		.catch(error => { console.error('Error al enviar la solicitud:', error); });
}
const singup = async ()=> {
	const result = await sendForm('/api/singup', userValue, passwordValue);
	console.log(result)
	if (await result.status){
		console.log(await status);
	} else if (!result.status){
		console.log(false, await status);
	};
};