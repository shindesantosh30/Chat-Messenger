const express = require('express');
const http = require('http');
const cors = require('cors');

const initializeSocket = require('./controllers/socket')
const routes = require('./routes/index')

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // credentials: true
})); 

app.use(express.json());
app.use(express.static('public'));

app.use(routes)

initializeSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nAccess it at: http://127.0.0.1:${PORT}/`);
});

