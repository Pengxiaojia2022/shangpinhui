import { reqGetCode, reqUserRegister, reqUserLogin, reqGetUserInfo, reqUserLogout } from "@/api"
import { getToken, removeToken, setToken } from "@/utils/token";
const state = {
    code: '',
    token: getToken(),
    userInfo: {}
}
const mutations = {
    GETCODE(state, code) {
        state.code = code
    },
    USERLOGIN(state, user) {
        state.token = user.token;
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    CLEAR(state) {
        // 退出登录成功，清除仓库中的token以及本地存储中的token
        state.token = '';
        state.userInfo = '';
        removeToken();
    }
}
const actions = {
    async getCode({ commit }, phone) {
        let result = await reqGetCode(phone)
        if (result.code == 200) {
            commit('GETCODE', result.data)
        }
    },
    async userRegister({ commit }, data) {
        let result = await reqUserRegister(data);
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }
    },
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data)
        if (result.code == 200) {
            commit('USERLOGIN', result.data)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }

    },
    async getUserInfo({ commit }) {
        let result = await reqGetUserInfo();
        if (result.code == 200) {
            commit('GETUSERINFO', result.data);
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    async userLogout({ commit }) {
        let result = await reqUserLogout()
        if (result.code == 200) {
            commit('CLEAR')
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
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