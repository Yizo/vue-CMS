<template>
  <div id="start">

    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'share' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>分享统计</el-breadcrumb-item>
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
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu"style="margin-right: 10px"></i>分享类型统计列表</span>
          <table class="t1">
            <tbody class="table">
            <tr>
              <th>分享类型</th>
              <th>分享人数</th>
              <th>分享次数</th>
              <th>人均分享</th>
            </tr>
            <tr v-for="(item,index) in tableData">
              <td>{{item.share_type}}</td>
              <td><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                        @click="details_users(index)">{{item.total_users}}</span></td>
              <td ><span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                         @click="details_times(index)">{{item.total_times}}</span></td>
              <td >{{item.per_average_share}}</td>
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
          <el-table-column property="username" label="账号名" width="150"></el-table-column>
          <el-table-column property="share_count" label="分享次数">
            <template scope="scope">
              <span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                @click="details_users_times({user_id:scope.row.user_id})">{{ scope.row.share_count}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer">
          <el-pagination
            @current-change="handleCurrentChange_sn"
            :current-page="currentPage"
            :page-size="10"
            :total="total"
            layout="prev,next"
            class="page">
          </el-pagination>
        </div>
      </el-dialog>
      <!--分享次数详情-->
      <el-dialog v-model="dialogTableVisible_nv">
        <h2 class="dh2">分享次数详情</span></h2>
        <el-table :data="dialogData_nv" style="text-align: center">
          <el-table-column property="username" label="账号名" width="150"></el-table-column>
          <el-table-column label="版本信息">
            <template scope="scope">
              <span>{{ scope.row.app_channel+"_"+scope.row.app_version+"_"+scope.row.app_version_number}}</span>
            </template>
          </el-table-column>
          <el-table-column property="created_at" label="分享时间点"></el-table-column>
        </el-table>
        <div slot="footer">
          <el-pagination
            @current-change="handleCurrentChange_nv"
            :current-page="currentPage"
            :page-size="10"
            :total="total"
            layout="prev,next"
            class="page">
          </el-pagination>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import { mapGetters,mapActions } from 'vuex'
  export default {
    data(){
      return {
        /*筛选*/
        filter:{
          versions:'',
          channels:'',
        },
        /*饼状图*/
        options:{
          title: {
            text:null
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
            name: '分享人数',
            data: [
              ['a',10],
              ['b',20],
              ['c',30],
              ['d',40]
            ]
          }],
          credits:false
        },
        options2:{
          title: {
            text:null
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
            name: '分享次数',
            data: [
              ['a',10],
              ['b',20],
              ['c',30],
              ['d',40]
            ]
          }],
          credits:false
        },
        /*列表*/
        tableData:[],

        /*弹窗*/
        dialogTableVisible_sn:false,
        dialogTableVisible_nv:false,
        dialogData_sn:[],//分享人数数据
        dialogData_nv:[],//分享次数数据
        pageInfo:{
          index:'',
          page:'',
          device_model:''
        },

        /*分页*/
        currentPage:1,
        total:1

      }
    },
    computed:{
      ...mapGetters(['versions'])
    },
    methods:{

      //时间戳
      Timestamp(row){

        if(row){
          const now = new Date(row*1000);
          var year=now.getFullYear();
          var month=now.getMonth()+1;
          var date=now.getDate();
          var hour=now.getHours();
          var minute=now.getMinutes();
          var second=now.getSeconds();

          return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
        }else{
          return false
        }

      },
      //图表数据转为数组
      line(json){
        var arr = [];
        for(var i = 0;i<json.length;i++){
          arr.push([json[i]['share_type'],parseFloat(json[i].total_users)])
        }
        return arr
      },
      line2(json){
        var arr = [];
        for(var i = 0;i<json.length;i++){
          arr.push([json[i]['share_type'],parseFloat(json[i].total_times)])
        }
        return arr
      },

      /*筛选*/
      valueChange(val){

        if(this.filter.channels == '全部渠道'){
          this.filter.channels = ''
        }
        if(this.filter.versions == '全部版本'){
          this.filter.versions = ''
        }

        this.getInfo({app_version:this.filter.versions,app_channel:this.filter.channels}).then( res => {
          this.tableData = res.data.data.items;
          this.options.series[0].data = this.line(res.data.data.items);
          this.options2.series[0].data = this.line2(res.data.data.items);
          this.$HighCharts.chart('main',this.options);
          this.$HighCharts.chart('main2',this.options2);
        })
      },

      /*列表*/
      //分享类型统计信息
      getInfo(parm){
        var p = new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.share_stat,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){

            if(res.status == 200){
              resolve(res)
            }else{
              reject(res)
            }

          })
        })
        return p;
      },

      /*弹窗*/
      /*查看分享人数*/
      details_users(index){
        this.dialogTableVisible_sn = true;
        this.pageInfo.index = index;
        var options = {
          page:1,
          type:index
        }
        this.getDetails_users(options).then(res=>{
          this.total = res.data.data.total_pages;
          this.dialogData_sn = res.data.data.logs;

        });
      },
      //分享人数中的分享次数
      details_users_times(parm){
        this.dialogTableVisible_nv = true;
        var options = {
          page:1,
          type:this.pageInfo.index,
          user_id:parm.user_id
        }
        this.getDetails_times(options).then(res=>{
          this.total = res.data.data.total_pages;
          this.dialogData_nv = res.data.data.logs;
        });
      },
      //分享人数详情
      getDetails_users(parm){
        return new Promise((resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.share_users_stat_details,
            headers: {'Authorization': token},
            params:parm,
          }).then(res => {
            if(res.status == 200){
                resolve(res)
            }
          }).catch(err => {
              reject(err)
          })
        })
      },
      /*查看分享次数*/
      details_times(index){
        this.dialogTableVisible_nv = true;
        this.pageInfo.index = index;
        console.log(index)
        var options = {
          page:1
        }
        this.getDetails_times(options).then(res=>{
          this.total = res.data.data.total_pages;
          this.dialogData_sn = res.data.data.logs;
        }).catch(err=>{
            console.log(err)
        })
      },
      //分享次数详情
      getDetails_times(parm){
        return new Promise((resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.share_count_stat_details,
            headers: {'Authorization': token},
            params:{
              type:this.pageInfo.index,
              limit:10,
              page:parm.page
            },
          }).then(res => {
            if(res.status == 200){
              resolve(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      /*分页*/
      //分享人数详情分页
      handleCurrentChange_sn(val){
        this.currentPage = val;
        this.getDetails_users({page:val})
      },
      //分享次数详情分页
      handleCurrentChange_nv(val){
        this.currentPage = val;
        this.getDetails_times({page:val})
      }

    },
    mounted(){
      //绘制图形
      this.getInfo().then( res => {
        this.tableData = res.data.data.items;
        this.options.series[0].data = this.line(res.data.data.items);
        this.options2.series[0].data = this.line2(res.data.data.items);
        this.$HighCharts.chart('main',this.options);
        this.$HighCharts.chart('main2',this.options2);
      })
    },
  }
</script>

<style scope>
  #start{
    padding: 10px;
  }
  /*导航*/
  #userInfo .breadcrumb{
    height: 30px;
    line-height: 30px;
  }
  .warp_filter{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px;
  }
  .dh2{
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 400;
  span{
    font-size: 16px;
    font-weight: 500;
  }
  }
</style>
