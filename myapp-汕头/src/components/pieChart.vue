<template>
    <div ref="pieChart" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';

const pieChart = ref(null);
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
    var myChart = echarts.init(pieChart.value);

    // 调用API获取数据
    const response = await fetch('http://localhost:8989/fjjyk');
    const data = await response.json();
    data.sort((a, b) => b.total - a.total);
    // 构建饼图数据
    const pieData = data.slice(1, 11).map(item => ({
        value: item.total,
        name: item.name_chinese,
        itemStyle: {
            color: getRandomColor() // 调用函数获取随机颜色
        }
    }));
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    var option = {
        title: {
            text: '污染物浓度前十',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '50%',
                data: pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', debounce(() => {
        myChart.resize();
    }));
});
</script>


<style scoped>
/* 在这里添加样式 */
</style>
