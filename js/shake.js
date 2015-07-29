function shake (e, oncomplete, distance, time) {
	if (typeof e === "string") {e = document.getElementById(e)};
	if (!time) {time = 500;};
	if (!distance) {distance = 5;};

	var originalStyle = e.style.cssText;  //保存e的原始style
	e.style.position = "relative";
	var start = (new Date()).getTime();   //动画开始的时间
	animate();  						  //动画开始

	function animate () {
		var now = (new Date()).getTime();    //得到当前时间
		var elapsed = now - start;  		 //从开始以来消耗了多长时间
		var fraction = elapsed / time;  	 //是总时间的几分之几

		if (fraction < 1) {		//如果动画未完成
			//使用正弦函数[-1,1] *4pi 来回往复两次
			var x = distance * Math.sin(fraction*4*Math.PI);
			e.style.left = x + "px";

			//25毫秒后或总时间最后再次运行，获得每秒40帧的动画
			setTimeout(animate, Math.min(25, time - elapsed));
		} else {   	  //否则动画完成
			e.style.cssText = originalStyle;
			if (oncomplete) { oncomplete(e) }; //调用完成后的回调函数
		}
	}
}


