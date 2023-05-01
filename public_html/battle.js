      // Checks for a cookie, and if it exists, retrieves the username
    if (document.cookie == "") {
        window.location.href = "/index.html";
    }
    const cookie = document.cookie;
    const jsonValue = JSON.parse(decodeURIComponent(cookie).split('login=')[1].replace(/^j:/, ''));
    const username = jsonValue.username;


    const urlParams = new URLSearchParams(window.location.search);
    const opponent1Power = urlParams.get('opponent1Power');
    const opponent2Power = urlParams.get('opponent2Power');
    const opponent1Username = urlParams.get('opponent1Username');
    const opponent2Username = urlParams.get('opponent2Username');
    document.getElementById('opponent1Power').textContent = opponent1Power;
    document.getElementById('opponent2Power').textContent = opponent2Power;
    document.getElementById('opponent1Username').textContent = opponent1Username;
    document.getElementById('opponent2Username').textContent = opponent2Username;

    let opponent1PowerInt = parseInt(opponent1Power);

    let finished = false;

    let battlePower = document.createElement("button");
    battlePower.innerHTML = "Increase Power!";
    battlePower.onclick = adjustPower;
    document.getElementById("increasePower").appendChild(battlePower);

    function adjustPower(){
      opponent1PowerInt += 0.1;
      document.getElementById('opponent1Power').textContent = opponent1PowerInt.toString();
    }

    setTimeout(function() {
      document.getElementById('increasePower').textContent = '';
      console.log("Updating DB");
      fetch('/adjust/power', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user: username,
          power: opponent1PowerInt
        }),
      });
      }, 10000);

      setInterval(()=>{
        if (!finished){
        fetch('/check/winner/' + username)
        .then(response => response.json())
        .then(results =>{
          finished = true;
          document.getElementById('opponent2Power').textContent = results.otherPower.toString();
          if(results.victory){
            document.getElementById('opponent1Power').textContent = "Victory";
          } else{
            document.getElementById('opponent1Power').textContent = "Defeat";
          }
        })
        }
      }, 1000);
