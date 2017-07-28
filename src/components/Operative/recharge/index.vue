<template>
  <div id="recharge">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>充值信息</el-breadcrumb-item>
      <el-breadcrumb-item>充值记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="filter">
      <el-row>
        <div style="display: inline-block">
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
        </div>
        <template>
          <el-select v-model="filter2.channels" placeholder="切换渠道" style="width: 200px;">
            <el-option
              v-for="(item,index) in versions.app_channels"
              :label="item.name"
              :value="item.name" :key="index"
            >
            </el-option>
          </el-select>
        </template>
        <template>
          <el-select v-model="filter2.versions" placeholder="版本筛选" style="width: 200px;">
            <el-option
              v-for="(item,index) in versions.app_versions"
              :label="item.name"
              :value="item.name" :key="index">
            </el-option>
          </el-select>
        </template>
        <template>
          <el-select v-model="filter2.payment_method" placeholder="支付方式" style="width: 200px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="iap" value="iap"></el-option>
            <el-option label="支付宝" value="alipay"></el-option>
            <el-option label="微信" value="weixin"></el-option>
            <el-option label="未知" value="unknow"></el-option>
          </el-select>
        </template>
        <template>
          <el-select v-model="filter2.status" placeholder="支付状态" style="width: 200px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="成功" value="paid"></el-option>
            <el-option label="失败" value="pending"></el-option>
          </el-select>
        </template>
        <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
      </el-row>
    </div>
    <div class="recharge-wrapper">
      <table class="t1" style="margin-bottom: 10px">
        <caption style="font-size: 16px;margin-bottom: 10px">支付方式统计</caption>
        <tbody class="table">
        <tr>
          <th></th>
          <th>IAP</th>
          <th>支付宝</th>
          <th>微信</th>
          <th>未知</th>
        </tr>
        <tr>
          <td>成功</td>
          <td>{{pay_method.iap_success_count}}</td>
          <td>{{pay_method.alipay_success_count}}</td>
          <td>{{pay_method.weixin_success_count}}</td>
          <td>{{pay_method.unknow_success_count}}</td>
        </tr>
        <tr>
          <td>失败</td>
          <td>{{pay_method.iap_failure_count}}</td>
          <td>{{pay_method.alipay_failure_count}}</td>
          <td>{{pay_method.weixin_failure_count}}</td>
          <td>{{pay_method.unknow_failure_count}}</td>
        </tr>
        <tr>
          <td>总笔数</td>
          <td>{{pay_method.iap_total_count}}</td>
          <td>{{pay_method.alipay_total_count}}</td>
          <td>{{pay_method.weixin_total_count}}</td>
          <td>{{pay_method.unknow_total_count}}</td>
        </tr>
        <tr>
          <td>总计笔数</td>
          <td colspan="4">{{pay_method.total_count}}</td>
        </tr>
        </tbody>
      </table>
      <el-table
        :data="data"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="编号"
          prop="order_number" width="240">
        </el-table-column>
        <el-table-column
          label="日期"
          property="created_at">
          <template scope="scope">
            <span>{{scope.row.created_at | Time}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="账号">
          <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="套餐名"
          property="plan_name">
        </el-table-column>
        <el-table-column
          label="金额(元)"
          property="price">
        </el-table-column>
        <el-table-column
          label="获得钻石"
          property="coins">
        </el-table-column>
        <el-table-column
          label="支付方式"
          property="payment_method">
        </el-table-column>
        <el-table-column
          label="状态">
          <template scope="scope">
            <el-tag
              :type="scope.row.is_completed ? 'success' : 'primary'"
              close-transition>{{scope.row.is_completed ? '成功' : '失败'}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right;margin: 15px 0">
        <el-pagination
          @current-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total,prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>

    <user-detail :visab="user_dialogVisible" :name="username" @closeDialog="cdialog"></user-detail>

  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  import userDetail from '../../publicView/accoutInfo/index.vue'
  import {formatDate} from '../../../utils/filters'
  import {mapGetters, mapActions} from 'vuex'

  export default{
    data(){
      return {
        data: [],
        user_dialogVisible: false,
        username: '姓名',
        pay_method: {},
        currentPage: 1,
        pageSize: 15,
        total: 0,
        filter2: {
          versions: '',
          channels: '',
          payment_method: null,
          status: null
        },
      }
    },
    computed: {
      ...mapGetters(['initDate', 'versions']),
      filter(){
        return this.initDate
      }
    },
    components: {
      userDetail
    },
    methods: {
      ...mapActions({
        ud_base: 'UD_base_info',
      }),
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.recharge_list_get,
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
      get_pay_method(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.recharge_payment_method_collects,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      cdialog(){
        this.user_dialogVisible = false
      },
      userInfo(row){
        this.username = row.username
        this.user_dialogVisible = true;
        window.sessionStorage.setItem('userId', row.user_id)
        this.ud_base({limit: 10})
      },
      //筛选
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
        let options = {
          page: 1,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels,
          payment_method: this.filter2.payment_method,
          status: this.filter2.status
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
          this.data = res.data.data.logs
          this.currentPage = res.data.data.current_page
          this.total = res.data.data.total_count
        })
        this.get_pay_method({
          app_channel: this.filter2.channels,
          app_version: this.filter2.versions,
          start_at: this.filter.start,
          end_at: this.filter.end
        }).then(res => {
          if (res.data.success) {
            this.pay_method = res.data.data
          }
        })
      },
      //分页action
      handleSizeChange(val){
        let options = {
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels,
          payment_method: this.filter2.payment_method,
          status: this.filter2.status
        }
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs;
          this.total = res.data.data.total_count
        })
      },
    },
    mounted(){
      this.getInfo({
        page: 1,
        limit: this.pageSize,
        start_at: this.filter.start,
        end_at: this.filter.end,
        app_version: this.filter2.versions,
        app_channel: this.filter2.channels,
        payment_method: this.filter2.payment_method,
        status: this.filter2.status
      }).then(res => {
        this.data = res.data.data.logs;
        this.total = res.data.data.total_count;
      })
      this.get_pay_method({
        start_at: this.filter.start,
        end_at: this.filter.end,
      }).then(res => {
        if (res.data.success) {
          this.pay_method = res.data.data
        }
      })
    }
  }
</script>

<style>
  #recharge {
    padding: 10px;
  }

  .recharge-filter {
    margin: 15px 0;
  }

  .recharge-wrapper {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .el-dialog__header {
    text-align: left;
  }

  .el-form-item__content {
    text-align: left;
  }

  .el-table th > .cell {
    text-align: left;
  }

  .filter {
    text-align: left;
    margin-top: 20px;
  }
</style>
