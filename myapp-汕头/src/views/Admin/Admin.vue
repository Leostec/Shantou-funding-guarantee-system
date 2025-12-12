<template>
  <div
    class="zcpg"
    style="width: 1200px;height: 800px;"
  >
    <div
      class="search-container"
      style="width: 1100px;"
    >
      <div>
        <label>开始时间:</label>
        <input
          type="date"
          v-model="startDate"
          @input="fetchTableDataWithSearch"
          style="margin-left: 20px;"
        />
        <span style="margin-left: 80px;"></span>
        <label>结束时间:</label>
        <input
          type="date"
          v-model="endDate"
          @input="fetchTableDataWithSearch"
          style="margin-left: 85px;"
        />
        <span style="margin-left: 80px;"></span>
        <label>搜索借贷周期:</label>
        <input
          type="text"
          v-model="searchTime"
          @input="fetchTableDataWithSearch"
          style="margin-left: 40px;"
        />
      </div>
      <br>
      <div>
        <label>搜索企业名称:</label>
        <input
          type="text"
          v-model="searchName"
          @input="fetchTableDataWithSearch"
          placeholder="Search by name"
        />
        <span style="margin-left: 80px;"></span>
        <label>搜索报告编号:</label>
        <input
          type="text"
          v-model="searchReportNumber"
          @input="fetchTableDataWithSearch"
          placeholder="Search by report number"
        />
        <span style="margin-left: 80px;"></span>
        <label>搜索上传负责人:</label>
        <input
          type="text"
          v-model="searchUserName"
          @input="fetchTableDataWithSearch"
          placeholder="Search by user name"
        />
      </div>

    </div>
    <div class="container">
    <div class="quadrant-container">
      <div class="quadrant quadrant1">{{ countZero }}</div>
      <div class="quadrant-label">未通过</div>
    </div>
    <div class="quadrant-container">
      <div class="quadrant quadrant2">{{ countLessThanOrEqual300 }}</div>
      <div class="quadrant-label">&le;30</div>
    </div>
    <div class="quadrant-container">
      <div class="quadrant quadrant3">{{ countGreater300 }}</div>
      <div class="quadrant-label">&gt;30</div>
    </div>
  </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :scroll="{ x:'max-content',y:380 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'report_number'">
            <a
              class="custom-link"
              @click="viewZcpgData(record.report_number)"
            >{{ record.report_number }}</a>
          </template>
          <template v-else-if="column.key === 'money'">
            {{ record.money > 0 ? '√' : '×' }}
          </template>
          <template v-else>
            {{ record[column.key] }}
          </template>
        </template>
        <template #headerCell="{ column }">
          <span style="font-weight: bold;">{{ column.title }}</span>
        </template>
      </a-table>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const tableData = ref([]);
const searchName = ref("");
const searchReportNumber = ref("");
const searchUserName = ref("");
const startDate = ref("");
const endDate = ref("");
const searchTime = ref("");
const router = useRouter();
const countZero = ref(0);
const countLessThanOrEqual300 = ref(0);
const countGreater300 = ref(0);

const columns = [
  {
    title: "企业编号",
    dataIndex: "report_number",
    key: "report_number",
  },
  {
    title: "企业名称",
    dataIndex: "company_name",
    key: "company_name",
  },
  {
    title: "上传日期",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "借贷周期",
    dataIndex: "application_period",
    key: "application_period",
  },
  {
    title: "上传负责人",
    dataIndex: "project_manager",
    key: "project_manager",
  },
  {
    title: "是否通过",
    dataIndex: "money",
    key: "money",
  },
];

async function fetchTableDataWithSearch() {
  try {
    const response = await axios.get(
      `http://localhost:8989/xmlb?searchName=${encodeURIComponent(
        searchName.value
      )}&searchReportNumber=${encodeURIComponent(
        searchReportNumber.value
      )}&searchUserName=${encodeURIComponent(
        searchUserName.value
      )}&startDate=${encodeURIComponent(
        startDate.value
      )}&endDate=${encodeURIComponent(
        endDate.value
      )}&searchTime=${encodeURIComponent(searchTime.value)}`
    );
    tableData.value = response.data;

    // 更新计数变量
    countZero.value = tableData.value.filter((item) => item.money === 0).length;
    countLessThanOrEqual300.value = tableData.value.filter(
      (item) => item.money <= 30
    ).length;
    countGreater300.value = tableData.value.filter(
      (item) => item.money > 30
    ).length;
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
}
const viewZcpgData = (reportNumber) => {
  router.push({ name: "Zcpg", params: { reportNumber } });
};
onMounted(() => {
  fetchTableDataWithSearch();
});
</script>

<style scoped>
.zcpg {
  border: 1px solid rgb(218, 218, 218);
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  background-color: rgb(240, 240, 240);
}
.search-container {
  border: 1px solid rgb(218, 218, 218);
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  background-color: rgb(245, 245, 245);
}
input {
  width: 166.11px;
}
.container {
  display: flex;
  justify-content: space-between;
}

.quadrant-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.quadrant-label {
  margin-top: 5px; 
  font-size: 14px; 
  color: #333; 
}
.quadrant {
  width: 100px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px; /* Adjust the font size as needed */
  margin-right: 75px;
  margin-left: 70px;
  border: 1px solid black;
  border-radius: 5px;
}

.custom-link {
  color: #333; /* 或者你想要的颜色代码 */
  text-decoration: none; /* 如果你不希望有下划线，可以取消链接下划线 */
}

.custom-link:hover {
  color: #555; /* 鼠标悬停时的颜色，或者你想要的颜色代码 */
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}

.quadrant1 {
  background-color: #ffc0cb;
} /* Pink */
.quadrant2 {
  background-color: #90ee90;
} /* Light Green */
.quadrant3 {
  background-color: #add8e6;
} /* Light Blue */
.quadrant4 {
  background-color: #ffd700;
} /* Gold */
</style>
