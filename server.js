const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.static('public'));
const port = 3000;

const pool = new Pool({
    user: 'postgres',  // Vaše korisničko ime
    host: 'localhost',
    database: 'IgraciTenisa',
    password: 'BazePodataka',  // Ovdje ide vaša lozinka
    port: 5433,
});

const { parse } = require('json2csv'); // json2csv paket za generiranje CSV             JEL OVO UOPCE POTREBNO

app.get('/api/tennisPlayers', async (req, res) => {
    try {
        const searchTerm = req.query.filter || '';
        const attribute = req.query.attribute || 'all';

        let query = '';
        let values = [`%${searchTerm}%`]; // Filter za SQL upit

        if (attribute === 'all') {
            // Wildcard pretraga za sve atribute
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
                // Number attribute filtering
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
                // String attribute filtering
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



/*
app.get('/api/tennisPlayers/csv', async (req, res) => {
    try {
        const filter = req.query.filter || '';
        const attribute = req.query.attribute || 'Ime';

        let query = '';
        let values = [%${filter}%]; // Filter za SQL upit

        if (attribute === 'all') {
            // Wildcard pretraga za sve atribute

            const filterValue1 = parseFloat(filter);
            if (isNaN(filterValue1)) {
                query = `
                    SELECT n.*, 
                        ARRAY_AGG(r."dan" || ': ' || r."otvaranje" || ' - ' || r."zatvaranje") AS "Radno_vrijeme"
                    FROM nightclubs n
                    LEFT JOIN radno_vrijeme r ON n.id = r.nightclub_id
                    WHERE n."ime" ILIKE $1
                    OR n."adresa" ILIKE $1
                    OR n."kvart" ILIKE $1
                    
                    GROUP BY n.id;
                `;
                }
            else{
                query = `
                    SELECT n.*, 
                        ARRAY_AGG(r."dan" || ': ' || r."otvaranje" || ' - ' || r."zatvaranje") AS "Radno_vrijeme"
                    FROM nightclubs n
                    LEFT JOIN radno_vrijeme r ON n.id = r.nightclub_id
                    WHERE n."kapacitet" = $1
                    OR n."recenzija" = $1
                    OR n."minimalna_dob_ulaza" = $1
                    GROUP BY n.id;
                `;
                values = [filterValue1]; // Filter kao bro
            } 
                
            } else if (["Kapacitet", "Recenzija", "Minimalna_dob_ulaza"].includes(attribute)) {
                // Filtriranje za brojčane atribute
                const filterValue = parseFloat(filter);
                if (isNaN(filterValue)) {
                    return res.status(400).send('Pogrešan unos broja');
                }
                query = `
                    SELECT n.*, 
                        ARRAY_AGG(r."dan" || ': ' || r."otvaranje" || ' - ' || r."zatvaranje") AS "Radno_vrijeme"
                    FROM nightclubs n
                    LEFT JOIN radno_vrijeme r ON n.id = r.nightclub_id
                    WHERE n.${attribute} = $1
                    
                    GROUP BY n.id;
                `;
                values = [filterValue]; // Filter kao broj
            } else {
                // Filtriranje po odabranom string atributu
                query = `
                    SELECT n.*, 
                        ARRAY_AGG(r."dan" || ': ' || r."otvaranje" || ' - ' || r."zatvaranje") AS "Radno_vrijeme"
                    FROM nightclubs n
                    LEFT JOIN radno_vrijeme r ON n.id = r.nightclub_id
                    WHERE n.${attribute} ILIKE $1
                    GROUP BY n.id;
                `;
            }

            const result = await pool.query(query, values);
            res.json(result.rows);

        // Konvertiranje u CSV
        const csv = parse(clubs);  // json2csv metoda za konvertiranje JSON u CSV
        
        // Slanje CSV datoteke
        res.header('Content-Type', 'text/csv');
        res.attachment('club_data.csv');
        res.send(csv);
        res.json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju podataka:', error);
        res.status(500).send('Greška pri dohvaćanju podataka');
    }
});

*/

// Pokretanje servera
app.listen(port);