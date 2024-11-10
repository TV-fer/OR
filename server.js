const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.static('public'));
const port = 3000;

//uspostava komunikacije s bazom podataka
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'IgraciTenisa',
    password: 'BazePodataka', 
    port: 5433,
});


app.get('/api/tennisPlayers', async (req, res) => {
    try {
        const searchTerm = req.query.filter || '';
        const attribute = req.query.attribute || 'all';

        let query = '';
        let values = [`%${searchTerm}%`]; // Filter za SQL upit

        if (attribute === 'all') {
            // pretraga po svim atributima
            const numericSearch = parseFloat(searchTerm);

            if (isNaN(numericSearch)) {
                query = `
                    SELECT igr.*, 
                        ARRAY_AGG(CONCAT(turn.naziv, ' (', turn.godina, ') - ', turn.povrsina)) AS "Osvojeni_turniri"
                    FROM igraci igr
                    LEFT JOIN turniri turn ON igr.igrac_id = turn.osvojio_id
                    WHERE igr.ime ILIKE $1
                    OR igr.prezime ILIKE $1
                    OR igr.nacionalnost ILIKE $1
                    OR igr.omiljena_podloga ILIKE $1
                    GROUP BY igr.igrac_id;
                `;
            } else {
                query = `
                    SELECT igr.*, 
                        ARRAY_AGG(CONCAT(turn.naziv, ' (', turn.godina, ') - ', turn.povrsina)) AS "Osvojeni_turniri"
                    FROM igraci igr
                    LEFT JOIN turniri turn ON igr.igrac_id = turn.osvojio_id
                    WHERE igr.godine = $1
                    OR igr.visina_cm = $1
                    OR igr.tezina_kg = $1
                    OR igr.najvisi_ranking = $1
                    OR igr.broj_osvojenih_turnira = $1
                    GROUP BY igr.igrac_id;
                `;
                values = [numericSearch]; // Filter kao broj
            }
        } else if (["godine", "visina_cm", "tezina_kg", "najvisi_ranking", "broj_osvojenih_turnira"].includes(attribute)) {
                // filtriranje za brojeve
                const numericSearch = parseFloat(searchTerm);
                if (isNaN(numericSearch)) {
                    return res.status(400).send('Pogrešan unos broja');
                }
                query = `
                    SELECT igr.*, 
                        ARRAY_AGG(CONCAT(turn.naziv, ' (', turn.godina, ') - ', turn.povrsina)) AS "Osvojeni_turniri"
                    FROM igraci igr
                    LEFT JOIN turniri turn ON igr.igrac_id = turn.osvojio_id
                    WHERE igr.${attribute} = $1
                    GROUP BY igr.igrac_id;
                `;
                values = [numericSearch];
            } else {
                // filtriranje za stringove
                query = `
                    SELECT igr.*, 
                        ARRAY_AGG(CONCAT(turn.naziv, ' (', turn.godina, ') - ', turn.povrsina)) AS "Osvojeni_turniri"
                    FROM igraci igr
                    LEFT JOIN turniri turn ON igr.igrac_id = turn.osvojio_id
                    WHERE igr.${attribute} ILIKE $1
                    GROUP BY igr.igrac_id;
                `;
            }
        

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju podataka iz baze:', error);
        res.status(500).send('Greška pri dohvaćanju podataka iz baze');
    }
});

// Pokretanje servera
app.listen(port);