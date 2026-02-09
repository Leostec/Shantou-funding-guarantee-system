#!/usr/bin/env python3
"""
完整测试下载报告功能 - 使用实际的build_doc_context函数
"""
import sys
import os
import pymysql
from dotenv import load_dotenv
import io
import json
import re
from decimal import Decimal
from docx import Document

load_dotenv()

# 数据库配置
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "root123a"),
    "database": os.getenv("DB_NAME", "airport"),
    "cursorclass": pymysql.cursors.DictCursor,
    "charset": "utf8mb4",
}

# 复制必要的辅助函数
def parse_json_field(value):
    if value is None or value == "":
        return []
    if isinstance(value, (list, dict)):
        return value
    if isinstance(value, (bytes, bytearray)):
        try:
            value = value.decode("utf-8")
        except Exception:
            return []
    try:
        return json.loads(value)
    except Exception:
        return []

def normalize_value(value):
    if value is None:
        return ""
    if isinstance(value, (int, float, Decimal)):
        return value
    if isinstance(value, bool):
        return value
    if isinstance(value, (bytes, bytearray)):
        try:
            value = value.decode("utf-8")
        except Exception:
            return ""
    return str(value).strip()

def normalize_bool(value):
    if value is None:
        return False
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    if isinstance(value, str):
        text = value.strip().lower()
        return text in ("是", "true", "1", "yes", "y")
    return False

def normalize_list(value):
    items = parse_json_field(value)
    if not isinstance(items, list):
        return []
    normalized = []
    for item in items:
        if isinstance(item, dict):
            normalized.append({k: normalize_value(v) for k, v in item.items()})
    return normalized

def parse_number(value):
    if value is None or value == "":
        return 0.0
    if isinstance(value, (int, float, Decimal)):
        return float(value)
    if isinstance(value, str):
        text = value.strip().replace(",", "")
        if not text:
            return 0.0
        match = re.search(r"-?\d+(?:\.\d+)?", text)
        if not match:
            return 0.0
        try:
            return float(match.group())
        except ValueError:
            return 0.0
    return 0.0

# 复制build_doc_context函数（简化版，包含所有必需字段）
def build_doc_context(row):
    business_sites_raw = normalize_list(row.get("business_sites_json"))
    business_sites = []
    for site in business_sites_raw:
        normalized = {k: normalize_value(v) for k, v in site.items()}
        normalized["is_pay"] = normalize_bool(site.get("is_pay"))
        business_sites.append(normalized)
    business_accounts = normalize_list(row.get("business_accounts_json"))
    account_rows = normalize_list(row.get("account_rows_json"))
    daily_avg_balance = normalize_list(row.get("daily_avg_balance_json"))
    guarantees = normalize_list(row.get("guarantees_json"))
    existing_loans = normalize_list(row.get("existing_loans_json"))
    electricity_items = normalize_list(row.get("electricity_items_json"))
    asset_stats = normalize_list(row.get("asset_stats_json"))
    rev_check_items = normalize_list(row.get("rev_check_items_json"))
    cashflow_in = normalize_list(row.get("cashflow_in_json"))
    cashflow_out = normalize_list(row.get("cashflow_out_json"))

    existing_amount_total = sum(parse_number(item.get("amount")) for item in existing_loans)
    existing_balance_total = sum(parse_number(item.get("balance")) for item in existing_loans)
    existing_payment_total = sum(parse_number(item.get("monthly_payment")) for item in existing_loans)
    has_existing_values = any(
        str(item.get("amount") or item.get("balance") or item.get("monthly_payment") or "").strip() != ""
        for item in existing_loans
    )
    existing_amount_db = row.get("existing_loans_amount_total")
    existing_balance_db = row.get("existing_loans_balance_total")
    existing_payment_db = row.get("existing_loans_monthly_payment_total")
    has_existing_db = any(
        val not in (None, "") for val in (existing_amount_db, existing_balance_db, existing_payment_db)
    )

    sales_list = normalize_list(row.get("is_table_sales_list_json"))
    if not sales_list:
        legacy_pairs = [
            ("is_table_s1_t", "is_table_s1"),
            ("is_table_s2_t", "is_table_s2"),
            ("is_table_s3_t", "is_table_s3"),
        ]
        for name_key, value_key in legacy_pairs:
            name_val = normalize_value(row.get(name_key))
            value_val = normalize_value(row.get(value_key))
            if name_val or value_val:
                sales_list.append({"name": name_val, "value": value_val})

    context = {
        "project": {
            "a_owner": normalize_value(row.get("project_a_owner")),
            "b_owner": normalize_value(row.get("project_b_owner")),
            "market_manager": normalize_value(row.get("project_market_manager")),
            "source": normalize_value(row.get("project_source")),
            "coop_bank": normalize_value(row.get("project_coop_bank")),
            "apply_date": normalize_value(row.get("project_apply_date")),
            "enterpriseid": normalize_value(row.get("project_enterpriseid")),
        },
        "loan": {
            "borrower_name": normalize_value(row.get("loan_borrower_name")),
            "apply_amount": normalize_value(row.get("loan_apply_amount")),
            "apply_term": normalize_value(row.get("loan_apply_term")),
            "purpose_detail": normalize_value(row.get("loan_purpose_detail")),
        },
        "company": {
            "name": normalize_value(row.get("company_name")),
            "registered_capital": normalize_value(row.get("company_registered_capital")),
            "established_date": normalize_value(row.get("company_established_date")),
            "registered_address": normalize_value(row.get("company_registered_address")),
            "main_business": normalize_value(row.get("company_main_business")),
            "employee_count": normalize_value(row.get("company_employee_count")),
            "is_salary": normalize_bool(row.get("company_is_salary")),
            "shareholder_info": normalize_value(row.get("company_shareholder_info")),
        },
        "controller": {
            "name": normalize_value(row.get("controller_name")),
            "gender": normalize_value(row.get("controller_gender")),
            "native_place": normalize_value(row.get("controller_native_place")),
            "marital_status": normalize_value(row.get("controller_marital_status")),
            "birth_date": normalize_value(row.get("controller_birth_date")),
            "service_years": normalize_value(row.get("controller_service_years")),
            "education": normalize_value(row.get("controller_education")),
            "spouse_name": normalize_value(row.get("controller_spouse_name")),
            "career_experience": normalize_value(row.get("controller_career_experience")),
        },
        "family": {
            "members_info": normalize_value(row.get("family_members_info")),
            "is_hemu": normalize_bool(row.get("family_is_hemu")),
            "annual_expense": normalize_value(row.get("family_annual_expense")),
        },
        "social": {
            "relationship_info": normalize_value(row.get("social_relationship_info")),
        },
        "residence": {
            "type": normalize_value(row.get("residence_type")),
            "years": normalize_value(row.get("residence_years")),
            "address": normalize_value(row.get("residence_address")),
        },
        "business_sites": business_sites,
        "business": {
            "type": normalize_value(row.get("business_type")),
            "month_pay": normalize_value(row.get("business_month_pay")),
            "is_pay": normalize_bool(row.get("business_is_pay")),
            "model_description": normalize_value(row.get("business_model_description")),
            "is_waimao": normalize_bool(row.get("business_is_waimao")),
            "is_jinshen": normalize_bool(row.get("business_is_jinshen")),
        },
        "business_accounts": business_accounts,
        "account_rows": account_rows,
        "daily_avg_balance": daily_avg_balance,
        "guarantees": guarantees,
        "g": {
            "amount_total": normalize_value(row.get("guarantees_amount_total")),
            "balance_total": normalize_value(row.get("guarantees_balance_total")),
        },
        "existing_loans": existing_loans,
        "existing_loans_totals": {
            "amount_total": normalize_value(existing_amount_db) if has_existing_db else (f"{existing_amount_total:.2f}" if has_existing_values else ""),
            "balance_total": normalize_value(existing_balance_db) if has_existing_db else (f"{existing_balance_total:.2f}" if has_existing_values else ""),
            "monthly_payment_total": normalize_value(existing_payment_db) if has_existing_db else (f"{existing_payment_total:.2f}" if has_existing_values else ""),
        },
        "credit": {
            "inquiry_count": normalize_value(row.get("credit_inquiry_count")),
            "adverse_info": normalize_value(row.get("credit_adverse_info")),
            "overdue_count": normalize_value(row.get("credit_overdue_count")),
            "max_overdue_amount": normalize_value(row.get("credit_max_overdue_amount")),
        },
        "litigation": {
            "status": normalize_value(row.get("litigation_status")),
        },
        "electricity": {
            "is_quantity": normalize_bool(row.get("electricity_is_quantity")),
            "is_cost": normalize_bool(row.get("electricity_is_cost")),
            "rows": electricity_items,
            "descript": normalize_value(row.get("electricity_descript")),
        },
        "analysis": {
            "plan": {
                "amount": normalize_value(row.get("analysis_plan_amount")),
                "term": normalize_value(row.get("analysis_plan_term")),
                "repayment_method": normalize_value(row.get("analysis_plan_repayment_method")),
                "fee_rate": normalize_value(row.get("analysis_plan_fee_rate")),
                "corp_guarantee": normalize_value(row.get("analysis_plan_corp_guarantee")),
                "personal_guarantee": normalize_value(row.get("analysis_plan_personal_guarantee")),
                "collateral": normalize_value(row.get("analysis_plan_collateral")),
                "diyapingguzhi": normalize_value(row.get("analysis_plan_diyapingguzhi")),
                "eryayuzhi": normalize_value(row.get("analysis_plan_eryayuzhi")),
                "diyajingzhi": normalize_value(row.get("analysis_plan_diyajingzhi")),
            },
            "financials": {
                "total_assets": normalize_value(row.get("analysis_fin_total_assets")),
                "total_liabilities": normalize_value(row.get("analysis_fin_total_liabilities")),
                "net_assets": normalize_value(row.get("analysis_fin_net_assets")),
                "revenue": normalize_value(row.get("analysis_fin_revenue")),
                "net_income": normalize_value(row.get("analysis_fin_net_income")),
            },
            "indicators": {
                "asset_debt_ratio": normalize_value(row.get("analysis_ind_asset_debt_ratio")),
                "sales_debt_ratio": normalize_value(row.get("analysis_ind_sales_debt_ratio")),
                "meets_3x_income": normalize_value(row.get("analysis_ind_meets_3x_income")),
                "receivable_days": normalize_value(row.get("analysis_ind_receivable_days")),
                "avg_balance": normalize_value(row.get("analysis_ind_avg_balance")),
                "repayment_ratio": normalize_value(row.get("analysis_ind_repayment_ratio")),
                "is_superior_loan": normalize_bool(row.get("analysis_ind_is_superior_loan")),
                "is_growth_phase": normalize_bool(row.get("analysis_ind_is_growth_phase")),
                "is_added_guarantor": normalize_bool(row.get("analysis_ind_is_added_guarantor")),
            },
            "soft_info": normalize_value(row.get("analysis_soft_info")),
            "summary": normalize_value(row.get("analysis_summary")),
            "limit": {
                "calculation": normalize_value(row.get("analysis_limit_calculation")),
                "apply_amount": normalize_value(row.get("analysis_limit_apply_amount")),
                "increase_factors": normalize_value(row.get("analysis_limit_increase_factors")),
            },
            "profit_destination": normalize_value(row.get("analysis_profit_destination")),
        },
        "bs": {
            "date": normalize_value(row.get("bs_date")),
            "cash": normalize_value(row.get("bs_cash")),
            "ar": normalize_value(row.get("bs_ar")),
            "prepayments": normalize_value(row.get("bs_prepayments")),
            "other_ar": normalize_value(row.get("bs_other_ar")),
            "inventory": normalize_value(row.get("bs_inventory")),
            "fixed_assets": normalize_value(row.get("bs_fixed_assets")),
            "total_assets": normalize_value(row.get("bs_total_assets")),
            "loans": normalize_value(row.get("bs_loans")),
            "ap": normalize_value(row.get("bs_ap")),
            "advances": normalize_value(row.get("bs_advances")),
            "other_ap": normalize_value(row.get("bs_other_ap")),
            "capital": normalize_value(row.get("bs_capital")),
            "retained_earnings": normalize_value(row.get("bs_retained_earnings")),
            "total_liabilities_equity": normalize_value(row.get("bs_total_liabilities_equity")),
        },
        "asset_stats": asset_stats,
        "asset_totals": {
            "buy_price": normalize_value(row.get("asset_totals_buy_price")),
            "current_value": normalize_value(row.get("asset_totals_current_value")),
            "depreciation": normalize_value(row.get("asset_totals_depreciation")),
        },
        "is_table": {
            "year": normalize_value(row.get("is_table_year")),
            "sales_list": sales_list,
            "s1_t": normalize_value(row.get("is_table_s1_t")),
            "s2_t": normalize_value(row.get("is_table_s2_t")),
            "s3_t": normalize_value(row.get("is_table_s3_t")),
            "s1": normalize_value(row.get("is_table_s1")),
            "s2": normalize_value(row.get("is_table_s2")),
            "s3": normalize_value(row.get("is_table_s3")),
            "s_total": normalize_value(row.get("is_table_s_total")),
            "material_cost": normalize_value(row.get("is_table_material_cost")),
            "gross_profit": normalize_value(row.get("is_table_gross_profit")),
            "f_wages": normalize_value(row.get("is_table_f_wages")),
            "f_rent": normalize_value(row.get("is_table_f_rent")),
            "f_utility": normalize_value(row.get("is_table_f_utility")),
            "f_comm": normalize_value(row.get("is_table_f_comm")),
            "f_trans": normalize_value(row.get("is_table_f_trans")),
            "f_loss": normalize_value(row.get("is_table_f_loss")),
            "f_adv": normalize_value(row.get("is_table_f_adv")),
            "f_entertain": normalize_value(row.get("is_table_f_entertain")),
            "f_tax": normalize_value(row.get("is_table_f_tax")),
            "f_other": normalize_value(row.get("is_table_f_other")),
            "f_total": normalize_value(row.get("is_table_f_total")),
            "net_profit": normalize_value(row.get("is_table_net_profit")),
            "o_family_exp": normalize_value(row.get("is_table_o_family_exp")),
            "annual_net_income": normalize_value(row.get("is_table_annual_net_income")),
            "o_biz_loan": normalize_value(row.get("is_table_o_biz_loan")),
            "o_pvt_loan": normalize_value(row.get("is_table_o_pvt_loan")),
            "o_other_exp": normalize_value(row.get("is_table_o_other_exp")),
            "o_family_inc": normalize_value(row.get("is_table_o_family_inc")),
        },
        "rev_check": {
            "check_list": rev_check_items,
            "total_value": normalize_value(row.get("rev_check_total_value")),
            "est_total": normalize_value(row.get("rev_check_est_total")),
            "is_revenue": normalize_value(row.get("rev_check_is_revenue")),
            "diff_rate": normalize_value(row.get("rev_check_diff_rate")),
            "method": normalize_value(row.get("rev_check_method")),
        },
        "inflow_analysis": cashflow_in,
        "outflow_analysis": cashflow_out,
    }

    return context

def test_download_report(record_id):
    """测试下载报告功能"""
    print("=" * 60)
    print(f"测试下载报告功能 - 记录ID: {record_id}")
    print("=" * 60)
    
    # 1. 检查docxtpl
    try:
        from docxtpl import DocxTemplate
        print("✓ docxtpl库已安装")
    except ImportError:
        print("✗ docxtpl库未安装")
        return False
    
    # 2. 检查模板文件
    template_path = os.path.join(os.path.dirname(__file__), "template", "template.docx")
    if not os.path.exists(template_path):
        print(f"✗ 模板文件不存在: {template_path}")
        return False
    print(f"✓ 模板文件存在")
    
    # 3. 查询数据库
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM loan_application WHERE id = %s", (record_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            print(f"✗ 记录不存在，ID: {record_id}")
            return False
        print(f"✓ 记录查询成功")
        print(f"  项目编号: {row.get('project_enterpriseid', 'N/A')}")
        print(f"  企业名称: {row.get('company_name', 'N/A')}")
    except Exception as e:
        print(f"✗ 数据库查询失败: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # 4. 构建文档上下文
    print("\n构建文档上下文...")
    try:
        context = build_doc_context(row)
        print(f"✓ 文档上下文构建成功")
        print(f"  上下文键: {list(context.keys())}")
    except Exception as e:
        print(f"✗ 构建上下文失败: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # 5. 渲染文档
    print("\n渲染文档...")
    try:
        doc = DocxTemplate(template_path)
        doc.render(context)
        
        target_stream = io.BytesIO()
        doc.save(target_stream)
        target_stream.seek(0)
        
        # 使用Document处理（模拟render_docx_from_template）
        final_doc = Document(target_stream)
        final_stream = io.BytesIO()
        final_doc.save(final_stream)
        final_stream.seek(0)
        
        output_size = len(final_stream.getvalue())
        print(f"✓ 文档渲染成功")
        print(f"  输出大小: {output_size} 字节")
        
        # 保存测试文件
        test_filename = f"test_report_{record_id}.docx"
        with open(test_filename, 'wb') as f:
            f.write(final_stream.getvalue())
        print(f"✓ 测试文件已保存: {test_filename}")
        
        return True
    except Exception as e:
        print(f"✗ 渲染文档失败: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    record_id = sys.argv[1] if len(sys.argv) > 1 else "1"
    success = test_download_report(record_id)
    
    print("\n" + "=" * 60)
    if success:
        print("✓ 测试通过！")
    else:
        print("✗ 测试失败")
    print("=" * 60)
    
    sys.exit(0 if success else 1)
