var mongoose = require('mongoose');
const express = require('express');
var bodyparser = require('body-parser')
const app = express();
var http = require('http').createServer(app);

const dbURL = 'mongodb://localhost/todo';
// for CORS
//CORS middleware
var corsMiddleware = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
  next();
}
// bodyparser for json type data handling in the form of req and res body
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(corsMiddleware);
mongoose.connect(dbURL, { useNewUrlParser: true });

mongoose.connection.on('connected', function(){
    console.log("Mongoose default connection is open to " + dbURL);
});

mongoose.connection.on('error', function(err){
	console.log("Mongoose default connection has occurred "+err+" error");
});

mongoose.connection.on('disconnected', function(){
	console.log("Mongoose default connection is disconnected");
});

process.on('SIGINT', function(){
	mongoose.connection.close(function(){
		console.log("Mongoose default connection is disconnected due to application termination");
		process.exit(0)
	});
});


var taskSchema = new mongoose.Schema({
  task: String,
  due: Date
}, {
  versionKey: false
});

var Task = new mongoose.model('Task', taskSchema);

app.get('/tasks', (req, res) => {
  Task.find((error, data) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.post('/newTask', (req, res) => {
  var newTask = new Task({
    task: req.body.taskName,
    due: req.body.date
  });


  newTask.save((error) => {
    if (error) {
      console.log(error);
      res.send('Error while adding task. Try again.');
      console.log("AK");
    } else {
      res.send('Task Added!');
    }
  });
});

http.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
