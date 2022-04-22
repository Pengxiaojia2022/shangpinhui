import { reqGetTradeList, reqGetUserAddress, reqSubmitOrder } from "@/api"

const state = {
    userAddress: [],
    tradeList: {}
}
const mutations = {
    GETUSERADDRESS(state, userAddress) {
        state.userAddress = userAddress
    },
    GETTRADELIST(state, tradeList) {
        state.tradeList = tradeList
    }
}
const actions = {
    async getUserAddress({ commit }) {
        let result = await reqGetUserAddress();
        if (result.code == 200) {
            commit('GETUSERADDRESS', result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }
    },
    async getTradeList({ commit }) {
        let result = await reqGetTradeList();
        if (result.code == 200) {
            commit('GETTRADELIST', result.data)
        }
    }
}
const getters = {

}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}