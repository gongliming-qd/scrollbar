/*
 * @Author: glm
 * @Date: 2022-01-21 09:36:28
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-21 15:01:19
 * @Description: 
 */
export const mutations = {

    setMinder(state, data) {
        state.minder = data
    },

    setEditor(state, data) {
        state.editor = data
    },

    setHasRedo(state, data) {
        state.hasRedo = data
    },
    setHasUndo(state, data) {
        state.hasUndo = data
    },
    setSelectedNode(state, data) {
        state.selectedNode = data
    },
    setTempMindMapData(state, data) {
        state.tempMindMapData = data
    },
    setTempMindMapName(state, data) {
        state.tempMindMapName = data
    },
    setModalStatus(state, status) {
        state.modalStatus = status
    },
    setLoginStatus(state, status) {
        state.loginStatus = status
    },
    setUserInfo(state, data) {
        state.userInfo = data
    },
    setnowNetwork(state, status) {
        state.nowNetwork = status
    },
}