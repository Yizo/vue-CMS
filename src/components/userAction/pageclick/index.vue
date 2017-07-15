<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>用户行为</el-breadcrumb-item>
      <el-breadcrumb-item>页面点击</el-breadcrumb-item>
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
        <el-select v-model="filter2.versions" placeholder="版本筛选" style="width: 200px;">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
      </template>
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
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
    </el-row>
    <div class="warp">
      <template>
        <!--图表展示-->
        <el-row class="">
          <el-col :span="24">
            <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>点击次数</span>
            <div id="main" style="height: 400px;border: 1px solid #D3DCE6">

            </div>
          </el-col>
        </el-row>
        <el-table
          :data="data"
          border
          style="width: 100%">
          <el-table-column
            prop="interface_name"
            label="页面名称">
          </el-table-column>
          <el-table-column
            label="点击次数">
            <template scope="scope">
              <span @click="visits_detail(scope.row)" style="cursor: pointer">{{scope.row.visits_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="点击人数">
            <template scope="scope">
              <span @click="users_detail(scope.row)" style="cursor: pointer">{{scope.row.users_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="connections_count"
            label="人均点击">
            <template scope="scope">
              {{clickRate(scope.row)}}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--弹窗-点击次数-->
    <el-dialog :title="visits.name" v-model="visits.visable">
      <el-table :data="visits.data">
        <el-table-column label="账号名">
          <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="点击时间">
          <template scope="scope">{{scope.row.created_at | Time}}</template>
        </el-table-column>
        <el-table-column label="版本信息">
          <template scope="scope">{{scope.row.app_channel}}_{{scope.row.app_version}}_{{scope.row.app_version_number}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="pagingVisitis"
        :current-page="d_currentPage"
        :page-size="d_pageSize"
        layout="total, prev, pager, next, jumper"
        :total="d_totalSize"
        class="page">
      </el-pagination>
    </el-dialog>
    <!--弹窗-点击人数-->
    <el-dialog :title="user.name" v-model="user.visable" size="tiny">
      <table class="table">
        <tbody>
        <tr style="background-color: #EEF1F6">
          <th>账号名</th>
        </tr>
        <tr v-if="user.data == ''">
          <th style="padding: 10px 0">暂无数据</th>
        </tr>
        <tr v-else v-for="item in user.data">
          <th>
            <span class="dialog_num" @click="userInfo(item)">{{item.username}}</span>
          </th>
        </tr>
        </tbody>
      </table>
      <el-pagination
        @current-change="pagingUser"
        :current-page="d_currentPage"
        :page-size="d_pageSize"
        layout="total, prev, pager, next, jumper"
        :total="d_totalSize"
        class="page">
      </el-pagination>
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
    props: {
      contList: {
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        data: [],
        date_list: [],
        logs: [],
        pageSize: 15,
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
            valueSuffix: '次'
          },
          series: [],
          credits: false
        },
        d_currentPage: 1,
        d_pageSize: 15,
        d_totalSize: 0,
        curentInfo: {},//分页信息
        visits: {
          visable: false,
          name: '点击次数',
          data: [],
        },
        user: {
          visable: false,
          name: '点击人数',
          data: []
        },
        filter2: {
          versions: '',
          channels: '',
        },
        dialogVisible: false,
        username: '姓名'
      }
    },
    watch: {
      data(){
        this.draw()
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
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.pageclick_list,
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
      get_visit_details(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.pageclick_visit_details,
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
      get_user_details(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.pageclick_user_details,
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
      getData(options){
        return new Promise((resolve, reject) => {
          this.getInfo(options).then(res => {
            let data = res.data.data
            this.data = data.interfaces
            this.logs = data.logs
            this.date_list = data.date_list
            resolve(res)
          })
        })
      },
      /*当前页面人均点击率*/
      clickRate(data){
        let a = data.visits_count
        let b = data.users_count;
        if (a === 0 || b === 0) {
          return '0'
        } else {
          return (Math.round((a / b) * 10) / 10);
        }
      },
      //表格数据
      AnalysisJSON(parm) {
        var result = []
        for (var i in parm) {
          result.push({name: i, data: parm[i]})
        }
        return result
      },
      //设置Y轴
      setXAxis(parm){
        var arry = []
        for (var i in parm) {
          arry.push(parm[i]);
        }
        return arry
      },
      //绘图
      draw(){
        //设置数据
        this.options.series = this.AnalysisJSON(this.logs);
        //设置X轴
        this.options.xAxis.categories = this.date_list
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
        this.getData(options);
      },
      //点击次数详情
      visits_detail(data){
        let is = this.filter.start && this.filter.end;
        this.d_currentPage = 1
        this.visits.visable = true
        if (is) {
          this.curentInfo = Object.assign({}, data)
          let options = {
            page: 1,
            limit: this.d_pageSize,
            start_at: this.filter.start,
            end_at: this.filter.end,
            app_version: this.filter2.versions,
            app_channel: this.filter2.channels,
            interface_id: data.interface_id
          }
          this.get_visit_details(options).then(res => {
            this.visits.data = [...res.data.data.logs]
            this.d_totalSize = res.data.data.total_count
          })
        } else {
          this.$message({
            message: '请选择开始,结束日期',
            type: 'warning'
          });
        }
      },
      pagingVisitis(val){
        let options = {
          page: val,
          limit: this.d_pageSize,
          start_at: this.filter.start || null,
          end_at: this.filter.end || null,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels,
          interface_id: this.curentInfo.interface_id
        }
        this.d_currentPage = val
        this.get_visit_details(options).then(res => {
          this.visits.data = [...res.data.data.logs]
        })
      },
      //点击人数详情
      users_detail(data){
        let is = this.filter.start && this.filter.end
        this.user.visable = true
        this.d_currentPage = 1
        if (is) {
          this.curentInfo = Object.assign({}, data)
          let options = {
            page: 1,
            limit: this.d_pageSize,
            start_at: this.filter.start || null,
            end_at: this.filter.end || null,
            app_version: this.filter2.versions,
            app_channel: this.filter2.channels,
            interface_id: data.interface_id
          }
          this.get_user_details(options).then(res => {
            this.user.data = [...res.data.data.logs]
            this.d_totalSize = res.data.data.total_count
          })
        } else {
          this.$message({
            message: '请选择开始,结束日期',
            type: 'warning'
          });
        }

      },
      pagingUser(val){
        let options = {
          page: val,
          limit: this.d_pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end,
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels,
          interface_id: this.curentInfo.interface_id
        }
        this.d_currentPage = val
        this.get_user_details(options).then(res => {
          this.user.data = [...res.data.data.logs]
        })
      },

    },
    mounted(){
      let options = {
        page: 1,
        limit: this.pageSize,
        start_at: this.filter.start,
        end_at: this.filter.end,
        app_version: this.filter2.versions,
        app_channel: this.filter2.channels
      }
      this.getData(options).then(res => {
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

  .page {
    text-align: right;
    margin-top: 20px;
  }
</style>

