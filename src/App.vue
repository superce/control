<template>
  <div id="app">
    <Nav v-if="isShowNav" class="fiexd"/>
    <router-view />
  </div>
</template>
<script>
import Nav from '../src/views/nav/index'
import {getLocal} from '@/utils/storage/local'
export default {
  components:{Nav},
  data(){
    return {
      isScroll:false
    }
  },
  created(){
    let userId = this.$store.state.userId || getLocal('userId') || ''
    if(!userId){
      this.$router.replace({
        name:'login'
      })
    }
  },
  computed:{
    isShowNav(){
      return this.$store.state.isShowNav || getLocal('isShowNav') || ''
    }
  },
}
</script>
<style>
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      height: 100%;
    }
    .el-menu-item.is-active a {
        color: #409EFF;
    }
    .fiexd{
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9;
    }
    .fiexd-nav{margin-top: 60px;padding:10px 0 10px 2%;position: fixed;top: 0;left: 0;width: 100%;z-index: 9;background: #fff;}
</style>
