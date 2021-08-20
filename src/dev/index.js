function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function(t,e){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).json2image=e()}(this,(function(){"use strict";return Object.assign||(Object.assign=function(t){null==t&&(t={}),t=Object(t);for(var e=1;e<arguments.length;e++){var n=arguments[e];if(null!=n)for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}),function(t,e,n){var i=document.createElement("canvas"),o=Object.assign({},{width:750,height:10,lineHeight:1.5,color:"#263238",textAlign:"left",fontSize:14,fontFamily:'"PingFang SC",tahoma,arial,"helvetica neue","hiragino sans gb","microsoft yahei",sans-serif',autoHeight:!1,ratio:2,bgColor:"rgba(255, 255, 255, 0)",elements:[]},t),r=i.getContext("2d"),a=o.ratio,f=function(t){return t*a},l=0,c=0,h=0,u=0,g=0;o.width*=a,o.height*=a,i.width=o.width,i.height=o.height,r.fillStyle=o.bgColor,r.fillRect(0,0,o.width,o.height),r.textBaseline="middle";var s=function(t){return"center"===t},d=function(t){return"right"===t||"end"===t},m=function(){++c===u&&function(){var t=o.width,n=o.height;o.autoHeight&&(n+=l);var a=r.getImageData(0,0,t,n);i.width=t,i.height=n,r.clearRect(0,0,t,o.height),r.putImageData(a,0,0);var f=i.toDataURL("image/png",1);setTimeout((function(){e&&e(f)}),100)}()},y=function(t){var e=f(t.x||0),n=f(t.width||0),i=f(t.y||0),a=f(t.height||0);0!==l&&(i+=l);var c=t.imgObj,h=t.textAlign;if(r.save(),t.autoHeight){var u=c.height*(n/c.width);o.autoHeight&&(l+=u-a),a=u}s(h)?function(t,e,n,i,a){var f=e+(o.width-i)/2;r.drawImage(t,f,n,i,a)}(c,e,i,n,a):d(h)?function(t,e,n,i,a){var f=e+o.width-i;r.drawImage(t,f,n,i,a)}(c,e,i,n,a):r.drawImage(c,e,i,n,a),r.restore(),t.r>0&&function(t,e,n,i,o){r.save(),r.beginPath(),r.moveTo(t+o,e),r.arcTo(t+n,e,t+n,e+o,o),r.arcTo(t+n,e+i,t+n-o,e+i,o),r.arcTo(t,e+i,t,e+i-o,o),r.arcTo(t,e,t+o,e,o),r.closePath(),r.clip()}(e,i,n,a,t.r),m()},b=function(t){var e=t.fontfamily||o.fontFamily,n=f(t.fontSize||o.fontSize),i=t.textAlign||o.textAlign,a=f(t.width)||o.width,c=f(t.height||0),h=t.color||o.color,u=t.lineHeight||o.lineHeight,g=n+"px "+e,y=t.content,b=f(t.x||0),p=f(t.y||0),v=u*n;switch(t.bold&&(g=t.bold+" "+g),i){case"center":b+=a/2||o.width/2;break;case"right":case"end":b+=a||o.width}if(0!==l&&(p+=l),t.maxWidth&&(y=function(t,e){for(var n=t.length,i=0;i<n;i++)if(r.measureText(t.substr(0,i+1)).width>e)return"".concat(t.substr(0,i),"...");return t}(y,t.maxWidth)),p+=v/2,/Android/.test(navigator.userAgent)&&(p+=6),r.beginPath(),r.fillStyle=h,r.font=g,r.textAlign=i,"string"!=typeof y)!function(t,e,n,i,a,c,h,u,g){if(t&&t.length){var m=e,y=n,b=0,p=r.textAlign,v=[],x=0;t.forEach((function(t){var e=t.content,n=(f(t.fontSize)||h)+"px "+(t.fontfamily||u);t.bold&&(n=t.bold+" "+r.font);for(var s=0;s<e.length;s++){var d=r.measureText(e[s]).width;(b+=d)>i&&g&&(y+=a,o.autoHeight&&(l+=a),b=d,x+=1),v[x]||(v[x]=[]),v[x].push({content:e[s],x:m+b-d,y:y,color:t.color||c,font:n})}})),v.forEach((function(t){var e=r.measureText(t.map((function(t){return t.content})).join("")).width;t.forEach((function(t){r.fillStyle=t.color,r.font=t.font;var n=t.x;s(p)&&(n-=e/2),d(p)&&(n-=e),r.textAlign="left",r.fillText(t.content,n,t.y)}))}))}}(y,b,p,a,v,h,n,e,t.autoHeight);else if(t.autoHeight)!function(t,e,n,i,a,f){for(var c=0,h=0,u=t.length,g=0;g<u;g++)(c+=r.measureText(t[g]).width)>i&&(r.fillText(t.substring(h,g),e,n),n+=f,o.autoHeight&&n>=a&&(l+=f),c=r.measureText(t[g]).width,h=g),g===t.length-1&&r.fillText(t.substring(h,g+1),e,n)}(y,b,p,a,p+c,v);else if(t.rotate){r.rotate(Math.PI/180*t.rotate);var x=r.measureText(y).width;t.rotateCenter&&x<75&&(b=b+47-x/2),r.fillText(y,b,p),r.fill(),r.rotate(0)}else r.fillText(y,b,p),r.fill();r.closePath(),m()},p=o.elements;if(p&&p.length){u=p.length;var v=p.map((function(t){if("img"===t.type)return g++,t}));!function(t,e){t.forEach((function(t){if(t){var i=new Image;i.crossOrigin="anonymous",i.src=t.content,i.onload=function(){t.imgObj=this,++h===g&&e&&e()},i.onerror=function(t){return n&&n(t),!1}}}))}(v,(function(){p.forEach((function(t,e){"img"===t.type?(t.imgObj=v[e].imgObj,y(t)):b(t)}))}))}}}));
//# sourceMappingURL=index.js.map
