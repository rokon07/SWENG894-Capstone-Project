const db = require("../routes/db-config");

const pollCandidates = (req, res) => {
    const pollId = req.params.id;
    db.query('SELECT * FROM candidates WHERE poll_id = ?', [pollId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ candidates: results });
    });
};

module.exports = pollCandidates;
