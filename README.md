# datePicker
移动端日期选择组件


new DatePicker({

    "type": "3", //0年, 1年月, 2月日, 3年月日(默认为3)
    
    "title": '请选择日期', //标题（可选）
    
    "maxYear": "2100",//最大年份（可选）
    
    "minYear": "1900",//最小年份（可选）
    
    "separator": "-",//日期分割符(可选)(默认为'/')
    
    "defaultValue": '',//默认值（可选）
    
    "callBack": function (val) {
        //回调函数（val为选中的日期）
        self.nowVal = val;
    }
    
});




## demo：

https://xingchou.github.io/pluginApp/dist/index.html#/list/datePicker
