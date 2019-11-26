<template>
    <div class="central-control">
        <div class="search" :class="isScroll?'fiexd-nav':''">
            <div>
                <span>队列标识:</span>
                <el-input v-model="params.quene" placeholder="请输入内容"></el-input>
            </div>
            <div>
                <span>用户:</span>
                <el-input v-model="params.name" placeholder="请输入内容"></el-input>
            </div>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="primary" @click="create = true">新增</el-button>
        </div>
        <el-button type="primary" class="create-group" @click="createGroup">创建分组</el-button>
        <el-button type="primary" class="create-group" @click="removeQueue">从分组移除队列标识</el-button>
        <!-- 队列标识列表 -->
        <div class="control-box">
            <div class="el-row">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item v-for="(item,index) in queneList" :key="index+'item'" :name="index+1" >
                        <template slot="title">
                            <div class="queue-title">
                                {{item.label}}
                                <el-button v-if="item.queue_type_id !== 0" type="primary" size="mini" @click.stop="diffGroup(item.queue_type_id)">解散分组</el-button>
                            </div>
                        </template>
                        <el-table @selection-change="handleSelectionChange" :data="item.children" stripe ref="queueTableList" style="width: 100%">
                            <el-table-column type="selection" width="55" v-model="item.isSelect"></el-table-column>
                            <el-table-column prop="title" label="队列标识" width="180"></el-table-column>
                            <el-table-column prop="username" label="用户" width="180"></el-table-column>
                            <el-table-column prop="remark" label="备注" width="200"></el-table-column>
                            <el-table-column label="创建时间" prop="addtime">
                                <template slot-scope='{row}'>
                                    {{dateFormats(row.addtime)}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" prop="addtime">
                                <template slot-scope="{row}">
                                    <el-button type="primary" size="mini" @click="toDisControl(row.id)">分配中控</el-button>
                                    <el-button type="primary" size="mini" @click="goTag(row.id)">标签</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
                <ul class="pages" v-if="pages>1">
                    <li v-for="(page,index) in pages" :key="index+'page'" @click="goPage(page)">{{page}}</li>
                </ul>
            </div>
        </div>
        <!-- 创建分组弹窗 -->
        <el-dialog width="500px" :visible.sync="dialogGroup" title="创建分组">
            <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
                <el-form-item label="分组名称">
                <el-input v-model="groupName" placeholder="小组名" @keyup.enter.native="submitGroup"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="submitGroup">创建分组</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 创建队列标识弹窗 -->
        <div class="create">
            <el-dialog :visible.sync="create">
                <el-form label-width="100px" :model="createQueneList" :rules='rules'>
                    <el-form-item label="队列标识" prop="title">
                        <el-input v-model="createQueneList.title"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="createQueneList.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="create = false">取消</el-button>
                        <el-button type="primary" @click="createQuene" v-loading="loading">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <!-- 中控列表 -->
        <dis-control ref="clickChild" :rowId='disControlId' type='quene'></dis-control>
    </div>
</template>
<script>
import {apiGetQueneList,apiCreateQuene,setQueueGroup,diffQueueGroup,removeQueueItem} from '@/request/api'
import { dateFormat } from "@/utils/common";
import disControl from '@/components/disControl'
import {getLocal} from '@/utils/storage'
export default {
    props:['isScroll'],
    components:{disControl},
    data(){
        return {
            params:{
                name:'',
                quene:''
            },
            queneList:[],
            selectQueneList:[],
            disControlId:'',// 选择的用户id
            createQueneList:{
                title:'',
                remark:''
            },
            create:false, // 创建队列标识弹窗
            rules:{
                title: [
                    { required: true, message: '队列标识不能为空', trigger: 'blur' },
                ],
            },
            loading:false,
            ids:[], //选择的队列id,
            dialogGroup:false, //分组弹窗
            groupName:'', // 分组名称
            activeNames:[],
            pages:[] //页数
        }
    },
    computed:{
        userId(){
            return this.$store.state.userId || getLocal('userId') || ''
        }
    },
    created(){
        this.getQueneList()
    },
    watch:{
        create(val){
            if(!val){
                this.createQueneList = {}
            }
        },
        dialogGroup(val){
            if(!val){
                this.ids=[]
                this.$refs.queueTableList.forEach(item =>{
                    item.clearSelection()
                })
                this.queneList.forEach(items =>{
                    items.children.forEach(item =>{
                        item.isSelect=false
                    })
                })
            }
        }
    },
    methods:{
        // 選擇的隊列標識
        selectQueneId(){
            this.queneList.forEach(items =>{
                items.children.forEach(item =>{
                    if(item.isSelect){
                        this.ids.push(item.id)
                    }
                })
            })
        },
        removeQueue(){
            this.selectQueneId()
            if(this.ids.length===0){
                this.$message.error('请选择队列标识')
                return false
            }
            this.$confirm('确认解散分组?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeQueueItem({
                    ids:this.ids
                }).then(res =>{
                    if(res.data.state){
                        this.getQueneList()
                        this.$message.success('移除成功')
                    }else{
                        this.$message.error('移除失败')
                    }
                })
            }).catch(() => {       
            });
        },
        // 下拉列表选择
        handleSelectChange(val){
            this.params.quene = val[1]
        },
        // 创建队列标识
        createQuene(){
            this.loading=true
            apiCreateQuene({
                title:this.createQueneList.title,
                remark:this.createQueneList.remark,
                user_id:this.userId
            }).then(res =>{
                if(res.data.state =='success'){
                    this.$message.success('创建成功')
                    this.create = false
                    this.loading=false
                    this.getQueneList()
                }else{
                    this.$message.error(res.data.msg);
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        goPage(p){
            this.getQueneList('','',p)
        },
        // 搜索
        search(){
            let p = this.params
            this.getQueneList(p.quene,p.name)
        },
        // 获取队列列表id
        toDisControl(id){
            this.disControlId = id
            this.$refs.clickChild.getControlList()
        },
        getQueneList(title,name,pageIndex){
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
            });
            if(!pageIndex){
                pageIndex=1
            }
            apiGetQueneList({
                page_index:pageIndex,
                page_size:15,
                title:title,
                username:name,
                user_id:this.userId
            }).then(res =>{
                if(res.data.state === 'error'){

                }else{
                    this.queneList=[]
                    if(res.data.length===0){
                        return false
                    }
                    let index = 0
                    res.data.forEach(items =>{
                        let item = this.queneList.find(p =>{
                            return p.queue_type_id === items.queue_type_id
                        })
                        if(item){
                            items.isSelect=false
                            items.label=items.title
                            items.value=items.title
                            item.children.push(items)
                        }else{
                            index++
                            this.activeNames.push(index)
                            let a = ''
                            if(items.queue_type_id==0){
                                a = '未分组'
                            }else{
                                a = items.queue_title
                            }
                            items.isSelect=false
                            items.label=items.title
                            items.value=items.id
                            let list = {
                                label:a,
                                queue_type_id:items.queue_type_id,
                                value:items.queue_type_id,
                                id:items.queue_type_id+'id',
                                children:[items]
                            }
                            this.queneList.push(list)
                        }
                    })
                    this.pages = res.total
                }
            }).catch(err =>{
                console.log(err)
            }).finally(()=>{
                loading.close()
            })
        },
        // 选择队列标识分组
        handleSelectionChange(val){
            this.ids=[]
            val.forEach(item =>{
                item.isSelect=true
            })
        },
        // 创建分组弹窗
        createGroup(){
            this.selectQueneId()
            if(this.ids.length>=1){
                this.dialogGroup=true
            }else{
                this.$message.error('请选择需要分组的队列标识')
            }
        },
        // 创建队列分组
        submitGroup(){
            setQueueGroup({
                ids:this.ids,
                queue_title:this.groupName,
            }).then(res =>{ 
                if(res.data.state == 'success'){
                    this.$message.success('分组成功')
                    this.groupName=''
                    this.dialogGroup=false
                    this.getQueneList()
                }else{
                    this.$message.error(res.data.msg)
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        // 解散分组
        diffGroup(id){
             this.$confirm('确认解散分组?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.diffGroupApi(id)
                }).catch(() => {        
            });
        },
        diffGroupApi(id){
            diffQueueGroup({
                queue_type_id:id
            }).then(res =>{
                if(res.data.state==='success'){
                    this.getQueneList()
                    this.$message.success('解散分组成功')
                }else{
                    this.$message.error(res.data.msg)
                }
                // console.log(res)
            }).catch(err =>{
                console.log(err)
            })
        },
        // 折叠面板
        handleChange(val){
            console.log(val)
        },
        dateFormats(date){
            return dateFormat(date)
        },
        goTag(id){
            this.$router.push({
                name:'tag',
                query:{
                    id:id
                }
            })
        }
    }
}
</script>
<style scoped>
.create-group{margin: 10px 10px 10px 0;}
.queue-title{width:100%;display: flex;justify-content: space-between;align-items: center}
</style>