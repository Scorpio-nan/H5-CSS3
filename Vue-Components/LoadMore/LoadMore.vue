<template>
	<div id="LoadMore" ref="LoadMoreContent">
		<div class="mui-scroll-wrapper" id="pullrefresh">
			<div class="mui-scroll">
				<div class="innerList" :style="'height:'+ height + 'px'">
					<slot></slot>
				</div>
			</div>
		</div>
		<div class="Spinner-box" v-if="loadingShow">
			<template>
				<div>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="#fff">
						<circle cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
						<circle transform="rotate(45 16 16)" cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.125s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
						<circle transform="rotate(90 16 16)" cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.25s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
						<circle transform="rotate(135 16 16)" cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.375s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
						<circle transform="rotate(180 16 16)" cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
						<circle transform="rotate(225 16 16)" cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.625s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
						<circle transform="rotate(270 16 16)" cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.75s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
						<circle transform="rotate(315 16 16)" cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.875s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
						<circle transform="rotate(180 16 16)" cx="16" cy="3" r="0">
							<animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
						</circle>
					</svg>
					<span style="vertical-align: 10px;margin-left: 6px;">{{noDataText}}</span>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	var EventUtil = {
		addHandler: function(element, type, handler) {
			if(element.addEventListener) {
				element.addEventListener(type, handler, false);
			} else if(element.attachEvent) {
				element.attachEvent('on' + type, handler);
			} else {
				element["on" + type] = handler
			}
		},
		removeHandler: function(element, type, handler) {
			if(element.removeEventListener)
				element.removeEventListener(type, handler, false);
			else if(element.deattachEvent) {
				element.deattachEvent('on' + type, handler);
			} else {
				element["on" + type] = null;
			}
		}
	};

	import Spinner from './Spinner';
	export default {
		name: 'LoadMore',
		components: {
			Spinner
		},
		data() {
			return {
				height: 0,
				loadingShow: false,
				finished: true,
				noDataText: '正在加载...',
				Spinner: true,
				Scroller:null,
			}
		},
		props: {
			ScrollHeight: {
				type: Number,
				default: 0
			},
			onInfinite: Function,
			pullrefresh: {
				type: String,
				default: 'reset'
			},
			reset: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			const that = this;
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005
			})
			//如果传进来的高度比节点高度大
			this.getHeight();

			that.Scroller = document.querySelector('#pullrefresh');

			EventUtil.addHandler(that.Scroller,'scroll', function(e) {
				if(that.finished && that.pullrefresh == 'reset') {
					if(Math.abs(e.detail.y) - Math.abs(e.detail.maxScrollY) >= 80) {
						that.finished = false;
						that.loadingShow = true;
						setTimeout(() => {
							that.onInfinite();
							that.loadingShow = false;
							that.finished = true;
							return false;
						}, 2000)
					}
				}
			})
			mui.init();
			mui.ready(function() {

			})
		},
		beforeDestroy(){
			EventUtil.removeHandler(this.Scroller,'scroll',function(e){console.log(e)})
		},
		methods: {
			getHeight() {
				this.ScrollHeight <= this.$refs.LoadMoreContent.offsetHeight ? this.height = this.$refs.LoadMoreContent.offsetHeight + 1 : this.height = this.ScrollHeight;
			}
		},
		watch: {
			pullrefresh(val) {
				const that = this;
				if(val == 'reset') {
					that.finished = true;
					that.noDataText = '正在加载...';
				} else {
					that.finished = false;
				}
			},
			ScrollHeight(val) {
				this.getHeight();
			},
			reset(val) {
				this.finished = true;
				mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 0);
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#LoadMore {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	
	.Spinner-box {
		position: absolute;
		bottom: 0.24rem;
		left: 50%;
		transform: translate(-50%, 0);
		width: 4rem;
		height: 45px;
		border-radius: 40px;
		z-index: 100;
		background: rgba(0, 0, 0, 0.7);
		line-height: 45px;
		color: #fff;
		font-size: 0.28rem;
	}
</style>