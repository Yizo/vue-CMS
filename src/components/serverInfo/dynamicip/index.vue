<template>
  <div id="dynamicIp">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器信息</el-breadcrumb-item>
      <el-breadcrumb-item>动态IP状态</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="wrap_filter">
      <el-table
        :data="data"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          property="id"
          type="index"
          width="100"
          label="编号">
        </el-table-column>
        <el-table-column
          property="url"
          label="IP/域名">
        </el-table-column>
        <el-table-column
          property="region"
          label="区域">
        </el-table-column>
        <el-table-column
          property="priority"
          label="优先级">
        </el-table-column>
        <el-table-column
          label="失败总数">
          <template scope="scope">
            <span class="dialog_num" @click="detail(scope.row)">{{scope.row.failed_count}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right;margin: 15px 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          class="page">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="失败详情" v-model="dialogFormVisible" size="small">
      <el-table :data="dialogData" border>
        <el-table-column property="username" label="账号"></el-table-column>
        <el-table-column label="当前版本信息">
          <template scope="scope">{{scope.row.username}}_{{scope.row.app_version}}_{{scope.row.app_version_number}}</template>
        </el-table-column>
        <el-table-column label="时间">
          <template scope="scope">{{scope.row.created_at | Time}}</template>
        </el-table-column>
        <el-table-column property="ip" label="用户IP"></el-table-column>
        <el-table-column label="IP解析">
          <template scope="scope">{{scope.row.ip_country}}_{{scope.row.ip_province}}_{{scope.row.ip_city}}</template>
        </el-table-column>
        <el-table-column property="device_model" label="硬件"></el-table-column>
        <el-table-column property="operator" label="运营商"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-pagination
          @current-change="d_handleCurrentChange"
          :current-page="d_currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="d_total"
          class="page">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  export default {
    name: 'dynamicipStar',
    data() {
      return {
        data:[],
        currentPage: 1,
        pageSize: 15,
        total: 1,
        dialogFormVisible: false,
        dialogData:[],
        dlalog_id:0,
        d_currentPage:1,
        d_total: 1,
      }
    },

    methods: {
      detail(data){
        this.dlalog_id = data.id;
        this.dialogFormVisible = true;
        this.getDetail({id:data.id,limit:this.pageSize}).then(res=>{
            var data = res.data.data;
            this.dialogData = data.logs;
            this.d_currentPage = data.current_page;
            this.d_total = data.total_count
        })
      },
      getInfo(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.dynamic_status,
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
      getDetail(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.dynamic_status_details.replace(/{id}/g,parm.id);
          this.$http({
            method:'GET',
            url:address,
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
      //获取数据
      getDncIpData(val){
        this.getInfo({page:val,limit:this.pageSize}).then(res=>{
          let data = res.data.data;
          this.data = data.dynamic_servers;
          this.currentPage = data.current_page;
          this.total = data.total_count
        })
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.$store.dispatch('getChannelData', {page: this.currentPage, limit: this.limit})
      },
      d_handleCurrentChange(val){
        this.getDetail({id:this.dlalog_id,page:val,limit:this.pageSize}).then(res=>{
          var data = res.data.data;
          this.dialogData = data.logs;
          this.d_currentPage = data.current_page;
          this.d_total = data.total_count
        })
      }
    },
    mounted(){
        this.getDncIpData(1);
    }
  }
</script>

<style lang="less" scope>
  #dynamicIp {
    padding: 10px;
  }

  .wrap_filter {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .wrap_filter table td, .el-form-item__content, .el-dialog__header {
    text-align: left;
  }

  .pagination-wrap {
    text-align: right;
    margin-top: 15px;
  }
  .el-table .cell{
    text-align: center;
  }
</style>

