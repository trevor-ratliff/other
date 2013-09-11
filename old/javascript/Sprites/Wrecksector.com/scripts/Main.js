/********************************************************************************** 
 * Main.js:                                                                       * 
 *    Main file from which we prepare our game model and run our game loop.       * 
 *    Very high-level.  Just knows we're running SOMETHING in a loop.             * 
 *    The game loop is very simple:                                               * 
 *       -Get user input, and update the model.                                   * 
 *       -Inform the model of the passing of one tick (time-based updates)        * 
 *       -Render to the screen.                                                   * 
 *    This is the class we start in.  Main.Game.start() is our main point of      * 
 *    entry.                                                                      * 
 *                                                                                * 
 * Author: Rich Bateman                                                           * 
 * ********************************************************************************/

/*************/
/* NAMESPACE */
/*************/
var Main = {};

/********************************************************************************** 
 * Main.Game:                                                                     * 
 *    Launchpad of our application                                                *
 **********************************************************************************/
Main.Game = function (args)
{
   /*************/
   /* CONSTANTS */
   /*************/
   var TICK_FRAME_INTERVAL_MS = args.tickFrame;       /* Number milliseconds in a frame tick; A value of 20 would be 50 ticks/frames per second. */
   var ASPECT_RATIO = args.idealWidth / args.idealHeight; /* The width to height ratio of our game; we will always stay in this ratio so things look normal.  The aspect ratio of our desired target display rectangle.*/
   var IDEAL_WIDTH = args.idealWidth;                 /* Normally, ideally, what's the width of our application. */
   var IDEAL_HEIGHT = args.idealHeight;               /* Normally, ideally, what's the height of our application. */
   
   /*******************/
   /* PRIVATE MEMBERS */
   /*******************/
   var that = this;
   var canvas = args.canvas;  /* Our main display canvas. */
   var canvasContainerDiv = args.canvasContainerDiv;
   
   /* GAME LOOP */
   var intervalID = 0;        /* A reference to our game loop */
   
   /* GAME MODEL */
   var model = new GameModel.Model({demandPaintCallback:render,deploymentFolder:args.deploymentFolder,isLocal:args.isLocal,
                                             isDebug:args.isDebug,tickDurationMS:TICK_FRAME_INTERVAL_MS,canvas:canvas,
                                             fontBaseSize:args.fontBaseSize, fontFamily:args.fontFamily});
   
   /********************/
   /* PUBLIC FUNCTIONS */
   /********************/
   /* Once our program has been initialized, kick it off.  Basically start the game loop. */
   this.start = function()
   {
      Debug.Log.logMessage("(Main) Application started.");
      
      /* Listen for resize event: http://stackoverflow.com/questions/4037212/html-canvas-full-screen.  
         Also call function to initialize. */
      windowResized();
      window.addEventListener("resize", windowResized, false);
      
      model.painter.updateDisplayInformation(ASPECT_RATIO, IDEAL_WIDTH, IDEAL_HEIGHT);
      
      /* kick off the game loop, where most of our processing occurs */
      this.initiateGameLoop();
   };
   
   /* Start the game loop; this involves creating a timer which will fire at a certain interval */
   this.initiateGameLoop = function()
   {
      Debug.Log.logMessage("(Main) Initiating game loop.");
      /* Set up the game loop.  Runs ever TICK_FRAME_INTERVAL_MS milliseconds */
      intervalID = window.setInterval(gameLoop.bind(this), TICK_FRAME_INTERVAL_MS);
   };
   
   /*********************/
   /* PRIVATE FUNCTIONS */
   /*********************/
   /* The core game loop */
   function gameLoop()
   {
      try
      {
         model.applyInput();
         model.tickFrame();
         render();
      }
      catch(exception)
      {
         Debug.Log.trace(); /* Trace is generally not very helpful in this particular context; doesn't return much beyond just calling "gameLoop" */
         Debug.Log.logError("Core game loop exception: " + exception + ".  Stopping game loop.");
         window.clearInterval(intervalID); /* Stop the timer so we don't output a million errors.  Game is hosed at this point. */
      }
   }
   
   /* Completely redraw screen */
   function render()
   {
      model.painter.drawToScreen();
   }
   
   /* The window has resized; perform any necessary functionality */
   function windowResized()
   {
      //The client height and width don't seem the most reliable, especially when I manually set the canvas container div's height & width explicitly.
      //canvas.width = canvasContainerDiv.clientWidth;
      //canvas.height = canvasContainerDiv.clientHeight;
      
      // parseInt will remove any "px" from the width and height.
      canvas.width = parseInt(canvasContainerDiv.style.width);
      canvas.height = parseInt(canvasContainerDiv.style.height);
      model.painter.updateDisplayInformation(ASPECT_RATIO, IDEAL_WIDTH, IDEAL_HEIGHT);
   }
   
   /************************/
   /* INITIALIZATION LOGIC */
   /************************/
   function initialize()
   {
      Debug.Log.enabled = args.isDebug;
      /* Below needs to be set in order for the canvas to accept user keyboard input. 
         http://www.dbp-consulting.com/tutorials/canvas/CanvasKeyEvents.html */
      canvas.setAttribute('tabindex', '0');
      canvas.focus();
   }
   
   initialize();
}