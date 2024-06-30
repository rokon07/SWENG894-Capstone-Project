const db = require("../routes/db-config");
const crypto = require('crypto');

const vote = async (req, res) => {
    const { pollId, candidateId, candidateName, userId, userEmail } = req.body;
    if (!pollId || !candidateId || !candidateName || !userId || !userEmail) {
        return res.json({ status: "error", error: "Please select a candidate." });
    }

    const pollVotesTable = `votes${pollId}`.trim();

    try {
        // Ensure the votes table for this poll exists
        await db.query(
            `CREATE TABLE IF NOT EXISTS \`${pollVotesTable}\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                candidate_id INT NOT NULL,
                candidate_name VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                gender VARCHAR(255) NOT NULL,
                race VARCHAR(255) NOT NULL,
                vote_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_vote (user_id)
            )`
        );

        // Check if the poll is anonymous
        const [pollResults] = await db.query('SELECT enable_anonymous FROM polls WHERE id = ?', [pollId]);
        const isAnonymous = pollResults[0]?.enable_anonymous;

        let finalUserEmail = userEmail;
        let finalGender, finalRace;

        // Fetch the user's details
        const [userDetails] = await db.query('SELECT dob, gender, race FROM user_data WHERE id = ?', [userId]);
        if (userDetails.length === 0) {
            return res.status(404).json({ status: "error", error: "User not found." });
        }
        const user = userDetails[0];

        // Calculate the user's age
        const dob = new Date(user.dob);
        let age = new Date().getFullYear() - dob.getFullYear();
        const m = new Date().getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && new Date().getDate() < dob.getDate())) {
            age--;
        }

        if (isAnonymous) {
            // Generate a unique anonymous voter email
            const [anonVotesCount] = await db.query(
                `SELECT COUNT(*) AS count FROM \`${pollVotesTable}\` WHERE user_email LIKE 'anonymous_voter_%'`
            );
            const anonymousCount = anonVotesCount[0].count + 1;
            finalUserEmail = `anonymous_voter_${anonymousCount}`;

            // Hash the user details
            finalUserEmail = crypto.createHash('sha256').update(finalUserEmail).digest('hex');
            finalGender = crypto.createHash('sha256').update('gender_' + userId).digest('hex');
            finalRace = crypto.createHash('sha256').update('race_' + userId).digest('hex');
        } else {
            finalGender = user.gender;
            finalRace = user.race;
        }

        // Check if the user has already voted in this poll
        const [userVotes] = await db.query(
            `SELECT * FROM \`${pollVotesTable}\` WHERE user_id = ?`,
            [userId]
        );

        if (userVotes.length > 0) {
            return res.json({ status: "error", error: "You have already voted in this poll! Going back to home.", redirectUrl: "/" });
        } else {
            // Insert the vote into the poll's votes table
            await db.query(
                `INSERT INTO \`${pollVotesTable}\` (user_id, user_email, candidate_id, candidate_name, age, gender, race) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, finalUserEmail, candidateId, candidateName, age, finalGender, finalRace]
            );

            // Update the vote count in the candidates table
            await db.query(
                `UPDATE candidates SET votes = votes + 1 WHERE id = ?`,
                [candidateId]
            );

            return res.json({ status: "success", success: "Your vote has been submitted! Thanks for participating!", redirectUrl: "/" });
        }
    } catch (error) {
        console.error("Error during vote operation:", error);
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
};

module.exports = vote;
