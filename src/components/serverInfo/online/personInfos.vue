<template>
  <div>
    <el-table :data="personDetails.users">
      <el-table-column property="id" label="账号" width="150"></el-table-column>
      <el-table-column property="username" label="账户名" width="200"></el-table-column>
      <el-table-column property="ip" label="用户IP"></el-table-column>
      <el-table-column property="" label="IP解析">
        <template scope="scope">
          <span>{{scope.row.ip_country}}{{scope.row.ip_province}}{{scope.row.ip_city}}</span>
        </template>
      </el-table-column>
      <el-table-column property="created_at" label="访问时间">
        <template scope="scope">
          <span>{{scope.row.created_at | Time}}</span>
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
        :total="personDetails.total_pages" class="page">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  import {formatDate} from '../../../utils/filters'
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'

  export default{
    props: ['regionId'],
    data(){
      return {
        users: [],
        limit: 25,
        pageSize: 1,
        totalPages: 1
      }
    },
    computed: {
      ...mapGetters(['personDetails']),
    },
    methods: {
      //分页action
      handleSizeChange(val){
      },
      userInfo(row){
        this.$emit('AreaUser', row);
      },
      handleCurrentChange(val){
        this.$emit('changePage1', val);
        this.$store.dispatch('getPersonDetails', {
          page: val,
          limit: 15,
          node_id: this.region - id
        })
      }
    }
  }
</script>

<style scoped>
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
