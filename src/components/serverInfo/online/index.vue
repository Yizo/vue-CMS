<template>
  <div id="online">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器信息</el-breadcrumb-item>
      <el-breadcrumb-item>当前在线人数</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="online-wrap">
      <h3 style="margin-bottom: 10px">服务器区域及总在线人数：{{number}}人</h3>
      <el-table
        :data="nodes"
        highlight-current-row
        @current-change="handleCurrentRowChange"
        style="width: 100%">
        <el-table-column
          label="编号"
          property="id"
          align="left"
          width="80">
        </el-table-column>
        <el-table-column
          property="region_name"
          align="left"
          label="区域">
        </el-table-column>
        <el-table-column
          property="region_connections_count"
          align="left"
          label="总在线人数">
          <template scope="scope">
            <el-button type="primary" size="small" @click="handleDetails(scope.$index,scope.row)">
              {{scope.row.region_connections_count}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          property="name"
          align="left"
          label="线路名称">
          <template scope="scope">
            <el-button type="primary" size="small" @click="handleLineNameDetails(scope.$index,scope.row)">
              {{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          property="region_connections_count"
          align="left"
          label="在线人数">
          <template scope="scope">
            <el-button type="primary" size="small" @click="handleLinePersonDetails(scope.$index,scope.row)">
              {{scope.row.region_connections_count}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right;margin: 15px 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="详情" v-model="dialogVisible1">
      <person-info :node-id="node_id" v-on:changePage1="changePage1"></person-info>
    </el-dialog>
    <el-dialog title="详情" v-model="dialogVisible2">
      <region-area :region-id="region_id" v-on:changePage2="changePage2"></region-area>
    </el-dialog>
    <el-dialog title="详情" v-model="dialogVisible3">
      <person-line-infos :region-id="region_id" :node-id="node_id" v-on:changePage3="changePage3"></person-line-infos>
    </el-dialog>
  </div>
</template>


<script>

  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  import personInfo from './personInfos.vue'
  import regionArea from './regionArea.vue'
  import personLineInfos from './perosonLineInfos.vue'

  export default {
    data(){
      return {
        number: 0, //总在线人数
        currentPage: 1,
        limit: 25,
        pageSize: 25,
        total: 0,
        region_id: 0,
        node_id: 0,
        currentPage1: 0,
        currentPage2: 0,
        currentPage3: 0,
        nodes: [],
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
      }
    },
    components: {personInfo, regionArea, personLineInfos},
    computed: {
      ...mapGetters(['token'])
    },
    methods: {
      //服务器在线人数总和
      connectionsCount(data){
        let number = 0;
        for (let i in data) {
          number += parseInt(data[i].region_connections_count)
        }
        return number
      },
      handleLinePersonDetails(index, row){
        this.region_id = this.nodes[index]['region_id'];
        this.node_id = this.nodes[index]['id'];
        this.$store.dispatch('getRegionLineDetails', {
          page: this.currentPage3,
          limit: 25,
          node_id: this.node_id,
          node_region_id: this.region_id
        });
        this.dialogVisible3 = true;
      },
      handleLineNameDetails(index, row){
        this.region_id = this.nodes[index]['region_id'];
        this.$store.dispatch('getRegionDetails', {
          page: this.currentPage2,
          limit: 25,
          node_region_id: this.region_id
        });
        this.dialogVisible2 = true;
      },
      handleDetails(index, row){
        this.node_id = this.nodes[index]['id'];
        this.$store.dispatch('getPersonDetails', {
          page: this.currentPage1,
          limit: 25,
          node_id: this.node_id
        });
        this.dialogVisible1 = true;
      },
      handleCurrentRowChange(val) {
        this.currentRow = val;
      },
      //分页action
      handleSizeChange(val){
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.getOnlineList();
      },
      changePage1(val){
        this.currentPage1 = val;
      },
      changePage2(val){
        this.currentPage2 = val;
      },
      changePage3(val){
        this.currentPage3 = val;
      },
      getOnlineListPromise(){
        const token = this.token;
        const limit = this.limit;
        const page = this.currentPage;
        const method = 'GET';
        const headers = {'Authorization': token};
        const url = API.server_online_list_get;
        const params = {
          limit,
          page
        };
        return this.$http({
          url,
          method,
          headers,
          params,
        })
      },
      getOnlineList(){
        this.getOnlineListPromise().then((res) => {
          const data = res.data.data;
          this.nodes = [...data.nodes];
          this.currentPage = data.current_page;
          this.total = data.total_count;
          this.number = this.connectionsCount(data.nodes)
        })
      },
    },
    beforeMount(){
      this.getOnlineList();
    }
  }

</script>


<style scope>
  #online {
    padding: 10px;
  }

  .online-wrap {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

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
