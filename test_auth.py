#!/usr/bin/env python3
"""
测试注册和登录功能的脚本
"""
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:5001"

def test_register(username, password, department_id=None):
    """测试注册功能"""
    print(f"\n{'='*50}")
    print(f"测试注册: username={username}, department_id={department_id}")
    print(f"{'='*50}")
    
    url = f"{BASE_URL}/register"
    data = {
        "username": username,
        "password": password
    }
    if department_id is not None:
        data["department_id"] = department_id
    
    try:
        response = requests.post(url, json=data, timeout=5)
        print(f"状态码: {response.status_code}")
        print(f"响应头: {dict(response.headers)}")
        
        try:
            result = response.json()
            print(f"响应内容: {json.dumps(result, ensure_ascii=False, indent=2)}")
        except:
            print(f"响应文本: {response.text}")
        
        return response.status_code == 201, response
    except requests.exceptions.ConnectionError:
        print("❌ 错误: 无法连接到服务器，请确保后端服务正在运行")
        return False, None
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False, None

def test_login(username, password):
    """测试登录功能"""
    print(f"\n{'='*50}")
    print(f"测试登录: username={username}")
    print(f"{'='*50}")
    
    url = f"{BASE_URL}/login"
    data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(url, json=data, timeout=5)
        print(f"状态码: {response.status_code}")
        print(f"响应头: {dict(response.headers)}")
        
        try:
            result = response.json()
            print(f"响应内容: {json.dumps(result, ensure_ascii=False, indent=2)}")
        except:
            print(f"响应文本: {response.text}")
        
        return response.status_code == 200, response
    except requests.exceptions.ConnectionError:
        print("❌ 错误: 无法连接到服务器，请确保后端服务正在运行")
        return False, None
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False, None

def test_server_connection():
    """测试服务器连接"""
    print(f"\n{'='*50}")
    print("测试服务器连接")
    print(f"{'='*50}")
    
    try:
        response = requests.get(f"{BASE_URL}/auth-check", timeout=3)
        print(f"✅ 服务器连接正常 (状态码: {response.status_code})")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到服务器")
        print("   请确保:")
        print("   1. 后端服务正在运行 (python app.py)")
        print("   2. 服务运行在 http://127.0.0.1:5001")
        return False
    except Exception as e:
        print(f"⚠️  连接测试异常: {e}")
        return False

if __name__ == "__main__":
    print("="*50)
    print("注册和登录功能测试")
    print("="*50)
    
    # 测试服务器连接
    if not test_server_connection():
        print("\n❌ 服务器未运行，无法继续测试")
        sys.exit(1)
    
    # 测试注册（不带部门）
    test_username = "test_user_" + str(hash(str(sys.argv)) % 10000)
    test_password = "test123456"
    
    success, response = test_register(test_username, test_password)
    
    if success:
        print(f"\n✅ 注册成功!")
    else:
        print(f"\n❌ 注册失败!")
        if response:
            print(f"   错误信息: {response.text}")
    
    # 测试登录
    success, response = test_login(test_username, test_password)
    
    if success:
        print(f"\n✅ 登录成功!")
        if response:
            data = response.json()
            if 'token' in data:
                print(f"   获得令牌: {data['token'][:20]}...")
    else:
        print(f"\n❌ 登录失败!")
        if response:
            print(f"   错误信息: {response.text}")
    
    # 测试错误密码
    print("\n" + "="*50)
    print("测试错误密码")
    print("="*50)
    test_login(test_username, "wrong_password")
    
    print("\n" + "="*50)
    print("测试完成")
    print("="*50)
