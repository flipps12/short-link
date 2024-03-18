"use strict"
const sendForm = (apiLink, ) => {
	const requestOptions = {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json', },
	    body: JSON.stringify({id: id}),
  	};
	fetch(apiLink, requestOptions)
  		.then(response => response.json())
  		.then(data => {
    		console.log(data.status)
    		if (data.status && data.status !== 'registered') {
      			location.reload()
    		} else if (data.status = 'registered'){
      			labelError.textContent = "Url en uso"
      			return
    		} else if (data.status = 'error'){
      			labelError.textContent = "Internal server Error"
		    }
  		})
  		.catch(error => { console.error('Error al enviar la solicitud:', error); });
}
sendForm('/api/login', 'caca4', 'caca')