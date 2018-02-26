export default class TimeLine {

    static getItemHeight(item) {return item.offsetHeight}
    static getItemWidth(item) {return item.offsetWidth}

    constructor(props) {
        this.recordItem = [];
        let mapContainer = document.getElementById(props.mapContainer);
        let timeLine = document.createElement("div");
        timeLine.id = props.timeLineId;
        timeLine.style.width = props.width;
        timeLine.style.borderRadius = '10px'
        timeLine.style.height = props.height+"px";
        timeLine.style.margin = "0px auto"
        timeLine.style.position = 'relative';
        timeLine.style.top = (mapContainer.offsetHeight-props.height-20)+"px";
        timeLine.style.backgroundColor = 'rgba(158, 158, 158, 0.7)';
        mapContainer.appendChild(timeLine);
        this.timeLine = timeLine;
        this.drawTimeLine()
    }

    drawTimeLine() {
        let _height = TimeLine.getItemHeight(this.timeLine), _width = TimeLine.getItemWidth(this.timeLine)
        let startTime = "10:30", endTime = "11:00";
        //底层画布
        let canvas = document.createElement('canvas');
        canvas.id = 'main';
        canvas.width  = _width;
        canvas.height = _height;
        canvas.style.position = 'absolute';
        canvas.style.padding = 0;
        canvas.style.margin = 0;
        this.timeLine.appendChild(canvas);
        //获取canvas绘图上下文
        let context = canvas.getContext('2d');
        context.lineWidth = 2;
        context.lineCap='round';
        //开始绘制
        context.beginPath();
        context.clearRect(0,0,_width,_height);
        context.strokeStyle = '#ffffff';
        context.moveTo(50, 0);
        context.lineTo(50, _height);
        context.moveTo(_width-50, 0);
        context.lineTo(_width-50, _height);
        context.moveTo(50, _height*0.5);
        context.lineTo(_width-50,  _height*0.5);
        context.fillStyle = '#ffffff';
        context.font="10px Verdana";
        context.fillText(startTime, 7, _height*0.6);
        context.fillText(endTime, _width-43, _height*0.6);
        context.stroke();
        context.closePath();
        context.beginPath();
        //分割时间段
        const duration = (endTime.split(":")[0] - startTime.split(":")[0])*60 + (endTime.split(":")[1] - startTime.split(":")[1]);
        //添加要素点
        //计算两个时间差的比例
        let rate = (time) => (((time.split(":")[0] - startTime.split(":")[0])*60 + (time.split(":")[1] - startTime.split(":")[1]) )/duration)
        let data = TimeLine.json();
        data.items.map( (item, index, array) => {
            let cur = rate(item.time)
            context.strokeStyle = 'rgba(200,0,0,0.5)';
            context.moveTo(50+cur*(_width-100), _height*0.2);
            context.lineTo(50+cur*(_width-100), _height*0.8)
            this.recordItem.push(50+cur*(_width-100));
        })
        //绘制
        context.stroke();
        context.closePath();
        //上层用户操作画布
        let canvas2 = document.createElement('canvas');
        canvas2.id = 'top';
        canvas2.width  = _width-100;
        canvas2.height = _height;
        canvas2.style.position = 'absolute';
        canvas2.style.padding = 0;
        canvas2.style.margin = 0;
        canvas2.style.left = '50px';
        canvas2.style.cursor = 'pointer';
        this.timeLine.appendChild(canvas2);
        this.eventHandle(canvas2)

    }

    eventHandle(canvas2) {
        let _height = TimeLine.getItemHeight(this.timeLine), _width = TimeLine.getItemWidth(this.timeLine)
        let startTime = "10:30", endTime = "11:00";
        //判断是否mousedown
        let isDown = false;
        //记录初始位置X坐标
        let startScreenX,startLayerX;

        document.body.addEventListener('mousemove', (e)=>{
            if(isDown && Math.abs(e.screenX-startScreenX) > 1) {
                let context = canvas2.getContext('2d');
                context.clearRect(0, 0, _width, _height);
                context.lineWidth = 1;
                context.beginPath();
                context.fillStyle = 'rgba(0, 0, 200, 0.2)';
                context.fillRect(startLayerX, 0, e.screenX-startScreenX, _height);
                context.closePath();
            }
        })
        canvas2.addEventListener('mousedown', (e) => {
            isDown = true;
            startScreenX = e.screenX;
            startLayerX = e.offsetX;
            let context = canvas2.getContext('2d');
            context.clearRect(0, 0, _width, _height);
            context.lineWidth = 1;
            context.beginPath();
            context.fillStyle = 'rgba(0, 0, 200, 0.2)';
            context.moveTo(e.offsetX, 0);
            context.lineTo(e.offsetX, _height);
            context.stroke()
            context.closePath();
        })
        document.body.addEventListener('mouseup', (e) => {
            isDown = false
        })
        canvas2.addEventListener('mousemove', (e)=> {
            let transTime = (time,startTime) => {
                let startTimeMin = startTime.split(":")[0]*60+startTime.split(":")[1]*1;
                let currentTimeMin = startTimeMin + time;
                return parseInt(currentTimeMin/60)+":"+currentTimeMin%60;
            };
            const duration = (endTime.split(":")[0] - startTime.split(":")[0])*60 + (endTime.split(":")[1] - startTime.split(":")[1]);
            let time = Math.ceil(e.offsetX/canvas2.offsetWidth*duration)
            //展示时间
            let createTimeDiv = () => {
                let div = document.createElement("div");
                div.id = "showTime";
                div.style.backgroundColor = "rgba(158, 158, 158, 0.5)";
                div.style.position = "absolute";
                div.style.borderRadius = "3px";
                div.style.font = "10px Verdana";
                document.body.appendChild(div);
                return div;
            };
            let div  = document.getElementById("showTime") || createTimeDiv();
            let onTime = transTime(time, startTime);
            div.innerHTML = onTime;
            div.style.left = e.pageX-15+"px";
            div.style.top = e.pageY-div.offsetHeight-20+ "px";
            let shotArr = TimeLine.json().items.filter((item)=>(item.time === onTime));
            if (shotArr.length > 0) {
                shotArr.map((item) => {
                    div.innerHTML+= "</br>"+item.name;
                    div.style.top = e.pageY-div.offsetHeight-20+ "px";
                })
            }
        })
    }


    static json() {
        return {
            "items": [
                {
                    "time": "10:31",
                    "name": "a"
                },
                {
                    "time": "10:35",
                    "name": "b"
                },
                {
                    "time": "10:36",
                    "name": "c"
                },
                {
                    "time": "10:40",
                    "name": "d"
                },
                {
                    "time": "10:41",
                    "name": "e"
                },
                {
                    "time": "10:45",
                    "name": "f"
                },
                {
                    "time": "10:45",
                    "name": "g"
                },
                {
                    "time": "10:49",
                    "name": "h"
                },
                {
                    "time": "10:51",
                    "name": "i"
                },
                {
                    "time": "10:54",
                    "name": "j"
                },
                {
                    "time": "10:57",
                    "name": "k"
                }
            ]
        }
    }
}