import 'scss/common.scss';
import 'scss/style.scss';
import 'amazeui/dist/css/amazeui.css';
import 'amazeui';
import 'babel-polyfill';
import $ from 'plugins/jquery/jquery-vendor.js';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'video.js/dist/lang/zh-CN';
import data from '../json/config.json';
import TimeLine from './timeline.js';
import './event';
require('../img/car2.jpg');
require('../img/car3.jpg');
require('../img/people1.jpg');
require('../img/2.png');
require('../img/car1.jpg');
require('../img/1.jpg');
// var _img = data.imgList["0"].src;
// _img.forEach((value)=>{
//     console.log(value)
//     var _item = require(value);
// })

let detailList = require('tpl/detailList.art');
// let videoList = require('tpl/videoList.art');
let summaryList = require('tpl/summaryList.art');
let imgList = require('tpl/imgLists.art');
let myPlayer;
// let iscroll;
function init(){
    $('.reportList').html(detailList());
    $('#summary').html(summaryList());
    $('#imgList').html(imgList({data:data.imgList["0"]}));
    map();
    tab();
    videoPlay();
    event();
    // videoListF();
    // iscroll = new Iscroll();
    // iscroll.init();
    new TimeLine({
        "mapContainer": "map",
        "timeLineId": "timeLine",
        "width": "80%",
        "height": "25",
    });
}
function videoPlay(){
    myPlayer = videojs("video",{
        language:"zh-CN",
        // isFullscreen:false,
    }).ready(function(){
        myPlayer = this;
        // myPlayer.play();
        console.log(myPlayer.width())
    });
}
function tab(){
    var tabCounter = 0;
    var $tab = $('#doc-tab-demo-1');
    var $nav = $tab.find('.am-tabs-nav');
    var $bd = $tab.find('.am-tabs-bd');

    function addTab() {
        var nav = '<li><span class="am-icon-close"></span>' +
            '<a href="javascript: void(0)">标签 ' + tabCounter + '</a></li>';
        var content = '<div class="am-tab-panel">动态插入的标签内容' + tabCounter + '</div>';

        $nav.append(nav);
        $bd.append(content);
        tabCounter++;
        $tab.tabs('refresh');
    }

    // 动态添加标签页
    $('.js-append-tab').on('click', function() {
        addTab();
    });

    // 移除标签页
    $nav.on('click', '.am-icon-close', function() {
        var $item = $(this).closest('li');
        var index = $nav.children('li').index($item);

        $item.remove();
        $bd.find('.am-tab-panel').eq(index).remove();

        $tab.tabs('open', index > 0 ? index - 1 : index + 1);
        $tab.tabs('refresh');
    });
}
// function videoListF(){
//     document.querySelector('.videoList').innerHTML = videoList();
// }
// class Iscroll {
//     constructor() {}
//     init() {
//         let IScroll = $.AMUI.iScroll;
//         this.myScroll = new IScroll('#wrapper',{
//             mouseWheel: true,
//             scrollbars: true
//         });
//         // iScroll.refresh()
//     }
// }

function map(){
    let state = {
        "locations": [
            [ 118.737544, 31.991092 ],
            [ 118.736761, 31.990009 ],
            [ 118.737818, 31.989568 ],
            [ 118.738660, 31.989104 ],
            [ 118.739078, 31.988886 ]
        ]
    };
    let arr = [
        {
            people:2,
            car:3,
            goods:5,
            face:10,
            dian:8
        },{
            people:5,
            car:2,
            goods:12,
            face:14,
            dian:1,
        },{
            people:7,
            car:12,
            goods:2,
            face:10,
            dian:6,
        },{
            people:2,
            car:12,
            goods:33,
            face:5,
            dian:9,
        },{
            people:15,
            car:22,
            goods:2,
            face:24,
            dian:11,
        }
    ];
    let title,content=[];
    arr.forEach((value)=>{
        let content_i = [];
        let imnfor = '人：'+value.people + '<span style="display: inline-block;width:8px;height:1px;"></span> 车：'+value.car +' <span style="display: inline-block;width:8px;height:1px;"></span>物：'+value.goods +' <span style="display: inline-block;width:8px;height:1px;"></span>脸：'+value.face +'<span style="display: inline-block;width:8px;height:1px;"></span> 电：'+value.dian ;
        title = '<div class="myInformWinTitle">采集点信息</div>';
        content_i.push("<span class='myInformWinTitleSpan'>地址：</span><span class='myInformWinTitleContent'>建邺区云龙山路88号</span>");
        content_i.push("<span class='myInformWinTitleSpan'>要素数量：</span><span class='myInformWinTitleContent'>"+imnfor+"</span>");
        content_i.push("<span class='myInformWinTitleSpan'>开始时间：</span><span class='myInformWinTitleContent'>2018-01-01 10:10:10</span>");
        content_i.push("<span class='myInformWinTitleSpan'>结束时间：</span><span class='myInformWinTitleContent'>2018-01-02 15:10:10</span>");
        content_i = content_i.join('<br/>');
        content.push(content_i);
    });
    new MyMap(state,title,content).init();
}
class MyMap {
    constructor(state,title,content) {
        this.state = state;
        this.title = title;
        this.content = content;
    }
    init() {
        let center = [118.736662, 31.9901];
        this.map = new AMap.Map('map', {
            resizeEnable: true,
            zoom:16,
            center: center
        });
        //添加轨迹线
        let polyline = new AMap.Polyline({
            path: this.state.locations,          //设置线覆盖物路径
            strokeColor: "#3366FF", //线颜色
            strokeOpacity: 1,       //线透明度
            strokeWeight: 5,        //线宽
            strokeStyle: "solid",   //线样式
            strokeDasharray: [10, 5] //补充线样式
        });
        polyline.setMap(this.map);

        //标注
        this.addMarker();
        //实例化信息窗体
        this.createInfoWindow();
    }
    addMarker() {
        this.state.locations.map((item,index,array) => {
            let marker = new AMap.Marker({
                icon: (index === array.length-1?
                    "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" :
                    "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"),
                position: item,
                content:(index === array.length-1?
                    '<img data-id="'+(index+1)+'" src="http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png">':
                    '<img data-id="'+(index+1)+'" src="http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png">'),
            });
            AMap.event.addListener(marker, 'click', () => {
                //实例化信息窗体
                this.infoWindow.setContent(this.setInfoWindow(this.title, this.content[index]));
                this.infoWindow.open(this.map, marker.getPosition());
                $('#imgList').html(imgList({data:data.imgList[$(marker.getContent()).data('id')]}));
            });
            marker.setMap(this.map);
        });
    }
    createInfoWindow() {
        //实例化信息窗体
        this.infoWindow = new AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            // content: this.setInfoWindow(this.title, this.content),
            offset: new AMap.Pixel(16, -45)
        });
    }
    setInfoWindow(_title,_content) {//构建自定义信息窗体
        let info = document.createElement("div");
        info.className = "info";
        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        let top = document.createElement("div");
        let titleD = document.createElement("div");
        let closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = _title;
        closeX.src = require('../img/icon/close.png');
        closeX.onclick = this.closeInfoWindow.bind(this);

        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        let middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = _content;
        info.appendChild(middle);

        // 定义底部内容
        let bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        let sharp = document.createElement("img");
        sharp.src = require("../img/icon/sharp.png");
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
    }
    closeInfoWindow() { //关闭信息窗体
        this.map.clearInfoWindow();
    }
}
function event(){
    $(document).on('click','#allList',function(){
        $('#imgList').html(imgList({data:data.imgList["0"]}));
    });
    // $(document).on('click','.vjs-fullscreen-control',function(){
    //     // alert(111);
    //     myPlayer.height(360);
    //     myPlayer.width(640);
    // });


}
init();
