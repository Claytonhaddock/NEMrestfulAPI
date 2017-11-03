const express = require('express');
const exphbs  = require('express-handlebars')

const app = express();
const port = 5000;

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//middleware
app.use(function(req, res, next){
	console.log(Date.now())
	next();
});

//Index Route
app.get('/', function(req, res){
	const title = 'Welcome, Frank';
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