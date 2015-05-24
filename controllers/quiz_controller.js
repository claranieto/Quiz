var models = require('../models/models.js');

// MW que permite acciones solamente si el quiz objeto pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next){
    var objQuizOwner = req.quiz.UserId; //usuario que ha escrito el quiz
    var logUser = req.session.user.id; //usuario al que se le va a mostrar el quiz
    var isAdmin = req.session.user.isAdmin; //administrador

    if (isAdmin || objQuizOwner === logUser) {
        next();
    } else {
        res.redirect('/');
    }
};


//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res , next, quizId){
    models.Quiz.find({
            where: {id: Number(quizId)},
            include: [{ model:models.Comment }]
        }).then(function(quiz){
            if (quiz){
                req.quiz = quiz;
                next();
            }else {next (new Error('No existe quizId=' +quizId));}
        }
    ).catch(function(error) {next(error);});
};

// GET /quizes
exports.index = function(req, res, next){
    
    var options = {};
    
    
    if (req.user){ //req.user es creado por autoload de usuario // si la ruta lleva el parámetro .quizId
        options.where = {UserId: req.user.id}
    }
    
    if(req.session && req.session.user){ //se ha hecho el refresco al darle a borrar o crear favorito
        options.include = {model: models.User, as: "Fans"}
    }
    
    
    
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
            
                res.render('quizes/index', {quizes: quizes, errors: []});
            }
        ).catch(function(error){ next(error);})
            
    }else{
        models.Quiz.findAll(options).then(function(quizes){
            
            if(req.session.user){
                quizes.forEach(function(quiz){
                    quiz.selected = quiz.Fans.some(function(fan) {
                        return fan.id == req.session.user.id}); //comprobamos que ese favorito corresponda al usuario conectado
                            //si es true, ponemos el parámetro selected a ese valor.
                });}
            
            
            res.render('quizes/index.ejs', {quizes: quizes, errors: []});
        }).catch(function(error){next(error);})
    }
};


//GET/quizes/:id
exports.show = function(req, res){
    
    //var options = {};
    //options.where = {id: req.params.quizId}
    //options.include = {model: models.User, as:"Fans"}
    
    models.Quiz.findAll({where: {id:req.params.quizId}, include:{model: models.User, as: "Fans"}}).then(function(quizes){
        if (req.session.user){
            quizes.forEach(function(quiz){
                req.quiz.selected = quiz.Fans.some(function(fan){
                    return fan.id === req.session.user.id});
                    res.render('quizes/show', {quiz: req.quiz, errors: []});
            });
        }else{
            res.render('quizes/show', {quiz: req.quiz, errors: []});
        }
    });
}




//GET/quizes/:idanswer
exports.answer = function(req, res){
    var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
		}
		res.render ('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};


exports.new = function(req,res){
    var quiz = models.Quiz.build( //crea un objeto quiz
        {pregunta: "Pregunta", respuesta: "Respuesta"}
    );
    res.render('quizes/new', {quiz:quiz, errors: []});
};


exports.create = function(req, res){
    req.body.quiz.UserId = req.session.user.id;
    
    if(req.files.image){
        req.body.quiz.image = req.files.image.name;
    }

    var quiz = models.Quiz.build( req.body.quiz );
    
    quiz.validate()
    .then(
        function(err){
            if (err){
                res.render('quizes/new', {quiz:quiz, errors: err.errors});
            } else{
                quiz //save: guarda en DB los campos pregunta y respuesta de quiz
                .save({fields: ["pregunta", "respuesta", "UserId", "image"]}).then(function(){
                    res.redirect('/quizes')});
            } //Redirección HTTP lista de preguntas
        }
    ).catch(function(error){next(error)});
};

/*name ="quiz[pregunta]" es notación pseudo JSON que permite
indicar que son propiedades de un objeto quiz.
se genera a partir de ellos req.body.quiz, luego hay q eliminar el extended false
*/

exports.edit = function(req,res){
    var quiz = req.quiz; //autoload de instancia de quiz
    res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT/quizes/:id
exports.update = function(req, res){
    
    if(req.files.image){
     req.quiz.image = req.files.image.name;
   }
    
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    
    req.quiz.validate().then(
        function(err){
            if (err){
                res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
            }else{
                req.quiz.save({fields: ["pregunta", "respuesta", "image"]}).then(function(){
                        res.redirect('/quizes');});
            } //Redirección HTTP lista de preguntas
        }
    );
};


//DELETE/quizes/:id
exports.destroy = function(req, res){
    req.quiz.destroy().then( function() {
        res.redirect('/quizes');
    }).catch(function(error){next(error)});
};
