const start = document.getElementById('start');
const tableDiv = document.getElementById('table');
const table = document.getElementById('theTable');
const list = document.getElementById('list');
const next = document.getElementById('next');
const input = document.getElementById('newPlayer');
const addPlayer = document.getElementById('add');
const inputRow = document.getElementById('inputRow');
const UI = document.getElementById('UI');
const container = document.getElementById('container');
const messageUI = document.getElementById('message');
const second = document.getElementById('second');
const third = document.getElementById('third');
const fourth = document.getElementById('4.');
const fifth = document.getElementById('5.');
const sixth = document.getElementById('6.');
let names = []
let evenNumber;
let time = 1;
let rounds = 3;
let roundFinished;

addPlayer.addEventListener('click', () => {
    playerAdd()
})
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        playerAdd()
    }
})
function playerAdd() {
    let str = input.value.charAt(0).toUpperCase() + input.value.slice(1).toLowerCase();
    if (str && !names.includes(str)) {
        if (input.value === "Bluzokt2011POR26"){
            list.replaceChildren()
            list.appendChild(inputRow);
            names = ["Aidan", "Ben", "Bela", "Bluzokt2011", "Mats", "Tun", "Pierkachu & Tim"]
            input.value = '';
            names.forEach(name => {
                newPlayer(name)
            })
            createTable();
            newRound();
        } else {
            names.push(str);
            newPlayer(str);
            input.value = '';
            input.focus();
        }
    } else if (str) console.error(str +" is already playing");
}
function createTable() {
    players = [];
    dropper.forEach(player => {
        player.style.display = 'none';
    })
    names.forEach((name) => {
        players.push(new Player(name));
    })


    for (let i = 6; i < players.length; i+=2) {
            const newLine = table.insertRow(-1)
            let cell1 = newLine.insertCell(0);
            let cell2 = newLine.insertCell(1);
            let button1 = document.createElement('button');
            let button2 = document.createElement('button');
            button1.id = "b"+ (i + 1);
            button2.id = "b"+ (i + 2);
            tableButtons.push(button1, button2);
            cell1.appendChild(button1);
            cell2.appendChild(button2);

    }
    tableButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            roundWon(e.currentTarget, index);
        })
    })
    evenNumber = players.length % 2 === 0;
    rounds = Math.ceil(Math.log2(players.length));

    console.log(rounds);
}


let tableButtons = [
    document.getElementById("b1"),
    document.getElementById("b2"),
    document.getElementById("b3"),
    document.getElementById("b4"),
    document.getElementById("b5"),
    document.getElementById("b6"),
]

next.addEventListener('click', () => {
    if (!roundFinished) {
        players.forEach((player, index) => {
            if (player.isPlaying) {
                player.isPlaying = false;
                player.points++;
                player.ties++;
                player.match = "tie"
                tableButtons[index].style.backgroundColor = "#FBEC5D"
            }
        })
        roundFinished = true;
        next.innerText = 'Next round';
    } else newRound()
})

function roundWon(button, key) {

    const winner = players[key]
    let opponent;
    let secKey;
    if (key % 2 === 0) {
         secKey = key + 1
        opponent = players[secKey];
    } else {
         secKey = key - 1
        opponent = players[secKey]
    }

    if (winner.isPlaying === true) {
        console.log(key)
        winner.isPlaying = false;
        winner.points += 3;
        winner.wins++;
        winner.match = "win";
        button.style.backgroundColor = "green";
        opponent.isPlaying = false;
        opponent.loses++;
        opponent.match = "loss";
        console.log(winner, opponent);
        tableButtons[secKey].style.backgroundColor = "red";
    } else {
        if (winner.match === "loss") {
            winner.points++;
            winner.loses--;
            winner.ties++;
            winner.match = "tie";
            tableButtons[key].style.backgroundColor = "#FBEC5D"
            tableButtons[secKey].style.backgroundColor = "#FBEC5D"
            opponent.points -= 2;
            opponent.ties++;
            opponent.wins--;
            opponent.match = "tie";
        } else if (winner.match === "tie") {
            winner.points+=2;
            winner.ties--;
            winner.wins++;
            winner.match = "win";
            tableButtons[key].style.backgroundColor = "green";
            tableButtons[secKey].style.backgroundColor = "red"
            opponent.points--;
            opponent.ties--;
            opponent.loses++;
            opponent.match = "loss";
        }
    }
    if (players.every(player => player.isPlaying === false))  {
        roundFinished = true;
        next.innerText = 'Next round';
    }
}

//defining players
class Player {
    constructor(name) {
        this.name = name;
        this.dropped = false;
        this.index = null;
        this.match = null;
        this.played = null;
        this.matches = [];
        this.wins = 0;
        this.loses = 0;
        this.ties = 0;
        this.points = 0;
        this.isPlaying = false;
        this.byed = false;
        this.awr = 0;
        this.OppAwr = 0;
        this.message = this.name + ": " + this.points + " (" + this.wins + "/" + this.ties + "/" + this.loses + ")";
    }
    update() {
        this.index = players.indexOf(this);
        let totalOpponentWinRate = 0;
        if (this.matches.length > 0) {
            this.matches.forEach(opponent => {
                // Calculate individual opponent win rate (treating ties as half a win)
                let winRate = (opponent.wins + (opponent.ties * 0.5)) / opponent.matches.length;
                totalOpponentWinRate += winRate;
            });
            // Get the average across all opponents, convert to a clean percentage string
            this.awr = ((totalOpponentWinRate / this.matches.length) * 100).toFixed(0);
        } else {
            this.awr = "0%";
        }

        this.message = this.name + ": " + this.points + " (" + this.wins + "/" + this.ties + "/" + this.loses + ") [Opp. WR: " + this.awr + "%]";
    }
    update2(){
        let totalOppOppWinRate = 0;

        if (this.matches.length > 0) {
            this.matches.forEach(opponent => {
                totalOppOppWinRate += opponent.awr || 0;

            });
            this.OppAwr = totalOppOppWinRate / this.matches.length;
        }
    }
}
let players = [];

//shuffling the array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function bye(){
    const possible = players.filter(p => p.byed === false)
    const minPoints = Math.min(...possible.map((player) => player.points));
    const chosen = possible.filter(p => p.points === minPoints)
    let THE = chosen[Math.floor(Math.random() * chosen.length)];
    console.log(possible)
    THE.byed = true;
    if (time === 1 && THE.name === "Mats") {
        return bye();
    }
     else return THE;

}
function createMatchups(){
    players.sort((a, b) => b.points - a.points);
    let mover;
    let byePlayer;
    if (!evenNumber) {
        byePlayer = bye()
        byePlayer.isPlaying = true;
        byePlayer.wins++;
        byePlayer.points+=3;
        byePlayer.match = "win";
        [mover] = players.splice(players.indexOf(byePlayer), 1);

        console.log(byePlayer);
    }
    for (let i = 0; i < players.length-1; i+=2) {
        let j = i + 1;

        while (!players[i].isPlaying && j < players.length) {
            if (!players[j].isPlaying && !players[i].matches.includes(players[j])) {
                players[i].matches.push(players[j]);
                players[i].isPlaying = true;
                players[j].matches.push(players[i]);
                players[j].isPlaying = true;

                const [mover] = players.splice(j, 1);
                players.splice(i + 1, 0, mover);

                //[players[j], players[i+1]] = [players[i+1], players[j]];

            } else j++;
        }

    }
    let lastplayer = [players.length-1];
    let playerBefore = [players.length - 2];
    if (!players[playerBefore].isPlaying || !players[lastplayer].isPlaying) {
        // Un-pair the middle match (Index 2 and 3) to free them up
        players[playerBefore-2].matches.pop();
        players[playerBefore-1].matches.pop();

        // Force the leftover bottom players to match with the middle tier
        // This guarantees everyone gets a valid, unplayed match in a 6-player, playerBefore-1-round setup
        players[playerBefore-2].matches.push(players[playerBefore]);
        players[playerBefore].matches.push(players[playerBefore-2]);

        players[playerBefore-1].matches.push(players[lastplayer]);
        players[lastplayer].matches.push(players[playerBefore-1]);

        players[playerBefore-2].isPlaying = players[playerBefore-1].isPlaying = players[playerBefore].isPlaying = players[lastplayer].isPlaying = true;

        // Fix array order visually: Swap index playerBefore-1 and playerBefore so pairs sit side-by-side: [2 vs playerBefore] and [playerBefore-1 vs 5]
        [players[playerBefore-1], players[playerBefore]] = [players[playerBefore], players[playerBefore-1]];
    }
    if (!evenNumber){
        byePlayer.isPlaying = false;
        players.push(mover);
        tableButtons[players.indexOf(byePlayer)].style.backgroundColor = "green";

    }
    console.log(players);
}

let dropper= [];
//round function
function newRound() {
    if (!(time > rounds)) {
        if (time === 1) {
            start.style.display = "none";
            inputRow.style.display = "none";
            tableDiv.style.visibility = "visible";
            next.style.visibility = "visible";
            players = shuffle(players);
            createMatchups();

            time++;
        } else if (time <= rounds) {
            tableButtons.forEach(button => {
                button.style.backgroundColor = "white";
            })
            players.forEach((player) => {
                player.isPlaying = false;
                player.match = null;
            })
            createMatchups();
            time++;
        }
        next.innerHTML = 'Finish Round';
        roundFinished = false

        players.forEach((player) => {
            player.update();
            tableButtons[player.index].innerHTML = player.message;
        })
        players.forEach((player) => {
            player.update2();
        })
    } else {
        players.forEach((player) => {
            player.update();
        })
        tableDiv.style.visibility = "hidden";
        next.style.visibility = "hidden";
        UI.style.visibility = "visible";
        container.style.display = "none";

        players.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points
            else if (b.awr !== a.awr) return b.awr - a.awr
            else return b.OppAwr - a.OppAwr
        });
        if (players[0].name === "Pierkachu & Tim") messageUI.innerHTML = "The winners are " +players[0].message;
        else messageUI.innerHTML = "The winner is " +players[0].message;
        if (players[1].name === "Pierkachu & Tim") second.innerHTML = "The second Places are " +players[1].message;
        else second.innerHTML = "The second Place is " +players[1].message;
        if (players[2].name === "Pierkachu & Tim") third.innerHTML = "The third Places are " +players[2].message;
        else third.innerHTML = "The third Place is " +players[2].message;
        fourth.innerHTML = "4: " +players[3].message;
        fifth.innerHTML = "5: " +players[4].message;
        sixth.innerHTML = "6: " +players[5].message;


    }
}
function newPlayer(name){
    const NEW = document.createElement("li");
    NEW.innerHTML = name
    NEW.classList.add("playerButton");
    let dropButton = document.createElement("button");
    dropButton.className = "dropButton";
    dropButton.innerHTML = "DROP";
    dropButton.addEventListener("click", () => {
        if (dropButton.innerHTML === "DROP") {
            if (time === 1) {
                console.log(NEW.childNodes[0].data)
                names.splice(names.indexOf(NEW.childNodes[0].data), 1)
                NEW.remove();
                console.log(names, players);
            } else {
                console.log(names, players);
                let dropping = players.find((player) => player.name === NEW.childNodes[0].data);
                if (dropping.isPlaying) {
                    dropButton.innerHTML = "DROPPED";
                    let key = players.indexOf(dropping);
                    let secKey;
                    let winner;
                    if (key % 2 === 0) {
                        secKey = key + 1
                        winner = players[secKey];
                    } else {
                        secKey = key - 1
                        winner = players[secKey]
                    }

                    dropping.dropped = true;
                    console.log(dropping);


                    winner.isPlaying = false;
                    winner.points += 3;
                    winner.wins++;
                    winner.match = "win";
                    tableButtons[key].style.backgroundColor = "red"
                    tableButtons[secKey].style.backgroundColor = "green"
                    dropping.isPlaying = false;
                    dropping.loses++;
                    dropping.match = "loss";

                }

            }
        }
    })
    dropper.push(dropButton);
    NEW.appendChild(dropButton);
    inputRow.insertAdjacentElement("beforebegin", NEW)
}
names.forEach((name) => {
    newPlayer(name);

})

start.addEventListener('click', () => {
    if (names.length<6) console.error("You need to be at least 6 players! Player count: " + names.length);
    else
    {
        createTable();
        newRound();
    }
})
input.focus()