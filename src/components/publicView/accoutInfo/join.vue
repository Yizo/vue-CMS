<template>
  <div>
    <div class="block" style="text-align: left;margin-bottom: 10px">
      <el-date-picker
        v-model="filter.start"
        type="date"
        placeholder="开始日期">
      </el-date-picker>
      <span>至</span>
      <el-date-picker
        v-model="filter.end"
        type="date"
        placeholder="结束日期">
      </el-date-picker>
      <el-select placeholder="状态" v-model="form.status" style="width:200px">
        <el-option label="全部" value="3"></el-option>
        <el-option label="成功" value="1"></el-option>
        <el-option label="失败" value="0"></el-option>
      </el-select>
      <el-button type="primary" icon="search" style="margin-left: 10px" @click="filterActions">筛选</el-button>
    </div>
    <el-table
      :data="data.connection_logs"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号"
        min-width="320">
      </el-table-column>
      <el-table-column
        label="日期" min-width="180">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        label="用户IP" min-width="160">
      </el-table-column>
      <el-table-column
        label="IP解析" min-width="160">
        <template scope="scope">
          {{scope.row.ip_country}}{{scope.row.ip_province}}{{scope.row.ip_city}}
        </template>
      </el-table-column>
      <el-table-column
        label="线路" min-width="200">
        <template scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.node_url" placement="top">
            <span>{{scope.row.node_type_name}}_{{scope.row.node_region_name}}_{{scope.row.node_name}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="wait_time"
        label="等待时间(单位:秒)" width="150px">
      </el-table-column>
      <el-table-column
        label="状态" width="80px">
        <template scope="scope">
          <el-tag
            :type="scope.row.status_title === '成功' ?'success':'primary'"
            close-transition>{{scope.row.status_title}}
          </el-tag>
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
  import * as JS from '../../../assets/js/js'
  import {mapActions, mapGetters}  from 'vuex'
  export default {
    data(){
      return {
        form: {
          status: '3'
        },
        pageSize: 15
      }
    },
    computed: {
      ...mapGetters({
        data: 'UD_connection_logs',
        initDate: 'initDate'
      }),
      filter(){
        return this.initDate
      },
    },
    methods: {
      ...mapActions({
        UD_connection_logs: "UD_connection_logs",
      }),
      handleSizeChange(val){
        var id = window.sessionStorage.getItem('userId')
        if (this.form.status == 3) {
          this.UD_connection_logs({
            id: id,
            page: val,
            limit: this.pageSize,
            start_at: this.filter.start,
            end_at: this.filter.end
          })
        } else {
          this.UD_connection_logs({
            id: id,
            page: val,
            limit: this.pageSize,
            start_at: this.filter.start,
            end_at: this.filter.end,
            status: parseInt(this.form.status)
          })
        }
      },
      filterActions(){
        var id = window.sessionStorage.getItem('userId')
        if (typeof this.filter.start == "object") {
          this.filter.start = JS.Timestamp(this.filter.start);
        }
        if (typeof this.filter.end == "object") {
          this.filter.end = JS.Timestamp(this.filter.end);
        }
        let options = {
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        if (options.start_at && options.end_at || !options.start_at && !options.end_at) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        if (this.form.status == 3) {
          this.UD_connection_logs({id: id, limit: this.pageSize, start_at: this.filter.start, end_at: this.filter.end})
        } else {
          this.UD_connection_logs({
            id: id,
            limit: this.pageSize,
            start_at: this.filter.start,
            end_at: this.filter.end,
            status: parseInt(this.form.status)
          })
        }

      }
    },
    mounted(){

    }
  }
</script>
