<template>
    <div class="standard">
        <div class="table">
            <a-table :columns="columns" :data-source="tableData" bordered sticky></a-table>
        </div>
    </div>
    
    
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const columns = [
    {
        title: '污染物编号',
        dataIndex: 'pollutant_id',
        key: 'pollutant_id',
    },
    {
        title: '中文名称',
        dataIndex: 'name_chinese',
        key: 'name_chinese',
    },
    {
        title: '英文名称',
        dataIndex: 'name_english',
        key: 'name_english',
    },
    {
        title: '污染物分类',
        dataIndex: 'pollutants_classification',
        key: 'pollutants_classification',
    },
    {
        title: '污染物来源',
        dataIndex: 'pollutant_source',
        key: 'pollutant_source',
    },
    {
        title: '化学成分',
        dataIndex: 'chemical_formula',
        key: 'chemical_formula',
    },
    {
        title: 'molecular_mass',
        dataIndex: 'molecular_mass',
        key: 'molecular_mass',
    },
    {
        title: 'cas',
        dataIndex: 'cas',
        key: 'cas',
    },
    {
        title: 'melting_point',
        dataIndex: 'melting_point',
        key: 'melting_point',
    },
    
];

// 表格数据源
const tableData = ref([]);


// 获取表格数据
async function fetchTableData(page = 1) {
    try {
        const response = await axios.get('http://localhost:8989/pollutant');
        //console.log(response);
        tableData.value = response.data;
    } catch (error) {
        console.error('Error fetching table data:', error);
    }
}
// 组件挂载后获取数据
onMounted(() => {
    fetchTableData();
});

</script>

<style lang="scss" scoped>
.standard{
    margin: 20px;
}
.table{
    margin-top: 10px;
    height: auto;
    width: 65rem;
}
</style>
