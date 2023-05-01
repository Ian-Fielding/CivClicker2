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


// Define User Schema
const userSchema = new mongoose.Schema({
	username: String,
	salt: String,
	hash: String,
	params : {
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
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userSchema' }],
	friendsPending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userSchema' }],
});
const User = mongoose.model('User', userSchema);




/**
 * EVERYTHING FOR THE MATCHMAKING AND MULTIPLAYER
 */

// Define Searching Schema
const searchingUsers = new mongoose.Schema({
    username: String,
    searcher: { type: mongoose.Schema.Types.ObjectId, ref: 'userSchema'},
    opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'searchingUsers' },
    power: Number,
})
const Searcher = mongoose.model('Searchers', searchingUsers);


app.post('/add/searcher', async (req, res) => {
    const username = req.body.user;
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.send('User not found');
      }
      const searchingUser = new Searcher({
        username: username,
        searcher: user,
        opponent: null,
        power: req.body.battlePower
      });
      await searchingUser.save();
      // Find all the searchers except the current user
      const searchers = await Searcher.find({
        username: { $ne: username },
        opponent: null
      });
      console.log(searchers.length);
      if (searchers.length >= 1) {
        const userF = await Searcher.findOne({ username: username });
        const foundUser = searchers[0];
        foundUser.opponent = userF._id;
        userF.opponent = foundUser._id;
        await foundUser.save();
        await userF.save();
        console.log('Players matched:', foundUser.username, 'vs', userF.username);
        const opponent1 = searchers[0];
        res.redirect(`/battle.html?opponent1Power=${userF.power}&opponent2Power=${opponent1.power}&opponent1Username=${userF.username}&opponent2Username=${opponent1.username}`);
      }
    } catch (err) {
      console.error('Error Caught', err);
      res.send('Server error');
    }
});

app.get('/found/searcher/:user', async (req, res) => {
    const username = req.params.user;
    try {
      const user = await Searcher.findOne({ username: username });
      if (user.opponent) {
        const opponent = await Searcher.findById(user.opponent);
        if (opponent.opponent.equals(user._id)) {
          res.json({
            found: true,
            playerName: user.username,
            opponentName: opponent.username,
            userPower: user.power,
            opponentPower: opponent.power
          });
            // Both players have found each other
            await Searcher.deleteMany({
                _id: { $in: [user._id, opponent._id] }
            });
        }
      } else {
        res.json({
          found: false
        });
      }
    } catch (err) {
      console.error('Error Caught', err);
      res.send('Server error');
    }
});

app.get('/cancel/searcher/:user', async (req, res) =>{
    const username = req.params.user;
    try {
        const user = await User.findOne({
            username: username
        });

        if (user) {
            const result = await Searcher.findOneAndDelete({
                searcher: user._id
            });

            if (result) {
                res.send('User removed from searchers successfully');
            } else {
                res.send('User not found in searchers');
            }
        } else {
            res.send('User not found');
        }
    }
    catch (err) {
        console.error('Error Caught', err);
        res.send('Server error');
    }
})




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




/**
 * FRIEND REQUESTS AND TRADING
 */

app.post('/users/request', async (req, res) => {
	try {
	  const user = req.body.user;
	  const friendUsername = req.body.friendUsername;
  
	  // Find the user and friend in the database
	  const username = await User.findOne({ username: user });
	  const friend = await User.findOne({ username: friendUsername });
  
	  // Check if the friend exists in the database
	  if (!friend) {
		return res.status(404).json({ message: 'Friend not found' });
	  }
  
	  // Check if the user has already sent a friend request to this friend
	  if (friend.friendsPending.includes(username._id)) {
		return res.status(400).json({ message: 'Friend request already sent' });
	  }
  
	  // Add the friend request to the user's pending friend requests
	  friend.friendsPending.push(username._id);
	  await friend.save();
  
	  res.status(200).json({ message: 'Friend request sent successfully' });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Server error' });
	}
  });


app.post('/accept/friend', async (req, res) => {
	const { requestingUserId, acceptingUserId } = req.body;
	try {
	  await acceptFriendRequest(requestingUserId, acceptingUserId);
	  res.sendStatus(200);
	} catch (err) {
	  console.error(err);
	  res.sendStatus(500);
	}
});

async function acceptFriendRequest(requestingUserId, acceptingUserId) {
	try {
	  const requestingUser = await User.findById(requestingUserId);
	  const acceptingUser = await User.findById(acceptingUserId);
  
	  // Check if the accepting user is already a friend of the requesting user
	  if (requestingUser.friends.includes(acceptingUserId)) {
		throw new Error('User is already a friend');
	  }
  
	  // Add the accepting user to the requesting user's friends list
	  requestingUser.friends.push(acceptingUserId);
	  await requestingUser.save();
  
	  // Add the requesting user to the accepting user's friends list
	  acceptingUser.friends.push(requestingUserId);
	  await acceptingUser.save();
	} catch (err) {
	  console.error(err);
	  throw new Error('Failed to accept friend request');
	}
}


// Search for users by keyword, can be used to add friends
app.get('/search/pending/:username', async (req, res) => {
	const username = req.params.username;
    let user = await User.findOne({
        username: username
    });
    res.end(JSON.stringify(user.friendsPending, null, 2));
});


// Search for users by keyword, can be used to add friends
app.get('/search/users/:keyword', (req, res) => {
	const keyword = req.params.keyword;
	const regex = new RegExp(keyword, 'i');
	User.find({username: regex}).exec()
	  .then((users) => res.end(JSON.stringify(users, null, 2)))
	  .catch((err) => console.error('Error Caught', err))
  });


// STARTS THE APP

app.listen(port, function() {
    console.log(`App listening at http://localhost:${port}`);
});