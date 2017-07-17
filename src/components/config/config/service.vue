<template>
  <div class="config">
    <!--表格-->
    <div class="container-wrapper">
      <div style="position:relative">
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
        <el-select v-model="filter.is_client" placeholder="是否是客户端配置" style="display: inline-block; width: 180px;">
          <el-option label="取消" value="all"></el-option>
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false" checked></el-option>
        </el-select>
        <el-button type="primary" @click="filterActions">筛选</el-button>
        <el-button type="primary" @click="add" style="position: absolute;top:0;right: 70px">添加</el-button>
      </div>
      <el-tooltip class="item" effect="light" placement="bottom-end">
        <el-button style="position: absolute;top:20px;right: 20px">说明</el-button>
        <div slot="content" class="help-content">
          <p>
            每个设置项都可以区分平台(ios/android/pc/mac)和版本，选择<strong>all</strong>则表示全部平台或版本。<br>
            如果指定版本号，则只返回对应版本号的配置，否则返回通用版本的配置。<br>
            如果某些配置不想在客户端显示，则可以把「是否在客户端显示」设置为否，但 AUDITING_VERSIONS 和 JPUSH_AUTH 这两个配置必须一直为否，不能改为是。
          </p>
          <p>
          <ul>
            <li><strong>AUDITING_VERSIONS</strong>: 客户端"帮助问答"内容针对应用平台审核的版本号，例如: 1.0.3|1.0.4<br>
              此设置项与帮助问答管理关联，在帮助问答中添加指定版本的内容后，才可以在这里设置对应的版本号<br>
              此设置项如果为空，那么所有客户端将获取帮助问答管理中未设置版本号的内容。<br>
              * 此项的「是否在客户端显示」必须为否
            </li>
            <li><strong>JPUSH_AUTH</strong>: 极光推送的认证信息，结构为: app_key|secret，中间用|号分割<br>
              此信息对应不同的平台和版本，用于不同版本客户端的推送<br>
              * 此项的「是否在客户端显示」必须为否
            </li>
            <li><strong>PLAN_V100</strong>: 客户端针对指定版本开启审核模式，用于隐藏一些会导致审核不通过的功能，比如套餐购买。<br>
              其中<strong>100</strong>是指客户端版本<strong>1.0.0</strong>转换而来，<br>
              如果不添加此配置，客户端在检测键名不存在时，默认认为结果为<strong>true</strong>。
            </li>
            <li><strong>IOS_VERSION / ANDROID_VERSION / PC_VERSION / MAC_VERSION</strong>: 客户端根据此配置值来决定指定版本的更新动作:
              0:不更新/1:更新/2:强制更新<br>
              比如: <strong>1.0.3|1</strong>则表示1.0.3版提示更新<br>
              客户端在下次打开app登录时出现<strong>UPDATE_CONTENT</strong>更新内容<br>
              如果设置为2:强制更新，则只有客户端更新后才能正常使用
            </li>
            <li><strong>UPDATE_CONTENT</strong>: 版本更新内容</li>
            <li><strong>NOTICE_CONTENT</strong>: 公告内容</li>
            <li><strong>UPDATE_URL</strong>: 更新包下载地址</li>
            <li><strong>SHARE_URL</strong>: 分享连接地址</li>
            <li><strong>SHARE_IMG</strong>: 分享图片地址</li>
            <li><strong>DLOG_ALLOW_SEND</strong>: 是否允许客户端发送去向日志 true|false</li>
            <li><strong>DLOG_POOL_MAX_COUNT</strong>: 客户端去向日志池累计到多少条后提交 默认50</li>
            <li><strong>DLOG_POST_INTERVAL</strong>: 客户端提交去向日志间隔时间(秒) 默认600</li>
            <li><strong>FLOG_ALLOW_SEND</strong>: 是否允许客户端发送失败日志 true|false</li>
            <li><strong>FLOG_POOL_MAX_COUNT</strong>: 客户端失败日志池累计到多少条后提交 默认5</li>
            <li><strong>FLOG_POST_INTERVAL</strong>: 客户端提交失败日志间隔时间(秒) 默认60</li>
            <li><strong>FLOG_CLEAN_INTERVAL</strong>: 客户端失败日志清理间隔时间(秒) 默认300</li>
            <li><strong>QQ_GROUP</strong>: QQ群号</li>
            <li><strong>WX_OFFICAL_ACCOUNT</strong>: 微信公众号</li>
            <li><strong>TELEGRAM_GROUP</strong>: telegram群号</li>
            <li><strong>OFFICIAL_WEBSITE</strong>: 官方网站</li>
          </ul>
          </p>
        </div>
      </el-tooltip>

      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top: 10px">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          label="平台"
          width="80">
          <template scope="scope">
            {{scope.row.platform === 'all' ? '通用':scope.row.platform}}
          </template>
        </el-table-column>
        <el-table-column
          label="版本"
          width="80">
          <template scope="scope">
            {{scope.row.app_version === 'all' ? '通用':scope.row.app_version}}
          </template>
        </el-table-column>
        <el-table-column
          prop="app_version_number"
          label="版本号" width="100">
        </el-table-column>
        <el-table-column
          prop="key"
          label="键名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="value"
          label="键值">
        </el-table-column>
        <el-table-column
          label="是否客户端显示" width="120">
          <template scope="scope">
            {{scope.row.is_client?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="update(scope.$index,scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="del(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
      class="page">
    </el-pagination>
    <!--新增弹窗-->
    <el-dialog :title="pageInfo.name" v-model="dialogTableVisible_add" class="filex_dialog">
      <el-form :model="form" label-width="100px" label-position="left">
        <el-form-item label="平台" class="dot_tips">
          <el-select v-model="form.platform" placeholder="请选择" class="dot_tips">
            <el-option
              v-for="item in platform"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本" class="dot_tips">
          <el-select v-model="form.app_version" placeholder="请选择" class="dot_tips">
            <el-option
              v-for="(item,index) in versions.app_versions"
              :label="item.name == '全部版本'?'通用':item.name"
              :value="item.name" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="键名" class="dot_tips">
          <el-input v-model="form.key" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="键值" class="dot_tips">
          <el-input type="textarea" rows="5" v-model="form.value" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input type="text" v-model="form.app_version_number"></el-input>
        </el-form-item>
        <el-form-item label="是否客户端显示">
          <el-radio class="radio" v-model="form.is_client" label="true">是</el-radio>
          <el-radio class="radio" v-model="form.is_client" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" rows="5" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible_add = false">取 消</el-button>
        <el-button type="primary">
          <span @click="save">确定</span>
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  export default {
    data(){
      return {
        tableData: [],
        //分页
        pageSize: 15,
        currentPage: 1,
        totalSize: 0,
        platform_list: [
          {label: '取消', value: null},
          {label: '通用', value: 'all'},
          {label: 'IOS', value: 'ios'},
          {label: 'Android', value: 'android'},
          {label: 'PC', value: 'pc'},
          {label: 'MAC', value: 'mac'},
        ],
        /*弹窗*/
        platform: [
          {label: '通用', value: 'all'},
          {label: 'IOS', value: 'ios'},
          {label: 'Android', value: 'android'},
          {label: 'PC', value: 'pc'},
          {label: 'MAC', value: 'mac'},
        ],
        pageInfo: {
          id: 0,
          index: 0,
          name: ''
        },
        filter: {
          app_version: '',
          platform: '',
          is_client: ''
        },
        dialogTableVisible_add: false,
        form: {
          platform: '',
          app_version: '',
          key: '',
          value: '',
          is_client: 'true',
          description: '',
          app_version_number: ''
        }
      }
    },
    computed: {
      ...mapGetters(['versions']),
      appVersions(){
        let parm = [...this.versions.app_versions];
        parm.unshift({"name": "取消"});
        return parm
      }
    },
    methods: {
      /*获取*/
      getList(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.system_settings,
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
      /*添加*/
      addInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.system_settings,
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
      delInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.system_settings_up.replace(/{id}/g, parm.id);
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
      upInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.system_settings_up.replace(/{id}/g, parm.id);
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
      //筛选
      filterActions(){
        this.getData(1)
      },
      getData(val){
        let options = {
          page: val,
          limit: this.pageSize,
          app_version: this.filter.app_version,
          platform: this.filter.platform,
          is_client: this.filter.is_client
        }
        if (options.app_version == '通用') {
          options.app_version = 'all'
        }
        if (options.app_version == '取消') {
          delete options.app_version
        }
        if (options.is_client == 'all') {
          delete options.is_client
        }
        this.getList(options).then(res => {
          this.tableData = res.data.data.settings;
          this.currentPage = res.data.data.current_page;
          this.totalSize = res.data.data.total_count
        })
      },
      handleCurrentChange(val){
        this.getData(val)
      },
      add(){
        this.pageInfo.name = '添加配置'
        this.dialogTableVisible_add = true
        this.form = {
          platform: '',
          app_version: '',
          key: '',
          value: '',
          description: '',
          is_client: 'true',
          app_version_number: ''
        }
      },
      update(index, data){
        this.form = Object.assign({}, data)
        if (data.is_client) {
          this.form.is_client = 'true'
        } else {
          this.form.is_client = 'false'
        }
        this.pageInfo.name = '修改配置'
        this.pageInfo.id = data.id
        this.pageInfo.index = index,
          this.dialogTableVisible_add = true
        if (this.form.app_version == 'all') {
          this.form.app_version = '通用'
        }
      },
      del(index, data){
        this.pageInfo.index = index;
        this.pageInfo.name = '删除配置'
        this.$confirm('此将删除删除配置' + data.key + ',是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var options = this.form;
          options.id = data.id;
          this.delInfo(options).then(res => {
            if (res.data.success) {
              this.$message({
                message: '恭喜你，删除成功',
                duration: 1000,
                type: 'success'
              });
              this.tableData.splice(this.pageInfo.index, 1);
              this.dialogTableVisible_add = false;
            }

          })
        })
      },
      save(){
        /*保存添加*/
        if (this.pageInfo.name === '添加配置') {
          var options = Object.assign({}, this.form);
          if (options.platform == '全部平台') {
            options.platform = 'all'
          }
          if (options.app_version == '全部版本') {
            options.app_version = 'all'
          }
          this.addInfo(options).then(res => {
            if (res.data.success) {
              this.dialogTableVisible_add = true;
              this.$message({
                message: '恭喜你，添加成功',
                duration: 1000,
                type: 'success'
              });
              this.tableData.unshift(res.data.data)
              this.dialogTableVisible_add = false;
            }
          })
        }
        /*保存修改*/
        if (this.pageInfo.name === '修改配置') {
          var options = Object.assign({}, this.form);
          options.id = this.pageInfo.id;
          if (options.platform == '全部平台') {
            options.platform = 'all'
          }
          if(options.app_version == '全部版本'){
              options.app_version = 'all'
          }
          if (options.app_version == '通用') {
            options.app_version = 'all'
          }
          this.upInfo(options).then(res => {
            if (res.data.success) {
              this.$message({
                message: '恭喜你，修改成功',
                duration: 1000,
                type: 'success'
              });
              this.tableData.splice(this.pageInfo.index, 1, res.data.data)
              this.dialogTableVisible_add = false;
            }
          })
        }
      }
    },
    mounted(){
      this.getData(1)
    }
  }
</script>
<style scoped>
  .config {
    padding: 10px;
  }

  .breadcrumb {
    height: 30px;
    line-height: 30px;
  }

  .container-wrapper {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }

  .el-select {
    width: 100%;
  }

  .el-form-item__content {
    text-align: left;
  }
</style>
