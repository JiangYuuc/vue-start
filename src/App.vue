<template>
  <div id="cover-image"></div>
  <router-view />
</template>

<script lang="ts" setup>

</script>

<style lang="less">
#cover-image {
  background-image: url(https://file.jyab.cn/image/2023-05-19/27d33837-a008-4f01-a8f2-b332c7ef6442.jpg);
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