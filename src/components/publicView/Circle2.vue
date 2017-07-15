<template>
  <div ref="mark" class="warp">
    <div :style="styles" class="spinner spinner--circle-2"></div>
  </div>
</template>
<script>
  export default {
    props: {
      size: {
        default: '40px'
      },
      background: {
        default: '#20A0FF'
      },
      color: {
        default: '#35495e'
      },
      stroke: {
        default: '5px'
      }
    },
    computed: {
      styles () {
        return {
          width: this.size,
          height: this.size,
          border: this.stroke + ' solid ' + this.background,
          borderTopColor: this.color
        }
      }
    },
    methods: {
      init(){
        let nodes = this.$refs.mark;
        nodes.style.width = document.documentElement.clientWidth || document.body.clientWidth + 'px'
        nodes.style.height = document.documentElement.clientHeight || document.body.clientHeight + 'px'
      }
    },
    mounted(){
      this.init()
      window.addEventListener('resize', this.init())
    }
  }
</script>
<style lang="less" scoped>
  .spinner {
    position: relative;
    margin: 0 auto;
    text: center;
    margin-top: 25%;
    box-sizing: border-box;
    border-radius: 100%;
    border: 10px solid rgba(255, 255, 255, 0.2);
    animation: circle-2-spin 1s infinite linear;
  }

  @keyframes circle-2-spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
