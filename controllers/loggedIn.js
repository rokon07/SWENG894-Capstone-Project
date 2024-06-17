const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");

const loggedIn = (req, res, next) => {
    const token = req.cookies.userRegistered;
    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.user = null;
            return next();
        }

        db.query('SELECT * FROM user_data WHERE id = ?', [decoded.id], (err, results) => {
            if (err || !results.length) {
                req.user = null;
                return next();
            }

            req.user = results[0];

            // Fetch polls and attach to req object
            db.query('SELECT * FROM polls', (err, polls) => {
                if (err) {
                    req.polls = [];
                } else {
                    req.polls = polls;
                }
                next();
            });
        });
    });
};

module.exports = loggedIn;
