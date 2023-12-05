const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.post('/', (req, res) => {
    const { load, events } = req.body;
    if (!load || !events || !Array.isArray(events) || events.length === 0) {
        return res.status(400).send('Invalid request data');
    }
    if (events[0].EventType !== 'PICKUP' || events[events.length - 1].EventType !== 'DROP-OFF') {
        return res.status(400).send('The first event should be a pickup and the last event should be a drop-off');
    }
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
