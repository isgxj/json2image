json2image
===========

### 原理
通过配置json使用原生canvas将图片和文字组合生成一张base64图片  

### 演示  
<a href="https://sls-layer-ap-guangzhou-code-1251208590.cos-website.ap-guangzhou.myqcloud.com/json2image/" target="_blank">demo</a>  
<img src="https://sls-layer-ap-guangzhou-code-1251208590.cos.ap-guangzhou.myqcloud.com/json2image/demo1.jpg" width="500">  

### 使用场景
1、生成分享海报，可以100%还原设计稿  
2、复杂文字、图片组合样式，方便适配多屏幕  
3、图片压缩  
4、添加水印  
5、支持部署到node后端，可以无视跨域问题、兼容问题等 <a href="https://github.com/isgxj/json2image-scf" target="_blank">云函数示例</a>  

### 功能
* 多行文本自动换行，支持左中右对齐
* 文本多种颜色
* 竖排文字
* 旋转文字
* 图片自动高度
* 图片左中右对齐
* 图片圆角
* 导出动态高度
* 可以缩放调整清晰度，设置ratio即可
* 设置quality可以实现图片文件大小压缩

### 计划
- [ ] 小程序版本
- [ ] 文本渐变颜色
- [ ] 圆形、矩形、圆角矩形、各种边框
- [ ] 渐变边框、渐变背景
- [ ] 旋转文字优化
- [ ] 导出动态高度优化
- [ ] cover方式绘制图片
- [ ] 分组

### 与 json2canvas 对比
1、体积小，json2canvas使用了cax，压缩之后也有100+kb，json2image压缩之后仅有4kb  
2、一步到位，json2image直接生成图片，省去json2canvas再做一步转换  
3、json2image专为生成海报设计，支持更多海报场景  

### 与 html2canvas 对比
1、设计还原，html2canvas是截取当前设备下的dom结构，可能会由于设备的不同而导致得到的图片表现不统一，使用json2image可以在任何设备之间保持100%与设计稿统一  
2、需保存图片和显示样式不同，如需保存图片要添加二维码、增加内容等  

### 快速开始

#### 安装
```
npm i -S json2image
or
yarn add -S json2image
or
直接在script标签中使用
<script src="https://unpkg.com/browse/json2image@0.1.3/dist/index.js"></script>
```

#### 使用  
注意：前端生成时，跨域图片需要后端设置cors  

```js
import json2image from 'json2image';

// 1、生成海报
const data = {
  width: 750, // 设计稿图片宽度
  height: 600, // 设计稿图片高度
  output: 'jpeg', // 支持png、jpeg
  quality: 0.6, // 图片质量，0-1，小于1则实现压缩
  lineHeight: 1.5,
  color: '#263238',
  textAlign: 'left',
  fontSize: 14,
  fontFamily: '"PingFang SC","sans-serif"',
  autoHeight: false, // 是否动态高度
  ratio: 2, // 缩放，可调整清晰度
  bgColor: 'rgba(255, 255, 255, 0)',
  elements: [
    {
      type: 'img', // 图片节点
      x: 0,
      y: 0,
      width: 750,
      height: 600,
      radius: 0, // 圆角
      autoHeight: false, // 是否自动计算高度
      textAlign: 'left', // 图片对齐方式
      content: './images/bg.png', // 图片url
    },
    {
      type: 'text', // 单色文本节点
      width: 558,
      height: 56,
      maxWidth: 558, // 最大宽度，单行超出省略
      x: 104,
      y: 500,
      fontSize: 28,
      color: '#3C5A6E',
      autoHeight: false, // 是否自动换行
      lineHeight: 1.5,
      textAlign: 'left', // 文字对齐方式
      rotate: 45, // 文本旋转角度
      content: '文本文本',
    },
    {
      type: 'text', // 多色文本节点
      width: 558,
      height: 56,
      maxWidth: 558,
      x: 104,
      y: 500,
      fontSize: 28,
      color: '#3C5A6E',
      autoHeight: false,
      lineHeight: 1.5,
      textAlign: 'left',
      content: [
        {
          content: '默认文本 ',
        },
        {
          fontSize: 36,
          color: 'red',
          content: '红色文本',
        },
        {
          content: ' 默认文本 ',
        },
        {
          color: 'green',
          content: '绿色文本',
        },
        {
          content: ' 默认文本',
        },
      ],
    },
  ],
};

json2image(data, (url) => {
  // 返回base64格式图片
  console.log(url);
}, err => console.log(err));




// 2、压缩图片
const data2 = {
  width: 750,
  height: 600,
  output: 'jpeg',
  quality: 0.5, // 压缩文件大小，目前只支持输出jpeg格式有效
  ratio: 0.5, // 压缩分辨率
  elements: [
    {
      type: 'img',
      width: 750,
      height: 600,
      content: './images/big.png',
    },
  ],
};

json2image(data2, (url) => {
  // 返回base64格式图片
  console.log(url);
}, err => console.log(err));

```
