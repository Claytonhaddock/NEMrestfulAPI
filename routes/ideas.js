const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/idea');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated, (req, res)=>{
	Idea.find({ $or: [{
		public: true
	},{
		user: req.user.id
	}]})
	.sort({data: 'desc'})
	.then(ideas => {
		res.render('ideas/index', {
			ideas:ideas
		});		
	})
});

router.get('/add',ensureAuthenticated, function(req, res){
	res.render('ideas/add');
})

//Edit idea form
router.get('/edit/:id',ensureAuthenticated,  function(req, res){
	Idea.findOne({
		_id: req.params.id
	}).then(idea =>{
		if(idea.user != req.user.id){
			req.flash('error_msg', 'Not Authorized');
			res.redirect('/ideas');
		} else {
			res.render('ideas/edit', {
				idea: idea
			});
		}
	})
})

//process form
router.post('/',ensureAuthenticated,  (req, res)=>{
	let errors = [];
	if(!req.body.title){
		errors.push({text: 'Please add a title'})
	}
	if(!req.body.details){
		errors.push({text: 'Please add some details'})
	}

	if(errors.length){
		res.render('/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		if(req.body.public){
			req.body.public = true;
		} else {
			req.body.public = false;
		}
		const newUser = {
			title: req.body.title,
			details: req.body.details,
			public: req.body.public,
			user: req.user.id
		};
		new Idea(newUser)
		.save()
		.then(idea => {
			req.flash('success_msg', 'Video idea created');
			res.redirect('/ideas')
		});
	}
})

//Edit form process
router.put('/:id',ensureAuthenticated, (req, res)=>{
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		if(req.body.public){
			req.body.public = true;
		} else {
			req.body.public = false;
		}
		idea.title = req.body.title;
		idea.details = req.body.details;
		idea.public = req.body.public,

		idea.save().then(idea => {
			req.flash('success_msg', 'Video idea updated');
			res.redirect('/ideas');
		})
	});
})

router.delete('/:id', ensureAuthenticated, (req, res)=> {
	Idea.remove({
		_id: req.params.id
	}).then(() => {
		req.flash('success_msg', 'Video idea deleted');
		res.redirect('/ideas');
	})
});

module.exports = router;