const mysql = require('mysql')
const util = require('util')
const express = require('express')
const app = express()
const cors = require('cors')

const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'airport',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci'
})

// promisify query for async/await
const queryAsync = util.promisify(conn.query).bind(conn)

// 创建新的数据表
const createTableSQL = `
CREATE TABLE IF NOT EXISTS loan_application (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_number VARCHAR(50),
    company_name VARCHAR(100),
    project_manager VARCHAR(50),
    application_amount DECIMAL(15,2),
    application_period INT,
    repayment_method DECIMAL(15,2),
    controller_gender TINYINT,
    education_level DECIMAL(3,1),
    marital_status TINYINT,
    residence_type TINYINT,
    local_residence_years INT,
    industry_category TINYINT,
    industry_experience INT,
    is_foreign_trade TINYINT,
    is_cautious_industry TINYINT,
    employee_count INT,
    business_premises_type TINYINT,
    monthly_rent DECIMAL(15,2),
    monthly_balance DECIMAL(15,2),
    daily_balance DECIMAL(15,2),
    electricity_consumption DECIMAL(15,2),
    cash_at_meeting DECIMAL(15,2),
    receivables_at_meeting DECIMAL(15,2),
    inventory_at_meeting DECIMAL(15,2),
    payables_at_meeting DECIMAL(15,2),
    total_assets DECIMAL(15,2),
    total_liabilities DECIMAL(15,2),
    net_assets DECIMAL(15,2),
    annual_sales DECIMAL(15,2),
    annual_net_profit DECIMAL(15,2),
    monthly_net_profit DECIMAL(15,2),
    core_assets DECIMAL(15,2),
    hard_liabilities DECIMAL(15,2),
    operating_liabilities DECIMAL(15,2),
    sales_debt_ratio DECIMAL(5,2),
    asset_debt_ratio DECIMAL(5,2),
    monthly_repayment DECIMAL(15,2),
    total_monthly_repayment DECIMAL(15,2),
    repayment_income_ratio DECIMAL(5,2),
    average_payment_period INT,
    family_harmony TINYINT,
    minor_children INT,
    adult_family_members INT,
    working_family_members INT,
    credit_inquiries INT,
    overdue_times INT,
    max_overdue_amount DECIMAL(15,2),
    bank_inflow DECIMAL(15,2),
    bank_outflow DECIMAL(15,2),
    highest_flow_month VARCHAR(7),
    lowest_flow_month VARCHAR(7),
    company_guarantee TEXT,
    personal_guarantee TEXT,
    additional_guarantor TINYINT,
    property_mortgage DECIMAL(15,2),
    property_second_mortgage DECIMAL(15,2),
    equipment_mortgage DECIMAL(15,2),
    is_growth_stage TINYINT,
    used_youdaibao TINYINT,
    education_work_experience TEXT,
    family_social_relations TEXT,
    business_model TEXT,
    counter_guarantee TEXT,
    main_business TEXT,
    profit_usage TEXT,
    other_soft_info TEXT,
    loan_purpose TEXT,
    predicted TINYINT,
    prediction_text TEXT,
    expert_opinion TEXT,
    expert_amount DECIMAL(15,2),
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// 创建汇总表
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

conn.query(createTableSQL, (err, results) => {
    if (err) {
        console.error('创建loan_application表失败:', err);
    } else {
        console.log('loan_application表创建成功或已存在');
    }
});

conn.query(createHuizongTableSQL, (err, results) => {
    if (err) {
        console.error('创建datahuizong表失败:', err);
    } else {
        console.log('datahuizong表创建成功或已存在');
    }
});

app.use(cors())
// 解析文本
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/insert-huizong', async (req, res) => {
    try {
        const data = req.body;
        console.log('接收到的汇总数据:', data);

        const sql = `INSERT INTO datahuizong(
            company_name, date, application_period, project_manager, report_number, predicted, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
            data.company_name,
            data.date,
            data.application_period,
            data.project_manager,
            data.report_number,
            data.predicted,
            data.created_by || null
        ];
        
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.error("插入错误", err);
                res.status(500).send("插入错误");
                return;
            }
            console.log(`插入ID: ${results.insertId}`);
            res.status(200).send("插入成功");
        });
    } catch (error) {
        console.error("插入出错", error);
        res.status(500).send("插入错误");
    }
});

app.post('/insert-prediction1', async (req, res) => {
    try {
        const predictions = req.body; // 假设前端发送的是一个预测对象的数组
        console.log('predictions:', predictions);

        for (const prediction of predictions) {
            const sql = `INSERT INTO sthz(
                name, sales_debt_ratio, asset_debt_ratio, annual_inflow, annual_outflow, sales_income, net_profit, annual_net_income, 
                monthly_balance, accounts_receivable, total_assets, total_liabilities, net_assets, business_loan, 
                monthly_repayment_vs_income, counter_guarantee, business_model, credit_inquiries, credit_overdue, education_work_experience, 
                family_social_relations, microloan_product_service, application_amount, application_period, determined_amount,report_number, predicted
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
              
            console.log(values)
            // 执行 SQL 插入语句
            conn.query(sql, values, (err, results) => {
                if (err) {
                    console.error("插入错误", err);
                    res.status(500).send("插入错误");
                    return;
                }
                console.log(`插入ID: ${prediction.id}`);
            });
        }

        res.status(200).send("插入成功");
    } catch (error) {
        console.error("插入出错", error);
        res.status(500).send("插入错误");
    }
});

// 新增：插入贷款申请数据
app.post('/insert-prediction', async (req, res) => {
    try {
        const prediction = req.body;
        console.log('接收到的预测数据:', JSON.stringify(prediction, null, 2));

        if (!prediction) {
            console.error('没有接收到数据');
            return res.status(400).json({ error: 'No data received' });
        }

        // 验证必要字段
        const requiredFields = ['project_number', 'company_name', 'project_manager'];
        const missingFields = requiredFields.filter(field => !prediction[field]);
        if (missingFields.length > 0) {
            console.error('缺少必要字段:', missingFields);
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const sql = `INSERT INTO loan_application (
            project_number, company_name, project_manager, application_amount, application_period,
            repayment_method, controller_gender, education_level, marital_status, residence_type,
            local_residence_years, industry_category, industry_experience, is_foreign_trade,
            is_cautious_industry, employee_count, business_premises_type, monthly_rent,
            monthly_balance, daily_balance, electricity_consumption, cash_at_meeting,
            receivables_at_meeting, inventory_at_meeting, payables_at_meeting, total_assets,
            total_liabilities, net_assets, annual_sales, annual_net_profit, monthly_net_profit,
            core_assets, hard_liabilities, operating_liabilities, sales_debt_ratio,
            asset_debt_ratio, monthly_repayment, total_monthly_repayment, repayment_income_ratio,
            average_payment_period, family_harmony, minor_children, adult_family_members,
            working_family_members, credit_inquiries, overdue_times, max_overdue_amount,
            bank_inflow, bank_outflow, highest_flow_month, lowest_flow_month,
            company_guarantee, personal_guarantee, additional_guarantor, property_mortgage,
            property_second_mortgage, equipment_mortgage, is_growth_stage, used_youdaibao,
            education_work_experience, family_social_relations, business_model, counter_guarantee,
            main_business, profit_usage, other_soft_info, loan_purpose,
            predicted, prediction_text, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            prediction.project_number,
            prediction.company_name,
            prediction.project_manager,
            prediction.application_amount,
            prediction.application_period,
            prediction.repayment_method,
            prediction.controller_gender,
            prediction.education_level,
            prediction.marital_status,
            prediction.residence_type,
            prediction.local_residence_years,
            prediction.industry_category,
            prediction.industry_experience,
            prediction.is_foreign_trade,
            prediction.is_cautious_industry,
            prediction.employee_count,
            prediction.business_premises_type,
            prediction.monthly_rent,
            prediction.monthly_balance,
            prediction.daily_balance,
            prediction.electricity_consumption,
            prediction.cash_at_meeting,
            prediction.receivables_at_meeting,
            prediction.inventory_at_meeting,
            prediction.payables_at_meeting,
            prediction.total_assets,
            prediction.total_liabilities,
            prediction.net_assets,
            prediction.annual_sales,
            prediction.annual_net_profit,
            prediction.monthly_net_profit,
            prediction.core_assets,
            prediction.hard_liabilities,
            prediction.operating_liabilities,
            prediction.sales_debt_ratio,
            prediction.asset_debt_ratio,
            prediction.monthly_repayment,
            prediction.total_monthly_repayment,
            prediction.repayment_income_ratio,
            prediction.average_payment_period,
            prediction.family_harmony,
            prediction.minor_children,
            prediction.adult_family_members,
            prediction.working_family_members,
            prediction.credit_inquiries,
            prediction.overdue_times,
            prediction.max_overdue_amount,
            prediction.bank_inflow,
            prediction.bank_outflow,
            prediction.highest_flow_month,
            prediction.lowest_flow_month,
            prediction.company_guarantee,
            prediction.personal_guarantee,
            prediction.additional_guarantor,
            prediction.property_mortgage,
            prediction.property_second_mortgage,
            prediction.equipment_mortgage,
            prediction.is_growth_stage,
            prediction.used_youdaibao,
            prediction.education_work_experience,
            prediction.family_social_relations,
            prediction.business_model,
            prediction.counter_guarantee,
            prediction.main_business,
            prediction.profit_usage,
            prediction.other_soft_info,
            prediction.loan_purpose,
            prediction.predicted,
            prediction.prediction_text,
            prediction.created_by || null
        ];

        const result = await queryAsync(sql, values);
        console.log('Insert result:', result);

        res.json({ 
            success: true, 
            message: 'Data inserted successfully',
            insertId: result.insertId 
        });
    } catch (error) {
        console.error('Error inserting prediction:', error);
        res.status(500).json({ 
            error: 'Failed to insert data',
            details: error.message 
        });
    }
});

app.get('/sthz', (req, res) => {
    // 从请求参数中获取name值
    const name = req.query.name || '';

    // 构建SQL查询语句，使用参数化查询
    const sql = `SELECT * FROM sthz WHERE report_number = ?`;
    const params = name;

    // 执行SQL查询
    conn.query(sql, params, (err, results) => {
        if (err) {
            // 如果查询出错，返回错误响应
            res.status(500).send({ error: err.message });
        } else {
            // 如果查询成功，返回查询结果
            res.send(results);
        }
    });
});

app.get('/datahuizong', (req, res) => {
    const reportNumber = req.query.name || '';

    const sql = `SELECT * FROM datahuizong WHERE report_number = ?`;
    const params = reportNumber;

    conn.query(sql, params, (err, results) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(results);
        }
    });
});

app.get('/xmlb', (req, res) => {
    const searchName = req.query.searchName;
    const searchReportNumber = req.query.searchReportNumber;
    const searchUserName = req.query.searchUserName;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const searchTime = req.query.searchTime; // 新增：获取time字段的查询参数

    let sql = `SELECT * FROM datahuizong`;
    let searchParams = [];

    // 构建查询条件
    let hasConditions = false;

    if (searchName || searchReportNumber || searchUserName || startDate || endDate || searchTime) {
        sql += ` WHERE`;
        if (searchName) {
            sql += ` company_name LIKE ?`;
            searchParams.push(`%${searchName}%`);
            hasConditions = true;
        }
        if (searchReportNumber) {
            if (hasConditions) sql += ` AND`;
            sql += ` report_number LIKE ?`;
            searchParams.push(`%${searchReportNumber}%`);
            hasConditions = true;
        }
        if (searchUserName) {
            if (hasConditions) sql += ` AND`;
            sql += ` project_manager LIKE ?`;
            searchParams.push(`%${searchUserName}%`);
            hasConditions = true;
        }
        if (startDate || endDate) {
            if (hasConditions) sql += ` AND`;
            if (startDate && endDate) {
                sql += ` date BETWEEN ? AND ?`;
                searchParams.push(startDate);
                searchParams.push(endDate);
            } else if (startDate) {
                sql += ` date >= ?`;
                searchParams.push(startDate);
            } else if (endDate) {
                sql += ` date <= ?`;
                searchParams.push(endDate);
            }
            hasConditions = true;
        }
        if (searchTime) {
            if (hasConditions) sql += ` AND`;
            sql += ` application_period = ?`;
            searchParams.push(searchTime);
        }
    }

    conn.query(sql, searchParams, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error executing query');
        }
        res.send(results);
    });
});

// 新增：获取贷款申请数据
app.get('/loan-application', (req, res) => {
    const projectNumber = req.query.projectNumber || '';

    const sql = `SELECT * FROM loan_application WHERE project_number = ?`;
    const params = projectNumber;

    conn.query(sql, params, (err, results) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(results);
        }
    });
});

app.post('/datahuizong', async (req, res) => {
    try {
        const data = req.body;
        console.log('接收到的汇总数据:', data);

        const sql = `INSERT INTO datahuizong(
            company_name, date, application_period, project_manager, report_number, predicted, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            data.company_name,
            data.date,
            data.application_period,
            data.project_manager,
            data.report_number,
            data.predicted,
            data.created_by || null
        ];

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.error('插入错误', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Data inserted successfully' });
        });
    } catch (error) {
        console.error('处理请求时出错:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(8989, () => {
    console.log('启动成功')
})
