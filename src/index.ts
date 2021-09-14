// 画布和节点公共的属性
type dataCommonType = {
  lineHeight?: number,
  color?: string,
  textAlign?: 'center' | 'left' | 'right',
  fontSize?: number,
  fontFamily?: string,
  autoHeight?: boolean,
};

// 节点属性
type dataElementType = {
  type: 'img' | 'txt',
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  radius?: number,
  content: string | dataElementType[],
  maxWidth?: number,
  rotate?: number,
  bold?: number,
  imgObj?: HTMLImageElement,
} & dataCommonType;

// 画布属性
type dataType = {
  width: number,
  height: number,
  output?: 'jpeg' | 'png',
  quality?: number,
  ratio?: number,
  bgColor?: string,
  elements?: dataElementType[],
} & dataCommonType;

function drawCanvas(
  data: dataType,
  callback?: (ops?: string) => void,
  callbackError?: (ops?: string | Event) => void,
  canvasEl?: HTMLCanvasElement,
) {
  const canvas = canvasEl || document.createElement('canvas');

  // 默认配置
  const defaultData = {
    width: 750,
    height: 200,
    output: 'jpeg',
    quality: 0.6,
    lineHeight: 1.5,
    color: '#263238',
    textAlign: 'left',
    fontSize: 14,
    fontFamily: '"PingFang SC",tahoma,arial,"helvetica neue","hiragino sans gb","microsoft yahei",sans-serif',
    autoHeight: false,
    ratio: 2,
    bgColor: 'rgba(255, 255, 255, 0)',
    elements: [] as dataElementType[],
  };

  // 合并配置数据
  const newData = Object.assign({}, defaultData, data);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('canvas no find');
  };

  const ratio = newData.ratio;
  const getRatio = (num = 0) => num * ratio;

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

  const isTextAlignCenter = (textAlign?: string) => textAlign === 'center';

  const isTextAlignRight = (textAlign?: string) => textAlign === 'right';

  // 指定宽高内绘制图片（background-size:cover方式）
  const drawImgCover = (img: HTMLImageElement, contW: number, contH: number, startX: number, startY: number) => {
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

  // 计算文字宽度
  const getTextWidth = (str: string) => ctx.measureText(str).width;

  // 计算换行
  const getTextRow = (str: string, width: number, height: number) => {
    const strLen = str.length;
    let tmp = '';
    let row = [];
    for (let i = 0; i < strLen; i++) {
      const isBreakLine = str[i] === '\n';
      if (getTextWidth(tmp) < width && !isBreakLine) {
        tmp += str[i];
      } else {
        row.push(tmp);
        tmp = isBreakLine ? '' : str[i];
      }
    }
    tmp && row.push(tmp);
    return row;
  };

  // 获取字体字符串
  const getFont = (fontSize: number, fontfamily: string, bold?: number) => {
    let font = fontSize + 'px ' + fontfamily;
    if (bold) {
      font = bold + ' ' + font;
    }
    return font;
  };

  // 自动换行
  const canvasTextAutoLine = (
    str: string,
    initX: number,
    initY: number,
    width: number,
    height: number,
    lineHeight: number,
  ) => {
    const row = getTextRow(str, width, height);
    const rowHeight = (row.length + 1) * lineHeight;
    if (newData.autoHeight && rowHeight > height) {
      currentY += height - rowHeight;
    }
    row.forEach((r, i) => ctx.fillText(r, initX, initY + i * lineHeight));
  };

  // 绘制圆角并裁剪
  const drawRoundedRect = (x: number, y: number, width: number, height: number, r: number) => {
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
  const centerImg = (img: HTMLImageElement, startX: number, startY: number, w: number, h: number) => {
    const x = startX + (newData.width - w) / 2;
    ctx.drawImage(img, x, startY, w, h);
  };

  // 居右图片
  const rightImg = (img: HTMLImageElement, startX: number, startY: number, w: number, h: number) => {
    const x = startX + newData.width - w;
    ctx.drawImage(img, x, startY, w, h);
  };

  // 最大长度省略文字
  const ellipsis = (str: string, maxWidth: number) => {
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
      if (getTextWidth(str.substr(0, i + 1)) > maxWidth) {
        return `${str.substr(0, i)}...`;
      }
    }
    return str;
  };

  // 导出
  const output = () => {
    // 无输出格式
    if (!newData.output) {
      return;
    }

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
    const dataUrl = canvas.toDataURL(
      'image/' + newData.output,
      newData.quality
    );
    setTimeout(function () {
      callback && callback(dataUrl);
    }, 0);
  };

  // 每次绘制节点完成后检查是否全部绘制完成
  const checkOutput = () => {
    drawedElementCount++;
    if (drawedElementCount === elementLength) {
      output();
    }
  };

  // 加载图片
  const loadImage = (imgArr: dataElementType[], cb: () => void) => {
    if (imgElementLength === 0 || !imgArr) {
      cb?.();
      return;
    }
    imgArr.forEach((item) => {
      if (!item) return;
      const Img = new Image();
      Img.crossOrigin = 'anonymous';

      Img.onload = () => {
        item.imgObj = Img;
        loadedImgCount++;
        if (loadedImgCount === imgElementLength) {
          cb?.();
        }
      };

      Img.onerror = (err) => {
        callbackError?.(err);
        return false;
      };

      Img.src = item.content as string;
    });
  };

  const formatTextY = (y: number) => {
    // 安卓文字位置有点偏上
    if (
      typeof navigator !== 'undefined' &&
      /Android/.test(navigator.userAgent)
    ) {
      return y + 6;
    }
    return y;
  };

  // 文字片段绘制
  const drawTextArr = (
    contentArr: dataElementType[],
    x: number,
    y: number,
    w: number,
    lineHeight: number,
    color: string,
    fontSize: number,
    fontFamily: string,
    autoHeight?: boolean,
  ) => {
    if (!contentArr?.length) return;
    const initX = x;
    let initY = y;
    let lineWidth = 0;
    const lineWidthArr: number[] = [];
    const textAlign = ctx.textAlign;
    let contObjsLen = 0;
    const contObjs: {
      content: string,
      x: number,
      y: number,
      color: string,
      font: string,
    }[][] = [];

    // 先计算出每个字的位置和状态
    contentArr.forEach((item) => {
      const strtxt = item.content;
      const fs = getRatio(item.fontSize) || fontSize;
      const ff = item.fontFamily || fontFamily;
      const font = getFont(fs, ff, item.bold);
      ctx.font = font;
      for (let i = 0; i < strtxt.length; i++) {
        const isBreakLine = strtxt[i] === '\n';
        const curW = getTextWidth(strtxt[i] as string);
        lineWidth += curW;
        if (lineWidth > w && autoHeight || isBreakLine) {
          initY += lineHeight;
          if (newData.autoHeight) {
            currentY += lineHeight;
          }
          const tw = isBreakLine ? 0 : curW;
          lineWidthArr.push(lineWidth - tw);
          lineWidth = tw;
          contObjsLen += 1;
        }
        if (!contObjs[contObjsLen]) contObjs[contObjsLen] = [];
        contObjs[contObjsLen].push({
          content: strtxt[i] as string,
          x: initX + lineWidth - curW,
          y: initY,
          color: item.color || color,
          font,
        });
      }
    });
    lineWidth && lineWidthArr.push(lineWidth);

    // 每个字绘制
    ctx.textAlign = 'left';
    contObjs.forEach((item, i) => {
      const itemW = lineWidthArr[i];
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
        ctx.fillText(obj.content, nx, formatTextY(obj.y));
      });
    });
  };

  // 绘制图片
  const drawImage = (element: dataElementType) => {
    const x = getRatio(element.x || 0),
      w = getRatio(element.width || 0);
    let y = getRatio(element.y || 0),
      h = getRatio(element.height || 0);

    if (currentY !== 0) {
      y += currentY;
    }

    const Img = element.imgObj;
    if (!Img) return;

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

    if (element.radius && element.radius > 0) {
      drawRoundedRect(x, y, w, h, element.radius);
    }
    checkOutput();
  };

  // 绘制文本
  const drawText = (element: dataElementType) => {
    const fontfamily = element.fontFamily || newData.fontFamily,
      fontSize = getRatio(element.fontSize || newData.fontSize),
      textAlign = element.textAlign || newData.textAlign,
      w = getRatio(element.width) || newData.width,
      h = getRatio(element.height || 0),
      color = element.color || newData.color,
      lh = element.lineHeight || newData.lineHeight;
    
    const font = getFont(fontSize, fontfamily, element.bold);

    let cont = element.content;
    let x = getRatio(element.x || 0);
    let y = getRatio(element.y || 0);
    const lineHeight = lh * fontSize;

    switch (textAlign) {
      case 'center':
        x += w / 2 || newData.width / 2;
        break;
      case 'right':
        x += w || newData.width;
        break;
    }

    if (currentY !== 0) {
      y += currentY;
    }

    if (element.maxWidth) {
      cont = ellipsis(cont as string, element.maxWidth);
    }

    y += lineHeight / 2;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = textAlign;
    if (typeof cont !== 'string') {
      drawTextArr(
        cont,
        x,
        formatTextY(y),
        w,
        lineHeight,
        color,
        fontSize,
        fontfamily,
        element.autoHeight,
      );
    } else if (element.autoHeight) {
      canvasTextAutoLine(cont, x, y, w, y + h, lineHeight);
    } else {
      if (element.rotate) {
        const rx = newData.width - (element.width || 0);
        ctx.translate(rx / 2, y);
        ctx.rotate((Math.PI / 180) * element.rotate); // 弧度 = (Math.PI/180)*角度
        ctx.fillText(cont, 0, 0);
        ctx.fill();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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
  const imgArr: any = newDataElemenes.map((item) => {
    if (item.type === 'img') {
      imgElementLength++;
      return item;
    }
  });

  // 加载所有图片，加载完成后开始绘制
  loadImage(imgArr, () => {
    newDataElemenes.forEach((item, index) => {
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
