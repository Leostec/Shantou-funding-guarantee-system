<template>
    <div id="login">
      <div id="contain">
        <div id="left_card">
        </div>
        <div id="right_card">
          <el-card class="el-card">
            <h2>欢迎登录</h2>
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
            <p
              v-if="error"
              style="color: red"
            >用户名或密码错误</p>
          </el-card>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { ElMessage } from "element-plus";
  
  const loginForm = ref({
    username: "",
    password: "",
  });
  const error = ref(false);
  const loginFormRef = ref(null);
  
  const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  };
  
  const login = () => {
    error.value = false;
    loginFormRef.value.validate((valid) => {
      if (valid) {
        if (
          loginForm.value.username === "admin" &&
          loginForm.value.password === "123456"
        ) {
          window.location.href = "http://localhost:8080/admin";
        } else if (
          loginForm.value.username === "user" &&
          loginForm.value.password === "123456"
        ) {
          window.location.href = "http://localhost:8080/user";
        } else {
          error.value = true;
          ElMessage.error("用户名或密码错误");
        }
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
  
  