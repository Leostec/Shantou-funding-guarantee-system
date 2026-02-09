<template>
  <div class="admin-page">
    <div class="header">
      <div>
        <h2>管理员面板</h2>
        <p class="subtitle">筛选与查看全局报告</p>
      </div>
      <a-button type="primary" danger @click="logout">退出登录</a-button>
    </div>

    <div class="card filter-card">
      <div class="filter-grid">
        <div class="filter-item">
          <label>开始时间</label>
          <input type="date" v-model="startDate" @input="fetchTableDataWithSearch" />
        </div>
        <div class="filter-item">
          <label>结束时间</label>
          <input type="date" v-model="endDate" @input="fetchTableDataWithSearch" />
        </div>
        <div class="filter-item">
          <label>借贷周期</label>
          <input type="text" v-model="searchTime" @input="fetchTableDataWithSearch" placeholder="如 12" />
        </div>
        <div class="filter-item">
          <label>企业名称</label>
          <input type="text" v-model="searchName" @input="fetchTableDataWithSearch" placeholder="模糊查询" />
        </div>
        <div class="filter-item">
          <label>报告编号</label>
          <input type="text" v-model="searchReportNumber" @input="fetchTableDataWithSearch" placeholder="模糊查询" />
        </div>
        <div class="filter-item">
          <label>上传负责人</label>
          <input type="text" v-model="searchUserName" @input="fetchTableDataWithSearch" placeholder="模糊查询" />
        </div>
      </div>
    </div>

    <div class="card stats-card">
      <div class="stat">
        <div class="stat-label">未通过</div>
        <div class="stat-value pink">{{ countZero }}</div>
      </div>
      <div class="stat">
        <div class="stat-label">≤ 30</div>
        <div class="stat-value green">{{ countLessThanOrEqual300 }}</div>
      </div>
      <div class="stat">
        <div class="stat-label">&gt; 30</div>
        <div class="stat-value blue">{{ countGreater300 }}</div>
      </div>
    </div>

    <div class="card table-card">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :scroll="{ x:'max-content', y: 480 }"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'report_number'">
            <a class="custom-link" @click="viewZcpgData(record.report_number)">
              {{ record.report_number }}
            </a>
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDateTime(record.created_at) }}
          </template>
          <template v-else>
            {{ record[column.key] }}
          </template>
        </template>
        <template #headerCell="{ column }">
          <span class="th-bold">{{ column.title }}</span>
        </template>
      </a-table>
    </div>

    <div class="card table-card">
      <div class="card-header">
        <div>
          <h3>部门管理</h3>
          <p class="subtitle">查看和维护部门与负责人</p>
        </div>
        <a-button type="primary" @click="openDeptModal('create')">新建部门</a-button>
      </div>
      <a-table
        :columns="deptColumns"
        :data-source="departments"
        :pagination="{ pageSize: 10 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="openDeptModal('edit', record)">编辑</a-button>
              <a-popconfirm
                title="确认删除该部门？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="() => deleteDept(record)"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDateTime(record.created_at) }}
          </template>
          <template v-else-if="column.key === 'manager_id'">
            {{ userMap[record.manager_id] || record.manager_id }}
          </template>
          <template v-else>
            {{ record[column.key] }}
          </template>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model:visible="deptModalVisible"
      :title="deptMode === 'edit' ? '编辑部门' : '新建部门'"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="deptSaving"
      @ok="submitDept"
    >
      <a-form layout="vertical">
        <a-form-item label="部门名称">
          <a-input v-model:value="deptForm.name" placeholder="请输入部门名称" />
        </a-form-item>
        <a-form-item label="负责人">
          <a-select
            v-model:value="deptForm.manager_id"
            show-search
            :options="userOptions"
            option-filter-prop="label"
            placeholder="请选择负责人"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <div class="card table-card">
      <div class="card-header">
        <div>
          <h3>员工管理</h3>
          <p class="subtitle">按部门查看员工账号与角色</p>
        </div>
        <div class="actions">
          <a-select
            v-model:value="selectedDeptForUsers"
            placeholder="选择部门筛选"
            style="width: 200px"
            allow-clear
            :options="[
              { label: '全部部门', value: null },
              ...departments.map(d => ({ label: d.name, value: d.id }))
            ]"
            @change="fetchEmployees"
          />
          <a-button type="link" @click="fetchEmployees" :loading="employeesLoading">刷新</a-button>
        </div>
      </div>
      <a-table
        :columns="userColumns"
        :data-source="employees"
        :loading="employeesLoading"
        :pagination="{ pageSize: 10 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="openEmployeeModal(record)">编辑</a-button>
              <a-popconfirm
                title="确认删除该员工吗？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="() => deleteEmployee(record)"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDateTime(record.created_at) }}
          </template>
          <template v-else>
            {{ record[column.key] }}
          </template>
        </template>
      </a-table>
    </div>
    <a-modal
      v-model:visible="employeeModalVisible"
      title="编辑员工"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="employeeSaving"
      @ok="submitEmployee"
    >
      <a-form layout="vertical">
        <a-form-item label="用户名">
          <a-input v-model:value="employeeForm.username" disabled />
        </a-form-item>
        <a-form-item label="所属部门">
          <a-select
            v-model:value="employeeForm.department_id"
            :options="departments.map(d => ({ label: d.name, value: d.id }))"
            placeholder="请选择部门"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="重置密码（可选）">
          <a-input-password v-model:value="employeeForm.password" placeholder="留空则不修改密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { message } from "ant-design-vue";

const tableData = ref([]);
const departments = ref([]);
const employees = ref([]);
const searchName = ref("");
const searchReportNumber = ref("");
const searchUserName = ref("");
const startDate = ref("");
const endDate = ref("");
const searchTime = ref("");
const deptModalVisible = ref(false);
const deptSaving = ref(false);
const deptForm = ref({ id: null, name: "", manager_id: null });
const deptMode = ref("create");
const userOptions = ref([]);
const selectedDeptForUsers = ref(null);
const employeesLoading = ref(false);
const employeeModalVisible = ref(false);
const employeeSaving = ref(false);
const employeeForm = ref({ id: null, username: "", department_id: null, password: "" });
const router = useRouter();
const countZero = ref(0);
const countLessThanOrEqual300 = ref(0);
const countGreater300 = ref(0);

const columns = [
  { title: "企业编号", dataIndex: "report_number", key: "report_number" },
  { title: "企业名称", dataIndex: "company_name", key: "company_name" },
  { title: "上传日期", dataIndex: "created_at", key: "created_at" },
  { title: "借贷周期", dataIndex: "application_period", key: "application_period" },
  { title: "上传负责人", dataIndex: "project_manager", key: "project_manager" },
  { title: "预测结果(万元)", dataIndex: "predicted", key: "predicted" },
];

async function fetchTableDataWithSearch() {
  try {
    const response = await axios.get(
      `http://localhost:8989/xmlb?searchName=${encodeURIComponent(
        searchName.value
      )}&searchReportNumber=${encodeURIComponent(
        searchReportNumber.value
      )}&searchUserName=${encodeURIComponent(
        searchUserName.value
      )}&startDate=${encodeURIComponent(
        startDate.value
      )}&endDate=${encodeURIComponent(
        endDate.value
      )}&searchTime=${encodeURIComponent(searchTime.value)}`
    );
    tableData.value = response.data;

    countZero.value = tableData.value.filter(
      (item) => Number(item.predicted) === 0
    ).length;
    countLessThanOrEqual300.value = tableData.value.filter(
      (item) => Number(item.predicted) <= 30
    ).length;
    countGreater300.value = tableData.value.filter(
      (item) => Number(item.predicted) > 30
    ).length;
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
}

const viewZcpgData = (reportNumber) => {
  router.push({ name: "Zcpg", params: { reportNumber } });
};

const formatDateTime = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleString("zh-CN", { hour12: false });
};

const deptColumns = [
  { title: "部门名称", dataIndex: "name", key: "name" },
  { title: "负责人", dataIndex: "manager_id", key: "manager_id" },
  { title: "创建时间", dataIndex: "created_at", key: "created_at" },
  { title: "操作", key: "actions" },
];

const userColumns = [
  { title: "用户名", dataIndex: "username", key: "username" },
  { title: "所属部门", dataIndex: "department_name", key: "department_name", customRender: ({ text }) => text || "未分配" },
  { title: "角色", dataIndex: "role", key: "role" },
  { title: "创建时间", dataIndex: "created_at", key: "created_at", customRender: ({ text }) => formatDateTime(text) },
  { title: "操作", key: "actions" },
];

const userMap = computed(() => {
  const map = {};
  userOptions.value.forEach((u) => {
    map[u.value] = u.label;
  });
  return map;
});

const fetchUsers = async () => {
  try {
    const resp = await axios.get("http://localhost:8989/users");
    userOptions.value = (resp.data || []).map((u) => ({
      label: u.username,
      value: u.id,
    }));
  } catch (e) {
    console.error("获取用户失败", e);
    message.error(e?.response?.data?.error || "获取用户失败");
  }
};

const fetchEmployees = async () => {
  employeesLoading.value = true;
  try {
    const resp = await axios.get("http://localhost:8989/users", {
      params: selectedDeptForUsers.value ? { department_id: selectedDeptForUsers.value } : {},
    });
    employees.value = resp.data || [];
  } catch (e) {
    console.error("获取员工失败", e);
    message.error(e?.response?.data?.error || "获取员工失败");
  } finally {
    employeesLoading.value = false;
  }
};

const openEmployeeModal = (record) => {
  if (!record) return;
  employeeForm.value = {
    id: record.id,
    username: record.username,
    department_id: record.department_id || null,
    password: "",
  };
  employeeModalVisible.value = true;
};

const submitEmployee = async () => {
  if (!employeeForm.value.id) {
    message.error("缺少用户ID");
    return;
  }
  employeeSaving.value = true;
  try {
    await axios.put(`http://localhost:8989/users/${employeeForm.value.id}`, {
      department_id: employeeForm.value.department_id,
      password: employeeForm.value.password ? employeeForm.value.password : undefined,
    });
    message.success("已更新员工信息");
    employeeModalVisible.value = false;
    employeeForm.value.password = "";
    await fetchEmployees();
  } catch (e) {
    console.error("更新员工失败", e);
    message.error(e?.response?.data?.error || "更新员工失败");
  } finally {
    employeeSaving.value = false;
  }
};

const deleteEmployee = async (record) => {
  if (!record?.id) return;
  try {
    await axios.delete(`http://localhost:8989/users/${record.id}`);
    message.success("已删除员工");
    await fetchEmployees();
  } catch (e) {
    console.error("删除员工失败", e);
    message.error(e?.response?.data?.error || "删除员工失败");
  }
};

const fetchDepartments = async () => {
  try {
    const resp = await axios.get("http://localhost:8989/departments");
    departments.value = resp.data || [];
  } catch (e) {
    console.error("获取部门失败", e);
    message.error(e?.response?.data?.error || "获取部门失败");
  }
};

const openDeptModal = (mode, record = null) => {
  deptMode.value = mode;
  if (mode === "edit" && record) {
    deptForm.value = { id: record.id, name: record.name, manager_id: record.manager_id };
  } else {
    deptForm.value = { id: null, name: "", manager_id: null };
  }
  deptModalVisible.value = true;
};

const submitDept = async () => {
  if (!deptForm.value.name || !deptForm.value.manager_id) {
    message.warning("请填写部门名称和负责人");
    return;
  }
  deptSaving.value = true;
  try {
    if (deptMode.value === "edit" && deptForm.value.id) {
      await axios.put(`http://localhost:8989/departments/${deptForm.value.id}`, {
        name: deptForm.value.name,
        manager_id: deptForm.value.manager_id,
      });
      message.success("部门已更新");
    } else {
      await axios.post("http://localhost:8989/departments", {
        name: deptForm.value.name,
        manager_id: deptForm.value.manager_id,
      });
      message.success("部门已创建");
    }
    deptModalVisible.value = false;
    await fetchDepartments();
  } catch (e) {
    console.error("保存部门失败", e);
    message.error(e?.response?.data?.error || "保存部门失败");
  } finally {
    deptSaving.value = false;
  }
};

const deleteDept = async (record) => {
  try {
    await axios.delete(`http://localhost:8989/departments/${record.id}`);
    message.success("部门已删除");
    await fetchDepartments();
  } catch (e) {
    console.error("删除部门失败", e);
    message.error(e?.response?.data?.error || "删除部门失败");
  }
};

const logout = () => {
  localStorage.removeItem("authRole");
  localStorage.removeItem("authToken");
  localStorage.removeItem("username");
  localStorage.removeItem("department_name");
  router.push("/");
};

onMounted(() => {
  fetchTableDataWithSearch();
  fetchDepartments();
  fetchUsers();
  fetchEmployees();
});
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
}
.subtitle {
  margin-top: 4px;
  color: #666;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
}
.filter-card {
  margin-top: 8px;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 16px;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filter-item input {
  padding: 8px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}
.stats-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.stat {
  padding: 12px;
  border-radius: 10px;
  background: #f7f9fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-label {
  color: #666;
}
.stat-value {
  font-size: 26px;
  font-weight: 700;
}
.pink { color: #e96d92; }
.green { color: #52c41a; }
.blue { color: #1890ff; }

.table-card {
  overflow: hidden;
}
.custom-link {
  color: #1677ff;
}
.custom-link:hover {
  text-decoration: underline;
}
.th-bold {
  font-weight: 700;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
</style>
