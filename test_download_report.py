#!/usr/bin/env python3
"""
测试下载报告功能
"""
import requests
import sys

def test_download_report(application_id):
    """测试下载报告接口"""
    url = "http://127.0.0.1:5001/download-report"
    params = {"id": application_id}
    
    print(f"测试下载报告功能...")
    print(f"请求URL: {url}")
    print(f"参数: {params}")
    print("-" * 50)
    
    try:
        response = requests.get(url, params=params, timeout=30)
        
        print(f"状态码: {response.status_code}")
        print(f"响应头 Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"响应头 Content-Disposition: {response.headers.get('Content-Disposition', 'N/A')}")
        
        if response.status_code == 200:
            # 检查是否是文件下载
            content_type = response.headers.get('Content-Type', '')
            if 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' in content_type:
                print("✓ 成功：收到Word文档文件")
                print(f"文件大小: {len(response.content)} 字节")
                
                # 保存文件用于验证
                filename = f"test_report_{application_id}.docx"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"✓ 文件已保存为: {filename}")
                return True
            else:
                print(f"✗ 错误：响应不是Word文档，Content-Type: {content_type}")
                print(f"响应内容: {response.text[:500]}")
                return False
        else:
            print(f"✗ 错误：请求失败，状态码: {response.status_code}")
            try:
                error_data = response.json()
                print(f"错误信息: {error_data}")
            except:
                print(f"响应内容: {response.text[:500]}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("✗ 错误：无法连接到服务器，请确保Flask应用正在运行")
        return False
    except requests.exceptions.Timeout:
        print("✗ 错误：请求超时")
        return False
    except Exception as e:
        print(f"✗ 错误：{type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # 从命令行参数获取ID，如果没有则使用默认值
    if len(sys.argv) > 1:
        test_id = sys.argv[1]
    else:
        # 使用之前查询到的ID
        test_id = "1"
    
    print(f"使用记录ID: {test_id}")
    print("=" * 50)
    
    success = test_download_report(test_id)
    
    print("=" * 50)
    if success:
        print("✓ 测试通过")
        sys.exit(0)
    else:
        print("✗ 测试失败")
        sys.exit(1)
