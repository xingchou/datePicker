# datePicker
移动端日期选择组件，压缩后只有几KB


## Usage
```javascript
import：
    import Picker from 'picker.min.js'
    @import "picker.css"
    
直接引入：
    <link href="picker.css" rel="stylesheet" />
    <script src='picker.min.js'></script>
```
    

## Function
```javascript
new DatePicker({
    "type": "3", //0年, 1年月, 2月日, 3年月日(默认为3)
    
    "title": '请选择日期', //标题（可选）
    
    "maxYear": "2100",//最大年份（可选）
    
    "minYear": "1900",//最小年份（可选）
    
    "separator": "-",//日期分割符(可选)(默认为'/')
    
    "defaultValue": '',//默认值：根据分隔符分隔开（可选）
    
    "callBack": function (val) {
        //回调函数（val为选中的日期）
        // 可在此处设置显示选中的值
        self.nowVal = val;
    }
});
```

## Demo：

https://xingchou.github.io/pluginApp/dist/index.html#/list/datePicker
