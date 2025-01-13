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
            <td>${tennisPlayer.additionalProperty[3].value}</td>
            <td>${tennisPlayer.ime}</td>
            <td>${tennisPlayer.prezime}</td>
            <td>${tennisPlayer.nacionalnost}</td>
            <td>${tennisPlayer.additionalProperty[0].value}</td>
            <td>${tennisPlayer.visina_cm}</td>
            <td>${tennisPlayer.tezina_kg}</td>
            <td>${tennisPlayer.additionalProperty[4].value}</td>
            <td>${tennisPlayer.additionalProperty[5].value}</td>
            <td>${tennisPlayer.additionalProperty[1].value}</td>
            <td>${tennisPlayer.additionalProperty[2].value.join(', ') ? tennisPlayer.additionalProperty[2].value.join(', ') : ""}</td>
        `;
    tableBody.appendChild(rowElement);

    const tableBody2 = document.querySelector("#singleTournamentTable tbody");
    tableBody2.innerHTML = '';
    const rowElement2 = document.createElement("tr");
    rowElement.innerHTML = `
            <td>${tennisTournament.additionalProperty[0].value}</td>
            <td>${tennisTournament.naziv}</td>
            <td>${tennisTournament.godina}</td>
            <td>${tennisTournament.additionalProperty[1].value}</td>
        `;
    tableBody2.appendChild(rowElement2);
}

//-----------------------------------------------------------------------------------------------
function displayPlayerData(tennisPlayer) {
    if (tennisPlayer) {
        console.log("Igrač nađen:", tennisPlayer);
        const tableBody = document.querySelector("#singlePlayerTable tbody");
        tableBody.innerHTML = '';
        const rowElement = document.createElement("tr");
        rowElement.innerHTML = `
            <td>${tennisPlayer.additionalProperty[3].value}</td>
            <td>${tennisPlayer.ime}</td>
            <td>${tennisPlayer.prezime}</td>
            <td>${tennisPlayer.nacionalnost}</td>
            <td>${tennisPlayer.additionalProperty[0].value}</td>
            <td>${tennisPlayer.visina_cm}</td>
            <td>${tennisPlayer.tezina_kg}</td>
            <td>${tennisPlayer.additionalProperty[4].value}</td>
            <td>${tennisPlayer.additionalProperty[5].value}</td>
            <td>${tennisPlayer.additionalProperty[1].value}</td>
            <td>${tennisPlayer.additionalProperty[2].value.join(', ') ? tennisPlayer.additionalProperty[2].value.join(', ') : ""}</td>
        `;
    tableBody.appendChild(rowElement);
    } else {
        console.log("Nije nađen traženi igrač.");
        const tableBody = document.querySelector("#singlePlayerTable tbody");
        tableBody.innerHTML = '';
    }
}

function displayTournamentData(tennisTournament) {
    if (tennisTournament) {
        console.log("Turnir nađen:", tennisTournament);
        const tableBody = document.querySelector("#singleTournamentTable tbody");
        tableBody.innerHTML = '';
        const rowElement = document.createElement("tr");
        rowElement.innerHTML = `
            <td>${tennisTournament.additionalProperty[0].value}</td>
            <td>${tennisTournament.naziv}</td>
            <td>${tennisTournament.godina}</td>
            <td>${tennisTournament.additionalProperty[1].value}</td>
        `;
        tableBody.appendChild(rowElement);
    } else {
        console.log("Nema traženog turnira.");
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
            displayPlayerData(tennisPlayer); 
        } else if (response.status === 404) {
            displayPlayerData(null);
        } else {
            console.error('Neočekivana greška:', response.statusText);
            displayPlayerData(null);
        }
    } catch (error) {
        console.error('Greška u dohvatu podataka o igraču:', error);
        displayPlayerData(null); 
    }
}


async function applyTournamentIdFilter() {
    const attribute = document.getElementById("turnir_id").value;
    try {
        const response = await fetch(`/api/singleTennisTournament?turnir_id=${attribute}`);
        if (response.ok) {
            const tennisTournament = await response.json();
            displayTournamentData(tennisTournament); 
        } else if (response.status === 404) {
            displayTournamentData(null); 
        } else {
            console.error('Neočekivana greška:', response.statusText);
            displayTournamentData(null);
        }
    } catch (error) {
        console.error('Greška u dohvatu podataka o turniru:', error);
        displayTournamentData(null); 
    }
}