<template>
  <div id="start">

    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'share' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>分享统计</el-breadcrumb-item>
    </el-breadcrumb>

    <!--筛选-->
    <div class="warp_filter">
      <el-alert
        title="数据说明"
        type="info"
        description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计" style="margin-bottom: 10px">
      </el-alert>
      <template>
        <el-select v-model="filter.channels" placeholder="切换渠道" @change="valueChange" style="width: 200px;">
          <el-option
            v-for="(item,index) in versions.app_channels"
            :label="item.name"
            :value="item.name" :key="index"
          >
          </el-option>
        </el-select>
      </template>
      <template>
        <el-select v-model="filter.versions" placeholder="版本筛选" @change="valueChange" style="width: 200px;">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
      </template>
      <!--展示-->
      <!--饼图-->
      <el-row :gutter="20" class="">
        <el-col :span="12">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>分享人数统计饼图</span>
          <div id="main" style="width: 99%;height: 500px;border: 1px solid #D3DCE6">

          </div>
        </el-col>
        <el-col :span="12">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>分享次数统计饼图</span>
          <div id="main2" style="width: 99%;height: 500px;border: 1px solid #D3DCE6">

          </div>
        </el-col>
      </el-row>

      <!--表格-->
      <el-row>
        <el-col :span="24">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>分享类型统计列表</span>
          <table class="t1">
            <tbody class="table">
            <tr>
              <th>分享类型</th>
              <th>分享人数</th>
              <th>分享次数</th>
              <th>人均分享</th>
            </tr>
            <tr v-for="(item,index) in tableData" v-if="index < 50">
              <td>{{item.share_type}}</td>
              <td><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                        @click="details_users(index,item)">{{item.total_users}}</span></td>
              <td><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                        @click="details_times(index,item)">{{item.total_times}}</span></td>
              <td>{{item.per_average_share}}</td>
            </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>

      <!--数量弹窗-->
      <!--分享人数详情-->
      <el-dialog v-model="dialogTableVisible_sn">
        <h2 class="dh2">分享人数详情</span></h2>
        <el-table :data="dialogData_sn" style="text-align: center">
          <el-table-column label="账号名" width="150">
            <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column property="share_count" label="分享次数">
            <template scope="scope">
              <span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                    @click="details_users_times({user_id:scope.row.user_id})">{{ scope.row.share_count}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer">
          <el-pagination
            @current-change="user"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalSize"
            layout="total, prev, pager, next, jumper"
            class="page">
          </el-pagination>
        </div>
      </el-dialog>
      <!--分享次数详情-->
      <el-dialog v-model="dialogTableVisible_nv">
        <h2 class="dh2">分享次数详情</span></h2>
        <el-table :data="dialogData_nv" style="text-align: center">
          <el-table-column label="账号名" width="150">
            <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column label="版本信息">
            <template scope="scope">
              <span>{{ scope.row.app_channel+"_"+scope.row.app_version+"_"+scope.row.app_version_number}}</span>
            </template>
          </el-table-column>
          <el-table-column label="分享时间点">
            <template scope="scope">
              <span>{{scope.row.created_at | Time}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer">
          <el-pagination
            @current-change="count"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalSize"
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
  import userDetail from '../../publicView/accoutInfo/index.vue'
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
              },
              showInLegend: true
            }
          },
          series: [{
            type: 'pie',
            name: '分享人数',
            data: [
              ['a', 10],
              ['b', 20],
              ['c', 30],
              ['d', 40]
            ]
          }],
          credits: false
        },
        options2: {
          title: {
            text: null
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
            name: '分享次数',
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
        dialogTableVisible_sn: false,
        dialogTableVisible_nv: false,
        dialogData_sn: [],//分享人数数据
        dialogData_nv: [],//分享次数数据
        pageInfo: {
          index: '',
          user_id: 0,
          type: false, //true：正常的点击次数,false表示点击人数中的点击次数
          id: 0,
          page: '',
          device_model: ''
        },

        /*分页*/
        currentPage: 1,
        totalSize: 0,
        pageSize: 15,
        dialogVisible: false,
        username: '姓名'

      }
    },
    computed: {
      ...mapGetters(['versions'])
    },
    components: {
      userDetail
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
      //图表数据转为数组
      line(json){
        var arr = [];
        for (var i = 0; i < json.length; i++) {
          if (i < 50) {
            arr.push([json[i]['share_type'], parseFloat(json[i].total_users)])
          }
        }
        return arr
      },
      line2(json){
        var arr = [];
        for (var i = 0; i < json.length; i++) {
          arr.push([json[i]['share_type'], parseFloat(json[i].total_times)])
        }
        return arr
      },

      /*筛选*/
      valueChange(val){
        this.getInfo({app_version: this.filter.versions, app_channel: this.filter.channels}).then(res => {
          this.tableData = res.data.data.items;
          this.options.series[0].data = this.line(res.data.data.items);
          this.options2.series[0].data = this.line2(res.data.data.items);
          this.$HighCharts.chart('main', this.options);
          this.$HighCharts.chart('main2', this.options2);
        })
      },

      /*列表*/
      //分享类型统计信息
      getInfo(parm){
        var p = new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.share_stat,
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

      /*弹窗*/
      /*查看分享人数*/
      details_users(index, item){
        this.dialogTableVisible_sn = true;
        this.pageInfo.index = index;
        this.pageInfo.id = item.share_type_id,
          this.currentPage = 1
        var options = {
          page: 1,
          type: item.share_type_id,
          limit: this.pageSize,
          app_version: this.filter.versions,
          app_channel: this.filter.channels
        }
        this.getDetails_users(options).then(res => {
          let data = res.data.data
          this.dialogData_sn = data.logs;
          this.currentPage = data.current_page;
          this.totalSize = data.total_count
        });
      },
      //分享人数中的分享次数
      details_users_times(parm){
        this.dialogTableVisible_nv = true;
        this.pageInfo.user_id = parm.user_id;
        this.pageInfo.type = false,
          this.currentPage = 1
        this.getDetails_times({
          page: 1,
          type: this.pageInfo.id,
          limit: this.pageSize,
          user_id: parm.user_id,
          app_version: this.filter.versions,
          app_channel: this.filter.channels
        }).then(res => {
          let data = res.data.data;
          this.dialogData_nv = data.logs;
          this.currentPage = data.current_page;
          this.totalSize = data.total_count
        });
      },
      //分享人数详情
      getDetails_users(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.share_users_stat_details,
            headers: {'Authorization': token},
            params: parm,
          }).then(res => {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /*查看分享次数*/
      details_times(index, data){
        this.dialogTableVisible_nv = true;
        this.pageInfo.index = index;
        this.pageInfo.id = data.share_type_id;
        this.pageInfo.type = true;
        this.currentPage = 1
        var options = {
          type: this.pageInfo.id,
          page: 1,
          limit: this.pageSize,
          app_version: this.filter.versions,
          app_channel: this.filter.channels
        }
        this.getDetails_times(options).then(res => {
          let data = res.data.data
          this.dialogData_nv = data.logs;
          this.currentPage = data.current_page;
          this.totalSize = data.total_count
        }).catch(err => {
          console.log(err)
        })
      },
      //分享次数详情
      getDetails_times(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.share_count_stat_details,
            headers: {'Authorization': token},
            params: parm,
          }).then(res => {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /*分页*/
      //分享人数详情分页
      user(val){
        var options = {
          page: val,
          type: this.pageInfo.id,
          limit: this.pageSize,
          app_version: this.filter.versions,
          app_channel: this.filter.channels
        }
        this.getDetails_users(options).then(res => {
          let data = res.data.data
          this.dialogData_sn = data.logs;
        });
      },
      //分享次数详情分页
      count(val){
        let options = null;
        if (this.pageInfo.type) {
          options = {
            type: this.pageInfo.id,
            page: val,
            limit: this.pageSize,
            app_version: this.filter.versions,
            app_channel: this.filter.channels
          }
        } else {
          options = {
            type: this.pageInfo.id,
            page: val,
            limit: this.pageSize,
            user_id: this.pageInfo.user_id,
            app_version: this.filter.versions,
            app_channel: this.filter.channels
          }
        }
        this.getDetails_times(options).then(res => {
          let data = res.data.data
          this.dialogData_nv = data.logs;
        })
      },
    },
    mounted(){
      //绘制图形
      this.getInfo().then(res => {
        this.tableData = res.data.data.items;
        this.options.series[0].data = this.line(res.data.data.items);
        this.options2.series[0].data = this.line2(res.data.data.items);
        this.$HighCharts.chart('main', this.options);
        this.$HighCharts.chart('main2', this.options2);
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
  .el-select {
    width: 200px;
  }
</style>
