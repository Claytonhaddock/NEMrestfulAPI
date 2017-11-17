if(process.env.NODE_ENV === 'production'){
	module.exports = {mongoURI: 'mongodb://username:password@ds141185.mlab.com:41185/new'};
} else {
	module.exports = {mongoURI: 'mongodb://localhost/vidjot'};
}