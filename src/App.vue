<script setup>
import { onUnmounted } from 'vue';
import { useBeepStore } from './stores/beep';

const audioStore = useBeepStore();
onUnmounted(() => {
  audioStore.closeBeep()
})
</script>

<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="标签扫描" textLight fixed border />

    <!-- 主内容区域 -->
    <div style="padding-top: 70px;">
      <!-- 路由视图 -->
      <router-view></router-view>
    </div>

    <!-- 底部Tabbar -->
    <van-tabbar route fixed>
      <van-tabbar-item name="scan" to="/scan" icon="scan">扫描</van-tabbar-item>
      <van-tabbar-item name="record" to="/record" icon="orders-o">记录</van-tabbar-item>
      <van-tabbar-item name="setting" to="/setting" icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style>
body {
  padding: 0;
  margin: 0;
  background-color: #f5f5f7;
  height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root {
  --van-nav-bar-background: #5592c4;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-height: 60px;
  --van-nav-bar-arrow-size: 40px;

}
</style>
