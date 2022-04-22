import { reqAddOrUpdateShopCart, reqCarList, reqCheckCart, reqDeleteCart } from "@/api"

const state = {
    carList: []
}
const mutations = {
    GETCARLIST(state, data) {
        state.carList = data
    }
}
const actions = {
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        let result = await reqAddOrUpdateShopCart({ skuId, skuNum });
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    async getCarList({ commit }) {
        let result = await reqCarList();
        if (result.code == 200) {
            commit('GETCARLIST', result.data)
        }
    },
    async checkCart(context, { skuId, isChecked }) {
        let result = await reqCheckCart(skuId, isChecked);
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    updateAllCartChecked({ dispatch, getters }, isChecked) {
        let PromiseAll = [];
        getters.carList.cartInfoList.forEach(item => {
            let promise = dispatch('checkCart', { skuId: item.skuId, isChecked })
            PromiseAll.push(promise);
        })
        return Promise.all(PromiseAll);
    },
    async deleteCart(context, skuId) {
        let result = await reqDeleteCart(skuId)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    deleteCheckedCart({ dispatch, state }) {
        let result = ''
        let PromiseAll = []
        state.carList[0].cartInfoList.forEach(item => {
            if (item.isChecked == '1') {
                result = dispatch('deleteCart', item.skuId)
            } else {
                result = ''
            }
            PromiseAll.push(result)
        })
        return Promise.all(PromiseAll);
    }
}
const getters = {
    carList(state) {
        return state.carList[0] || {}
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}