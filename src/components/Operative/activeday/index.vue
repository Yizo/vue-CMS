<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>运营行为</el-breadcrumb-item>
      <el-breadcrumb-item>活跃用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="本页面每天凌晨统计一次,当天的新内容将于第二天凌晨统计" style="margin-top: 10px;text-align: left">
    </el-alert>
    <!--筛选-->
    <el-row style="text-align: left;margin-top: 20px">
      <el-radio-group v-model="radio" style="margin-right: 10px" @change="typeChange">
        <el-radio-button label="日"></el-radio-button>
        <el-radio-button label="月"></el-radio-button>
      </el-radio-group>
      <div style="display: inline-block">
        <el-date-picker
          v-model="filter.start"
          :type="type"
          :placeholder="starValue"
          @change="start_date">
        </el-date-picker>
        <el-date-picker
          v-model="filter.end"
          :type="type"
          :placeholder="endValue"
          @change="end_date">
        </el-date-picker>
        <el-select v-model="filter.channels" placeholder="切换渠道">
          <el-option
            v-for="(item,index) in versions.app_channels"
            :label="item.name"
            :value="item.name" :key="index"
          >
          </el-option>
        </el-select>
        <el-select v-model="filter.versions" placeholder="版本筛选">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
      </div>
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
    </el-row>
    <!--视图-->
    <div class="warp">
      <div class="warp_col">
        <day class="c" :filter="filter"></day>
      </div>
      <div class="warp_col">
        <month class="c" :filter="filter"></month>
      </div>
    </div>
  </div>
</template>

<script>
  import day from './day.vue'
  import month from './month.vue'
  import * as JS from '../../../assets/js/js'
  import {mapActions, mapGetters}  from 'vuex'
  export default{
    data: () => ({
      radio: '日',
      type: 'date',
      starValue: '开始日期',
      endValue: '结束日期',
      filter: {
        start: '',
        end: '',
        versions: '',
        channels: ''
      },
      pageSize: 10
    }),
    components: {
      day, month
    },
    computed: {
      ...mapGetters(['versions', 'initDate']),
    },
    methods: {
      ...mapActions({
        day: 'ACTIVEDAY_DAY',
        month: 'ACTIVEDAY_MONTH',
        dayChart: 'ACTIVEDAY_DAY_CHART',
        monthChart: 'ACTIVEDAY_MONTH_CHART'
      }),
      starMonth (){
        let now = new Date()
        var year = now.getFullYear();
        var month = now.getMonth();

        if (month <= 9) {
          month = '0' + month
        }

        return year + '-' + month
      },
      endMonth (){
        let now = new Date()
        var year = now.getFullYear();
        var month = now.getMonth() + 1;

        if (month <= 9) {
          month = '0' + month
        }
        return year + '-' + month
      },
      typeChange(){
        if (this.radio == '日') {
          this.type = 'date'
          this.starValue = '开始日期'
          this.endValue = '结束日期'
          this.filter.start = JS.monthTime().start
          this.filter.end = JS.monthTime().end
        }
        if (this.radio == '月') {
          this.type = 'month'
          this.starValue = '开始月份'
          this.endValue = '结束结束'
          this.filter.start = this.starMonth()
          this.filter.end = this.endMonth()
        }
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
          this.filter.start = JS.month(this.filter.start)
        }
        if (typeof this.filter.end == 'object') {
          this.filter.end = JS.month(this.filter.end)
        }
        let options = {
          page: 1,
          limit: this.pageSize,
          app_version: this.filter.versions,
          app_channel: this.filter.channels,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        if (options.start_at && options.end_at || !options.start_at && !options.end_at) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        if (this.radio == '日') {
          this.dayChart(options);
          this.day(options);
        }
        if (this.radio == '月') {
          this.monthChart(options);
          this.month(options);
        }
      }
    },
    mounted(){
      this.filter.start = this.initDate.start;
      this.filter.end = this.initDate.end;
      this.filtration();
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

  .warp_col {
    width: 50%;
  }

  .el-select {
    width: 200px;
  }

  .el-input {
    width: 200px;
  }
</style>

