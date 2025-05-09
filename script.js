const dieHardsList = document.getElementById('dieHards');
const benchWarmersList = document.getElementById('benchWarmers');
const participantsList = document.getElementById('participants');
const team1Element = document.getElementById('team1');
const team2Element = document.getElementById('team2');
const formTeamsButton = document.getElementById('formTeams');
const generateAgainButton = document.getElementById('generateAgain');

const players = [
{ name: 'Bart', value: 5 },
{ name: 'Danny', value: 2 },
{ name: 'Gita', value: 2 },
{ name: 'Henoch', value: 5 },
{ name: 'Jaap', value: 4 },
{ name: 'Jordie', value: 3 },
{ name: 'Kevin', value: 4 },
{ name: 'Koen', value: 6 },
{ name: 'Laureen', value: 2 },
{ name: 'Lars', value: 2 },
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
];

const selectedPlayers = new Set();
const participantElements = new Map();

const dieHards = [
    'Danny', 'Henoch', 'Jordie', 'Lars', 'Laureen', 'Leander', 'Marc', 'Mark', 'Maud', 'Remco', 'Simon', 'Tim',
];

const benchWarmers = [
    'Bart', 'Gita', 'Jaap', 'Kevin', 'Koen', 'Luc', 'Marije', 'Pascal', 'Sander', 'Tom',
];

function addPlayerToList(player, listElement) {
    const button = document.createElement('button');
    button.textContent = player.name;
    button.classList.add('player-button');
    listElement.appendChild(button);

    button.addEventListener('click', () => {
        if (!selectedPlayers.has(player)) {
            selectedPlayers.add(player);
            button.classList.add('selected');

            const participantNameDiv = document.createElement('div');
            participantNameDiv.textContent = player.name;
            participantNameDiv.classList.add('participant-name');
            participantNameDiv.dataset.playerName = player.name;

            participantNameDiv.addEventListener('click', () => {
                selectedPlayers.delete(player);
                participantNameDiv.remove();
                participantElements.delete(player.name);
                button.classList.remove('selected');
            });
            participantsList.appendChild(participantNameDiv);
            participantElements.set(player.name, participantNameDiv);
        } else {
            selectedPlayers.delete(player);
            button.classList.remove('selected');
            if (participantElements.has(player.name)) {
                participantElements.get(player.name).remove();
                participantElements.delete(player.name);
            }
        }
    });
}

players.forEach(player => {
    if (dieHards.includes(player.name)) {
        addPlayerToList(player, dieHardsList);
    } else if (benchWarmers.includes(player.name)) {
        addPlayerToList(player, benchWarmersList);
    } else {
        console.warn(`Speler ${player.name} niet gevonden in dieHards of benchWarmers lijsten en wordt niet getoond.`);
    }
});

formTeamsButton.addEventListener('click', () => {
    generateFairTeams();
});

generateAgainButton.addEventListener('click', () => {
    generateFairTeams();
});

function generateFairTeams() {
    const selectedPlayersArray = Array.from(selectedPlayers);
    const numPlayers = selectedPlayersArray.length;

    if (numPlayers < 2) {
        alert("Selecteer minimaal 2 spelers om teams te vormen.");
        return;
    }

    let bestTeam1Players = [];
    let bestTeam2Players = [];
    let bestDifference = Infinity;

    const iterations = 5000;

    const team1Size = Math.floor(numPlayers / 2);
    // const team2Size = numPlayers - team1Size; // Niet expliciet nodig verderop, slice doet het werk

    for (let i = 0; i < iterations; i++) {
        const shuffledPlayers = shuffleArray(selectedPlayersArray.slice());

        const currentTeam1 = shuffledPlayers.slice(0, team1Size);
        const currentTeam2 = shuffledPlayers.slice(team1Size);

        const team1TotalValue = calculateTotalValue(currentTeam1);
        const team2TotalValue = calculateTotalValue(currentTeam2);
        const currentDifference = Math.abs(team1TotalValue - team2TotalValue);

        if (currentDifference < bestDifference) {
            bestDifference = currentDifference;
            bestTeam1Players = currentTeam1;
            bestTeam2Players = currentTeam2;

            if (bestDifference === 0) {
                break;
            }
        }
    }
    displayTeams(bestTeam1Players, bestTeam2Players);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function calculateTotalValue(teamPlayers) { // Renamed parameter for clarity
    if (!teamPlayers || teamPlayers.length === 0) {
        return 0;
    }
    return teamPlayers.reduce((sum, player) => sum + player.value, 0);
}

function displayTeams(team1Players, team2Players) {
    team1Element.innerHTML = '<h3>Team Stoep</h3>';
    team2Element.innerHTML = '<h3>Team Zand</h3>';

    team1Players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.textContent = player.name; // Toont alleen de naam
        team1Element.appendChild(playerDiv);
    });

    team2Players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.textContent = player.name; // Toont alleen de naam
        team2Element.appendChild(playerDiv);
    });

    const team1Total = calculateTotalValue(team1Players);
    const team2Total = calculateTotalValue(team2Players);

    const team1Stats = document.createElement('p');
    team1Stats.innerHTML = `<strong>Aantal spelers:</strong> ${team1Players.length}<br><strong>Totale teamscore:</strong> ${team1Total}`;
    team1Element.appendChild(team1Stats);

    const team2Stats = document.createElement('p');
    team2Stats.innerHTML = `<strong>Aantal spelers:</strong> ${team2Players.length}<br><strong>Totale teamscore:</strong> ${team2Total}`;
    team2Element.appendChild(team2Stats);
}
