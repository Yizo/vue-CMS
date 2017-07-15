<template>
  <div>
    <div>123</div>
    {{source}}
    <div v-for="(item,index) in source">
      <div id="history_char" style="height: 400px;border: 1px solid #D3DCE6">

      </div>
      <div>
        <el-table :data="item.list" style="width: 100%" border>
          <el-table-column prop="stat_date" label="日期"></el-table-column>
          <el-table-column prop="min_cpu_percent" label="最小值"></el-table-column>
          <el-table-column prop="max_cpu_percent" label="最大值"></el-table-column>
          <el-table-column prop="average_cpu_percent" label="平均值"></el-table-column>
          <el-table-column label="详情">
            <template scope="scope">
              <el-button size="small" @click="detatil(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          class="page">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: ['source'],
    data(){
      return {
        currentPage: 1,
        pageSize: 15
      }
    },
    computed: {},
    methods: {
      detatil(){

      },
      handleCurrentChange(){

      }
    },
    mounted(){

    }
  }
</script>

<style scoped>

</style>
