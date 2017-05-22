<template>
  <div>
    <el-table :data="personDetails.users">
      <el-table-column property="id" label="账号" width="150"></el-table-column>
      <el-table-column property="username" label="账户名" width="200"></el-table-column>
      <el-table-column property="ip" label="用户IP"></el-table-column>
      <el-table-column property="" label="IP解析">
        <template scope="scope">
          <span>{{scope.row.ip_country}}{{scope.row.ip_city}}{{scope.row.ip_province}}</span>
        </template>
      </el-table-column>
      <el-table-column property="created_at" label="访问时间">
        <template scope="scope">
          <span>{{scope.row.created_at|formatDate}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="personDetails.current_page"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="personDetails.total_pages">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  import {formatDate} from '../../../utils/filters'
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'

  export default{
    props: ['nodeId'],
    data(){
      return {
        users: [],
        limit: 25,
        pageSize: 1,
        totalPages: 1
      }
    },
    computed: {
      ...mapGetters(['token', 'personDetails']),
    },
    filters: {
      formatDate: formatDate
    },
    methods: {
      //分页action
      handleSizeChange(val){
      },

      handleCurrentChange(val){
        this.$emit('changePage1', val);
        this.$store.dispatch('getPersonDetails', {
          page: val,
          limit: 25,
          node_id: this.nodeId
        })
      }
    }
  }
</script>

<style scope>
  .el-dialog__header {
    text-align: left;
  }

  .el-form-item__content {
    text-align: left;
  }

  .el-table th > .cell {
    text-align: left;
  }
</style>
