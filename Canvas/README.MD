
	x: (this.w / 2) + 5,	//圆心位置
	y: (this.h / 2) + 22,	
	r: 100,				//园半径
	speed: 5,			//旋转的速度
	rotation: 0,		//旋转的弧度
	angleStart: 270,	//开始角度
	angleEnd: 90,		//结束角度
	hue: 200,			//颜色深度
	thickness: 18,		//内外层的厚度
	blur: 25			//光圈的模糊程度
	bg:rgba(0,0,0,0.7)	//背景颜色
				
	示例 ：
	var p = new CanvasUpload('#canvas', {
		thickness:10,
		hue:120,
		speed:3,
		r:100
	});