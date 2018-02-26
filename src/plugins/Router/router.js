// 使用一个hash来存储我们的路由
//注册路由函数
let routers = {};
function Route(){}
Route.prototype.addPath = function(path,templateTpl,data,controller){
    routers[path] = {
        templateTpl: templateTpl,
        data:data,
        controller : controller
    };
};
//路由的处理程序
function router(){
    let _hash = location.hash.slice(1) || '/';
    let routerObj = routers[_hash];
    if(routerObj){
        let _html = routerObj.templateTpl(routerObj.data);
        document.querySelector('#view').innerHTML = _html;
        routerObj.controller && routerObj.controller();
    }
}
//监听hash变化，或者刷新
window.addEventListener('load', router,false);
window.addEventListener('hashchange',router,false);
export {Route};
