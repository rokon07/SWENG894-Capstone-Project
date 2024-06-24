const db = require("../routes/db-config");

const pollDetails = async (req, res) => {
    const pollId = req.params.id;
    try {
        const [results] = await db.query('SELECT * FROM polls WHERE id = ?', [pollId]);
        if (results.length > 0) {
            res.json({ poll: results[0] });
        } else {
            res.status(404).json({ error: 'Poll not found' });
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = pollDetails;

