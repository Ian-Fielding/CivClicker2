const TESTING=true; //set to false in release!!

/*
// Checks for a cookie, and if it exists, retrieves the username
if(document.cookie == ""){
	window.location.href = "/index.html";
}
const cookie = document.cookie;
const jsonValue = JSON.parse(decodeURIComponent(cookie).split('login=')[1].replace(/^j:/, ''));
const username = jsonValue.username;*/


let upgrades={
	"upg1_1": {
		"name": "The Wheel",
		"desc": "Workers require half as much wheat",
		"effect": "foodpersec/=2;",
		"cost": {
			"stone": "300",
			"wood": "200",
		},
	},
	"upg1_2": {
		"name": "Writing",
		"desc": "Workers produce twice as much science",
		"effect": "power.science*=2;",
		"cost": {
			"wood": "300",
			"wheat": "100",
			"science": "20",
		},
	},
	"upg1_3": {
		"name": "Mining",
		"desc": "Workers proudce twice as much stone",
		"effect": "power.stone*=2;",
		"cost": {
			"stone": "300",
			"wheat": "100",
			"science": "10",
		},
	},
	"upg1_4": {
		"name": "Agriculture",
		"desc": "Workers produce twice as much wheat",
		"effect": "power.wheat*=2;",
		"cost": {
			"wheat": "450",
			"science": "10",
			"wood": "100",
			"stone": "100",
		},
	},
	"upg1_5": {
		"name": "Woodworking",
		"desc": "Workers produce twice as much wood",
		"effect": "power.wood*=2;",
		"cost": {
			"wood": "300",
			"wheat": "100",
			"science": "10",
		},
	},
	"upg1_6": {
		"name": "Brickmaking",
		"desc": "Allows construction of stone huts",
		"effect": "",
		"cost": {
			"science": "25",
			"stone": "300",
			"wood": "50",
		},
	},
	"upg1_7": {
		"name": "Better storage",
		"desc": "All basic resource storage becomes 25% larger",
		"effect": "power.granaries*=1.25;power.stonePiles*=1.25;power.lumberyards*=1.25;",
		"cost": {
			"science": "30",
			"wood": "300",
			"stone": "300",
			"wheat": "300",
		},
	},
	"upg1_8": {
		"name": "Masonry",
		"desc": "All buildings become 20% cheaper to construct",
		"effect": "buildingcost*=0.8;",
		"cost": {
			"science": "20",
			"stone": "600",
		},
	},
	"upg2_1": {
		"name": "Construction",
		"desc": "Allows construction of armories",
		"effect": "",
		"cost": {
			"science": "40",
			"wood": "600",
			"stone": "600",
		},
	},
	"upg2_2": {
		"name": "Bronze Tools",
		"desc": "All workers become 10% more effective",
		"effect": "power.science*=1.1;power.wheat*=1.1;power.stone*=1.1;power.wood*=1.1;power.warriors*=1.1;",
		"cost": {
			"science": "50",
			"stone": "750",
			"wood": "500",
			"wheat": "550",
		},
	},
	"upg2_3": {
		"name": "Scythes",
		"desc": "Workers harvest wheat 50% more efficiently",
		"effect": "power.wheat*=1.5;",
		"cost": {
			"science": "60",
			"stone": "750",
			"wheat": "1000",
			"wood": "750",
		},
	},
	"upg2_4": {
		"name": "Pickaxes",
		"desc": "Workers mine stone 50% more efficiently",
		"effect": "power.stone*=1.5;",
		"cost": {
			"science": "60",
			"stone": "1000",
			"wheat": "750",
			"wood": "750",
		},
	},
	"upg2_5": {
		"name": "Axes",
		"desc": "Workers cut wood 50% more efficiently",
		"effect": "woodpwer*=1.5;",
		"cost": {
			"science": "60",
			"stone": "750",
			"wheat": "750",
			"wood": "1000",
		},
	},
	"upg2_6": {
		"name": "Bronze Swords",
		"desc": "Warriors are 100% more effective",
		"effect": "power.warriors*=2;",
		"cost": {
			"science": "80",
			"stone": "1000",
			"wheat": "1000",
		},
	},
	"upg2_7": {
		"name": "Walls",
		"desc": "Allows the construction of walls",
		"effect": "",
		"cost": {
			"science": "80",
			"stone": "1000",
			"wood": "1000",
		},
	},
	"upg2_8": {
		"name": "Tactics",
		"desc": "Allows workers to become archers and spearmen",
		"effect": "",
		"cost": {
			"science": "100",
			"wheat": "1000",
			"wood": "1000",
		},
	},
	"upg3_1": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg3_2": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg3_3": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg3_4": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg3_5": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg3_6": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg3_7": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg3_8": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg4_1": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg4_2": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg4_3": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg4_4": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg4_5": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg4_6": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg4_7": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg4_8": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg5_1": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg5_2": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg5_3": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg5_4": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg5_5": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg5_6": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg5_7": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg5_8": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg6_1": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg6_2": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg6_3": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg6_4": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg6_5": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg6_6": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg6_7": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	},
	"upg6_8": {
		"name": "",
		"desc": "",
		"effect": "",
		"cost": {
			"": "",
			"": "",
		},
	}
};


let buildings={
	"granaries": {
		"name": "Granary",
		"cost": {
			"wheat": "100",
			"stone": "20",
			"wood": "100",
		}
	},
	"lumberyards": {
		"name": "Lumberyard",
		"cost": {
			"wheat": "50",
			"stone": "50",
			"wood": "200",
		}
	},
	"stonePiles": {
		"name": "Stone Pile",
		"cost": {
			"wheat": "50",
			"stone": "200",
			"wood": "50",
		}
	},
}

let resources={
	"wheat": {
		"name": "Wheat",
		"unlockAfter": "",
		"storage": "granaries"
	},
	"wood": {
		"name": "Wood",
		"unlockAfter": "",
		"storage": "lumberyards"
	},
	"stone": {
		"name": "Stone",
		"unlockAfter": "",
		"storage": "stonePiles"
	}
}


let foodpersec=1; // number of food 1 worker consumes per second

let power={
	"science": 0.1,
	"wheat": 1.2,
	"stone": 1,
	"wood": 1,
	"warriors": 1,
	"granaries": 200,
	"stonePiles": 200,
	"lumberyards": 200,
}


let buildingcost=1; // cost of building a building

let era;


let params={
	wheat: 1000, // Number
	stone: 1000, // Number
	wood: 1000, // Number

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

function loadParams(){
	// TODO Load user parameters from the database
	// params = ...
}

function init(){
	initDOM();
	loadParams();



	// apply all purchased upgrades
	params.purchasedUpgrades.forEach(function(property){
		eval(upgrades[property].effect);
	});

	// compute era
	e:for(era=1;era<=6;era++)
		for(let i=1;i<=10;i++)
			if(!params.purchasedUpgrades.includes(`upg${era}_${i}`))
				break e;
	if(era==7)
		era=6;


	for(let i=1;i<=8;i++){
		let name=`upg${era}_${i}`;

		if(!params.purchasedUpgrades.includes(name)){

			let upg=upgrades[name];

			console.log(name)
			if(upg.name=="")
				continue;

			let top=document.createElement("hr");
			let row=document.createElement("div");
			let but=document.createElement("button");
			let desc=document.createElement("p");
			let cost=document.createElement("p");
			let bot=document.createElement("hr");

			desc.innerHTML=upg.desc;
			cost.innerHTML=`Cost: ${JSON.stringify(upg.cost)}`;

			document.getElementById("upgrade-list").appendChild(row);
			row.appendChild(top);
			row.appendChild(but);
			row.appendChild(desc);
			row.appendChild(cost);
			row.appendChild(bot);

			row.setAttribute("id",`${name}-button`);
			but.innerHTML=upg.name;
			but.onclick=function(){
				let canAfford=true;
				for(const property in upg.cost)
					if(upg.cost[property]>params[property])
						canAfford=false;
				if(canAfford){
					for(const property in upg.cost)
						params[property]-=upg.cost[property];

					eval(upg.effect);
					params.purchasedUpgrades.push(name);

					console.log(`Purchased ${name}`);

					updateDOM();
				}else{
					// clicked a button but can't afford
					console.log(`Can't afford! Cost is ${JSON.stringify(upg.cost)}`);
				}
			};


		}
	}
}



// TODO Come up with better styling here
function initDOM(){
	let resourcesDOM=document.getElementById("resources");
	let buildingsDOM=document.getElementById("buildings");
	let workersDOM=document.getElementById("worker-list");



	for(const resource in resources){
		let obj=resources[resource];
		let but=document.createElement("button");
		resourcesDOM.appendChild(but);

		but.setAttribute("id",`${resource}-button`);
		but.onclick=function(){
			if(TESTING)
				params[resource]+=20;
			else
				params[resource]++;

			let maxStorage=power[obj.storage]*params[obj.storage];

			if(params[resource]>maxStorage)
				params[resource]=maxStorage;

			updateDOM();
		}
	}


	for(const building in buildings){
		let obj=buildings[building];
		let but=document.createElement("button");
		buildingsDOM.appendChild(but);

		but.setAttribute("id",`${building}-button`);
		but.onclick=function(){
			let canAfford=true;
			for(const elem in obj.cost)
				if(params[elem] < obj.cost[elem])
					canAfford=false;

			if(!canAfford){
				console.log(`Can't afford! ${JSON.stringify(obj.cost)}`);
				return;
			}

			for(const elem in obj.cost)
				params[elem] -= obj.cost[elem];

			params[building]++;
			updateDOM();
		}
	}



	let but1=document.createElement("button");
	but1.setAttribute("id","buy-worker");
	but1.onclick=function(){
		if(params.wheat>=20){
			params.wheat-=20;
			params.workersUnemployed++;
			updateDOM();
		}
	}

	let but2=document.createElement("button");
	but2.setAttribute("id","wheat-worker");
	but2.onclick=function(){
		if(params.workersUnemployed>=1){
			params.workersUnemployed--;
			params.workersWheat++;
			updateDOM();
		}
	}

	let but3=document.createElement("button");
	but3.setAttribute("id","stone-worker");
	but3.onclick=function(){
		if(params.workersUnemployed>=1){
			params.workersUnemployed--;
			params.workersStone++;
			updateDOM();
		}
	}

	let but4=document.createElement("button");
	but4.setAttribute("id","wood-worker");
	but4.onclick=function(){
		if(params.workersUnemployed>=1){
			params.workersUnemployed--;
			params.workersWood++;
			updateDOM();
		}
	}


	workersDOM.appendChild(but1);
	workersDOM.appendChild(but2);
	workersDOM.appendChild(but3);
	workersDOM.appendChild(but4);

	updateDOM();
}

setInterval(function(){
	let numWorkers=params.workersUnemployed+params.workersWood+params.workersStone+params.workersWheat+params.workersWarriors;

	// starvation
	if(numWorkers>0 && params.wheat==0){
		if(params.workersUnemployed>0)
			params.workersUnemployed--;
		else if(params.workersWood>0)
			params.workersWood--;
		else if(params.workersStone>0)
			params.workersStone--;
		else if(params.workersWheat>0)
			params.workersWheat--;
		else if(params.workersWarriors>0)
			params.workersWarriors--;
	}
	let dwheat=-foodpersec*numWorkers+power.wheat*params.workersWheat;
	let dstone=power.stone*params.workersStone;
	let dwood=power.wood*params.workersWood;
	let dscience=power.science*params.workersUnemployed;


	params.wheat=Math.max(0,params.wheat+dwheat);
	params.stone+=dstone;
	params.wood+=dwood;
	params.science+=dscience;

	let wheatStr=(dwheat>=0?"+":"")+dwheat.toFixed(1);
	let stoneStr=(dstone>=0?"+":"")+dstone.toFixed(1);
	let woodStr=(dwood>=0?"+":"")+dwood.toFixed(1);

	document.getElementById("param-change").innerHTML=`Wheat: ${wheatStr}   Stone: ${stoneStr}   Wood: ${woodStr}   Science: ${params.science}`;
	updateDOM();

},1000);

function updateDOM(){
	document.getElementById("wheat-button").innerHTML=`Wheat: ${Math.round(params.wheat)}`;
	document.getElementById("stone-button").innerHTML=`Stone: ${Math.round(params.stone)}`;
	document.getElementById("wood-button").innerHTML=`Wood: ${Math.round(params.wood)}`;

	document.getElementById("granaries-button").innerHTML=`Granaries: ${Math.round(params.granaries)}`;
	document.getElementById("stonePiles-button").innerHTML=`Stone Piles: ${Math.round(params.stonePiles)}`;
	document.getElementById("lumberyards-button").innerHTML=`Lumberyards: ${Math.round(params.lumberyards)}`;


	document.getElementById("buy-worker").innerHTML=`Buy Worker: ${Math.round(params.workersUnemployed)}`;
	document.getElementById("wheat-worker").innerHTML=`Farmers: ${Math.round(params.workersWheat)}`;
	document.getElementById("stone-worker").innerHTML=`Miners: ${Math.round(params.workersStone)}`;
	document.getElementById("wood-worker").innerHTML=`Lumberjacks: ${Math.round(params.workersWood)}`;

	// remove purchased upgrades
	for(const name in upgrades){
		if(params.purchasedUpgrades.includes(name) && document.getElementById(`${name}-button`)!=undefined){
			console.log(name);
			document.getElementById("upgrade-list").removeChild(document.getElementById(`${name}-button`));
		}
	}
}





/*
fetch("http://localhost:80/upgrades.json")
	.then(response => response.text())
	.then(text => JSON.parse(text))
	.then(function(obj){
		console.log(new Function("",obj.upg1_1.effect));
	})
*/


init();