<template>
  <div id="hardware">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'hardware' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>硬件统计</el-breadcrumb-item>
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
      <el-row :gutter="20">
        <el-col :span="12">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>硬件统计饼图</span>
          <div id="main" style="width: 99%;height: 500px;border: 1px solid #D3DCE6">

          </div>
        </el-col>
        <el-col :span="12">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>硬件统计列表</span>
          <table class="t1">
            <tbody class="table">
            <tr>
              <th>机型</th>
              <th>系统</th>
              <th>数量</th>
              <th>占比</th>
            </tr>
            <tr v-for="(item,index) in tableData">
              <td>{{item.device_model}}</td>
              <td>{{item.platform}}</td>
              <td><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                        @click="detail(index,item)">{{item.total}}</span></td>
              <td>{{item.percent}}</td>
            </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
    </div>

    <!--数量弹窗-->
    <el-dialog v-model="dialogTableVisible">
      <h2 class="dh2">硬件信息详情:<span v-text="pageInfo.device_model"></span></h2>
      <el-table :data="dialogData" style="text-align: center">
        <el-table-column property="username" label="账号" width="150"></el-table-column>
        <el-table-column label="登录时间" width="200">
          <template scope="scope">
            <span>{{ Timestamp(scope.row.last_signin_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column property="ip" label="用户IP"></el-table-column>
        <el-table-column property="address" label="IP解析"></el-table-column>
      </el-table>
      <div slot="footer">
        <!--分页-->
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
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  export default {
    data() {
      return {
        //组件数据
        pageInfo: {
          index: '',//当前行索引
          page: '',
          device_model: ''
        },
        //饼状图
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
            name: '机型占比',
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
        filter: {
          versions: '',
          channels: '',
        },
        tableData: [],
        //弹窗
        dialogTableVisible: false,
        dialogData: [],
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
        const now = new Date(row * 1000);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();

        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      },
      //获取硬件统计信息
      gethardware(parm){
        var p = new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.hardware_stat,
            headers: {'Authorization': token},
            params: {
              app_version: parm.app_version || null,
              app_channel: parm.app_channel || null,
            },
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
      //硬件信息详情
      getDatails(parm){
        var p = new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.hardware_stat_details,
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
      detail(index, val){
        this.val = val
        var options = {
          device_model: val.device_model,
          platform: val.platform,
          page: 1,
          limit: this.pageSize
        }
        this.dialogTableVisible = true
        this.getDatails(options).then(res => {
          var data = res.data.data;
          this.dialogData = data.users;
          this.currentPage = data.current_page;
          this.totalSize = data.total_count
        })
      },
      //硬件详情分页
      handleCurrentChange(val){
        this.currentPage = val;
        var options = {
          device_model: this.val.device_model,
          platform: this.val.platform,
          page: val,
          limit: this.pageSize
        }
        this.getDatails(options).then(res => {
          var data = res.data.data;
          this.dialogData = data.users;
          this.currentPage = data.current_page;
          this.totalSize = data.total_count
        })
      },
      //图表数据转为数组
      line(json){
        var arr = [];
        for (var i = 0; i < json.length; i++) {
          arr.push([json[i]['device_model'], parseFloat(json[i].percent)])
        }
        return arr
      },
      //筛选
      valueChange(val){

        if (this.filter.channels == '全部渠道') {
          this.filter.channels = ''
        }
        if (this.filter.versions == '全部版本') {
          this.filter.versions = ''
        }

        this.gethardware({app_version: this.filter.versions, app_channel: this.filter.channels}).then(res => {
          this.tableData = res.data.data.items;
          this.options.series[0].data = this.line(res.data.data.items);
          this.$HighCharts.chart('main', this.options);
        })
      }
    },
    mounted(){
      //绘制图形
      this.gethardware({app_version: null, app_channel: null}).then(res => {
        this.tableData = res.data.data.items;
        this.options.series[0].data = this.line(res.data.data.items);
        this.$HighCharts.chart('main', this.options);
      })
    }
  }
</script>

<style scope>
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
</style>

