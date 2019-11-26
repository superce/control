<template>
    <el-dialog :visible.sync="dialogFormControl" title="分配中控">
        <el-table :data="controlList" style="width: 100%" height="550" ref='controlTable' stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand"> 
                        <el-form-item label="中控名称:">
                            <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item label="ip:">
                            <span>{{ props.row.ip }}</span>
                        </el-form-item>
                        <el-form-item label="队列标识:">
                            <span>{{ props.row.queue_title }}</span>
                        </el-form-item>
                        <el-form-item label="uid:">
                            <span>{{ props.row.uid }}</span>
                        </el-form-item>
                        <el-form-item label="使用人:">
                            <span>{{ props.row.username }}</span>
                        </el-form-item>
                        <el-form-item label="心跳时间:">
                            <span>{{dateFormat(props.row.lastcore)}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="中控名称" prop="name"></el-table-column>
            <el-table-column label="ip" prop="ip"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormControl = false">取 消</el-button>
            <el-button type="primary" @click="confirmSaveControl">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {apiDistrControl,apiGetControlList} from '@/request/api'
import {getLocal} from '@/utils/storage'
export default {
    props:['rowId','type','taskId'],
    name:'disControl',
    data(){
        return {
            SelectionChange:[], // 选择的列表id
            unIds:[],
            selectQueueId:'',
            dialogFormControl:false,
            controlList:[],
            index:0,
        }
    },
    computed:{
        userId(){
            return this.$store.state.userId || getLocal('userId') || '' 
        }
    },
    methods:{
        // 选择多个中控
        handleSelectionChange(val){
            // console.log(val)
            this.SelectionChange = []
            val.forEach(item =>{
                this.SelectionChange.push(item.id)                
            })
        },
        // 确认分配
        confirmSaveControl(){
            let r = []
            this.unIds = []
            // 过滤已选择的id
            r = this.controlList.filter(f =>{
                return this.SelectionChange.indexOf(f.id)==-1
            })
            r.forEach(r =>{
                this.unIds.push(r.id)
            })
            let t = {
                userid:this.userId,
                ids:this.SelectionChange,
                type:3,
                unids:this.unIds
            }
            if(this.type === 'user'){
                t.disid=this.rowId
                t.type=1
            }
            if(this.type === 'quene'){
                t.type = 2
                t.task_queue_id = this.rowId
            }
            if(this.type === 'server'){
                t.type = 3
                t.server_type_id = this.rowId
            }
            if(this.type === 'queneTag'){
                t.type = 4
                t.queue_tag_id=this.rowId
                t.task_queue_id = this.taskId
            }
            apiDistrControl(t).then(res =>{
                if(res.data.state=='success'){
                    this.$message.success('分配成功')
                    this.dialogFormControl = false
                }else{
                    this.$message.error(res.data.msg)
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        // 中控列表
        getControlList() {
            let _this = this;
            // this.index++
            apiGetControlList({
                userid: this.userId,
                page_index: 1,
                page_size: 100,
            }).then(res => {
                let newData = []
                if(_this.type === 'user'){ // 用户管理
                    res.data.forEach(item => {
                        if(item.userid === _this.rowId || !item.userid){
                            if(item.userid !==0){
                                setTimeout(() =>{
                                    this.$refs.controlTable.toggleRowSelection(item);
                                },0)
                            }
                            if(item.status!='-1'){
                                newData.push(item)
                            }
                        }
                    });
                }
                if(_this.type === 'quene'){ //队列标识
                    res.data.forEach(item =>{
                        if(item.task_queue_id === _this.rowId||!item.task_queue_id){
                            if(item.task_queue_id !==0){
                                setTimeout(() =>{
                                    this.$refs.controlTable.toggleRowSelection(item);
                                },0)
                            }
                             if(item.status!='-1'){
                                newData.push(item)
                            }
                        }
                    })
                }
                if(_this.type === 'queneTag'){
                    res.data.forEach(item =>{
                        if(item.queue_tag_id === _this.rowId||!item.queue_tag_id){
                            if(item.queue_tag_id !==0){
                                setTimeout(() =>{
                                    this.$refs.controlTable.toggleRowSelection(item);
                                },0)
                            }
                             if(item.status!='-1'){
                                newData.push(item)
                            }
                        }
                    })
                }
                _this.controlList=newData //= newData;
                _this.dialogFormControl = true
            }).catch(err => {
              console.log(err)  
            });
            
        },
        // 格式化时间
        dateFormat(date) {
            if(date){
                let time = date.split('T')
                let year = time[0]
                let day = time[1]
                return `${day}`   
            }
        },
        scrollMore(){
            this.getControlList()
        }
    },
    filters:{
        controlStatus(status){
            switch(status){
                case '0':
                return '启用';
                case '-1':
                return '停用'
            }
        }
    }
}
</script>
<style scoped>
    .demo-table-expand{display: flex;flex-direction: column}
</style>