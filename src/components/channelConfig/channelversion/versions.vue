<template>
  <div class="container-wrapper">
    <div style="border: 1px solid #D3DCE6;padding: 10px">
      <div style="position:relative">
        <el-button type="primary" @click="add">添加</el-button>
      </div>
      <el-table
        :data="channelData.system_enums"
        border
        style="width: 100%;margin-top: 20px">
        <el-table-column
          prop="id"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="版本名">
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button size="small" @click="update(scope.row)">修改</el-button>
            <el-button size="small" type="primary" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="channelData.current_page"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="channelData.total_count"
        class="page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  export default {
    data: () => ({
      data: [],
      currentPage: 1,
      pageSize: 20,
      totalSize: 0
    }),
    computed: {
      ...mapGetters(['channelData'])
    },
    watch: {
      channelData(){
        return this.channelData
      }
    },
    methods: {
      ...mapActions(['getChannelData', 'addChannel', 'updateChannel', 'deleteChannel']),
      add(){
        this.$prompt('请输入版本名', '添加版本', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[^0-9]{2,}/,
          inputErrorMessage: '格式不正确',
          message: '版本号的取名需保证排序时排在 all 关键字的后面，比如 360 / aaa / abc 都是错误的，bll / alm / amn 都是正确的。'
        }).then(({value}) => {
          this.addChannel({enum_type: 'version', name: value})
        })
      },
      update(data){
        this.$prompt('请输入版本名', '修改版本', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[^0-9]{2,}/,
          inputErrorMessage: '格式不正确',
          inputValue: data.name,
          message: '版本号的取名需保证排序时排在 all 关键字的后面，比如 360 / aaa / abc 都是错误的，bll / alm / amn 都是正确的。',
          inputValue: data.name
        }).then(({value}) => {
          this.updateChannel({id: data.id, enum_type: 'version', name: value}).then(res => {
            this.getInfo();
          })
        })
      },
      del(data){
        this.$confirm('您将删除版本' + data.name + ', 是否继续?', '删除版本', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteChannel({id: data.id}).then(res => {
            this.getInfo();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        })
      },
      //获取信息
      getInfo(){
        this.getChannelData({enum_type: 'version', limit: this.pageSize})
      },
      handleCurrentChange(val){
        this.getChannelData({enum_type: 'version', page: val, limit: this.pageSize})
      }
    },
    mounted(){
      this.getInfo();
    }
  }
</script>

<style lang="less" scope>

</style>
