#!/usr/bin/env python3
"""
独立测试字段映射函数（不依赖Flask）
"""
import json
import logging

# 设置日志
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

def map_database_fields_to_model_fields(db_record: dict) -> dict:
    """
    将数据库字段名映射为模型期望的字段名
    """
    # 字段映射表：数据库字段名 -> 模型字段名
    field_mapping = {
        # 项目信息
        'project_enterpriseid': 'project_number',
        'project_market_manager': 'project_manager',
        'project_a_owner': 'project_manager',
        
        # 贷款信息
        'loan_apply_amount': 'application_amount',
        'loan_apply_term': 'application_period',
        'loan_purpose_detail': 'loan_purpose',
        'loan_borrower_name': 'borrower_name',
        
        # 公司信息
        'company_name': 'company_name',
        'company_main_business': 'main_business',
        'company_employee_count': 'employee_count',
        
        # 实控人信息
        'controller_name': 'controller_name',
        'controller_gender': 'controller_gender',
        'controller_education': 'education_level',
        'controller_marital_status': 'marital_status',
        'controller_service_years': 'industry_experience',
        'controller_career_experience': 'education_work_experience',
        'residence_type': 'residence_type',
        'residence_years': 'local_residence_years',
        
        # 经营信息
        'business_type': 'business_type',
        'business_model_description': 'business_model',
        'business_is_waimao': 'is_foreign_trade',
        'business_is_jinshen': 'is_cautious_industry',
        'business_month_pay': 'monthly_rent',
        
        # 财务信息
        'analysis_fin_total_assets': 'total_assets',
        'analysis_fin_total_liabilities': 'total_liabilities',
        'analysis_fin_net_assets': 'net_assets',
        'analysis_fin_revenue': 'annual_sales',
        'analysis_fin_net_income': 'annual_net_profit',
        
        # 资产负债表字段
        'bs_cash': 'cash_at_meeting',
        'bs_ar': 'receivables_at_meeting',
        'bs_inventory': 'inventory_at_meeting',
        'bs_ap': 'payables_at_meeting',
        
        # 指标
        'analysis_ind_asset_debt_ratio': 'asset_debt_ratio',
        'analysis_ind_sales_debt_ratio': 'sales_debt_ratio',
        'analysis_ind_avg_balance': 'monthly_balance',
        'analysis_plan_repayment_method': 'repayment_method',
    }
    
    mapped_data = {}
    
    # 直接映射的字段
    for db_field, model_field in field_mapping.items():
        if db_field in db_record and db_record[db_field] is not None:
            mapped_data[model_field] = db_record[db_field]
    
    # 特殊处理
    if 'project_manager' not in mapped_data:
        if db_record.get('project_market_manager'):
            mapped_data['project_manager'] = db_record['project_market_manager']
        elif db_record.get('project_a_owner'):
            mapped_data['project_manager'] = db_record['project_a_owner']
    
    # 计算核心资产
    if 'bs_fixed_assets' in db_record and 'bs_cash' in db_record:
        try:
            fixed_assets = float(db_record.get('bs_fixed_assets') or 0)
            cash = float(db_record.get('bs_cash') or 0)
            mapped_data['core_assets'] = fixed_assets + cash
        except:
            mapped_data['core_assets'] = 0
    
    # 计算用电量
    if 'electricity_items_json' in db_record and db_record['electricity_items_json']:
        try:
            if isinstance(db_record['electricity_items_json'], str):
                electricity_items = json.loads(db_record['electricity_items_json'])
            else:
                electricity_items = db_record['electricity_items_json']
            
            if isinstance(electricity_items, list) and len(electricity_items) > 0:
                total_consumption = 0
                for item in electricity_items:
                    if isinstance(item, dict) and 'total' in item:
                        try:
                            total_consumption += float(item['total'] or 0)
                        except:
                            pass
                mapped_data['electricity_consumption'] = total_consumption
        except:
            mapped_data['electricity_consumption'] = 0
    
    # 设置默认值
    required_fields = {
        'application_amount': 0, 'net_assets': 0, 'total_assets': 0, 'core_assets': 0,
        'inventory_at_meeting': 0, 'industry_experience': 0, 'local_residence_years': 0,
        'receivables_at_meeting': 0, 'annual_sales': 0, 'electricity_consumption': 0,
        'total_liabilities': 0, 'repayment_method': 0,
    }
    
    for field, default_value in required_fields.items():
        if field not in mapped_data or mapped_data[field] is None:
            mapped_data[field] = default_value
        try:
            mapped_data[field] = float(mapped_data[field])
        except:
            mapped_data[field] = default_value
    
    return mapped_data

# 测试
if __name__ == "__main__":
    sample_db_record = {
        'project_enterpriseid': 'TEST001',
        'loan_apply_amount': 100.0,
        'analysis_fin_total_assets': 1000.0,
        'analysis_fin_net_assets': 500.0,
        'bs_cash': 100.0,
        'bs_ar': 200.0,
        'bs_inventory': 300.0,
        'bs_fixed_assets': 400.0,
        'controller_service_years': 10,
        'residence_years': 5,
        'analysis_plan_repayment_method': 3.0,
        'electricity_items_json': '[{"year": "2023", "total": 1000}]',
    }
    
    print("测试字段映射...")
    mapped = map_database_fields_to_model_fields(sample_db_record)
    
    print("\n映射结果:")
    for key in sorted(mapped.keys()):
        print(f"  {key}: {mapped[key]}")
    
    required = ['application_amount', 'net_assets', 'total_assets', 'core_assets',
                'inventory_at_meeting', 'industry_experience', 'local_residence_years',
                'receivables_at_meeting', 'annual_sales', 'electricity_consumption',
                'total_liabilities', 'repayment_method']
    
    print("\n检查必需字段:")
    all_present = True
    for field in required:
        if field in mapped:
            print(f"  ✅ {field}")
        else:
            print(f"  ❌ {field} 缺失")
            all_present = False
    
    if all_present:
        print("\n✅ 所有必需字段都已映射")
    else:
        print("\n❌ 部分字段缺失")
