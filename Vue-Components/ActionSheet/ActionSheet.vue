<template>
	<div id="actionsheet">
		<transition name="fade">
			<div class="action_mask" :show="show" v-show="show"></div>
		</transition>
		<transition name="bounce">
			<div class="action" :show="show" v-show="show">
				<slot name="action"></slot>
			</div>
		</transition>
	</div>
</template>
<script>
	export default {
		props: {
			show: Boolean,
		},
		methods: {
			hideAction() {
				this.$emit('hide')
			},
		},
		mounted() {
			const that = this;
			
			mui.init();
			mui.ready(function() {
				mui('#actionsheet').on('tap','.action_mask',function(){
					that.hideAction();
				})
			})
		},
	}
</script>
<style lang="scss" scoped>
	.action {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: #efefef;
		z-index: 100;
		display: flex;
		flex-direction: column;
		.action_title {
			text-align: center;
			height: 0.6rem;
			color: #ccc;
			font-size: 0.24rem;
			line-height: 0.6rem;
		}
	}
	.mui-table-view-cell>a:not(.mui-btn).mui-active{
		background-color: #fff;
	}
	.mui-table-view {
		font-size: 0.24rem;
		&:after {
			display: none;
		}
		&:before{
			display: none;
		}
	}
	
	.action_mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0.5;
		z-index: 20;
	}
	
	.bounce-enter-active {
		animation: bounce-in .35s;
	}
	
	.bounce-leave-active {
		animation: bounce-out .35s;
	}
	
	@keyframes bounce-in {
		0% {
			transform: translate3d(0,100%,0);
		}
		100% {
			transform: translate3d(0px);
		}
	}
	
	@keyframes bounce-out {
		0% {
			transform: translate3d(0px);
		}
		100% {
			transform: translate3d(0,100%,0);
		}
	}
	
	.fade-enter,
	.fade-leave-active{
	  opacity: 0;
	}

	.fade-leave-active,
	.fade-enter-active {
	  transition: opacity 300ms!important;
	}
</style>