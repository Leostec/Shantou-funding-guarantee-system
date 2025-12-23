<template>
  <div class="login-page">
    <div class="auth-card">
      <h2>欢迎登录 / 注册</h2>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" :rules="rules" ref="loginFormRef" @submit.prevent="login">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
            </el-form-item>
          </el-form>
          <el-button type="primary" class="full-btn" @click="login">登录</el-button>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form :model="registerForm" :rules="rules" ref="registerFormRef" @submit.prevent="register">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
            </el-form-item>
          </el-form>
          <el-button type="primary" class="full-btn" @click="register">注册</el-button>
        </el-tab-pane>
      </el-tabs>
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const activeTab = ref("login");
const loginForm = ref({ username: "", password: "" });
const registerForm = ref({ username: "", password: "" });
const errorMessage = ref("");
const loginFormRef = ref(null);
const registerFormRef = ref(null);

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLoginSuccess = (role = "user") => {
  localStorage.setItem("username", loginForm.value.username);
  localStorage.setItem("authRole", role || "user");
  const target = role === "admin" ? "/admin" : "/vis";
  window.location.href = `http://localhost:8080${target}`;
};

const login = () => {
  errorMessage.value = "";
  if (!loginFormRef.value) return;
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        username: loginForm.value.username,
        password: loginForm.value.password,
      });
      ElMessage.success("登录成功");
      handleLoginSuccess(response.data?.role);
    } catch (err) {
      errorMessage.value = err?.response?.data?.message || "登录失败，请重试";
      ElMessage.error(errorMessage.value);
    }
  });
};

const register = () => {
  errorMessage.value = "";
  if (!registerFormRef.value) return;
  registerFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await axios.post("http://127.0.0.1:5000/register", {
        username: registerForm.value.username,
        password: registerForm.value.password,
      });
      ElMessage.success("注册成功，请使用新账号登录");
      activeTab.value = "login";
      loginForm.value.username = registerForm.value.username;
      loginForm.value.password = "";
    } catch (err) {
      errorMessage.value = err?.response?.data?.message || "注册失败，请重试";
      ElMessage.error(errorMessage.value);
    }
  });
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%);
  padding: 24px;
}
.auth-card {
  width: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  padding: 28px 32px 24px;
}
.auth-card h2 {
  text-align: center;
  margin-bottom: 12px;
}
.full-btn {
  width: 100%;
  margin-top: 8px;
}
.error-text {
  color: #f56c6c;
  margin-top: 8px;
  text-align: center;
}
</style>
