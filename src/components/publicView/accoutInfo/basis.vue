<template>
  <div>
    <p style="margin-bottom: 10px;text-align: left">使用总流量<span
      style="padding: 0 10px;color: red">{{data.total_bytes | getFlow}}</span></p>
    <el-table
      :data="data.connection_logs"
      style="width: 100%">
      <el-table-column
        label="日期">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        label="用户IP">
      </el-table-column>
      <el-table-column
        prop="node_name"
        label="线路">
        <template scope="scope">
          {{scope.row.node_type_name}}_{{scope.row.node_region_name}}_{{scope.row.node_name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="wait_time"
        label="时长(单位:秒)">
      </el-table-column>
    </el-table>


    <!--分页-->
    <el-pagination
      @current-change="handleSizeChange"
      :current-page="data.current_page"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="data.total_count"
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
        pageSize: 15
      }
    },
    computed: {
      ...mapGetters({
        data: 'UD_base_info'
      }),
    },
    watch: {},
    methods: {
      ...mapActions({
        UD_base_info: "UD_base_info",
      }),
      handleSizeChange(val){
        var id = window.sessionStorage.getItem('userId')
        this.UD_base_info({id: id, page: val, limit: this.pageSize})
      },
    },
    mounted(){

    }

  }
</script>
