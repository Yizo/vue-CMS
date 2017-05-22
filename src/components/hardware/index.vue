<template>
  <div id="hardware">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'hardware' }">用户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>硬件统计</el-breadcrumb-item>
    </el-breadcrumb>

    <!--筛选-->
    <div class="warp_filter">
      <template>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="(item,index) in options"
            :label="item.label"
            :value="item.value" :key="index">
          </el-option>
        </el-select>
      </template>
      <template>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="(item,index) in options"
            :label="item.label"
            :value="item.value" :key="index">
          </el-option>
        </el-select>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <span><i class="el-icon-menu"></i>硬件统计饼图</span>
        </el-col>
        <el-col :span="12">
          <span><i class="el-icon-menu"></i>硬件统计列表</span>
          <table class="t1">
            <tbody class="table">
            <tr>
              <th>机型</th>
              <th>系统</th>
              <th>数量</th>
              <th>占比</th>
            </tr>
            <tr v-for="(item,index) in tableData">
              <td>{{item.date}}</td>
              <td>{{item.name}}</td>
              <td>{{item.address}}</td>
              <td >{{item.bi}}</td>
            </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
    </div>

    <!--数量弹窗-->
    <el-dialog title="收货地址" v-model="dialogTableVisible">
      <el-table :data="tableData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          bi:'12.2%'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          bi:'12.2%'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          bi:'12.2%'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          bi:'12.2%'
        }],
        dialogTableVisible: false,
      }
    },
    methods:{
      showdialog(){
          alert(1)
      }
    }
  }
</script>

<style scoped>
  #hardware{
    padding: 10px;
  }
  /*导航*/
  #userInfo .breadcrumb{
    height: 30px;
    line-height: 30px;
  }
  .warp_filter{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px;
  }
  .el-table_1_column_4 .cell{
    cursor: pointer;
  }
  table{
    table-layout:fixed;
    empty-cells:show;
    border-collapse: collapse;
    margin:0 auto;
  }
  td{
    height:30px;
  }
  h1,h2,h3{
    font-size:12px;
    margin:0;
    padding:0;
  }
  .table{
    border:1px solid #cad9ea;
    color:#666;
  }
  .table th {
    background-repeat:repeat-x;
    height:30px;
  }
  .table td,.table th{
    border:1px solid #cad9ea;
    padding:0 1em 0;
  }
  .table tr.alter{
    background-color:#f5fafe;
  }
</style>
