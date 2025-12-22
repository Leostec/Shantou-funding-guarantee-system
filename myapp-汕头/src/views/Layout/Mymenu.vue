<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="/vis" @click="$router.push('/vis')">
          <pie-chart-outlined />
          <span>信息录入</span>
        </a-menu-item>
        <a-menu-item key="/my-entries" @click="$router.push('/my-entries')">
          <user-outlined />
          <span>我的录入</span>
        </a-menu-item>
        <a-menu-item key="/model-evaluate" @click="$router.push('/model-evaluate')">
          <desktop-outlined />
          <span>模型评估</span>
        </a-menu-item>
        <a-menu-item key="/expert-review" @click="$router.push('/expert-review')">
          <team-outlined />
          <span>专家评审</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        style="background: #00F5FF; padding: 0; display: flex; align-items: center; justify-content: space-between; padding-left: 16px; padding-right: 16px;"
      >
        <div class="title-wrap">
          <h2 class="title">评估平台</h2>
          <span class="welcome" v-if="username">欢迎您，{{ username }}</span>
        </div>
        <a-button type="primary" danger @click="logout">退出登录</a-button>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import {
  PieChartOutlined,
  UserOutlined,
  DesktopOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const collapsed = ref<boolean>(false);
const router = useRouter();
const selectedKeys = ref<string[]>([router.currentRoute.value.path]);
const username = ref<string>(localStorage.getItem('username') || '');

watch(
  () => router.currentRoute.value.path,
  (path) => {
    selectedKeys.value = [path];
  },
  { immediate: true }
);

const logout = () => {
  localStorage.removeItem('authRole');
  localStorage.removeItem('username');
  message.success('已退出登录');
  router.push('/');
};
</script>

<style scoped>
.title{
  text-align: center;
}
.title-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}
.welcome {
  font-size: 1.5em;
  color: #000;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
