<template>
  <div class="nav">
      <div class="nav-list">
        <div>
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color='#ffd04b' router @select="handleSelect">
            <el-menu-item route index="/" @click="home">中控管理</el-menu-item>
            <el-menu-item @click="taskQuene" route index="/task_quene">队列标识管理</el-menu-item>
            <!-- <el-menu-item route index="/contorl_type">中控类型维护界面</el-menu-item> -->
            <el-menu-item @click="taskList" route index="/task_list">任务列表</el-menu-item>
            <el-menu-item @click="userMain" route index="/user_main" v-if="isSuper===1&&isSuper">用户管理</el-menu-item>
          </el-menu>
          <div class="line"></div>
        </div>
        <div class="logout">
          <el-dropdown @command="logout">
            <span class="el-dropdown-link">
              <span>
                {{userName}}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"  style="fill:#329ae5;width:50px;height:50px;"><circle cx="28.53" cy="80.47" r="3.42" transform="translate(-32.8 21.07) rotate(-26.39)"/><path class="cls-1" d="M50,0a50,50,0,1,0,50,50A50,50,0,0,0,50,0ZM92.84,44.76a5.46,5.46,0,0,0-.78-.35,4.92,4.92,0,0,0-6.22,3.09,5.54,5.54,0,0,0-.22,1,31.91,31.91,0,0,1-3.92-4.25,86.71,86.71,0,0,0,10.44-3.58C92.43,42,92.67,43.36,92.84,44.76ZM88.27,30.08l.06.06a42.91,42.91,0,0,1,2.57,6,83.66,83.66,0,0,1-12,4L78,38.93a52.15,52.15,0,0,0-3.21-4.55c-4.62-5.54-9-8.48-12.33-10a39.65,39.65,0,0,1,7.31-1.05C77.63,23,83.85,25.23,88.27,30.08ZM67.06,10.34a43,43,0,0,1,13.45,9.15c.26.25.51.51.75.77a31.87,31.87,0,0,0-11.81-1.52A43.92,43.92,0,0,0,60.87,20C63.4,16.12,65.58,12.69,67.06,10.34ZM56.2,27.15a14.86,14.86,0,0,1,5.56,1.94,4.9,4.9,0,1,0,6.68,6,3.83,3.83,0,0,0,.19-.74c.87.87,1.77,1.84,2.68,2.94a44.8,44.8,0,0,1,2.74,3.9c-5.1.78-10.25.71-14.18-1.27-3.31-1.68-5.38-4.58-6.31-8.86C54.45,29.77,55.33,28.45,56.2,27.15ZM10.8,32.08h7.74l9.92-9.93a5.24,5.24,0,0,1-.38-1.94A5.13,5.13,0,1,1,31,24.82L20.58,35.2a1.81,1.81,0,0,1-1.29.53H9.37C9.79,34.49,10.26,33.27,10.8,32.08ZM8.69,37.9H25.27l2.51-2.51a5,5,0,0,1-.38-1.94,5.14,5.14,0,1,1,5.13,5.13,5,5,0,0,1-2.25-.52l-3,3a1.83,1.83,0,0,1-1.29.53H7.84C8.07,40.32,8.35,39.1,8.69,37.9ZM18.84,79.85A43.14,43.14,0,0,1,10,66.32c1.2.74,2.54,1.51,4,2.29,1.7.89,3.68,1.83,5.92,2.75A25.9,25.9,0,0,0,18.84,79.85ZM21.08,58.6l-5.85-5.86h-8c-.07-1-.11-2.05-.11-3.08v-.57H16a1.81,1.81,0,0,1,1.29.53L23.67,56a1.83,1.83,0,0,1-2.59,2.59ZM34.29,90.21A42.66,42.66,0,0,1,23.5,84.07a22.42,22.42,0,0,1,.34-11.24,72.39,72.39,0,0,0,12,3A25.82,25.82,0,0,0,34.29,90.21ZM33.9,64.38A5.14,5.14,0,0,1,29,57.72L18.54,47.26H7.14c.07-1.23.19-2.45.36-3.65H19.29a1.81,1.81,0,0,1,1.29.53l10.7,10.69a5,5,0,0,1,2.62-.72,5.14,5.14,0,1,1,0,10.27ZM50,93.15a43.11,43.11,0,0,1-11.26-1.48,2.12,2.12,0,0,0-.06-.49,21.77,21.77,0,0,1,1.41-14.76c1.26.13,2.55.23,3.87.29a58.08,58.08,0,0,1,29.16,9.74A42.88,42.88,0,0,1,50,93.15ZM80.51,80.51a45.61,45.61,0,0,1-3.44,3.1,62.22,62.22,0,0,0-31-11.34l5.06-12.81,13,7.37a2.29,2.29,0,0,0,2.25-4L51.3,54.29l-.11-.08c-.19-.11-4.2-2.54-10.5-5.56,2.58-3,6-7.63,9.61-12.79A15.63,15.63,0,0,0,57.81,44a23.37,23.37,0,0,0,10.56,2.2,45.85,45.85,0,0,0,8.47-.87c3.46,4.83,8.13,9.9,15.68,12A42.81,42.81,0,0,1,80.51,80.51Z"/></svg>
              <!-- <el-avatar :size="50" :src="userImg">
                
              </el-avatar> -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
  </div>
</template>
<script>
import {getLocal} from '@/utils/storage'
import userImg from '../../assets/images/user.png'
 export default {
    name:'Nav',
    data() {
      return {
        activeIndex:'/',
        userImg:userImg,
      };
    },
    created(){
      let url = window.location.hash.substring(1)
      this.activeIndex=url
    },
    watch:{
      $route(val){
        // if()
        this.activeIndex=val.path
      }
    },
    computed:{
      userId(){
        return this.$store.state.userId || getLocal('userId') || ''
      },
      isSuper(){
        return this.$store.state.isSuper || getLocal('isSuper') || ''
      },
      userName(){
        return this.$store.state.userName || getLocal('userName') || ''
      }
    },
    methods: {
      home(){
        this.$router.push({
          path:'/'
        })
      },
      userMain(){
        this.$router.push({
          name:'userMain'
        })
      },
      taskQuene(){
        this.$router.push({
          name:'taskQuene'
        })
      },
      taskList(){
        this.$router.push({
          name:'taskList'
        })
      },
      handleSelect(key, keyPath) {
        this.activeIndex = ''
        this.activeIndex=key  
      },
      logout() {
        this.$confirm('确认退出登录?', '退出登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('USERID','')
          this.$message({
            type: 'success',
            message: '退出登录!'
          });
          this.$router.push({
            name:'login'
          })
        }).catch(() => {
         
        });
      },
    }
  }
</script>
<style scoped>
.nav{background: #545c64;}
.nav-list{width: 96%;margin: 0 auto;display: flex;justify-content: space-between;align-items: center}
.nav-list .logout{cursor: pointer;}
.nav-list .logout .el-dropdown-link{color:#fff;font-size: 20px;display: flex;align-items: center;}
.nav-list .logout .el-dropdown-link>span{margin-right: 6px}
.el-menu.el-menu--horizontal{border: none}
</style>