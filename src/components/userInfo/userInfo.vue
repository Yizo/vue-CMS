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
            <span class="title">渠道筛选</span>
            <el-select v-model="filter.channel" placeholder="请选择">
              <el-option v-for="(item,index) in versions.app_channels" :label="item.name" :value="item.name"
                         :key="index">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="title">版本筛选</span>
            <el-select v-model="filter.version" placeholder="请选择">
              <el-option v-for="(item,index) in versions.app_versions" :label="item.name" :value="item.name"
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
            <el-input v-model="ser" placeholder="账号 or UUID" style="width:200px"></el-input>
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
      <el-row style="line-height: 36px">
        <el-col :span="12">
          <p style="text-align: left;margin-left: 5px">用户列表:<span style="font-size: 16px;color: red">{{USERINFO_base.data.total_count}}</span>条结果
          </p>
        </el-col>
        <el-col :span="12">
          <div style="text-align: right;margin-right: 5px">
            <el-button type="primary" @click="add_diamond">为用户批量奖励钻石</el-button>
            <el-dialog :visible.sync="diamond" size="small" @close="diamondCloase" custom-class="filex_dialog">
              <div slot="title" style="text-align: left"><span style="font-size: 16px;font-weight: 500">批量加钻</span>
              </div>
              <p v-if="diamond_verification" class="verification_err">输入格式有误</p>
              <el-form :model="diamond.form" label-width="100">
                <el-form-item label="钻石数" class="dot_tips">
                  <el-input v-model="form.coins" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名(用户名列表，多个用户名请使用回车、空格或英文逗号分割;每次最多处理100个用户名)" class="dot_tips">
                  <el-input type="textarea" rows="10" v-model="form.usernames" auto-complete="off"></el-input>
                </el-form-item>
                <div style="text-align: left" v-show="errshow == true">
                  <p>以下用户添加失败:</p>
                  <span v-for="(item,index) in errData">{{item}}<i style="color: red">/</i></span>
                </div>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="diamond = false">取 消</el-button>
                <el-button type="primary" @click="save_diamonde">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%;" border @row-dblclick="detail2">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="username" label="账号" width="100"></el-table-column>
        <el-table-column prop="uuid" label="UUID" min-width="280"></el-table-column>
        <el-table-column prop="date" label="用户状态" width="80">
          <template scope="scope">
            <el-tag
              :type="scope.row.is_enabled ? 'success' : 'primary'"
              close-transition>{{scope.row.is_enabled?'正常':'封号'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="total_payment_amount" label="充值金额" width="80"></el-table-column>
        <el-table-column prop="current_coins" label="钻石" width="60"></el-table-column>
        <el-table-column prop="total_used_coins" label="累计使用钻石" width="100"></el-table-column>
        <el-table-column prop="group_name" label="账户类型" width="80"></el-table-column>
        <el-table-column label="注册时间" width="150">
          <template scope="scope">
            {{scope.row.created_at | Time}}
          </template>
        </el-table-column>
        <el-table-column prop="created_version" label="注册版本" width="160"></el-table-column>
        <el-table-column label="登录时间" width="150">
          <template scope="scope">
            {{scope.row.last_app_launched_at | Time}}
          </template>
        </el-table-column>
        <el-table-column prop="last_app_launched_version" label="登录版本" width="160"></el-table-column>
        <el-table-column prop="date" label="操作" width="50" fixed="right">
          <template scope="scope">
            <el-button size="small" @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="USERINFO_base.data.current_page"
      layout="total, prev, pager, next, jumper"
      :page-size="pageSize"
      :total="USERINFO_base.data.total_count"
      class="page">
    </el-pagination>

    <!--详情弹窗-->
    <user-detail :visab="dialogVisible" :name="username" @closeDialog="cdialog"></user-detail>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as JS from '../../assets/js/js'
  import * as API from '../../api/api'
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
          str: null,
          time: null,
          start: '',
          end: ''
        },
        ser: '',
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
            value: 'logged_at',
            label: '登录时间'
          }, {
            value: 'created_at',
            label: '注册时间'
          }],
        //列表
        loading: false,
        pageSize: 15,//每页显示15条
        //弹窗
        dialogVisible: false, //不显示详情弹窗
        activeName: 'info',
        id: 1,
        username: '姓名',
        diamond: false,
        diamond_verification: false,
        form: {
          coins: '',
          usernames: ''
        },
        errData: [],//批量添加失败数据
        errshow: false,
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
        devices: "UD_devices",
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
        if (typeof this.filter.start == 'object') {
          this.filter.start = JS.Timestamp(this.filter.start)
        }
        if (typeof this.filter.end == 'object') {
          this.filter.end = JS.Timestamp(this.filter.end)
        }
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
          app_version: this.filter.version,
          app_channel: this.filter.channel,
          is_enabled: this.filter.str === '' ? '' : this.filter.str,
          date_type: this.filter.time ? this.filter.time : '',
          start_at: this.filter.start,
          end_at: this.filter.end,
          limit: this.pageSize
        }
        if (options.start_at && options.end_at || !options.start_at && !options.end_at) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        this.getInfo(options).then(res => {
          return new Promise((resolve, reject) => {
            resolve(res)
          })
        })
      },
      /*详情*/
      detail(row){
        this.username = row.username
        this.dialogVisible = true;
        window.sessionStorage.setItem('userId', row.id)
        this.ud_base({id: row.id, limit: 10}).then(res => {
          this.devices({id: row.id});
        })
      },
      detail2(row){
        this.detail(row)
      },
      cdialog(){
        this.dialogVisible = false
        this.errshow = false
      },
      /*分页*/
      handleCurrentChange(val) {
        this.getuser(val)
      },
      /*批量加钻石*/
      add_diamond(){
        this.diamond = true
      },
      diamondCloase(){
        this.diamond_verification = false
        this.form.usernames = '';
        this.errshow = false
      },
      save_diamonde(){
        if (/^\d+$/.test(String(this.form.coins)) == true && this.form.usernames != '') {
          this.diamond_verification = false
          this.$http({
            method: 'POST',
            url: API.batch_diamond,
            data: {
              coins: parseInt(this.form.coins),
              usernames: this.form.usernames
            },
            headers: {'Authorization': JSON.parse(window.sessionStorage.getItem('loginInfo')).token},
          }).then(res => {
            this.errData = [...res.data.data.failure_usernames]
            if (this.errData) {
              this.errshow = true
            }
          })
        } else {
          this.diamond_verification = true
        }
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

  .el-row {
    padding: 5px 0;
  }

  .el-dialog__header {
    text-align: left;
  }

  .verification_err {
    text-align: center;
    padding: 15px 0;
    margin: 10px 0;
    background-color: #FF4949;
    border-radius: 3px;
    color: #fff;
  }

  .el-table tr:hover, .el-table td:hover {
    cursor: pointer;
  }

  .filex_dialog .el-dialog--small {
    width: 800px;
  }
</style>

