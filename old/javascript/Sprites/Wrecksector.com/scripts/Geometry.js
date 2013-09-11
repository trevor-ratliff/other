/*
 * Module: Geometry
 * -Handles 2D geometry.  Polygons, rectangles, points, etc.
 * -Can answer some questions useful for Pathing & Collision.
 * Dependencies: Util.js
 * Author: Rich Bateman
 * Site: wrecksector.com
 */

/*************/
/* NAMESPACE */
/*************/
var Geometry = {};

// Static Class: Geometry.Math2D
// Formulas useful in 2d geometry
Geometry.Math2D =
{
   // CONSTANTS
   EPSILON: 0.001, /* A small value used to help distinguish whether we should consider two floating point numbers equal. */
   DIR_N: "North",
   DIR_E: "East",
   DIR_S: "South",
   DIR_W: "West",

   // FUNCTIONS
   /* Converts an X,Y coordinate string into a coordinate object with X,Y properties. */
   parseCoordinateString: function(coordinateString)
   {
      if(coordinateString.indexOf(",") === -1) {throw "Comma missing in coordinate string: " + coordinateString;}
      var commaSplit = coordinateString.split(",");
      if(commaSplit.length !== 2) {throw "Coordinate string should only have one comma: " + coordinateString;}
      var coordinate = 
      {
         X: parseInt(commaSplit[0]),
         Y: parseInt(commaSplit[1])
      };
      return coordinate;
   },
   // Calculates the angle, in RADIANS, from one point to another.
   angleFromPointToPoint: function(x1, y1, x2, y2)
   {
      return Math.atan2(y2 - y1, x2 - x1);
   },
   // Returns a structure defining the X & Y components of a velocity.
   deriveVelocityXY: function(velocity, angleInRads)
   {
      var velX = Math.cos(angleInRads) * velocity;
      var velY = Math.sin(angleInRads) * velocity;
      return {VelX: velX, VelY: velY};
   },
   /* Determines the X & Y components of velocity give a start and end position. */
   deriveVelocityXYFromHereToThere: function(velocity, positionBase, positionGoal)
   {
      var angleInRads = Geometry.Math2D.angleFromPointToPoint(positionBase.X, positionBase.Y, positionGoal.X,positionGoal.Y);
      var velX = Math.cos(angleInRads) * velocity;
      var velY = Math.sin(angleInRads) * velocity;
      return {VelX: velX, VelY: velY};
   },
   // Returns the direction from one point to the other
   directionFromPointToPoint: function(x1, y1, x2, y2)
   {
      var angleInRads = Geometry.Math2D.angleFromPointToPoint(x1, y1, x2, y2);
      var direction = Geometry.Math2D.mapAngleToDirection(angleInRads);
      return direction;
   },
   // Calculates the euclidean distance between two points.
   euclideanDistance: function(x1, y1, x2, y2)
   {
      var distance = Math.sqrt( Math.pow( (x2-x1), 2 ) + Math.pow( (y2-y1) , 2 ) );
      return distance;
   },
   // Maps an angle (In Radians) to a cardinal direction.
   mapAngleToDirection: function(angleInRads)
   {
      var direction;
      if (angleInRads >= -Math.PI / 4 && angleInRads <= Math.PI / 4)
      {
         direction = Geometry.Math2D.DIR_E;
      }
      else if (angleInRads >= Math.PI / 4 && angleInRads <= Math.PI * 3.0 / 4.0)
      {
         direction = Geometry.Math2D.DIR_S;
      }
      else if (angleInRads <= -Math.PI / 4 && angleInRads >= -Math.PI * 3.0 / 4.0)
      {
         direction = Geometry.Math2D.DIR_N;
      }
      else
      {
         direction = Geometry.Math2D.DIR_W;
      }

      return direction;
    },
    pythSideC: function(sideA, sideB)
    {
      var sideC = Math.sqrt(Math.pow(sideA,2) + Math.pow(sideB,2));
      return sideC;
    },
   // Given a desired aspect ratio (like 4:3) and a source rectangle, 
   // returns the LARGEST rectangle that will fit with the desired ratio, and will center it.
   getLargestRectangle: function(desiredWidthOverHeightRatio, sourceRect)
   {
      // Assume we'll draw destination display rectangle starting at 0,0 
      // (meaning the rectangle matches our ideal aspect ratio)
      var largestRect = {X:0, Y:0, W:sourceRect.W, H:sourceRect.H};

      // What's current ratio of source rectangle
      var clientRatio = (sourceRect.W) / sourceRect.H;

      // i.e, the source rectangle is wider than we would like
      if (clientRatio > desiredWidthOverHeightRatio)
      {
          // Adjust the width and the starting x position
          largestRect.W = sourceRect.H * desiredWidthOverHeightRatio;
          largestRect.X = ((sourceRect.W) - largestRect.W) / 2;
      }
      // i.e., the source rectangle is taller than we would like
      else if (clientRatio < desiredWidthOverHeightRatio)
      {
          // Adjust the height and the starting y position
          largestRect.H = sourceRect.W / desiredWidthOverHeightRatio;
          largestRect.Y = ((sourceRect.H) - largestRect.H) / 2;
      }

      return largestRect;
   },
   // Returns true if the following x,y coordinate is in the rectangle provided
   // RectX & RectY refer to the TOP LEFT corner of the rectangle.
   isPointInRectangle: function(xTest,yTest, rectX, rectY, rectW, rectH)
   {
      var pointInside = 
         (xTest >= rectX 
         && xTest <= rectX + rectW
         && yTest >= rectY
         && yTest <= rectY + rectH);
      return pointInside;
   },
   // Returns true if the following x,y coordinate is in the rectangle provided
   // RectX & RectY refer to the BASE of the rectangle (middle bottom)
   isPointInRectangleBaseXY: function(xTest,yTest, rectX, rectY, rectW, rectH)
   {
      var pointInside = 
         (xTest >= rectX - rectW/2 
         && xTest <= rectX + rectW/2
         && yTest >= rectY - rectH
         && yTest <= rectY);
      return pointInside;
   },
}

// Class: Line Segment.
// Represents two points connected by a line.
// In WreckSector, I generally only care about vertical or horizontal lines (easier to work with)
Geometry.LineSegment = function(x1, y1, x2, y2)
{
   // PUBLIC MEMBERS
   this.PointStart = {X:x1,Y:y1};
   this.PointEnd   = {X:x2,Y:y2};
   
   // PUBLIC API
   // Gives you the mid point of this linesegment.
   this.getMidPoint = function()
   {
      var midx = (this.PointStart.X + this.PointEnd.X)/2;
      var midy = (this.PointStart.Y + this.PointEnd.Y)/2;
      var midPoint = {X:midx,Y:midy};
      return midPoint;
   }
   // Returns the eastern most point
   this.getEastmostPoint = function()
   {
      if(this.PointStart.X > this.PointEnd.X) 
         return this.PointStart;
      else
         return this.PointEnd;
   }
   // Returns the northern most point
   this.getNorthmostPoint = function()
   {
      if(this.PointStart.Y < this.PointEnd.Y) 
         return this.PointStart;
      else
         return this.PointEnd;
   }
   // Returns the southern most point.
   this.getSouthmostPoint = function()
   {
      if(this.PointStart.Y > this.PointEnd.Y) 
         return this.PointStart;
      else
         return this.PointEnd;
   }
   // Returns the west most point
   this.getWestmostPoint = function()
   {
      if(this.PointStart.X < this.PointEnd.X) 
         return this.PointStart;
      else
         return this.PointEnd;
   }
   // Returns TRUE iff this line is horizontal.
   this.isHorizontal = function()
   {
      var isHorizontal = (this.PointStart.Y - this.PointEnd.Y === 0);
      return isHorizontal;
   }
   // Returns TRUE iff line is vertical
   this.isVertical = function()
   {
      var isVertical = (this.PointStart.X - this.PointEnd.X === 0);
      return isVertical;
   }
   // Returns true if the provided point is within the X range of this line segment
   this.isPointWithinXRange = function(point)
   {
      var eastPoint = this.getEastmostPoint();
      var westPoint = this.getWestmostPoint();
      var isInRange = (point.X >= westPoint.X && point.X <= eastPoint.X);
      return isInRange;
   }
   // Returns true if the provided point is within the Y range of this line segment
   this.isPointWithinYRange = function(point)
   {
      var southPoint = this.getSouthmostPoint();
      var northPoint = this.getNorthmostPoint();
      var isInRange = (point.Y >= northPoint.Y && point.Y <= southPoint.Y);
      return isInRange;
   }
   // Returns the length of this line.
   this.length = function()
   {
      var length = Geometry.Math2D.euclideanDistance(this.PointStart.X, this.PointStart.Y, this.PointEnd.X, this.PointEnd.Y);
      return length;
   }
}

/* A rectangle.  Useful to use this when dealing exclusively with rectangles.
   Takes X,Y,W,H, but also provides North,East,South,West values for convenience. */
Geometry.Rectangle = function(args)
{
   /******************/
   /* PUBLIC MEMBERS */
   /******************/
   this.X     = (args.X === undefined ? null : args.X);
   this.Y     = (args.Y === undefined ? null : args.Y);
   this.W     = (args.W === undefined ? null : args.W);
   this.H     = (args.H === undefined ? null : args.H);

   /*******************/
   /* PRIVATE MEMBERS */
   /*******************/
   var that = this;

   /**************/
   /* PUBLIC API */
   /**************/
   /* Returns a new rectangle that combines the attributes of this and the other rectangle. */
   this.add = function(otherRectangle)
   {
      return new Geometry.Rectangle({
         X:this.X + otherRectangle.X,
         Y:this.Y + otherRectangle.Y,
         W:this.W + otherRectangle.W,
         H:this.H + otherRectangle.H
         });
   };
   
   /* Returns a new rectangle that combines the X & Y positions of each rectangle, but the width and the height of the source rectangle. */
   this.addPosition = function(otherRectangle)
   {
      return new Geometry.Rectangle({
         X:this.X + otherRectangle.X,
         Y:this.Y + otherRectangle.Y,
         W:this.W,
         H:this.H
         });
   };
   
   // Returns true if the other Rectangle collides with this one; otherwise returns false.
   // You can pass a flag whether to include borders.  
   // If we do include borders, if the borders overlap, it counts as a collision.
   // If you exclude borders, the rectangles must penetrate into one another.
   this.collidesWith = function(otherRectangle, includeBorders)
   {
      var collides = false;
      
      var left1    = this.West;
      var left2    = otherRectangle.West;
      var right1    = this.East;
      var right2    = otherRectangle.East;
      var top1    = this.North;
      var top2    = otherRectangle.North;
      var bottom1 = this.South;
      var   bottom2 = otherRectangle.South;

      // If any of the 4 subconditions is true, the two rectangles cannot possibly intersect.
      // If they're all false, they do collide.
      // If we're including borders, we mustn't include the "or equals"...
      // If we want overlapping borders to count as intersecting, to not intersect, the two sides mustn't be the same for a subcondition to disqualify a rectangle.
      if(includeBorders)
      {
         collides = 
            (!(
            (bottom1 < top2)    ||
            (top1    > bottom2) ||
            (right1  < left2)   ||
            (left1   > right2)
            ));
      }
      else
      {
         collides = 
            (!(
            (bottom1 <= top2)    ||
            (top1     >= bottom2) ||
            (right1  <= left2)   ||
            (left1     >= right2)
            ));
      }
         
      return collides;
   };

   // Takes the given rectangle and crops it so that it resides entirely within this Rectangle.
   this.cropWithinBounds = function(otherRect)
   {
      var numPoints = otherRect.Points.count();
      for(var pointIndex = 0; pointIndex < numPoints; pointIndex++)
      {
         var point = otherRect.Points.getPointAt(pointIndex);
         // If point is beyond base, correct it.
         if(point.X < this.West)  { point.X = this.West; }
         if(point.X > this.East)  { point.X = this.East; }
         if(point.Y < this.North) { point.Y = this.North; }
         if(point.Y > this.South) { point.Y = this.South; }
      }
      
      if(otherRect.North < this.North) {otherRect.North = this.North};
      if(otherRect.South > this.South) {otherRect.South = this.South};
      if(otherRect.West < this.West)   {otherRect.West = this.West};
      if(otherRect.East > this.East)   {otherRect.East = this.East};
   };

   // Returns TRUE iff the other rectangle is equal to this one (basically consists of the same coordinates.
   this.equals = function(otherRect)
   {
      var rectsEqual = 
         (
            this.North  === otherRect.North &&
            this.East   === otherRect.East &&
            this.South  === otherRect.South &&
            this.West   === otherRect.West
         );
      return rectsEqual;
   };

   // Returns the height of this rectangle.
   this.getHeight = function()
   {
      var height = this.LowerRight.Y - this.UpperRight.Y;
      return height;
   };

   // Returns the width of this rectangle
   this.getWidth = function()
   {
      var width = this.UpperRight.X - this.UpperLeft.X;
      return width;
   };

   // Returns a Point representing the middle point of this rectangle.
   this.getMidPoint = function()
   {
      var midX = (this.UpperLeft.X + this.UpperRight.X)/2;
      var midY = (this.UpperLeft.Y + this.LowerLeft.Y)/2;
      var midPoint = {X:midX, Y:midY};
      return midPoint;
   }

   // Returns true iff this point is one of the corners of this rectangle
   this.isPointACorner = function(testpoint)
   {
      var isNE = (testpoint.X === this.East && testpoint.Y === this.North);
      var isNW = (testpoint.X === this.West && testpoint.Y === this.North);
      var isSE = (testpoint.X === this.East && testpoint.Y === this.South);
      var isSW = (testpoint.X === this.West && testpoint.Y === this.South);
      
      return (isNE || isNW || isSE || isSW);
   }
   // Returns true iff the test point is within the bounds of this rectangle.
   // Specify whether this test should include borders.
   this.isPointInside = function(testpoint, includeBorders)
   {
      var satisfiesWest  = false;
      var satisfiesEast  = false;
      var satisfiesNorth = false;
      var satisfiesSouth = false;
      
      if(includeBorders)
      {
         satisfiesWest  = (testpoint.X >= this.West);
         satisfiesEast  = (testpoint.X <= this.East);
         satisfiesNorth = (testpoint.Y >= this.North);
         satisfiesSouth = (testpoint.Y <= this.South);
      }
      else 
      {
         // If we're excluding borders, then you must not lie on a border!
         satisfiesWest  = (testpoint.X > this.West);
         satisfiesEast  = (testpoint.X < this.East);
         satisfiesNorth = (testpoint.Y > this.North);
         satisfiesSouth = (testpoint.Y < this.South);
      }
   
      return (satisfiesWest && satisfiesEast && satisfiesNorth && satisfiesSouth);
   }

   // Returns true if this rectangle completely overlaps/covers the argument rectangle
   this.surroundsOtherRect = function(otherRect)
   {
      var surroundsOther = 
         (
            this.North <= otherRect.North &&
            this.East  >= otherRect.East  &&
            this.South >= otherRect.South &&
            this.West  <= otherRect.West
         );
      return surroundsOther;
   }

   /************************************/
   /* POST-CONSTRUCTION INITIALIZATION */
   /************************************/
   function initialize()
   {
      Debug.Log.assertValue(that.X, "Rectangle created without an X");
      Debug.Log.assertValue(that.Y, "Rectangle created without an Y");
      Debug.Log.assertValue(that.W, "Rectangle created without an W");
      Debug.Log.assertValue(that.H, "Rectangle created without an H");
      
      /*******************/
      /* DERIVED MEMBERS */
      /*******************/
      that.North = that.Y;
      that.East  = that.X + that.W;
      that.South = that.Y + that.H;
      that.West  = that.X;

      that.UpperLeft  = {X:that.West, Y:that.North};
      that.UpperRight = {X:that.East, Y:that.North};
      that.LowerRight = {X:that.East, Y:that.South};
      that.LowerLeft  = {X:that.West, Y:that.South};
      
      that.Points = new Geometry.PointSet();
      that.Points.addPoint(that.UpperLeft);
      that.Points.addPoint(that.UpperRight);
      that.Points.addPoint(that.LowerRight);
      that.Points.addPoint(that.LowerLeft);
   }
   
   initialize();
}

// Class: PointSet
// Represents a set of points.  
Geometry.PointSet = function()
{
   /******************/
   /* PUBLIC MEMBERS */
   /******************/
   this.points = [];

   /**************/
   /* PUBLIC API */
   /**************/
   // Adds a point to this set.
   this.addPoint = function(point)
   {
      this.points.push(point);
   };

   // Adds "point" to the set IF no point exists already with those coordinates (or very close)
   this.addPoint_Distinct = function(point)
   {
      if(!this.containsPoint(point))
      {
         this.addPoint(point);
      }
   };

   // Returns a deep copy of this PointSet
   this.clone = function()
   {
      var copy = new Geometry.PointSet();
      var numPoints = this.count();
      for(var pointIndex = 0; pointIndex < numPoints; pointIndex++)
      {
         var myPoint = this.points[pointIndex];
         var pointCopy = new Geometry.Point(myPoint.X, myPoint.Y);
         copy.addPoint(pointCopy);
      }

      return copy;
   }

   // Returns true IF this set of point contains the test point.
   this.containsPoint = function(testpoint)
   {
      var containsPoint = false;
      for(var pointIndex = 0; pointIndex < this.points.length; pointIndex++)
      {
         var currentPoint = this.points[pointIndex];
         if(testpoint.X === currentPoint.X && testpoint.Y === currentPoint.Y)
         {
            containsPoint = true;
            break;
         }
      }

      return containsPoint;
   }

   // The number of points in the set.
   this.count = function()
   {
      var numPoints = this.points.length;
      return numPoints;
   }
   
   // NOTE: This set of points must be sorted from top to bottom BEFORE calling this function.
   // This function will return the closest point DIRECTLY ABOVE the test point.
   this.getClosestPointAbove = function(testpoint)
   {
      var closestPointAbove = null;

      // Start with lowest point, then move your way upwards
      for(var pointIndex = this.points.length - 1; pointIndex >= 0; pointIndex--)
      {
         var currentPoint = this.points[pointIndex];
         if(testpoint.X === currentPoint.X && currentPoint.Y < testpoint.Y)
         {
            closestPointAbove = currentPoint;
            break;
         }
      }

      return closestPointAbove;
   }

   // NOTE: This set of points must be sorted from top to bottom BEFORE calling this function.
   // This function will return the closest point DIRECTLY BELOW the test point.
   this.getClosestPointBelow = function(testpoint)
   {
      var closestPointBelow = null;

      // Start with highest point, then move your way downwards
      for(var pointIndex = 0; pointIndex < this.points.length; pointIndex++)
      {
         var currentPoint = this.points[pointIndex];
         if(testpoint.X === currentPoint.X && currentPoint.Y > testpoint.Y)
         {
            closestPointBelow = currentPoint;
            break;
         }
      }

      return closestPointBelow;
   }

   // Return the point at index
   this.getPointAt = function(index)
   {
      var point = this.points[index];
      return point;
   }

   // Sorts the points first from North to South, then from West to East.
   this.sort_NtoS_WtoE = function()
   {
      this.points.sort(function(a, b) 
      {
         if(a.Y < b.Y)
         {
            return -1;
         }
         else if(a.Y > b.Y)
         {
            return +1;
         }
         else
         {
            if(a.X < b.X)
            {
               return -1;
            }
            else if(a.X > b.X)
            {
               return +1;
            }
            else
            {
               return 0;
            }
         }
      });
   }
}

// Class: Polygon
// Represents a polygon.
Geometry.Polygon = function()
{
   // PUBLIC MEMBERS
   this.Points = new Geometry.PointSet();

   // PUBLIC API
   // Adds a point given a Point object.  Doesn't make a copy.
   this.addPoint = function(point)
   {
      this.Points.addPoint_Distinct(point);
   }
   // Adds a point given its X & Y coordinate.
   this.addPointXY = function(x, y)
   {
      var point = {X:x, Y:y};
      this.Points.addPoint_Distinct(point);
   }
   // Creates a copy of this Polygon
   this.clone = function()
   {
      var copy = new Geometry.Polygon();
      var pointSetCopy = this.Points.clone();
      copy.setPoints(pointSetCopy);
      return copy;
   }

   // Returns true if the testpoint is one of the points making up the polygon.
   this.containsPoint = function(testpoint)
   {
      var doesContainPoint = this.Points.containsPoint(testpoint);
      return doesContainPoint;
   }

   // Returns true if, for every point in this polygon, there is an exact match in the other polygon.
   // Moreover, the number of points for each polygon must equal.
   this.equals = function(otherPolygon)
   {
      var equals = true;
      var myNumPoints = this.getNumPoints();
      if(myNumPoints !== otherPolygon.getNumPoints())
      {
         equals = false;
      }
      else
      {
         for(var myPointIndex = 0; myPointIndex < myNumPoints; myPointIndex++)
         {
            var myPoint = this.Points.getPointAt(myPointIndex);
            var otherContains = otherPolygon.Points.containsPoint(myPoint);
            if(!otherContains)
            {
               equals = false;
               break;
            }
         }
      }

      return equals;
   }

   // Returns a new point that is in the middle of this polygon.
   this.getCenterPoint = function()
   {
      var center = new Geometry.Point(0, 0);
      var xSum = 0;
      var ySum = 0;
      var numPoints = this.getNumPoints();

      for(var pointIndex = 0; pointIndex < numPoints; pointIndex++)
      {
         var point = this.Points.getPointAt(pointIndex);
         xSum += point.X;
         ySum += point.Y;
      }

      center.X = xSum/numPoints;
      center.Y = ySum/numPoints;

      return center;
   }

   // Returns the number of points that make up this Polygon
   this.getNumPoints = function()
   {
      var count = this.Points.count();
      return count;
   }
   
   // http://alienryderflex.com/polygon/
   // This function seems to work for very complicated polygons (convex & concave)
   // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
   // Also seems to be defined in the above web page.
   this.isPointXYInside = function(x, y)
   {
      var i=0;
      var j=this.getNumPoints() - 1;
      var polySides = this.getNumPoints();
      var isInside = false;
      
      for(i=0; i < polySides; i++)
      {
         var pointI = this.Points.getPointAt(i);
         var pointJ = this.Points.getPointAt(j);
         if(   (pointI.Y < y && pointJ.Y >= y)
            || (pointJ.Y < y && pointI.Y >= y))
         {
            if( (pointI.X + (y-pointI.Y)/(pointJ.Y-pointI.Y)*(pointJ.X-pointI.X)) < x)
            {
               isInside = !isInside;
            }
         }
         
         j = i;
      }

      return isInside;
   }

   // Returns true if the point is inside this polygon.
   // (Think this might only work for convex polygons... not sure)
   // I had difficulties with this function for convex polygons.
   /*
   this.isPointXYInside = function(x, y)
   {
      var numLeft = 0;
      var numRight = 0;
      var numPoints = this.getNumPoints();

      for(var lineIndex = 0; lineIndex < numPoints; lineIndex++)
      {
        var point0 = this.Points.getPointAt(lineIndex);
        var point1 = this.Points.getPointAt((lineIndex + 1) % numPoints);
        
        var sideCheck = (y - point0.Y) * (point1.X - point0.X) - (x - point0.X) * (point1.Y - point0.Y);
        if (sideCheck < 0)
            numRight++;
        else if (sideCheck > 0)
            numLeft++;
      }

      return (numLeft > 0 && numRight == 0 || numRight > 0 && numLeft == 0);
   }
   */

   // Sets the provided point set into this object.
   this.setPoints = function(pointSet)
   {
      this.Points = pointSet;
   }
}

// Class: Geometry.ParticleSystemOutward
// Represents a system of particles where pixels are constantly being emitted from the center,
// and expand outward, progressively changing color (based on origin & destination colors).
// Used as a background while game is loading & during episode selection... kinda proves the game is alive.
// args:
//    boundingHeight: the height of the available canvas.
//    boundingWidth: the width of the available canvas
//    originColor: an object containing R, G, and B values; represents color of pixel from origin
//    edgeColor: an object containing R,G,B values; represents color of pixel at edge.
//    numPixels: The number of pixels for this system to contain.
//    universeRadius: The radius of the universe; particles must traverse this distance before re-appearing at origin.
Geometry.ParticleSystemOutward = function(args)
{
   // PRIVATE VARS:
   var that = this;
   var boundingHeight = args.boundingHeight;
   var boundingWidth = args.boundingWidth;
   var originColor = args.originColor;
   var edgeColor = args.edgeColor;
   var numPixels = args.numPixels;
   var universeRadius = args.universeRadius;
   var particles = [];
   var VELOCITY_MIN = 0.500; //0.010;
   var VELOCITY_MAX = 6.000; //0.100;
   var PARTICLE_SIZE = 4;

   // PUBLIC API:
   // Initializes the system.  Note that not all pixels START at the origin.
   this.initialize = function()
   {
      for(var particleIndex = 1; particleIndex <= numPixels; particleIndex++)
      {
         var particle = 
         {
            Velocity: Math.random() * (VELOCITY_MAX - VELOCITY_MIN) + VELOCITY_MIN, // The speed at which this particle is traveling
            Theta: Math.random() * 2 * Math.PI, // Angle, in radians, at which this particle is traveling
            Distance: Math.random() * universeRadius // Distance from the origin (center of the screen).  Expressed as a percentage (so 1 is the full distance)
         };
         particles.push(particle);
      }
   }
   
   // Updates the system; each particle will move its velocity, and possibly re-appear at the origin.
   this.tick = function()
   {
      for(var particleIndex = 0; particleIndex < particles.length; particleIndex++)
      {
         var particle = particles[particleIndex];
         particle.Distance += particle.Velocity;
         if(particle.Distance > universeRadius)
         {
            particle.Distance = particle.Distance - universeRadius;
         }
         // Update the particle's X & Y positions based on distance; add by half of 
         // bounding box to shift particles toward the center.
         particle.X = Math.cos(particle.Theta) * particle.Distance + boundingWidth/2;
         particle.Y = Math.sin(particle.Theta) * particle.Distance + boundingHeight/2;
      }
   }
   
   // Draws this particle system.
   // args:
   //    context: the drawing context
   this.draw = function(context)
   {
      for(var particleIndex = 0; particleIndex < particles.length; particleIndex++)
      {
         var particle = particles[particleIndex];
         var particleColor = deriveParticleColor(particle);
         context.fillStyle = particleColor;
         context.fillRect(
            particle.X, 
            particle.Y,
            PARTICLE_SIZE,
            PARTICLE_SIZE
            );
      }

   }
   
   // PRIVATE METHODS
   // Given the amount of distance a particle has traveled, a color is derived based on the origin and edge colors.
   // Basically, if the origin red is 100, and the edge red is 200, and you've traveled halfway, the particle's
   // red value will be 150.
   function deriveParticleColor(particle)
   {
      var distanceTraveled = (particle.Distance > universeRadius ? universeRadius : particle.Distance);
      var percentDistanceTraveled = 1 - (universeRadius - distanceTraveled)/universeRadius;
      
      var redSpan = edgeColor.R - originColor.R;
      var greenSpan = edgeColor.G - originColor.G;
      var blueSpan = edgeColor.B - originColor.B;
      
      var redColor = Math.floor(originColor.R + redSpan * percentDistanceTraveled);
      var greenColor = Math.floor(originColor.G + greenSpan * percentDistanceTraveled);
      var blueColor = Math.floor(originColor.B + blueSpan * percentDistanceTraveled);
      
      var color = "rgba(" + redColor + "," + greenColor + "," + blueColor + ",1)";
      
      return color;
   }
}

/* Geometry.js Notes
-2011.04.23: I had originally created a "Point" class with an "equalsPoint" method; 
   The PointSet class called this method when doing its "containsPoint" function.  I discovered, however,
   that the Point class seemed to eat up a ton of memory, and that calls to "containsPoint" where freakishly slow.
   Eliminating the point class (and using a simple {X:n,Y:n} structure instead, and doing a direct equality check,
   seriously improved performance.  So... no Point class!

*/

