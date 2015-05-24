var models = require('../models/models.js');

exports.index = function(req,res, next) {
   
    req.user.getFavourites().then(function(favos){ //selecciono todos los favoritos del usuario
        favos.forEach(function(favourite){
            favourite.selected = true; //para cada uno pongo su parámetro a true
        });
            res.render('quizes/index.ejs', {quizes:favos, errors:[]});
        }).catch(function(error) {next(error)});
};





exports.select = function(req,res){
   console.log("dentro de select");
    var user = req.user;
    var quiz = req.quiz;
    
    user.addFavourites(quiz).then(function(){
        //quiz.selected = true;
        res.redirect('/user/' + req.user.id+ '/favourites');     //req.body.redir        
    }).catch(function(error) {next(error)});
};
                
    
                
                
                
//DELETE /quizes/:userId/favourites/:quizId                
exports.quit = function(req,res,next){
    
    req.user.removeFavourites(req.quiz).then(function(){
        res.redirect('/user/' + req.user.id+ '/favourites');
    }).catch(function(error) {next(error)});
};                
                
            
                