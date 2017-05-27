<template>
  <div class="warp">
    <p class="header"><span>充值详情</span></p>
    <el-table
      :data="pd_data.data.logs"
      style="width: 100%">
      <el-table-column
        prop="stat_date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        label="充值金额">
        <template scope="scope">
          <span class="tip"
                @click="recharge_amount({name:'充值金额',data:scope.row})">{{scope.row.total_recharge_amount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="消费钻石">
        <template scope="scope">
          <span class="tip" @click="consume({name:'消费钻石',data:scope.row})">{{scope.row.total_consume_coins}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="充值人数">
        <template scope="scope">
          <span class="tip"
                @click="recharge_users({name:'充值人数',data:scope.row})">{{scope.row.recharge_users_count}}</span>
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
    <el-dialog v-model="dialogVisible" :title="dalogInfo.name">
      <el-table :data="dalogData" style="text-align: center">
        <el-table-column property="username" label="账号名" width="150"></el-table-column>
        <el-table-column property="coins" label="充值金额">
          <template scope="scope">
            <span>1</span>
          </template>
        </el-table-column>
        <el-table-column label="充值时间点" width="150">
          <template scope="scope">
            {{Timestamp(scope.row.created_at)}}
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
        <el-table-column property="username" label="账号名" width="150"></el-table-column>
        <el-table-column property="coins" label="使用服务器名">
          <template scope="scope">
            {{scope.row.node_type+"-"+scope.row.node_region+"-"+scope.row.node_name}}
          </template>
        </el-table-column>
        <el-table-column property="coins" label="消费钻石数量" width="150"></el-table-column>
        <el-table-column label="扣除钻石时间点" width="150">
          <template scope="scope">
            {{Timestamp(scope.row.created_at)}}
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
  </div>
</template>

<script>
  import {mapActions, mapGetters}  from 'vuex'
  import * as JS from '../../../assets/js/js'
  import * as API from '../../../api/api'
  export default {
    data(){
      return {
        dialogVisible: false,
        dialogVisible2: false,
        dalogInfo: {
          name: '',
          data: {}
        },
        dalogData: [],
        dalogData2: [],
        currentInfo: {},//分页信息
        currentPage: 1,
        totalSize: 0,
        pageSize: 15
      }
    },
    computed: {
      ...mapGetters({
        pd_data: 'pay_details_data',
        time: 'time'
      })
    },
    methods: {
      ...mapActions(['PAYINFO_pay_details']),
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
      //充值人数请求-充值金额请求
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
      //充值金额详情
      recharge_amount(data){
        this.dialogVisible = true;
        this.dalogInfo = data
        this.currentInfo = data
        let options = {
          page: 1,
          limit: this.pageSize,
          date: data.data.stat_date
        }
        this.trad(options).then(res => {
          let data = res.data.data
          this.dalogData = data.logs;
          this.currentPage = data.current_page
          this.totalSize = data.total_count
        })
      },
      //充值人数详情
      recharge_users(data){
        this.dialogVisible = true;
        this.dalogInfo = data
        this.currentInfo = data
        let options = {
          page: 1,
          limit: this.pageSize,
          date: data.data.stat_date
        }
        this.trad(options).then(res => {
          let data = res.data.data
          this.dalogData = data.logs;
          this.currentPage = data.current_page
          this.totalSize = data.total_count
        })
      },
      //消费钻石详情
      consume(data){
        this.dialogVisible2 = true;
        this.dalogInfo = data
        this.currentInfo = data
        let options = {
          page: 1,
          limit: this.pageSize,
          date: data.data.stat_date
        }
        this.tccd(options).then(res => {
          let data = res.data.data
          this.dalogData2 = data.logs;
          this.currentPage = data.current_page
          this.totalSize = data.total_count
        })
      },
      Timestamp(row){
        const now = new Date(row * 1000);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();

        if (month < 9) {
          month = '0' + month
        }
        if (date < 9) {
          date = '0' + date
        }

        return year + "-" + month + "-" + date;
      },
      //消费钻石分页
      consumeCurrent(val){
        let options = {
          page: val,
          limit: this.pageSize,
          date: this.currentInfo.data.stat_date
        }
        this.tccd(options).then(res => {
          let data = res.data.data
          this.dalogData2 = data.logs;
          this.currentPage = data.current_page
          this.totalSize = data.total_count
        })
      },
      //充值人数,充值金额分页
      handleCurrentChange(val){
        if (this.currentInfo.name == '充值人数') {
          let options = {
            page: val,
            limit: this.pageSize,
            date: this.currentInfo.data.stat_date
          }
          this.tccd(options).then(res => {
            let data = res.data.data
            this.dalogData = data.logs;
            this.currentPage = data.current_page
            this.totalSize = data.total_count
          })
        }
        if (this.currentInfo.name == '充值金额') {
          let options = {
            page: val,
            limit: this.pageSize,
            date: this.currentInfo.data.stat_date
          }
          this.trad(options).then(res => {
            let data = res.data.data
            this.dalogData = data.logs;
            this.currentPage = data.current_page
            this.totalSize = data.total_count
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
        }
        this.PAYINFO_pay_details(options)
      }
    },
    mounted(){

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
</style>
