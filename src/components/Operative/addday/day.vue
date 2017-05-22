<template>
  <div class="dstip">
    <div class="warp">
      <!--图表展示-->
      <el-row class="">
        <el-col :span="24">
          <span style="margin: 20px 0;display: inline-block"><i class="el-icon-menu" style="margin-right: 10px"></i>日新增数量</span>
          <div id="main" style="height: 300px;border: 1px solid #D3DCE6">

          </div>
        </el-col>
      </el-row>

      <template>
        <el-table
          :data="get_day.logs"
          border
          style="width: 100%;margin-top: 10px">
          <el-table-column
            prop="stat_date"
            label="时间">
          </el-table-column>
          <el-table-column
            label="日新增用户">
            <template scope="scope">
              <span  @click="num(scope.row)" class="dialog_num">{{scope.row.users_count}}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--分页-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="get_day.current_page"
        layout="total, prev, pager, next, jumper"
        :total="get_day.total_count"
        :page-size="pageSize"
        class="page">
      </el-pagination>

      <!--详情-->
      <el-dialog v-model="dialogVisible" title="日增详情" size="small">
        <el-table :data="get_day_detail.users" border style="text-align: center">
          <el-table-column property="username" label="账号名" width="150"></el-table-column>
          <el-table-column property="coins" label="注册时间点">
            <template scope="scope">
              {{scope.row.created_at | Time}}
            </template>
          </el-table-column>
          <el-table-column label="最后登录时间">
            <template scope="scope">{{scope.row.last_signin_at | Time}}</template>
          </el-table-column>
          <el-table-column property="last_signin_version" label="最后登录版本信息"></el-table-column>
          <el-table-column property="ip" label="用户IP"></el-table-column>
          <el-table-column label="IP解析">
            <template scope="scope">
              {{scope.row.ip_country+"-"+scope.row.ip_province+"-"+scope.row.ip_city}}
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer">
          <el-pagination
            @current-change="handleCurrentChange2"
            :current-page="get_day_detail.current_page"
            layout="total, prev, pager, next, jumper"
            :total="get_day_detail.total_count"
            :page-size="pageSize2"
            class="page">
          </el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { mapActions,mapGetters }  from 'vuex'
  export default{
    data:()=>({
      pageSize:10,
      pageSize2:15,
      dialogVisible:false,
      detail:{},
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
    }),
    computed:{
      ...mapGetters({
        get_day:'day_data',
        get_day_detail:'day_details_data'
      }),
    },
    watch:{
      get_day(){
          this.draw()
          return this.get_day
      }
    },
    methods:{
      ...mapActions({
        day:'ADDDAY_DAY',
        day_details:'ADDDAY_DAY_DETAILS'
      }),
      //表格数据
      AnalysisJSON(parm) {
        var result = []
        var keyList = { users_count: '日增数量'}
        var names = ['users_count']
        for(var i = 0; i < names.length; i++) {
          var data = []
          for(var j = 0; j < parm.length; j++) {
            data.push(parm[j][names[i]])
          }
          var item = { name: keyList[names[i]], data: data }
          result.push(item)
        }
        return result
      },
      //设置Y轴
      setXAxis(parm){
        var arry = []
        for(var i in parm) {
          arry.push(parm[i].stat_date);
        }
        return arry
      },
      handleCurrentChange(val){
        this.day({page:val,limit:this.pageSize})
      },
      handleCurrentChange2(val){
        this.day_details({page:val,limit:this.pageSize2,stat_date:this.detail.stat_date})
      },
      num(data){
          this.detail = data
          this.dialogVisible = true
          this.day_details({limit:this.pageSize2,stat_date:data.stat_date})
      },
      //绘图
      draw(){
        //设置数据
        this.options.series = this.AnalysisJSON(this.get_day.logs);
        //设置X轴
        this.options.xAxis.categories = this.setXAxis(this.get_day.logs)
        this.$HighCharts.chart('main',this.options);
      }

    },
    mounted(){
        this.day({limit:this.pageSize})
        this.draw();
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
