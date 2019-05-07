<template>
	<div id="pluginKeyborad" :style="onShow ? {'z-index':'1000'} : {'z-index':'-1'}">
		<transition name="fade">
			<div id="keyborad-mask" v-if="onShow" @touchend="emitHiden()"></div>
		</transition>
		<transition name="action">
			<div class="keyborad" v-if="onShow">
				<table class="table-number" cellpadding="0" cellspacing="0" border="0" :style="additShow ? {'width':'80%'} : {'width':'100%'}">
					<tr>
						<td colspan="4" class="before-none">{{result}}</td>
					</tr>
					<tr v-for="(arr,i) in values">
						<td v-for="(num,index) in arr" @touchend="onKeyTouch(num)"><span :style="num == 'C' ? {'color':'red'} : {}">{{num}}</span></td>
					</tr>
				</table>
				<table v-if="additShow" class="table-addition" cellpadding="0" cellspacing="0" border="0" :style="additShow ? {'width':'20%'} : {'width':'0'}">
					<tr>
						<td></td>
					</tr>
					<tr v-for="(item,i) in addarray">
						<td @touchend="onAddTouch(item)"><span>+{{item}}</span></td>
					</tr>
				</table>
			</div>
		</transition>
	</div>
</template>
<script>
	/*
	 *  onShow     控制小键盘显示或者隐藏
	 *  additShow  控制右边的加减小键盘显示隐藏
	 *  isNumber   当前键盘点击，如果不是纯数字的话那就执行加法运算，如果是数字的话就返回数字组合
	 * */
	export default{
		props:{
			onShow:{
				type:Boolean,
				default:false
			},
			additShow:{
				type:Boolean,
				default:false
			},
			isNumber:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				values:[
					[1,2,3],
					[4,5,6],
					[7,8,9],
					['C',0,'X']
				],
				addarray:[200,300,500,1000],
				result:'',
				count:0
			}
		},
		methods:{
			onKeyTouch(num){
				if(num == 'X'){
					this.result = this.result + '';
					try{
						this.result = this.result.substr(0,this.result.length -1);
					}catch(e){}
					if(this.result == ''){
						this.result = '';
						this.count = 0;
					}
					return;
				}
				
				if(!this.isNumber){
					this.result += num;
				}else{
					this.count += num;
					this.result = this.count;
				}
				
				if(num == 'C'){
					this.result = '';
					this.count = 0;
				} 
			},
			onAddTouch(num){
				this.count += num;
				this.result = this.count;
			},
			emitHiden(){
				this.result = '';
				this.count = 0;
				this.$emit('onHiden',false);
			}
		}
	}
</script>

<style scoped="scoped">
	#pluginKeyborad{
		position: fixed;
		left: 0;
		bottom: 0;
		backface-visibility: hidden;
		z-index: -1;
		width: 100%;
		height: 100%;
		background:transparent;
	}
	#keyborad-mask{
		position: fixed;
		z-index: 1000;
		width: 100%;
		height: 100%;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .5);
	}
	.keyborad{
		position: fixed;
		left: 0;
		bottom: 0;
		transform: translate(0, 0);
		backface-visibility: hidden;
		z-index: 5000;
		width: 100%;
		background: #f1f1f1;
		transition: transform .35s;
	}

	.fade-enter,
	.fade-leave-active{
	  opacity: 0;
	}
	.fade-leave-active,
	.fade-enter-active {
	  transition: opacity 300ms!important;
	}
	
	.action-enter,
	.action-leave-active{
	  transform: translate(0, 100%);
	}
	.action-leave-active,
	.action-enter-active {
	  transition: transform 300ms!important;
	}
	.table-number{
		width: 100%;
		background: #fff;
		float: left;
		cursor: pointer;
	}
	.table-number tr,.table-addition tr{
		height: 1rem;
	}
	.table-number tr td{
		position: relative;
		width: 33.3333%;
	}
	.table-number tr td:active{
		background: #f1f1f1;
	}
	.table-number tr td:after {
		content: "";
		display: block;
		border-bottom: 1px solid #f5f5f5;
		width: 100%;
		background: #ccc;
		position: absolute;
		bottom: 0;
		left: 0;
		transform-origin: 0 0;
		transform: scaleY(0.5);
	}
	.table-number tr td:before{
		display: block;
		content: "";
		width: 1px;
		height: 100%;
		background: #ccc;
		position: absolute;
		right: 0;
		top: 0;
		transform: scaleX(0.5);
	}
	.table-number tr .before-none:before{
		display: none;
	}
	.table-addition{
		width: 20%;
		float: left;
		background: #fff;
		cursor: pointer;
	}
	.table-addition tr td{
		position: relative;
	}
	.table-addition tr td:after {
		content: "";
		display: block;
		border-bottom: 1px solid #f5f5f5;
		width: 100%;
		background: #ccc;
		position: absolute;
		bottom: 0;
		left: 0;
		transform-origin: 0 0;
		transform: scaleY(0.5);
	}
	.table-addition tr td:active{
		background: #f1f1f1;
	}
</style>
