if (!Object.assign) {
  Object.assign = function (target) {
    if (target === null || target === undefined) {
      target = {};
    }
    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

function drawCanvas(data, callback, callbackError) {
  let canvas = document.createElement('canvas');

  // 默认配置
  const defaultData = {
    width: 750,
    height: 200,
    lineHeight: 1.5,
    color: '#263238',
    textAlign: 'left',
    fontSize: 14,
    fontFamily:
      '"PingFang SC",tahoma,arial,"helvetica neue","hiragino sans gb","microsoft yahei",sans-serif',
    autoHeight: false,
    ratio: 2,
    bgColor: 'rgba(255, 255, 255, 0)',
    elements: [],
  };
  // 合并配置数据
  const newData = Object.assign({}, defaultData, data);
  const ctx = canvas.getContext('2d');

  const ratio = newData.ratio;
  const getRatio = function (num) {
    return num * ratio;
  };

  // 当前Y坐标
  let currentY = 0;
  // 已经绘制节点数
  let drawedElementCount = 0;
  // 已经加载图片数
  let loadedImgCount = 0;
  // 节点总数
  let elementLength = 0;
  // 图片节点数
  let imgElementLength = 0;

  // 调整清晰度
  newData.width *= ratio;
  newData.height *= ratio;

  // 设置canvas宽高
  canvas.width = newData.width;
  canvas.height = newData.height;

  // 初始化背景
  ctx.fillStyle = newData.bgColor;
  ctx.fillRect(0, 0, newData.width, newData.height);

  // 设计文字基线
  ctx.textBaseline = 'middle';

  const isTextAlignCenter = function (textAlign) {
    return textAlign === 'center';
  };

  const isTextAlignRight = function (textAlign) {
    return textAlign === 'right' || textAlign === 'end';
  };

  // 指定宽高内绘制图片（background-size:cover方式）
  const drawImgCover = function (img, contW, contH, startX, startY) {
    if (img.width / img.height >= contW / contH) {
      const dH = img.height;
      const dW = Math.ceil((contW / contH) * dH);
      ctx.drawImage(
        img,
        (img.width - dW) / 2,
        0,
        dW,
        img.height,
        startX,
        startY,
        contW,
        contH
      );
    } else {
      const dW = img.width;
      const dH = Math.ceil((contH / contW) * dW);
      ctx.drawImage(
        img,
        0,
        (img.height - dH) / 2,
        img.width,
        dH,
        startX,
        startY,
        contW,
        contH
      );
    }
  };

  // 自动换行
  const canvasTextAutoLine = function (
    str,
    initX,
    initY,
    width,
    height,
    lineHeight
  ) {
    let lineWidth = 0;
    let lastSubStrIndex = 0;
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > width) {
        ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
        initY += lineHeight;
        if (newData.autoHeight && initY >= height) {
          currentY += lineHeight;
        }
        lineWidth = ctx.measureText(str[i]).width;
        lastSubStrIndex = i;
      }
      if (i === str.length - 1) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
      }
    }
  };

  // 绘制圆角并裁剪
  const drawRoundedRect = function (x, y, width, height, r) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.clip();
  };

  // 居中图片
  const centerImg = function (img, startX, startY, w, h) {
    const x = startX + (newData.width - w) / 2;
    ctx.drawImage(img, x, startY, w, h);
  };

  // 居右图片
  const rightImg = function (img, startX, startY, w, h) {
    const x = startX + newData.width - w;
    ctx.drawImage(img, x, startY, w, h);
  };

  // 最大长度省略文字
  const ellipsis = function (str, maxWidth) {
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
      if (ctx.measureText(str.substr(0, i + 1)).width > maxWidth) {
        return `${str.substr(0, i)}...`;
      }
    }
    return str;
  };

  // 导出
  const output = function () {
    // 获取可变部分图像
    const contW = newData.width;
    let contH = newData.height;

    if (newData.autoHeight) {
      contH += currentY;
    }
    const main = ctx.getImageData(0, 0, contW, contH);

    // 重新建空画布
    canvas.width = contW;
    canvas.height = contH;
    ctx.clearRect(0, 0, contW, newData.height); //清空

    // 绘制可变部分图像
    ctx.putImageData(main, 0, 0);

    // 导出图片url
    const dataUrl = canvas.toDataURL('image/png', 1);
    setTimeout(function () {
      callback && callback(dataUrl);
    }, 100);
  };

  // 每次绘制节点完成后检查是否全部绘制完成
  const checkOutput = function () {
    drawedElementCount++;
    if (drawedElementCount === elementLength) {
      output();
    }
  };

  // 加载图片
  const loadImage = function (imgArr, cb) {
    imgArr.forEach(function (item) {
      if (!item) return;
      const Img = new Image();
      Img.crossOrigin = 'anonymous';
      Img.src = item.content;

      Img.onload = function () {
        item.imgObj = this;
        loadedImgCount++;
        if (loadedImgCount === imgElementLength) {
          cb && cb();
        }
      };

      Img.onerror = function (err) {
        callbackError && callbackError(err);
        return false;
      };
    });
  };

  // 文字片段绘制
  const drawTextArr = function (
    contentArr,
    x,
    y,
    w,
    lineHeight,
    color,
    fontSize,
    fontfamily,
    autoHeight
  ) {
    if (!contentArr || !contentArr.length) return;
    const initX = x;
    let initY = y;
    let lineWidth = 0;
    const textAlign = ctx.textAlign;
    const contObjs = [];
    let contObjsLen = 0;

    // 先计算出每个字的位置和状态
    contentArr.forEach(function (item) {
      const strtxt = item.content;
      let font =
        (getRatio(item.fontSize) || fontSize) +
        'px ' +
        (item.fontfamily || fontfamily);
      if (item.bold) {
        font = item.bold + ' ' + ctx.font;
      }
      for (let i = 0; i < strtxt.length; i++) {
        const curW = ctx.measureText(strtxt[i]).width;
        lineWidth += curW;
        if (lineWidth > w && autoHeight) {
          initY += lineHeight;
          if (newData.autoHeight) {
            currentY += lineHeight;
          }
          lineWidth = curW;
          contObjsLen += 1;
        }
        if (!contObjs[contObjsLen]) contObjs[contObjsLen] = [];
        contObjs[contObjsLen].push({
          content: strtxt[i],
          x: initX + lineWidth - curW,
          y: initY,
          color: item.color || color,
          font,
        });
      }
    });

    // 每绘制
    contObjs.forEach(function (item) {
      const itemW = ctx.measureText(item.map(ii => ii.content).join('')).width;
      item.forEach(function (obj) {
        ctx.fillStyle = obj.color;
        ctx.font = obj.font;
        let nx = obj.x;
        if (isTextAlignCenter(textAlign)) {
          nx -= itemW / 2;
        }
        if (isTextAlignRight(textAlign)) {
          nx -= itemW;
        }
        ctx.textAlign = 'left';
        ctx.fillText(obj.content, nx, obj.y);
      });
    });
  };

  // 绘制图片
  const drawImage = function (element) {
    const x = getRatio(element.x || 0),
      w = getRatio(element.width || 0);
    let y = getRatio(element.y || 0),
      h = getRatio(element.height || 0);

    if (currentY !== 0) {
      y += currentY;
    }

    const Img = element.imgObj;
    const textAlign = element.textAlign;

    ctx.save();
    if (element.autoHeight) {
      const newH = Img.height * (w / Img.width);
      if (newData.autoHeight) {
        currentY += newH - h;
      }
      h = newH;
    }
    if (isTextAlignCenter(textAlign)) {
      centerImg(Img, x, y, w, h);
    } else if (isTextAlignRight(textAlign)) {
      rightImg(Img, x, y, w, h);
    } else {
      ctx.drawImage(Img, x, y, w, h);
    }

    ctx.restore();

    if (element.radius > 0) {
      drawRoundedRect(x, y, w, h, element.radius);
    }
    checkOutput();
  };

  // 绘制文本
  const drawText = function (element) {
    const fontfamily = element.fontfamily || newData.fontFamily,
      fontSize = getRatio(element.fontSize || newData.fontSize),
      textAlign = element.textAlign || newData.textAlign,
      w = getRatio(element.width) || newData.width,
      h = getRatio(element.height || 0),
      color = element.color || newData.color,
      lh = element.lineHeight || newData.lineHeight;

    let font = fontSize + 'px ' + fontfamily,
      cont = element.content,
      x = getRatio(element.x || 0),
      y = getRatio(element.y || 0);
    const lineHeight = lh * fontSize;

    if (element.bold) {
      font = element.bold + ' ' + font;
    }

    switch (textAlign) {
      case 'center':
        x += w / 2 || newData.width / 2;
        break;
      case 'right':
      case 'end':
        x += w || newData.width;
        break;
    }

    if (currentY !== 0) {
      y += currentY;
    }

    if (element.maxWidth) {
      cont = ellipsis(cont, element.maxWidth);
    }

    y += lineHeight / 2;

    // 安卓文字位置有点偏上
    if (/Android/.test(navigator.userAgent)) {
      y += 6;
    }

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = textAlign;
    if (typeof cont !== 'string') {
      drawTextArr(
        cont,
        x,
        y,
        w,
        lineHeight,
        color,
        fontSize,
        fontfamily,
        element.autoHeight
      );
    } else if (element.autoHeight) {
      canvasTextAutoLine(cont, x, y, w, y + h, lineHeight);
    } else {
      if (element.rotate) {
        ctx.rotate((Math.PI / 180) * element.rotate); // 弧度 = (Math.PI/180)*角度
        const tw = ctx.measureText(cont).width;
        if (element.rotateCenter && tw < 75) {
          x = x + 47 - tw / 2;
        }
        ctx.fillText(cont, x, y);
        ctx.fill();
        ctx.rotate(0);
      } else {
        ctx.fillText(cont, x, y);
        ctx.fill();
      }
    }
    ctx.closePath();
    checkOutput();
  };

  const newDataElemenes = newData.elements;

  // 无绘制节点，流程结束
  if (!newDataElemenes || !newDataElemenes.length) return;

  // 获取所有节点数
  elementLength = newDataElemenes.length;

  // 获取图片节点数组，使用map可以保存图片在原始数组中的位置
  const imgArr = newDataElemenes.map(function (item) {
    if (item.type === 'img') {
      imgElementLength++;
      return item;
    }
  });

  // 加载所有图片，加载完成后开始绘制
  loadImage(imgArr, function () {
    newDataElemenes.forEach(function (item, index) {
      if (item.type === 'img') {
        // 取得加载到的图片对象
        item.imgObj = imgArr[index].imgObj;
        drawImage(item);
      } else {
        drawText(item);
      }
    });
  });
}

export default drawCanvas;
