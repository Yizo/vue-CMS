<template>
  <div id="start">

    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'share' }">失败信息</el-breadcrumb-item>
      <el-breadcrumb-item>连接失败</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计" style="margin-top: 10px;text-align: left">
    </el-alert>
    <div class="filter">
      <el-row>
        <div style="display: inline-block">
          <el-date-picker
            v-model="filter.start"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
          <el-date-picker
            v-model="filter.end"
            type="date"
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
        <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
      </el-row>
    </div>
    <!--筛选-->
    <div class="warp_filter">


      <!--图表展示-->
      <el-row class="">
        <el-col :span="24">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>连接失败次数</span>
          <div id="main" style="height: 500px;border: 1px solid #D3DCE6">

          </div>
        </el-col>
      </el-row>

      <!--表格-->
      <el-row>
        <el-col :span="24">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>连接失败次数</span>
          <table class="t1">
            <tbody class="table" style="height: 500px;overflow: auto">
            <tr>
              <th>时间</th>
              <th>服务器连接失败次数</th>
              <th>软件崩溃/bug</th>
              <th>未联网</th>
              <th>总失败次数</th>
            </tr>
            <tr v-for="(item,index) in tableData">
              <td>{{item.stat_date}}</td>
              <td><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                        @click="details_users({index:1,stat_at:item.stat_date})">{{item.connection_failed_total}}</span>
              </td>
              <td><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                        @click="details_users({index:2,stat_at:item.stat_date})">{{item.crash_total}}</span></td>
              <td><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                        @click="details_users({index:3,stat_at:item.stat_date})">{{item.unconnected_total}}</span></td>
              <td>{{item.total}}</td>
            </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
      <!--数量弹窗-->
      <!--服务器链接失败详情-->
      <el-dialog v-model="dialogTableVisible">
        <h2 class="dh2">{{pageInfo.device_model}}</span></h2>
        <el-table :data="dialogData" style="text-align: center">
          <el-table-column label="账号名" width="120">
            <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column label="时间点" width="150">
            <template scope="scope">
              <span>{{ scope.row.created_at | Time}}</span>
            </template>
          </el-table-column>
          <el-table-column property="node_type" label="服务名称" width="100"></el-table-column>
          <el-table-column property="ip" label="用户IP"></el-table-column>
          <el-table-column property="ip_region" label="IP解析"></el-table-column>
          <el-table-column property="device_model" label="硬件型号" width="80"></el-table-column>
          <el-table-column property="operator" label="运营商" width="80"></el-table-column>
        </el-table>
        <div slot="footer">
          <el-pagination
            @current-change="lianjie"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="d_total"
            layout="prev,next"
            class="page">
          </el-pagination>
        </div>
      </el-dialog>
      <!--软件崩溃/未联网失败详情-->
      <el-dialog v-model="dialogTableVisible1">
        <h2 class="dh2">{{pageInfo.device_model}}</span></h2>
        <el-table :data="dialogData" style="text-align: center">
          <el-table-column label="账号名" width="150">
            <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column property="device_uuid" label="UUID" width="150"></el-table-column>
          <el-table-column label="时间点" width="150">
            <template scope="scope">
              <span>{{ Timestamp(scope.row.created_at)}}</span>
            </template>
          </el-table-column>
          <el-table-column property="ip" label="用户IP" width="100"></el-table-column>
          <el-table-column property="ip_region" label="IP解析" width="100"></el-table-column>
          <el-table-column property="device_model" label="硬件型号" width="100"></el-table-column>
          <el-table-column property="operator" label="运营商" width="100"></el-table-column>
        </el-table>
        <div slot="footer">
          <el-pagination
            @current-change="lianjie"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="d_total"
            layout="prev,next"
            class="page">
          </el-pagination>
        </div>
      </el-dialog>

    </div>
    <user-detail :visab="dialogVisible" :name="username" @closeDialog="cdialog"></user-detail>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  import {mapGetters, mapActions} from 'vuex'
  import userDetail from '../../publicView/accoutInfo/index.vue'
  export default {
    data(){
      return {
        /*折线图*/
        options: {
          title: {
            text: null
          },
          xAxis: {
            title: {
              text: '失败日期'
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
        /*列表*/
        tableData: [],
        chartData: [],
        /*弹窗*/
        dialogTableVisible: false,
        dialogTableVisible1: false,
        dialogData: [],//弹窗数据
        pageInfo: {
          index: '',
          page: '',
          device_model: ''
        },
        /*分页*/
        parm: {},//分页参数
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        d_total: 0,
        filter2: {
          versions: '',
          channels: '',
        },
        dialogVisible: false,
        username: '姓名'
      }
    },
    computed: {
      ...mapGetters(['versions', 'initDate']),
      filter(){
        return this.initDate
      }
    },
    components: {
      userDetail
    },
    methods: {
      //时间戳
      Timestamp(row){
        const now = new Date(row * 1000);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();

        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      },
      ...mapActions({
        ud_base: 'UD_base_info',
      }),
      cdialog(){
        this.dialogVisible = false
      },

      userInfo(row){
        this.username = row.username
        this.dialogVisible = true;
        window.sessionStorage.setItem('userId', row.user_id)
        this.ud_base({limit: 10})
      },
      //表格数据
      AnalysisJSON(parm) {
        var result = []
        var keyList = {
          connection_failed_total: '服务器连接失败次数',
          crash_total: '软件崩溃',
          unconnected_total: '未联网',
          total: '总失败次数'
        }
        var names = ['connection_failed_total', 'crash_total', 'unconnected_total', 'total']
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
      /*筛选菜单*/
      filtration(){
        if (typeof this.filter.start == 'object') {
          this.filter.start = JS.Timestamp(this.filter.start)
        }
        if (typeof this.filter.end == 'object') {
          this.filter.end = JS.Timestamp(this.filter.end)
        }
        let options = {
          start_at: this.filter.start,
          end_at: this.filter.end,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        }
        if (options.start_at && options.end_at || !options.start_at && !options.end_at) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        this.getAllInfo(options).then(res => {
          this.tableData = res.data.data.logs;
          this.currentPage = res.data.data.current_page
          this.totalSize = res.data.data.total_count;
          this.rendering()
        })
      },

      details_users(parm){
        if (parm.index == 1) {
          this.dialogTableVisible = true;
          this.pageInfo.device_model = '服务器连接失败'
        } else if (parm.index == 2) {
          this.dialogTableVisible1 = true;
          this.pageInfo.device_model = '软件崩溃'
        } else {
          this.dialogTableVisible1 = true;
          this.pageInfo.device_model = '未联网'
        }
        var options = {
          type: parm.index,
          stat_at: parm.stat_at,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels,
        }
        this.parm = options;
        this.errInfo(options).then(res => {
          this.dialogData = res.data.data.logs;
        })
      },
      /*失败信息*/
      getAllInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.connection_failed_logs,
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
      //渲染图表
      rendering(){
        this.getChart({
          start_at: this.filter.start,
          end_at: this.filter.end,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        }).then(res => {
          this.chartData = res.data.data.logs
          //设置数据
          this.options.series = this.AnalysisJSON(this.chartData);
          //设置X轴
          this.options.xAxis.categories = this.setXAxis(this.chartData)
          this.$HighCharts.chart('main', this.options);
        })
      },
      //获取图表数据
      getChart(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.connection_failed_chart,
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
      /*连接失败详情*/
      errInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.connection_failed_detail,
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
      /*连接失败/软件崩溃/未联网*/
      lianjie(val){
        let options = this.parm;
        options.app_version = this.filter2.versions;
        options.app_channel = this.filter2.channels;
        options.page = val
        this.errInfo(options).then(res => {
          this.dialogData = res.data.data.logs;
        })
      },

    },
    mounted(){
      let options = {
        start_at: this.filter.start,
        end_at: this.filter.end,
        app_version: this.filter2.versions,
        app_channel: this.filter2.channels
      }
      this.getAllInfo(options).then(res => {
        this.tableData = res.data.data.logs;
        this.currentPage = res.data.data.current_page
        this.totalSize = res.data.data.total_count;
        this.rendering()
      })
    },
  }
</script>

<style scoped>
  #start {
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
  .filter {
    text-align: left;
    margin-top: 20px;
  }

  .f {
    display: inline-block;
  }

  .is-leaf .cell {
    text-align: center;
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }

  .el-table .cell {
    word-break: break-all;
    line-height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
</style>

