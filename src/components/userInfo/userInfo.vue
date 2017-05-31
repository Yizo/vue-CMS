<template>
  <div id="userInfo" v-loading.body="loading">

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'userInfo' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--周期统计-->
    <div class="count">
      <div style="padding: 10px;">
        <h2><span>周期统计</span>统计周期10分钟</h2>
        <ul>
          <li>
            <div>
              <p>{{USERINFO_base.data.users_count}}</p>
              <h4>用户总数</h4>
            </div>
          </li>
          <li>
            <div>
              <p>{{USERINFO_base.data.online_users_count}}</p>
              <h4>当前在线人数</h4>
            </div>
          </li>
          <li>
            <div>
              <p>{{USERINFO_base.data.active_users_count}}</p>
              <h4>今日活跃人数</h4>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!--用户列表-->
    <div class="warp_list">
      <!--工具条-->
      <div class="filter">
        <el-row :gutter="20">
          <el-col :span="8">
            <span class="title">版本筛选</span>
            <el-select v-model="filter.version" placeholder="请选择">
              <el-option v-for="(item,index) in versions.app_versions" :label="item.name" :value="item.name"
                         :key="index">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="title">渠道筛选</span>
            <el-select v-model="filter.channel" placeholder="请选择">
              <el-option v-for="(item,index) in versions.app_channels" :label="item.name" :value="item.name"
                         :key="index">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="title">用户状态筛选</span>
            <el-select v-model="filter.str" placeholder="请选择">
              <el-option v-for="(item,index) in options1" :label="item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <span class="title">时间筛选</span>
            <el-select v-model="filter.time" placeholder="请选择">
              <el-option v-for="(item,index) in options2" :label="item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="title">日期筛选</span>
            <el-date-picker
              v-model="filter.start"
              type="date"
              placeholder="开始日期"
              @change="start_date">
            </el-date-picker>
            <el-date-picker
              v-model="filter.end"
              type="date"
              placeholder="结束日期"
              @change="end_date">
            </el-date-picker>
          </el-col>
          <el-col :span="8" style="text-align: left">
            <el-input v-model="ser" placeholder="请输入账号" style="width:200px"></el-input>
            <el-button icon="search" @click
              ="search">搜索
            </el-button>
          </el-col>
        </el-row>
        <!--搜索-->
        <el-row>
          <el-button @click="filtration">筛选</el-button>
        </el-row>
      </div>
      <!--列表-->
      <table class="table">
        <thead>
        <tr>
          <th>ID</th>
          <th>账号</th>
          <th>密码</th>
          <th>UUID</th>
          <th>用户状态</th>
          <th>充值金额</th>
          <th>钻石</th>
          <th>累计使用</th>
          <th>账户类型</th>
          <th v-for="(item,index) in tableData[0].user_node_types" class="for1">
            {{item.name}}状态
          </th>
          <th v-for="(item,index) in tableData[0].user_node_types" class="for1">
            本月{{item.name}}次数
          </th>
          <th v-for="(item,index) in tableData[0].user_node_types" class="for1">
            {{item.name}}有效期
          </th>
          <th>登录时间</th>
          <th>登录版本</th>
          <th>注册时间</th>
          <th>注册版本</th>
          <th style="fixed:right">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in tableData">
          <td>{{item.id}}</td>
          <td>{{item.username}}</td>
          <td>****</td>
          <td>{{item.uuid}}</td>
          <td>
            <el-tag
              :type="item.is_enabled ? 'success' : 'primary'"
              close-transition>{{item.is_enabled?'正常':'封号'}}
            </el-tag>
          </td>
          <td>{{item.total_payment_amount}}</td>
          <td>{{item.current_coins}}</td>
          <td>{{item.total_used_coins}}</td>
          <td>{{item.group_name}}</td>
          <!--服务器状态-->
          <td v-for="(item2,index2) in item.user_node_types">
            {{item2.status}}
          </td>
          <!--服务器次数-->
          <td v-for="(item2,index2) in item.user_node_types">
            {{item2.used_count}}
          </td>
          <!--服务器有效期-->
          <td v-for="(item2,index2) in item.user_node_types">
            {{item2.expired_at | Time}}
          </td>
          <td>{{item.last_app_launched_at | Time}}</td>
          <td>{{item.last_app_launched_version}}</td>
          <td>{{item.created_at | Time}}</td>
          <td>{{item.created_version}}</td>
          <td>
            <el-button size="small" @click="detail(item.id)">详情</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!--分页-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="USERINFO_base.data.current_page"
      layout="total, prev, pager, next, jumper"
      :page-size="pageSize"
      :total="USERINFO_base.data.users_count"
      class="page">
    </el-pagination>

    <!--详情弹窗-->
    <user-detail :visab="dialogVisible" @closeDialog="cdialog"></user-detail>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import userDetail from '../publicView/accoutInfo/index.vue'
  export default{
    components: {
      userDetail
    },
    data(){
      return {
        data: [],
        //筛选
        filter: {
          version: '',
          channel: '',
          str: '',
          time: '',
          start: '',
          end: ''
        },
        ser: '',
        //app_versions:versions,
        options1: [
          {
            value: '',
            label: '全部状态'
          }, {
            value: 1,
            label: '正常'
          }, {
            value: 0,
            label: '封号'
          }],
        options2: [
          {
            value: '',
            label: '取消时间筛选'
          },
          {
            value: 'created_at',
            label: '登录时间'
          }, {
            value: 'logged_at',
            label: '注册时间'
          }],
        //列表
        loading: false,
        pageSize: 15,//每页显示15条
        //弹窗
        dialogVisible: false, //不显示详情弹窗
        activeName: 'info',
        id: 1
      }
    },

    computed: {
      ...mapGetters({
        USERINFO_base: 'USERINFO_base',
        versions: 'versions'
      }),
      tableData(){
        return this.USERINFO_base.data.users
      }
    },
    watch: {
      USERINFO_base(data){
        return data
      }
    },
    methods: {
      ...mapActions({
        getInfo: 'USERINFO_getUsers',
        ud_base: 'UD_base_info',
        setId: 'UD_setId'
      }),
      /*筛选菜单*/
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(){
        this.getuser(1);
      },
      search(){
        this.getInfo({q: this.ser, limit: this.pageSize}).then(res => {
          if (res.data.data.users.length == 0) {
            this.$message({
              message: '账号有误',
              type: 'warning',
              duration: 1500
            });
          }
        })
      },
      /*列表*/
      //获取用户信息
      getuser(number){
        var options = {
          page: number,
          app_version: this.filter.version == '全部版本' ? null : this.filter.version,
          app_channel: this.filter.channel == "全部渠道" ? null : this.filter.channel,
          is_enabled: this.filter.str === '' ? '' : this.filter.str,
          date_type: this.filter.time ? this.filter.time : '',
          start_at: this.filter.start,
          end_at: this.filter.end,
          limit: this.pageSize
        }
        this.getInfo(options).then(res => {
          return new Promise((resolve, reject) => {
            resolve(res)
          })
        })
      },
      /*详情*/
      detail(row){
        this.dialogVisible = true;
        window.sessionStorage.setItem('userId', row)
        this.ud_base({limit: 15})
      },
      cdialog(){
        this.dialogVisible = false
      },
      /*分页*/
      handleCurrentChange(val) {
        this.getuser(val)
      }

    },
    mounted(){
      this.getInfo({limit: this.pageSize})
    }
  }
</script>

<style lang="less" scoped>
  #userInfo {
    padding: 10px;
  }

  /*导航*/
  #userInfo .breadcrumb {
    height: 30px;
    line-height: 30px;
  }

  /*统计*/
  .count {
    margin: 10px 0;
    background-color: #fff;
    border: 1px solid #D3DCE6;

  h2 {
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: 400;
    text-align: left;

  span {
    margin-right: 10px;
    font-size: 18px;
    color: #666666;
  }

  }
  ul {
    display: flex;
    margin: 10px 0;

  li {
    width: 25%;
    height: 80px;
    margin-right: 10px;
    color: #fff;
    position: relative;

  div {
    top: 20px;
    right: 10px;
    position: absolute;
    height: 30px;
    text-align: center;

  p {
    margin-bottom: 10px;
    font-size: 25px;
  }

  }
  }
  li:nth-child(1) {
    background-color: #3598DC;
  }

  li:nth-child(2) {
    background-color: #E7505A;
  }

  li:nth-child(3) {
    background-color: #32C5D2;
  }

  }
  }
  .warp_list {
    width: 100%;
    overflow: auto;
    background-color: #fff;
    margin-top: 10px;
  }

  /*工具条*/
  .filter {
    text-align: left;
    padding: 10px;
    margin: 10px 0;
    background-color: #fff;
    border: 1px solid #D3DCE6;

  span {
    font-size: 14px;
    color: #475669;
  }

  }
  .filter {

  .f {
    display: inline-block;
    line-height: 50px;
  }

  }
  .filter .el-select {
    width: 150px;
  }

  /*列表*/
  .table {
    padding: 10px;
  }

  .table th, td {
    width: 150px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .el-table .cell {
    word-break: break-all;
    line-height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .el-dialog--small {
    width: 60%;
  }
  .el-row{
    padding: 5px 0;
  }
</style>

