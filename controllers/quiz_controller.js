var models = require('../models/models.js');

//GET/quizes/:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: quiz});
	})
};

//GET/quizes/:idanswer
exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'/*, quizId: req.params.quizId*/});
		}else
		res.render ('quizes/answer', { quiz: quiz, respuesta: 'Incorrecto'/*, quizId: req.params.quizId*/});
	})
};

// GET /quizes
exports.index = function(req, res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index', {quizes: quizes});
	})
};