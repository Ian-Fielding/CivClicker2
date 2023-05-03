// returns integer representing the player's military strength
function battlePower(){
    return Math.ceil(power.warriors * params.workersWarriors);
}

let searching = false;

/**
 * SEARCH FOR USERS TO FRIEND
 */

function findUsers(){
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Clear all search results
    let searchPlayers=document.getElementById("searchPlayers");
    fetch(`/search/users/${searchPlayers.value}`)
    .then((response) => response.json())
    .then((users) => {
        users.forEach((user) =>{
            const itemDiv = document.createElement('div');
            const name = document.createElement('h3');
            const friend = document.createElement('button');
            name.textContent = user.username;
            friend.textContent = "Send Friend Request";
            friend.onclick = function() {
                sendRequest(user.username, this);
              };
            itemDiv.appendChild(name);
            itemDiv.appendChild(friend);
            itemDiv.style.border = "2px solid black";
            itemDiv.style.textAlign = "center";
            itemDiv.style.backgroundColor = "lightcoral";
            resultsDiv.appendChild(itemDiv);
        })
        })
        .catch((err) => console.error('Error Caught', err));
};

function showRequests(){
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Clear all search results
    fetch(`/search/pending/${username}`)
    .then((response) => response.json())
    .then((users) => {
        users.forEach((user) =>{
            const itemDiv = document.createElement('div');
            const name = document.createElement('h3');
            const friend = document.createElement('button');
            getUsername(user)
            .then(username => {
                name.textContent = username;
            })
            .catch(error => {
                console.error(error);
            });
            friend.onclick = function() {
                acceptRequest(user, this);
            };
            friend.textContent = "Accept Friend Request";
            itemDiv.appendChild(name);
            itemDiv.appendChild(friend);
            itemDiv.style.border = "2px solid black";
            itemDiv.style.textAlign = "center";
            itemDiv.style.backgroundColor = "lightblue";
            resultsDiv.appendChild(itemDiv);
        })
        })
        .catch((err) => console.error('Error Caught', err));
}

function sendRequest(friendName, button){
    fetch('/users/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: username,
            friendUsername: friendName
        }),
    })
    .then(() => {
        button.remove(); // Remove the button from the DOM
    });
}

function acceptRequest(friendName, button){
    fetch('/accept/friend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: username,
            friendUsername: friendName
        }),
    })
    .then(() => {
        button.remove(); // Remove the button from the DOM
    });
}

function viewFriends(){
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Clear all search results
    fetch(`/search/friends/${username}`)
    .then((response) => response.json())
    .then((users) => {
        users.forEach((user) =>{
            const itemDiv = document.createElement('div');
            const name = document.createElement('h3');
            const trade = document.createElement('button');
            getUsername(user)
            .then(username => {
                name.textContent = username;
                trade.onclick = function() {
                    sendResources(username);
                };
            })
            trade.textContent = "Send Resources";
            itemDiv.appendChild(name);
            itemDiv.appendChild(trade);
            itemDiv.style.border = "2px solid black";
            itemDiv.style.textAlign = "center";
            itemDiv.style.backgroundColor = "lightgreen";
            resultsDiv.appendChild(itemDiv);
        })
        })
        .catch((err) => console.error('Error Caught', err));
}

async function sendResources(friend){
    params.wheat -= 100;
    params.wood -= 100;
    params.stone -= 100;
    fetch(`/gain/${friend}/100`)
    .catch((err) => console.error('Error Caught', err));
}

async function getUsername(id) {
    const response = await fetch('/retrieve/' + id);
    const users = await response.json();
    return users.username;
}

/**
 * FINDS USERS TO MATCH WITH FOR BATTLING
 */

function battleSearching(){
    if (!searching){
        const resultsDiv = document.getElementById('searchResults');
        const itemDiv = document.createElement('div');
        const name = document.createElement('h3');
        name.textContent = "Searching...";
        itemDiv.appendChild(name);
        let cancel = document.createElement("button");
        cancel.innerHTML = "Cancel Search";
        cancel.onclick = cancelSearch;
        itemDiv.appendChild(cancel);
        resultsDiv.appendChild(itemDiv);

        fetch('/add/searcher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: username,
                battlePower: battlePower(),
            }),
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        });

        searching = true;
    }
}


function cancelSearch(){
    if(searching){
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = '';
        fetch(`/cancel/searcher/${username}`)
        .then((response) => response)
        .catch((err) => console.error('Error Caught', err));

        searching = false;
    }
}

setInterval(function() {
    if(searching){
        fetch('/found/searcher/' + username)
          .then(response => response.json())
          .then(data => {
            if (data.found) {
              // Redirect to battle page
              searching = false;
              window.location.href = `/battle.html?opponent1Power=${data.opponentPower}&opponent2Power=${data.userPower}&opponent1Username=${data.playerName}&opponent2Username=${data.opponentName}`;
            }
          })
          .catch(error => console.error(error));
      }
}, 1000);


function viewTop(){
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Clear all search results
    let searchPlayers=document.getElementById("searchPlayers");
    fetch(`/users/top/`)
    .then((response) => response.json())
    .then((users) => {
        let int = 1;
        users.forEach((user) =>{
            const itemDiv = document.createElement('div');
            const position = document.createElement('h3');
            const name = document.createElement('h1');
            position.textContent = int.toString();
            name.textContent = user.username;
            itemDiv.appendChild(position);
            itemDiv.appendChild(name);
            position.style.textDecoration = "underline";
            itemDiv.style.border = "2px solid black";
            itemDiv.style.textAlign = "center";
            itemDiv.style.backgroundColor = "lightgoldenrodyellow";
            if(int < 4){
                itemDiv.style.backgroundColor = "gold";
            }
            resultsDiv.appendChild(itemDiv);
            int++;
        })
        })
        .catch((err) => console.error('Error Caught', err));
}