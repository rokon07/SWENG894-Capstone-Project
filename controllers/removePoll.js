const db = require("../routes/db-config");

const removePoll = async (req, res) => {
    const { pollId } = req.body;

    if (!pollId) {
        return res.json({ status: "error", error: "You have no ongoing polls to delete!" });
    }

    try {
        // Delete votes table for the poll
        const pollVotesTable = `votes${pollId}`.trim();
        await db.query(`DROP TABLE IF EXISTS ${pollVotesTable}`);

        // Delete candidates for the poll
        await db.query(`DELETE FROM candidates WHERE poll_id = ?`, [pollId]);

        // Delete the poll
        await db.query(`DELETE FROM polls WHERE id = ?`, [pollId]);

        return res.json({ status: "success", success: "Poll and related data have been removed successfully!", redirectUrl: "/" });

    } catch (error) {
        return res.json({ status: "error", error: "An error occurred while removing the poll." });
    }
};

module.exports = removePoll;
