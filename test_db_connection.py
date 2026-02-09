#!/usr/bin/env python3
"""
测试数据库连接的脚本
"""
import pymysql
import os
import sys

# 测试不同的数据库配置
configs_to_test = [
    {
        "name": "默认配置 (root/root)",
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "root",
        "database": "airport"
    },
    {
        "name": "空密码",
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "",
        "database": "airport"
    },
    {
        "name": "root123a (Node.js配置)",
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "root123a",
        "database": "airport"
    }
]

def test_connection(config):
    """测试数据库连接"""
    print(f"\n{'='*60}")
    print(f"测试配置: {config['name']}")
    print(f"  用户: {config['user']}")
    print(f"  密码: {'*' * len(config['password']) if config['password'] else '(空)'}")
    print(f"  数据库: {config['database']}")
    print(f"{'='*60}")
    
    try:
        conn = pymysql.connect(
            host=config['host'],
            port=config['port'],
            user=config['user'],
            password=config['password'],
            database=config['database'],
            cursorclass=pymysql.cursors.DictCursor,
            charset='utf8mb4'
        )
        
        with conn.cursor() as cursor:
            # 测试查询
            cursor.execute("SELECT 1 as test")
            result = cursor.fetchone()
            
            # 检查users表结构
            cursor.execute("SHOW COLUMNS FROM users")
            columns = cursor.fetchall()
            column_names = [col['Field'] for col in columns]
            
            print(f"✅ 连接成功!")
            print(f"   users表字段: {', '.join(column_names)}")
            
            # 检查是否有department_id字段
            if 'department_id' in column_names:
                print(f"   ✅ department_id字段存在")
            else:
                print(f"   ⚠️  department_id字段不存在")
            
            # 检查表中有多少用户
            cursor.execute("SELECT COUNT(*) as count FROM users")
            count = cursor.fetchone()['count']
            print(f"   当前用户数: {count}")
            
        conn.close()
        return True, config
        
    except pymysql.Error as e:
        error_code, error_msg = e.args
        print(f"❌ 连接失败: ({error_code}) {error_msg}")
        return False, None
    except Exception as e:
        print(f"❌ 未知错误: {e}")
        return False, None

if __name__ == "__main__":
    print("="*60)
    print("数据库连接诊断")
    print("="*60)
    
    success_config = None
    for config in configs_to_test:
        success, config_used = test_connection(config)
        if success:
            success_config = config_used
            break
    
    if success_config:
        print(f"\n{'='*60}")
        print("✅ 找到可用的数据库配置!")
        print(f"{'='*60}")
        print("\n请在.env文件中添加以下配置:")
        print(f"DB_HOST={success_config['host']}")
        print(f"DB_PORT={success_config['port']}")
        print(f"DB_USER={success_config['user']}")
        print(f"DB_PASSWORD={success_config['password']}")
        print(f"DB_NAME={success_config['database']}")
    else:
        print(f"\n{'='*60}")
        print("❌ 所有配置都失败了")
        print(f"{'='*60}")
        print("\n请检查:")
        print("1. MySQL服务是否正在运行")
        print("2. 数据库'airport'是否存在")
        print("3. 用户名和密码是否正确")
        print("\n你可以尝试手动连接MySQL:")
        print("  mysql -u root -p")
