<template>
  <div>
    <div class="block" style="text-align: left;margin-bottom: 10px;position: relative">
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
      <el-button type="primary" icon="search" style="margin-left: 10px" @click="filterActions">筛选</el-button>
      <p style="position: absolute;top:10px;right: 10px;">
        当前时间内总消费:<span style="color: red">{{data.filter_consume_coins}}</span>
      </p>
    </div>
    <el-table
      :data="data.logs"
      style="width: 100%">
      <el-table-column
        label="时间" min-width="180">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
      <el-table-column
        prop="node_type"
        label="服务类型">
      </el-table-column>
      <el-table-column
        prop="coins"
        label="扣除钻石数量">
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
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data(){
      return {
        form: {
          value1: '',
          value2: '',
        },
        pageSize: 15
      }
    },
    methods: {},
    computed: {
      ...mapGetters({
        data: 'UD_consumption_logs',
        initDate: 'initDate'
      }),
      filter(){
        return this.initDate
      }
    },
    methods: {
      ...mapActions({
        consumption: "UD_consumption_logs",
      }),
      handleSizeChange(val){
        var id = window.sessionStorage.getItem('userId')
        this.consumption({
          id: id,
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          end_at: this.filter.end
        })
      },
      filterActions(){
        var id = window.sessionStorage.getItem('userId')
        if (typeof this.filter.start == "object") {
          this.filter.start = JS.Timestamp(this.filter.start);
        }
        if (typeof this.filter.end == "object") {
          this.filter.end = JS.Timestamp(this.filter.end);
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
        this.consumption(options)
      }
    },
    mounted(){
    },

  }
</script>
