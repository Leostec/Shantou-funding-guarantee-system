<template>
  <div class="form-container">
    <div class="page-header">
      <div>
        <h2>信息录入</h2>
        <p class="subtitle">企业多维信息保存</p>
      </div>
    </div>
    <div class="main-content">
      <!-- 左侧输入表单 -->
      <div class="input-section">
    <form @submit.prevent>
          <!-- 基础信息 -->
          <div class="form-section">
            <h3>基础信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="project_number">企业编号:</label>
                <input type="text" id="project_number" v-model="project_number" />
              </div>
              <div class="form-item">
                <label for="company_name">企业名称:</label>
                <input type="text" id="company_name" v-model="company_name" />
              </div>
              <div class="form-item">
                <label for="project_manager">项目经理A:</label>
                <input type="text" id="project_manager" v-model="project_manager" />
              </div>
            </div>
          </div>

          <!-- 申请信息 -->
          <div class="form-section">
            <h3>申请信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="application_amount">申请金额:</label>
                <input type="number" id="application_amount" v-model="application_amount" placeholder="万元" />
              </div>
              <div class="form-item">
          <label for="application_period">申请期限:</label>
                <input type="number" id="application_period" v-model="application_period" placeholder="年" />
              </div>
              <div class="form-item">
                <label for="repayment_method">申请还款方案还款方式:</label>
                <input type="number" id="repayment_method" v-model="repayment_method" placeholder="万元" />
              </div>
            </div>
          </div>

          <!-- 个人信息 -->
          <div class="form-section">
            <h3>个人信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="controller_gender">实控人性别:</label>
                <select id="controller_gender" v-model="controller_gender">
                  <option value="1">男</option>
                  <option value="0">女</option>
                </select>
              </div>
              <div class="form-item">
                <label for="education_level">实控人文化程度:</label>
                <select id="education_level" v-model="education_level">
                  <option value="0">小学</option>
                  <option value="1">初中</option>
                  <option value="1.5">职高</option>
                  <option value="2">高中</option>
                  <option value="2">中专</option>
                  <option value="3">大专</option>
                  <option value="4">本科</option>
                  <option value="5">硕士</option>
                  <option value="6">博士</option>
                  <option value="7">博士后</option>
                </select>
              </div>
              <div class="form-item">
                <label for="marital_status">婚姻状态:</label>
                <select id="marital_status" v-model="marital_status">
                  <option value="0">未婚</option>
                  <option value="1">已婚</option>
                  <option value="2">离异</option>
                  <option value="3">丧偶</option>
                </select>
              </div>
              <div class="form-item">
                <label for="residence_type">居住场所类型:</label>
                <select id="residence_type" v-model="residence_type">
                  <option value="0">自有住宅</option>
                  <option value="1">租赁</option>
                </select>
              </div>
              <div class="form-item">
                <label for="local_residence_years">本地居住时间:</label>
                <input type="number" id="local_residence_years" v-model="local_residence_years" placeholder="年" />
              </div>
            </div>
          </div>

          <!-- 企业信息 -->
          <div class="form-section">
            <h3>企业信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="industry_category">所属行业（大类）:</label>
                <select id="industry_category" v-model="industry_category">
                  <option value="0">餐饮业</option>
                  <option value="1">纺织业</option>
                  <option value="2">服务业</option>
                  <option value="3">公安安全管理业</option>
                  <option value="4">建筑业</option>
                  <option value="5">教育业</option>
                  <option value="6">零售业</option>
                  <option value="7">贸易</option>
                  <option value="8">农业</option>
                  <option value="9">制造业</option>
                </select>
              </div>
              <div class="form-item">
                <label for="industry_experience">借款人从业年限:</label>
                <input type="number" id="industry_experience" v-model="industry_experience" placeholder="年" />
              </div>
              <div class="form-item">
                <label for="is_foreign_trade">是否外贸型:</label>
                <select id="is_foreign_trade" v-model="is_foreign_trade">
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </div>
              <div class="form-item">
                <label for="is_cautious_industry">是否属于谨慎介入行业:</label>
                <select id="is_cautious_industry" v-model="is_cautious_industry">
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </div>
              <div class="form-item">
                <label for="employee_count">企业雇佣人数:</label>
                <input type="number" id="employee_count" v-model="employee_count" placeholder="人" />
              </div>
              <div class="form-item">
                <label for="business_premises_type">经营场所类型:</label>
                <select id="business_premises_type" v-model="business_premises_type">
                  <option value="0">自有住宅</option>
                  <option value="1">租赁</option>
                </select>
              </div>
              <div class="form-item">
                <label for="monthly_rent">场地月租金:</label>
                <input type="number" id="monthly_rent" v-model="monthly_rent" placeholder="万元" />
              </div>
            </div>
        </div>
        
          <!-- 财务信息 -->
          <div class="form-section">
            <h3>财务信息</h3>
            <div class="form-grid">
              <div class="form-item">
          <label for="monthly_balance">月均余额:</label>
                <input type="number" id="monthly_balance" v-model="monthly_balance" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="daily_balance">日均余额:</label>
                <input type="number" id="daily_balance" v-model="daily_balance" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="electricity_consumption">用电量:</label>
                <input type="number" id="electricity_consumption" v-model="electricity_consumption" placeholder="度" />
              </div>
              <div class="form-item">
                <label for="cash_at_meeting">上会时点货币资金:</label>
                <input type="number" id="cash_at_meeting" v-model="cash_at_meeting" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="receivables_at_meeting">上会时点应收账款:</label>
                <input type="number" id="receivables_at_meeting" v-model="receivables_at_meeting" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="inventory_at_meeting">上会时点存货:</label>
                <input type="number" id="inventory_at_meeting" v-model="inventory_at_meeting" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="payables_at_meeting">上会时点应付帐款:</label>
                <input type="number" id="payables_at_meeting" v-model="payables_at_meeting" placeholder="万元" />
              </div>
              <div class="form-item">
          <label for="total_assets">总资产:</label>
                <input type="number" id="total_assets" v-model="total_assets" placeholder="万元" />
              </div>
              <div class="form-item">
          <label for="total_liabilities">总负债:</label>
                <input type="number" id="total_liabilities" v-model="total_liabilities" placeholder="万元" />
              </div>
              <div class="form-item">
          <label for="net_assets">净资产:</label>
                <input type="number" id="net_assets" v-model="net_assets" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="annual_sales">年销售收入:</label>
                <input type="number" id="annual_sales" v-model="annual_sales" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="annual_net_profit">年净收益:</label>
                <input type="number" id="annual_net_profit" v-model="annual_net_profit" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="monthly_net_profit">月净收益:</label>
                <input type="number" id="monthly_net_profit" v-model="monthly_net_profit" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="core_assets">核心资产:</label>
                <input type="number" id="core_assets" v-model="core_assets" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="hard_liabilities">硬性负债:</label>
                <input type="number" id="hard_liabilities" v-model="hard_liabilities" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="operating_liabilities">经营性负债:</label>
                <input type="number" id="operating_liabilities" v-model="operating_liabilities" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="sales_debt_ratio">销售负债率:</label>
                <input type="number" id="sales_debt_ratio" v-model="sales_debt_ratio" placeholder="%" />
              </div>
              <div class="form-item">
                <label for="asset_debt_ratio">资产负债率:</label>
                <input type="number" id="asset_debt_ratio" v-model="asset_debt_ratio" placeholder="%" />
              </div>
              <div class="form-item">
                <label for="monthly_repayment">原贷款的月还款本息:</label>
                <input type="number" id="monthly_repayment" v-model="monthly_repayment" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="total_monthly_repayment">加上本笔贷款的月还本息:</label>
                <input type="number" id="total_monthly_repayment" v-model="total_monthly_repayment" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="repayment_income_ratio">月净收益/月还本息比值:</label>
                <input type="number" id="repayment_income_ratio" v-model="repayment_income_ratio" placeholder="倍" />
              </div>
              <div class="form-item">
                <label for="average_payment_period">客户平均账期:</label>
                <input type="number" id="average_payment_period" v-model="average_payment_period" placeholder="天" />
              </div>
            </div>
          </div>

          <!-- 家庭信息 -->
          <div class="form-section">
            <h3>家庭信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="family_harmony">家庭关系是否和睦:</label>
                <select id="family_harmony" v-model="family_harmony">
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </div>
              <div class="form-item">
                <label for="minor_children">孩子（未成年）人数:</label>
                <input type="number" id="minor_children" v-model="minor_children" placeholder="人" />
              </div>
              <div class="form-item">
                <label for="adult_family_members">家庭成年人数:</label>
                <input type="number" id="adult_family_members" v-model="adult_family_members" placeholder="人" />
              </div>
              <div class="form-item">
                <label for="working_family_members">家庭参与劳动的人数:</label>
                <input type="number" id="working_family_members" v-model="working_family_members" placeholder="人" />
              </div>
            </div>
          </div>

          <!-- 信用信息 -->
          <div class="form-section">
            <h3>信用信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="credit_inquiries">征信查询次数:</label>
                <input type="number" id="credit_inquiries" v-model="credit_inquiries" placeholder="次" />
              </div>
              <div class="form-item">
                <label for="overdue_times">逾期次数:</label>
                <input type="number" id="overdue_times" v-model="overdue_times" placeholder="次" />
              </div>
              <div class="form-item">
                <label for="max_overdue_amount">最高逾期金额:</label>
                <input type="number" id="max_overdue_amount" v-model="max_overdue_amount" placeholder="万元" />
              </div>
            </div>
          </div>

          <!-- 银行流水信息 -->
          <div class="form-section">
            <h3>银行流水信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="bank_inflow">银行流水的流入总额:</label>
                <input type="number" id="bank_inflow" v-model="bank_inflow" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="bank_outflow">银行流水的流出总额:</label>
                <input type="number" id="bank_outflow" v-model="bank_outflow" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="highest_flow_month">流水最高月份:</label>
                <input type="text" id="highest_flow_month" v-model="highest_flow_month" placeholder="YYYY-MM" />
              </div>
              <div class="form-item">
                <label for="lowest_flow_month">流水最低月份:</label>
                <input type="text" id="lowest_flow_month" v-model="lowest_flow_month" placeholder="YYYY-MM" />
              </div>
            </div>
        </div>
        
          <!-- 担保信息 -->
          <div class="form-section">
            <h3>担保信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="company_guarantee">企业保证:</label>
                <select id="company_guarantee" v-model="company_guarantee">
                  <option value="1">有</option>
                  <option value="0">没有</option>
                </select>
              </div>
              <div class="form-item">
                <label for="personal_guarantee">个人保证:</label>
                <select id="personal_guarantee" v-model="personal_guarantee">
                  <option value="1">有</option>
                  <option value="0">没有</option>
                </select>
              </div>
              <div class="form-item">
                <label for="additional_guarantor">是否增加了有效担保人:</label>
                <select id="additional_guarantor" v-model="additional_guarantor">
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </div>
              <div class="form-item">
                <label for="property_mortgage">房产抵押评估值:</label>
                <input type="number" id="property_mortgage" v-model="property_mortgage" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="property_second_mortgage">房产二押余值:</label>
                <input type="number" id="property_second_mortgage" v-model="property_second_mortgage" placeholder="万元" />
              </div>
              <div class="form-item">
                <label for="equipment_mortgage">设备抵押净值:</label>
                <input type="number" id="equipment_mortgage" v-model="equipment_mortgage" placeholder="万元" />
              </div>
            </div>
          </div>

          <!-- 其他信息 -->
          <div class="form-section">
            <h3>其他信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="is_growth_stage">是否处于经营快速发展期:</label>
                <select id="is_growth_stage" v-model="is_growth_stage">
            <option value="1">是</option>
            <option value="0">否</option>
          </select>
              </div>
              <div class="form-item">
                <label for="used_youdaibao">是否使用了优贷宝产品:</label>
                <select id="used_youdaibao" v-model="used_youdaibao">
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </div>
            </div>
        </div>

          <!-- 文本信息 -->
          <div class="form-section">
            <h3>文本信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label for="education_work_experience">学习及工作经历:</label>
                <textarea id="education_work_experience" v-model="education_work_experience" rows="4"></textarea>
              </div>
              <div class="form-item">
                <label for="family_social_relations">家庭成员及情况:</label>
                <textarea id="family_social_relations" v-model="family_social_relations" rows="4"></textarea>
              </div>
              <div class="form-item">
                <label for="business_model">商业模式:</label>
                <textarea id="business_model" v-model="business_model" rows="4"></textarea>
              </div>
              <div class="form-item">
                <label for="counter_guarantee">反担保措施:</label>
                <textarea id="counter_guarantee" v-model="counter_guarantee" rows="4"></textarea>
              </div>
              <div class="form-item">
                <label for="main_business">主营业务:</label>
                <textarea id="main_business" v-model="main_business" rows="4"></textarea>
              </div>
              <div class="form-item">
                <label for="profit_usage">近三年利润去向:</label>
                <textarea id="profit_usage" v-model="profit_usage" rows="4"></textarea>
              </div>
              <div class="form-item">
                <label for="other_soft_info">其他软信息描述:</label>
                <textarea id="other_soft_info" v-model="other_soft_info" rows="4"></textarea>
              </div>
              <div class="form-item">
                <label for="loan_purpose">贷款用途描述:</label>
                <textarea id="loan_purpose" v-model="loan_purpose" rows="4"></textarea>
              </div>
            </div>
          </div>

          <div class="submit-section">
            <el-button type="primary" @click="saveDraft" style="margin-right: 10px;">暂存</el-button>
            <el-button type="info" @click="restoreDraft" style="margin-right: 10px;">恢复暂存</el-button>
            <el-button type="warning" @click="saveWithoutPredict" style="margin-right: 10px;">保存</el-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from "vue";
import axios from "axios";
import { Form, InputNumber, Button } from "ant-design-vue";
import { ExclamationCircleFilled } from "@ant-design/icons-vue";
import { ElMessage } from "element-plus";

//创建列表
const predictions = ref([]);

//输入框初始化
const project_number = ref('');
const company_name = ref('');
const project_manager = ref('');
const application_amount = ref('');
const application_period = ref('');
const repayment_method = ref('');
const controller_gender = ref('');
const education_level = ref('');
const marital_status = ref('');
const residence_type = ref('');
const local_residence_years = ref('');
const main_business = ref('');
const industry_category = ref('');
const industry_experience = ref('');
const is_foreign_trade = ref('0');
const is_cautious_industry = ref('0');
const employee_count = ref('');
const business_premises_type = ref('');
const monthly_rent = ref('');
const monthly_balance = ref('');
const daily_balance = ref('');
const electricity_consumption = ref('');
const cash_at_meeting = ref('');
const receivables_at_meeting = ref('');
const inventory_at_meeting = ref('');
const payables_at_meeting = ref('');
const total_assets = ref('');
const total_liabilities = ref('');
const net_assets = ref('');
const annual_sales = ref('');
const annual_net_profit = ref('');
const monthly_net_profit = ref('');
const profit_usage = ref('');
const core_assets = ref('');
const hard_liabilities = ref('');
const operating_liabilities = ref('');
const sales_debt_ratio = ref('');
const asset_debt_ratio = ref('');
const monthly_repayment = ref('');
const total_monthly_repayment = ref('');
const repayment_income_ratio = ref('');
const average_payment_period = ref('');
const family_harmony = ref('1');
const minor_children = ref('');
const adult_family_members = ref('');
const working_family_members = ref('');
const bad_habits = ref('');
const other_soft_info = ref('');
const credit_inquiries = ref('');
const overdue_times = ref('');
const max_overdue_amount = ref('');
const external_guarantee = ref('');
const education_work_experience = ref('');
const family_social_relations = ref('');
const business_model = ref('');
const counter_guarantee = ref('');
const bank_inflow = ref('');
const bank_outflow = ref('');
const highest_flow_month = ref('');
const lowest_flow_month = ref('');
const loan_purpose = ref('');
const project_conclusion = ref('');
const company_guarantee = ref('');
const personal_guarantee = ref('');
const additional_guarantor = ref('0');
const property_mortgage = ref('');
const property_second_mortgage = ref('');
const equipment_mortgage = ref('');
const receivables_pledge = ref('');
const equity_pledge = ref('');
const movable_mortgage = ref('');
const other_collateral = ref('');
const is_growth_stage = ref('0');
const used_youdaibao = ref('0');

// 暂存/恢复用：统一收集表单字段
const DRAFT_KEY = "vis_form_draft";
const formFields = {
  project_number,
  company_name,
  project_manager,
  application_amount,
  application_period,
  repayment_method,
  controller_gender,
  education_level,
  marital_status,
  residence_type,
  local_residence_years,
  main_business,
  industry_category,
  industry_experience,
  is_foreign_trade,
  is_cautious_industry,
  employee_count,
  business_premises_type,
  monthly_rent,
  monthly_balance,
  daily_balance,
  electricity_consumption,
  cash_at_meeting,
  receivables_at_meeting,
  inventory_at_meeting,
  payables_at_meeting,
  total_assets,
  total_liabilities,
  net_assets,
  annual_sales,
  annual_net_profit,
  monthly_net_profit,
  profit_usage,
  core_assets,
  hard_liabilities,
  operating_liabilities,
  sales_debt_ratio,
  asset_debt_ratio,
  monthly_repayment,
  total_monthly_repayment,
  repayment_income_ratio,
  average_payment_period,
  family_harmony,
  minor_children,
  adult_family_members,
  working_family_members,
  bad_habits,
  other_soft_info,
  credit_inquiries,
  overdue_times,
  max_overdue_amount,
  external_guarantee,
  education_work_experience,
  family_social_relations,
  business_model,
  counter_guarantee,
  bank_inflow,
  bank_outflow,
  highest_flow_month,
  lowest_flow_month,
  loan_purpose,
  project_conclusion,
  company_guarantee,
  personal_guarantee,
  additional_guarantor,
  property_mortgage,
  property_second_mortgage,
  equipment_mortgage,
  receivables_pledge,
  equity_pledge,
  movable_mortgage,
  other_collateral,
  is_growth_stage,
  used_youdaibao,
};

const saveDraft = () => {
  const draft = {};
  Object.entries(formFields).forEach(([key, refObj]) => {
    draft[key] = refObj.value;
  });
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ data: draft, savedAt: new Date().toISOString() })
  );
  ElMessage.success("已暂存当前填写内容");
};

const restoreDraft = () => {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) {
    ElMessage.warning("暂无暂存数据");
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    const data = parsed?.data || {};
    Object.entries(formFields).forEach(([key, refObj]) => {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        refObj.value = data[key];
      }
    });
    ElMessage.success("已恢复上次暂存内容");
  } catch (e) {
    console.error("恢复暂存失败:", e);
    ElMessage.error("暂存数据损坏，请重新填写");
  }
};

//预测结果展示
const predicted = ref(null);
const issues = ref([]);
const hasSuspensionCondition = ref(false);
const predictionText = ref('');

//创建column
const columns = [
  {
    title: "公司名称",
    dataIndex: "company_name",
    key: "company_name",
  },
  {
    title: "上传日期",
    dataIndex: "date",
    key: "date",
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
    title: "反担保措施",
    dataIndex: "counter_guarantee",
    key: "counter_guarantee",
  },
  {
    title: "商业模式",
    dataIndex: "business_model",
    key: "business_model",
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
    title: "学习、工作经历",
    dataIndex: "education_work_experience",
    key: "education_work_experience",
  },
  {
    title: "家庭成员和社会关系",
    dataIndex: "family_social_relations",
    key: "family_social_relations",
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
  }
];

const determined_amount = ref(null);

// SHAP图URL
const shapPlotUrl = ref(null);

// 在 script setup 部分添加加载状态
const isLoading = ref(false);

// 修改 predictContent 函数
const predictContent = async () => {
  console.log('点击了提交按钮');
  predictions.value = [];
  issues.value = [];
  hasSuspensionCondition.value = false;
  predictionText.value = '';
  isLoading.value = true;

  try {
    // 计算测定额度
    determined_amount.value = (annual_net_profit.value * application_period.value * 0.7) - monthly_repayment.value;
    console.log('正在发送后端请求...');
    
    // 将数据提交到后端
    const response = await axios.post("http://127.0.0.1:5000/demo", {
      project_number: project_number.value,
      company_name: company_name.value,
      project_manager: project_manager.value,
      application_amount: application_amount.value,
      application_period: application_period.value,
      repayment_method: repayment_method.value,
      controller_gender: controller_gender.value,
      education_level: education_level.value,
      marital_status: marital_status.value,
      residence_type: residence_type.value,
      local_residence_years: local_residence_years.value,
      industry_category: industry_category.value,
      industry_experience: industry_experience.value,
      is_foreign_trade: is_foreign_trade.value,
      is_cautious_industry: is_cautious_industry.value,
      employee_count: employee_count.value,
      business_premises_type: business_premises_type.value,
      monthly_rent: monthly_rent.value,
      monthly_balance: monthly_balance.value,
      daily_balance: daily_balance.value,
      electricity_consumption: electricity_consumption.value,
      cash_at_meeting: cash_at_meeting.value,
      receivables_at_meeting: receivables_at_meeting.value,
      inventory_at_meeting: inventory_at_meeting.value,
      payables_at_meeting: payables_at_meeting.value,
      total_assets: total_assets.value,
      total_liabilities: total_liabilities.value,
      net_assets: net_assets.value,
      annual_sales: annual_sales.value,
      annual_net_profit: annual_net_profit.value,
      monthly_net_profit: monthly_net_profit.value,
      core_assets: core_assets.value,
      hard_liabilities: hard_liabilities.value,
      operating_liabilities: operating_liabilities.value,
      sales_debt_ratio: sales_debt_ratio.value,
      asset_debt_ratio: asset_debt_ratio.value,
      monthly_repayment: monthly_repayment.value,
      total_monthly_repayment: total_monthly_repayment.value,
      repayment_income_ratio: repayment_income_ratio.value,
      average_payment_period: average_payment_period.value,
      family_harmony: family_harmony.value,
      minor_children: minor_children.value,
      adult_family_members: adult_family_members.value,
      working_family_members: working_family_members.value,
      credit_inquiries: credit_inquiries.value,
      overdue_times: overdue_times.value,
      max_overdue_amount: max_overdue_amount.value,
      bank_inflow: bank_inflow.value,
      bank_outflow: bank_outflow.value,
      highest_flow_month: highest_flow_month.value,
      lowest_flow_month: lowest_flow_month.value,
      company_guarantee: company_guarantee.value,
      personal_guarantee: personal_guarantee.value,
      additional_guarantor: additional_guarantor.value,
      property_mortgage: property_mortgage.value,
      property_second_mortgage: property_second_mortgage.value,
      equipment_mortgage: equipment_mortgage.value,
      is_growth_stage: is_growth_stage.value,
      used_youdaibao: used_youdaibao.value,
      education_work_experience: education_work_experience.value,
      family_social_relations: family_social_relations.value,
      business_model: business_model.value,
      counter_guarantee: counter_guarantee.value,
      main_business: main_business.value,
      profit_usage: profit_usage.value,
      other_soft_info: other_soft_info.value,
      loan_purpose: loan_purpose.value,
      predicted: predicted.value
    });

    console.log('Response:', response.data);
    
    // 处理响应数据
    if (response.data) {
      const responseData = response.data;
      let resultText = '';
      
      // 优先从对象字段拼接展示文本
      if (typeof responseData === 'object') {
        Object.keys(responseData).forEach((key) => {
          resultText += `${key}: ${responseData[key]}\n`;
        });
      } else {
        resultText = responseData.toString();
      }
      
      // 保存评估结果文本
      predictionText.value = resultText;
      console.log('设置预测结果文本:', predictionText.value);
      
      // 优先从 JSON 字段读取预测金额，缺失时再尝试文本正则
      let predictedAmount = Number(
        responseData?.["模型预测金额"] ??
        responseData?.model_result ??
        responseData?.predicted ??
        responseData?.prediction
      );
      if (Number.isNaN(predictedAmount)) {
        const match = resultText.match(/模型对该企业的评估资产的预测结果：(\d+\.?\d*)万元/);
        if (match && match[1]) {
          predictedAmount = parseFloat(match[1]);
        }
      }
      
      if (!Number.isNaN(predictedAmount)) {
        predicted.value = predictedAmount;

    // 检查是否有需要暂缓的情况
        if (predictedAmount === 0) {
          if (bank_inflow.value == 0) {
        issues.value.push('银行流水流入为0');
        hasSuspensionCondition.value = true;
      }
          if (bank_outflow.value == 0) {
        issues.value.push('银行流水流出为0');
        hasSuspensionCondition.value = true;
      }
      if (monthly_balance.value == 0) {
        issues.value.push('月均余额为0');
        hasSuspensionCondition.value = true;
      }
          if (repayment_income_ratio.value >= 1) {
        issues.value.push('月还款额/月净收益大于等于1');
        hasSuspensionCondition.value = true;
      }
      if (counter_guarantee.value === '' || counter_guarantee.value === '无') {
        issues.value.push('反担保措施未填或为无');
        hasSuspensionCondition.value = true;
      }
    }

        // 准备基础信息数据
        const basicData = {
          company_name: company_name.value,
          date: new Date().toISOString().split('T')[0], // 只保留日期部分 YYYY-MM-DD
          application_period: application_period.value,
          project_manager: project_manager.value,
          report_number: project_number.value, // 使用 project_number 作为 report_number
          predicted: predictedAmount,
          created_by: localStorage.getItem("username") || ""
        };

        // 准备详细信息数据
        const detailData = {
          project_number: project_number.value,
          company_name: company_name.value,
          project_manager: project_manager.value,
          application_amount: application_amount.value,
      application_period: application_period.value,
          repayment_method: repayment_method.value,
          controller_gender: controller_gender.value,
          education_level: education_level.value,
          marital_status: marital_status.value,
          residence_type: residence_type.value,
          local_residence_years: local_residence_years.value,
          industry_category: industry_category.value,
          industry_experience: industry_experience.value,
          is_foreign_trade: is_foreign_trade.value,
          is_cautious_industry: is_cautious_industry.value,
          employee_count: employee_count.value,
          business_premises_type: business_premises_type.value,
          monthly_rent: monthly_rent.value,
      monthly_balance: monthly_balance.value,
          daily_balance: daily_balance.value,
          electricity_consumption: electricity_consumption.value,
          cash_at_meeting: cash_at_meeting.value,
          receivables_at_meeting: receivables_at_meeting.value,
          inventory_at_meeting: inventory_at_meeting.value,
          payables_at_meeting: payables_at_meeting.value,
      total_assets: total_assets.value,
      total_liabilities: total_liabilities.value,
      net_assets: net_assets.value,
          annual_sales: annual_sales.value,
          annual_net_profit: annual_net_profit.value,
          monthly_net_profit: monthly_net_profit.value,
          core_assets: core_assets.value,
          hard_liabilities: hard_liabilities.value,
          operating_liabilities: operating_liabilities.value,
          sales_debt_ratio: sales_debt_ratio.value,
          asset_debt_ratio: asset_debt_ratio.value,
          monthly_repayment: monthly_repayment.value,
          total_monthly_repayment: total_monthly_repayment.value,
          repayment_income_ratio: repayment_income_ratio.value,
          average_payment_period: average_payment_period.value,
          family_harmony: family_harmony.value,
          minor_children: minor_children.value,
          adult_family_members: adult_family_members.value,
          working_family_members: working_family_members.value,
      credit_inquiries: credit_inquiries.value,
          overdue_times: overdue_times.value,
          max_overdue_amount: max_overdue_amount.value,
          bank_inflow: bank_inflow.value,
          bank_outflow: bank_outflow.value,
          highest_flow_month: highest_flow_month.value,
          lowest_flow_month: lowest_flow_month.value,
          company_guarantee: company_guarantee.value,
          personal_guarantee: personal_guarantee.value,
          additional_guarantor: additional_guarantor.value,
          property_mortgage: property_mortgage.value,
          property_second_mortgage: property_second_mortgage.value,
          equipment_mortgage: equipment_mortgage.value,
          is_growth_stage: is_growth_stage.value,
          used_youdaibao: used_youdaibao.value,
      education_work_experience: education_work_experience.value,
      family_social_relations: family_social_relations.value,
          business_model: business_model.value,
          counter_guarantee: counter_guarantee.value,
          main_business: main_business.value,
          profit_usage: profit_usage.value,
          other_soft_info: other_soft_info.value,
          loan_purpose: loan_purpose.value,
          predicted: predictedAmount,
          prediction_text: predictionText.value, // 添加预测结果文本
          created_by: localStorage.getItem("username") || ""
        };

        // 保存到两个数据库
        try {
          // 保存基础信息
          const basicResponse = await axios.post("http://localhost:8989/insert-huizong", basicData);
          console.log('基础信息保存成功:', basicResponse.data);

          // 保存详细信息
          const detailResponse = await axios.post("http://localhost:8989/insert-prediction", detailData);
          console.log('详细信息保存成功:', detailResponse.data);
        } catch (saveError) {
          console.error('保存数据失败:', saveError);
        }
      } else {
        console.error('无法从响应中提取预测金额');
      }
    } else {
      console.error('提交失败：响应数据为空');
    }
  } catch (error) {
    console.error('提交出错：', error);
  } finally {
    isLoading.value = false;
  }
};

const insertPredictionToDatabase = async () => {
  try {
    // 确保predictions有值
    if (predictions.value.length > 0) {
      const response = await axios.post(
        "http://localhost:8989/insert-prediction",
        predictions.value
      );
      console.log(response.data); // 打印响应数据
      const response2 = await axios.post(
        "http://localhost:8989/loan-application",
        predictions.value
      );
      console.log(response2.data);
    } else {
      console.log("No predictions to insert");
    }
  } catch (error) {
    console.error("Error inserting predictions:", error);
  }
};

// 新增：仅保存，不调用模型
const saveWithoutPredict = async () => {
  try {
    const predictedAmount = null;
    const basicData = {
      company_name: company_name.value,
      date: new Date().toISOString().split("T")[0],
      application_period: application_period.value,
      project_manager: project_manager.value,
      report_number: project_number.value,
      predicted: predictedAmount,
      created_by: localStorage.getItem("username") || "",
    };

    const detailData = {
      project_number: project_number.value,
      company_name: company_name.value,
      project_manager: project_manager.value,
      application_amount: application_amount.value,
      application_period: application_period.value,
      repayment_method: repayment_method.value,
      controller_gender: controller_gender.value,
      education_level: education_level.value,
      marital_status: marital_status.value,
      residence_type: residence_type.value,
      local_residence_years: local_residence_years.value,
      industry_category: industry_category.value,
      industry_experience: industry_experience.value,
      is_foreign_trade: is_foreign_trade.value,
      is_cautious_industry: is_cautious_industry.value,
      employee_count: employee_count.value,
      business_premises_type: business_premises_type.value,
      monthly_rent: monthly_rent.value,
      monthly_balance: monthly_balance.value,
      daily_balance: daily_balance.value,
      electricity_consumption: electricity_consumption.value,
      cash_at_meeting: cash_at_meeting.value,
      receivables_at_meeting: receivables_at_meeting.value,
      inventory_at_meeting: inventory_at_meeting.value,
      payables_at_meeting: payables_at_meeting.value,
      total_assets: total_assets.value,
      total_liabilities: total_liabilities.value,
      net_assets: net_assets.value,
      annual_sales: annual_sales.value,
      annual_net_profit: annual_net_profit.value,
      monthly_net_profit: monthly_net_profit.value,
      core_assets: core_assets.value,
      hard_liabilities: hard_liabilities.value,
      operating_liabilities: operating_liabilities.value,
      sales_debt_ratio: sales_debt_ratio.value,
      asset_debt_ratio: asset_debt_ratio.value,
      monthly_repayment: monthly_repayment.value,
      total_monthly_repayment: total_monthly_repayment.value,
      repayment_income_ratio: repayment_income_ratio.value,
      average_payment_period: average_payment_period.value,
      family_harmony: family_harmony.value,
      minor_children: minor_children.value,
      adult_family_members: adult_family_members.value,
      working_family_members: working_family_members.value,
      credit_inquiries: credit_inquiries.value,
      overdue_times: overdue_times.value,
      max_overdue_amount: max_overdue_amount.value,
      bank_inflow: bank_inflow.value,
      bank_outflow: bank_outflow.value,
      highest_flow_month: highest_flow_month.value,
      lowest_flow_month: lowest_flow_month.value,
      company_guarantee: company_guarantee.value,
      personal_guarantee: personal_guarantee.value,
      additional_guarantor: additional_guarantor.value,
      property_mortgage: property_mortgage.value,
      property_second_mortgage: property_second_mortgage.value,
      equipment_mortgage: equipment_mortgage.value,
      is_growth_stage: is_growth_stage.value,
      used_youdaibao: used_youdaibao.value,
      education_work_experience: education_work_experience.value,
      family_social_relations: family_social_relations.value,
      business_model: business_model.value,
      counter_guarantee: counter_guarantee.value,
      main_business: main_business.value,
      profit_usage: profit_usage.value,
      other_soft_info: other_soft_info.value,
      loan_purpose: loan_purpose.value,
      predicted: predictedAmount,
      prediction_text: "",
      created_by: localStorage.getItem("username") || "",
    };

    await axios.post("http://localhost:8989/insert-huizong", basicData);
    await axios.post("http://localhost:8989/insert-prediction", detailData);
    ElMessage.success("已保存，无需模型预测");
    window.location.reload();
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败，请重试");
  }
};
</script>
    
<style scoped>
.form-container {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.subtitle {
  margin: 4px 0 0;
  color: #666;
  font-size: 13px;
}

.main-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.input-section {
  flex: 4;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
  padding-right: 20px;
}

.output-section {
  flex: 3;
  position: sticky;
  top: 20px;
  height: calc(100vh - 100px);
}

.form-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1em;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item label {
  font-weight: 500;
  color: #666;
  font-size: 0.9em;
}

.form-item input,
.form-item select,
.form-item textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9em;
}

.form-item textarea {
  min-height: 80px;
  resize: vertical;
}

.submit-section {
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.result-content {
  margin-top: 20px;
}

.warning {
  color: #f0ad4e;
  font-size: 1.2em;
  font-weight: bold;
}

.error {
  color: #d9534f;
  font-size: 1.2em;
  font-weight: bold;
}

.success {
  color: #5cb85c;
  font-size: 1.2em;
  font-weight: bold;
}

.prediction-value {
  margin-top: 10px;
  font-size: 1.1em;
  color: #333;
}

.issues-list {
  margin-top: 15px;
}

.issues-title {
  color: #666;
  font-weight: 500;
}

.issues-list ul {
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 10px;
}

.issues-list li {
  color: #666;
  margin-bottom: 5px;
}

.no-result {
  color: #999;
  text-align: center;
  padding: 40px 0;
}

.prediction-text {
  white-space: pre-line;
  line-height: 1.6;
  color: #333;
  font-size: 1.1em;
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.prediction-text strong {
  color: #0056b3;
}

.prediction-text br {
  margin-bottom: 10px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: #666;
  font-size: 1.1em;
  text-align: center;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
