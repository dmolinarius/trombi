var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');

// Database
var database = './students.json';
var students = require(database);

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

/* CORS */
app.use( function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* CORS preflight */
app.options('/student/:id', (req,res) => res.status(200).end() );
app.options('/student', (req,res) => res.status(200).end() );


/* GET list of students */
app.get('/students', function(req,res,next) {
  let q = req.query.name;
  if ( q ) {
    q = q.toLowerCase();
    res.status(200).json(students.filter(
      s => (s.first_name.toLowerCase().includes(q) || s.last_name.toLowerCase().includes(q))
    ));
  }
  else {
    res.status(200).json(students);
  }
});

/* GET one student by id */
app.get('/student/:id', function(req,res,next) {
  let s = students.find(s => s.id === req.params.id);
  s ? res.status(200).json(s) : next(createError(404));
});

/* parse json body */
app.use(bodyParser.json());

/* PUT update student */
app.put('/student/:id', function(req,res,next) {
  let id = req.params.id;
  let i = students.findIndex(s => s.id === id);
  let h = req.header('Content-Type').toLowerCase();
  let student = req.body;

  if (i == -1) {
    next(createError(404));
  }
  else if ( h.toLowerCase() != 'application/json') {
    next(createError(400,'Wrong Content-Type'));
  }
  else if ( id != student.id && students.findIndex(s => s.id === student.id) > -1 ) {
    next(createError(400,'Duplicate id '+student.id));
  }
  else {
    students.splice(i,1,student);
    res.status(200).json(student);
  }
});

/* POST new student */
app.post('/student', function(req,res,next) {
  let h = req.header('Content-Type').toLowerCase();
  let data = req.body;

 if ( h.toLowerCase() != 'application/json') {
    next(createError(400,'Wrong Content-Type'));
  }
  else {
    let id = suggestId(data.first_name,data.last_name);
    let s = {...data,id};
    students.push(s);
    res.status(200).json(s);
  }
});

function suggestId(first_name, last_name) {
  let id = first_name[0] + last_name[0] + last_name[last_name.length-1];
  id = id.toLowerCase();
  let suffix = '', n = 2;
  // TODO handle error if n becomes > 99
  while (!checkId(id+suffix) && n < 100) suffix = n++;
  return id + suffix;
}
function checkId(id) {
  return students.findIndex(s => s.id === id)  == -1;
}

/* DELETE student */
app.delete('/student/:id', function(req,res,next) {
  let id = req.params.id;
  let i = students.findIndex(s => s.id === id);
  let h = req.header('Content-Type').toLowerCase();

  if (i == -1) {
    next(createError(404));
  }
  else if ( h.toLowerCase() != 'application/json') {
    next(createError(400,'Wrong Content-Type'));
  }
  else {
    students.splice(i,1);
    res.status(200).end();
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// write students back to json file
app.shutdown = function() {
  //console.log( "\ngracefully shutting down from  SIGINT (Crtl-C)" )
  fs.writeFileSync(database, JSON.stringify(students), 'utf8');
}

module.exports = app;
