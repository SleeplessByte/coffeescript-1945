// Generated by CoffeeScript 1.6.2
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

    function EnemyPlane(spritesheet, x, y, health) {
      if (x == null) {
        x = (Game.Canvas1945.LevelWidth / 2 + .5) | 0;
      }
      if (y == null) {
        y = -64;
      }
      if (health == null) {
        health = 3;
      }
      EnemyPlane.__super__.constructor.call(this, spritesheet, x, y, health);
      this.behaviour = [];
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
      if (event.paused) {
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
      return this;
    };

    EnemyPlane.prototype.collide = function(group, object) {
      if (this.inflict(object.damage)) {
        return Game.EventManager.trigger('collidable.destroy', this, [Game.CollisionManager.Groups.Enemy, this]);
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

    return EnemyPlane;

  })(Game.Plane);

}).call(this);
