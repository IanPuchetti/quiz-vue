

const components={
  'question': {
    props: ['question'],
    template: '<div>{{question}}</div>'
  },
  'answers': {
    props: ['answers'],
    template: '<div><div v-for="answer in answers">{{answer.answer}}</div></div>'
  },
  'rank-list': {
    props: ['answers'],
    template: '<div><div v-for="player in players">{{player.name}} : {{player.points}}</div></div>'
  }
}

const data = {
  question:{},
  show:'questions',
  actual:0
}

const methods={
  fade:function(sector,next){
    app.show=false
    setTimeout(function(){
      if(next){
        app.actual+=1
      }
      app.show=sector
    },1000);
  }
}

const app=new Vue({
  el:'#app',
  data,
  components,
  methods
})

axios.post(window.location.href+'questions')
  .then(function (response) {
    app.question=response.data;
  });
