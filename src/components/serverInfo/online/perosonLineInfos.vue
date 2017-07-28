<template>
  <div>
    <el-table :data="regionLineDetails.users">
      <el-table-column label="账户名" width="200">
        <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
        </template>
      </el-table-column>
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
        :current-page="regionLineDetails.current_page"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="regionLineDetails.total_count" class="page">
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
        pageSize: 15,
      }
    },
    computed: {
      ...mapGetters(['regionLineDetails'])
    },
    methods: {
      userInfo(row){
        this.$emit('AreaUser', row);
      },
      //分页action
      handleSizeChange(val){
      },
      handleCurrentChange(val){
        this.$emit('changePage3', val);
        this.$store.dispatch('getRegionLineDetails', {
          page: val,
          limit: this.pageSize,
          node_id: this.nodeId
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
