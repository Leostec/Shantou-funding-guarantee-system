<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>专家评审</h2>
        <p class="subtitle">查看并录入专家意见与测算额度</p>
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
            <a-button type="link" @click="downloadRecord(record)">下载</a-button>
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
        <div class="detail-container">
          <!-- 项目信息 -->
          <div class="detail-section">
            <h4 class="section-title">项目信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">企业编号</div>
                <div class="value">{{ formatValue(record.project_enterpriseid) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">企业名称</div>
                <div class="value">{{ formatValue(record.company_name) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">项目经理</div>
                <div class="value">{{ formatValue(record.project_market_manager) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">项目A角</div>
                <div class="value">{{ formatValue(record.project_a_owner) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">项目B角</div>
                <div class="value">{{ formatValue(record.project_b_owner) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">市场经理</div>
                <div class="value">{{ formatValue(record.project_market_manager) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">项目来源</div>
                <div class="value">{{ formatValue(record.project_source) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">合作银行</div>
                <div class="value">{{ formatValue(record.project_coop_bank) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">申请日期</div>
                <div class="value">{{ formatDateTime(record.project_apply_date) }}</div>
              </div>
            </div>
          </div>

          <!-- 申请贷款信息 -->
          <div class="detail-section">
            <h4 class="section-title">申请贷款信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">借款人名称</div>
                <div class="value">{{ formatValue(record.loan_borrower_name) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">申请金额(万元)</div>
                <div class="value">{{ formatValue(record.loan_apply_amount) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">申请期限(月)</div>
                <div class="value">{{ formatValue(record.loan_apply_term) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">还款方式</div>
                <div class="value">{{ formatValue(record.analysis_plan_repayment_method) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">贷款用途</div>
                <div class="value">{{ formatValue(record.loan_purpose_detail) }}</div>
              </div>
            </div>
          </div>

          <!-- 企业基本情况 -->
          <div class="detail-section">
            <h4 class="section-title">企业基本情况</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">注册资本</div>
                <div class="value">{{ formatValue(record.company_registered_capital) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">成立时间</div>
                <div class="value">{{ formatDateTime(record.company_established_date) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">注册地址</div>
                <div class="value">{{ formatValue(record.company_registered_address) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">所属行业</div>
                <div class="value">{{ formatValue(record.business_type) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">员工人数</div>
                <div class="value">{{ formatValue(record.company_employee_count) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">是否外贸型</div>
                <div class="value">{{ formatValue(record.business_is_waimao) || formatDisplayValue('is_foreign_trade', record.is_foreign_trade) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">是否慎入行业</div>
                <div class="value">{{ formatValue(record.business_is_jinshen) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">最近工资是否发放</div>
                <div class="value">{{ formatValue(record.company_is_salary) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">主营业务</div>
                <div class="value">{{ formatValue(record.company_main_business) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">股东情况</div>
                <div class="value">{{ formatValue(record.company_shareholder_info) }}</div>
              </div>
            </div>
          </div>

          <!-- 实控人信息 -->
          <div class="detail-section">
            <h4 class="section-title">实控人/申请人情况</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">实际控制人</div>
                <div class="value">{{ formatValue(record.controller_name) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">性别</div>
                <div class="value">{{ formatValue(record.controller_gender) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">籍贯</div>
                <div class="value">{{ formatValue(record.controller_native_place) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">婚姻状况</div>
                <div class="value">{{ formatValue(record.controller_marital_status) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">出生日期</div>
                <div class="value">{{ formatDateTime(record.controller_birth_date) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">文化程度</div>
                <div class="value">{{ formatValue(record.controller_education) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">从业年限</div>
                <div class="value">{{ formatValue(record.controller_service_years) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">配偶姓名</div>
                <div class="value">{{ formatValue(record.controller_spouse_name) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">学习、工作及企业发展经历</div>
                <div class="value">{{ formatValue(record.controller_career_experience) }}</div>
              </div>
            </div>
          </div>

          <!-- 家庭与社会情况 -->
          <div class="detail-section">
            <h4 class="section-title">家庭与社会情况</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">家庭是否和睦</div>
                <div class="value">{{ formatValue(record.family_is_hemu) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">家庭年支出</div>
                <div class="value">{{ formatValue(record.family_annual_expense) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">家庭成员情况</div>
                <div class="value">{{ formatValue(record.family_members_info) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">社会关系</div>
                <div class="value">{{ formatValue(record.social_relationship_info) }}</div>
              </div>
            </div>
          </div>

          <!-- 居住情况 -->
          <div class="detail-section">
            <h4 class="section-title">居住情况</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">居住场所类型</div>
                <div class="value">{{ formatValue(record.residence_type) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">本地居住年限</div>
                <div class="value">{{ formatValue(record.residence_years) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">居住地址</div>
                <div class="value">{{ formatValue(record.residence_address) }}</div>
              </div>
            </div>
          </div>

          <!-- 经营场所 -->
          <div class="detail-section">
            <h4 class="section-title">经营场所</h4>
            <div class="detail-grid">
              <div class="detail-item full-width">
                <div class="label">商业模式简述</div>
                <div class="value">{{ formatValue(record.business_model_description) }}</div>
              </div>
            </div>
            <div v-if="record.business_sites_json" class="sub-table">
              <div class="sub-table-title">经营场所明细</div>
              <div v-for="(site, idx) in parseJSON(record.business_sites_json)" :key="idx" class="sub-item">
                <span><strong>场所{{ idx + 1 }}:</strong> {{ site.address }} | 建筑面积: {{ site.building_area }}㎡ | 土地面积: {{ site.land_area }}㎡ | {{ site.ownership }} | 月租金: {{ site.month_pay }}元 | 最近一期是否支付: {{ site.is_pay || '—' }}</span>
              </div>
            </div>
          </div>

          <!-- 资信状况 -->
          <div class="detail-section">
            <h4 class="section-title">资信状况</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">征信查询次数</div>
                <div class="value">{{ formatValue(record.credit_inquiry_count) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">逾期次数</div>
                <div class="value">{{ formatValue(record.credit_overdue_count) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">最大逾期金额</div>
                <div class="value">{{ formatValue(record.credit_max_overdue_amount) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">征信不良信息</div>
                <div class="value">{{ formatValue(record.credit_adverse_info) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">诉讼情况</div>
                <div class="value">{{ formatValue(record.litigation_status) }}</div>
              </div>
            </div>
            <div v-if="record.business_accounts_json" class="sub-table">
              <div class="sub-table-title">银行账户</div>
              <div v-for="(acc, idx) in parseJSON(record.business_accounts_json)" :key="idx" class="sub-item">
                <span><strong>账户{{ idx + 1 }}:</strong> {{ acc.account_name }} - {{ acc.account_no }}</span>
              </div>
            </div>
            <div v-if="record.account_rows_json" class="sub-table">
              <div class="sub-table-title">银行月末余额</div>
              <div v-for="(row, idx) in parseJSON(record.account_rows_json)" :key="idx" class="sub-item">
                <div><strong>{{ row.year }}年:</strong></div>
                <div style="margin-left: 20px; margin-top: 4px;">
                  1月: {{ row.m1 }}万 | 2月: {{ row.m2 }}万 | 3月: {{ row.m3 }}万 | 4月: {{ row.m4 }}万 | 5月: {{ row.m5 }}万 | 6月: {{ row.m6 }}万 |
                  7月: {{ row.m7 }}万 | 8月: {{ row.m8 }}万 | 9月: {{ row.m9 }}万 | 10月: {{ row.m10 }}万 | 11月: {{ row.m11 }}万 | 12月: {{ row.m12 }}万 |
                  <strong>月均: {{ row.avg }}万</strong>
                </div>
              </div>
            </div>
            <div v-if="record.daily_avg_balance_json" class="sub-table">
              <div class="sub-table-title">日均余额</div>
              <div v-for="(row, idx) in parseJSON(record.daily_avg_balance_json)" :key="idx" class="sub-item">
                <div><strong>{{ row.year }}年:</strong></div>
                <div style="margin-left: 20px; margin-top: 4px;">
                  3月: {{ row.m3 }}万 | 6月: {{ row.m6 }}万 | 9月: {{ row.m9 }}万 | 12月: {{ row.m12 }}万 |
                  <strong>全年日均: {{ row.annual_avg }}万</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- 财务数据 -->
          <div class="detail-section">
            <h4 class="section-title">财务数据</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">报表日期</div>
                <div class="value">{{ formatDateTime(record.bs_date) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">货币资金</div>
                <div class="value">{{ formatValue(record.bs_cash) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">应收账款</div>
                <div class="value">{{ formatValue(record.bs_ar) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">存货</div>
                <div class="value">{{ formatValue(record.bs_inventory) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">应付账款</div>
                <div class="value">{{ formatValue(record.bs_ap) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">总资产</div>
                <div class="value">{{ formatValue(record.bs_total_assets || record.analysis_fin_total_assets) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">总负债</div>
                <div class="value">{{ formatValue(record.analysis_fin_total_liabilities) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">净资产</div>
                <div class="value">{{ formatValue(record.analysis_fin_net_assets) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">营业收入</div>
                <div class="value">{{ formatValue(record.analysis_fin_revenue || record.is_table_s_total) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">净利润</div>
                <div class="value">{{ formatValue(record.is_table_net_profit || record.analysis_fin_net_income) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">年净收益</div>
                <div class="value">{{ formatValue(record.is_table_annual_net_income) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">利润用途</div>
                <div class="value">{{ formatValue(record.analysis_profit_destination) }}</div>
              </div>
            </div>
            <div v-if="record.is_table_sales_list_json" class="sub-table">
              <div class="sub-table-title">销售收入明细</div>
              <div v-for="(item, idx) in parseJSON(record.is_table_sales_list_json)" :key="idx" class="sub-item">
                <span><strong>{{ item.name }}:</strong> {{ item.value }}万元</span>
              </div>
            </div>
          </div>

          <!-- 指标评价 -->
          <div class="detail-section">
            <h4 class="section-title">指标评价</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">资产负债率</div>
                <div class="value">{{ formatValue(record.analysis_ind_asset_debt_ratio) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">销售负债率</div>
                <div class="value">{{ formatValue(record.analysis_ind_sales_debt_ratio) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">是否符合净收益3倍</div>
                <div class="value">{{ formatValue(record.analysis_ind_meets_3x_income) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">应收账款平均账期</div>
                <div class="value">{{ formatValue(record.analysis_ind_receivable_days) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">月均/日均余额</div>
                <div class="value">{{ formatValue(record.analysis_ind_avg_balance) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">月还款/月净收益</div>
                <div class="value">{{ formatValue(record.analysis_ind_repayment_ratio) }}</div>
              </div>
            </div>
          </div>

          <!-- 担保措施 -->
          <div class="detail-section">
            <h4 class="section-title">担保措施</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">贷款金额</div>
                <div class="value">{{ formatValue(record.analysis_plan_amount) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">贷款期限</div>
                <div class="value">{{ formatValue(record.analysis_plan_term) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">担保费率</div>
                <div class="value">{{ formatValue(record.analysis_plan_fee_rate) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">企业保证</div>
                <div class="value">{{ formatValue(record.analysis_plan_corp_guarantee) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">个人保证</div>
                <div class="value">{{ formatValue(record.analysis_plan_personal_guarantee) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">是否有额外担保人</div>
                <div class="value">{{ formatValue(record.analysis_ind_is_added_guarantor) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">抵押物</div>
                <div class="value">{{ formatValue(record.analysis_plan_collateral) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">房产抵押评估值</div>
                <div class="value">{{ formatValue(record.analysis_plan_diyapingguzhi) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">房产二押余值</div>
                <div class="value">{{ formatValue(record.analysis_plan_eryayuzhi) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">设备抵押净值</div>
                <div class="value">{{ formatValue(record.analysis_plan_diyajingzhi) }}</div>
              </div>
            </div>
            <div v-if="record.guarantees_json" class="sub-table">
              <div class="sub-table-title">我司在保情况</div>
              <div v-for="(g, idx) in parseJSON(record.guarantees_json)" :key="idx" class="sub-item">
                <span><strong>在保{{ idx + 1 }}:</strong> {{ g.type }} | 承保金额: {{ g.amount }}万 | 承保余额: {{ g.balance }}万 | 月还款: {{ g.monthly_payment }}元</span>
              </div>
              <div v-if="record.guarantees_amount_total || record.guarantees_balance_total" class="sub-item" style="font-weight: 600; border-top: 2px solid #2b7a78; padding-top: 8px; margin-top: 8px;">
                <span>合计 - 承保金额: {{ formatValue(record.guarantees_amount_total) }}万 | 承保余额: {{ formatValue(record.guarantees_balance_total) }}万</span>
              </div>
            </div>
            <div v-if="record.existing_loans_json" class="sub-table">
              <div class="sub-table-title">现有贷款情况</div>
              <div v-for="(loan, idx) in parseJSON(record.existing_loans_json)" :key="idx" class="sub-item">
                <span><strong>贷款{{ idx + 1 }}:</strong> {{ loan.type }} | 贷款金额: {{ loan.amount }}万 | 贷款余额: {{ loan.balance }}万 | 月还款: {{ loan.monthly_payment }}元</span>
              </div>
              <div
                v-if="record.existing_loans_amount_total || record.existing_loans_balance_total || record.existing_loans_monthly_payment_total"
                class="sub-item"
                style="font-weight: 600; border-top: 2px solid #2b7a78; padding-top: 8px; margin-top: 8px;"
              >
                <span>
                  合计 - 贷款金额: {{ formatValue(record.existing_loans_amount_total) }}万 |
                  贷款余额: {{ formatValue(record.existing_loans_balance_total) }}万 |
                  月还款本息: {{ formatValue(record.existing_loans_monthly_payment_total) }}元
                </span>
              </div>
            </div>
          </div>

          <!-- 其他信息 -->
          <div class="detail-section">
            <h4 class="section-title">其他信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">是否成长阶段</div>
                <div class="value">{{ formatValue(record.analysis_ind_is_growth_phase) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">是否使用友贷宝</div>
                <div class="value">{{ formatValue(record.analysis_ind_is_superior_loan) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">用电情况</div>
                <div class="value">{{ formatValue(record.electricity_is_quantity === '是' ? '采集用电量' : record.electricity_is_cost === '是' ? '采集电费' : '—') }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">用电情况说明</div>
                <div class="value">{{ formatValue(record.electricity_descript) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">软信息分析</div>
                <div class="value">{{ formatValue(record.analysis_soft_info) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">综合评价</div>
                <div class="value">{{ formatValue(record.analysis_summary) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">额度测定</div>
                <div class="value">{{ formatValue(record.analysis_limit_calculation) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">增额因素</div>
                <div class="value">{{ formatValue(record.analysis_limit_increase_factors) }}</div>
              </div>
            </div>
            <div v-if="record.electricity_items_json" class="sub-table">
              <div class="sub-table-title">用电明细</div>
              <div v-for="(item, idx) in parseJSON(record.electricity_items_json)" :key="idx" class="sub-item">
                <div><strong>{{ item.year }}年:</strong></div>
                <div style="margin-left: 20px; margin-top: 4px;">
                  1月: {{ item.m1 }} | 2月: {{ item.m2 }} | 3月: {{ item.m3 }} | 4月: {{ item.m4 }} | 5月: {{ item.m5 }} | 6月: {{ item.m6 }} |
                  7月: {{ item.m7 }} | 8月: {{ item.m8 }} | 9月: {{ item.m9 }} | 10月: {{ item.m10 }} | 11月: {{ item.m11 }} | 12月: {{ item.m12 }} |
                  <strong>合计: {{ item.total }}{{ record.electricity_is_quantity === '是' ? '度' : '元' }}</strong>
                </div>
              </div>
            </div>
            <div v-if="record.asset_stats_json" class="sub-table">
              <div class="sub-table-title">资产统计</div>
              <div v-for="(asset, idx) in parseJSON(record.asset_stats_json)" :key="idx" class="sub-item">
                <span><strong>{{ asset.name }}:</strong> 购入价格 {{ asset.buy_price }}万 | 当前价值 {{ asset.current_value }}万 | 折旧 {{ asset.depreciation }}万</span>
              </div>
              <div v-if="record.asset_totals_buy_price || record.asset_totals_current_value" class="sub-item" style="font-weight: 600; border-top: 2px solid #2b7a78; padding-top: 8px; margin-top: 8px;">
                <span>合计 - 购入价格: {{ formatValue(record.asset_totals_buy_price) }}万 | 当前价值: {{ formatValue(record.asset_totals_current_value) }}万 | 折旧: {{ formatValue(record.asset_totals_depreciation) }}万</span>
              </div>
            </div>
            <div v-if="record.cashflow_in_json" class="sub-table">
              <div class="sub-table-title">银行流水流入</div>
              <div v-for="(item, idx) in parseJSON(record.cashflow_in_json)" :key="idx" class="sub-item">
                <div><strong>{{ item.year }}年:</strong></div>
                <div style="margin-left: 20px; margin-top: 4px;">
                  1月: {{ item.m1 }}万 | 2月: {{ item.m2 }}万 | 3月: {{ item.m3 }}万 | 4月: {{ item.m4 }}万 | 5月: {{ item.m5 }}万 | 6月: {{ item.m6 }}万 |
                  7月: {{ item.m7 }}万 | 8月: {{ item.m8 }}万 | 9月: {{ item.m9 }}万 | 10月: {{ item.m10 }}万 | 11月: {{ item.m11 }}万 | 12月: {{ item.m12 }}万 |
                  <strong>合计: {{ item.total }}万</strong>
                </div>
              </div>
            </div>
            <div v-if="record.cashflow_out_json" class="sub-table">
              <div class="sub-table-title">银行流水流出</div>
              <div v-for="(item, idx) in parseJSON(record.cashflow_out_json)" :key="idx" class="sub-item">
                <div><strong>{{ item.year }}年:</strong></div>
                <div style="margin-left: 20px; margin-top: 4px;">
                  1月: {{ item.m1 }}万 | 2月: {{ item.m2 }}万 | 3月: {{ item.m3 }}万 | 4月: {{ item.m4 }}万 | 5月: {{ item.m5 }}万 | 6月: {{ item.m6 }}万 |
                  7月: {{ item.m7 }}万 | 8月: {{ item.m8 }}万 | 9月: {{ item.m9 }}万 | 10月: {{ item.m10 }}万 | 11月: {{ item.m11 }}万 | 12月: {{ item.m12 }}万 |
                  <strong>合计: {{ item.total }}万</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- 预测结果 -->
          <div class="detail-section">
            <h4 class="section-title">预测结果</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">预测额度(万元)</div>
                <div class="value highlight">{{ formatValue(record.predicted) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">专家测算额度(万元)</div>
                <div class="value highlight">{{ formatValue(record.expert_amount) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">预测结果文本</div>
                <div class="value">{{ formatValue(record.prediction_text) }}</div>
              </div>
              <div class="detail-item full-width">
                <div class="label">专家意见</div>
                <div class="value">{{ formatValue(record.expert_opinion) }}</div>
              </div>
            </div>
          </div>

          <!-- 创建信息 -->
          <div class="detail-section">
            <h4 class="section-title">创建信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="label">创建人</div>
                <div class="value">{{ formatValue(record.created_by) }}</div>
              </div>
              <div class="detail-item">
                <div class="label">创建时间</div>
                <div class="value">{{ formatDateTime(record.created_at) }}</div>
              </div>
            </div>
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
      width="95%"
      :body-style="{ maxHeight: '80vh', overflowY: 'auto', padding: '24px' }"
      @ok="submitEdit"
    >
      <div class="edit-form-container">
        <!-- 项目信息 -->
        <div class="edit-section">
          <h3>项目信息</h3>
          <div class="edit-grid">
            <a-form-item label="项目编号">
              <a-input v-model:value="editForm.project_enterpriseid" />
            </a-form-item>
            <a-form-item label="项目A角">
              <a-input v-model:value="editForm.project_a_owner" />
            </a-form-item>
            <a-form-item label="项目B角">
              <a-input v-model:value="editForm.project_b_owner" />
            </a-form-item>
            <a-form-item label="市场经理">
              <a-input v-model:value="editForm.project_market_manager" />
            </a-form-item>
            <a-form-item label="项目来源">
              <a-select v-model:value="editForm.project_source">
                <a-select-option value="金融中介">金融中介</a-select-option>
                <a-select-option value="非金融中介">非金融中介</a-select-option>
                <a-select-option value="银行">银行</a-select-option>
                <a-select-option value="老客户续作">老客户续作</a-select-option>
                <a-select-option value="老客户推荐">老客户推荐</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="合作银行">
              <a-input v-model:value="editForm.project_coop_bank" />
            </a-form-item>
            <a-form-item label="申请日期">
              <a-input v-model:value="editForm.project_apply_date" type="date" />
            </a-form-item>
          </div>
        </div>

        <!-- 申请贷款信息 -->
        <div class="edit-section">
          <h3>一、申请贷款信息</h3>
          <div class="edit-grid">
            <a-form-item label="借款人名称">
              <a-input v-model:value="editForm.loan_borrower_name" />
            </a-form-item>
            <a-form-item label="申请金额(万元)">
              <a-input-number v-model:value="editForm.loan_apply_amount" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="申请期限(月)">
              <a-input-number v-model:value="editForm.loan_apply_term" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="贷款用途" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.loan_purpose_detail" :rows="3" />
            </a-form-item>
          </div>
        </div>

        <!-- 企业基本情况 -->
        <div class="edit-section">
          <h3>二、项目基本情况</h3>
          <div class="edit-grid">
            <a-form-item label="企业名称">
              <a-input v-model:value="editForm.company_name" />
            </a-form-item>
            <a-form-item label="注册资本">
              <a-input-number v-model:value="editForm.company_registered_capital" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="成立时间">
              <a-input v-model:value="editForm.company_established_date" type="date" />
            </a-form-item>
            <a-form-item label="注册地址">
              <a-input v-model:value="editForm.company_registered_address" />
            </a-form-item>
            <a-form-item label="主营业务" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.company_main_business" :rows="3" />
            </a-form-item>
            <a-form-item label="所属行业(大类)">
              <a-select v-model:value="editForm.business_type">
                <a-select-option value="餐饮业">餐饮业</a-select-option>
                <a-select-option value="纺织业">纺织业</a-select-option>
                <a-select-option value="服务业">服务业</a-select-option>
                <a-select-option value="公安安全管理业">公安安全管理业</a-select-option>
                <a-select-option value="建筑业">建筑业</a-select-option>
                <a-select-option value="教育业">教育业</a-select-option>
                <a-select-option value="零售业">零售业</a-select-option>
                <a-select-option value="贸易">贸易</a-select-option>
                <a-select-option value="农业">农业</a-select-option>
                <a-select-option value="制造业">制造业</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="员工人数">
              <a-input-number v-model:value="editForm.company_employee_count" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="是否为外贸型">
              <a-select v-model:value="editForm.business_is_waimao">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="是否属于谨慎介入行业">
              <a-select v-model:value="editForm.business_is_jinshen">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="最近一期工资是否发放">
              <a-select v-model:value="editForm.company_is_salary">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="股东情况" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.company_shareholder_info" :rows="3" />
            </a-form-item>
          </div>
        </div>

        <!-- 实控人信息 -->
        <div class="edit-section">
          <h3>实控人/申请人情况</h3>
          <div class="edit-grid">
            <a-form-item label="实际控制人">
              <a-input v-model:value="editForm.controller_name" />
            </a-form-item>
            <a-form-item label="性别">
              <a-select v-model:value="editForm.controller_gender">
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="籍贯">
              <a-input v-model:value="editForm.controller_native_place" />
            </a-form-item>
            <a-form-item label="婚姻状况">
              <a-select v-model:value="editForm.controller_marital_status">
                <a-select-option value="未婚">未婚</a-select-option>
                <a-select-option value="已婚">已婚</a-select-option>
                <a-select-option value="离异">离异</a-select-option>
                <a-select-option value="丧偶">丧偶</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="出生日期">
              <a-input v-model:value="editForm.controller_birth_date" type="date" />
            </a-form-item>
            <a-form-item label="服务年限">
              <a-input-number v-model:value="editForm.controller_service_years" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="文化程度">
              <a-select v-model:value="editForm.controller_education">
                <a-select-option value="小学">小学</a-select-option>
                <a-select-option value="初中">初中</a-select-option>
                <a-select-option value="职高">职高</a-select-option>
                <a-select-option value="高中">高中</a-select-option>
                <a-select-option value="中专">中专</a-select-option>
                <a-select-option value="大专">大专</a-select-option>
                <a-select-option value="本科">本科</a-select-option>
                <a-select-option value="硕士">硕士</a-select-option>
                <a-select-option value="博士">博士</a-select-option>
                <a-select-option value="博士后">博士后</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="配偶姓名">
              <a-input v-model:value="editForm.controller_spouse_name" />
            </a-form-item>
            <a-form-item label="学习、工作及企业发展经历" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.controller_career_experience" :rows="4" />
            </a-form-item>
          </div>
        </div>

        <!-- 家庭与社会情况 -->
        <div class="edit-section">
          <h3>家庭与社会情况</h3>
          <div class="edit-grid">
            <a-form-item label="家庭是否和睦">
              <a-select v-model:value="editForm.family_is_hemu">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="家庭年支出">
              <a-input-number v-model:value="editForm.family_annual_expense" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="家庭成员情况" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.family_members_info" :rows="3" />
            </a-form-item>
            <a-form-item label="社会关系" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.social_relationship_info" :rows="3" />
            </a-form-item>
          </div>
        </div>

        <!-- 居住情况 -->
        <div class="edit-section">
          <h3>居住情况</h3>
          <div class="edit-grid">
            <a-form-item label="居住场所类型">
              <a-input v-model:value="editForm.residence_type" />
            </a-form-item>
            <a-form-item label="本地居住年限">
              <a-input-number v-model:value="editForm.residence_years" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="居住地址">
              <a-input v-model:value="editForm.residence_address" />
            </a-form-item>
          </div>
        </div>

        <!-- 经营场所 -->
        <div class="edit-section">
          <h3>三、经营模式及场所</h3>
          <div class="edit-grid">
            <a-form-item label="商业模式简述" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.business_model_description" :rows="3" />
            </a-form-item>
          </div>

          <h4 class="subsection-title">经营场所表</h4>
          <div v-for="(site, index) in businessSites" :key="'site-' + index" class="table-row">
            <div class="table-row-header">
              <span>场所 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeBusinessSite(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="地址">
                <a-input v-model:value="site.address" />
              </a-form-item>
              <a-form-item label="建筑面积">
                <a-input-number v-model:value="site.building_area" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="土地面积">
                <a-input-number v-model:value="site.land_area" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="自有/租赁">
                <a-select v-model:value="site.ownership">
                  <a-select-option value="自有">自有</a-select-option>
                  <a-select-option value="租赁">租赁</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="场地月租金">
                <a-input-number v-model:value="site.month_pay" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="最近一期是否支付">
                <a-select v-model:value="site.is_pay">
                  <a-select-option value="是">是</a-select-option>
                  <a-select-option value="否">否</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addBusinessSite" style="margin-top: 12px;">添加经营场所</a-button>
        </div>

        <!-- 资信状况 -->
        <div class="edit-section">
          <h3>四、资信状况</h3>

          <h4 class="subsection-title">银行账户</h4>
          <div v-for="(account, index) in businessAccounts" :key="'account-' + index" class="table-row">
            <div class="table-row-header">
              <span>账户 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeBusinessAccount(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="开户银行">
                <a-input v-model:value="account.account_name" />
              </a-form-item>
              <a-form-item label="银行账号">
                <a-input v-model:value="account.account_no" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addBusinessAccount" style="margin-top: 12px;">添加银行账户</a-button>

          <h4 class="subsection-title" style="margin-top: 24px;">银行月末余额</h4>
          <div v-for="(row, index) in accountRows" :key="'account-row-' + index" class="table-row">
            <div class="table-row-header">
              <span>行 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeAccountRow(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="年份">
                <a-input v-model:value="row.year" />
              </a-form-item>
              <a-form-item v-for="month in monthFields" :key="month.key" :label="month.label">
                <a-input-number v-model:value="row[month.key]" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="月均余额">
                <a-input-number v-model:value="row.avg" :min="0" style="width: 100%" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addAccountRow" style="margin-top: 12px;">添加月末余额</a-button>

          <h4 class="subsection-title" style="margin-top: 24px;">日均余额</h4>
          <div v-for="(row, index) in dailyAvgBalance" :key="'daily-avg-' + index" class="table-row">
            <div class="table-row-header">
              <span>行 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeDailyAvgRow(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="年份">
                <a-input v-model:value="row.year" />
              </a-form-item>
              <a-form-item v-for="month in quarterFields" :key="month.key" :label="month.label">
                <a-input-number v-model:value="row[month.key]" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="全年日均">
                <a-input-number v-model:value="row.annual_avg" :min="0" style="width: 100%" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addDailyAvgRow" style="margin-top: 12px;">添加日均行</a-button>

          <h4 class="subsection-title" style="margin-top: 24px;">征信情况</h4>
          <div class="edit-grid">
            <a-form-item label="征信查询次数">
              <a-input-number v-model:value="editForm.credit_inquiry_count" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="逾期次数">
              <a-input-number v-model:value="editForm.credit_overdue_count" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="最大逾期金额">
              <a-input-number v-model:value="editForm.credit_max_overdue_amount" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="征信不良信息" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.credit_adverse_info" :rows="3" />
            </a-form-item>
            <a-form-item label="诉讼情况" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.litigation_status" :rows="3" />
            </a-form-item>
          </div>
        </div>

        <!-- 用电情况 -->
        <div class="edit-section">
          <h3>用电情况</h3>
          <div class="edit-grid">
            <a-form-item label="是否采集用电量">
              <a-select v-model:value="editForm.electricity_is_quantity">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="是否采集电费">
              <a-select v-model:value="editForm.electricity_is_cost">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="用电情况说明" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.electricity_descript" :rows="3" />
            </a-form-item>
          </div>
          <h4 class="subsection-title" style="margin-top: 24px;">用电明细</h4>
          <div v-for="(item, index) in electricityItems" :key="'electricity-' + index" class="table-row">
            <div class="table-row-header">
              <span>明细 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeElectricityItem(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="年份">
                <a-input v-model:value="item.year" />
              </a-form-item>
              <a-form-item v-for="month in monthFields" :key="month.key" :label="month.label + '用电'">
                <a-input-number v-model:value="item[month.key]" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="合计">
                <a-input-number v-model:value="item.total" :min="0" style="width: 100%" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addElectricityItem" style="margin-top: 12px;">添加用电明细</a-button>
        </div>

        <!-- 方案及还款分析 -->
        <div class="edit-section">
          <h3>方案及还款分析</h3>
          <div class="edit-grid">
            <a-form-item label="方案金额">
              <a-input-number v-model:value="editForm.analysis_plan_amount" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="方案期限">
              <a-input-number v-model:value="editForm.analysis_plan_term" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="还款方式">
              <a-input v-model:value="editForm.analysis_plan_repayment_method" />
            </a-form-item>
            <a-form-item label="担保费率">
              <a-input-number v-model:value="editForm.analysis_plan_fee_rate" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="企业保证">
              <a-select v-model:value="editForm.analysis_plan_corp_guarantee">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="个人保证">
              <a-select v-model:value="editForm.analysis_plan_personal_guarantee">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="抵押物">
              <a-input v-model:value="editForm.analysis_plan_collateral" />
            </a-form-item>
            <a-form-item label="房产抵押评估值">
              <a-input-number v-model:value="editForm.analysis_plan_diyapingguzhi" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="房产二押余值">
              <a-input-number v-model:value="editForm.analysis_plan_eryayuzhi" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="设备抵押净值">
              <a-input-number v-model:value="editForm.analysis_plan_diyajingzhi" :min="0" style="width: 100%" />
            </a-form-item>
          </div>

          <h4 class="subsection-title" style="margin-top: 24px;">我司在保情况</h4>
          <div v-for="(guarantee, index) in guarantees" :key="'guarantee-' + index" class="table-row">
            <div class="table-row-header">
              <span>在保 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeGuarantee(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="品种">
                <a-input v-model:value="guarantee.type" />
              </a-form-item>
              <a-form-item label="承保金额(万元)">
                <a-input-number v-model:value="guarantee.amount" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="承保余额(万元)">
                <a-input-number v-model:value="guarantee.balance" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="用途">
                <a-input v-model:value="guarantee.purpose" />
              </a-form-item>
              <a-form-item label="起始日期">
                <a-input v-model:value="guarantee.start_date" type="date" />
              </a-form-item>
              <a-form-item label="到期日期">
                <a-input v-model:value="guarantee.end_date" type="date" />
              </a-form-item>
              <a-form-item label="合作银行及利率">
                <a-input v-model:value="guarantee.bank_rate" />
              </a-form-item>
              <a-form-item label="月还款额(元)">
                <a-input-number v-model:value="guarantee.monthly_payment" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="反担保措施" style="grid-column: 1 / -1">
                <a-input v-model:value="guarantee.counter_guarantee" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addGuarantee" style="margin-top: 12px;">添加在保情况</a-button>

          <div class="edit-grid" style="margin-top: 12px;">
            <a-form-item label="承保金额合计">
              <a-input-number v-model:value="editForm.guarantees_amount_total" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="承保余额合计">
              <a-input-number v-model:value="editForm.guarantees_balance_total" :min="0" style="width: 100%" />
            </a-form-item>
          </div>

          <h4 class="subsection-title" style="margin-top: 24px;">现有贷款情况</h4>
          <div v-for="(loan, index) in existingLoans" :key="'loan-' + index" class="table-row">
            <div class="table-row-header">
              <span>贷款 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeExistingLoan(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="品种">
                <a-input v-model:value="loan.type" />
              </a-form-item>
              <a-form-item label="贷款金额(万元)">
                <a-input-number v-model:value="loan.amount" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="贷款余额(万元)">
                <a-input-number v-model:value="loan.balance" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="用途">
                <a-input v-model:value="loan.purpose" />
              </a-form-item>
              <a-form-item label="起始日期">
                <a-input v-model:value="loan.start_date" type="date" />
              </a-form-item>
              <a-form-item label="到期日期">
                <a-input v-model:value="loan.end_date" type="date" />
              </a-form-item>
              <a-form-item label="合作银行及利率">
                <a-input v-model:value="loan.bank_rate" />
              </a-form-item>
              <a-form-item label="月还款额(元)">
                <a-input-number v-model:value="loan.monthly_payment" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="还款方式">
                <a-input v-model:value="loan.mode" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addExistingLoan" style="margin-top: 12px;">添加现有贷款</a-button>

          <div class="edit-grid" style="margin-top: 12px;">
            <a-form-item label="贷款金额合计">
              <a-input-number v-model:value="editForm.existing_loans_amount_total" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="贷款余额合计">
              <a-input-number v-model:value="editForm.existing_loans_balance_total" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="每月还款本息合计">
              <a-input-number v-model:value="editForm.existing_loans_monthly_payment_total" :min="0" style="width: 100%" />
            </a-form-item>
          </div>
        </div>

        <!-- 财务指标 -->
        <div class="edit-section">
          <h3>财务指标</h3>
          <div class="edit-grid">
            <a-form-item label="总资产">
              <a-input-number v-model:value="editForm.analysis_fin_total_assets" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="总负债">
              <a-input-number v-model:value="editForm.analysis_fin_total_liabilities" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="净资产">
              <a-input-number v-model:value="editForm.analysis_fin_net_assets" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="营业收入">
              <a-input-number v-model:value="editForm.analysis_fin_revenue" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="净利润">
              <a-input-number v-model:value="editForm.analysis_fin_net_income" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="资产负债率">
              <a-input-number v-model:value="editForm.analysis_ind_asset_debt_ratio" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="销售负债率">
              <a-input-number v-model:value="editForm.analysis_ind_sales_debt_ratio" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="是否符合净收益3倍">
              <a-select v-model:value="editForm.analysis_ind_meets_3x_income">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="应收账款平均账期">
              <a-input-number v-model:value="editForm.analysis_ind_receivable_days" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="月均/日均余额">
              <a-input-number v-model:value="editForm.analysis_ind_avg_balance" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="月还款/月净收益">
              <a-input-number v-model:value="editForm.analysis_ind_repayment_ratio" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="利润用途" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.analysis_profit_destination" :rows="2" />
            </a-form-item>
          </div>
          <h4 class="subsection-title" style="margin-top: 24px;">资产负债表简表</h4>
          <div class="edit-grid">
            <a-form-item label="报表日期">
              <a-input v-model:value="editForm.bs_date" type="month" />
            </a-form-item>
            <a-form-item label="货币资金">
              <a-input-number v-model:value="editForm.bs_cash" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="应收账款">
              <a-input-number v-model:value="editForm.bs_ar" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="预付账款">
              <a-input-number v-model:value="editForm.bs_prepayments" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="其它应收">
              <a-input-number v-model:value="editForm.bs_other_ar" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="存货">
              <a-input-number v-model:value="editForm.bs_inventory" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="固定资产及土地">
              <a-input-number v-model:value="editForm.bs_fixed_assets" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="总资产">
              <a-input-number v-model:value="editForm.bs_total_assets" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="借款">
              <a-input-number v-model:value="editForm.bs_loans" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="应付账款">
              <a-input-number v-model:value="editForm.bs_ap" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="预收账款">
              <a-input-number v-model:value="editForm.bs_advances" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="其它应付">
              <a-input-number v-model:value="editForm.bs_other_ap" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="实收资本">
              <a-input-number v-model:value="editForm.bs_capital" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="留存收益">
              <a-input-number v-model:value="editForm.bs_retained_earnings" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="负债及权益合计">
              <a-input-number v-model:value="editForm.bs_total_liabilities_equity" :min="0" style="width: 100%" />
            </a-form-item>
          </div>

          <h4 class="subsection-title" style="margin-top: 24px;">资产统计表</h4>
          <div v-for="(asset, index) in assetStats" :key="'asset-' + index" class="table-row">
            <div class="table-row-header">
              <span>资产 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeAssetStat(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="资产名称">
                <a-input v-model:value="asset.name" />
              </a-form-item>
              <a-form-item label="购入时间">
                <a-input v-model:value="asset.buy_time" />
              </a-form-item>
              <a-form-item label="购入价格">
                <a-input-number v-model:value="asset.buy_price" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="当前价值">
                <a-input-number v-model:value="asset.current_value" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="折旧额">
                <a-input-number v-model:value="asset.depreciation" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="备注" style="grid-column: 1 / -1">
                <a-input v-model:value="asset.remark" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addAssetStat" style="margin-top: 12px;">添加资产</a-button>

          <div class="edit-grid" style="margin-top: 12px;">
            <a-form-item label="购入价格合计">
              <a-input-number v-model:value="editForm.asset_totals_buy_price" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="当前价值合计">
              <a-input-number v-model:value="editForm.asset_totals_current_value" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="折旧合计">
              <a-input-number v-model:value="editForm.asset_totals_depreciation" :min="0" style="width: 100%" />
            </a-form-item>
          </div>

          <h4 class="subsection-title" style="margin-top: 24px;">损益表（附表3.1）</h4>
          <div class="edit-grid">
            <a-form-item label="年份">
              <a-input v-model:value="editForm.is_table_year" />
            </a-form-item>
          </div>

          <div v-for="(item, index) in salesList" :key="'sales-' + index" class="table-row">
            <div class="table-row-header">
              <span>销售收入 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeSalesItem(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="名称">
                <a-input v-model:value="item.name" />
              </a-form-item>
              <a-form-item label="金额">
                <a-input-number v-model:value="item.value" :min="0" style="width: 100%" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addSalesItem" style="margin-top: 12px;">添加销售收入</a-button>

          <div class="edit-grid" style="margin-top: 12px;">
            <a-form-item label="销售收入总额">
              <a-input-number v-model:value="editForm.is_table_s_total" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="物料成本">
              <a-input-number v-model:value="editForm.is_table_material_cost" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="毛利润">
              <a-input-number v-model:value="editForm.is_table_gross_profit" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="工资（销售、安装）">
              <a-input-number v-model:value="editForm.is_table_f_wages" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="租金">
              <a-input-number v-model:value="editForm.is_table_f_rent" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="水电费">
              <a-input-number v-model:value="editForm.is_table_f_utility" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="通讯费">
              <a-input-number v-model:value="editForm.is_table_f_comm" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="运输费">
              <a-input-number v-model:value="editForm.is_table_f_trans" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="材料损失">
              <a-input-number v-model:value="editForm.is_table_f_loss" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="广告及维护费">
              <a-input-number v-model:value="editForm.is_table_f_adv" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="招待费">
              <a-input-number v-model:value="editForm.is_table_f_entertain" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="其它税收">
              <a-input-number v-model:value="editForm.is_table_f_tax" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="其它费用">
              <a-input-number v-model:value="editForm.is_table_f_other" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="固定支出合计">
              <a-input-number v-model:value="editForm.is_table_f_total" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="净利润">
              <a-input-number v-model:value="editForm.is_table_net_profit" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="家庭开支" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.is_table_o_family_exp" :rows="2" />
            </a-form-item>
            <a-form-item label="分期还款（经营）">
              <a-input-number v-model:value="editForm.is_table_o_biz_loan" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="分期还款（私人）">
              <a-input-number v-model:value="editForm.is_table_o_pvt_loan" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="其它支出">
              <a-input-number v-model:value="editForm.is_table_o_other_exp" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="家庭收入">
              <a-input-number v-model:value="editForm.is_table_o_family_inc" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="年净收益">
              <a-input-number v-model:value="editForm.is_table_annual_net_income" :min="0" style="width: 100%" />
            </a-form-item>
          </div>

          <h4 class="subsection-title" style="margin-top: 24px;">营业额校验</h4>
          <div v-for="(item, index) in revCheckItems" :key="'rev-check-' + index" class="table-row">
            <div class="table-row-header">
              <span>校验项 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeRevCheckItem(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="数据名称">
                <a-input v-model:value="item.name" />
              </a-form-item>
              <a-form-item label="数据金额">
                <a-input-number v-model:value="item.value" :min="0" style="width: 100%" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addRevCheckItem" style="margin-top: 12px;">添加校验项</a-button>

          <div class="edit-grid" style="margin-top: 12px;">
            <a-form-item label="合计金额">
              <a-input-number v-model:value="editForm.rev_check_total_value" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="推算营业额">
              <a-input-number v-model:value="editForm.rev_check_est_total" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="损益表使用额">
              <a-input-number v-model:value="editForm.rev_check_is_revenue" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="偏差率">
              <a-input v-model:value="editForm.rev_check_diff_rate" />
            </a-form-item>
            <a-form-item label="推算方式" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.rev_check_method" :rows="2" />
            </a-form-item>
          </div>

          <h4 class="subsection-title" style="margin-top: 24px;">流水分析（流入）</h4>
          <div v-for="(row, index) in cashflowIn" :key="'cashflow-in-' + index" class="table-row">
            <div class="table-row-header">
              <span>流入 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeCashflowIn(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="年份">
                <a-input v-model:value="row.year" />
              </a-form-item>
              <a-form-item v-for="month in monthFields" :key="month.key" :label="month.label + '金额'">
                <a-input-number v-model:value="row[month.key]" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="合计">
                <a-input-number v-model:value="row.total" :min="0" style="width: 100%" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addCashflowIn" style="margin-top: 12px;">添加流入</a-button>

          <h4 class="subsection-title" style="margin-top: 24px;">流水分析（流出）</h4>
          <div v-for="(row, index) in cashflowOut" :key="'cashflow-out-' + index" class="table-row">
            <div class="table-row-header">
              <span>流出 {{ index + 1 }}</span>
              <a-button size="small" danger @click="removeCashflowOut(index)">删除</a-button>
            </div>
            <div class="edit-grid">
              <a-form-item label="年份">
                <a-input v-model:value="row.year" />
              </a-form-item>
              <a-form-item v-for="month in monthFields" :key="month.key" :label="month.label + '金额'">
                <a-input-number v-model:value="row[month.key]" :min="0" style="width: 100%" />
              </a-form-item>
              <a-form-item label="合计">
                <a-input-number v-model:value="row.total" :min="0" style="width: 100%" />
              </a-form-item>
            </div>
          </div>
          <a-button type="primary" @click="addCashflowOut" style="margin-top: 12px;">添加流出</a-button>
        </div>

        <!-- 其他信息 -->
        <div class="edit-section">
          <h3>其他信息</h3>
          <div class="edit-grid">
            <a-form-item label="是否成长阶段">
              <a-select v-model:value="editForm.analysis_ind_is_growth_phase">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="是否使用友贷宝">
              <a-select v-model:value="editForm.analysis_ind_is_superior_loan">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="是否有额外担保人">
              <a-select v-model:value="editForm.analysis_ind_is_added_guarantor">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="软信息分析" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.analysis_soft_info" :rows="3" />
            </a-form-item>
            <a-form-item label="综合评价" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.analysis_summary" :rows="3" />
            </a-form-item>
            <a-form-item label="额度测定" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.analysis_limit_calculation" :rows="3" />
            </a-form-item>
            <a-form-item label="增额因素" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.analysis_limit_increase_factors" :rows="3" />
            </a-form-item>
          </div>
        </div>

        <!-- 预测结果 -->
        <div class="edit-section">
          <h3>预测结果</h3>
          <div class="edit-grid">
            <a-form-item label="预测额度">
              <a-input-number v-model:value="editForm.predicted" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="专家测算额度">
              <a-input-number v-model:value="editForm.expert_amount" :min="0" style="width: 100%" />
            </a-form-item>
            <a-form-item label="预测结果文本" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.prediction_text" :rows="3" />
            </a-form-item>
            <a-form-item label="专家意见" style="grid-column: 1 / -1">
              <a-textarea v-model:value="editForm.expert_opinion" :rows="3" />
            </a-form-item>
          </div>
        </div>

        <!-- 创建信息（只读） -->
        <div class="edit-section">
          <h3>创建信息</h3>
          <div class="edit-grid">
            <a-form-item label="创建人">
              <a-input v-model:value="editForm.created_by" disabled />
            </a-form-item>
            <a-form-item label="创建时间">
              <a-input v-model:value="editForm.created_at" disabled />
            </a-form-item>
          </div>
        </div>
      </div>
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
const businessSites = ref<RecordItem[]>([]);
const businessAccounts = ref<RecordItem[]>([]);
const accountRows = ref<RecordItem[]>([]);
const dailyAvgBalance = ref<RecordItem[]>([]);
const guarantees = ref<RecordItem[]>([]);
const existingLoans = ref<RecordItem[]>([]);
const electricityItems = ref<RecordItem[]>([]);
const assetStats = ref<RecordItem[]>([]);
const revCheckItems = ref<RecordItem[]>([]);
const cashflowIn = ref<RecordItem[]>([]);
const cashflowOut = ref<RecordItem[]>([]);
const salesList = ref<RecordItem[]>([]);

const monthFields = Array.from({ length: 12 }, (_, index) => ({
  key: `m${index + 1}`,
  label: `${index + 1}月`,
}));
const quarterFields = ['m3', 'm6', 'm9', 'm12'].map((key) => ({
  key,
  label: `${key.slice(1)}月`,
}));

const parseArrayField = (value: any) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const ensureArray = (items: any[], factory: () => RecordItem) =>
  items.length > 0 ? items : [factory()];

const createBusinessSite = () => ({
  address: '',
  building_area: '',
  land_area: '',
  ownership: '',
  month_pay: '',
  is_pay: '',
});

const createBusinessAccount = () => ({
  account_name: '',
  account_no: '',
});

const createAccountRow = () =>
  monthFields.reduce(
    (acc, month) => ({ ...acc, [month.key]: '' }),
    { year: '', avg: '' }
  );

const createDailyAvgRow = () =>
  quarterFields.reduce(
    (acc, month) => ({ ...acc, [month.key]: '' }),
    { year: '', annual_avg: '' }
  );

const createGuarantee = () => ({
  type: '',
  amount: '',
  balance: '',
  counter_guarantee: '',
  monthly_payment: '',
  start_date: '',
  end_date: '',
  bank_rate: '',
  purpose: '',
});

const createExistingLoan = () => ({
  type: '',
  amount: '',
  balance: '',
  mode: '',
  monthly_payment: '',
  start_date: '',
  end_date: '',
  bank_rate: '',
  purpose: '',
});

const createElectricityItem = () =>
  monthFields.reduce(
    (acc, month) => ({ ...acc, [month.key]: '' }),
    { year: '', total: '' }
  );

const createAssetStat = () => ({
  name: '',
  buy_time: '',
  buy_price: '',
  current_value: '',
  depreciation: '',
  remark: '',
});

const createRevCheckItem = () => ({
  name: '',
  value: '',
});

const createCashflowItem = () =>
  monthFields.reduce(
    (acc, month) => ({ ...acc, [month.key]: '' }),
    { year: '', total: '' }
  );

const createSalesItem = () => ({
  name: '',
  value: '',
});

const addBusinessSite = () => businessSites.value.push(createBusinessSite());
const removeBusinessSite = (index: number) => businessSites.value.splice(index, 1);
const addBusinessAccount = () => businessAccounts.value.push(createBusinessAccount());
const removeBusinessAccount = (index: number) => businessAccounts.value.splice(index, 1);
const addAccountRow = () => accountRows.value.push(createAccountRow());
const removeAccountRow = (index: number) => accountRows.value.splice(index, 1);
const addDailyAvgRow = () => dailyAvgBalance.value.push(createDailyAvgRow());
const removeDailyAvgRow = (index: number) => dailyAvgBalance.value.splice(index, 1);
const addGuarantee = () => guarantees.value.push(createGuarantee());
const removeGuarantee = (index: number) => guarantees.value.splice(index, 1);
const addExistingLoan = () => existingLoans.value.push(createExistingLoan());
const removeExistingLoan = (index: number) => existingLoans.value.splice(index, 1);
const addElectricityItem = () => electricityItems.value.push(createElectricityItem());
const removeElectricityItem = (index: number) => electricityItems.value.splice(index, 1);
const addAssetStat = () => assetStats.value.push(createAssetStat());
const removeAssetStat = (index: number) => assetStats.value.splice(index, 1);
const addRevCheckItem = () => revCheckItems.value.push(createRevCheckItem());
const removeRevCheckItem = (index: number) => revCheckItems.value.splice(index, 1);
const addCashflowIn = () => cashflowIn.value.push(createCashflowItem());
const removeCashflowIn = (index: number) => cashflowIn.value.splice(index, 1);
const addCashflowOut = () => cashflowOut.value.push(createCashflowItem());
const removeCashflowOut = (index: number) => cashflowOut.value.splice(index, 1);
const addSalesItem = () => salesList.value.push(createSalesItem());
const removeSalesItem = (index: number) => salesList.value.splice(index, 1);

const columns = [
  { title: '企业编号', dataIndex: 'project_number', key: 'project_number' },
  { title: '企业名称', dataIndex: 'company_name', key: 'company_name' },
  { title: '申请金额(万元)', dataIndex: 'application_amount', key: 'application_amount' },
  { title: '申请期限(月)', dataIndex: 'application_period', key: 'application_period' },
  { title: '预测额度(万元)', dataIndex: 'predicted', key: 'predicted' },
  { title: '专家额度', dataIndex: 'expert_amount', key: 'expert_amount' },
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
    value: formatDisplayValue(key, record[key]),
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
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const formatDisplayValue = (key: string, value: any) => {
  if (key === 'created_at') return formatDateTime(value);
  const mapping: Record<string, Record<string | number, string>> = {
    controller_gender: { 0: '女', 1: '男' },
    education_level: {
      0: '小学',
      1: '初中',
      1.5: '职高',
      2: '高中/中专',
      3: '大专',
      4: '本科',
      5: '硕士',
      6: '博士',
      7: '博士后',
    },
    marital_status: { 0: '未婚', 1: '已婚', 2: '离异', 3: '丧偶' },
    residence_type: { 0: '自购', 1: '租赁' },
    business_premises_type: { 0: '自有', 1: '租赁' },
    is_foreign_trade: { 0: '否', 1: '是' },
    is_cautious_industry: { 0: '否', 1: '是' },
    company_guarantee: { 0: '否', 1: '是' },
    personal_guarantee: { 0: '否', 1: '是' },
    additional_guarantor: { 0: '否', 1: '是' },
    is_growth_stage: { 0: '否', 1: '是' },
    used_youdaibao: { 0: '否', 1: '是' },
    family_harmony: { 0: '否', 1: '是' },
    industry_category: {
      0: '餐饮业',
      1: '纺织业',
      2: '服务业',
      3: '公安安全管理业',
      4: '建筑业',
      5: '教育业',
      6: '零售业',
      7: '贸易',
      8: '农业',
      9: '制造业',
    },
  };
  if (mapping[key] && mapping[key][value] !== undefined) {
    return mapping[key][value];
  }
  return formatValue(value);
};

const openEdit = (record: RecordItem) => {
  currentRecordId.value = record.id || record.project_enterpriseid;
  editForm.value = { ...record };
  businessSites.value = ensureArray(
    parseArrayField(record.business_sites_json).map((row) => ({ ...createBusinessSite(), ...row })),
    createBusinessSite
  );
  businessAccounts.value = ensureArray(
    parseArrayField(record.business_accounts_json).map((row) => ({ ...createBusinessAccount(), ...row })),
    createBusinessAccount
  );
  accountRows.value = ensureArray(
    parseArrayField(record.account_rows_json).map((row) => ({ ...createAccountRow(), ...row })),
    createAccountRow
  );
  dailyAvgBalance.value = ensureArray(
    parseArrayField(record.daily_avg_balance_json).map((row) => ({ ...createDailyAvgRow(), ...row })),
    createDailyAvgRow
  );
  guarantees.value = ensureArray(
    parseArrayField(record.guarantees_json).map((row) => ({ ...createGuarantee(), ...row })),
    createGuarantee
  );
  existingLoans.value = ensureArray(
    parseArrayField(record.existing_loans_json).map((row) => ({ ...createExistingLoan(), ...row })),
    createExistingLoan
  );
  electricityItems.value = ensureArray(
    parseArrayField(record.electricity_items_json).map((row) => ({ ...createElectricityItem(), ...row })),
    createElectricityItem
  );
  assetStats.value = ensureArray(
    parseArrayField(record.asset_stats_json).map((row) => ({ ...createAssetStat(), ...row })),
    createAssetStat
  );
  revCheckItems.value = ensureArray(
    parseArrayField(record.rev_check_items_json).map((row) => ({ ...createRevCheckItem(), ...row })),
    createRevCheckItem
  );
  cashflowIn.value = ensureArray(
    parseArrayField(record.cashflow_in_json).map((row) => ({ ...createCashflowItem(), ...row })),
    createCashflowItem
  );
  cashflowOut.value = ensureArray(
    parseArrayField(record.cashflow_out_json).map((row) => ({ ...createCashflowItem(), ...row })),
    createCashflowItem
  );
  let sales = parseArrayField(record.is_table_sales_list_json).map((row) => ({ ...createSalesItem(), ...row }));
  if (!sales.length) {
    const legacy = [
      { name: record.is_table_s1_t, value: record.is_table_s1 },
      { name: record.is_table_s2_t, value: record.is_table_s2 },
      { name: record.is_table_s3_t, value: record.is_table_s3 },
    ].filter((item) => item.name || item.value);
    sales = legacy.map((row) => ({ ...createSalesItem(), ...row }));
  }
  salesList.value = ensureArray(sales, createSalesItem);
  editVisible.value = true;
  console.log('Opening edit modal with record:', record);
  console.log('Edit form:', editForm.value);
  console.log('Edit visible:', editVisible.value);
};

const buildPayload = () => {
  const data = editForm.value || {};
  const sales = salesList.value || [];
  const first = sales[0] || {};
  const second = sales[1] || {};
  const third = sales[2] || {};

  return {
    project: {
      a_owner: data.project_a_owner,
      b_owner: data.project_b_owner,
      market_manager: data.project_market_manager,
      source: data.project_source,
      coop_bank: data.project_coop_bank,
      apply_date: data.project_apply_date,
      enterpriseid: data.project_enterpriseid,
    },
    loan: {
      borrower_name: data.loan_borrower_name,
      apply_amount: data.loan_apply_amount,
      apply_term: data.loan_apply_term,
      purpose_detail: data.loan_purpose_detail,
    },
    company: {
      name: data.company_name,
      registered_capital: data.company_registered_capital,
      established_date: data.company_established_date,
      registered_address: data.company_registered_address,
      main_business: data.company_main_business,
      employee_count: data.company_employee_count,
      is_salary: data.company_is_salary,
      shareholder_info: data.company_shareholder_info,
    },
    controller: {
      name: data.controller_name,
      gender: data.controller_gender,
      native_place: data.controller_native_place,
      marital_status: data.controller_marital_status,
      birth_date: data.controller_birth_date,
      service_years: data.controller_service_years,
      education: data.controller_education,
      spouse_name: data.controller_spouse_name,
      career_experience: data.controller_career_experience,
    },
    family: {
      members_info: data.family_members_info,
      is_hemu: data.family_is_hemu,
      annual_expense: data.family_annual_expense,
    },
    social: {
      relationship_info: data.social_relationship_info,
    },
    residence: {
      type: data.residence_type,
      years: data.residence_years,
      address: data.residence_address,
    },
    business: {
      type: data.business_type,
      month_pay: data.business_month_pay,
      is_pay: data.business_is_pay,
      model_description: data.business_model_description,
      is_waimao: data.business_is_waimao,
      is_jinshen: data.business_is_jinshen,
    },
    business_sites: businessSites.value,
    business_accounts: businessAccounts.value,
    account_rows: accountRows.value,
    daily_avg_balance: dailyAvgBalance.value,
    guarantees: guarantees.value,
    guarantees_totals: {
      amount_total: data.guarantees_amount_total,
      balance_total: data.guarantees_balance_total,
    },
    existing_loans: existingLoans.value,
    existing_loans_totals: {
      amount_total: data.existing_loans_amount_total,
      balance_total: data.existing_loans_balance_total,
      monthly_payment_total: data.existing_loans_monthly_payment_total,
    },
    credit: {
      inquiry_count: data.credit_inquiry_count,
      adverse_info: data.credit_adverse_info,
      overdue_count: data.credit_overdue_count,
      max_overdue_amount: data.credit_max_overdue_amount,
    },
    litigation: {
      status: data.litigation_status,
    },
    electricity: {
      is_quantity: data.electricity_is_quantity,
      is_cost: data.electricity_is_cost,
      descript: data.electricity_descript,
      items: electricityItems.value,
    },
    analysis: {
      plan: {
        amount: data.analysis_plan_amount,
        term: data.analysis_plan_term,
        repayment_method: data.analysis_plan_repayment_method,
        fee_rate: data.analysis_plan_fee_rate,
        corp_guarantee: data.analysis_plan_corp_guarantee,
        personal_guarantee: data.analysis_plan_personal_guarantee,
        collateral: data.analysis_plan_collateral,
        diyapingguzhi: data.analysis_plan_diyapingguzhi,
        eryayuzhi: data.analysis_plan_eryayuzhi,
        diyajingzhi: data.analysis_plan_diyajingzhi,
      },
      financials: {
        total_assets: data.analysis_fin_total_assets,
        total_liabilities: data.analysis_fin_total_liabilities,
        net_assets: data.analysis_fin_net_assets,
        revenue: data.analysis_fin_revenue,
        net_income: data.analysis_fin_net_income,
      },
      profit_destination: data.analysis_profit_destination,
      indicators: {
        asset_debt_ratio: data.analysis_ind_asset_debt_ratio,
        sales_debt_ratio: data.analysis_ind_sales_debt_ratio,
        meets_3x_income: data.analysis_ind_meets_3x_income,
        receivable_days: data.analysis_ind_receivable_days,
        avg_balance: data.analysis_ind_avg_balance,
        repayment_ratio: data.analysis_ind_repayment_ratio,
        is_superior_loan: data.analysis_ind_is_superior_loan,
        is_growth_phase: data.analysis_ind_is_growth_phase,
        is_added_guarantor: data.analysis_ind_is_added_guarantor,
      },
      soft_info: data.analysis_soft_info,
      summary: data.analysis_summary,
      limit: {
        calculation: data.analysis_limit_calculation,
        apply_amount: data.analysis_limit_apply_amount,
        increase_factors: data.analysis_limit_increase_factors,
      },
    },
    bs: {
      date: data.bs_date,
      cash: data.bs_cash,
      ar: data.bs_ar,
      prepayments: data.bs_prepayments,
      other_ar: data.bs_other_ar,
      inventory: data.bs_inventory,
      fixed_assets: data.bs_fixed_assets,
      total_assets: data.bs_total_assets,
      loans: data.bs_loans,
      ap: data.bs_ap,
      advances: data.bs_advances,
      other_ap: data.bs_other_ap,
      capital: data.bs_capital,
      retained_earnings: data.bs_retained_earnings,
      total_liabilities_equity: data.bs_total_liabilities_equity,
    },
    asset_stats: assetStats.value,
    asset_totals: {
      buy_price: data.asset_totals_buy_price,
      current_value: data.asset_totals_current_value,
      depreciation: data.asset_totals_depreciation,
    },
    is_table: {
      year: data.is_table_year,
      sales_list: salesList.value,
      s1_t: first.name,
      s2_t: second.name,
      s3_t: third.name,
      s1: first.value,
      s2: second.value,
      s3: third.value,
      s_total: data.is_table_s_total,
      material_cost: data.is_table_material_cost,
      gross_profit: data.is_table_gross_profit,
      f_wages: data.is_table_f_wages,
      f_rent: data.is_table_f_rent,
      f_utility: data.is_table_f_utility,
      f_comm: data.is_table_f_comm,
      f_trans: data.is_table_f_trans,
      f_loss: data.is_table_f_loss,
      f_adv: data.is_table_f_adv,
      f_entertain: data.is_table_f_entertain,
      f_tax: data.is_table_f_tax,
      f_other: data.is_table_f_other,
      f_total: data.is_table_f_total,
      net_profit: data.is_table_net_profit,
      o_family_exp: data.is_table_o_family_exp,
      o_biz_loan: data.is_table_o_biz_loan,
      o_pvt_loan: data.is_table_o_pvt_loan,
      o_other_exp: data.is_table_o_other_exp,
      o_family_inc: data.is_table_o_family_inc,
      annual_net_income: data.is_table_annual_net_income,
    },
    rev_check: {
      items: revCheckItems.value,
      total_value: data.rev_check_total_value,
      est_total: data.rev_check_est_total,
      is_revenue: data.rev_check_is_revenue,
      diff_rate: data.rev_check_diff_rate,
      method: data.rev_check_method,
    },
    cashflow_in: cashflowIn.value,
    cashflow_out: cashflowOut.value,
    predicted: data.predicted,
    prediction_text: data.prediction_text,
    expert_opinion: data.expert_opinion,
    expert_amount: data.expert_amount,
    created_by: data.created_by,
  };
};

const submitEdit = async () => {
  if (!currentRecordId.value) {
    message.error('缺少记录ID，无法更新');
    return;
  }
  saving.value = true;
  try {
    const payload = buildPayload();
    await axios.put(`http://localhost:8989/loan-application/${currentRecordId.value}`, payload);
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


const cleanLabel = (label: string) => {
  // 去掉括号中的代码提示
  return label.replace(/（.*?）|\(.*?\)/g, '').trim();
};

const downloadRecord = async (record: RecordItem) => {
  const id = record.id || record.project_number;
  if (!id) {
    message.error('缺少记录ID，无法下载');
    return;
  }

  try {
    const response = await axios.get('http://127.0.0.1:5001/download-report', {
      params: { id },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'] || '';
    let filename = `${record.project_number || 'report'}-report.docx`;
    const match = /filename\*=UTF-8''([^;]+)|filename=\"?([^\";]+)\"?/i.exec(contentDisposition);
    if (match) {
      const rawName = match[1] || match[2];
      if (rawName) {
        filename = decodeURIComponent(rawName);
      }
    }

    const blob = new Blob([response.data], {
      type:
        response.headers['content-type'] ||
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('下载失败', error);
    message.error(error?.response?.data?.message || '下载失败');
  }
};

const parseJSON = (jsonStr: string) => {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return [];
  }
};
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

.detail-container {
  padding: 16px;
  background: #fafafa;
}

.detail-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e6dfd3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.section-title {
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #2b7a78;
  color: #235f68;
  font-size: 15px;
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

.detail-item.full-width {
  grid-column: 1 / -1;
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

.value.highlight {
  color: #2b7a78;
  font-weight: 600;
  font-size: 16px;
}

.sub-table {
  margin-top: 12px;
  padding: 12px;
  background: #f7f9fa;
  border-radius: 6px;
  border: 1px dashed #d9d3c8;
}

.sub-table-title {
  font-weight: 600;
  color: #235f68;
  margin-bottom: 8px;
  font-size: 14px;
}

.sub-item {
  padding: 6px 0;
  border-bottom: 1px solid #e6e6e6;
  font-size: 13px;
  color: #333;
}

.sub-item:last-child {
  border-bottom: none;
}

.sub-item strong {
  color: #2b7a78;
}

.edit-form-container {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.edit-form-container::-webkit-scrollbar {
  width: 8px;
}

.edit-form-container::-webkit-scrollbar-thumb {
  background: rgba(43, 122, 120, 0.35);
  border-radius: 10px;
}

.edit-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e6dfd3;
  box-shadow: 0 2px 8px rgba(20, 28, 34, 0.04);
}

.edit-section h3 {
  margin: 0 0 16px 0;
  color: #235f68;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e6dfd3;
}

.edit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.edit-grid :deep(.ant-form-item) {
  margin-bottom: 0;
}

.edit-grid :deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

.edit-grid :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #6e7377;
  font-size: 14px;
}

.edit-grid :deep(.ant-input),
.edit-grid :deep(.ant-input-number),
.edit-grid :deep(.ant-select-selector),
.edit-grid :deep(.ant-input-number-input) {
  border-radius: 8px;
  border-color: #d9d3c8;
}

.edit-grid :deep(.ant-input:focus),
.edit-grid :deep(.ant-input-number-focused),
.edit-grid :deep(.ant-select-focused .ant-select-selector) {
  border-color: #2b7a78;
  box-shadow: 0 0 0 2px rgba(43, 122, 120, 0.1);
}

.edit-grid :deep(.ant-input-number) {
  width: 100%;
}

.edit-grid :deep(textarea.ant-input) {
  min-height: 80px;
  resize: vertical;
}

.sub-note {
  margin-top: 12px;
  padding: 8px 12px;
  background: #fff7e6;
  border-left: 3px solid #faad14;
  color: #ad6800;
  font-size: 13px;
  border-radius: 4px;
}
</style>
