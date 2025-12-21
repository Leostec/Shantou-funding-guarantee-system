from flask import Flask, request, jsonify, send_from_directory
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import numpy as np
from flask_cors import CORS
from datetime import datetime
import joblib
from sklearn.impute import SimpleImputer
from transformers import BertModel, BertTokenizer
import torch
import shap
import matplotlib.pyplot as plt
import os
from docx import Document
from openpyxl import Workbook
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import logging
from sklearn.preprocessing import StandardScaler
import json
from dotenv import load_dotenv
import pymysql
from werkzeug.security import generate_password_hash, check_password_hash

# Load environment variables
load_dotenv()
os.environ['OPENAI_API_KEY'] = os.getenv('DeepSeek_API_KEY')  # Set API key
# os.environ["OPENAI_API_BASE"] = 'https://api.deepseek.com'  # Set API base URL

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# matplotlib.use('Agg')  # Use Agg backend

app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "root"),
    "database": os.getenv("DB_NAME", "airport"),
    "cursorclass": pymysql.cursors.DictCursor,
    "charset": "utf8mb4",
}

# Create user table for authentication
def init_user_table():
    try:
        with pymysql.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(100) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        role VARCHAR(20) NOT NULL DEFAULT 'user',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) CHARACTER SET utf8mb4;
                    """
                )
                # 保证 password_hash 字段足够长，兼容 PBKDF2 哈希
                cursor.execute(
                    """
                    ALTER TABLE users
                    MODIFY password_hash VARCHAR(512) NOT NULL;
                    """
                )
            conn.commit()
        logger.info("User table is ready.")
    except Exception as e:
        logger.error(f"Failed to initialize users table: {e}")

def get_db_connection():
    """Return a new MySQL connection using shared config."""
    return pymysql.connect(**DB_CONFIG)

init_user_table()

# Configure static folder path for SHAP files
SHAP_DIR = r'C:\Users\liujiaming\Desktop\shantou\Shantou-funding-guarantee-system\shap_files'
if not os.path.exists(SHAP_DIR):
    os.makedirs(SHAP_DIR)

@app.route('/shap_files/<filename>')
def serve_shap_file(filename):
    return send_from_directory(SHAP_DIR, filename)
def convert_numpy_types(obj):
    if isinstance(obj, np.float32):
        return float(obj)
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    return obj

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({"message": "用户名和密码不能为空"}), 400
    if len(password) > 128:
        return jsonify({"message": "密码过长，请少于128字符"}), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
                if cursor.fetchone():
                    return jsonify({"message": "用户名已存在"}), 400

                # 使用 werkzeug PBKDF2-SHA256 生成哈希，避免 bcrypt 72 字节限制
                password_hash = generate_password_hash(password)
                cursor.execute(
                    "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)",
                    (username, password_hash, "user"),
                )
            conn.commit()
        return jsonify({"message": "注册成功", "role": "user"}), 201
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({"message": "注册失败"}), 500

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({"message": "用户名和密码不能为空"}), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT id, password_hash, role FROM users WHERE username = %s",
                    (username,),
                )
                user = cursor.fetchone()
        if not user or not check_password_hash(user["password_hash"], password):
            return jsonify({"message": "用户名或密码错误"}), 401

        return jsonify({"message": "登录成功", "role": user.get("role", "user")})
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"message": "登录失败"}), 500

class Robot:
    def __init__(self):
        # Initialize the large language model
        self.model = ChatOpenAI(model="deepseek-reasoner",base_url = "https://api.deepseek.com", temperature=0.2, max_tokens=8192)
        self.row = 0  # Process the first row of input data (single JSON input in this case)

    def qiye_data(self, dataset: dict) -> str:
        """
        Generate a detailed description of the enterprise data for credit assessment.
        :param dataset: Dictionary containing enterprise data
        :return: Formatted report string
        """

        def extract_features(dataset):
            data = {
                # Project basic information
                "项目编号": dataset.get("project_number", "无记录"),
                "企业名称": dataset.get("company_name", "无记录"),
                "项目经理": dataset.get("project_manager", "无记录"),
                "申请金额": f"{dataset.get('application_amount', 0)}万元",
                "申请期限": f"{dataset.get('application_period', 0)}年",
                "月还款方案": f"{dataset.get('repayment_method', 0)}万元",

                # Controller information
                "实控人性别": f"{dataset.get('controller_gender', 0)}（0=女，1=男）",
                "文化程度": dataset.get("education_level", "无记录"),
                "婚姻状态": f"{dataset.get('marital_status', 0)}（0=未婚，1=已婚）",
                "居住类型": f"{dataset.get('residence_type', 0)}（0=自购，1=租赁）",
                "本地居住": f"{dataset.get('local_residence_years', 0)}年",

                # Operational characteristics
                "主营业务": dataset.get("main_business", "无记录"),
                "所属行业": dataset.get("industry_category", "无记录"),
                "从业年限": f"{dataset.get('industry_experience', 0)}年",
                "外贸类型": f"{dataset.get('is_foreign_trade', 0)}（0=否，1=是）",
                "谨慎行业": f"{dataset.get('is_cautious_industry', 0)}（0=否，1=是）",
                "员工人数": dataset.get("employee_count", 0),
                "经营场所": f"{dataset.get('business_premises_type', 0)}（0=自有，1=租赁）",
                "月租金": f"{dataset.get('monthly_rent', 0)}万元",

                # Financial data
                "月均余额": f"{dataset.get('monthly_balance', 0)}万元",
                "日均余额": f"{dataset.get('daily_balance', 0)}万元",
                "货币资金": f"{dataset.get('cash_at_meeting', 0)}万元",
                "应收账款": f"{dataset.get('receivables_at_meeting', 0)}万元",
                "存货": f"{dataset.get('inventory_at_meeting', 0)}万元",
                "应付账款": f"{dataset.get('payables_at_meeting', 0)}万元",
                "总资产": f"{dataset.get('total_assets', 0)}万元",
                "总负债": f"{dataset.get('total_liabilities', 0)}万元",
                "净资产": f"{dataset.get('net_assets', 0)}万元",
                "年销售": f"{dataset.get('annual_sales', 0)}万元",
                "年净收益": f"{dataset.get('annual_net_profit', 0)}万元",
                "月净收益": f"{dataset.get('monthly_net_profit', 0)}万元",

                # Risk indicators
                "销售负债率": f"{dataset.get('sales_debt_ratio', 0)}%",
                "资产负债率": f"{dataset.get('asset_debt_ratio', 0)}%",
                "原还款额": f"{dataset.get('monthly_repayment', 0)}万元",
                "新增还款额": f"{dataset.get('total_monthly_repayment', 0)}万元",
                "收益还款比": dataset.get("repayment_income_ratio", 0),

                # Guarantee information
                "房产抵押": f"{dataset.get('property_mortgage', 0)}万元" if dataset.get('property_mortgage',
                                                                                        0) else "无",
                "设备抵押": f"{dataset.get('equipment_mortgage', 0)}万元" if dataset.get('equipment_mortgage',
                                                                                         0) else "无",
                "担保人": f"{dataset.get('additional_guarantor', 0)}（0=否，1=是）",
                "企业保证": f"{dataset.get('company_guarantee', 0)}（0=否，1=是）",
                "个人保证": f"{dataset.get('personal_guarantee', 0)}（0=否，1=是）",

                # Family and credit information
                "家庭和谐": f"{dataset.get('family_harmony', 0)}（1=是，0=否）",
                "未成年子女数": dataset.get("minor_children", 0),
                "成年家庭成员数": dataset.get("adult_family_members", 0),
                "家庭工作成员数": dataset.get("working_family_members", 0),
                "信用查询次数": dataset.get("credit_inquiries", 0),
                "逾期次数": dataset.get("overdue_times", 0),
                "最大逾期金额": dataset.get("max_overdue_amount", 0),
                "银行存入": dataset.get("bank_inflow", 0),
                "银行支出": dataset.get("bank_outflow", 0),
                "最高流入月": f"{dataset.get('highest_flow_month', 0)}",
                "最低流入月": f"{dataset.get('lowest_flow_month', 0)}",

                # Business stage and loan products
                "是否成长阶段": f"{dataset.get('is_growth_stage', 0)}（0=否，1=是）",
                "是否使用优贷宝": f"{dataset.get('used_youdaibao', 0)}（0=否，1=是）",

                # Text information
                "学习及工作经历": dataset.get("education_work_experience", "无记录"),
                "家庭成员及情况": dataset.get("family_social_relations", "无记录"),
                "商业模式": dataset.get("business_model", "无记录"),
                "反担保措施": dataset.get("counter_guarantee", "无记录"),
                "主营业务描述": dataset.get("main_business", "无记录"),
                "近三年利润去向": dataset.get("profit_usage", "无记录"),
                "其他软信息描述": dataset.get("other_soft_info", "无记录"),
                "贷款用途描述": dataset.get("loan_purpose", "无记录"),

                "预测结果": dataset.get('predicted', "无预测结果")
            }

            # Handle missing values
            for k, v in data.items():
                if pd.isna(v) or str(v) == 'nan':
                    data[k] = "无记录"

            return data

        def generate_report(data):
            template = f"""
            **企业信贷评估报告**

            一、基础信息
            项目编号：{data['项目编号']}
            企业名称：{data['企业名称']}（项目经理：{data['项目经理']})
            申请金额：{data['申请金额']}，期限：{data['申请期限']}
            还款方案：每月偿还本息 {data['月还款方案']}

            二、实控人背景
            1. 性别：{data['实控人性别']}
            2. 文化程度：{data['文化程度']}
            3. 婚姻状态：{data['婚姻状态']}
            4. 居住类型：{data['居住类型']}，本地居住 {data['本地居住']} 年

            三、经营状况
            1. 主营业务：{data['主营业务']}（所属行业：{data['所属行业']}）
            2. 从业年限：{data['从业年限']} 年
            3. 外贸类型：{data['外贸类型']}
            4. 谨慎行业：{data['谨慎行业']}
            5. 员工人数：{data['员工人数']} 人（不含家庭成员）
            6. 经营场所：{data['经营场所']}，月租金 {data['月租金']} 万元

            四、财务概况（单位：万元）
            1. 资金状况：
               - 月均余额：{data['月均余额']}
               - 日均余额：{data['日均余额']}
               - 货币资金：{data['货币资金']}
               - 应收账款：{data['应收账款']}
               - 存货：{data['存货']}
               - 应付账款：{data['应付账款']}

            2. 资产状况：
               - 总资产：{data['总资产']}
               - 总负债：{data['总负债']}
               - 净资产：{data['净资产']}
               - 年销售收入：{data['年销售']}
               - 年净收益：{data['年净收益']}
               - 月净收益：{data['月净收益']}

            五、风险指标
            1. 销售负债率：{data['销售负债率']}
            2. 资产负债率：{data['资产负债率']}
            3. 原贷款月还款额：{data['原还款额']}
            4. 新增月还款额：{data['新增还款额']}
            5. 收益还款比：{data['收益还款比']}

            六、担保措施
            1. 房产抵押：{data['房产抵押']}
            2. 设备抵押：{data['设备抵押']}
            3. 企业保证：{data['企业保证']}
            4. 个人保证：{data['个人保证']}
            5. 是否新增担保人：{data['担保人']}

            七、家庭和信用信息
            1. 家庭和谐：{data['家庭和谐']}
            2. 未成年子女数：{data['未成年子女数']}
            3. 成年家庭成员数：{data['成年家庭成员数']}
            4. 家庭工作成员数：{data['家庭工作成员数']}
            5. 信用查询次数：{data['信用查询次数']}
            6. 逾期次数：{data['逾期次数']}
            7. 最大逾期金额：{data['最大逾期金额']}
            8. 银行存入：{data['银行存入']}
            9. 银行支出：{data['银行支出']}
            10. 最高流入月份：{data['最高流入月']}
            11. 最低流入月份：{data['最低流入月']}

            八、企业发展阶段与贷款产品
            1. 是否成长阶段：{data['是否成长阶段']}
            2. 是否使用优贷宝：{data['是否使用优贷宝']}

            九、文本信息
            1. 学习及工作经历：{data['学习及工作经历']}
            2. 家庭成员及情况：{data['家庭成员及情况']}
            3. 商业模式：{data['商业模式']}
            4. 反担保措施：{data['反担保措施']}
            5. 主营业务描述：{data['主营业务描述']}
            6. 近三年利润去向：{data['近三年利润去向']}
            7. 其他软信息描述：{data['其他软信息描述']}
            8. 贷款用途描述：{data['贷款用途描述']}

            十、其他信息
            1. 预测结果：{data['预测结果']}
            """
            # Clean empty lines while preserving indentation
            return '\n'.join([line for line in template.split('\n') if line.strip()])

        features = extract_features(dataset)
        report = generate_report(features)
        features1 = pd.DataFrame([features])

        return report, features1

    def jingyan_tool(self, file_path: str) -> str:
        """
        Read historical experience from a Word document for reference in credit assessment.
        :param file_path: Path to the Word document
        :return: Text content of the document
        """
        try:
            doc = Document(file_path)
            text_content = "\n".join([para.text for para in doc.paragraphs])
            return text_content
        except Exception as e:
            return f"读取文档时出错: {e}"

    def pinggu_qiye(self, dataset: dict) -> str:
        """
        Predict enterprise credit assessment using machine learning models.
        :param dataset: Dictionary containing enterprise data
        :return: Predicted assessment result
        """
        # Convert dictionary to DataFrame
        dataset_df = pd.DataFrame([dataset])

        # Drop text columns not used in numerical prediction
        columns_to_drop = [
            '主营业务（填写文字信息）', '近三年利润去向描述', '其他软信息描述',
            '学习及工作经历', '家庭成员及情况', '商业模式', '反担保措施',
            '贷款用途描述', '项目结论'
        ]
        dataset_df.drop(columns=[col for col in columns_to_drop if col in dataset_df.columns], inplace=True)

        # Fill missing values with 0
        dataset_df = dataset_df.fillna(0)

        try:
            scaler_X = joblib.load('./scaler-model/scaler_X.pkl')
            scaler_y = joblib.load('./scaler-model/scaler_y.pkl')
            xgb_model = joblib.load('./scaler-model/best_model.pkl')
            scaler_X_binary = joblib.load('./scaler-model/scaler_X-binary.pkl')
            xgb_model_binary = joblib.load('./scaler-model/best_model-binary.pkl')
        except FileNotFoundError as e:
            logger.error(f"模型文件未找到: {e}")
            return f"模型文件未找到: {e}"
        except Exception as e:
            logger.error(f"加载模型时出错: {e}")
            return f"加载模型时出错: {e}"

        # Feature extraction using English column names
        X_new = dataset_df[[
            'application_amount', 'net_assets', 'total_assets', 'core_assets',
            'inventory_at_meeting', 'industry_experience',
            'local_residence_years', 'receivables_at_meeting', 'annual_sales',
            'electricity_consumption', 'total_liabilities', 'repayment_method'
        ]]

        # Now, translate the column names back to Chinese
        X_new.columns = [
            '申请金额', '净资产（万元）', '总资产（万元）', '核心资产（固定资产表+货币资金）（万元）',
            '上会时点存货（万元）', '借款人从业限（包括和当前从事行业相关的学习、打工期间）',
            '本地居住时间（年）', '上会时点应收账款（万元）', '年销售收入（万元）',
            '用电量', '总负债（万元）', '申请还款方案还款方式（月还本息之和。单位：万元）'
        ]

        # Scale the features for the binary model
        X_new_scaled_bi = scaler_X_binary.transform(X_new)
        pre_bi = xgb_model_binary.predict(X_new_scaled_bi)[0]

        if pre_bi == 1:
            # Scale the features for the regression model
            X_new_scaled = scaler_X.transform(X_new)
            predicted_tvbn = xgb_model.predict(X_new_scaled)
            predicted_tvbn = scaler_y.inverse_transform(predicted_tvbn.reshape(-1, 1))[0][0]
            return predicted_tvbn
        else:
            return pre_bi


@app.route('/demo', methods=['POST'])
def data_type():
    data = request.get_json()
    print(data)
    logger.info(f"Received data: {data}")

    robot = Robot()
    history_file = "./RAG/贷款评审要素_总结版.docx"

    # Load historical experience
    history_data = robot.jingyan_tool(history_file)

    # Generate enterprise data report
    qi_ye_data,dataset = robot.qiye_data(data)

    # Predict using machine learning models
    model_result = robot.pinggu_qiye(data)

    # Prepare prompt for LLM
    prompt = f"""                
                **系统角色：**
                ```
                您是一位经验丰富的中小微企业融资担保评估专家，擅长分析企业财务数据和描述信息，识别影响融资担保评估准确性的关键因素。
                ```
            你的任务是：

            1. 根据用户的问题，调用适当的工具（如RAG工具或API），提供最准确的企业资产预测和查询信息。若用户要进行融资担保评估，则首先要接收模型对该企业的融资担保评估的预测结果，还要根据企业的信息，和你的知识储备，
            以及下面给出的历史评估经验，综合给用户提意见，即是否向该企业贷款或贷款金额是否合适或还需要重点关注该企业的哪些问题。注意对于评估经验文本要仔细学习，按照每条的要求对输入的数据进行分析，将分析过程以及最终结果和结合模型给出的最终建议的评估金额全部输出，要求非常的详细。
            注意：机器学习模型给出的本笔贷款可申请金额的参考价值占到80%，要在预测结果的基础上，结合经验和相关知识等，判断是否批准这笔贷款担保申请。
            历史评估经验如下："{history_data}".  
            2. 在回答时：
                - 保持语气温和、友好，并提供有用的建议。
                - 请分步骤说明复杂的查询结果，必要时详细解释背景知识。
                - 确保答案简洁、清晰，但必要时可以详细解释背景知识。

            3. 处理特殊情况
                - 如果数据不可用或无法确定结果，请礼貌地告知用户原因，并建议用户提供更多信息（如具体企业ID）。
                - 如果用户输入的格式不正确，请友好地提醒并提供正确的输入格式。
            4. **应用总结经验进行新数据评估：**
    ·		•步骤：
                分析新企业的描述信息，聚焦与历史错误预测相关的特征。
                依次检索以往数据与经验文档，检查可参照的类似案例和核心特征组合。
                结合特征贡献度排名，若在特征间出现冲突则倾向依赖排名更高的特征做最终判定。
                做出结论：
    •		如果对模型预测完全认可，输出“建议批准本笔贷款担保申请”；
    •		如果无法确定或认为模型的预测结果有误，输出“建议暂缓本笔贷款担保申请”。

        
            **注意事项：**
            1. **逐步推理（思维链）：**
                - 在内部进行详细分析和推理，但最终回答中不展示这些步骤。
            2. **准确性和专业性：**
                - 完全依赖于历史数据中总结的规律和经验，避免主观猜测。
            3. **明确和绝对的结论：**
                - 结论应明确无误，避免使用模棱两可的语言。
            4. **提升模型准确率：**
                - 关注预测模型的86%准确率，因此要有百分百的把握给出结论，不怕思考时间长，要反复检查思考最后再得出结论。
            5. **重点挖掘误差原因：**
                - 深入分析导致预测错误的具体特征或特征组合，提出避免误差的建议。
        
        """
    # Prepare text for LLM based on model prediction
    if model_result == 0:
        text = f"""
                        新待判断数据：
                        预测模型认为该公司不予过会，该公司的数据如下：{qi_ye_data}。
                        注意：机器学习模型给出结果的可参考价值占到80%，要在预测结果的基础上，结合经验和相关知识等，判断是否批准这笔贷款担保申请。
                        “请按照给出的说明进行操作。一步一步地仔细分析所提供的数据（内部分析，不要暴露你的思维链），然后按照下列要求的格式提出你的最终结论。” 
                        **最终输出格式需要包含以下5点内容：**
                        ```
                        - 1.**该企业申请的评估金额：{dataset['申请金额'].values}万元 （样本中申请金额的值）
                                期限：{dataset['申请期限'].values}年   （样本中申请期限的值）
                                每月偿还本息： {dataset['月还款方案'].values}万元   （样本中申请还款方案还款方式（月还本息之和。单位：万元）的值）
                          （这部分根据输入的样本中内容输出）
                          **
                        - 2.**模型对该企业的评估资产的预测结果： {model_result}万元    ** （这部分根据给出的模型预测结果的值输出）
                        - 3.**通过学习到的经验对模型预测结果判断的最终结论：** [建议批准本笔贷款担保申请/ 建议暂缓本笔贷款担保申请]  （这部分根据判断的结果输出）
                        - 4. [若第三点最终评审结论为：‘建议批准本笔贷款担保申请’ 。则按照下列格式输出最终判断的结论，批准金额按照申请金额批准：]
                            ** 最终批准结果为：
                             - **批准金额： x万元
                             - **期限： x年
                             - **每月偿还本息： x 万元
                            （这部分根据判断的结果输出）
                            / [若最终评审结论为：‘建议暂缓本笔贷款担保申请’，则继续输出第五点内容]
                            ** 
                        - 5.**结论摘要：** 详细说明判断的依据和关键因素，并且给出详细建议和评审理由。
                        ```
                        """
    else:
                text = f"""
                新待判断数据：
                预测模型对该公司的预测结果如下： {model_result}万元，该公司的数据如下：{qi_ye_data}。
                注意：机器学习模型给出的本笔贷款可申请金额的参考价值占到80%，要在预测结果的基础上，结合经验和相关知识等，判断是否批准这笔贷款担保申请。
                “请按照给出的说明进行操作。一步一步地仔细分析所提供的数据（内部分析，不要暴露你的思维链），然后按照下列要求的格式提出你的最终结论。” 
                **最终输出格式需要包含以下5点内容：**
                ```
                - 1.**该企业申请的评估金额：{dataset['申请金额'].values}万元 （样本中申请金额的值）
                        期限：{dataset['申请期限'].values}年   （样本中申请期限的值）
                        每月偿还本息： {dataset['月还款方案'].values}万元   （样本中申请还款方案还款方式（月还本息之和。单位：万元）的值）
                  （这部分根据输入的样本中内容输出）
                  **
                - 2.**模型对该企业的评估资产的预测结果： {model_result}万元    ** （这部分根据给出的模型预测结果的值输出）
                - 3.**通过学习到的经验对模型预测结果判断的最终结论：** [建议批准本笔贷款担保申请/ 建议暂缓本笔贷款担保申请]  （这部分根据判断的结果输出）
                - 4. [若第三点最终评审结论为：‘建议批准本笔贷款担保申请’ 。则按照下列格式输出最终判断的结论，批准金额按照申请金额批准：]
                    ** 最终批准结果为：
                     - **批准金额： x万元
                     - **期限： x年
                     - **每月偿还本息： x 万元
                    （这部分根据判断的结果输出）
                    / [若最终评审结论为：‘建议暂缓本笔贷款担保申请’，则继续输出第五点内容]
                    ** 
                - 5.**结论摘要：** 详细说明判断的依据和关键因素，并且给出详细建议和评审理由。
                ```
                """

    # Call the large language model for final decision
    try:
        final_decision = robot.model.invoke([
        SystemMessage(content=prompt),
        HumanMessage(content=f"输入数据: {text}。")
    ])
        final_judgment = final_decision.content
        print(final_judgment)
    except Exception as e:
        logger.error(f"调用大模型时出错：{e}")
        final_judgment = "大模型评估失败"

    # Return the response
    response = {
    "模型预测金额": model_result,
    "大模型判断": final_judgment
    }
    response = convert_numpy_types(response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
