/*
 * @Author: glm
 * @Date: 2022-01-21 09:36:28
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-21 15:01:32
 * @Description: 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import * as getters from './getters'
import {
    actions
} from './actions'
import {
    mutations
} from './mutations'
import {
    state
} from './state'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    reducer(val) {
        return {
            modalStatus: val.modalStatus,
            loginStatus: val.loginStatus,
            userInfo: val.userInfo,
            nowNetwork: val.nowNetwork,
        }
    }
})

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    plugins: [
        vuexLocal.plugin
    ]
})

export default store