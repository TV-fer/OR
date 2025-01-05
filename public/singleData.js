//displayAllData se zove čim se stranica učita 
window.onload = () => displayAllData();

async function displayAllData() {
    const response = await fetch(`/api/singleTennisPlayer?igrac_id=1`);
    const tennisPlayer = await response.json();

    const response2 = await fetch(`/api/singleTennisTournament?turnir_id=1`);
    const tennisTournament = await response2.json();

    const tableBody = document.querySelector("#singlePlayerTable tbody");
    tableBody.innerHTML = '';
    const rowElement = document.createElement("tr");
    rowElement.innerHTML = `
        <td>${tennisPlayer.igrac_id}</td>
        <td>${tennisPlayer.ime}</td>
        <td>${tennisPlayer.prezime}</td>
        <td>${tennisPlayer.nacionalnost}</td>
        <td>${tennisPlayer.godine}</td>
        <td>${tennisPlayer.visina_cm}</td>
        <td>${tennisPlayer.tezina_kg}</td>
        <td>${tennisPlayer.najvisi_ranking}</td>
        <td>${tennisPlayer.broj_osvojenih_turnira}</td>
        <td>${tennisPlayer.omiljena_podloga}</td>
        <td>${tennisPlayer.Osvojeni_turniri.join(', ')}</td>
    `;
    tableBody.appendChild(rowElement);

    const tableBody2 = document.querySelector("#singleTournamentTable tbody");
    tableBody2.innerHTML = '';
    const rowElement2 = document.createElement("tr");
    rowElement2.innerHTML = `
        <td>${tennisTournament.turnir_id}</td>
        <td>${tennisTournament.naziv}</td>
        <td>${tennisTournament.godina}</td>
        <td>${tennisTournament.povrsina}</td>
    `;
    tableBody2.appendChild(rowElement2);
}

//-----------------------------------------------------------------------------------------------
function displayPlayerData(tennisPlayer) {
    if (tennisPlayer) {
        console.log("Player found:", tennisPlayer);
        const tableBody = document.querySelector("#singlePlayerTable tbody");
        tableBody.innerHTML = '';
        const rowElement = document.createElement("tr");
        rowElement.innerHTML = `
            <td>${tennisPlayer.igrac_id}</td>
            <td>${tennisPlayer.ime}</td>
            <td>${tennisPlayer.prezime}</td>
            <td>${tennisPlayer.nacionalnost}</td>
            <td>${tennisPlayer.godine}</td>
            <td>${tennisPlayer.visina_cm}</td>
            <td>${tennisPlayer.tezina_kg}</td>
            <td>${tennisPlayer.najvisi_ranking}</td>
            <td>${tennisPlayer.broj_osvojenih_turnira}</td>
            <td>${tennisPlayer.omiljena_podloga}</td>
            <td>${tennisPlayer.Osvojeni_turniri.join(', ')}</td>
        `;
    tableBody.appendChild(rowElement);
    } else {
        console.log("No player found.");
        const tableBody = document.querySelector("#singlePlayerTable tbody");
        tableBody.innerHTML = '';
    }
}

function displayTournamentData(tennisTournament) {
    if (tennisTournament) {
        console.log("Tournament found:", tennisTournament);
        const tableBody = document.querySelector("#singleTournamentTable tbody");
        tableBody.innerHTML = '';
        const rowElement = document.createElement("tr");
        rowElement.innerHTML = `
            <td>${tennisTournament.turnir_id}</td>
            <td>${tennisTournament.naziv}</td>
            <td>${tennisTournament.godina}</td>
            <td>${tennisTournament.povrsina}</td>
        `;
        tableBody.appendChild(rowElement);
    } else {
        console.log("No tournament found.");
        const tableBody = document.querySelector("#singleTournamentTable tbody");
        tableBody.innerHTML = '';
    }
}

//-----------------------------------------------------------------------------------------------
async function applyPlayerIdFilter() {
    const attribute = document.getElementById("igrac_id").value;
    try {
        const response = await fetch(`/api/singleTennisPlayer?igrac_id=${attribute}`);
        if (response.ok) {
            const tennisPlayer = await response.json();
            displayPlayerData(tennisPlayer); // Pass the fetched data
        } else if (response.status === 404) {
            displayPlayerData(null); // Pass `null` to indicate no data was found
        } else {
            console.error('Unexpected error:', response.statusText);
            displayPlayerData(null); // Pass `null` in case of an unexpected issue
        }
    } catch (error) {
        console.error('Error fetching player data:', error);
        displayPlayerData(null); // Pass `null` in case of a network error or exception
    }
}


async function applyTournamentIdFilter() {
    const attribute = document.getElementById("turnir_id").value;
    try {
        const response = await fetch(`/api/singleTennisTournament?turnir_id=${attribute}`);
        if (response.ok) {
            const tennisTournament = await response.json();
            displayTournamentData(tennisTournament); // Pass the fetched data
        } else if (response.status === 404) {
            displayTournamentData(null); // Pass `null` to indicate no data was found
        } else {
            console.error('Unexpected error:', response.statusText);
            displayTournamentData(null); // Pass `null` in case of an unexpected issue
        }
    } catch (error) {
        console.error('Error fetching tournament data:', error);
        displayTournamentData(null); // Pass `null` in case of a network error or exception
    }
}