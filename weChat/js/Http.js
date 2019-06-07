(function () {

    axios.defaults.baseURL = "http://localhost:3001";

    var Http = function () { };

    //文件上传
    Http.prototype.UploadFile = function (param, resCallback, errCallback) {
        axios({
            methods: 'POST',
            url: '/uuid',
            data: param,
            responseType: 'json',
            timeout: 8000,
            //表示跨域请求时是否需要使用凭证
            withCredentials: false,
        }).then(function (res) {
            resCallback(res.data);
        }).catch(function (err) {
            errCallback(err);
        })
    }

    //用户登录
    Http.prototype.Login = function (param, resCallback, errCallback) {
        axios({
            methods: 'POST',
            url: '/login',
            data: param,
            responseType: 'json',
            timeout: 8000,
            //表示跨域请求时是否需要使用凭证
            withCredentials: false,
        }).then(function (res) {
            resCallback(res.data);
        }).catch(function (err) {
            errCallback(err);
        })
    }

    //获取首页菜单列表
    Http.prototype.menuList = function (param, resCallback, errCallback) {
        axios({
            methods: 'POST',
            url: '/menuList',
            data: param,
            responseType: 'json',
            timeout: 8000,
            //表示跨域请求时是否需要使用凭证
            withCredentials: false,
        }).then(function (res) {
            resCallback(res.data);
        }).catch(function (err) {
            errCallback(err);
        })
    }


    window.$http = new Http();
}())
