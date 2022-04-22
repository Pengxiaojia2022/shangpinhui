import requests from './request';
import mockRequests from './mockRequest';

export const reqCategoryList = () => {
    return requests({
        url: '/product/getBaseCategoryList',
        method: 'get'
    })
}

export const reqGetBannerList = () => {
    return mockRequests({
        url: '/banner',
        method: 'get'
    })
}

export const reqGetFloorList = () => {
    return mockRequests({
        url: '/floor',
        method: 'get'
    })
}

export const reqGetSearchInfo = (params) => {
    return requests({
        url: '/list',
        method: 'post',
        data: params
    })
}

export const reqGetGoodInfo = (skuId) => {
    return requests.get(`/item/${skuId}`)
}

export const reqAddOrUpdateShopCart = ({ skuId, skuNum }) => {
    return requests({
        url: `/cart/addToCart/${skuId}/${skuNum}`,
        method: 'post'
    })
}

export const reqCarList = () => {
    return requests.get('/cart/cartList')
}

// /api/cart/checkCart/{skuID}/{isChecked}
export const reqCheckCart = (skuId, isChecked) => {
    return requests.get(`/cart/checkCart/${skuId}/${isChecked}`)
}

//  /api/cart/deleteCart/{skuId}  delete
export const reqDeleteCart = (skuId) => {
    return requests.delete(`/cart/deleteCart/${skuId}`)
}

// /api/user/passport/sendCode/{phone}
export const reqGetCode = (phone) => requests.get(`/user/passport/sendCode/${phone}`)

// /api/user/passport/register   post
export const reqUserRegister = (data) => requests.post('/user/passport/register', data)

// /api/user/passport/login  post
export const reqUserLogin = (data) => requests.post('/user/passport/login', data)

// /api/user/passport/auth/getUserInfo   请求头带token获取
export const reqGetUserInfo = () => requests.get('/user/passport/auth/getUserInfo')

// /api/user/passport/logout  get
export const reqUserLogout = () => requests.get('/user/passport/logout')

// 获取用户地址信息 /api/user/userAddress/auth/findUserAddressList get
export const reqGetUserAddress = () => requests.get('/user/userAddress/auth/findUserAddressList')

// 获取商品清单  /api/order/auth/trade
export const reqGetTradeList = () => requests.get('/order/auth/trade')

// 提交订单  /api/order/auth/submitOrder?tradeNo={tradeNo}  post
export const reqSubmitOrder = (tradeNo, data) => requests.post(`/order/auth/submitOrder?tradeNo=${tradeNo}`, data)

// 提交订单成功，获取支付信息  /api/payment/weixin/createNative/{orderId}  get
export const reqGetPayInfo = (orderId) => requests.get(`/payment/weixin/createNative/${orderId}`)

// 获取用户支付状态  /api/payment/weixin/queryPayStatus/{orderId}  get
export const reqGetPayStatus = (orderId) => requests.get(`/payment/weixin/queryPayStatus/${orderId}`)

// 查看我的订单信息 /api/order/auth/{page}/{limit}  get
export const reqGetOrderList = (page, limit) => requests.get(`/order/auth/${page}/${limit}`)