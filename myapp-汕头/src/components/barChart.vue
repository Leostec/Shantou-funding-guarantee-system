<template>
    <div ref="barChart" style="width: 400px; height: 400px;"></div>
</template>

<script setup>

import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import axios from 'axios'; // 假设您使用axios来发送HTTP请求

const barChart = ref(null);

// 获取随机颜色的函数
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
let resizeTimer;
function debounce(func, timeout = 300) {
    return (...args) => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

onMounted(async () => {
    var myChart = echarts.init(barChart.value);

    try {
        // 从API获取数据
        const response = await axios.get('http://localhost:8989/fjjyk');
        const data = response.data;

        // 按total升序排序
        data.sort((a, b) => a.total - b.total);

        // 获取total最小的十个记录
        const topTen = data.slice(0, 10);

        // 准备ECharts数据
        const xAxisData = topTen.map(item => item.name_chinese);
        const seriesData = [{
            name: '总量',
            type: 'bar',
            data: topTen.map(item => item.total),
        }];

        // 设置ECharts选项
        var option = {
            title: {
                text: '污染物浓度后十',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value'
            },
            series: seriesData
        };

        myChart.setOption(option);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
    window.addEventListener('resize', debounce(() => {
        myChart.resize();
    }));
});

</script>

<style scoped>
/* 在这里添加样式 */
</style>
