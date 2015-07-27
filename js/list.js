

	var toc = document.getElementById("TOC");
	if(!toc) {
		toc = document.createElement("div");
		toc.id = "TOC";
		document.body.insertBefore(toc, document.body.firstChild);
	}

	//查找所有标题元素
	var headings;
	if (document.querySelectorAll) // 可不可以使用简便方法
		headings = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
	else 
		headings = findHeadings(document.body, []);

	//递归遍历document的body，查找标题元素
	function findHeadings(root, sects) {
		for(var c = root.firstChild; c != null; c = c.nextSibling) {
			if (c.nodeType !== 1) continue; //!==element 继续循环
			if (c.tagName.length == 2 && c.tagName.charAt(0) == "H") 
				sects.push(c);
			else
				findHeadings(c, sects);
		}
		return sects;
	}

	//初始化一个数组来保持跟踪章节号
	var sectionNumbers = [0,0,0,0,0,0];

	//现在循环已找到的标题元素
	for (var h = 0; h < headings.length; h++) {
		var heading = headings[h];

		//跳过在TOC容器中的标题元素
		if (heading.parentNode == toc) continue;

		//判定标题级别
		var level = parseInt(heading.tagName.charAt(1));
		if (isNaN(level) || level < 1 || level > 6) continue;

		// 对于该标题级别增加sectionNunbers对应的数字
		// 重置所有标题比它级别低的数字为零
		sectionNumbers[level-1]++;
		for (var i = level; i < 6; i++) sectionNumbers[i] = 0;

		//现在将所有标题级别的章节号组合产生一个章节号，如2.4.1
		var sectionNumber = sectionNumbers.slice(0,level).join(".");

		//为标题级别增加章节号，把数字放在span中，使其可以用样式修饰
		var span = document.createElement("span");
		span.className = "TOCSectNum";
		span.innerHTML = sectionNumber;
		heading.insertBefore(span, heading.firstChild);

		//用命名的锚点将标题包起来，以便为它增加链接
		var anchor = document.createElement("a");
		anchor.name = "TOC" + sectionNumber;
		heading.parentNode.insertBefore(anchor, heading);
		anchor.appendChild(heading);

		//现在为该节创建一个链接
		var link = document.createElement("a");
		link.href = "#TOC" + sectionNumber; //链接的目标地址
		link.innerHTML = heading.innerHTML; //链接的文本与实际标题一致

		//将链接放在一个div中，div用基于级别名字的样式修饰
		var entry = document.createElement("div");
		entry.className = "TOCEntry TOCLevel" + level;
		entry.appendChild(link);

		//该div添加到TOC容器中
		toc.appendChild(entry);
	};

