/**
 * OVERALL INITIALIZATION
 */
const cookieParser = require('cookie-parser');
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const port = 5000;
app.use(express.static("public_html"));
app.use(express.json());

let sessions = {};

var crypto = require('crypto');
var hash = crypto.createHash('sha3-256');


/**
 * SESSION MANAGEMENT
 */

// Adds a session for the user
function addSession(user){
	let sessionId = Math.floor(Math.random() * 10000);
	let sessionStart = Date.now();
	sessions[user] = {'sid': sessionId, 'start': sessionStart};
	return sessionId;
}

// Asks if the user has a session
function doesSession(user, sessionId){
	let entry = sessions[user];
	if (entry!= undefined){
		return entry.sid == sessionId;
	}
	return false;
}

// Authenticates the session
function authenticate(req, res, next){
	let co = req.cookies;
	if (co && co.login){
		let result = doesSession(co.login.username, co.login.sid);
		if (result){
			return next();
		}
	}
}

function redirectIndex(req, res) {
	// Redirection Location
}

app.use(express.json());
app.use(cookieParser());
app.use('/', authenticate, redirectIndex);
app.use(express.static('public_html'));


/**
 * MONGO DB
 */


const mongodb = "input mongo link"

/*
// Create the connection to MongoDB and ensure connection works
mongoose.connect(mongodb)
	.then(() => console.log('MongoDB Connection Successful'))
	.catch((err) => console.error('MongoDB Error Caught', err));
*/

// Define User schema
const userSchema = new mongoose.Schema({
	username: String,
	salt: String,
	hash: String
});
const User = mongoose.model('User', userSchema);



/**
 * ADDING AND LOGGING IN USERS
 */

// Add a User
app.post('/add/user/', async (req, res) => {
	const username = req.body.user;
	const password = req.body.pass;
	try {
		const existingUser = await User.findOne({ username: username });
		if (existingUser) {
		res.send('Username already exists');
		} else {
		let newSalt = Math.floor((Math.random() * 1000000));
		var toHash = password + newSalt;
		var hash = crypto.createHash('sha3-256');
		let data = hash.update(toHash, 'utf-8');
		let newHash = data.digest('hex');

		const newUser = new User({username: username, salt: newSalt, hash: newHash});
		newUser.save()
		.then(() => res.send('User added successfully'))
		.catch((err) => console.error('Error Caught', err));
	}
	} catch (err) {
	console.error('Error Caught', err);
	res.send('Server error');
	}
});

// Login User
app.post('/account/login', (req, res) => {
	let username = req.body.user;
	let password = req.body.pass;
	User.findOne({ username: username, password: password })
		.then((user) => {
		if (user) {
		 let existingSalt = user[0].salt;
		 let toHash = password + existingSalt;
		 var hash = crypto.createHash('sha3-256');
		 let data = hash.update(toHash, 'utf-8');
		 let newHash = data.digest('hex');

		 if (newHash == user[0].hash){
		 let sessionId = addSession(username);
		 res.cookie('login', { username: username, sid: sessionId }, { maxAge: 100000 });
		 res.json({ success: true });
		 }
		} else {
		 res.json({ success: false });
		}
		})
		.catch((err) => console.error('Error Caught', err));
});

app.listen(port, function() {
	console.log(`App listening at http://localhost:${port}`);
});

