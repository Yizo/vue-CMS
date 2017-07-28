<template>
  <div>
    <el-table :data="regionAreaDetails.logs">
      <el-table-column label="所属地域">
        <template scope="scope">
          {{scope.row.ip_country}}{{scope.row.ip_province}}{{scope.row.ip_city}}
        </template>
      </el-table-column>
      <el-table-column label="在线人数">
        <template scope="scope">
          <span style="cursor: pointer;background-color: #333;padding: 1px 3px;color: #fff"
                @click="areaUser(scope.row)">{{scope.row.users_count}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="regionAreaDetails.current_page"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="regionAreaDetails.total_count" class="page">
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
        /*详情*/
        dialog: false,
      }
    },
    computed: {
      ...mapGetters(['regionAreaDetails', 'regionAreaUserDetails'])
    },
    filters: {
      formatDate: formatDate
    },
    methods: {
      //分页action
      handleSizeChange(val){
        let options = {
          node_id: this.nodeId,
          ip_country: data.ip_country,
          ip_province: data.ip_province,
          ip_city: data.ip_city,
          page: val,
          limit: this.pageSize
        }
        this.$store.dispatch('getRegionAreaDetails', options)
      },
      handleCurrentChange(val){
        this.$emit('changePage2', val);
        this.$store.dispatch('getRegionDetails', {
          page: val,
          limit: this.pageSize,
          node_id: this.nodeId
        })
      },
      areaUser(data){
        this.$emit('AreaUser', data);
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
