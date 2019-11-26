<template>
    <div class="central-control">
        <div class="search">
            <div class="account">
                <span>账号:</span>
                <el-input v-model="name" placeholder="请输入内容"></el-input>
            </div>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="primary" @click="NewAddUser">新增</el-button>
        </div>
        <div class="control-box">
            <el-table :data="userList" stripe :loading='loading'>
                <el-table-column prop="name" label="账号" width="180">
                </el-table-column>
                <el-table-column prop="pwd" label="密码" width="180">
                </el-table-column>
                <el-table-column width="180" prop="role" label="等级">
                </el-table-column>
                <el-table-column prop="addtime" label="添加时间">
                    <template slot-scope="{row}">
                        {{dateFormat(row.addtime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <el-button @click="handleClick(row)" type="text" size="small">编辑</el-button>
                        <el-button @click="disControlList(row)" type="text" size="small">分配中控</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 编辑用户弹窗 -->
            <el-dialog :title="title" :visible.sync="dialogFormVisible">
                <el-form :model="addUser">
                    <el-form-item label="账号" label-width="120">
                        <el-input v-model="addUser.name" autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" label-width="120">
                        <el-input v-model="addUser.pwd" autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item label="等级" label-width="120" class="select">
                        <el-select v-model="addUser.grade" placeholder="请选择等级">
                            <!-- <el-option label="普通" value="0"></el-option> -->
                            <el-option label="管理" value="1"></el-option>
                            <el-option label="超管" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmSave">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 中控列表 -->
            <dis-control ref="clickChild" :rowId='selectUserId' type='user'></dis-control>
        </div>
        <ul class="pages" v-if="pages>1">
            <li v-for="(page,index) in pages" :key="index" @click="getUserList('',page)">{{page}}</li>
        </ul>
    </div>
</template>
<script>
import {apiGetUserList,apiSaveUser,apiGetControlList,apiDistrControl} from '@/request/api'
import {getLocal} from '@/utils/storage'
import {dateFormat} from '@/utils/common'
import { filter } from 'minimatch'
import disControl from '@/components/disControl'
export default {
    components:{disControl},
    name:'userMain',
    data(){
        return {
            userList:[],
            name:'',
            addUser:{
                name:'',
                pwd:'',
                grade:''
            },
            dialogFormVisible:false,
            title:'',
            pages:'',
            loading:false,
            SelectionChange:[], // 选择多个中控
            selectUserId:'', // 选择的用户id
        }
    },
    computed:{
        userId(){
            return this.$store.state.userId || getLocal('userId') || ''
        }
    },
    watch:{
        dialogFormVisible(val){
            if(!val){
                this.addUser = {}
            }
        },
        addUser(val){
            // if(val.grade == '0') val.role = '普通'
            // if(val.grade == '1') val.role = '管理'
            console.log(val)
        }
    },
    created(){
        this.getUserList('',1)
    },
    methods:{
        NewAddUser(){
            this.dialogFormVisible=true
            this.title = '添加用户'
        },
        confirmSave(){
            this.userSave(this.addUser)
        },
        handleClick(row){
            this.dialogFormVisible=true
            this.title = '编辑用户'
            let g = row.grade.toString()
            this.addUser = {
                id:row.id,
                name:row.name,
                pwd:row.pwd,
                role:row.role,
                grade:g
            }
        },
        // 保存编辑api
        userSave(row){
            let id = this.userId
            apiSaveUser({
                id:id,
                userid:row.id,
                name:row.name,
                pwd:row.pwd,
                grade:row.grade
            }).then(res =>{
                if(res.data.state==='error'){
                    this.$message.error(res.data.msg)
                    return false
                }
                this.getUserList('',1)
                this.dialogFormVisible = false
                this.$message.success('保存成功')
            }).catch(err =>{
                console.log(err)
            })
        },
        search(){
            this.getUserList(this.name,1)
        },
        // 获取用户列表
        getUserList(name,index){
            name = name?name:''
            apiGetUserList({
                id:this.userId,
                page_index:index,
                page_size:15,
                name:name
            }).then(res =>{
                this.userList = res.data
                this.pages = res.total
            }).catch(err =>{

            })
        },
        // 分配中控
        disControlList(row){
            this.selectUserId = row.id
            this.$refs.clickChild.getControlList()
            // this.getControlList()
        },
        loadMore(){
            console.log(this.$refs.loadMore.offsetHeight)
        },
        // 格式化时间
        dateFormat(date){
            return dateFormat(date)
        }
    },
    filters:{
        grades(g){
            let result = ''
            switch(g){
                case 0:
                    result = '普通';
                case 1:
                    result = '管理';
                case 2:
                    result = '超級管理員'
            }
            return result
        }
    }
}
</script>
<style scoped>
    .central-control .table{width: 900px;margin: 10px auto 0}
    .control-box .select{display: flex;flex-direction: column;align-items: flex-start}
    .control-box .form-height{height: 680px;}
</style>