const db = require("../routes/db-config");

const pollDetails = (req, res) => {
    const pollId = req.params.id;
    db.query('SELECT * FROM polls WHERE id = ?', [pollId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            res.json({ poll: results[0] });
        } else {
            res.status(404).json({ error: 'Poll not found' });
        }
    });
};

module.exports = pollDetails;
