<template>
  <div id="app">
    <circle2 class="loading2" v-show="getLoading"></circle2>
    <transition name="el-fade-in-linear">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import circle2 from './components/publicView/Circle2.vue'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: 'app',
    components: {
      circle2
    },
    computed: {
      ...mapGetters(['getLoading'])
    }
  }
</script>

<style>
  body {
    margin: 0;
    min-width: 960px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    font-weight: 400;
    color: #2c3e50;
    position: relative;
  }

  .loading2 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    transform: translateX(-100%);
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
    transform: translateX(100%);
  }

  .help-content h2 {
    font-size: 1.3rem;
    font-weight: bold;
    padding: 5px 0;
  }

  .help-content ul li {
    list-style: disc outside none !important;
    margin-left: 20px !important;
    padding: 8px 0 8px 0 !important;
  }
</style>
