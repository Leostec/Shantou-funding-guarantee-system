<template>
    <div class="goods">
        <div class="header">
            <a-button @click="toggleChartView">Change</a-button>
        </div>
        <!-- 2.表格 -->
        <div v-if="!isChartView" class="wrapper">
            <el-table :data="tableData" style="width: 100%;" border>
                <el-table-column prop="pollutant_monitor_id" label="pollutant_monitor_id" width="158px" />
                <el-table-column prop="name_chinese" label="name_chinese" width="115" />
                <el-table-column prop="name_english" label="name_english" width="115" />
                <el-table-column prop="pollutants_classification" label="pollutants_classification" width="180" />
                <el-table-column prop="collection_time" label="collection_time" width="125" />
                <el-table-column prop="collection_site" label="collection_site" width="125" />
                <el-table-column prop="pollutant_content" label="pollutant_content" width="140" />
                <el-table-column prop="pollutant_content" label="pollutant_content" width="140" />
                <el-table-column prop="source" label="source" />
            </el-table>
        </div>
        <div v-if="isChartView" class="chart-container">
            <div class="chart-left">
                <PieChart />
            </div>
            <div class="chart-right">
                <BarChart />
            </div>
        </div>
        <!-- 3.分页  -->
        <div v-if="!isChartView" class="pagination">
            <el-pagination background layout="prev, pager, next" :total="6048" :page-size="pageSize"
                :current-page="currentPage" @current-change="handlePageChange">
            </el-pagination>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import PieChart from '../../components/pieChart.vue';
import BarChart from '../../components/barChart.vue';

const router = useRouter();
const input = ref('');
const tableData = ref([]);
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的记录数
const totalItems = ref(0); // 总记录数
const isChartView = ref(false); // 控制是否显示图表视图

const toggleChartView = () => {
    isChartView.value = !isChartView.value; // 切换图表视图的状态
};

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:8989/standard', {
            params: {
                page: currentPage.value,
                pageSize: pageSize.value
            }
        });
        tableData.value = response.data; // 表格数据
        totalItems.value = parseInt(response.headers['x-total-count'], 10); // 总记录数
    } catch (error) {
        console.error('There was an error!', error);
    }
};

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    fetchData();
};

onMounted(() => {
    fetchData();
});
</script>

<style lang="scss" scoped>
.goods {
    margin: 20px;
}

.header {
    display: flex;
    justify-content: flex-end;
    /* 使元素在容器末尾对齐 */
    align-items: center;
    /* 垂直居中对齐 */
}

.wrapper {
    // margin: 15px;
    margin-top: 10px;
    height: auto;
    width: 65rem;
}

.chart-container {
    display: flex;
}

.chart-left,
.chart-right {
    flex: 1;
    /* 每个容器占据一半的空间 */
}
</style>