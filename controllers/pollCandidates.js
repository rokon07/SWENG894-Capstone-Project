const db = require("../routes/db-config");

const pollCandidates = async (req, res) => {
    const pollId = req.params.id;
    try {
        const [results] = await db.query('SELECT * FROM candidates WHERE poll_id = ?', [pollId]);
        res.json({ candidates: results });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = pollCandidates;
