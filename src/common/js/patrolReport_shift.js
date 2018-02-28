import 'babel-polyfill';
import {Route} from 'plugins/router/router';
import $ from 'plugins/jquery/jquery-vendor.js';
import 'amazeui';
import 'scss/common.scss';
import 'scss/style.scss';
import 'amazeui/dist/css/amazeui.css';
import FileManage from './patrolReport_add';

import data from '../json/config.json';
import {event,setTime, iscroll, map} from './patrolReport_common'


export default class PatrolReport_Shift{
    constructor(props) {
        const filter = require('tpl/filter.art');

        $('#patrolReport').prepend(filter());
        new FileManage();//文件管理列表
        setTime();
        
        event();
        map();

        this.init();
        iscroll();
    }

    init() {   
        const item = require('tpl/fileExplorerItem.art');
        Array(14).fill(0).map((value, index)=> {
            new FileExplorerItem({item, index});
            
        })
    }
}

class FileExplorerItem{
    constructor(props) {
        $("#filewrappercontent").append(props.item());
    }
    
}
