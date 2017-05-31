<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>失败信息</el-breadcrumb-item>
      <el-breadcrumb-item>用户未操作</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row style="text-align: left;margin-top: 20px">
      <div style="display: inline-block">
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
      </div>
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
    </el-row>
    <div class="warp">
      <!--图表展示-->
      <el-row class="">
        <el-col :span="24">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>每日用户未连接次数折线图</span>
          <div id="main" style="height: 500px;border: 1px solid #D3DCE6;margin: 10px auto">

          </div>
        </el-col>
      </el-row>
      <template>
        <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>每日用户未连接次数</span>
        <el-table
          :data="data"
          style="width: 100%">
          <el-table-column
            prop="stat_date"
            label="时间">
          </el-table-column>
          <el-table-column
            label="次数">
            <template scope="scope">
<span class="dialog_num"
      @click="detail({stat_at:scope.row.stat_date})">{{scope.row.no_operations_count}}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
    <!--弹窗-->
    <el-dialog v-model="dialog" title="未连接详情" class="dialog">
      <el-table
        :data="dialogData"
        style="width: 100%">
        <el-table-column
          label="时间点">
          <template scope="scope">
            {{scope.row.created_at | Time}}
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="账号名"
          width="180px">
        </el-table-column>
        <el-table-column
          label="版本信息">
          <template scope="scope">
            {{scope.row.app_channel}}_{{scope.row.app_version}}_{{scope.row.app_version_number}}
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="用户IP">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP解析">
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-pagination
          @current-change="d_handleCurrentChange"
          :current-page="d_currentPage"
          :page-size="pageSize"
          :total="d_total"
          layout="total, prev, pager, next, jumper"
          class="page">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  import { mapGetters } from 'vuex'
  export default{
    components: {},
    data(){
      return {
        data: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        /*弹窗*/
        dialog: false,
        parm: {},//当前分页参数
        title_name: '',
        dialogData: [],
        d_currentPage: 1,
        d_total: 0,
        /*折线图*/
        options: {
          title: {
            text: null
          },
          xAxis: {
            title: {
              text: '连接时间'
            },
            categories: []
          },
          yAxis: {
            title: {
              text: '用户未连接次数'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            valueSuffix: '次'
          },
          series: [],
          credits: false
        },
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
            url: API.unext,
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
      /*详情*/
      getDetail(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.unext_detail,
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
//表格数据
      AnalysisJSON(parm) {
        var result = []
        var keyList = {no_operations_count: '用户未连接次数'}
        var names = ['no_operations_count']
        for (var i = 0; i < names.length; i++) {
          var data = []
          for (var j = 0; j < parm.length; j++) {
            data.push(parm[j][names[i]])
          }
          var item = {name: keyList[names[i]], data: data}
          result.push(item)
        }
        return result
      },
//设置Y轴
      setXAxis(parm){
        var arry = []
        for (var i in parm) {
          arry.push(parm[i].stat_date);
        }
        return arry
      },
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(){
        let options = {
          page: 1,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs
          this.total = res.data.data.total_count;
//设置数据
          this.options.series = this.AnalysisJSON(this.data);
//设置X轴
          this.options.xAxis.categories = this.setXAxis(this.data)
          this.$HighCharts.chart('main', this.options);
        })
      },
      detail(parm){
        this.parm = parm
        this.dialog = true
        this.d_currentPage = 1
        this.getDetail({stat_at: parm.stat_at, page: 1, limit: this.pageSize}).then(res => {
          this.dialogData = res.data.data.logs;
          this.d_total = res.data.data.total_count;
        })
      },
      handleCurrentChange(val){
        this.getInfo({page: val, limit: this.pageSize}).then(res => {
          this.data = res.data.data.logs
          this.currentPage = res.data.data.curren_page
          this.total = res.data.data.total_count;
        })
      },
      d_handleCurrentChange(val){
        this.getDetail({stat_at: this.parm.stat_at, page: val, limit: this.pageSize}).then(res => {
          this.dialogData = res.data.data.logs;
          this.d_currentPage = res.data.data.curren_page
          this.d_total = res.data.data.total_count;
        })
      }
    },
    mounted(){
      this.getInfo({limit: this.pageSize}).then(res => {
        this.data = res.data.data.nodes
        this.data = res.data.data.logs
        this.total = res.data.data.total_count;
//设置数据
        this.options.series = this.AnalysisJSON(this.data);
//设置X轴
        this.options.xAxis.categories = this.setXAxis(this.data)
        this.$HighCharts.chart('main', this.options);
      })
    }
  }
</script>

<style scoped>
  .dstip {
    padding: 10px;
  }

  .warp {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }
</style>

