<script>
  import topic from '../components/topic';
  import left from '../components/left';
  import right from '../components/right';
  import content from '../components/content';
  import about from '../components/about';

  export default {
    el: '#app',
    data: function () {

    },
    components: {
      topic, left, right, about, content
    }
  };
</script>
<template lang="pug">
topic
div.container
  div.sidebar
    left
  div.right-sidebar
    right
  div#main-container.main
    content
about
</template>
<style lang="sass">
  #app {
    overflow: hidden;
  }

  .container {

    height: calc(100% - 4rem);

  .sidebar, .right-sidebar {
    height: calc(100% - 4rem);
    display: none;
  }

  .sidebar {
    width: 200px;
    color: #f4f4f4;
    background-color: #2e3238;
    position: fixed;
    top: 50px;
    left: 0px;
    z-index: 1000;
  }

  .right-sidebar {
    width: 200px;
    color: #f4f4f4;
    background-color: #2e3238;
    position: fixed;
    top: 50px;
    right: 0px;
    z-index: 1000;
  }
  .main{
    height:100%;
  }

  }
</style>
