const express = require('express');
const app = express();
const db = require("./routes/db-config");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    let status = "loggedOut";
    let user = null;

    const token = req.cookies.userRegistered;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (!err) {
                status = "loggedIn";
                user = decoded;
            }
        });
    }

    db.query('SELECT * FROM polls', (err, polls) => {
        if (err) throw err;
        res.render('index', { status, user, polls });
    });
});

// Serve static files (if needed)
app.use(express.static('public'));

// Example routes for register and login
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
