const db = require('./app.js');

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log("Connected to the database");
});

