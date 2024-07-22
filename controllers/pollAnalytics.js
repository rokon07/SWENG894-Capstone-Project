const db = require("../routes/db-config");

const pollAnalytics = async (req, res) => {
    const pollId = req.params.id;
    try {
        const [pollResults] = await db.query('SELECT * FROM candidates WHERE poll_id = ?', [pollId]);
        const [pollDetails] = await db.query('SELECT * FROM polls WHERE id = ?', [pollId]);

        if (pollDetails.length === 0) {
            return res.status(404).json({ error: "Poll not found" });
        }

        const pollVotesTable = `votes${pollId}`.trim();

        const [tableCheck] = await db.query(`SHOW TABLES LIKE '${pollVotesTable}'`);
        if (tableCheck.length === 0) {
            return res.redirect('/?error=Data analytics not available due to insufficient data.');
        }

        const [pollVotes] = await db.query(`SELECT * FROM \`${pollVotesTable}\``);
        const [timeSeriesData] = await db.query(`SELECT vote_time, COUNT(*) AS votes FROM \`${pollVotesTable}\` GROUP BY vote_time`);
        const [genderData] = await db.query(`SELECT gender, COUNT(*) AS count FROM \`${pollVotesTable}\` GROUP BY gender`);
        const [raceData] = await db.query(`SELECT race, COUNT(*) AS count FROM \`${pollVotesTable}\` GROUP BY race`);
        const [ageData] = await db.query(`SELECT age, COUNT(*) AS count FROM \`${pollVotesTable}\` GROUP BY age`);
        const [raceCandidateVotes] = await db.query(`SELECT race, candidate_id, COUNT(*) AS votes FROM \`${pollVotesTable}\` GROUP BY race, candidate_id`);

        const genderCounts = {};
        genderData.forEach(row => {
            genderCounts[row.gender] = row.count;
        });

        const raceCounts = {};
        raceData.forEach(row => {
            raceCounts[row.race] = row.count;
        });

        const ageGroupCounts = {};
        ageData.forEach(row => {
            const ageGroup = `${Math.floor(row.age / 10) * 10}-${Math.floor(row.age / 10) * 10 + 9}`;
            if (!ageGroupCounts[ageGroup]) {
                ageGroupCounts[ageGroup] = 0;
            }
            ageGroupCounts[ageGroup] += row.count;
        });

        const raceCandidateVotesData = {};
        raceCandidateVotes.forEach(row => {
            if (!raceCandidateVotesData[row.race]) {
                raceCandidateVotesData[row.race] = {};
            }
            raceCandidateVotesData[row.race][row.candidate_id] = row.votes;
        });

        res.render("analytics", {
            poll: pollDetails[0],
            pollResults,
            pollVotes,
            timeSeriesData,
            genderData: genderCounts,
            raceData: raceCounts,
            ageGroupData: ageGroupCounts,
            raceCandidateVotesData,
        });
    } catch (error) {
        console.error("Error fetching poll analytics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = pollAnalytics;
