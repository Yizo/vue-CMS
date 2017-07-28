<template>
  <div class="warp">
    <p class="header"><span>充值详情</span></p>
    <el-table
      :data="pd_data.data.logs"
      style="width: 100%">
      <el-table-column
        label="日期"
        width="180">
        <template scope="scope">
          <span v-if="scope.row.stat_date">
            {{scope.row.stat_date}}
          </span>
          <span v-else>
              {{scope.row.stat_year}}-{{scope.row.stat_month < 10 ? '0' + scope.row.stat_month : scope.row.stat_month}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="充值金额">
        <template scope="scope">
          <span class="tip"
                @click="recharge_amount({name:'充值金额',data:scope.row})">{{scope.row.total_recharge_amount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="充值人数">
        <template scope="scope">
          <span class="tip"
                @click="recharge_users({name:'充值人数',data:scope.row})">{{scope.row.recharge_users_count}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="消费钻石">
        <template scope="scope">
          <span class="tip" @click="consume({name:'消费钻石',data:scope.row})">{{scope.row.total_consume_coins}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @current-change="listPaging"
      :current-page="pd_data.data.current_page"
      layout="total, prev, pager, next, jumper"
      :total="pd_data.data.total_count"
      :page-size="pageSize"
      class="page">
    </el-pagination>
    <!--充值金额/充值人数-->
    <el-dialog v-model="dialogVisible" :title="dalogInfo.name" size="tiny">
      <el-table :data="dalogData" style="text-align: center">
        <el-table-column label="账号名">
          <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column property="price" label="充值金额">
          <template scope="scope">
            <span v-if="dalogInfo.name == '充值人数'">{{scope.row.amount}}</span>
            <span v-else>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="充值时间点" v-if="dalogInfo.name != '充值人数'">
          <template scope="scope">
            {{scope.row.created_at | Time}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <!--分页-->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          :page-size="pageSize"
          class="page">
        </el-pagination>
      </div>
    </el-dialog>
    <!--消费钻石-->
    <el-dialog v-model="dialogVisible2" :title="dalogInfo.name">
      <el-table :data="dalogData2" style="text-align: center">
        <el-table-column label="账号名">
          <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column property="coins" label="使用服务器名">
          <template scope="scope">
            {{scope.row.node_type}}{{scope.row.node_region ? "-" : ''}}{{scope.row.node_region}}{{scope.row.node_name ? "-" : ''}}{{scope.row.node_name}}
          </template>
        </el-table-column>
        <el-table-column property="coins" label="消费钻石数量" width="150"></el-table-column>
        <el-table-column label="扣除钻石时间点">
          <template scope="scope">
            {{scope.row.created_at | Time}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <!--分页-->
        <el-pagination
          @current-change="consumeCurrent"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          :page-size="pageSize"
          class="page">
        </el-pagination>
      </div>
    </el-dialog>
    <user-detail :visab="user_dialogVisible" :name="username" @closeDialog="cdialog"></user-detail>
  </div>
</template>

<script>
  import {mapActions, mapGetters}  from 'vuex'
  import * as JS from '../../../assets/js/js'
  import * as API from '../../../api/api'
  import userDetail from '../../publicView/accoutInfo/index.vue'
  export default {
    props: {
      parm: {
        type: Object,
        default: {}
      }
    },
    data(){
      return {
        dialogVisible: false,
        dialogVisible2: false,
        dalogInfo: {
          name: ''
        },
        dalogData: [],
        dalogData2: [],
        currentInfo: {},//分页信息
        currentPage: 1,
        totalSize: 0,
        pageSize: 15,
        date_type: 'day',
        user_dialogVisible: false,
        username: '姓名'
      }
    },
    components: {
      userDetail
    },
    computed: {
      ...mapGetters({
        pd_data: 'pay_details_data',
        time: 'time'
      }),
      options(){
        if (this.parm.app_version == '') {
          this.parm.app_version = ''
        }
        if (this.parm.app_channel == '') {
          this.parm.app_channel = ''
        }
        return this.parm
      },
      date_month(){
        let year = this.currentInfo.data.stat_year;
        let month = this.currentInfo.data.stat_month < 10 ? '0' + this.currentInfo.data.stat_month : this.currentInfo.data.stat_month
        return year + '-' + month;
      }
    },
    methods: {
      ...mapActions({
        PAYINFO_pay_details: 'PAYINFO_pay_details',
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
      //消费钻石请求
      tccd(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.t_consume_coins_details,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      //充值金额请求
      trad(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.t_recharge_amount_details,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      //充值人数请求
      trud(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.t_recharge_user_details,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      //充值金额详情
      recharge_amount(data){
        this.dialogVisible = true;
        this.dalogInfo.name = data.name
        this.currentInfo = Object.assign({}, data)
        this.currentPage = 1
        if (data.data.stat_date) {
          this.date_type = 'day'
        } else {
          this.date_type = 'month'
        }
        let options = {
          page: 1,
          date_type: this.date_type,
          limit: this.pageSize,
          date: this.currentInfo.data.stat_date || this.date_month,
          app_channel: this.options.app_channel,
          app_version: this.options.app_version,
        }
        this.trad(options).then(res => {
          let data = res.data.data;
          this.dalogData = [...data.logs];
          this.totalSize = data.total_count
        })
      },
      //充值人数详情
      recharge_users(data){
        this.currentPage = 1
        this.dialogVisible = true;
        this.dalogInfo.name = data.name
        this.currentInfo = Object.assign({}, data)
        if (data.data.stat_date) {
          this.date_type = 'day'
        } else {
          this.date_type = 'month'
        }

        let options = {
          page: 1,
          date_type: this.date_type,
          limit: this.pageSize,
          date: this.currentInfo.data.stat_date || this.date_month,
          app_channel: this.options.app_channel,
          app_version: this.options.app_version,
        }
        this.trud(options).then(res => {
          let data = res.data.data
          this.dalogData = [...data.logs];
          this.totalSize = data.total_count
        })
      },
      //消费钻石详情
      consume(data){
        this.currentPage = 1
        this.dialogVisible2 = true;
        this.dalogInfo.name = data.name
        this.currentInfo = Object.assign({}, data)
        if (data.data.stat_date) {
          this.date_type = 'day'
        } else {
          this.date_type = 'month'
        }
        let options = {
          page: 1,
          date_type: this.date_type,
          limit: this.pageSize,
          date: this.currentInfo.data.stat_date || this.date_month,
          app_channel: this.options.app_channel,
          app_version: this.options.app_version,
        }
        this.tccd(options).then(res => {
          let data = res.data.data
          this.dalogData2 = [...data.logs];
          this.totalSize = data.total_count
        })
      },
      //消费钻石分页
      consumeCurrent(val){
        let options = {
          page: val,
          date_type: this.date_type,
          limit: this.pageSize,
          date: this.currentInfo.data.stat_date || this.date_month,
          app_channel: this.options.app_channel,
          app_version: this.options.app_version,
        }
        this.currentPage = val
        this.tccd(options).then(res => {
          let data = res.data.data
          this.dalogData2 = [...data.logs];
        })
      },
      //充值人数,充值金额分页
      handleCurrentChange(val){
        this.currentPage = val
        if (this.dalogInfo.name == '充值人数') {
          let options = {
            page: val,
            date_type: this.date_type,
            limit: this.pageSize,
            date: this.currentInfo.data.stat_date || this.date_month,
            app_channel: this.options.app_channel,
            app_version: this.options.app_version,
          }
          this.trud(options).then(res => {
            let data = res.data.data
            this.dalogData = [...data.logs];
          })
        }
        if (this.dalogInfo.name == '充值金额') {
          let options = {
            page: val,
            date_type: this.date_type,
            limit: this.pageSize,
            date: this.currentInfo.data.stat_date || this.date_month,
            app_channel: this.options.app_channel,
            app_version: this.options.app_version,
          }
          this.trad(options).then(res => {
            let data = res.data.data
            this.dalogData = [...data.logs];
          })
        }
      },
      //列表分页
      listPaging(val){
        let options = {
          page: val,
          limit: this.pageSize,
          year: this.time.year || null,
          month: this.time.month || null,
          app_channel: this.options.app_channel,
          app_version: this.options.app_version,
        }
        this.PAYINFO_pay_details(options)
      }
    }
  }
</script>

<style scoped>
  .warp {
    padding: 10px;
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #f5f5f5;
    box-shadow: 0 0 2px 1px #ddd;
    margin-top: 20px;
  }

  .header {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-bottom: transparent;
  }

  .header span {
    display: block;
    width: 20%;
    margin-left: 10px;
  }

  .tip {
    cursor: pointer;
    background-color: #333;
    padding: 1px 3px;
    color: #fff
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }

  .dialog_w {
    width: 40%;
  }
</style>
