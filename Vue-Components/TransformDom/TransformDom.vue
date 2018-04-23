<template>
	<transition name="fadeIn">
		<div class="domClick" v-show="show">
			<div id="DomBg" v-show="show">
				<transition name="bounce">
					<div class="DomContent" v-show="show">
						<slot></slot>
					</div>
				</transition>
			</div>
		</div>
	</transition>
</template>

<script>
	export default{
		name:'DomBg',
		props:{
			show:{
				type:Boolean
			}
		},
		data(){
			return{
				
			}
		},
		mounted(){
			const that = this;
			mui.init();
			mui.ready(function(){
				
				mui('.domClick').on('tap','#DomBg',function(){
					that.handleMask();
				})
				
			})
		},
		methods:{
			handleMask(){
				this.$emit('handleHide')
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.domClick{
		position: fixed;
		width: 100%;
		height: 100%;
		top:0;
		left: 0;
		z-index: 199;
	}
	#DomBg{
		position: fixed;
		width: 100%;
		height: 100%;
		top:0;
		left: 0;
		background: rgba(0,0,0,0.5);
		z-index: 200;
		.DomContent{
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
	}
	
	
	/* 
	 *	红包遮罩淡入淡出
	 ***/
	
	.fadeIn-enter-active {
		animation: fade-in .5s;
	}
	
	.fadeIn-leave-active {
		animation: fade-out .5s;
	}
	
	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	
	@keyframes fade-out {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	/*
	 *  红包里面的小包包弹出
	 ***/
	
	.bounce-enter-active {
		animation: bounceIn .35s;
		transform-origin: 0 0;
	}
	
	.bounce-leave-active {
		animation: bounceOut .35s;
		transform-origin: 0 0;
	}
	
	@keyframes bounceIn {
		0% {
			opacity: 0;
			transform: scale3d(0, 0, 0)translate(-50%, -50%);
		}
		20% {
			transform: scale3d(.2, .2, .2)translate(-50%, -50%);
		}
		40% {
			transform: scale3d(.4, .4, .4)translate(-50%, -50%);
		}
		60% {
			opacity: 1;
			transform: scale3d(.6, .6, .6)translate(-50%, -50%);
		}
		80% {
			transform: scale3d(.8, .8, .8)translate(-50%, -50%);
		}
		to {
			opacity: 1;
			transform: scale3d(1, 1, 1)translate(-50%, -50%);
		}
	}
	
	@keyframes bounceOut {
		20% {
			transform: scale3d(.9, .9, .9)translate(-50%, -50%);
		}
		50%,
		55% {
			opacity: 1;
			transform: scale3d(1.1, 1.1, 1.1)translate(-50%, -50%);
		}
		to {
			opacity: 0;
			transform: scale3d(.3, .3, .3)translate(-50%, -50%);
		}
	}
</style>