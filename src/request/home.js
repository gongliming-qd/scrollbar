/*
 * @Author: glm
 * @Date: 2022-01-10 17:00:26
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-18 14:32:51
 * @Description: 
 */

import http from './http'

// 获取产品数据
export const getProductList = (data) => {
  return http.get('/api/ProjectFiles/getprojectfiles', data)
}

// 修改产品名字
export const updateProductName = (data) => {
  return http.get('/api/ProjectFiles/projectfilerename', data)
}

// 删除产品去垃圾站
export const deleProductTrash = (data) => {
  return http.get('/api/ProjectFiles/projectfiledelete', data)
}

// 获取工程文件基础信息
export const GetProjectFileInfo = (data) => {
  return http.get('/api/ProjectFiles/getprojectfileinfo', data)
}