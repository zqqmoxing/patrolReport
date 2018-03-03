import 'babel-polyfill';
import $ from 'plugins/jquery/jquery-vendor.js';
import 'amazeui';
import 'amazeui/dist/css/amazeui.css';
import 'scss/common.scss';
import 'scss/style.scss';

import 'ztree/css/metroStyle/metroStyle.css';
// import 'ztree/css/zTreeStyle/zTreeStyle.css';
import 'ztree'
import FileBrowser from './patrolReport_shift'

export default class FileManage {
	static getInstance() {
		if (!FileManage.instance) {
			FileManage.instance = new FileManage();
		}
		return FileManage.instance;
	}

    constructor() {

		let MoveTest = {
			errorMsg: "放错了...请选择正确的类别！",
			curTarget: null,
			curTmpTarget: null,
			noSel: function() {
				try {
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
				} catch(e){}
			},
			dragTree2Dom: function(treeId, treeNodes) {
				return !treeNodes[0].isParent;
			},
			prevTree: function(treeId, treeNodes, targetNode) {
				return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
			},
			nextTree: function(treeId, treeNodes, targetNode) {
				return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
			},
			innerTree: function(treeId, treeNodes, targetNode) {
				console.log(targetNode.pId)
				return targetNode.pId;
				// return targetNode!=null && targetNode.isParent && targetNode.tId == treeNodes[0].parentTId;
			},
			dragMove: function(e, treeId, treeNodes) {
				console.log("dragMove")
				var p = null, pId = 'dom_' + treeNodes[0].pId;
				if (e.target.id == pId) {
					p = $(e.target);
				} else {
					p = $(e.target).parent('#' + pId);
					if (!p.get(0)) {
						p = null;
					}
				}

				$('.domBtnDiv .active').removeClass('active');
				if (p) {
					p.addClass('active');
				}
			},
			dropTree2Dom: function(e, treeId, treeNodes, targetNode, moveType) {
				console.log("dropTree2Dom")
				var domId = "dom_" + treeNodes[0].getParentNode().id;
				if (moveType == null && (domId == e.target.id || $(e.target).parents("#" + domId).length > 0)) {
					var zTree = $.fn.zTree.getZTreeObj("customTree");
					zTree.removeNode(treeNodes[0]);

					var newDom = $("span[domId=" + treeNodes[0].id + "]");
					if (newDom.length > 0) {
						newDom.removeClass("domBtn_Disabled");
						newDom.addClass("domBtn");
					} else {
						$("#" + domId).append("<span class='domBtn' domId='" + treeNodes[0].id + "'>" + treeNodes[0].name + "</span>");
					}
					MoveTest.updateType();
				} else if ( $(e.target).parents(".domBtnDiv").length > 0) {
					alert(MoveTest.errorMsg);
				}
			},
			dom2Tree: function(e, treeId, treeNode) {
				console.log("dom2Tree")
				var target = MoveTest.curTarget, tmpTarget = MoveTest.curTmpTarget;
				if (!target) return;
				var zTree = $.fn.zTree.getZTreeObj("customTree"), parentNode;
				// debugger
				if (treeNode != null && treeNode.isParent ) {//&& "dom_" + treeNode.id == target.parent().attr("id")
					parentNode = treeNode;
				} else if (treeNode != null && !treeNode.isParent ) {//&& "dom_" + treeNode.getParentNode().id == target.parent().attr("id")
					parentNode = treeNode.getParentNode();
				}

				if (tmpTarget) tmpTarget.remove();
				if (!!parentNode) {
					// debugger
					var nodes = zTree.addNodes(parentNode, {id:target.attr("id"), name: target[0].children[0].innerText});
					zTree.selectNode(nodes[0]);
				// } else {
				// 	target.removeClass("domBtn_Disabled");
				// 	target.addClass("domBtn");
				// 	alert(MoveTest.errorMsg);
				}
				MoveTest.updateType();
				MoveTest.curTarget = null;
				MoveTest.curTmpTarget = null;
			},
			updateType: function() {
				var zTree = $.fn.zTree.getZTreeObj("customTree"),
				nodes = zTree.getNodes();
				for (var i=0, l=nodes.length; i<l; i++) {
					var num = nodes[i].children ? nodes[i].children.length : 0;
					nodes[i].name = nodes[i].name.replace(/ \(.*\)/gi, "") + " (" + num + ")";
					zTree.updateNode(nodes[i]);
				}
			},
			bindDom: function() {
				$("#filewrappercontent").bind("mousedown", MoveTest.bindMouseDown);
			},
			bindMouseDown: function(e) {
				var target = e.target;
				// console.log(target)
				// console.log("mousedown",target.className)
				if (target!=null && target.className.indexOf("item")>-1) {
					var doc = $(document), target = $(target),
					docScrollTop = doc.scrollTop(),
					docScrollLeft = doc.scrollLeft();
					// target.addClass("domBtn_Disabled");
					// target.removeClass("domBtn");
					
					let curDom = $("<ul class='item-tmp'>" + target[0].children[0].innerText + "</ul>");
					// curDom.appendTo("body");

					curDom.css({
						"position": "relative",
						"top": (e.clientY + docScrollTop + 3) + "px",
						"left": (e.clientX + docScrollLeft + 3) + "px"
					});
					MoveTest.curTarget = target;
					MoveTest.curTmpTarget = curDom;

					doc.bind("mousemove", MoveTest.bindMouseMove);
					doc.bind("mouseup", MoveTest.bindMouseUp);
					doc.bind("selectstart", MoveTest.docSelect);
				}
				if(e.preventDefault) {
					e.preventDefault();
				}
			},
			bindMouseMove: function(e) {
				MoveTest.curTmpTarget.appendTo("body")
				MoveTest.noSel();
				var doc = $(document), 
				docScrollTop = doc.scrollTop(),
				docScrollLeft = doc.scrollLeft(),
				tmpTarget = MoveTest.curTmpTarget;
				if (tmpTarget) {
					tmpTarget.css({
						"top": (e.clientY + docScrollTop + 3) + "px",
						"left": (e.clientX + docScrollLeft + 3) + "px"
					});
				}
				return false;
			},
			bindMouseUp: function(e) {
				var doc = $(document);
				doc.unbind("mousemove", MoveTest.bindMouseMove);
				doc.unbind("mouseup", MoveTest.bindMouseUp);
				doc.unbind("selectstart", MoveTest.docSelect);

				var target = MoveTest.curTarget, tmpTarget = MoveTest.curTmpTarget;
				if (tmpTarget) tmpTarget.remove();

				if ($(e.target).parents("#customTree").length == 0) {
					if (target) {
						// target.removeClass("domBtn_Disabled");
						// target.addClass("domBtn");
					}
					MoveTest.curTarget = null;
					MoveTest.curTmpTarget = null;
				}
			},
			bindSelect: function() {
				return false;
			}
		};

		MoveTest.bindDom();

		let IScroll = $.AMUI.iScroll;
		const option = {
            mouseWheel: true,
            scrollbars: true
        }
        this.datePackageScroll = new IScroll('.datePackage', option);
        this.areaPackageScroll = new IScroll('.areaPackage', option);
        // this.cunstomPackageScroll = new IScroll('.cunstomPackage', option);
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
			},
			callback: {
				onClick: treeNodeClick
			}
        };
        
        this.setting3 = {
            view: {
				addHoverDom: addHoverDom,
				removeHoverDom: removeHoverDom,
				selectedMulti: false,
				dblClickExpand: false,
				showLine: false,
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				removeTitle: "删除",
				renameTitle: "重命名",
				showRemoveBtn: showRemoveBtn,
				showRenameBtn: showRenameBtn,
                drag: {
					isMove: true,
					isCopy: true,
					prev: MoveTest.prevTree,
					next: MoveTest.nextTree,
					inner: MoveTest.innerTree
				}
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0"
				}
            },
            callback: {
				beforeDrag: MoveTest.dragTree2Dom,
				onDrop: MoveTest.dropTree2Dom,
				onDragMove: MoveTest.dragMove,
				onMouseUp: MoveTest.dom2Tree,
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
			{ id:1, pId:0, name:"自定义(55)", open:true },
			{ id:11, pId:1, name:"名称1(10)" },
			{ id:12, pId:1, name:"名称2(20)" },
			{ id:13, pId:1, name:"名称3(25)" },
        ];
        
        $.fn.zTree.init($("#treeDemo"), this.setting1, this.zNodes1);
        $.fn.zTree.init($("#treeDemo2"), this.setting1, this.zNodes2);
		$.fn.zTree.init($("#customTree"), this.setting3, this.zNodes3);

		this.datePackageScroll.refresh();
        this.areaPackageScroll.refresh();
        // this.cunstomPackageScroll.refresh();
	
		function treeNodeClick(event, treeId, treeNode) {
			console.log(treeNode.tId + ", " + treeNode.name, treeNode);
			if (treeNode.isParent)
				FileBrowser.getInstance().init(parseInt(Math.random()*15+1))
			return true;
		}
        
		var className = "dark";
        function beforeDrop(treeId, treeNodes, targetNode, moveType) {
			console.log("beforeDrop")
            return targetNode ? targetNode.drop !== false : true;
        }

        function beforeDrag(treeId, treeNodes) {
			console.log("beforeDrag")
            for (var i=0,l=treeNodes.length; i<l; i++) {
                if (treeNodes[i].drag === false) {
                    return false;
                }
            }
            return true;
		}
		function onDrag(treeId, treeNodes, targetNode, moveType) {
			console.log(treeId, treeNodes, targetNode, moveType)
			return true;
		}
		function opDrop() {
			return true;
		}
		function onMouseUp() {
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
			return treeNode.pId;
		}
		function showRenameBtn(treeId, treeNode) {
			return treeNode.pId;
		}

        var newCount = 1;
        let _this = this;
		function addHoverDom(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加' onfocus='this.blur();'></span>";
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
			var zTree = $.fn.zTree.getZTreeObj("customTree");
			zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
		}



		

    }


    
}

