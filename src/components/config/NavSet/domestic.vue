<template>
  <div>
    <div class="feedback-wrapper">
      <el-row>
        <el-button type="primary" @click="addRow" style="margin-bottom: 10px">新增</el-button>
      </el-row>
      <el-table
        :data="data"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="网站标识"
          property="website_type"
          width="80">
          <template scope="scope">
            {{ scope.row.website_type == 1 ? '推荐' : '火热' }}
          </template>
        </el-table-column>
        <el-table-column
          property="sort_id"
          width="120"
          label="网站序号">
        </el-table-column>
        <el-table-column
          property="icon_url"
          width="120"
          label="网站图标">
        </el-table-column>
        <el-table-column
          property="name"
          label="网站名称">
        </el-table-column>
        <el-table-column
          property="description"
          label="网站描述">
        </el-table-column>
        <el-table-column
          property="url"
          label="网站地址">
        </el-table-column>
        <el-table-column
          label="操作功能">
          <template scope="scope">
            <span>
                <el-button size="small" @click="updateRow(scope.row,scope.$index)">修改</el-button>
                <el-button type="danger" size="small" @click="delRow(scope.row,scope.$index)">删除</el-button>
            </span>
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
    <!--新增-->
    <el-dialog :title="pageInfo.name" v-model="dialogVisible" @close="closeBlock" class="filex_dialog">
      <el-form :model="form" label-width="120px" label-position="left">
        <el-form-item label="网站名称" class="dot_tips">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站URL" class="dot_tips">
          <el-input v-model="form.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站图标URL" class="dot_tips">
          <el-input v-model="form.icon_url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站类型" class="dot_tips">
          <el-radio class="radio" v-model="form.website_type" label="1">推荐</el-radio>
          <el-radio class="radio" v-model="form.website_type" label="2">火热</el-radio>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.sort_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否是国内">
          <el-radio class="radio" v-model="form.is_domestic" label="true">国内</el-radio>
          <el-radio class="radio" v-model="form.is_domestic" label="false">国外</el-radio>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" auto-complete="off" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sava">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除-->
    <el-dialog title="删除" v-model="dialogVisible_del" size="tiny">
      <span>您确定要删除<b style="color: orangered">{{pageInfo.url}}</b></span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible_del = false">取 消</el-button>
    <el-button type="primary" @click="sava">确 定</el-button>
    </span>
    </el-dialog>
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
        totalPages: 0,
        //dialog
        dialogVisible: false,
        dialogVisible_del: false,
        form: {
          name: '',
          url: '',
          icon_url: '',
          website_type: '1',
          sort_id: 0,
          is_domestic: 'false',
          description: ''
        },
        pageInfo: {
          name: '',
          index: 0,
          url: '',
          id: 0
        }
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
            data: parm,
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
            data: parm,
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
            data: parm,
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
          let data = res.data.data
          this.data = [...data.items]
          this.totalPages = data.total_count
        })
      },
      closeBlock() {

      },
      addRow(){
        this.form = Object.assign({}, {
          name: '',
          url: '',
          icon_url: '',
          website_type: '1',
          sort_id: 0,
          is_domestic: 'false',
          description: ''
        })
        this.pageInfo.name = '新增'
        this.dialogVisible = true
      },
      updateRow(data, index){
        this.form = Object.assign({}, data)
        this.form.website_type = String(data.website_type)
        this.form.is_domestic = String(data.is_domestic)
        this.pageInfo.name = '修改'
        this.pageInfo.index = index
        this.dialogVisible = true
      },
      delRow(data, index){
        this.pageInfo.index = index
        this.dialogVisible_del = true
        this.pageInfo.url = data.url
        this.pageInfo.id = data.id
        this.pageInfo.index = index
        this.pageInfo.name = '删除'
      },
      sava(){
        if (this.pageInfo.name == '新增') {
          let options = Object.assign({}, this.form)
          options.is_domestic = String(this.form.is_domestic)
          options.website_type = parseInt(this.form.website_type)
          this.create(options).then(res => {
            if (res.data.success) {
              if (this.form.is_domestic == this.$route.query.type) {
                this.data.unshift(res.data.data)
              }
              this.dialogVisible = false
            }
          })
        }
        if (this.pageInfo.name == '修改') {
          let options = Object.assign({}, this.form)
          options.is_domestic = String(this.form.is_domestic)
          options.website_type = parseInt(this.form.website_type)
          this.update(options).then(res => {
            if (res.data.success) {
              this.data.splice(this.pageInfo.index, 1, res.data.data)
              this.dialogVisible = false
            }
          })
        }
        if (this.pageInfo.name == '删除') {
          this.delete({id: this.pageInfo.id}).then(res => {
            if (res.data.success) {
              this.data.splice(this.pageInfo.index, 1)
              this.dialogVisible_del = false
            }
          })
        }
      },
      //分页action
      handleCurrentChange (val) {
        this.currentPage = val
        this.getDate(val)
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.currentPage = 1
        vm.getList({is_domestic: vm.$route.query.type, page: 1, limit: vm.pageSize}).then(res => {
          let data = res.data.data
          vm.data = [...data.items]
          vm.totalPages = data.total_count
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
