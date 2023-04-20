// Create Account Section Inputs
let username = document.getElementById('CreateUsername');
let password = document.getElementById('CreatePassword');
let addUserButton = document.getElementById('addUser');

// Login Section Inputs
let loginU = document.getElementById('Username');
let loginP = document.getElementById('Password');
let loginButton = document.getElementById('login');

addUserButton.addEventListener('click', createUser);
loginButton.addEventListener('click', loginUser);

// Function to send message
function createUser() {
	const user = username.value.trim();
	const pass = password.value.trim();
	fetch('/add/user/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user, pass })
	})
	.catch((err) => console.error('Error Caught', err));
}

// Login the User
function loginUser(){
	const user = loginU.value.trim();
	const pass = loginP.value.trim();
	fetch('/account/login', {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ user, pass })
	})
	.then(function(response){
		if(response.ok) {
			response.json().then(function(data){
				if (data.success) {
					window.location.href = "/home.html";
				} else {
					alert("Incorrect Login Information");
				}
			});
		} else {
			alert("Error");
		}
	});
}
	 