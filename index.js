const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

const socketService = require('./controllers/socket');
const routes = require('./routes/index');

const app = express();
const server = http.createServer(app);

app.use(compression());

app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // credentials: true
})); 

app.use(express.json());

// Serve static files with compression
app.use('/media/static', express.static(path.join(__dirname, 'media/static')));

app.use(routes);

socketService(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n\x1b[32mServer is running on port\x1b[35m ${PORT}\x1b[0m\nAccess it at:\x1b[34m http://127.0.0.1:${PORT}/\x1b[0m\n`);
});
