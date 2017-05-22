<template>
  <div>
    <div class="block" style="text-align: left;margin-bottom: 10px">
      <el-date-picker
        v-model="form.value1"
        type="date"
        placeholder="开始日期">
      </el-date-picker>
      <span>至</span>
      <el-date-picker
        v-model="form.value2"
        type="date"
        placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" icon="search" style="margin-left: 10px" @click="filter">筛选</el-button>
    </div>
    <el-table
      :data="data.logs"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="时间点">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
      <el-table-column
        prop="domain"
        label="去向IP">
      </el-table-column>
      <el-table-column
        prop="domain_description"
        label="中文解析">
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
  import * as JS from '../../../assets/js/js'
  export default {
    data(){
        return {
            form:{
                value1:'',
                value2:''
            },
          pageSize:15
        }
    },
    computed:{
      ...mapGetters({
        data:'UD_access_logs'
      })
    },
    watch:{
      data(data){
        return data
      }
    },
    methods:{
      ...mapActions({
        access: "UD_access_logs",
      }),
      handleSizeChange(val){
        var id = window.sessionStorage.getItem('userId')
        if(typeof this.form.value1 == "object"){
          this.form.value1 = JS.Timestamp(this.form.value1);
        }
        if(typeof this.form.value2 == "object"){
          this.form.value2 = JS.Timestamp(this.form.value2);
        }
        this.access({id:id,page:val,limit:this.pageSize,start_at:this.form.value1,end_at:this.form.value2}).then(res=>{

        })
      },
      filter(){
        var id = window.sessionStorage.getItem('userId')
        if(typeof this.form.value1 == "object"){
          this.form.value1 = JS.Timestamp(this.form.value1);
        }
        if(typeof this.form.value2 == "object"){
          this.form.value2 = JS.Timestamp(this.form.value2);
        }
        this.access({id:id,limit:this.pageSize,start_at:this.form.value1,end_at:this.form.value2}).then(res=>{

        })
      }
    },
    mounted(){

    }
  }
</script>
