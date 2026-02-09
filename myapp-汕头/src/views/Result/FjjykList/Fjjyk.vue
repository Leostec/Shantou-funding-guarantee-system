<template>
    <div class="search-container">
        <div class="search-and-button">
            <div v-if="!isChartView" class="search">
                <a-dropdown>
                    <a-dropdown-button class="ant-dropdown-link" type="primary" @click.prevent>
                        污染物查询
                        <DownOutlined />
                    </a-dropdown-button>
                    <template #overlay>
                        <a-menu @click="onClick">
                            <a-menu-item v-for="(option, index) in nameChineseOptions" :key="index + 1">
                                {{ option }}
                            </a-menu-item>
                        </a-menu>

                    </template>
                </a-dropdown>
            </div>
            <div class="button">
                <a-button @click="toggleChartView">污染物分析</a-button>
            </div>
        </div>
    </div>


    <div class="standard">
        <div v-if="!isChartView" class="ant-table-striped">
            <a-table :columns="dynamicColumns" :data-source="tableData" :scroll="{ x: 2000 }"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" bordered>

            </a-table>
        </div>
        <div v-if="isChartView" class="chart-container">
            <div class="chart-left">
            </div>
            <div class="chart-right">
                <BarChart />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import pinyin from 'pinyin';
import { useRouter } from 'vue-router';

const router = useRouter();
const isChartView = ref(false);
const tableData = ref([]);
const searchQuery = ref('');
// 用于存储 name_chinese 的列表
const nameChineseOptions = ref([]);
// 获取 name_chinese 的列表
async function fetchNameChineseOptions() {
    try {
        const response = await axios.get('http://localhost:8989/getNameChinese');
        // 使用 pinyin 库将每个中文字符串转换为拼音
        const pinyinOptions = response.data.map(item => ({
            nameChinese: item.name_chinese,
            pinyin: pinyin(item.name_chinese, { style: pinyin.STYLE_NORMAL }).join('')
        }));
        // 按照拼音排序
        pinyinOptions.sort((a, b) => a.pinyin.localeCompare(b.pinyin));
        // 提取排序后的 name_chinese 字段
        nameChineseOptions.value = pinyinOptions.map(item => item.nameChinese);
    } catch (error) {
        console.error('Error fetching name_chinese options:', error);
    }
}

// 处理下拉框点击事件
const onClick = ({ key }) => {
    const selectedNameChinese = nameChineseOptions.value[key - 1];
    fetchTableDataWithSearch(selectedNameChinese);
};

const toggleChartView = () => {
    isChartView.value = !isChartView.value;
};

const columnMap = {
    'name_chinese': '中文名称',
    'name_english': '英文名称',
    'total':'总量'
};

const dynamicColumns = computed(() => {
    if (tableData.value.length > 0) {
        const firstItem = tableData.value[0];
        return Object.keys(firstItem).map(key => {
            const customTitle = columnMap[key] || key; // 获取自定义列名
            return {
                title: customTitle,
                dataIndex: key,
                key: key,
            };
        });
    } else {
        return [];
    }
});

async function fetchTableDataWithSearch(nameChinese = null) {
    try {
        let url = 'http://localhost:8989/fjjyk';
        if (nameChinese) {
            url += `?searchKey=${encodeURIComponent(nameChinese)}`;
        }
        const response = await axios.get(url);
        tableData.value = response.data;
    } catch (error) {
        console.error('Error fetching table data:', error);
    }
}


onMounted(() => {
    fetchNameChineseOptions();
    fetchTableDataWithSearch();
});
</script>

<style lang="scss" scoped>
.search-container {
    margin: 20px;
}

.ant-dropdown-menu {
    max-height: 200px;
    /* 设置最大高度 */
    overflow-y: auto;
    /* 添加垂直滚动条 */
}

.search-and-button {
    display: flex; // 使用 Flexbox 布局
    justify-content: space-between; // 搜索框靠左，按钮靠右
    align-items: center; // 垂直居中对齐
}

.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}

.ant-table-striped :deep(.table-striped) td {
    background-color: rgb(223, 223, 223);
}



.standard {
    margin: 20px;
    width: 100%;
}

.chart-container {
    display: flex;
}
</style>
