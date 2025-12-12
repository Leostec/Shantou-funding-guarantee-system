<template>
  <div class="standard">
    <div class="table">
      <a-table :columns="dynamicColumns" :data-source="tableData" :scroll="{ x: 3000 }" bordered>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
// import PieChart from '../../../components/pieChart.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isChartView = ref(false);
const tableData = ref([]);
const searchQuery = ref('');


const dynamicColumns = computed(() => {
  if (tableData.value.length > 0) {
    const firstItem = tableData.value[0];
    return Object.keys(firstItem).map(key => ({
      title: key,
      dataIndex: key,
      key: key,
    }));
  } else {
    return [];
  }
});

async function fetchTableDataWithSearch(page = 1) {
  try {
    const response = await axios.get('http://localhost:8989/hospital');
    console.log(searchQuery.value);
    tableData.value = response.data;
  } catch (error) {
    console.error('Error fetching table data:', error);
  }
}

onMounted(() => {
  fetchTableDataWithSearch();
});
</script>

<style lang="scss" scoped>
.search-container {
  margin: 20px;
}

.standard {
  margin: 20px;
  width: 100%;
}

.table {
  margin-top: 10px;
  height: auto;
  width: 80rem;
}

.chart-container {
  display: flex;
}

.chart-left,
.chart-right {
  width: 480px;
  /* 每个容器占据一半的空间 */
}
</style>
