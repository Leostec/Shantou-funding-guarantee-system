<template>
  <div class="detail-page" v-if="tableData.length">
    <div class="section-card">
      <div class="section-header">
        <div>
          <h3>基础信息</h3>
          <p class="subtitle">报告编号与企业关键信息</p>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <label>报告编号</label>
          <span>{{ tableData[0].project_number }}</span>
        </div>
        <div class="info-item">
          <label>企业名称</label>
          <span>{{ tableData[0].company_name }}</span>
        </div>
        <div class="info-item">
          <label>上传日期</label>
          <span>{{ formatDateTime(tableData2[0]?.created_at) }}</span>
        </div>
        <div class="info-item">
          <label>上传负责人</label>
          <span>{{ tableData2[0]?.project_manager }}</span>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h3>文本信息</h3>
          <p class="subtitle">业务背景与软信息</p>
        </div>
      </div>
      <div class="text-grid">
        <div class="text-block" v-for="field in textFields" :key="field.key">
          <h4>{{ field.label }}</h4>
          <div class="text-box">{{ tableData[0][field.key] }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h3>预测结果</h3>
          <p class="subtitle">模型文本输出</p>
        </div>
      </div>
      <div class="predict-box" v-html="tableData[0].prediction_text?.replace(/\n/g, '<br>')"></div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h3>表格数据</h3>
          <p class="subtitle">关键量化指标明细</p>
        </div>
      </div>
      <a-table
        :columns="columns"
        :data-source="filteredTableData"
        :scroll="{ x: 'max-content' }"
        :pagination="false"
        bordered
      >
        <template #headerCell="{ column }">
          <span class="th-bold">{{ column.title }}</span>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'created_at'">
            {{ formatDateTime(record.created_at) }}
          </template>
          <template v-else>
            {{ record[column.key] }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<script setup>
import { ref, onMounted, computed, onActivated } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const tableData = ref([]);
const tableData2 = ref([]);
const searchName = ref("");

const textFields = [
  { key: "education_work_experience", label: "学习及工作经历" },
  { key: "family_social_relations", label: "家庭成员及情况" },
  { key: "business_model", label: "商业模式" },
  { key: "counter_guarantee", label: "反担保措施" },
  { key: "main_business", label: "主营业务" },
  { key: "profit_usage", label: "近三年利润去向" },
  { key: "other_soft_info", label: "其他软信息描述" },
  { key: "loan_purpose", label: "贷款用途描述" },
];

const excludedFields = [
  "education_work_experience",
  "family_social_relations",
  "counter_guarantee",
  "business_model",
  "main_business",
  "profit_usage",
  "other_soft_info",
  "loan_purpose",
  "prediction_text",
  "id",
];

const columns = [
  { title: "公司名称", dataIndex: "company_name", key: "company_name" },
  { title: "上传日期", dataIndex: "created_at", key: "created_at" },
  { title: "申请期限", dataIndex: "application_period", key: "application_period" },
  { title: "项目经理", dataIndex: "project_manager", key: "project_manager" },
  { title: "销售负债率", dataIndex: "sales_debt_ratio", key: "sales_debt_ratio" },
  { title: "资产负债率", dataIndex: "asset_debt_ratio", key: "asset_debt_ratio" },
  { title: "银行流水年总额流入", dataIndex: "bank_inflow", key: "bank_inflow" },
  { title: "银行流水年总额流出", dataIndex: "bank_outflow", key: "bank_outflow" },
  { title: "销售收入", dataIndex: "annual_sales", key: "annual_sales" },
  { title: "净利润", dataIndex: "annual_net_profit", key: "annual_net_profit" },
  { title: "年净收益", dataIndex: "monthly_net_profit", key: "monthly_net_profit" },
  { title: "月均余额", dataIndex: "monthly_balance", key: "monthly_balance" },
  { title: "应收账款", dataIndex: "receivables_at_meeting", key: "receivables_at_meeting" },
  { title: "总资产", dataIndex: "total_assets", key: "total_assets" },
  { title: "总负债", dataIndex: "total_liabilities", key: "total_liabilities" },
  { title: "净资产", dataIndex: "net_assets", key: "net_assets" },
  { title: "经营性贷款", dataIndex: "monthly_repayment", key: "monthly_repayment" },
  { title: "月还款额/月净收益对比", dataIndex: "repayment_income_ratio", key: "repayment_income_ratio" },
  { title: "征信查询数", dataIndex: "credit_inquiries", key: "credit_inquiries" },
  { title: "征信逾期", dataIndex: "overdue_times", key: "overdue_times" },
  { title: "微贷产品服务方向", dataIndex: "industry_category", key: "industry_category" },
  { title: "申请额度", dataIndex: "application_amount", key: "application_amount" },
  { title: "测定额度", dataIndex: "determined_amount", key: "determined_amount" },
  { title: "报告编号", dataIndex: "project_number", key: "project_number" },
  { title: "预测结果", dataIndex: "predicted", key: "predicted" },
  { title: "专家意见", dataIndex: "expert_opinion", key: "expert_opinion" },
  { title: "专家测算额度", dataIndex: "expert_amount", key: "expert_amount" },
];

const filteredTableData = computed(() => {
  return tableData.value.map((item) => {
    const newItem = { ...item };
    excludedFields.forEach((field) => {
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
    tableData.value = response.data || [];
    tableData2.value = response2.data || [];
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
}

const formatDateTime = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleString("zh-CN", { hour12: false });
};

onMounted(() => {
  const reportNumber = route.params.reportNumber;
  if (reportNumber) {
    searchName.value = reportNumber;
    fetchTableDataWithSearch();
  }
});

onActivated(() => {
  const reportNumber = route.params.reportNumber;
  if (reportNumber) {
    searchName.value = reportNumber;
    fetchTableDataWithSearch();
  }
});
</script>

<style scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.subtitle {
  margin-top: 4px;
  color: #666;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #f7f9fb;
  border-radius: 8px;
  padding: 10px;
}
.info-item label {
  color: #666;
}
.text-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}
.text-block {
  background: #f7f9fb;
  border-radius: 8px;
  padding: 10px;
}
.text-box {
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  white-space: pre-wrap;
  line-height: 1.5;
}
.predict-box {
  background: #f7f9fb;
  border-radius: 8px;
  padding: 12px;
  min-height: 120px;
  border: 1px solid #eee;
  line-height: 1.6;
}
.th-bold {
  font-weight: 700;
}
.loading {
  padding: 40px;
  text-align: center;
}
</style>
