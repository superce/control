<template>
  <div class="central-control">
    <!-- 搜索 -->
    <div class="fiexd-nav">
      <div class="search">
        <div>
          <span>中控名称:</span>
          <el-input v-model="params.name" placeholder="请输入内容"></el-input>
        </div>
        <div>
          <span>队列标识:</span>
          <el-input v-model="params.queue_title" placeholder="请输入内容"></el-input>
        </div>
        <div>
          <span>中控状态:</span>
          <el-select v-model="params.status" placeholder="请选择">
            <el-option
              v-for="(item,index) in status"
              :key="index+'status'"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div>
          <span>使用人:</span>
          <el-input v-model="params.userName" placeholder="请输入内容"></el-input>
        </div>
        <div class="block">
          <span class="demonstration">开始时间</span>
          <el-date-picker v-model="params.start_date" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">结束时间</span>
          <el-date-picker v-model="params.end_date" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div class="margin">
        <el-button slot="reference" type="primary" @click="edit">编辑</el-button>
        <el-button type="primary" @click="group">分组</el-button>
        <el-button type="primary" @click="removeControl">从分组移除中控</el-button>
      </div>
    </div>
    <div class="control-box">
      <!-- 编辑 -->
      <el-dialog width="500px" :visible.sync="dialogEdit" :title="editGroup=='edit'?'修改中控配置':'创建分组'">
			<!-- 4G拨号设置格式 -->
        <div v-show="editGroup=='edit'">
          <el-form label-width="150px">
            <el-form-item v-show="editIds.length<2" label="中控名称" class="input-item">
              <el-input v-model="isEditName"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="isSelectStatus" placeholder="请选择">
                <el-option label="启用" value="0"></el-option>
                <el-option label="停用" value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="窗口数量" class="input-item">
              <el-input v-model="wCount"></el-input>
            </el-form-item>
            <el-form-item label="4G网络设置">
              <el-select v-model="isSelectIp" @change="changeIp" placeholder="请选择">
                <el-option label="不换IP" value="1"></el-option>
                <el-option label="换IP" value="2"></el-option>
              </el-select>
              <p class="is-show-4g" v-show="isShow4G">4G网络配置不一致，保存后将改为统一配置</p>
            </el-form-item>
          </el-form>
          <div v-show="isSelectIp=='2'">
            <el-form label-width="150px" :model="site4g" :rules="rules" ref="ruleForm">
              <!-- <h3>4G拨号设置格式</h3> -->
              <el-form-item label="连接类型" prop="con_type">
                <el-select v-model="site4g.con_type" placeholder="选择连接类型">
                  <el-option value="0" label="Api"></el-option>
                  <el-option value="1" label="ApiSsl"></el-option>
                  <el-option value="2" label="Api_v2"></el-option>
                  <el-option value="3" label="ApiSsl_v2"></el-option>
                  <el-option value="4" label="Ssh"></el-option>
                  <el-option value="5" label="Telnet"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用户名" class="input-item" prop="username">
                <el-input v-model="site4g.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" class="input-item" prop="password">
                <el-input v-model="site4g.password"></el-input>
              </el-form-item>
              <el-form-item label="模式" prop="mode">
                <el-select v-model="site4g.mode" @change="changeModle" placeholder="模式">
                  <el-option value="0" label="间隔时间"></el-option>
                  <el-option value="1" label="间隔次数"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="editModle || '间隔'" class="input-item" prop="interval">
                <el-input v-model="site4g.interval"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveEdit('ruleForm')">保存</el-button>
          </div>
        </div>
        <!-- 分组 -->
        <div v-show='editGroup=="group"'>
          <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="分组名称">
              <el-input v-model="groupName" placeholder="小组名" @keyup.enter.native="submitGroup"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitGroup">创建分组</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 列表 -->
      <div class="el-row">
          <el-card shadow="hover" class="box-card" v-for="(items,index) in list" :key="index">
            <div slot="header" class="clearfix">
              <span>{{items.title}}</span>
              <el-button v-if="items.server_type_id !== 0" type="primary" style="float: right; padding: 4px 10px" @click="dissGroup(items.server_type_id)">解散分组</el-button>
            </div>
            <div class="item-content">
              <div v-for="(item,index) in items.itemList" :key="index+'item'" class="text item control" :class="item.isSelect?'is-select':'no-select'">
                <el-checkbox  v-model="item.isSelect" class="select-checkbox"></el-checkbox>
                <!-- <div v-model="item.isSelect"></div> -->
                <div class="left">
                  <img :src="`http://api.okaymw.com/api/screen?uid=${item.uid}&tag=small`|defaultImg('contorl')" @click="enlarge(item.uid)" />
                  <p v-if="item.isSeconds" :class="item.net_state==0?'normal':'abnormal'">网络状态{{item.net_state | netState}}</p>
                  <p v-else class="error-nomal">网络状态--</p>
                </div>
                <div class="right">
                  <p><span>中控名称:</span>{{item.name}}</p>
                  <p><span>队列标识:</span>{{item.queue_title}}<i v-if="item.tag_name">-></i>{{item.tag_name}}</p>
                  <!-- <p><span>ip:</span>{{item.ip}}</p> -->
                  <p><span>使用人:</span>{{item.username || '无'}}</p>
                  <p><span>心跳时间:</span><span :class="item.isSeconds?'':'seconds-15'">{{dateFormat(item.lastcore,item.id)}}</span></p>
                  <p><span>窗口数量:</span>{{item.w_count}}</p>
                  <p><span>状态:</span><em :class="item.status=='0'?'normal':'abnormal'">{{item.status | controlStatus}}</em></p>
                </div>
              </div>
            </div>
          </el-card>
      </div>
	  <div class="big-img">
		  <el-dialog width='1240px' :visible.sync="dialogTableVisible">
			  <img :src="bigImg" alt="">
		  </el-dialog>
	  </div>
      <!-- <div class="pages"> -->
        <ul class="pages" v-if="pages>1">
          <li v-for="(page,index) in pages" :key="index+'page'" @click="goPage(index+1)">{{page}}</li>
        </ul>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import {apiGetControlList,apiGetZkUserList,apiEditZkUpdate,setControlGroup,dissControlGroup,removeContorlItem} from "@/request/api";
import { getLocal } from "@/utils/storage";
import { dateFormat } from "@/utils/common";
export default {
  data() {
    return {
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        con_type:[
          { required: true, message: '请选择连接类型', trigger: 'blur' },
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        interval:[
          { required: true, message: '请输入间隔', trigger: 'blur' },
        ],
        mode:[
          { required: true, message: '请选择连模式', trigger: 'blur' },
        ]
      },
      dialogEdit:false, //编辑弹窗
      dialogTableVisible:false, //大图弹窗
      bigImg:'', //大图
      params: {
        userid: "",
        name: "",
        queue_title: "",
        status: "",
        username: "",
        server_title: "",
        start_date: "",
        end_date: ""
      },
      status: [
        { name: "全部", id: "" },
        { name: "正常", id: 0 },
        { name: "停用", id: -1 }
      ],
      site4g: {
        con_type: "",
        username: "",
        password: "",
        interval: "",
        mode: ""
      },
      editModle: "", // 选择模式
      con_typeId: "",
      editIds: [],
      list: [], // 取到的数据
      contorl: {
        // 后台返回的数据
        userList: "", //用户列表
        serverList: "", //服务器类型列表
        queueList: "" //d队列列表
      },
      pages: "", //分页
      timer: false,
      editRobot: [],
      disabled: true,
      editGroup:'', // 判断是分组还是编辑
      groupName:'', //分组名称
      isEditName:'',
      isSelectIp:'1', //是否换ip
      isSelectStatus:'', //启用停用状态
      wCount:'', // 窗口数量
      isShow4G:false, // 是否多选中控4g配置
    };
  },
  created() {
    this.search();
  },
  computed: {
    userId() {
      return this.$store.state.userId || getLocal("userId") || "";
    },
    isSuper(){
      return this.$store.state.isSuper || getLocal('isSuper') || ''
    }
  },
  methods: {
    // 解散分组
    dissGroup(id){
      this.$confirm('确认解散分组?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dissGroupApi(id)
        }).catch(() => {       
        });
    },
    dissGroupApi(id){
      dissControlGroup({
        server_type_id:id
      }).then(res =>{
        this.$message.success('解散分组成功')
        this.getControlList('','',1)
      }).catch(err =>{
        console.log(err)
      })
    },
    // 创建分组
    submitGroup(){
      if(!this.groupName){
        this.$message.error('分组名称不能为空')
        return false
      }
      setControlGroup({
        ids:this.editIds,
        server_title:this.groupName
      }).then(res =>{
        if(res.data.state=='success'){
          this.getControlList('','',1)
          this.dialogEdit = false
          this.$message.success('分组成功')
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err =>{
        console.log(err)
      })
      this.groupName = ''
    },
    // 分组
    group(){
      this.editGroup = 'group'
      let result = false;
      this.disabled = false;
      this.list.forEach(items => {
        items.itemList.forEach(item =>{
          if (item.isSelect) {
            result = true;
            this.editIds.push(item.id);
          }
        })
      });
      if(!result){
        this.$message.error('请选择中控')
        return false
      }
      this.dialogEdit=true
    },
    enlarge(img) {
      this.dialogTableVisible = true
      this.bigImg = `http://api.okaymw.com/api/screen?uid=${img}`
    },
    changeModle(val) {
      // 监控选择的模式
      switch (val) {
        case "0":
          return (this.editModle = "间隔时间");
        case "1":
          return (this.editModle = "间隔次数");
      }
    },
    // 选择ip模式
    changeIp(val){
      if(val==2&&this.editIds.length>1){
        this.isShow4G=true
      }
    },
    edit() {
      this.editGroup = 'edit'
      //点编辑按钮之前判断有没有选择中控
      let result = false;
      this.disabled = false;
      let copySite4g = []
      this.list.forEach(items => {
        items.itemList.forEach(item =>{
          if (item.isSelect) {
            result = true;
            this.editIds.push(item.id);
            copySite4g.push(item.g4)
          }
        })
      });
      if (result) {
        // 不换ip
        this.isSelectIp='1'   
        if(this.editIds.length === 1){
          this.list.forEach(items =>{
            items.itemList.forEach(item =>{
              if(this.editIds[0]===item.id){
                this.isEditName = item.name
                this.isSelectStatus = item.status
                this.wCount = item.w_count
              }
            })
          })
          // 换ip
          if(copySite4g[0]){
            this.isSelectIp='2'
            let copySite4g_1 = JSON.parse(copySite4g[0])
            copySite4g_1.mode = copySite4g_1.mode.toString()
            this.site4g = {
              con_type: copySite4g_1.con_type,
              username: copySite4g_1.username,
              password: copySite4g_1.password,
              interval: copySite4g_1.interval,
              mode: copySite4g_1.mode
            }
          }
        }else{
          // 多选中控的时候,取数据第一条不为空的配置
          for(var i = 0;i<copySite4g.length;i++){
            if(copySite4g[i]){
              let a = JSON.parse(copySite4g[i])
              if(a.username){
                this.isShow4G=true
                this.isSelectIp='2'
                this.site4g ={
                  con_type: a.con_type,
                  username: a.username,
                  password: a.password,
                  interval: a.interval,
                  mode: a.mode
                }
                break;
              }
            }
          }
        }
        this.editContorl();
      } else {
        this.disabled = true;
        this.$message({
          message: "请选择中控",
          type: "error"
        });
        return false;
      }
    },
    // 移除中控
    removeControl(){
      this.list.forEach(items =>{
        items.itemList.forEach(item =>{
          if (item.isSelect) {
            this.editIds.push(item.id);
          }
        })
      })
      if(this.editIds.length===0){
        this.$message.error('请选择中控')
        return false
      }
      this.$confirm('确认移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeContorlItem({
        ids:this.editIds
      }).then(res =>{
        if(res.data.state==='success'){
          this.search()
          this.editIds=[]
          this.$message.success('移除中控成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
      }).catch(() => {  
          this.editIds=[]
      });
    },
    // 保存修改内容
    saveEdit(formName) {
      let name = this.isEditName
      let w_count = this.wCount
      let status = this.isSelectStatus
      let params = {
        json4g:'',
        name:name,
        w_count:w_count,
        status:status
      }
      if(this.isSelectIp==1){
        this.saveEditApi(params)
      }else{
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let site4g = this.site4g;
            let json4g = JSON.stringify(site4g);
            params.json4g=json4g,
            this.saveEditApi(params)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    saveEditApi(p){
      this.isSelectIp=Number(this.isSelectIp)
      apiEditZkUpdate({
        userid: this.userId,
        ids: this.editIds,
        g4: p.json4g,
        type:this.isSelectIp,
        name:p.name,
        w_count:p.w_count,
        status:p.status
      }).then(res => {
        if(res.data.state === 'error'){
          this.$message.error(res.data.msg)
        }else{
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.search()
          this.dialogEdit = false
        }
      }).catch(err => {
        console.log(err);
      });
    },
    startTime() {
      if (this.params.start_date) {
        let data = this.params.start_date;
        return this.time(data);
      }
    },
    endTime() {
      if (this.params.end_date) {
        let data = this.params.end_date;
        return this.time(data);
      }
    },
    time(data) {
      if (data) {
        let year = data.getFullYear();
        let mounth = data.getMonth() + 1;
        let day = data.getDate();
        this.changeTime(mounth);
        this.changeTime(day);
        let searchTime = `${year}-${this.changeTime(mounth)}-${this.changeTime(day)}`;
        return searchTime;
      }
    },
    // 获取列表
    search() {
      let start = this.startTime();
      let end = this.endTime();
      if (end < start) {
        this.$message.error("开始时间不能大于结束时间");
        return false;
      }
      if (end && !start) {
        this.$message.error("请选择开始时间");
        return false;
      }
      if (start && !end) {
        this.$message.error("请选择结束时间");
        return false;
      }
      this.getControlList(start, end, 1);
    },
    // 获取列表api
    getControlList(s, e, index) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
      let _this = this;
      apiGetControlList({
        userid: this.userId,
        page_index: index,
        page_size: 50,
        name: this.params.name,
        queue_title: this.params.queue_title,
        username: this.params.userName,
        server_title: this.params.server_title,
        ip: this.params.ip,
        uid: this.params.uid,
        start_date: s,
        end_date: e,
        status: this.params.status
      }).then(res => {
        _this.list = []
        res.data.forEach(item => {
          item.isSelect = false;
          item.isSeconds=false; //超时判断条件
          let p = _this.list.find(pro =>{
            return pro.server_type_id === item.server_type_id
          })
          if(p){
            p.itemList.push(item)
          }else{
            let a= ''
            if(item.server_type_id === 0){
              a='未分组'
            }else{
              a=item.server_title
            }
            let controlItem ={
              server_type_id:item.server_type_id,
              isSelect:false,
              title:a,
              itemList:[item]
            }
            _this.list.push(controlItem)
          }
        });
        _this.pages = res.total;
      }).catch(err => {

      }).finally(()=>{
        loading.close();
      });
    },
    // 分页
    goPage(i) {
      this.getControlList("", "", i);
    },
    // 编辑中控
    editContorl() {
      apiGetZkUserList().then(res => {
		  this.dialogEdit = true
          this.contorl = {
            userList: res.data.userList,
            queueList: res.data.queueList,
            serverList: res.data.serverTypes
          };
        }).catch(err => {
          console.log(err);
        });
    },
    // 格式化时间
    changeTime(t) {
      if (t < 10) {
        t = "0" + t;
      }
      return t;
    },
    // 格式化时间
    dateFormat(date,id) {
      let getTime = new Date(date).getTime()
      let nowTime = new Date().getTime()
      let seconds15 = 1000*60*15
      this.list.forEach(items =>{
        items.itemList.forEach(item =>{
          if(item.id === id){
            if((nowTime-getTime)<seconds15||(nowTime-getTime)===seconds15){
              item.isSeconds=true
            }
          }
        })
      })
      if(date){
        let time = date.split('T')
        let year = time[0]
        let day = time[1]
        return `${day}`   
      }
    },
  },

  watch: {
    dialogEdit(val){
      if(!val){
        this.list.forEach(items => {
          items.itemList.forEach(item =>{
            item.isSelect = false;
          })
        });
        this.editIds = [];
        this.groupName = ''
        this.isEditName=''
        this.isSelectStatus = ''
        // this.isSelectIp = ''
        this.wCount=''
        this.isShow4G=false
        this.site4g = {}
      }
    },
    dialogTableVisible(val){
      if(!val) this.bigImg = ''
    }
  },
  filters: {
    netState(state) {
      switch (state) {
        case 0:
          return "正常";
          break;
        default:
          return "异常";
      }
    },
    controlStatus(status){
      switch(status){
        case '0':
          return '启用';
        case '-1':
          return '停用'
      }
    }
  }
};
</script>
<style scoped>
.central-control .control-box{margin-top: 170px}
.central-control .control-box .toggle {
  margin-right: 10px;
}
.central-control .control-box .el-row .box-card {
  margin-top: 10px;
}
.central-control .control-box .el-row .box-card .item-content{
  display: flex;
  flex-wrap: wrap;
}
.central-control .control-box .el-row .box-card .item-content .item{
  margin: 10px;
  width: 420px;
}
.central-control .control-box h3{text-align: center;margin-bottom:20px }
.central-control .control {
  display: flex;
  justify-content: space-around;
}
.central-control .control .left {
  width: 200px;
}
.central-control .control img {
  width: 200px;
  height: 112px;
  display: block;
}
.central-control .control .left p {
  text-align: center;
  color: #fff;
}
.central-control .control .left p.normal {
  background: rgb(30, 210, 90);
}
.central-control .control .left p.abnormal {
  background: rgba(235, 5, 5, 0.698);
}
.central-control .control .right p .normal{color:#409EFF}
.central-control .control .right p .abnormal{color: rgba(235, 5, 5, 0.698);}
.central-control .control > .right {
  flex-grow: 1;
  margin-left: 10px;
}
.central-control .el-row .item {
  position: relative;
}
.central-control .el-row .item .select-checkbox {
  position: absolute;
  left: -2px;
  top: -3px;
}
.central-control .el-row p {
  font-size: 14px;
  color: #333;
  font-family: "Microsoft Yahei";
  line-height: 22px;
  margin-top: 2px;
}
.central-control .el-row p span {
  margin-right: 4px;
  padding: 1px 2px;
}
.central-control .data {
  text-align: center;
}
.central-control .control-box .el-row .item{
  padding: 12px
}
.central-control .control-box .el-row .is-select {
  border: 1px solid #409eff;
}
.central-control .control-box .el-row .no-select{
  border: 1px solid #f4f4f4
}
.edit-temp {
  margin-right: 10px;
}
.edit-temp > button {
  margin-right: 10px;
}
.big-img .big-img-box{width:100%;}
.input-item .el-input{width: 217px}
.margin{margin-top: 20px;}
.dialog-footer{text-align: right}
.is-show-4g{font-size: 12px;line-height: 20px;color:rgba(235, 5, 5, 0.698)}
.seconds-15{color:rgba(235, 5, 5, 0.698)}
.error-nomal{background: #ccc}
</style>