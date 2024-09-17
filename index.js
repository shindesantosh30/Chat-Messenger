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

app.get('/', (req, res) => {
    res.send('Server is working!');
});

app.use(routes);

socketService(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nAccess it at: http://127.0.0.1:${PORT}/`);
});
