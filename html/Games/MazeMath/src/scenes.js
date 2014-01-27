// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  var lobjMazeMap = new MazeMap(
    Math.floor(Game.map_grid.height/2), 
    Math.floor(Game.map_grid.width/2));
  lobjMazeMap.Init().Generate();
  var larrMazeRender = lobjMazeMap.Display().split('\n');
  
  //----
  // remove blank lines at beginning and end
  //----
  larrMazeRender.shift();
  larrMazeRender.pop();
  
  console.log(lobjMazeMap.MazeString);
  
  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }

  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(1, 1);
  this.occupied[this.player.at().x][this.player.at().y] = true;

  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      var at_edge = x == 0 || x == Game.map_grid.width - 1 ||
        y == 0 || y == Game.map_grid.height - 1;

      //~ if (at_edge) {
        //~ // Place a tree entity at the current tile
        //~ Crafty.e('Tree').at(x, y);
        //~ this.occupied[x][y] = true;
      //~ } else if (Math.random() < 0.06 && !this.occupied[x][y]) {
        //~ // Place a bush entity at the current tile
        //~ var bush_or_rock = (Math.random() > 0.3) ? 'Bush' : 'Rock';
        //~ Crafty.e(bush_or_rock).at(x, y);
        //~ this.occupied[x][y] = true;
      //~ }
      
      if (larrMazeRender[y].substr(x, 1) == "#") {
        if (at_edge) {
          Crafty.e('Tree').at(x, y);
          this.occupied[x][y] = true;
        } else {
          Crafty.e('Bush').at(x, y);
          this.occupied[x][y] = true;
        }
      }
    }
  }

  // Generate five treasures on the map in random locations
  var max_treasures = 5;
  while (Crafty('Treasure').length < max_treasures) {
    for (var x = 0; x < Game.map_grid.width; x++) {
      for (var y = 0; y < Game.map_grid.height; y++) {
        if (Math.random() < 0.0175) {
          if (Crafty('Treasure').length < max_treasures && !this.occupied[x][y]) {
            Crafty.e('Treasure').at(x, y);
          }
        }
      }
    }
  }

  // Play a ringing sound to indicate the start of the journey
  //Crafty.audio.play('ring');

  // Show the victory screen once all treasures are visisted
  this.show_victory = this.bind('TreasureVisited', function() {
    if (!Crafty('Treasure').length) {
      Crafty.scene('Victory');
    }
  });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('TreasureVisited', this.show_victory);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
  // Display some text in celebration of the victory
  Crafty.e('2D, DOM, Text')
    .text('All treasures visited!')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);

  // Give'em a round of applause!
  //Crafty.audio.play('applause');

  // After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  var delay = true;
  setTimeout(function() { $do_math = false; }, 5000);
  
  //----
  // set up a math session
  //----
  $('#cover').addClass('show');
  
  this.restart_game = Crafty.bind('KeyDown', function() {
    if (!$do_math) {
      $do_math = true;
      $('#cover').removeClass('show');
      
      Crafty.scene('Game');
    }
  });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading; please wait...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);

  // Load our sprite map image
  Crafty.load([
    'assets/LaneaZimmerman/basictiles.png'
    //~ 'assets/16x16_forest_2.gif',
    //~ 'assets/hunter.png',
    //~ 'assets/door_knock_3x.mp3',
    //~ 'assets/door_knock_3x.ogg',
    //~ 'assets/door_knock_3x.aac',
    //~ 'assets/board_room_applause.mp3',
    //~ 'assets/board_room_applause.ogg',
    //~ 'assets/board_room_applause.aac',
    //~ 'assets/candy_dish_lid.mp3',
    //~ 'assets/candy_dish_lid.ogg',
    //~ 'assets/candy_dish_lid.aac'
    ], function(){
    // Once the images are loaded...

    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity
    //  to be drawn with a certain sprite
    Crafty.sprite(16, 'assets/LaneaZimmerman/basictiles.png', {
      //~ spr_tree:    [0, 0],
      //~ spr_bush:    [1, 0],
      //~ spr_treasure: [0, 1],
      //~ spr_rock:    [1, 1]
      spr_tree:    [6, 4],
      spr_bush:    [4, 2],
      spr_treasure: [4, 4],
      spr_rock:    [2, 7]
    });

    // Define the PC's sprite to be the first sprite in the third row of the
    //  animation sprite map
    //~ Crafty.sprite(16, 'assets/hunter.png', {
    Crafty.sprite(16, 'assets/LaneaZimmerman/basictiles.png', {
      spr_player:  [0, 9],
    }, 0, 0);

    // Define our sounds for later use
    //~ Crafty.audio.add({
      //~ knock:     ['assets/door_knock_3x.mp3',
                  //~ 'assets/door_knock_3x.ogg',
                  //~ 'assets/door_knock_3x.aac'],
      //~ applause:  ['assets/board_room_applause.mp3',
                  //~ 'assets/board_room_applause.ogg',
                  //~ 'assets/board_room_applause.aac'],
      //~ ring:      ['assets/candy_dish_lid.mp3',
                  //~ 'assets/candy_dish_lid.ogg',
                  //~ 'assets/candy_dish_lid.aac']
    //~ });

    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  })
});
