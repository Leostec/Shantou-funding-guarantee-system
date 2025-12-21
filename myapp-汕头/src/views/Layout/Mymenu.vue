<template>
  <a-layout style="min-height: 100vh">
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
          <div class="logo" />
          <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
              <a-menu-item key="12" @click="$router.push('/vis')">
                  <pie-chart-outlined />
                  <span>小微企业贷款担保额度评估平台</span>
              </a-menu-item>
          </a-menu>
      </a-layout-sider>
      <a-layout>
          <a-layout-header style="background: #00F5FF; padding: 0">
              <h2 class="title">评估平台</h2>
          </a-layout-header>
          <a-layout-content style="margin: 0 16px">
              <router-view/>
          </a-layout-content>
      </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from '@ant-design/icons-vue';
import { ref } from 'vue';
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
</script>
<style scoped>
.title{
  text-align: center;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
