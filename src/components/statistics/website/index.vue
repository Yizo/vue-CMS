<template>
  <div id="hardware">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'hardware' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>官网统计</el-breadcrumb-item>
    </el-breadcrumb>

    <!--筛选-->
    <div class="warp_filter">
      <el-alert
        title="数据说明"
        type="info"
        description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计" style="margin-bottom: 10px">
      </el-alert>
      <el-row :gutter="20">
        <el-col :span="10">
          <p style="padding: 10px 0">总访问量:<span style="color: red;font-size: 22px">{{count.sum}}</span></p>
          <span style="margin: 10px 0;display: block">下载量统计饼图</span>
          <div id="main" style="width: 99%;height: 300px;border: 1px solid #D3DCE6">

          </div>
          <span style="margin: 10px 0;display: block">下载量统计列表</span>
          <el-table :data="dow_data" style="width: 100%" border>
            <el-table-column prop="type" label="版本"></el-table-column>
            <el-table-column prop="sum" label="数量"></el-table-column>
            <el-table-column prop="pro" label="占比"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="14" style="margin-top: 20px">
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
          <el-table :data="access_data" style="width: 100%" border>
            <el-table-column prop="id" label="编号" width="50"></el-table-column>
            <el-table-column prop="request_ip" label="请求IP" width="130"></el-table-column>
            <el-table-column prop="ip_area" label="请求IP区域"></el-table-column>
            <el-table-column prop="request_source" label="请求来源"></el-table-column>
            <el-table-column prop="request_type" label="请求类型" width="80"></el-table-column>
            <el-table-column prop="request_url" label="请求URL"></el-table-column>
            <el-table-column prop="请求IP区域" label="请求时间" width="150">
              <template scope="scope">
                {{scope.row.request_time | Time}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="a_currentPage"
            :page-size="a_pageSize"
            layout="total, prev, pager, next, jumper"
            :total="a_totalSize"
            class="page">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as JS from '../../../assets/js/js'
  import * as API from '../../../api/api'
  import axios from 'axios';
  import qs from 'qs'
  export default {
    data() {
      return {
        count: {},
        access_data: [],
        dow_data: [],
        a_currentPage: 1,
        a_pageSize: 15,
        a_totalSize: 0,
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
            name: '占比',
            data: [
              ['a', 10],
              ['b', 20],
              ['c', 30],
              ['d', 40]
            ]
          }],
          credits: false
        },
        //筛选
        currentPage: 1,
        totalSize: 0,
        pageSize: 15,
      }
    },
    computed: {
      ...mapGetters(['initDate']),
      filter(){
        return this.initDate
      }
    },
    methods: {
      //图表数据转为数组
      line(json){
        var arr = [];
        for (var i = 0; i < json.length; i++) {
          if (i < 50) {
            arr.push([json[i]['type'], parseFloat(json[i].pro)])
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
          perpage: this.pageSize,
          date_from: this.filter.start,
          date_to: this.filter.end
        }
        if (options.date_from && options.date_to || !options.date_from && !options.date_to) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        axios.post(API.website_list, qs.stringify(options)).then(res => {
          this.access_data = res.data.userlog_list
          this.a_totalSize = res.data.total
        })
      },
      handleCurrentChange(val){
        let options = {
          page: val,
          perpage: this.pageSize,
          date_from: this.filter.start,
          date_to: this.filter.end
        }
        this.a_currentPage = val
        axios.post(API.website_list, qs.stringify(options)).then(res => {
          this.access_data = res.data.userlog_list
          this.a_totalSize = res.data.total
        })
      }
    },
    mounted(){
      let options = {
        page: 1,
        perpage: this.pageSize,
        date_from: this.filter.start,
        date_to: this.filter.end
      }
      axios.post(API.website_sum, qs.stringify(options)).then(res => {
        this.count = res.data
      })
      axios.post(API.website_list, qs.stringify(options)).then(res => {
        this.access_data = res.data.userlog_list
        this.a_totalSize = res.data.total
      })
      axios.post(API.website_download_list).then(res => {
        this.dow_data = res.data.data
        this.options.series[0].data = this.line(this.dow_data);
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
    margin-top: 20px;
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

  @media screen and (max-width: 1200px) {
    .el-col-14 {
      width: 100%;
    }

    .el-col-10 {
      width: 100%;
    }
  }
</style>

