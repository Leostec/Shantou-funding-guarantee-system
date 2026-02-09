#!/usr/bin/env python3
"""
测试字段映射函数
"""
import sys
import os

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 模拟数据库记录（前端发送的格式）
sample_db_record = {
    'id': 1,
    'project_enterpriseid': 'TEST001',
    'project_market_manager': '张三',
    'project_a_owner': '李四',
    'loan_apply_amount': 100.0,
    'loan_apply_term': 3,
    'loan_purpose_detail': '经营周转',
    'company_name': '测试公司',
    'company_main_business': '制造业',
    'company_employee_count': 50,
    'controller_name': '王五',
    'controller_gender': '男',
    'controller_education': '本科',
    'controller_marital_status': '已婚',
    'controller_service_years': 10,
    'residence_type': '自购',
    'residence_years': 5,
    'business_type': '制造业',
    'business_is_waimao': '否',
    'business_is_jinshen': '否',
    'business_month_pay': 5.0,
    'business_is_pay': '是',
    'analysis_fin_total_assets': 1000.0,
    'analysis_fin_total_liabilities': 500.0,
    'analysis_fin_net_assets': 500.0,
    'analysis_fin_revenue': 800.0,
    'analysis_fin_net_income': 100.0,
    'bs_cash': 100.0,
    'bs_ar': 200.0,
    'bs_inventory': 300.0,
    'bs_ap': 150.0,
    'bs_fixed_assets': 400.0,
    'analysis_ind_asset_debt_ratio': 50.0,
    'analysis_ind_sales_debt_ratio': 62.5,
    'analysis_ind_avg_balance': 50.0,
    'analysis_plan_repayment_method': 3.0,
    'is_table_annual_net_income': 120.0,
    'electricity_items_json': '[{"year": "2023", "total": 1000}]',
    'daily_avg_balance_json': '[{"year": "2023", "annual_avg": 50.0}]',
    'existing_loans_json': '[{"monthly_payment": 2.0}]',
}

def test_mapping():
    """测试字段映射"""
    # 导入映射函数
    from app import map_database_fields_to_model_fields
    
    print("="*60)
    print("测试字段映射函数")
    print("="*60)
    
    print("\n原始数据库记录（部分字段）:")
    for key in list(sample_db_record.keys())[:10]:
        print(f"  {key}: {sample_db_record[key]}")
    
    # 执行映射
    mapped_data = map_database_fields_to_model_fields(sample_db_record)
    
    print("\n映射后的数据（模型期望的字段）:")
    for key in sorted(mapped_data.keys()):
        print(f"  {key}: {mapped_data[key]}")
    
    # 检查必需的字段
    required_fields = [
        'application_amount', 'net_assets', 'total_assets', 'core_assets',
        'inventory_at_meeting', 'industry_experience', 'local_residence_years',
        'receivables_at_meeting', 'annual_sales', 'electricity_consumption',
        'total_liabilities', 'repayment_method'
    ]
    
    print("\n检查模型必需的字段:")
    missing_fields = []
    for field in required_fields:
        if field in mapped_data:
            print(f"  ✅ {field}: {mapped_data[field]}")
        else:
            print(f"  ❌ {field}: 缺失")
            missing_fields.append(field)
    
    if missing_fields:
        print(f"\n❌ 缺失字段: {', '.join(missing_fields)}")
        return False
    else:
        print("\n✅ 所有必需字段都已映射")
        return True

if __name__ == "__main__":
    try:
        success = test_mapping()
        if success:
            print("\n" + "="*60)
            print("✅ 字段映射测试通过")
            print("="*60)
        else:
            print("\n" + "="*60)
            print("❌ 字段映射测试失败")
            print("="*60)
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ 测试出错: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
