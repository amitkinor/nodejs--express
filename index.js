const debug = require('debug')('app:startup');
const config = require('config');
const Joi = require('joi');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger.js');
const courses = require('./routes/courses.js');
const home = require('./routes/home.js');
const app = express();

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use('/', home);
app.use('/api/courses', courses);

// getting cred from config module
console.log('Applicationi Name: ' + config.get('name'));
console.log('mail host Name: ' + config.get('mail.host'));
console.log('mail Password: ' + config.get('password'));

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled');
}

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listing on port ${port}...`));