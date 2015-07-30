/***
* Drag.js: 拖动绝对定位的元素
* elementToDrag 接收mousedown事件的元素，必须绝对定位
* 改变 style.top 和 style.left 
* event: mousedown 的事件对象
**/

function drag (elementToDrag, event) {
	//初始鼠标位置，转换为文档坐标
	var scroll = getScrollOffsets();  //来自其他地方的工具函数
	var startX = event.clientX + scroll.x;
	var startY = event.clientY + scroll.y;

	// 在文档坐标下，待拖动元素的初始位置；
	// 因为elementToDrag 是绝对定位，可假设 offsetParent 是 body 元素
	var origX = elementToDrag.offsetLeft;
	var origY = elementToDrag.offserTop;

	// 计算mousedown事件和元素左上角的距离，另存为鼠标移动距离
	var deltaX = startX - origX;
	var deltaY = startY - origY;

	// 注册用于响应mousemove和mouseup事件的处理程序
	if (document.addEventListener) { //标准事件模型
		document.addEventListener("mousemove", moveHandler, true);
		document.addEventListener("mouseup", upHandler, true);
	} else if (document.attachEvent) { //用于IE5-IE8
		elementToDrag.setCapture();
		elementToDrag.attachEvent("onmousemove", moveHandler);
		elementToDrag.attachEvent("onmouseup", upHandler);
		// 作为mouseup事件看待鼠标捕获的丢失
		elementToDrag.attachEvent("onlosecapture", upHandler);
	}

	//处理这个事件，不让其他元素看到它
	if (event.stopPropagation) {event.stopPropagation();}  //standard
	else {event.cancelBubble = true;}  //IE

	//阻止任何默认操作
	if (event.preventDefault) {event.preventDefault();}
	else {event.returnValue = false;}

	/***
	* 元素被拖动即捕获mousemove事件的处理程序
	* 用于移动这个元素
	**/
	function moveHandler (e) {
		if (!e) {e = window.event;} //IE事件模型

		//移动这个元素到当前鼠标位置，通过滚动条位置和初始单击的偏移量来调整
		var scroll = getScrollOffsets();
		elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
		elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + "px";
		//同时不让任何其他元素看到这个事件
		if (e.stopPropagation) { e.stopPropagation()}
		else {e.cancelBubble = true;}
	}

	/***
	* 拖动结束后最终mouseup事件的处理程序
	**/
	function upHandler (e) {
		if (!e) {e=window.event;}

		//注销捕获事件的处理程序
		if (document.removeEventListener) {
			document.removeEventListener("onmouseup", upHandler, true);
			document.removeEventListener("onmousemove", moveHandler, true);
		} else if (document.detachEvent) {
			elementToDrag.detachEvent("onlosecapture", upHandler);
			elementToDrag.detachEvent("onmouseup", upHandler);
			elementToDrag.detachEvent("onmousemove", moveHandler);
			elementToDrag.releaseCapture();
		}

		//不让事件进一步传播
		if (e,stopPropagation) {e.stopPropagation();}
		else {e.cancelBubble = true;}
	}
}