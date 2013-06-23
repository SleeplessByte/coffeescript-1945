// Generated by CoffeeScript 1.6.2
(function() {
  'use strict';
  /*
    The MIT License
  
    Copyright (c) 2012 Olaf Horstmann, indiegamr.com ( pixel collision )
    Copyright (c) 2013 Derk-Jan Karrenbeld, derk-jan.com ( fixes and collision manager )
  
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
  
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
  
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
  */

  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Game.CollisionManager = (function() {
    CollisionManager.Groups = {
      Player: 'player',
      Enemy: 'enemy',
      PlayerBullet: 'player-bullet',
      EnemyBullet: 'enemy-bullet',
      Island: 'island',
      Pieces: 'pieces'
    };

    CollisionManager.GridSize = 32;

    function CollisionManager() {
      this.update = __bind(this.update, this);
      var x, y, _i, _j, _ref, _ref1, _ref2, _ref3;

      this.objects = {};
      this.collisions = {};
      this.addCollision(CollisionManager.Groups.Player, CollisionManager.Groups.Enemy);
      this.addCollision(CollisionManager.Groups.PlayerBullet, CollisionManager.Groups.Enemy);
      this.addCollision(CollisionManager.Groups.EnemyBullet, CollisionManager.Groups.Player);
      this._grid = {};
      for (x = _i = 0, _ref = Game.Canvas1945.Width, _ref1 = CollisionManager.GridSize; _ref1 > 0 ? _i <= _ref : _i >= _ref; x = _i += _ref1) {
        this._grid[x] = {};
        for (y = _j = 0, _ref2 = Game.Canvas1945.Height, _ref3 = CollisionManager.GridSize; _ref3 > 0 ? _j <= _ref2 : _j >= _ref2; y = _j += _ref3) {
          this._grid[x][y] = {};
        }
      }
      this._gridWidth = _(this._grid).keys().length;
      this._gridHeight = _(_(this._grid).first()).keys().length;
      this._setupPixelPerfectCollision();
    }

    CollisionManager.prototype.update = function(event) {
      var bottom_right, collided, collisions, group, group_objects, groupa, groupb, groups, i, j, left, lefty, object, right, righty, rows, sections, top_left, x, y, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;

      if (event.paused) {
        return;
      }
      _ref = this.objects;
      for (group in _ref) {
        group_objects = _ref[group];
        for (_i = 0, _len = group_objects.length; _i < _len; _i++) {
          object = group_objects[_i];
          top_left = object.globalize(0, 0);
          bottom_right = object.globalize(object.width, object.height);
          for (i = _j = _ref1 = (top_left.x / CollisionManager.GridSize) | 0, _ref2 = (bottom_right.x / CollisionManager.GridSize) | 0; _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = _ref1 <= _ref2 ? ++_j : --_j) {
            if (!((0 < i && i < this._gridWidth))) {
              continue;
            }
            x = i * CollisionManager.GridSize;
            for (j = _k = _ref3 = (top_left.y / CollisionManager.GridSize) | 0, _ref4 = (bottom_right.y / CollisionManager.GridSize) | 0; _ref3 <= _ref4 ? _k <= _ref4 : _k >= _ref4; j = _ref3 <= _ref4 ? ++_k : --_k) {
              if (!((0 < j && j < this._gridHeight))) {
                continue;
              }
              y = j * CollisionManager.GridSize;
              if (this._grid[x][y][group] == null) {
                this._grid[x][y][group] = [];
              }
              this._grid[x][y][group].push(object);
            }
          }
        }
      }
      collided = [];
      _ref5 = this._grid;
      for (x in _ref5) {
        rows = _ref5[x];
        for (y in rows) {
          sections = rows[y];
          if (_(sections).keys().length > 1) {
            groups = _(sections).keys();
            _ref6 = this.collisions;
            for (groupa in _ref6) {
              collisions = _ref6[groupa];
              if (__indexOf.call(groups, groupa) >= 0 && ((groupb = _(collisions).find(function(c) {
                return c !== groupa && __indexOf.call(groups, c) >= 0;
              })) != null)) {
                left = sections[groupa];
                right = sections[groupb];
                for (_l = 0, _len1 = left.length; _l < _len1; _l++) {
                  lefty = left[_l];
                  if (__indexOf.call(collided, lefty) >= 0) {
                    continue;
                  }
                  for (_m = 0, _len2 = right.length; _m < _len2; _m++) {
                    righty = right[_m];
                    if (__indexOf.call(collided, lefty) >= 0) {
                      break;
                    }
                    if (__indexOf.call(collided, righty) >= 0) {
                      continue;
                    }
                    if (this._checkPixelCollision(lefty.createjs, righty.createjs, 50)) {
                      collided.push(lefty);
                      collided.push(righty);
                      if (typeof lefty.collide === "function") {
                        lefty.collide(righty);
                      }
                      if (typeof righty.collide === "function") {
                        righty.collide(lefty);
                      }
                      console.log('collision');
                    }
                  }
                }
              }
            }
          }
          this._grid[x][y] = {};
        }
      }
      return this;
    };

    CollisionManager.prototype.addCollision = function(groupa, groupb) {
      if ((this.collisions[groupb] != null) && __indexOf.call(this.collisions[groupb], groupa) >= 0) {
        return this;
      }
      if (this.collisions[groupa] == null) {
        this.collisions[groupa] = [];
      }
      this.collisions[groupa].push(groupb);
      return this;
    };

    CollisionManager.prototype.removeCollision = function(groupa, groupb) {
      if (this.collisions[groupa] != null) {
        this.collisions[groupa] = _(this.collisions[groupa]).without(groupb);
      }
      if (this.collisions[groupb] != null) {
        this.collisions[groupb] = _(this.collisions[groupb]).without(groupa);
      }
      return this;
    };

    CollisionManager.prototype.add = function(group, object) {
      if (this.objects[group] == null) {
        this.objects[group] = [];
      }
      this.objects[group].push(object);
      return this;
    };

    CollisionManager.prototype.remove = function(group, object) {
      this.objects[group] = _(this.objects[group]).without(object);
      return this;
    };

    CollisionManager.prototype._setupPixelPerfectCollision = function() {
      this._collisionCanvasLeft = document.createElement('canvas');
      this._collisionCanvasLeft.id = "collision-left";
      this._collisionCanvasLeft.setAttribute('class', 'collision-debug');
      this._collisionCanvasLeft.setAttribute('width', 3);
      this._collisionCanvasLeft.setAttribute('height', 3);
      this._collisionCanvasRight = document.createElement('canvas');
      this._collisionCanvasRight.id = "collision-right";
      this._collisionCanvasRight.setAttribute('class', 'collision-debug');
      this._collisionCanvasRight.setAttribute('width', 3);
      this._collisionCanvasRight.setAttribute('height', 3);
      (this._collisionContextLeft = this._collisionCanvasLeft.getContext('2d')).save();
      (this._collisionContextRight = this._collisionCanvasRight.getContext('2d')).save();
      document.body.appendChild(this._collisionCanvasLeft);
      document.body.appendChild(this._collisionCanvasRight);
      this._cachedBAFrames = [];
      return this;
    };

    CollisionManager.prototype._checkRectCollision = function(left, right) {
      return this._calculateIntersection(this._getBounds(left), this._getBounds(right));
    };

    CollisionManager.prototype._checkPixelCollision = function(left, right, alphaThreshold, getRect, precheck, returnflag) {
      var imageDataLeft, imageDataRight, intersection, pixelIntersection;

      if (alphaThreshold == null) {
        alphaThreshold = 0;
      }
      if (getRect == null) {
        getRect = false;
      }
      if (precheck == null) {
        precheck = false;
      }
      if (returnflag == null) {
        returnflag = true;
      }
      if (!((!precheck) || this._collisionDistancePrecheck(left, right))) {
        return false;
      }
      if ((intersection = this._checkRectCollision(left, right)) == null) {
        return false;
      }
      this._collisionCanvasLeft.width = intersection.width;
      this._collisionCanvasLeft.height = intersection.height;
      this._collisionCanvasRight.width = intersection.width;
      this._collisionCanvasRight.height = intersection.height;
      imageDataLeft = this._intersectingImagePart(intersection, left, this._collisionContextLeft, 1);
      imageDataRight = this._intersectingImagePart(intersection, right, this._collisionContextRight, 2);
      pixelIntersection = this._compareAlphaValues(imageDataLeft, imageDataRight, intersection.width, intersection.height, alphaThreshold, getRect);
      if (!pixelIntersection) {
        return false;
      }
      if (returnflag) {
        return true;
      }
      pixelIntersection.x += intersection.x;
      pixelIntersection.x2 += intersection.x;
      pixelIntersection.y += intersection.y;
      pixelIntersection.y2 += intersection.y;
      return pixelIntersection;
    };

    CollisionManager.prototype._collisionDistancePrecheck = function(left, right) {
      var left_rect, left_topleft, right_rect, right_topleft;

      left_topleft = left.localToGlobal(0, 0);
      right_topleft = right.localToGlobal(0, 0);
      if (left instanceof createjs.Bitmap) {
        left_rect = {
          width: left.image.width,
          height: left.image.height
        };
      } else {
        left_rect = left.spriteSheet.getFrame(left.currentFrame).rect;
      }
      if (right instanceof createjs.Bitmap) {
        right_rect = {
          width: right.image.width,
          height: right.image.height
        };
      } else {
        right_rect = right.spriteSheet.getFrame(right.currentFrame).rect;
      }
      return Math.abs(right_topleft.x - left_topleft.x) < right_rect.width * right.scaleX + left_rect.width * left.scaleX && Math.abs(right_topleft.y - left_topleft.y) < right_rect.height * right.scaleY + left_rect.height * left.scaleY;
    };

    CollisionManager.prototype._intersectingImagePart = function(intersection, bitmap, ctx, i) {
      var bl, frame, frameName, image;

      if (bitmap instanceof createjs.Bitmap) {
        image = bitmap.image;
      } else if (bitmap instanceof createjs.BitmapAnimation) {
        frame = bitmap.spriteSheet.getFrame(bitmap.currentFrame);
        frameName = "" + frame.image.src + ":" + bitmap.currentFrame + ":" + frame.rect.x + ":" + frame.rect.y + ":" + frame.rect.width + ":" + frame.rect.height;
        if (this._cachedBAFrames[frameName] == null) {
          this._cachedBAFrames[frameName] = createjs.SpriteSheetUtils.extractFrame(bitmap.spriteSheet, bitmap.currentFrame);
        }
        image = this._cachedBAFrames[frameName];
      }
      bl = bitmap.globalToLocal(intersection.x, intersection.y);
      ctx.restore();
      ctx.clearRect(0, 0, intersection.width, intersection.height);
      ctx.rotate(this._getParentalCumulatedProperty(bitmap, 'rotation') * (Math.PI / 180));
      ctx.scale(this._getParentalCumulatedProperty(bitmap, 'scaleX', '*'), this._getParentalCumulatedProperty(bitmap, 'scaleY', '*'));
      ctx.translate(-bl.x - intersection['rect' + i].regX, -bl.y - intersection['rect' + i].regY);
      ctx.drawImage(image, 0, 0, image.width, image.height);
      return ctx.getImageData(0, 0, intersection.width, intersection.height).data;
    };

    CollisionManager.prototype._compareAlphaValues = function(imageDataLeft, imageDataRight, width, height, alphaThreshold, getRect) {
      var alpha1, alpha2, offset, pixelRect, x, y, _i, _j;

      offset = 3;
      pixelRect = {
        x: Infinity,
        y: Infinity,
        x2: -Infinity,
        y2: -Infinity
      };
      for (y = _i = 0; 0 <= height ? _i < height : _i > height; y = 0 <= height ? ++_i : --_i) {
        for (x = _j = 0; 0 <= width ? _j < width : _j > width; x = 0 <= width ? ++_j : --_j) {
          alpha1 = imageDataLeft.length > offset + 1 ? imageDataLeft[offset] : 0;
          alpha2 = imageDataRight.length > offset + 1 ? imageDataRight[offset] : 0;
          if (alpha1 > alphaThreshold && alpha2 > alphaThreshold) {
            if (!getRect) {
              return {
                x: x,
                y: y,
                width: 1,
                height: 1
              };
            }
            if (x < pixelRect.x) {
              pixelRect.x = x;
            }
            if (x > pixelRect.x2) {
              pixelRect.x2 = x;
            }
            if (y < pixelRect.y) {
              pixelRect.y = y;
            }
            if (y > pixelRect.y2) {
              pixelRect.y2 = y;
            }
          }
          offset += 4;
        }
      }
      if (pixelRect.x !== Infinity) {
        pixelRect.width = pixelRect.x2 - pixelRect.x + 1;
        pixelRect.height = pixelRect.y2 - pixelRect.y + 1;
        return pixelRect;
      }
      return null;
    };

    CollisionManager.prototype._getParentalCumulatedProperty = function(child, propName, operation) {
      var cp, pp;

      if (operation == null) {
        operation = '+';
      }
      if (child.parent && child.parent[propName]) {
        cp = child[propName];
        pp = this._getParentalCumulatedProperty(child.parent, propName, operation);
        if (operation === '*') {
          return cp * pp;
        }
        return cp + pp;
      }
      return child[propName];
    };

    CollisionManager.prototype._calculateIntersection = function(left, right) {
      var dx, dy, r1, r2;

      r1 = {};
      r2 = {};
      r1.cx = left.x + (r1.hw = left.width / 2);
      r1.cy = left.y + (r1.hh = left.height / 2);
      r2.cx = right.x + (r2.hw = right.width / 2);
      r2.cy = right.y + (r2.hh = right.height / 2);
      dx = Math.abs(r1.cx - r2.cx) - (r1.hw + r2.hw);
      dy = Math.abs(r1.cy - r2.cy) - (r1.hh + r2.hh);
      if (dx < 0 && dy < 0) {
        dx = Math.min(Math.min(left.width, right.width), -dx);
        dy = Math.min(Math.min(left.height, right.height), -dy);
        return {
          x: Math.max(left.x, right.x),
          y: Math.max(left.y, right.y),
          width: dx,
          height: dy,
          rect1: left,
          rect2: right
        };
      }
      return null;
    };

    CollisionManager.prototype._getBounds = function(obj) {
      var bounds, cbounds, cframe, child, gp, gp2, gp3, gp4, imgr, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;

      bounds = {
        x: Infinity,
        y: Infinity,
        width: 0,
        height: 0
      };
      if (obj instanceof createjs.Container) {
        bounds.x2 = -Infinity;
        bounds.y2 = -Infinity;
        _ref = obj.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          cbounds = this._getBounds(child);
          if (cbounds.x < bounds.x) {
            bounds.x = cbounds.x;
          }
          if (cbounds.y < bounds.y) {
            bounds.y = cbounds.y;
          }
          if (cbounds.x + cbounds.width > bounds.x2) {
            bounds.x2 = cbounds.x + cbounds.width;
          }
          if (cbounds.y + cbounds.height > bounds.y2) {
            bounds.y2 = cbounds.y + cbounds.height;
          }
        }
        if (bounds.x === Infinity) {
          bounds.x = 0;
        }
        if (bounds.y === Infinity) {
          bounds.y = 0;
        }
        if (bounds.x2 === -Infinity) {
          bounds.x2 = 0;
        }
        if (bounds.y2 === -Infinity) {
          bounds.y2 = 0;
          bounds.width = bounds.x2 - bounds.x;
          bounds.height = bounds.y2 - bounds.y;
          delete bounds.x2;
          delete bounds.y2;
          return bounds;
        }
      }
      if (obj instanceof createjs.Bitmap) {
        imgr = obj.image;
      } else if (obj instanceof createjs.BitmapAnimation) {
        if (obj.spriteSheet._frames && obj.spriteSheet._frames[obj.currentFrame] && obj.spriteSheet._frames[obj.currentFrame].image) {
          cframe = obj.spriteSheet.getFrame(obj.currentFrame);
          imgr = cframe.rect;
          imgr.regX = cframe.regX;
          imgr.regY = cframe.regY;
        } else {
          imgr = {};
          bounds.x = (_ref1 = obj.x) != null ? _ref1 : 0;
          bounds.y = (_ref2 = obj.y) != null ? _ref2 : 0;
        }
      } else {
        imgr = {};
        bounds.x = (_ref3 = obj.x) != null ? _ref3 : 0;
        bounds.y = (_ref4 = obj.y) != null ? _ref4 : 0;
      }
      imgr.regX = (_ref5 = imgr.regX) != null ? _ref5 : 0;
      imgr.width = (_ref6 = imgr.width) != null ? _ref6 : 0;
      imgr.regY = (_ref7 = imgr.regY) != null ? _ref7 : 0;
      imgr.height = (_ref8 = imgr.height) != null ? _ref8 : 0;
      bounds.regX = imgr.regX;
      bounds.regY = imgr.regY;
      gp = obj.localToGlobal(0 - imgr.regX, 0 - imgr.regY);
      gp2 = obj.localToGlobal(imgr.width - imgr.regX, imgr.height - imgr.regY);
      gp3 = obj.localToGlobal(imgr.width - imgr.regX, 0 - imgr.regY);
      gp4 = obj.localToGlobal(0 - imgr.regX, imgr.height - imgr.regY);
      bounds.x = Math.min(Math.min(Math.min(gp.x, gp2.x), gp3.x), gp4.x);
      bounds.y = Math.min(Math.min(Math.min(gp.y, gp2.y), gp3.y), gp4.y);
      bounds.width = Math.max(Math.max(Math.max(gp.x, gp2.x), gp3.x), gp4.x) - bounds.x;
      bounds.height = Math.max(Math.max(Math.max(gp.y, gp2.y), gp3.y), gp4.y) - bounds.y;
      return bounds;
    };

    return CollisionManager;

  })();

}).call(this);