#!/usr/bin/env python3
"""
最终测试：验证数据库配置是否正确加载
"""
import os
from dotenv import load_dotenv
import pymysql

# 加载.env文件
load_dotenv()

# 读取配置
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "root"),
    "database": os.getenv("DB_NAME", "airport"),
    "cursorclass": pymysql.cursors.DictCursor,
    "charset": "utf8mb4",
}

print("="*60)
print("检查.env配置加载")
print("="*60)
print(f"DB_HOST: {DB_CONFIG['host']}")
print(f"DB_PORT: {DB_CONFIG['port']}")
print(f"DB_USER: {DB_CONFIG['user']}")
print(f"DB_PASSWORD: {'*' * len(DB_CONFIG['password']) if DB_CONFIG['password'] else '(空)'}")
print(f"DB_NAME: {DB_CONFIG['database']}")

print("\n" + "="*60)
print("测试数据库连接")
print("="*60)

try:
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) as count FROM users")
        count = cursor.fetchone()['count']
        print(f"✅ 连接成功! users表中有 {count} 个用户")
    conn.close()
except Exception as e:
    print(f"❌ 连接失败: {e}")
