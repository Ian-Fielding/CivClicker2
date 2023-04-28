/**
 * OVERALL INITIALIZATION
 */
const cookieParser = require('cookie-parser');
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const port = 80;

let sessions = {};

var crypto = require('crypto');

/**
 * SESSION MANAGEMENT
 */

// Adds a session for the user
function addSession(user) {
    let sessionId = Math.floor(Math.random() * 10000);
    let sessionStart = Date.now();
    sessions[user] = {
        'sid': sessionId,
        'start': sessionStart
    };
    return sessionId;
}

// Asks if the user has a session
function doesSession(user, sessionId) {
    let entry = sessions[user];
    if (entry != undefined) {
        return entry.sid == sessionId;
    }
    return false;
}

// Authenticates the session
function authenticate(req, res, next) {
    let co = req.cookies;
    if (co && co.login) {
        let result = doesSession(co.login.username, co.login.sid);
        if (result) {
            return next();
        }
    }
    if (req.path === '/index.html') {
        return next();
    }
    res.redirect('/index.html');
}

function redirectIndex(req, res) {
    res.redirect('/home.html');
}

app.use(express.json());
app.use(cookieParser());
app.use(/^\/$/, authenticate, redirectIndex);
app.use(express.static('public_html'));


/**
 * MONGO DB
 */

const mongodb = "mongodb+srv://username:a@finalprojectdb.r64le2h.mongodb.net/?retryWrites=true&w=majority";

// Create the connection to MongoDB and ensure connection works
mongoose.connect(mongodb)
    .then(() => console.log('MongoDB Connection Successful'))
    .catch((err) => console.error('MongoDB Error Caught', err));


// Define User schema
const userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    params: {
        wheat: Number,
        stone: Number,
        wood: Number,
        science: Number,
        workersUnemployed: Number,
        workersWheat: Number,
        workersStone: Number,
        workersWood: Number,
        workersWarriors: Number,
        granaries: Number,
        stonePiles: Number,
        lumberyards: Number,
        purchasedUpgrades: [String]
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema'
    }]
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
        const existingUser = await User.findOne({
            username: username
        });
        if (existingUser) {
            res.send('Username already exists');
        } else {
            let newSalt = Math.floor((Math.random() * 1000000));
            let toHash = password + newSalt;
            let hash = crypto.createHash('sha3-256');
            let data = hash.update(toHash, 'utf-8');
            let newHash = data.digest('hex');

            let newParams = {
                wheat: 0, // Number
                stone: 0, // Number
                wood: 0, // Number

                science: 0, // Number

                workersUnemployed: 0, //Number
                workersWheat: 0, //Number
                workersStone: 0, //Number
                workersWood: 0, //Number
                workersWarriors: 0, //Number

                granaries: 1, // Number
                stonePiles: 1, // Number
                lumberyards: 1, // Number

                purchasedUpgrades: [], // [String]
            };

            const newUser = new User({
                username: username,
                salt: newSalt,
                hash: newHash,
                params: newParams
            });
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
    const username = req.body.user;
    const password = req.body.pass;
    User.findOne({
            username: username
        })
        .then((user) => {
            if (user) {
                let existingSalt = user.salt;
                let toHash = password + existingSalt;
                let hash = crypto.createHash('sha3-256');
                let data = hash.update(toHash, 'utf-8');
                let newHash = data.digest('hex');

                if (newHash == user.hash) {
                    let sessionId = addSession(username);
                    res.cookie('login', {
                        username: username,
                        sid: sessionId,
                        maxAge: 100000
                    });
                    res.json({
                        success: true
                    });
                }
            } else {
                res.json({
                    success: false
                });
            }
        })
        .catch((err) => console.error('Error Caught', err));
});

app.get('/load/params/:username', (req, res) => {
    const username = req.params["username"];
    User.findOne({
            username: username
        })
        .then((user) => {
            res.json(user.params);
        })
        .catch((err) => {
            // Handle error
            res.json({
                result: "No saved data"
            });
        });
});


app.post('/save/params', async function(req, res) {
    const username = req.body.username;
    const params = req.body.params;

    let user = await User.findOne({
        username: username
    });
    if (user == null)
        res.status(500);

    user.params = params;
    user.save();
});

app.listen(port, function() {
    console.log(`App listening at http://localhost:${port}`);
});