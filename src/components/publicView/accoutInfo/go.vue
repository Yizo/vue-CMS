<template>
  <div>
    <div class="block" style="text-align: left;margin-bottom: 10px">
      <el-date-picker
        v-model="filter.start"
        type="date"
        @change="start_date"
        placeholder="开始日期">
      </el-date-picker>
      <el-date-picker
        v-model="filter.end"
        type="date"
        @change="end_date"
        placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" icon="search" style="margin-left: 10px" @click="filterActions">筛选</el-button>
    </div>
    <el-table
      :data="data.logs"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号" min-width="280">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="时间点" min-width="180">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
      <el-table-column
        prop="client_ip"
        label="用户IP" width="120">
      </el-table-column>
      <el-table-column
        label="IP解析" width="160">
        <template scope="scope">
          {{scope.row.client_ip_country}}{{scope.row.client_ip_province}}{{scope.row.client_ip_city}}
        </template>
      </el-table-column>
      <!--      <el-table-column
              label="连接方式">
              <template scope="scope">
                <span>先空着</span>
              </template>
            </el-table-column>-->
      <el-table-column
        label="连接路径" min-width="240">
        <template scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.first_node_ip + ' | ' + scope.row.second_node_ip"
                      placement="top">
            <span>{{scope.row.node_type_name}}-{{scope.row.first_node_name}}-{{scope.row.second_node_name}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="domain"
        label="去向IP" width="180">
      </el-table-column>
      <el-table-column
        prop="domain_description"
        label="中文解析">
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
  import * as JS from '../../../assets/js/js'
  export default {
    data(){
      return {
        pageSize: 15
      }
    },
    computed: {
      ...mapGetters({
        data: 'UD_access_logs',
        initDate: 'initDate'
      }),
      filter(){
        return this.initDate
      },
    },
    watch: {
      data(data){
        return data
      }
    },
    methods: {
      ...mapActions({
        access: "UD_access_logs",
      }),
      handleSizeChange(val){
        var id = window.sessionStorage.getItem('userId')
        if (typeof this.filter.start == "object") {
          this.filter.end = JS.Timestamp(this.filter.end);
        }
        if (typeof this.filter.end == "object") {
          this.filter.end = JS.Timestamp(this.filter.end);
        }
        this.access({
          id: id,
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end
        }).then(res => {

        })
      },
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filterActions(){
        var id = window.sessionStorage.getItem('userId')
        if (typeof this.filter.start == 'object') {
          this.filter.start = JS.Timestamp(this.filter.start)
        }
        if (typeof this.filter.end == 'object') {
          this.filter.end = JS.Timestamp(this.filter.end)
        }
        let options = {id: id, limit: this.pageSize, start_at: this.filter.start, end_at: this.filter.end}
        if (options.start_at && options.end_at || !options.start_at && !options.end_at) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        this.access(options)
      }
    },
    handleSizeChange(val){
      this.access({id: id, page: val, limit: this.pageSize, start_at: this.filter.start, end_at: this.filter.end})
    }
  }
</script>
