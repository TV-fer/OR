document.getElementById('updatePlayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const igrac_id = document.getElementById('igrac_id').value;
    const attribute = document.getElementById('attribute').value;
    const newValue = document.getElementById('newValue').value;

    const updateData = {
        field: attribute,
        value: isNaN(newValue) ? newValue : parseFloat(newValue),
    };

    try {
        const response = await fetch(`/api/tennisPlayers/${igrac_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        const message = document.getElementById('responseMessage');

        if (response.ok) {
            const responseData = await response.json();
            message.textContent = `Igrač ažuriran uspješno: ${JSON.stringify(responseData)}`;
            message.style.color = 'green';
        } else {
            const errorText = await response.text();
            message.textContent = `Neuspjelo ažuriranje igrača: ${errorText}`;
            message.style.color = 'red';
        }
    } catch (error) {
        const message = document.getElementById('responseMessage');
        message.textContent = `Greška: ${error.message}`;
        message.style.color = 'red';
    }
});
