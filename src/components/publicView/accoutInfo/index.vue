<template>
  <div>
    <el-dialog title="账号信息" v-model="dialog1" size="small" @close="closeDialog">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basis">
          <basis></basis>
        </el-tab-pane>
        <el-tab-pane label="连接请求" name="link">
          <join></join>
        </el-tab-pane>
        <el-tab-pane label="关联设备" name="relation">
          <relation></relation>
        </el-tab-pane>
        <el-tab-pane label="操作路径" name="path">
          <paths></paths>
        </el-tab-pane>
        <el-tab-pane label="用户去向" name="go">
          <go></go>
        </el-tab-pane>
        <el-tab-pane label="充值信息" name="recharge">
          <recharge></recharge>
        </el-tab-pane>
        <el-tab-pane label="信息管理" name="info">
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
  export default {
    props: ['visab'],
    components: {
      basis, join, relation, paths, go, recharge, info
    },
    data(){
      return {
        activeName: 'basis',
        pageSize: 15
      }
    },
    computed: {
      ...mapGetters({
        getId: 'getId',
        current: 'UD_current'
      }),
      dialog1(){
        return this.visab
      }
    },
    watch: {
      dialog1(){
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
      }),
      handleClick(tab) {
        var index = parseInt(tab.index);
        var id = window.sessionStorage.getItem('userId')
        if (index == 0) {
          this.base({id: id, limit: this.pageSize}).then(res => {

          })
        } else if (index == 1) {
          this.connection({id: id, limit: this.pageSize}).then(res => {

          })
        } else if (index == 2) {
          this.devices({id: id, limit: this.pageSize}).then(res => {

          })
        } else if (index == 3) {
          this.operation({id: id}).then(res => {
            this.$store.commit('u_current', {current: 1, pageSize: 15})
          })
        } else if (index == 4) {
          this.access({id: id, limit: this.pageSize}).then(res => {

          })
        } else if (index == 5) {
          this.transaction({id: id, limit: 10}).then(res => {

          })
        } else {
          this.profile({id: id, limit: this.pageSize}).then(res => {

          })
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
