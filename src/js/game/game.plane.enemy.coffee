'use strict'
#
#
class Game.EnemyPlane extends Game.Plane
		
	# The direction strings
	#
	@Behaviour =
		looper: 'looper'
		shoot:
			straight: 'shoot-straight'
			aim: 'shoot-aim'
		spawn:
			random:
				x: 'spawn-random-x'
				y: 'spawn-random-y'
			ondeath: 'ondeath'
		fire:
			point: 'point'
		
	# Creates a new Game Plane
	#
	# @param spritesheet [createjs.SpriteSheet] the spritesheet for this sprite
	#
	constructor: ( spritesheet, x = ( Game.Canvas1945.LevelWidth / 2 + .5) | 0, y = - 64, health = 3, score = 100 ) ->
		super spritesheet, x, y, health
		@behaviour = []
		@score = score
		
		Game.EventManager.trigger 'collidable.create', @, [ Game.CollisionManager.Groups.Enemy, @ ] 
		
	#
	#
	#
	addBehaviours: ( behaviours, next = off ) ->
	
		for behaviour, index in behaviours
			@addBehaviour behaviour, index < behaviours.length - 1 or next
			
		return this
		
	#
	#
	addBehaviour: ( behaviour, next = off ) ->
		@behaviour.push behaviour
		
		unless next
			if @behaves EnemyPlane.Behaviour.spawn.random.x
				@x = Math.random() * Game.Canvas1945.LevelWidth
			if @behaves EnemyPlane.Behaviour.spawn.random.y
				@y -= Math.random() * Game.Canvas1945.LevelHeight * 2
		
		return this
		
	#
	#
	behaves: ( behaviour ) ->
		return behaviour in @behaviour
		
	#
	#
	#
	spawn: () ->
		Game.EventManager.trigger 'plane.create', @, []
	
	# Updates the enemy
	#
	# @param event [TickEvent] the event
	# @return [self] the chainable self
	#
	update: ( event ) ->
		return if event.paused or @isLevelPaused is on
		super event
		
		# Out of bounds
		if ( @y > Game.Canvas1945.Height and @_facing is Game.Movable.Direction.down ) or 
		( @y < - 64 and @_facing is Game.Movable.Direction.up )
			
			# If not a looper, kill
			unless @behaves EnemyPlane.Behaviour.looper
				return @destroy() if @destroy?	
			
			# Set new positions
			@y = if @_facing is Game.Movable.Direction.down then -64 else Game.Canvas1945.Height
			if @behaves EnemyPlane.Behaviour.spawn.random.x
				@x = Math.random() * Game.Canvas1945.LevelWidth
				
		# Temp brain
		@primaryEnabled = on
			
				
		return this
		
	#
	#
	collide: ( group, object ) ->
		if @inflict object.damage
			Game.EventManager.trigger 'collidable.destroy', @, [ Game.CollisionManager.Groups.Enemy, @ ]
			if group isnt Game.CollisionManager.Groups.Player
				Game.EventManager.trigger 'points.get', @, [ @score ]
			Builder.EnemyPlaneShards.create @x, @y, @velocity.x, @velocity.y
			@destroy()
			
	#
	#
	destroy: ( ) ->
		unless @behaves EnemyPlane.Behaviour.spawn.ondeath
			return super

		@health = @maxHealth
		@play 'idle'
		@y = if @_facing is Game.Movable.Direction.down then -64 else Game.Canvas1945.Height
		if @behaves EnemyPlane.Behaviour.spawn.random.x
			@x = Math.random() * Game.Canvas1945.LevelWidth
		Game.EventManager.trigger 'collidable.create', @, [ Game.CollisionManager.Groups.Enemy, @ ]
		
	
	#
	#
	primaryAction: () ->
		#weapon = GameWeapon...
		return this if ( ( Math.random() * 100 ) | 0 ) < 68
		if @behaves EnemyPlane.Behaviour.fire.point
			Game.EventManager.trigger 'bullet.create', @, [ Builder.Bullet.create( Game.EnemyBullet, @x, @y, 0, undefined, 'point' ) ]