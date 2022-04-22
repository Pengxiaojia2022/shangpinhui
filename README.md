# app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 项目目录介绍
node_modules ： 项目所用到的依赖
pubulic ： 文件夹中的资源webpack进行打包时会原封不动的打包至dist文件夹
src/assets ：放置静态资源，一般放置多个组件共用的静态资源。webpack打包时会把这些资源当作一个模块打包至js文件中
src/components ：放置非路由组件或者是常用的全局组件
src/App.vue ： 项目中唯一的根组件
src/main.js ： 程序的入口文件，也是程序最先执行的文件
.gitignore : git忽略文件
babel.config.js ： 配置文件，与babel相关。把es6语法翻译为es5兼容更好等翻译工作
package.json ： 记录项目信息，项目名称，怎么运行，依赖有什么
package-lock.json ： 缓存性的文件
README.md ： 说明性的文件，项目说明

## 项目的其他配置
1. 项目运行起来时，让浏览器自动打开
---package.json中
"scripts": {
    "serve": "vue-cli-service serve --open",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },

2. eslint校验功能的关闭
---vue.config.js中
module.exports = {
    lintOnSave:false
}

3. src文件夹配置别名
---jsconfig.json

@ 符就代表src文件夹，会方便很多
{
    "compilerOptions":{
        "baseUrl":"./",
        "paths":{
            "@/*":["src/*"]
        }
    },
    "exclude":["node_modules","dist"]
}

## 项目的路由分析
前端所谓路由就是key:value键值对儿，key是url，vaule是相应的路由组件
vue-router

尚品汇：上中下模式结构，上和下固定不变为非路由组件，中间区域发生变化
路由组件：
    Home
    Search
    Login
    Register
非路由组件：
    Header 【首页、搜索页有】
    Footer【在首页、搜索页有，登录页、注册页没有】

## Header 与 Footer 非路由组件完成
1. 书写静态页面
2. 拆分组件
3. axios获取数据动态展示
4. 完成相应的动态业务逻辑

注意1： 项目采用less写的样式，浏览器不识别less样式，需要通过less、less-loader进行处理less，把less样式变为css样式，浏览器才能够识别 cnpm i less less-loader@5 -S
注意2：<style></style>标签加上lang属性，值为less

## 完成路由组件的搭建
vue-router   cnpm i vue-router -S

1. 路由组件一般放置在src/pages或者src/views文件夹中，非路由组件一般在src/components中
2. 路由组件一般需要在router文件夹中进行注册
3. 注册完路由，不管是路由组件还是非路由组件身上都会有$route和$router属性
4. 重定向，在项目跑起来的时候，访问/，就定向至home

$route:一般获取路由信息【路径、query、params等等】
$router:一般进行编程式导航路由跳转【push、replace】

5. 路由的跳转
路由的跳转有两种形式
声明式导航 <router-link/>
编程式导航 this.$router.push()或者this.$router.replace() 记历史记录和不记录的区别。入栈和替换

声明式导航能做的编程式导航都能做，编程式导航除了路由跳转还可以做其他的业务逻辑。
比如说登录页面的登录按钮，跳转路由之前还有其他的逻辑处理

## 路由元的使用
Footer组件的显示隐藏，登录和注册是隐藏的
1. 可以根据组件身上的$route获取当前路由的信息，通过路由的路径进行判断Footer的显示与隐藏
    <Footer v-show="$route.path == '/home' || $route.path == '/search'" />
2. 通过路由元信息，定义路由时配置meta字段
    $route.meta.showFooter

## 路由传递参数
1. 路由的跳转有几种方式？
声明式导航：
编程式导航：
    query:
        this.$router.push({path:'/search',query:{keyword:this.keyword}})
        this.$router.push({name:'search',params:{keyword:this.keyword}})
        this.$router.push(`/search?k=${this.keyword}`)
    params:
        this.$router.push('/search/'+this.keyword)
2. 路由传参参数有几种？
params参数，属于路径中的一部分，在配置路由的时候需要占位 /home/:keyword
query参数，不属于路径中的一部分，类似于ajax中的queryString /home?k=v&k=v，不需要占位

## 路由传参相关面试题
1. 路由传递参数（对象写法）path是否可以结合params参数一起使用？
    答：不可以一起使用
2. 如何指定params参数可传可不传？
    答：/home/:keyword/:a?/:b?  a和b可传可不传，但是keyword必传
3. params参数可以传递也可以不传递，但是如果传递是空串，如何解决？
    答：this.$router.push({name:'search',params:{keyword:''},query:{k:this.keyword}})。
    url中少了search，变成了localhost:8080/#/?k=123
    解决办法：
        this.$router.push({name:'search',params:{keyword:'' || undefined},query:{k:this.keyword}})。
        使用undefined解决params参数可以传递或不传递时传的是空字符串
4. 路由组件能不能传递props数据？
    答：能传递，props有三种形式
    1) props为对象，只能传递死数据，额外的给路由组件传递一些props
        props:{
            a:'1',
            b:'2'
        }
    2) props为布尔值，但是只能接收params参数，把路由组件接收到的所有params参数以props的形式传递给路由组件
        props:true
    3) props为函数
        props($route){
            return {
                keyword:$route.query.keyword,
                a:$route.params.a
            }
        }

## 重写push与replace方法
1. 编程式路由跳转当前路由（参数不变），多次执行会抛出NavigationDuplicated的警告错误？
    1) 声明式导航没有这类问题，vue-router底层已经处理好了
2. 为什么编程式导航跳转时就有这种警告错误呢？
    vue-router的版本是3.5.3，他引入了promise
    this.$router.push()的返回值是一个Promise对象，
    解决办法：
    1) 传一个成功的回调及一个失败的回调，捕获当前的错误，可以解决，但是治标不治本。将来在别的组件当中push\replace,编程式导航还是会报这样的错误
    this.$router.push({path:'/search',query:{keyword}},()=>{},()=>{})
    2) 
        this:当前组件实例
        this.$router属性：是VueRouter的实例对象，当在入口文件注册路由的时候，给路由组件实例添加的$router
        this.$router.push()方法：是VueRouter原型对象上的一个方法

        router/index.js中
        let originPush = VueRouter.prototype.push;  // 备份原始方法
        // 参数1：告诉原来的push方法，你往哪里跳转，有哪些参数
        // 参数2：成功的回调
        // 参数3：失败的回调
        VueRouter.prototype.push = function(location,resolve,reject){
            if(resolve && reject){
                // call | apply区别，
                // 相同点：都可以调用函数一次，都可以篡改函数的上下文一次
                // 不同点：call和apply传递参数，call传递参数用逗号隔开，apply方法执行，传递数组
                // 不用call的话push方法的上下文为window，要让他的上下文为this.$router
                originPush.call(this,location,resolve,reject)
            }else{
                originPush.call(this,location,()=>{},()=>{})
            }
        }

## home组件拆分业务
1. 静态页面  -- 已有结构
2. 拆分出静态组件进行展示  -- 三级联动（全局组件，很多地方都用到）、轮播图及尚品汇快报、今日推荐、热卖排行、猜你喜欢、家用电器和手机通讯、各大品牌的logo七个组件
3. 获取服务器的数据进行展示
4. 动态业务的完成

## 三级联动全局组件完成，只需要注册一次
---由于三级联动在home\search\detail都使用了，就把三级联动注册为全局组件，只需要注册一次，就可以在项目任意位置使用
main.js中注册全局组件，参数1：组件的名字，参数2：注册哪个组件就是组件的内容
Vue.component(TypeNav.name,TypeNav)

## 首页其余静态组件拆分
HTML + css + 图片资源

## postman测试接口
三级联动：..查看接口文档
--如果服务器返回数据code字段200，代表服务器返回数据成功

## axios二次封装
1. XMLHttpRequest
2. fetch
3. jq
4. axios
为什么需要进行二次封装axios?
--主要是为了请求拦截器和响应拦截器
    --请求拦截器：发请求前处理一下业务
    --响应拦截器：服务器返回数据之后可以处理一些事情
cnpm i axios -S

在项目当中经常出现api文件夹，一般都是关于axios的
src/api/request.js

import axios from "axios";

1. 利用axios对象的方法create，去创建一个axios实例
const requests = axios.create({
    baseURL:"/api", // 表示基于哪个路径，接口当中路径都带有/api
    timeout:5000, // 请求超时的时间为5秒，5秒没有响应就请求失败了
})

2. 请求拦截器，在发请求之前，请求拦截器可以检测到
requests.interceptors.request.use((config)=>{
    // config:配置对象，对象里面有一个重要属性，header请求头
    return config;
})

3. 响应拦截器
requests.interceptors.reponse.use((res)=>{
    // 成功的回调
    return res.data;
},(error)=>{
    // 失败的回调
    return Promise.reject(error);
})

export default requests;

## API接口统一管理
项目很小：完全可以在组件的生命周期函数中发请求。比如就两三个组件
项目很大：
    src/api/index.js 当前这个模块，API进行统一管理
    import requests from "./request";

    // 三级联动接口
    export const reqCategoryList = ()=>{
        // 发请求，返回的是promise对象
        return requests({
            url:'/product/getBaseCategoryList',
            method:'get'
        })
    }

解决跨域：
    协议、域名、端口号不同的请求就跨域了。浏览器的同源策略
    JSONP、CROS、代理等方式

vue.config.json中配置代理
module.exports = {
    devServe:{
        proxy:{
            '/api':{
                target:'http://39.98.123.211'
            }
        }
    }
}

## nprogress 进度条的使用
cnpm i nprogress -S
只要发起请求，进度条就要进行动态展示。所以在请求响应拦截器中使用

import nprogress from 'nprogress';
// 引入进度条样式
import "nprogress/nprogress.css";
start 代表进度条开始   done 代表进度条结束
请求前：nprogress.start();
请求后：请求成功：nprogress.done();

## vuex模块化开发
vuex是什么？vuex是官方提供的一个插件，是一个状态管理库，集中式管理项目中鞍共用的数据。并不是所有的项目都需要vuex，如果项目很小，完全不需要vuex

state
mutations
actions
getters
modules

1. cnpm i vuex -S
2. src/store/index.js
    import Vue from 'vue';
    import Vuex from 'vuex';
    Vue.use(Vuex)  //使用插件

    const state = {
        //存储数据
    }

    const mutations = {
        // 修改State的唯一手段
    }

    const actions = {
        // 处理actions的地方，写自己的业务逻辑，也可以处理异步
    }

    const getters = {
        // 对state中的数据进行处理。理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
    }

    export default new Vuex.Store({
        state
        mutations
        actions
        getters
    })

3. 入口文件引入store
import store from "src/store";

注册仓库
new Vue({
    sotre
}).$mount('#app')
组件实例的身上就会有一个属性：$store

4. 辅助函数
mapState
mapMutations
mapActions
mapGetters

5. 模块化 + namespaced
src/store/home.js
const homeOptions = {
    namespaced:true,
    state:{},
    actions:{},
    mutations:{},
    getters:{}
}
export default homeOptions;

src/store/index.js
import homeOptions from './home.js'
export default new Vuex.Store({
    modules:{
        homeOptions
    }
})

## 动态展示三级联动
import {mapState} from 'vuex';
mounted(){
    // 组件挂载完毕，向服务器发送请求
    // 通知vuex发请求，获取数据，存储于仓库中
    this.$store.dispatch('categoryList')

},
computed:{
    ...mapState({
        categoryList:($state)=>{
            // 当使用这个计算属性时，右侧函数就会立即执行一次，注入一个参数$state，即为大仓库里的数据
            return $state.home.state.categoryList
        }
    })
    ...mapState('home',['categoryList'])
}

home.js
import {reqCategoryList} from '@/api';

const state = {
    categoryList:[]
}
const actions = {
    async categoryList({commit}){
        let result = await reqCategoryList();
        if(result.code == 200){
            commit('CATEGORYLIST',result.data)
        }
    }
}
const mutations = {
    CATEGORYLIST(state,categoryList){
        state.categoryList = categoryList;
    }
}

## 三级联动动态背景颜色
1. 一级分类背景颜色
    -- 采用样式完成，hover效果 √
    -- 通过js完成 ，移动到商品分类上背景没有消失，用样式无法实现。后用js实现，绑定鼠标移入、移出和事件委托

## 通过js控制三级联动中二三级商品分类的显示隐藏
原先是通过样式控制的 display:none与display:block

## 通过演示卡顿现象引入防抖与节流
演示过程：在商品一级分类快速的移动鼠标，会频繁触发鼠标移入移出事件，十几个菜单本都应该触发事件，但是由于用户操作过快（浏览器反应不过来，解析代码需要时间），只触发了几次（部分h3触发了）
正常：事件触发非常频繁，而且每一次的触发，回调函数都要去执行（如果时间很短，而回调函数内部有计算，那么很可能出现浏览器卡顿）
节流：在规定的间隔时间范围内不会重复触发回调，只有大于这个时间间隔才会触发回调，把频繁触发变为少量触发
防抖：前面的所有的触发都被取消，最后一次执行在规定的时间之后才会触发，也就是说如果连续快速的触发，只会执行一次

## 函数防抖理解
例子：百度搜索，搜索的内容会调用接口，返回搜索结果展示。
-- 只要文本变化就发请求  ×
-- 用户输入完毕之后再发请求获取数据进行展示  √

解决：
-- 引入插件 lodash.js ，里面封装了函数的防抖与节流的业务【闭包+延迟器】
-- 返回值为函数
let result = _.debounce(function(){
    console.log('我在1秒之后执行一次')
},1000)

## 函数节流理解
例子：计数器，点击加/减    轮播图（一秒之内点击多次切换图片，只执行一次）
-- 
button.onclick = _.throttle(function(){
    console.log('5秒之内只能执行一次')
},5000)

## 三级联动节流
-- node_modules中已经有lodash了，项目中不用重复安装
-- import _ from 'lodash'; // 全部的功能引入，如果想要其中某个？怎么按需引入？
-- 
changeIndex:_.throttle(function(index){
    this.currentIndex = index;
},50)

按需引入：
    import throttle from 'lodash/throttle'

## 三级联动路由跳转的分析
三级联动用户可以点击：点击时从home跳转到search模块，会把产品的名字和id进行传递。
-- 用声明式导航，可以实现路由的跳转和传递参数，但是出现了卡顿现象
    因为router-link是一个组件，当服务器的数据返回之后，循环出很多router-link组件【创建组件实例，虚拟dom转为真实dom，都需要时间】创建组件实例的时候，一瞬间常见多个很耗内存，因此出现了卡顿现象
    <router-link :to="{
            path:'/search',
            query:{
                categoryName:c1.categoryName,
                category1Id:c1.categoryId
            }
        }"
    >
        {{c1.categoryName}}
    </router-link>
-- 编程式导航
    给a标签绑定事件，循环导致有很多个回调，很多个函数 ×
    最优写法：事件委托，事件写在就近父元素上。  √
    存在的问题：
    1. 怎么知道点击的是a标签？【把全部的子节点的事件都委派给父亲节点，怎么确定点击的是a标签】
        会传递$event，能够获取点击的元素 ?
    2. 即使能确定点击的是a，又如何区分是一级、二级、还是三级的a标签

## 完成三级联动路由跳转及传参
问题1解决：
-- 给a标签添加一个自定义属性
    <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId"></a>
    <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId"></a>
    <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId"></a>
-- $event 获取到触发事件的节点  $event.target【h3、a、dt、dl】，需要带有data-categoryname这样的节点【一定是a标签】
    节点有一个属性dataset属性【是一个对象】，可以获取节点的自定义属性与属性值
    let {categoryname,category1id,category2id,category3id} = $event.target.dataset;
    if(categoryname){ // 确定是a标签
        // 整理路由跳转的参数
        let location = {
            name:'search'
        }
        let query = {
            categoryName:categoryname
        }
        if(category1id){ // 确定是几级的a标签
            query.category1Id = category1id;
        }else if(category2id){
            query.category2Id = category2id;
        }else if(category3id){
            query.category3Id = category3id;
        }
        // 整理完参数
        location.query = query;
        // 进行路由跳转
        this.$router.push(location)
    }
    
## search模块中商品分类与过渡动画
-- 开发search模块中的TypeNav商品分类菜单（过渡动画效果）
    如果TypeNav在Search路由下，那么就隐藏商品分类
    mounted(){
        if(this.$route.path !='/home'){
            this.show = false;
        }
    }
    ......

    过渡动画：前提组件|元素务必要有v-if|v-show指令才可以进行过渡动画
    <transition name='sort'>
        <div class='sort'></div>
    </transition>

    <style>
        .sort-enter{
            height:0px;
        }
        .sort-enter-active{
            transition:all 0.5s linear;
        }
        .sort-enter-to{
            height:461px;
        }
        .sort-leave{
            height:461px;
        }
        .sort-leave-active{
            transition:all 0.5s linear;
        }
        .sort-leave-to{
            height:0px;
        }
    </style>

## TypeNav商品分类列表优化
-- 重复请求商品列表的数据。Home和Search都用到了TypeNav，数据重复请求【可以用缓存组件，但是这儿不使用这个，不会进入挂载和销毁阶段，那么前面所写的控制商品分类展示与隐藏就不会生效了】。怎么才能只请求一次？
-- 根组件只会执行一次App.vue
    把派发actions获取商品分类的商品列表的操作放在App.vue中的mounted。此处只会加载一次

## 合并params与query参数
-- 有两种方式可以跳转至Search组件，商品分类菜单点击跳转和搜索跳转
-- 当商品分类点击跳转时需要商品名称和id。名称和id是query参数
-- 当搜索的时候，需要带上keyword。keyword是params参数

如果路由跳转的时候，带有params参数，有就捎带过去
if(this.$route.params){
    location.params = this.$route.params;
}
location.query = query;
this.$router.push(location);

## mockjs模拟数据
-- 开发Home首页轮播图 ListContainer组件与Floor组件
-- mock 模拟  前台模拟的数据，不会向服务器发起请求
    cnpm i mockjs -S
-- 使用步骤：
    1) 在src文件夹中创建mock文件夹创建模拟数据
    2) 准备JSON数据 mock文件夹中创建响应的json文件
        src/mock/banner.json
        [
            {id:'1',imgUrl:'/images/xxx.jpg'},
            {},
            {}
        ]
    3) 把mock数据需要的图片放置到public文件夹中【pubulic文件夹在打包的时候，会把相应的资源原封不动的放到dist文件夹中】
    4) 开始mock（虚拟数据），通过mockjs模块实现
        src/mock/mockServe.js
        import Mock from 'mockjs';
        // 为什么json数据没有暴露但是可以用这种方式引入呢？
        // 因为 webpack默认对外暴露的：图片、JSON数据格式
        import banner from './banner.json';
        import floor from './floor.json';

        // mock数据：参1 请求的地址  参2 请求的数据
        Mock.mock('/mock/banner',{
            code:200,
            data:banner
        })
        Mock.mock('/mock/floor',{
            code:200,
            data:floor
        })
    5) mockServer.js文件在入口文件中引入【至少要执行一次，才能用】
        import '@/mock/mockServer.js'

## 获取banner轮播图的数据
src/api/mockAjax.js 用于向mock请求假数据
src/api/index.js
    import mockRequests from './mockAjax.js'
    export const reqGetBannerList = ()=>{
        mockRequests.get('/banner');
    }
ListContainer.vue
    mounted(){
        // 派发action，将数据存储在仓库中
        this.$sotre.dispatch('getBannerList')
    }
src/store/home.js
    actions:{
        async getBannerList(){
            let result = await reqGetBannerList();
            if(result.code==200){
                commit('GETBANNERLIST',result.data)
            }
        }
    }

## swiper基本使用
-- 详情看官网

## 第一种办法实现首页轮播
-- 引包
-- 页面结构必须有
-- 页面当中务必有结构后 new Swiper实例，给轮播图添加动态效果

项目中开发重点：
    安装Swiper插件，安装5版本 cnpm i swiper@5 -S
    import Swiper from 'swiper'; 最好在入口文件中引入，很多地方都用了
    import 'swiper/css/swiper.css'

    在mounted中new Swiper
BUG：
    在mounted中new Swiper实例不管用，因为此时页面结构还不完整【此时页面还不完整，因为swiper-slide是循环来的，动态生成的。等后台接口返回动态生成后循环来的。获取数据是异步的】

    -- 放updated()中可暂时解决。但是如果有其他数据发生变化，updated就会执行，就重复在new Swiper   ×
    -- 放在setTimeout延迟器中，等待一会儿再实例化  ×

## 完美解决首页轮播 -- 通过watch + nextTick解决问题
watch 数据监听，监听已有数据的变化
watch:{
    // 监听bannerList数据的变化
    bannerList:{
        handler:function(newVal,oldVal){
            new Swiper
        }
    }
}

为什么不管用？？？为什么还是没有结构？？
-- 因为当前的函数执行，只能保证数据已经有了，但是不保证v-for遍历的DOM结构是否执行完毕（不保证是否渲染完毕）！
watch:{
    bannerList:{
        handler:function(newVal,oldVal){
            // 此时数据已经有了，保证结构有
            this.$nextTick(function(){
                // 当执行这个回调时，保证了服务器数据有了，v-for执行完毕了【轮播图的结构一定有了】
                new Swiper
            })
        }
    }
}

在 下次DOM更新【数据从 [] 变为[{...}]】 循环结束【v-for循环完毕】之后 执行延迟回调。在 修改数据【bannerList 从空变成有值】 之后立即使用这个方法，获取更新后的DOM
经常和操作DOM结构的插件一起使用。

## 开发Floor组件
-- 获取floor的数据，在哪儿dispatch？用到Floor组件的地方，而不能在组件内部。否则没办法v-for出两个组件【Floor组件】
-- 父组件的mounted()中派发dispatch

-- v-for在自定义组件上用
    <Floor v-for="(floor,index) in floorList" 
        :key="floor.id"
        :floorObj="floor"
    />

    Floor组件中
    props:['floorObj']
    props:{
        floorObj:Object
    }
    props:{
        floorObj:{
            type:Object,
            required:true
        }
    }

-- 组件通信方式
    父子-props
    子父-逆向props、$emit|$on 自定义事件
    全局事件总线：$bus  任意组件通信
    pubsub-js：vue当中几乎不用 任意组件通信
    插槽：
    vuex

## 轮播图共用组件Carousel

## Search模块的静态组件

## Search模块vuex操作，获取数据
-- 请求地址及方式：/api/list   post
    参数：详见api文档
    当前这个接口，给服务器传递一个默认参数，至少是一个空对象
    export const reqGetSearchInfo = (params) =>{
        requests({
            url:'/list',
            method:'post',
            data:params
        })
    }

## Search模块中动态展示产品列表
-- vuex中的getters来简化仓库中的数据
可以把我们将来在组件当中需要用的数据简化一下，组件在获取数据的时候就方便了

-- getters中的属性接收一个参数，state，获取仓库中的数据。当前仓库，并非大仓库

const getters = {
    goodList(state){
        return state.searchList.goodsList || [];
    }
}

## Search模块根据不同的参数获取数据展示
其他搜索功能
Object.assign:ES6新增的语法，合并对象

let searchParams = {
    category1Id:"",
    category2Id:"",
    category3Id:"",
    categoryName:"",
    keyword:"",
    order:"",
    pageNo:"",
    pageSize:"",
    props:[],
    trademark:""
}
let query = {category1Id:"110",categoryName:"手机"};
let params = {keyword:"华为"}
Object.assign(searchParams,query,params)

## Search模块中子组件动态开发

## 监听路由变化再次请求数据
-- 之前只写了组件挂载完毕调用接口，
    // 监听组件实例身上属性的属性值的变化，怎么监听路由呢？
    // 路由信息是否发生变化，发生变化再次发起请求
    watch:{
        $route(newVal,oldVal){
            Object.assign(searchParams,query,params)
            this.getSearchInfo(searchParams);
        }
    }
-- 问题：再次请求数据没有清除上一轮的数据
    watch:{
        $route(newVal,oldVal){
            Object.assign(searchParams,query,params)
            this.getSearchInfo(searchParams);
            // 每次请求完毕，应该把三级分类ID置空，让他接收下一次的三级分类id
            this.searchParams.category1Id="";
            this.searchParams.category2Id="";
            this.searchParams.category3Id="";
        }
    }

## 面包屑处理分类的操作
-- 把不需要带给服务器的数据【属性】设置为undefined，就不会提交给服务器
-- 把搜索的面包屑全部删除，地址栏中仍然展示了。把地址栏变为search
    1. 进行路由的跳转，自己跳转自己
        this.$router.push({name:'search'})  不严谨！会引起路由的变化，再发了一次请求？  √
        这样跳转也会把params参数删掉   √

        if(this.$route.params){
            this.$router.push({name:'search',params:this.$route.params})
        }
    2. 

## 面包屑处理关键字
-- 当面包屑中的关键字清楚以后，需要让兄弟组件Header中的关键字清楚
    兄弟组件通信
    props-父子
    自定义事件-子父
    vuex-现在只做共用数据处理
    pubsub-js  万能，
    全局事件总线  $bus

    配置$bus
    main.js
    new Vue({
        beforeCreate(){
            Vue.prototype.$bus = this
        }
    })


    search/index.vue
    removeKeyword(){
        this.searchParams.keyword = undefined;
        this.getSearchInfo();
        this.$bus.$emit('clear')
        // 去除params参数
        if(this.$route.query){
            query = this.$route.query
        }else{
            query = {}
        }
        this.$router.push({name:'search',query})
    }

    header/index.vue
    mounted(){
        this.$bus.$on('clear',function(){
            this.keyword = ''
        })
    }

## 面包屑处理品牌信息
-- 点击品牌，发起请求，对数据进行展示。父组件发请求还是子组件发请求？    父组件发起【因为需要searchParams参数，向服务器请求数据】
    子组件给父组件传参---用自定义事件

    searchSelector.vue
    tradeMarkHandler(trademark){
        this.$emit('trademarkInfo',trademark)
    }

    search/index.vue
    <SearchSelector @trademarkInfo="trademarkInfo"/>

    trademarkInfo(trademark){
        // 整理品牌参数  "ID:品牌名称"
        this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
        this.getSearchInfo(this.searchParams)
    }
-- 面包屑展示
    // 品牌的面包屑
    <li class="with-x"></li>
-- 删除面包屑 removeTrademark  移除品牌

## 面包屑之平台售卖属性的操作
-- 子组件中，平台售卖属性的点击事件
    attrInfo(attr,attrValue){
        this.$emit('attrInfo',attr,attrValue)
    }

    父组件中
    @attrInfo="attrInfo"

    attrInfo(attr,attrValue){
        // ["属性Id:属性值:属性名"]
        // 参数的格式
        let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
        this.searchParams.props.push(props)
        this.getSearchInfo(this.searchParams)
    }
-- 页面展示
    // 平台的售卖的属性值展示
    <li v-for="prop in searchParams.props" :key="props.split(':')[0]">
        {{prop.split(':')[1]}}
        <i @click="removeProp">×</i>
    </li>

-- 存在重复点击售卖信息，重复展示问题
    加上判断，没有这个元素，再push操作
    attrInfo(attr,attrValue){
        // ["属性Id:属性值:属性名"]
        // 参数的格式
        let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
        if(this.searchParams.props.indexOf(props)==-1){
            this.searchParams.props.push(props)
        }
        this.getSearchInfo(this.searchParams)
    }

-- 移除
    removeProp(index){
        this.searchParams.props.splice(index,1);
        this.getSearchInfo(this.searchParams)
    }

## Search-排序上  重点
api/list有个参数order 
1：综合排序  2：价格排序  asc：升序  desc：降序
示例："1:desc"

-- order属性的属性值最多有几种写法
    1:asc  综合升序
    1:desc 综合降序
    2:asc  价格升序
    2:desc 价格降序

    默认是 综合降序 1:desc

-- 考虑：综合和价格谁应该有active类名。默认是综合有默认
    order中包含1那么就是综合，包含2就是价格
    <li v-bind:class="{active:searchParams.order.indexOf('1')>-1}"></li>

    结构太长
    computed:{
        isOne:function(){
            return searchParams.order.indexOf('1')>-1
        },
        isTwo:function(){
            return searchParams.order.indexOf('2')!=-1
        }
    }

    <li v-bind:class="{active:isOne}"></li>

-- 考虑：谁应该有箭头
    谁有类名，谁就有箭头
    <li :class="{active:isOne}">
        <a>综合<span v-show="isOne">⬇</span></a>
    </li>

-- 箭头制作  --icon图标  iconfont.cn
    <li :class="{active:isOne}">
        <a>综合
            <span v-show="isOne" class="iconfont" :class="{searchParams.order.indexOf('desc')!=-1?'icon-DOWN':'icon-UP'}"></span>
        </a>
    </li>

## Search-排序下
-- 给li绑定点击事件
    changeOrder(type){
        // type 为1 是综合排序
        // type 为2 是价格排序
        let originOrder = this.searchParams.order;
        let originType = this.searchParams.order.split(':')[0];
        let originSort = this.searchParams.order.split(':')[1];
        let newOrder = '';
        if(type == originType){
            // 确定点击的一定是综合
            newOrder = `${orginType}:${originSort == 'desc'?'asc':'desc'}`
        }else {
            // 确定点击的不是综合，是价格，价格默认是降序
            newOrder = `${type}:desc`
        }

        this.searchParams.order = newOrder;
        this.getSearchInfo(this.searchParams);
    }

## 分页器静态组件
    轮播/分页/日历  很重要！
-- 很多电商平台为什么需要分页？
    1) 数据过多，加载会特别慢
-- 全局组件 分页
    components/Pagination

## 分页功能分析
-- 分页器的展示需要哪些数据（条件）
    1) 当前是第几页：pageNo
    2) 一页展示多少条：pageSize
    3) 一共多少条数据：total
    4) 分页器连续的页码数：continues一般是5或者7，为什么是5或者7【奇数，因为 对称-美观】

    获取另外一条信息：有多少页数据：totalPage。知道一页展示多少条，知道一共多少条数据，可获取页数

    栗子：每一页展示3条数据   一共91条数据   问：一共多少页？

## 分页器起始与结束数字计算
-- 传假参数进行调试
-- 对于分页器而言，很重要的一个地方即为【算出连续页面起始数字和结束数字】
    栗子：当前是第8页，  6 7 8 9 10
        当前是第15页，  13 14  15 16 17  
        当前页在 中间
    
    连续的页码数至少是5，那么至少总页数有5页。如果少于5页怎么办？

    startNumAndEndNum(){
        // 先定义两个变量，存储起始数字和结束数字
        let start = 0;
        let end = 0;
        // 连续页面是5【总页数至少5页】如果出现不正常现象，不足5页
        if(continues > totalPage){
            start = 1;
            end = totalPage;
        }else{
            // start = pageNo - 2;
            // end = pageNo + 2;
            start = pageNo - parseInt(continues/2);
            end = pageNo + parseInt(continues/2);
        }

        return {start,end}
    }

    有可能出现负数，如果当前页是第1页
    如果当前是第1页，那么连续的页码数是：-1 0 1 2 3 ==》   1 2 3 4 5
    如果当前是第2页，那么连续的页码数是：0 1 2 3 4 ==》   1 2 3 4 5

    if(start <= 0){
        start = 1;
        end = continues;
    }

    end有可能超出总页数
    比如end是32     28 29 30 31 32  =》 27 28 29 30 31
    if(end > totalPage){
        end = totalPage;
        start = end - continues + 1;
    }

## 分页器动态展示
-- 分为上中下部分来做
    v-for可以遍历数字

    中间：连续页码
    <button v-for="(page,index) in startNumAndEndNum.end" v-if="page>=startNumAndEndNum.start">{{page}}</button>

    上：
    如果start大于等于2的就要显示1那个页码
    <button v-if="start>1">1</button>
    <button v-if="start>2">...</button>

    <button :disabled="pageNo=='1'" @click="$emit('getPageNo',pageNo-1)">上一页</button>
    <button v-if="start>1" @click="$emit('getPageNo',1)">1</button>

    下：
    <button v-if="end<totalPage-1">...</button>

## 分页器完成
-- @getPageNo="getPageNo"
getPageNo(pageNo){
    this.searchParams.pageNo = pageNo;
    this.getSearchInfo();
}

-- 分页器的class类名
:class = "{active:pageNo==1}"
......

## 滚动行为  产品详情页面
-- 开发详情页面，
    静态组件
    发请求
    vuex
    动态展示组件

    Detail路由组件
    params传参，路由占位path:"/detail/:skuId"
    点击图片跳转到详情页，路由跳转的时候带上产品的id给详情页
-- 滚动条的位置不对
    vue-router提供的，和routes属性平级
    scrollBehavior(to,from,savedPosition){
        // 返回的y:0代表滚动条在最上方
        return {y:0}
    }

## 产品详细信息数据获取
-- /api/item/{skuId}  get
-- reqGoodsInfo
-- vuex请求
-- detail组件挂载完毕派发action

## 产品详细展示动态数据


## 放大镜Zoom展示数据


## detail路由组件展示商品售卖属性


## 产品售卖属性排他操作
-- 点击那个属性值，那个就高亮 -- 排他
    @click ="changeActive(spuSaleAttrValue,spuSaleAttr.spuSaleAttrValueList)"

    changeActive(spuSaleAttrValue,spuSaleAttrValueList){
        // 点击的属性对象
        spuSaleAttrValueList.forEach(item=>{
            item.isChecked = '0'
        })
        spuSaleAttrValue.isChecked = '1'
    }

## 放大镜操作上
-- 底部轮播
    一页展示多个的slide数量的配置：slidesPerView:3
    点击切换3个：slidesPerGround:3
-- 点底部图片，点谁谁有高亮
    data(){
        return{
            currentIndex:0//起始第1个有高亮
        }
    }

    点击的时候改变index
    <img :class="{active:currentIndex==index}" @click="changeCurrentIndex(index)"/>

    changeCurrentIndex(index){
        this.currentIndex = index;
        // 切换上面的大图 兄弟组件通信，送索引值就行
        this.$bus.$emit('getIndex',index)
    }

    // 另一个兄弟组件
    this.$bus.$on('getIndex',(index)=>{
        // 改变图片索引
        this.currentIndex = index
    })

## 放大镜下
-- 鼠标移入大图，放大镜区域跟着局部移动
    改变left和top，那么就是定位的元素

    获取鼠标位置 offsetX   offsetY  是距离父元素到鼠标的距离

    @mousemove="handler"
    // 鼠标移动，改变遮罩层的top和left
    handler(event){
        let mask = this.$refs.mask;// 遮罩层的dom
        let left = event.offsetX - mask.offsetWidth/2;
        let top = event.offsetY - mask.offsetHeight/2;

        if(left <= 0){
            left = 0;
        }
        if(left >= mask.offsetWidth){
            left = mask.offsetWidth
        }

        if(top <= 0){
            top = 0;
        }

        if(top >= mask.offsetHeight){
            top = mask.offsetHeight;
        }

        mask.style.left = left + 'px';
        mask.style.top = top + 'px';

        // 改变大图的背景位置
        let big = this.$refs.big
        big.style.left = -2 * left + 'px';
        big.style.top = -2 * top + 'px';
    }

## 购买产品个数的操作
-- 购物车静态页面
-- v-model.number和input的type类型结合起来使用
-- 绑定change事件
    changeSkuNum(event){
        let value = event.target.value * 1
        // *1 为NaN的  一定包含非数字
        // 小于1的
        if(isNaN(value) || value < 1){
            this.skuNum = 1;
        }else {
            this.skuNum = parseInt(value);
        }
    }

## 加入购物车
-- 点击加入购物车
    1) 请求，告诉服务器买了多少个，产品的参数
    2) 进行路由跳转
    3) 所加购产品的信息展示
-- /api/cart/addToCart/{ skuId }/{ skuNum }
    export const reqAddOrUpdateShopCart=(skuId,skuNum)=>requests({
        url:'/cart/addToCart/${skuId}/${skuNum}',
        method:'post'
    })

    vuex 写actions

    async addShopCart(){
        // 服务器存储成功与否，成功路由跳转并传参，失败提示用户
        // 成功与否的状态在vuex状态管理中
        // 1. state中存储成功与否的状态  ×
        // 2. 调用仓库中的addOrUpdateShopCart()函数，addOrUpdateShopCart可以返回，返回的是Promise，因为它使用async  await写的
        // 所以  在addOrUpdateShopCart函数中返回成功与否的状态
            // if(result.code == 200){
                return 'ok'
            }else{
                return Promise.reject(new Error('failed'))
            }
        let result = await this.$sotre.dispatch('detail/addOrUpdateShopCart',{skuId:this.$route.params.skuId,skuNum:this.skuNum})
        

        写try...catch
        try{
            await this.$sotre.dispatch('detail/addOrUpdateShopCart',{skuId:this.$route.params.skuId,skuNum:this.skuNum})
            // 路由跳转

        } catch(error){
            throw new Error(error.message)
        }
    }

## 复习Promise
async写的方法返回的是一个Promise对象
async函数执行返回的结果一定是一个Promise【要么成功，要么失败】

## 路由组件-添加到购物车成功 AddCartSuccess
-- 静态组件
-- 点击加入购物车跳转
    this.$router.push({name:'addcartsuccess',query:{skuId,skuNum}})

## 路由传参结合会话存储
-- 产品信息已经存储在vuex中了，进入添加购物车成功页面不用重复请求。只需要传过去id，再去vuex数据中查询就好  ？？？
-- 用会话存储，只传递skuNum
    本地存储localStorage：持久化的，5M左右存储大小
    会话存储sessionStorage：并非持久的，会话结束数据就消失
    Vue开发的都是单页面应用。用会话存储是因为就临时展示一下，会话结束就可以不要了

    webStorage不能存储对象，需要转换成字符串
    sessionStorage.setItem("SKUINFO",JSON.Stringify(this.skuInfo))
    

    // addcartsuccess路由组件中
    computed:{
        skuInfo(){
            return JSON.parse(sessionStorage.getItem('SKUINFO'))
        }
    }

## 购物车静态组件与修改
-- 查看商品详情
    1) 带回skuInfo.id
-- 去购物车结算
    1) 静态组件 ShopCart
        调整css让各个项目对齐，删除第三项  15 35 10 17 10 13
    2) <router-link/> 跳转
    3) 向服务器发起ajax，获取购物车数据
    4) UUID 临时游客身份
    5) 动态展示购物车

## uuid游客身份获取购物车数据
-- /api/cart/cartList  get
-- 接口名称  reqCartList 。组件挂载完毕派发actions  store/shopcart.js
-- 加入购物车的时候除了产品id和产品数量外还得告诉服务器你是谁，存储谁的商品列表。就是给用户一个身份
    1) uuid  之前用的nanoid 由uuid变种而来 生成一个唯一的id，可用来身份标识。项目中已经有uuid了，其他项目依赖下载过
    2) 加入购物车时多加一个参数给购物车列表。用 请求头
        因为 /api/cart/addToCart/{ skuId }/{ skuNum } 只能带两个参数
        本地存储 存储uuid，uuid身份只有一个

        // 生成一个随机的字符串【不能再变了】，游客身份持久存储
        src/utils/uuid_token.js
        import {v4 as uuidv4} from 'uuid'
        export const getUUID = function(){
            // 先从本地存储获取uuid，看一下本地存储里面是否有uuid
            let uuid_token = localStorage.getItem('UUIDTOKEN');
            if(! uuid_token){
                uuid_token = uuidv4();
                locationStorage.setItem('UUIDTOKEN',uuid_token)
            }
            return uuid_token;
        }


        store/detail.js
        import {getUUID} from '@/utils/uuid_token';
        const state={
            uuid_token : getUUID();
        }

        // 带给服务器，通过 请求头
        请求拦截器中
        // 在请求拦截器中引入store，获取到uuid_token
        import store from '@/store'
        requests.interceptors.request.use(config=>{
            if(store.state.detail.uuid_token){
                // 请求头添加一个字段userTempId，和后台沟通过的字段，不能随意添加
                config.headers.userTempId = store.state.detail.uuid_token;
            }
            nprogress.start();
            return config;
        })

## 购物车动态展示数据
totalPrice(){
    let sum = 0;
    this.cartInfoList.forEach(item=>{
        sum += item.skuPrice * item.skuNum
    })
    return sum;
}

isAllCheck(){
    return this.cartInfoList.every(item=>{
        return item.isChecked == 1
    })
}

methods:{
    changeCheck(){
        
    }
}
    
## 处理产品数量
-- 产品数量变化，请求服务器，重新存储数量
    skuNum  正数代表增加，负数代表减少  起始状态和结束状态的差值带给服务器

    // 节流
    import throttle from 'lodash/throttle'
    async handler(type,disNum,cart){
        // 修改某一个产品的个数
        // type 为了区分这三个元素，加减输入框
        // disNum形参：+ 变化量（1） - 变化量（-1）  input 最终的个数（并不是变化量）
        // cart 点击的哪一个产品【身上有id】
        // minus,-1  add,1  change,$event.target.value*1
        switch(type){
            case 'add':
                disNum = 1;
                break;
            case 'minus':
                // 要判断这个产品的个数，个数大于1，才能传给服务器-1
                if(cart.skuNum > 1){
                    disNum = -1;
                }else { 
                    // 产品个数等于1
                    disNum = 0;
                }
                break;
            case 'change':
                if(isNaN(disNum) || disNum < 1){
                    // 如果是非法的或者是负数，那么不变
                    disNum = 0;
                }else { 
                    // 如果为小数
                    disNum = parseInt(disNum) - cart.skuNum
                }
                break;
        }
        
        try{
            await this.$store.dispatch('detail/addOrUpdateShopCart',{skuId:cart.skuId,skuNum:disNum})
            this.getData();// 获取最新数据
        }catch(error){
            throw new Error(error.message)
        }
    }

## 删除购物车产品
-- 请求方式
    get
    post
    delete
    checkout
    ......
-- /api/cart/deleteCart/{skuId}   
    请求方式：DELETE

    deleteCartListBySkuId  vuex

## 修改产品状态
-- 勾选与取消勾选都需要向服务器存储
    /api/cart/checkCart/{skuId}/{isChecked}   get
-- 复选框绑定change事件，并派发actions
    async updateChecked(skuId,event){
        let isChecked  = event.target.checked * 1
        await this.$store.dispatch('updateCheckedById',{skuId,isChecked})
        this.getData()
    }

## 删除全部已选中的产品
-- 没有一次删除多个产品的接口，但是有一次性删除一个的接口
    调用多次删除接口
-- 绑定删除已选的点击事件
    deleteCheckedCart(){
        // 派发
        this.$sotre.dispatch('deleteCheckedCart')
    }

    vuex  deleteCheckedCart
    deleteCheckedCart({dispatch,getters}){
        // 调用另一个action
        getters.cartList.cartInfoList.forEach(item=>{
            if(item.isChecked == '1'){
                dispatch('deleteCartListById',item.skuId)
            }
        })
    }
-- Promise.all()
    Promise.all([p1,p2,p3])
    p1|p2|p3：每一个都是Promise对象，如果有一个Promise对象失败，都失败。如果都成功，返回成功

    deleteCheckedCart({dispatch,getters}){
        // 调用另一个action
        let PromiseAll = [];
        getters.cartList.cartInfoList.forEach(item=>{
            let result = item.isChecked == '1'?dispatch('deleteCartListById',item.skuId):'';
            PromiseAll.push(result)
        })
        // 只要全部的promise成功，返回的结果即为成功
        return Promise.all(PromiseAll)
    }

## 全部产品的勾选状态修改
-- 勾选全选，调用一次修改一个的状态
    @change = "updateAllCartChecked"

    async updateAllCartChecked(event){
        try{
            let checked = event.target.checked ? '1':'0';
            await this.$store.dispatch('updateAllCartChecked',checked)
        }catch(error){
            alert(error.message)
        }
        
    }

    actions={
        updateAllCartChecked({dispatch,state},isChecked){
            let PromiseAll = []
            state.cartList[0].cartInfoList.forEach(item=>{
                let promise = dispatch('updateCheckedById',{skuId:item.skuId,isChecked})
                PromiseAll.push(promise)
            })
            return Promise.all(PromiseAll)
        }
    }

## 登录注册静态组件
-- 登录与注册的功能，必须要会
    assets  放所有组件共用的静态资源，在打包的时候放在了js模块里

    // 在css中写@标识src路径，需要在@前面写一个~号
    background-image:url(~@/assets/images/icons.png)

## 注册业务 -- 表单验证先不做，先做业务逻辑
-- 设置发送验证码改为button标签并获取验证码
    1) 收集表单数据--手机号,验证码
        data(){
            return{
                phone:'',
                code:''
            }
        }
    2) /api/user/passport/sendCode/{phone}  get
    3) store/user.js 包含注册和登录的逻辑   vuex 一套逻辑
        页面派发actions后返回了验证码，回显到验证码输入框中
-- 收集登录密码与确认密码以及协议复选框
    1) password
    password1
    agree:true

    2) 登录密码与确认密码一致且同意协议点击立即注册，发送请求完成注册跳转登录  18515138120
    /api/user/passport/register  post  需要phone/password/code
    userRegister(){

    }

## 登录业务【token】
-- 收集用户输入的手机号和密码发请求  reqUserLogin
    阻止表单默认行为 @click.prevent="userLogin"
    登录成功，后台返回token字段，唯一标识
-- token 令牌，
    store/user.js

    async userLogin({commit},data){
        let result = await reqUserLogin(data);
        // 服务器下发的token，某个用户的唯一标识符，和uuid类似
        // 带token找服务器要用户的信息进行展示
        if(result.code==200){
            commit("USERLOGIN",result.data.token)
            return "ok"
        }else{
            return Promise.reject(new Error('failed'))
        }
    }

    USERLOGIN(state,token){
        state.token = token;
    }

    vuex存储不是持久化的，页面刷新就没了
-- 登录成功，跳转首页，携带token请求服务器获取用户信息，
    /api/user/passport/auth/getUserInfo   get

    请求头携带token
    Home组件加载完毕派发actions

    拦截器中：
    if(store.state.user.token){
        config.headers.token = store.state.user.token
    }


    用name来判断是否登录，修改头部的登录/注册|用户名/退出登录

-- 登录业务中存在的问题
    1) 当用户注册完成，用户登录【用户名+密码】向服务器发送请求（组件派发actions userLogin），登录成功获取到了token，存储与仓库中（非持久化），路由跳转到Home组件
    2) 因此在首页当中（mounted派发action getUserInfo）获取用户信息，以及动态的展示Header组件的内容
    3) 刷新Home首页，首页获取不到用户的信息，因为此时token没有了【vuex是非持久化存储】

    解决：持久化存储token
        用户登录的业务中store/user.js
        localStorage.setItem('TOKEN',result.data.token);

        或者

        utils/token.js
        export const setToken = (token)=>{
            localStorage.setItem('TOKEN',token)
        }
        export const getToken = ()=>{
            return localStorage.getItem('TOKEN') || ''
        }

        store/user.js
        登录成功存储token
        setToken(result.data.token)
        // 初始值从localStorage中取出
        const state = {
            token:getToken()
        }

    4) 在Search/Detail等组件中并没有派发获取用户信息的action，那么localStorage中就没有存储token。怎么办？
        在App组件中派发？App只会挂载一次    但是第一次没有  ×

    5) 用户已经登录了，不可以再地址栏跳转到登录页。
    6) 没有登录，不能去购物车

## 退出登录
/api/user/passport/logout  get
-- 请求服务器，告诉服务器清除用户的一些信息
    1) 发请求，通知服务器推出登录【清除一些数据，token】
    2) 前端的本地存储清除token，userInfo
    3) 跳转到首页，用户再有什么操作都比较方便
    @click = "logout"
    logout(){
        this.$store.dispatch('user/logout')
        // 跳转
    }

    if(result.code==200){
        // action里面不能操作state,得提交mutation来修改
        commit("CLEAR")
    }

    const mutations={
        CLEAR(state){
            state.token = "";
            state.userInfo = {};
            removeToken()
        }
    }

    export const removeToken = () =>{
        localStorage.removeItem('TOKEN')
    }

## 导航守卫理解
-- 导航守卫：
    全局守卫
        只要发生路由的变化，就能监听到
        全局前置守卫 beforeEach
        全局后置守卫 beforeAfter
    路由独享守卫
        beforeEnter
    组件内守卫
        beforeRouteEnter
        beforeRouteUpdate  2.2新增
        beforeRouteLeave
-- 路由跳转问题
    比如：用户已经登录，用户不应该还能通过地址栏跳转login页面

    router/index.js
    // 全局前置守卫：在路由跳转之前进行判断，是否能够跳转
    import store from '@/store'
    router.beforeEach(async (to,from,next)=>{
        // 去哪儿，从哪儿来，放行
        // next(path) 放行到指定的路由 next({path:'/'})
        // next(false) 
        if(token){
            if(to.name=='login'){
                next('/home')
            }else{
                // 登录了，去的不是login，但是得保证仓库当中有用户信息
                if(store.state.user.userInfo.name){
                    next();
                }else{
                    // 没有用户信息，派发action，获取用户信息
                    try{
                        await store.dispatch('user/getUserInfo')
                        next()
                    }catch(){
                        // 获取用户信息失败，token过期了
                        await store.dispatch('user/logout');
                        next('/login');
                    }
                }
                
            }
        }else{
            // 未登录，游客身份
            next();
        }
        
    })

## 导航守卫复盘
全局前置守卫：跳入路由之前进行操作

## trade静态组件  结算页面
-- 统一登陆账号 13700000000 111111

## 获取交易页数据
-- 配送地址和商品清单以及底部商品总结为动态
    获取用户地址信息 /api/user/userAddress/auth/findUserAddressList     get    api和vuex一套
        需要登录了，才能获取到用户的地址信息！！
    获取订单页交易信息（商品清单）  /api/order/auth/trade   get  

## 用户地址信息展示
    @click = "changeDefault"
    methods:{
        chengeDefault(address,addressInfo){

        }
    }

    // 底部展示
    find，find返回的是当前那个对象。找到第一个满足条件的立即返回
    userDefaultAddress(){
        return this.addressInfo.find(item=>item.isDefault==1) || {}
    }

## 交易页面完成
    商品清单   orderInfo.detailArrayList

    买家留言：收集处理，msg:""

    一共几件产品，一共多少钱   服务器返回了： totalNum  totalAmount  originalTotalAmount

## 提交订单
-- Pay组件，静态组件及配置路由
-- 点击提交订单按钮，发送服务器
    /api/order/auth/submitOrder?tradeNo={tradeNo}   post
    traderNo    交易编号  拼接到路径当中
    consignee   收件人名称
    consigneeTel  收件人电话
    deliveryAddress  收件地址
    paymentWay   支付方式
    orderComment   订单备注
    orderDetailList   存储多个商品对象的数组

    会返回一个订单号！一会儿支付的订单号

    reqSubmitOrder = (tradeNo,data)=>requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'})

    尝试不用vuex写请求接口，直接在组件内部请求并使用管理数据

    引入api中的接口，全局引入，main.js中，统一接收api文件夹里面所有的请求的函数
    import * as API from '@/api' // 引入暴露的所有接口 ，一次性导入
    new Vue({
        beforeCreate(){
            Vue.prototype.$API = API
        }
    })
    组件内部：
    submitOrder(){
        this.$API.reqSumitOrder(tradeNo,data).then(res=>{
            console.log(res.data);
        }).catch(error=>{
            alert(error.message)
        })
    }

## 获取订单号展示支付信息
-- 订单号存储在data当中
    this.orderId = result.data
    跳转到支付页面，路由传参，获取到的orderId传递过去，查询参数
-- 获取支付信息
    提交订单成功组件挂载完毕获取支付信息 /api/payment/weixin/createNative/{orderId}  get
    mounted(){
        this.$API.reqPayInfo(this.orderId).then(res=>{

        })
    }

    或

    mounted(){
        this.getPayInfo()
    },
    methods:{
        async getPayInfo(){
            let result = await this.$API.reqPayInfo(this.orderId);
            if(result.code == 200){
                this.payInfo = result.data
            }
        }
    }

## 支付页面中使用ElementUI以及按需引入
-- cnpm i element-ui -S
-- 按需加载
    首先，安装 babel-plugin-component：
        npm install babel-plugin-component -D
    然后，将 .babelrc 修改为：
    {
        // "presets": [["es2015", { "modules": false }]],
        "plugins": [
            [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
            ]
        ]
    }
-- vue-helper  插件 可以提示elementui的组件

-- 使用HTML片段  MessageBox弹框
   点击立即支付： 弹出二维码图片，支付 @click="open"
    import {MessageBox} from 'element-ui'
    方式一：Vue.component(MessageBox.name,MessageBox)
    方式二：挂载到原型是
        Vue.prototype.$msgbox = MessageBox
        Vue.prototype.$alert = MessageBox.alert
    方式三：Vue.use(MessageBox)

## 微信支付业务上
-- 根据codeUrl生成二维码  
    qrcode
    npm install --save qrcode
-- 使用qrcode
    import QRCode from 'qrcode'
    open(){
        QRCode.toDataURL(this.payInfo.codeUrl).then(url=>{
            this.$alert(`<img src=${url} />`)
        }).catch(err=>{
            alert(err.message)
        })
    }

-- 已支付成功 或 支付遇到问题
    支付成功，跳转路由
    支付遇到问题，提示用户

    查询支付状态：需要一直问服务器是否支付成功
    /api/payment/weixin/queryPayStatus/{orderId}  get

    定时器
    if(! this.timer){
        // 开启定时器
        this.timer = setInterval(async ()=>{
            // 发请求，获取用户支付状态
            let result = await this.$API.reqPayStatus(this.orderId)
            conosle.log(result);
            if(result.code == 200){
                // 清除定时器
                clearInterval(this.timer);
                this.timer = null
                // 保存支付的code，因为点击已支付成功需要用这个判断
                this.code = result.code
                // 关闭弹框
                this.$msgbox.close();
                // 跳转路由 -- 支付成功
                this.$router.push('/paysuccess')
            }else{

            }
        },1000)
    }

## 微信支付下   根据存储的code 是否让关闭弹框
-- 关闭弹框的配置
    this.$alert(`<img src=${url} />`,{
        beforeClose(action,instance,done){
            if(action == 'cancel'){
                alert('请联系系统管理员');
                // 清除定时器
                clearInterval(this.timer);
                this.timer = null;
                // 关闭弹出框
                done();
            }else{
                if(this.code == 200){
                    // 清除定时器
                    clearInterval(this.timer);
                    this.timer = null;
                    // 关闭弹框
                    done();
                    // 路由跳转
                    this.$router.push('/paysuccess')
                }
            }
        }
    })
-- 继续购物到首页，查看订单到个人中心

## 个人中心二级路由搭建
注意路由出口

## 我的订单
/api/order/auth/{page}/{limit}   获取订单列表（个人中心下）
get
page:当前的页码
limit:每页显示的数量

又用到了分页器

## 未登录的导航守卫
未登录访问，交易相关页面(trade)、支付相关(pay,paysuccess)、个人中心(center)，应跳转至登录页

if(to.name=='trade' || to.name=='pay' || to.neme=='paysuccess' || to.name=='center'){
    next('/login')
}else{
    next();
}

如果未登录状况下点击我的订单，跳转到了登录页，当登录成功应该跳转到我的订单，现在是跳转到首页。解决？

把信息存储到地址栏中
next('/login?redirect='+to.path)

如果路由中包含query参数，跳转到重定向的路由  login组件中不能单纯的跳转home页


## 路由独享守卫与组件内守卫
    已经登录 不能跳转到支付成功【支付成功之后才能到支付成功页面| 加入购物车成功是不是也得从详情页来】，也不能跳转交易页【交易页得从购物车点结算才行】

-- next(false)
    中断当前的导航。从哪儿来回哪儿去，会重置到from路由

栗子：
    routes:[
        {
            path:'/trade',
            beforeEnter(to,from,next){
                // 去交易页面不许是从购物车来，其他的不行
                if(from.path== '/shopcart'){
                    next()
                }else{
                    // 不是从购物车来，停留在当前
                    next(false);
                }
            }
        }
    ]

beforeRouteUpdate  当前路由改变，但是该组件被复用时调用 ！！！
    举例来说，共用路由组件/foo/:id  /foo/1  /foo/2 路由来回跳转的时候触发

## 图片懒加载
cnpm i vue-lazyload -S

main.js
// 引入插件，并use插件
import VueLazyload from 'vue-lazyload'
// use实际上是调用了插件的install方法
Vue.use(VueLazyload,{
    // 懒加载默认的图片
    loading:'@/assets/loading.gif'
})  

组件中使用
<img v-lazy='good.defaultImg' />

-- 复习自定义插件
    Vue的插件一定是暴露了一个对象，且必须要有一个install方法。当use使用的时候就调用
    src/plugins/myPlugins.js
    export default {
        install(Vue,options){
            Vue.mixin({
                data(){
                    return{

                    }
                },
                methods:{
                    handler(){

                    }
                }
            }),
            Vue.directive(options.name,{
                // 指令中的modifiler 指令修饰符
                bind(element,binding){
                    element.innerHTML = binding.value.toUpperCase()
                }
            })
        }
    }

    Vue.use(myPlugins,{name:'upper'})

## vee-validate 表单验证使用   了解
cnpm i vee-validate@2 -S      学2版本，相对简单
第一步：
    import VeeValidate from 'vee-validate'
    Vue.use(VeeValidate)

第二步：
    import zh_CN from 'vee-validate/dist/locale/zh_CN'
    VeeValidate.Validator.localize('zh_CN',{
        messages:{
            ...zh_CN.messages,
            is:(field)=> `${field}必须与密码相同`
        },
        attributes:{
            phone:'手机号',
            code:'验证码',
            password:'密码',
            password1:'确认密码',
            agree:'协议'
        }
    })

第三步：基本使用
    <input 
        placeholder="请输入手机号"
        v-model="phone"
        name="phone"
        v-validate="{required:true,regex:/^1\d{10}$/}"
        :class="{invalid:errors.has('phone')}"
    />
    <span class="error-msg">{{errors.first('phone')}}</span>
    
    密码正则：/^[0-9A-z]{8,20}$/

    确认密码的规则 v-validate="{required,is:password}"

    同意协议  v-validate="{required,'agree':true}"
    需要用到自定义校验规则
    VeeValidate.Validator.extend('agree',{
        validate:value=>{
            return value
        },
        getMessage:field => '必须同意该'+field
    })

第四步：点击 完成注册 进行拦截
    const success = await this.$validator.validateAll();
    确定全部表单验证完成。返回布尔值true or false

## 路由懒加载
-- 当路由被访问的时候加载。更加高效
    const Foo = () => import('./Foo.vue')

## 处理map文件
项目打包： npm run build
    项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确的知道是哪里的代码报错了。
    有了 map 就可以像未加密的代码一样，准确的输出哪一行报错
    所以该文件如果项目不需要可以除掉【项目上线的时候，该文件体积过大】

    vue.config.js配置
    productionSourceMap:false

## 购买服务器
阿里云  腾讯云  都可以

建议腾讯云买，便宜

操作系统选   CentOS linux的

## 安全组与xshell操作
安全组：让一些端口给打开  让服务器一些端口号打开
新建 一个，点确定就行

xshell 登录服务器，用户名和密码

新建会话
    名称随意
    主机：服务器找ip地址
    端口号：22

    用户名  root
    在输入密码

    服务器登录成功

    cd /
    ls  显示目录 
    cd root  只有root目录能让我们操作
    mkdir aaa  创建目录【文件夹】
    pwd：查看绝对路径

xftp  可以把文件传送到云服务器上  可视化
    新建  名称随意
    主机：服务器ip

    打包后的vue项目，dist文件夹就可以放进去

## nginx 反向代理
-- 为什么地址栏输入ip就能访问到我们的项目？需要配置服务器
    root/vue/www/shangpinhui/dist

-- 我们所访问的数据来源于 http://39.98.123.211 这台服务器，为什么我们的服务器能访问到39这个服务器的数据呢？
    因为nginx 反向代理  可以让我们的服务器从39这台服务器要数据

-- 配置nginx
    在和根目录root同级的etc目录中可以配置  cd /
    cd etc
    etc目录下有个默认文件夹nginx  cd nginx  进入到这个目录
    安装nginx【没有安装的话里面只有四五个文件】
        yum install nginx
    安装完nginx后，你会发现在nginx目录下多了一个nginx.conf文件，在这个文件中进行配置
    vim nginx.conf 进行编辑 insert
        location / {
            root /root/vue/www/shangpinhui/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
        location /api {
            proxy_pass http://39.98.123.211;
        }
    esc wq  保存

    service nginx start

    地址栏访问即可

