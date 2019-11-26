import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../src/assets/style/index.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import filter from './utils/filters'
import { getLocal } from './utils/storage'

Vue.use(ElementUI);
Vue.config.productionTip = false

let isSuper = getLocal('isSuper')
router.beforeEach((to,from,next) =>{
  let meta = to.meta;
  let isShowNav = 'true'
  if(to.name === 'login'){
    isShowNav = ''
  }
  if(to.name === 'userMain'&&isSuper!=1){
    router.push({
      path:'404'
    })
  }
  store.commit('ISSHOWNAV',isShowNav)
  // 设置页面标题
  if (meta && meta.title) {
    window.document.title = meta.title;
  } else{
      window.document.title = '先知Bot'
  }
  next()
})

//过滤器
Object.keys(filter).forEach((key) => {
  Vue.filter(key, filter[key]);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
