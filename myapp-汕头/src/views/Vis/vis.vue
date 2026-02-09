<template>
  <div class="form-container">
    <div class="page-header">
      <div>
        <h2>信息录入</h2>
        <p class="subtitle">企业多维信息保存</p>
      </div>
    </div>
    <div class="main-content">
      <div class="input-section">
        <form @submit.prevent>
          <div class="form-section">
            <h3>项目信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>项目编号</label>
                <input type="text" v-model="form.project.enterpriseid" />
              </div>
              <div class="form-item">
                <label>项目A角</label>
                <input type="text" v-model="form.project.a_owner" />
              </div>
              <div class="form-item">
                <label>项目B角</label>
                <input type="text" v-model="form.project.b_owner" />
              </div>
              <div class="form-item">
                <label>市场经理</label>
                <input type="text" v-model="form.project.market_manager" />
              </div>
              <div class="form-item">
                <label>项目来源</label>
                <select v-model="form.project.source">
                  <option value="金融中介">金融中介</option>
                  <option value="非金融中介">非金融中介</option>
                  <option value="银行">银行</option>
                  <option value="老客户续作">老客户续作</option>
                  <option value="老客户推荐">老客户推荐</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div class="form-item">
                <label>合作银行</label>
                <input type="text" v-model="form.project.coop_bank" />
              </div>
              <div class="form-item">
                <label>申请日期</label>
                <input type="date" v-model="form.project.apply_date" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>一、申请贷款信息</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>借款人名称</label>
                <input type="text" v-model="form.loan.borrower_name" />
              </div>
              <div class="form-item">
                <label>申请金额</label>
                <input type="number" v-model="form.loan.apply_amount" />
              </div>
              <div class="form-item">
                <label>申请期限</label>
                <input type="number" v-model="form.loan.apply_term" />
              </div>
              <div class="form-item">
                <label>贷款用途</label>
                <textarea v-model="form.loan.purpose_detail" rows="3"></textarea>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>二、项目基本情况</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>企业名称</label>
                <input type="text" v-model="form.company.name" />
              </div>
              <div class="form-item">
                <label>注册资本</label>
                <input type="number" v-model="form.company.registered_capital" />
              </div>
              <div class="form-item">
                <label>成立时间</label>
                <input type="date" v-model="form.company.established_date" />
              </div>
              <div class="form-item">
                <label>注册地址</label>
                <input type="text" v-model="form.company.registered_address" />
              </div>
              <div class="form-item">
                <label>主营业务</label>
                <textarea v-model="form.company.main_business" rows="3"></textarea>
              </div>
              <div class="form-item">
                <label>所属行业（大类）</label>
                <select v-model="form.business.type">
                  <option value="餐饮业">餐饮业</option>
                  <option value="纺织业">纺织业</option>
                  <option value="服务业">服务业</option>
                  <option value="公安安全管理业">公安安全管理业</option>
                  <option value="建筑业">建筑业</option>
                  <option value="教育业">教育业</option>
                  <option value="零售业">零售业</option>
                  <option value="贸易">贸易</option>
                  <option value="农业">农业</option>
                  <option value="制造业">制造业</option>
                </select>
              </div>
              <div class="form-item">
                <label>员工人数</label>
                <input type="number" v-model="form.company.employee_count" />
              </div>
              <div class="form-item">
                <label>是否为外贸型</label>
                <select v-model="form.business.is_waimao">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div class="form-item">
                <label>是否属于谨慎介入行业</label>
                <select v-model="form.business.is_jinshen">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div class="form-item">
                <label>最近一期工资是否发放</label>
                <select v-model="form.company.is_salary">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div class="form-item">
                <label>股东情况</label>
                <textarea v-model="form.company.shareholder_info" rows="3"></textarea>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>实控人 / 申请人情况</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>实际控制人</label>
                <input type="text" v-model="form.controller.name" />
              </div>
              <div class="form-item">
                <label>性别</label>
                <select v-model="form.controller.gender">
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <div class="form-item">
                <label>籍贯</label>
                <input type="text" v-model="form.controller.native_place" />
              </div>
              <div class="form-item">
                <label>婚姻状况</label>
                <select v-model="form.controller.marital_status">
                  <option value="未婚">未婚</option>
                  <option value="已婚">已婚</option>
                  <option value="离异">离异</option>
                  <option value="丧偶">丧偶</option>
                </select>
              </div>
              <div class="form-item">
                <label>出生日期</label>
                <input type="date" v-model="form.controller.birth_date" />
              </div>
              <div class="form-item">
                <label>服务年限</label>
                <input type="number" v-model="form.controller.service_years" />
              </div>
              <div class="form-item">
                <label>文化程度</label>
                <select v-model="form.controller.education">
                  <option value="小学">小学</option>
                  <option value="初中">初中</option>
                  <option value="职高">职高</option>
                  <option value="高中">高中</option>
                  <option value="中专">中专</option>
                  <option value="大专">大专</option>
                  <option value="本科">本科</option>
                  <option value="硕士">硕士</option>
                  <option value="博士">博士</option>
                  <option value="博士后">博士后</option>
                </select>
              </div>
              <div class="form-item">
                <label>配偶姓名</label>
                <input type="text" v-model="form.controller.spouse_name" />
              </div>
              <div class="form-item full-row large-textarea">
                <label>学习、工作及企业发展经历</label>
                <textarea v-model="form.controller.career_experience" rows="4"></textarea>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>家庭与社会情况</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>家庭是否和睦</label>
                <select v-model="form.family.is_hemu">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div class="form-item full-row large-textarea">
                <label>家庭年支出</label>
                <textarea
                  v-model="form.family.annual_expense"
                  rows="3"
                  placeholder="了解家庭一年的支出情况。"
                ></textarea>
              </div>
              <div class="form-item full-row large-textarea">
                <label>家庭成员</label>
                <textarea
                  v-model="form.family.members_info"
                  rows="3"
                  placeholder="父母、配偶、子女的情况、工作等信息；是否有其他不良爱好；家人是否知道该笔贷款及用途"
                ></textarea>
              </div>
              <div class="form-item full-row large-textarea">
                <label>社会关系</label>
                <textarea
                  v-model="form.social.relationship_info"
                  rows="3"
                  placeholder="除直系血亲外的社会关系，如兄弟姐妹、家族、朋友等从政、从商信息。"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>居住情况</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>居住场所类型</label>
                <input type="text" v-model="form.residence.type" />
              </div>
              <div class="form-item">
                <label>具体地址</label>
                <input type="text" v-model="form.residence.address" />
              </div>
              <div class="form-item">
                <label>本地居住年限</label>
                <input type="number" v-model="form.residence.years" />
              </div>
            </div>
          </div>
          <div class="form-section">
            <h3>三、经营模式及场所</h3>
            <h4 class="subsection-title">经营场所表</h4>
            <div
              class="table-row"
              v-for="(site, index) in form.business_sites"
              :key="'site-' + index"
            >
              <div class="table-row-header">
                <span>场所 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.business_sites, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>地址</label>
                  <input type="text" v-model="site.address" />
                </div>
                <div class="form-item">
                  <label>建筑面积</label>
                  <input type="number" v-model="site.building_area" />
                </div>
                <div class="form-item">
                  <label>土地面积</label>
                  <input type="number" v-model="site.land_area" />
                </div>
                <div class="form-item">
                  <label>自有 / 租赁</label>
                  <select v-model="site.ownership">
                    <option value="自有">自有</option>
                    <option value="租赁">租赁</option>
                  </select>
                </div>
                <div class="form-item">
                  <label>场地月租金</label>
                  <input type="number" v-model="site.month_pay" />
                </div>
                <div class="form-item">
                  <label>最近一期是否支付</label>
                  <select v-model="site.is_pay">
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.business_sites, createBusinessSite)"
            >
              添加经营场所
            </el-button>

            <h4 class="subsection-title">经营模式</h4>
            <div class="form-grid">
              <div class="form-item">
                <label>商业模式简述</label>
                <textarea v-model="form.business.model_description" rows="3"></textarea>
              </div>
            </div>
          </div>
          <div class="form-section">
            <h3>四、资信状况</h3>
            <h4 class="subsection-title">银行账户</h4>
            <div
              class="table-row"
              v-for="(bank, index) in form.business_accounts"
              :key="'bank-' + index"
            >
              <div class="table-row-header">
                <span>账户 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.business_accounts, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>开户银行</label>
                  <input type="text" v-model="bank.account_name" />
                </div>
                <div class="form-item">
                  <label>银行账号</label>
                  <input type="text" v-model="bank.account_no" />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.business_accounts, createBusinessAccount)"
            >
              添加账户
            </el-button>

            <h4 class="subsection-title">银行月末余额（近一年）</h4>
            <div
              class="table-row"
              v-for="(row, index) in form.account_rows"
              :key="'account-row-' + index"
            >
              <div class="table-row-header">
                <span>余额 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.account_rows, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>年份</label>
                  <input type="text" v-model="row.year" />
                </div>
                <div class="form-item" v-for="month in months" :key="month.key">
                  <label>{{ month.label }}余额</label>
                  <input type="number" v-model="row[month.key]" @input="updateAccountRowAvg(row)" />
                </div>
                <div class="form-item">
                  <label>月均余额</label>
                  <input type="number" v-model="row.avg" readonly />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.account_rows, createAccountRow)"
            >
              添加余额行
            </el-button>

            <h4 class="subsection-title">日均余额</h4>
            <div
              class="table-row"
              v-for="(row, index) in form.daily_avg_balance"
              :key="'daily-' + index"
            >
              <div class="table-row-header">
                <span>日均 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.daily_avg_balance, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>年份</label>
                  <input type="text" v-model="row.year" />
                </div>
                <div class="form-item" v-for="month in quarterMonths" :key="month.key">
                  <label>{{ month.label }}日均</label>
                  <input type="number" v-model="row[month.key]" @input="updateDailyAvgRow(row)" />
                </div>
                <div class="form-item">
                  <label>全年日均</label>
                  <input type="number" v-model="row.annual_avg" readonly />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.daily_avg_balance, createDailyAvgRow)"
            >
              添加日均行
            </el-button>

            <h4 class="subsection-title">我司在保情况（若有）</h4>
            <div
              class="table-row"
              v-for="(g, index) in form.guarantees"
              :key="'guarantee-' + index"
            >
              <div class="table-row-header">
                <span>在保 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.guarantees, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>业务品种</label>
                  <input type="text" v-model="g.type" />
                </div>
                <div class="form-item">
                  <label>承保金额</label>
                  <input type="number" v-model="g.amount" />
                </div>
                <div class="form-item">
                  <label>承保余额</label>
                  <input type="number" v-model="g.balance" />
                </div>
                <div class="form-item">
                  <label>反担保</label>
                  <input type="text" v-model="g.counter_guarantee" />
                </div>
                <div class="form-item">
                  <label>每月还款本息</label>
                  <input type="number" v-model="g.monthly_payment" />
                </div>
                <div class="form-item">
                  <label>开始日期</label>
                  <input type="date" v-model="g.start_date" />
                </div>
                <div class="form-item">
                  <label>终止日期</label>
                  <input type="date" v-model="g.end_date" />
                </div>
                <div class="form-item">
                  <label>合作银行和利率</label>
                  <input type="text" v-model="g.bank_rate" />
                </div>
                <div class="form-item">
                  <label>实际贷款用途</label>
                  <input type="text" v-model="g.purpose" />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.guarantees, createGuarantee)"
            >
              添加在保
            </el-button>
            <div class="form-grid">
              <div class="form-item">
                <label>承保金额合计</label>
                <input type="number" v-model="form.guarantees_totals.amount_total" />
              </div>
              <div class="form-item">
                <label>承保余额合计</label>
                <input type="number" v-model="form.guarantees_totals.balance_total" />
              </div>
            </div>

            <h4 class="subsection-title">现有贷款情况</h4>
            <div
              class="table-row"
              v-for="(loanItem, index) in form.existing_loans"
              :key="'existing-' + index"
            >
              <div class="table-row-header">
                <span>贷款 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeExistingLoan(index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>业务品种</label>
                  <input type="text" v-model="loanItem.type" />
                </div>
                <div class="form-item">
                  <label>贷款金额</label>
                  <input type="number" v-model="loanItem.amount" @input="updateExistingLoansTotals" />
                </div>
                <div class="form-item">
                  <label>贷款余额</label>
                  <input type="number" v-model="loanItem.balance" @input="updateExistingLoansTotals" />
                </div>
                <div class="form-item">
                  <label>担保方式</label>
                  <input type="text" v-model="loanItem.mode" />
                </div>
                <div class="form-item">
                  <label>每月还款本息</label>
                  <input type="number" v-model="loanItem.monthly_payment" @input="updateExistingLoansTotals" />
                </div>
                <div class="form-item">
                  <label>开始日期</label>
                  <input type="date" v-model="loanItem.start_date" />
                </div>
                <div class="form-item">
                  <label>终止日期</label>
                  <input type="date" v-model="loanItem.end_date" />
                </div>
                <div class="form-item">
                  <label>合作银行和利率</label>
                  <input type="text" v-model="loanItem.bank_rate" />
                </div>
                <div class="form-item">
                  <label>实际贷款用途</label>
                  <input type="text" v-model="loanItem.purpose" />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addExistingLoan"
            >
              添加现有贷款
            </el-button>
            <div class="form-grid">
              <div class="form-item">
                <label>贷款金额合计</label>
                <input type="number" v-model="form.existing_loans_totals.amount_total" readonly />
              </div>
              <div class="form-item">
                <label>贷款余额合计</label>
                <input type="number" v-model="form.existing_loans_totals.balance_total" readonly />
              </div>
              <div class="form-item">
                <label>每月还款本息合计</label>
                <input type="number" v-model="form.existing_loans_totals.monthly_payment_total" readonly />
              </div>
            </div>

            <h4 class="subsection-title">征信与诉讼</h4>
            <div class="form-grid">
              <div class="form-item">
                <label>征信查询次数（近一年）</label>
                <input type="number" v-model="form.credit.inquiry_count" />
              </div>
              <div class="form-item">
                <label>征信逾期、不良信息</label>
                <textarea v-model="form.credit.adverse_info" rows="3"></textarea>
              </div>
              <div class="form-item">
                <label>逾期次数</label>
                <input type="number" v-model="form.credit.overdue_count" />
              </div>
              <div class="form-item">
                <label>最高逾期金额</label>
                <input type="number" v-model="form.credit.max_overdue_amount" />
              </div>
              <div class="form-item">
                <label>诉讼情况</label>
                <textarea v-model="form.litigation.status" rows="3"></textarea>
              </div>
            </div>
          </div>
          <div class="form-section">
            <h3>五、用电情况</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>采集类型</label>
                <select v-model="electricityCollectType">
                  <option value="">请选择</option>
                  <option value="quantity">用电量</option>
                  <option value="cost">电费</option>
                </select>
              </div>
              <div class="form-item wide-item">
                <label>情况说明</label>
                <textarea
                  v-model="form.electricity.descript"
                  rows="3"
                  placeholder="优先采集用电量，适用于生产型企业。"
                ></textarea>
              </div>
            </div>

            <h4 class="subsection-title">用电明细</h4>
            <div
              class="table-row"
              v-for="(item, index) in form.electricity.items"
              :key="'electricity-' + index"
            >
              <div class="table-row-header">
                <span>明细 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.electricity.items, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>年份</label>
                  <input type="text" v-model="item.year" />
                </div>
                <div class="form-item" v-for="month in months" :key="month.key">
                  <label>{{ month.label }}用电</label>
                  <input type="number" v-model="item[month.key]" @input="updateElectricityTotal(item)" />
                </div>
                <div class="form-item">
                  <label>合计</label>
                  <input type="number" v-model="item.total" readonly />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.electricity.items, createElectricityItem)"
            >
              添加用电明细
            </el-button>
          </div>

          <div class="form-section">
            <h3>六、方案及还款分析</h3>

            <h4 class="subsection-title">项目方案</h4>
            <div class="form-grid">
              <div class="form-item">
                <label>贷款金额</label>
                <input type="number" v-model="form.analysis.plan.amount" />
              </div>
              <div class="form-item">
                <label>贷款期限</label>
                <input type="number" v-model="form.analysis.plan.term" />
              </div>
              <div class="form-item">
                <label>还款方式</label>
                <input type="text" v-model="form.analysis.plan.repayment_method" />
              </div>
              <div class="form-item">
                <label>担保费率</label>
                <input type="number" v-model="form.analysis.plan.fee_rate" />
              </div>
              <div class="form-item">
                <label>企业保证</label>
                <input type="text" v-model="form.analysis.plan.corp_guarantee" />
              </div>
              <div class="form-item">
                <label>个人保证</label>
                <input type="text" v-model="form.analysis.plan.personal_guarantee" />
              </div>
              <div class="form-item">
                <label>抵押物</label>
                <input type="text" v-model="form.analysis.plan.collateral" />
              </div>
              <div class="form-item">
                <label>房产抵押评估值</label>
                <input type="number" v-model="form.analysis.plan.diyapingguzhi" />
              </div>
              <div class="form-item">
                <label>房产二押余值</label>
                <input type="number" v-model="form.analysis.plan.eryayuzhi" />
              </div>
              <div class="form-item">
                <label>设备抵押净值</label>
                <input type="number" v-model="form.analysis.plan.diyajingzhi" />
              </div>
            </div>

            <h4 class="subsection-title">财务数据</h4>
            <div class="form-grid">
              <div class="form-item">
                <label>总资产</label>
                <input type="number" v-model="form.analysis.financials.total_assets" />
              </div>
              <div class="form-item">
                <label>总负债</label>
                <input type="number" v-model="form.analysis.financials.total_liabilities" />
              </div>
              <div class="form-item">
                <label>净资产</label>
                <input type="number" v-model="form.analysis.financials.net_assets" />
              </div>
              <div class="form-item">
                <label>营业收入</label>
                <input type="number" v-model="form.analysis.financials.revenue" />
              </div>
              <div class="form-item">
                <label>净收益</label>
                <input type="number" v-model="form.analysis.financials.net_income" />
              </div>
              <div class="form-item">
                <label>利润去向</label>
                <input type="text" v-model="form.analysis.profit_destination" />
              </div>
            </div>

            <h4 class="subsection-title">指标评价</h4>
            <div class="form-grid">
              <div class="form-item">
                <label>资产负债率</label>
                <input type="number" v-model="form.analysis.indicators.asset_debt_ratio" />
              </div>
              <div class="form-item">
                <label>销售负债率</label>
                <input type="number" v-model="form.analysis.indicators.sales_debt_ratio" />
              </div>
              <div class="form-item">
                <label>是否符合净收益3倍</label>
                <select v-model="form.analysis.indicators.meets_3x_income">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div class="form-item">
                <label>应收账款平均账期</label>
                <input type="number" v-model="form.analysis.indicators.receivable_days" />
              </div>
              <div class="form-item">
                <label>月均余额或日均余额（万元）（任一）</label>
                <input type="number" v-model="form.analysis.indicators.avg_balance" />
              </div>
              <div class="form-item">
                <label>月还款额（含本笔贷款） /月净收益对比 </label>
                <input type="number" v-model="form.analysis.indicators.repayment_ratio" />
              </div>
              <div class="form-item">
                <label>是否适用优贷宝</label>
                <select v-model="form.analysis.indicators.is_superior_loan">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div class="form-item">
                <label>是否处于成长期</label>
                <select v-model="form.analysis.indicators.is_growth_phase">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div class="form-item">
                <label>是否增加有效担保人</label>
                <select v-model="form.analysis.indicators.is_added_guarantor">
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
            </div>

            <h4 class="subsection-title">软信息分析</h4>
            <div class="form-grid">
              <div class="form-item full-row large-textarea">
                <label>软信息分析</label>
                <textarea
                  v-model="form.analysis.soft_info"
                  rows="3"
                  placeholder="家庭情况分析、老板品行分析等"
                ></textarea>
              </div>
            </div>

            <h4 class="subsection-title">综合评价</h4>
            <div class="form-grid">
              <div class="form-item full-row large-textarea">
                <label>综合评价</label>
                <textarea
                  v-model="form.analysis.summary"
                  rows="3"
                  placeholder="结合指标、软信息、还款能力、还款意愿、资金调集能力综合分析"
                ></textarea>
              </div>
            </div>

            <h4 class="subsection-title">项目额度</h4>
            <div class="form-grid">
              <div class="form-item full-row wide-input">
                <label>额度测定</label>
                <input
                  type="text"
                  v-model="form.analysis.limit.calculation"
                  placeholder="年净收益 * 贷款期限（年）*0.7 - 经营类贷款（年净收益需剔除贷款利息）"
                />
              </div>
              <div class="form-item full-row wide-input">
                <label>申请额度</label>
                <input type="number" v-model="form.analysis.limit.apply_amount" />
              </div>
              <div class="form-item full-row wide-input">
                <label>增额因素</label>
                <input
                  type="text"
                  v-model="form.analysis.limit.increase_factors"
                  placeholder="是否增加其他有效保证人或车辆、设备等抵押物"
                />
              </div>
            </div>
          </div>
          <div class="form-section">
            <h3>附表1 资产负债表简表</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>报表日期</label>
                <input type="month" v-model="form.bs.date" />
              </div>
              <div class="form-item">
                <label>货币资金</label>
                <input type="number" v-model="form.bs.cash" />
              </div>
              <div class="form-item">
                <label>应收账款</label>
                <input type="number" v-model="form.bs.ar" />
              </div>
              <div class="form-item">
                <label>预付账款</label>
                <input type="number" v-model="form.bs.prepayments" />
              </div>
              <div class="form-item">
                <label>其它应收</label>
                <input type="number" v-model="form.bs.other_ar" />
              </div>
              <div class="form-item">
                <label>存货</label>
                <input type="number" v-model="form.bs.inventory" />
              </div>
              <div class="form-item">
                <label>固定资产及土地</label>
                <input type="number" v-model="form.bs.fixed_assets" />
              </div>
              <div class="form-item">
                <label>总资产</label>
                <input type="number" v-model="form.bs.total_assets" />
              </div>
              <div class="form-item">
                <label>借款</label>
                <input type="number" v-model="form.bs.loans" />
              </div>
              <div class="form-item">
                <label>应付账款</label>
                <input type="number" v-model="form.bs.ap" />
              </div>
              <div class="form-item">
                <label>预收账款</label>
                <input type="number" v-model="form.bs.advances" />
              </div>
              <div class="form-item">
                <label>其它应付</label>
                <input type="number" v-model="form.bs.other_ap" />
              </div>
              <div class="form-item">
                <label>实收资本</label>
                <input type="number" v-model="form.bs.capital" />
              </div>
              <div class="form-item">
                <label>留存收益</label>
                <input type="number" v-model="form.bs.retained_earnings" />
              </div>
              <div class="form-item">
                <label>负债及权益合计</label>
                <input type="number" v-model="form.bs.total_liabilities_equity" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>附表2资产统计表</h3>
            <!-- <h4 class="subsection-title">资产统计表</h4> -->
            <div
              class="table-row"
              v-for="(asset, index) in form.asset_stats"
              :key="'asset-' + index"
            >
              <div class="table-row-header">
                <span>资产 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.asset_stats, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>资产名称</label>
                  <input type="text" v-model="asset.name" />
                </div>
                <div class="form-item">
                  <label>购入时间</label>
                  <input type="date" v-model="asset.buy_time" />
                </div>
                <div class="form-item">
                  <label>购入价格</label>
                  <input type="number" v-model="asset.buy_price" />
                </div>
                <div class="form-item">
                  <label>当前价值</label>
                  <input type="number" v-model="asset.current_value" />
                </div>
                <div class="form-item">
                  <label>折旧额</label>
                  <input type="number" v-model="asset.depreciation" />
                </div>
                <div class="form-item">
                  <label>备注</label>
                  <input type="text" v-model="asset.remark" />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.asset_stats, createAssetStat)"
            >
              添加资产
            </el-button>

            <h4 class="subsection-title">合计</h4>
            <div class="form-grid">
              <div class="form-item">
                <label>购入价格合计</label>
                <input type="number" v-model="form.asset_totals.buy_price" />
              </div>
              <div class="form-item">
                <label>当前价值合计</label>
                <input type="number" v-model="form.asset_totals.current_value" />
              </div>
              <div class="form-item">
                <label>折旧合计</label>
                <input type="number" v-model="form.asset_totals.depreciation" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>附表3.1 损益表</h3>
            <div class="form-grid">
              <div class="form-item">
                <label>年份</label>
                <input type="text" v-model="form.is_table.year" />
              </div>
              <div class="form-item">
                <label>销售收入总额</label>
                <input type="number" v-model="form.is_table.s_total" />
              </div>
            </div>

            <h4 class="subsection-title">销售收入明细</h4>
            <div
              class="table-row"
              v-for="(item, index) in form.is_table.sales_list"
              :key="'sales-' + index"
            >
              <div class="table-row-header">
                <span>销售 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.is_table.sales_list, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>项目名称</label>
                  <input type="text" v-model="item.name" />
                </div>
                <div class="form-item">
                  <label>金额</label>
                  <input type="number" v-model="item.value" />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.is_table.sales_list, createSalesItem)"
            >
              添加销售项
            </el-button>

            <div class="form-grid">
              <div class="form-item">
                <label>物料成本</label>
                <input type="number" v-model="form.is_table.material_cost" />
              </div>
              <div class="form-item">
                <label>毛利润</label>
                <input type="number" v-model="form.is_table.gross_profit" />
              </div>
              <div class="form-item">
                <label>工资（销售、安装）</label>
                <input type="number" v-model="form.is_table.f_wages" />
              </div>
              <div class="form-item">
                <label>租金</label>
                <input type="number" v-model="form.is_table.f_rent" />
              </div>
              <div class="form-item">
                <label>水电费</label>
                <input type="number" v-model="form.is_table.f_utility" />
              </div>
              <div class="form-item">
                <label>通讯费</label>
                <input type="number" v-model="form.is_table.f_comm" />
              </div>
              <div class="form-item">
                <label>运输费</label>
                <input type="number" v-model="form.is_table.f_trans" />
              </div>
              <div class="form-item">
                <label>材料损失</label>
                <input type="number" v-model="form.is_table.f_loss" />
              </div>
              <div class="form-item">
                <label>广告及维护费</label>
                <input type="number" v-model="form.is_table.f_adv" />
              </div>
              <div class="form-item">
                <label>招待费</label>
                <input type="number" v-model="form.is_table.f_entertain" />
              </div>
              <div class="form-item">
                <label>其它税收</label>
                <input type="number" v-model="form.is_table.f_tax" />
              </div>
              <div class="form-item">
                <label>其它费用</label>
                <input type="number" v-model="form.is_table.f_other" />
              </div>
              <div class="form-item">
                <label>固定支出合计</label>
                <input type="number" v-model="form.is_table.f_total" />
              </div>
              <div class="form-item">
                <label>净利润</label>
                <input type="number" v-model="form.is_table.net_profit" />
              </div>
              <div class="form-item">
                <label>家庭开支</label>
                <input type="number" v-model="form.is_table.o_family_exp" />
              </div>
              <div class="form-item">
                <label>分期还款（经营）</label>
                <input type="number" v-model="form.is_table.o_biz_loan" />
              </div>
              <div class="form-item">
                <label>分期还款（私人）</label>
                <input type="number" v-model="form.is_table.o_pvt_loan" />
              </div>
              <div class="form-item">
                <label>其它支出</label>
                <input type="number" v-model="form.is_table.o_other_exp" />
              </div>
              <div class="form-item">
                <label>家庭收入</label>
                <input type="number" v-model="form.is_table.o_family_inc" />
              </div>
              <div class="form-item">
                <label>年净收益</label>
                <input type="number" v-model="form.is_table.annual_net_income" />
              </div>
            </div>
          </div>
          <div class="form-section">
            <h3>附表3.2 营业额校验</h3>
            <h4 class="subsection-title">校验数据</h4>
            <div
              class="table-row"
              v-for="(item, index) in form.rev_check.items"
              :key="'rev-' + index"
            >
              <div class="table-row-header">
                <span>数据 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.rev_check.items, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>数据名称</label>
                  <input type="text" v-model="item.name" />
                </div>
                <div class="form-item">
                  <label>数据金额</label>
                  <input type="number" v-model="item.value" />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.rev_check.items, createRevCheckItem)"
            >
              添加校验项
            </el-button>

            <h4 class="subsection-title">合计与推算</h4>
            <div class="form-grid">
              <div class="form-item">
                <label>合计金额</label>
                <input type="number" v-model="form.rev_check.total_value" />
              </div>
              <div class="form-item">
                <label>推算营业额</label>
                <input type="number" v-model="form.rev_check.est_total" />
              </div>
              <div class="form-item">
                <label>损益表使用额</label>
                <input type="number" v-model="form.rev_check.is_revenue" />
              </div>
              <div class="form-item">
                <label>偏差率</label>
                <input type="number" v-model="form.rev_check.diff_rate" />
              </div>
              <div class="form-item">
                <label>推算方式</label>
                <input type="text" v-model="form.rev_check.method" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>付表4 流水分析</h3>
            <h4 class="subsection-title">流入</h4>
            <div
              class="table-row"
              v-for="(item, index) in form.cashflow_in"
              :key="'in-' + index"
            >
              <div class="table-row-header">
                <span>流入 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.cashflow_in, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>年份</label>
                  <input type="text" v-model="item.year" />
                </div>
                <div class="form-item" v-for="month in months" :key="month.key">
                  <label>{{ month.label }}金额</label>
                  <input type="number" v-model="item[month.key]" @input="updateCashflowTotal(item)" />
                </div>
                <div class="form-item">
                  <label>合计</label>
                  <input type="number" v-model="item.total" readonly />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.cashflow_in, createCashflowItem)"
            >
              添加流入行
            </el-button>

            <h4 class="subsection-title">流出</h4>
            <div
              class="table-row"
              v-for="(item, index) in form.cashflow_out"
              :key="'out-' + index"
            >
              <div class="table-row-header">
                <span>流出 {{ index + 1 }}</span>
                <div class="row-actions">
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="removeRow(form.cashflow_out, index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <label>年份</label>
                  <input type="text" v-model="item.year" />
                </div>
                <div class="form-item" v-for="month in months" :key="month.key">
                  <label>{{ month.label }}金额</label>
                  <input type="number" v-model="item[month.key]" @input="updateCashflowTotal(item)" />
                </div>
                <div class="form-item">
                  <label>合计</label>
                  <input type="number" v-model="item.total" readonly />
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addRow(form.cashflow_out, createCashflowItem)"
            >
              添加流出行
            </el-button>
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
import { computed, reactive } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const months = Array.from({ length: 12 }, (_, index) => ({
  key: `m${index + 1}`,
  label: `${index + 1}月`,
}));

const quarterMonths = [3, 6, 9, 12].map((month) => ({
  key: `m${month}`,
  label: `${month}月`,
}));

const createMonthlyRow = () =>
  months.reduce((acc, month) => {
    acc[month.key] = "";
    return acc;
  }, {});

const createBusinessSite = () => ({
  address: "",
  building_area: "",
  land_area: "",
  ownership: "",
  month_pay: "",
  is_pay: "",
});

const createBusinessAccount = () => ({
  account_name: "",
  account_no: "",
});

const createAccountRow = () => ({
  year: "",
  ...createMonthlyRow(),
  avg: "",
});

const createDailyAvgRow = () => ({
  year: "",
  m3: "",
  m6: "",
  m9: "",
  m12: "",
  annual_avg: "",
});

const createSalesItem = () => ({
  name: "",
  value: "",
});

const createGuarantee = () => ({
  type: "",
  amount: "",
  balance: "",
  counter_guarantee: "",
  monthly_payment: "",
  start_date: "",
  end_date: "",
  bank_rate: "",
  purpose: "",
});

const createExistingLoan = () => ({
  type: "",
  amount: "",
  balance: "",
  mode: "",
  monthly_payment: "",
  start_date: "",
  end_date: "",
  bank_rate: "",
  purpose: "",
});

const createElectricityItem = () => ({
  year: "",
  ...createMonthlyRow(),
  total: "",
});

const createAssetStat = () => ({
  name: "",
  buy_time: "",
  buy_price: "",
  current_value: "",
  depreciation: "",
  remark: "",
});

const createRevCheckItem = () => ({
  name: "",
  value: "",
});

const createCashflowItem = () => ({
  year: "",
  ...createMonthlyRow(),
  total: "",
});
const createForm = () => ({
  project: {
    a_owner: "",
    b_owner: "",
    market_manager: "",
    source: "",
    coop_bank: "",
    apply_date: "",
    enterpriseid: "",
  },
  loan: {
    borrower_name: "",
    apply_amount: "",
    apply_term: "",
    purpose_detail: "",
  },
  company: {
    name: "",
    registered_capital: "",
    established_date: "",
    registered_address: "",
    main_business: "",
    employee_count: "",
    is_salary: "",
    shareholder_info: "",
  },
  controller: {
    name: "",
    gender: "",
    native_place: "",
    marital_status: "",
    birth_date: "",
    service_years: "",
    education: "",
    spouse_name: "",
    career_experience: "",
  },
  family: {
    members_info: "",
    is_hemu: "",
    annual_expense: "",
  },
  social: {
    relationship_info: "",
  },
  residence: {
    type: "",
    years: "",
    address: "",
  },
  business_sites: [createBusinessSite()],
  business: {
    type: "",
    model_description: "",
    is_waimao: "",
    is_jinshen: "",
  },
  business_accounts: [createBusinessAccount()],
  account_rows: [createAccountRow()],
  daily_avg_balance: [createDailyAvgRow()],
  guarantees: [createGuarantee()],
  guarantees_totals: {
    amount_total: "",
    balance_total: "",
  },
  existing_loans: [createExistingLoan()],
  existing_loans_totals: {
    amount_total: "",
    balance_total: "",
    monthly_payment_total: "",
  },
  credit: {
    inquiry_count: "",
    adverse_info: "",
    overdue_count: "",
    max_overdue_amount: "",
  },
  litigation: {
    status: "",
  },
  electricity: {
    is_quantity: "",
    is_cost: "",
    descript: "",
    items: [createElectricityItem()],
  },
  analysis: {
    plan: {
      amount: "",
      term: "",
      repayment_method: "",
      fee_rate: "",
      corp_guarantee: "",
      personal_guarantee: "",
      collateral: "",
      diyapingguzhi: "",
      eryayuzhi: "",
      diyajingzhi: "",
    },
    financials: {
      total_assets: "",
      total_liabilities: "",
      net_assets: "",
      revenue: "",
      net_income: "",
    },
    profit_destination: "",
    indicators: {
      asset_debt_ratio: "",
      sales_debt_ratio: "",
      meets_3x_income: "",
      receivable_days: "",
      avg_balance: "",
      repayment_ratio: "",
      is_superior_loan: "",
      is_growth_phase: "",
      is_added_guarantor: "",
    },
    soft_info: "",
    summary: "",
    limit: {
      calculation: "",
      apply_amount: "",
      increase_factors: "",
    },
  },
  bs: {
    date: "",
    cash: "",
    ar: "",
    prepayments: "",
    other_ar: "",
    inventory: "",
    fixed_assets: "",
    total_assets: "",
    loans: "",
    ap: "",
    advances: "",
    other_ap: "",
    capital: "",
    retained_earnings: "",
    total_liabilities_equity: "",
  },
  asset_stats: [createAssetStat()],
  asset_totals: {
    buy_price: "",
    current_value: "",
    depreciation: "",
  },
  is_table: {
    year: "",
    sales_list: [createSalesItem()],
    s_total: "",
    material_cost: "",
    gross_profit: "",
    f_wages: "",
    f_rent: "",
    f_utility: "",
    f_comm: "",
    f_trans: "",
    f_loss: "",
    f_adv: "",
    f_entertain: "",
    f_tax: "",
    f_other: "",
    f_total: "",
    net_profit: "",
    o_family_exp: "",
    o_biz_loan: "",
    o_pvt_loan: "",
    o_other_exp: "",
    o_family_inc: "",
    annual_net_income: "",
  },
  rev_check: {
    items: [createRevCheckItem()],
    total_value: "",
    est_total: "",
    is_revenue: "",
    diff_rate: "",
    method: "",
  },
  cashflow_in: [createCashflowItem()],
  cashflow_out: [createCashflowItem()],
});

const form = reactive(createForm());

const electricityCollectType = computed({
  get() {
    if (form.electricity.is_quantity === "是") {
      return "quantity";
    }
    if (form.electricity.is_cost === "是") {
      return "cost";
    }
    return "";
  },
  set(value) {
    if (value === "quantity") {
      form.electricity.is_quantity = "是";
      form.electricity.is_cost = "否";
      return;
    }
    if (value === "cost") {
      form.electricity.is_quantity = "否";
      form.electricity.is_cost = "是";
      return;
    }
    form.electricity.is_quantity = "";
    form.electricity.is_cost = "";
  },
});

const addRow = (list, factory) => {
  list.push(factory());
};

const removeRow = (list, index) => {
  if (list.length > 1) {
    list.splice(index, 1);
  }
};

const updateExistingLoansTotals = () => {
  let hasValue = false;
  let amountSum = 0;
  let balanceSum = 0;
  let paymentSum = 0;
  form.existing_loans.forEach((loan) => {
    const amount = loan.amount;
    const balance = loan.balance;
    const payment = loan.monthly_payment;
    if (amount !== "" && amount !== null && amount !== undefined) {
      hasValue = true;
      const num = Number(amount);
      if (!Number.isFinite(num)) {
        return;
      }
      amountSum += num;
    }
    if (balance !== "" && balance !== null && balance !== undefined) {
      hasValue = true;
      const num = Number(balance);
      if (!Number.isFinite(num)) {
        return;
      }
      balanceSum += num;
    }
    if (payment !== "" && payment !== null && payment !== undefined) {
      hasValue = true;
      const num = Number(payment);
      if (!Number.isFinite(num)) {
        return;
      }
      paymentSum += num;
    }
  });
  form.existing_loans_totals.amount_total = hasValue ? amountSum : "";
  form.existing_loans_totals.balance_total = hasValue ? balanceSum : "";
  form.existing_loans_totals.monthly_payment_total = hasValue ? paymentSum : "";
};

const addExistingLoan = () => {
  form.existing_loans.push(createExistingLoan());
  updateExistingLoansTotals();
};

const removeExistingLoan = (index) => {
  if (form.existing_loans.length > 1) {
    form.existing_loans.splice(index, 1);
  }
  updateExistingLoansTotals();
};

const updateAccountRowAvg = (row) => {
  const values = months.map((month) => {
    const raw = row[month.key];
    if (raw === "" || raw === null || raw === undefined) {
      return null;
    }
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  });
  if (values.some((value) => value === null)) {
    row.avg = "";
    return;
  }
  const sum = values.reduce((acc, value) => acc + value, 0);
  row.avg = (sum / values.length).toFixed(2);
};

const updateDailyAvgRow = (row) => {
  const values = quarterMonths.map((month) => {
    const raw = row[month.key];
    if (raw === "" || raw === null || raw === undefined) {
      return null;
    }
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  });
  if (values.some((value) => value === null)) {
    row.annual_avg = "";
    return;
  }
  const sum = values.reduce((acc, value) => acc + value, 0);
  row.annual_avg = (sum / values.length).toFixed(2);
};

const updateElectricityTotal = (item) => {
  let hasValue = false;
  let sum = 0;
  for (const month of months) {
    const raw = item[month.key];
    if (raw === "" || raw === null || raw === undefined) {
      continue;
    }
    hasValue = true;
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      item.total = "";
      return;
    }
    sum += num;
  }
  item.total = hasValue ? sum : "";
};

const updateCashflowTotal = (item) => {
  let hasValue = false;
  let sum = 0;
  for (const month of months) {
    const raw = item[month.key];
    if (raw === "" || raw === null || raw === undefined) {
      continue;
    }
    hasValue = true;
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      item.total = "";
      return;
    }
    sum += num;
  }
  item.total = hasValue ? sum : "";
};
const DRAFT_KEY = "vis_form_draft_v2";

const saveDraft = () => {
  const draft = JSON.parse(JSON.stringify(form));
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ data: draft, savedAt: new Date().toISOString() })
  );
  ElMessage.success("已暂存当前填写内容");
};

const applyDraft = (target, source) => {
  if (!source || typeof source !== "object") {
    return;
  }
  Object.keys(target).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      return;
    }
    const targetValue = target[key];
    const sourceValue = source[key];
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      targetValue.splice(0, targetValue.length, ...sourceValue);
      return;
    }
    if (targetValue && typeof targetValue === "object" && !Array.isArray(targetValue)) {
      applyDraft(targetValue, sourceValue);
      return;
    }
    target[key] = sourceValue;
  });
};

const restoreDraft = () => {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) {
    ElMessage.warning("暂无暂存数据");
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    const data = parsed?.data || parsed;
    applyDraft(form, data);
    updateExistingLoansTotals();
    ElMessage.success("已恢复上次暂存内容");
  } catch (error) {
    console.error("恢复暂存失败:", error);
    ElMessage.error("暂存数据损坏，请重新填写");
  }
};

const saveWithoutPredict = async () => {
  try {
    updateExistingLoansTotals();
    const createdBy = localStorage.getItem("username") || "";
    const payload = JSON.parse(JSON.stringify(form));
    const projectManager = form.project.market_manager || form.project.a_owner || "";
    const basicData = {
      company_name: form.company.name,
      date: new Date().toISOString().split("T")[0],
      application_period: form.loan.apply_term,
      project_manager: projectManager,
      report_number: form.project.enterpriseid,
      predicted: null,
      created_by: createdBy,
    };

    const detailData = {
      ...payload,
      project_number: form.project.enterpriseid,
      company_name: form.company.name,
      project_manager: projectManager,
      predicted: null,
      prediction_text: "",
      created_by: createdBy,
    };

    await axios.post("http://localhost:8989/insert-huizong", basicData);
    await axios.post("http://localhost:8989/insert-prediction", detailData);
    ElMessage.success("已保存");
    window.location.reload();
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败，请重试");
  }
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&family=ZCOOL+XiaoWei&display=swap");

.form-container {
  --bg-1: #f7f3ec;
  --bg-2: #f2f6f5;
  --surface: #ffffff;
  --surface-alt: #fbf9f3;
  --border: #e6dfd3;
  --text: #1d2326;
  --muted: #6e7377;
  --accent: #2b7a78;
  --accent-2: #e8a860;
  --accent-3: #235f68;
  --field-height: 40px;
  padding: 24px;
  max-width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  color: var(--text);
  font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 15px;
  background:
    radial-gradient(circle at 12% 12%, rgba(43, 122, 120, 0.12), transparent 45%),
    radial-gradient(circle at 88% 18%, rgba(232, 168, 96, 0.15), transparent 42%),
    linear-gradient(180deg, var(--bg-1), var(--bg-2));
  border-radius: 18px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  margin-bottom: 18px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(20, 28, 34, 0.08);
}

.page-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--accent-3);
}

.subtitle {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 14px;
}

.main-content {
  display: flex;
  gap: 22px;
  margin-top: 18px;
  align-items: flex-start;
}

.input-section {
  flex: 4;
  overflow-y: auto;
  max-height: calc(100vh - 140px);
  padding-right: 8px;
}

.input-section::-webkit-scrollbar {
  width: 8px;
}

.input-section::-webkit-scrollbar-thumb {
  background: rgba(43, 122, 120, 0.35);
  border-radius: 10px;
}

.output-section {
  flex: 3;
  position: sticky;
  top: 16px;
  height: calc(100vh - 140px);
}

.form-section {
  background-color: var(--surface);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 18px;
  border: 1px solid var(--border);
  box-shadow: 0 10px 20px rgba(20, 28, 34, 0.06);
  position: relative;
  overflow: hidden;
  animation: sectionReveal 0.55s ease both;
}

.form-section::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 6px;
  background: linear-gradient(180deg, var(--accent), transparent);
  opacity: 0.6;
}

.form-section h3 {
  margin: 0 0 14px 0;
  color: var(--accent-3);
  font-size: 1.15em;
  font-weight: 600;
  letter-spacing: 0.4px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--border);
}

.subsection-title {
  margin: 12px 0 10px;
  color: var(--accent);
  font-size: 1em;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item label {
  font-weight: 500;
  color: var(--muted);
  font-size: 0.95em;
}

.form-item input,
.form-item select,
.form-item textarea {
  padding: 9px 10px;
  border: 1px solid #d9d3c8;
  border-radius: 8px;
  font-size: 0.98em;
  background: var(--surface-alt);
  height: var(--field-height);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.form-item input:focus,
.form-item select:focus,
.form-item textarea:focus {
  border-color: var(--accent);
  background: #fffdf9;
  box-shadow: 0 0 0 3px rgba(43, 122, 120, 0.15);
  outline: none;
}

.form-item textarea {
  min-height: var(--field-height);
  resize: none;
  line-height: 1.4;
}

.form-item.full-row {
  grid-column: 1 / -1;
}

.form-item.wide-item {
  grid-column: span 2;
}

.form-item.wide-input input,
.form-item.wide-input textarea,
.form-item.wide-input select {
  width: 100%;
}

.form-item.large-textarea textarea {
  height: 140px;
  min-height: 140px;
  resize: vertical;
}

.table-row {
  border: 1px dashed #dcd5ca;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 14px;
  background:
    linear-gradient(180deg, rgba(232, 168, 96, 0.08), transparent 60%),
    #fff;
}

.table-row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: var(--accent-3);
  font-weight: 600;
  font-size: 0.98em;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.submit-section {
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background-color: var(--surface);
  border-radius: 14px;
  border: 1px solid var(--border);
  box-shadow: 0 12px 26px rgba(20, 28, 34, 0.08);
}

.result-container {
  background-color: var(--surface);
  border-radius: 14px;
  padding: 20px;
  height: 100%;
  border: 1px solid var(--border);
  box-shadow: 0 14px 30px rgba(20, 28, 34, 0.1);
  overflow-y: auto;
}

.result-content {
  margin-top: 20px;
}

.warning {
  color: #b8751a;
  font-size: 1.15em;
  font-weight: 600;
}

.error {
  color: #b6463c;
  font-size: 1.15em;
  font-weight: 600;
}

.success {
  color: #2f7b4a;
  font-size: 1.15em;
  font-weight: 600;
}

.prediction-value {
  margin-top: 10px;
  font-size: 1.05em;
  color: var(--accent-3);
}

.issues-list {
  margin-top: 15px;
}

.issues-title {
  color: var(--muted);
  font-weight: 500;
}

.issues-list ul {
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 10px;
}

.issues-list li {
  color: var(--muted);
  margin-bottom: 5px;
}

.no-result {
  color: #8c8f92;
  text-align: center;
  padding: 40px 0;
}

.prediction-text {
  white-space: pre-line;
  line-height: 1.7;
  color: #2a3134;
  font-size: 1.05em;
  margin: 20px 0;
  padding: 16px;
  background-color: #f9f6f0;
  border-radius: 8px;
  border-left: 4px solid var(--accent-2);
}

.prediction-text strong {
  color: var(--accent-3);
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
  border: 5px solid #efe9dd;
  border-top: 5px solid var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: var(--muted);
  font-size: 1.05em;
  text-align: center;
  animation: pulse 1.5s ease-in-out infinite;
}

:deep(.el-button) {
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--accent), #3c9c98);
  border: none;
  color: #fff;
}

:deep(.el-button--primary.is-plain) {
  background: rgba(43, 122, 120, 0.08);
  border: 1px solid rgba(43, 122, 120, 0.3);
  color: var(--accent-3);
  padding: 8px 18px;
  font-size: 14px;
}

:deep(.el-button--danger.is-plain) {
  border-color: rgba(182, 70, 60, 0.4);
  color: #b6463c;
}

@keyframes sectionReveal {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
}

@media (max-width: 1080px) {
  .main-content {
    flex-direction: column;
  }

  .output-section {
    position: static;
    height: auto;
  }

  .input-section {
    max-height: none;
    padding-right: 0;
  }
}

@media (max-width: 720px) {
  .form-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-item.wide-item {
    grid-column: 1 / -1;
  }
}
</style>
