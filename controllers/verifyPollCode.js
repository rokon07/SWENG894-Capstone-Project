const db = require("../routes/db-config");

const verifyPollCode = async (req, res) => {
    const { pollId, pollCode } = req.body;

    if (!pollId) {
        return res.json({ status: "error", error: "Poll ID is required." });
    }

    try {
        const [results] = await db.query('SELECT * FROM polls WHERE id = ? AND code = ?', [pollId, pollCode]);
        if (results.length > 0) {
            return res.json({ status: "success" });
        } else {
            return res.json({ status: "error", error: "Invalid poll code." });
        }
    } catch (error) {
        return res.json({ status: "error", error: "An error occurred while verifying private poll code." });
    }
};

module.exports = verifyPollCode;