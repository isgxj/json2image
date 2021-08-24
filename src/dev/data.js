var mockUrl = 'https://sls-layer-ap-guangzhou-code-1251208590.cos-website.ap-guangzhou.myqcloud.com/json2image/';

function getMockData(imageUrl) {
  return {
    width: 800,
    height: 2000,
    color: '#000',
    bgColor: '#fff',
    ratio: 1,
    elements: [
      {
        type: 'img',
        x: 0,
        y: 0,
        width: 800,
        height: 2000,
        content: imageUrl + 'images/zp/bg.png',
      },
      {
        type: 'img',
        x: 50,
        y: 40,
        width: 180,
        autoHeight: true,
        content: imageUrl + 'images/zp/logo.png',
      },
      {
        type: 'img',
        x: 58,
        y: 104,
        width: 684,
        autoHeight: true,
        content: imageUrl + 'images/zp/tit.png',
      },
      {
        type: 'img',
        x: 64,
        y: 350,
        width: 322,
        height: 132,
        content: imageUrl + 'images/zp/info.png',
      },
      {
        type: 'img',
        x: 60,
        y: 688,
        width: 180,
        autoHeight: true,
        content: imageUrl + 'images/zp/sub-tit1.png',
      },
      {
        type: 'img',
        x: 442,
        y: 1404,
        width: 180,
        autoHeight: true,
        content: imageUrl + 'images/zp/sub-tit2.png',
      },
      {
        type: 'text',
        x: 74,
        y: 770,
        fontSize: 36,
        bold: 700,
        content: '*直播运营2名    6k-8k',
      },
      {
        type: 'text',
        x: 78,
        y: 834,
        width: 628,
        color: '#333',
        fontSize: 24,
        lineHeight: 2,
        autoHeight: true,
        content: '1.负责企业网络平台对外合作内容资源的策划，整合和推广，利用各种资源提高网络平台知名度和业务量；\n2.维护日常直播间运营的秩序，提高淘宝直播的流量及微博、微信的关注量。',
      },
      {
        type: 'text',
        x: 74,
        y: 1060,
        fontSize: 36,
        bold: 700,
        content: '*短视频编导2名    8-10k',
      },
      {
        type: 'text',
        x: 78,
        y: 1124,
        width: 628,
        color: '#333',
        fontSize: 24,
        lineHeight: 2,
        autoHeight: true,
        // textAlign: 'center',
        content: [
          {
            content: '1.为公司签约的抖音达人提供短视频定位策划，日常创意脚本和拍摄剪辑工作；\n2.提升',
          },
          {
            fontSize: 36,
            color: 'red',
            content: '红人',
          },
          {
            content: '自身的拍摄技巧，原创能力，辅助',
          },
          {
            color: 'red',
            content: '红人',
          },
          {
            content: '内容生产，创意策划内容拍摄。',
          },
        ],
      },
      {
        type: 'img',
        x: 53,
        y: 1498,
        width: 226,
        autoHeight: true,
        content: imageUrl + 'images/zp/code.png',
      },
      {
        type: 'text',
        width: 410,
        x: 292,
        y: 1490,
        color: '#666',
        fontSize: 24,
        lineHeight: 2,
        autoHeight: true,
        content: `联系人：千先生
手机/微信：86-888-888-8888
邮箱：test@qq.com
地址：广东省深圳市高林中路666号华晨大厦1号楼27层`,
      },
      {
        type: 'text',
        y: 1882,
        color: '#666',
        fontSize: 32,
        textAlign: 'center',
        content: '我们最懂你的价值 带着你的梦想来吧！',
      },
    ],
  };
}

var data = getMockData('');
var dataNode = getMockData(mockUrl);


