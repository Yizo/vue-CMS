<template>
  <div>
    <p style="margin-bottom: 10px;text-align: left">使用总流量<span
      style="padding: 0 10px;color: red">{{data.total_bytes | getFlow}}</span></p>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="关联设备" name="1" style="text-align: left">
        <relation></relation>
      </el-collapse-item>
      <el-collapse-item title="服务类型" name="2" style="text-align: left">
        <el-table
          :data="data.user_node_types"
          style="width: 100%;margin-bottom: 10px">
          <el-table-column
            prop="name"
            label="服务类型">
          </el-table-column>
          <el-table-column
            prop="status"
            label="当前状态">
          </el-table-column>
          <el-table-column
            prop="used_count"
            label="本月次数">
          </el-table-column>
          <el-table-column
            label="有效期">
            <template scope="scope">
              {{scope.row.expired_at | Time}}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

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
        label="IP解析" min-width="160">
        <template scope="scope">
          {{scope.row.ip_country}}{{scope.row.ip_province}}{{scope.row.ip_city}}
        </template>
      </el-table-column>
      <el-table-column
        prop="node_name"
        label="线路">
        <template scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.node_url" placement="top">
            <span>{{scope.row.node_type_name}}_{{scope.row.node_region_name}}_{{scope.row.node_name}}</span>
          </el-tooltip>
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
  import relation from './relation.vue'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    props: {
      username: String,
      default: '姓名'
    },
    data(){
      return {
        activeNames: ['3'],
        pageSize: 10
      }
    },
    computed: {
      ...mapGetters({
        data: 'UD_base_info'
      }),
    },
    components: {
      relation
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
