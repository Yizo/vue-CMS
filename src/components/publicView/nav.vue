<template>
  <div id="nav" style="background-color: #324157">
    <el-menu theme="dark" :unique-opened="true" default-active="1-1" class="el-menu-vertical-demo">
      <el-menu-item-group class="level1" title="用户基础信息" v-if="roles.user_base_info">
        <el-menu-item index="1-1"><i class="iconfont icon-yonghuliebiao" transition="fadeOutLeft"></i>
          <router-link :to="{path:'/index'}" tag="span">用户列表</router-link>
        </el-menu-item>
        <el-submenu index="1-2">
          <template slot="title"><i class="iconfont icon-tongjitu"></i>统计表</template>
          <el-menu-item index="1-2-1">
            <router-link :to="{name:'hardware'}" tag="span">硬件统计</router-link>
          </el-menu-item>
          <el-menu-item index="1-2-2">
            <router-link :to="{name:'operator'}" tag="span">运营商统计</router-link>
          </el-menu-item>
          <el-menu-item index="1-2-3">
            <router-link :to="{name:'start'}" tag="span">用户状态统计</router-link>
          </el-menu-item>
          <el-menu-item index="1-2-4">
            <router-link :to="{name:'share'}" tag="span">分享统计</router-link>
          </el-menu-item>
          <el-menu-item index="1-2-5" v-if="roles.user_base_info">
            <router-link :to="{name:'website'}" tag="span">官网统计</router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu-item-group>
      <el-menu-item-group class="level1" title="用户行为" v-if="roles.user_behaviour">
        <el-submenu index="2-1">
          <template slot="title"><i class="iconfont icon-cdnffuwuqi"></i>服务器信息</template>
          <el-menu-item index="2-1-1">
            <router-link :to="{name:'online'}" tag="span">当前在线人数</router-link>
          </el-menu-item>
          <el-menu-item index="2-1-2">
            <router-link :to="{name:'serverdetailed'}" tag="span">服务器信息</router-link>
          </el-menu-item>
          <el-menu-item index="2-1-3">
            <router-link :to="{name:'dynamicipStar'}" tag="span">动态IP状态</router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="2-2"><i class="iconfont icon-denglu"></i>
          <router-link :to="{name:'loginip'}" tag="span">登录IP</router-link>
        </el-menu-item>
        <el-menu-item index="2-3"><i class="iconfont icon-quxiang"></i>
          <router-link :to="{name:'dstip'}" tag="span">去向IP</router-link>
        </el-menu-item>
        <el-menu-item index="2-4"><i class="iconfont icon-shijian"></i>
          <router-link :to="{name:'frequency'}" tag="span">用户使用频率</router-link>
        </el-menu-item>

        <el-menu-item index="2-5"><i class="iconfont icon-xiaolvdashiicon02-copy-copy"></i>
          <router-link :to="{name:'pageclick'}" tag="span">页面点击</router-link>
        </el-menu-item>
        <el-submenu index="2-6">
          <template slot="title"><i class="iconfont icon-shibai"></i>失败信息</template>
          <el-menu-item index="2-6-1">
            <router-link :to="{name:'loginfail'}" tag="span">登录失败</router-link>
          </el-menu-item>
          <el-menu-item index="2-6-2">
            <router-link :to="{name:'connfail'}" tag="span">连接失败</router-link>
          </el-menu-item>
          <el-menu-item index="2-6-3">
            <router-link :to="{name:'unexe'}" tag="span">用户未操作</router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu-item-group>
      <el-menu-item-group class="level1" title="运营行为" v-if="roles.operation_behaviour">
        <el-submenu index="3-1">
          <template slot="title"><i class="iconfont icon-chongzhi"></i>充值信息</template>
          <el-menu-item index="3-1-1">
            <router-link :to="{name:'payInfo'}" tag="span">付费信息</router-link>
          </el-menu-item>
          <el-menu-item index="3-1-2">
            <router-link :to="{name:'recharge'}" tag="span">充值记录</router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="3-2"><i class="iconfont icon-xinzengkehu"></i>
          <router-link :to="{name:'addday'}" tag="span">新增用户</router-link>
        </el-menu-item>
        <el-menu-item index="3-3"><i class="iconfont icon-huoyueyonghu"></i>
          <router-link :to="{name:'activeday'}" tag="span">活跃用户</router-link>
        </el-menu-item>
        <el-menu-item index="3-4"><i class="iconfont icon-liucun"></i>
          <router-link :to="{name:'remain'}" tag="span">留存</router-link>
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group class="level1" title="配置管理">
        <el-submenu index="4-1" v-if="roles.charge_manage">
          <template slot="title"><i class="iconfont icon-daibanshoufei"></i>收费管理</template>
          <el-menu-item index="4-1-1">
            <router-link :to="{name:'usertype'}" tag="span">用户类型配置</router-link>
          </el-menu-item>
          <el-menu-item index="4-1-2">
            <router-link :to="{name:'servertype'}" tag="span">服务类型配置</router-link>
          </el-menu-item>
          <el-menu-item index="4-1-3">
            <router-link :to="{name:'setMeal'}" tag="span">套餐配置</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4-2" v-if="roles.back_stage_manage">
          <template slot="title"><i class="iconfont icon-houtai"></i>后台管理</template>
          <el-menu-item index="4-2-1" v-if="roles.manage_role_create">
            <router-link :to="{name:'Authorization'}" tag="span">后台权限组管理</router-link>
          </el-menu-item>
          <el-menu-item index="4-2-2" v-if="roles.admin_role_update">
            <router-link :to="{name:'admin'}" tag="span">后台管理员列表</router-link>
          </el-menu-item>
          <el-menu-item index="4-2-3">
            <router-link :to="{name:'manager'}" tag="span">后台管理员操作日志</router-link>
          </el-menu-item>
          <el-menu-item index="4-2-4">
            <router-link :to="{name:'operation'}" tag="span">管理员钻石操作日志</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4-3" v-if="roles.user_manage">
          <template slot="title"><i class="iconfont icon-yonghuguanli"></i>用户管理</template>
          <el-menu-item index="4-3-1">
            <router-link :to="{name:'lock'}" tag="span">封号日志</router-link>
          </el-menu-item>
          <el-menu-item index="4-3-2">
            <router-link :to="{name:'connection'}" tag="span">客户端日志查询</router-link>
          </el-menu-item>
          <el-menu-item index="4-3-3">
            <router-link :to="{name:'feedback'}" tag="span">用户反馈</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4-4" v-if="roles.node_manage">
          <template slot="title"><i class="iconfont icon-ziyuanguanli-copy"></i>服务器群组管理</template>
          <el-menu-item index="4-4-1">
            <router-link :to="{name:'area'}" tag="span">地域配置</router-link>
          </el-menu-item>
          <el-menu-item index="4-4-2">
            <router-link :to="{name:'serverlist'}" tag="span">服务器配置</router-link>
          </el-menu-item>
          <el-menu-item index="4-4-3">
            <router-link :to="{name:'c_dynamicip'}" tag="span">动态IP配置</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4-5" v-if="roles.help_manual">
          <template slot="title"><i class="iconfont icon-bangzhu"></i>帮助问答</template>
          <el-menu-item index="4-5-1">
            <router-link :to="{name:'help'}" tag="span">帮助问答</router-link>
          </el-menu-item>
          <el-menu-item index="4-5-2">
            <router-link :to="{path:'/config/navset/', query:{type: 'true'}}" tag="span">导航设置</router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="4-6" v-if="roles.system_setting"><i class="iconfont icon-canshupeizhi"></i>
          <router-link :to="{name:'config'}" tag="span">参数配置</router-link>
        </el-menu-item>
        <el-menu-item index="4-7" v-if="roles.system_enum"><i class="iconfont icon-qudaopeizhi"></i>
          <router-link :to="{name:'channelversion'}" tag="span">渠道版本配置</router-link>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script>
  import '../../assets/fonts/iconfont.css'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    computed: {
      ...mapGetters(['LoginStatus']),
      roles(){
        let roles = null
        if (this.LoginStatus.data) {
          window.sessionStorage.setItem('roles', JSON.stringify(this.LoginStatus.data.role));
        }
        return JSON.parse(window.sessionStorage.getItem('roles'))
      }
    },
    methods: {
      ...mapActions([
        'login'
      ])
    },
    mounted(){
      var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
      document.getElementById("nav").style.minHeight = height + 'px';
    }
  }
</script>

<style>
  #nav {
    text-align: left;
  }

  .iconfont {
    font-size: 14px;
    margin-right: 5px;
  }

  /*一级路由*/
  .el-menu-item-group__title {
    margin-bottom: 15px;
    color: #708096;
  }

  .level1 > .el-menu-item-group__title {
    font-size: 16px;
  }

  /*二级路由*/
  .level1 > ul > .el-menu-item {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }

  .level1 > ul > li {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .level1 .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }

  /*三级路由*/
  .el-menu .el-menu-item {
    height: 36px;
    line-height: 36px;
  }

  .el-menu-item span {
    display: inline-block;
  }
</style>
