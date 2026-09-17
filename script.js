const start = document.getElementById('start');
const tableDiv = document.getElementById('table');
const next = document.getElementById('next');
const UI = document.getElementById('UI');
const container = document.getElementById('container');
const messageUI = document.getElementById('message');
const second = document.getElementById('second');
const third = document.getElementById('third');
const fourth = document.getElementById('4.');
const fifth = document.getElementById('5.');
const sixth = document.getElementById('6.');
const names = ["Aidan","Ben", "Bela", "Mats", "Pierkachu & Tim", "Tun"]
let time = 1;
let rounds = 3;
let roundFinished = null;

//defining table buttons
let tableButtons = [
    document.getElementById("b1"),
    document.getElementById("b2"),
    document.getElementById("b3"),
    document.getElementById("b4"),
    document.getElementById("b5"),
    document.getElementById("b6"),
]
tableButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        roundWon(e.currentTarget, index);
    })
})

next.addEventListener('click', (e) => {
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
    let opponent = null;
    let secKey = null;
    if (key % 2 === 0) {
         secKey = key + 1
        opponent = players[secKey];
    } else {
         secKey = key - 1
        opponent = players[secKey]
    }

    if (winner.isPlaying === true) {
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
        this.index = null;
        this.match = null;
        this.played = null;
        this.matches = [];
        this.wins = 0;
        this.loses = 0;
        this.ties = 0;
        this.points = 0;
        this.isPlaying = false;
        this.awr = 0;
        this.message = this.name + ": " + this.points + " (" + this.wins + "/" + this.ties + "/" + this.loses + ")";
    }
    update() {
        this.index = players.indexOf(this);
        let totalOpponentWinRate = 0;
        if (this.matches.length > 0) {
            this.matches.forEach(opponent => {
                // Calculate individual opponent win rate (treating ties as half a win)
                let winRate = (opponent.wins + (opponent.ties * 0.5)) / 3;
                totalOpponentWinRate += winRate;
            });
            // Get the average across all opponents, convert to a clean percentage string
            this.awr = ((totalOpponentWinRate / this.matches.length) * 100).toFixed(0) + "%";
        } else {
            this.awr = "0%";
        }

        this.message = this.name + ": " + this.points + " (" + this.wins + "/" + this.ties + "/" + this.loses + ") [Opp. WR: " + this.awr + "]";
    }
}
let players = [];
names.forEach((name) => {
    players.push(new Player(name));
})

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

function createMatchups(){
    players.sort((a, b) => b.points - a.points);
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
    if (!players[4].isPlaying || !players[5].isPlaying) {
        // Un-pair the middle match (Index 2 and 3) to free them up
        players[2].matches.pop();
        players[3].matches.pop();

        // Force the leftover bottom players to match with the middle tier
        // This guarantees everyone gets a valid, unplayed match in a 6-player, 3-round setup
        players[2].matches.push(players[4]);
        players[4].matches.push(players[2]);

        players[3].matches.push(players[5]);
        players[5].matches.push(players[3]);

        players[2].isPlaying = players[3].isPlaying = players[4].isPlaying = players[5].isPlaying = true;

        // Fix array order visually: Swap index 3 and 4 so pairs sit side-by-side: [2 vs 4] and [3 vs 5]
        [players[3], players[4]] = [players[4], players[3]];
    }
    console.log(players);
}

function buchholz(player) {
    return player.matches.reduce((sum, opponent) => sum + opponent.points, 0)
}

//round function
function newRound() {
    if (!(time > rounds)) {
        if (time === 1) {
            start.style.display = "none";
            tableDiv.style.visibility = "visible";
            next.style.visibility = "visible";
            players = shuffle(players);
            createMatchups();

            time = 2;
        } else if (time < 4) {
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
            else return buchholz(b) - buchholz(a)
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



start.addEventListener('click', () => {
    newRound();
})