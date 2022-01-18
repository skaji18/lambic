<template>
  <router-view></router-view>
</template>

<script>
import '@/firebase'

export default {
}
</script>

<style scoped>
#qrcode {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>
