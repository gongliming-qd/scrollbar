/*
 * @Author: glm
 * @Date: 2022-01-21 09:36:28
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-21 15:00:10
 * @Description: 
 */
export const state = {
    minder: {},
    editor: {},
    hasRedo: false,
    hasUndo: false,
    selectedNode: null,
    tempMindMapData: null,
    tempMindMapName: null,

    modalStatus: '0', // 0:啥框都不显示， 1： 登录， 2. 注册，  3. 重置密码
    loginStatus: false, // false : 未登录  true ： 已登录
    nowNetwork:true,
    userInfo: { // 个人信息
        email: ""
    },
}