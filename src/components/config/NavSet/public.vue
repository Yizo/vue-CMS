<template>
  <div>
    <div class="feedback-wrapper">
      <el-table
        :data="data"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="编号"
          property="id"
          width="80">
        </el-table-column>
        <el-table-column
          property="feedback_type"
          width="120"
          label="问题类型">
        </el-table-column>
        <el-table-column
          property="app_version"
          label="版本信息">
        </el-table-column>
        <el-table-column
          property="user_name"
          label="账号">
        </el-table-column>
        <el-table-column
          property="created_at"
          label="提交日期">
          <template scope="scope">
            <span>{{scope.row.created_at | Time}}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="content"
          label="问题描述">
        </el-table-column>

        <el-table-column
          property="processed_at"
          label="处理日期">
          <template scope="scope">
            <span>{{scope.row.processed_at | Time}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="处理状态">
          <template scope="scope">
            <el-tag
              :type="scope.row.reply_content ? 'success' : 'primary'"
              close-transition>{{scope.row.reply_content ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="用户阅读"
          width="100">
          <template scope="scope">
            <el-tag
              :type="scope.row.has_read ? 'success' : 'primary'"
              close-transition>{{scope.row.has_read ? '已读' : '未读'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          property="reply_content"
          label="客服回复">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template scope="scope">
            <el-button
              type="info"
              size="small"
              @click="handleWatch(scope.$index, scope.row)">详细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right;margin: 15px 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalPages"
          layout="total,prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
  import * as API from '../../../api/api'
  export default {
    data (){
      return {
        data: [],
        start: true,
        currentPage: 0,
        pageSize: 20,
        totalPages: 0
      }
    },
    components: {},
    methods: {
      /*列表*/
      getList(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.help_navigations_list,
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
      /*创建*/
      create(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.help_navigations_create.replace(/{id}/g, parm.id);
          this.$http({
            method: 'POST',
            url: address,
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
      /*删除*/
      delete(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.help_navigations_del.replace(/{id}/g, parm.id);
          this.$http({
            method: 'DELETE',
            url: address,
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
      /*更新*/
      update(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.help_navigations_up.replace(/{id}/g, parm.id);
          this.$http({
            method: 'PATCH',
            url: address,
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
      getDate(num){
        this.currentPage = num
        this.getList({is_domestic: this.$route.query.type, page: num, limit: this.pageSize}).then(res => {

        })
      },
      //分页action
      handleCurrentChange(val){
        this.currentPage = val;
        this.getDate(val);
      },
    },
    beforeRouteEnter(to, from, next){
      next(vm => {
        vm.currentPage = 1
        vm.getList({is_domestic: vm.$route.query.type, page: 1, limit: vm.pageSize}).then(res => {

        })
      })
    }
  }
</script>

<style scoped>
  #feedback {
    padding: 10px;
  }

  .feedback-wrapper {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .feedback-filter {
    margin-bottom: 15px;
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

  .el-select {
    width: 200px;
  }

  .el-input {
    width: 200px;
  }
</style>
