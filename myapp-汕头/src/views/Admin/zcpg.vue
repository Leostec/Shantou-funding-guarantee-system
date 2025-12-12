<template>
  <div class="standard" style="width:1200px;height:800px">
    <div v-if="tableData.length > 0">
      <!-- 基础信息块 -->
      <div class="jichu">
        <span>基础信息</span>
        <div class="jichuData" style="height:50px;padding: 12px;">
          <b>报告编号:</b>
          <span class="report_number" style="margin-right: 80px;">{{ tableData[0].project_number }}</span>
          <b>企业名称:</b>
          <span class="qiye_name" style="margin-right: 80px;">{{ tableData[0].company_name }}</span>
          <b>上传日期:</b>
          <span class="date" style="margin-right: 80px;">{{ tableData2[0].created_at }}</span>
          <b>上传负责人:</b>
          <span class="name" style="margin-right: 80px;">{{ tableData2[0].project_manager }}</span>
        </div>
      </div>

      <!-- 文本信息块 -->
      <div class="text-info-container">
        <div class="text-info-section">
          <div class="text-info-item">
            <h4>学习及工作经历</h4>
            <div class="text-content-box">{{ tableData[0].education_work_experience }}</div>
          </div>
          <div class="text-info-item">
            <h4>家庭成员及情况</h4>
            <div class="text-content-box">{{ tableData[0].family_social_relations }}</div>
          </div>
          <div class="text-info-item">
            <h4>商业模式</h4>
            <div class="text-content-box">{{ tableData[0].business_model }}</div>
          </div>
          <div class="text-info-item">
            <h4>反担保措施</h4>
            <div class="text-content-box">{{ tableData[0].counter_guarantee }}</div>
          </div>
        </div>
        <div class="text-info-section">
          <div class="text-info-item">
            <h4>主营业务</h4>
            <div class="text-content-box">{{ tableData[0].main_business }}</div>
          </div>
          <div class="text-info-item">
            <h4>近三年利润去向</h4>
            <div class="text-content-box">{{ tableData[0].profit_usage }}</div>
          </div>
          <div class="text-info-item">
            <h4>其他软信息描述</h4>
            <div class="text-content-box">{{ tableData[0].other_soft_info }}</div>
          </div>
          <div class="text-info-item">
            <h4>贷款用途描述</h4>
            <div class="text-content-box">{{ tableData[0].loan_purpose }}</div>
          </div>
        </div>
      </div>

      <!-- 预测结果数据块 -->
      <div class="predict">
        <span>预测结果</span>
        <div class="predictData">
          <div class="prediction-text" v-html="tableData[0].prediction_text?.replace(/\n/g, '<br>')"></div>
        </div>
      </div>

      <!-- 表格数据块 -->
      <div class="tableArea">
        <span>表格数据</span>
        <div class="table">
          <a-table :columns="columns" :data-source="filteredTableData" :scroll="{ x: 'max-content' }" :pagination="false" bordered>
            <template #headerCell="{ column }">
              <span style="font-weight: bold;">{{ column.title }}</span>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <div v-else>
      <div>加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onActivated } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const tableData = ref([]);
const searchName = ref("");
const tableData2 = ref([]);
const currentDate = new Date().toISOString().split('T')[0];

const excludedFields = [
  'education_work_experience',
  'family_social_relations',
  'counter_guarantee',
  'business_model',
  'main_business',
  'profit_usage',
  'other_soft_info',
  'loan_purpose'
];

const columns = [
  {
    title: "公司名称",
    dataIndex: "company_name",
    key: "company_name",
  },
  {
    title: "上传日期",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "申请期限",
    dataIndex: "application_period",
    key: "application_period",
  },
  {
    title: "项目经理",
    dataIndex: "project_manager",
    key: "project_manager",
  },
  {
    title: "销售负债率",
    dataIndex: "sales_debt_ratio",
    key: "sales_debt_ratio",
  },
  {
    title: "资产负债率",
    dataIndex: "asset_debt_ratio",
    key: "asset_debt_ratio",
  },
  {
    title: "银行流水年总额流入",
    dataIndex: "bank_inflow",
    key: "bank_inflow",
  },
  {
    title: "银行流水年总额流出",
    dataIndex: "bank_outflow",
    key: "bank_outflow",
  },
  {
    title: "销售收入",
    dataIndex: "annual_sales",
    key: "annual_sales",
  },
  {
    title: "净利润",
    dataIndex: "annual_net_profit",
    key: "annual_net_profit",
  },
  {
    title: "年净收益",
    dataIndex: "monthly_net_profit",
    key: "monthly_net_profit",
  },
  {
    title: "月均余额",
    dataIndex: "monthly_balance",
    key: "monthly_balance",
  },
  {
    title: "应收账款",
    dataIndex: "receivables_at_meeting",
    key: "receivables_at_meeting",
  },
  {
    title: "总资产",
    dataIndex: "total_assets",
    key: "total_assets",
  },
  {
    title: "总负债",
    dataIndex: "total_liabilities",
    key: "total_liabilities",
  },
  {
    title: "净资产",
    dataIndex: "net_assets",
    key: "net_assets",
  },
  {
    title: "经营性贷款",
    dataIndex: "monthly_repayment",
    key: "monthly_repayment",
  },
  {
    title: "月还款额/月净收益对比",
    dataIndex: "repayment_income_ratio",
    key: "repayment_income_ratio",
  },

  {
    title: "征信查询数",
    dataIndex: "credit_inquiries",
    key: "credit_inquiries",
  },
  {
    title: "征信逾期",
    dataIndex: "overdue_times",
    key: "overdue_times",
  },

  {
    title: "微贷产品服务方向",
    dataIndex: "industry_category",
    key: "industry_category",
  },
  {
    title: "申请额度",
    dataIndex: "application_amount",
    key: "application_amount",
  },
  {
    title: "测定额度",
    dataIndex: "determined_amount",
    key: "determined_amount",
  },
  {
    title: "报告编号",
    dataIndex: "project_number",
    key: "project_number",
  },
  {
    title: "预测结果",
    dataIndex: "predicted",
    key: "predicted",
  },
  {
    title: "预测结果文本",
    dataIndex: "prediction_text",
    key: "prediction_text",
  }
];

const filteredTableData = computed(() => {
  return tableData.value.map(item => {
    const newItem = { ...item };
    excludedFields.forEach(field => {
      delete newItem[field];
    });
    return newItem;
  });
});

async function fetchTableDataWithSearch() {
  try {
    const response = await axios.get(
      `http://localhost:8989/loan-application?projectNumber=${encodeURIComponent(searchName.value)}`
    );
    const response2 = await axios.get(
      `http://localhost:8989/datahuizong?name=${encodeURIComponent(searchName.value)}`
    );
    tableData.value = response.data;
    tableData2.value = response2.data;
    console.log('详细信息数据:', tableData.value);
    console.log('汇总数据:', tableData2.value);
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
}

onMounted(() => {
  const reportNumber = route.params.reportNumber;
  console.log("Received reportNumber:", reportNumber);
  if (reportNumber) {
    searchName.value = reportNumber;
    fetchTableDataWithSearch();
  }
});

// 使用onActivated钩子来处理前进/后退时的参数更新
onActivated(() => {
  const reportNumber = route.params.reportNumber;
  console.log("Received reportNumber:", reportNumber);
  if (reportNumber) {
    searchName.value = reportNumber;
    fetchTableDataWithSearch();
  }
});
</script>

<style scoped>
.standard {
  border: 1px solid rgb(218, 218, 218);
  margin: 10px;
  background-color: rgb(240, 240, 240);
  height: 100vh;
  overflow-y: auto;
}

.text-info-container {
  display: flex;
  gap: 16px;
  margin: 10px;
  padding: 10px;
  background-color: rgb(240, 240, 240);
}

.text-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text-info-item {
  background-color: rgb(250, 250, 250);
  border: 1px solid rgb(218, 218, 218);
  border-radius: 5px;
  padding: 10px;
}

.text-info-item h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-weight: bold;
}

.text-content-box {
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  white-space: pre-wrap;
  line-height: 1.5;
}

.predict {
  margin: 10px;
  padding: 10px;
  background-color: rgb(240, 240, 240);
  border: 1px solid rgb(218, 218, 218);
  border-radius: 5px;
}

.predictData {
  background-color: rgb(250, 250, 250);
  border: 1px solid rgb(218, 218, 218);
  border-radius: 5px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.prediction-text {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #333;
  font-size: 1.1em;
}

.jichu,
.tableArea,
.table {
  border: 1px solid rgb(218, 218, 218);
  border-radius: 5px;
  margin: 10px;
  padding: 5px;
  background-color: rgb(240, 240, 240);
}

.jichuData {
  border: 1px solid rgb(218, 218, 218);
  border-radius: 5px;
  background-color: rgb(240, 240, 240);
}

.report_number,
.qiye_name,
.money,
.date,
.name {
  border: 1px solid rgb(218, 218, 218);
  border-radius: 5px;
  padding: 5px;
  background-color: rgb(250, 250, 250);
}

/* 自定义滚动条样式 */
.predictData::-webkit-scrollbar,
.text-content-box::-webkit-scrollbar {
  width: 8px;
}

.predictData::-webkit-scrollbar-track,
.text-content-box::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.predictData::-webkit-scrollbar-thumb,
.text-content-box::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.predictData::-webkit-scrollbar-thumb:hover,
.text-content-box::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
