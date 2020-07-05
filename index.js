const debug = require('debug')('app:startup');
const config = require('config');
const Joi = require('joi');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger.js');

const app = express();

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled');
}

//Config
console.log('Applicationi Name: ' + config.get('name'));
console.log('mail host Name: ' + config.get('mail.host'));
console.log('mail Password: ' + config.get('password'));




const courses = [
    {  id: 1 , name: 'course1' },
    {  id: 2 , name: 'course2' },
    {  id: 3 , name: 'course3' }
];


//////  getters

app.get('/', (req,res) => {
    res.render('index', {title: 'My Express App', message:'Hello'});
});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req,res)=> {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The id was not found');
    res.send(course);
});


/////////   Post
app.post('/api/courses', (req, res) =>{
    // const { error } = validateCourse(req.body);
    // if (error)     return res.status(400).send(error.details[0].message);
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

////////    put

app.put('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The id was not found');
       
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
           
    course.name = req.body.name;
    res.send(course);
});


//////  detele

app.delete('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The id was not found');

    const index = courses.indexOf(course);
    courses.splice(index,1);
    console.log('bummer');

    res.send(course);
});
    

/////////  utils  ////////////////


function validateCourse(course){
    const schema = {
        name:Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

// PORT
//const port = 3000;
const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listing on port ${port}...`));