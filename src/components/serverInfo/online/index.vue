<template>
  <div id="online">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器信息</el-breadcrumb-item>
      <el-breadcrumb-item>当前在线人数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="数据说明"
      type="info"
      description="在线人数及列表每10分钟更新一次" style="margin-top: 10px;text-align: left">
    </el-alert>
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
          width="80">
        </el-table-column>
        <el-table-column
          label="区域">
          <template scope="scope">
            {{scope.row.node_type_name}}-{{scope.row.region_name}}
          </template>
        </el-table-column>
        <el-table-column
          property="region_connections_count"
          label="总在线人数">
          <template scope="scope">
            <el-button type="primary" size="small" @click="handleDetails(scope.$index,scope.row)">
              {{scope.row.region_connections_count}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          property="name"
          label="线路名称">
          <template scope="scope">
            <el-button type="primary" size="small" @click="handleLineNameDetails(scope.$index,scope.row)">
              {{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          property="region_connections_count"
          label="在线人数">
          <template scope="scope">
            <el-button type="primary" size="small" @click="handleLinePersonDetails(scope.$index,scope.row)">
              {{scope.row.connections_count}}
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
          :total="totalSize"
          layout="total,prev, pager, next, jumper" class="page">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="详情" v-model="dialogVisible1">
      <person-info :regionId="region_id" v-on:changePage1="changePage1"></person-info>
    </el-dialog>
    <el-dialog title="详情" v-model="dialogVisible2" size="tiny">
      <region-area :nodeId="node_id" v-on:changePage2="changePage2" @AreaUser="showArea"></region-area>
    </el-dialog>
    <el-dialog title="详情" v-model="dialogVisible3">
      <person-line-infos :nodeId="node_id" v-on:changePage3="changePage3"></person-line-infos>
    </el-dialog>

    <el-dialog title="线路详情-人数详情" v-model="dialogVisible4">
      <areaUser :nodeId="node_id" v-on:changePage4="changePage4"></areaUser>
    </el-dialog>

  </div>
</template>


<script>

  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  import personInfo from './personInfos.vue'
  import regionArea from './regionArea.vue'
  import personLineInfos from './perosonLineInfos.vue'
  import areaUser from './regionAreaUser.vue'

  export default {
    data(){
      return {
        number: 0, //总在线人数
        currentPage: 1,
        pageSize: 15,
        totalSize: 0,
        region_id: 0,
        node_id: 0,
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        currentPage4: 1,
        nodes: [],
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
      }
    },
    components: {personInfo, regionArea, personLineInfos, areaUser},
    methods: {
      //在线人数
      handleLinePersonDetails(index, row){
        this.region_id = row.region_id;
        this.node_id = row.id;
        this.$store.dispatch('getRegionLineDetails', {
          page: this.currentPage3,
          limit: this.pageSize,
          node_id: row.id,
        });
        this.dialogVisible3 = true;
      },
      //线路名称
      handleLineNameDetails(index, row){
        this.region_id = row.region_id;
        this.node_id = row.id;
        this.$store.dispatch('getRegionAreaDetails', {
          page: this.currentPage2,
          limit: this.pageSize,
          node_id: row.id
        });
        this.dialogVisible2 = true;
      },
      //线路详情-人数详情
      showArea(data){
        this.dialogVisible4 = true;
        let options = {
          node_id: this.node_id,
          ip_country: data.ip_country,
          ip_province: data.ip_province,
          ip_city: data.ip_city,
          page: 1,
          limit: this.pageSize
        }
        this.$store.dispatch('getRegionAreaUserDetails', options)
      },
      //总在线人数
      handleDetails(index, row){
        this.region_id = row.region_id;
        this.node_id = row.id;
        this.$store.dispatch('getPersonDetails', {
          page: this.currentPage1,
          limit: 15,
          node_id: row.id,
          node_region_id: row.region_id
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
      changePage4(val){
        this.currentPage4 = val;
      },
      getOnlineListPromise(){
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        const url = API.server_online_list_get;
        const params = {
          limit: this.pageSize,
          page: this.currentPage
        };
        return this.$http({
          methods: 'GET',
          url: url,
          headers: {'Authorization': token},
          params: params
        })
      },
      getOnlineList(){
        this.getOnlineListPromise().then((res) => {
          const data = res.data.data;
          this.number = data.online_users;
          this.nodes = [...data.nodes];
          this.currentPage = data.current_page;
          this.totalSize = data.total_count;
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
