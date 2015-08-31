//把内容元素装进指定大小的窗体或视口内，
//可选参数contentX和contentY指定内容相对于窗体的初始偏移量(<=0)
//mousewheel允许用户平移元素和缩放窗体
function enclose(content, framewidth, frameheight, contentX, contentY) {
	framewidth = Math.max(framewidth, 50);
	frameheight = Math.max(frameheight, 50);
	contentX = Math.min(contentX, 0) || 0;
	contentY = Math.min(contentY, 0) || 0;
	
	//创建frame元素并设置css类名和样式
	var frame = document.createElement("div");
	frame.className = "enclosure";
	frame.style.width = framewidth + "px";
	frame.style.height = frameheight + "px";
	frame.style.overflow = "hidden";
	frame.style.boxSizing = "border-box";
	frame.style.webkitBoxSizing = "border-box";
	frame.style.MozBoxSizing = "border-box";
	
	//把frame放入文档中，并把内容移入frame中
	content.parentNode.insertBefore(frame, content);
	frame.appendChild(content);
	//确定元素相对于frame的位置
	content.style.position = "relative";
	content.style.left = contentX + "px";
	content.style.top = contentY + "px";
	
	//针对浏览器怪癖进行处理
	var isMacWebkit = (navigator.userAgent.indexOf("macintosh") !== -1 &&
					   navigator.userAgent.indexOf("WebKit") !== -1);
	var isFirefox = (navigator.userAgent.indexOf("Gecko") !== -1);
	
	//注册mousewheel事件处理程序
	frame.onwheel = wheelHandler; //未来浏览器
	frame.onmousewheel = wheelHandler; //大多数浏览器
	if (isFirefox) {
		frame.addEventListener("DOMMouseScroll",wheelHandler, false);
	}
	
	function wheelHandler(event) {
		var e = event || window.event;
		//查找wheel、mousewheel、DOMMouseScroll事件对象，提取旋转量
		//绽放delta以便一次鼠标滚轮相对于屏幕缩放增量为30px
		//取消wheel事件将阻止mousewheel事件的产生，避免未来同时触发
		var deltaX = e.deltaX*-30 || e.wheelDeltaX/4 || 0;
		var deltaY = e.deltaY*-30 || e.wheelDeltaY/4 || 
					(e.wheelDeltaY===undefined && e.wheelDelta/4) || e.detail*-10 || 0;
		//大多数浏览器每次滚轮对应delta为120，Mac较敏感，通常大120倍
		if (isMacWebkit) {
			deltaX /= 30;
			deltaY /= 30;
		}
		//如果Firefox未来版本得到mousewheel或wheel事件
		if(isFirefox && e.type !== "DOMMouseScroll") {
			frame.removeEventListener("DOMMouseScroll", wheelHandler, false)
		}
		
		//获取元素当前尺寸
		var contentbox = content.getBoundingClientRect();
		var contentwidth = contentbox.right - contentbox.left;
		var contentheight = contentbox.bottom - contentbox.top;
		
		if (e.altKey) { //按下alt键调整frame大小
			if(deltaX) {
				framewidth -= deltaX; //新宽度，但不能比内容大,不能比50小
				framewidth = Math.min(framewidth, contentwidth);
				framewidth = Math.max(framewidth, 50);
				frame.style.width = framewidth +"px";
			}
			if(deltaY) {
				frameheight -= deltaY; //新宽度，但不能比内容大,不能比50小
				frameheight = Math.min(frameheight, contentwidth);
				frameheight = Math.max(frameheight, 50);
				frame.style.height = frameheight +"px";
			}
		} else { //没有按下alt键，平移frame中的内容
			if (deltaX) {
				var minoffset = Math.min(framewidth - contentwidth, 0);
				//把deltaX添加到contentX中，但不能小于minoffset
				contentX = Math.max(contentX + deltaX, minoffset);
				contentX = Math.min(contentX, 0);
				content.style.left = contentX + "px";
			}
			if (deltaY) {
				var minoffset = Math.min(frameheight - contentheight, 0);
				//把deltaX添加到contentX中，但不能小于minoffset
				contentY = Math.max(contentY + deltaY, minoffset);
				contentY = Math.min(contentY, 0);
				content.style.top = contentY + "px";
			}
		}
		
		//不让这个事件冒泡，阻止默认操作
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
		e.cancelBubble = true; //IE事件
		e.returnValue = false;
		return false;
	}	
}





