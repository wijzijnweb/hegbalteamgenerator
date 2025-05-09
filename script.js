const dieHardsList = document.getElementById('dieHards');
const benchWarmersList = document.getElementById('benchWarmers');
const participantsList = document.getElementById('participants');
const team1 = document.getElementById('team1');
const team2 = document.getElementById('team2');
const formTeamsButton = document.getElementById('formTeams');
const generateAgainButton = document.getElementById('generateAgain');

const players = [
    { name: 'Lars', value: 2 },
    { name: 'Bart', value: 5 },
    { name: 'Danny', value: 2 },
    { name: 'Henoch', value: 5 },
    { name: 'Jaap', value: 4 },
    { name: 'Kevin', value: 4 },
    { name: 'Koen', value: 6 },
    { name: 'Laureen', value: 2 },
    { name: 'Leander', value: 2 },
    { name: 'Luc', value: 6 },
    { name: 'Marc', value: 5 },
    { name: 'Marije', value: 2 },
    { name: 'Mark', value: 5 },
    { name: 'Maud', value: 2 },
    { name: 'Pascal', value: 2 },
    { name: 'Remco', value: 3 },
    { name: 'Sander', value: 3 },
    { name: 'Simon', value: 6 },
    { name: 'Tim', value: 5 },
    { name: 'Tom', value: 4 },
    { name: 'Jordie', value: 3 },
];

const selectedPlayers = new Set();

const dieHards = [
'Danny', 'Henoch', 'Jordie', 'Lars', 'Laureen', 'Leander', 'Marc', 'Mark', 'Maud', 'Remco', 'Simon', 'Tim',
];

const benchWarmers = [
'Bart', 'Gita', 'Jaap', 'Kevin', 'Koen', 'Luc', 'Marije', 'Pascal', 'Sander', 'Tom',
];

function addPlayerToList(player, list) {
    const button = document.createElement('button');
    button.textContent = player.name;
    button.classList.add('player-button');
    list.appendChild(button);

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
}

players.forEach(player => {
    if (dieHards.includes(player.name)) {
        addPlayerToList(player, dieHardsList);
    } else if (benchWarmers.includes(player.name)) {
        addPlayerToList(player, benchWarmersList);
    }
});

formTeamsButton.addEventListener('click', () => {
    formTeams();
});

generateAgainButton.addEventListener('click', () => {
    generateRandomTeams();
});

function formTeams() {
    // Eerst zorgen we dat we een lijst van geselecteerde spelers hebben
    const selectedPlayersArray = Array.from(selectedPlayers);

    // We sorteren de spelers op hun waarde
    const sortedPlayers = selectedPlayersArray.slice().sort((a, b) => a.value - b.value);

    // We bereiden de teams en hun totale waarden voor
    let team1Players = [];
    let team2Players = [];
    let team1TotalValue = 0;
    let team2TotalValue = 0;

    // We verdelen de spelers over de teams
    sortedPlayers.forEach(player => {
        if (team1TotalValue <= team2TotalValue) {
            team1Players.push(player);
            team1TotalValue += player.value;
        } else {
            team2Players.push(player);
            team2TotalValue += player.value;
        }
    });

    // We tonen de teams
    displayTeams(team1Players, team2Players);
}

function generateRandomTeams() {
    // Eerst zorgen we dat we een lijst van geselecteerde spelers hebben
    const selectedPlayersArray = Array.from(selectedPlayers);

    // We schudden de spelers willekeurig
    const shuffledPlayers = shuffleArray(selectedPlayersArray);

    let bestTeam1Players = [];
    let bestTeam2Players = [];
    let bestDifference = Infinity;

    // We proberen 1000 verschillende combinaties
    for (let i = 0; i < 1000; i++) {
        // We splitsen de spelers in twee teams
        const team1Players = shuffledPlayers.slice(0, shuffledPlayers.length / 2);
        const team2Players = shuffledPlayers.slice(shuffledPlayers.length / 2);

        // We berekenen het verschil in gemiddelde waarde tussen de teams
        const team1Average = calculateAverage(team1Players);
        const team2Average = calculateAverage(team2Players);
        const currentDifference = Math.abs(team1Average - team2Average);

        // We kijken of dit de beste combinatie tot nu toe is
        if (currentDifference < bestDifference &&
            team1Players.length - team2Players.length <= 1 &&
            team2Players.length - team1Players.length <= 1) {
            bestDifference = currentDifference;
            bestTeam1Players = team1Players;
            bestTeam2Players = team2Players;
        }

        // We schudden de spelers voor de volgende poging
        shuffledPlayers.push(shuffledPlayers.shift());
    }

    // We tonen de beste teams
    displayTeams(bestTeam1Players, bestTeam2Players);
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

    const team1FieldElement = document.createElement('p');
    team1FieldElement.textContent = 'Team Stoep';
    team1.appendChild(team1FieldElement);

    const team2FieldElement = document.createElement('p');
    team2FieldElement.textContent = 'Team Zand';
    team2.appendChild(team2FieldElement);
}
