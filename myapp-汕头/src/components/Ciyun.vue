<template>
    <div ref="wordCloud" style="width: 100%; height: 600px;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import 'echarts-wordcloud';
const wordCloud = ref(null);

onMounted(async () => {
    var myChart = echarts.init(wordCloud.value);

    try {
        // 从API获取数据
        const response = await axios.get('http://localhost:8989/fjjyk');
        const data = await response.data;
        data.pop(); // 移除最后一个空对象
        // 准备词云图数据
        const wordCloudData = data.map(item => ({
            name: item.name_chinese,
            value: item.total
        }));

        // 设置ECharts选项
        var option = {
            tooltip: {
                    show: true, // 显示提示框
                    formatter: function (params) {
                        var value = params.data.value.toFixed(1);
                        return `${params.data.name}<br>${value}`;
                        //console.log(params.data.name);
                    }
                },
            title: {
                text: '词云图',
                left: 'center'
            },
            series: [{
                
                type: 'wordCloud',
                shape: 'circle',
                left: 'center',
                top: 'center',
                width: '70%',
                height: '80%',
                right: null,
                bottom: null,
                sizeRange: [12, 80], // 可以调整大小范围
                rotationRange: [-45, 45],
                rotationStep: 45,
                gridSize: 15,
                drawOutOfBound: false,
                data: wordCloudData
            }]
        };

        myChart.setOption(option);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
});
</script>

<style scoped>
/* 在这里添加样式 */
</style>
