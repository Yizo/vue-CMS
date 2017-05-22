<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>使用时长</el-breadcrumb-item>
      <el-breadcrumb-item>使用时长</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row style="text-align: left;margin-bottom: 10px;margin-top: 20px">
      <div style="display: inline-block">
        <el-date-picker
          v-model="filter.start"
          type="date"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="filter.end"
          type="date"
          placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
    </el-row>
    <div class="warp">
      <h2 style="margin-bottom: 10px">人均显示时长:<span style="color: red;margin: 0 5px">10</span>分钟</h2>
      <template>
        <el-table
          :data="data"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="0-5分钟">
          </el-table-column>
          <el-table-column
            prop="node_region_name"
            label="5-10分钟">
          </el-table-column>
          <el-table-column
            prop="max_connections_count"
            label="10-30分钟">
          </el-table-column>
          <el-table-column
            prop="connections_count"
            label="30-60分钟">
          </el-table-column>
          <el-table-column
            prop="connections_percent"
            label="60分钟以上">
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  export default{
    components:{},
    data(){
      return {
        filter:{
          start:'',
          end:''
        },
        data:[]
      }
    },
    computed:{

    },
    methods:{
      getInfo(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.server_details_info,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){
            if(res.status == 200){
              resolve(res)
            }
          }).catch(function(err){
            reject(err)
          })
        })
      },
    },
    mounted(){
/*      this.getInfo().then(res=>{
        this.data = res.data.data.nodes
        console.log(res)
      })*/
    }
  }
</script>

<style scoped>
  .dstip{
    padding: 10px;
  }
  .warp{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px;
  }
</style>

