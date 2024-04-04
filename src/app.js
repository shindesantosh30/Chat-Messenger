const path = require('path');
const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentsRoutes');
const employeeRouter = require('./routes/employeeRouter');
const rolesRouter = require('./routes/rolesRouter');
const companyRouter = require('./routes/companyRouter');


const {BASE_URL} = require("./utillity/constants");
const { request, METHODS } = require('http');
const { fileLoader } = require('ejs');

// app.set('models', path.join(__dirname, '..', 'models'));

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

/* Routers */
app.use(`${BASE_URL}/users`, userRoutes);
app.use(`${BASE_URL}/students`, studentRoutes);
app.use(`${BASE_URL}/employee`, employeeRouter);
app.use(`${BASE_URL}/role`, rolesRouter);
app.use(`${BASE_URL}/company`, companyRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

//https://www.techtarget.com/searchdatamanagement/definition/MongoDB
