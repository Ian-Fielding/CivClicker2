// Create Account Section Inputs
let username = document.getElementById('CreateUsername');
let password = document.getElementById('CreatePassword');
let civName = document.getElementById("civName");
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
	const civname = civName.value.trim();

	if(user.length==0||pass.length==0||civname.length==0){
		alert("Username, password and civ name must be nonempty!");
		return;
	}
	fetch('/add/user/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user, pass, civname })
	})
	.then(response => response.text())
	.then(function(res){
		if(res=="User added successfully")
			alert(`User ${user} and civ ${civname} added successfully`);
		else
			alert(`User ${user} already exists`);
	})
	.catch((err) => console.error('Error Caught', err));
}

// Login the User
function loginUser(){
	const user = loginU.value.trim();
	const pass = loginP.value.trim();
	if(user.length==0||pass.length==0){
		alert("Username and password must be nonempty!");
		return;
	}

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

	 