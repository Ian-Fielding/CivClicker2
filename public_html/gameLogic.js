const TESTING=true; //set to false in release!!


// Checks for a cookie, and if it exists, retrieves the username
if(document.cookie == ""){
	window.location.href = "/index.html";
}
const cookie = document.cookie;
const jsonValue = JSON.parse(decodeURIComponent(cookie).split('login=')[1].replace(/^j:/, ''));
const username = jsonValue.username;



let params={
	numWheat: 0,
	numStone: 0,
	numWood: 0,

	numGranaries: 1,
	numStonePiles: 1,
	numLumberyards: 1,
};// TODO load these from database

// TODO Come up with better styling here
function init(){
	let resources=document.getElementById("resources");
	let buildings=document.getElementById("buildings");

	// wheat button
	let wheat=document.createElement("button");
	wheat.setAttribute("id","wheat-button");
	wheat.onclick=function(){
		
		if(TESTING)
			params.numWheat+=20;
		else
			params.numWheat++;

		if(params.numWheat > 200*params.numGranaries)
			params.numWheat = 200*params.numGranaries;
		updateDOM();
	};

	// stone button
	let stone=document.createElement("button");
	stone.setAttribute("id","stone-button");
	stone.onclick=function(){
		
		if(TESTING)
			params.numStone+=20;
		else
			params.numStone++;

		if(params.numStone > 200*params.numStonePiles)
			params.numStone = 200*params.numStonePiles;
		updateDOM();
	};

	// wood button
	let wood=document.createElement("button");
	wood.setAttribute("id","wood-button");
	wood.onclick=function(){
		
		if(TESTING)
			params.numWood+=20;
		else
			params.numWood++;

		if(params.numWood > 200*params.numLumberyards)
			params.numWood = 200*params.numLumberyards;
		updateDOM();
	};



	// granary button
	// 100 wheat, 20 stone, 100 wood
	let granary=document.createElement("button");
	granary.setAttribute("id","granary-button");
	granary.onclick=function(){
		if(
			params.numWheat>=100 &&
			params.numStone>=20  &&
			params.numWood >=100
			){
			
			params.numGranaries++;
			params.numWheat-=100;
			params.numStone-=20;
			params.numWood-=100;
		}
		
		updateDOM();
	};

	// stonepile button
	// 50 wheat, 200 stone, 50 wood 
	let stonepile=document.createElement("button");
	stonepile.setAttribute("id","stonepile-button");
	stonepile.onclick=function(){
		if(
			params.numWheat>=50 &&
			params.numStone>=200  &&
			params.numWood >=50
			){
			
			params.numStonePiles++;
			params.numWheat-=50;
			params.numStone-=200;
			params.numWood-=50;
		}

		updateDOM();
	};

	// lumberyard button
	// 50 wheat, 50 stone, 200 wood 
	let lumberyard=document.createElement("button");
	lumberyard.setAttribute("id","lumberyard-button");
	lumberyard.onclick=function(){
		if(
			params.numWheat>=50 &&
			params.numStone>=50  &&
			params.numWood >=200
			){
			
			params.numLumberyards++;
			params.numWheat-=50;
			params.numStone-=50;
			params.numWood-=200;
		}
		updateDOM();
	};


	resources.appendChild(wheat);
	resources.appendChild(stone);
	resources.appendChild(wood);
	buildings.appendChild(granary);
	buildings.appendChild(stonepile);
	buildings.appendChild(lumberyard);
	updateDOM();
}

function updateDOM(){
	document.getElementById("wheat-button").innerHTML=`Wheat: ${params.numWheat}`;
	document.getElementById("stone-button").innerHTML=`Stone: ${params.numStone}`;
	document.getElementById("wood-button").innerHTML=`Wood: ${params.numWood}`;

	document.getElementById("granary-button").innerHTML=`Granaries: ${params.numGranaries}`;
	document.getElementById("stonepile-button").innerHTML=`Stone Piles: ${params.numStonePiles}`;
	document.getElementById("lumberyard-button").innerHTML=`Lumberyards: ${params.numLumberyards}`;
}












init();