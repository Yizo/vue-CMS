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
    <div style="display: inline-block;margin-left: 10px">
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
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
    </div>
  </div>
</template>

<script>
  import * as JS from '../../../assets/js/js'
  import {mapGetters}  from 'vuex'
  export default {
    data(){
      return {
        //年月切换
        radio: '年',
        value: new Date(),
        filter2: {
          versions: '',
          channels: '',
        }
      }
    },
    methods: {
      pick(val){
        let a = null;
        if (val.split("-").length == 1) {
          a = {year: val.split("-")[0]}
        } else {
          a = {year: val.split("-")[0], month: val.split("-")[1]}
        }
        this.date = Object.assign({}, a)
        this.$store.dispatch('setTime', a);
        this.$emit('change', {
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        });
      },
      filtration(){
        let options = {
          app_version: this.filter2.versions,
          app_channel: this.filter2.channels
        }
        for (var i in options) {
          if (options[i] === undefined || options[i] === '') {
            delete options[i]
          }
        }
        this.$emit('change', options);
      }
    },
    computed: {
      ...mapGetters(['versions']),
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
