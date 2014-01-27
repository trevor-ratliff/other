// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Solid, spr_tree');
  },
});

// A Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Solid, spr_bush');
  },
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Rock', {
  init: function() {
    this.requires('Actor, Solid, spr_rock');
  },
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
      .fourway(2)
      .stopOnSolids()
      .onHit('Treasure', this.visitTreasure)
      // These next lines define our four animations
      //  each call to .animate specifies:
      //  - the name of the animation
      //  - the x and y coordinates within the sprite
      //     map at which the animation set begins
      //  - the number of animation frames *in addition to* the first one
      .animate('PlayerMovingUp',    4, 9, 5)
      .animate('PlayerMovingRight', 2, 9, 3)
      .animate('PlayerMovingDown',  0, 9, 1)
      .animate('PlayerMovingLeft',  6, 9, 7);

    // Watch for a change of direction and switch animations accordingly
    var animation_speed = 4;
    this.bind('NewDirection', function(data) {
      if (data.x > 0) {
        this.animate('PlayerMovingRight', animation_speed, -1);
      } else if (data.x < 0) {
        this.animate('PlayerMovingLeft', animation_speed, -1);
      } else if (data.y > 0) {
        this.animate('PlayerMovingDown', animation_speed, -1);
      } else if (data.y < 0) {
        this.animate('PlayerMovingUp', animation_speed, -1);
      } else {
        this.stop();
      }
    });
  },

  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);

    return this;
  },

  // Stops the movement
  //~ stopMovement: function() {
    //~ this._speed = 0;
    //~ if (this._movement) {
      //~ this.x -= this._movement.x;
      //~ this.y -= this._movement.y;
    //~ }
  //~ },
  stopMovement: function () {
    if (this._movement) {
      this.x -= this._movement.x;
      if (this.hit('Solid') != false) {
        this.x += this._movement.x;
        this.y -= this._movement.y;
        if (this.hit('Solid') != false) {
          this.x -= this._movement.x;
          this.y -= this._movement.y;
        }
      }
    } else {
      this._speed = 0;
    }
  },

  // Respond to this player visiting a treasure
  visitTreasure: function(data) {
    treasure = data[0].obj;
    treasure.visit();
  }
});

// A treasure is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Treasure', {
  init: function() {
    this.requires('Actor, spr_treasure');
  },

  // Process a visitation with this treasure
  visit: function() {
    this.destroy();
    //Crafty.audio.play('knock');
    Crafty.trigger('TreasureVisited', this);
  }
});
