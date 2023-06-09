function getCost(cost){
    let strs=[];
    for(const val in cost)
        strs.push(val);
    strs.sort();

    let str=cost[strs[0]]+" "+strs[0];
    for(let i=1;i<strs.length;i++)
        str+=", "+cost[strs[i]]+" "+strs[i];
    return str;
}

function initTopDOM(){

    // Adds Player Search
    let searchPlayers = document.createElement("input");
    searchPlayers.setAttribute("type","text");
    searchPlayers.setAttribute("id","searchPlayers");
    searchPlayers.setAttribute("name","searchPlayers");
    document.getElementById("search").appendChild(searchPlayers);

    // Creates Search Button
    let searchButton = document.createElement("button");
    searchButton.innerHTML = "Find Friends";
    searchButton.onclick = findUsers;
    document.getElementById("search").appendChild(searchButton);

    // Creates Pending Requests Button
    let seeRequests = document.createElement("button");
    seeRequests.innerHTML = "View Pending Friends";
    seeRequests.onclick = showRequests;
    document.getElementById("search").appendChild(seeRequests);

    // Creates Pending Requests Button
    let friendsList = document.createElement("button");
    friendsList.innerHTML = "View Friends";
    friendsList.onclick = viewFriends;
    document.getElementById("search").appendChild(friendsList);

    // Creates Leaderboard
    let leaderboard = document.createElement("button");
    leaderboard.innerHTML = "View Top Players";
    leaderboard.onclick = viewTop;
    document.getElementById("search").appendChild(leaderboard);

    // Creates Battle Button
    let battleSearch = document.createElement("button");
    battleSearch.innerHTML = "Search For Battle";
    battleSearch.onclick = battleSearching;
    document.getElementById("search").appendChild(battleSearch);

    // Creates SearchResults Div (needs to stay below the above elements)
    let searchResults = document.createElement("div");
    searchResults.id = "searchResults";
    document.getElementById("search").appendChild(searchResults);


    // save button & welcome text
    let save = document.createElement("a");
    save.onclick = saveParams;
    save.innerHTML = "Save";
    let saveText = document.createElement("h2");
    saveText.innerHTML = `The Great ${params.civName} of ${username}`;
    document.getElementById("gameTitle").appendChild(saveText);
    document.getElementById("dropdownContent").appendChild(save);
    logout = document.createElement("a");
    logout.onclick = function(){
        document.cookie="";
        window.location.href = "/index.html";
    }
    logout.innerHTML = "Logout";
    document.getElementById("dropdownContent").appendChild(logout);
    

    document.getElementById("save").appendChild(document.createElement("hr"));
}


function initDOM() {

    // basic DOM nodes for future use
    let resourcesDOM = document.getElementById("resources");
    let buildingsDOM = document.getElementById("buildings");
    resourcesDOM.innerHTML="";
    buildingsDOM.innerHTML="";
    document.getElementById("row-buy-worker").innerHTML="";
    document.getElementById("row-wheat").innerHTML="";
    document.getElementById("row-stone").innerHTML="";
    document.getElementById("row-wood").innerHTML="";
    document.getElementById("row-warrior").innerHTML="";



    // initializes resources
    for (const resource in resources) {
        let obj = resources[resource];
        if(obj.isButton=="false")
            continue;


        // sets up button
        let but = document.createElement("button");
        resourcesDOM.appendChild(but);
        but.setAttribute("id", `${resource}-button`);
        but.setAttribute("class", `gameButton`);

        // on click, add resource to params
        but.onclick = function() {

            if (TESTING)
                params[resource] += 100;
            else
                params[resource]++;

            let maxStorage = getMaxStorage(resource);

            if (params[resource] > maxStorage)
                params[resource] = maxStorage;

            let special=obj.specialResource;
            if(special!="")
                params[special]+=getSpecialResource(1,power[special]);

            update();
        }
    }

    // initializes buildings
    for (const building in buildings) {
        let obj = buildings[building];

        if(obj.unlockAfter!="" && !params.purchasedUpgrades.includes(obj.unlockAfter))
            continue;

        // sets up button
        let but = document.createElement("button");
        buildingsDOM.appendChild(but);
        but.setAttribute("id", `${building}-button`);
        but.setAttribute("class", `gameButton`);

        // on click, add building to param
        but.onclick = function() {
            let canAfford = canAffordBuilding(building);

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
    but1.setAttribute("class", `gameButton`);
    but1.onclick = function() {
        if (params.wheat >= 20) {
            params.wheat -= 20;
            params.workersUnemployed++;
            update();
        }
    }

    let but2 = document.createElement("button");
    but2.setAttribute("id", "wheat-worker");
    but2.setAttribute("class", `gameButton`);
    but2.onclick = function() {
        if (params.workersUnemployed >= 1) {
            params.workersUnemployed--;
            params.workersWheat++;
            update();
        }
    }

    let but3 = document.createElement("button");
    but3.setAttribute("id", "stone-worker");
    but3.setAttribute("class", `gameButton`);
    but3.onclick = function() {
        if (params.workersUnemployed >= 1) {
            params.workersUnemployed--;
            params.workersStone++;
            update();
        }
    }

    let but4 = document.createElement("button");
    but4.setAttribute("id", "wood-worker");
    but4.setAttribute("class", `gameButton`);
    but4.onclick = function() {
        if (params.workersUnemployed >= 1) {
            params.workersUnemployed--;
            params.workersWood++;
            update();
        }
    }


    let but5 = document.createElement("button");
    but5.setAttribute("id", "warrior-worker");
    but5.setAttribute("class", `gameButton`);
    but5.onclick = function() {
        if (params.workersUnemployed >= 1 && params.workersWarriors < getMaxStorage("warriors")) {
            params.workersUnemployed--;
            params.workersWarriors++;
            update();
        }
    }


    document.getElementById("row-buy-worker").appendChild(but1);
    document.getElementById("row-wheat").appendChild(but2);
    document.getElementById("row-stone").appendChild(but3);
    document.getElementById("row-wood").appendChild(but4);
    if(params.purchasedUpgrades.includes("upg2_1"))
        document.getElementById("row-warrior").appendChild(but5);


    but6 = document.createElement("button");
    but6.innerHTML="Remove Farmer";
    but6.setAttribute("id", "sell-wheat-worker");
    but6.setAttribute("class", `gameButton`);
    but6.onclick = function() {
        if (params.workersWheat >= 1) {
            params.workersUnemployed++;
            params.workersWheat--;
            update();
        }
    }

    but7 = document.createElement("button");
    but7.innerHTML="Remove Miner";
    but7.setAttribute("id", "sell-stone-worker");
    but7.setAttribute("class", `gameButton`);
    but7.onclick = function() {
        if (params.workersStone >= 1) {
            params.workersUnemployed++;
            params.workersStone--;
            update();
        }
    }

    but8 = document.createElement("button");
    but8.innerHTML="Remove Lumberjack";
    but8.setAttribute("id", "sell-wood-worker");
    but8.setAttribute("class", `gameButton`);
    but8.onclick = function() {
        if (params.workersWood >= 1) {
            params.workersUnemployed++;
            params.workersWood--;
            update();
        }
    }

    but9 = document.createElement("button");
    but9.innerHTML="Remove Warrior";
    but9.setAttribute("id", "sell-warrior-worker");
    but9.setAttribute("class", `gameButton`);
    but9.onclick = function() {
        if (params.workersWarriors >= 1) {
            params.workersUnemployed++;
            params.workersWarriors--;
            update();
        }
    }



    document.getElementById("row-wheat").appendChild(but6);
    document.getElementById("row-stone").appendChild(but7);
    document.getElementById("row-wood").appendChild(but8);
    if(params.purchasedUpgrades.includes("upg2_1"))
        document.getElementById("row-warrior").appendChild(but9);

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
            but.setAttribute("class", `gameButton`);
            let desc = document.createElement("p");
            let cost = document.createElement("p");
            let bot = document.createElement("hr");

            desc.innerHTML = upg.desc;
            cost.innerHTML = `Cost: ${getCost(upg.cost)}`;

            document.getElementById("upgrade-list").appendChild(row);
            row.appendChild(top);
            row.appendChild(but);
            row.appendChild(desc);
            row.appendChild(cost);
            row.appendChild(bot);

            row.setAttribute("id", `${name}-button`);
            row.setAttribute("class", `upgradeButton`);
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

                    if(upg.effect="")
                        init();
                } else {
                    // clicked a button but can't afford
                    console.log(`Can't afford! Cost is ${JSON.stringify(upg.cost)}`);
                }
            };


        }
    }

    update();
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
    document.getElementById("tents-button").innerHTML = `Tents: ${Math.round(params.tents)}`;
    if(document.getElementById("huts-button")!=undefined)
        document.getElementById("huts-button").innerHTML = `Huts: ${Math.round(params.huts)}`;
    if(document.getElementById("houses-button")!=undefined)
        document.getElementById("houses-button").innerHTML = `Houses: ${Math.round(params.houses)}`;
    if(document.getElementById("armories-button")!=undefined)
        document.getElementById("armories-button").innerHTML = `Armories: ${Math.round(params.armories)}`;
    for(const building in buildings){
        if(document.getElementById(`${building}-button`)!=undefined)
            document.getElementById(`${building}-button`).disabled=!canAffordBuilding(building);
    }





    document.getElementById("buy-worker").innerHTML = `Buy Worker: ${Math.round(params.workersUnemployed)}`;
    document.getElementById("wheat-worker").innerHTML = `Farmers: ${Math.round(params.workersWheat)}`;
    document.getElementById("stone-worker").innerHTML = `Miners: ${Math.round(params.workersStone)}`;
    document.getElementById("wood-worker").innerHTML = `Lumberjacks: ${Math.round(params.workersWood)}`;
    if(document.getElementById("warrior-worker")!=undefined)
        document.getElementById("warrior-worker").innerHTML = `Warriors: ${Math.round(params.workersWarriors)}`;

    let numWorkers = params.workersUnemployed + params.workersWood + params.workersStone + params.workersWheat + params.workersWarriors;
    document.getElementById("buy-worker").disabled=numWorkers >= getMaxStorage("workers");

    // remove purchased upgrades (new upgrades are added in init)
    for (const name in upgrades) 
        if (params.purchasedUpgrades.includes(name) && document.getElementById(`${name}-button`) != undefined)
            document.getElementById("upgrade-list").removeChild(document.getElementById(`${name}-button`));
        
    

}

function clearScreen(){
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className.active=false;
    }
}

function openElement(elementName) {
    clearScreen();

    let elem =document.getElementById(elementName);
    elem.style.display = "block";
    elem.active=true;
}