/* 
<<<<<<< HEAD:frick-image.js
 * draggable.js
=======
 * frick-image.js
 * @author Kazuya Hiruma
>>>>>>> dev:frick-image.js
 *
 * Copyright 2011 Kazuya Hiruma.
 * Licensed under the MIT License:
 *
 * http://css-eblog.com/
 *
<<<<<<< HEAD:frick-image.js
 * @version 0.1
 */

(function(win, doc) {
  "use strict";
  var FrickImage = function () {
    this.init.apply(this, arguments);
  };
  FrickImage.prototype = {
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
=======
 * @version 0.2
 */

;(function(win, doc) {

  "use strict";
  
  var FrickImage = function () {
    this.init.apply(this, arguments);
  };

  FrickImage.prototype = {
      target: null,
      container: null,
      deltaTop: 0,
      deltaBottom: 0,
      deltaLeft: 0,
      deltaRight: 0,
      deltaX: 0,
      deltaY: 0,
      moveTime: 0,
      mag: 100,
      accX: 0,
      accY: 0,
      oldX: 0,
      oldY: 0,
      cnt: 0,
      mode: null,

      /**
       * Initialize
       */
      init: function (target, opt) {

        var self = this;

>>>>>>> dev:frick-image.js
        opt = opt || {};

        this.target = $(target).css({
            'position': 'absolute'
        });
<<<<<<< HEAD:frick-image.js
        this.container = this.target.parent();
        if( this.target[0].offsetParent !== this.container[0] ) {
          this.container.css('position', 'relative');
        }

        //bind event to drag target.
=======

        this.container = this.target.parent();

        if (this.target[0].offsetParent !== this.container[0]) {
            this.container.css('position', 'relative');
        }

        /**
         * bind event to drag target.
         */
>>>>>>> dev:frick-image.js
        $(this.target).bind(FrickImage.event.START, function (e) { self._dragStart(e); return false; });
        $(document).bind(FrickImage.event.MOVE, function (e) { self._dragging(e); });
        $(document).bind(FrickImage.event.END, function (e) { self._dragEnd(e); });

<<<<<<< HEAD:frick-image.js
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
              if (FrickImage.support.transform3d || FrickImage.support.transform2d) {
                  left = m.left + (self.accX * self.mag);
                  top = m.top + (self.accY * self.mag);
                  if (css.webkitTransitionProperty) {
                      css.webkitTransitionProperty = FrickImage.ts.prop;
                      css.webkitTransitionTimingFunction = FrickImage.ts.timing;
                      css.webkitTransitionDuration = FrickImage.ts.time;
                      css.webkitTransform = self.getTranslate(left, top);
                  }
                  else if (css.MozTransitionProperty) {
                      css.MozTransitionProperty = FrickImage.ts.prop;
                      css.MozTransitionTimingFunction = FrickImage.ts.timing;
                      css.MozTransitionDuration = FrickImage.ts.time;
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
          if (FrickImage.support.transform3d) {
              css.webkitTransform = this.getTranslate(x, y);
=======
        $(this.target).find('a').bind('click', function (e) {
        
            if (self.mode === 'dragging') {
                return false;
            }
        });

        this.deltaLeft   = opt.deltaLeft   || this.deltaLeft;
        this.deltaRight  = opt.deltaRight  || this.deltaRight;
        this.deltaTop    = opt.deltaTop    || this.deltaTop;
        this.deltaBottom = opt.deltaBottom || this.deltaBottom;
      },

      ////////////////////////////////////////////////////////////////////////////
      /**
       * Get page(X,Y) in event object.
       */
      getPageX: function (e) {
      
          var evt = e.originalEvent || e;

          if (evt.targetTouches) {
              return evt.targetTouches[0]['pageX'];
          }
          else if (evt['pageX']) {
              return evt['pageX'];
          }

      },
      getPageY: function (e) {
      
          var evt = e.originalEvent || e;

          if (evt.targetTouches) {
              return evt.targetTouches[0]['pageY'];
          }
          else if (evt['pageY']) {
              return evt['pageY'];
          }

      },

      ////////////////////////////////////////////////////////////////////////////
      /**
       * Set translate, &:X, &:Y
       */
      setTranslate: function (x, y, just) {

          var css = this.target[0].style;

          if (FrickImage.support.transform3d) {
              css.webkitTransform = this.getTranslateProp(x, y);
>>>>>>> dev:frick-image.js
              if (just) {
                  css.webkitTransitionProperty = 'none';
                  css.webkitTransitionDuration = '0';
              }
          }
          else if (FrickImage.support.transform2d()) {
<<<<<<< HEAD:frick-image.js
              css.MozTransform = this.getTranslate(x, y);
=======
              css.MozTransform = this.getTranslateProp(x, y);
>>>>>>> dev:frick-image.js
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
<<<<<<< HEAD:frick-image.js
=======

>>>>>>> dev:frick-image.js
          this.setTranslate(x, this.goalTop, just);
          this.goalLeft = x;
      },
      setTranslateY: function (y, just) {
<<<<<<< HEAD:frick-image.js
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
=======

          this.setTranslate(this.goalLeft, y, just);
          this.goalTop = y;
      },

      ////////////////////////////////////////////////////////////////////////////
      /**
       * Get current translate.
       */
      getCurrentTranslate: function (target, ownRect, type) {
          var m, left, top, right, bottom, width, height, style, view, t;
          var style = target[0].style;

          width = (ownRect) ? target[0].scrollWidth : target.width();
          height = (ownRect) ? target[0].scrollHeight : target.height();

>>>>>>> dev:frick-image.js
          if (FrickImage.support.transform3d) {
              m = new WebKitCSSMatrix(style.webkitTransform);
              left = m.e;
              top = m.f;
              right = m.e + width;
              bottom = m.f + height;
          }
          else if (FrickImage.support.transform2d()) {
<<<<<<< HEAD:frick-image.js
              var t = window.getComputedStyle(target[0], null).MozTransform.match(/.*?([\-0-9.]*)px.*?([\-0-9.]*)px/);
              if (t) {
                  left = t[1] | 0;
                  top = t[2] | 0;
=======
              t = window.getComputedStyle(target[0], null).MozTransform.match(/.*?([\-0-9.]*)px.*?([\-0-9.]*)px/);

              if (t) {
                  left = t[1] >> 0;
                  top = t[2] >> 0;
>>>>>>> dev:frick-image.js
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
<<<<<<< HEAD:frick-image.js
      getTranslate: function (x, y) {
          return (FrickImage.support.transform3d) ? ['translate3d(', x, 'px,', y, 'px,', 0, ')'].join('') : ['translate(', x, 'px,', y, 'px)'].join('');
      }
  };

=======
      getTranslateProp: function (x, y) {

          return (FrickImage.support.transform3d) ? ['translate3d(', x, 'px,', y, 'px,', 0, ')'].join('') : ['translate(', x, 'px,', y, 'px)'].join('');
      },

      /**
       * Check transition state.
       */
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
              },
          
              targetRect = this.getCurrentTranslate(target, true),
              targetCenter = {
                  x: targetRect.width  / 2 + targetRect.left,
                  y: targetRect.height / 2 + targetRect.top
              },
              top    = targetRect.top - conRect.top,
              right  = targetRect.right - conRect.right,
              bottom = targetRect.bottom - conRect.bottom,
              left   = targetRect.left - conRect.left,
              
              /**
               * inner element bigger than outer element, and
               * when edge of inner element is in outer element,
               * is true.
               */
              moveV = (top  > 0 || bottom < 0) && !(top > 0 && bottom < 0),
              moveH = (left > 0 || right  < 0) && !(left > 0 && right < 0),

              x, y;

          /**
           * Check the center of each elements. (with moveV of moveH is true)
           * if that center is bigger or smaller, fit to edge of outer element.
           */
          if (moveH) {
              if (targetRect.width > conRect.width) {
                  if (targetCenter.x > conCenter.x) {
                      this.setTranslateX(0);
                  }
                  else if (targetCenter.x < conCenter.x) {
                      x = conRect.width - targetRect.width;
                      this.setTranslateX(x);
                  }
              }
              else {
                  if (targetCenter.x > conCenter.x) {
                      x = conRect.width - targetRect.width;
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
                      y = conRect.height - targetRect.height;
                      this.setTranslateY(y);
                  }
              }
              else {
                  if (targetCenter.y > conCenter.y) {
                      y = conRect.height - targetRect.height;
                      this.setTranslateY(y);
                  }
                  else if (targetCenter.y < conCenter.y) {
                      this.setTranslateY(0);
                  }
              }
          }
      },


      endTransition: function () {

          this.mode = null;
          clearInterval(this.endInterval);
      },

      ////////////////////////////////////////////////////////////////////////
      /**
       * Local functions.
       */
      _dragStart: function (e) {

          clearInterval(this.endInterval);

          var self = this,
              container = self.container,
              target = self.target,
              pageX = this.getPageX(e),
              pageY = this.getPageY(e),
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

          if (!this.dragState) {
              return false;
          }

          var target = this.target,
              pageX = this.getPageX(e),
              pageY = this.getPageY(e),
              x = pageX - this.deltaX,
              y = pageY - this.deltaY,
              now = (new Date).getTime();

          this.setTranslate(x, y, true);
          this.accX = (pageX - this.oldX) / (now - this.moveTime);
          this.accY = (pageY - this.oldY) / (now - this.moveTime);
          this.oldX = pageX;
          this.oldY = pageY;
          this.moveTime = (new Date).getTime();
          this.mode = 'dragging';

          return false;
      },
      _dragEnd: function (e) {

          if (!this.dragState) {
              return false;
          }

          this.dragState = false;

          var self = this,
              target = self.target,
              css = target[0].style,
              m = self.getCurrentTranslate(target),
              now = (new Date).getTime(),
              left, top;

          if (FrickImage.support.transform3d || FrickImage.support.transform2d()) {
              left = m.left + (self.accX * self.mag);
              top = m.top + (self.accY * self.mag);

              /**
               * Set transition properties.
               */
              setProperty(css);

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

          ////////////////////////////////////
          /**
           * Local functions.
           */
          function setProperty(css) {

              if (css.webkitTransitionProperty) {
                  css.webkitTransitionProperty = FrickImage.ts.prop;
                  css.webkitTransitionTimingFunction = FrickImage.ts.timing;
                  css.webkitTransitionDuration = FrickImage.ts.time;
                  css.webkitTransform = self.getTranslateProp(left, top);
              }
              else if (css.MozTransitionProperty) {
                  css.MozTransitionProperty = FrickImage.ts.prop;
                  css.MozTransitionTimingFunction = FrickImage.ts.timing;
                  css.MozTransitionDuration = FrickImage.ts.time;
                  css.MozTransform = self.getTranslateProp(left, top);
              }
          }
      }
  };

  //////////////////////////////////////////////////////////////////////
  /**
   * class methods.
   */

  /**
   * Support transform
   */
>>>>>>> dev:frick-image.js
  FrickImage.support = {
      transform3d: ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
      transform2d: function () { return ('MozTransform' in doc.body.style) || ('webkitTransform' in window); },
      touch: ('ontouchstart' in window)
  };
<<<<<<< HEAD:frick-image.js
=======

  /**
   * Touch or mouse events.
   */
>>>>>>> dev:frick-image.js
  FrickImage.event = {
    START: (FrickImage.support.touch) ? 'touchstart' : 'mousedown',
    MOVE: (FrickImage.support.touch) ? 'touchmove' : 'mousemove',
    END: (FrickImage.support.touch) ? 'touchend' : 'mouseup'
  };
<<<<<<< HEAD:frick-image.js
=======

  /**
   * Create transform method name.
   */
>>>>>>> dev:frick-image.js
  FrickImage.ts = {
      prop: (FrickImage.support.transform3d) ? '-webkit-transform' : (FrickImage.support.transform2d) ? '-moz-transform' : '',
      timing: 'cubic-bezier(0,0,0.25,1)',
      time: '500ms'
  };
<<<<<<< HEAD:frick-image.js
=======

  /**
   * Export
   */
>>>>>>> dev:frick-image.js
  win.FrickImage = FrickImage;

})(window, document);
