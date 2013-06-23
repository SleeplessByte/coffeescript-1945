// Generated by CoffeeScript 1.6.2
(function() {
  'use strict';
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Builder.PlayerPlane = (function(_super) {
    __extends(PlayerPlane, _super);

    function PlayerPlane() {
      _ref = PlayerPlane.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PlayerPlane.SpriteSheet = null;

    PlayerPlane.create = function() {
      var builder;

      if (PlayerPlane.SpriteSheet != null) {
        return new Game.Player(PlayerPlane.SpriteSheet);
      }
      builder = new Builder.PlayerPlane();
      builder.animation('idle', 4, 400, 65, 65, 1, 1, 3, 3);
      builder.animationExtra('explode', 4, 301, 65, 65, 1, 1, 7, 7, false, 3);
      PlayerPlane.SpriteSheet = builder.createjs;
      return new Game.Player(PlayerPlane.SpriteSheet);
    };

    return PlayerPlane;

  })(Builder.SpriteSheet);

}).call(this);
