const TESTING = true; //set to false in release!!
let searching = false;

// Checks for a cookie, and if it exists, retrieves the username
if (document.cookie == "") {
    window.location.href = "/index.html";
}
const cookie = document.cookie;
const jsonValue = JSON.parse(decodeURIComponent(cookie).split('login=')[1].replace(/^j:/, ''));
const username = jsonValue.username;

console.log(`Logged in as ${username}`);


// Adds Player Search
let searchPlayers = document.createElement("textarea");
document.getElementById("search").appendChild(searchPlayers);

// objects to be loaded from .json files
let upgrades, buildings, resources, power;

let foodpersec = 1; // number of food 1 worker consumes per second
let buildingcost = 1; // cost of building a building

// current era, number 1-6
let era;


// saved attributes
let params = {
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

// returns integer representing the player's military strength
function battlePower(){
    return Math.ceil(power.warriors * params.workersWarriors);
}


// Saves the Params

async function saveParams() {
    fetch('/save/params', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            params: params
        }),
    });
}

function findUsers(){

    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Clear all search results
    fetch(`/search/users/${searchPlayers.value}`)
    .then((response) => response.json())
    .then((users) => {
        users.forEach((user) =>{
            const itemDiv = document.createElement('div');
            const name = document.createElement('h3');
            name.textContent = user.username;
            itemDiv.appendChild(name);
            resultsDiv.appendChild(itemDiv);
        })
        })
        .catch((err) => console.error('Error Caught', err));
};

function battleSearching(){
    if (!searching){
        const resultsDiv = document.getElementById('battleSearch');
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
        });

        searching = true;
    }
}

function cancelSearch(){
    if(searching){
        const resultsDiv = document.getElementById('battleSearch');
        resultsDiv.innerHTML = '';
        fetch(`/cancel/searcher/${username}`)
        .then((response) => response)
        .catch((err) => console.error('Error Caught', err));

        searching = false;
    }
}

// STILL IN PROGRESS, NEED TO SET ON AN INTERVAL TO CHECK
function checkForBattle(){
    if (searching){
        fetch(`/found/searcher/${username}`)
    }
}


// reinitializes game
function init() {
    // apply all purchased upgrades
    params.purchasedUpgrades.forEach(function(property) {
        eval(upgrades[property].effect);
    });

    // compute era
    e: for (era = 1; era <= 6; era++)
        for (let i = 1; i <= 8; i++)
            if (!params.purchasedUpgrades.includes(`upg${era}_${i}`))
                break e;
    if (era == 7)
        era = 6;
    console.log(`Currently in era ${era}`);

    // initializes DOM
    initDOM();
}


function getMaxStorage(resource){
	if(TESTING)
		return Number.MAX_VALUE;

	if(resource=="science")
		return Number.MAX_VALUE;
	let obj=resources[resource];
	return power[obj.storage] * params[obj.storage];
}


// TODO Come up with better styling here
function initDOM() {
    // Creates Search Button
    let searchButton = document.createElement("button");
    searchButton.innerHTML = "Find Friends";
    searchButton.onclick = findUsers;
    document.getElementById("search").appendChild(searchButton);

    // Creates Battle Button
    let battleSearch = document.createElement("button");
    battleSearch.innerHTML = "Search For Battle";
    battleSearch.onclick = battleSearching;
    document.getElementById("search").appendChild(battleSearch);


    // save button & welcome text
    let save = document.createElement("button");
    save.onclick = saveParams;
    save.innerHTML = "Save";
    let saveText = document.createElement("p");
    saveText.innerHTML = `Hello, ${username}!`
    document.getElementById("save").appendChild(saveText);
    document.getElementById("save").appendChild(save);
    logout = document.createElement("button");
    logout.onclick = function(){
    	document.cookie="";
	    window.location.href = "/index.html";
    }
    logout.innerHTML = "Logout";
    document.getElementById("save").appendChild(logout);
    

    document.getElementById("save").appendChild(document.createElement("hr"));

    // basic DOM nodes for future use
    let resourcesDOM = document.getElementById("resources");
    let buildingsDOM = document.getElementById("buildings");
    let workersDOM = document.getElementById("worker-list");
    let deallocWorkersDOM = document.getElementById("dealloc-workers");
    resourcesDOM.innerHTML="";
    buildingsDOM.innerHTML="";
    workersDOM.innerHTML="";
    deallocWorkersDOM.innerHTML="";

    // initializes resources
    for (const resource in resources) {
        let obj = resources[resource];
        if(obj.isButton=="false")
        	continue;


        // sets up button
        let but = document.createElement("button");
        resourcesDOM.appendChild(but);
        but.setAttribute("id", `${resource}-button`);

        // on click, add resource to params
        but.onclick = function() {
            if (TESTING)
                params[resource] += 100;
            else
                params[resource]++;

            let maxStorage = getMaxStorage(resource);

            if (params[resource] > maxStorage)
                params[resource] = maxStorage;

            update();
        }
    }

    // initializes buildings
    for (const building in buildings) {
        let obj = buildings[building];

        // sets up button
        let but = document.createElement("button");
        buildingsDOM.appendChild(but);
        but.setAttribute("id", `${building}-button`);

        // on click, add building to param
        but.onclick = function() {
            let canAfford = true;
            for (const elem in obj.cost)
                if (params[elem] < obj.cost[elem])
                    canAfford = false;

            if (!canAfford) {
                console.log(`Can't afford! ${JSON.stringify(obj.cost)}`);
                return;
            }

            for (const elem in obj.cost)
                params[elem] -= obj.cost[elem];

            params[building]++;
            update();
        }
    }


    // TODO this sucks! Come up with better styling
    let but1 = document.createElement("button");
    but1.setAttribute("id", "buy-worker");
    but1.onclick = function() {
        if (params.wheat >= 20) {
            params.wheat -= 20;
            params.workersUnemployed++;
            update();
        }
    }

    let but2 = document.createElement("button");
    but2.setAttribute("id", "wheat-worker");
    but2.onclick = function() {
        if (params.workersUnemployed >= 1) {
            params.workersUnemployed--;
            params.workersWheat++;
            update();
        }
    }

    let but3 = document.createElement("button");
    but3.setAttribute("id", "stone-worker");
    but3.onclick = function() {
        if (params.workersUnemployed >= 1) {
            params.workersUnemployed--;
            params.workersStone++;
            update();
        }
    }

    let but4 = document.createElement("button");
    but4.setAttribute("id", "wood-worker");
    but4.onclick = function() {
        if (params.workersUnemployed >= 1) {
            params.workersUnemployed--;
            params.workersWood++;
            update();
        }
    }


    workersDOM.appendChild(but1);
    workersDOM.appendChild(but2);
    workersDOM.appendChild(but3);
    workersDOM.appendChild(but4);


    but2 = document.createElement("button");
    but2.innerHTML="Sell Farmer";
    but2.setAttribute("id", "sell-wheat-worker");
    but2.onclick = function() {
        if (params.workersWheat >= 1) {
            params.workersUnemployed++;
            params.workersWheat--;
            update();
        }
    }

    but3 = document.createElement("button");
    but3.innerHTML="Sell Miner";
    but3.setAttribute("id", "sell-stone-worker");
    but3.onclick = function() {
        if (params.workersStone >= 1) {
            params.workersUnemployed++;
            params.workersStone--;
            update();
        }
    }

    but4 = document.createElement("button");
    but4.innerHTML="Sell Lumberjack";
    but4.setAttribute("id", "sell-wood-worker");
    but4.onclick = function() {
        if (params.workersWood >= 1) {
            params.workersUnemployed++;
            params.workersWood--;
            update();
        }
    }


    deallocWorkersDOM.appendChild(but2);
    deallocWorkersDOM.appendChild(but3);
    deallocWorkersDOM.appendChild(but4);

    // appends upgrades
    for (let i = 1; i <= 8; i++) {
        let name = `upg${era}_${i}`;

        // appends non-purchased available upgrades
        if (!params.purchasedUpgrades.includes(name)) {

            let upg = upgrades[name];
            if (upg.name == "")
                continue;

            // TODO this sucks! Come up with better styling
            let top = document.createElement("hr");
            let row = document.createElement("div");
            let but = document.createElement("button");
            let desc = document.createElement("p");
            let cost = document.createElement("p");
            let bot = document.createElement("hr");

            desc.innerHTML = upg.desc;
            cost.innerHTML = `Cost: ${JSON.stringify(upg.cost)}`;

            document.getElementById("upgrade-list").appendChild(row);
            row.appendChild(top);
            row.appendChild(but);
            row.appendChild(desc);
            row.appendChild(cost);
            row.appendChild(bot);

            row.setAttribute("id", `${name}-button`);
            but.innerHTML = upg.name;

            // handles purchasing of upgrades
            but.onclick = function() {
                let canAfford = true;
                for (const property in upg.cost)
                    if (upg.cost[property] > params[property])
                        canAfford = false;
                if (canAfford) {
                    for (const property in upg.cost)
                        params[property] -= upg.cost[property];

                    eval(upg.effect);
                    params.purchasedUpgrades.push(name);

                    console.log(`Purchased ${name}`);

                    update();
                } else {
                    // clicked a button but can't afford
                    console.log(`Can't afford! Cost is ${JSON.stringify(upg.cost)}`);
                }
            };


        }
    }

    update();
}

// update loop
setInterval(function() {
    let numWorkers = params.workersUnemployed + params.workersWood + params.workersStone + params.workersWheat + params.workersWarriors;

    // starvation
    if (numWorkers > 0 && params.wheat == 0) {
        if (params.workersUnemployed > 0)
            params.workersUnemployed--;
        else if (params.workersWood > 0)
            params.workersWood--;
        else if (params.workersStone > 0)
            params.workersStone--;
        else if (params.workersWheat > 0)
            params.workersWheat--;
        else // if(params.workersWarriors>0)
            params.workersWarriors--;

        numWorkers--;
    }

    // changes in vars
    let dwheat = -foodpersec * numWorkers + power.wheat * params.workersWheat;
    let dstone = power.stone * params.workersStone;
    let dwood = power.wood * params.workersWood;
    let dscience = power.science * params.workersUnemployed + (power.science * 0.1 * numWorkers);

    // recalculate params
    params.wheat = Math.max(0, params.wheat + dwheat);
    params.stone += dstone;
    params.wood += dwood;
    params.science += dscience;

    // clamps params
    for(const resource in resources){
    	let maxStorage = getMaxStorage(resource);
        if (params[resource] > maxStorage)
            params[resource] = maxStorage;

        if(TESTING)
        	params[resource]+=10;
    };


    // update screen text
    let wheatStr = (dwheat >= 0 ? "+" : "") + dwheat.toFixed(1);
    let stoneStr = (dstone >= 0 ? "+" : "") + dstone.toFixed(1);
    let woodStr = (dwood >= 0 ? "+" : "") + dwood.toFixed(1);
    let scienceStr = (dscience >= 0 ? "+" : "") + dscience.toFixed(1);
    document.getElementById("param-change").innerHTML = `Wheat: ${wheatStr}   Stone: ${stoneStr}   Wood: ${woodStr}   Science: ${scienceStr}`;

    let DELME=document.createElement("p");
    DELME.innerHTML=`Science: ${params.science.toFixed(1)}`;
    document.getElementById("param-change").appendChild(DELME);

    update();

}, 1000);

// autosaves
setInterval(function() {
    saveParams();
    console.log("Autosaved progress!");
}, 10000);

// returns available upgrades for this era
function getEraUpgrades() {
    let arr = [];
    for (let i = 1; i <= 8; i++)
        if (!params.purchasedUpgrades.includes(`upg${era}_${i}`))
            arr.push(`upg${era}_${i}`);
    return arr;
}

// updates all vars and updates
function update() {
    // if all upgrades purchased, advance era
    if (era < 6 && getEraUpgrades().length == 0)
        init();
    
    updateDOM();
}

// updates DOM
function updateDOM() {
    // maps DOM ids to parameter values
    document.getElementById("wheat-button").innerHTML = `Wheat: ${Math.round(params.wheat)}`;
    document.getElementById("stone-button").innerHTML = `Stone: ${Math.round(params.stone)}`;
    document.getElementById("wood-button").innerHTML = `Wood: ${Math.round(params.wood)}`;

    document.getElementById("granaries-button").innerHTML = `Granaries: ${Math.round(params.granaries)}`;
    document.getElementById("stonePiles-button").innerHTML = `Stone Piles: ${Math.round(params.stonePiles)}`;
    document.getElementById("lumberyards-button").innerHTML = `Lumberyards: ${Math.round(params.lumberyards)}`;

    document.getElementById("buy-worker").innerHTML = `Buy Worker: ${Math.round(params.workersUnemployed)}`;
    document.getElementById("wheat-worker").innerHTML = `Farmers: ${Math.round(params.workersWheat)}`;
    document.getElementById("stone-worker").innerHTML = `Miners: ${Math.round(params.workersStone)}`;
    document.getElementById("wood-worker").innerHTML = `Lumberjacks: ${Math.round(params.workersWood)}`;


    // remove purchased upgrades (new upgrades are added in init)
    for (const name in upgrades) 
        if (params.purchasedUpgrades.includes(name) && document.getElementById(`${name}-button`) != undefined)
            document.getElementById("upgrade-list").removeChild(document.getElementById(`${name}-button`));
        
    

}



// initializes all JSON objects
let upgPromise = fetch("http://localhost:80/upgrades.json")
    .then(res => res.json());
let buiPromise = fetch("http://localhost:80/buildings.json")
    .then(res => res.json());
let resPromise = fetch("http://localhost:80/resources.json")
    .then(res => res.json());
let powPromise = fetch("http://localhost:80/power.json")
    .then(res => res.json());
let parPromise = fetch(`http://localhost:80/load/params/${username}`)
    .then(res => res.json());

Promise.all([upgPromise, buiPromise, resPromise, powPromise, parPromise])
    .then(function(objs) {
        upgrades = objs[0];
        buildings = objs[1];
        resources = objs[2];
        power = objs[3];
        if (objs[4].result != "No saved data")
            params = objs[4];

        init();
    });