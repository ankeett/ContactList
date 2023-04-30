const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const hash = require('../bcrypt.js');
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

router.get('/login', async (req, res) => {
    res.render('login'),{hide_login: true};
});

router.post('/login', async (req, res) => {
    const {username,password} = req.body;
    console.log(username,password);

    const user = await req.db.findUserByUsername(username);
    if(user && bcrypt.compareSync(password,user.password)){
        req.session.user = user;
        res.redirect('/');
        return; 
    }
    else{
        res.render('login',{hide_login: true,message: 'Invalid username or password'});
        return;
    }
});

router.get('/logout', async (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

router.get('/signup', async (req, res) => {
    res.render('signup',{hide_login: true});
});

router.post('/signup', async (req, res) => {
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();

    if(firstname == '' || lastname == '' || username == '' || p1 == '' || p2 == ''){
        res.render('signup',{hide_login: true,message: 'Please fill out all fields'});
        return;
    }
    if(p1 != p2){
        res.render('signup',{hide_login: true,message: 'Passwords do not match'});
        return;
    }
    const user = await req.db.findUserByUsername(username);
    if(user){
        res.render('signup',{hide_login: true,message: 'Username already exists'});
        return;
    }
    const id = await req.db.createUser(firstname,lastname,username,hash(p1));
    req.session.user = await req.db.findUserById(id);
    res.redirect('/');
    
});


router.get('/create', async (req, res) => {
    const user = req.session.user;
    if(!user){
        res.redirect('/login');
        return;
    }
    res.render('create', { hide_login: false });
});

router.post('/create',async (req, res) => {
    const title = req.body.title.trim();
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const address = req.body.address.trim();
    const contact_by_email = req.body.contact_by_email ? 1 : 0;
    const contact_by_phone = req.body.contact_by_phone ? 1 : 0;
    const contact_by_mail = req.body.contact_by_mail ? 1 : 0;

    if(title == '' || firstname == '' || lastname == '' || phone == '' || email == '' || address == ''){
        res.render('create', { message: 'Please fill out all fields' });
        return;
    }

    const geog = await geocoder.geocode(address);
    if(geog.length > 0){
        const latitude = geog[0].latitude;
        const longitude = geog[0].longitude;
        const address1 = geog[0].formattedAddress;
        const id = await req.db.createPlace( title,firstname, lastname, address1,phone,email,contact_by_email,contact_by_phone,contact_by_mail, latitude, longitude);
        const places ={
            id,
            title,
            firstname,
            lastname,
            phone,
            email,
            contact_by_email,
            contact_by_phone,
            contact_by_mail,
            address,
            latitude,
            longitude
        }
        res.redirect('/');
    }
    else{
        res.render('create', { message: 'Invalid address' });
    }
    
});

router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const places = await req.db.findPlaceById(id);
    if(req.session.user !== undefined){
        res.render('edit', { places });
    }
    else{
        res.render('authorized')
        return;
    }
});

router.post('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const title = req.body.title.trim();
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const address = req.body.address.trim();
    const contact_by_email = req.body.contact_by_email ? 1 : 0;
    const contact_by_phone = req.body.contact_by_phone ? 1 : 0;
    const contact_by_mail = req.body.contact_by_mail ? 1 : 0;
    const geog = await geocoder.geocode(address);
    if(geog.length > 0){
        const latitude = geog[0].latitude;
        const longitude = geog[0].longitude;
        const address1 = geog[0].formattedAddress;
        await req.db.updatePlace(id, title,firstname, lastname, address1,phone,email,contact_by_email,contact_by_phone,contact_by_mail, latitude, longitude);
        const places ={
            id,
            title,
            firstname,
            lastname,
            phone,
            email,
            contact_by_email,
            contact_by_phone,
            contact_by_mail,
            address,
            latitude,
            longitude
        }
        res.redirect('/');
    }
    else{
        res.render('edit', { message: 'Invalid address' });
    }
});

router.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    const places = await req.db.findPlaceById(id);
    if(req.session.user !== undefined){
        res.render('delete', { places });
    }
    else{
        res.render('authorized')
        return;
    }

});

router.post('/:id/delete', async (req, res) => {
    const id = req.params.id;
    await req.db.deletePlace(id);
    res.redirect('/');
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const places = await req.db.findPlaceById(id);
    //check contact exists
    if(!places){
        res.render('notfound');
        return;
    }
    res.render('page', { places });
});

module.exports = router;
