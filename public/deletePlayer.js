document.getElementById('deletePlayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const igrac_id = document.getElementById('igrac_id').value;

    try {
        const response = await fetch(`/api/tennisPlayers/${igrac_id}`, {
            method: 'DELETE',
        });

        const message = document.getElementById('responseMessage');

        if (response.ok) {
            message.textContent = `Igrač s ID-em ${igrac_id} uspješno izbrisan.`;
            message.style.color = 'green';
        } else {
            const errorText = await response.text();
            message.textContent = `Neuspjelo brisanje igrača: ${errorText}`;
            message.style.color = 'red';
        }
    } catch (error) {
        const message = document.getElementById('responseMessage');
        message.textContent = `Greška: ${error.message}`;
        message.style.color = 'red';
    }
});
