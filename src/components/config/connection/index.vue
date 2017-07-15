<template>
  <div class="lock">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户端日志查询</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row style="text-align: left;margin-top: 20px">
      <el-date-picker
        v-model="filter.start"
        type="date"
        @change="start_date"
        placeholder="开始日期">
      </el-date-picker>
      <el-date-picker
        v-model="filter.end"
        type="date"
        @change="end_date"
        placeholder="结束日期">
      </el-date-picker>
      <div style="display: inline-block">
        <el-input placeholder="请输入内容" v-model="qurey">
          <el-select v-model="qurey_type" slot="prepend" placeholder="请选择" style="width: 100px">
            <el-option label="取消" value=""></el-option>
            <el-option label="账号ID" value="1"></el-option>
            <el-option label="账号名" value="2"></el-option>
          </el-select>
        </el-input>
      </div>
      <el-select v-model="proxy_type" placeholder="代理形式">
        <el-option label="全部" value=""></el-option>
        <el-option label="代理" value="true"></el-option>
        <el-option label="直连" value="false" checked></el-option>
      </el-select>
      <el-button style="margin-left: 40px" @click="filtration" icon="search">筛选</el-button>
    </el-row>
    <div class="warp_filter">
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="user_id"
            label="用户ID" width="80">
          </el-table-column>
          <el-table-column
            label="用户名">
            <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="访问时间点">
            <template scope="scope">
            <span>
              {{scope.row.created_at | Time}}
            </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="node_id"
            label="代理服务器ID" width="100">
          </el-table-column>
          <el-table-column
            prop="node_ip"
            label="代理服务器IP">
          </el-table-column>
          <el-table-column
            prop="target_url"
            label="目标网站地址">
          </el-table-column>
          <el-table-column
            prop="is_proxy"
            label="代理形式" width="80">
            <template scope="scope">
            <span>
              {{scope.row.is_proxy?'代理':'直连'}}
            </span>
            </template>
          </el-table-column>
          <el-table-column
            label="版本">
            <template scope="scope">
            <span>
              {{scope.row.app_channel}}_{{scope.row.app_version}}_{{scope.row.app_version_number}}
            </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--分页-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
      class="page">
    </el-pagination>
    <user-detail :visab="user_dialogVisible" :name="username" @closeDialog="cdialog"></user-detail>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  import {mapGetters, mapActions} from 'vuex'
  import userDetail from '../../publicView/accoutInfo/index.vue'
  export default {
    data(){
      return {
        tableData: [],
        proxy_type: null,
        qurey_type: '1',
        qurey: '',
        input5: '',
        currentPage: 1,
        totalSize: 0,
        pageSize: 30,
        user_dialogVisible: false,
        username: '姓名',
      }
    },
    components: {
      userDetail
    },
    computed: {
      ...mapGetters(['initDate']),
      filter(){
        return this.initDate
      },
    },
    methods: {
      ...mapActions({
        ud_base: 'UD_base_info',
      }),
      cdialog(){
        this.user_dialogVisible = false
      },
      userInfo(row){
        this.username = row.username
        this.user_dialogVisible = true;
        window.sessionStorage.setItem('userId', row.user_id)
        this.ud_base({limit: 10})
      },
      /*去向日志*/
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.client_connection_logs,
            headers: {'Authorization': token},
            params: parm,
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      sortOut(val){
        if (typeof this.filter.start == 'object') {
          this.filter.start = JS.Timestamp(this.filter.start)
        }
        if (typeof this.filter.end == 'object') {
          this.filter.end = JS.Timestamp(this.filter.end)
        }
        let options = {
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end,
          is_proxy: this.proxy_type,
          qurey_type: parseInt(this.qurey_type),
          q: this.qurey

        }
        if (options.start_at && options.end_at || !options.start_at && !options.end_at) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        this.currentPage = val;
        this.getInfo(options).then(res => {
          const data = res.data.data;
          this.totalSize = data.total_count;
          this.tableData = [...data.logs];
        })
      },
      /*分页*/
      handleCurrentChange(val) {
        this.sortOut(val)
      },
      //筛选
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(){
        this.sortOut(1)
      },
    },
    mounted(){
      this.sortOut(1)
    }
  }
</script>

<style scoped>
  .lock {
    padding: 10px;
  }

  .warp_filter {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
    height: 700px;
    overflow-y: auto;
  }
</style>

