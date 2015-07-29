function fadeOut (e, oncomplete, time) {
	if (typeof e === "string") {e = document.getElementById(e);}
	if (!time) { time = 500;}

	//使用Math.sqrt作为一个简单的缓动函数来创建非线性动画
	//一开始淡出得比较快，后面渐缓
	var ease = Math.sqrt;

	var start = (new Date()).getTime();
	animate();

	function animate () {
		var elapsed = (new Date()).getTime() - start;  //消耗的时间
		var fraction = elapsed / time;

		if (fraction < 1) {
			var opacity = 1 - ease(fraction);  //计算元素的不透明度
			e.style.opacity = String(opacity);
			setTimeout(animate, Math.min(25, time-elapsed));
		} else {
			e.style.opacity = "0";
			if (oncomplete) { oncomplete(e);}
		}
	}
}