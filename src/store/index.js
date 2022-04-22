import Vue from 'vue';
import Vuex from 'vuex';
import homeOptions from './home'
import searchOptions from './search'
import detailOptions from './detail'
import shopcartOPtions from './shopcart'
import userOptions from './user'
import tradeOptions from './trade'
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        home: homeOptions,
        search: searchOptions,
        detail: detailOptions,
        shopcart: shopcartOPtions,
        user: userOptions,
        trade: tradeOptions
    }
})