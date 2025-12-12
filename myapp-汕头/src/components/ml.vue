<template>
  <h2>猪肉挥发性盐基氮预测模型</h2>
  <a-form
    layout="inline"
    @submit.prevent="predictContent"
  >
    <a-form-item label="评估资产">
      <a-input-number
        v-model:value="temperature"
        placeholder="输入温度"
        style="width: 100%;"
      />
    </a-form-item>
    <a-form-item label="报告编号">
      <a-input
        v-model:value="start_time"
        placeholder="例 001562102"
        style="width: 100%;"
      />
    </a-form-item>
      <a-button
        type="primary"
        @click="predictContent"
      >预测含量</a-button>
  </a-form>
</template>
    
  <script setup>
import { ref } from "vue";
import axios from "axios";
import { Form, InputNumber, Button } from "ant-design-vue";
import { ExclamationCircleFilled } from "@ant-design/icons-vue";

const temperature = ref(0);
const start_time = ref(null);

// 预测函数
const predictContent = async () => {
  try {
    // 将时间转换为后端期望的格式
    const response = await axios.post("http://localhost:5000/demo", {
      temperature: temperature.value,
      start_time: start_time.value,
    });
    console.log(response);
  } catch (error) {
    console.error("Error predicting content:", error);
  }
};

</script>
    
  <style scoped>
</style>
  
    