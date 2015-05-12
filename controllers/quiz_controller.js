var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res , next, quizId){
    models.Quiz.find(quizId).then(
        function(quiz){
            if (quiz){
                req.quiz = quiz;
                next();
            }else {next (new Error('No existe quizId=' +quizId));}
        }
    ).catch(function(error) {next(error);});
};

// GET /quizes
exports.index = function(req, res, next){
    if (req.query.search != null){ //se quiere buscar algo concreto
        req.query.search = "%"+req.query.search+"%"; //quitar espacios
        models.Quiz.findAll({where: ["pregunta like ?", req.query.search]})
            .then(function (quizes){
            
                    for (i=0; i<quizes.length; i++){
                        while( quizes[i].pregunta < quizes[i-1].pregunta){
                            var p = quizes[i-1];
                            quizes[i-1] = quizes[i];
                            quizes[i] = p;
                        }  
                    }
            
                res.render('quizes/index', {quizes: quizes});
            }
        ).catch(function(error){ next(error);})
            
    }else{
        models.Quiz.findAll().then(function(quizes){
            res.render('quizes/index', {quizes: quizes});
            }
	    ).catch(function(error){next(error);})
    }
};


//GET/quizes/:id
exports.show = function(req, res){
		res.render('quizes/show', {quiz: req.quiz});
};

//GET/quizes/:idanswer
exports.answer = function(req, res){
    var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
		}
		res.render ('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

//exports.searc
