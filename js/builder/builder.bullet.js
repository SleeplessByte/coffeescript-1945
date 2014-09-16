// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Builder.Bullet = (function(_super) {
    __extends(Bullet, _super);

    function Bullet() {
      return Bullet.__super__.constructor.apply(this, arguments);
    }

    Bullet.SpriteSheet = null;

    Bullet.create = function(bulletctor, x, y, vx, vy, type, damage, args) {
      var builder;
      if (Bullet.SpriteSheet != null) {
        return new bulletctor(Bullet.SpriteSheet, x, y, vx, vy, type, damage, args);
      }
      builder = new Builder.Bullet();
      builder.animationExtra('point', 37, 202, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('mini', 70, 202, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('up', 37, 169, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('2up', 4, 169, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('2down', 4, 202, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('leftup', 4, 235, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('rightup', 37, 235, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('leftdown', 70, 235, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('rightdown', 103, 235, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('left', 136, 235, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('right', 169, 235, 32, 32, 1, 1, 1, 1, false, 1);
      Bullet.SpriteSheet = builder.createjs;
      return new bulletctor(Bullet.SpriteSheet, x, y, vx, vy, type, damage, args);
    };

    return Bullet;

  })(Builder.SpriteSheet);

}).call(this);
