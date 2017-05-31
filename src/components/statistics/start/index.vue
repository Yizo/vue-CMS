<template>
  <div id="start">

    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'start' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>用户状态统计</el-breadcrumb-item>
    </el-breadcrumb>

    <!--筛选-->
    <div class="warp_filter">
      <template>
        <el-select v-model="filter.versions" placeholder="版本筛选" @change="valueChange">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
      </template>
      <template>
        <el-select v-model="filter.channels" placeholder="切换渠道" @change="valueChange">
          <el-option
            v-for="(item,index) in versions.app_channels"
            :label="item.name"
            :value="item.name" :key="index"
          >
          </el-option>
        </el-select>
      </template>

      <!--展示-->
      <el-row :gutter="20" class="">
        <el-col :span="12">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>用户状态统计饼图</span>
          <div id="main" style="width: 99%;height: 500px;border: 1px solid #D3DCE6">

          </div>
        </el-col>
        <el-col :span="12">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>用户状态统计列表</span>
          <table class="t1">
            <tbody class="table">
            <tr>
              <th>用户状态</th>
              <th>数量</th>
              <th>占比</th>
            </tr>
            <tr v-for="(item,index) in tableData">
              <td>{{item.is_enabled}}</td>
              <td><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                        @click="details(item)">{{item.total}}</span></td>
              <td>{{item.percent}}</td>
            </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>

      <!--数量弹窗-->
      <el-dialog v-model="dialogTableVisible">
        <h2 class="dh2">用户状态详情:<span v-text="pageInfo.device_model"></span></h2>
        <el-table :data="dialogData" style="text-align: center">
          <el-table-column property="username" label="被封账号" width="150"></el-table-column>
          <el-table-column property="admin_username" label="封号人"></el-table-column>
          <el-table-column label="封号时间" property="created_at" width="200"></el-table-column>
        </el-table>
        <div slot="footer">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalSize"
            class="page">
          </el-pagination>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data(){
      return {
        /*筛选*/
        filter: {
          versions: '',
          channels: '',
        },
        /*饼状图*/
        options: {
          title: {
            text: null
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
            name: '用户状态',
            data: [
              ['a', 10],
              ['b', 20],
              ['c', 30],
              ['d', 40]
            ]
          }],
          credits: false
        },
        /*列表*/
        tableData: [],

        /*弹窗*/
        dialogTableVisible: false,
        dialogData: [],
        pageInfo: {
          is: '',
          page: '',
          device_model: ''
        },

        /*分页*/
        val: {},
        currentPage: 1,
        totalSize: 0,
        pageSize: 15

      }
    },
    computed: {
      ...mapGetters(['versions']),
    },
    methods: {

      //时间戳
      Timestamp(row){

        if (row) {
          const now = new Date(row * 1000);
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var minute = now.getMinutes();
          var second = now.getSeconds();

          return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        } else {
          return false
        }

      },
      //图表数据转为数组
      line(json){
        var arr = [];
        for (var i = 0; i < json.length; i++) {
          if (json[i]['is_enabled'] == true) {
            json[i]['is_enabled'] = '正常'
          } else {
            json[i]['is_enabled'] = '封号'
          }
          arr.push([json[i]['is_enabled'], parseFloat(json[i].percent)])
        }
        return arr
      },

      /*筛选*/
      valueChange(){
        if (this.filter.channels == '全部渠道') {
          this.filter.channels = ''
        }
        if (this.filter.versions == '全部版本') {
          this.filter.versions = ''
        }

        this.getInfo({app_version: this.filter.versions, app_channel: this.filter.channels}).then(res => {
          this.tableData = res.data.data.items;
          this.options.series[0].data = this.line(res.data.data.items);
          this.$HighCharts.chart('main', this.options);
        })
      },

      /*列表*/
      //获取用户状态统计信息
      getInfo(parm){
        var p = new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.status_stat,
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
      //过滤用户状态
      filterStar(data){
        return data == true ? '正常' : '封号';
      },

      /*弹窗*/
      /*查看详情*/
      details(is){
        this.pageInfo.is = is;
        var options = {
          page: 1
        }
        this.getDetails(options);
      },
      //获取统计详情
      getDetails(parm){
        this.dialogTableVisible = true;
        let is = this.pageInfo.is;

        if (is) {
          is = 1
        } else {
          is = 0
        }
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        this.$http({
          method: 'GET',
          url: API.status_stat_details,
          headers: {'Authorization': token},
          params: {
            is_enabled: is,
            limit: this.pageSize,
            page: parm.page
          },
        }).then(res => {
          if (res.status == 200) {
            let data = res.data.data
            this.dialogData = data.users;
            this.currentPage = data.current_page;
            this.totalSize = data.total_count
          }
        })
      },

      /*分页*/
      handleCurrentChange(val){
        this.currentPage = val;
        this.getDetails({page: val, limit: this.pageSize})
      }

    },
    mounted(){
      //绘制图形
      this.getInfo().then(res => {
        this.tableData = res.data.data.items;
        this.options.series[0].data = this.line(res.data.data.items);
        this.$HighCharts.chart('main', this.options);
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
  .el-select{
    width: 200px;
  }
  .el-input{
    width: 200px;
  }
</style>
