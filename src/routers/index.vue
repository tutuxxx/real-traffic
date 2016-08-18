<style lang="sass" scoped>
  h1 {
    color: #28a7e1;
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    margin-top: 50px;
  }

  h2 {
    text-align: center;
    font-size: 20px;
    margin-top: 50px;
  }

  h4{
    text-align: center;
  }

  img {
    width: 150px;
  }

  ul {
    text-align: center;
    margin-top: 50px;
    font-size: 20px;
    color: deeppink;

  li {
    padding: 5px 0;
  }

  }
</style>
<template lang="jade">
h2
 img(src="../images/sibat.png")
h4 {{title}}
ul#tec-show
 li(v-for="item in tecs") {{ item.name }} : {{item.value}}
h1 过滤器示例:{{ 3731700153 | NumberSeparator }}
h2(v-time)
</template>
<script>
  import NumberSeparator from '../filters/number-separator';
  import Time from '../directives/time';

  module.exports = {
    filters: {
      NumberSeparator: NumberSeparator
    },
    directives: {
      time: Time
    },
    data: function () {
      return {
        tecs: [
          { name: '语言', value: 'Babel + ES6' },
          { name: 'CSS预编译语言', value: 'Scss' },
          { name: 'HTML模版引擎', value: 'Jade' },
          { name: 'MV*框架', value: 'Vue' },
          { name: '构建工具', value: 'Webpack' },
          { name: '代码风格', value: 'ESLint' },
          { name: '单元测试', value: 'Karma + Jasmine + PhantomJS' }
        ],
        title: 'vue模版'
      };
    },
    ready: function () {

    },
    beforeDestroy: function () {

    },
    methods: {}
  };
</script>
