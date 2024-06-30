const db = require("../routes/db-config");
const crypto = require('crypto');

const generatePollCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

const poll = async (req, res) => {
    const { title, admin_email, deadline, age, polltype, enableAnonymous, candidates } = req.body;

    if (!title || !admin_email || !deadline || !age || !candidates || candidates.length === 0) {
        return res.json({ status: "error", error: "Please provide all required fields. Ensure candidates are added!" });
    }

    let code = null;
    if (polltype === 'Private') {
        code = generatePollCode();
    }

    try {
        // Insert the poll details into the polls table
        const [result] = await db.query('INSERT INTO polls SET ?', {
            title: title,
            admin_email: admin_email,
            deadline: deadline,
            age_requirement: age,
            poll_type: polltype,
            enable_anonymous: enableAnonymous ? 1 : 0,
            code: code
        });

        const pollId = result.insertId;

        // Insert each candidate into the candidates table
        const candidateInserts = candidates.map(candidate => {
            return db.query('INSERT INTO candidates SET ?', {
                poll_id: pollId,
                name: candidate
            });
        });

        // Wait for all candidate inserts to complete
        await Promise.all(candidateInserts);

        return res.json({ status: "success", success: `Poll has been created successfully!${code ? ' Poll Code: ' + code : ''}`, redirectUrl: "/" });
    } catch (error) {
        console.error("Error during poll creation:", error);
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
};

module.exports = poll;
