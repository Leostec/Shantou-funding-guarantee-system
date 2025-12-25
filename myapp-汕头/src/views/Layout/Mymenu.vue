<template>
  <a-layout class="root-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      :width="200"
      class="sider-fixed"
    >
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
      <a-menu-item v-if="role === 'manager'" key="/staff-entries" @click="$router.push('/staff-entries')">
        <user-outlined />
        <span>员工录入</span>
      </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout class="main-layout">
      <a-layout-header
        class="main-header"
      >
        <div class="title-wrap">
          <span class="welcome" v-if="username">欢迎您，{{ department || '未分配部门' }}的{{ username }}</span>
        </div>
        <a-button type="primary" danger @click="logout">退出登录</a-button>
      </a-layout-header>
      <a-layout-content class="main-content">
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
const department = ref<string>(localStorage.getItem('department_name') || '');
const role = ref<string>(localStorage.getItem('authRole') || '');

watch(
  () => router.currentRoute.value.path,
  (path) => {
    selectedKeys.value = [path];
  },
  { immediate: true }
);

const logout = () => {
  localStorage.removeItem('authRole');
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
  message.success('已退出登录');
  router.push('/');
};
</script>

<style scoped>
.title{
  text-align: center;
}
.root-layout {
  min-height: 100vh;
}
.sider-fixed {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}
.main-layout {
  margin-left: 200px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}
.main-header {
  background: #ffffff;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.main-content {
  margin: 0 16px;
  padding: 16px 0;
  flex: 1;
  overflow: auto;
}
.title-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}
.title,
.welcome {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
  color: #000;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
