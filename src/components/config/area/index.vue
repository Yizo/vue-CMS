<template>
  <div class="lock">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器群组管理</el-breadcrumb-item>
      <el-breadcrumb-item>地域配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warp_filter">
      <el-button type="primary" @click="add1" style="margin-bottom: 10px">新增</el-button>
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="地域编号">
          </el-table-column>
          <el-table-column
            prop="node_type_name"
            label="服务器类型">
          </el-table-column>
          <el-table-column
            prop="name"
            label="地域名称">
          </el-table-column>
          <el-table-column
            label="国旗图标">
            <template scope="scope">
              <img :src="url+'/flags/'+scope.row.abbr+'.png'" alt="">
            </template>
          </el-table-column>
          <el-table-column
            label="操作功能">
            <template scope="scope">
            <span>
                <el-button size="small" @click="update1(scope.row)">修改</el-button>
                <el-button size="small" @click="star(scope.row)" :class="{a:scope.row.is_enabled,b:!scope.row.is_enabled}">{{isEnable(scope.row.is_enabled)}}</el-button>
            </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--新增-->
    <el-dialog title="新增地域" v-model="dialogVisible" size="tiny">
      <el-form :model="form" label-width="130px">
        <el-form-item label="服务器类型">
            <el-select v-model="form.node_type_id" style="width: 100%">
              <el-option
                v-for="(item,index) in pageInfo.data"
                :label="item.name"
                :value="item.id"
                :key="index">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="地域名称">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="国旗图标">
          <el-input v-model="form.abbr" auto-complete="off" placeholder="填写国家或地区简写代码">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">
          <span @click="add">确定</span>
        </el-button>
      </div>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改地域" v-model="dialogVisible_update" size="tiny">
      <el-form :model="form" label-width="130px">
        <el-form-item label="地域编号">
          <el-input v-model="form2.id" auto-complete="off" :disabled="true" ></el-input>
        </el-form-item>
        <el-form-item label="服务器类型">
          <el-select v-model="form2.node_type_id" style="width: 100%">
            <el-option
              v-for="(item,index) in pageInfo.data"
              :label="item.name"
              :value="item.id"
              :key="index">
            </el-option>
          </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="地域名称">
          <el-input v-model="form2.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="国旗缩写">
          <el-input v-model="form2.abbr" auto-complete="off" placeholder="填写国家或地区简写代码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_update = false">取 消</el-button>
        <el-button type="primary">
          <span @click="update">确定</span>
        </el-button>
      </div>
    </el-dialog>
    <!--分页-->
    <!--    <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          class="page">
        </el-pagination>-->
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  export default {
    data(){
      return {
        tableData:[],
        enabled_type:'',//按钮类型
        currentPage: 1,
        totalSize:10,
        url:API.url,
        /*弹窗*/
        dialogVisible:false,
        dialogVisible_update:false,
        pageInfo:{
            index:1,
            data:'',//服务器节点类型,
            up_data:''
        },
        form:{
          node_type_id:'',
          name:'',
          abbr:''
        },
        form2:{
            id:'',
            node_type_id:'',
            name:'',
            abbr:''
        },
      }
    },
    methods:{
      /*是否启用*/
      isEnable(data){
        if(data){
            return '禁用'
        }else{
            return '启用'
        }
      },
      /*获取地域信息*/
      getInfo(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.area_node_regions,
            headers: {'Authorization': token},
            params:parm,
          }).then(function(res){

            if(res.status == 200){
              resolve(res)
            }else{
              reject(res)
            }
          })
        })
      },
      /*新增地域*/
      addInfo(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'POST',
            url:API.area_node_regions,
            headers: {'Authorization': token},
            params:parm,
          }).then(function(res){

            if(res.status == 200){
              resolve(res)
            }else{
              reject(res)
            }
          })
        })
      },
      /*启用/禁用*/
      enable(id,parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'PATCH',
            url:API.area_update+'/'+id,
            headers: {'Authorization': token},
            params:parm,
          }).then(function(res){

            if(res.status == 200){
              resolve(res)
            }else{
              reject(res)
            }
          })
        })
      },
      /*修改地域*/
      update_area_node_regions(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'PATCH',
            url:API.area_update+parm.id,
            headers: {'Authorization': token},
            params:parm,
          }).then(function(res){

            if(res.status == 200){
              resolve(res)
            }else{
              reject(res)
            }
          })
        })
      },
      /*分页*/
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getuser(val)
      },
      add1(){
        this.dialogVisible = true;
        JS.getNodeType({is_enabled:'true'}).then(res=>{
            this.pageInfo.data = res.data.data.node_types;
        })
      },
      add(){
        if(JS.checkEmpty(this.form)){
            this.form.abbr = this.form.abbr.toLowerCase()
          this.addInfo(this.form).then(res=>{
            if(res.data.success){
              this.getInfo().then(res=>{
                this.tableData = res.data.data.regions
              })
              this.dialogVisible = false;
              this.$message({
                message: '新增成功',
                type: 'success'
              });
            }else{
              this.$message({
                message: '格式错误',
                type: 'error'
              });
            }
          })
        }else{
          this.$message({
            message: '不能为空',
            type: 'warning'
          });
        }
      },
      update1(data){
        this.dialogVisible_update = true
        this.form2.id = data.id;
        this.form2.name = data.name;
        this.form2.node_type_id = data.node_type_id;
        this.form2.abbr = data.abbr;
        JS.getNodeType({is_enabled:'true'}).then(res=>{
          this.pageInfo.data = res.data.data.node_types;
        })
      },
      update(){
        if(JS.checkEmpty(this.form2)){
          this.form.abbr = this.form.abbr.toLowerCase()
          this.update_area_node_regions(this.form2).then(res=>{
            if(res.data.success){
              this.getInfo().then(res=>{
                this.tableData = res.data.data.regions
              })
              this.dialogVisible_update = false;
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }else{
              this.$message({
                message: '格式错误',
                type: 'error'
              });
            }
          })
        }else{
          this.$message({
            message: '不能为空',
            type: 'warning'
          });
        }
      },
      star(data){
          this.enable(data.id,{id:data.id,is_enabled:!data.is_enabled}).then(res=>{
            this.tableData.splice(this.tableData.indexOf(data),1,res.data.data)
          })
      }
    },
    mounted(){
      this.getInfo().then(res=>{
        this.tableData = res.data.data.regions
      })
    }
  }
</script>

<style scoped>
  .lock{
    padding: 10px;
  }
  .warp_filter{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px;
  }
  .el-select{
    width: 100%;
  }
  .a{
    background: #F9C855;
    color: #fff;
    border: #F9C855;
  }
  .b{
    background-color: #42D885;
    border: #42D885;
    color: #fff;
  }
  .el-table .cell img{
    height: 30px;
    margin-top: 10px;
  }
</style>

