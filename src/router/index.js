// 配置路由的地方
import Vue from 'vue';
import VueRouter from 'vue-router';
// 使用插件
Vue.use(VueRouter);

// 引入路由组件
import Register from '@/pages/Register'
import Login from '@/pages/Login'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade';
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
import MyOrder from '@/pages/Center/MyOrder'
import GroupOrder from '@/pages/Center/GroupOrder'

import store from '@/store';

// 解决警告
// Uncaught (in promise) NavigationDuplicated:Avoided redundant navigation to current location: "xxxx"
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}

VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}



// 配置路由
let router = new VueRouter({
    routes: [
        {
            name: 'home',
            path: '/home',
            component: () => import('@/pages/Home'),
            meta: {
                showFooter: true
            }
        },
        {
            name: 'search',
            path: '/search/:keyword?',
            component: () => import('@/pages/Search'),
            meta: {
                showFooter: true
            }
        },
        {
            name: 'detail',
            path: '/detail/:skuId',
            component: () => import('@/pages/Detail'),
            meta: {
                showFooter: true
            }
        },
        {
            name: 'addcartsuccess',
            path: '/addcartsuccess/:skuNum',
            component: AddCartSuccess,
            meta: {
                showFooter: true
            },
            beforeEnter(to, from, next) {
                if (from.path.indexOf('/detail') != -1) {
                    next()
                } else {
                    next(false)
                }
            }
        },
        {
            name: 'shopcart',
            path: '/shopcart',
            component: ShopCart,
            meta: {
                showFooter: true
            }
        },
        {
            name: 'trade',
            path: '/trade',
            component: Trade,
            meta: {
                showFooter: true
            },
            beforeEnter(to, from, next) {
                if (from.path == '/shopcart') {
                    next()
                } else {
                    next(false);
                }
            }
        },
        {
            name: 'pay',
            path: '/pay',
            component: Pay,
            meta: {
                showFooter: true
            },
            beforeEnter(to, from, next) {
                if (from.path == '/trade') {
                    next()
                } else {
                    next(false)
                }
            }
        },
        {
            name: 'paysuccess',
            path: '/paysuccess',
            component: PaySuccess,
            meta: {
                showFooter: true
            },
            beforeEnter(to, from, next) {
                if (from.path == '/pay') {
                    next()
                } else {
                    next(false)
                }
            }
        },
        {
            name: 'center',
            path: '/center',
            component: Center,
            meta: {
                showFooter: true
            },
            children: [
                {
                    name: 'myorder',
                    path: 'myorder',
                    component: MyOrder
                },
                {
                    name: 'grouporder',
                    path: 'grouporder',
                    component: GroupOrder
                },
                {
                    path: '/',
                    component: MyOrder
                }
            ]
        },
        {
            name: 'register',
            path: '/register',
            component: Register,
            meta: {
                showFooter: false
            }
        },
        {
            name: 'login',
            path: '/login',
            component: Login,
            meta: {
                showFooter: false
            }
        },
        {
            path: '*',
            redirect: '/home'
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return { y: 0 }
    }
})


// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    let token = store.state.user.token;
    if (token) {
        // 如果登录了，token存在
        if (to.name == "login") {
            // 如果登录的情况  不让跳转到登录
            next('/home')
        } else {
            // token存在，跳转的不是登录页，且要保证用户信息存在
            if (store.state.user.userInfo.name) {
                next()
            } else {
                // 用户信息不存在，发送action
                try {
                    await store.dispatch('user/getUserInfo')
                    next()
                } catch (error) {
                    // 用户信息请求失败，或者token过期
                    await store.dispatch('user/userLogout')
                    next('/login')
                }
            }
        }
    } else {
        // 未登录
        // 没有登录不能去订单页，支付页，支付成功，以及个人中心
        if (to.path == '/trade' || to.path == '/pay' || to.path == '/paysuccess' || to.path == '/center' || to.path == '/addcartsuccess') {
            // console.log(111, to.path)
            next('/login?redirect=' + to.path)
        } else {
            next();
        }

    }
})

export default router;