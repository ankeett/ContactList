const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const Database = require('./db');
const db = new Database();
db.initialize();

const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.db = db;
    next();
});


app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use((req, res, next) => {
    if(req.session.user){
        res.locals.user = {
            id: req.session.user.id,
            username: req.session.user.username,
        }
    }
    next();
});

app.use('/', require('./routes/home'));
app.use('/', require('./routes/accounts'));

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
