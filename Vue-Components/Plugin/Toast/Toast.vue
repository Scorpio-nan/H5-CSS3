<template>
    <transition name="fade" @after-leave="handleAfterLeave">
        <div class="ui-alert" v-show="visible">
            {{options.content}}
        </div>
    </transition>
</template>

<script>
    export default {
        name: "alert",
        data() {
            return {
                //弹出框默认配置
                options: {
                    duration: 2500,
                    type: 'info',
                    mask: true,
                    width: 'auto',
                    content: ''
                },
                visible: false,
                closed:false
            }
        },
        methods: {
            handleAfterLeave(el) {
                //console.log(el);
                /*
                 * transition 对应的动画钩子
                 * v-on:before-enter="beforeEnter"
                 * v-on:enter="enter"
                 * v-on:after-enter="afterEnter"
                 * v-on:enter-cancelled="enterCancelled"
                 * v-on:before-leave="beforeLeave"
                 * v-on:leave="leave"
                 * v-on:after-leave="afterLeave"
                 * v-on:leave-cancelled="leaveCancelled"
                 *  返回的都是 Node 节点
                 **/
                //动画执行完成之后销毁dom节点
                this.$destroy(true);
                this.$el.parentNode.removeChild(this.$el);
            }
        }
    }
</script>

<style scoped>
    .ui-alert {
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        background:rgba(0,0,0,0.8);
        border-radius:5px;
        color:#fff;
        padding:6px 12px;
        transition:all .75s ease;
        font-size:14px;
        max-width:200px;
    }
    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
    .fade-leave-active,
    .fade-enter-active {
        transition: opacity 300ms !important;
    }
</style>
