var models = require('../models/models.js');

//GET/stadistics
exports.show = function(req, res){

    models.Quiz.findAll().then(function (quizes){
        var Npreguntas = quizes.length;
        
        models.Comment.findAll().then(function (comments){
            var Ncomentarios = comments.length;
            var NmedioCP = Ncomentarios/Npreguntas;
            
            var NpregConCom=0;
            
            var id=[];
            var flag = 0;
            for (i=0; i<comments.length; i++){
                    if(comments[i].QuizId){ // si tiene un quiz asociado 
                        for (index in id){
                            if (comments[i].QuizId === id[index])//si ya está repetido
                            flag = 1;
                        }
                        if (flag === 0){ // si no está repetido
                            NpregConCom++;
                            id[id.length] = comments[i].QuizId;
                        }
                    }
                flag = 0;
            }
 
            res.render ('quizes/stadistics', {preg: Npreguntas, com: Ncomentarios, NmedioCP: NmedioCP, NConCom: NpregConCom, errors: []});
            
        }).catch(function(error){ next(error);})       
    }).catch(function(error){ next(error);})
};

    