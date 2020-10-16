import React from "react";
// import ReactEcharts from "echarts-for-react";
import "./style.scss"
// 分开引用减少代码量 参考资料 https://github.com/hustcc/echarts-for-react
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/pie';

export default class PieChart extends React.PureComponent {
    getOption = () => {
        return {
            title: {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1548, name: '搜索引擎'}
                    ],
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
    };
    render() {
        let code = "<ReactEcharts \n" +
            "  option={this.getOption()} \n" +
            "  style={{height: '350px', width: '100%'}}  \n" +
            "  className='react_for_echarts' />";
        return (
            <div className='examples'>
                <div className='parent'>
                    <ReactEchartsCore
                        echarts={echarts}
                        option={this.getOption()}
                        style={{height: '350px', width: '100%'}}
                        className='react_for_echarts' />
                </div>
            </div>
        );
    }
}