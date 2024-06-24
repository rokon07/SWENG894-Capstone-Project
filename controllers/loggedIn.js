const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");

const loggedIn = async (req, res, next) => {
    const token = req.cookies.userRegistered;
    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [userResults] = await db.query('SELECT * FROM user_data WHERE id = ?', [decoded.id]);

        if (!userResults.length) {
            req.user = null;
            return next();
        }

        req.user = userResults[0];

        // Fetch polls and attach to req object
        const [pollResults] = await db.query('SELECT * FROM polls');

        req.polls = pollResults.length ? pollResults : [];

        next();
    } catch (err) {
        console.error("Error in loggedIn middleware:", err);
        req.user = null;
        req.polls = [];
        next();
    }
};

module.exports = loggedIn;
