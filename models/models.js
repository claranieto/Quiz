var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,{
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage,
	omitNull: true
}
);

//Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//importar definicion de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//importar definicion de la tabla User
var user_path = path.join(__dirname, 'user');
var User = sequelize.import(user_path);



Comment.belongsTo(Quiz); //comentarios que pertenecen a los quizes (belongsToMany)
Quiz.hasMany(Comment); //un quiz puede tener mucho comentarios (hasOne)

Quiz.belongsTo(User);
User.hasMany(Quiz);



exports.Quiz = Quiz; // exportar definción de la tabla Quiz
exports.Comment = Comment;
exports.User = User;

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	//then(..) ejecuta el manejador una vez creada la tabla
	User.count().then(function(count){
		if (count === 0){
            User.bulkCreate(
                [ {username: 'admin', password: '1234', isAdmin: true},
                  {username: 'pepe', password:'5678'} // isAdmin por defecto false
                ]
            ).then(function(){
                console.log('Base de datos (tabla user) inicializada');
                Quiz.count().then(function (count){
                    if (count === 0){
                        Quiz.bulkCreate(
                            [ {pregunta: 'Capital de Italia',respuesta: 'Roma', UserId:2},
                              {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', UserId:2} 
                            ]
                        ).then(function(){console.log('Base de datos inicializada')});
                    };
                });
            });
		};
	});
});
