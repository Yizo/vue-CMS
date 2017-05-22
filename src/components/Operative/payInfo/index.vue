<template>
  <div class="payInfo">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>充值信息</el-breadcrumb-item>
      <el-breadcrumb-item>付费信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--筛选-->
    <filter-time @change="change"></filter-time>
    <!--汇总图-->
    <smy></smy>
    <!--充值详情-->
    <detail></detail>
  </div>
</template>

<script>
import { mapActions,mapGetters }  from 'vuex'
import payInfo from './payInfo.vue'
import detail from './detail.vue'
import filterTime from './filter.vue'
import smy from './summary.vue'

export default {
    components:{
      payInfo,detail,filterTime,smy
    },
    data(){
        return {
          tableData:[],
        }
    },
    computed:{
      ...mapGetters(['time']),
    },
    methods:{
      ...mapActions({
        pay_details:'PAYINFO_pay_details',
        coins_details:'PAYINFO_consume_coins_details'
      }),
      change(){
        this.pay_details({
          year:this.time.year,
          month:this.time.month,
          limit:15
        })
        this.coins_details({
          year:this.time.year,
          month:this.time.month
        });
      }
    },
    mounted(){

    }
}
</script>

<style scoped>
  .payInfo{
    padding: 10px;
  }
  .warp_filter{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px;
  }
</style>
