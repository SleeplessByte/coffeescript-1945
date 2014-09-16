// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Game.EnemyPlane = (function(_super) {
    __extends(EnemyPlane, _super);

    EnemyPlane.Behaviour = {
      looper: 'looper',
      shoot: {
        straight: 'shoot-straight',
        aim: 'shoot-aim'
      },
      spawn: {
        random: {
          x: 'spawn-random-x',
          y: 'spawn-random-y'
        },
        ondeath: 'ondeath'
      },
      fire: {
        point: 'point'
      }
    };

    function EnemyPlane(spritesheet, x, y, health, score) {
      if (x == null) {
        x = (Game.Canvas1945.LevelWidth / 2 + .5) | 0;
      }
      if (y == null) {
        y = -64;
      }
      if (health == null) {
        health = 3;
      }
      if (score == null) {
        score = 100;
      }
      EnemyPlane.__super__.constructor.call(this, spritesheet, x, y, health);
      this.behaviour = [];
      this.score = score;
      Game.EventManager.trigger('collidable.create', this, [Game.CollisionManager.Groups.Enemy, this]);
    }

    EnemyPlane.prototype.addBehaviour = function(behaviour, next) {
      if (next == null) {
        next = false;
      }
      this.behaviour.push(behaviour);
      if (!next) {
        if (this.behaves(EnemyPlane.Behaviour.spawn.random.x)) {
          this.x = Math.random() * Game.Canvas1945.LevelWidth;
        }
        if (this.behaves(EnemyPlane.Behaviour.spawn.random.y)) {
          this.y -= Math.random() * Game.Canvas1945.LevelHeight * 2;
        }
      }
      return this;
    };

    EnemyPlane.prototype.behaves = function(behaviour) {
      return __indexOf.call(this.behaviour, behaviour) >= 0;
    };

    EnemyPlane.prototype.update = function(event) {
      if (event.paused || this.isLevelPaused === true) {
        return;
      }
      EnemyPlane.__super__.update.call(this, event);
      if ((this.y > Game.Canvas1945.Height && this._facing === Game.Movable.Direction.down) || (this.y < -64 && this._facing === Game.Movable.Direction.up)) {
        if (!this.behaves(EnemyPlane.Behaviour.looper)) {
          if (destroy) {
            this.destroy();
          }
        }
        this.y = this._facing === Game.Movable.Direction.down ? -64 : Game.Canvas1945.Height;
        if (this.behaves(EnemyPlane.Behaviour.spawn.random.x)) {
          this.x = Math.random() * Game.Canvas1945.LevelWidth;
        }
      }
      this.primaryEnabled = true;
      return this;
    };

    EnemyPlane.prototype.collide = function(group, object) {
      if (this.inflict(object.damage)) {
        Game.EventManager.trigger('collidable.destroy', this, [Game.CollisionManager.Groups.Enemy, this]);
        if (group !== Game.CollisionManager.Groups.Player) {
          Game.EventManager.trigger('points.get', this, [this.score]);
        }
        return Builder.EnemyPlaneShards.create(this.x, this.y, this.velocity.x, this.velocity.y);
      }
    };

    EnemyPlane.prototype.destroy = function() {
      if (!this.behaves(EnemyPlane.Behaviour.spawn.ondeath)) {
        Game.EventManager.trigger('plane.destroy', this, []);
        return this;
      }
      this.health = this.maxhealth;
      this.play('idle');
      this.y = this._facing === Game.Movable.Direction.down ? -64 : Game.Canvas1945.Height;
      if (this.behaves(EnemyPlane.Behaviour.spawn.random.x)) {
        this.x = Math.random() * Game.Canvas1945.LevelWidth;
      }
      return Game.EventManager.trigger('collidable.create', this, [Game.CollisionManager.Groups.Enemy, this]);
    };

    EnemyPlane.prototype.primaryAction = function() {
      if (((Math.random() * 100) | 0) < 68) {
        return this;
      }
      if (this.behaves(EnemyPlane.Behaviour.fire.point)) {
        return Game.EventManager.trigger('bullet.create', this, [Builder.Bullet.create(Game.EnemyBullet, this.x, this.y, 0, void 0, 'point')]);
      }
    };

    return EnemyPlane;

  })(Game.Plane);

}).call(this);
