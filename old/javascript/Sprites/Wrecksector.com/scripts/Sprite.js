/*
 * Author: Rich Bateman
 * Module: Sprite
 * -Used for defining animations, sprite sheets, and sprite instances.
 */
 
 /* UNIVERSAL ANIMATIONS:
   Default: Only displays the top left cell in a spritesheet.
   Cell_XN_YM: Displays the cell specified by coordinate N,M
   RowN: Animates through cells in a row
   RowReverseN: Animates through cells in a row, backwards
   RowWithReverseN: Animates through cells in the row left to right, then right to left (not repeating the last or first cell when going backwards)
   ColN: Animates through the cells in a column.
   ColReverseN: Animates through the cells in a column, backwards
   ColWithReverseN: Animates through cells in the column left to right, then right to left (not repeating the last or first cell when going backwards)
 */
 
/*************/
/* NAMESPACE */
/*************/
var Sprite = {};

Sprite.Constants =
{
   DEFAULT_ANIMATION_KEY: "DEFAULT", /* The name of the key for the DEFAULT animation for a sprite. */
   DEFAULT_ANIMATION_TICK_DELAY: 6, /* By default, each frame of animation lasts 6 ticks. */
};

/* A class that will spawn sprite instances for you.  Sprite Instances are based off sprite sheets.
   Think of the Sprite.Factory as a manager of sprites; it will create them for you. You should not be 
   directly creating new Sprite Instances. */
Sprite.Factory = function(args)
{
   /******************/
   /* PUBLIC MEMBERS */
   /******************/
   this.Animations = new Util.Set();
   this.SpriteSheets = new Util.Set();
   
   /*******************/
   /* PRIVATE MEMBERS */
   /*******************/
   var that = this;

   /******************/
   /* PUBLIC METHODS */
   /******************/
   /* Adds a sprite sheet to the collection. */
   this.addSpriteSheet = function(spriteSheet)
   {
      this.SpriteSheets.add(spriteSheet);
   };
   
   /* Adds an animation to the internal collection. 
      key: unique key for this animation.
      category: to which category of spritesheets does this apply? animations are added to matching sprites at this time.
      indices: an array of {X,Y} structures that refer to specific frames on this category of sprite sheets. */
   this.addAnimation = function(key, category, indices)
   {
      var animation = new Sprite.Animation(
      {
         Key: key,
         Category: category,
         Frames: indices
      });
      this.Animations.add(animation);
      addAnimationToMatchingSpriteSheetsByCategory(animation);
   };
   
   /* Adds animations to every spritesheet that are pretty standard. */
   this.addUniversalAnimations = function()
   {
      this.SpriteSheets.resetPointer();
      while(this.SpriteSheets.next())
      {
         var spriteSheet = this.SpriteSheets.current();
         spriteSheet.addSystemAnimations();
      }
   };
   
   /* Creates a brand new sprite instance for this sprite sheet key.  It is aware of 
      its own animation state. */
   this.spawnSpriteInstance = function(spriteSheetKey)
   {
      Debug.Log.assertValue(spriteSheetKey, "Sprite.spawnSpriteInstance: given an undefined spriteSheetKey");
      var spriteSheet = this.SpriteSheets.getItemByKey(spriteSheetKey); Debug.Log.assertValue(spriteSheet, "Sprite.spawnSpriteInstance: failed to find a spritesheet with key <" + spriteSheetKey + ">");
      var spriteInstance = new Sprite.Instance(spriteSheet);
      return spriteInstance;
   };
   /*******************/
   /* PRIVATE METHODS */
   /*******************/
   /* Iterates over set of sprite sheets, and adds this animation if the category matches */
   function addAnimationToMatchingSpriteSheetsByCategory(animation)
   {
      spriteSheets.resetPointer();
      while(spriteSheets.next())
      {
         var spriteSheet = spriteSheets.current();
         if(spriteSheet.Category === animation.Category)
         {
            spriteSheet.addAnimation(animation);
         }
      }
   }
}


// Class: Instance
// -Represents one particular instance of a Sprite.Sheet
// -Knows its current animation frame, and when to update to the next frame in the animation.
Sprite.Instance = function(spriteSheet)
{
   /*********************/
   /* ARGUMENT CHECKING */
   /*********************/
   Debug.Log.assertValue(spriteSheet, "Attempting to create a new Sprite.Instance, but an undefined spriteSheet has been supplied.");
   
   /******************/
   /* PUBLIC MEMBERS */
   /******************/
   this.SpriteSheet           = spriteSheet;    // The spritesheet we're based on.
   this.CurrentAnimationKey   = Sprite.Constants.DEFAULT_ANIMATION_KEY; // By default, all Sprite Instances have a "Default" animation
   this.CurrentFrame          = 0;             // What frame of the current animation we're on.
   this.AnimationDelayCounter = 0; // How many ticks remain before we advance to the next frame.
   this.AnimationDelayOverride = 0; /* The override to use for tick delay.  Ignores frame-by-frame animation delay. */
   this.AnimationDelayOverrideSet = false; /* Whether the override is set. */
   this.AnimationCompleteCB = null; /* A callback function that can be called the first time an animation completes. */

   /*******************/
   /* PRIVATE MEMBERS */
   /*******************/
   var that = this;
   var AnimateOnce = false;
   var AnimatedOnce = false;
   var ContinueAnimating = true;
   
   /***********************/
   /* TICK-BASED UPDATING */
   /***********************/   
   this.tick = function()
   {
      if(ContinueAnimating)
      {
          this.AnimationDelayCounter--;
          if(this.AnimationDelayCounter < 0)
          {
              this.CurrentFrame++;
              var animation = this.SpriteSheet.Animations.getItemByKey(this.CurrentAnimationKey);
              if(animation !== null && animation !== undefined)
              {
                 if(this.CurrentFrame >= animation.Frames.length)
                 {
                     AnimatedOnce = true;
                     if(!AnimateOnce)
                     {
                        this.CurrentFrame = 0;
                     }
                     else
                     {
                        this.CurrentFrame = animation.Frames.length - 1;
                        ContinueAnimating = false;
                        /* If there's a callback to call once we finish animation cycle, fire it! */
                        if(this.AnimationCompleteCB !== null)
                        {
                           this.AnimationCompleteCB();
                           this.AnimationCompleteCB = null;
                        }
                     }
                 }
                 if(this.AnimationDelayOverrideSet)
                 {
                     this.AnimationDelayCounter = this.AnimationDelayOverride;
                 }
                 else
                 {
                     this.AnimationDelayCounter = animation.Frames[this.CurrentFrame].Delay;
                 }
              }
              else
              {
                  throw "Unknown animation type: " + this.CurrentAnimationKey
              }
          }
      }
   };
   
   /*************/
   /* ANIMATION */
   /*************/
   // Specifies what animation to use.  If the same as current animation, it won't change.
   // args:
   //    animationKey: The key of the animation you want to set.
   //    animateOnce (Optional): By default, this is TRUE, meaning the animation will loop once.  When false, animation will only loop continuously.
   //    animationDelayOverride: The animation delay to use for every frame in this animation.  If not set, the delay on each frame is used.
   this.setAnimation = function(args)
   {
      var animationKey = args.animationKey;
      var animateOnce = (args.animateOnce !== undefined && args.animateOnce !== null ? args.animateOnce : true);
      var animationDelayOverride = (args.animationDelayOverride !== undefined && args.animationDelayOverride !== null ? args.animationDelayOverride : -1);
      this.AnimationCompleteCB = (args.animationCompleteCB !== undefined ? args.animationCompleteCB : null);
      if(animationDelayOverride != -1)
      {
         this.setAnimationDelayOverride(animationDelayOverride);
      }
      
      if(this.CurrentAnimationKey !== animationKey)
      {
         Debug.Log.assertValue(this.SpriteSheet, "SpriteInstance: Attempting to set an animation when no sprite sheet is loaded.");
         var animation = this.SpriteSheet.Animations.getItemByKey(animationKey);
         Debug.Log.assertValue(animation, "Setting an invalid animation with key <" + animationKey + ">.  That animation doesn't exist in SpriteSheet<" + this.SpriteSheet.Key + ">");

         ContinueAnimating = true;
         AnimateOnce = animateOnce;
         this.CurrentAnimationKey = animationKey;
         if(this.AnimationDelayOverrideSet)
         {
            this.AnimationDelayCounter = this.AnimationDelayOverride;
         }
         else
         {
            this.AnimationDelayCounter = animation.Frames[0].Delay;
         }

         this.reset();
      }
   };
   
   /********************/
   /* ANIMATION DELAYS */
   /********************/
   this.setAnimationDelayOverride = function(tickDelay)
   {
      this.AnimationDelayOverride = tickDelay;
      this.AnimationDelayOverrideSet = true;
   };
   this.clearAnimationDelayOverride = function()
   {
      this.AnimationDelayOverrideSet = false;
   };
   
   /**************/
   /* DIMENSIONS */
   /**************/
   /* Returns the bounding box for this sprite sheet. */
   this.getBoundingBox = function()
   {
      return {width:this.SpriteSheet.CollisionWidth, height:this.SpriteSheet.FrameHeight * this.SpriteSheet.Scale};
   };
   // Returns the frame width and height.  Used for drawing.
   this.getFrameDims = function()
   {
      return {width:this.SpriteSheet.FrameWidth * this.SpriteSheet.Scale, height:this.SpriteSheet.FrameHeight * this.SpriteSheet.Scale};
   };
   
   /****************************/
   /* PUBLIC METHODS - QUERIES */
   /****************************/
   this.getCategory = function()
   {
      return this.SpriteSheet.Category;
   };
   this.getCollisionZones = function()
   {
      return this.SpriteSheet.CollisionZones;
   };
   this.getHitRegionOverride = function()
   {
      return this.SpriteSheet.HitRegionOverride;
   };

   /******************/
   /* PUBLIC METHODS */
   /******************/
   /* Returns the text color associated with this entity. */
   this.getTextColor = function()
   {
      return this.SpriteSheet.TextColor;
   };
   /* Returns the ENTIRE image for this sprite instance */
   this.getImage = function()
   {
      return this.SpriteSheet.Image;
   };
   // You may provide an optional "dw,dh" if you want to scale the sprite to a specific set of dimensions
   this.draw = function(args)
   {
       var context = args.context;
       var dx      = args.dx;
       var dy      = args.dy;
       var scaleFactor = args.scaleFactor;
       var dw      = (args.dw === undefined ? this.SpriteSheet.FrameWidth * scaleFactor : args.dw);
       var dh      = (args.dh === undefined ? this.SpriteSheet.FrameHeight * scaleFactor : args.dh);
       
       this.SpriteSheet.draw(
           {
               context: context, 
               dx: dx, 
               dy: dy, 
               dw: dw, 
               dh: dh, 
               animationKey: this.CurrentAnimationKey, 
               animationIndex: this.CurrentFrame
           });
   };
   
   // This sprite instance will reset.  Useful for syncing up multiple sprite instances that need to run concurrently.
   this.reset = function()
   {
      AnimatedOnce = false;
      this.CurrentFrame = 0;
   };
   
   /* Returns information about any underlying spatial/collision info */
   this.getSpatialInfo = function()
   {
      var info =
      {
         collisionZones:   this.SpriteSheet.CollisionZones,
         coreRegion:       this.SpriteSheet.CoreRegion
      };
      return info;
   };

   /************************************/
   /* POST CONSTRUCTION INITIALIZATION */
   /************************************/
   function initialize()
   {
      Debug.Log.assertValue(that.AnimationDelayCounter, "Sprite Instance Animation Delay Counter is undefined..");
   }
   initialize();
}


/********************************************************************* 
 * Simple class that defines the frames of an animation, and delay   * 
 * for each frame.                                                   * 
 *********************************************************************/
Sprite.Animation = function(args)
{
   /******************/
   /* PUBLIC MEMBERS */
   /******************/
   this.Key = args.Key;             /* Unique key for this animation. */
   this.Category = args.Category;   /* To which category does this animation belong? */
   this.Frames = args.Frames;       /* An array of X/Y coordinates (frame positions on sprite sheet); may include an optional DELAY. */
   
   /*******************/
   /* PRIVATE MEMBERS */
   /*******************/
   var that = this;
   
   /******************/
   /* PUBLIC METHODS */
   /******************/
   this.addFrame = function(x, y, animDelay)
   {
      var animDelayToUse = (animDelay !== null && animDelay !== undefined ? animDelay : Sprite.Constants.DEFAULT_ANIMATION_TICK_DELAY);
      var pos = {X:x,Y:y,Delay:animDelayToUse};
      this.Frames.push(pos);
   };
   
   /************************************/
   /* POST-CONSTRUCTION INITIALIZATION */
   /************************************/
   function initialize()
   {
      Debug.Log.assertValue(that.Key, "Animation created without key.");
      Debug.Log.assertValue(that.Category, "Animation<" + that.Key + "> created without a Category.");
      Debug.Log.assert((that.Category.length > 0), "Animation<" + that.Key + "> created with a blank Category.");
      Debug.Log.assertValue(that.Frames, "Animation<" + that.Key + "> created without a Frames array.");
   }
   
   initialize();
}

/********************************************************************* 
 * Defines an image which is constructed as a spritesheet.           * 
 *********************************************************************/
Sprite.Sheet = function()
{
   /******************/
   /* PUBLIC MEMBERS */
   /******************/
   this.Category       = null;   /* Allows you to classify this sprite sheet as belonging to a certain category. */
   this.Key            = null;   /* A unique key for this sprite sheet. */     
   this.Image          = null;   /* The actual image, pixels & all, of this sprite sheet. */
   this.ImageKey       = null;   /* The key for the image to load for this sprite sheet. */
   this.NumFramesX     = null;   /* The number of frames going from left to right. */
   this.NumFramesY     = null;   /* The number of frames going from top to bottom. */
   this.BorderWidth    = null;   /* The width (can be 0) of any border between frames. */
   this.FrameWidth     = null;   /* How wide is each frame, LESS the BorderWidth? */
   this.FrameHeight    = null;   /* How high is each frame, LESS the BorderWidth? */
   this.Scale          = null;   /* An additional scale to apply when drawing this image to the screen. */
   this.CollisionWidth = null;   /* The width of the bounding box of one frame. */
   this.Animations     = new Util.Set(); // An associative array, where strings refer to Sprite Animations.

   /*******************/
   /* PRIVATE MEMBERS */
   /*******************/
   var that = this;
   
   /******************/
   /* INITIALIZATION */
   /******************/
   /* Sets the actual image file into this sprite sheet.  Allows us to figure out the frame width and height. */
   this.initializeWithImage = function(image)
   {
      this.Image          = image;
      this.FrameWidth     = (this.Image.width  - this.BorderWidth)/this.NumFramesX - this.BorderWidth;
      this.FrameHeight    = (this.Image.height - this.BorderWidth)/this.NumFramesY - this.BorderWidth;
      if(this.CollisionWidth === null)
      {
         this.CollisionWidth = this.FrameWidth * this.Scale;
      }
      
      Debug.Log.assertValue(this.Image, "Attempted to draw without having an image.");
      Debug.Log.assertValue(this.FrameWidth, "A SpriteSheet<" + this.Key + "> has been created without a frame width.");
      Debug.Log.assertValue(this.FrameHeight, "A SpriteSheet<" + this.Key + "> has been created without a frame height.");
   };
   
   /* Given this spritesheet, adds all system-defined animations. */
   this.addSystemAnimations = function()
   {
      addAnimDefault();
      addAnimEachRow();
      addAnimEachCol();
      addAnimEachCell();
      addAnimComplete();
   }
   
   /***********/
   /* DRAWING */
   /***********/
   /* Simply draws a frame of a spritesheet, without concern for animation.  Also draws from a top left coordinate, not a base position. */
   this.drawFrame = function(args)
   {
      var context         = args.context;         // The drawing context
      var sourceFrame     = args.frame;           // Which frame are we drawing
      var dx              = args.dx;              // Destination x-coordinate
      var dy              = args.dy;              // Destination y-coordinate
      var dw              = args.dw;              // The destination width
      var dh              = args.dh;              // The destination height
      
      Debug.Log.assertValue(context, "No context provided.");
      Debug.Log.assertValue(sourceFrame, "No source frame provided.");
      Debug.Log.assertNumber(dx, "No dx provided.");
      Debug.Log.assertNumber(dy, "No dy provided.");
      Debug.Log.assertNumber(dw, "No dw provided.");
      Debug.Log.assertNumber(dh, "No dh provided.");
      
      var sourceX = (sourceFrame.X * (this.FrameWidth + this.BorderWidth)) + this.BorderWidth;
      var sourceY = (sourceFrame.Y * (this.FrameHeight + this.BorderWidth)) + this.BorderWidth;

      context.drawImage(this.Image, sourceX, sourceY, 
         this.FrameWidth, this.FrameHeight,
        dx, dy, dw, dh);
   };
   this.draw = function(args)
   {
      // CHECK ARGUMENTS!
      if(args.animationKey === undefined) {throw "Sprite.Sheet.draw, animationKey is undefined.";}
      if(args.animationKey.length === 0) {throw "Sprite.Sheet.draw, animationKey is empty.";}
      if(args.animationIndex === undefined) {throw "Sprite.Sheet.draw, animationIndex is undefined.";}
      if(args.context === undefined) {throw "Sprite.Sheet.draw, context is undefined.";}
      if(args.dx === undefined) {throw "Sprite.Sheet.draw, dx is undefined.";}
      if(args.dy === undefined) {throw "Sprite.Sheet.draw, dy is undefined.";}
      if(args.dw === undefined) {throw "Sprite.Sheet.draw, dw is undefined.";}
      if(args.dh === undefined) {throw "Sprite.Sheet.draw, dh is undefined.";}
      
      var animationKey    = args.animationKey;    // The key for the animation to draw
      var animationIndex  = args.animationIndex;  // What part of the animation are we on?
      var context         = args.context;         // The drawing context
      var dx              = args.dx;              // Destination x-coordinate
      var dy              = args.dy;              // Destination y-coordinate
      var dw              = args.dw;              // The destination width
      var dh              = args.dh;              // The destination height

      var spriteAnimation = this.Animations.getItemByKey(animationKey); 
      Debug.Log.assertValue(spriteAnimation, "Unable to find sprite animation with key <" + animationKey + ">");

      var frame = spriteAnimation.Frames[animationIndex];

      var sourceX = (frame.X * (this.FrameWidth + this.BorderWidth)) + this.BorderWidth;
      var sourceY = (frame.Y * (this.FrameHeight + this.BorderWidth)) + this.BorderWidth;
      var destX = dx - dw/2; //this.FrameWidth/2;
      var destY = dy - dh;   //this.FrameHeight;

      context.drawImage(this.Image, sourceX, sourceY, this.FrameWidth, this.FrameHeight,
        destX, destY, dw, dh);
   }
   
   /*******************************/
   /* GENERATE DEFAULT ANIMATIONS */
   /*******************************/
   /* Adds a DEFAULT animation; just a single frame completely still animation using the 0,0 cell */
   function addAnimDefault()
   {
      var animation = new Sprite.Animation(
      {
         Key: Sprite.Constants.DEFAULT_ANIMATION_KEY,
         Category: "UNIVERSAL",
         Frames: [{X:0,Y:0}]
      });
      that.Animations.add(animation);
   }
   
   // Adds Three Kinds of Animations:
   // RowX (where X is 0,1,2... row index)
   //    -Starts at left frame, moves toward right, then loops
   // RowReverseX
   //    -Starts at right frame, moves toward left, then loops
   // RowWithReverseX
   //    -Starts at left frame, moves to right, then goes back to left, then loops.
   function addAnimEachRow()
   {
      var animation = null;
      var animationWithReverse = null;
      for(var rowIndex = 0; rowIndex < that.NumFramesY; rowIndex++)
      {
         animation = new Sprite.Animation({Key: "Row" + rowIndex, Category:"UNIVERSAL",Frames:[]});
         animationWithReverse = new Sprite.Animation({Key: "RowWithReverse" + rowIndex, Category:"UNIVERSAL",Frames:[]});
         for(var colIndex = 0; colIndex < that.NumFramesX; colIndex++)
         {
            animation.addFrame(colIndex, rowIndex);
            animationWithReverse.addFrame(colIndex,rowIndex);
         }
         that.Animations.add(animation);

         animation = new Sprite.Animation({Key: "RowReverse" + rowIndex, Category:"UNIVERSAL",Frames:[]});
         for(var colIndex = that.NumFramesX - 1; colIndex >= 0; colIndex--)
         {
            animation.addFrame(colIndex, rowIndex);
            if(colIndex != that.NumFramesX - 1 && colIndex != 0)
            {
               animationWithReverse.addFrame(colIndex,rowIndex);
            }
         }
         
         that.Animations.add(animation);
         that.Animations.add(animationWithReverse);
      }
   }
   /* Adds a standard and reverse animation consisting of all cells in each column */
   function addAnimEachCol()
   {
      var animation = null;
      for(var colIndex = 0; colIndex < that.NumFramesX; colIndex++)
      {
         animation = new Sprite.Animation({Key: "Col" + colIndex, Category:"UNIVERSAL", Frames:[]});
         for(var rowIndex = 0; rowIndex < that.NumFramesY; rowIndex++)
         {
            animation.addFrame(colIndex, rowIndex);
         }
         that.Animations.add(animation);

         animation = new Sprite.Animation({Key: "ColReverse" + colIndex, Category:"UNIVERSAL", Frames:[]});
         for(var rowIndex = that.NumFramesY - 1; rowIndex >= 0; rowIndex--)
         {
            animation.addFrame(colIndex, rowIndex);
         }
         that.Animations.add(animation);
      }
   }
   /* Adds a single-framed animation for each cell */
   function addAnimEachCell()
   {
      for(var rowIndex = 0; rowIndex < that.NumFramesY; rowIndex++)
      {
         for(var colIndex = 0; colIndex < that.NumFramesX; colIndex++)
         {
            var animation = new Sprite.Animation({Key: "Cell_X" + colIndex + "_Y" + rowIndex, Category:"UNIVERSAL", Frames:[]});
            animation.addFrame(colIndex, rowIndex);
            that.Animations.add(animation);
         }
      }
   }
   /* Creates an animation that uses every cell in each row, from left to right, top to bottom. */
   function addAnimComplete()
   {
      var animation = new Sprite.Animation({Key: "Complete", Category:"UNIVERSAL", Frames:[]});
      for(var rowIndex = 0; rowIndex < that.NumFramesY; rowIndex++)
      {
         for(var colIndex = 0; colIndex < that.NumFramesX; colIndex++)
         {
            animation.addFrame(colIndex, rowIndex);
         }
      }
      that.Animations.add(animation);
   }
}


