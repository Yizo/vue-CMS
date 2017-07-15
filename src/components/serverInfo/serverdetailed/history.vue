<template>
  <div>
    <div style="margin-bottom: 10px;text-align: left">
      <el-date-picker
        v-model="filter.start"
        type="date"
        @change="start_date"
        placeholder="开始日期">
      </el-date-picker>
      <el-date-picker
        v-model="filter.end"
        type="date"
        @change="end_date"
        placeholder="结束日期">
      </el-date-picker>
      <el-select v-model="node" multiple placeholder="请选择" class="mul" style="height: 36px;overflow: hidden">
        <el-option
          v-for="item in nodes"
          :key="item.id"
          :label="item.name+'-'+item.url"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="filtration">筛选</el-button>
    </div>
    <div v-for="(item,index) in data" class="warp" :data-index="index">
      <p style="text-align: left;margin-bottom: 5px">
        <span v-if="node.length == 0">服务器:{{nodes[0].name}}-{{nodes[0].url}}</span>
        <span v-else>服务器:{{server[index].name}}-{{server[index].url}}</span>
      </p>
      <el-tabs v-model="activeNames[index].active" type="card"
               @tab-click="handleClick(index,activeNames[index].active)">
        <el-tab-pane label="CPU使用率(%)" name="cpu"></el-tab-pane>
        <el-tab-pane label="内存使用率(%)" name="ram"></el-tab-pane>
        <el-tab-pane label="磁盘已使用(%)" name="disk"></el-tab-pane>
        <el-tab-pane label="实时流量上行(kb/s)" name="up"></el-tab-pane>
        <el-tab-pane label="实时流量下行(kb/s)" name="down"></el-tab-pane>
        <el-tab-pane label="带宽占比(%)" name="bandwidth"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="10">
        <el-col :span="12">
          <div :id="'history_char'+index" style="height: 400px;border: 1px solid #D3DCE6">

          </div>
        </el-col>
        <el-col :span="12" v-if="item.list.length">
          <div v-show="activeNames[index].active == 'cpu'">
            <el-table :data="item.list" style="width: 100%" border>
              <el-table-column prop="stat_date" label="日期"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.min_cpu_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="min_cpu_percent" label="最小值"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.max_cpu_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="max_cpu_percent" label="最大值"></el-table-column>
              <el-table-column prop="average_cpu_percent" label="平均值"></el-table-column>
              <el-table-column label="详情">
                <template scope="scope">
                  <el-button size="small" @click="detatil(scope.row.stat_date,node[index])">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="activeNames[index].active == 'ram'">
            <el-table :data="item.list" style="width: 100%" border>
              <el-table-column prop="stat_date" label="日期"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.min_memory_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="min_memory_percent" label="最小值"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.max_memory_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="max_memory_percent" label="最大值"></el-table-column>
              <el-table-column prop="average_memory_percent" label="平均值"></el-table-column>
              <el-table-column label="详情">
                <template scope="scope">
                  <el-button size="small" @click="detatil(scope.row.stat_date,node[index])">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="activeNames[index].active == 'disk'">
            <el-table :data="item.list" style="width: 100%" border>
              <el-table-column prop="stat_date" label="日期"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.min_disk_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="min_disk_percent" label="最小值"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.max_disk_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="max_disk_percent" label="最大值"></el-table-column>
              <el-table-column prop="average_disk_percent" label="平均值"></el-table-column>
              <el-table-column label="详情">
                <template scope="scope">
                  <el-button size="small" @click="detatil(scope.row.stat_date,node[index])">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="activeNames[index].active == 'up'">
            <el-table :data="item.list" style="width: 100%" border>
              <el-table-column prop="stat_date" label="日期"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.min_network_speed_up_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="min_network_speed_up" label="最小值(kb/s)"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.max_network_speed_up_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="max_network_speed_up" label="最大值(kb/s)"></el-table-column>
              <el-table-column prop="average_network_speed_up" label="平均值(kb/s)"></el-table-column>
              <el-table-column label="详情">
                <template scope="scope">
                  <el-button size="small" @click="detatil(scope.row.stat_date,node[index])">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="activeNames[index].active == 'down'">
            <el-table :data="item.list" style="width: 100%" border>
              <el-table-column prop="stat_date" label="日期"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.min_network_speed_down_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="average_network_speed_down" label="最小值(kb/s)"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.max_network_speed_down_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="max_network_speed_down" label="最大值(kb/s)"></el-table-column>
              <el-table-column prop="average_network_speed_down" label="平均值(kb/s)"></el-table-column>
              <el-table-column label="详情">
                <template scope="scope">
                  <el-button size="small" @click="detatil(scope.row.stat_date,node[index])">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="activeNames[index].active == 'bandwidth'">
            <el-table :data="item.list" style="width: 100%" border>
              <el-table-column prop="stat_date" label="日期"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.min_bandwidth_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="min_bandwidth_percent" label="最小值"></el-table-column>
              <el-table-column label="时间点">
                <template scope="scope">{{scope.row.max_bandwidth_time | TimeHour}}</template>
              </el-table-column>
              <el-table-column prop="max_bandwidth_percent" label="最大值"></el-table-column>
              <el-table-column prop="average_bandwidth_percent" label="平均值"></el-table-column>
              <el-table-column label="详情">
                <template scope="scope">
                  <el-button size="small" @click="detatil(scope.row.stat_date,node[index])">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @current-change="handleCurrentChange"
            @click.native="handClick(index)"
            :current-page="currentPage"
            layout="total, prev, pager, next, jumper"
            :total="item.total"
            :page-size="pageSize"
            :data-ref="index"
            class="page">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="detail.name" :visible.sync="detail.show">
      <el-table :data="detail.data">
        <el-table-column property="hour_minute" label="时间" width="50"></el-table-column>
        <el-table-column property="node_name" label="服务器名"></el-table-column>
        <el-table-column property="cpu_percent" label="CPU使用率(%)"></el-table-column>
        <el-table-column property="memory_percent" label="内存使用率(%)"></el-table-column>
        <el-table-column property="disk_percent" label="磁盘剩余空间(%)"></el-table-column>
        <el-table-column property="network_speed_down" label="实时流量上行(kb/s)">
          <template scope="scope">
            <span>{{Math.floor((scope.row.network_speed_down / 1024) * 100) / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column property="network_speed_up" label="实时流量下行(kb/s)">
          <template scope="scope">
            <span>{{Math.floor((scope.row.network_speed_up / 1024) * 100) / 100}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-pagination
          @current-change="detailpaging"
          :current-page="detail.current"
          layout="total, prev, pager, next, jumper"
          :total="detail.total"
          :page-size="detail.pageSize"
          class="page">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import chartable from './char.vue'
  import {mapGetters, mapActions} from 'vuex'
  export default{
    data: () => ({
      parm: {},
      data: [],
      node: [],
      nodes: [],
      server: [],
      options: {
        title: {
          text: null
        },
        xAxis: {
          title: {
            text: ''
          },
          categories: []
        },
        yAxis: {
          title: {
            text: ''
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        series: [],
        tooltip: {
          shared: true,
          enabled: true
        },
        credits: false,
      },
      currentPage: 1,
      total: 0,
      pageSize: 10,
      row_index: 0,
      detailParm: {
        stat_date: '',
        node_id: 0
      },
      detail: {
        name: '',
        show: false,
        data: [],
        current: 1,
        total: 0,
        pageSize: 15
      },
      options: {
        title: {
          text: null
        },
        xAxis: {
          title: {
            text: ''
          },
          categories: []
        },
        yAxis: {
          title: {
            text: ''
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          crosshairs: {
            width: 2,
            color: 'gray',
            dashStyle: 'shortdot'
          }
        },
        series: [],
        credits: false
      },
      active: []
    }),
    components: {chartable},
    computed: {
      ...mapGetters(['initDate']),
      filter(){
        return this.initDate
      },
      activeNames(){
        let active = this.data.map((item) => {
          return {'active': 'cpu', 'name': 'cpu'}
        })
        return active || [{'active': 'cpu', 'name': 'cpu'}]
      },
    },
    methods: {
      start_date(val){
        this.filter.start = val
      },
      end_date(val){
        this.filter.end = val
      },
      handleClick(index, name) {
        this.options.series = this.AnalysisJSON2(this.data[index].char, name);
        //设置X轴
        this.options.xAxis.categories = [...this.setXAxis(this.data[index].char)]
        this.$HighCharts.chart('history_char' + index, this.options);
        this.activeNames[index].name = name
        this.active = [...this.activeNames]
      },
      filtration(){
        if (typeof this.filter.start == 'object') {
          this.filter.start = JS.Timestamp(this.filter.start)
        }
        if (typeof this.filter.end == 'object') {
          this.filter.end = JS.Timestamp(this.filter.end)
        }
        let options2 = {
          page: 1,
          limit: this.pageSize,
          start_at: this.filter.start,
          node_id: this.node,
          end_at: this.filter.end
        }
        if (options2.start_at && options2.end_at || !options2.start_at && !options2.end_at) {

        } else {
          this.$message({
            message: '日期必需同时选或同时不选',
            type: 'warning'
          });
          return false
        }
        this.parm = options2;
        this.server = []
        this.server = this.node.map((item) => {
          let a = this.nodes.filter((item2) => {
            return item2.id == item
          })
          return a[0]
        })
        this.data = this.node.map((item, index) => {
          let arry = {list: [], char: [], total: 0};
          let data = []
          this.getList({
            page: 1,
            limit: this.pageSize,
            start_at: this.filter.start,
            end_at: this.filter.end,
            node_id: item
          }).then(res => {
            arry.list = [...res.data.data.logs]
            arry.total = res.data.data.total_count
          })
          this.getChar({start_at: this.filter.start, end_at: this.filter.end, node_id: item}).then(res => {
            arry.char = [...res.data.data.logs]
            data.push(arry)
            this.active = [...this.activeNames]
          })

          return arry

        });
        setTimeout(() => {
          this.data.map((item, index) => {
            item.list.map((item2, index) => {
              item2.max_network_speed_down = Math.floor((item2.max_network_speed_down / 1024) * 100) / 100;
              item2.min_network_speed_down = Math.floor((item2.min_network_speed_down / 1024) * 100) / 100;
              item2.max_network_speed_up = Math.floor((item2.max_network_speed_up / 1024) * 100) / 100
              item2.min_network_speed_up = Math.floor((item2.min_network_speed_up / 1024) * 100) / 100;
              item2.average_network_speed_down = Math.floor((item2.average_network_speed_down / 1024) * 100) / 100;
              item2.average_network_speed_up = Math.floor((item2.average_network_speed_up / 1024) * 100) / 100;
              return item2
            })
            item.char.map((item3, index) => {
              item3.max_network_speed_down = Math.floor((item3.max_network_speed_down / 1024) * 100) / 100;
              item3.min_network_speed_down = Math.floor((item3.min_network_speed_down / 1024) * 100) / 100;
              item3.max_network_speed_up = Math.floor((item3.max_network_speed_up / 1024) * 100) / 100;
              item3.min_network_speed_up = Math.floor((item3.min_network_speed_up / 1024) * 100) / 100;
              item3.average_network_speed_down = Math.floor((item3.average_network_speed_down / 1024) * 100) / 100;
              item3.average_network_speed_up = Math.floor((item3.average_network_speed_up / 1024) * 100) / 100;
              return item3
            })
            return item
          })
          this.draw();
        }, 800)
      },
      getNodes(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_list_get,
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
      },
      getList(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_proxy_list,
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
      },
      getChar(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_proxy_char,
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
      },
      getDetail(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_proxy_details,
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
      },
      //表格数据
      AnalysisJSON(parm) {
        var result = []
        var keyList = {
          average_cpu_percent: '平均值',
          max_cpu_percent: '最大值',
          min_cpu_percent: '最小值'
        }
        var names = ['average_cpu_percent', 'max_cpu_percent', 'min_cpu_percent']
        for (var i = 0; i < names.length; i++) {
          var data = []
          for (var j = 0; j < parm.length; j++) {
            data.push(parseFloat(parm[j][names[i]]))
          }
          var item = {name: keyList[names[i]], data: data}
          result.push(item)
        }
        return result
      },
      AnalysisJSON2(parm, type) {
        var result = []
        var keyList = {}
        var names = []
        if (type == 'cpu') {
          keyList = {
            average_cpu_percent: '平均值',
            max_cpu_percent: '最大值',
            min_cpu_percent: '最小值'
          }
          names = ['average_cpu_percent', 'max_cpu_percent', 'min_cpu_percent']
        }
        if (type == 'ram') {
          keyList = {
            average_memory_percent: '平均值',
            max_memory_percent: '最大值',
            min_memory_percent: '最小值'
          }
          names = ['average_memory_percent', 'max_memory_percent', 'min_memory_percent']
        }
        if (type == 'disk') {
          keyList = {
            average_disk_percent: '平均值',
            max_disk_percent: '最大值',
            min_disk_percent: '最小值'
          }
          names = ['average_disk_percent', 'max_disk_percent', 'min_disk_percent']
        }
        if (type == 'up') {
          keyList = {
            average_network_speed_up: '平均值',
            max_network_speed_up: '最大值',
            min_network_speed_up: '最小值'
          }
          names = ['average_network_speed_up', 'max_network_speed_up', 'min_network_speed_up']
        }
        if (type == 'down') {
          keyList = {
            average_network_speed_down: '平均值',
            max_network_speed_down: '最大值',
            min_network_speed_down: '最小值'
          }
          names = ['average_network_speed_down', 'max_network_speed_down', 'min_network_speed_down']
        }
        if (type == 'bandwidth') {
          keyList = {
            average_bandwidth_percent: '平均值',
            max_bandwidth_percent: '最大值',
            min_bandwidth_percent: '最小值'
          }
          names = ['average_bandwidth_percent', 'max_bandwidth_percent', 'min_bandwidth_percent']
        }
        for (var i = 0; i < names.length; i++) {
          var data = []
          for (var j = 0; j < parm.length; j++) {
            data.push(parseFloat(parm[j][names[i]]))
          }
          var item = {name: keyList[names[i]], data: data}
          result.push(item)
        }
        return result
      },
      //设置Y轴
      setXAxis(parm){
        var arry = []
        for (var i in parm) {
          arry.push(parm[i].stat_date);
        }
        return arry
      },
      draw(){
        this.data.forEach((item, index) => {
          //设置数据
          this.options.series = this.AnalysisJSON(item.char);
          //设置X轴
          this.options.xAxis.categories = [...this.setXAxis(item.char)]
          this.$HighCharts.chart('history_char' + index, this.options);
        })
      },
      detatil(date, index){
        this.detailParm.stat_date = date
        this.detailParm.node_id = index || this.nodes[0].id
        this.detail.name = date
        this.detail.current = 1
        this.detail.show = true
        let options = {
          page: 1,
          limit: this.detail.pageSize,
          stat_date: this.detailParm.stat_date,
          node_id: this.detailParm.node_id
        }
        this.getDetail(options).then(res => {
          this.detail.data = res.data.data.logs;
          this.detail.total = res.data.data.total_count
        })
      },
      detailpaging(val){
        let options = {
          page: val,
          limit: this.detail.pageSize,
          stat_date: this.detailParm.stat_date,
          node_id: this.detailParm.node_id
        }
        this.detail.current = 1
        this.getDetail(options).then(res => {
          this.detail.data = res.data.data.logs;
          this.detail.total = res.data.data.total_count
        })
      },
      handleCurrentChange(val){
        let time = null
        clearTimeout(time)
        time = setTimeout(() => {
          this.pageSort(this.server[this.row_index].id, val)
        }, 20)
      },
      handClick(index){
        this.row_index = index;
      },
      //分页数据处理
      pageSort(id, val){
        let options2 = {
          page: val,
          limit: this.pageSize,
          start_at: this.filter.start,
          node_id: id,
          end_at: this.filter.end
        }
        this.getList(options2).then(res => {
          let current_data = res.data.data.logs.map((item2, index) => {
            item2.max_network_speed_down = Math.floor((item2.max_network_speed_down / 1024) * 100) / 100;
            item2.min_network_speed_down = Math.floor((item2.min_network_speed_down / 1024) * 100) / 100;
            item2.max_network_speed_up = Math.floor((item2.max_network_speed_up / 1024) * 100) / 100
            item2.min_network_speed_up = Math.floor((item2.min_network_speed_up / 1024) * 100) / 100;
            item2.average_network_speed_down = Math.floor((item2.average_network_speed_down / 1024) * 100) / 100;
            item2.average_network_speed_up = Math.floor((item2.average_network_speed_up / 1024) * 100) / 100;
            return item2
          })
          this.data[this.row_index].list = [...current_data]
        })

      },
      /*初始化数据*/
      init(){
        let options = {
          page: 1,
          level: 1,
          is_enabled: 'true'
        }
        this.getNodes(options).then(res => {
          this.nodes = [...res.data.data.nodes];
          this.server = [this.nodes[0]]
          this.node.push(this.nodes[0].id)
          let options2 = {
            page: 1,
            limit: this.pageSize,
            start_at: this.filter.start,
            node_id: res.data.data.nodes[0].id,
            end_at: this.filter.end
          }, options3 = {
            start_at: this.filter.start,
            end_at: this.filter.end,
            node_id: res.data.data.nodes[0].id,
          }
          this.parm = options2;

          let obj = {list: [], char: [], total: 0};
          this.getList(options2).then(res => {
            obj.list = [...res.data.data.logs]
            obj.total = res.data.data.total_count
          })
          this.getChar(options3).then(res => {
            obj.char = [...res.data.data.logs]
            this.data.push(obj)
            this.active = [...this.activeNames]
          })

          setTimeout(() => {
            this.data.map((item, index) => {
              item.list.map((item2, index) => {
                item2.max_network_speed_down = Math.floor((item2.max_network_speed_down / 1024) * 100) / 100;
                item2.min_network_speed_down = Math.floor((item2.min_network_speed_down / 1024) * 100) / 100;
                item2.max_network_speed_up = Math.floor((item2.max_network_speed_up / 1024) * 100) / 100
                item2.min_network_speed_up = Math.floor((item2.min_network_speed_up / 1024) * 100) / 100;
                item2.average_network_speed_down = Math.floor((item2.average_network_speed_down / 1024) * 100) / 100;
                item2.average_network_speed_up = Math.floor((item2.average_network_speed_up / 1024) * 100) / 100;
                return item2
              })
              item.char.map((item3, index) => {
                item3.max_network_speed_down = Math.floor((item3.max_network_speed_down / 1024) * 100) / 100;
                item3.min_network_speed_down = Math.floor((item3.min_network_speed_down / 1024) * 100) / 100;
                item3.max_network_speed_up = Math.floor((item3.max_network_speed_up / 1024) * 100) / 100;
                item3.min_network_speed_up = Math.floor((item3.min_network_speed_up / 1024) * 100) / 100;
                item3.average_network_speed_down = Math.floor((item3.average_network_speed_down / 1024) * 100) / 100;
                item3.average_network_speed_up = Math.floor((item3.average_network_speed_up / 1024) * 100) / 100;
                return item3
              })
              return item
            })
            this.draw()
          }, 300)

        })
      }
    },
    mounted(){
      this.init()
    }
  }
</script>

<style scoped>
  .setcss td {
    height: 20px;
    border: 1px solid red;
  }

  .warp {
    background-color: #fff;
    padding: 10px;
    margin-top: 10px;
  }

  @media screen and (max-width: 1200px) {
    .el-col-12 {
      width: 100%;
    }
  }
</style>
