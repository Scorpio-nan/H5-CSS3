/*this = {
				x: (this.w / 2) + 5,	//圆心位置
				y: (this.h / 2) + 22,	
				r: 100,		//园半径
				speed: 5,			//旋转的速度
				rotation: 0,		//旋转的弧度
				angleStart: 270,	//开始角度
				angleEnd: 90,		//结束角度
				hue: 200,			//颜色深度
				thickness: 18,		//内外层的厚度
				blur: 25			//光圈的模糊程度
				bg:#000				//背景颜色
			}*/

			//产生指定大小范围的随机整数
			function Random(min, max) {
				return ~~((Math.random() * (max - min + 1)) + min);
			}
			//计算园的起始角度
			function Doarc(degrees) {
				return degrees * Math.PI / 180;
			}
			function CanvasUpload(dom, obj) {
				if(!obj) obj = {};
				var self = this;
				this.dom = document.querySelector(dom);
				this.dom.style.background = obj.bg ? obj.bg : 'rgba(0,0,0,0.7)';
				this.c = this.dom.getContext('2d');
				this.w = window.innerWidth;
				this.h = window.innerHeight;
				this.dom.width = this.w;
				this.dom.height = this.h;
				this.x = obj.x ? obj.x : (this.w / 2) + 5;
				this.y = obj.y ? obj.y : (this.h / 2) + 22;
				this.r = obj.r ? obj.r : 80;
				this.speed = obj.speed ? obj.speed : 5;
				this.rotation = obj.rotation ? obj.rotation : 0;
				this.angleStart = obj.angleStart ? obj.angleStart : 270;
				this.angleEnd = obj.angleEnd ? angleEnd : 90;
				this.hue = obj.hue ? obj.hue : 200;
				this.thickness = obj.thickness ? obj.thickness : 18;
				this.blur = obj.blur ? obj.blur : 25;
				this.particles = [];
				this.particleMax = 100;
				window.onresize = function(e) {
					self.dom.width = self.w = this.innerWidth;
					self.dom.height = self.h = this.innerHeight;
				}
				this.c.shadowBlur = this.blur;
				this.c.shadowColor = 'hsla(' + this.hue + ', 80%, 60%, 1)';
				this.c.lineCap = 'round'
				var gradient1 = this.c.createLinearGradient(0, -(this.r), 0, this.r);
				gradient1.addColorStop(0, 'hsla(' + this.hue + ', 60%, 50%, .25)');
				gradient1.addColorStop(1, 'hsla(' + this.hue + ', 60%, 50%, 0)');
				this.gradient1 = gradient1;
				var gradient2 = this.c.createLinearGradient(0, -(this.r), 0, this.r);
				gradient2.addColorStop(0, 'hsla(' + this.hue + ', 100%, 50%, 0)');
				gradient2.addColorStop(.1, 'hsla(' + this.hue + ', 100%, 100%, .7)');
				gradient2.addColorStop(1, 'hsla(' + this.hue + ', 100%, 50%, 0)');
				this.gradient2 = gradient2;
				this.timer = setInterval(function(){
					self.__proto__.loop(self);
				},10)
			};
			CanvasUpload.prototype = {
				constructor:CanvasUpload,
				updateCircle:function() {
					if(this.rotation < 360) {
						this.rotation += this.speed
					} else {
						this.rotation = 0;
					}
				},
				renderCircle:function() {
					this.c.save();
					this.c.translate(this.x, this.y);
					this.c.rotate(Doarc(this.rotation));
					this.c.beginPath();
					this.c.arc(0, 0, this.r, Doarc(this.angleStart), Doarc(this.angleEnd), true);
					this.c.lineWidth = this.thickness;
					this.c.strokeStyle = this.gradient1;
					this.c.stroke();
					this.c.restore();
				},
				renderCircleBorder:function() {
					this.c.save();
					this.c.translate(this.x, this.y);
					this.c.rotate(Doarc(this.rotation));
					this.c.beginPath();
					this.c.arc(0, 0, this.r + (this.thickness / 2), Doarc(this.angleStart), Doarc(this.angleEnd), true);
					this.c.lineWidth = 2;
					this.c.strokeStyle = this.gradient2;
					this.c.stroke();
					this.c.restore();
				},
				renderCircleFlare:function() {
					this.c.save();
					this.c.translate(this.x, this.y);
					this.c.rotate(Doarc(this.rotation + 185));
					this.c.scale(1, 1);
					this.c.beginPath();
					this.c.arc(0, this.r, 30, 0, Math.PI * 2, false);
					this.c.closePath();
					var gradient3 = this.c.createRadialGradient(0, this.r, 0, 0, this.r, 30);
					gradient3.addColorStop(0, 'hsla(330, 50%, 50%, .35)');
					gradient3.addColorStop(1, 'hsla(330, 50%, 50%, 0)');
					this.c.fillStyle = gradient3;
					this.c.fill();
					this.c.restore();
				},
				renderCircleFlare2:function() {
					this.c.save();
					this.c.translate(this.x, this.y);
					this.c.rotate(Doarc(this.rotation + 165));
					this.c.scale(1.5, 1);
					this.c.beginPath();
					this.c.arc(0, this.r, 25, 0, Math.PI * 2, false);
					this.c.closePath();
					var gradient4 = this.c.createRadialGradient(0, this.r, 0, 0, this.r, 25);
					gradient4.addColorStop(0, 'hsla(30, 100%, 50%, .2)');
					gradient4.addColorStop(1, 'hsla(30, 100%, 50%, 0)');
					this.c.fillStyle = gradient4;
					this.c.fill();
					this.c.restore();
				},
				createParticles:function() {
					if(this.particles.length < this.particleMax) {
						this.particles.push({
							x: (this.x + this.r * Math.cos(Doarc(this.rotation - 85))) + (Random(0, this.thickness * 2) - this.thickness),
							y: (this.y + this.r * Math.sin(Doarc(this.rotation - 85))) + (Random(0, this.thickness * 2) - this.thickness),
							vx: (Random(0, 100) - 50) / 1000,
							vy: (Random(0, 100) - 50) / 1000,
							r: Random(1, 6) / 2,
							alpha: Random(10, 20) / 100
						});
					}
				},
				updateParticles:function() {
					var i = this.particles.length;
					while(i--) {
						var p = this.particles[i];
						p.vx += (Random(0, 100) - 50) / 750;
						p.vy += (Random(0, 100) - 50) / 750;
						p.x += p.vx;
						p.y += p.vy;
						p.alpha -= .01;
						if(p.alpha < .02) {
							this.particles.splice(i, 1)
						}
					}
				},
				renderParticles:function() {
					var i = this.particles.length;
					while(i--) {
						var p = this.particles[i];
						this.c.beginPath();
						this.c.fillRect(p.x, p.y, p.r, p.r);
						this.c.closePath();
						this.c.fillStyle = 'hsla(0, 0%, 100%, ' + p.alpha + ')';
					}
				},
				clear:function() {
					this.c.globalCompositeOperation = 'destination-out';
					this.c.fillStyle = 'rgba(0, 0, 0, .1)';
					this.c.fillRect(0, 0, this.w, this.h);
					this.c.globalCompositeOperation = 'lighter';
				},
				loop:function(self) {
					self.clear();
					self.updateCircle();
					self.renderCircle();
					self.renderCircleBorder();
					self.renderCircleFlare();
					self.renderCircleFlare2();
					self.createParticles();
					self.updateParticles();
					self.renderParticles();
				},
				stop:function(){
					clearInterval(this.timer);
					document.body.remove(this.dom);
				}
			}