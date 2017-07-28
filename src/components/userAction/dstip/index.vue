<template>
  <div class="dstip" v-loading.body="loading">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>用户行为</el-breadcrumb-item>
      <el-breadcrumb-item>去向IP</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计;本月只能查询上个月以上的数据" style="margin-top: 10px;text-align: left">
    </el-alert>
    <el-row style="text-align: left;margin-top: 20px">
      <span>筛选方式</span>
      <el-select v-model="select" placeholder="筛选方式">
        <el-option label="月" value="month"></el-option>
        <el-option label="日" value="date" checked></el-option>
      </el-select>
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
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
    </el-row>
    <div class="warp">
      <template>
        <el-table
          :data="data"
          style="width: 100%"
          id="table"
          editable>
          <el-table-column
            label="编号" width="50">
            <template scope="scope">{{(currentPage - 1) * pageSize + scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column
            label="去向IP">
            <template scope="scope">
              <span class="edit">{{scope.row.domain}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="中文解析">
            <template scope="scope">
              <div :class="'editSpanClass' + scope.$index">
                <span class="edit">{{scope.row.domain_description}}</span>
                <i class="el-icon el-icon-edit" style="color: #1c8de0;cursor: pointer"
                   @click="edit(scope.$index,scope.row)"></i>
              </div>
              <div :class="'editInputClass' + scope.$index" style="display: none">
                <el-input type="text" v-model="scope.row.domain_description"
                          @keyup.enter.native="inputBlur(scope.$index,scope.row)"
                          @blur="loseBlur(scope.$index)"></el-input>
                <i class="iconfont icon-gouxuan"
                   style="color: green;font-size:20px;cursor: pointer;display: inline-block;"
                   @click.stop="inputBlur(scope.$index,scope.row)"></i>
                <i class="el-icon el-icon-circle-cross" style="color: red;cursor: pointer;display: inline-block;"
                   @click.stop="cancel(scope.$index,scope.row)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="访问用户数">
            <template scope="scope">
              <span class="dialog_num" @click="user_details(scope.row)">{{scope.row.users_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="访问次数"
            prop="visits_count">
          </el-table-column>
          <el-table-column
            label="用户地域分析">
            <template scope="scope">
              <el-button size="small" @click="domain_details(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--分页-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        class="page">
      </el-pagination>
      <!--访问用户详情-->
      <el-dialog :title="user.row_data.domain" v-model="user.visable" size="tiny">
        <el-table :data="user.data">
          <el-table-column label="账号名">
            <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column property="visits_count" label="访问次数"></el-table-column>
        </el-table>
        <el-pagination
          @current-change="user_details_PageChange"
          :current-page="user.currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="user.totalSize"
          class="page">
        </el-pagination>
      </el-dialog>
      <!--查看地域分析-->
      <el-dialog :title="domain.row_data.domain" v-model="domain.visable">
        <el-table :data="domain.Country_data">
          <el-table-column type="index" label="编号" width="80px"></el-table-column>
          <el-table-column label="地域">
            <template scope="scope">
              {{scope.row.ip_country}}{{scope.row.ip_province}}{{scope.row.ip_city}}
            </template>
          </el-table-column>
          <el-table-column property="users_count" label="人数"></el-table-column>
          <el-table-column property="visits_count" label="占比">
            <template scope="scope">{{scope.row.percent}}%</template>
          </el-table-column>
        </el-table>
        <div id="main" style="width: 400px;height: 300px;margin-top: 10px;">

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
    components: {},
    data(){
      return {
        select: 'date',
        data: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        //访问用户数
        user: {
          visable: false,
          name: '',
          row_data: {},
          data: [],
          currentPage: 1,
          totalSize: 0,
        },
        //查看地域分析
        domain: {
          visable: false,
          name: '',
          row_data: {},
          Region_data: [],
          Country_data: []
        },
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
              }
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
        row: {
          index: 0,
          data: null
        },
        loading: false,
        dialogVisible: false,
        username: '姓名'
      }
    },
    components: {
      userDetail
    },
    computed: {
      ...mapGetters(['initDate']),
      filter(){
        return this.initDate
      },
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
      edit(index, data){
        this.row.index = index;
        this.row.data = Object.assign({}, data);
        this.$el.querySelector(`.editSpanClass${index}`).style.display = 'none',
          this.$el.querySelector(`.editInputClass${index}`).style.display = 'block',
          this.$el.querySelector(`.editInputClass${index} input`).focus()
      },
      loseBlur(index){
        setTimeout(() => {
          this.$el.querySelector(`.editSpanClass${index}`).style.display = 'block'
          this.$el.querySelector(`.editInputClass${index}`).style.display = 'none'
        }, 200)
      },
      inputBlur(index, data){
        this.$el.querySelector(`.editSpanClass${index}`).style.display = 'block'
        this.$el.querySelector(`.editInputClass${index}`).style.display = 'none'
        this.loading = true
        setTimeout(() => {
          this.quick_update({
            domain: this.data[index].domain,
            description: this.data[index].domain_description
          }).then(res => {
            if (res.data.success) {
              this.loading = false
            } else {
              this.data[index].domain_description = this.row.data.domain_description
            }
          }).catch(err => {
            this.loading = false
            this.data[index].domain_description = this.row.data.domain_description
          })
        }, 800)
      },
      cancel(index, data){
        this.data[index].domain_description = this.row.data.domain_description
        this.$el.querySelector(`.editSpanClass${index}`).style.display = 'block'
        this.$el.querySelector(`.editInputClass${index}`).style.display = 'none'
      },
      //图表数据转为数组
      line(json){
        var arr = [];
        for (var i = 0; i < json.length; i++) {
          arr.push([json[i]['ip_country'] + json[i]['ip_province'] + json[i]['ip_city'], parseFloat(json[i].percent)])
        }
        return arr
      },
      //画图
      draw(data){
        this.options.series[0].data = this.line(data);
        this.$HighCharts.chart('main', this.options);
      },
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.dstip_list,
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
      //用户详情
      getUserDetails(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.dstip_user_details,
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
      //修改中文解析
      quick_update(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.dstip_quick_update,
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
      //次数详情
      getCountDetails(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.dstip_visit_details,
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
      /*去向IP-地域分析详情*/
      //查看每个国家访问指定域名的人数
      getDomainCountryDetails(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.dstip_domain_country_details,
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
      /*去向IP-地域分析详情*/
      //查看指定域名的地域、人数、占比
      getDomainRegionDetails(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.dstip_domain_region_details,
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
      getData(val){
        let options = {
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end,
          stat_type: this.select
        }
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs
          this.currentPage = res.data.data.current_page
          this.total = res.data.data.total_count
        })
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
          stat_type: this.select
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
          this.currentPage = res.data.data.current_page
          this.total = res.data.data.total_count
        })
      },
      //查看用户详情
      user_details(data){
        this.user.row_data = data;
        this.user.currentPage = 1;
        let options = {
          domain: this.user.row_data.domain,
          start_at: this.filter.start,
          end_at: this.filter.end,
          stat_type: this.select,
          page: 1,
          limit: this.pageSize
        }
        if (options.start_at && options.end_at) {
          this.getUserDetails(options).then(res => {
            if (res.data.success) {
              this.user.visable = true
              let data = res.data.data;
              this.user.data = data.logs
              this.user.currentPage = data.current_page
              this.user.totalSize = data.total_count
            } else {
              this.$message({
                showClose: true,
                message: '查询失败',
                type: 'warning'
              });
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请先选择起始日期和结束日期',
            type: 'warning'
          });
        }

      },
      //查看用户详情-分页
      user_details_PageChange(val){
        this.user.currentPage = val;
        let options = {
          domain: this.user.row_data.domain,
          start_at: this.filter.start,
          end_at: this.filter.end,
          stat_type: this.select,
          page: val,
          limit: this.pageSize
        }
        if (options.start_at && options.end_at) {
          this.getUserDetails(options).then(res => {
            if (res.data.success) {
              this.user.visable = true
              let data = res.data.data;
              this.user.data = data.logs
              this.user.currentPage = data.current_page
              this.user.totalSize = data.total_count
            } else {
              this.$message({
                showClose: true,
                message: '查询失败',
                type: 'warning'
              });
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请先选择起始日期和结束日期',
            type: 'warning'
          });
        }
      },
      //查看访问次数详情
      count_details(data){
        this.count.row_data = data;
        let options = {
          domain: this.count.row_data.domain,
          start_at: this.filter.start,
          end_at: this.filter.end,
          stat_type: this.select,
          page: 1,
          limit: this.pageSize
        }
        if (options.start_at && options.end_at) {
          this.getCountDetails(options).then(res => {
            if (res.data.success) {
              this.count.visable = true
              let data = res.data.data;
              this.count.data = data.logs
              this.count.currentPage = data.current_page
              this.count.totalSize = data.total_count
            } else {
              this.$message({
                showClose: true,
                message: '查询失败',
                type: 'warning'
              });
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请先选择起始日期和结束日期',
            type: 'warning'
          });
        }
      },
      //查看访问次数-分页
      count_details_PageChange(val){
        let options = {
          domain: this.count.row_data.domain,
          start_at: this.filter.start,
          end_at: this.filter.end,
          stat_type: this.select,
          page: val,
          limit: this.pageSize
        }
        if (options.start_at && options.end_at) {
          this.getCountDetails(options).then(res => {
            if (res.data.success) {
              this.count.visable = true
              let data = res.data.data;
              this.count.data = data.logs
              this.count.currentPage = data.current_page
              this.count.totalSize = data.total_count
            } else {
              this.$message({
                showClose: true,
                message: '查询失败',
                type: 'warning'
              });
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请先选择起始日期和结束日期',
            type: 'warning'
          });
        }
      },
      handleCurrentChange(val){
        let options = {
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end,
          stat_type: this.select
        }
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs
          this.currentPage = res.data.data.current_page
          this.total = res.data.data.total_count
        })
      },
      //查看地域分析详情
      domain_details(data){
        this.domain.row_data = data;
        let options = {
          domain: this.domain.row_data.domain,
          page: 1,
          limit: this.pageSize
        }
        this.getDomainRegionDetails(options).then(res => {
          if (res.data.success) {
            this.domain.visable = true
            let data = res.data.data;
            this.domain.Country_data = data.logs
            this.getDomainCountryDetails(options).then(res => {
              this.draw(data.logs)
              this.domain.Region_data = res.data.data.logs;
            })
          } else {
            this.$message({
              showClose: true,
              message: '查询失败',
              type: 'warning'
            });
          }
        })
      }
    },
    mounted(){
      this.getData(1)
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

  .el-select {
    width: 200px;
  }

  .el-input {
    width: 200px;
  }

  #table .el-table_1_column_2 {
    padding: 0;
  }

  .edit {
    display: inline-block;
    border: transparent;
    width: 150px;
    height: 35px;
  }

  .el-input__inner {
    width: 150px;
  }
</style>

