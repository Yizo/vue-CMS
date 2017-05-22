<template>
  <div>
    <el-table :data="regionDetails.users">
      <el-table-column property="id" label="所属地域"></el-table-column>
      <el-table-column property="username" label="在线人数"></el-table-column>
      <!--<el-table-column property="address" label="地址"></el-table-column>-->
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="regionDetails.current_page"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="regionDetails.total_pages">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '../../../utils/filters'
  import * as API from '../../../api/api'
  import {mapGetters,mapActions} from 'vuex'


  export default{
    props: ['regionId'],
    data(){
      return {
        users: [],
        limit: 25,
        pageSize: 1
      }
    },
    computed: {
      ...mapGetters(['token', 'regionDetails'])
    },
    filters: {
      formatDate: formatDate
    },
    methods: {
      //分页action
      handleSizeChange(val){
      },
      handleCurrentChange(val){
        this.$emit('changePage2', val);
        this.$store.dispatch('getRegionDetails', {
          page: val,
          limit: 25,
          region_id: regionId
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
