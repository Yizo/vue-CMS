<template>
  <div>
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
        <!--        <el-table-column
                  property="region_connections_count"
                  label="总在线人数">
                  <template scope="scope">
                    <el-button type="primary" size="small" @click="handleDetails(scope.$index,scope.row)">
                      {{scope.row.region_connections_count}}
                    </el-button>
                  </template>
                </el-table-column>-->
        <el-table-column
          property="name"
          label="代理服务">
          <template scope="scope">
            <el-button type="primary" size="small" @click="handleLineNameDetails(scope.$index,scope.row)">
              {{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="国内外标识">
          <template scope="scope">
            <span>{{mark(scope.row.is_domestic)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="level"
          label="代理等级">
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
      <person-line-infos :nodeId="node_id" v-on:changePage3="changePage3" @AreaUser="userInfo"></person-line-infos>
    </el-dialog>

    <el-dialog title="线路详情-人数详情" v-model="dialogVisible4">
      <areaUser :nodeId="node_id" v-on:changePage4="changePage4" @AreaUser="userInfo"></areaUser>
    </el-dialog>


    <user-detail :visab="user_dialog" :name="username" @closeDialog="cdialog"></user-detail>

  </div>
</template>


<script>
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  import userDetail from '../../publicView/accoutInfo/index.vue'
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
        user_dialog: false,
        username: '姓名'
      }
    },
    components: {personInfo, regionArea, personLineInfos, areaUser, userDetail},
    methods: {
      ...mapActions({
        ud_base: 'UD_base_info',
      }),
      cdialog(){
        this.user_dialog = false
      },
      userInfo(row){
        this.username = row.username
        this.user_dialog = true;
        window.sessionStorage.setItem('userId', row.user_id)
        this.ud_base({limit: 10})
      },
      mark(data){
        if (data) {
          return '国内'
        } else {
          return '国外'
        }
      },
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


<style scoped>
  .online-wrap {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
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
