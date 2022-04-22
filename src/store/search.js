import { reqGetSearchInfo } from "@/api"

const state = {
    searchInfoObj: {}
}
const actions = {
    async getSearchInfo({ commit }, params = {}) {
        let result = await reqGetSearchInfo(params);
        if (result.code == 200) {
            commit('GETSEARCHINFO', result.data)
        }
    },

}
const mutations = {
    GETSEARCHINFO(state, data) {
        state.searchInfoObj = data
    }

}
const getters = {
    attrsList(state) {
        return state.searchInfoObj.attrsList || []
    },
    goodsList(state) {
        return state.searchInfoObj.goodsList || []
    },
    trademarkList(state) {
        return state.searchInfoObj.trademarkList || []
    }

}
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}