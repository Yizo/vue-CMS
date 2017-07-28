<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>用户行为</el-breadcrumb-item>
      <el-breadcrumb-item>用户使用频率</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计" style="margin-top: 10px;text-align: left">
    </el-alert>
    <el-row style="text-align: left;margin-bottom: 10px;margin-top: 20px">
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
      <div class="layout">
        <!--图表展示-->
        <el-row class="">
          <el-col :span="24">
            <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>用户点击频率</span>
            <div id="main" style="height: 400px;width:98%;border: 1px solid #D3DCE6">

            </div>
          </el-col>
        </el-row>
      </div>
      <div class="layout">
        <table class="table">
          <tbody>
          <tr style="background-color: #EEF1F6">
            <th>次数段</th>
            <th>用户数</th>
          </tr>
          <tr>
            <td>1-2次</td>
            <td @click="detail(0)"><span style="cursor: pointer">{{data.count_1_2 ? data.count_1_2 : 0}}</span></td>
          </tr>
          <tr>
            <td>3-5次</td>
            <td @click="detail(1)"><span style="cursor: pointer">{{data.count_3_5 ? data.count_3_5 : 0}}</span></td>
          </tr>
          <tr>
            <td>6-9次</td>
            <td @click="detail(2)"><span style="cursor: pointer">{{data.count_6_9 ? data.count_6_9 : 0}}</span></td>
          </tr>
          <tr>
            <td>10-19次</td>
            <td @click="detail(3)"><span style="cursor: pointer">{{data.count_10_19 ? data.count_10_19 : 0}}</span></td>
          </tr>
          <tr>
            <td>20-49次</td>
            <td @click="detail(4)"><span style="cursor: pointer">{{data.count_20_49 ? data.count_20_49 : 0}}</span></td>
          </tr>
          <tr>
            <td>50次以上</td>
            <td @click="detail(5)"><span style="cursor: pointer">{{data.count_50 ? data.count_50 : 0}}</span></td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--弹窗-->
      <el-dialog v-model="dialog.visable" :title="dialog.name" class="dialog" size="tiny">
        <table class="table" style="margin-top: 0">
          <tbody>
          <tr style="background-color: #EEF1F6">
            <th>账号名</th>
          </tr>
          <tr v-if="dialog.data == ''">
            <th style="padding: 10px 0">暂无数据</th>
          </tr>
          <tr v-else v-for="item in dialog.data">
            <th>
              <span class="dialog_num" @click="userInfo(item)">{{item.username}}</span>
            </th>
          </tr>
          </tbody>
        </table>
        <div slot="footer">
          <el-pagination
            @current-change="d_handleCurrentChange"
            :current-page="dialog.currentPage"
            :page-size="pageSize"
            :total="dialog.total"
            layout="total, prev, pager, next, jumper"
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

  export default{
    data: () => ({
      data: [],
      pagename: ['1-2次', '3-5次', '6-9次', '10-19次', '20-49次', '50次以上'],
      pageSize: 15,
      /*折线图*/
      options: {
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: '点击数',
          data: []
        }],
        credits: false
      },
      dialog: {
        visable: false,
        index: 0,
        name: '1-2次',
        currentPage: 1,
        total: 0,
        data: []
      },
      filter2: {
        versions: '',
        channels: '',
      },
      dialogVisible: false,
      username: '姓名'
    }),
    components: {
      userDetail
    },
    computed: {
      ...mapGetters(['initDate', 'versions']),
      filter(){
        return this.initDate
      }
    },
    watch: {
      data(){
        this.draw()
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
            url: API.frequency_list,
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
      getDetails(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.frequency_details,
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
      getData(parm){
        return new Promise((resolve, reject) => {
          this.getInfo(parm).then(res => {
            this.data = res.data.data;
            resolve(res)
          })
        })
      },
      //表格数据
      AnalysisJSON(parm) {
        var arry = []
        if (parm.count_1_2 === null) {
          arry.push(0)
        } else {
          arry.push(parm.count_1_2)
        }
        if (parm.count_3_5 === null) {
          arry.push(0)
        } else {
          arry.push(parm.count_3_5)
        }
        if (parm.count_6_9 === null) {
          arry.push(0)
        } else {
          arry.push(parm.count_6_9)
        }
        if (parm.count_10_19 === null) {
          arry.push(0)
        } else {
          arry.push(parm.count_10_19)
        }
        if (parm.count_20_49 === null) {
          arry.push(0)
        } else {
          arry.push(parm.count_20_49)
        }
        if (parm.count_50 === null) {
          arry.push(0)
        } else {
          arry.push(parm.count_50)
        }

        return arry
      },
      //设置X轴
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
        this.options.series[0].data = this.AnalysisJSON(this.data);
        //设置X轴
        this.options.xAxis.categories = this.setXAxis(this.pagename)
        this.$HighCharts.chart('main', this.options);
      },
      //筛选
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(val){
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
      detail(index){
        this.dialog.visable = true;
        this.dialog.name = this.pagename[index];
        this.dialog.currentPage = 1;
        let options = {
          page: 1,
          limit: this.pageSize,
          times_scope: this.pagename[index].replace('次', ''),
          start_at: this.filter.start || '',
          end_at: this.filter.end || '',
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        };
        if (index == 5) {
          options.times_scope = '50'
        }
        this.getDetails(options).then(res => {
          let data = res.data.data
          this.dialog.data = data.logs;
          this.dialog.total = data.total_count;
        })
      },
      d_handleCurrentChange(val){
        let options = {
          page: val,
          limit: this.pageSize,
          times_scope: this.pagename[index].replace('次', ''),
          start_at: this.filter.start || '',
          end_at: this.filter.end || '',
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        };
        this.dialog.currentPage = val;
        this.getDetails(options).then(res => {
          let data = res.data.data
          this.dialog.data = data.logs;
          this.dialog.total = data.total_count;
        })
      }
    },
    mounted(){
      this.getData({
        page: 1, limit: this.pageSize, app_version: this.filter2.versions,
        app_channel: this.filter2.channels
      }).then(res => {
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
    display: flex;
  }

  .table {
    margin-top: 52px;
  }

  .table td, .table th {
    width: 50%;
    margin: 5px;
  }

  .layout {
    flex: 0 0 50%;
  }
</style>
