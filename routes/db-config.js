const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const url = require('url');
const dotenv = require("dotenv").config();

// MySQL Database connection configuration
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: "3306",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

module.exports = db;