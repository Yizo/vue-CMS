<template>
  <div id="hardware">
    <!--筛选-->
    <div class="warp_filter">
      <div style="display: inline-block;margin: 10px 0">
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
      <el-row :gutter="20">
        <el-col :span="12" style="position: relative;">
          <div style="position: absolute;top: 5px;right: 20px;z-index:9;">
            <el-select v-model="stat_type" placeholder="地域类型" @change="areaType" style="width: 100px;">
              <el-option label="国家" value="country"></el-option>
              <el-option label="省/州" value="province"></el-option>
              <el-option label="市/县" value="city"></el-option>
            </el-select>
          </div>
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>地域分析饼图</span>
          <div id="main" style="width: 99%;height: 500px;border: 1px solid #D3DCE6;">
          </div>
        </el-col>
        <el-col :span="12">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>地域分析列表</span>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="country"
              label="地域名称">
              <template scope="scope">
                <span v-if="scope.row.country">{{scope.row.country}}</span>
                <span v-if="scope.row.province">{{scope.row.province}}</span>
                <span v-if="scope.row.city">{{scope.row.city}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="users_count"
              sortable
              label="人数">
            </el-table-column>
            <el-table-column
              prop="times_count"
              sortable
              label="次数">
            </el-table-column>
            <el-table-column
              prop="average_times"
              sortable
              label="平均数">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  export default {
    data() {
      return {
        value: '',
        //饼状图
        options: {
          title: {
            text: null
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
              },
              showInLegend: true
            }
          },
          series: [{
            type: 'pie',
            name: '地域',
            data: [
              ['a', 10],
              ['b', 20],
              ['c', 30],
              ['d', 40]
            ]
          }],
          credits: false
        },
        //表格数据
        tableData: [],
        currentPage: 1,
        totalSize: 0,
        pageSize: 15,
        stat_type: 'country'
      }
    },
    computed: {
      ...mapGetters(['initDate']),
      filter(){
        return this.initDate
      }
    },
    methods: {
      //筛选
      filter(row){

      },
      //获取信息
      getInfo(parm){
        var p = new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.loginip_region_stat,
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
        return p;
      },
      //图表数据转为数组
      line(json){
        var arr = [];
        for (var i = 0; i < json.length; i++) {
          if (i < 50) {
            if (this.stat_type == 'country') {
              arr.push([json[i]['country'], parseFloat(json[i].users_percent)])
            }
            if (this.stat_type == 'province') {
              arr.push([json[i]['province'], parseFloat(json[i].users_percent)])
            }
            if (this.stat_type == 'city') {
              arr.push([json[i]['city'], parseFloat(json[i].users_percent)])
            }
          }
        }
        return arr
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
          end_at: this.filter.end,
          stat_type: this.stat_type
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
          this.options.series[0].data = this.line(res.data.data.logs);
          this.$HighCharts.chart('main', this.options);
        })
      },
      areaType(val){
        let options = {
          page: 1,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end,
          stat_type: val
        }
        this.getInfo(options).then(res => {
          this.tableData = [...res.data.data.logs];
          this.totalSize = res.data.data.total_count;
          this.options.series[0].data = this.line(res.data.data.logs);
          this.$HighCharts.chart('main', this.options);
        })
      }
    },
    mounted(){
      this.getInfo().then(res => {
        this.tableData = [...res.data.data.logs];
        this.totalSize = res.data.data.total_count;
        this.options.series[0].data = this.line(res.data.data.logs);
        this.$HighCharts.chart('main', this.options);
      })
    }
  }
</script>

<style scoped>
  #hardware {
    padding: 10px;
  }

  /*导航*/
  #userInfo .breadcrumb {
    height: 30px;
    line-height: 30px;
  }

  .warp_filter {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
  }

  .el-table_1_column_4 .cell {
    cursor: pointer;
  }

  /*弹窗*/
  .dh2 {
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 400;

  span {
    font-size: 16px;
    font-weight: 500;
  }

  }
  .el-select {
    width: 200px;
  }

  .el-input {
    width: 200px;
  }
</style>

