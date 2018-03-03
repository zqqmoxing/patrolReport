import 'babel-polyfill';
import {Route} from 'plugins/router/router';
import $ from 'plugins/jquery/jquery-vendor.js';
import 'amazeui';
import 'scss/common.scss';
import 'scss/style.scss';
import 'scss/global.scss';
import 'amazeui/dist/css/amazeui.css';
import FileManage from './patrolReport_add';

import data from '../json/config.json';
import {event,setTime, iscroll, map} from './patrolReport_common'


export default class FileBrowser{
    static getInstance() {
		if (!FileBrowser.instance) {
			FileBrowser.instance = new FileBrowser();
		}
		return FileBrowser.instance;
    }
    
    constructor(props) {
        const filter = require('tpl/filter.art');

        $('#patrolReport').prepend(filter());
        new FileManage();//文件管理列表
        setTime();
        
        event();
        map();

        this.init(14);
        // iscroll();
    }

    init(length) {   
        $("#filewrappercontent").html("")
        const item = require('tpl/fileExplorerItem.art');

        Array(3).fill(0).map((value, index)=> {
            new FileExplorerItem({item, index, ctg:'folder'});
        }) 

        Array(length).fill(0).map((value, index)=> {
            new FileExplorerItem({item, index, ctg:'file'});
        }) 
        
        $("#filewrappercontent .item-folder").on("dblclick", function(e){
           FileBrowser.getInstance().init(parseInt(Math.random()*15+1))
        });

        $("#filewrappercontent .item").on("click", function(e){
            // console.log(this.className)
            $("#filewrappercontent .item").removeClass("item-select");//.addClass("item-disselect");
            $(this).addClass("item-select");
        });


        

    }
}

class FileExplorerItem{
    constructor(props) {
        // console.log(props)
        $("#filewrappercontent").append(props.item({index:props.index,ctg:props.ctg}));
    }
    
}
