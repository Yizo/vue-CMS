<template>
  <div class="serverInfo">
    <div id="serverdetailed" class="warp">
      <template>
        <el-table
          :data="data"
          border
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column
            prop="name"
            column-key
            label="服务器名称">
          </el-table-column>
          <el-table-column
            prop="url"
            label="服务器IP">
          </el-table-column>
          <el-table-column
            prop="max_connections_count"
            label="最大连接人数">
          </el-table-column>
          <el-table-column
            prop="connections_count"
            label="当前连接人数">
          </el-table-column>
          <el-table-column
            prop="connections_percent"
            label="在线人数占比(%)">
          </el-table-column>
          <el-table-column
            label="带宽占比(%)">
            <template scope="scope">
              <span v-show="scope.row.status">{{scope.row.current_bandwidth}}%</span>
            </template>
          </el-table-column>
          <el-table-column
            label="CPU(%)">
            <template scope="scope">
              <span v-show="scope.row.status">{{scope.row.cpu_percent}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="内存(%)">
            <template scope="scope">
              <span v-show="scope.row.status">{{scope.row.memory_percent}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="总流量(GB)">
            <template scope="scope">
              <span v-show="scope.row.status">{{scope.row.transfer | transfer}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="上行速度(kb/s)">
            <template scope="scope">
              <span v-show="scope.row.status">{{Math.round(scope.row.network_speed_up/1024)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="下行速度(kb/s)">
            <template scope="scope">
              <span v-show="scope.row.status">{{Math.round(scope.row.network_speed_down/1024)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--分页-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="25"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
      class="page">
    </el-pagination>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  export default{
    components: {},
    data(){
      return {
        data: [],
        currentPage: 1,
        totalSize: 0,
        pageSize: 15
      }
    },
    methods: {
      tableRowClassName(row, index) {
        if (row.class == 'b') {
          return 'bbb'
        } else {
          return 'aaa'
        }
      },
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_details_info,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      list(array){
        var xx = array
        for (var i = 0; i < xx.length - 1; i++) {
          eval("xx[0].status=" + true);
          if (xx[i].url == xx[i + 1].url) {
            eval("xx[i+1].status=" + false);

          } else {
            eval("xx[i+1].status=" + true);
          }
          if (xx[i]) {
          }
        }

        var num = 0;
        var list = [];
        for (var i = 1; i < xx.length; i++) {
          if (xx[i - 1].url == xx[i].url) {
            num++;
          } else {
            list.push(num)
            num = 0
          }
        }

        xx[0].class = "b"
        for (var i = 1; i < xx.length; i++) {
          xx[i].class = "a"
        }
        var mm = 0
        for (var i = 0; i < list.length; i++) {
          mm += (list[i] + 1)
          if ((i % 2) == "0") {
            for (var j = mm - (list[i] + 1); j < mm; j++) {
              xx[j].class = "b"
            }
          }
        }
        return array
      },
      /*分页*/
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getInfo({page: val}).then(res => {
          this.data = this.list(res.data.data.nodes)
          this.totalSize = res.data.data.total_count
          this.currentPage = res.data.data.current_page
        })
      }
    },
    mounted(){

      this.getInfo().then(res => {
        this.data = this.list(res.data.data.nodes)
        this.totalSize = res.data.data.total_count
        this.currentPage = res.data.data.current_page
      })
    }
  }
</script>

<style scoped>
  .warp {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }

  .el-table .cell {
    color: #333;
  }
</style>

