! function(t) {
	function n(a) {
		if(e[a])
			return e[a].exports;
		var i = e[a] = {
			exports: {},
			id: a,
			loaded: !1
		};
		return t[a].call(i.exports, i, i.exports, n),
			i.loaded = !0,
			i.exports
	}
	var e = {};
	return n.m = t,
		n.c = e,
		n.p = "",
		n(0)
}({
	0: function(t, n, e) {
		t.exports = e(136)
	},
	136: function(t, n) {
		var e = function(t) {
				function n(t, n) {
					if(1 === arguments.length && "[object Object]" === Object.prototype.toString.call(t))
						return $.extend(a, t), {
							gamename: e
						};
					var o = {
						gamename: e,
						titles: i,
						ballPos: n,
						range: t,
						ballCount: t[1] - t[0] + 1,
						start: t[0]
					};
					return o.totalTpl = function() {
							for(var t = [], n = 0; n < o.ballPos; n++) {
								void 0 === t[n] && (t[n] = []);
								for(var e = 0; e < o.ballCount; e++)
									t[n][e] = 0
							}
							return t
						},
						o
				}
				var e, a = this,
					t = t - 0;
				$.each(gamelist, function(n, a) {
					a.id - 0 === t && (e = a.gamename)
				});
				var i;
				switch(GameCode) {
					case "SSC":
						return i = ["万位", "千位", "百位", "十位", "个位", "号码分布"],
							n([0, 9], 5, i);
					case "11X5":
						return i = ["万位", "千位", "百位", "十位", "个位", "号码分布"],
							n([1, 11], 5, i);
					case "PK10":
						return i = ["冠军", "亚军", "季军", "第四名", "第五名", "第六名", "第七名", "第八名", "第九名", "第十名", "号码分布"],
							n([1, 10], 10, i);
					case "3D":
						return i = ["百位", "十位", "个位", "号码分布"],
							n([0, 9], 3, i);
					case "K3":
						return i = ["百位", "十位", "个位", "号码分布"],
							n([1, 6], 3, i);
					case "KL8":
						return n({
							computedSum: function(t) {
								var n = 0;
								return $.each(t.split(","), function(t, e) {
										n += e - 0
									}),
									n
							},
							bigSmall: function(t) {
								var n = this.computedSum(t);
								return n <= 809 && n >= 210 ? "小" : 810 === n ? "和" : "大"
							},
							evenOdd: function(t) {
								var n = 0,
									e = 0;
								return $.each(t.split(","), function(t, a) {
										(a - 0) % 2 === 0 ? ++n : ++e
									}),
									n === e ? "和" : n > e ? "偶" : "奇"
							},
							upDown: function(t) {
								var n = 0,
									e = 0;
								return $.each(t.split(","), function(t, a) {
										a - 0 <= 40 ? ++n : ++e
									}),
									n === e ? "和" : n > e ? "上" : "下"
							}
						})
				}
			},
			a = ["#cce"];
		$(function() {
			Vue.component("my-th", {
				props: {
					isBottom: Boolean,
					ballPos: Number,
					ballCount: Number,
					start: Number
				},
				template: $("#th-template").html()
			});
			var vm = new Vue({
				el: "#VueRoot",
				data: function() {
					var t = location.href.match(/game=(\d+)/)[1] - 0,
						n = ($(window).height(),this),
						a = {
							gameList: gamelist,
							//gameID: t,
							//gameInfo: e.call(n, t),
							gameID: 29,
							gameInfo: e.call(n, 29),
							list: [],
							pos: [],
							statisticsInfos: [],
							displayMissing: !0,
							canDisplayMissing: !0,
							displayStatistics: !0,
							displayMissingFloor: !0,
							displayAssist: !0,
							polyline: !0,
							pageSize: 30,
							isLoading: !0,
							tdPositions: [],
							tdStartPos: {
								x: 0,
								y: 0,
								w: 0,
								h: 0
							},
							displayTemperature: !0,
							temperature: []
						};
					return a
				},
				methods: {
					switchGame: function(t) {
						location.href = location.href.replace(/(game=)\d+/, "$1" + this.gameID)
					},
					tab: function(t) {
						this.pageSize = t,
							$("#start,#end").val(""),
							this.isLoading = !0,
							this.GetData()
					},
					GetData: function(t) {
						var n = this;
						clearTimeout(n.rendingTimeout),
							$.getJSON('./Json/result.json', function(t) {
								//console.log(t);
								//console.log(n);
								if(n.gameInfo.totalTpl) {
									if(!t.list || t.list.length <= 0)
										return n.isLoading = !1, !1;
									t.list.reverse(),
										n.pos.length = 0;
									var e = [],
										i = [],
										o = [],
										s = [],
										l = [],
										r = [],
										u = t.list.length;
									$.getJSON('./Json/res.json', function(c) {
										//console.log(c);
										c = "string" == typeof c ? JSON.parse(c) : c;
										var g = [],
											h = (c.length,
												n.gameInfo.range[1] - n.gameInfo.range[0] + 1);
										if($.each(c, function(t, e) {
												var a = e.Local - 0;
												$.each(e.CodeNums, function(t, e) {
													g[a * h + (e.Code - n.gameInfo.range[0])] = e.MC - 0 + 1
												})
											}),
											0 == g.length)
											for(var f = 0; f < n.gameInfo.ballPos * n.gameInfo.ballCount; f++)
												g[f] = 1;
										n.canDisplayMissing = g.length > 0,
											$.each(t.list, function(a, i) {
												var c = i.result.split(",");
												i.resultArr = c;
												var h;
												0 == a ? i.continuousMissing = g : (h = t.list[a - 1].continuousMissing,
													i.continuousMissing = []);
												var f, p = [];
												0 != a && (f = t.list[a - 1].numberDistributions);
												for(var m = 0; m < n.gameInfo.ballCount; m++) {
													var d = {
														num: m + n.gameInfo.range[0],
														count: 0,
														missing: f ? f[m].missing + 1 : 1
													};
													p.push(d)
												}
												$.each(c, function(t, c) {
														var g = t * n.gameInfo.ballCount,
															f = 0;
														p[c - n.gameInfo.range[0]].count++,
															p[c - n.gameInfo.range[0]].missing = 0;
														for(var m = 0; m < n.gameInfo.ballCount; m++) {
															var d = g + m,
																v = h ? h[d].count - 0 : 0;
															!o[d] && (o[d] = 0), !r[d] && (r[d] = 0), !l[d] && (l[d] = 0), !s[d] && (s[d] = 0), !e[d] && (e[d] = 0);
															var b = "";
															m == c - n.gameInfo.range[0] ? (b = t % 2 === 0 ? "ball02" : "ball01",
																	f = 0,
																	l[d] = l[d] ? l[d] + v : v,
																	r[d]++,
																	e[d]++) : (s[d] < r[d] && (s[d] = r[d]),
																	r[d] = 0,
																	f = v + 1,
																	b = t % 2 === 0 ? "missing02" : "missing01"),
																a == u - 1 && (s[d] < r[d] && (s[d] = r[d]),
																	l[d] = l[d] ? l[d] + f : f),
																o[d] < f && (o[d] = f),
																0 == a && 0 != f && (f = i.continuousMissing[d]),
																i.continuousMissing[d] = {
																	count: f,
																	className: b,
																	ele: c
																}
														}
														void 0 === n.pos[t] && (n.pos[t] = []),
															n.pos[t].push([c - n.gameInfo.range[0], a])
													}),
													i.numberDistributions = p
											}),
											$.each(l, function(t, n) {
												i.push(Math.round(n / (e[t] + 1)))
											});
										var p = [];
										$.each(e, function(t, e) {
												var a = "ball-blue";
												if(0 != e) {
													var i = n.gameInfo.ballCount * e / 1 / n.pageSize;
													a = i <= .5 ? "ball-blue" : i < 1.3 ? "ball-orange" : "ball-red"
												}
												p.push(a)
											}),
											n.temperature = p;
										var m = t.list[u - 1].continuousMissing,
											d = a.length;
										$.each(t.list, function(t, n) {
												$.each(n.continuousMissing, function(n, e) {
													e.bgColor = t < u - m[n].count ? "" : a[n % d]
												})
											}),
											function() {
												var n = [],
													a = [],
													l = [],
													r = [],
													u = [];
												$.each(t.list, function(e, i) {
														$.each(i.numberDistributions, function(i, o) {
															0 == e && (n[i] = 0,
																	a[i] = 0,
																	l[i] = 0,
																	r[i] = 0,
																	u[i] = 0),
																n[i] += o.count,
																0 == o.count && a[i]++,
																l[i] < o.missing && (l[i] = o.missing),
																0 == o.count || e == t.list.lenth - 1 ? (r[i] < u[i] && (r[i] = u[i]),
																	u[i] = 0) : u[i]++
														})
													}),
													a = $.map(a, function(t, e) {
														return Math.round(e / (n[t] + 1))
													}),
													e.push.apply(e, n),
													i.push.apply(i, a),
													o.push.apply(o, l),
													s.push.apply(s, r)
											}();
										var v = [];
										v.push({
												title: "出现总次数",
												data: e,
												color: "#ff00ff"
											}),
											n.canDisplayMissing && v.push({
												title: "平均遗漏",
												data: i,
												color: "#485a30"
											}, {
												title: "最大遗漏",
												data: o,
												color: "#803905"
											}),
											v.push({
												title: "最大连出",
												data: s,
												color: "#18566b"
											}),
											n.list = t.list,
											n.statisticsInfos = v,
											n.isLoading = !1
									})
								} else
									n.list = t.list,
									n.isLoading = !1
							})
					},
					Draw: function() {
						var t = this,
							n = document.getElementById("LINE-CONTAINER");
						if(n.innerHTML = "",
							0 !== t.list.length) {
							var e = $("#first-td"),
								a = (e.position(), {
									ballCount: t.gameInfo.ballCount,
									ballPos: t.gameInfo.ballPos,
									listCount: t.list.length,
									width: e.innerWidth(),
									height: e.innerHeight(),
									line: n,
									red: "#E30D0D",
									blue: "#2B9FF8",
									calc: function(t, n, e) {
										var i = a[{
											w: "width",
											h: "height"
										}[n]] + 1;
										return t * i + Math.floor(i / 2) + (e ? e * i * a.ballCount : 0)
									}
								});
							n.style.left = "0px",
								n.style.top = "0px",
								t.CanvasDraw(a),
								n.style.display = "block"
						}
					},
					CanvasDraw: function(t) {
						var n = this,
							e = t.line,
							a = (t.calc,
								document.createElement("canvas")),
							i = t.width,
							o = t.height,
							s = $("table");
						a.width = s.width(),
							a.height = s.height();
						var l = a.getContext("2d");
						l.lineWidth = 1.3;
						var r = $("#trend-body");
						n.pos.forEach(function(n, e) {
								l.beginPath(),
									l.strokeStyle = e % 2 === 0 ? "#499495" : "#c66f6f",
									n.forEach(function(n, a) {
										var s = r.children().eq(n[1]).children().eq(n[0] + 1 + t.ballPos + e * t.ballCount),
											u = s.position(),
											c = u.left + i / 2,
											g = u.top + o;
										0 === a ? l.moveTo(c, g) : l.lineTo(c, g)
									}),
									l.stroke()
							}),
							e.appendChild(a)
					},
					getNumTxt: function(t) {
						return String(0 == t.count ? t.ele : this.canDisplayMissing && this.displayMissing ? t.count : "")
					}
				},
				watch: {
					list: function() {
						var t = this;
						this.$nextTick(function() {
							t.gameInfo.totalTpl && t.Draw()
						})
					}
				},
				created: function() {
					this.GetData()
				}
			})
		})
	}
});
//# sourceMappingURL=http://dev.me/result/pc.vue.js.map