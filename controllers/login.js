const express = require("express")
const register = require("./register")
const login = require("./login")
const logout = require("./logout")
const router = express.Router()

//router.post("/register", register)
//router.post("/login", register)
//router.post("/logout", logout)

module.exports = router;