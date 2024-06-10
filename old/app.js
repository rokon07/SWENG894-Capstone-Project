const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const url = require('url');

// MySQL Database connection configuration
const db = mysql.createConnection({
    host: "democratic-decisions-db.ch7dn1ddbzmy.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "sweng894",
    database: "democratic_decisions_db",
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        return console.error('Error connecting to the database:', err.message);
    }
    console.log('Connected to the database.');

    // SQL command to create the table if it does not exist
    const createUserTableSql = `
    CREATE TABLE IF NOT EXISTS users_table (
      UserID INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      password_hash VARCHAR(255),
      fname VARCHAR(255),
      lname VARCHAR(255),
      phone VARCHAR(20),
      UserRole VARCHAR(255)
    );
  `;
    // Execute the SQL command
    db.query(createUserTableSql, (err, results, fields) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created or already exists.');
        }
    });
});

// Create the HTTP server
const server = http.createServer(function (req, res) {
    // Determine the file to serve based on the URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Ensure the file path is safe
    filePath = path.resolve(__dirname, filePath);

    // Determine the content type based on the file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read and serve the file
    fs.readFile(filePath, function (error, data) {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                fs.readFile(path.resolve(__dirname, './404.html'), function (error404, data404) {
                    if (error404) {
                        res.writeHead(500);
                        res.end('500 Internal Server Error');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(data404, 'utf-8');
                    }
                });
            } else {
                // Some server error
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data, 'utf-8');
        }
    });
});
const port = 3000;

// Start the server
server.listen(port, function (error) {
    if (error) {
        console.error("Error occurred:", error);
    } else {
        console.log("Server is listening on port " + port);
    }
});
