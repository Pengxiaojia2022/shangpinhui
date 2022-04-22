import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router'
// 引入全局组件
import TypeNav from "@/components/TypeNav";
import Carousel from '@/components/Carousel';
import Pagination from '@/components/Pagination'
// 引入vuex状态管理
import store from '@/store'
// 引入mock数据
import '@/mock/mockServer'

// 引入轮播图插件
import 'swiper/css/swiper.css'

// 引入api接口
import * as API from '@/api'

// 按需引入 element-ui
import { MessageBox } from 'element-ui';

import VueLazyload from 'vue-lazyload'

// 引入自定义插件
import Validator from '@/plugins/validate'

Vue.use(Validator)

Vue.use(VueLazyload, {
  // ！ 引入方式
  loading: require('./assets/loading.gif')
})

Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)

Vue.config.productionTip = false

// API挂载到Vue实例上
Vue.prototype.$API = API;

// element-ui挂载到原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

new Vue({
  // 注册路由，组件身上都拥有了$route和$router属性
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  render: h => h(App),
}).$mount('#app')
