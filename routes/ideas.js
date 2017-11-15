const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');

// Load Idea Model
require('../models/idea');
const Idea = mongoose.model('ideas');

router.get('/', (req, res)=>{
	Idea.find({})
	.sort({data: 'desc'})
	.then(ideas => {
		res.render('ideas/index', {
			ideas:ideas
		});		
	})
});

router.get('/add', function(req, res){
	res.render('ideas/add');
})

//Edit idea form
router.get('/edit/:id', function(req, res){
	Idea.findOne({
		_id: req.params.id
	}).then(idea =>{
		res.render('ideas/edit', {
			idea: idea
		});
	})
})

//process form
router.post('/', (req, res)=>{
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
		const newUser = {
			title: req.body.title,
			details: req.body.details
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
router.put('/:id', (req, res)=>{
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save().then(idea => {
			req.flash('success_msg', 'Video idea updated');
			res.redirect('/ideas');
		})
	});
})

router.delete('/:id', (req, res)=> {
	Idea.remove({
		_id: req.params.id
	}).then(() => {
		req.flash('success_msg', 'Video idea deleted');
		res.redirect('/ideas');
	})
});

module.exports = router;