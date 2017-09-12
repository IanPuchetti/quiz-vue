var express = require('express');
var router = express.Router();
var Engine = require('tingodb')(),
    assert = require('assert');
//Se define la base de datos
var db = new Engine.Db('data/', {});
var col={questions:db.collection("questions"),
		 ranking:db.collection("ranking")
	};

//Muestra el inicio
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

//Obtiene las 15 preguntas de la base de datos
router.post('/questions',function(req,res,next){
	col['questions'].find({},{answer:0}).toArray(function(err,result){ 
		res.send(shuffle(result)); //La función shuffle ordena aleatoriamente el arreglo y obtiene 5 de ellas
	})
});

//Verifica si la respuesta fue correcta o errónea.
router.post('/check',function(req,res,next){
	//Busca por el id la respuesta de la pregunta
	col['questions'].find({_id:req.body.question},{answer:1}).toArray(function(err,result){
		if(req.body.answer==result[0].answer){ //La compara, si es la misma que el usuario mando con la de la base de datos
			res.send('yes'); //Devuelve que fue correcta
		}else{
			res.send('no'); //Devuelve que fue erronea
		}
	});
});

//Agrega una pregunta, reemplazandola por una de las 15 ya cargadas.
router.post('/add-question',function(req,res,next){
	var question={
					question:req.body.question,
					answers:req.body.answers,
					answer:req.body.answer
	};
	col['questions'].count(function(err,result){ //Cuenta la cantidad de preguntas cargadas
		if(result<15){	//Si es menor a 15 inserta una
			col['questions'].insert(question,function(err, result){
			res.send('ok');
		    });
		}else{ //Sino, modifica una al azar. La función random toma un numero al azar del 1 al 15.
			col['questions'].update({_id:random()},question,{upsert:true},function(err, result){
			res.send('ok');
		    });
		}
	});
});

//Registra la puntuación en el ranking por nombre de usuario.
router.post('/rank',function(req,res,next){
	col['ranking'].update({name:req.body.name},req.body,{upsert:true},function(err,result){res.send('ok')});;
});

//Devuelve el ranking.
router.post('/ranking',function(req,res,next){
	col['ranking'].find({}).toArray(function(err,result){res.send(result);});
});

function random(){return Math.floor((Math.random()*15)+1);}//Devuelve un numero aleatorio entre 1 y 15
function shuffle(a){var c=a.length,t,r,o=[];while(0!==c){r=Math.floor(Math.random()*c);c-=1;t=a[c];a[c]=a[r];a[r]=t;};if(a.length>=5){for(var i=0;i<=5;i++){o.push(a[i])}return o;}else{return a;}}//Devuelve 5 elementos del arreglo pasado por parametro, desordenado aleatoriamente
module.exports = router;
