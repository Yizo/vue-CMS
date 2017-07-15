<template>
  <div>
    <el-table
      :data="regionAreaUserDetails.users?regionAreaUserDetails.users:null"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="账号名">
        <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        label="用户IP">
      </el-table-column>
      <el-table-column
        label="IP解析">
        <template scope="scope">
          {{scope.row.ip_country}}{{scope.row.ip_province}}{{scope.row.ip_city}}
        </template>
      </el-table-column>
      <el-table-column
        prop="device_uuid"
        label="访问时间">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-pagination
        @current-change="d_handleCurrentChange"
        :current-page="regionAreaUserDetails.current_page"
        :page-size="pageSize"
        :total="regionAreaUserDetails.total_count"
        layout="total, prev, pager, next, jumper"
        class="page">
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
      ...mapGetters(['regionAreaUserDetails'])
    },
    filters: {
      formatDate: formatDate
    },
    methods: {
      userInfo(row){
        this.$emit('AreaUser', row);
      },
      showDialog(){
        this.dialog = true
      },
      /*详情*/
      details(data){
        let options = {
          node_id: this.nodeId,
          ip_country: data.ip_country,
          ip_province: data.ip_province,
          ip_city: data.ip_city,
          page: 1,
          limit: this.pageSize
        }
        this.$store.dispatch('getRegionAreaUserDetails', options)
        this.dialog = true
      },
      /*详情分页*/
      d_handleCurrentChange(val){
        let options = {
          node_id: this.nodeId,
          ip_country: data.ip_country,
          ip_province: data.ip_province,
          ip_city: data.ip_city,
          page: val,
          limit: this.pageSize
        }
        this.$store.dispatch('getRegionAreaUserDetails', options)
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
