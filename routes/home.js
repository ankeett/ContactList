const express = require('express');
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

router.get('/', async (req, res) => {
    const places = await req.db.findPlaces();
    res.render('home', { places });
}
);

router.get('/places', async (req, res) => {
    const places = await req.db.findPlaces();
    res.json(places);
});

router.post('/', async (req, res) => {
    res.render('home');
});




module.exports = router;