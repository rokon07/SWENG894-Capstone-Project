const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const url = require('url');
const dotenv = require("dotenv").config();

// MySQL Database connection configuration
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || "3306",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

module.exports = db;