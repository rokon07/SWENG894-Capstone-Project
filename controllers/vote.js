const db = require("../routes/db-config");

const vote = async (req, res) => {
    const { pollId, candidateId, candidateName, userId, userEmail } = req.body;
    if (!pollId || !candidateId || !candidateName || !userId || !userEmail) {
        return res.json({ status: "error", error: "Please select a candidate." });
    }

    const pollVotesTable = `poll_${pollId}_votes`;

    // Ensure the votes table for this poll exists
    db.query(
        `CREATE TABLE IF NOT EXISTS ${pollVotesTable} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            user_email VARCHAR(255) NOT NULL,
            candidate_id INT NOT NULL,
            candidate_name VARCHAR(255) NOT NULL,
            vote_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_vote (user_id)
        )`,
        (err) => {
            if (err) {
                throw err;
            }

            // Check if the user has already voted in this poll
            db.query(
                `SELECT * FROM ${pollVotesTable} WHERE user_id = ?`,
                [userId],
                (error, results) => {
                    if (error) {
                        throw error;
                    }

                    if (results.length > 0) {
                        return res.json({ status: "error", error: "You have already voted in this poll." });
                    } else {
                        // Insert the vote into the poll's votes table
                        db.query(
                            `INSERT INTO ${pollVotesTable} (user_id, user_email, candidate_id, candidate_name) VALUES (?, ?, ?, ?)`,
                            [userId, userEmail, candidateId, candidateName],
                            (error, results) => {
                                if (error) {
                                    throw error;
                                }

                                // Update the vote count in the candidates table
                                db.query(
                                    `UPDATE candidates SET votes = votes + 1 WHERE id = ?`,
                                    [candidateId],
                                    (error) => {
                                        if (error) {
                                            throw error;
                                        }
                                        return res.json({ status: "success", success: "Your vote has been submitted! Thanks for participating!" });
                                    }
                                );
                            }
                        );
                    }
                }
            );
        }
    );
};

module.exports = vote;
