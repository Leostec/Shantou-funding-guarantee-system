#!/usr/bin/env python3
"""
详细测试下载报告功能 - 直接调用函数测试
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import pymysql
from dotenv import load_dotenv

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

def test_database_connection():
    """测试数据库连接"""
    print("=" * 60)
    print("测试1: 数据库连接")
    print("=" * 60)
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM loan_application")
        result = cursor.fetchone()
        print(f"✓ 数据库连接成功")
        print(f"  记录总数: {result['count']}")
        conn.close()
        return True
    except Exception as e:
        print(f"✗ 数据库连接失败: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_query_record(record_id):
    """测试查询记录"""
    print("\n" + "=" * 60)
    print(f"测试2: 查询记录 ID={record_id}")
    print("=" * 60)
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM loan_application WHERE id = %s", (record_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            print(f"✓ 记录查询成功")
            print(f"  项目编号: {row.get('project_enterpriseid', 'N/A')}")
            print(f"  企业名称: {row.get('company_name', 'N/A')}")
            print(f"  记录字段数: {len(row)}")
            return row
        else:
            print(f"✗ 记录不存在，ID: {record_id}")
            return None
    except Exception as e:
        print(f"✗ 查询记录失败: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_build_doc_context(row):
    """测试构建文档上下文"""
    print("\n" + "=" * 60)
    print("测试3: 构建文档上下文")
    print("=" * 60)
    try:
        # 导入app模块中的函数
        from app import build_doc_context
        context = build_doc_context(row)
        print(f"✓ 文档上下文构建成功")
        print(f"  上下文键: {list(context.keys())}")
        return context
    except Exception as e:
        print(f"✗ 构建文档上下文失败: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_template_file():
    """测试模板文件"""
    print("\n" + "=" * 60)
    print("测试4: 检查模板文件")
    print("=" * 60)
    template_path = os.path.join(os.path.dirname(__file__), "template", "template.docx")
    if os.path.exists(template_path):
        size = os.path.getsize(template_path)
        print(f"✓ 模板文件存在")
        print(f"  路径: {template_path}")
        print(f"  大小: {size} 字节")
        return True
    else:
        print(f"✗ 模板文件不存在: {template_path}")
        return False

def test_docxtpl():
    """测试docxtpl库"""
    print("\n" + "=" * 60)
    print("测试5: 检查docxtpl库")
    print("=" * 60)
    try:
        from docxtpl import DocxTemplate
        print(f"✓ docxtpl库已安装")
        return True
    except ImportError:
        print(f"✗ docxtpl库未安装")
        print(f"  请运行: pip install python-docx-template")
        return False

def test_render_document(context):
    """测试渲染文档"""
    print("\n" + "=" * 60)
    print("测试6: 渲染文档")
    print("=" * 60)
    try:
        from app import render_docx_from_template
        template_path = os.path.join(os.path.dirname(__file__), "template", "template.docx")
        output_stream = render_docx_from_template(context, template_path)
        print(f"✓ 文档渲染成功")
        print(f"  输出流大小: {len(output_stream.getvalue())} 字节")
        return output_stream
    except Exception as e:
        print(f"✗ 渲染文档失败: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    print("\n" + "=" * 60)
    print("下载报告功能详细测试")
    print("=" * 60)
    
    # 测试1: 数据库连接
    if not test_database_connection():
        print("\n✗ 测试失败：无法连接数据库")
        return False
    
    # 测试2: 查询记录
    record_id = sys.argv[1] if len(sys.argv) > 1 else "1"
    row = test_query_record(record_id)
    if not row:
        print("\n✗ 测试失败：无法查询记录")
        return False
    
    # 测试3: 检查模板文件
    if not test_template_file():
        print("\n✗ 测试失败：模板文件不存在")
        return False
    
    # 测试4: 检查docxtpl
    if not test_docxtpl():
        print("\n✗ 测试失败：docxtpl未安装")
        return False
    
    # 测试5: 构建文档上下文
    context = test_build_doc_context(row)
    if not context:
        print("\n✗ 测试失败：无法构建文档上下文")
        return False
    
    # 测试6: 渲染文档
    output_stream = test_render_document(context)
    if not output_stream:
        print("\n✗ 测试失败：无法渲染文档")
        return False
    
    # 保存测试文件
    test_filename = f"test_report_output_{record_id}.docx"
    with open(test_filename, 'wb') as f:
        f.write(output_stream.getvalue())
    print(f"\n✓ 测试文件已保存: {test_filename}")
    
    print("\n" + "=" * 60)
    print("✓ 所有测试通过！")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
