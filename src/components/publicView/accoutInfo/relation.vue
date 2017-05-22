<template>
  <div>
    <el-table
      :data="data.devices"
      style="width: 100%">
      <el-table-column
        prop="model"
        label="硬件型号">
      </el-table-column>
      <el-table-column
        prop="uuid"
        label="UUID">
      </el-table-column>
      <el-table-column
        prop="platform"
        label="平台">
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
  import { mapGetters,mapActions } from 'vuex'
  export default {
    data(){
      return {
        pageSize:15
      }
    },
    methods:{
      ...mapActions({
        devices: "UD_devices",
      }),
      handleSizeChange(val){
        var id = window.sessionStorage.getItem('userId')
        this.devices({id:id,page:val,limit:this.pageSize})
      },
    },
    computed:{
      ...mapGetters({
        data:'UD_devices'
      })
    },
    mounted(){

    }
  }
</script>
