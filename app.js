const express  = require('express');
const exphbs   = require('express-handlebars');
const mongoose = require('mongoose');


const app = express();
const port = 5000;

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot', {
	useMongoClient: true
})
.then(()=>{ console.log('MongoDB Connected')})
.catch(err => console.log(err))

// Load Idea Model
require('./models/idea');
const Idea = mongoose.model('ideas');

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//middleware
app.use(function(req, res, next){
	console.log(Date.now())
	next();
});

//Index Routes
app.get('/', function(req, res){
	const title = 'Welcome';
	res.render('Index', {
		title: title
	});
});

app.get('/about', function(req, res){
	res.render('about');
})

app.listen(port, () =>{
 console.log(`Server running on port: ${port}`);
})