<script>
  export default {
    el: 'header',
    data: function () {
      return {
        title: '广东省路况查询系统',
        show: false,
        searchVal: ''
      };
    },
    methods: {
      /**
       * 框选道路，查询选中道路的流量及车速
       * @param event
       */
      search: function (event) {
        if (!this.show) {
          this.show = !this.show;
          return false;
        } else if (this.searchVal === '') {
          this.show = !this.show;
          return false;
        } else {
          alert(1);
        }
      },
      /**
       * 清空图层
       * @param event
       */
      resetLayer: function (event) {

      },
      /**
       *
       * @param
       */
      toggleInput: function () {
        this.show = !this.show;
      }

    }
  };

</script>

<template lang="pug">
  header.header
    h2.title
      a(href='index.html')
        img.logo(src='../images/sibat.png')
        | {{ title }}
    ul
      li
        a(href='javascript:',@click='resetLayer')
          i.fa.fa-map-o
          | 清空图层
      li
        a(href='javascript:',@click='showSearchInput')
          i.fa.fa-object-ungroup
          | 拉框查询
      li
        a(href='javascript:',@click='search')
          i.fa.fa-clock-o
          | 车辆定时查询
      li
        a(href='javascript:',@click='search')
          i.fa.fa-bus
          | 车辆查询
      li
        a(href='javascript:',@click='search')
          i.fa.fa-map-marker
          | 道路查询
      li
        a(href='javascript:',@click='showSearchInput')
          input.expand-transition(type='text',placeholder='输入要查询的道路名称或车牌号...',@keyup.enter='search',v-if='show',transition='expand',v-model='searchVal')
</template>

<style lang="sass" scoped>
  @import '../../node_modules/font-awesome/css/font-awesome.css';
  .header {
    background: #222;
    color: #fff;
    height: 3rem;

  .logo {
    vertical-align: middle;
    width:3rem;
    height:3rem;
  }

  a {
    color: #fff;
    text-decoration: none;
  }

  h2.title {
    margin: 0;
    line-height: 3rem;
    width: 30%;
    font-size: 1.4rem;
    min-width: 200px;
    float: left;
  }

  ul {
    width: 70%;
    height: 3rem;
    float: right;

  li {
    display: block;
    float: right;
    height: 3rem;
    padding: 0 10px;
    border-right: 1px #696969 solid;

  &:last-child {
    border: none;

  input {
    width: 12rem;
    height: .8rem;
    border-radius: .3rem;
    font-size: .8em;
    padding: 0px;
    border: none;
    text-align: center;
    background-color: #666;
    color: #fff;
    vertical-align:middle;

  &.expand-transition {
    transition: all .3s ease;
    height: 1rem;
    padding: .5rem;
    background-color: #666;
    overflow: hidden;
  }

  /* .expand-enter 定义进入的开始状态 */
  /* .expand-leave 定义离开的结束状态 */
  &.expand-enter,

  &.expand-leave {
    height: 0;
    padding: 0 10px;
    opacity: 0;
  }

  &:focus {
    background-color: #fff;
    color: #000;
  }

  }
  }

  a {
    display: block;
    line-height: 3rem;
    out-line: none;

  &:link {
    color: #e0e0e0;
  }

  &:hover {
    color: #fff;
    text-shadow: 1px 1px 1px green;
  }

  i {
    color: #fff;
    margin-right: 4px;
  }

  }
  }
  }

  }
</style>
