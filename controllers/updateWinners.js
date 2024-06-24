const db = require("../routes/db-config");
const cron = require("node-cron");

const updateWinners = async () => {
    try {
        const [polls] = await db.query(`SELECT id FROM polls WHERE deadline < NOW() AND winner IS NULL`);

        if (!polls || polls.length === 0) {
            console.log("No polls found with past deadlines and no winner.");
            return;
        }

        for (let poll of polls) {
            const [candidates] = await db.query(
                `SELECT name, votes FROM candidates WHERE poll_id = ? ORDER BY votes DESC LIMIT 1`,
                [poll.id]
            );

            if (candidates && candidates.length > 0) {
                const winner = candidates[0].name;
                await db.query(`UPDATE polls SET winner = ? WHERE id = ?`, [winner, poll.id]);
                console.log(`Updated winner for poll ID ${poll.id}: ${winner}`);
            } else {
                console.log(`No candidates found for poll ID ${poll.id}`);
            }
        }

        console.log("Winners updated successfully.");
    } catch (error) {
        console.error("Error updating winners:", error);
    }
};

// Schedule the task to run every minute
cron.schedule("* * * * *", updateWinners);

updateWinners(); // Also run it immediately on startup

module.exports = updateWinners;
