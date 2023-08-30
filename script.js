const playerList = document.getElementById('players');
const participantsList = document.getElementById('participants');
const team1 = document.getElementById('team1');
const team2 = document.getElementById('team2');
const formTeamsButton = document.getElementById('formTeams');
const generateAgainButton = document.getElementById('generateAgain');

const players = [
    { name: 'Henoch', value: 8 },
    { name: 'Jacqueline', value: 7 },
    { name: 'John', value: 7.5 },
    { name: 'Maarten', value: 7.5 },
    { name: 'Mathew', value: 7.5 },
    { name: 'Mesach', value: 7.5 },
    { name: 'Ruben', value: 9 },
    { name: 'Samuel', value: 8 },
    { name: 'Tom B', value: 8 },
    { name: 'Tom P', value: 7.5 },
];

const selectedPlayers = new Set();

players.forEach(player => {
    const button = document.createElement('button');
    button.textContent = player.name;
    button.classList.add('player-button');
    playerList.appendChild(button);

    button.addEventListener('click', () => {
        if (!selectedPlayers.has(player)) {
            selectedPlayers.add(player);
            button.classList.add('selected');

            const participantName = document.createElement('div');
            participantName.textContent = player.name;
            participantName.classList.add('participant-name');
            participantName.addEventListener('click', () => {
                selectedPlayers.delete(player);
                participantName.remove();
                button.classList.remove('selected');
            });
            participantsList.appendChild(participantName);
        } else {
            selectedPlayers.delete(player);
            button.classList.remove('selected');
            const participantName = document.querySelector(`.participant-name:contains(${player.name})`);
            if (participantName) {
                participantName.remove();
            }
        }
    });
});

formTeamsButton.addEventListener('click', () => {
    formTeams();
});

generateAgainButton.addEventListener('click', () => {
    generateRandomTeams();
});

function formTeams() {
    const selectedPlayersArray = Array.from(selectedPlayers);
    const sortedPlayers = selectedPlayersArray.slice().sort((a, b) => a.value - b.value);

    let team1Players = [];
    let team2Players = [];
    let team1TotalValue = 0;
    let team2TotalValue = 0;

    sortedPlayers.forEach(player => {
        if (team1TotalValue <= team2TotalValue) {
            team1Players.push(player);
            team1TotalValue += player.value;
        } else {
            team2Players.push(player);
            team2TotalValue += player.value;
        }
    });

    displayTeams(team1Players, team2Players);
}

function generateRandomTeams() {
    const selectedPlayersArray = Array.from(selectedPlayers);
    const shuffledPlayers = shuffleArray(selectedPlayersArray);

    let bestTeam1Players = [];
    let bestTeam2Players = [];
    let bestDifference = Infinity;

    for (let i = 0; i < 1000; i++) {
        const team1Players = shuffledPlayers.slice(0, shuffledPlayers.length / 2);
        const team2Players = shuffledPlayers.slice(shuffledPlayers.length / 2);

        const team1Average = calculateAverage(team1Players);
        const team2Average = calculateAverage(team2Players);
        const currentDifference = Math.abs(team1Average - team2Average);

        if (currentDifference < bestDifference &&
            team1Players.length - team2Players.length <= 1 &&
            team2Players.length - team1Players.length <= 1) {
            bestDifference = currentDifference;
            bestTeam1Players = team1Players;
            bestTeam2Players = team2Players;
        }

        // Shuffle players for the next iteration
        shuffledPlayers.push(shuffledPlayers.shift());
    }

    displayTeams(bestTeam1Players, bestTeam2Players);
}

function calculateTeamDifference(team1, team2) {
    const team1Average = calculateAverage(team1);
    const team2Average = calculateAverage(team2);

    return Math.abs(team1Average - team2Average);
}

function shuffleArray(array) {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function calculateAverage(players) {
    if (players.length === 0) {
        return 0;
    }

    const totalValue = players.reduce((sum, player) => sum + player.value, 0);
    return totalValue / players.length;
}

function displayTeams(team1Players, team2Players) {
    team1.innerHTML = '';
    team2.innerHTML = '';

    team1Players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.textContent = player.name;
        team1.appendChild(playerDiv);
    });

    team2Players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.textContent = player.name;
        team2.appendChild(playerDiv);
    });

    const team1Average = calculateAverage(team1Players);
    const team2Average = calculateAverage(team2Players);

    const team1AverageElement = document.createElement('p');
    team1AverageElement.innerHTML = `<strong>Gemiddelde teamscore:</strong> ${team1Average.toFixed(2)}`;
    team1.appendChild(team1AverageElement);

    const team2AverageElement = document.createElement('p');
    team2AverageElement.innerHTML = `<strong>Gemiddelde teamscore:</strong> ${team2Average.toFixed(2)}`;
    team2.appendChild(team2AverageElement);
}
