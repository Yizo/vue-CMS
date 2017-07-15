<template>
  <div>
    <div style="margin-bottom: 10px;text-align: left">
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
      <el-button @click="filtration">筛选</el-button>
    </div>
    <div id="history_char" style="height: 400px;border: 1px solid #D3DCE6">

    </div>
    <div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="stat_date" label="日期"></el-table-column>
        <el-table-column label="时间点">
          <template scope="scope">{{scope.row.min_time | TimeHour}}</template>
        </el-table-column>
        <el-table-column prop="min_count" label="最少在线"></el-table-column>
        <el-table-column label="时间点">
          <template scope="scope">{{scope.row.max_time | TimeHour}}</template>
        </el-table-column>
        <el-table-column prop="max_count" label="在线峰值"></el-table-column>
        <el-table-column prop="average_count" label="平均在线"></el-table-column>
        <el-table-column label="详情">
          <template scope="scope">
            <el-button size="small" @click="detatil(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        class="page">
      </el-pagination>
    </div>
    <el-dialog :title="detail.name+'详情'" :visible.sync="detail.show" class="filex_dialog">
      <el-table :data="detail.data" style="width: 100%" border>
        <el-table-column prop="time" label="日期"></el-table-column>
        <el-table-column label="总计在线">
          <template scope="scope">
            <span @click="detailCount(scope.row)">{{scope.row.online_count}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="detailsPaging"
        :current-page="detail.currentPage"
        layout="total, prev, pager, next, jumper"
        :total="detail.total"
        :page-size="pageSize"
        class="page">
      </el-pagination>
    </el-dialog>
    <el-dialog :title="detailC.name+'详情'" :visible.sync="detailC.show" class="filex_dialog">
      <el-table :data="detailC.data" style="width: 100%" border>
        <el-table-column prop="created_at" label="日期">
          <template scope="scope">
            <span>{{scope.row.created_at | Time}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="node_name" label="线路名称"></el-table-column>
        <el-table-column prop="online_count" label="总计在线"></el-table-column>
      </el-table>
      <el-pagination
        @current-change="detailsCoutntPaging"
        :current-page="detailC.currentPage"
        layout="total, prev, pager, next, jumper"
        :total="detailC.total"
        :page-size="pageSize"
        class="page">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  import * as JS from '../../../assets/js/js'
  export default{
    data: () => ({
      tableData: [],
      charData: [],
      currentPage: 1,
      total: 0,
      pageSize: 15,
      options: {
        title: {
          text: null
        },
        xAxis: {
          title: {
            text: ''
          },
          categories: []
        },
        yAxis: {
          title: {
            text: ''
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
      detail: {
        show: false,
        data: [],
        name: '',
        pageData: '',
        total: 0,
        currentPage: 1
      },
      detailC: {
        show: false,
        data: [],
        name: '',
        pageData: '',
        total: 0,
        currentPage: 1
      }
    }),
    computed: {
      ...mapGetters(['initDate']),
      filter(){
        return this.initDate
      }
    },
    methods: {
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(){
        if (typeof this.filter.start == 'object') {
          this.filter.start = JS.Timestamp(this.filter.start)
          alert(this.filter.start)
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
        if (options.start_at && options.end_at || !options.start_at && !options.end_at) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        this.getLogs(options).then(res => {
          this.tableData = res.data.data.logs
          this.total = res.data.data.total_count
          this.draw()
        })
      },
      getLogs(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_online_users_stat,
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
      getChar(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_online_users_stat_chart,
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
      getDetail(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_online_users_stat_details,
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
      getDetailCount(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_online_users_stat_second_details,
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
      handleCurrentChange(val){
        let options = {
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        this.currentPage = val
        this.getLogs(options).then(res => {
          this.tableData = res.data.data.logs
          this.total = res.data.data.total_count
        })
      },
      AnalysisJSON(parm) {
        var result = []
        var keyList = {
          min_count: '最少在线',
          average_count: '平均在线',
          max_count: '在线峰值'
        }
        var names = ['min_count', 'average_count', 'max_count']
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
      setXAxis(parm){
        var arry = []
        for (var i in parm) {
          arry.push(parm[i].stat_date);
        }
        return arry
      },
      draw(){
        let options = {
          page: 1,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        this.getChar(options).then(res => {
          this.charData = res.data.data.logs
          //设置数据
          this.options.series = this.AnalysisJSON(res.data.data.logs);
          //设置X轴
          this.options.xAxis.categories = [...this.setXAxis(res.data.data.logs)]
          this.$HighCharts.chart('history_char', this.options);
        })
      },
      /*详情*/
      detatil(data){
        this.detail.show = true
        this.detail.currentPage = 1;
        this.detail.pageData = data.stat_date;
        this.detail.name = data.stat_date;
        let options = {
          page: 1,
          limit: this.pageSize,
          stat_date: data.stat_date
        }
        this.getDetail(options).then(res => {
          this.detail.data = res.data.data.logs;
          this.detail.total = res.data.data.total_count
        })
      },
      detailsPaging(val){
        let options = {
          page: val,
          limit: this.pageSize,
          stat_date: this.detail.pageData
        }
        this.detail.currentPage = val;
        this.getDetail(options).then(res => {
          this.detail.data = res.data.data.logs;
          this.detail.total = res.data.data.total_count
        })
      },
      /*总数详情*/
      detailCount(data){
        this.detailC.show = true
        this.detailC.pageData = data.time;
        this.detailC.name = data.time;
        this.detailC.currentPage = 1;
        let options = {
          page: 1,
          limit: this.pageSize,
          stat_date: this.detail.pageData,
          time: this.detailC.pageData
        }
        this.getDetailCount(options).then(res => {
          this.detailC.data = res.data.data.logs;
          this.detailC.total = res.data.data.total_count
        })
      },
      detailsCoutntPaging(val){
        let options = {
          page: val,
          limit: this.pageSize,
          stat_date: this.detail.pageData,
          time: this.detailC.pageData
        }
        this.detailC.currentPage = val;
        this.getDetailCount(options).then(res => {
          this.detailC.data = res.data.data.logs;
          this.detailC.total = res.data.data.total_count
        })
      },
    },
    mounted(){
      let options = {
        page: 1,
        limit: this.pageSize,
        start_at: this.filter.start,
        end_at: this.filter.end
      }
      this.getLogs(options).then(res => {
        this.tableData = res.data.data.logs
        this.total = res.data.data.total_count
        this.draw()
      })
    }
  }
</script>

<style scoped>
  .setcss td {
    height: 20px;
    border: 1px solid red;
  }
</style>
