<template>
  <div>
    <el-table
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="stat_date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="arup"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="arup"
        label="套餐名">
      </el-table-column>
      <el-table-column
        prop="arup"
        label="金额">
      </el-table-column>
      <el-table-column
        prop="arup"
        label="获得钻石">
      </el-table-column>
      <el-table-column
        prop="arup"
        label="支付方式">
      </el-table-column>
      <el-table-column
        prop="arup"
        label="状态">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  export default {
    props: {
      id: {
        type: Number
      }
    },
    data(){
      return {
        data: []
      }
    },
    methods: {
      getInfo(parm){
        let id = window.sessionStorage.getItem('userId');
        let address = API.u_transaction_logs.replace(/{id}/g, id);
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: address,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      }
    },
    mounted(){
      this.getInfo().then(res => {
        console.log(res)
      })
    },
    methods: {},
    mounted(){

    }

  }
</script>
