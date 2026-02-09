#!/usr/bin/env python3
"""
简化版测试 - 直接测试核心功能
"""
import sys
import os
import pymysql
from dotenv import load_dotenv
import io

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

def normalize_value(val):
    """标准化值"""
    if val is None:
        return ""
    if isinstance(val, (int, float)):
        return val
    return str(val).strip()

def normalize_bool(val):
    """标准化布尔值"""
    if val is None:
        return False
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val.lower() in ('是', 'true', '1', 'yes')
    return bool(val)

def normalize_list(val):
    """标准化列表"""
    if not val:
        return []
    if isinstance(val, str):
        try:
            import json
            return json.loads(val)
        except:
            return []
    if isinstance(val, list):
        return val
    return []

def test_download_report(record_id):
    """测试下载报告的核心功能"""
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
    print(f"✓ 模板文件存在: {template_path}")
    
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
    
    # 4. 测试构建简单的上下文（不导入整个app模块）
    print("\n测试构建文档上下文...")
    try:
        # 构建一个简化的上下文用于测试
        context = {
            "project": {
                "enterpriseid": normalize_value(row.get("project_enterpriseid")),
                "apply_date": normalize_value(row.get("project_apply_date")),
            },
            "company": {
                "name": normalize_value(row.get("company_name")),
            },
            "loan": {
                "apply_amount": normalize_value(row.get("loan_apply_amount")),
                "apply_term": normalize_value(row.get("loan_apply_term")),
            },
        }
        print("✓ 简化上下文构建成功")
    except Exception as e:
        print(f"✗ 构建上下文失败: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # 5. 测试渲染文档
    print("\n测试渲染文档...")
    try:
        doc = DocxTemplate(template_path)
        doc.render(context)
        
        target_stream = io.BytesIO()
        doc.save(target_stream)
        target_stream.seek(0)
        
        output_size = len(target_stream.getvalue())
        print(f"✓ 文档渲染成功")
        print(f"  输出大小: {output_size} 字节")
        
        # 保存测试文件
        test_filename = f"test_report_{record_id}.docx"
        with open(test_filename, 'wb') as f:
            f.write(target_stream.getvalue())
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
