const express        = require('express');
const path           = require('path');
const exphbs         = require('express-handlebars');
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const methodOverride = require('method-override');
const session        = require('express-session');
const flash          = require('connect-flash');
const passport       = require('passport');
const dbURI          = require('./config/database');




const app = express();
const port = process.env.PORT || 5000;

//Loud routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(dbURI.mongoURI, {useMongoClient: true})


.then(()=>{ console.log('MongoDB Connected')})
.catch(err => console.log(err))



//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
	secret: '#55',
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
})

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




app.use('/users', users);
app.use('/ideas', ideas);

app.listen(port, () =>{
 console.log(`Server running on port: ${port}`);
})