// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/verify.js":[function(require,module,exports) {
/*! Verify-v0.1.1 MIT License by 大熊*/
;

(function ($, window, document, undefined) {
  //定义Code的构造函数
  var Code = function Code(ele, opt) {
    this.$element = ele, this.defaults = {
      type: 1,
      figure: 100,
      //位数，仅在type=2时生效
      arith: 0,
      //算法，支持加减乘，0为随机，仅在type=2时生效
      width: '200px',
      height: '60px',
      fontSize: '30px',
      codeLength: 6,
      btnId: 'check-btn',
      ready: function ready() {},
      success: function success() {},
      error: function error() {}
    }, this.options = $.extend({}, this.defaults, opt);
  };

  var _code_chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var _code_color1 = ['#fffff0', '#f0ffff', '#f0fff0', '#fff0f0'];
  var _code_color2 = ['#FF0033', '#006699', '#993366', '#FF9900', '#66CC66', '#FF33CC']; //定义Code的方法

  Code.prototype = {
    init: function init() {
      var _this = this;

      this.loadDom();
      this.setCode();
      this.options.ready();

      this.$element[0].onselectstart = document.body.ondrag = function () {
        return false;
      }; //点击验证码


      this.$element.find('.verify-code, .verify-change-code').on('click', function () {
        _this.setCode();
      }); //确定的点击事件

      this.htmlDoms.code_btn.on('click', function () {
        _this.checkCode();
      });
    },
    //加载页面
    loadDom: function loadDom() {
      var panelHtml = '<div class="cerify-code-panel"><div class="verify-code"></div><div class="verify-code-area"><div class="verify-input-area"><input type="text" class="varify-input-code" /></div><div class="verify-change-area"><a class="verify-change-code">换一张</a></div></div></div>';
      this.$element.append(panelHtml);
      this.isEnd = false;
      this.htmlDoms = {
        code_btn: $('#' + this.options.btnId),
        code: this.$element.find('.verify-code'),
        code_area: this.$element.find('.verify-code-area'),
        code_input: this.$element.find('.varify-input-code')
      };
      this.htmlDoms.code.css({
        'width': this.options.width,
        'height': this.options.height,
        'line-height': this.options.height,
        'font-size': this.options.fontSize
      });
      this.htmlDoms.code_area.css({
        'width': this.options.width
      });
    },
    //设置验证码
    setCode: function setCode() {
      if (this.isEnd == false) {
        var color1Num = Math.floor(Math.random() * 3);
        var color2Num = Math.floor(Math.random() * 5);
        this.htmlDoms.code.css({
          'background-color': _code_color1[color1Num],
          'color': _code_color2[color2Num]
        });
        this.htmlDoms.code_input.val('');
        var code = '';
        this.code_chose = '';

        if (this.options.type == 1) {
          //普通验证码
          for (var i = 0; i < this.options.codeLength; i++) {
            var charNum = Math.floor(Math.random() * 52);
            var tmpStyle = charNum % 2 == 0 ? "font-style:italic;margin-right: 10px;" : "font-weight:bolder;";
            tmpStyle += Math.floor(Math.random() * 2) == 1 ? "font-weight:bolder;" : "";
            this.code_chose += _code_chars[charNum];
            code += '<font style="' + tmpStyle + '">' + _code_chars[charNum] + '</font>';
          }
        } else {
          //算法验证码
          var num1 = Math.floor(Math.random() * this.options.figure);
          var num2 = Math.floor(Math.random() * this.options.figure);

          if (this.options.arith == 0) {
            var tmparith = Math.floor(Math.random() * 3);
          }

          switch (tmparith) {
            case 1:
              this.code_chose = parseInt(num1) + parseInt(num2);
              code = num1 + ' + ' + num2 + ' = ?';
              break;

            case 2:
              if (parseInt(num1) < parseInt(num2)) {
                var tmpnum = num1;
                num1 = num2;
                num2 = tmpnum;
              }

              this.code_chose = parseInt(num1) - parseInt(num2);
              code = num1 + ' - ' + num2 + ' = ?';
              break;

            default:
              this.code_chose = parseInt(num1) * parseInt(num2);
              code = num1 + ' × ' + num2 + ' = ?';
              break;
          }
        }

        this.htmlDoms.code.html(code);
      }
    },
    //比对验证码
    checkCode: function checkCode() {
      if (this.options.type == 1) {
        //普通验证码
        var own_input = this.htmlDoms.code_input.val().toUpperCase();
        this.code_chose = this.code_chose.toUpperCase();
      } else {
        var own_input = this.htmlDoms.code_input.val();
      }

      if (own_input == this.code_chose) {
        this.isEnd = true;
        this.options.success(this);
      } else {
        this.options.error(this);
        this.setCode();
      }
    },
    //刷新
    refresh: function refresh() {
      this.isEnd = false;
      this.$element.find('.verify-code').click();
    }
  }; //定义Slide的构造函数

  var Slide = function Slide(ele, opt) {
    this.$element = ele, this.defaults = {
      type: 1,
      mode: 'fixed',
      //弹出式pop，固定fixed
      vOffset: 5,
      vSpace: 5,
      explain: 'Swipe right for validation！',
      imgUrl: 'images/',
      imgName: ['1.jpg', '2.jpg'],
      imgSize: {
        width: '400px',
        height: '200px'
      },
      blockSize: {
        width: '50px',
        height: '50px'
      },
      circleRadius: '10px',
      barSize: {
        width: '400px',
        height: '40px'
      },
      ready: function ready() {},
      success: function success() {},
      error: function error() {}
    }, this.options = $.extend({}, this.defaults, opt);
  }; //定义Slide的方法


  Slide.prototype = {
    init: function init() {
      var _this = this; //加载页面


      this.loadDom();

      _this.refresh();

      this.options.ready();

      this.$element[0].onselectstart = document.body.ondrag = function () {
        return false;
      };

      if (this.options.mode == 'pop') {
        this.$element.on('mouseover', function (e) {
          _this.showImg();
        });
        this.$element.on('mouseout', function (e) {
          _this.hideImg();
        });
        this.htmlDoms.out_panel.on('mouseover', function (e) {
          _this.showImg();
        });
        this.htmlDoms.out_panel.on('mouseout', function (e) {
          _this.hideImg();
        });
      } //按下


      this.htmlDoms.move_block.on('touchstart', function (e) {
        _this.start(e);
      });
      this.htmlDoms.move_block.on('mousedown', function (e) {
        _this.start(e);
      }); //拖动

      window.addEventListener("touchmove", function (e) {
        _this.move(e);
      });
      window.addEventListener("mousemove", function (e) {
        _this.move(e);
      }); //鼠标松开

      window.addEventListener("touchend", function () {
        _this.end();
      });
      window.addEventListener("mouseup", function () {
        _this.end();
      }); //刷新

      _this.$element.find('.verify-refresh').on('click', function () {
        _this.refresh();
      });
    },
    //初始化加载
    loadDom: function loadDom() {
      this.img_rand = Math.floor(Math.random() * this.options.imgName.length); //随机的背景图片

      this.status = false; //鼠标状态

      this.isEnd = false; //是够验证完成

      this.setSize = this.resetSize(this); //重新设置宽度高度

      this.plusWidth = 0;
      this.plusHeight = 0;
      this.x = 0;
      this.y = 0;
      var panelHtml = '';
      var tmpHtml = '';
      this.lengthPercent = (parseInt(this.setSize.img_width) - parseInt(this.setSize.block_width) - parseInt(this.setSize.circle_radius) - parseInt(this.setSize.circle_radius) * 0.8) / (parseInt(this.setSize.img_width) - parseInt(this.setSize.bar_height));

      if (this.options.type != 1) {
        //图片滑动
        panelHtml += '<div class="verify-img-out"><div class="verify-img-panel"><div class="verify-refresh" style="z-index:3"><i class="iconfont icon-refresh"></i></div><canvas  class="verify-img-canvas" width="' + this.setSize.img_width + '" height="' + this.setSize.img_height + '"></canvas></div></div>';
        this.plusWidth = parseInt(this.setSize.block_width) + parseInt(this.setSize.circle_radius) * 2 - parseInt(this.setSize.circle_radius) * 0.2;
        this.plusHeight = parseInt(this.setSize.block_height) + parseInt(this.setSize.circle_radius) * 2 - parseInt(this.setSize.circle_radius) * 0.2;
        tmpHtml = '<canvas class="verify-sub-block"  width="' + this.plusWidth + '" height="' + this.plusHeight + '" style="left:0; position:absolute;" ></canvas>';
      }

      panelHtml += tmpHtml + '<div class="verify-bar-area"><span  class="verify-msg">' + this.options.explain + '</span><div class="verify-left-bar"><span  class="verify-msg"></span><div  class="verify-move-block"><i  class="verify-icon iconfont icon-right"></i></div></div></div>';
      this.$element.append(panelHtml);
      this.htmlDoms = {
        sub_block: this.$element.find('.verify-sub-block'),
        out_panel: this.$element.find('.verify-img-out'),
        img_panel: this.$element.find('.verify-img-panel'),
        img_canvas: this.$element.find('.verify-img-canvas'),
        bar_area: this.$element.find('.verify-bar-area'),
        move_block: this.$element.find('.verify-move-block'),
        left_bar: this.$element.find('.verify-left-bar'),
        msg: this.$element.find('.verify-msg'),
        icon: this.$element.find('.verify-icon'),
        refresh: this.$element.find('.verify-refresh')
      };
      this.$element.css('position', 'relative');

      if (this.options.mode == 'pop') {
        this.htmlDoms.out_panel.css({
          'display': 'none',
          'position': 'absolute',
          'bottom': '42px'
        });
        this.htmlDoms.sub_block.css({
          'display': 'none'
        });
      } else {
        this.htmlDoms.out_panel.css({
          'position': 'relative'
        });
      }

      this.htmlDoms.out_panel.css('height', parseInt(this.setSize.img_height) + this.options.vSpace + 'px');
      this.htmlDoms.img_panel.css({
        'width': this.setSize.img_width,
        'height': this.setSize.img_height
      });
      this.htmlDoms.bar_area.css({
        'width': this.setSize.bar_width,
        'height': this.setSize.bar_height,
        'line-height': this.setSize.bar_height
      });
      this.htmlDoms.move_block.css({
        'width': this.setSize.bar_height,
        'height': this.setSize.bar_height
      });
      this.htmlDoms.left_bar.css({
        'width': this.setSize.bar_height,
        'height': this.setSize.bar_height
      });
      this.randSet();
    },
    drawImg: function drawImg(obj, img) {
      var canvas = this.htmlDoms.img_canvas[0];

      if (canvas) {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, parseInt(this.setSize.img_width), parseInt(this.setSize.img_height));
        graphParameter = {
          x: this.x,
          y: this.y,
          r: parseInt(this.setSize.circle_radius),
          w: (parseInt(this.setSize.block_width) - 2 * parseInt(this.setSize.circle_radius)) / 2,
          h: (parseInt(this.setSize.block_height) - 2 * parseInt(this.setSize.circle_radius)) / 2
        };
        obj.drawRule(ctx, graphParameter);
      }

      var canvas2 = this.htmlDoms.sub_block[0];

      if (canvas2) {
        var proportionX = img.width / parseInt(this.setSize.img_width);
        var proportionY = img.height / parseInt(this.setSize.img_height);
        var ctx2 = canvas2.getContext("2d");
        ctx2.restore();
        ctx2.drawImage(img, this.x * proportionX, (this.y - parseInt(this.setSize.circle_radius) - parseInt(this.setSize.circle_radius) * 0.8) * proportionY, this.plusWidth * proportionX, this.plusHeight * proportionY, 0, 0, this.plusWidth, this.plusHeight);
        ctx2.save();
        ctx2.globalCompositeOperation = "destination-atop";
        graphParameter.x = 0;
        graphParameter.y = parseInt(this.setSize.circle_radius) + parseInt(this.setSize.circle_radius) * 0.8;
        obj.drawRule(ctx2, graphParameter);
      }
    },
    drawRule: function drawRule(ctx, graphParameter) {
      var x = graphParameter.x;
      var y = graphParameter.y;
      var r = graphParameter.r;
      var w = graphParameter.w;
      var h = graphParameter.h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w + r * 0.4, y);
      ctx.arc(x + w + r, y - r * 0.8, r, 0.7 * Math.PI, 0.3 * Math.PI);
      ctx.lineTo(x + 2 * w + 2 * r, y);
      ctx.lineTo(x + 2 * w + 2 * r, y + h);
      ctx.arc(x + 2 * w + 2 * r + r * 0.8, y + h + r, r, 1.2 * Math.PI, 0.8 * Math.PI);
      ctx.lineTo(x + 2 * w + 2 * r, y + 2 * h + 2 * r);
      ctx.lineTo(x, y + 2 * h + 2 * r);
      ctx.lineTo(x, y + h + 2 * r - r * 0.4);
      ctx.arc(x + r * 0.8, y + h + r, r, 0.8 * Math.PI, 1.2 * Math.PI, true);
      ctx.lineTo(x, y);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    },
    //鼠标按下
    start: function start(e) {
      if (this.isEnd == false) {
        this.htmlDoms.msg.text('');
        this.htmlDoms.move_block.css('background-color', '#337ab7');
        this.htmlDoms.left_bar.css('border-color', '#337AB7');
        this.htmlDoms.icon.css('color', '#fff');
        e.stopPropagation();
        this.status = true;
      }
    },
    //鼠标移动
    move: function move(e) {
      if (this.status && this.isEnd == false) {
        if (this.options.mode == 'pop') {
          this.showImg();
        }

        if (!e.touches) {
          //兼容移动端
          var x = e.clientX;
        } else {
          //兼容PC端
          var x = e.touches[0].pageX;
        }

        var bar_area_left = Slide.prototype.getLeft(this.htmlDoms.bar_area[0]);
        var move_block_left = x - bar_area_left; //小方块相对于父元素的left值

        if (this.options.type != 1) {
          //图片滑动
          if (move_block_left >= this.htmlDoms.bar_area[0].offsetWidth - parseInt(this.setSize.bar_height) + parseInt(parseInt(this.setSize.block_width) / 2) - 2) {
            move_block_left = this.htmlDoms.bar_area[0].offsetWidth - parseInt(this.setSize.bar_height) + parseInt(parseInt(this.setSize.block_width) / 2) - 2;
          }
        } else {
          //普通滑动
          if (move_block_left >= this.htmlDoms.bar_area[0].offsetWidth - parseInt(parseInt(this.setSize.bar_height) / 2) + 3) {
            this.$element.find('.verify-msg:eq(1)').text('Loosen the validation');
            move_block_left = this.htmlDoms.bar_area[0].offsetWidth - parseInt(parseInt(this.setSize.bar_height) / 2) + 3;
          } else {
            this.$element.find('.verify-msg:eq(1)').text('');
          }
        }

        if (move_block_left <= parseInt(parseInt(this.setSize.block_width) / 2)) {
          move_block_left = parseInt(parseInt(this.setSize.block_width) / 2);
        } //拖动后小方块的left值


        this.htmlDoms.move_block.css('left', move_block_left - parseInt(parseInt(this.setSize.block_width) / 2) + "px");
        this.htmlDoms.left_bar.css('width', move_block_left - parseInt(parseInt(this.setSize.block_width) / 2) + "px");
        this.htmlDoms.sub_block.css('left', (move_block_left - parseInt(parseInt(this.setSize.block_width) / 2)) * this.lengthPercent + "px");
      }
    },
    //鼠标松开
    end: function end() {
      var _this = this; //判断是否重合


      if (this.status && this.isEnd == false) {
        if (this.options.type != 1) {
          //图片滑动
          var vOffset = parseInt(this.options.vOffset);

          if (parseInt(this.x) >= parseInt(this.htmlDoms.sub_block.css('left')) - vOffset && parseInt(this.x) <= parseInt(this.htmlDoms.sub_block.css('left')) + vOffset) {
            this.htmlDoms.move_block.css('background-color', '#5cb85c');
            this.htmlDoms.left_bar.css({
              'border-color': '#5cb85c',
              'background-color': '#fff'
            });
            this.htmlDoms.icon.css('color', '#fff');
            this.htmlDoms.icon.removeClass('icon-right');
            this.htmlDoms.icon.addClass('icon-check');
            this.htmlDoms.refresh.hide();
            this.isEnd = true;
            this.options.success(this);
          } else {
            this.htmlDoms.move_block.css('background-color', '#d9534f');
            this.htmlDoms.left_bar.css('border-color', '#d9534f');
            this.htmlDoms.icon.css('color', '#fff');
            this.htmlDoms.icon.removeClass('icon-right');
            this.htmlDoms.icon.addClass('icon-close');
            setTimeout(function () {
              _this.refresh();
            }, 400);
            this.options.error(this);
          }
        } else {
          //普通滑动
          if (parseInt(this.htmlDoms.move_block.css('left')) >= parseInt(this.setSize.bar_width) - parseInt(this.setSize.bar_height) - parseInt(this.options.vOffset)) {
            this.htmlDoms.move_block.css('background-color', '#5cb85c');
            this.htmlDoms.left_bar.css({
              'color': '#4cae4c',
              'border-color': '#5cb85c',
              'background-color': '#fff'
            });
            this.htmlDoms.icon.css('color', '#fff');
            this.htmlDoms.icon.removeClass('icon-right');
            this.htmlDoms.icon.addClass('icon-check');
            this.htmlDoms.refresh.hide();
            this.$element.find('.verify-msg:eq(1)').text('Authentication is successful！');
            this.isEnd = true;
            this.options.success(this);
          } else {
            this.$element.find('.verify-msg:eq(1)').text('');
            this.htmlDoms.move_block.css('background-color', '#d9534f');
            this.htmlDoms.left_bar.css('border-color', '#d9534f');
            this.htmlDoms.icon.css('color', '#fff');
            this.htmlDoms.icon.removeClass('icon-right');
            this.htmlDoms.icon.addClass('icon-close');
            this.isEnd = true;
            setTimeout(function () {
              _this.$element.find('.verify-msg:eq(1)').text('');

              _this.refresh();

              _this.isEnd = false;
            }, 400);
            this.options.error(this);
          }
        }

        this.status = false;
      }
    },
    //弹出式
    showImg: function showImg() {
      this.htmlDoms.out_panel.css({
        'display': 'block'
      });
      this.htmlDoms.sub_block.css({
        'display': 'block'
      });
    },
    //固定式
    hideImg: function hideImg() {
      this.htmlDoms.out_panel.css({
        'display': 'none'
      });
      this.htmlDoms.sub_block.css({
        'display': 'none'
      });
    },
    resetSize: function resetSize(obj) {
      var img_width, img_height, bar_width, bar_height, block_width, block_height, circle_radius; //图片的宽度、高度，移动条的宽度、高度

      var parentWidth = obj.$element.parent().width() || $(window).width();
      var parentHeight = obj.$element.parent().height() || $(window).height();

      if (obj.options.imgSize.width.indexOf('%') != -1) {
        img_width = parseInt(obj.options.imgSize.width) / 100 * parentWidth + 'px';
      } else {
        img_width = obj.options.imgSize.width;
      }

      if (obj.options.imgSize.height.indexOf('%') != -1) {
        img_height = parseInt(obj.options.imgSize.height) / 100 * parentHeight + 'px';
      } else {
        img_height = obj.options.imgSize.height;
      }

      if (obj.options.barSize.width.indexOf('%') != -1) {
        bar_width = parseInt(obj.options.barSize.width) / 100 * parentWidth + 'px';
      } else {
        bar_width = obj.options.barSize.width;
      }

      if (obj.options.barSize.height.indexOf('%') != -1) {
        bar_height = parseInt(obj.options.barSize.height) / 100 * parentHeight + 'px';
      } else {
        bar_height = obj.options.barSize.height;
      }

      if (obj.options.blockSize) {
        if (obj.options.blockSize.width.indexOf('%') != -1) {
          block_width = parseInt(obj.options.blockSize.width) / 100 * parentWidth + 'px';
        } else {
          block_width = obj.options.blockSize.width;
        }

        if (obj.options.blockSize.height.indexOf('%') != -1) {
          block_height = parseInt(obj.options.blockSize.height) / 100 * parentHeight + 'px';
        } else {
          block_height = obj.options.blockSize.height;
        }
      }

      if (obj.options.circleRadius) {
        if (obj.options.circleRadius.indexOf('%') != -1) {
          circle_radius = parseInt(obj.options.circleRadius) / 100 * parentHeight + 'px';
        } else {
          circle_radius = obj.options.circleRadius;
        }
      }

      return {
        img_width: img_width,
        img_height: img_height,
        bar_width: bar_width,
        bar_height: bar_height,
        block_width: block_width,
        block_height: block_height,
        circle_radius: circle_radius
      };
    },
    //随机出生点位
    randSet: function randSet() {
      var rand1 = Math.floor(Math.random() * 9 + 1);
      var rand2 = Math.floor(Math.random() * 9 + 1);
      var top = rand1 * parseInt(this.setSize.img_height) / 15 + parseInt(this.setSize.img_height) * 0.1;
      var left = rand2 * parseInt(this.setSize.img_width) / 15 + parseInt(this.setSize.img_width) * 0.1;
      this.x = left;
      this.y = top;

      if (this.options.mode == 'pop') {
        this.htmlDoms.sub_block.css({
          'top': '-' + (parseInt(this.setSize.img_height) + this.options.vSpace + parseInt(this.setSize.circle_radius) + parseInt(this.setSize.circle_radius) * 0.8 - this.y - 2) + 'px'
        });
      } else {
        this.htmlDoms.sub_block.css({
          'top': this.y - (parseInt(this.setSize.circle_radius) + parseInt(this.setSize.circle_radius) * 0.8) + 2 + 'px'
        });
      }
    },
    //刷新
    refresh: function refresh() {
      var _this = this;

      this.htmlDoms.refresh.show();
      this.$element.find('.verify-msg:eq(1)').text('');
      this.$element.find('.verify-msg:eq(1)').css('color', '#000');
      this.htmlDoms.move_block.animate({
        'left': '0px'
      }, 'fast');
      this.htmlDoms.left_bar.animate({
        'width': parseInt(this.setSize.bar_height)
      }, 'fast');
      this.htmlDoms.left_bar.css({
        'border-color': '#ddd'
      });
      this.htmlDoms.move_block.css('background-color', '#fff');
      this.htmlDoms.icon.css('color', '#000');
      this.htmlDoms.icon.removeClass('icon-close');
      this.htmlDoms.icon.addClass('icon-right');
      this.$element.find('.verify-msg:eq(0)').text(this.options.explain);
      this.randSet();
      this.img_rand = Math.floor(Math.random() * this.options.imgName.length); //随机的背景图片

      var img = new Image();
      img.src = this.options.imgUrl + this.options.imgName[this.img_rand]; // 加载完成开始绘制

      $(img).on('load', function (e) {
        _this.drawImg(_this, this);
      });
      this.isEnd = false;
      this.htmlDoms.sub_block.css('left', "0px");
    },
    //获取left值
    getLeft: function getLeft(node) {
      var left = $(node).offset().left; //            var left = 0;
      //            var nowPos = node.offsetParent;
      //
      //            while(nowPos != null) {
      //              left += $(nowPos).offset().left;
      //              nowPos = nowPos.offsetParent;
      //            }

      return left;
    }
  }; //定义Points的构造函数

  var Points = function Points(ele, opt) {
    this.$element = ele, this.defaults = {
      mode: 'fixed',
      //弹出式pop，固定fixed
      defaultNum: 4,
      //默认的文字数量
      checkNum: 3,
      //校对的文字数量
      vSpace: 5,
      //间隔
      imgUrl: 'images/',
      imgName: ['1.jpg', '2.jpg'],
      imgSize: {
        width: '400px',
        height: '200px'
      },
      barSize: {
        width: '400px',
        height: '40px'
      },
      ready: function ready() {},
      success: function success() {},
      error: function error() {}
    }, this.options = $.extend({}, this.defaults, opt);
  }; //定义Points的方法


  Points.prototype = {
    init: function init() {
      var _this = this; //加载页面


      _this.loadDom();

      _this.refresh();

      _this.options.ready();

      this.$element[0].onselectstart = document.body.ondrag = function () {
        return false;
      };

      if (this.options.mode == 'pop') {
        this.$element.on('mouseover', function (e) {
          _this.showImg();
        });
        this.$element.on('mouseout', function (e) {
          _this.hideImg();
        });
        this.htmlDoms.out_panel.on('mouseover', function (e) {
          _this.showImg();
        });
        this.htmlDoms.out_panel.on('mouseout', function (e) {
          _this.hideImg();
        });
      } //点击事件比对


      _this.$element.find('.verify-img-panel canvas').on('click', function (e) {
        _this.checkPosArr.push(_this.getMousePos(this, e));

        if (_this.num == _this.options.checkNum) {
          _this.num = _this.createPoint(_this.getMousePos(this, e));
          setTimeout(function () {
            var flag = _this.comparePos(_this.fontPos, _this.checkPosArr);

            if (flag == false) {
              //验证失败
              _this.options.error(_this);

              _this.$element.find('.verify-bar-area').css({
                'color': '#d9534f',
                'border-color': '#d9534f'
              });

              _this.$element.find('.verify-msg').text('验证失败');

              setTimeout(function () {
                _this.$element.find('.verify-bar-area').css({
                  'color': '#000',
                  'border-color': '#ddd'
                });

                _this.refresh();
              }, 400);
            } else {
              //验证成功
              _this.$element.find('.verify-bar-area').css({
                'color': '#4cae4c',
                'border-color': '#5cb85c'
              });

              _this.$element.find('.verify-msg').text('验证成功');

              _this.$element.find('.verify-refresh').hide();

              _this.$element.find('.verify-img-panel').unbind('click');

              _this.options.success(_this);
            }
          }, 400);
        }

        if (_this.num < _this.options.checkNum) {
          _this.num = _this.createPoint(_this.getMousePos(this, e));
        }
      }); //刷新


      _this.$element.find('.verify-refresh').on('click', function () {
        _this.refresh();
      });
    },
    //加载页面
    loadDom: function loadDom() {
      this.fontPos = []; //选中的坐标信息

      this.checkPosArr = []; //用户点击的坐标

      this.num = 1; //点击的记数

      this.img_rand = Math.floor(Math.random() * this.options.imgName.length); //随机的背景图片

      var panelHtml = '';
      var tmpHtml = '';
      this.setSize = Slide.prototype.resetSize(this); //重新设置宽度高度

      panelHtml += '<div class="verify-img-out"><div class="verify-img-panel"><div class="verify-refresh" style="z-index:3"><i class="iconfont icon-refresh"></i></div><canvas width="' + this.setSize.img_width + '" height="' + this.setSize.img_height + '"></canvas></div></div><div class="verify-bar-area"><span  class="verify-msg"></span></div>';
      this.$element.append(panelHtml);
      this.htmlDoms = {
        out_panel: this.$element.find('.verify-img-out'),
        img_panel: this.$element.find('.verify-img-panel'),
        bar_area: this.$element.find('.verify-bar-area'),
        msg: this.$element.find('.verify-msg')
      };
      this.$element.css('position', 'relative');

      if (this.options.mode == 'pop') {
        this.htmlDoms.out_panel.css({
          'display': 'none',
          'position': 'absolute',
          'bottom': '42px'
        });
      } else {
        this.htmlDoms.out_panel.css({
          'position': 'relative'
        });
      }

      this.htmlDoms.out_panel.css('height', parseInt(this.setSize.img_height) + this.options.vSpace + 'px');
      this.htmlDoms.img_panel.css({
        'width': this.setSize.img_width,
        'height': this.setSize.img_height,
        'background-size': this.setSize.img_width + ' ' + this.setSize.img_height,
        'margin-bottom': this.options.vSpace + 'px'
      });
      this.htmlDoms.bar_area.css({
        'width': this.options.barSize.width,
        'height': this.setSize.bar_height,
        'line-height': this.setSize.bar_height
      });
    },
    //绘制合成的图片
    drawImg: function drawImg(obj, img) {
      //准备canvas环境 
      var canvas = this.$element.find('canvas')[0]; //var canvas=document.getElementById("myCanvas");

      var ctx = canvas.getContext("2d"); // 绘制图片

      ctx.drawImage(img, 0, 0, parseInt(this.setSize.img_width), parseInt(this.setSize.img_height)); // 绘制水印

      var fontSizeArr = ['italic small-caps bold 20px microsoft yahei', 'small-caps normal 25px arial', '34px microsoft yahei'];
      var fontStr = '天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔龙师火帝鸟官人皇始制文字乃服衣裳推位让国有虞陶唐吊民伐罪周发殷汤坐朝问道垂拱平章爱育黎首臣伏戎羌遐迩体率宾归王'; //不重复的汉字

      var fontChars = [];
      var avg = Math.floor(parseInt(this.setSize.img_width) / (parseInt(this.options.defaultNum) + 1));
      var tmp_index = '';
      var color2Num = Math.floor(Math.random() * 5);

      for (var i = 1; i <= this.options.defaultNum; i++) {
        fontChars[i - 1] = this.getChars(fontStr, fontChars);
        tmp_index = Math.floor(Math.random() * 3);
        ctx.font = fontSizeArr[tmp_index];
        ctx.fillStyle = _code_color2[color2Num];

        if (Math.floor(Math.random() * 2) == 1) {
          var tmp_y = Math.floor(parseInt(this.setSize.img_height) / 2) + tmp_index * 20 + 20;
        } else {
          var tmp_y = Math.floor(parseInt(this.setSize.img_height) / 2) - tmp_index * 20;
        }

        ctx.fillText(fontChars[i - 1], avg * i, tmp_y);
        this.fontPos[i - 1] = {
          'char': fontChars[i - 1],
          'x': avg * i,
          'y': tmp_y
        };
      }

      for (var i = 0; i < this.options.defaultNum - this.options.checkNum; i++) {
        this.shuffle(this.fontPos).pop();
      }

      var msgStr = '';

      for (var i = 0; i < this.fontPos.length; i++) {
        msgStr += this.fontPos[i].char + ',';
      }

      this.htmlDoms.msg.text('请顺序点击【' + msgStr.substring(0, msgStr.length - 1) + '】');
      return this.fontPos;
    },
    //获取坐标
    getMousePos: function getMousePos(obj, event) {
      var e = event || window.event;
      var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      var x = e.clientX - ($(obj).offset().left - $(window).scrollLeft());
      var y = e.clientY - ($(obj).offset().top - $(window).scrollTop());
      return {
        'x': x,
        'y': y
      };
    },
    //递归去重
    getChars: function getChars(fontStr, fontChars) {
      var tmp_rand = parseInt(Math.floor(Math.random() * fontStr.length));

      if (tmp_rand > 0) {
        tmp_rand = tmp_rand - 1;
      }

      tmp_char = fontStr.charAt(tmp_rand);

      if ($.inArray(tmp_char, fontChars) == -1) {
        return tmp_char;
      } else {
        return Points.prototype.getChars(fontStr, fontChars);
      }
    },
    //洗牌数组
    shuffle: function shuffle(arr) {
      var m = arr.length,
          i;
      var tmpF;

      while (m) {
        i = Math.random() * m-- >>> 0;
        tmpF = arr[m];
        arr[m] = arr[i];
        arr[i] = tmpF; //[arr[m], arr[i]] = [arr[i], arr[m]];	//低版本浏览器不支持此写法
      }

      return arr;
    },
    //创建坐标点
    createPoint: function createPoint(pos) {
      this.htmlDoms.img_panel.append('<div class="point-area" style="background-color:#1abd6c;color:#fff;z-index:9999;width:30px;height:30px;text-align:center;line-height:30px;border-radius: 50%;position:absolute;top:' + parseInt(pos.y - 10) + 'px;left:' + parseInt(pos.x - 10) + 'px;">' + this.num + '</div>');
      return ++this.num;
    },
    //比对坐标点
    comparePos: function comparePos(fontPos, checkPosArr) {
      var flag = true;

      for (var i = 0; i < fontPos.length; i++) {
        if (!(parseInt(checkPosArr[i].x) + 40 > fontPos[i].x && parseInt(checkPosArr[i].x) - 40 < fontPos[i].x && parseInt(checkPosArr[i].y) + 40 > fontPos[i].y && parseInt(checkPosArr[i].y) - 40 < fontPos[i].y)) {
          flag = false;
          break;
        }
      }

      return flag;
    },
    //弹出式
    showImg: function showImg() {
      this.htmlDoms.out_panel.css({
        'display': 'block'
      });
    },
    //固定式
    hideImg: function hideImg() {
      this.htmlDoms.out_panel.css({
        'display': 'none'
      });
    },
    //刷新
    refresh: function refresh() {
      var _this = this;

      this.$element.find('.point-area').remove();
      this.fontPos = [];
      this.checkPosArr = [];
      this.num = 1;
      this.img_rand = Math.floor(Math.random() * this.options.imgName.length); //随机的背景图片

      var img = new Image();
      img.src = this.options.imgUrl + this.options.imgName[this.img_rand]; // 加载完成开始绘制

      $(img).on('load', function (e) {
        this.fontPos = _this.drawImg(_this, this);
      });

      _this.$element.find('.verify-bar-area').css({
        'color': '#000',
        'border-color': '#ddd'
      });

      _this.$element.find('.verify-msg').text('验证失败');

      _this.$element.find('.verify-refresh').show();
    }
  }; //在插件中使用codeVerify对象

  $.fn.codeVerify = function (options, callbacks) {
    var code = new Code(this, options);
    code.init();
  }; //在插件中使用slideVerify对象


  $.fn.slideVerify = function (options, callbacks) {
    var slide = new Slide(this, options);
    slide.init();
  }; //在插件中使用clickVerify对象


  $.fn.pointsVerify = function (options, callbacks) {
    var points = new Points(this, options);
    points.init();
  };
})(jQuery, window, document);
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63402" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/verify.js"], null)
//# sourceMappingURL=/verify.993bc73f.map