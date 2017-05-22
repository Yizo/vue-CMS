<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>用户行为</el-breadcrumb-item>
      <el-breadcrumb-item>页面点击</el-breadcrumb-item>
    </el-breadcrumb>
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
    <el-dialog :title="dialog.name" v-model="dialog.visable">
      <el-table :data="dialog.data">
        <el-table-column property="username" label="账号名"></el-table-column>
        <el-table-column label="点击时间">
          <template scope="scope">{{scope.row.created_at | Time}}</template>
        </el-table-column>
        <el-table-column label="版本信息">
          <template scope="scope">{{scope.row.ip_country}}_{{scope.row.ip_province}}_{{scope.row.ip_city}}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="d_handleSizeChange1"
        :current-page="d_currentPage"
        :page-size="d_pageSize"
        layout="total, prev, pager, next, jumper"
        :total="d_totalSize"
        class="page">
      </el-pagination>
    </el-dialog>
    <!--弹窗-点击人数-->
    <el-dialog :title="dialog2.name" v-model="dialog2.visable" size="tiny">
      <table class="table">
        <tbody>
        <tr style="background-color: #EEF1F6">
          <th>账号名</th>
        </tr>
        <tr v-if="dialog2.data == ''">
          <th style="padding: 10px 0">暂无数据</th>
        </tr>
        <tr  v-else v-for="item in dialog2.data">
          <th>{{item.username}}</th>
        </tr>
        </tbody>
      </table>
      <el-pagination
        @current-change="d_handleSizeChange2"
        :current-page="d_currentPage"
        :page-size="d_pageSize"
        layout="total, prev, pager, next, jumper"
        :total="d_totalSize"
        class="page">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  export default{
    components:{},
    props:{
      contList:{
        type:Boolean,
        default:true
      }
    },
    data(){
      return {
        filter:{
          start:'',
          end:''
        },
        data:[],
        date_list:[],
        logs:[],
        pageSize:15,
        /*折线图*/
        options:{
          title:{
            text:null
          },
          xAxis: {
            title:{
              text:''
            },
            categories: []
          },
          yAxis: {
            title:{
              text:''
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
          credits:false
        },
        d_currentPage:1,
        d_pageSize:15,
        d_totalSize:0,
        curentInfo:{},//分页信息
        dialog:{
          visable:false,
          name:'点击次数',
          data:[],
        },
        dialog2:{
          visable:false,
          name:'点击人数',
          data:[]
        }
      }
    },
    watch:{
      data(){
        this.draw()
      }
    },
    methods:{
      getInfo(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.pageclick_list,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){
            if(res.status == 200){
              resolve(res)
            }
          }).catch(function(err){
            reject(err)
          })
        })
      },
      get_visit_details(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.pageclick_visit_details,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){
            if(res.status == 200){
              resolve(res)
            }
          }).catch(function(err){
            reject(err)
          })
        })
      },
      get_user_details(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.pageclick_user_details,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){
            if(res.status == 200){
              resolve(res)
            }
          }).catch(function(err){
            reject(err)
          })
        })
      },
      getData(options){
        return new Promise( (resolve,reject) => {
          this.getInfo(options).then(res=>{
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
        if(a===0||b===0){
          return '0'
        }else{
          return (Math.round((a / b) * 10 )/10);
        }
      },
      //表格数据
      AnalysisJSON(parm) {
        var result = []
        for(var i in parm){
            result.push({name:i,data:parm[i]})
        }
        return result
      },
      //设置Y轴
      setXAxis(parm){
        var arry = []
        for(var i in parm) {
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
        this.$HighCharts.chart('main',this.options);
      },
      //筛选
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(){
        let options = {
          page:1,
          limit:this.pageSize,
          start_at:this.filter.start,
          end_at:this.filter.end
        }
        this.getData(options);
      },
      //点击次数详情
      visits_detail(data){
          let is = this.filter.start && this.filter.end
        if(is){
          this.curentInfo = data
          let options = {
            page:1,
            limit:this.d_pageSize,
            start_at:this.filter.start,
            end_at:this.filter.end,
            interface_id:data.interface_id
          }
          this.dialog.visable = true
          this.get_visit_details(options).then(res=>{
            this.dialog.data = res.data.data.logs
            this.d_currentPage = res.data.data.current_page
            this.d_totalSize = res.data.data.total_count
          })
        }else{
          this.$message({
            message: '请选择开始,结束日期',
            type: 'warning'
          });
        }
      },
      d_handleSizeChange1(val){
        let options = {
          page:val,
          limit:this.d_pageSize,
          start_at:this.filter.start || null,
          end_at:this.filter.end || null,
          interface_id:this.curentInfo.interface_id
        }
        this.get_visit_details(options).then(res=>{
          this.dialog.data = res.data.data.logs
          this.d_currentPage = res.data.data.current_page
          this.d_totalSize = res.data.data.total_count
        })
      },
      //点击人数详情
      users_detail(data){
        let is = this.filter.start && this.filter.end
        if(is){
          this.curentInfo = data
          let options = {
            page:1,
            limit:this.d_pageSize,
            start_at:this.filter.start || null,
            end_at:this.filter.end || null,
            interface_id:data.interface_id
          }
          this.dialog2.visable = true
          this.get_user_details(options).then(res=>{
            this.dialog2.data = res.data.data.logs
            this.d_currentPage = res.data.data.current_page
            this.d_totalSize = res.data.data.total_count
          })
        }else{
          this.$message({
            message: '请选择开始,结束日期',
            type: 'warning'
          });
        }

      },
      d_handleSizeChange2(val){
        let options = {
          page:val,
          limit:this.d_pageSize,
          start_at:this.filter.start,
          end_at:this.filter.end,
          interface_id:this.curentInfo.interface_id
        }
        this.get_user_details(options).then(res=>{
          this.dialog2.data = res.data.data.logs
          this.d_currentPage = res.data.data.current_page
          this.d_totalSize = res.data.data.total_count
        })
      },

    },
    mounted(){
        this.getData().then(res=>{
          this.draw()
        })

    }
  }
</script>

<style scoped>
  .dstip{
    padding: 10px;
  }
  .warp{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px;
  }
  .page{
    text-align: right;
    margin-top: 20px;
  }
</style>

