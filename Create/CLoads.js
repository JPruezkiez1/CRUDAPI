const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.post('/', async (req, res) => {
    const { load, events } = req.body;
    if (!load || !events || !Array.isArray(events) || events.length === 0) {
        return res.status(400).send('Invalid request data');
    }
    if (!load.Payment || !load.Driver || !load.Rate_Confirmation || !load.Truck_VIN || !load.Dispatcher) {
        return res.status(400).send('Missing required load data');
    }

    events.sort((a, b) => a.CallOrder - b.CallOrder);
    if (events[0].EventType !== 'PICKUP' || events[events.length - 1].EventType !== 'DROP-OFF') {
        return res.status(400).send('The first event should be a pickup and the last event should be a drop-off');
    }

    events.forEach((event) => {
        if (!event.State || !event.Country || !event.City || !event.Status) {
            return res.status(400).send('Missing required event data');
        }
    });
    db.query('INSERT INTO Loads SET ?', load, (err, result) => {
        if (err) throw err;
        const loadID = result.insertId;
        events.forEach(async (event) => {
            event.LoadID = loadID;
            const fetch = await import('node-fetch');
            const response = await fetch.default(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(event.Address)}&key=AIzaSyCztUKCZ4mi0VCHzUAaAtSY3aXMi1sqRYg`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                event.lat = location.lat;
                event.lng = location.lng;
            }
            db.query('INSERT INTO Events SET ?', event, (err, result) => {
                if (err) throw err;
            });
        });
        res.status(201).send('Load created');
    });
});

module.exports = router;
