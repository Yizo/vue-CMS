<template>
  <div id="feedback">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="feedback-wrapper">
      <div class="feedback-filter">
        <template>
          <el-select v-model="appChannelValue" placeholder="切换渠道" size="small" @change="feedbackFilter"
                     style="width: 200px">
            <el-option
              v-for="item in versions.app_channels"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template>
          <el-select v-model="appVersionValue" placeholder="版本选择" size="small" @change="feedbackFilter"
                     style="width: 200px">
            <el-option
              v-for="item in versions.app_versions"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </div>
      <el-table
        :data="feedbackData"
        highlight-current-row
        @current-change="handleCurrentRowChange"
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
              close-transition>{{scope.row.reply_content ? '是': '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="用户阅读"
          width="100">
          <template scope="scope">
            <el-tag
              :type="scope.row.has_read ? 'success' : 'primary'"
              close-transition>{{scope.row.has_read ? '已读': '未读'}}
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalPages"
          layout="total,prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" class="filex_dialog">
      <el-form :model="feedback">
        <el-form-item label="账号名称" :label-width="formLabelWidth">
          <el-input v-model="feedback.user_name" auto-complete="off" readonly style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="问题类型" :label-width="formLabelWidth">
          <el-input v-model="feedback.feedback_type" auto-complete="off" readonly style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="问题内容" :label-width="formLabelWidth">
          <el-input v-model="feedback.content" auto-complete="off" readonly style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="处理结果答复" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="feedback.reply_content" auto-complete="off" style="width:300px"
                    :autosize="{ minRows: 2, maxRows: 6}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">暂不处理</el-button>
        <el-button type="primary" @click="handleDeal">确定保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data (){
      return {
        appChannelValue: '',
        appVersionValue: '',
        currentPage: 1,
        limit: 15,
        pageSize: 20,
        totalPages: 1,
        feedbackData: [],
        dialogTitle: '',
        dialogFormVisible: false,
        formLabelWidth: '128px',
        feedback: {
          user_id: '',
          feedback_type: '',
          content: '',
          reply_content: ''
        },
        currentRow: null,
        currentRowIndex: 0
      }
    },
    components: {},
    computed: {
      ...mapGetters(['versions'])
    },
    methods: {
      handleDealPromise(){
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        const {id, reply_content} = this.feedback;
        const url = `${API.feedback_update}${id}`;
        const params = {
          id,
          reply_content
        };
        if (!params.reply_content) {
          this.$message({
            showClose: true,
            message: '答复内容必填',
            type: 'warning'
          });
          return false
        } else {
          return this.$http({
            url,
            params,
            method: 'PATCH',
            headers: {'Authorization': token}
          })
        }
      },
      handleDeal(){
        this.handleDealPromise().then((res) => {
          const index = this.currentRowIndex;
          this.feedbackData.splice(index, 1, res.data.data);
        });
        this.dialogFormVisible = false;
      },
      handleWatch(index, row){
        this.feedback = Object.assign({}, this.feedbackData[index]);
        this.currentRowIndex = index;
        this.dialogFormVisible = true;
        this.dialogTitle = '问题详情';
      },
      handleCurrentRowChange(val) {
        this.currentRow = val;
      },
      getFeedbackDataPromise(){
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        const app_version = this.getAppVersion();
        const app_channel = this.getAppChannel();
        const params = {
          app_version,
          app_channel,
          page: this.currentPage,
          limit: this.limit,
        };
        const url = API.feedback_get;
        return this.$http({
          url,
          params,
          method: 'GET',
          headers: {'Authorization': token}
        })
      },
      getAppChannel(){
        let appChannel = '';
        this.versions.app_channels.forEach((item) => {
          if (item.id == this.appChannelValue && item.id) {
            appChannel = item.name
          }
        });
        return appChannel;
      },
      getAppVersion(){
        let appVersion = '';
        this.versions.app_versions.forEach((item) => {
          if (item.id == this.appVersionValue && item.id) {
            appVersion = item.name
          }
        });
        return appVersion;
      },
      getFeedbackData(){
        this.getFeedbackDataPromise().then((res) => {
          const data = res.data.data;
          this.feedbackData = [...data.feedbacks];
          this.currentPage = data.current_page;
          this.totalPages = data.total_count;
        })
      },
      feedbackFilter(){
        this.getFeedbackData();
      },
      //分页action
      handleSizeChange(val){
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.getFeedbackData();
      }
    },
    beforeMount(){
      this.getFeedbackData();
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
