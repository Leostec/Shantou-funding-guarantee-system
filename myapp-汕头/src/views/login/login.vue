<template>
  <div id="login">
    <div id="contain">
      <div id="left_card"></div>
      <div id="right_card">
        <el-card class="el-card">
          <h2>欢迎登录 / 注册</h2>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="登录" name="login">
              <el-form
                :model="loginForm"
                :rules="rules"
                ref="loginFormRef"
                @submit.prevent="login"
              >
                <el-form-item
                  label="用户名"
                  prop="username"
                  class="login"
                >
                  <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item
                  label="密码"
                  prop="password"
                >
                  <el-input
                    type="password"
                    v-model="loginForm.password"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div id="btn">
                <el-button
                  type="primary"
                  @click="login"
                  class="loginbtn"
                >登录</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="注册" name="register">
              <el-form
                :model="registerForm"
                :rules="rules"
                ref="registerFormRef"
                @submit.prevent="register"
              >
                <el-form-item
                  label="用户名"
                  prop="username"
                  class="login"
                >
                  <el-input v-model="registerForm.username"></el-input>
                </el-form-item>
                <el-form-item
                  label="密码"
                  prop="password"
                >
                  <el-input
                    type="password"
                    v-model="registerForm.password"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div id="btn">
                <el-button
                  type="primary"
                  @click="register"
                  class="loginbtn"
                >注册</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
          <p
            v-if="errorMessage"
            style="color: red"
          >{{ errorMessage }}</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const activeTab = ref("login");
const loginForm = ref({
  username: "",
  password: "",
});
const registerForm = ref({
  username: "",
  password: "",
});
const errorMessage = ref("");
const loginFormRef = ref(null);
const registerFormRef = ref(null);

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLoginSuccess = (role = "user") => {
  const target = role === "admin" ? "/admin" : "/user";
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
      errorMessage.value =
        err?.response?.data?.message || "登录失败，请重试";
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
      errorMessage.value =
        err?.response?.data?.message || "注册失败，请重试";
      ElMessage.error(errorMessage.value);
    }
  });
};
</script>
  <style lang="scss" scoped>
  @keyframes animate {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }
  #login {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-size: 100% 100%;
    background-color: #a7a8bd;
  }
  #contain {
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
    #left_card {
      width: 500px;
      h1 {
        color: white;
        white-space: nowrap;
      }
      span {
        font-size: 1.2rem;
        text-align: center;
        color: white;
        white-space: nowrap;
      }
    }
    #right_card {
      width: 400px;
      .el-card {
        margin: 0 45px;
        margin-top: 200px;
        border-radius: 25px;
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
  #right_card {
    display: flex;
    justify-content: center;
    align-items: center;
    h2 {
      margin-bottom: 5px;
    }
    .login {
      input {
        width: 80%;
        height: 45px;
        margin-top: 10px;
        border: 1px solid white;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 10px;
        font-size: inherit;
        padding-left: 20px;
        outline: none;
      }
    }
  
    .loginbtn {
      width: 100%;
      height: 35px;
      margin-top: 10px;
      border-radius: 10px;
      background-color: rgba(207, 38, 38, 0.8);
    }
  }
  </style>
  
  
