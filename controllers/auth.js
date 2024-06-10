const express = require("express")
const register = require("./register")
const login = require("./login")
const poll = require("./poll")
const vote = require("./vote")
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/poll", poll)
router.post("/vote", vote)

module.exports = router;