<template>
    <div class="central-control">
        <div class="search">
            <div>
                <span>中控类型:</span>
                <el-input v-model="searchType" placeholder="请输入内容"></el-input>
            </div>
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="control-box">
            <div class="el-row">
                <el-table :data="serverTypeList" style="width: 100%">
                    <el-table-column prop="title" label="中控类型" width="180"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row}">
                            <el-button type="primary" @click="disServerType(row.id)">分配中控</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 中控列表 -->
        <dis-control ref="clickChild" :rowId='serverTypeId' type='server'></dis-control>
    </div>
</template>

<script>
import {apiGetServerList} from '@/request/api'
import disControl from '@/components/disControl'
export default {
    components:{disControl},
    data(){
        return {
            searchType:'',
            serverTypeList:[],
            serverTypeId:''
        }
    },
    created(){
        this.getServerList()
    },
    methods:{
        search(){
            this.getServerList(this.searchType)
        },
        disServerType(id){ //选择的中控id
            this.serverTypeId = id
            this.$refs.clickChild.getControlList()
        },
        getServerList(title){
            apiGetServerList({
                title:title
            }).then(res =>{
                this.serverTypeList = res.data
            }).catch(err =>{
                console.log(err)
            })
        }
    }
}
</script>