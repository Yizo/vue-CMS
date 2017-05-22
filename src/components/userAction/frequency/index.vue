<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>用户行为</el-breadcrumb-item>
      <el-breadcrumb-item>用户使用频率</el-breadcrumb-item>
    </el-breadcrumb>
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
              <td @click="detail(0)">{{data.count_1_2?data.count_1_2:0}}</td>
            </tr>
            <tr>
              <td>3-5次</td>
              <td @click="detail(1)">{{data.count_3_5?data.count_3_5:0}}</td>
            </tr>
            <tr>
              <td>6-9次</td>
              <td @click="detail(2)">{{data.count_6_9?data.count_6_9:0}}</td>
            </tr>
            <tr>
              <td>10-19次</td>
              <td @click="detail(3)">{{data.count_10_19?data.count_10_19:0}}</td>
            </tr>
            <tr>
              <td>20-49次</td>
              <td @click="detail(4)">{{data.count_20_49?data.count_20_49:0}}</td>
            </tr>
            <tr>
              <td>50次以上</td>
              <td @click="detail(5)">{{data.count_50?data.count_50:0}}</td>
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
          <tr  v-else v-for="item in dialog.data">
            <th>{{item.username}}</th>
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
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  export default{
    data:()=>({
      data:[],
      pagename:['1-2次','3-5次','6-9次','10-19次','20-49次','50次以上'],
      filter:{
        start:'',
        end:''
      },
      pageSize:15,
      /*折线图*/
      options:{
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
        credits:false
      },
      dialog:{
        visable:false,
        index:0,
        name:'1-2次',
        currentPage:1,
        total:0,
        data:[]
      },
    }),
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
            url:API.frequency_list,
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
      getDetails(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.frequency_details,
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
      getData(parm){
        return new Promise( (resolve,reject) => {
          this.getInfo(parm).then(res=>{
            this.data = res.data.data;
            resolve(res)
          })
        })
      },
      //表格数据
      AnalysisJSON(parm) {
        var arry = []
        if(parm.count_1_2 === null){
            arry.push(0)
        }else{
            arry.push(parm.count_1_2)
        }
        if(parm.count_3_5 === null){
          arry.push(0)
        }else{
          arry.push(parm.count_3_5)
        }
        if(parm.count_6_9 === null){
          arry.push(0)
        }else{
          arry.push(parm.count_6_9)
        }
        if(parm.count_10_19 === null){
          arry.push(0)
        }else{
          arry.push(parm.count_10_19)
        }
        if(parm.count_20_49 === null){
          arry.push(0)
        }else{
          arry.push(parm.count_20_49)
        }
        if(parm.count_50 === null){
          arry.push(0)
        }else{
          arry.push(parm.count_50)
        }

        return arry
      },
      //设置X轴
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
        this.options.series[0].data = this.AnalysisJSON(this.data);
        //设置X轴
        this.options.xAxis.categories = this.setXAxis(this.pagename)
        this.$HighCharts.chart('main',this.options);
      },
      //筛选
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(val){
        let options = {
          page:1,
          limit:this.pageSize,
          start_at:this.filter.start,
          end_at:this.filter.end
        }
        this.getData(options);
      },
      detail(index){
          this.dialog.visable = true;
          this.dialog.name = this.pagename[index];
          let options = {
            page:1,
            limit:this.pageSize,
            times_scope:this.pagename[index].replace('次',''),
            start_at:this.filter.start || '',
            end_at:this.filter.end || ''
          };
          this.getDetails(options).then(res=>{
              let data = res.data.data
             this.dialog.data = data.logs;
            this.dialog.currentPage = data.current_page;
            this.dialog.total = data.total_count;
          })
      },
      d_handleCurrentChange(val){

      }
    },
    mounted(){
      this.getData({page:1,limit:this.pageSize}).then(res=>{
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
    display: flex;
  }
  .table{
    margin-top: 52px;
  }
  .table td, .table th{
    width: 50%;
    margin: 5px;
  }
  .layout{
    flex: 0 0 50%;
  }
</style>
