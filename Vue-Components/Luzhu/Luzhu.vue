<template>
	<div id="Baccarat">
		<div class="mui-scroll-wrapper" id="Controller">
			<div class="mui-scroll">

				<div class="header">
					<div class="cell-layout cell-number">
						<p>{{openInfo.Nextexpect.slice(-7)}}期</p>
						<p>&yen;&nbsp;
							<CountUp :start-val="1" :end-val="Account.Wallet ? parseFloat(Account.Wallet) : 0" :duration="1" :decimals="2"></CountUp>
						</p>
					</div>
					<div class="cell-layout cell-cutdown">
						<div class="audio_Off" :class="play_falg?'audio_yes':'audio_no'" @touchend="audio_Off()"></div>
						<span class="cutTime">{{openInfo.ResultTimeText}}</span>
					</div>
					<div class="cell-layout cell-betting">
						<!--<p class="text-center">闲下注：{{xianSum}}</p>
						<p class="text-center">庄下注：{{zhuangSum}}</p>-->
						<p class="text-center mui-text-right" @touchend="RouterChange('即时注单','BetDetail')">
							<span class="iconfont icon-icon-86 icon"></span>即时注单
						</p>
						<p class="text-center mui-text-right" @touchend="RouterChange('开奖结果','OpenResult')">
							<span class="iconfont icon-icon-87 icon"></span>开奖结果
						</p>
					</div>
				</div>
				<div class="desk">
					<img src="static/img/public/baijiale/desk.png" />
					<div class="t-table">
						<!--  扑克牌     -->
						<div class="t-poker-area">
							<div class="t-xian">
								<div class="t-name t-name-xian">闲</div>
								<transition name="fade">
									<div v-show="showNum" class="t-points t-points-xian"><span>{{points.x}}</span></div>
								</transition>
							</div>
							<div class="t-zhuang">
								<div class="t-name t-name-zhuang">庄</div>
								<transition name="fade">
									<div v-show="showNum" class="t-points t-points-zhuang"><span>{{points.z}}</span></div>
								</transition>
							</div>
							<!--   扑克牌专区      -->
							<div class="t-poker-box">
								<!--  两边的耳朵     -->
								<div class="t-target t-poker-left"><img src="static/img/public/baijiale/fold.png" /></div>
								<div class="t-target t-poker-right"><img src="static/img/public/baijiale/deal-card.png" /></div>

								<template v-if="!isOpen">
									<div :id="'card' + item.index" class="t-card rotateCard" v-for="(item,i) in collpose" :code="item.card">
										<div class="pokerBoard black-1" :class="item.card"></div>
										<div class="pokerBg"></div>
									</div>
								</template>

								<template v-if="isOpen">
									<div :id="'card' + item.index" class="t-card t-card-1 rotateCard" v-for="(item,i) in collpose" :code="item.card">
										<div class="pokerBoard black-1" :class="item.card"></div>
										<div class="pokerBg"></div>
									</div>
								</template>

							</div>
						</div>

						<!--  下注台  -->
						<div class="d-area">
							<div class="d-desk">
								<div class="d-top">
									<div class="flex-item" v-for=" (item,i) in odds.top" @touchend="handleClick(item,$event)" :class="item.NUM_NAME">
										<h3 class="d-tit">{{item.NUM_NAME}}</h3>
										<p class="d-odds" v-if="islogin">1:{{item.ODDS}}</p>
										<p class="d-odds" v-else>{{item.ODDS}}</p>
										<p class="BETAMT" v-if="item.BET_AMT > 0||item.BETED_AMT> 0">{{item.BET_AMT+item.BETED_AMT}}</p>
										<div id="CloneDom" class="clones" v-if="item.Chips.length > 0" v-for="(val,key) in item.Chips" :style="{left:val.C.x + 'px',top:val.C.y + 'px'}">
											<img class="cloneitem" :src="'static/img/public/baijiale/'+ query +'-'+ val.num +'.png'" />
										</div>
									</div>
								</div>
								<div class="d-middle">
									<div class="flex-item padding-box" v-for=" (item,i) in odds.middle" @touchend="handleClick(item,$event)" :class="item.NUM_NAME">
										<h3 class="d-tit">{{item.NUM_NAME}}</h3>
										<p class="d-odds" v-if="islogin">1:{{item.ODDS}}</p>
										<p class="d-odds" v-else>{{item.ODDS}}</p> 
										<p class="BETAMT" v-if="item.BET_AMT > 0||item.BETED_AMT> 0">{{item.BET_AMT+item.BETED_AMT}}</p>
										<div id="CloneDom" class="clones" v-if="item.Chips.length > 0" v-for="(val,key) in item.Chips" :style="{left:val.C.x + 'px',top:val.C.y + 'px'}">
											<img class="cloneitem" :src="'static/img/public/baijiale/'+ query +'-'+ val.num +'.png'" />
										</div>
									</div>
								</div>
								<div class="d-bottom">
									<div class="flex-item padding-top" v-for=" (item,i) in odds.bottom" @touchend="handleClick(item,$event)" :class="item.NUM_NAME">
										<h3 class="d-tit">{{item.NUM_NAME}}</h3>
										<p class="d-odds" v-if="islogin">1:{{item.ODDS}}</p>
										<p class="d-odds" v-else>{{item.ODDS}}</p>
										<p class="BETAMT" v-if="item.BET_AMT > 0||item.BETED_AMT> 0">{{item.BET_AMT+item.BETED_AMT}}</p>
										<div id="CloneDom" class="clones" v-if="item.Chips.length > 0" v-for="(val,key) in item.Chips" :style="{left:val.C.x + 'px',top:val.C.y + 'px'}">
											<img class="cloneitem" :src="'static/img/public/baijiale/'+ query +'-'+ val.num +'.png'" />
										</div>
									</div>
								</div>
								<div class="deskMask" v-if="kaipai"></div>
							</div>
						</div>

						<!--  筹码         -->
						<div class="chip">
							<div class="chip-item" v-for="(item,i) in chips" :class="index == i ? 'active':''" @touchend="handleTouch(i,item,$event)">
								<img :class="'item-' + (i+1)" :src="'static/img/public/baijiale/'+ query +'-' + item + '.png'" />
							</div>
						</div>
					</div>
				</div>

				<!--    按钮组             -->
				<div class="btn-group">
					<button class="btn-trend" @touchend="isShow = !isShow">露珠走势</button>
					<button class="btn-cancle" @click="onCancelClick();playAudio('clearBet',true)">重新下注</button>
					<button class="btn-sure" @click="handleSubmit()">确认下注</button>
				</div>

				<transition name="bounce">
					<div class="action" :class="isShow ? 'transOut' : 'transIn'">
						<!--<a href="javascript:;" class="showbutton" @touchend="isShow = !isShow">路子<i class="arrow" :class="isShow ? 'transUp':'transDown'"></i></a>-->
						<div class="actionContent">
							<div class="res-title">
								<span class="colorRed">庄:{{statis.z}} </span>&nbsp;&nbsp;
								<span class="colorBlue">闲:{{statis.x}} </span>&nbsp;&nbsp;
								<span class="colorGreen">和:{{statis.h}}</span>&nbsp;&nbsp;
								<span class="colorRed">庄对:{{statis.zd}}</span>&nbsp;&nbsp;
								<span class="colorBlue">闲对:{{statis.xd}}</span>&nbsp;&nbsp; 8/9点:{{statis.fe}}&nbsp;&nbsp;局数:{{statis.len}}
							</div>
							<!--  大路    -->
							<div class="table-layout-top" v-if="isdew" @touchend="isdew = !isdew">
								<div class="table-layout">
									<div class="table-col" v-for="m in 25">
										<div class="table-cell" v-for="(item,i) in 6">
											<span v-if="Bigroad[item+'-'+(m+BigroadDiff)]" :class="Bigroad[item+'-'+(m+BigroadDiff)].name == '庄' ? 'redring' : 'bluering'">
												<p class="tableNumber">{{Bigroad[item+'-'+(m+BigroadDiff)].isDraw>0?Bigroad[item+'-'+(m+BigroadDiff)].isDraw:''}}</p>
												<!-- <i v-if="Bigroad[item+'-'+m].isDraw > 0" v-for="(l,n) in Bigroad[item+'-'+m].isDraw" class="greenring" :class="'greenring' + l"></i> -->
											</span>
											<span v-else class="empty"></span>
										</div>
									</div>
								</div>
								<!--<div class="table-title blue-bg">
									<span>闲</span>
									<span>问</span>
									<span>路</span>
									<span class="redring alignItem"></span>
									<span class="redfill alignItem"></span>
									<span class="redline alignItem"></span>
								</div>-->
							</div>
							<!--  显示庄闲      -->
							<div class="table-layout-top" v-if="!isdew" @touchend="isdew = !isdew">
								<div class="table-layout">
									<div class="table-col" v-for="m in 25">
										<div class="table-cell" v-for="(item,i) in 6" :class="m+'-'+item">
											<span v-if="sides[m+'-'+item] && sides[m+'-'+item] == '庄'" class="redText">{{sides[m+'-'+item]}}</span>
											<span v-else-if="sides[m+'-'+item] && sides[m+'-'+item] == '闲'" class="blueText">{{sides[m+'-'+item]}}</span>
											<span v-else-if="sides[m+'-'+item] && sides[m+'-'+item] == '和'" class="greenText">{{sides[m+'-'+item]}}</span>
											<span v-else class="empty"></span>
										</div>
									</div>
								</div>
								<!--<div class="table-title blue-bg">
									<span>闲</span>
									<span>问</span>
									<span>路</span>
									<span class="redring alignItem"></span>
									<span class="redfill alignItem"></span>
									<span class="redline alignItem"></span>
								</div>-->
							</div>
							<!--  大眼仔      -->
							<div class="table-layout-bottom">
								<div class="table-layout">
									<div class="table-col-half" v-for="m in 50">
										<div class="table-col-item" v-for="(item,i) in 6">
											<span v-if="BigEyd[item+'-'+m]" :class="BigEyd[item+'-'+m] == 'red' ? 'redring-half' : 'bluering-half'"></span>
											<span v-else class="empty"></span>
										</div>
									</div>
								</div>
								<!--<div class="table-title red-bg">
									<span>庄</span>
									<span>问</span>
									<span>路</span>
								</div>-->
							</div>
							<!--  小路        曱甴路 -->
							<div class="yueyouroad">
								<div class="table-layout">
									<div class="xiao">
										<div class="table-col-half" v-for="m in 26">
											<div class="table-col-item" v-for="(item,i) in 6">
												<span v-if="SmallRoad[item+'-'+(m+SmallRoadDiff)]" :class="SmallRoad[item+'-'+(m+SmallRoadDiff)] == 'red' ? 'redring-fill' : 'bluering-fill'"></span>
												<span v-else class="empty"></span>
											</div>
										</div>
									</div>
									<div class="yueyou">
										<div class="table-col-half" v-for="m in 26">
											<div class="table-col-item" v-for="(item,i) in 6">
												<span v-if="jyRoad[item+'-'+(m+jyDiff)]" :class="jyRoad[item+'-'+(m+jyDiff)] == 'red' ? 'redring-line' : 'bluering-line'"></span>
												<span v-else class="empty"></span>
											</div>
										</div>
									</div>
								</div>
								<!--<div class="table-title red-bg">
									<span class="bluering alignItem"></span>
									<span class="bluefill alignItem"></span>
									<span class="blueline alignItem"></span>
								</div>-->
							</div>
						</div>
					</div>
				</transition>

			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/api/lotteryUtil';
	import CountUp from '@/components/CountUp';
	export default {
		components: {
			CountUp
		},
		data() {
			return {
				odds: {
					"top": [{
						"ODDS": 0,
						"NUM_NAME": "大",

					}, {
						"ODDS": 0,
						"NUM_NAME": "小",
					}],
					"middle": [{
						"ODDS": 0,
						"NUM_NAME": "闲对",
					}, {
						"ODDS": 0,
						"NUM_NAME": "任意对子",
					}, {
						"ODDS": 0,
						"NUM_NAME": "完美对子",
					}, {
						"ODDS": 0,
						"NUM_NAME": "庄对",
					}],
					"bottom": [{
						"ODDS": 0,
						"NUM_NAME": "闲",
					}, {
						"ODDS": 0,
						"NUM_NAME": "和",
					}, {
						"ODDS": 0,
						"NUM_NAME": "庄",
					}]
				},
				openInfo: {
					expect: '2017091', //第几期
					Nextexpect: '2017092', //第几期
					closeTime: 10,
					ResultTime: 60,
					closeTimeText: '',
					ResultTimeText: '正在开牌',
				},
				WinInterval: null,
				Bigroad: {}, //大路
				BigroadDiff:0,//大路上需要偏移显示的位数
				BigEyd: {}, //大眼仔
				SmallRoad: {}, //小路
				SmallRoadDiff:0,//小路路上需要偏移显示的位数
				jyRoad: {}, //曱甴路
				jyDiff:0,//曱甴上需要偏移显示的位数
				Result: [], //开奖结果
				isShow: true, //是否显示
				chips: [5, 10, 20, 50, 100], //下注数
				index: -1, //点击chips
				isOpen: false, //当前期是否在开奖
				count: 0, //下注的赔率选择
				delayPos: null, //动画起始位置
				bindClass: 20, //初始化筹码面额
				betArr: [], //投注的数组
				zhuangSum: 0, //庄下注
				xianSum: 0, //闲下注
				rotateTimer: null, //翻转定时器
				tranlateTime: null, //发牌的定时器
				play_falg: false,
				collpose: ["muifar-2,muifar-6,muifar-9,muifar-2,muifar-6,muifar-9"], //用于判断哪张需要开
				bink: [], //闪烁开奖的奖项
				mp3: new Audio(),
				bgMusic: new Audio(),
				win: new Audio(), //开奖音乐，不能同时去操作一个audio对象，所以这里多new出来几个
				medias: new Audio(),
				points: { //开奖点数，z 代表庄点数 ； x 代表闲点数
					z: 0,
					x: 0
				},
				showNum: false, //开奖对比点数
				query: 1, //台桌
				kaipai: false, //是否是正在开奖状态
				isdew: false, //当前显示文字还是露珠
				sides: {}, //只显示庄闲
				statis: { //开奖结果里面庄，闲，和，庄对，闲对出现的次数
					z: 0, //庄个数
					x: 0, //闲个数
					h: 0, //和个数
					zd: 0, //庄对个数
					xd: 0, //闲对个数
					fe: 0, //8/9点个数
					len: 0 //总局数
				},
			}
		},
		created() {
			const that = this;
			this.init();
			this.getOpenTime();
			this.GetWinResult();

			setTimeout(() => {
				that.GetLotteryData_DB();
				that.$store.dispatch('getAccount');
			}, 1000)
			this.query = this.$route.query.desk;
			var obj = {
				'1': [5, 10, 20, 50, 100],
				'2': [50, 100, 500, 1000, 5000],
				'3': [100, 200, 500, 1000, 5000],
				'4': [100, 1000, 5000, 10000, 50000],
				'5': [1000, 2000, 5000, 10000, 50000],
				'6': [1000, 5000, 10000, 20000, 50000]
			}
			this.chips = obj[this.query ? this.query : 1];
			this.bindClass = this.chips[0];
		},
		mounted() {
			const that = this;
			that.WinInterval = setInterval(() => {
				that.openInfo.closeTime--;
				that.openInfo.ResultTime--;
				if(that.openInfo.ResultTime <= 0) {
					that.openInfo.ResultTimeText = '正在开牌'
					that.kaipai = true;
				} else if(that.openInfo.ResultTime > 0 && that.openInfo.ResultTime <= 8) {
					that.openInfo.ResultTimeText = '停止下注'
					that.kaipai = true;
				} else {
					that.kaipai = false;
					that.openInfo.ResultTimeText = that.$Utils.myTimeStamp(that.openInfo.closeTime)
				}
			}, 1000)

			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005
			});
		},
		computed: {
			resultTime() {
				return this.openInfo.ResultTime;
			},
			openExpect() {
				return this.openInfo.expect;
			},
			islogin() {
				if(this.$store.getters.checkLoginState.state == 'success') {
					return true;
				} else {
					return false;
				}
			},
			Account() {
				var UserArr = this.$store.getters.getAccount;
				var obj = {
					Wallet: '',
					Integral: ''
				}
				for(let i = 0; i < UserArr.length; i++) {
					if(UserArr[i].ACC_BAL_CD == 'my_wallet') {
						obj.Wallet = UserArr[i].ACC_BAL.toFixed(2);
					} else {
						obj.Integral = UserArr[i].ACC_BAL.toFixed(2);
					}
				}
				return obj;
			},
		},
		methods: {
			RouterChange(str, path) {
				this.$router.push({
					path,
					query: {
						title: str,
						name: '百家乐',
						id: 1912,
						code: 'baijiale'
					}
				})
			},
			//音乐控制
			audio_Off() {
				this.play_falg = !this.play_falg
				if(!this.play_falg) {
					this.bgMusic.pause();
				}
				if(!this.play_falg) return;
				this.bgMusic.src = 'static/audio/bg.mp3';
				this.bgMusic.loop = true;
				this.bgMusic.volume = 1;
				this.bgMusic.play();
				//手动把所有的音乐对象都播放一遍    主要是这破  iOS 系统， 不会自动播放音乐，需要由用户去操作一下；
				this.playAudio('Silent', true);
				this.winMusic('Silent', true);
				this.distribute('Silent');
			},
			//音乐切换
			playAudio(souce, isplay) {
				this.mp3.src = 'static/audio/' + souce + '.mp3';
				this.mp3.volume = 1;
				if(!this.play_falg) return;
				if(isplay) {
					this.mp3.play();
				} else {
					this.mp3.pause();
				}
			},
			//报幕
			winMusic(src, isplay) {
				this.win.src = 'static/audio/' + src + '.mp3';
				this.win.volume = 1;
				if(!this.play_falg) return;
				if(isplay) {
					this.win.play();
				} else {
					this.win.pause();
				}
			},
			//发牌时候的声音
			distribute(src) {
				this.medias.src = 'static/audio/' + src + '.mp3';
				this.medias.volume = 1;
				if(!this.play_falg) return;
				this.medias.play();

			},
			//点击确认下注按钮
			handleSubmit() {
				const that = this;
				if(that.openInfo.closeTime <= 0 || that.kaipai) {
					that.playAudio('betFailBg', true);
					that.$toast('本期停止下注，请稍后~');
					that.onCancelClick();
					return false;
				} else if(!that.islogin) {
					that.$alert("请先登录后再下注~", "提示", "确定", e => {
						if(e.index == 0) {
							this.$router.push({
								path: "Login"
							});
						}
					});
					return false;
				}
				// 把BET_AMT为0的数据过滤掉
				var temp = [...this.odds.top, ...this.odds.middle, ...this.odds.bottom].filter(ele => ele.BET_AMT > 0 ? true : false);
				var arr = [];
				temp.forEach(ele => {
					var obj = {
						BET_NO: ele.NUM,
						SYS_GAME_LEVEL_CODE_ID: ele.P_1ID,
						SYS_GAME_LEVEL_CODE3_ID: ele.P_3ID,
						BET_RULE: ele.GROUP_NAME,
						BET_CONTENT: ele.NUM_NAME,
						ODDS: ele.ODDS,
						BET_AMT: ele.BET_AMT,
						WIN: (ele.BET_AMT * ele.ODDS).toFixed(2),
						CODE: ele.CODE
					}
					arr.push(obj);
				});
				if(arr.length > 0) {
					api.AppendLotBetDetail(function(data) {
						var result = eval('(' + data + ')');
						if(result.status == '0') {
							that.playAudio('betFail', true);
							that.$toast(result.msg, '错误');
						} else if(result.status == '1') {
							that.playAudio('betSuccess', true);
							that.$toast('下注成功');
							that.$store.dispatch('getAccount');
							that.odds.top.map(ele => {
								ele.Chips = [];
								ele.BETED_AMT = ele.BET_AMT + ele.BETED_AMT;
							});
							that.odds.middle.map(ele => {
								ele.Chips = [];
								ele.BETED_AMT = ele.BET_AMT + ele.BETED_AMT;
							});
							that.odds.bottom.map(ele => {
								ele.Chips = [];
								ele.BETED_AMT = ele.BET_AMT + ele.BETED_AMT
							});
							that.onCancelClick();
							that.zhuangSum = 0;
							that.xianSum = 0;
						} else {
							that.$toast(result.msg, '错误');
						}
					}, arr);
				} else {
					that.$toast('请先投注筹码哦！');
					that.playAudio('betFailBg', true);
				}
			},
			//点击桌面下注
			handleClick(item, ele) {
				const that = this;
				if(this.count === 0) {
					that.playAudio('betFailBg', true);
					this.$toast("请选择下注筹码！");
					return false;
				}
				//记录一下位置
				var Json = {
					C:{
						x: this.reandom(0, 30),
						y: this.reandom(0, 30)
					},
					num:this.count
				}
				//数据扩展的
				item.Chips.push(Json);
				
				that.playAudio('bet', true);
				item.BET_AMT += this.count;
				if(item.NUM == '庄') {
					that.zhuangSum += this.count;
				} else if(item.NUM == '闲') {
					that.xianSum += this.count;
				}
			},
			//发牌动画
			delayTo() {
				const that = this;
				var i = 0;
				that.tranlateTime = setInterval(() => {
					if(i >= 5) {
						clearInterval(that.tranlateTime);
						return;
					}
					$('#card' + i).addClass('translateX-' + i);
					i++;
				}, 1300)
			},
			//补牌动画
			addTo(i) {
				const that = this;
				$('#card' + i).addClass('translateX-' + i);
				setTimeout(() => {
					that.distribute('show');
					$('#card' + i).removeClass('translateX-' + i).addClass('rotateY-' + i);
				}, 1300)

			},
			//翻转动画
			rotateY() {
				//如果开奖结果里面第三张没有牌，就不翻；
				const that = this;
				var i = 1,
					code;
				var addint = 0 //加牌的张数
				that.rotateTimer = setInterval(() => {
					if(i > 6) {
						clearInterval(that.rotateTimer);
						var addTime = 0;
						if(addint == 1 || addint == 2) {
							var addTime = 1300
						} else if(addint == 3) {
							var addTime = 2300
						}
						setTimeout(() => { //根据加牌情况推迟下列操作；
							that.binkCard();
							that.GetWinResult();
							that.getOpenTime();
							setTimeout(() => {
								that.Collapse();
							}, 3000)
						}, addTime)
						return;
					}
					code = $('#card' + i).attr('code');
					if(code != '-' && code != undefined) {
						if(i <= 4) {
							$('#card' + i).removeClass('translateX-' + i).addClass('rotateY-' + i);
							that.distribute('show');
						} else if(i == 5) {
							addint = addint + 1;
							that.addTo(i)
						} else if(i == 6) {
							addint = addint + 2;
							if(addint == 1) { //前面有加牌
								setTimeout(() => {
									that.addTo(i)
								}, 1300)
							} else {
								that.addTo(i) //前面没加牌
							}

						}
					} else {
					}
					i++;
				}, 1200)
			},
			//收起动画
			Collapse() {
				for(let i = 1; i <= 6; i++) {
					$('#card' + i).removeClass('translateX-' + i).removeClass('rotateY-' + i).addClass('Collapse-' + i);
					setTimeout(() => {
						$('#card' + i).removeClass('Collapse-' + i)
					}, 1200)
				}
				this.zhuangSum = 0;
				this.xianSum = 0;
				this.bink.forEach(ele => {
					$('.' + ele).removeClass('bink');
				})
			},
			//开奖闪烁高亮
			binkCard() {
				const that = this;
				that.bink.forEach(ele => {
					$('.' + ele).addClass('bink');
					that.odds.top.map(inele => {
						if(inele.NUM_NAME == ele) {
							inele.BETED_AMT = inele.BETED_AMT * inele.ODDS
						}
					});
					that.odds.middle.map(inele => {
						if(inele.NUM_NAME == ele) {
							inele.BETED_AMT = inele.BETED_AMT * inele.ODDS
						}
					});
					that.odds.bottom.map(inele => {
						if(inele.NUM_NAME == ele) {
							inele.BETED_AMT = inele.BETED_AMT * inele.ODDS
						}
					});
				})
				that.points.x = 0;
				that.points.z = 0;
				this.playAudio('di', true);
				var obj = {
					'0': 0,
					'1': 1,
					'2': 2,
					'3': 3,
					'4': 4,
					'5': 5,
					'6': 6,
					'7': 7,
					'8': 8,
					'9': 9,
					'10': 0,
					'11': 0,
					'12': 0,
					'13': 0,
					'NaN': 0
				}
				//计算庄闲点数
				that.collpose.forEach((ele, index) => {
					var temp = ele.card.substr(ele.card.indexOf('-') + 1, ele.card.length - 1);
					if(index <= 2) {
						that.points.x += obj[parseInt(temp)];
						if(that.points.x >= 10) {
							that.points.x -= 10;
						}
					} else {
						that.points.z += obj[parseInt(temp)];
						if(that.points.z >= 10) {
							that.points.z -= 10;
						}
					}
				})
				var s = that.points;
				//通过点数判断庄赢还是闲赢，并播放音乐
				that.showNum = true;
				that.winMusic('x' + s.x, true);
				setTimeout(() => {
					that.winMusic('z' + s.z, true);
				}, 1200)

				setTimeout(() => {
					if(s.x - s.z > 0) {
						that.winMusic('xianWin', true);
					} else if(s.x - s.z == 0) {
						that.winMusic('he', true);
					} else {
						that.winMusic('zhuangWin', true);
					}
					that.showNum = false;

					//语音结束之后刷新结算余额
					that.$store.dispatch('getAccount');

					//收起已下注筹码；
					that.odds.top.map(ele => {
						ele.Chips = [];
						ele.BETED_AMT = 0;
					});
					that.odds.middle.map(ele => {
						ele.Chips = [];
						ele.BETED_AMT = 0;
					});
					that.odds.bottom.map(ele => {
						ele.Chips = [];
						ele.BETED_AMT = 0;
					});
					//that.$store.dispatch('getUserWin');
				}, 2000)
			},
			//重新下注
			onCancelClick() {
				//this.playAudio('clearBet',true);
				//this.index = -1;
				//this.count = 0;
				this.zhuangSum = 0;
				this.xianSum = 0;
				this.odds.top.map(ele => {
					ele.BET_AMT = 0;
					ele.Chips = [];
				});
				this.odds.middle.map(ele =>{
					ele.BET_AMT = 0;
					ele.Chips = []
				});
				this.odds.bottom.map(ele =>{
					ele.BET_AMT = 0;
					ele.Chips = []
				});
			},
			handleTouch(i, item, ev) {
				this.playAudio('chipClick', true);
				this.index = i;
				this.count = item;
				this.bindClass = item;
				this.delayPos = this.offset(ev.currentTarget);
			},
			//产生指定范围内的随机数
			reandom(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			},
			//获取点击元素的位置
			offset(ele) {
				var pos = {
					left: 0,
					top: 0,
					w: ele.offsetWidth,
					h: ele.offsetHeight
				};
				while(ele) {
					pos.left += ele.offsetLeft;
					pos.top += ele.offsetTop;
					ele = ele.offsetParent;
				}
				return pos;
			},
			//初始化
			init() {
				const that = this;
				if(that.islogin) {
					api.GetLotOddsDictList(res => {
						that.odds = {
							top: [],
							middle: [],
							bottom: []
						};
						for(let i in res) {
							for(let j in res[i]) {
								//这里将BET_AMT字段赋值为0是为了后面计算方便;
								res[i][j].BET_AMT = 0;
								//为了下注后桌子上留下注金额
								res[i][j].BETED_AMT = 0; 
								//给数据扩展一个数组用于显示筹码
								res[i][j].Chips = Array();
								
								if(res[i][j].GROUP_NAME == '闲庄和') {
									that.odds.bottom.push(res[i][j])
								} else if(res[i][j].GROUP_NAME == '对子') {
									that.odds.middle.push(res[i][j])
								} else {
									that.odds.top.push(res[i][j])
								}
							}
						}
					}, 1912)
				}

			},
			//获取开奖时间
			getOpenTime() {
				const that = this;
				api.getTicTime(res => {
					if(res.state == 'error') {
						that.$toast('网络错误，请稍后重试！');
					} else {
						if(res.EFF_IND === '0') {
							that.$toast('该游戏已关闭！')
							that.$router.push({
								path: '/LotteryGame',
							});
						} else {
							that.openInfo.Nextexpect = res.PERIODS_NO;
							that.openInfo.closeTime = res.SEALING_SEC;
							that.openInfo.ResultTime = res.NEXT_SEC;
						}
					}
				}, 1912, 'baijiale')
			},
			//获取走珠
			GetWinResult() {
				const that = this;
				this.Result = [];
				var param = {
					game_id: 1912,
					rpt_date: new Date().Format('yyyy-MM-dd'),
					top: 50,
				}
				api.GetWinResult(res => {
					that.shuffle(res);
					that.statisFn(res);
					res.forEach(ele => {
						var Json = JSON.parse(ele.JSON_RESULT);
						that.Result.push({
							name: Json['闲庄和'][0],
							periods: ele.PERIODS_NO,
							isDraw: Json['闲庄和'][0] == '和' ? 1 : 0
						})
					})
					//翻转一下数组，因为开奖结果是从后面取的；
					that.Result = that.Result.reverse();
					that.inibigRoad();
				}, param);
			},
			//组织庄闲两面的数据
			shuffle(res) {
				var arr = [],
					obj = {};
				res.forEach((ele, index) => {
					var temp = JSON.parse(ele.JSON_RESULT);
					arr.push(temp['闲庄和'][0]);
				})
				arr = arr.reverse();
				var col = 1, //行
					row = 1; //列
				for(let i = 0; i < arr.length; i++, row++) {
					if(row >= 7) {
						row = 1;
						col += 1;
					}
					obj[col + '-' + row] = arr[i];
				}
				this.sides = obj;
			},
			//庄，闲，和，庄对，闲对，局数 计数
			statisFn(res) {
				const that = this;
				that.statis = {
					x: 0,
					z: 0,
					h: 0,
					xd: 0,
					zd: 0,
					fe: 0,
					len: 0
				}
				that.statis.len = res.length;
				var temp = {
					'0': 0,
					'1': 1,
					'2': 2,
					'3': 3,
					'4': 4,
					'5': 5,
					'6': 6,
					'7': 7,
					'8': 8,
					'9': 9,
					'10': 0,
					'11': 0,
					'12': 0,
					'13': 0,
					'NaN': 0
				}
				res.forEach(e => {
					var split = e.OPEN_CODE.split(',');
					var JsonString = JSON.parse(e.JSON_RESULT);
					if(JsonString['闲庄和'].includes('庄')) {
						that.statis.z += 1;
					}
					if(JsonString['闲庄和'].includes('和')) {
						that.statis.h += 1;
					}
					if(JsonString['闲庄和'].includes('闲')) {
						that.statis.x += 1;
					}
					if(JsonString['对子'][0].includes('闲对')) {
						that.statis.xd += 1;
					}
					if(JsonString['对子'][0].includes('庄对')) {
						that.statis.zd += 1;
					}
					split.forEach((l, i) => {
						var m = l.substr(l.indexOf('-') + 1, l.length - 1);
						var x = 0,
							y = 0;
						if(i <= 2) {
							x += temp[parseInt(m)];
							if(x >= 10) {
								x -= 10;
							}
						} else {
							y += temp[parseInt(m)];
							if(y >= 10) {
								y -= 10;
							}
						}
						if(x >= 8 || y >= 8) {
							that.statis.fe += 1;
						}
					})
				})
			},
			//获取开奖结果
			GetLotteryData_DB() {
				const that = this;
				api.GetLotteryData_DB(res => {
					var data = JSON.parse(res);
					that.collpose = [];
					if(data.state == 'error') {
						that.$toast(data.msg);
						return
					};
					//取开奖结果，过滤掉为空的部分
					that.bink = data.Code.split(',').filter(n => n);
					that.openInfo.expect = data.Expect;
					var temp = data.Opencode.split(',');
					//加上牌的排列顺序
					var desc = [1, 3, 5, 2, 4, 6];
					temp.forEach((ele, index, arr) => {
						that.collpose.push({
							card: ele,
							index: desc[index]
						});
					})
				}, 1912, 'baijiale')
			},
			inibigRoad() {
				var that = this;
				var rank = [1, 1];
				var temprank = 0; //记录行数排满后向右拐的次数
				var echrow = 6; //每列6行
				var MostRight = 0;//最后边显示到第几列
				that.Bigroad = {};
				for(var x = 0; x < this.Result.length; x++) {
					var ex = this.Result[x - 1] //上期结果
					var now = this.Result[x] //本期结果
					var obj = {
						'name': now.name,
						"P_Couplet": '',
						"B_Couplet": '',
						"isDraw": 0
					} //P_Couplet闲是否对子，B_Couplet 庄是否对子 是否和局
					if(ex) { //如果上期存在
						if(now.name == '和') {
							this.Bigroad[rank[0] + '-' + rank[1]].isDraw++; //如果当期是和，只加isDraw的次数
						} else if(this.Bigroad[rank[0] + '-' + rank[1]].name == now.name) { //如果和上期结果相同或上局为和，此时向下排
							if(this.Bigroad[(rank[0] + 1) + '-' + rank[1]]) { //例如排到当列的第五行，检查到第六行有数据，就不能向下排，只能横向排
								echrow = rank[0];
							}
							if(this.Bigroad['1-1'].name == '') { //处理第一句开和局的情况
								this.Bigroad['1-1'].name = now.name;
							} else if(rank[0] == echrow) {
								temprank++; //记录拐弯了几次
								rank[1]++;
								this.Bigroad[rank[0] + '-' + rank[1]] = obj
							} else {
								rank[0]++
									this.Bigroad[rank[0] + '-' + rank[1]] = obj
							}
						} else { //换列
							rank[1] = rank[1] - temprank; //换列 把前面拐弯次数减去
							rank[1]++;
							rank[0] = 1;
							temprank = 0; //换列复原
							echrow = 6; //换列复原
							this.Bigroad[rank[0] + '-' + rank[1]] = obj
						}
						if(rank[1]>MostRight){//寻找最大偏移量
							MostRight = rank[1]
						}
					} else { //第一期
						if(now.name == '和') {
							obj = {
								'name': '',
								"P_Couplet": '',
								"B_Couplet": '',
								"isDraw": 1
							}
						}
						this.Bigroad['1-1'] = obj
					};
				};
				if(MostRight>25){
					that.BigroadDiff = MostRight-25;
				} else {
					that.BigroadDif = 0;
				}
				that.BigEyd = that.intUnderRoad(1); //1 大眼路
				that.SmallRoad = that.intUnderRoad(2); //2 小路
				that.jyRoad = that.intUnderRoad(3); //3 曱甴路
			},
			//返回数据格式
			intUnderRoad(cnt) {
				var that = this;
				var UnderRoad = [];
				var lastItem = [];
				var ReturnData = [];
				var MostRight = 0;//最后边显示到第几列
				for(var item in this.Bigroad) {
					var items = item.split("-");
					if(items[1] - cnt > 0) { //和前几列的对比？ 没的比就不做操作咯！
						if(items[0] > 1) { //路中牌
							if((!this.Bigroad[items[0] + '-' + (parseInt(items[1]) - cnt)]) && this.Bigroad[(parseInt(items[0]) - 1) + '-' + (parseInt(items[1]) - cnt)]) { //两房一厅？划蓝色
								UnderRoad.push('blue')
							} else {
								UnderRoad.push('red')
							}

						} else { //路头牌
							if(items[1] == (cnt + 1)) {
								//路头排第一句不用操作
							} else if((!this.Bigroad[(parseInt(lastItem[0]) + 1) + '-' + (parseInt(lastItem[1]) - cnt)]) && this.Bigroad[lastItem[0] + '-' + (parseInt(lastItem[1]) - cnt)]) { //两房一厅？划蓝色
								UnderRoad.push('red')
							} else {
								UnderRoad.push('blue')
							}
						}
					}
					lastItem = item.split("-");
				}

				var rank = [1, 1];
				var temprank = 0; //记录行数排满后向右拐的次数
				var echrow = 6; //每列6行
				for(var x = 0; x < UnderRoad.length; x++) {
					var ex = UnderRoad[x - 1] //上期结果
					var now = UnderRoad[x] //本期结果

					if(ex) { //如果上期存在
						if(ex == now) { //如果和上期结果相同或上局为和，此时向下排
							if(ReturnData[(rank[0] + 1) + '-' + rank[1]]) { //例如排到当列的第五行，检查到第六行有数据，就不能向下排，只能横向排
								echrow = rank[0];
							}
							if(rank[0] == echrow) {
								temprank++; //记录拐弯了几次
								rank[1]++;

							} else {
								rank[0]++
							}
							ReturnData[rank[0] + '-' + rank[1]] = now

						} else { //换列
							rank[1] = rank[1] - temprank; //换列 把前面拐弯次数减去
							rank[1]++;
							rank[0] = 1;
							temprank = 0; //换列复原
							echrow = 6; //换列复原
							ReturnData[rank[0] + '-' + rank[1]] = now
						}
						if(rank[1]>MostRight){//寻找最大偏移量
							MostRight = rank[1]
						}
					} else { //第一期
						ReturnData['1-1'] = now

					};
				};
				
				if(cnt==2){
					if(MostRight>25){
						that.SmallRoadDiff = SmallRoadDiff -26;
					}else{
						that.SmallRoadDiff = 0;
					}
				}else if(cnt==3 ){
					if(MostRight>25){
						that.jyDiff = jyDiff -26;
					}else{
						that.jyDiff = 0;
					}
				}
				
				return ReturnData
			}
		},
		watch: {
			resultTime(val) {
				const that = this;
				//这里这个val必须要大于8，因为发牌的动画是7.8秒左右；
				if(val == 11) {
					that.delayTo();
				} else if(val == 8) {
					that.distribute('betEnd');
					that.onCancelClick();
				} else if(val == 28) {
					that.distribute('betStart');
				} else if(val <= 3 && val % 3 == 0 && that.openInfo.expect != that.openInfo.Nextexpect) {
					that.GetLotteryData_DB();
				};
				if(val == -12) { //如果开奖失败，那么倒计时到这个时间点也要刷新下开盘
					that.getOpenTime();
				}
			},
			openExpect(nval, oval) {
				if((nval - oval) >= 1 && (nval - oval) <= 50) {
					this.rotateY();
				}
			},
			islogin() {
				this.init();
			},
			isShow(){
				$('.actionContent').slideToggle();
			}
		},
		beforeDestroy() {
			this.bgMusic.pause();
			clearInterval(this.WinInterval);
		},
	}
</script>

<style scoped="scoped" lang="scss">
	@import '~static/sass/baccarat.scss';
	.cell-cutdown {
		position: relative;
	}
	
	.audio_Off {
		position: absolute;
		top: 10px;
		left: 0;
		width: 20px;
		height: 20px;
	}
	
	.audio_no {
		background: url('~static/img/public/baijiale/m_close.png') center no-repeat;
		background-size: 20px;
	}
	
	.audio_yes {
		background: url('~static/img/public/baijiale/m_open.gif') center no-repeat;
		background-size: 20px;
	}
	
	.tableNumber {
		color: $colorgreen;
		text-align: center;
		transform: scale(.8);
		font-size: 12px;
		line-height: .2rem;
	}
	
	.icon {
		padding: 0 4px;
		font-size: 14px;
		vertical-align: -1px;
	}
</style>