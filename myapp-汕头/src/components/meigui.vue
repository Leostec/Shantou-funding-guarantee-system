<template>
    <div ref="meigui" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
// 在 <script setup> 中
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import axios from 'axios'; // 假设您使用axios来发送HTTP请求

const meigui = ref(null);

onMounted(async () => {
    var myChart = echarts.init(meigui.value);

    try {
        // 从API获取数据
        const response = await axios.get('http://localhost:8989/fjjyk');
        const data = response.data;
        const meiData = data.slice(0,100)
        // 准备ECharts数据
        const xAxisData = meiData.map(item => item.name_chinese);
        console.log(xAxisData)
        // 设置ECharts选项
        var option = {
            title: [
                {
                    text: '极坐标',
                    
                }
            ],
            polar: {
                radius: [30, '80%']
            },
            radiusAxis: {
                max: 1000,
            },
            angleAxis: {
                type: 'category',
                data: xAxisData,
                startAngle: 75
            },
            tooltip: {},
            series: {
                type: 'bar',
                data: meiData.map(item => item.total),
                coordinateSystem: 'polar',
                
            },
            animation: false
        };


        myChart.setOption(option);
    } catch (error) {
        console.error('Error fetching data: ', error);
    };
});

</script>

<style scoped>
/* 在这里添加样式 */
</style>
