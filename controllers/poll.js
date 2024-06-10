const db = require("../routes/db-config")
const bcrypt = require("bcryptjs")

const poll = async (req, res) => {
    const { title, admin_email, deadline, age, candidates } = req.body;

    if (!title || !admin_email || !deadline || !age || !candidates || candidates.length === 0) {
        return res.json({ status: "error", error: "Please provide all required fields." });
    }

    // Insert the poll details into the polls table
    db.query('INSERT INTO polls SET ?', {
        title: title,
        admin_email: admin_email,
        deadline: deadline,
        age_requirement: age
    }, (error, results) => {
        if (error) {
            throw error;
        }

        const pollId = results.insertId;

        // Insert each candidate into the candidates table
        const candidateInserts = candidates.map(candidate => {
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO candidates SET ?', {
                    poll_id: pollId,
                    name: candidate.name
                }, (err, res) => {
                    if (err) return reject(err);
                    resolve(res);
                });
            });
        });

        // Wait for all candidate inserts to complete
        Promise.all(candidateInserts)
            .then(() => {
                return res.json({ status: "success", success: "Poll has been created successfully!", redirectUrl: "/" });
            })
            .catch(err => {
                throw err;
            });
    });
};

module.exports = poll;