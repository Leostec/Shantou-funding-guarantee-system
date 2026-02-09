<template>
    <div ref="chartRef" style="width: 100%; height: 800px;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';

const chartRef = ref(null);

const data = [
    {
        name: '果蔬',
        itemStyle: {
            color: '#da0d68'
        },
        children: [
            {
                name: '化学',
                itemStyle: {
                    color: '#975e6d'
                },
                children: [
                    {
                        name: '乙烯',
                        value: 1,
                        itemStyle: {
                            color: '#f99e1c'
                        }
                    },
                    {
                        name: '草酸铵',
                        value: 1,
                        itemStyle: {
                            color: '#ef5a78'
                        }
                    },
                    {
                        name: '草酸二铵',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                    {
                        name: '对硝基酚',
                        value: 1,
                        itemStyle: {
                            color: '#f99e1c'
                        }
                    },
                    {
                        name: '维生素C',
                        value: 1,
                        itemStyle: {
                            color: '#ef5a78'
                        }
                    },
                    {
                        name: '丙二醛',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                    {
                        name: '总酚',
                        value: 1,
                        itemStyle: {
                            color: '#f99e1c'
                        }
                    },
                    {
                        name: '过氧化物酶',
                        value: 1,
                        itemStyle: {
                            color: '#ef5a78'
                        }
                    },
                    {
                        name: '可滴定酸含量',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                ]
            },
            {
                name: '生物',
                itemStyle: {
                    color: '#e0719c'
                },
                children: [
                    {
                        name: '金黄色葡萄球菌',
                        value: 1,
                        itemStyle: {
                            color: '#f99e1c'
                        }
                    },
                    {
                        name: '单核细胞增生性李斯特菌',
                        value: 1,
                        itemStyle: {
                            color: '#ef5a78'
                        }
                    },
                    {
                        name: '志贺氏菌属',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                    {
                        name: '荧光假单孢菌',
                        value: 1,
                        itemStyle: {
                            color: '#f99e1c'
                        }
                    },
                    {
                        name: '青霉菌',
                        value: 1,
                        itemStyle: {
                            color: '#ef5a78'
                        }
                    },
                    {
                        name: '褐腐菌',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                    {
                        name: '菌群种类和菌群丰度',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                    {
                        name: '单增李斯特氏菌',
                        value: 1,
                        itemStyle: {
                            color: '#f99e1c'
                        }
                    },
                    {
                        name: '菌落总数',
                        value: 1,
                        itemStyle: {
                            color: '#ef5a78'
                        }
                    },
                    {
                        name: '沙门氏菌',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                    {
                        name: '大肠埃希菌',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    }
                ]
            },
            {
                name: '物理',
                itemStyle: {
                    color: '#eac736'
                },
                children: [
                    {
                        name: '色差',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                    {
                        name: '质构',
                        value: 1,
                        itemStyle: {
                            color: '#ef5a78'
                        }
                    },
                    {
                        name: '汁液流失率',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    },
                    {
                        name: '电导率',
                        value: 1,
                        itemStyle: {
                            color: '#f7f1bd'
                        }
                    }
                ]
            }
        ]
    },
    {
        name: '肉类',
        itemStyle: {
            color: '#da1d23'
        },
        children: [
            {
                name: '化学',
                itemStyle: {
                    color: '#dd4c51'
                },
                children: [
                    {
                        name: '挥发性盐基氮',
                        value: 1,
                        itemStyle: {
                            color: '#3e0317'
                        }
                    },
                    {
                        name: '组胺',
                        value: 1,
                        itemStyle: {
                            color: '#e62969'
                        }
                    },
                    {
                        name: 'pH值',
                        value: 1,
                        itemStyle: {
                            color: '#6569b0'
                        }
                    },
                    {
                        name: '生物胺',
                        value: 1,
                        itemStyle: {
                            color: '#ef2d36'
                        }
                    },
                    {
                        name: '硫代巴比妥酸反应物质',
                        value: 1,
                        itemStyle: {
                            color: '#eac736'
                        }
                    },
                    {
                        name: '木糖酸',
                        value: 1,
                        itemStyle: {
                            color: '#d8854f'
                        }
                    },
                    {
                        name: '吡哆醛',
                        value: 1,
                        itemStyle: {
                            color: '#eac736'
                        }
                    }
                ]
            },
            {
                name: '生物',
                itemStyle: {
                    color: '#c94a44'
                },
                children: [
                    {
                        name: '假单胞菌',
                        value: 1,
                        itemStyle: {
                            color: '#b53b54'
                        }
                    },
                    {
                        name: '菌落总数',
                        value: 1,
                        itemStyle: {
                            color: '#a5446f'
                        }
                    },
                    {
                        name: '沙门氏菌',
                        value: 1,
                        itemStyle: {
                            color: '#a5446f'
                        }
                    },
                    {
                        name: '金黄色葡萄球菌',
                        value: 1,
                        itemStyle: {
                            color: '#a5446f'
                        }
                    },
                    {
                        name: '单核细胞增生性李斯特菌',
                        value: 1,
                        itemStyle: {
                            color: '#a5446f'
                        }
                    },
                    {
                        name: '志贺氏菌属',
                        value: 1,
                        itemStyle: {
                            color: '#a5446f'
                        }
                    },
                    {
                        name: '菌群种类和菌群丰度',
                        value: 1,
                        itemStyle: {
                            color: '#a5446f'
                        }
                    }
                ]
            },
            {
                name: '物理',
                itemStyle: {
                    color: '#dd4c51'
                },
                children: [
                    {
                        name: '色差',
                        value: 1,
                        itemStyle: {
                            color: '#f2684b'
                        }
                    },
                    {
                        name: '质构',
                        value: 1,
                        itemStyle: {
                            color: '#e73451'
                        }
                    },
                    {
                        name: '汁液流失率',
                        value: 1,
                        itemStyle: {
                            color: '#e65656'
                        }
                    },
                    {
                        name: '持水力',
                        value: 1,
                        itemStyle: {
                            color: '#f89a1c'
                        }
                    },
                ]
            },
        ]
    },
    {
        name: '乳制品',
        itemStyle: {
            color: '#ebb40f'
        },
        children: [
            {
                name: '生物',
                itemStyle: {
                    color: '#e1c315'
                },
                children: [
                    {
                        name: '金黄色葡萄球菌',
                        value: 1,
                        itemStyle: {
                            color: '#9ea718'
                        }
                    },
                    {
                        name: '菌落总数',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '大肠菌群',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                    {
                        name: '沙门氏菌',
                        value: 1,
                        itemStyle: {
                            color: '#8eb646'
                        }
                    },
                    {
                        name: '芽孢杆菌',
                        value: 1,
                        itemStyle: {
                            color: '#faef07'
                        }
                    }
                ]
            },
            {
                name: '化学',
                itemStyle: {
                    color: '#b09733'
                },
                children: [
                {
                        name: '组胺',
                        value: 1,
                        itemStyle: {
                            color: '#9ea718'
                        }
                    },
                    {
                        name: '2-萘胺',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '二肽Pro-Met ',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                ]
            }
        ]
    },
    {
        name: '水产品',
        itemStyle: {
            color: '#187a2f'
        },
        children: [
            {
                name: '化学',
                itemStyle: {
                    color: '#a2b029'
                },
                children:[
                    {
                        name: 'K值',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '过氧化值',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                    {
                        name: '挥发性盐基氮',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '组胺',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                    {
                        name: '麻痹性贝类毒素',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '腹泻性贝类毒素',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                    {
                        name: '肌苷',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '生物胺',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                    {
                        name: '腐胺',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '亚精胺',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                    {
                        name: '尸胺',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '酪胺',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                    {
                        name: '章鱼胺',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    },
                    {
                        name: '苯乙胺',
                        value: 1,
                        itemStyle: {
                            color: '#d0b24f'
                        }
                    },
                    {
                        name: 'pH值',
                        value: 1,
                        itemStyle: {
                            color: '#94a76f'
                        }
                    }
                ]
            },
            {
                name: '生物',
                itemStyle: {
                    color: '#718933'
                },
                children:[
                    {
                        name: '菌落总数',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '大肠菌群',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '单增李斯特氏菌',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '沙门氏菌',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '大肠埃希菌',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '金黄色葡萄球菌',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '单增李斯特氏菌',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '志贺氏菌属',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '副溶血弧菌',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                    {
                        name: '菌群种类和菌群丰度',
                        value: 1,
                        itemStyle: {
                            color: '#718933'
                        }
                    },
                ]
            },
            {
                name: '物理',
                itemStyle: {
                    color: '#3aa255'
                },
                children: [
                    {
                        name: '色差',
                        value: 1,
                        itemStyle: {
                            color: '#a2bb2b'
                        }
                    },
                    {
                        name: '质构',
                        value: 1,
                        itemStyle: {
                            color: '#62aa3c'
                        }
                    },
                    {
                        name: '持水力',
                        value: 1,
                        itemStyle: {
                            color: '#03a653'
                        }
                    },
                ]
            },
            
        ]
    },
    {
        name: '速冻食品',
        itemStyle: {
            color: '#0aa3b5'
        },
        children: [
            {
                name: '化学',
                itemStyle: {
                    color: '#9db2b7'
                },
                children: [
                    {
                        name: 'K值',
                        value: 1,
                        itemStyle: {
                            color: '#8b8c90'
                        }
                    },
                    {
                        name: '过氧化值',
                        value: 1,
                        itemStyle: {
                            color: '#beb276'
                        }
                    },
                    {
                        name: '挥发性盐基氮',
                        value: 1,
                        itemStyle: {
                            color: '#fefef4'
                        }
                    },
                    {
                        name: '硫代巴比妥酸反应物质',
                        value: 1,
                        itemStyle: {
                            color: '#744e03'
                        }
                    },
                    {
                        name: 'pH值',
                        value: 1,
                        itemStyle: {
                            color: '#a3a36f'
                        }
                    },
                ]
            },
            {
                name: '生物',
                itemStyle: {
                    color: '#76c0cb'
                },
                children: [
                    {
                        name: '菌落总数',
                        value: 1,
                        itemStyle: {
                            color: '#80a89d'
                        }
                    },
                    {
                        name: '大肠菌群',
                        value: 1,
                        itemStyle: {
                            color: '#def2fd'
                        }
                    },
                    {
                        name: '沙门氏菌',
                        value: 1,
                        itemStyle: {
                            color: '#7a9bae'
                        }
                    },
                    {
                        name: '大肠埃希菌O157:H7',
                        value: 1,
                        itemStyle: {
                            color: '#039fb8'
                        }
                    },
                    {
                        name: '金黄色葡萄球菌',
                        value: 1,
                        itemStyle: {
                            color: '#5e777b'
                        }
                    },
                    {
                        name: '单核细胞增生性李斯特菌',
                        value: 1,
                        itemStyle: {
                            color: '#120c0c'
                        }
                    },
                    {
                        name: '志贺氏菌属',
                        value: 1,
                        itemStyle: {
                            color: '#039fb8'
                        }
                    },
                    {
                        name: '副溶血弧菌',
                        value: 1,
                        itemStyle: {
                            color: '#5e777b'
                        }
                    },
                    {
                        name: '菌群种类和菌群丰度',
                        value: 1,
                        itemStyle: {
                            color: '#120c0c'
                        }
                    }
                ]
            },
            {
                name: '物理',
                itemStyle: {
                    color: '#f6d860'
                },
                children: [
                    {
                        name: '色差',
                        value: 1,
                        itemStyle: {
                            color: '#80a89d'
                        }
                    },
                    {
                        name: '质构',
                        value: 1,
                        itemStyle: {
                            color: '#def2fd'
                        }
                    },
                    {
                        name: '持水力',
                        value: 1,
                        itemStyle: {
                            color: '#7a9bae'
                        }
                    },
                ]
            }
        ]
    },
];

const initChart = () => {
    const myChart = echarts.init(chartRef.value);
    const option = {
        title: {
            text: '食品标志物分类',
            textStyle: {
                fontSize: 20,
                align: 'center'
            },
        },
        series: {
            type: 'sunburst',
            data: data,
            radius: [0, '100%'],
            sort: undefined,
            emphasis: {
                focus: 'ancestor'
            },
            levels: [
                {},
                {
                    r0: '15%',
                    r: '35%',
                    itemStyle: {
                        borderWidth: 2
                    },
                    label: {
                        rotate: 'tangential'
                    }
                },
                {
                    r0: '35%',
                    r: '70%',
                    label: {
                        align: 'right'
                    }
                },
                {
                    r0: '70%',
                    r: '72%',
                    label: {
                        position: 'outside',
                        padding: 3,
                        silent: false
                    },
                    itemStyle: {
                        borderWidth: 3
                    }
                }
            ]
        }
    }
    myChart.setOption(option);
};

onMounted(() => {
    initChart();
});
</script>