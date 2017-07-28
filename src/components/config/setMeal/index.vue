<template>
  <div id="setMeal">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>收费管理</el-breadcrumb-item>
      <el-breadcrumb-item>套餐配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="setMeal-wrapper">
      <div style="position:relative;margin-bottom: 10px">
        <el-select v-model="filter.platform" placeholder="平台筛选"
                   style="display: inline-block;width: 200px">
          <el-option
            v-for="item in platform_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="filter.app_version" placeholder="版本筛选" style="display: inline-block;width: 200px">
          <el-option
            v-for="(item,index) in appVersions"
            :label="item.name == '全部版本'?'通用':item.name"
            :value="item.name == '全部版本'?'all':item.name" :key="index">
          </el-option>
        </el-select>
        <el-input v-model="filter.app_version_number" placeholder="版本号"
                  style="display: inline-block;width: 200px"></el-input>
        <el-select v-model="filter.is_enabled" placeholder="是否启用"
                   style="display: inline-block;width: 150px">
          <el-option value="取消" label="取消"></el-option>
          <el-option value="true" label="是"></el-option>
          <el-option value="false" label="否"></el-option>
        </el-select>
        <el-select v-model="filter.is_audit" placeholder="审核套餐"
                   style="display: inline-block;width: 150px">
          <el-option value="取消" label="取消"></el-option>
          <el-option value="true" label="是"></el-option>
          <el-option value="false" label="否"></el-option>
        </el-select>
        <el-select v-model="filter.is_iap" placeholder="IAP套餐"
                   style="display: inline-block;width: 150px">
          <el-option value="取消" label="取消"></el-option>
          <el-option value="true" label="是"></el-option>
          <el-option value="false" label="否"></el-option>
        </el-select>
        <el-button type="primary" @click="filterHelp">筛选</el-button>
        <el-button type="primary" @click="handleAdd('form')" style="position: absolute;top:0;right: 20px">添加</el-button>
      </div>
      <el-table
        :data="plans"
        highlight-current-row
        @current-change="handleCurrentRowChange"
        style="width: 100%">
        <el-table-column
          label="ID"
          property="id"
          width="60">
        </el-table-column>
        <el-table-column
          property="name"
          label="名称">
        </el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="80">
        </el-table-column>
        <el-table-column
          property="coins"
          label="获得钻石"
          width="100">
        </el-table-column>
        <el-table-column
          property="present_coins"
          label="赠送钻石"
          width="100">
        </el-table-column>
        <el-table-column
          label="平台"
          width="80">
          <template scope="scope">
            {{scope.row.platform == 'all' ? '通用' : scope.row.platform}}
          </template>
        </el-table-column>
        <el-table-column
          label="版本"
          width="90">
          <template scope="scope">
            {{scope.row.app_version == "all" ? '通用' : scope.row.app_version}}
          </template>
        </el-table-column>
        <el-table-column
          property="app_version_number"
          label="版本号"
          width="100">
        </el-table-column>
        <el-table-column
          label="启用"
          width="90">
          <template scope="scope">
            <el-tag
              :type="scope.row.is_enabled ? 'success' : 'primary'"
              close-transition>{{scope.row.is_enabled ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="审核套餐"
          width="100">
          <template scope="scope">
            <el-tag
              :type="scope.row.is_audit ? 'success' : 'primary'"
              close-transition>{{scope.row.is_audit ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="IAP套餐">
          <template scope="scope">
            <el-tag
              :type="scope.row.is_iap ? 'success' : 'primary'"
              close-transition>{{scope.row.is_iap ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          property="description"
          label="描述">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>

            <el-button size="small" :class="{a:scope.row.is_enabled,b:!scope.row.is_enabled}" @click="star(scope.row)">
              {{scope.row.is_enabled ? '禁用' : '启用'}}
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
          layout="total,prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" @close="closeBlcok" class="filex_dialog">
      <el-form :model="form" :rules="add_rules" ref="form" label-position="left">
        <el-form-item label="套餐名称" :label-width="formLabelWidth" prop="name" class="dot_tips">
          <el-input v-model="form.name" auto-complete="off" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="购买价格" :label-width="formLabelWidth" prop="price" class="dot_tips">
          <el-input v-model="form.price" auto-complete="off" style="width:300px" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="获得钻石" :label-width="formLabelWidth" prop="coins" class="dot_tips">
          <el-input v-model="form.coins" auto-complete="off" style="width:300px" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="赠送钻石" :label-width="formLabelWidth" prop="present_coins">
          <el-input v-model="form.present_coins" auto-complete="off" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="套餐平台" :label-width="formLabelWidth">
          <el-select v-model="form.platform" placeholder="选择平台" style="width:300px">
            <el-option
              v-for="item in platform"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="套餐版本" :label-width="formLabelWidth">
          <el-select v-model="form.app_version" placeholder="选择版本" style="width:300px">
            <el-option
              v-for="(item,index) in versions.app_versions"
              v-if="item.name != '取消'"
              :label="item.name == '全部版本'?'通用':item.name"
              :value="item.name" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="套餐版本号" :label-width="formLabelWidth">
          <el-input v-model="form.app_version_number" placeholder="版本号" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <template scope>
            <el-radio-group v-model="form.is_enabled">
              <el-radio label="enabled1">是</el-radio>
              <el-radio label="enabled2">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="是否为审核套餐" :label-width="formLabelWidth">
          <template scope>
            <el-radio-group v-model="form.is_audit">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="是否是IAP套餐" :label-width="formLabelWidth">
          <template scope>
            <el-radio-group v-model="form.is_iap">
              <el-radio label="iap1">是</el-radio>
              <el-radio label="iap2">否</el-radio>
            </el-radio-group>
            <span style="margin-left: 10px;color: #888">(苹果应用内付费)</span>
          </template>
        </el-form-item>
        <el-form-item label="IAP套餐ID" :label-width="formLabelWidth" prop="iap_id"
                      :class="{dot_tips:form.is_iap == 'iap1'}">
          <el-input v-model="form.iap_id" auto-complete="off" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="套餐描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description" auto-complete="off" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave('form')">确 定</el-button>
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
      let number2 = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('不能为空'));
          }
          setTimeout(() => {
            if (/^\d+$/.test(String(value)) == false) {
              callback(new Error('请输入数字'));
            } else {
              callback()
            }
          }, 1000);
        }, number = (rule, value, callback) => {
          setTimeout(() => {
            if (this.form.is_iap == 'iap2') {
              callback();
            } else {
              if (value === null) {
                callback(new Error('IAP套餐ID必填'))
              } else {
                callback()
              }
            }
          }, 1000);
        }, price = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('不能为空'));
          }
          setTimeout(() => {
            var is = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(String(value));
            if (!is) {
              callback(new Error('请输入数字'));
            } else {
              callback()
            }
          }, 1000);
        },
        presentCoins = (rule, value, callback) => {
          setTimeout(() => {
            if (value == '' || value == null) {
              callback();
            } else if (/^\d+$/.test(String(value)) == false) {
              callback(new Error('请输入数字'));
            } else {
              callback();
            }
          }, 1000);
        };
      return {
        currentPage: 1,
        pageSize: 20,
        totalPages: 0,
        plans: [],
        dialogTitle: '',
        formLabelWidth: '150px',
        dialogFormVisible: false,
        dialogVisibleDelete: false,
        handleType: 'add',
        curIndex: -1,
        deleteDialogName: '',
        platform_list: [
          {label: '取消', value: '取消'},
          {label: '通用', value: 'all'},
          {label: 'IOS', value: 'ios'},
          {label: 'Android', value: 'android'},
          {label: 'PC', value: 'pc'},
          {label: 'MAC', value: 'mac'},
        ],
        platform: [
          {label: '通用', value: 'all'},
          {label: 'IOS', value: 'ios'},
          {label: 'Android', value: 'android'},
          {label: 'PC', value: 'pc'},
          {label: 'MAC', value: 'mac'},
        ],
        filter: {
          app_version: '',
          platform: null,
          is_enabled: '',
          is_iap: '',
          is_audit: '',
          app_version_number: ''
        },
        form: {
          id: '',
          name: '',
          coins: '',
          price: '',
          present_coins: '',
          is_enabled: 'enabled2',
          is_iap: 'iap2',
          iap_id: '',
          is_audit: 'false',
          description: '',
          platform: '',
          app_version: '',
          app_version_number: ''
        },
        //新增校验
        add_rules: {
          name: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 50, message: '长度不能大于50', trigger: 'blur'}
          ],
          coins: [{validator: number2, trigger: 'blur'}],
          price: [{validator: price, trigger: 'blur'}],
          present_coins: [{validator: presentCoins, trigger: 'blur'}],
          iap_id: [{validator: number, trigger: 'blur'}]
        },
      }
    },
    components: {},
    computed: {
      ...mapGetters(['versions']),
      appVersions(){
        let parm = [...this.versions.app_versions];
        parm.unshift({"name": "取消"});
        return parm
      }
    },
    methods: {
      closeBlcok(){
        this.$refs.form.resetFields();
      },
      /*获取数据列表*/
      getSetMealPromise(){
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        const url = API.set_meal_get;
        const params = {
          page: this.currentPage,
          limit: this.pageSize
        };
        return this.$http({
          methods: 'GET',
          url: url,
          headers: {'Authorization': token},
          params: params
        })
      },

      /*添加配置*/
      handleAdd(form){
        this.form = {
          id: '',
          name: '',
          coins: '',
          price: '',
          present_coins: '',
          is_enabled: 'enabled2',
          is_iap: 'iap2',
          is_audit: 'false',
          iap_id: '',
          description: '',
          platform: 'all',
          app_version: '通用',
          app_version_number: ''
        };
        this.dialogTitle = '添加';
        this.dialogFormVisible = true;
        this.handleType = 'add'
      },
      /*修改*/
      handleEdit(index, row){
        const currPlan = this.plans[index];
        this.form = {...currPlan};
        this.form['is_enabled'] = currPlan['is_enabled'] ? 'enabled1' : 'enabled2';
        this.form['is_iap'] = currPlan['is_iap'] ? 'iap1' : 'iap2';
        this.form['is_audit'] = currPlan['is_audit'] ? 'true' : 'false';
        if (currPlan['platform'] != 'all') {
          this.form['platform'] = currPlan['platform']
        } else {
          this.form['platform'] = '通用'
        }
        if (currPlan['app_version'] != 'all') {
          this.form['app_version'] = currPlan['app_version']
        } else {
          this.form['app_version'] = '通用'
        }
        this.dialogTitle = '修改';
        this.dialogFormVisible = true;
        this.curIndex = index;
        this.handleType = 'update';
      },
      handleSavePromise(){
        const form = this.form;
        const params = {...this.form};
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        const {id} = {...params};
        let url, method;
        params['is_enabled'] = form['is_enabled'] === 'enabled1' || false;
        params['is_iap'] = form['is_iap'] === 'iap1' || false;
        if (params.platform == '通用') {
          params.platform = 'all'
        }
        if (params.app_version == '全部版本') {
          params.app_version = 'all'
        }
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
      handleSave(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.handleSavePromise().then((res) => {
                if (res.data.success) {
                  if (this.handleType == 'update') {
                    this.plans.splice(this.curIndex, 1, res.data.data);
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                  } else {
                    this.plans.push(res.data.data);
                  }
                }
                this.dialogFormVisible = false;
              }
            )
          }
        });
      },
      //启用或禁用
      star(data){
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        this.$http({
          method: 'PATCH',
          url: API.set_meal_update + "/" + data.id,
          headers: {'Authorization': token},
          params: {id: data.id, is_enabled: !data.is_enabled},
        }).then((res) => {
          this.plans.splice(this.plans.indexOf(data), 1, res.data.data)
        })
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
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
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

          }
        );
        this.dialogVisibleDelete = false
      },
      handleCurrentRowChange(val) {
        this.currentRow = val;
      },
      //分页action
      handleCurrentChange(val){
        this.currentPage = val;
        this.getSetMeal();
      },
      getSetMeal(){
        this.getSetMealPromise().then((res) => {
          const data = res.data.data;
          this.currentPage = data.current_page;
          this.totalPages = data.total_count;
          this.plans = [...data.plans];
        })
      },
      filterHelp(){
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        let params = {
          limit: this.pageSize,
          is_iap: this.filter.is_iap,
          is_enabled: this.filter.is_enabled,
          platform: this.filter.platform,
          app_version: this.filter.app_version,
          app_version_number: this.filter.app_version_number,
          is_audit: this.filter.is_audit,
        };
        this.$http({
          methods: 'GET',
          url: API.set_meal_get,
          headers: {'Authorization': token},
          params: params
        }).then(res => {
          const data = res.data.data;
          this.currentPage = data.current_page;
          this.totalPages = data.total_count;
          this.plans = [...data.plans];
        })
      }
    },
    beforeMount(){
      this.getSetMeal();
    }
  }
</script>


<style scoped>
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

  .a {
    background: #F9C855;
    color: #fff;
    border: #F9C855;
  }

  .b {
    background-color: #42D885;
    border: #42D885;
    color: #fff;
  }
</style>
