import { reqCategoryList, reqGetBannerList, reqGetFloorList } from "@/api";
const state = {
    categoryList: [],
    bannerList: [],
    floorList: [],
}
const mutations = {
    CATEGORYLIST(state, data) {
        state.categoryList = data;
    },
    GETBANNERLIST(state, data) {
        state.bannerList = data
    },
    GETFLOORLIST(state, data) {
        state.floorList = data
    }
}
const actions = {
    async categoryList(context) {
        let result = await reqCategoryList()
        if (result.code == 200) {
            context.commit('CATEGORYLIST', result)
        }
    },

    async getBannerList({ commit }) {
        let result = await reqGetBannerList();
        if (result.code == 200) {
            commit('GETBANNERLIST', result)
        }
    },

    async getFloorList({ commit }) {
        let result = await reqGetFloorList();
        if (result.code == 200) {
            commit('GETFLOORLIST', result.data)
        }
    }
}
const getters = {}

const namespaced = true;

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
}