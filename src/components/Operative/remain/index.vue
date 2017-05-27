<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>运营行为</el-breadcrumb-item>
      <el-breadcrumb-item>留存</el-breadcrumb-item>
    </el-breadcrumb>
    <!--筛选-->
    <el-row style="text-align: left;margin-top: 20px;position: relative">
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
        <el-select v-model="filter.versions" placeholder="版本筛选">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
        <el-select v-model="filter.channels" placeholder="切换渠道">
          <el-option
            v-for="(item,index) in versions.app_channels"
            :label="item.name"
            :value="item.name" :key="index"
          >
          </el-option>
        </el-select>
      </div>
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>

      <el-tooltip class="item" effect="light" placement="bottom-end">
        <el-button style="position: absolute;top:0;right: 20px">规则说明</el-button>
        <div slot="content">
          规则说明:</br>
          次日留存率：所选择日期注册的用户，在所选择日期后1天进行过登录的人数比例</br>
          日留存率：所选择日期注册的用户，在所选择日期后7天内进行过登录的人数比例</br>
          日留存率：所选择日期注册的用户，在所选择日期后30天内进行过登录 的人数比例</br>
          当日新增：所选择日期当天新增用户的总人数</br>
          次日留存人数计算：所选择日期注册的用户，在所选择日期后第2天进行过登录则计算为1人</br>
          日留存人数计算：所选择日期注册的用户，在所选择日期后7天内进行过登录则计算为1人</br>
          日留存人数计算：所选择日期注册的用户，在所选择日期后30天内进行过登录则计算为1人</br>
          例如：选择2016年9月17日，则</br>
          次日留存统计时间段为：2016年9月18日</br>
          7日留存统计时间段为：2016年9月18日——2016年9月24日</br>
          30日留存统计时间段为：2016年9月18日——2016年10月17日</br>
        </div>
      </el-tooltip>
    </el-row>

    <!--视图-->
    <div class="warp">
      <!--图表展示-->
      <el-row class="">
        <el-col :span="24">
          <span style="margin: 10px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>页面点击</span>
          <div id="main" style="height: 400px;border: 1px solid #D3DCE6;margin-bottom: 10px">

          </div>
        </el-col>
      </el-row>

      <el-table
        :data="data"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="时间"
          property="stat_date"
          width="150px">
        </el-table-column>
        <el-table-column
          label="当日新增用户">
          <template scope="scope">
            <span @click="detail(1,scope.row)" style="cursor: pointer">{{scope.row.users_count}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="次日留存用户">
          <template scope="scope">
            <span @click="details(2,scope.row)" style="cursor: pointer">{{scope.row.second_day}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="次日留存率">
          <template scope="scope">
            {{scope.row.second_day_rate}}%
          </template>
        </el-table-column>
        <el-table-column
          label="7日留存用户">
          <template scope="scope">
            <span @click="details(3,scope.row)" style="cursor: pointer">{{scope.row.seventh_day}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="7日留存率">
          <template scope="scope">
            {{scope.row.seventh_day_rate}}%
          </template>
        </el-table-column>
        <el-table-column
          label="30日留存用户">
          <template scope="scope">
            <span @click="details(4,scope.row)" style="cursor: pointer">{{scope.row.thirtieth_day}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="30日留存率">
          <template scope="scope">
            {{scope.row.thirtieth_day_rate}}%
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handleSizeChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
      class="page">
    </el-pagination>

    <el-dialog :title="dialog.name" v-model="dialog.visable">
      <el-table :data="dialog.data">
        <el-table-column property="username" label="账号名"></el-table-column>
        <el-table-column property="user_id" label="姓名"></el-table-column>
        <el-table-column label="注册时间点">
          <template scope="scope">{{scope.row.created_at | Time}}</template>
        </el-table-column>
        <el-table-column property="ip" label="注册时用户IP"></el-table-column>
        <el-table-column label="IP解析">
          <template scope="scope">{{scope.row.ip_country}}_{{scope.row.ip_province}}_{{scope.row.ip_city}}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="d_handleSizeChange1"
        :current-page="d_currentPage"
        :page-size="d_pageSize"
        layout="total, prev, pager, next, jumper"
        :total="d_totalSize"
        class="page">
      </el-pagination>
    </el-dialog>
    <el-dialog :title="dialog2.name" v-model="dialog2.visable" size="tiny">
      <table class="table">
        <tbody>
        <tr style="background-color: #EEF1F6">
          <th>账号名</th>
        </tr>
        <tr v-if="!dialog2.data">
          <th style="padding: 10px 0">暂无数据</th>
        </tr>
        <tr v-else v-for="item in dialog2.data">
          <th>{{item.username}}</th>
        </tr>
        </tbody>
      </table>
      <el-pagination
        @current-change="d_handleSizeChange2"
        :current-page="d_currentPage"
        :page-size="d_pageSize"
        layout="total, prev, pager, next, jumper"
        :total="d_totalSize"
        class="page">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import {mapActions, mapGetters}  from 'vuex'
  export default{
    data: () => ({
      filter: {
        start: '',
        end: '',
        versions: '全部版本',
        channels: '全部渠道'
      },
      data: [],
      pageSize: 10,
      currentPage: 0,
      totalSize: 0,
      /*折线图*/
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
          valueSuffix: '%'
        },
        series: [],
        credits: false
      },
      dialog: {
        visable: false,
        index: 0,
        name: '',
        data: []
      },
      dialog2: {
        visable: false,
        index: 0,
        name: '',
        data: []
      },
      d_pageSize: 15,
      d_currentPage: 0,
      d_totalSize: 0,
    }),
    computed: {
      ...mapGetters(['versions']),
    },
    watch: {
      data(){
        this.draw()
      }
    },
    methods: {
      //获取列表信息
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.remain_list,
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
      //获取当日新增详情
      getDetails(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.remain_details,
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
      //获取留存日详情
      getRemain(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.remain_retention_details,
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
      getData(val){
        return new Promise((resolve, reject) => {
          this.getInfo({page: val, limit: this.pageSize}).then(res => {
            let data = res.data.data
            this.currentPage = data.current_page
            this.totalSize = data.total_count
            this.data = data.logs;
            resolve(res)
          })
        })
      },
      //表格数据
      AnalysisJSON(parm) {
        var result = []
        var keyList = {second_day_rate: '次日留存率', seventh_day_rate: '7日留存率', thirtieth_day_rate: '30日留存率'}
        var names = ['second_day_rate', 'seventh_day_rate', 'thirtieth_day_rate']
        for (var i = 0; i < names.length; i++) {
          var data = []
          for (var j = 0; j < parm.length; j++) {
            if (parm[j][names[i]]) {
              parm[j][names[i]] = parseFloat(parm[j][names[i]].replace(/%/, ''))
            } else {
              parm[j][names[i]] = 0.0
            }
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
      //绘图
      draw(){
        //设置数据
        this.options.series = this.AnalysisJSON(this.data);
        //设置X轴
        this.options.xAxis.categories = this.setXAxis(this.data)
        this.$HighCharts.chart('main', this.options);
      },
      //筛选
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(){
        if (this.filter.channels == '全部渠道') {
          this.filter.channels = ''
        }
        if (this.filter.versions == '全部版本') {
          this.filter.versions = ''
        }
        let options = {
          page: 1,
          limit: this.pageSize,
          app_version: this.filter.versions,
          app_channel: this.filter.channels,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        this.getInfo(options).then(res => {
          let data = res.data.data
          this.currentPage = data.current_page
          this.totalSize = data.total_count
          this.data = data.logs;
        })
      },
      handleSizeChange(val){
        this.getData(val)
      },
      d_handleSizeChange1(){

      },
      d_handleSizeChange2(){

      },
      /*详情*/
      /*当日*/
      detail(id, data){
        if (this.filter.channels == '全部渠道') {
          this.filter.channels = ''
        }
        if (this.filter.versions == '全部版本') {
          this.filter.versions = ''
        }
        let options = {
          page: 1,
          limit: this.d_pageSize,
          stat_date: data.stat_date,
          app_version: this.filter.versions,
          app_channel: this.filter.channels,
        }
        this.dialog.name = '当日新增用户'
        this.dialog.visable = true
        this.getDetails(options).then(res => {
          this.dialog.data = res.data.data.users
          this.d_currentPage = res.data.data.current_page
          this.d_totalSize = res.data.data.total_count
        })
      },
      /*次日-7日-30日*/
      details(id, data){
        if (this.filter.channels == '全部渠道') {
          this.filter.channels = ''
        }
        if (this.filter.versions == '全部版本') {
          this.filter.versions = ''
        }
        let options = {
          page: 1,
          limit: this.d_pageSize,
          stat_date: data.stat_date,
          app_version: this.filter.versions,
          app_channel: this.filter.channels,
        }
        this.dialog2.visable = true
        if (id === 2) {
          this.dialog2.name = '次日留存用户'
          options.stat_type = 1
          this.getRemain(options).then(res => {
            this.dialog2.data = res.data.data.users
            this.d_currentPage = res.data.data.current_page
            this.d_totalSize = res.data.data.total_count
          })
        } else if (id === 3) {
          this.dialog2.name = '7日留存用户'
          options.stat_type = 7
          this.getRemain(options).then(res => {
            this.dialog2.data = res.data.data.users
            this.d_currentPage = res.data.data.current_page
            this.d_totalSize = res.data.data.total_count
          })
        } else {
          this.dialog2.name = '30日留存用户'
          options.stat_type = 30
          this.getRemain(options).then(res => {
            this.dialog2.data = res.data.data.users
            this.d_currentPage = res.data.data.current_page
            this.d_totalSize = res.data.data.total_count
          })
        }
      },
    },
    mounted(){
      this.getData(1).then(res => {
        this.draw()
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

  .warp_col {
    width: 50%;
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }
</style>
</

style

>
