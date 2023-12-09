const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.post('/', (req, res) => {
    const { load, events } = req.body;
    if (!load || !events || !Array.isArray(events) || events.length === 0) {
        return res.status(400).send('Invalid request data');
    }
    if (!load.Payment || !load.Driver || !load.Rate_Confirmation || !load.Truck_VIN || !load.Dispatcher) {
        return res.status(400).send('Missing required load data');
    }

    // Sort the events array based on the CallOrder property
    events.sort((a, b) => a.CallOrder - b.CallOrder);

    // Check if the first event is a PICKUP and the last event is a DROP-OFF
    if (events[0].EventType !== 'PICKUP' || events[events.length - 1].EventType !== 'DROP-OFF') {
        return res.status(400).send('The first event should be a pickup and the last event should be a drop-off');
    }

    events.forEach((event) => {
        if (!event.State || !event.Country || !event.City || !event.Status || !event.POD) {
            return res.status(400).send('Missing required event data');
        }
    });

    db.query('INSERT INTO Loads SET ?', load, (err, result) => {
        if (err) throw err;
        const loadID = result.insertId;
        events.forEach((event) => {
            event.LoadID = loadID;
            db.query('INSERT INTO Events SET ?', event, (err, result) => {
                if (err) throw err;
            });
        });
        res.status(201).send('Load created');
    });
});

module.exports = router;

