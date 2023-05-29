<template>
  <div id="cover-image"></div>
  <router-view />
</template>

<script lang="ts" setup>

</script>

<style lang="less">
#cover-image {
  background-image: url(https://file.jyab.cn/image/2023-05-19/d2f508ef-3b62-41f5-8077-13433831b5ed.jpg);
  background-blend-mode: lighten;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  position: fixed;
  width: 100vw;
}

#app {
  overflow: hidden;
}
</style>