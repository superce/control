<template>
    <div class="central-control">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/task_quene' }">队列标识管理</el-breadcrumb-item>
            <el-breadcrumb-item>标签列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 创建队列标识弹窗 -->
        <div class="create">
            <el-dialog :visible.sync="create" title="新增标签">
                <el-form label-width="100px" :model="createTag" :rules='rules' ref="createTag">
                    <el-form-item label="标签名称" prop="name">
                        <el-input v-model="createTag.name"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="createTag.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="create = false">取消</el-button>
                        <el-button type="primary" @click="createTagSave('createTag')" @keyup.enter="createTagSave('createTag')">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <div class="tag-list">
            <el-row>
                <el-button type="primary" @click="create=true">新增标签</el-button>
                <el-button :type="deleteTagId.length>0?'primary':'info'" @click="isDeleteTag">删除标签</el-button>
            </el-row>
            <el-table :data="tagList" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="tag_name" label="标签"></el-table-column>
                <el-table-column prop="queue_name" label="队列标识"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="addtime" label="时间">
                    <template slot-scope="{row}">
                        {{dateFormats(row.addtime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="addtime" label="操作">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="mini" @click="editControl(row)">修改</el-button>
                        <el-button type="primary" size="mini" @click="disControl(row.id)">分配中控</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 中控列表 -->
        <dis-control ref="clickChild" :rowId='disControlId' type='queneTag' :taskId='queueId'></dis-control>
    </div>
</template>
<script>
import {getQueueTagList,apiSaveQueueTag,apiIsDeleteQueueTag,apiDeleteQueueTag} from '@/request/api'
import { dateFormat } from "@/utils/common";
import disControl from '@/components/disControl'
export default {
    components:{disControl},
    data(){
        return {
            tagList:[],
            create:false,
            createTag:{
                name:'',
                remark:''
            },
            rules:{
                name: [
                    { required: true, message: '队列标识不能为空', trigger: 'blur' },
                ],
            },
            tagId:0,
            deleteTagId:[],
            disControlId:''
        }
    },
    computed:{
        queueId(){
            return this.$route.query.id
        }
    },
    watch:{
        create(val){
            if(!val){
                this.createTag={
                    name:'',
                    remark:''
                }
                this.tagId=0
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            getQueueTagList({
                page_index:1,
                page_size:20,
                task_queue_id:this.queueId,
                title:'',
                tag_name:''
            }).then(res =>{
                if(res.state){
                    console.log(res)
                    this.tagList=res.data
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        disControl(id){
            this.disControlId=id
             this.$refs.clickChild.getControlList()
        },
        // 保存标签
        createTagSave(){
            this.$refs.createTag.validate((valid) =>{
                if(valid){
                    let c = this.createTag
                    let queueId = this.queueId
                    queueId = Number(queueId)
                    apiSaveQueueTag({
                        id:this.tagId,
                        task_queue_id:queueId,
                        tag_name:c.name,
                        remark:c.remark
                    }).then(res =>{ 
                        if(res.data.state){ 
                            this.$message.success(res.data.msg)
                            this.create=false
                            this.getList()
                        }
                    }).catch(err =>{
                        console.log(err)
                    })
                }
            })
        },
        // 判断是否删除标签
        isDeleteTag(){
            if(this.deleteTagId.length==0){
                this.$message.error('请选择标签')
            }else{
                let _this = this
                apiIsDeleteQueueTag({
                    ids:this.deleteTagId
                }).then(res =>{
                    if(res.data.state){
                        this.$confirm(res.data.msg, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                _this.deleteTag()
                            }).catch(() => {
                                
                            });
                    }else{
                        _this.deleteTag()
                    }
                }).catch(err =>{

                })
            }
        },
        deleteTag(){
            apiDeleteQueueTag({
                ids:this.deleteTagId
            }).then(res =>{
                if(res.data.state){
                    this.$message.success('删除成功')
                    this.getList()
                }
            }).catch(err =>{

            })
        },
        // 选择中控
        handleSelectionChange(val){
            this.deleteTagId=[]
            val.forEach(item =>{
                this.deleteTagId.push(item.id)
            })
        },
        // 修改中控
        editControl(row){
            this.create=true
            this.createTag={
                name:row.tag_name,
                remark:row.remark
            }
            this.tagId=row.id
        },
        dateFormats(date){
            return dateFormat(date)
        },
    }   
}
</script>
<style scoped>
.tag-list{margin-top: 10px;}
</style>