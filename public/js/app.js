   var url = document.URL;//Obtengo la url actual para mandar los posts
   angular
   .module("app",[])
   .controller("controller", function ($scope, $http, $timeout) {
          //Declaro el jugador
          $scope.player={name:'',points:0};
          //Al hacer click en comenzar:
        	$scope.start=function(){
            //Si el usuario ingreso un nombre y es mayor que tres caracteres
        		if($scope.player.name.length>=3){
        			$(".intro").fadeOut(function(){$scope.ask();});//Desaparece el inicio e inicia una pregunta
        		}else{
        			$(".player").css('border','2px solid #d66');//Si no, marca con rojo el input de usuario.
        		}
        	};

          //Muestra las preguntas
        	$scope.ask=function(){
          if(!$scope.questions){ //Si no estan las preguntas, las pide al servidor
            $http.post(url+'questions').then(function(res){
              $scope.player.points=0;//Se inicializan los puntos del jugador a 0
              $scope.questions=res.data;//El array questions tendra las 5 preguntas
              $scope.question=res.data[0];//El objeto question tendra la pregunta actual
              $scope.actual=1;//La variable actual mantiene el numero de pregunta que se va haciendo
              $timeout(function(){$(".quiz").fadeIn();});//Se muestra la pregunta
            });
          }else{ 
            if($scope.actual<5){//Si estan las preguntas y no supera la 5ta pregunta
            $scope.actual=$scope.actual+1;//Se suma el contador
            $scope.question=$scope.questions[$scope.actual];//Se asigna la pregunta al siguiente del arreglo
            $timeout(function(){$(".quiz").fadeIn();});//Se muestra la pregunta
          }else{
            $scope.finish();//Si supero la 5ta, se pasa a mostrar el resultado
          }}
        	};

          //Inicializa y muestra la sección para agregar preguntas
          $scope.add_question=function(){
            $scope.question={ //Se inicializa la variable para ser llenada en los modelos
              question:'',
              answers:[
                {id:1, answer:''},
                {id:2, answer:''},
                {id:3, answer:''},
                {id:4, answer:''}
              ]
            };
            $(".intro").fadeOut(function(){$(".add").fadeIn();});//Se muestra la sección
          };

          //Asigna el numero de respuesta que marcamos como correcto para la pregunta
          $scope.correct=function(i){
            $scope.question.answer=i;//Asigna el numero de respuesta correcta
            $(".correct-answer").css({border:'1px solid #ddd', background:'none'});//Aplana todos los circulos 
            $("#correct"+i).css({border:'2px solid #51e83c', background:'#c7ffc6'});//Resalta el elegido
          };

          $scope.add={
            //Función para agregar una pregunta
            add:function(){
            //Verifica si todo tiene valor
            if($scope.question.question.length>=5 &&
               $scope.question.answers[0].answer &&
               $scope.question.answers[1].answer &&
               $scope.question.answers[2].answer &&
               $scope.question.answers[3].answer &&
               $scope.question.answer
              ){
            //Se envía mediante un post los datos de la pregunta nueva
            $http.post(url+'add-question',$scope.question).then(function(res){
              console.log(res);
              if(res.data=='ok'){//Si lo efectua correctamente da un aviso y vuelve al inicio
                $(".add").fadeOut(function(){
                  $(".added").fadeIn(function(){
                  $timeout(function(){
                    $(".added").fadeOut(function(){
                      $(".intro").fadeIn();
                    })
                  },1000);
                });
               });}
              $(".correct-answer").css({border:'1px solid #ddd', background:'none'});//Aplana los circulos por si vuelve a agregar una nueva
              });
            }
            },
            //Si no desea agregar una pregunta, la cancela
            cancel:function(){
              $scope.question={};//Elimina los datos asignados
              $(".add").fadeOut(function(){//Muestra el inicio
                $(".intro").fadeIn();
              });
              $(".correct-answer").css({border:'1px solid #ddd', background:'none'});//Aplana los circulos
              }
           };

           //Al finalizar las 5 preguntas, muestra el puntaje final
           $scope.finish=function(){
            $(".finish").fadeIn(function(){
              $http.post(url+'rank', $scope.player).then(function(){
                $timeout(function(){
                $(".finish").fadeOut(function(){
                  $scope.questions=0;//Borra las preguntas para un nuevo comienzo
                  $(".intro").fadeIn();
                });
              },4000);
              }
              );
              });
            };
          //Verifica si la pregunta es correcta o erronea
          $scope.check=function(id){
            $http.post(url+'check', {
                question:$scope.question._id, //Envia el id de la pregunta y el numero de respuesta elegido
                answer:id
            }).then(function(res){
              if(res.data=='yes'){
                $scope.player.points=$scope.player.points+20;
                $(".answers").css('color','#fff');//Se anulan las otras respuestas
                $(".answers#answer"+id).css({'color':'#51e83c','border':'2px solid #51e83c','font-size':'25px'});//Se resalta la correcta
              }else{
                $(".answers").css('color','#fff');//Se anulan las otras respuestas
                $(".answers#answer"+id).css({'color':'#f22121','border':'2px solid #f22121','font-size':'25px'});//Se resalta la erronea
              }
              rotate(res.data+id,360);//Aparece la imagen, si es 'yes' o 'no', y el id concatenado
              $timeout(function(){$(".quiz").fadeOut(function(){$scope.ask();});},1000);//Pasa a la siguiente pregunta
            });
          };

          //Llamada a la lista de ranking
          $scope.rank=function(){
            $(".intro").fadeOut(function(){//Desaparece el inicio
              $http.post(url+'ranking').then(function(res){
                $scope.ranking=res.data;//Asigno el ranking a una variable
                $(".ranking").fadeIn();//Aparece sección del ranking
              });
            });
          };
          //Aparece el inicio, desaparece el ranking
          $scope.intro=function(){
            $(".ranking").fadeOut(function(){
              $(".intro").fadeIn();
            });
          };  
        });
   //Estilos de los input y textarea
   $(".player").click(function(){$(".player").css('border','1px solid #555')});
   $(".player").blur(function(){$(".player").css('border','1px solid #999')});
   $("textarea.question").click(function(){$("textarea.question").attr('placeholder','')});
   $("textarea.question").blur(function(){$("textarea.question").attr('placeholder','Nueva pregunta...')});

   //Animación de las imagenes de acierto o error. Su uso: rotate('yes',360); || rotate('no',180);
   function rotate(id,a){
    $('#'+id).css('width',0)
    $('#'+id).animate({width:'+=25'},300);
    $('#'+id).rotate({angle:0,animateTo:a});
   	}