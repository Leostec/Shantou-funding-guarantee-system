const mysql = require('mysql');
const util = require('util');
const express = require('express');
const cors = require('cors');

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

conn.query(createTableSQL, (err) => {
    if (err) {
        console.error('创建 loan_application 表失败:', err);
    } else {
        console.log('loan_application 表创建成功或已存在');
    }
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
            data.application_period,
            data.project_manager,
            data.report_number,
            data.predicted,
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
    try {
        const prediction = req.body;
        if (!prediction) {
            return res.status(400).json({ error: 'No data received' });
        }

        const requiredFields = ['project_number', 'company_name', 'project_manager'];
        const missingFields = requiredFields.filter(field => !prediction[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const columns = [
            'project_number', 'company_name', 'project_manager', 'application_amount', 'application_period',
            'repayment_method', 'controller_gender', 'education_level', 'marital_status', 'residence_type',
            'local_residence_years', 'industry_category', 'industry_experience', 'is_foreign_trade',
            'is_cautious_industry', 'employee_count', 'business_premises_type', 'monthly_rent',
            'monthly_balance', 'daily_balance', 'electricity_consumption', 'cash_at_meeting',
            'receivables_at_meeting', 'inventory_at_meeting', 'payables_at_meeting', 'total_assets',
            'total_liabilities', 'net_assets', 'annual_sales', 'annual_net_profit', 'monthly_net_profit',
            'core_assets', 'hard_liabilities', 'operating_liabilities', 'sales_debt_ratio',
            'asset_debt_ratio', 'monthly_repayment', 'total_monthly_repayment', 'repayment_income_ratio',
            'average_payment_period', 'family_harmony', 'minor_children', 'adult_family_members',
            'working_family_members', 'credit_inquiries', 'overdue_times', 'max_overdue_amount',
            'bank_inflow', 'bank_outflow', 'highest_flow_month', 'lowest_flow_month',
            'company_guarantee', 'personal_guarantee', 'additional_guarantor', 'property_mortgage',
            'property_second_mortgage', 'equipment_mortgage', 'is_growth_stage', 'used_youdaibao',
            'education_work_experience', 'family_social_relations', 'business_model', 'counter_guarantee',
            'main_business', 'profit_usage', 'other_soft_info', 'loan_purpose',
            'predicted', 'prediction_text', 'expert_opinion', 'expert_amount', 'created_by'
        ];

        const sql = `INSERT INTO loan_application (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
        const values = columns.map((key) => {
            if (key === 'expert_opinion') return prediction.expert_opinion || null;
            if (key === 'expert_amount') return prediction.expert_amount || null;
            if (key === 'created_by') return prediction.created_by || null;
            return prediction[key];
        });

        const result = await queryAsync(sql, values);
        res.json({ success: true, message: 'Data inserted successfully', insertId: result.insertId });
    } catch (error) {
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
        sql = `SELECT * FROM loan_application WHERE created_by = ? ORDER BY created_at DESC`;
        params = [createdBy];
    } else if (projectNumber) {
        sql = `SELECT * FROM loan_application WHERE project_number = ?`;
        params = [projectNumber];
    } else {
        return res.status(400).send({ error: 'projectNumber or createdBy is required' });
    }
    conn.query(sql, params, (err, results) => {
        if (err) return res.status(500).send({ error: err.message });
        res.send(results);
    });
});

// 更新贷款申请数据（按 id）
app.put('/loan-application/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body || {};
    if (!id) return res.status(400).send({ error: 'id is required' });

    const updatableColumns = [
        'project_number', 'company_name', 'project_manager', 'application_amount', 'application_period',
        'repayment_method', 'controller_gender', 'education_level', 'marital_status', 'residence_type',
        'local_residence_years', 'industry_category', 'industry_experience', 'is_foreign_trade',
        'is_cautious_industry', 'employee_count', 'business_premises_type', 'monthly_rent',
        'monthly_balance', 'daily_balance', 'electricity_consumption', 'cash_at_meeting',
        'receivables_at_meeting', 'inventory_at_meeting', 'payables_at_meeting', 'total_assets',
        'total_liabilities', 'net_assets', 'annual_sales', 'annual_net_profit', 'monthly_net_profit',
        'core_assets', 'hard_liabilities', 'operating_liabilities', 'sales_debt_ratio',
        'asset_debt_ratio', 'monthly_repayment', 'total_monthly_repayment', 'repayment_income_ratio',
        'average_payment_period', 'family_harmony', 'minor_children', 'adult_family_members',
        'working_family_members', 'credit_inquiries', 'overdue_times', 'max_overdue_amount',
        'bank_inflow', 'bank_outflow', 'highest_flow_month', 'lowest_flow_month',
        'company_guarantee', 'personal_guarantee', 'additional_guarantor', 'property_mortgage',
        'property_second_mortgage', 'equipment_mortgage', 'is_growth_stage', 'used_youdaibao',
        'education_work_experience', 'family_social_relations', 'business_model', 'counter_guarantee',
        'main_business', 'profit_usage', 'other_soft_info', 'loan_purpose',
        'predicted', 'prediction_text', 'expert_opinion', 'expert_amount', 'created_by'
    ];

    const fieldsToUpdate = updatableColumns.filter(col => Object.prototype.hasOwnProperty.call(data, col));
    if (fieldsToUpdate.length === 0) {
        return res.status(400).send({ error: 'No valid fields to update' });
    }

    const setClause = fieldsToUpdate.map(col => `${col} = ?`).join(', ');
    const values = fieldsToUpdate.map(col => data[col]);
    values.push(id);

    const sql = `UPDATE loan_application SET ${setClause} WHERE id = ?`;

    conn.query(sql, values, (err) => {
        if (err) {
            console.error('Error updating loan_application:', err);
            return res.status(500).send({ error: err.message });
        }
        if (data.project_number) {
            const updateHuizongSql = `
                UPDATE datahuizong 
                SET company_name = ?, application_period = ?, project_manager = ?, predicted = ?, expert_opinion = ?, expert_amount = ?, created_by = ?
                WHERE report_number = ?
            `;
            const huizongValues = [
                data.company_name || null,
                data.application_period || null,
                data.project_manager || null,
                data.predicted || null,
                data.expert_opinion || null,
                data.expert_amount || null,
                data.created_by || null,
                data.project_number
            ];
            conn.query(updateHuizongSql, huizongValues, (err2) => {
                if (err2) {
                    return res.send({ success: true, message: 'loan_application updated, but failed to update datahuizong', warning: err2.message });
                }
                return res.send({ success: true, message: 'Updated successfully' });
            });
        } else {
            return res.send({ success: true, message: 'Updated successfully' });
        }
    });
});

// 删除贷款申请数据（按 id），同时删除 datahuizong 记录
app.delete('/loan-application-with-summary/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ error: 'id is required' });
    }
    try {
        const rows = await queryAsync('SELECT project_number FROM loan_application WHERE id = ?', [id]);
        if (!rows || rows.length === 0) {
            return res.status(404).send({ error: 'Record not found' });
        }
        const projectNumber = rows[0].project_number;
        await queryAsync('DELETE FROM loan_application WHERE id = ?', [id]);
        if (projectNumber) {
            await queryAsync('DELETE FROM datahuizong WHERE report_number = ?', [projectNumber]);
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
            data.application_period,
            data.project_manager,
            data.report_number,
            data.predicted,
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
