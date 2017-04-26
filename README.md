# datePicker
移动端日期选择组件

new DatePicker({
    
    //0年, 1年月, 2月日, 3年月日(默认为3)
    "type": "3",

    //标题（可选）
    "title": '请选择日期',

    //最大年份（可选）
    "maxYear": "2100",

    //最小年份（可选）
    "minYear": "1900",

    //日期分割符(可选)(默认为'/')
    "separator": "-",

    //默认值（可选）
    "defaultValue": '',

    "callBack": function (val) {
        //回调函数（val为选中的日期）
        self.nowVal = val;
    }
    
});


demo：

https://xingchou.github.io/pluginApp/dist/index.html#/list/datePicker
