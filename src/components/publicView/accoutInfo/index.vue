<template>
  <div class="userInfo">
    <el-dialog v-model="visab" size="small" @close="closeDialog" top="5%" custom-class="dialog_w">
      <div slot="title" class="title">
        <b>账号:</b><span>{{name}}&nbsp;&nbsp;</span>
        <div v-if="type==4" style="display: inline-block">
          <b>充值总额:</b><span style="color: red">{{rechargeInfo.total_payment_amount}}</span>
        </div>
        <div v-if="type == 5" style="display: inline-block">
          <b>消费总额:</b><span style="color: red">{{consumeInfo.consump_coins?consumeInfo.consump_coins:'0'}}</span>
        </div>
      </div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basis" id="0">
          <basis></basis>
        </el-tab-pane>

        <el-tab-pane label="连接信息" name="link" id="1">
          <join></join>
        </el-tab-pane>

        <el-tab-pane label="用户去向" name="go" id="2">
          <go></go>
        </el-tab-pane>

        <el-tab-pane label="操作路径" name="path" id="3">
          <paths></paths>
        </el-tab-pane>

        <el-tab-pane label="充值信息" name="recharge" id="4">
          <recharge></recharge>
        </el-tab-pane>

        <el-tab-pane label="消费信息" name="consumption" id="5">
          <consumption></consumption>
        </el-tab-pane>

        <el-tab-pane label="信息管理" name="info" id="6">
          <info></info>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions, mapGetters}  from 'vuex'
  import basis from './basis.vue'
  import join from './join.vue'
  import relation from './relation.vue'
  import paths from './path.vue'
  import go from './go.vue'
  import recharge from './recharge.vue'
  import info from './info.vue'
  import consumption from  './consumption.vue'
  export default {
    props: {
      visab: {
        type: Boolean,
        default: false
      },
      name: {
        type: String,
        default: '账号'
      }
    },
    components: {
      basis, join, relation, paths, go, recharge, info, consumption
    },
    data(){
      return {
        activeName: 'basis',
        pageSize: 15,
        type: 0
      }
    },
    computed: {
      ...mapGetters({
        getId: 'getId',
        current: 'UD_current',
        rechargeInfo: 'UD_transaction_logs',
        consumeInfo: 'UD_consumption_logs',
        initDate: 'initDate'
      }),
      filter(){
        return this.initDate
      },
    },
    watch: {
      visab(){
        this.activeName = 'basis'
      }
    },
    methods: {
      ...mapActions({
        base: "UD_base_info",
        connection: "UD_connection_logs",
        devices: "UD_devices",
        operation: "UD_operation_logs",
        access: "UD_access_logs",
        transaction: "UD_transaction_logs",
        profile: "UD_profile",
        consumption: 'UD_consumption_logs'
      }),
      handleClick(tab) {
        var index = parseInt(tab.index);
        var id = window.sessionStorage.getItem('userId')
        if (index == 0) {
          this.type = 0
          this.base({id: id, limit: 10})
          this.devices({id: id});
        } else if (index == 1) {
          this.type = 1
          this.connection({id: id, limit: this.pageSize, start_at: this.filter.start, end_at: this.filter.end})
        } else if (index == 2) {
          this.type = 2
          this.access({id: id, limit: this.pageSize, start_at: this.filter.start, end_at: this.filter.end})
        } else if (index == 3) {
          this.type = 3
          this.operation({id: id, date: this.filter.end}).then(res => {
            this.$store.commit('u_current', {current: 1, pageSize: this.pageSize})
          })
        } else if (index == 4) {
          this.type = 4
          this.transaction({id: id, limit: 10, start_at: this.filter.start, end_at: this.filter.end})
        } else if (index == 5) {
          this.type = 5
          this.consumption({id: id, limit: this.pageSize, start_at: this.filter.start, end_at: this.filter.end});
        } else {
          this.type = 6
          this.profile({id: id, limit: this.pageSize})
        }
      },
      closeDialog(){
        this.$emit('closeDialog')
      }
    },
    mounted(){
      this.activeName = 'basis'
    }
  }
</script>

<style scoped>
  @media screen and (max-width: 960px) {
    .info_dialog {
      width: 90%;
    }
  }

  .info_dialog {
    width: 80%;
  }

  .title {
    font: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  }
</style>
