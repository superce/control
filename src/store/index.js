import Vue from 'vue'
import Vuex from 'vuex'
import {setLocal,setSession,getSession, removeLocal} from '../utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId:'',
    userName:'',
    isShowNav:'',
    navKey:'',
    isSuper:'',
  },
  mutations: {
    USERID(state,user){
      state.userId = user
      if(user){
        setLocal('userId',user)
      }else{
        state.isSuper = ''
        state.userName = ''
        removeLocal('userId')
        removeLocal('isSuper')
      }
    },
    USER_NAME(state,name){
      state.userName = name
      setLocal('userName',name)
    },
    IS_SUPER(state,issuper){
      state.isSuper = issuper
      setLocal('isSuper',issuper)
    },
    ISSHOWNAV(state,nav){
      state.isShowNav = nav
      setLocal('isShowNav',nav)
    },
    SAVE_NAV_KEY(state,key){
      state.navKey = key
      console.log(key)
      setSession('saveNavKey',key)
    }
  },
  getters:{
  },
  actions: {
  },
  modules: {
  }
})
