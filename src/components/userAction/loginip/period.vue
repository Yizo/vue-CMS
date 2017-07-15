<template>
  <div>
    <div style="background-color: #fff;padding: 10px;border:1px solid #D3DCE6;text-align: left">
      <div style="display: inline-block;margin: 10px 0;">
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
      <div>
        <div id="main3" style="height: 200px;border: 1px solid #D3DCE6;margin: 10px auto">

        </div>
        <table class="table">
          <tbody>
          <tr style="background-color: #EEF1F6">
            <th class="first">
              <span class="f_bottom">日期</span>
              <span class="f_top">时间段</span>
            </th>
            <th v-for="(init,index) in 24" :key="index">
              {{init - 1}}
            </th>
          </tr>
          <tr v-if="tableData.length == 0">
            <td colspan="25" style="height: 40px;line-height: 40px">暂无数据</td>
          </tr>
          <tr v-for="(item,index) in changeTableData" :key="index" v-else>
            <td style="width: 70px;padding: 0">{{item.stat_date}}</td>
            <td v-for="(item2,index) in item.data" :key="index" :class="{bg_active: item2.bgActive}">
              <span>{{item2.times_count}}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalSize"
          layout="total, prev, pager, next, jumper"
          class="page">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  export default{
    components: {},
    data(){
      return {
        tableData: [],
        changeTableData: [],
        charData: [],
        currentPage: 1,
        totalSize: 0,
        pageSize: 15,
        options: {
          chart: {
            type: 'areaspline',
          },
          title: {
            text: null
          },
          xAxis: {
            title: {
              text: '时间点'
            },
            categories: []
          },
          yAxis: {
            title: {
              text: '登录人数'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            valueSuffix: '人'
          },
          plotOptions: {
            areaspline: {
              fillOpacity: 0.2
            }
          },
          series: [],
          legend: {
            enabled: false
          },
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
      //获取信息
      getInfo(parm){
        var p = new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.loginip_period_stat,
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
        return p;
      },
      //获取信息
      getChar(parm){
        var p = new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.loginip_period_stat_char,
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
        return p;
      },
      //设置X轴
      setXAxis(){
        var arry = []
        for (let i = 0; i < 24; i++) {
          arry.push(i);
        }
        return arry
      },
      //表格数据
      AnalysisJSON(parm) {
        let result = {}
        let data = []
        for (var i = 0; i < parm.length; i++) {
          data.push(parm[i].users_count);
        }
        result = [{name: '登录人数', data: data}]
        return result;
      },
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
        this.getInfo(options).then(res => {
          this.tableData = [...res.data.data.logs];
          this.totalSize = res.data.data.total_count;
          this.loadData()
        })
        this.getChar({start_at: this.filter.start, end_at: this.filter.end}).then(res => {
          this.charData = res.data.data.logs;
          this.options.series = this.AnalysisJSON(this.charData);
          this.options.xAxis.categories = this.setXAxis()
          this.$HighCharts.chart('main3', this.options);
        })
      },
      handleCurrentChange(val){
        let options = {
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        this.getInfo(options).then(res => {
          this.tableData = [...res.data.data.logs];
          this.totalSize = res.data.data.total_count;
        })
      },
      loadData() {
        const maxNum = []
        const sortNumber = (value1, value2) => {
          return value1 - value2
        }
        const oldData = this.tableData.map((item) => {
          const timesCountAll = []
          item.data.map((itemNum) => {
            timesCountAll.push(itemNum.times_count)
            timesCountAll.sort(sortNumber)
            return itemNum
          })
          //把每项的最大数存起来
          maxNum.push(timesCountAll[timesCountAll.length - 1])
          return item
        })
        //
        const addStatusData = this.tableData.map((item, index) => {
          item.data.map((itemNum) => {
            if (maxNum[index] === itemNum.times_count) {
              itemNum.bgActive = true
            } else {
              itemNum.bgActive = false
            }
            return itemNum
          })
          return item
        })
        this.changeTableData = addStatusData
      }
    },
    mounted(){
      let options = {
        page: 1,
        limit: this.pageSize,
        start_at: this.filter.start,
        end_at: this.filter.end
      }
      this.getInfo(options).then(res => {
        this.tableData = [...res.data.data.logs];
        this.totalSize = res.data.data.total_count;
        this.loadData()
      })
      this.getChar({start_at: this.filter.start, end_at: this.filter.end}).then(res => {
        this.charData = res.data.data.logs;
        this.options.series = this.AnalysisJSON(this.charData);
        this.options.xAxis.categories = this.setXAxis()
        this.$HighCharts.chart('main3', this.options);
      })
    }
  }
</script>

<style scoped>
  .table {
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
    background-color: #fff;
  }

  .table tr {
    height: 36px;
    line-height: 36px;
  }

  .table th, td {
    padding: 0;
    font-size: 12px;
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
  }

  .tip {
    text-align: left;
    margin: 10px 0;
  }

  .tip span {
    margin: 0 3px;
  }

  th[class=first] {
    width: 70px;
    height: 30px;
    position: relative;
  }

  th[class=first]:before {
    content: "";
    position: absolute;
    width: 1px;
    height: 78px;
    top: 0;
    left: 0;
    background-color: #d5d5d5;
    display: block;
    transform: rotate(-63deg);
    transform-origin: top;
  }

  .first span {
    position: absolute;
    font-size: 10px;
  }

  .first .f_bottom {
    bottom: -10px;
    left: 2px;
  }

  .first .f_top {
    top: -10px;
    right: 1px;
  }

  .bg_active {
    background-color: #7CB5EC;
    font-size: 18px;
    color: #fff;
  }
</style>
