const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
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

//GET--------------------------------------------------------------------------------------------------
app.get('/api/allTennisPlayers', async (req,res) => {   //DOHVAĆANJE CJELOKUPNE KOLEKCIJE
    try {
        let values = [];
        query = `
            SELECT igr.*, 
                ARRAY_AGG(CONCAT(turn.naziv, ' (', turn.godina, ') - ', turn.povrsina)) AS "Osvojeni_turniri"
            FROM igraci igr
            LEFT JOIN turniri turn ON igr.igrac_id = turn.osvojio_id
            GROUP BY igr.igrac_id;
        `;
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju svih podataka iz baze:', error);
        res.status(500).send('Greška pri dohvaćanju svih podataka iz baze');
    }
})

app.get(`/api/allTennisTournaments`, async (req,res) => { //DOHVAĆANJE SVIH TURNIRA
    try {
        let values = [];
        query = `
            SELECT turniri.*
            FROM turniri
            GROUP BY turnir_id
            ORDER BY turnir_id
        `;
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log('Greška pri dohvaćanju svih turnira iz baze:', error);
        res.status(500).send('Greška pri dohvaćanju svih turnira iz baze');
    }
})

app.get('/api/singleTennisPlayer', async (req,res) => { //DOHVAĆANJE POJEDINAČNOG RESURSA (IGRAČA)
    try {
        const searchTerm = req.query.igrac_id || '';
        const numericTerm = parseInt(searchTerm)
        let values = [numericTerm];
        let query = '';
        query = `
            SELECT igr.*, 
                ARRAY_AGG(CONCAT(turn.naziv, ' (', turn.godina, ') - ', turn.povrsina)) AS "Osvojeni_turniri"
            FROM igraci igr
            LEFT JOIN turniri turn ON igr.igrac_id = turn.osvojio_id
            WHERE igr.igrac_id = $1
            GROUP BY igr.igrac_id;
        `;
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('No data found');
        }
    } catch (error) {
        console.log('Greška pri dohvaćanju pojedinog igrača iz baze:', error);
        res.status(500).send('Greška pri dohvaćanju pojedinog igrača iz baze');
    }
})

app.get(`/api/singleTennisTournament`, async (req,res) => { //DOHVAĆANJE POJEDINAČNOG TURNIRA
    try {
        const searchTerm = req.query.turnir_id || '';
        const numericTerm = parseInt(searchTerm)
        let values = [numericTerm];
        query = `
            SELECT turniri.*
            FROM turniri
            WHERE turnir_id = $1
            GROUP BY turnir_id
        `;
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('No data found');
        }
    } catch (error) {
        console.log('Greška pri dohvaćanju pojedinog turnira iz baze:', error);
        res.status(500).send('Greška pri dohvaćanju pojedinog turnira iz baze');
    }
})

app.get(`/api/tennisTournaments`, async (req,res) => { //DOHVAĆANJE FILTRIRANIH TURNIRA
    try {
        const searchTerm = req.query.filter || '';
        const attribute = req.query.attribute;
        let query = '';
        let values = [`%${searchTerm}%`]; // Filter za SQL upit
        const numericSearch = parseInt(searchTerm)
        if (isNaN(numericSearch)) {
            query = `
                SELECT turniri.*
                FROM turniri
                WHERE ${attribute} ILIKE $1
                GROUP BY turnir_id;
            `;
        } else {
            query = `
                SELECT turniri.*
                FROM turniri
                WHERE ${attribute} = $1
                GROUP BY turnir_id;
            `;
            values = [numericSearch]; // Filter kao broj
        }
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju filtriranih turnira iz baze:', error);
        res.status(500).send('Greška pri dohvaćanju filtriranih turnira iz baze');
    }
})

app.get('/api/tennisPlayers', async (req, res) => { //DOHVAĆANJE FILTRIRANIH RESURSA
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
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju filtriranih podataka (igraca) iz baze:', error);
        res.status(500).send('Greška pri dohvaćanju filtriranih podataka (igraca) iz baze');
    }
});


//POST--------------------------------------------------------------------------------------------------
app.post('/api/tennisPlayers', async (req, res) => {
    try {
        const {
            ime, prezime, nacionalnost, godine, visina_cm,
            tezina_kg, najvisi_ranking, broj_osvojenih_turnira,
            omiljena_podloga, turniri
        } = req.body;

        // Validate required fields except `igrac_id`
        if (!ime || !prezime || !nacionalnost || !godine ||
            !visina_cm || !tezina_kg || !najvisi_ranking ||
            !broj_osvojenih_turnira || !omiljena_podloga || !Array.isArray(turniri)) {
            return res.status(400).send('Nedostaju obavezna polja.');
        }

        // Fetch the maximum existing `igrac_id`
        const maxIgracIdResult = await pool.query('SELECT MAX(igrac_id) AS max_id FROM igraci');
        let nextIgracId = (maxIgracIdResult.rows[0].max_id || 0) + 1;

        // Insert player into `igraci` table
        const playerQuery = `
            INSERT INTO igraci (
                igrac_id, ime, prezime, nacionalnost, godine, visina_cm,
                tezina_kg, najvisi_ranking, broj_osvojenih_turnira, omiljena_podloga
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const playerValues = [
            nextIgracId, ime, prezime, nacionalnost, godine,
            visina_cm, tezina_kg, najvisi_ranking,
            broj_osvojenih_turnira, omiljena_podloga
        ];
        const playerResult = await pool.query(playerQuery, playerValues);

        // Fetch the maximum existing `turnir_id`
        const maxTurnirIdResult = await pool.query('SELECT MAX(turnir_id) AS max_id FROM turniri');
        let nextTurnirId = maxTurnirIdResult.rows[0].max_id || 0;

        // Insert associated tournaments into `turniri` table
        const tournamentQuery = `
            INSERT INTO turniri (turnir_id, naziv, godina, povrsina, osvojio_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        for (const tournament of turniri) {
            const { naziv, godina, povrsina } = tournament;

            // Validate tournament data
            if (!naziv || !godina || !povrsina) {
                return res.status(400).send('Pogrešan format turnira.');
            }

            // Auto-increment turnir_id
            nextTurnirId++;

            const tournamentValues = [nextTurnirId, naziv, godina, povrsina, nextIgracId];
            await pool.query(tournamentQuery, tournamentValues);
        }

        res.status(201).json({
            message: 'Igrač i turnir dodani uspješno.',
            player: playerResult.rows[0]
        });
    } catch (error) {
        console.error('Pogreška u dodavanju igrača i turnira:', error);
        res.status(500).send('Pogreška u dodavanju igrača i turnira.');
    }
});



//PUT--------------------------------------------------------------------------------------------------
app.put('/api/tennisPlayers/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const { field, value } = req.body; 

        const validFields = [
            'ime', 'prezime', 'nacionalnost', 'omiljena_podloga', 'godine',
            'visina_cm', 'tezina_kg', 'najvisi_ranking', 'broj_osvojenih_turnira'
        ];

        if (!validFields.includes(field)) {
            return res.status(400).send('Pogrešno polje za ažuriranje.');
        }

        if (value === undefined) {
            return res.status(400).send('Potrebna je nova vrijednost za ažuriranje.');
        }

        const query = `
            UPDATE igraci
            SET ${field} = $1
            WHERE igrac_id = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [value, id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Igrač nije pronađen.');
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Pogreška u ažuriranju igrača:', error);
        res.status(500).send('Pogreška u ažuriranju igrača.');
    }
});

//DELETE--------------------------------------------------------------------------------------------------
app.delete('/api/tennisPlayers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleteTournamentsQuery = `
            DELETE FROM turniri
            WHERE osvojio_id = $1;
        `;
        await pool.query(deleteTournamentsQuery, [id]);

        const deletePlayerQuery = `
            DELETE FROM igraci
            WHERE igrac_id = $1
            RETURNING *;
        `;
        const result = await pool.query(deletePlayerQuery, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Igrač nije nađen.');
        }

        res.status(200).send('Igrač i povezani turnir uspješno izbrisani.');
    } catch (error) {
        console.error('Pogreška prilikom brisanja igrača:', error);
        res.status(500).send('Pogreška prilikom brisanja igrača.');
    }
});


app.listen(port);