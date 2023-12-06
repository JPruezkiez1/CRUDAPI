const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM Loads', (err, loads) => {
        if (err) throw err;
        const loadsWithEvents = [];
        let count = 0;
        if (loads.length === 0) {
            res.status(200).json(loadsWithEvents);
        } else {
            loads.forEach((load) => {
                db.query('SELECT * FROM Events WHERE LoadID = ?', load.LoadID, (err, events) => {
                    if (err) throw err;
                    load.events = events;
                    loadsWithEvents.push(load);
                    count++;
                    if (count === loads.length) {
                        res.status(200).json(loadsWithEvents);
                    }
                });
            });
        }
    });
});

module.exports = router;
