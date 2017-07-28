<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>失败信息</el-breadcrumb-item>
      <el-breadcrumb-item>登录失败</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计" style="margin-top: 10px;text-align: left">
    </el-alert>
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

    <div class="warp">
      <!--图表展示-->
      <el-row class="">
        <el-col :span="24">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>每日登录失败折线图</span>
          <div id="main" style="height: 500px;border: 1px solid #D3DCE6;margin: 10px auto">

          </div>
        </el-col>
      </el-row>
      <template>
        <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>每日登录失败次数</span>
        <el-table
          :data="data"
          style="width: 100%;height: 500px;overflow-y: auto">
          <el-table-column
            prop="stat_date"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="unconnected_total"
            label="账号不存在">
            <template scope="scope">
              <span class="dialog_num" @click="detail({type:0,stat_at:scope.row.stat_date})">{{scope.row.not_exist_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="密码错误">
            <template scope="scope">
              <span class="dialog_num"
                    @click="detail({type:1,stat_at:scope.row.stat_date})">{{scope.row.wrong_password_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="connection_failed_total"
            label="连接失败">
            <template scope="scope">
              <span class="dialog_num"
                    @click="detail({type:2,stat_at:scope.row.stat_date})">{{scope.row.failed_connection_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="软件崩溃">
            <template scope="scope">
              <span class="dialog_num"
                    @click="detail({type:3,stat_at:scope.row.stat_date})">{{scope.row.crash_count}}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--弹窗-->
    <el-dialog v-model="dialog" :title="title_name" size="tiny" class="dialog">
      <el-table
        :data="dialogData"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="账号名"
          width="180px">
          <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="device_uuid"
          label="UUID">
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-pagination
          @current-change="detail_Paging"
          :current-page="d_currentPage"
          :page-size="pageSize"
          :total="d_total"
          layout="total, prev, pager, next, jumper"
          class="page">
        </el-pagination>
      </div>
    </el-dialog>

    <user-detail :visab="dialogVisible" :name="username" @closeDialog="cdialog"></user-detail>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  import {mapGetters, mapActions} from 'vuex'
  import userDetail from '../../publicView/accoutInfo/index.vue'
  export default{
    components: {
      userDetail
    },
    data(){
      return {
        data: [],
        chartData: [],
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
              text: '失败日期'
            },
            categories: []
          },
          yAxis: {
            title: {
              text: '失败次数'
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
        filter2: {
          versions: '',
          channels: '',
        },
        dialogVisible: false,
        username: '姓名'
      }
    },
    computed: {
      ...mapGetters(['initDate', 'versions']),
      filter(){
        return this.initDate
      }
    },
    methods: {
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
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs
          this.total = res.data.data.total_count;
          this.rendering()
        })
      },
      //渲染图表
      rendering(){
        this.getChart({
          limit: this.pageSize,
          page: 1,
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
      //表格数据
      AnalysisJSON(parm) {
        var result = []
        var keyList = {
          not_exist_count: '账号不存在',
          wrong_password_count: '密码错误',
          failed_connection_count: '连接失败',
          crash_count: '软件崩溃'
        }
        var names = ['not_exist_count', 'wrong_password_count', 'failed_connection_count', 'crash_count']
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
      detail(parm){
        this.parm = parm
        if (parm.type == 0) {
          this.title_name = '账号不存在'
        } else if (parm.type == 1) {
          this.title_name = '密码错误'
        } else if (parm.type == 2) {
          this.title_name = '连接失败'
        } else {
          this.title_name = '软件崩溃'
        }
        this.dialog = true
        let options = {
          type: parm.type,
          stat_at: parm.stat_at,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels,
          page: 1,
          limit: 15
        }
        this.getDetail(options).then(res => {
          this.d_currentPage = res.data.data.current_page;
          this.d_total = res.data.data.total_count,
            this.dialogData = res.data.data.logs;
        })
      },
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.loginfail,
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
      //详情
      getDetail(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.loginfail_detail,
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
      //获取表格数据
      getChart(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.loginfail_chart,
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
        this.getInfo({
          limit: this.pageSize,
          page: val,
          start_at: this.filter.start,
          end_at: this.filter.end,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        }).then(res => {
          this.data = res.data.data.logs
        })
      },
      detail_Paging(val){
        this.getDetail({
          limit: this.pageSize,
          page: val,
          type: this.parm.type,
          stat_at: this.parm.stat_at,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        }).then(res => {
          this.d_total = res.data.data.total_count,
            this.dialogData = res.data.data.logs;
        })
      }
    },
    mounted(){
      this.getInfo({
        limit: this.pageSize,
        page: 1,
        start_at: this.filter.start,
        end_at: this.filter.end,
        app_version: this.filter2.versions,
        app_channel: this.filter2.channels
      }).then(res => {
        this.data = res.data.data.logs
        this.total = res.data.data.total_count;
        this.rendering();
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

  .table td {
    width: 50%;
  }
</style>
