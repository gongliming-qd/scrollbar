/*
 * @Author: glm
 * @Date: 2022-01-21 09:36:28
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-21 15:00:45
 * @Description: 
 */
export const actions = {
    setModalStatus({ commit }, Status) {
        commit('setModalStatus', Status)
    },
    setLoginStatus({ commit }, Status) {
        commit('setLoginStatus', Status)
    },
    setUserInfo({ commit }, data) {
        commit('setUserInfo', data)
    },
    setnowNetwork({ commit }, status) {
        commit('setnowNetwork', status)
    }
}