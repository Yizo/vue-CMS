<template>
  <div>
    <el-table
      :data="data.connection_logs"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号">
      </el-table-column>
      <el-table-column
        label="日期">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
      <el-table-column
        label="线路">
        <template scope="scope">
          {{scope.row.node_type_name}}_{{scope.row.node_region_name}}_{{scope.row.node_name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="wait_time"
        label="等待时间(单位:秒)">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="用户IP">
      </el-table-column>
      <el-table-column
        label="状态">
        <template scope="scope">
          <el-tag
            :type="scope.row.status_title === '成功' ? 'primary' : 'success'"
            close-transition>{{scope.row.status_title}}</el-tag>
        </template>
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
  import { mapActions,mapGetters }  from 'vuex'
  export default {
    data(){
      return {
        pageSize:15
      }
    },
    computed:{
      ...mapGetters({
        data:'UD_connection_logs'
      })
    },
    methods:{
      ...mapActions({
        UD_connection_logs: "UD_connection_logs",
      }),
      handleSizeChange(val){
        var id = window.sessionStorage.getItem('userId')
        this.UD_connection_logs({id:id,page:val,limit:this.pageSize})
      },
    },
    mounted(){

    }
  }
</script>
