<template>
  <div class="filter">
    <el-radio-group v-model="radio" style="margin-right: 10px">
      <el-radio-button label="年"></el-radio-button>
      <el-radio-button label="月"></el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-model="value"
      :type="pickerType"
      placeholder="选择日期"
      @change="pick">
    </el-date-picker>
  </div>
</template>

<script>
  import * as JS from '../../../assets/js/js'
  export default {
    data(){
      return {
        //年月切换
        radio: '年',
        value: new Date()
      }
    },
    methods: {
      pick(){
        var a = {year: null, month: null}
        if (this.radio == '年') {
          a.year = new Date(this.value).getFullYear()
        } else {
          var year = new Date(this.value).getFullYear();
          var month = new Date(this.value).getMonth() + 1
          a = {year, month}
        }
        this.$store.dispatch('setTime', a);
        this.$emit('change');
      }
    },
    computed: {
      pickerType(){
        return this.radio == '年' ? 'year' : 'month'
      }
    }
  }
</script>

<style scoped>
  .filter {
    text-align: left;
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
</style>
