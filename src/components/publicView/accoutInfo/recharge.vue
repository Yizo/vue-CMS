<template>
  <div>
    <el-table
      :data="data.logs"
      style="width: 100%">
      <el-table-column
        label="日期">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="plan_name"
        label="套餐名">
      </el-table-column>
      <el-table-column
        prop="price"
        label="金额">
      </el-table-column>
      <el-table-column
        prop="coins"
        label="获得钻石">
      </el-table-column>
      <el-table-column
        prop="payment_method"
        label="支付方式">
      </el-table-column>
      <el-table-column
        :filters="[{ text: '成功', value: true }, { text: '失败', value: false }]"
        :filter-method="filterTag"
        prop="is_completed"
        label="状态">
        <template scope="scope">
          <el-tag
            :type="scope.row.is_completed === true ? 'success' : 'primary'"
            close-transition>{{guolv(scope.row.is_completed)}}</el-tag>
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
  import { mapGetters,mapActions } from 'vuex'
  export default {
    data(){
      return {
          pageSize:15
      }
    },
    methods:{

    },
    computed:{
      ...mapGetters({
        data:'UD_transaction_logs'
      })
    },
    methods:{
      ...mapActions({
        transaction: "UD_transaction_logs",
      }),
      handleSizeChange(val){
        var id = window.sessionStorage.getItem('userId')
        this.transaction({id:id,page:val,limit:this.pageSize}).then(res=>{

        })
      },
      guolv(data){
          if(data){
              return '成功'
          }else{
              return '失败'
          }
      },
      filterTag(value, row) {
        return row.is_completed == value;
      }
    },
    mounted(){
    },

  }
</script>
