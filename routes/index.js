var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var stadisticsController = require('../controllers/stadistics_controller');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});


//AUTOLOAD DE COMANDOS CON :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('commentId', commentController.load); //autoload :commentId

//RUTA DE AUTOR
router.get("/author", function(req,res){
	res.render('author', {title: 'Quiz', errors: []});
});

//RUTA DE ESTADÍSTICAS
router.get("/quizes/stadistics",                   stadisticsController.show);


//DEFINICIÓN DE RUTAS DE SESION
router.get('/login',                        sessionController.new); //formulario login
router.post('/login',                       sessionController.create); //crear sesión
router.get('/logout',                       sessionController.destroy); //destruir sesión


//DEFINICIÓN DE RUTAS DE /quizes
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/quizes/new',                   sessionController.loginRequired, quizController.new);
router.post('/quizes/create',               sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',         sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',      sessionController.loginRequired, quizController.destroy);


//DEFINICIÓN DE RUTAS DE COMENTARIOS 
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

module.exports = router;



























































