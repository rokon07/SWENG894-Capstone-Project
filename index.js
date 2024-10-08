const express = require('express');
const db = require('./routes/db-config');
const app = express();
const cookie = require('cookie-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;

app.use("/js", express.static(path.join(__dirname, "/public/js")));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/images", express.static(path.join(__dirname, "/images")));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookie());
app.use(express.json());

db.getConnection((err) => {
    if (err) {
        throw err;
    }
    console.log("DB is connected");
});

app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth"));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

require('./controllers/updateWinners');
