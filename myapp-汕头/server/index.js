const mysql = require('mysql');
const util = require('util');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'airport',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci'
});

// promisify query for async/await
const queryAsync = util.promisify(conn.query).bind(conn);

// 建表：loan_application
const createLoanApplicationTableSQL = `
CREATE TABLE IF NOT EXISTS loan_application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project_a_owner VARCHAR(100),
    project_b_owner VARCHAR(100),
    project_market_manager VARCHAR(100),
    project_source VARCHAR(200),
    project_coop_bank VARCHAR(200),
    project_apply_date DATE,
    project_enterpriseid VARCHAR(100),
    loan_borrower_name VARCHAR(200),
    loan_apply_amount DECIMAL(18,2),
    loan_apply_term INT,
    loan_purpose_detail TEXT,
    company_name VARCHAR(200),
    company_registered_capital DECIMAL(18,2),
    company_established_date DATE,
    company_registered_address VARCHAR(300),
    company_main_business TEXT,
    company_employee_count INT,
    company_is_salary VARCHAR(10),
    company_shareholder_info TEXT,
    controller_name VARCHAR(100),
    controller_gender VARCHAR(10),
    controller_native_place VARCHAR(100),
    controller_marital_status VARCHAR(20),
    controller_birth_date DATE,
    controller_service_years INT,
    controller_education VARCHAR(50),
    controller_spouse_name VARCHAR(100),
    controller_career_experience TEXT,
    family_members_info TEXT,
    family_is_hemu VARCHAR(10),
    family_annual_expense DECIMAL(18,2),
    social_relationship_info TEXT,
    residence_type VARCHAR(50),
    residence_years INT,
    residence_address VARCHAR(300),
    business_type VARCHAR(100),
    business_month_pay DECIMAL(18,2),
    business_is_pay VARCHAR(10),
    business_model_description TEXT,
    business_is_waimao VARCHAR(10),
    business_is_jinshen VARCHAR(10),
    credit_inquiry_count INT,
    credit_adverse_info TEXT,
    credit_overdue_count INT,
    credit_max_overdue_amount DECIMAL(18,2),
    litigation_status TEXT,
    electricity_is_quantity VARCHAR(10),
    electricity_is_cost VARCHAR(10),
    electricity_descript TEXT,
    analysis_plan_amount DECIMAL(18,2),
    analysis_plan_term INT,
    analysis_plan_repayment_method VARCHAR(100),
    analysis_plan_fee_rate DECIMAL(18,4),
    analysis_plan_corp_guarantee VARCHAR(10),
    analysis_plan_personal_guarantee VARCHAR(10),
    analysis_plan_collateral VARCHAR(200),
    analysis_plan_diyapingguzhi DECIMAL(18,2),
    analysis_plan_eryayuzhi DECIMAL(18,2),
    analysis_plan_diyajingzhi DECIMAL(18,2),
    analysis_fin_total_assets DECIMAL(18,2),
    analysis_fin_total_liabilities DECIMAL(18,2),
    analysis_fin_net_assets DECIMAL(18,2),
    analysis_fin_revenue DECIMAL(18,2),
    analysis_fin_net_income DECIMAL(18,2),
    analysis_ind_asset_debt_ratio DECIMAL(10,4),
    analysis_ind_sales_debt_ratio DECIMAL(10,4),
    analysis_ind_meets_3x_income VARCHAR(10),
    analysis_ind_receivable_days INT,
    analysis_ind_avg_balance DECIMAL(18,2),
    analysis_ind_repayment_ratio DECIMAL(10,4),
    analysis_ind_is_superior_loan VARCHAR(10),
    analysis_ind_is_growth_phase VARCHAR(10),
    analysis_ind_is_added_guarantor VARCHAR(10),
    analysis_soft_info TEXT,
    analysis_summary TEXT,
    analysis_limit_calculation TEXT,
    analysis_limit_apply_amount DECIMAL(18,2),
    analysis_limit_increase_factors TEXT,
    bs_date DATE,
    bs_cash DECIMAL(18,2),
    bs_ar DECIMAL(18,2),
    bs_prepayments DECIMAL(18,2),
    bs_other_ar DECIMAL(18,2),
    bs_inventory DECIMAL(18,2),
    bs_fixed_assets DECIMAL(18,2),
    bs_total_assets DECIMAL(18,2),
    bs_loans DECIMAL(18,2),
    bs_ap DECIMAL(18,2),
    bs_advances DECIMAL(18,2),
    bs_other_ap DECIMAL(18,2),
    bs_capital DECIMAL(18,2),
    bs_retained_earnings DECIMAL(18,2),
    bs_total_liabilities_equity DECIMAL(18,2),
    asset_totals_buy_price DECIMAL(18,2),
    asset_totals_current_value DECIMAL(18,2),
    asset_totals_depreciation DECIMAL(18,2),
    is_table_year VARCHAR(20),
    is_table_s1_t VARCHAR(100),
    is_table_s2_t VARCHAR(100),
    is_table_s3_t VARCHAR(100),
    is_table_s1 DECIMAL(18,2),
    is_table_s2 DECIMAL(18,2),
    is_table_s3 DECIMAL(18,2),
    is_table_s_total DECIMAL(18,2),
    is_table_material_cost DECIMAL(18,2),
    is_table_gross_profit DECIMAL(18,2),
    is_table_f_wages DECIMAL(18,2),
    is_table_f_rent DECIMAL(18,2),
    is_table_f_utility DECIMAL(18,2),
    is_table_f_comm DECIMAL(18,2),
    is_table_f_trans DECIMAL(18,2),
    is_table_f_loss DECIMAL(18,2),
    is_table_f_adv DECIMAL(18,2),
    is_table_f_entertain DECIMAL(18,2),
    is_table_f_tax DECIMAL(18,2),
    is_table_f_other DECIMAL(18,2),
    is_table_f_total DECIMAL(18,2),
    is_table_net_profit DECIMAL(18,2),
    is_table_o_family_exp DECIMAL(18,2),
    is_table_o_biz_loan DECIMAL(18,2),
    is_table_o_pvt_loan DECIMAL(18,2),
    is_table_o_other_exp DECIMAL(18,2),
    is_table_o_family_inc DECIMAL(18,2),
    is_table_annual_net_income DECIMAL(18,2),
    rev_check_total_value DECIMAL(18,2),
    rev_check_est_total DECIMAL(18,2),
    rev_check_is_revenue DECIMAL(18,2),
    rev_check_diff_rate DECIMAL(10,4),
    rev_check_method VARCHAR(200),
    business_sites_json JSON,
    business_accounts_json JSON,
    account_rows_json JSON,
    daily_avg_balance_json JSON,
    guarantees_json JSON,
    guarantees_amount_total DECIMAL(18,2),
    guarantees_balance_total DECIMAL(18,2),
    existing_loans_json JSON,
    electricity_items_json JSON,
    asset_stats_json JSON,
    rev_check_items_json JSON,
    cashflow_in_json JSON,
    cashflow_out_json JSON,
    predicted DECIMAL(18,2),
    prediction_text TEXT,
    expert_opinion TEXT,
    expert_amount DECIMAL(18,2),
    created_by VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createBusinessSitesTableSQL = `
CREATE TABLE IF NOT EXISTS business_sites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    address VARCHAR(300),
    building_area DECIMAL(18,2),
    land_area DECIMAL(18,2),
    ownership VARCHAR(50),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createBusinessAccountsTableSQL = `
CREATE TABLE IF NOT EXISTS business_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    account_name VARCHAR(200),
    account_no VARCHAR(100),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createAccountRowsTableSQL = `
CREATE TABLE IF NOT EXISTS account_rows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    year VARCHAR(10),
    m1 DECIMAL(18,2), m2 DECIMAL(18,2), m3 DECIMAL(18,2), m4 DECIMAL(18,2),
    m5 DECIMAL(18,2), m6 DECIMAL(18,2), m7 DECIMAL(18,2), m8 DECIMAL(18,2),
    m9 DECIMAL(18,2), m10 DECIMAL(18,2), m11 DECIMAL(18,2), m12 DECIMAL(18,2),
    avg DECIMAL(18,2),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createDailyAvgBalanceTableSQL = `
CREATE TABLE IF NOT EXISTS daily_avg_balance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    year VARCHAR(10),
    m3 DECIMAL(18,2),
    m6 DECIMAL(18,2),
    m9 DECIMAL(18,2),
    m12 DECIMAL(18,2),
    annual_avg DECIMAL(18,2),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createGuaranteesTableSQL = `
CREATE TABLE IF NOT EXISTS guarantees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    type VARCHAR(100),
    amount DECIMAL(18,2),
    balance DECIMAL(18,2),
    counter_guarantee VARCHAR(200),
    monthly_payment DECIMAL(18,2),
    start_date DATE,
    end_date DATE,
    bank_rate VARCHAR(100),
    purpose VARCHAR(200),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createExistingLoansTableSQL = `
CREATE TABLE IF NOT EXISTS existing_loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    type VARCHAR(100),
    amount DECIMAL(18,2),
    balance DECIMAL(18,2),
    mode VARCHAR(100),
    monthly_payment DECIMAL(18,2),
    start_date DATE,
    end_date DATE,
    bank_rate VARCHAR(100),
    purpose VARCHAR(200),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createElectricityItemsTableSQL = `
CREATE TABLE IF NOT EXISTS electricity_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    year VARCHAR(10),
    m1 DECIMAL(18,2), m2 DECIMAL(18,2), m3 DECIMAL(18,2), m4 DECIMAL(18,2),
    m5 DECIMAL(18,2), m6 DECIMAL(18,2), m7 DECIMAL(18,2), m8 DECIMAL(18,2),
    m9 DECIMAL(18,2), m10 DECIMAL(18,2), m11 DECIMAL(18,2), m12 DECIMAL(18,2),
    total DECIMAL(18,2),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createAssetStatsTableSQL = `
CREATE TABLE IF NOT EXISTS asset_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    name VARCHAR(200),
    buy_time DATE,
    buy_price DECIMAL(18,2),
    current_value DECIMAL(18,2),
    depreciation DECIMAL(18,2),
    remark VARCHAR(200),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createRevCheckItemsTableSQL = `
CREATE TABLE IF NOT EXISTS rev_check_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    name VARCHAR(200),
    value DECIMAL(18,2),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const createCashflowItemsTableSQL = `
CREATE TABLE IF NOT EXISTS cashflow_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    direction ENUM('in','out') NOT NULL,
    year VARCHAR(10),
    m1 DECIMAL(18,2), m2 DECIMAL(18,2), m3 DECIMAL(18,2), m4 DECIMAL(18,2),
    m5 DECIMAL(18,2), m6 DECIMAL(18,2), m7 DECIMAL(18,2), m8 DECIMAL(18,2),
    m9 DECIMAL(18,2), m10 DECIMAL(18,2), m11 DECIMAL(18,2), m12 DECIMAL(18,2),
    total DECIMAL(18,2),
    FOREIGN KEY (application_id) REFERENCES loan_application(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

// 建表：datahuizong
const createHuizongTableSQL = `
CREATE TABLE IF NOT EXISTS datahuizong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100),
    date DATE,
    application_period INT,
    project_manager VARCHAR(50),
    report_number VARCHAR(50),
    predicted TINYINT,
    expert_opinion TEXT,
    expert_amount DECIMAL(15,2),
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const tableStatements = [
    createLoanApplicationTableSQL
];

tableStatements.forEach((statement) => {
    conn.query(statement, (err) => {
        if (err) {
            console.error('创建表失败:', err);
        } else {
            console.log('表创建成功或已存在');
        }
    });
});

conn.query(createHuizongTableSQL, (err) => {
    if (err) {
        console.error('创建 datahuizong 表失败:', err);
    } else {
        console.log('datahuizong 表创建成功或已存在');
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const monthKeys = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
const quarterKeys = ['m3', 'm6', 'm9', 'm12'];

const normalizeArray = (value) => (Array.isArray(value) ? value : []);
const serializeArray = (value) => JSON.stringify(normalizeArray(value));

const hasRowContent = (row) => {
    if (!row || typeof row !== 'object') {
        return false;
    }
    return Object.values(row).some((value) => value !== null && value !== undefined && value !== '');
};

const normalizeCell = (value) => (value === '' || value === undefined ? null : value);
const normalizeScalar = (value) => (value === '' ? null : value);
const buildMonthlyValues = (row) => monthKeys.map((key) => normalizeCell(row ? row[key] : null));
const buildQuarterValues = (row) => quarterKeys.map((key) => normalizeCell(row ? row[key] : null));

const insertBatch = async (table, columns, rows, mapper) => {
    const filtered = rows.filter(hasRowContent);
    if (filtered.length === 0) {
        return { inserted: 0 };
    }
    const placeholders = filtered.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${placeholders}`;
    const values = filtered.flatMap((row) => mapper(row));
    const result = await queryAsync(sql, values);
    return { inserted: result?.affectedRows ?? filtered.length };
};

const mainColumns = [
    'project_a_owner', 'project_b_owner', 'project_market_manager', 'project_source', 'project_coop_bank',
    'project_apply_date', 'project_enterpriseid', 'loan_borrower_name', 'loan_apply_amount', 'loan_apply_term',
    'loan_purpose_detail', 'company_name', 'company_registered_capital', 'company_established_date',
    'company_registered_address', 'company_main_business', 'company_employee_count', 'company_is_salary',
    'company_shareholder_info', 'controller_name', 'controller_gender', 'controller_native_place',
    'controller_marital_status', 'controller_birth_date', 'controller_service_years', 'controller_education',
    'controller_spouse_name', 'controller_career_experience', 'family_members_info', 'family_is_hemu',
    'family_annual_expense', 'social_relationship_info', 'residence_type', 'residence_years', 'residence_address',
    'business_type', 'business_month_pay', 'business_is_pay', 'business_model_description', 'business_is_waimao',
    'business_is_jinshen', 'credit_inquiry_count', 'credit_adverse_info', 'credit_overdue_count',
    'credit_max_overdue_amount', 'litigation_status', 'electricity_is_quantity', 'electricity_is_cost',
    'electricity_descript', 'analysis_plan_amount', 'analysis_plan_term', 'analysis_plan_repayment_method',
    'analysis_plan_fee_rate', 'analysis_plan_corp_guarantee', 'analysis_plan_personal_guarantee',
    'analysis_plan_collateral', 'analysis_plan_diyapingguzhi', 'analysis_plan_eryayuzhi',
    'analysis_plan_diyajingzhi', 'analysis_fin_total_assets', 'analysis_fin_total_liabilities',
    'analysis_fin_net_assets', 'analysis_fin_revenue', 'analysis_fin_net_income', 'analysis_ind_asset_debt_ratio',
    'analysis_ind_sales_debt_ratio', 'analysis_ind_meets_3x_income', 'analysis_ind_receivable_days',
    'analysis_ind_avg_balance', 'analysis_ind_repayment_ratio', 'analysis_ind_is_superior_loan',
    'analysis_ind_is_growth_phase', 'analysis_ind_is_added_guarantor', 'analysis_soft_info', 'analysis_summary',
    'analysis_limit_calculation', 'analysis_limit_apply_amount', 'analysis_limit_increase_factors', 'bs_date',
    'bs_cash', 'bs_ar', 'bs_prepayments', 'bs_other_ar', 'bs_inventory', 'bs_fixed_assets', 'bs_total_assets',
    'bs_loans', 'bs_ap', 'bs_advances', 'bs_other_ap', 'bs_capital', 'bs_retained_earnings',
    'bs_total_liabilities_equity', 'asset_totals_buy_price', 'asset_totals_current_value',
    'asset_totals_depreciation', 'is_table_year', 'is_table_s1_t', 'is_table_s2_t', 'is_table_s3_t',
    'is_table_s1', 'is_table_s2', 'is_table_s3', 'is_table_s_total', 'is_table_material_cost',
    'is_table_gross_profit', 'is_table_f_wages', 'is_table_f_rent', 'is_table_f_utility', 'is_table_f_comm',
    'is_table_f_trans', 'is_table_f_loss', 'is_table_f_adv', 'is_table_f_entertain', 'is_table_f_tax',
    'is_table_f_other', 'is_table_f_total', 'is_table_net_profit', 'is_table_o_family_exp', 'is_table_o_biz_loan',
    'is_table_o_pvt_loan', 'is_table_o_other_exp', 'is_table_o_family_inc', 'is_table_annual_net_income',
    'rev_check_total_value', 'rev_check_est_total', 'rev_check_is_revenue', 'rev_check_diff_rate',
    'rev_check_method', 'business_sites_json', 'business_accounts_json', 'account_rows_json',
    'daily_avg_balance_json', 'guarantees_json', 'guarantees_amount_total', 'guarantees_balance_total',
    'existing_loans_json', 'electricity_items_json', 'asset_stats_json', 'rev_check_items_json', 'cashflow_in_json',
    'cashflow_out_json', 'predicted', 'prediction_text',
    'expert_opinion', 'expert_amount', 'created_by'
];

const mapMainValues = (payload) => {
    const project = payload.project || {};
    const loan = payload.loan || {};
    const company = payload.company || {};
    const controller = payload.controller || {};
    const family = payload.family || {};
    const social = payload.social || {};
    const residence = payload.residence || {};
    const business = payload.business || {};
    const credit = payload.credit || {};
    const litigation = payload.litigation || {};
    const electricity = payload.electricity || {};
    const analysis = payload.analysis || {};
    const plan = analysis.plan || {};
    const financials = analysis.financials || {};
    const indicators = analysis.indicators || {};
    const limit = analysis.limit || {};
    const bs = payload.bs || {};
    const assetTotals = payload.asset_totals || {};
    const isTable = payload.is_table || {};
    const revCheck = payload.rev_check || {};
    const guaranteesTotals = payload.guarantees_totals || {};

    return [
        project.a_owner || null,
        project.b_owner || null,
        project.market_manager || null,
        project.source || null,
        project.coop_bank || null,
        project.apply_date || null,
        project.enterpriseid || null,
        loan.borrower_name || null,
        loan.apply_amount || null,
        loan.apply_term || null,
        loan.purpose_detail || null,
        company.name || null,
        company.registered_capital || null,
        company.established_date || null,
        company.registered_address || null,
        company.main_business || null,
        company.employee_count || null,
        company.is_salary || null,
        company.shareholder_info || null,
        controller.name || null,
        controller.gender || null,
        controller.native_place || null,
        controller.marital_status || null,
        controller.birth_date || null,
        controller.service_years || null,
        controller.education || null,
        controller.spouse_name || null,
        controller.career_experience || null,
        family.members_info || null,
        family.is_hemu || null,
        family.annual_expense || null,
        social.relationship_info || null,
        residence.type || null,
        residence.years || null,
        residence.address || null,
        business.type || null,
        business.month_pay || null,
        business.is_pay || null,
        business.model_description || null,
        business.is_waimao || null,
        business.is_jinshen || null,
        credit.inquiry_count || null,
        credit.adverse_info || null,
        credit.overdue_count || null,
        credit.max_overdue_amount || null,
        litigation.status || null,
        electricity.is_quantity || null,
        electricity.is_cost || null,
        electricity.descript || null,
        plan.amount || null,
        plan.term || null,
        plan.repayment_method || null,
        plan.fee_rate || null,
        plan.corp_guarantee || null,
        plan.personal_guarantee || null,
        plan.collateral || null,
        plan.diyapingguzhi || null,
        plan.eryayuzhi || null,
        plan.diyajingzhi || null,
        financials.total_assets || null,
        financials.total_liabilities || null,
        financials.net_assets || null,
        financials.revenue || null,
        financials.net_income || null,
        indicators.asset_debt_ratio || null,
        indicators.sales_debt_ratio || null,
        indicators.meets_3x_income || null,
        indicators.receivable_days || null,
        indicators.avg_balance || null,
        indicators.repayment_ratio || null,
        indicators.is_superior_loan || null,
        indicators.is_growth_phase || null,
        indicators.is_added_guarantor || null,
        analysis.soft_info || null,
        analysis.summary || null,
        limit.calculation || null,
        limit.apply_amount || null,
        limit.increase_factors || null,
        bs.date || null,
        bs.cash || null,
        bs.ar || null,
        bs.prepayments || null,
        bs.other_ar || null,
        bs.inventory || null,
        bs.fixed_assets || null,
        bs.total_assets || null,
        bs.loans || null,
        bs.ap || null,
        bs.advances || null,
        bs.other_ap || null,
        bs.capital || null,
        bs.retained_earnings || null,
        bs.total_liabilities_equity || null,
        assetTotals.buy_price || null,
        assetTotals.current_value || null,
        assetTotals.depreciation || null,
        isTable.year || null,
        isTable.s1_t || null,
        isTable.s2_t || null,
        isTable.s3_t || null,
        isTable.s1 || null,
        isTable.s2 || null,
        isTable.s3 || null,
        isTable.s_total || null,
        isTable.material_cost || null,
        isTable.gross_profit || null,
        isTable.f_wages || null,
        isTable.f_rent || null,
        isTable.f_utility || null,
        isTable.f_comm || null,
        isTable.f_trans || null,
        isTable.f_loss || null,
        isTable.f_adv || null,
        isTable.f_entertain || null,
        isTable.f_tax || null,
        isTable.f_other || null,
        isTable.f_total || null,
        isTable.net_profit || null,
        isTable.o_family_exp || null,
        isTable.o_biz_loan || null,
        isTable.o_pvt_loan || null,
        isTable.o_other_exp || null,
        isTable.o_family_inc || null,
        isTable.annual_net_income || null,
        revCheck.total_value || null,
        revCheck.est_total || null,
        revCheck.is_revenue || null,
        revCheck.diff_rate || null,
        revCheck.method || null,
        serializeArray(payload.business_sites),
        serializeArray(payload.business_accounts),
        serializeArray(payload.account_rows),
        serializeArray(payload.daily_avg_balance),
        serializeArray(payload.guarantees),
        guaranteesTotals.amount_total || null,
        guaranteesTotals.balance_total || null,
        serializeArray(payload.existing_loans),
        serializeArray(electricity.items || []),
        serializeArray(payload.asset_stats),
        serializeArray(revCheck.items || []),
        serializeArray(payload.cashflow_in),
        serializeArray(payload.cashflow_out),
        payload.predicted || null,
        payload.prediction_text || null,
        payload.expert_opinion || null,
        payload.expert_amount || null,
        payload.created_by || null
    ];
};

const insertChildRows = async (applicationId, payload) => {
    const insertSummary = {};
    insertSummary.business_sites = (await insertBatch(
        'business_sites',
        ['application_id', 'address', 'building_area', 'land_area', 'ownership'],
        normalizeArray(payload.business_sites),
        (row) => [applicationId, row.address || null, row.building_area || null, row.land_area || null, row.ownership || null]
    )).inserted;

    insertSummary.business_accounts = (await insertBatch(
        'business_accounts',
        ['application_id', 'account_name', 'account_no'],
        normalizeArray(payload.business_accounts),
        (row) => [applicationId, row.account_name || null, row.account_no || null]
    )).inserted;

    insertSummary.account_rows = (await insertBatch(
        'account_rows',
        ['application_id', 'year', ...monthKeys, 'avg'],
        normalizeArray(payload.account_rows),
        (row) => [applicationId, row.year || null, ...buildMonthlyValues(row), row.avg || null]
    )).inserted;

    insertSummary.daily_avg_balance = (await insertBatch(
        'daily_avg_balance',
        ['application_id', 'year', ...quarterKeys, 'annual_avg'],
        normalizeArray(payload.daily_avg_balance),
        (row) => [applicationId, row.year || null, ...buildQuarterValues(row), row.annual_avg || null]
    )).inserted;

    insertSummary.guarantees = (await insertBatch(
        'guarantees',
        ['application_id', 'type', 'amount', 'balance', 'counter_guarantee', 'monthly_payment', 'start_date', 'end_date', 'bank_rate', 'purpose'],
        normalizeArray(payload.guarantees),
        (row) => [
            applicationId,
            row.type || null,
            row.amount || null,
            row.balance || null,
            row.counter_guarantee || null,
            row.monthly_payment || null,
            row.start_date || null,
            row.end_date || null,
            row.bank_rate || null,
            row.purpose || null
        ]
    )).inserted;

    insertSummary.existing_loans = (await insertBatch(
        'existing_loans',
        ['application_id', 'type', 'amount', 'balance', 'mode', 'monthly_payment', 'start_date', 'end_date', 'bank_rate', 'purpose'],
        normalizeArray(payload.existing_loans),
        (row) => [
            applicationId,
            row.type || null,
            row.amount || null,
            row.balance || null,
            row.mode || null,
            row.monthly_payment || null,
            row.start_date || null,
            row.end_date || null,
            row.bank_rate || null,
            row.purpose || null
        ]
    )).inserted;

    const electricityItems = payload.electricity ? payload.electricity.items : [];
    insertSummary.electricity_items = (await insertBatch(
        'electricity_items',
        ['application_id', 'year', ...monthKeys, 'total'],
        normalizeArray(electricityItems),
        (row) => [applicationId, row.year || null, ...buildMonthlyValues(row), row.total || null]
    )).inserted;

    insertSummary.asset_stats = (await insertBatch(
        'asset_stats',
        ['application_id', 'name', 'buy_time', 'buy_price', 'current_value', 'depreciation', 'remark'],
        normalizeArray(payload.asset_stats),
        (row) => [
            applicationId,
            row.name || null,
            row.buy_time || null,
            row.buy_price || null,
            row.current_value || null,
            row.depreciation || null,
            row.remark || null
        ]
    )).inserted;

    const revCheckItems = payload.rev_check ? payload.rev_check.items : [];
    insertSummary.rev_check_items = (await insertBatch(
        'rev_check_items',
        ['application_id', 'name', 'value'],
        normalizeArray(revCheckItems),
        (row) => [applicationId, row.name || null, row.value || null]
    )).inserted;

    insertSummary.cashflow_in = (await insertBatch(
        'cashflow_items',
        ['application_id', 'direction', 'year', ...monthKeys, 'total'],
        normalizeArray(payload.cashflow_in),
        (row) => [applicationId, 'in', row.year || null, ...buildMonthlyValues(row), row.total || null]
    )).inserted;

    insertSummary.cashflow_out = (await insertBatch(
        'cashflow_items',
        ['application_id', 'direction', 'year', ...monthKeys, 'total'],
        normalizeArray(payload.cashflow_out),
        (row) => [applicationId, 'out', row.year || null, ...buildMonthlyValues(row), row.total || null]
    )).inserted;

    return insertSummary;
};

// insert huizong
app.post('/insert-huizong', async (req, res) => {
    try {
        const data = req.body;
        const sql = `INSERT INTO datahuizong(
            company_name, date, application_period, project_manager, report_number, predicted, expert_opinion, expert_amount, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            data.company_name,
            data.date,
            normalizeScalar(data.application_period),
            data.project_manager,
            data.report_number,
            normalizeScalar(data.predicted),
            data.expert_opinion || null,
            data.expert_amount || null,
            data.created_by || null
        ];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.error("插入错误", err);
                res.status(500).send("插入错误");
                return;
            }
            res.status(200).send("插入成功");
        });
    } catch (error) {
        console.error("插入出错", error);
        res.status(500).send("插入错误");
    }
});

// insert prediction bulk (legacy)
app.post('/insert-prediction1', async (req, res) => {
    try {
        const predictions = req.body;
        for (const prediction of predictions) {
            const sql = `INSERT INTO sthz(
                name, sales_debt_ratio, asset_debt_ratio, annual_inflow, annual_outflow, sales_income, net_profit, annual_net_income, 
                monthly_balance, accounts_receivable, total_assets, total_liabilities, net_assets, business_loan, 
                monthly_repayment_vs_income, counter_guarantee, business_model, credit_inquiries, credit_overdue, education_work_experience, 
                family_social_relations, microloan_product_service, application_amount, application_period, determined_amount, report_number, predicted
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                prediction.qiye_name,
                prediction.sales_debt_ratio,
                prediction.asset_debt_ratio,
                prediction.annual_inflow,
                prediction.annual_outflow,
                prediction.sales_income,
                prediction.net_profit,
                prediction.annual_net_income,
                prediction.monthly_balance,
                prediction.accounts_receivable,
                prediction.total_assets,
                prediction.total_liabilities,
                prediction.net_assets,
                prediction.business_loan,
                prediction.monthly_repayment_vs_income,
                prediction.counter_guarantee,
                prediction.business_model,
                prediction.credit_inquiries,
                prediction.credit_overdue,
                prediction.education_work_experience,
                prediction.family_social_relations,
                prediction.microloan_product_service,
                prediction.application_amount,
                prediction.application_period,
                prediction.determined_amount,
                prediction.report_number,
                prediction.predicted,
            ];
            conn.query(sql, values, (err) => {
                if (err) {
                    console.error("插入错误", err);
                }
            });
        }
        res.status(200).send("插入成功");
    } catch (error) {
        console.error("插入出错", error);
        res.status(500).send("插入错误");
    }
});

// 插入 loan_application
app.post('/insert-prediction', async (req, res) => {
    const payload = req.body || {};
    const project = payload.project || {};
    const company = payload.company || {};

    if (!project.enterpriseid || !company.name) {
        return res.status(400).json({ error: 'Missing required fields: project.enterpriseid, company.name' });
    }

    try {
        await queryAsync('START TRANSACTION');

        const sql = `INSERT INTO loan_application (${mainColumns.join(', ')}) VALUES (${mainColumns.map(() => '?').join(', ')})`;
        const values = mapMainValues(payload);
        const result = await queryAsync(sql, values);
        const applicationId = result.insertId;

        const childSummary = {
            business_sites: normalizeArray(payload.business_sites).length,
            business_accounts: normalizeArray(payload.business_accounts).length,
            account_rows: normalizeArray(payload.account_rows).length,
            daily_avg_balance: normalizeArray(payload.daily_avg_balance).length,
            guarantees: normalizeArray(payload.guarantees).length,
            existing_loans: normalizeArray(payload.existing_loans).length,
            electricity_items: normalizeArray(payload.electricity ? payload.electricity.items : []).length,
            asset_stats: normalizeArray(payload.asset_stats).length,
            rev_check_items: normalizeArray(payload.rev_check ? payload.rev_check.items : []).length,
            cashflow_in: normalizeArray(payload.cashflow_in).length,
            cashflow_out: normalizeArray(payload.cashflow_out).length
        };

        await queryAsync('COMMIT');
        console.log('Inserted loan_application', {
            id: applicationId,
            project_enterpriseid: project.enterpriseid || null,
            company_name: company.name || null,
            child_rows: childSummary
        });
        res.json({ success: true, message: 'Data inserted successfully', insertId: applicationId });
    } catch (error) {
        try {
            await queryAsync('ROLLBACK');
        } catch (rollbackError) {
            console.error('Error rolling back transaction:', rollbackError);
        }
        console.error('Error inserting prediction:', error);
        res.status(500).json({ error: 'Failed to insert data', details: error.message });
    }
});

// sthz query
app.get('/sthz', (req, res) => {
    const name = req.query.name || '';
    const sql = `SELECT * FROM sthz WHERE report_number = ?`;
    conn.query(sql, name, (err, results) => {
        if (err) return res.status(500).send({ error: err.message });
        res.send(results);
    });
});

// datahuizong query
app.get('/datahuizong', (req, res) => {
    const reportNumber = req.query.name || '';
    const sql = `SELECT * FROM datahuizong WHERE report_number = ?`;
    conn.query(sql, reportNumber, (err, results) => {
        if (err) return res.status(500).send({ error: err.message });
        res.send(results);
    });
});

// 汇总列表带筛选
app.get('/xmlb', (req, res) => {
    const { searchName, searchReportNumber, searchUserName, startDate, endDate, searchTime } = req.query;
    let sql = `SELECT * FROM datahuizong`;
    const params = [];
    const conds = [];
    if (searchName) { conds.push(`company_name LIKE ?`); params.push(`%${searchName}%`); }
    if (searchReportNumber) { conds.push(`report_number LIKE ?`); params.push(`%${searchReportNumber}%`); }
    if (searchUserName) { conds.push(`project_manager LIKE ?`); params.push(`%${searchUserName}%`); }
    if (startDate && endDate) { conds.push(`date BETWEEN ? AND ?`); params.push(startDate, endDate); }
    else if (startDate) { conds.push(`date >= ?`); params.push(startDate); }
    else if (endDate) { conds.push(`date <= ?`); params.push(endDate); }
    if (searchTime) { conds.push(`application_period = ?`); params.push(searchTime); }
    if (conds.length) sql += ' WHERE ' + conds.join(' AND ');
    conn.query(sql, params, (err, results) => {
        if (err) return res.status(500).send({ error: err.message });
        res.send(results);
    });
});

// 获取贷款申请数据（按项目编号或创建人）
app.get('/loan-application', (req, res) => {
    const projectNumber = req.query.projectNumber;
    const createdBy = req.query.createdBy;
    let sql = '';
    let params = [];
    if (createdBy) {
        sql = `SELECT *, project_enterpriseid AS project_number, project_market_manager AS project_manager, loan_apply_amount AS application_amount, loan_apply_term AS application_period FROM loan_application WHERE created_by = ? ORDER BY created_at DESC`;
        params = [createdBy];
    } else if (projectNumber) {
        sql = `SELECT *, project_enterpriseid AS project_number, project_market_manager AS project_manager, loan_apply_amount AS application_amount, loan_apply_term AS application_period FROM loan_application WHERE project_enterpriseid = ?`;
        params = [projectNumber];
    } else {
        return res.status(400).send({ error: 'projectNumber or createdBy is required' });
    }
    conn.query(sql, params, (err, results) => {
        if (err) return res.status(500).send({ error: err.message });
        res.send(results);
    });
});

// 部门负责人查看本部门（除自己外）员工的录入
app.get('/department-entries', async (req, res) => {
    const manager = req.query.manager;
    if (!manager) return res.status(400).send({ error: 'manager is required' });
    try {
        const users = await queryAsync('SELECT department_id FROM users WHERE username = ?', [manager]);
        if (!users || users.length === 0 || !users[0].department_id) {
            return res.status(400).send({ error: 'manager department not found' });
        }
        const deptId = users[0].department_id;
        const rows = await queryAsync(
            `SELECT la.*,
                    la.project_enterpriseid AS project_number,
                    la.project_market_manager AS project_manager,
                    la.loan_apply_amount AS application_amount,
                    la.loan_apply_term AS application_period
             FROM loan_application la
             WHERE la.created_by IN (
                 SELECT username FROM users WHERE department_id = ? AND username <> ?
             )
             ORDER BY la.id DESC`,
            [deptId, manager]
        );
        res.send(rows);
    } catch (error) {
        console.error('Error fetching department entries:', error);
        res.status(500).send({ error: error.message });
    }
});

// 更新贷款申请数据（按 id）
app.put('/loan-application/:id', async (req, res) => {
    const id = req.params.id;
    const payload = req.body || {};
    if (!id) return res.status(400).send({ error: 'id is required' });

    const isStructuredPayload = Boolean(
        payload.project || payload.loan || payload.company || payload.controller || payload.family ||
        payload.social || payload.residence || payload.business || payload.credit || payload.analysis ||
        payload.bs || payload.is_table || payload.rev_check || payload.asset_stats || payload.cashflow_in ||
        payload.cashflow_out || payload.business_sites || payload.business_accounts || payload.account_rows ||
        payload.daily_avg_balance || payload.guarantees || payload.existing_loans || payload.electricity
    );

    if (!isStructuredPayload) {
        const updatableColumns = ['expert_opinion', 'expert_amount', 'predicted', 'prediction_text', 'created_by'];
        const fieldsToUpdate = updatableColumns.filter((col) => Object.prototype.hasOwnProperty.call(payload, col));
        if (fieldsToUpdate.length === 0) {
            return res.status(400).send({ error: 'No valid fields to update' });
        }

        const setClause = fieldsToUpdate.map((col) => `${col} = ?`).join(', ');
        const values = fieldsToUpdate.map((col) => payload[col]);
        values.push(id);

        try {
            await queryAsync(`UPDATE loan_application SET ${setClause} WHERE id = ?`, values);
            const rows = await queryAsync(
                'SELECT project_enterpriseid, company_name, loan_apply_term, project_market_manager, predicted, expert_opinion, expert_amount, created_by FROM loan_application WHERE id = ?',
                [id]
            );
            if (rows && rows.length > 0 && rows[0].project_enterpriseid) {
                await queryAsync(
                    `UPDATE datahuizong
                     SET company_name = ?, application_period = ?, project_manager = ?, predicted = ?, expert_opinion = ?, expert_amount = ?, created_by = ?
                     WHERE report_number = ?`,
                    [
                        rows[0].company_name || null,
                        rows[0].loan_apply_term || null,
                        rows[0].project_market_manager || null,
                        rows[0].predicted || null,
                        rows[0].expert_opinion || null,
                        rows[0].expert_amount || null,
                        rows[0].created_by || null,
                        rows[0].project_enterpriseid
                    ]
                );
            }
            return res.send({ success: true, message: 'Updated successfully' });
        } catch (error) {
            console.error('Error updating loan_application:', error);
            return res.status(500).send({ error: error.message });
        }
    }

    const project = payload.project || {};
    const company = payload.company || {};
    if (!project.enterpriseid || !company.name) {
        return res.status(400).send({ error: 'project.enterpriseid and company.name are required' });
    }

    try {
        await queryAsync('START TRANSACTION');

        const updateSql = `UPDATE loan_application SET ${mainColumns.map((col) => `${col} = ?`).join(', ')} WHERE id = ?`;
        const updateValues = [...mapMainValues(payload), id];
        await queryAsync(updateSql, updateValues);

        await queryAsync(
            `UPDATE datahuizong
             SET company_name = ?, application_period = ?, project_manager = ?, predicted = ?, expert_opinion = ?, expert_amount = ?, created_by = ?
             WHERE report_number = ?`,
            [
                company.name || null,
                payload.loan ? payload.loan.apply_term || null : null,
                project.market_manager || project.a_owner || null,
                payload.predicted || null,
                payload.expert_opinion || null,
                payload.expert_amount || null,
                payload.created_by || null,
                project.enterpriseid
            ]
        );

        await queryAsync('COMMIT');
        return res.send({ success: true, message: 'Updated successfully' });
    } catch (error) {
        try {
            await queryAsync('ROLLBACK');
        } catch (rollbackError) {
            console.error('Error rolling back transaction:', rollbackError);
        }
        console.error('Error updating loan_application:', error);
        return res.status(500).send({ error: error.message });
    }
});

// 删除贷款申请数据（按 id），同时删除 datahuizong 记录
app.delete('/loan-application-with-summary/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ error: 'id is required' });
    }
    try {
        const rows = await queryAsync('SELECT project_enterpriseid FROM loan_application WHERE id = ?', [id]);
        if (!rows || rows.length === 0) {
            return res.status(404).send({ error: 'Record not found' });
        }
        const reportNumber = rows[0].project_enterpriseid;
        await queryAsync('DELETE FROM loan_application WHERE id = ?', [id]);
        if (reportNumber) {
            await queryAsync('DELETE FROM datahuizong WHERE report_number = ?', [reportNumber]);
        }
        res.send({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting loan_application:', error);
        res.status(500).send({ error: error.message });
    }
});

// datahuizong insert (duplicate safe)
app.post('/datahuizong', async (req, res) => {
    try {
        const data = req.body;
        const sql = `INSERT INTO datahuizong(
            company_name, date, application_period, project_manager, report_number, predicted, expert_opinion, expert_amount, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            data.company_name,
            data.date,
            normalizeScalar(data.application_period),
            data.project_manager,
            data.report_number,
            normalizeScalar(data.predicted),
            data.expert_opinion || null,
            data.expert_amount || null,
            data.created_by || null
        ];

        conn.query(sql, values, (err) => {
            if (err) {
                console.error('插入错误', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Data inserted successfully' });
        });
    } catch (error) {
        console.error('处理请求时出错', error);
        res.status(500).json({ error: error.message });
    }
});

// 用户列表（用于选择部门负责人）
app.get('/users', async (req, res) => {
    const deptId = req.query.department_id;
    try {
        let sql = `
            SELECT u.id, u.username, u.role, u.department_id, u.created_at, d.name AS department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
        `;
        const params = [];
        if (deptId) {
            sql += ' WHERE u.department_id = ?';
            params.push(deptId);
        }
        sql += ' ORDER BY u.id DESC';
        const rows = await queryAsync(sql, params);
        res.send(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: error.message });
    }
});

// 生成与 werkzeug 兼容的 pbkdf2 sha256 哈希
function generateWerkzeugHash(password) {
    const method = 'pbkdf2:sha256';
    const iterations = 600000;
    const salt = crypto.randomBytes(16).toString('hex');
    const dk = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
    return `${method}:${iterations}$${salt}$${dk}`;
}

// 更新用户（部门/角色/密码）
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { department_id, role, password } = req.body || {};
    if (!id) return res.status(400).send({ error: 'id is required' });

    const updates = [];
    const params = [];
    if (department_id !== undefined) { updates.push('department_id = ?'); params.push(department_id || null); }
    if (role) { updates.push('role = ?'); params.push(role); }
    if (password) { updates.push('password_hash = ?'); params.push(generateWerkzeugHash(password)); }
    if (updates.length === 0) return res.status(400).send({ error: 'No fields to update' });
    params.push(id);

    try {
        await queryAsync(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
        res.send({ success: true });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ error: error.message });
    }
});

// 删除用户
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send({ error: 'id is required' });
    try {
        await queryAsync('DELETE FROM users WHERE id = ?', [id]);
        res.send({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ error: error.message });
    }
});

// 部门管理
app.get('/departments', async (req, res) => {
    try {
        const rows = await queryAsync('SELECT * FROM departments ORDER BY id DESC');
        res.send(rows);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).send({ error: error.message });
    }
});

app.post('/departments', async (req, res) => {
    const { name, manager_id } = req.body || {};
    if (!name) return res.status(400).send({ error: 'name is required' });
    if (!manager_id) return res.status(400).send({ error: 'manager_id is required' });
    try {
        // 如果该负责人已在其他部门担任负责人，先移除旧绑定以避免唯一约束冲突
        await queryAsync('UPDATE departments SET manager_id = NULL WHERE manager_id = ?', [manager_id]);

        const result = await queryAsync('INSERT INTO departments (name, manager_id) VALUES (?, ?)', [name, manager_id]);
        // 同步负责人角色与部门
        await queryAsync('UPDATE users SET role = ?, department_id = ? WHERE id = ?', ['manager', result.insertId, manager_id]);
        res.send({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).send({ error: error.message });
    }
});

app.put('/departments/:id', async (req, res) => {
    const id = req.params.id;
    const { name, manager_id } = req.body || {};
    
    if (!id) return res.status(400).send({ error: 'id is required' });
    let oldManagerId = null;
    try {
        const rows = await queryAsync('SELECT manager_id FROM departments WHERE id = ?', [id]);
        if (rows && rows.length > 0) oldManagerId = rows[0].manager_id;
    } catch (error) {
        console.error('Error reading department before update:', error);
    }

    const updates = [];
    const params = [];
    if (name) { updates.push('name = ?'); params.push(name); }
    if (manager_id) { updates.push('manager_id = ?'); params.push(manager_id); }
    if (updates.length === 0) return res.status(400).send({ error: 'No fields to update' });
    params.push(id);
    try {
        if (manager_id) {
            // 释放该负责人在其他部门的绑定，避免唯一约束冲突
            await queryAsync('UPDATE departments SET manager_id = NULL WHERE manager_id = ? AND id <> ?', [manager_id, id]);
        }
        await queryAsync(`UPDATE departments SET ${updates.join(', ')} WHERE id = ?`, params);
        if (manager_id) {
            // 设置新负责人
            await queryAsync('UPDATE users SET role = ?, department_id = ? WHERE id = ?', ['manager', id, manager_id]);
            // 旧负责人降级为普通用户，保留部门归属
            if (oldManagerId && oldManagerId !== manager_id) {
                await queryAsync('UPDATE users SET role = ? WHERE id = ?', ['user', oldManagerId]);
            }
        }
        res.send({ success: true });
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).send({ error: error.message });
    }
});

app.delete('/departments/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send({ error: 'id is required' });
    try {
        await queryAsync('UPDATE users SET role = "user", department_id = NULL WHERE department_id = ?', [id]);
        await queryAsync('DELETE FROM departments WHERE id = ?', [id]);
        res.send({ success: true });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).send({ error: error.message });
    }
});

app.listen(8989, () => {
    console.log('启动成功');
});
