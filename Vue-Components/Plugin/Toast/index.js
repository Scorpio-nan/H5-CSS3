import ToastTpl from './Toast';
export default {
    install(Vue, options) {
        Vue.prototype.$Toast = function (options) {
            const Toast = Vue.extend(ToastTpl);
            
            let $tpl = null;

            if (!$tpl) {
                $tpl = new Toast();

                $tpl.$mount();
            }
            //如果调用的地方传递过来的直接是一个字符串, 那就直接弹出字符串;
            if (typeof options === 'string') {
                $tpl.options.content = options;
                options = {};
            }
            //为了确保组件里面能拿到传进来的 options , 将默认属性和传进来的参数合并;
            Object.assign($tpl.options, options);

            //创建的时候就调用组件里面的属性, 用来控制过渡动画
            $tpl.visible = true;

            document.body.appendChild($tpl.$el);

            setTimeout(function () {
                //根据插件被调用的时间来执行组件的关闭事件, 触发动画钩子;
                $tpl.visible = false;
            }, $tpl.options.duration)
        }
    }
}





















