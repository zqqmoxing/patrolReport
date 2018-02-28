function setTime(){
    var startDate = new Date();
    var endDate = new Date();
    var $alert = $('#my-alert');
    // $('#my-start').datepicker().
    $('#my-startDate').datepicker().
    on('changeDate.datepicker.amui', function(event) {
        if (event.date.valueOf() > endDate.valueOf()) {
            $alert.find('p').text('开始日期应小于结束日期！').end().fadeIn();
            setTimeout(function(){
                $alert.fadeOut();
            },2000);
        } else {
            $alert.fadeOut();
            startDate = new Date(event.date);
            $('#my-startDate').text($('#my-startDate').data('date'));
        }
        $(this).datepicker('close');
    });

    $('#my-endDate').datepicker().
    on('changeDate.datepicker.amui', function(event) {
        if (event.date.valueOf() < startDate.valueOf()) {
            $alert.find('p').text('结束日期应大于开始日期！').end().fadeIn();
            setTimeout(function(){
                $alert.fadeOut();
            },2000);
        } else {
            $alert.fadeOut();
            endDate = new Date(event.date);
            $('#my-endDate').text($('#my-endDate').data('date'));
        }
        $(this).datepicker('close');
    });
}
//滚动条
function iscroll(){
    let IScroll = $.AMUI.iScroll;
    let myScroll = new IScroll('#filewrapper', {
        mouseWheel: true,
        scrollbars: true,
    });
    console.dir(myScroll.options);
    // var app = new EventsList(null, {
    //     api: 'https://api.douban.com/v2/event/list',
    //     params: {
    //         start: 100,
    //         type: 'music',
    //         count: 10,
    //         loc: 'beijing'
    //     }
    // });
    // app.init();
}


//事件
function event() {
    
    let theme = 'list';//list or map    
    $('.moreSelect').on('click', function() {
        if( $('.moreSelect').hasClass("open") ) {
            $('.moreSelect').html("展开筛选");
            $('.moreSelect').removeClass("open");
            $('.more-select').fadeOut(function(){
                $('.confirmSelect').hide();
                $('#filewrapper').css("top","60px");
                $('#map').css("top","55px");
            });
        } else {
            $('.moreSelect').html("收起筛选");
            $('.moreSelect').addClass("open");
            $('.more-select').fadeIn();
            $('.confirmSelect').show();
            $('#filewrapper').css("top","309px");
            $('#map').css("top","304px");
        }
    });
    $('.theme').on('click',function () {
        // $('.reportTable').toggle();
        $('#filewrapper').toggle();
        $('#map').toggle();
        if(theme == 'list') {
            theme = 'map';
            $('.theme i').removeClass('am-icon-angle-double-right').addClass('am-icon-angle-double-left');
            $('.theme').attr('title','显示列表');
        } else {
            theme = 'list';
            $('.theme i').removeClass('am-icon-angle-double-left').addClass('am-icon-angle-double-right');
            $('.theme').attr('title','显示地图');
        }
    })
}

//map
function map(){
    let state = {
        "locations": [
            [ 118.737544, 31.991092 ],
            [ 118.736761, 31.990009 ],
            [ 118.737818, 31.989568 ],
            [ 118.738660, 31.989104 ],
            [ 118.739078, 31.988886 ]
        ],
        "content": [
            '2018-01-01','2018-01-02','2018-01-03','2018-01-04',
            '2018-01-05'
        ]
    };
    new MyMap(state).init();
}
class MyMap {
    constructor(state) {
        this.state = state;
    }
    init() {
        let center = [118.737662, 31.9901];
        this.map = new AMap.Map('map', {
            resizeEnable: true,
            zoom:16,
            center: center
        });
        //标注
        this.addMarker();
        //实例化信息窗体
        this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    }
    addMarker() {
        this.state.locations.map((item,index) => {
            let marker = new AMap.Marker({
                icon: require('../img/icon/fileIcon1.png'),
                position: item,
            });
            marker.on('mouseover', (e) => {
                //实例化信息窗体
                this.infoWindow.setContent(this.state.content[index]);
                this.infoWindow.open(this.map, e.target.getPosition());
            });
            marker.on('mouseout', (e) => {
                //实例化信息窗体
                this.map.clearInfoWindow();
            });
            marker.setMap(this.map);
        });
    }
}

export {event,setTime, iscroll, map};