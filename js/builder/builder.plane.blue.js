// Generated by CoffeeScript 1.6.2
(function() {
  'use strict';
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Builder.BlueEnemyPlane = (function(_super) {
    __extends(BlueEnemyPlane, _super);

    function BlueEnemyPlane() {
      _ref = BlueEnemyPlane.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BlueEnemyPlane.SpriteSheet = null;

    BlueEnemyPlane.create = function() {
      var builder;

      if (BlueEnemyPlane.SpriteSheet != null) {
        return (new Game.EnemyPlane(BlueEnemyPlane.SpriteSheet)).addBehaviour(Game.EnemyPlane.Behaviour.looper).addBehaviour(Game.EnemyPlane.Behaviour.spawn.random.x).addBehaviour(Game.EnemyPlane.Behaviour.spawn.random.y).addBehaviour(Game.EnemyPlane.Behaviour.spawn.ondeath);
      }
      builder = new Builder.BlueEnemyPlane();
      builder.animationExtra('idle', 301, 466, 32, 32, 1, 1, 3, 3, true, 2);
      builder.animationExtra('explode', 70, 169, 32, 32, 1, 1, 6, 6, 'hide', 2);
      builder.animationExtra('hide', 268, 202, 32, 32, 1, 1, 1, 1, false, 1);
      builder.animationExtra('loop', 631, 203, 32, 32, 1, 1, 1, 5, 'upside', 2);
      builder.animation('upside', 202, 367, 32, 32, 1, 1, 2, 2);
      builder.data.animations['upside'].frames.push(_(builder.data.animations['loop'].frames).last());
      BlueEnemyPlane.SpriteSheet = builder.createjs;
      return (new Game.EnemyPlane(BlueEnemyPlane.SpriteSheet)).addBehaviour(Game.EnemyPlane.Behaviour.looper).addBehaviour(Game.EnemyPlane.Behaviour.spawn.random.x).addBehaviour(Game.EnemyPlane.Behaviour.spawn.random.y).addBehaviour(Game.EnemyPlane.Behaviour.spawn.ondeath);
    };

    return BlueEnemyPlane;

  })(Builder.SpriteSheet);

}).call(this);
