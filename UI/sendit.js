alert('hey!');
let register = function(){
	let popup=document.getElementsByClassName("middle")[0];
	popup.style.opacity="0.9";
	let logpopup=document.getElementById("loginContainer");
	logpopup.style.opacity="0";

	
}

let login = function(){
	let logpopup=document.getElementById("loginContainer");
	logpopup.style.opacity="0.9";
	let popup=document.getElementsByClassName("middle")[0];
	popup.style.opacity="0";
	
}

let regButton=document.getElementById("registerButton");
console.log(regButton);
regButton.addEventListener('click',register,false);

let logButton=document.getElementById("loginButton");
console.log(logButton);
logButton.addEventListener('click',login,false);
