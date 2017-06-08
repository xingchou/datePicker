/**
 * datePicker v1.0 Created by zx.
 */
// DatePicker
(function (window, document, Math) {
    //scroll
    function Scroll(id, params) {
        this.scroller = document.querySelector(id);
        this.childNode = this.scroller.childNodes[0];
        this.options = {
            step: true,// 是否开启步长模式
            defaultPlace: 0,// 默认列表位置
            callback: null
        };

        this.startPageY = 0;
        this.startTime = 0;
        this.endTime = 0;
        this.offsetTop = 0;//上一次滚动位置

        this.scrollerHeight = this.scroller.clientHeight;//scroller高度
        this.childNodeHeight = this.childNode.clientHeight;//scroller子元素的高度
        this.scrollHeight = this.childNodeHeight - this.scrollerHeight;//滚动高度

        var childNodes = this.childNode.childNodes;
        this.stepLen =  childNodes.length > 0 ? childNodes[0].clientHeight : 0;// 步长

        // 设置参数
        for(var i in params){
            this.options[i] = params[i];
        }

        // 默认列表位置
        var defaultPlace = this.options.defaultPlace ? this.options.defaultPlace : 0;
        this.scrollTo(0, defaultPlace);

        this._start();
        this._move();
        this._end();
        // console.log(this);
    }

    Scroll.prototype = {
        _start: function () {
            var self = this;
            self.scroller.addEventListener('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();

                self.startTime = self.getTime();
                var touches = e.touches ? e.touches[0] : e;
                self.startPageY = touches.pageY;//起始触摸点

                self.browserVendor('transition', 'none');
            }, false);
        },

        _move: function () {
            var self = this;
            self.scroller.addEventListener('touchmove', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var timestamp = self.getTime();
                var touches = e.touches ? e.touches[0] : e;

                // 滚动高度
                var diffPageY = touches.pageY - self.startPageY;
                var movePageY = diffPageY + self.offsetTop;

                // 最少移动10px
                if ( timestamp - self.endTime > 300 && Math.abs(diffPageY) < 10 ) {
                    return;
                }

                // 超过边缘滚动有阻力
                if( movePageY > 0 ){
                    movePageY /= 3;
                }else if( Math.abs(movePageY) > Math.abs(self.scrollHeight) ){
                    movePageY = Math.abs(self.scrollHeight) - Math.abs(movePageY);
                    movePageY = movePageY / 3 - self.scrollHeight;
                }

                self.browserVendor('transform', 'translate(0, '+ movePageY +'px)');
            }, false);
        },

        _end: function () {
            var self = this;
            self.scroller.addEventListener('touchend', function (e) {
                e.stopPropagation();
                e.preventDefault();

                self.endTime = self.getTime();
                var duration = self.endTime - self.startTime;

                var touches = e.changedTouches ? e.changedTouches[0] : e;
                var offsetHeight = touches.pageY - self.startPageY;//本次滚动偏移位置
                self.offsetTop += offsetHeight;//记录总偏移位置

                if( (self.offsetTop > 0) || (Math.abs(self.offsetTop) > Math.abs(self.scrollHeight)) ){
                    //上边缘&下边缘
                    self.browserVendor('transition', 'all 500ms');
                }else if( duration < 300 ){ // 惯性滚动
                    var speed = Math.abs(offsetHeight) / duration;// 惯性移动速度
                    var moveTime = duration * speed * 20;// 惯性滚动时间(动画)
                    moveTime = moveTime > 2000 ? 2000 : moveTime;
                    self.offsetTop += offsetHeight * speed * 10;// 惯性移动距离

                    self.browserVendor('transitionProperty', 'all');
                    self.browserVendor('transitionDuration', moveTime + 'ms');
                    self.browserVendor('transitionTimingFunction', 'cubic-bezier(0.1, 0.57, 0.1, 1)');
                }else{
                    self.browserVendor('transition', 'all 500ms');
                }

                if( self.offsetTop > 0 ){
                    self.offsetTop = 0;
                }else if( Math.abs(self.offsetTop) > Math.abs(self.scrollHeight) ){
                    self.offsetTop = -self.scrollHeight;
                }

                // 步长模式
                if( self.options.step && self.stepLen > 0 ){
                    var nowEndY = self.offsetTop;
                    var h = Math.abs( nowEndY % self.stepLen );//滚动多余不足step的高度
                    var halfHeight = self.stepLen / 2;//step一半的高度

                    //超过行一半的高度，则滚动一行
                    var moveY = (h >= halfHeight) ? (nowEndY - self.stepLen + h) : (nowEndY + h);

                    var index = parseInt( Math.abs(moveY) / self.stepLen );
                    self.options.callback({
                        index: index,
                        node: self.childNode.childNodes
                    });
                    self.offsetTop = moveY;
                }

                self.browserVendor('transform', 'translate(0, '+ self.offsetTop +'px)');

            }, false);
        },

        // 滚动到指定位置
        scrollTo: function (x, y, time) {
            var self = this;

            if( time && time > 0 ){
                self.browserVendor('transitionProperty', 'all');
                self.browserVendor('transitionDuration', time + 'ms');
                self.browserVendor('transitionTimingFunction', 'cubic-bezier(0.1, 0.57, 0.1, 1)');
            }else{
                self.browserVendor('transition', 'none');
            }

            y = -y;
            self.offsetTop = y;
            self.browserVendor('transform', 'translate(0, '+ y +'px)');
        },

        // 刷新
        refresh: function () {
            this.childNode = this.scroller.childNodes[0];
            this.startPageY = 0;
            this.startTime = 0;
            this.endTime = 0;
            this.offsetTop = 0;

            this.scrollerHeight = this.scroller.clientHeight;//scroller高度
            this.childNodeHeight = this.childNode.clientHeight;//scroller子元素的高度
            this.scrollHeight = this.childNodeHeight - this.scrollerHeight;//滚动高度

            var childNodes = this.childNode.childNodes;
            this.stepLen =  childNodes.length > 0 ? childNodes[0].clientHeight : 0;// 步长

            this.scrollTo(0, 0, 500);
        },

        // 浏览器兼容
        browserVendor: function(styleStr, value){
            var self = this;
            var vendors = ['t', 'WebkitT', 'MozT', 'msT', 'OT'],
                styleObj,
                len = vendors.length;
            var elementStyle = self.childNode.style;

            for (var i = 0; i < len; i++ ) {
                styleObj = vendors[i] + styleStr.substr(1);
                if ( styleObj in elementStyle ) {
                    elementStyle[styleObj] = value;
                    // console.log(styleObj + ' = ' + value);
                }
            }
        },

        // 获取当前时间
        getTime: function () {
            return parseInt(new Date().getTime());
        }
    };


    //DatePicker
    function DatePicker(params) {
        this.scrollArray = [];//iscroll变量
        this.textArray = [];//选中的值
        this.isScrollTo = false;//是否是scrollTo 滚动
        this.monthLen = 30;//当前选择日期 月有多少天

        //参数
        this.options = {
            "title": '请选择日期',//标题(可选)
            "type": "3",//0年, 1年月, 2月日, 3年月日
            "maxYear": "",//最大年份（可选）
            "minYear": "",//最小年份（可选）
            "separator": "/",//分割符(可选)
            "defaultValue": '',//默认值（可选）
            "callBack": null
        };

        // set默认参数
        params = this.setDefaultOptions(params);

        // 参数赋值
        for ( var i in params ) {
            this.options[i] = params[i];
        }

        //是否有默认日期
        this.defaultArray = ['', '', ''];
        if ( this.options.defaultValue ) {
            var defaultValue = this.options.defaultValue + "";
            var separator = this.options.separator;
            var dvArray = defaultValue.split(separator);
            if( dvArray.length > 0 ){
                for( var num = 0; num < dvArray.length; num++ ){
                    this.defaultArray[num] = dvArray[num];
                }
            }
        }

        //填充数据并显示picker
        this.FillData();

        //添加click事件
        this.eventClick();
    }

    DatePicker.prototype = {
        //填充data
        FillData: function () {
            var self = this;

            // 所有输入失去焦点(隐藏键盘)
            self.enterNodesBlur();

            //body中是否存在picker
            var modalbox = document.querySelector(".zx_mask");
            if( modalbox ){
                document.body.removeChild(modalbox);
            }

            var title = self.options.title ? self.options.title : '请选择日期';
            var modalParent = document.createElement("div"); //父节点
            modalParent.className = "zx_mask";

            var picker_list = '<div class="zx_select showPicker">' +
                '<header><button class="nav_left picker-cancel">取消</button>' +
                '<h1>' + title + '</h1><button class="nav_right picker-ok">确定</button></header>' +
                '<div class="ub" id="wrapper-parent"><div class="ub-f1 picker-wrapper" id="dp-wrapper0"><ul></ul></div>';

            //2级选择
            if( self.options.type > 0 ) {
                picker_list += '<div class="ub-f1 picker-wrapper" id="dp-wrapper1"><ul></ul></div>';
            }

            //3级选择
            if( self.options.type > 2 ){
                picker_list += '<div class="ub-f1 picker-wrapper" id="dp-wrapper2"><ul></ul></div>';
            }

            picker_list += '<div class="sel_top"></div><div class="sel_bottom"></div>';
            picker_list += '<div class="sel_middle"></div></div></div>';
            modalParent.innerHTML = picker_list;
            document.body.appendChild( modalParent );

            //设置宽度
            var listWidth = parseFloat(100 / self.options.num).toFixed(3) + "%";
            var pickerWrapperArr = document.querySelectorAll('.picker-wrapper');
            for( var i = 0; i < pickerWrapperArr.length; i++ ){
                pickerWrapperArr[i].style.fontSize = "16px";
                pickerWrapperArr[i].style.minWidth = listWidth;
                pickerWrapperArr[i].style.maxWidth = listWidth;
            }

            switch(self.options.type){
                case 1:
                    document.querySelector('#wrapper-parent').style.padding = "0 15%";
                    self.getYearList(0, self.defaultArray[0]);
                    self.getMonthList(1, self.defaultArray[1]);
                    break;
                case 2:
                    document.querySelector('#wrapper-parent').style.padding = "0 15%";
                    self.getMonthList(0, self.defaultArray[0]);
                    self.getDayList(1, self.defaultArray[1]);
                    break;
                case 3:
                    self.getYearList(0, self.defaultArray[0]);
                    self.getMonthList(1, self.defaultArray[1]);
                    self.getDayList(2, self.defaultArray[2]);
                    break;
                case 4:
                default:
                    self.getYearList(0, self.defaultArray[0]);
                    break;
            }

            setTimeout(function () {
                document.querySelector('.zx_select').style.height = '245px';
            }, 0);
        },

        //iscroll初始化
        scrollInit: function (index, num) {
            var self = this;

            //每个选项对的高度
            var wrapperList = document.querySelector('#dp-wrapper0').childNodes[0];
            var itemHeight = wrapperList.childNodes[0].clientHeight;

            var id = '#dp-wrapper' + index;
            self.scrollArray[index] = new Scroll(id, {
                //步长（每次滚动固定距离）
                step: itemHeight,

                // 列表默认位置(默认为0)
                defaultPlace: itemHeight * num,

                // 滚动结束回调函数
                callback: function (params) {
                    var num = params.index + 2;
                    var node = params.node[num];
                    self.SetItemList(index, node);

                    //当前天数选择大于 当前年月的天数
                    if( self.options.type == 3 ){
                        var nowPlace = self.textArray[2].value;
                        if( nowPlace > self.monthLen ){
                            var moveLen = (self.monthLen - 1) * itemHeight;
                            self.textArray[2].value = self.monthLen;
                            setTimeout(function () {
                                self.scrollArray[2].scrollTo(0, moveLen, 500);
                            }, 0);
                        }
                    }
                }
            });

            //禁止move事件
            self.add_EventListen();
        },

        //设置列表、存储选中数据
        SetItemList: function (index, nowScroll) {
            var self = this;

            if (nowScroll) {
                // 当前选择项的值
                var nowItem = {};
                nowItem.value = nowScroll.attributes[0].value;
            } else {
                var nowItem = "";
            }

            self.textArray[index] = nowItem;
            self.getMonthLength();
        },

        //默认值
        setDefaultItem: function (index, dateValue) {
            var self = this;
            var nowItem = {};
            nowItem.value = dateValue;
            self.textArray[index] = nowItem;
        },

        //获取年列表
        getYearList: function (index, defaultValue) {
            var self = this;
            var list = '<li></li><li></li>', defaultNum = '';

            var maxYear = self.options.maxYear;
            var minYear = self.options.minYear;
            if( defaultValue ){
                var num = 0, isMatch = false;
                for (var i = maxYear; i > minYear; i--) {
                    if ( defaultValue == i ) {
                        isMatch = true;
                        defaultNum = num;//默认选中的值
                        self.setDefaultItem(index, i);
                    }

                    list += '<li data-value="'+ i +'">' + i + '年</li>';
                    num++;
                }

                if( !isMatch ){
                    self.setDefaultItem(index, maxYear);
                }
            }else {
                for (var i = maxYear; i > minYear; i--) {
                    list += '<li data-value="'+ i +'">' + i + '年</li>';
                }
                self.setDefaultItem(index, maxYear);
            }

            list += '<li></li><li></li>';
            document.querySelector('#dp-wrapper' + index).childNodes[0].innerHTML = list;

            setTimeout(function () {
                self.scrollInit(index, defaultNum);
            }, 0);
        },

        //获取月列表
        getMonthList: function (index, defaultValue) {
            var self = this;
            var list = '<li></li><li></li>', defaultNum = '';

            var unit = "月", prefix = "0";
            if( self.options.type == 2 ){
                unit = "";
                prefix = "";
            }

            if( defaultValue ){
                var num = 0, isMatch = false;
                for (var i = 1; i <= 12; i++) {
                    var count = i < 10 ? prefix + i : i;
                    if ( defaultValue == i ) {
                        isMatch = true;
                        defaultNum = num;//默认选中的值
                        self.setDefaultItem(index, count);
                    }

                    list += '<li data-value="'+ count +'">' + count + unit +'</li>';
                    num++;
                }

                if( !isMatch ){
                    self.setDefaultItem(index, '01');
                }
            }else {
                for (var i = 1; i <= 12; i++) {
                    var count = i < 10 ? prefix + i : i;
                    list += '<li data-value="'+ count +'">' + count + unit +'</li>';
                }
                self.setDefaultItem(index, prefix + 1);
            }

            list += '<li></li><li></li>';
            document.querySelector('#dp-wrapper' + index).childNodes[0].innerHTML = list;
            setTimeout(function () {
                self.scrollInit(index, defaultNum);
            }, 0);
        },


        //获取日列表
        getDayList: function (index, defaultValue) {
            var self = this;
            var list = '<li></li><li></li>', defaultNum = '';

            var unit = "日", prefix = "0";
            if( self.options.type == 2 ){
                unit = "";
                prefix = "";
            }

            if( defaultValue ){
                var num = 0, isMatch = false;
                for (var i = 1; i <= 31; i++) {
                    var count = i < 10 ? prefix + i : i;
                    if ( defaultValue == count ) {
                        isMatch = true;
                        defaultNum = num;//默认选中的值
                        self.setDefaultItem(index, count);
                    }

                    list += '<li data-value="'+ count +'">' + count + unit +'</li>';
                    num++;
                }

                if( !isMatch ){
                    self.setDefaultItem(index, '01');
                }
            }else {
                for (var i = 1; i <= 31; i++) {
                    var count = i < 10 ? prefix + i : i;
                    list += '<li data-value="'+ count +'">' + count + unit +'</li>';
                }
                self.setDefaultItem(index, prefix + 1);
            }

            list += '<li></li><li></li>';
            document.querySelector('#dp-wrapper' + index).childNodes[0].innerHTML = list;
            setTimeout(function () {
                self.scrollInit(index, defaultNum);
            }, 0);
        },

        //隐藏picker
        HidePicker : function(){
            var self = this;

            document.querySelector('.zx_select').style.height = '0';
            self.remove_EventListen();

            setTimeout(function () {
                var modalBox = document.querySelector('.zx_mask');
                document.body.removeChild( modalBox );
                self.destroy();//销毁变量
            }, 200);
        },

        //点击事件
        eventClick: function () {
            var self = this;

            //取消按钮
            document.querySelector('.picker-cancel').addEventListener("touchstart", function (e) {
                e.stopPropagation();
                e.preventDefault();
                //隐藏picker
                self.HidePicker();
            });

            //确定按钮
            document.querySelector('.picker-ok').addEventListener("touchstart", function (e) {
                e.stopPropagation();
                e.preventDefault();

                var inputValue = '';
                for (var i = 0; i < self.textArray.length; i++) {
                    if (i == 0) {
                        inputValue += self.textArray[i].value;
                    } else {
                        inputValue += self.options.separator + self.textArray[i].value;
                    }
                }

                //回调函数
                if( self.options.callBack ){
                    self.options.callBack(inputValue);
                }

                //隐藏picker
                self.HidePicker();
            });
        },

        //设置默认参数值
        setDefaultOptions: function (params) {
            var self = this;

            //当前时间
            var date = new Date();
            var nowYear = date.getFullYear();
            var nowMonth = date.getMonth() + 1;
            var nowDay = date.getDate();

            var type = parseInt(params.type);
            if( type && (type < 0 || type > 3) ){
                params.type = 3;
            }else{
                params.type = type ? type : 3;
            }

            //默认分隔符
            params.separator = params.separator ? params.separator : "/";

            nowMonth = nowMonth < 10 ? "0" + nowMonth : nowMonth;
            nowDay = nowDay < 10 ? "0" + nowDay : nowDay;
            if( !params.defaultValue || params.defaultValue == "" ){
                if( params.type == 0 ){
                    params.defaultValue = nowYear;
                }else if( params.type == 1 ){
                    params.defaultValue = nowYear + params.separator + nowMonth;
                }else if( params.type == 2 ){
                    params.defaultValue = 7 + params.separator + 28;
                }else if( params.type == 3 ){
                    params.defaultValue = nowYear + params.separator + nowMonth + params.separator + nowDay;
                }
            }

            //默认最大最小年份
            params.maxYear = params.maxYear ? params.maxYear : (nowYear + 100);
            params.minYear = params.minYear ? params.minYear : (nowYear - 100);

            //参数
            return params;
        },

        //计算当前月有多少天
        getMonthLength: function () {
            var self = this;
            if ( self.options.type == 3 ) {
                var nowYear = self.textArray[0].value;
                var nowMonth = self.textArray[1].value;
                var leap = self.isLeap(nowYear);

                if( nowMonth == "02" ){
                    self.monthLen = 28 + leap;
                }else if( nowMonth == "01" || nowMonth == "03" || nowMonth == "05" || nowMonth == "07" || nowMonth == "08" || nowMonth == "10" || nowMonth == "12" ){
                    self.monthLen = 31;
                }else {
                    self.monthLen = 30;
                }
            }
        },

        //判断是否为闰年:(1)年份能被4整除，但不能被100整除；(2)年份能被400整除。
        isLeap : function (year) {
            if( (year % 4 == 0 && year % 100 != 0) || ( year % 400 == 0 ) ){
                return 1;
            }
            return 0;
        },

        // 所有输入失去焦点(隐藏键盘)
        enterNodesBlur: function () {
            var inputArr = document.querySelectorAll('input');
            for(var m = 0; m < inputArr.length; m++){
                inputArr[m].blur();
            }

            var textareaArr = document.querySelectorAll('textarea');
            for(var n = 0; n < textareaArr.length; n++){
                textareaArr[n].blur();
            }
        },

        //禁止默认事件
        touchDefault: function (e) {
            e.preventDefault();
        },

        //阻止冒泡&默认事件
        touchStop : function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        //添加监听事件
        add_EventListen: function () {
            var self = this;
            // document.addEventListener('touchend', self.touchDefault, false);
            // document.addEventListener('touchstart', self.touchDefault, false);
            document.addEventListener('touchmove', self.touchDefault, false);
        },

        //移除监听事件
        remove_EventListen: function () {
            var self = this;
            // document.removeEventListener('touchend', self.touchDefault, false);
            // document.removeEventListener('touchstart', self.touchDefault, false);
            document.removeEventListener('touchmove', self.touchDefault, false);
        },

        //picker销毁
        destroy: function () {
            var self = this;
            self.options = null;//参数
            self.scrollArray = [];//iscroll变量
            self.textArray = [];//选中的值
            self.isScrollTo = false;//是否是scrollTo 滚动
            self.monthLen = 30;
        }
    };

    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = DatePicker;
    } else {
        window.DatePicker = DatePicker;
    }
})(window, document, Math);
