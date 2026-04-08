require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");

const app = require("./src/app");
const initSocket = require("./src/controllers/socketController");
const loadData = require("./src/utils/loadData");

const server = http.createServer(app);

mongoose.connect(process.env.ATLASDB_URL)
    .then(() => console.log("DB Connected"))
    .catch(err => {
        console.error("DB Error:", err.message);
    });

initSocket(server);
const PORT = 3002;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    loadData().catch(err => console.error("Failed to load initial data:", err.message));
});