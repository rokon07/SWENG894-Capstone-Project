const express = require("express");
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");
const vote = require("../controllers/vote");
const pollDetails = require("../controllers/pollDetails");
const pollCandidates = require("../controllers/pollCandidates");
const removePoll = require("../controllers/removePoll");
const verifyPollCode = require("../controllers/verifyPollCode");
const router = express.Router();

router.get("/", loggedIn, (req, res) => {
    if (req.user) {
        res.render("index", { status: "loggedIn", user: req.user, polls: req.polls });
    } else {
        res.render("index", { status: "no", user: "nothing", polls: [] });
    }
});

router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "./public" });
});

router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "./public" });
});

router.get("/poll", (req, res) => {
    res.sendFile("poll.html", { root: "./public" });
});

router.get("/vote", (req, res) => {
    res.sendFile("vote.html", { root: "./public" });
});

router.post("/vote", vote);

router.get("/polls/:id", pollDetails);
router.get("/polls/:id/candidates", pollCandidates);

router.post("/api/remove_poll", removePoll);

router.post("/api/verify_poll_code", verifyPollCode);

router.get("/logout", logout);

module.exports = router;
