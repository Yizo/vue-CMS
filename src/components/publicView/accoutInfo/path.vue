<template>
  <div>
    <div class="block" style="text-align: left;margin-bottom: 10px">
      <el-date-picker
        v-model="time"
        type="date"
        placeholder="选择日期"
        @change="start_date">
      </el-date-picker>
      <el-button type="primary" icon="search" @click="guolv" style="margin-left: 10px">筛选</el-button>
    </div>
    <el-table
      :data="current"
      style="width: 100%">
      <el-table-column
        prop="times"
        label="开启次数">
      </el-table-column>
      <el-table-column
        prop="interface_id"
        label="操作步骤">
      </el-table-column>
      <el-table-column
        prop="interface_name"
        label="界面名">
      </el-table-column>

    </el-table>
    <!--分页-->
    <el-pagination
      @current-change="handleSizeChange"
      :current-page="data.current_page"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="data.logs?data.logs.length:0"
      class="page">
    </el-pagination>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data(){
      return {
        time: '',
        pageSize: 15
      }
    },
    computed: {
      ...mapGetters({
        data: 'UD_operation_logs',
        current: 'UD_current'
      })
    },
    methods: {
      ...mapActions({
        UD_operation_logs: "UD_operation_logs",
      }),
      start_date(val){
        this.time = val
      },
      guolv(){
        var id = window.sessionStorage.getItem('userId')
        this.UD_operation_logs({id: id, date: this.time}).then(res => {
          // this.$store.commit('u_operation_logs')
          this.$store.commit('u_current', {current: 1, pageSize: 15})
        })
      },
      handleSizeChange(val){
        this.$store.commit('u_current', {current: val, pageSize: 15})
      },
    },
    mounted(){

    }
  }
</script>
