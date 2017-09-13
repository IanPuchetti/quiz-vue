

const methods={
  fade:function(sector,next,callback){
    app.show=false
    setTimeout(function(){
      if(next){
        if(app.actual<4){
          app.actual+=1
          app.show=sector
        }else{
          app.show='puntuation'
          setTimeout(function(){
            app.finish()
          },1000)
        }
      }else{
        app.show=sector
      }
    },1000);
  },
  ranking:function(){
    axios.post(window.location.href+'ranking')
      .then(function (response) {
        app.ranking=response.data
        app.fade('ranking')
      });
  },
  finish:function(){
    axios.post(window.location.href+'ranking', {
      name:app.player.name,
      points:app.player.points
    })
      .then(function (response) {
        setTimeout(function(){
          app.fade('intro')
      },2000)
  })
}
}

const components={
  'question': {
    props: ['question'],
    template: '<div class="content">{{question}}</div>'
  },
  'answers': {
    props: ['answers','colors'],
    template: `<div>
                    <div class="answers"
                         v-for="answer in answers"
                         v-bind:style="{'border-color':colors[answer.id-1]}"
                         v-on:click="check(answer.id)">
                          {{answer.answer}}
                        </div>
                    </div>`,
    methods:{
      check:function(selected){
        axios.post(window.location.href+'check',{
          question:app.questions[app.actual]._id,
          answer:selected
        })
          .then(function (response) {
            if(response.data=='yes'){
              app.colors[selected-1]='green'
              app.player.points+=20
            }else{
              app.colors[selected-1]='red'
            }
          })
        }
    }
  },
  'rank-list': {
    props: ['players'],
    template: '<div><div v-for="player in players">{{player.name}} : {{player.points}}</div></div>'
  },
  'puntuation': {
    props: ['player'],
    template: '<div class="title">{{player.name}}, has obtenido {{player.points}} puntos!</div>'
  },
  'new-question': {
    props: ['question'],
    template: '<div>{{question}}</div>'
  },
  'new-answers': {
    props: ['answers'],
    template: `<div><input v-for="answer in answers" v-model="answer""></div> `
  },
  'correct-answer': {
    props: ['answers'],
    template: '<div><div v-for="player in players">{{player.name}} : {{player.points}}</div></div>'
  }
}

const data = {
  question:{},
  show:'intro',
  actual:0,
  player:{
    name:'',
    points:0
  },
  colors:[
    'red',
    'red',
    'red',
    'green'
  ]
}

const app=new Vue({
  el:'#app',
  data,
  components,
  methods
})

axios.post(window.location.href+'questions')
  .then(function (response) {
    app.questions=response.data
  })
