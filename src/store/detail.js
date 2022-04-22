import { reqGetGoodInfo } from "@/api"
import { getUUID } from "@/utils/uuid_token";

const state = {
    goodInfo: {},
    uuid_token: getUUID()
}
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
const actions = {
    async getGoodInfo(context, skuId) {
        let result = await reqGetGoodInfo(skuId);
        if (result.code == 200) {
            context.commit('GETGOODINFO', result.data)
        }
    }
}
const getters = {
    categoryView(state) {
        return state.goodInfo.categoryView || {}
    },
    skuInfo(state) {
        return state.goodInfo.skuInfo || {}
    },
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || []
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}