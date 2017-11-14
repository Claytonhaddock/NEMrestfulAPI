const express  = require('express');
const exphbs   = require('express-handlebars');
const bodyParser     = require('body-parser');
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
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

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

app.get('/ideas', (req, res)=>{
	Idea.find({})
	.sort({data: 'desc'})
	.then(ideas => {
		res.render('ideas/index', {
			ideas:ideas
		});		
	})
});

app.get('/ideas/add', function(req, res){
	res.render('ideas/add');
})

//process form
app.post('/ideas', (req, res)=>{
	let errors = [];
	if(!req.body.title){
		errors.push({text: 'Please add a title'})
	}
	if(!req.body.details){
		errors.push({text: 'Please add some details'})
	}

	if(errors.length){
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details
		};
		new Idea(newUser)
		.save()
		.then(idea => {
			res.redirect('/ideas')
		});
	}
})

app.listen(port, () =>{
 console.log(`Server running on port: ${port}`);
})