<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>我的录入</h2>
        <p class="subtitle">查看我提交的每一条评估记录</p>
      </div>
      <div class="actions">
        <span class="count">共 {{ records.length }} 条</span>
        <a-button type="link" @click="fetchEntries" :loading="loading">刷新</a-button>
      </div>
    </div>

    <a-alert
      v-if="!username"
      message="请先登录后再查看录入记录"
      type="warning"
      show-icon
      style="margin-bottom: 16px;"
    />

    <a-table
      v-else
      :columns="columns"
      :data-source="records"
      :loading="loading"
      :row-key="row => row.id || row.project_number"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" @click="openEdit(record)">编辑</a-button>
            <a-popconfirm
              title="确认删除这条记录吗？"
              ok-text="删除"
              cancel-text="取消"
              @confirm="() => deleteRecord(record)"
            >
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>

      <template #expandedRowRender="{ record }">
        <div class="detail-grid">
          <div
            v-for="item in getDisplayEntries(record)"
            :key="item.key"
            class="detail-item"
          >
            <div class="label">{{ item.label }}</div>
            <div class="value">{{ formatValue(item.value) }}</div>
          </div>
        </div>
      </template>
    </a-table>

    <a-modal
      v-model:visible="editVisible"
      title="编辑录入"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="saving"
      width="900px"
      @ok="submitEdit"
    >
      <a-form layout="vertical" class="edit-grid">
        <a-form-item
          v-for="key in editableFields"
          :key="key"
          :label="fieldLabels[key] || key"
        >
          <a-input v-model:value="editForm[key]" :disabled="key === 'created_at' || key === 'id'" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';

interface RecordItem {
  [key: string]: any;
}

const username = ref<string>(localStorage.getItem('username') || '');
const records = ref<RecordItem[]>([]);
const loading = ref<boolean>(false);
const editVisible = ref<boolean>(false);
const saving = ref<boolean>(false);
const editForm = ref<RecordItem>({});
const currentRecordId = ref<string | number | null>(null);

const columns = [
  { title: '企业编号', dataIndex: 'project_number', key: 'project_number' },
  { title: '企业名称', dataIndex: 'company_name', key: 'company_name' },
  { title: '申请金额(万元)', dataIndex: 'application_amount', key: 'application_amount' },
  { title: '申请期限(月)', dataIndex: 'application_period', key: 'application_period' },
  { title: '预测额度(万元)', dataIndex: 'predicted', key: 'predicted' },
  { title: '创建时间', dataIndex: 'created_at', key: 'created_at', customRender: ({ text }: any) => formatDateTime(text) },
  { title: '操作', key: 'actions' },
];

const fieldLabels: Record<string, string> = {
  id: 'ID',
  project_number: '企业编号',
  company_name: '企业名称',
  project_manager: '项目经理',
  application_amount: '申请金额(万元)',
  application_period: '申请期限(月)',
  repayment_method: '还款方式',
  controller_gender: '实控人性别',
  education_level: '实控人文化程度',
  marital_status: '婚姻状况',
  residence_type: '居住场所类型',
  local_residence_years: '本地居住时间(年)',
  industry_category: '所属行业(大类)',
  industry_experience: '借款人从业年限',
  is_foreign_trade: '是否外贸型',
  is_cautious_industry: '是否慎入行业',
  employee_count: '企业雇佣人数',
  business_premises_type: '经营场所类型',
  monthly_rent: '场地月租金',
  monthly_balance: '月均余额',
  daily_balance: '日均余额',
  electricity_consumption: '用电量',
  cash_at_meeting: '上会时点货币资金',
  receivables_at_meeting: '上会时点应收账款',
  inventory_at_meeting: '上会时点存货',
  payables_at_meeting: '上会时点应付账款',
  total_assets: '总资产',
  total_liabilities: '总负债',
  net_assets: '净资产',
  annual_sales: '年销售收入',
  annual_net_profit: '年净利润',
  monthly_net_profit: '月净利润',
  core_assets: '核心资产',
  hard_liabilities: '硬性负债',
  operating_liabilities: '经营负债',
  sales_debt_ratio: '销售/负债比',
  asset_debt_ratio: '资产/负债比',
  monthly_repayment: '月还款额',
  total_monthly_repayment: '总月还款额',
  repayment_income_ratio: '月还款/月净利润',
  average_payment_period: '平均付款账期',
  family_harmony: '家庭和睦度',
  minor_children: '未成年子女数',
  adult_family_members: '成年家庭成员数',
  working_family_members: '在职家庭成员数',
  credit_inquiries: '征信查询次数',
  overdue_times: '逾期次数',
  max_overdue_amount: '最大逾期金额',
  bank_inflow: '银行流水流入',
  bank_outflow: '银行流水流出',
  highest_flow_month: '流水峰值月份',
  lowest_flow_month: '流水低谷月份',
  company_guarantee: '企业保证',
  personal_guarantee: '个人保证',
  additional_guarantor: '是否有额外担保人',
  property_mortgage: '房产抵押',
  property_second_mortgage: '房产二抵',
  equipment_mortgage: '设备抵押',
  is_growth_stage: '是否成长阶段',
  used_youdaibao: '是否使用友贷宝',
  education_work_experience: '教育/工作经历',
  family_social_relations: '家庭成员和社会关系',
  business_model: '商业模式',
  counter_guarantee: '反担保措施',
  main_business: '主营业务',
  profit_usage: '利润用途',
  other_soft_info: '其他软信息',
  loan_purpose: '贷款用途',
  predicted: '预测额度',
  prediction_text: '预测结果文本',
  expert_opinion: '专家意见',
  expert_amount: '专家测算额度',
  created_by: '创建人',
  created_at: '创建时间',
};

const detailOrder = [
  'project_number',
  'company_name',
  'project_manager',
  'application_amount',
  'application_period',
  'repayment_method',
  'controller_gender',
  'education_level',
  'marital_status',
  'residence_type',
  'local_residence_years',
  'industry_category',
  'industry_experience',
  'is_foreign_trade',
  'is_cautious_industry',
  'employee_count',
  'business_premises_type',
  'monthly_rent',
  'monthly_balance',
  'daily_balance',
  'electricity_consumption',
  'cash_at_meeting',
  'receivables_at_meeting',
  'inventory_at_meeting',
  'payables_at_meeting',
  'total_assets',
  'total_liabilities',
  'net_assets',
  'annual_sales',
  'annual_net_profit',
  'monthly_net_profit',
  'core_assets',
  'hard_liabilities',
  'operating_liabilities',
  'sales_debt_ratio',
  'asset_debt_ratio',
  'monthly_repayment',
  'total_monthly_repayment',
  'repayment_income_ratio',
  'average_payment_period',
  'family_harmony',
  'minor_children',
  'adult_family_members',
  'working_family_members',
  'credit_inquiries',
  'overdue_times',
  'max_overdue_amount',
  'bank_inflow',
  'bank_outflow',
  'highest_flow_month',
  'lowest_flow_month',
  'company_guarantee',
  'personal_guarantee',
  'additional_guarantor',
  'property_mortgage',
  'property_second_mortgage',
  'equipment_mortgage',
  'is_growth_stage',
  'used_youdaibao',
  'education_work_experience',
  'family_social_relations',
  'business_model',
  'counter_guarantee',
  'main_business',
  'profit_usage',
  'other_soft_info',
  'loan_purpose',
  'predicted',
  'prediction_text',
  'expert_opinion',
  'expert_amount',
  'created_by',
  'created_at',
];

const editableFields = computed(() => {
  const base = detailOrder.filter((key) => key !== 'created_at');
  const extras = Object.keys(editForm.value || {}).filter(
    (key) => !base.includes(key) && key !== 'id'
  );
  return [...base, ...extras];
});

const getDisplayEntries = (record: RecordItem) => {
  const extraKeys = Object.keys(record).filter((key) => !detailOrder.includes(key));
  const orderedKeys = [...detailOrder, ...extraKeys];

  return orderedKeys.map((key) => ({
    key,
    label: fieldLabels[key] || key,
    value: record[key],
  }));
};

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') return '—';
  return value;
};

const formatDateTime = (val: any) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleString('zh-CN', { hour12: false });
};

const openEdit = (record: RecordItem) => {
  currentRecordId.value = record.id || record.project_number;
  editForm.value = { ...record };
  editVisible.value = true;
};

const submitEdit = async () => {
  if (!currentRecordId.value) {
    message.error('缺少记录ID，无法更新');
    return;
  }
  saving.value = true;
  try {
    await axios.put(`http://localhost:8989/loan-application/${currentRecordId.value}`, editForm.value);
    message.success('保存成功');
    editVisible.value = false;
    await fetchEntries();
  } catch (error: any) {
    console.error('更新失败', error);
    message.error(error?.response?.data?.error || '更新失败');
  } finally {
    saving.value = false;
  }
};

const deleteRecord = async (record: RecordItem) => {
  const id = record.id || record.project_number;
  if (!id) {
    message.error('缺少记录ID，无法删除');
    return;
  }
  try {
    await axios.delete(`http://localhost:8989/loan-application-with-summary/${id}`);
    message.success('删除成功');
    await fetchEntries();
  } catch (error: any) {
    console.error('删除失败', error);
    message.error(error?.response?.data?.error || '删除失败');
  }
};

const fetchEntries = async () => {
  if (!username.value) {
    message.warning('请先登录');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get('http://localhost:8989/loan-application', {
      params: { createdBy: username.value },
    });
    records.value = response.data || [];
  } catch (error: any) {
    console.error('获取录入记录失败', error);
    message.error(error?.response?.data?.error || '获取录入记录失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEntries();
});
</script>

<style scoped>
.page {
  padding: 16px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.subtitle {
  margin: 4px 0 0;
  color: #666;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
}

.count {
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.detail-item {
  padding: 8px 10px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.label {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.value {
  color: #1f1f1f;
  word-break: break-all;
}

.edit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px 16px;
  max-height: 60vh;
  overflow-y: auto;
}
</style>
