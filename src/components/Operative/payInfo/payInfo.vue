<template>
  <div class="warp">
    <table class="table">
      <caption align="top" class="header">
        <span>付费信息</span>
      </caption>
      <tbody>
      <tr>
        <th>项目</th>
        <th>人数</th>
        <th>占比</th>
        <th>描述</th>
        <th>充值总金额</th>
      </tr>
      <tr>
        <td>总用户</td>
        <td>{{ff_data.users_count}}</td>
        <td>100%</td>
        <td>账号总数</td>
        <td rowspan="3">{{tra}}(元)</td>
      </tr>
      <tr>
        <td>充值用户</td>
        <td>{{ff_data.recharge_users_count}}</td>
        <td>{{ruc}}</td>
        <td>有过充值行为的用户</td>
      </tr>
      <tr>
        <td>非充值用户</td>
        <td>{{ff_data.unrecharge_users_count}}</td>
        <td>{{uuc}}</td>
        <td>没有过充值行为的用户</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapActions,mapGetters }  from 'vuex'
  import * as JS from '../../../assets/js/js'
  export default {
    data(){
      return {

      }
    },
    methods:{

    },
    computed:{
      ...mapGetters(['ff_data']),
      ruc(){
        return  (Math.round(this.ff_data.recharge_users_count / this.ff_data.users_count * 10000) / 100.00 + "%");
      },
      uuc(){
        return  (Math.round(this.ff_data.unrecharge_users_count / this.ff_data.users_count * 10000) / 100.00 + "%");
      },
      tra(){
          return JS.format_number(this.ff_data.total_recharge_amount);
      }
    },
    mounted(){
      this.$store.dispatch('PAYINFO_ffInfo');
    }
  }
</script>

<style scoped>
  .warp{
    padding: 10px;
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #f5f5f5;
    box-shadow: 0 0 2px 1px #ddd;
    margin-top: 20px;
  }
  .header{
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border: 1px solid #cad9ea;
    background-color: #EFF4F9;
    border-bottom: transparent;
  }
  .header span{
    display: block;
    width: 20%;
    margin-left: 10px;
  }
</style>
