<template>
    <div class="login">
        <div class="login-dialog">
            <div class="login-box">
                <p><span class="zh-title">先知Bot</span><span class="en-title">用户登录</span></p>
                <el-input
                    placeholder="请输入账号"
                    autofocus="true"
                    v-model.trim="loginInfo.username">
                </el-input>
                <el-input
                    placeholder="请输入密码"
                    type="password"
                    @keyup.enter.native="loginCommit"
                    v-model.trim="loginInfo.password">
                </el-input>
                <el-button type="primary" v-loading="loading" @click="loginCommit">登录</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {postLogin} from '@/request/api'
export default {
    name:'LoginIn',
    data(){
        return{
            loginInfo:{
                username:'',
                password:''
            },
            loading:false
        }
    },
    methods:{
        loginCommit(){
            if(!this.loginInfo.username){
                this.$message.error('用户名不能为空')
                return false
            }
            if(!this.loginInfo.password){
                this.$message.error('密码不能为空')
                return false
            }
            this.loading = true
            postLogin({
                name:this.loginInfo.username,
                pwd:this.loginInfo.password
            }).then(res =>{
                if(res.data.state){
                    let isSuper = res.data.is_super
                    let userID = res.data.id
                    this.$store.commit('USERID',userID)
                    this.$store.commit('IS_SUPER',isSuper)
                    this.$store.commit('USER_NAME',res.data.name)
                    this.$router.replace({
                        name:'centralControl'
                    })
                }else{
                    this.$message.error(res.data.msg)
                }
            }).catch(err=>{
                this.$message.error(err.data.msg);
            }).finally(()=>{this.loading = false})
            
        }
    }
}
</script>
<style scoped>
    .login {
        position: relative;
        background: url("../../assets/images/login.jpg") no-repeat  center center;
        width: 100%;
        height: 100%;
        background-size: cover;
        overflow: hidden;
    }
    .login-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 500px;
    }
    .login div {
        box-sizing: border-box;
    }
    .logo {
        max-width: 500px;
    }
    .logo img {
        width: 100%;
    }
    .login-box {
        margin-top: -10px;
        max-height: 530px;
        max-width: 500px;
        background: #fff;
        padding: 40px 50px 60px 50px;
    }
    .zh-title {
        font-size: 24px;
        margin-right: 10px;
    }
    .login-box .el-input {
        margin: 15px 0;
    }
    .login-box .el-input__prefix {
        left: 15px;
    }
    .el-input__icon {
        line-height: 48px !important;
    }
    .el-input__inner {
        height: 48px !important;
        border: 1px solid #ededed !important;
        line-height: 48px !important;
        padding: 15px 15px 15px 50px !important;
    }
    .el-button--primary {
        width: 100%;
        padding: 15px 20px !important;
        margin-top: 15px !important;
    }
    .login-separator {
        position: relative;
        text-align: center;
    }
    .login-separator span {
        position: relative;
        display: block;
        background: #fff;
        width: 110px;
        font-size: 13px;
        color: #888;
        margin: 25px auto;
        z-index: 1;
    }
    .login-separator:before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 100%;
        border-bottom: 1px solid #ededed;
    }
    .login-separator img {
        width: 100px;
    }
    .left-text {
        position: absolute;
        color: #fff;
        left: 0;
        width: 100%;
        text-align: center;
        bottom: 40px;
        font-size: 12px;
    }
</style>