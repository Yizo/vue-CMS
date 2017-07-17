<template>
  <div class="dstip">
    <div class="warp">
      <!--图表展示-->
      <el-row class="">
        <el-col :span="24">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>月活跃量</span>
          <div id="main2" style="height: 300px;border: 1px solid #D3DCE6">

          </div>
        </el-col>
      </el-row>

      <template>
        <el-table
          :data="get_month.logs"
          border
          style="width: 100%;margin-top: 10px">
          <el-table-column
            prop="stat_date"
            label="时间">
            <template scope="scope">
              {{scope.row.stat_year}}年{{scope.row.stat_month}}月
            </template>
          </el-table-column>
          <el-table-column
            label="活跃用户">
            <template scope="scope">
              <span @click="num(scope.row)" class="dialog_num">{{scope.row.users_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="筛选结果占比">
            <template scope="scope">
              <span>{{scope.row.users_percent}}%</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--分页-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="get_month.current_page"
        layout="total, prev, pager, next, jumper"
        :total="get_month.total_count"
        :page-size="pageSize"
        class="page">
      </el-pagination>

      <!--详情-->
      <el-dialog v-model="dialogVisible" title="月活跃详情" size="tiny" custom-class="dialog">
        <table class="table">
          <tbody>
          <tr style="background-color: #EEF1F6">
            <th>账号名</th>
          </tr>
          <tr v-if="get_month_detail.logs == ''">
            <th style="padding: 10px 0">暂无数据</th>
          </tr>
          <tr v-else v-for="item in get_month_detail.logs">
            <th><span class="dialog_num" @click="userInfo(item)">{{item.username}}</span>
            </th>
          </tr>
          </tbody>
        </table>
        <div slot="footer">
          <el-pagination
            @current-change="handleCurrentChange2"
            :current-page="get_month_detail.current_page"
            layout="total, prev, pager, next, jumper"
            :total="get_month_detail.total_count"
            :page-size="pageSize2"
            class="page">
          </el-pagination>
        </div>
      </el-dialog>
    </div>
    <user-detail :visab="user_dialog" :name="username" @closeDialog="cdialog"></user-detail>
  </div>
</template>

<script>
  import {mapActions, mapGetters}  from 'vuex'
  import userDetail from '../../publicView/accoutInfo/index.vue'
  export default{
    props: {
      filter: {
        type: Object
      }
    },
    data: () => ({
      pageSize: 10,
      pageSize2: 15,
      dialogVisible: false,
      detail: {
        stat_month: ''
      },
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
        credits: false,
      },
      user_dialog: false,
      username: '姓名'
    }),
    components: {
      userDetail
    },
    computed: {
      ...mapGetters({
        get_month: 'ACTIVEDAY_month_data',
        get_month_detail: 'ACTIVEDAY_month_details_data',
        get_month_chart: 'ACTIVEDAY_month_chart',
      }),
    },
    watch: {
      get_month_chart(){
        this.draw()
        return this.get_month_chart
      }
    },
    methods: {
      ...mapActions({
        month: 'ACTIVEDAY_MONTH',
        monthChart: 'ACTIVEDAY_MONTH_CHART',
        month_details: 'ACTIVEDAY_MONTH_DETAILS',
        ud_base: 'UD_base_info'
      }),
      cdialog(){
        this.user_dialog = false
      },
      userInfo(row){
        this.username = row.username
        this.user_dialog = true;
        window.sessionStorage.setItem('userId', row.user_id)
        this.ud_base({limit: 10})
      },
      //表格数据
      AnalysisJSON(parm) {
        var result = []
        var keyList = {users_count: '当月活跃用户数量'}
        var names = ['users_count']
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
          arry.push(parm[i].stat_year + "-" + parm[i].stat_month);
        }
        return arry
      },
      handleCurrentChange(val){
        this.month({page: val, limit: this.pageSize})
      },
      handleCurrentChange2(val){
        this.month_details({
          page: val, limit: this.pageSize2, stat_month: this.detail.stat_month, app_version: this.filter.versions,
          app_channel: this.filter.channels
        })
      },
      num(data){
        var date = String(data.stat_year + "-" + data.stat_month);
        this.detail.stat_month = date;
        this.dialogVisible = true
        this.month_details({
          limit: this.pageSize2, stat_month: date, app_version: this.filter.versions,
          app_channel: this.filter.channels
        })
      },
      //绘图
      draw(){
        //设置数据
        this.options.series = this.AnalysisJSON(this.get_month_chart.data.logs);
        //设置X轴
        this.options.xAxis.categories = this.setXAxis(this.get_month_chart.data.logs)
        this.$HighCharts.chart('main2', this.options);
      }
    },
    mounted(){
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
