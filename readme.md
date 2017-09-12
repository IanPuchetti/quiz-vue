#	Quiz
Programa evaluativo para Devecoop utilizando NodeJS y TingoDB.

##	Instrucciones de instalación
```
	git clone https://gitlab.com/devecoop/examenes/ipuchetti.git
	cd ipuchetti
	npm install
	npm start
```
Luego, abrir en el navegador la dirección http://localhost:3000

##	Contenido
###	Inicio
Un menú donde nos pedirá nuestro nombre, y nos da a elegir entre 3 opciones:
 *	Comenzar el juego
 *	Ver una lista de las puntuaciones
 *	Añadir una nueva pregunta

###	Comenzar el juego
Aparecerá una serie de 5 preguntas con 4 posibles respuestas, la cual una de ellas es la correcta.
Si acertamos, sumaremos 20 puntos a nuestra jugada, caso contrario, no se acumulan puntos.
Una vez completadas las 5 preguntas, aparecerá nuestro puntaje final.
###	Puntuaciones
Veremos una lista con el nombre de los jugadores y su respectivo puntaje.
Este puntaje se irá modificando con los nuevos puntajes correspondientes al nombre del jugador.
###	Añadir pregunta
En esta sección podremos agregar una pregunta, que será el reemplazo de una pregunta aleatoria de las 15 alojadas.
En el título podemos diseñar la pregunta, y debajo sus 4 posibles respuestas.
Para marcar una como correcta, elegimos el numero correspondiente a la pregunta correcta.
Finalmente, podremos agregar la pregunta, o cancelar la operación.
