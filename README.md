# apopup

####Fast and flexible popup component use jquery (min.js ~2k)

### Usage

#####apopup
```
$('.popup').apopup(function(){
      options
},callback);
```

#####atip
```
$.atip('提示文字',{options},callback);
```

###Options

amsl:垂直居中后距离中线的距离(default:0)

appending:是否插入弹窗(default:true)

appendTo:插入节点(default:'body')

className:class名称(default:'apopup')

autoClose:是否自动关闭(default:false)

closeClass: 关闭节点class(default:'p-close')

escClose: 是否支持esc键关闭(default:true)

mask:是否有遮罩层(default:true)

maskClose:是否点击遮罩层关闭(default:true)

maskColor:遮罩层颜色(default:'#000')

opacity:遮罩层透明度(default:0.7)

position: 弹窗位置x,y(default:['auto', 'auto'])

positionStyle:弹窗定位模式(default:'fixed')

zIndex:9997

onClose:关闭后回调函数 type:function

onOpen:打开前回调函数 type:function

onComplete:打开后回调函数 type:function
