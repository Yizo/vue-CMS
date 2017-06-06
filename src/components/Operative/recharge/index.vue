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
        <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
      </el-row>
    </div>
    <div class="recharge-wrapper">
      <el-table
        :data="data"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="编号"
          prop="order_number"
          align="left">
        </el-table-column>
        <el-table-column
          label="日期"
          property="created_at"
          align="left">
          <template scope="scope">
            <span>{{scope.row.created_at | Time}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="账号"
          property="username"
          align="left">
        </el-table-column>
        <el-table-column
          label="套餐名"
          property="plan_name"
          align="left">
        </el-table-column>
        <el-table-column
          label="金额(元)"
          property="price"
          align="left">
        </el-table-column>
        <el-table-column
          label="获得钻石"
          property="coins"
          align="left">
        </el-table-column>
        <el-table-column
          label="支付方式"
          property="payment_method"
          align="left">
        </el-table-column>
        <el-table-column
          label="状态"
          align="left">
          <template scope="scope">
            <el-tag
              :type="scope.row.has_read ? 'success' : 'primary'"
              close-transition>{{scope.row.is_completed ? '成功': '失败'}}
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
          layout="prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  import {formatDate} from '../../../utils/filters'
  import {mapGetters} from 'vuex'

  export default{
    data(){
      return {
        data: [],
        currentPage: 1,
        pageSize: 15,
        total: 0,
      }
    },
    computed: {
      ...mapGetters(['initDate']),
      filter(){
        return this.initDate
      }
    },
    methods: {
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
          end_at: this.filter.end
        }
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs
          this.currentPage = res.data.data.current_page
          this.total = res.data.data.total_count
        })
      },
      //分页action
      handleSizeChange(val){
        let options = {
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs;
          this.total = res.data.data.total_count
        })
      },
    },
    mounted(){
      this.getInfo({limit: this.pageSize}).then(res => {
        this.data = res.data.data.logs;
        this.total = res.data.data.total_count;
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
