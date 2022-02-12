import {
  checkOssClient,
  initOssClient
} from '../utils/upload';
import api from "@/request/api";
import tool from "@/utils/tools";
const moment = require('moment');

const aLiOss = {
  methods: {
    async initClient(){
      // 检查是否已有 Oss Client
      let client = checkOssClient();

      if (client === null) {
        let params = {}
        try {
          let gettsttokenRes = await api.gettsttoken(params);
          if (gettsttokenRes.data.code == 200) {
            const credentials = gettsttokenRes.data.data;
            client = initOssClient(
              credentials.accessKeyId,
              credentials.accessKeySecret,
              credentials.securityToken,
              credentials.expiration
            );
          } else {
            this.$message.error(`${gettsttokenRes.data.Msg}`);
            return; 
          }
        } catch (err) {
          this.$message.error(`${err}`);
        }
      }
      return client;
    },
    // 图片上传至 oss
    //opt 文件数据 必传
    //filesName 文件名 必传 例“思维导图测试文件”
    //ossId 非必传  如果不传 则会在oss中新建一个文件 并返回 ossId  如果传了 则会覆盖以前的内容
    async saveToOss(opt, filesName, ossId) {
      if (opt.size > 1024 * 1024 * 10) {
        this.$message.warning(`文件不能大于10M`);
        return false;
      }
      // 获取文件后缀
      const tmp = opt.name.split('.');
      const extname = tmp.pop();

      //   const extList = ['jpg', 'jpeg', 'png', 'gif'];
      //   // 校验文件类型
      //   const isValid = extList.includes(extname);
      //   if (!isValid) {
      //     this.$message.warning(`只支持上传 jpg、jpeg、png、gif 格式的图片`);
      //     return;
      //   }

      let client = await this.initClient();

      var userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {
        userId: ""
      }

      let fileBasePath = "";
      process.env.NODE_ENV === 'development' ? fileBasePath = 'test' : fileBasePath = 'production'
      fileBasePath = "test";

      function randomString(e) {  
        e = e || 32;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
        for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
      }
      if(!ossId){
        ossId = `${fileBasePath}/${userInfo.userId}/${userInfo.userId}_${moment().format('YYYY-MM-DD')}_${new Date().getTime()}${randomString(5)}`;
      }

      const optCallback = {
        callback : {
          url: 'http://mindmaps-api-test.afirstsoft.cn/api/AliOss/callback',
          // url: 'http://9cnztz.natappfree.cc/api/AliOss/callback',
          // 设置发起回调时请求body的值。
          body: 'bucket=${bucket}&object=${object}&etag=${etag}&size=${size}&mimeType=${mimeType}&filesName=${x:filesName}&userId=${x:userId}&extName=${x:extName}&baseUrl=${x:baseUrl}',
          // 设置发起回调请求的Content-Type。
          contentType: 'application/x-www-form-urlencoded',
          // 设置发起回调请求的自定义参数。
          customValue: {
            filesName:filesName,
            userId: String(userInfo.userId),
            extName:extname,
            baseUrl:"https://pdmind.oss-us-east-1.aliyuncs.com/"
          }
        }
      }
      // let url;
      try {
        // 使用 multipartUpload 正式上传到 oss
        var result = await client.put(ossId, opt,optCallback);
        console.log('oss上传文件Response', result);
        // url = result;
        // const res = await client.multipartUpload(ossId, opt);
        // // 去除 oss 分片上传后返回所带的查询参数，否则访问会 403
        // const ossPath = res.res.requestUrls[0].split('?')[0];
        // // 替换协议，统一使用 'https://'，否则 Android 无法显示图片
        // url = ossPath.replace('http://', 'https://');
      } catch (error) {
        this.$message.error(`${error}`);
        return false;
      }
      return result;
    },
    //从oss中获取数据 直接返回转换过后脑图需要的字符串
    //ossId 必传
    async GetFromOss(ossId){
      let client = await this.initClient();
      let result = await client.get(ossId);
      console.log("oss下载文件Response",result);
      var str = tool.Uint8ArrayToString(result.content);
      return str;
    }
  }
};

export default aLiOss;