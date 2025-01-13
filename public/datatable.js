//getAllData se zove čim se stranica učita 
window.onload = () => getAllData();

async function getAllData() {
    const response = await fetch(`/api/allTennisPlayers`);
    const tennisPlayers = await response.json();
    const tableBody = document.querySelector("#playersTable tbody");
    tableBody.innerHTML = '';
    console.log(tennisPlayers)
    tennisPlayers.itemListElement.forEach(tennisPlayer => {
        //console.log("The shit: ", tennisPlayer.additionalProperty[2].value.join(', '))
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
    });

    const response2 = await fetch(`/api/allTennisTournaments`);
    const tennisTournaments = await response2.json();
    const tableBody2 = document.querySelector("#tournamentsTable tbody");
    tableBody2.innerHTML = '';
    console.log(tennisTournaments)
    tennisTournaments.itemListElement.forEach(tennisTournament => {
        const rowElement = document.createElement("tr");
        rowElement.innerHTML = `
            <td>${tennisTournament.additionalProperty[0].value}</td>
            <td>${tennisTournament.naziv}</td>
            <td>${tennisTournament.godina}</td>
            <td>${tennisTournament.additionalProperty[1].value}</td>
        `;
        tableBody2.appendChild(rowElement);
    });
}

async function getPlayersData(searchTerm = '', attribute = '') {
    const response = await fetch(`/api/tennisPlayers?filter=${searchTerm}&attribute=${attribute}`);
    const tennisPlayers = await response.json();
    
    const tableBody = document.querySelector("#playersTable tbody");
    tableBody.innerHTML = '';
    
    tennisPlayers.itemListElement.forEach(tennisPlayer => {
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
    });
}

async function getTournamentsData(searchTerm = '', attribute = '') {
    const response = await fetch(`/api/tennisTournaments?filter=${searchTerm}&attribute=${attribute}`);
    const tennisTournaments = await response.json();
    
    const tableBody = document.querySelector("#tournamentsTable tbody");
    tableBody.innerHTML = '';
    
    tennisTournaments.itemListElement.forEach(tennisTournament => {
        const rowElement = document.createElement("tr");
        rowElement.innerHTML = `
            <td>${tennisTournament.additionalProperty[0].value}</td>
            <td>${tennisTournament.naziv}</td>
            <td>${tennisTournament.godina}</td>
            <td>${tennisTournament.additionalProperty[1].value}</td>
        `;
        tableBody.appendChild(rowElement);
    });
}

function applyPlayersFilter() {
    const searchTerm = document.getElementById("filter").value;
    const attribute = document.getElementById("attribute").value;
    getPlayersData(searchTerm, attribute);
}
function applyTournamentsFilter() {
    const searchTerm = document.getElementById("tournamentFilter").value;
    const attribute = document.getElementById("tournamentAttribute").value;
    getTournamentsData(searchTerm, attribute);
}

//funkcija za download u CSV formatu
function downloadCSV() {
    const rows = Array.from(document.querySelectorAll("#tennisTable tbody tr"));
    const csvContent = [];

    rows.forEach(row => {
        const cellData = Array.from(row.querySelectorAll("td")).map(cell => cell.textContent);
        csvContent.push(cellData.join(","));
    });

    const blob = new Blob([csvContent.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "tenisIgraci.csv"; // Ime datoteke
    downloadLink.click();
}

//funkcija za download u JSON formatu
function downloadJSON() {
    const rows = Array.from(document.querySelectorAll("#tennisTable tbody tr"));
    const dataJSON = rows.map(row => {
        const cells = Array.from(row.querySelectorAll("td"));
        return {
            igrac_id: cells[0].textContent,
            ime: cells[1].textContent,
            prezime: cells[2].textContent,
            nacionalnost: cells[3].textContent,
            godine: cells[4].textContent,
            visina_cm: cells[5].textContent,
            tezina_kg: cells[6].textContent,
            najvisi_ranking: cells[7].textContent,
            broj_osvojenih_turnira: cells[8].textContent,
            omiljena_podloga: cells[9].textContent,
            Osvojeni_turniri: cells[10].textContent.split(", ")
        };
    });

    const jsonFile = new Blob([JSON.stringify(dataJSON, null, 2)], { type: "application/json" });
    const jsonLink = document.createElement("a");
    jsonLink.href = URL.createObjectURL(jsonFile);
    jsonLink.download = "tenisIgraci.json"; // Ime datoteke
    jsonLink.click();
}
