const OSS = require('ali-oss');
const moment = require('moment');
 
let expirationTime = null; // STS token 过期时间
let client = null; // OSS Client 实例
 
 
// 初始化 oss client
export function initOssClient(accessKeyId, accessKeySecret, stsToken,expiration) {
  client = new OSS({
    accessKeyId,
    accessKeySecret,
    stsToken,
    region: 'oss-us-east-1',
    bucket: 'pdmind'
  });
  expirationTime = expiration;
  return client;
}
 
// 检查 oss 实例以及过期时间
export function checkOssClient() {
  const current = moment();
  return moment(expirationTime).diff(current,"seconds") <= 0 ? null : client;
}
 
// 用于 sts token 失效、用户登出时注销 oss client
export function destroyOssClient() {
  client = null;
}