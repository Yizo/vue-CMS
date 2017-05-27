<template>
  <div class="dstip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>运营行为</el-breadcrumb-item>
      <el-breadcrumb-item>新增用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!--筛选-->
    <el-row style="text-align: left;margin-top: 20px">
      <div style="display: inline-block">
        <el-date-picker
          v-model="filter.start"
          type="month"
          placeholder="开始日期"
          @change="start_date">
        </el-date-picker>
        <el-date-picker
          v-model="filter.end"
          type="month"
          placeholder="结束日期"
          @change="end_date">
        </el-date-picker>
        <el-select v-model="filter.versions" placeholder="版本筛选">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
        <el-select v-model="filter.channels" placeholder="切换渠道">
          <el-option
            v-for="(item,index) in versions.app_channels"
            :label="item.name"
            :value="item.name" :key="index"
          >
          </el-option>
        </el-select>
      </div>
      <el-button style="margin-left: 40px" @click="filtration">筛选</el-button>
    </el-row>
    <!--视图-->
    <div class="warp">
      <div class="warp_col">
        <day class="c"></day>
      </div>
      <div class="warp_col">
        <month class="c"></month>
      </div>
    </div>
  </div>
</template>

<script>
  import day from './day.vue'
  import month from './month.vue'
  import {mapActions, mapGetters}  from 'vuex'
  export default{
    data: () => ({
      filter: {
        start: '',
        end: '',
        versions: '',
        channels: ''
      },
      pageSize: 10
    }),
    components: {
      day, month
    },
    computed: {
      ...mapGetters(['versions']),
    },
    methods: {
      ...mapActions({
        day: 'ADDDAY_DAY',
        month: 'ADDDAY_MONTH'
      }),
      //筛选
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      filtration(){
        if (this.filter.channels == '全部渠道') {
          this.filter.channels = ''
        }
        if (this.filter.versions == '全部版本') {
          this.filter.versions = ''
        }
        let options = {
          page: 1,
          limit: this.pageSize,
          app_version: this.filter.versions,
          app_channel: this.filter.channels,
          start_at: this.filter.start,
          end_at: this.filter.end
        }
        this.day(options);
        this.month(options);
      }
    },
    mounted(){
    }
  }
</script>

<style scoped>
  .dstip {
    padding: 10px;
  }

  .warp {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
    display: flex;
  }

  .warp_col {
    width: 50%;
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }
</style>
