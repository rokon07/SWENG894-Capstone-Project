const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the home page
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/poll', (req, res) => {
    res.render('poll');
});

app.get('/vote', (req, res) => {
    res.render('vote');
});

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ status: "error", error: "Please enter your email and password!" });
    } else {
        try {
            const [rows] = await db.query('SELECT * FROM user_data WHERE email = ?', [email]);
            if (!rows.length || !await bcrypt.compare(password, rows[0].password)) {
                return res.json({
                    status: "error",
                    error: `Incorrect email or password! Please try again (If not a registered user please register)`
                });
            } else {
                const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                });
                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                };
                res.cookie("userRegistered", token, cookieOptions);
                return res.json({ status: "success", success: "User has been logged in!", redirectUrl: "/" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: "error", error: "Internal server error" });
        }
    }
};

module.exports = login;
