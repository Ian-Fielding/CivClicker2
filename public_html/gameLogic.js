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



// objects to be loaded from .json files
let upgrades, buildings, resources, power;

let foodpersec = 1; // number of food 1 worker consumes per second
let buildingcost = 1; // cost of building a building

// current era, number 1-6
let era;


// saved attributes
let params = {

    // name of civ
    civName: "", // String

    // basic resources
    wheat: 0, // Number
    stone: 0, // Number
    wood: 0, // Number
    science: 0, // Number

    // special resources
    leather: 0,
    hardwood: 0,
    steel: 0,

    // workers allocated
    workersUnemployed: 0, //Number
    workersWheat: 0, //Number
    workersStone: 0, //Number
    workersWood: 0, //Number
    workersWarriors: 0, //Number

    // buildings
    granaries: 1, // Number
    stonePiles: 1, // Number
    lumberyards: 1, // Number
    tents: 1,
    huts: 0,
    houses: 0, 
    armories: 0,

    // purchased upgrades
    purchasedUpgrades: [], // [String]
};


/**
 * SAVING OF PARAMETERS
 */

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





/**
 * GAME CODE BELOW
 */

// reinitializes game
function init() {

    // apply all purchased upgrades
    params.purchasedUpgrades.forEach(function(property) {
        eval(upgrades[property].effect);
    });

    // compute era
    e: for (era = 1; era <= 4; era++)
        for (let i = 1; i <= 8; i++)
            if (!params.purchasedUpgrades.includes(`upg${era}_${i}`))
                break e;
    if (era == 5)
        era = 4;
    console.log(`Currently in era ${era}`);

    // initializes DOM
    initDOM();
}


function getMaxStorage(resource){
	//if(TESTING)
	//	return Number.MAX_VALUE;

	if(resource=="science")
		return Number.MAX_VALUE;

    if(resource=="warriors")
        return 10*params.armories;

    if(resource=="workers")
        return params.tents*3+params.huts*10+params.houses*25;

	let obj=resources[resource];
	return power[obj.storage] * params[obj.storage];
}


function getSpecialResource(workers,pow){
    let estimate=workers*pow;
    let base=Math.floor(estimate);
    let float=estimate-base;

    if(Math.random()<float)
        base++;
    return base;
}


// update loop
setInterval(function() {
    if(searching){
      fetch('/found/searcher/' + username)
        .then(response => response.json())
        .then(data => {
          if (data.found) {
            // Redirect to battle page
            window.location.href = `/battle.html?opponent1Power=${data.opponentPower}&opponent2Power=${data.userPower}&opponent1Username=${data.playerName}&opponent2Username=${data.opponentName}`;
          }
        })
        .catch(error => console.error(error));
    }

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
        else
            params.workersWarriors--;

        numWorkers--;
    }

    // changes in vars
    let dwheat = -foodpersec * numWorkers + power.wheat * params.workersWheat;
    let dstone = power.stone * params.workersStone;
    let dwood = power.wood * params.workersWood;
    let dscience = power.science * params.workersUnemployed + (power.science * 0.1 * numWorkers);

    let dhard=0;
    let dsteel=0;
    let dleather=0;
    if(params.purchasedUpgrades.includes("upg3_1")){
        dsteel+=getSpecialResource(params.workersStone,power.steel);
        dhard+=getSpecialResource(params.workersWood,power.hardwood);
        dleather+=getSpecialResource(params.workersWheat,power.leather);
    }

    // recalculate params
    params.wheat = Math.max(0, params.wheat + dwheat);
    params.stone += dstone;
    params.wood += dwood;
    params.science += dscience;
    params.hardwood += dhard;
    params.steel += dsteel;
    params.leather += dleather;

    // clamps params
    for(const resource in resources){
    	let maxStorage = getMaxStorage(resource);

        if(TESTING)
            params[resource]+=10;

        if (params[resource] > maxStorage)
            params[resource] = maxStorage;

    };

    function toStr(param){
        return (param >=0 ? "+" : "") + param.toFixed(1);
    }

    document.getElementById("param-change").innerHTML = `Wheat: ${toStr(dwheat)}   Stone: ${toStr(dstone)}   Wood: ${toStr(dwood)}   Science: ${toStr(dscience)}`;
    if(params.purchasedUpgrades.includes("upg3_1")){
        document.getElementById("param-change").innerHTML += `Leather: ${toStr(dleather)}   Steel: ${toStr(dsteel)}   Hardwood: ${toStr(dhard)}`;
    }

    let DELME=document.createElement("p");
    DELME.innerHTML=`Wheat: ${params.wheat.toFixed(1)}   Stone: ${params.stone.toFixed(1)}   Wood: ${params.wood.toFixed(1)}   Science: ${params.science.toFixed(1)}   Leather: ${params.leather.toFixed(1)}   Steel: ${params.steel.toFixed(1)}   Hardwood: ${params.hardwood.toFixed(1)}`;
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
    if (era < 4 && getEraUpgrades().length == 0)
        init();
    
    updateDOM();
}



function canAffordBuilding(building){
    let obj=buildings[building];

    for (const elem in obj.cost)
        if (params[elem] < obj.cost[elem])
            return false;

    return true;
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

        initTopDOM();
        init();
        openCity("resources");
    });