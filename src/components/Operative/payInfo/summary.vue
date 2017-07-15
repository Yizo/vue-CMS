<template>
  <div class="smy">
    <div class="smy1">
      <div class="warp">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>充值金额汇总</span>
          </div>
          <div class="text item">
            <p>
              {{s_data.data.total_recharge_amount_today}}/{{s_data.data.total_recharge_amount_month}}/{{s_data.data.total_recharge_amount_year}}
            </p>
            <p>今日充值金额/本月充值金额/本年充值金额</p>
          </div>
        </el-card>
      </div>
      <div class="warp">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>充值人数汇总</span>
          </div>
          <div class="text item">
            <p>
              {{s_data.data.total_recharge_users_count_today}}/{{s_data.data.total_recharge_users_count_month}}/{{s_data.data.total_recharge_users_count_year}}
            </p>
            <p>今日充值总人数/本月充值总人数/本年充值总人数</p>
          </div>
        </el-card>
      </div>
      <div class="warp">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>消费汇总</span>
          </div>
          <div class="text item">
            <p>
              {{s_data.data.total_consume_coins_today}}/{{s_data.data.total_consume_coins_month}}/{{s_data.data.total_consume_coins_year}}
            </p>
            <p>今日消费钻石/本月消费钻石/本年消费钻石</p>
          </div>
        </el-card>
      </div>
      <div class="warp">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <p>ARUP值<span style="font-size:10px;color: #333">(ARUP = 当月充值总数 / 当月充值人数)</span></p>
          </div>
          <div class="text item">
            <p style="padding: 8px 0;">
              {{s_data.data.total_recharge_amount_month/s_data.data.total_recharge_users_count_month |
              zero | format_number}}(元)</p>
          </div>
        </el-card>
      </div>
    </div>
    <pay-info></pay-info>
    <div class="smy2">
      <div id="main" style="height: 500px;">

      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters}  from 'vuex'
  import * as JS from '../../../assets/js/js'
  import * as API from '../../../api/api'
  import payInfo from './payInfo.vue'
  export default {
    components: {
      payInfo
    },
    data(){
      return {
        /*折线图*/
        options: {
          title: {
            text: null
          },
          xAxis: {
            categories: []
          },
          yAxis: {
            title: {
              text: null
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            valueSuffix: null
          },
          series: [],
          credits: false
        },
      }
    },
    watch: {
      charData(newData){
        this.options.series = [...this.AnalysisJSON(newData.data.logs)]
        this.options.xAxis.categories = [...this.setXAxis(newData.data.logs)]
        this.$HighCharts.chart('main', this.options)
      },
    },
    computed: {
      ...mapGetters({
        s_data: 'summary_data',
        pdData: 'pay_details_data',
        time: 'time',
        charData: 'payInfo_pay_chart'
      })
    },
    methods: {
      ...mapActions({
        consume: 'PAYINFO_consume_coins_details',
        details: 'PAYINFO_pay_details',
        chart: 'PAYINFO_pay_char'
      }),
      AnalysisJSON(parm) {
        var result = []
        var keyList = {total_recharge_amount: '充值金额总数', total_consume_coins: '消费钻石总数', recharge_users_count: '充值总人数'}
        var names = ['total_recharge_amount', 'total_consume_coins', 'recharge_users_count']
        for (var i = 0; i < names.length; i++) {
          var data = []
          for (var j = 0; j < parm.length; j++) {
            data.push(parseInt(parm[j][names[i]]))
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
          let list = parm[i].stat_year + '-' + parm[i].stat_month;
          arry.push(parm[i].stat_date || list);
        }
        return arry
      },
    },
    mounted(){
      let options = {
        year: new Date().getFullYear(),
        month: null,
        limit: 15,
        page: 1
      }
      this.consume();
      this.details({page: 1, limit: 15});
      this.chart(options).then(res => {
        this.options.series = [...this.AnalysisJSON(res.data.data.logs)]
        this.options.xAxis.categories = [...this.setXAxis(res.data.data.logs)]
        this.$HighCharts.chart('main', this.options)
      });
    }
  }
</script>

<style scoped>
  .smy1, .smy2 {
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 20px;
  }

  .smy2 {
    padding: 10px;
    background-color: #fff;
  }

  .warp {
    flex: 0 0 25%;
  }

  .box-card {
    width: calc(100% - 10px);
  }

  .smy2 > div {
    width: calc(100% - 10px);
  }
</style>

