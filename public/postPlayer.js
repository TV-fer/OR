document.getElementById('addTournament').addEventListener('click', function () {
    const tournamentsList = document.getElementById('tournamentsList');

    const tournamentDiv = document.createElement('div');
    tournamentDiv.classList.add('tournament');

    tournamentDiv.innerHTML = `
        <label>Naziv:</label>
        <input type="text" name="naziv" required>
        <label>Godina:</label>
        <input type="number" name="godina" required>
        <label>Površina:</label>
        <input type="text" name="povrsina" required>
        <button type="button" class="removeTournament">Izbrisi</button>
        <br>
    `;
    tournamentsList.appendChild(tournamentDiv);

    // Add event listener for remove button
    tournamentDiv.querySelector('.removeTournament').addEventListener('click', function () {
        tournamentsList.removeChild(tournamentDiv);
    });
});

document.getElementById('addPlayerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from reloading the page

    const playerData = {
        ime: document.getElementById('ime').value,
        prezime: document.getElementById('prezime').value,
        nacionalnost: document.getElementById('nacionalnost').value,
        godine: parseInt(document.getElementById('godine').value, 10),
        visina_cm: parseInt(document.getElementById('visina_cm').value, 10),
        tezina_kg: parseInt(document.getElementById('tezina_kg').value, 10),
        najvisi_ranking: parseInt(document.getElementById('najvisi_ranking').value, 10),
        broj_osvojenih_turnira: parseInt(document.getElementById('broj_osvojenih_turnira').value, 10),
        omiljena_podloga: document.getElementById('omiljena_podloga').value,
        turniri: [],
    };

    // Collect tournaments
    const tournamentsDivs = document.querySelectorAll('.tournament');
    tournamentsDivs.forEach((div) => {
        const naziv = div.querySelector('input[name="naziv"]').value;
        const godina = parseInt(div.querySelector('input[name="godina"]').value, 10);
        const povrsina = div.querySelector('input[name="povrsina"]').value;

        playerData.turniri.push({ naziv, godina, povrsina });
    });
    console.log(playerData)
    try {
        const response = await fetch('/api/tennisPlayers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData),
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('responseMessage').innerText = `Igrač dodan uspješno`//: ${result.ime} ${result.prezime}`;
        } else {
            const error = await response.text();
            document.getElementById('responseMessage').innerText = `Pogreška: ${error}`;
        }
    } catch (error) {
        console.error('Neuspjelo dodavanje igrača:', error);
        document.getElementById('responseMessage').innerText = 'Dogodila se pogreška tijekom dodavanja igrača.';
    }
});
