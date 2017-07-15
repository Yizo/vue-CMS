<template>
  <div class="loginIp-wrapper">
    <div style="margin-bottom: 10px">
      <el-input v-model="ser" placeholder="账号 or UUID" style="width:200px"></el-input>
      <template>
        <el-select v-model="filter2.channels" placeholder="切换渠道" style="width: 200px;">
          <el-option
            v-for="(item,index) in versions.app_channels"
            :label="item.name"
            :value="item.name" :key="index"
          >
          </el-option>
        </el-select>
      </template>
      <template>
        <el-select v-model="filter2.versions" placeholder="版本筛选" style="width: 200px;">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
      </template>
      <el-button icon="search" @click="search">搜索</el-button>
    </div>
    <el-table
      :default-sort="{prop: 'created_at'}"
      :data="data"
      @sort-change="sort"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号">
      </el-table-column>
      <el-table-column
        label="账号">
        <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="created_at"
        label="登录时间" width="200" min-width="200">
        <template scope="scope">
          {{scope.row.created_at | Time}}
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        label="用户IP"
        width="140"
        min-width="140">
      </el-table-column>
      <el-table-column
        prop="coord_method"
        label="解析方式">
      </el-table-column>
      <el-table-column
        prop="ip_region"
        label="IP解析">
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      class="page">
    </el-pagination>

    <user-detail :visab="user_dialogVisible" :name="username" @closeDialog="cdialog"></user-detail>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  import userDetail from '../../publicView/accoutInfo/index.vue'
  //  import
  export default{
    data(){
      return {
        data: [],
        currentPage: 1,
        pageSize: 15,
        total: 0,
        order_by: 'desc',
        ser: '',
        filter2: {
          versions: '',
          channels: '',
        },
        user_dialogVisible: false,
        username: '姓名',
      }
    },
    components: {
      userDetail
    },
    computed: {
      ...mapGetters(['versions'])
    },
    methods: {
      ...mapActions({
        ud_base: 'UD_base_info',
      }),
      cdialog(){
        this.user_dialogVisible = false
      },
      userInfo(row){
        this.username = row.username
        this.user_dialogVisible = true;
        window.sessionStorage.setItem('userId', row.user_id)
        this.ud_base({limit: 10})
      },
      //获取信息
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.loginip,
            headers: {'Authorization': token},
            params: parm,
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      handleCurrentChange(val){
        if (this.ser) {
          this.order_by = 'desc'
        }
        let options = {
          q: this.ser, limit: this.pageSize, order_by: 'desc', app_version: this.filter2.versions,
          app_channel: this.filter2.channels, page: val
        }
        if (!options.q) {
          delete options.q
        }
        if (!options.app_version) {
          delete options.app_version
        }
        if (!options.app_channel) {
          delete options.app_channel
        }
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs;
          this.currentPage = res.data.data.current_page;
          this.total = res.data.data.total_count;
        })
      },
      sort(column){
        if (column.order == "descending") {
          this.order_by = 'desc'
        } else {
          this.order_by = 'asc'
        }
        let options = {
          page: 1,
          limit: this.pageSize,
          order_by: this.order_by,
          q: this.ser
        }
        this.getInfo(options).then(res => {
          this.data = res.data.data.logs;
          this.currentPage = res.data.data.current_page;
          this.total = res.data.data.total_count;
        })
      },
      search(){
        let options = {
          q: this.ser, limit: this.pageSize, order_by: 'desc', app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        }
        if (!options.q) {
          delete options.q
        }
        if (!options.app_version) {
          delete options.app_version
        }
        if (!options.app_channel) {
          delete options.app_channel
        }
        this.getInfo(options).then(res => {
          this.data = [...res.data.data.logs];
          this.currentPage = res.data.data.current_page;
          this.total = res.data.data.total_count;
        })
      }
    },
  }
</script>

<style scoped>
  .loginIp-wrapper {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
  }
</style>

