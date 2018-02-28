import 'babel-polyfill';
import $ from 'plugins/jquery/jquery-vendor.js';
import 'amazeui';
import 'amazeui/dist/css/amazeui.css';
import 'scss/common.scss';
import 'scss/style.scss';

import 'ztree/css/zTreeStyle/zTreeStyle.css';
import 'ztree'

export default class FileManage {
    constructor() {
		let IScroll = $.AMUI.iScroll;
		const option = {
            mouseWheel: true,
            scrollbars: true
        }
        this.datePackageScroll = new IScroll('.datePackage', option);
        this.areaPackageScroll = new IScroll('.areaPackage', option);
        this.cunstomPackageScroll = new IScroll('.cunstomPackage', option);
        this.setting1 = {
			edit: {
				enable: false,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			data: {
				simpleData: {
					enable: true
				}
			}
        };
        
        this.setting3 = {
            view: {
				addHoverDom: addHoverDom,
				removeHoverDom: removeHoverDom,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtn,
				showRenameBtn: showRenameBtn
                
			},
			data: {
				simpleData: {
					enable: true
				}
            },
            callback: {
				beforeDrag: beforeDrag,
                beforeDrop: beforeDrop,
                beforeEditName: beforeEditName,
				beforeRemove: beforeRemove,
				beforeRename: beforeRename,
				onRemove: onRemove,
				onRename: onRename,
				onClick: treeNodeClick
			}
        };
        
		this.zNodes1 =[
			{ id:1, pId:0, name:"2018年(55)", open:true},
			{ id:11, pId:1, name:"12月(10)"},
			{ id:12, pId:1, name:"11月(20)"},
			{ id:13, pId:1, name:"10月(25)"},
			{ id:2, pId:0, name:"2017年(55)", open:true},
			{ id:21, pId:2, name:"12月(10)"},
			{ id:22, pId:2, name:"11月(20)"},
			{ id:23, pId:2, name:"10月(25)"},
			{ id:3, pId:0, name:"2016年(55)", open:true},
			{ id:31, pId:3, name:"12月(10)"},
			{ id:32, pId:3, name:"11月(20)"},
			{ id:33, pId:3, name:"10月(25)"}
        ];
        this.zNodes2 =[
			{ id:1, pId:0, name:"建邺区(55)", open:true},
			{ id:11, pId:1, name:"楠溪江东街(10)"},
			{ id:12, pId:1, name:"黄山路(20)"},
			{ id:13, pId:1, name:"云龙山路(25)"},
			{ id:2, pId:0, name:"玄武区", open:true},
			{ id:3, pId:0, name:"鼓楼区", open:true},
        ];
        this.zNodes3 =[
			{ id:1, pId:0, name:"自定义(55)", open:true, datalength:55},
			{ id:11, pId:1, name:"名称1(10)"},
			{ id:12, pId:1, name:"名称2(20)"},
			{ id:13, pId:1, name:"名称3(25)"},
        ];
        
        $.fn.zTree.init($("#treeDemo"), this.setting1, this.zNodes1);
        $.fn.zTree.init($("#treeDemo2"), this.setting1, this.zNodes2);
		$.fn.zTree.init($("#customTree"), this.setting3, this.zNodes3);
		this.datePackageScroll.refresh();
        this.areaPackageScroll.refresh();
        this.cunstomPackageScroll.refresh();
	
		function treeNodeClick(event, treeId, treeNode) {
			console.log(treeNode.tId + ", " + treeNode.name, treeNode);
		}
        
		var className = "dark";
        function beforeDrop(treeId, treeNodes, targetNode, moveType) {
            return targetNode ? targetNode.drop !== false : true;
        }

        function beforeDrag(treeId, treeNodes) {
			// console.log(treeNodes[i].drag)
            for (var i=0,l=treeNodes.length; i<l; i++) {
                if (treeNodes[i].drag === false) {
                    return false;
                }
            }
            return true;
        }
		function beforeEditName(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			var zTree = $.fn.zTree.getZTreeObj("customTree");
			zTree.selectNode(treeNode);
			setTimeout(function() {
				zTree.editName(treeNode);
			}, 0);
			return false;
		}
		function beforeRemove(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			var zTree = $.fn.zTree.getZTreeObj("customTree");
			zTree.selectNode(treeNode);
			return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
		}
		function onRemove(e, treeId, treeNode) {
		}
		function beforeRename(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			if (newName.length == 0) {
				setTimeout(function() {
					var zTree = $.fn.zTree.getZTreeObj("customTree");
					zTree.cancelEditName();
					alert("节点名称不能为空.");
				}, 0);
				return false;
			}
			return true;
		}
		function onRename(e, treeId, treeNode, isCancel) {
		}
		function showRemoveBtn(treeId, treeNode) {
			// console.log(treeNode)
			return treeNode.pId;
			// return true;
		}
		function showRenameBtn(treeId, treeNode) {
			// return !treeNode.isLastNode;
			return true;
		}

        var newCount = 1;
        let _this = this;
		function addHoverDom(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='add node' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", (e) => {
				var zTree = $.fn.zTree.getZTreeObj("customTree");
                zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"自定义" + (newCount++)});
                _this.cunstomPackageScroll.refresh();
				return false;
			});
		};
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};
		function selectAll() {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
		}

		(function removeEvent() {
			$("#customTree.ztree").off("dblclick");
			console.log($("#customTree a").length)
		})()


    }


    
}

