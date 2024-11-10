// Pozovi getData kada se stranica učita za početni prikaz podataka
window.onload = () => getData();

async function getData(searchTerm = '', attribute = '') {
    const response = await fetch(`/api/tennisPlayers?filter=${searchTerm}&attribute=${attribute}`);
    const tennisPlayers = await response.json();
    
    const tableBody = document.querySelector("#tennisTable tbody");
    tableBody.innerHTML = '';
    
    tennisPlayers.forEach(tennisPlayer => {
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
    });
}

// Funkcija za filtriranje podataka
function applyFilter() {
    const searchTerm = document.getElementById("filter").value;
    const attribute = document.getElementById("attribute").value;

    getData(searchTerm, attribute);
}

function downloadCSV() {
    const rows = Array.from(document.querySelectorAll("#tennisTable tbody tr"));
    const csvContent = [];

    // Dodajemo podatke iz tablice
    rows.forEach(row => {
        const cellData = Array.from(row.querySelectorAll("td")).map(cell => cell.textContent);
        csvContent.push(cellData.join(","));
    });

    // Kreiraj CSV datoteku
    const blob = new Blob([csvContent.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "tenisIgraci.csv"; // Ime datoteke
    downloadLink.click();
}

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
