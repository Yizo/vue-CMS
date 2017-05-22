<template>
  <div id="setMeal">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>收费管理</el-breadcrumb-item>
      <el-breadcrumb-item>套餐配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="setMeal-wrapper">
      <el-button type="primary" @click="handleAdd" style="margin: 15px 0;">添加</el-button>
      <el-table
        :data="plans"
        highlight-current-row
        @current-change="handleCurrentRowChange"
        style="width: 100%">
        <el-table-column
          label="编号"
          property="id"
          width="100">
        </el-table-column>
        <el-table-column
          property="name"
          label="套餐名称">
        </el-table-column>
        <el-table-column
          property="price"
          label="购买价格">
        </el-table-column>
        <el-table-column
          property="coins"
          label="获得钻石">
        </el-table-column>
        <el-table-column
          property="present_coins"
          label="赠送钻石">
        </el-table-column>
        <el-table-column
          property="description"
          label="套餐描述">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
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
          :total="totalPages"
          layout="prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="账号名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="购买价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" auto-complete="off" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="获得钻石" :label-width="formLabelWidth">
          <el-input v-model="form.coins" auto-complete="off" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="赠送钻石" :label-width="formLabelWidth">
          <el-input v-model="form.present_coins" auto-complete="off" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <template scope>
            <el-radio-group v-model="form.is_enabled">
              <el-radio label="enabled1">是</el-radio>
              <el-radio label="enabled2">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="是否是IAP(苹果应用内付费)套餐" :label-width="formLabelWidth">
          <template scope>
            <el-radio-group v-model="form.is_iap">
              <el-radio label="iap1">是</el-radio>
              <el-radio label="iap2">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="套餐ID" :label-width="formLabelWidth">
          <el-input v-model="form.iap_id" auto-complete="off" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="套餐描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description" auto-complete="off" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" v-model="dialogVisibleDelete" size="tiny">
      <span>确定删除{{deleteDialogName}}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDelete = false">取 消</el-button>
        <el-button type="primary" @click="deletePlan">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import * as API from '../../../api/api'
  import {mapGetters} from 'vuex'

  export default {
    data(){
      return {
        currentPage: 1,
        limit: 15,
        pageSize: 1,
        totalPages: 1,
        plans: [],
        dialogTitle: '',
        formLabelWidth: '128px',
        dialogFormVisible: false,
        dialogVisibleDelete: false,
        handleType: 'add',
        curIndex: -1,
        deleteDialogName: '',
        form: {
          id: '',
          name: '',
          coins: '',
          price: '',
          present_coins: '',
          is_enabled: 'enabled2',
          is_iap: 'iap2',
          iap_id: '',
          description: ''
        }
      }
    },
    components: {},
    computed: {
      ...mapGetters(['token'])
    },
    methods: {
      /*获取数据列表*/
      getSetMealPromise(){
        const url = API.set_meal_get;
        const params = {
          page: this.currentPage,
          limit: this.limit
        };
        const token = this.token;
        return this.$http({
          methods: 'GET',
          url: url,
          headers: {'Authorization': token},
          params: params
        })
      },
      /*添加配置*/
      handleAdd(){
        this.form = {
          id: '',
          name: '',
          coins: '',
          price: '',
          present_coins: '',
          is_enabled: 'enabled2',
          is_iap: 'iap2',
          iap_id: '',
          description: ''
        };
        this.dialogTitle = '添加';
        this.dialogFormVisible = true;
        this.handleType = 'add';
      },
      /*修改*/
      handleEdit(index, row){
        const currPlan = this.plans[index];
        this.form = {...currPlan};
        this.form['is_enabled'] = currPlan['is_enabled'] ? 'enabled1' : 'enabled2';
        this.form['is_iap'] = currPlan['is_iap'] ? 'iap1' : 'iap2';
        this.dialogTitle = '修改';
        this.dialogFormVisible = true;
        this.curIndex = index;
        this.handleType = 'update';
      },
      handleSavePromise(){
        const form = this.form;
        const params = {...this.form};
        const token = this.token;
        const {id} = {...params};
        let url, method;
        params['is_enabled'] = form['is_enabled'] === 'enabled1' || false;
        params['is_iap'] = form['is_iap'] === 'iap1' || false;
        if (this.handleType == 'update') {
          url = `${API.set_meal_update}${id}`;
          method = 'PATCH';
        } else {
          url = API.set_meal_add;
          method = 'POST';
          delete params['id'];
        }
        return this.$http({
          method: method,
          url: url,
          headers: {'Authorization': token},
          params: params
        })
      },
      //保存
      handleSave(){
        this.handleSavePromise().then((res) => {
            if (this.handleType == 'update') {
              this.plans.splice(this.curIndex, 1, res.data.data);
            } else {
              if (this.plans.length < this.limit) {
                this.plans.push(res.data.data);
              }
            }
          }
        ).catch((err) => {
          alert(err)
        });
        this.dialogFormVisible = false
      },
      /*删除*/
      handleDelete(index, row){
        const currPlan = this.plans[index];
        const {name} = currPlan;
        this.form = {...currPlan};
        this.curIndex = index;
        this.deleteDialogName = name;
        this.dialogVisibleDelete = true
      },
      /*确认删除*/
      deletePlanPromise(){
        const {id} = this.form;
        const url = `${API.set_meal_delete}${id}`;
        const token = this.token;
        return this.$http({
          method: 'DELETE',
          url: url,
          headers: {'Authorization': token},
          params: {id: id}
        });
      },
      //删除
      deletePlan(){
        this.deletePlanPromise().then((res) => {
          this.plans.splice(this.curIndex, 1);
        }).catch((err) => {
            alert(err)
          }
        );
        this.dialogVisibleDelete = false
      },
      handleCurrentRowChange(val) {
        this.currentRow = val;
      },
      //分页action
      handleSizeChange(val){
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.getSetMeal();
      },
      getSetMeal(){
        this.getSetMealPromise().then((res) => {
          const data = res.data.data;
          this.currentPage = data.current_page;
          this.totalPages = data.total_pages * this.pageSize;
          this.plans = [...data.plans];
        }).catch((res)=>{
          this.$message({
            message: '网络异常',
            type: 'warning'
          });
        })
      }
    },
    beforeMount(){
      this.getSetMeal();
    }
  }
</script>


<style lang="less" scope>
  #setMeal {
    padding: 10px;
  }

  .setMeal-wrapper {
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
