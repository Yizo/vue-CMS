<template>
  <div id="loginIp">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'start' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>登录IP</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="loginIp-wrapper">
      <el-table
        :default-sort = "{prop: 'created_at'}"
        :data="data"
        @sort-change="sort"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="username"
          label="账号">
        </el-table-column>
        <el-table-column
          sortable
          prop="created_at"
          label="登录时间">
          <template scope="scope">
            {{scope.row.created_at | Time}}
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="用户IP">
        </el-table-column>
        <el-table-column
          prop="ip_region"
          label="IP解析">
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      class="page">
    </el-pagination>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import { mapGetters,mapActions } from 'vuex'
//  import
  export default{
    data(){
      return {
        data:[],
        currentPage:1,
        pageSize:15,
        total:0,
        order_by:'desc'
      }
    },
    methods: {
      //获取信息
      getInfo(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.loginip,
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
      handleCurrentChange(val){
        this.getInfo({page:val,limit:15}).then(res=>{
          this.data = res.data.data.logs;
          this.currentPage = res.data.data.current_page;
          this.total = res.data.data.total_count;
        })
      },
      sort(column){
          if(column.order == "descending"){
            this.order_by = 'desc'
          }else{
            this.order_by = 'asc'
          }
        this.getInfo({page:this.currentPage,limit:15,order_by:this.order_by}).then(res=>{
          this.data = res.data.data.logs;
          this.currentPage = res.data.data.current_page;
          this.total = res.data.data.total_count;
        })

      }

    },
    mounted(){
        this.getInfo({limit:15}).then(res=>{
            this.data = res.data.data.logs;
            this.currentPage = res.data.data.current_page;
            this.total = res.data.data.total_count;
        })
    }
  }
</script>

<style scoped>
  #loginIp{
    padding: 10px;
    overflow: auto;
  }
  /*导航*/
  #loginIp .breadcrumb{
    height: 30px;
    line-height: 30px;
  }
  .loginIp-wrapper{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px
  }
  .page{
    margin-top: 20px;
    text-align: right;
  }
</style>

