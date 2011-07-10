(function(win, doc) {
  "use strict";
  var Draggable = function () {
    this.init.apply(this, arguments);
  };
  Draggable.prototype = {
      target: null, container: null,
      deltaTop: 0, deltaBottom: 0,
      deltaLeft: 0, deltaRight: 0,
      deltaX: 0, deltaY: 0,
      moveTime: 0, mag: 100,
      accX: 0, accY: 0,
      oldX: 0, oldY: 0,
      cnt: 0, mode: null,
      init: function (target, opt) {
        var self = this;
        opt = opt || {};

        this.target = $(target).css({
            'position': 'absolute'
        });
        this.container = this.target.parent();
        if( this.target[0].offsetParent !== this.container[0] ) {
          this.container.css('position', 'relative');
        }

        //bind event to drag target.
        $(this.target).bind(Draggable.event.START, function (e) { self._dragStart(e); return false; });
        $(document).bind(Draggable.event.MOVE, function (e) { self._dragging(e); });
        $(document).bind(Draggable.event.END, function (e) { self._dragEnd(e); });

        this.deltaLeft = opt.deltaLeft || this.deltaLeft;
        this.deltaRight = opt.deltaRight || this.deltaRight;
        this.deltaTop = opt.deltaTop || this.deltaTop;
        this.deltaBottom = opt.deltaBottom || this.deltaBottom;
      },
      _dragStart: function (e) {
          clearInterval(this.endInterval);
          var self = this,
              container = self.container,
              target = self.target,
              pageX = this.getPage(e, 'pageX'),
              pageY = this.getPage(e, 'pageY'),
              m = this.getCurrentTranslate(target),
              m2 = this.getCurrentTranslate(container, false, 'view');
          this.setTranslate(m.left, m.top, true);
          this.deltaX = pageX - m.left;
          this.deltaY = pageY - m.top;
          this.accX = this.accY = 0;

          this.dragState = true;

          return false;
      },
      _dragging: function (e) {
          if (this.dragState) {
              var target = this.target;
              var pageX = this.getPage(e, 'pageX'),
                  pageY = this.getPage(e, 'pageY'),
                  x = pageX - this.deltaX,
                  y = pageY - this.deltaY,
                  now = (new Date).getTime();
              this.setTranslate(x, y, true);
              this.accX = (pageX - this.oldX) / (now - this.moveTime);
              this.accY = (pageY - this.oldY) / (now - this.moveTime);
              this.oldX = pageX;
              this.oldY = pageY;
              this.moveTime = (new Date).getTime();
              return false;
          }
      },
      _dragEnd: function (e) {
          if (this.dragState) {
              this.dragState = false;
              var self = this,
                  target = self.target,
                  css = target[0].style,
                  m = self.getCurrentTranslate(target),
                  now = (new Date).getTime(),
                  left, top;
              if (Draggable.support.transform3d || Draggable.support.transform2d) {
                  left = m.left + (self.accX * self.mag);
                  top = m.top + (self.accY * self.mag);
                  if (css.webkitTransitionProperty) {
                      css.webkitTransitionProperty = Draggable.ts.prop;
                      css.webkitTransitionTimingFunction = Draggable.ts.timing;
                      css.webkitTransitionDuration = Draggable.ts.time;
                      css.webkitTransform = self.getTranslate(left, top);
                  }
                  else if (css.MozTransitionProperty) {
                      css.MozTransitionProperty = Draggable.ts.prop;
                      css.MozTransitionTimingFunction = Draggable.ts.timing;
                      css.MozTransitionDuration = Draggable.ts.time;
                      css.MozTransform = self.getTranslate(left, top);
                  }
                  this.goalLeft = left;
                  this.goalTop = top;
                  self.target.bind('webkitTransitionEnd transitionEnd', function () {
                      self.endTransition();
                  });
                  self.endInterval = setInterval(function () {
                      self.checkTransition();
                  }, 1000 / 30);
              }
              else {
                  left = m.left;
                  top = m.top;
                  this.setTranslate(left, top, true);
                  self.endInterval = setInterval(function () {
                      self.checkTransition();
                  }, 1000 / 30);
              }
          }
      },
      getPage: function (e, type) {
          var evt = e.originalEvent || e;
          if (evt.targetTouches) {
              return evt.targetTouches[0][type];
          }
          else {
              if (evt[type]) {
                  return evt[type];
              }
              else {
                  if (/X$/.test(type)) {
                      return evt.clientX;
                  }
                  else if (/Y$/.test(type)) {
                      return evt.clientY;
                  }
              }
          }
      },
      endTransition: function () {
          this.mode = null;
          clearInterval(this.endInterval);
      },
      setTranslate: function (x, y, just) {
          var css = this.target[0].style;
          if (Draggable.support.transform3d) {
              css.webkitTransform = this.getTranslate(x, y);
              if (just) {
                  css.webkitTransitionProperty = 'none';
                  css.webkitTransitionDuration = '0';
              }
          }
          else if (Draggable.support.transform2d()) {
              css.MozTransform = this.getTranslate(x, y);
              if (just) {
                  css.MozTransitionProperty = 'none';
                  css.MozTransitionDuration = '0';
              }
          }
          else {
              this.target.css({
                  left: x,
                  top: y
              });
          }
      },
      setTranslateX: function (x, just) {
          this.setTranslate(x, this.goalTop, just);
          this.goalLeft = x;
      },
      setTranslateY: function (y, just) {
          this.setTranslate(this.goalLeft, y, just);
          this.goalTop = y;
      },
      checkTransition: function () {
        this.cnt++;
        if (this.cnt > 10) {
            this.cnt = 0;
            this.endTransition();
            return;
        }
        if (this.mode === 'reverce') {
            return;
        }

        var self = this,
            target = self.target,
            css = target.style,
            
            container = self.container,
            conRect = this.getCurrentTranslate(container),
            
            conCenter = {
                x: conRect.width  >> 1,
                y: conRect.height >> 1
            };
            
            var targetRect = this.getCurrentTranslate(target, true),
                targetCenter = {
                    x: targetRect.width  / 2 + targetRect.left,
                    y: targetRect.height / 2 + targetRect.top
                },
                top    = targetRect.top - conRect.top,
                right  = targetRect.right - conRect.right,
                bottom = targetRect.bottom - conRect.bottom,
                left   = targetRect.left - conRect.left,
                
                moveV = (top  > 0 || bottom < 0) && !(top > 0 && bottom < 0),
                moveH = (left > 0 || right  < 0) && !(left > 0 && right < 0);

            if (moveH) {
                if (targetRect.width > conRect.width) {
                    if (targetCenter.x > conCenter.x) {
                        this.setTranslateX(0);
                    }
                    else if (targetCenter.x < conCenter.x) {
                        var x = conRect.width - targetRect.width;
                        this.setTranslateX(x);
                    }
                }
                else {
                    if (targetCenter.x > conCenter.x) {
                        var x = conRect.width - targetRect.width;
                        this.setTranslateX(x);
                    }
                    else if (targetCenter.x < conCenter.x) {
                        this.setTranslateX(0);
                    }
                }
            }
            
            if (moveV) {
                if (targetRect.height > conRect.height) {
                    if (targetCenter.y > conCenter.y) {
                        this.setTranslateY(0);
                    }
                    else if (targetCenter.y < conCenter.y) {
                        var y = conRect.height - targetRect.height;
                        this.setTranslateY(y);
                    }
                }
                else {
                    if (targetCenter.y > conCenter.y) {
                        var y = conRect.height - targetRect.height;
                        this.setTranslateY(y);
                    }
                    else if (targetCenter.y < conCenter.y) {
                        this.setTranslateY(0);
                    }
                }
            }
      },
      getCurrentTranslate: function (target, ownRect, type) {
          var m, left, top, right, bottom, width, height, style, view;
          var style = target[0].style;
          width = (ownRect) ? target[0].scrollWidth : target.width();
          height = (ownRect) ? target[0].scrollHeight : target.height();
          if (Draggable.support.transform3d) {
              m = new WebKitCSSMatrix(style.webkitTransform);
              left = m.e;
              top = m.f;
              right = m.e + width;
              bottom = m.f + height;
          }
          else if (Draggable.support.transform2d()) {
              var t = window.getComputedStyle(target[0], null).MozTransform.match(/.*?([\-0-9.]*)px.*?([\-0-9.]*)px/);
              if (t) {
                  left = t[1] | 0;
                  top = t[2] | 0;
              } else {
                  left = 0;
                  top = 0;
              }
              right = left + width;
              bottom = top + height;
          }
          else {
              left = target.css('left');
              top = target.css('top');
              left = (left === 'auto') ? 0 : parseInt(left, 10);
              top = (top === 'auto') ? 0 : parseInt(top, 10);
              right = left + width;
              bottom = top + height;
          }
          if (type === 'view') {
              left += this.deltaLeft;
              right -= this.deltaRight;
              top += this.deltaTop;
              bottom -= this.deltaBottom;
          }
          return {
              left: left,
              top: top,
              right: right,
              bottom: bottom,
              width: width,
              height: height
          };
      },
      getTranslate: function (x, y) {
          return (Draggable.support.transform3d) ? ['translate3d(', x, 'px,', y, 'px,', 0, ')'].join('') : ['translate(', x, 'px,', y, 'px)'].join('');
      }
  };

  Draggable.support = {
      transform3d: ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
      transform2d: function () { return ('MozTransform' in doc.body.style) || ('webkitTransform' in window); },
      touch: ('ontouchstart' in window)
  };
  Draggable.event = {
    START: (Draggable.support.touch) ? 'touchstart' : 'mousedown',
    MOVE: (Draggable.support.touch) ? 'touchmove' : 'mousemove',
    END: (Draggable.support.touch) ? 'touchend' : 'mouseup'
  };
  Draggable.ts = {
      prop: (Draggable.support.transform3d) ? '-webkit-transform' : (Draggable.support.transform2d) ? '-moz-transform' : '',
      timing: 'cubic-bezier(0,0,0.25,1)',
      time: '500ms'
  };
  win.Draggable = Draggable;

})(window, document);
