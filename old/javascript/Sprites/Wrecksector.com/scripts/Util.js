/*
 * Module: Util
 * -A library of useful, general, static functions
 * Dependencies: NONE
 * Author: Rich Bateman
 * Site: wrecksector.com
 */

/* Namespace: */
var Util = {};

// Represents a set of DISTINCT objects
// Functions as BOTH an associative array (indexed by key) and an indexed array (sorted by KEY)
// Also has a pointer to the current object (useful for iterating over)
// Objects only exist once, but are stored by rerefence internally in both an array and an associative array.
// Arguments:
//    keyPropertyName: The name of the property on passed in objects which stores its UNIQUE key.  By default, "Key" is used.
//       -NOTE: this property must exist on the root of this object.  Can't exist in some sub-object.
Util.Set = function(keyPropertyName)
{
   // PRIVATE MEMBERS
   var that = this;
   var index = [];      // The regular array
   var indexByKey = {}; // An associative array.
   var memberCount = 0; // The number of members in this set.
   var memberPointer = -1; // An index that represents which member we're currently pointed at.
   var keyPropertyName = (keyPropertyName === undefined ? "Key" : keyPropertyName); // The object member to expect that will contain the object's unique key.
   var sortFunctionCB = sortElementsByKey; /* Function to use when doing sorts; overrides default alphabetical by key sort */
   var NOT_FOUND = -1;
   
   // PUBLIC API
   // Adds an item to the collection.  IF it already exists, nothing changes, but nothing fails, either.
   // Must have a property specified when constructing the set which contains its unique key.
   this.add = function(item)
   {
      addItem(item, false);
   };
   // Adds an item to the collection.  IF it already exists, the old entry is overwritten.
   this.addWithOverwrite = function(item)
   {
      addItem(item, true);
   };
   
   // Changes the key on this item.  Removes the item from the Set, changes its Key,
   // and then re-adds it.
   this.changeKey = function(item, newKey)
   {
      this.remove(item.Key);
      item[keyPropertyName] = newKey;
      this.add(item);
   };
   
   // Wipes out all items in the set.
   this.clear = function()
   {
      index = [];
      indexByKey = {};
      memberCount = 0;
      memberPointer = -1;
   }
   
   // Efficient function that returns the number of elements in this set.
   this.count = function()
   {
      return memberCount;
   };
   // Returns a reference to the object to which we're currently pointing
   // Throws an exception if memberPointer isn't pointing to a valid item.
   this.current = function()
   {
      return index[memberPointer];
   }
   // Returns TRUE iff this key already exists in the collection
   this.exists = function(key)
   {
      var keyExists = (indexByKey[key] !== undefined);
      return keyExists;
   };
   // Returns the index of this location within the array
   this.getIndexOfItem = function(item)
   {
      // ASSERT
      if(item === undefined) {console.trace(); throw "Attempted to retrieve an index for an undefined item.";}
      
      var matchingIndex = binarySearch(item[keyPropertyName], 0, memberCount - 1);
      return matchingIndex;
   };
   // Returns the element at this index.  use current()/next() when iterating over, but you can use this to
   // to get a specific element.
   this.getItemByIndex = function(memberIndex)
   {
      return index[memberIndex];
   }
   // Returns the object by this key
   this.getItemByKey = function(key)
   {
      return indexByKey[key];
   };
   // Returns a random item
   this.getRandomItem = function()
   {
      var selection = Util.Random.randomNum(0, memberCount - 1);
      return index[selection];
   };
   /* Moves the member pointer to a random item. */
   this.goToRandom = function()
   {
      var selection = Util.Random.randomNum(0, memberCount - 1);
      memberPointer = selection;
   };
   // returns TRUE IFF this set is empty
   this.isEmpty = function()
   {
      return (memberCount === 0);
   };
   
   // Moves the member pointer to this specified index.
   this.movePointer = function(toIndex)
   {
      memberPointer = toIndex;
   };
   // Moves the member pointer to the index for this item
   this.movePointerToItem = function(item)
   {
      var indexOfItem = this.getIndexOfItem(item);
      memberPointer = indexOfItem;
   };
   // Moves to the next element in the array.  Returns TRUE if there's something there, else FALSE.
   // You may specify an optional "loop" parameter which means pointer will loop to start of list.
   this.next = function(loop)
   {
      memberPointer++;
      var elementExists = (memberPointer < index.length);
      if(loop && !elementExists) {memberPointer = 0; elementExists = (memberPointer < index.length);}
      return elementExists;
   };
   // Moves to the previous element in the array.  Returns TRUE if something's there, else FALSE
   // You may specify an optional "loop" parameter which means pointer will loop to end of list.
   this.prev = function(loop)
   {
      memberPointer--;
      var elementExists = (memberPointer < index.length && memberPointer >= 0);
      if(loop && !elementExists) {memberPointer = index.length - 1; elementExists = (memberPointer < index.length && memberPointer >= 0);}
      return elementExists;
   };
   // Removes the item with this key from the set.
   this.remove = function(key)
   {
      var matchingIndex = binarySearch(key, 0, memberCount - 1);
      // ASSERT
      if(matchingIndex === NOT_FOUND) {console.trace(); throw "Attempted to remove item with key (" + key + "), but it could not be found.";}
      this.removeAtIndex(matchingIndex);
   };
   
   // Removes the item at this index.
   this.removeAtIndex = function(indexPos)
   {
      // ASSERT
      if(indexPos < 0 || indexPos >= index.length) {console.trace(); throw "Specified an out-of-range index for the set.  indexPos: " + indexPos;}
      var item = this.getItemByIndex(indexPos);
      
      // ASSERT
      if(item === undefined) {console.trace(); throw "Attempted to remove an undefined item from a set.  indexPos: " + indexPos;}
      
      var itemKey = item[keyPropertyName];
      indexByKey[itemKey] = undefined;
      index.splice(indexPos, 1); // Purge this element.
      memberCount--;
   }
   
   // Resets the member pointer to the start of the list
   // You must call NEXT to move the member pointer to a valid element.
   this.resetPointer = function()
   {
      memberPointer = -1;
   };
   
   /* Specify a function to use when sorting elements in this set. */
   this.setSortFunction = function(sortFunction)
   {
      sortFunctionCB = sortFunction;
   };
   
   // Sorts the index using the provided function.  Sort function takes two parameters and returns +1,-1, or 0.
   this.sort = function(sortFunction)
   {
      index.sort(sortFunction);
   }
   
   // PRIVATE FUNCTIONS
   // Adds an item to the collection; an overwriteFlag indicates whether to overwrite existing entries
   // Any time an item is added, index is sorted!
   function addItem(item, overwriteFlag)
   {
      if(item === undefined) {console.trace(); throw "Attempted to add an undefined item to a set.";}
      
      var newItemKey = item[keyPropertyName];
      if(newItemKey === undefined) {console.trace(); throw "Util.Set.add: Attempted to add an item with an undefined Key!";}
      
      if(overwriteFlag || !that.exists(newItemKey))
      {
         indexByKey[newItemKey] = item;
         index.push(item);
         memberCount++;
         sortIndex();
      }
   }
   // Returns the index, or -1 if not found, of the object with this key.
   function binarySearch(searchingForKey, lowIndex, highIndex)
   {
      if(highIndex < lowIndex)
      {
         return NOT_FOUND;
      }
      var middleIndex = Math.floor(lowIndex + (highIndex - lowIndex)/2);
      var middleObject = index[middleIndex];
      
      // ASSERT
      if(middleObject === undefined) {console.trace(); throw "Undefined object during binary search.  Middle Index: " + middleIndex + 
         ", Parameters: (" + searchingForKey + ", " + lowIndex + ", " + highIndex + ")";}
      
      if(middleObject[keyPropertyName] > searchingForKey)
      {
         return binarySearch(searchingForKey, lowIndex, middleIndex - 1);
      }
      else if(middleObject[keyPropertyName] < searchingForKey)
      {
         return binarySearch(searchingForKey, middleIndex + 1, highIndex);
      }
      else
      {
         return middleIndex;
      }
   }
   // Sorts the index in order of keys.
   function sortIndex()
   {
      if(sortFunctionCB !== null)
      {
         index.sort(sortFunctionCB);
      }
   }
   /* A default sorting method that sorts by key names. */
   function sortElementsByKey(a, b)
   {
      if(a[keyPropertyName] < b[keyPropertyName])
      {
         return - 1;
      }
      else if(a[keyPropertyName] > b[keyPropertyName])
      {
         return +1;
      }
      else
      {
         return 0; // default
      }
   }
   
}

// Wrapper over local storage.
Util.Storage = 
{
   setItem: function(key, value)
   {
      localStorage.setItem(key, value);
   },
   getItem: function(key)
   {
      var value = localStorage.getItem(key);
      return value;
   },
   getItemBoolean: function(key)
   {
      var value = Util.Storage.getItem(key);
      var booleanValue = (value === "true");
      return booleanValue;
   },
   removeItem: function(key)
   {
      localStorage.removeItem(key);
   },
};

// Static Class: Util.Cookie
// Everything related to setting & retrieving cookies
Util.Cookie =
{
   // Retrieves a cookie
   // From: http://stackoverflow.com/questions/4173697/checking-for-cookie-on-page-load
   getCookie: function(cookieName)
   {
      var results = document.cookie.match ( '(^|;) ?' + cookieName + '=([^;]*)(;|$)' );
      if (results)
      {
         return (unescape(results[2])); // unescape (and escape) are standard functions for encoding and decoding strings.
      }
      else
      {
         return null;
      }
   },
   // Sets a cookie
   // From: http://www.blazonry.com/javascript/cookies_save.php
   setCookie: function(name, value, expires)
   {
      document.cookie = name + "=" + escape(value) + "; path=/" + ((expires == null) ? "" : "; expires=" + expires.toGMTString()); 
   },
   // Sets a cookie for a 3 year duraction.
   setCookieLongTerm: function(name, value)
   {
      var expiration = new Date();
      expiration.setTime(expiration.getTime() + (1000 * 60 * 60 * 24 * 365 * 3));
      Util.Cookie.setCookie(name, value, expiration);
   }
}

// Static Class: Util.Random
// Everything related to randomness!
Util.Random =
{
   // Given a percent chance of some event occurring (between 0 and 1), rolls the die, so-to-speak, and tells you whether
   // event occurred.
   chance: function(percentOfOccurrence)
   {
      // ASSERT
      if(percentOfOccurrence === undefined) {console.trace(); throw "Called Util.Random.chance with an undefined value.";}
      
      var eventOccurred = (Math.random() < percentOfOccurrence);
      return eventOccurred;
   },
   // Given the number of available options (0-based, so 3 options means the possible options are 0, 1, and 2),
   // and the number of choices to make (must be less), returns an array of the selected options.
   getListOfDistinctRandomSelections: function(numAvailableOptions, numChoices)
   {
      var choicesMade = [];
      var availableOptions = [];
      for(var optionIndex = 0; optionIndex < numAvailableOptions; optionIndex++) {availableOptions.push(optionIndex);}
      for(var choiceIndex = 0; choiceIndex < numChoices; choiceIndex++)
      {
         var selection = Util.Random.randomNum(0, availableOptions.length - 1);
         choicesMade.push(availableOptions[selection]);
         availableOptions.splice(selection, 1); // Remove that selection.
      }
      
      return choicesMade;
   },
   // Returns a random integer between min & max, inclusive.
   randomNum: function(min, max)
   {
      return Math.floor(Math.random() * (max - min + 1) + min);
   },
   /* Returns a random float within a range */
   randomFloat: function(min, max)
   {
      return (Math.random() * (max - min) + min);
   },
}

/* Static class of color-related functions */
Util.Color =
{
   /* Takes these r,g,b values and an adjust value (which should be from -1.0 to 1.0.
      Given the current values, color will move adjustValue percent toward either white (positive)
      and black (negative).  Returns a "#ffffff" style string. */
   adjustColor: function(r, g, b, adjustValue)
   {
      if(adjustValue > 1.0) {adjustValue = 1.0;}
      else if(adjustValue < -1.0) {adjustValue = -1.0;}
      
      var rDiff = 0, gDiff = 0, bDiff = 0;
      if(adjustValue > 0)
      {
         rDiff = 255 - r;
         gDiff = 255 - g;
         bDiff = 255 - b;
      }
      else
      {
         rDiff = -r;
         gDiff = -g;
         bDiff = -b;
      }
      var adjustPercentage = Math.abs(adjustValue);
      var rNew = Math.floor(r + rDiff * adjustPercentage);
      var gNew = Math.floor(g + gDiff * adjustPercentage);
      var bNew = Math.floor(b + bDiff * adjustPercentage);
      
      var hexString = Util.Color.rgbToHexString(rNew, gNew, bNew);
      return hexString;
   },
   /* Converts r/g/b values to a hexadecimal string. */
   rgbToHexString: function(r, g, b)
   {
      var r = r.toString(16);
      var g = g.toString(16);
      var b = b.toString(16);
      if (r.length == 1) r = '0' + r;
      if (g.length == 1) g = '0' + g;
      if (b.length == 1) b = '0' + b;
      return '#' + r + g + b;
   },
   /* Converts r/g/b/a values to a string. */
   createRGBAColorString: function(r, g, b, a)
   {
      var rgbaString = 'rgba(' + r + ',' + g + ',' + b + ',' + a +')';
      return rgbaString;
   },
   hexStringToRGB: function(hexString)
   {
      var hex = hexString.substr(1,6); // remove leading #
      var rgb =
      {
         /* Parse... base 16 */
         r: parseInt(hex.substr(0,2), 16),
         g: parseInt(hex.substr(2,2), 16),
         b: parseInt(hex.substr(4,2), 16),
      };
      return rgb;
   },
   // From anonymous comment on:
   // http://www.develobert.info/2008/06/random-color-generation-with-javascript.html
   // Generates a random hexadecimal color string.
   randomHexColor: function()
   {
      return "#" + Math.round(0xffffff * Math.random()).toString(16);
   },
   /* Returns a random hex color with the given alpha value */
   randomRGBWithAlpha: function(alpha)
   {
      return Util.Color.randomRGBAWithinRange(0,255,0,255,0,255,alpha,alpha);
   },
   /* Returns a random rgba value within these ranges */
   randomRGBAWithinRange: function(rMin, rMax, gMin, gMax, bMin, bMax, aMin, aMax)
   {
      var r = Util.Random.randomNum(rMin,rMax);
      var g = Util.Random.randomNum(gMin,gMax);
      var b = Util.Random.randomNum(bMin,bMax);
      var a = Util.Random.randomFloat(aMin,aMax);
      var rgbaString = 'rgba(' + r + ',' + g + ',' + b + ',' + a +')';
      return rgbaString;
   },
}

/* Static helper class with time-related functions. */
Util.Time =
{
   /* Returns a string of the form NN:MM where N is the number of seconds, and MM is a fraction representing a fraction. */
   formatSeconds: function(seconds)
   {
      var flooredSeconds = Math.floor(seconds);
      var remainder = ("" + Math.floor((seconds - flooredSeconds) * 100));
      var formattedText = ("" + flooredSeconds).lpad("0",2) + ":" + remainder.lpad("0",2);
      return formattedText;
   },
};

// Static Class that can handle parsing strings.
Util.Parse =
{
   // From: http://lawrence.ecorp.net/inet/samples/regexp-parse.php
   // Retrieves the file name, less the extension. 
   // Useful if you want to use a filename as a key/id;
   extractFileLessExtension: function(path)
   {
      var m = path.match(/(.*)[\/\\]([^\/\\]+)\.\w+$/);
      return m[2];
   },
   // From: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
   // Retrieves the file extension.
   extractFileExtension: function(path)
   {
      var ext = path.substr(path.lastIndexOf('.') + 1);
      return ext;
   },
}

/***********************/
/* LANGUAGE EXTENSIONS */
/***********************/
/* Extend Object.
 */
 /* I'd like to avoid doing this, because I think it's a bad idea to muck with Object's prototype
Object.prototype.getKeyCount = function()
{
   var keyCount = 0;
   for(var key in this)
   {
      if(key !== undefined && key !== null)
      {
         keyCount++;
      }
   }
   return keyCount;
}
*/

/* Extend the array object.
 * "contains' function, from: http://stackoverflow.com/questions/237104/javascript-array-containsobj
 */
Array.prototype.contains = function(obj) 
{
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

Array.prototype.remove = function(obj)
{
  var i = this.length;
  while (i--) {
    if (this[i] === obj) 
    {
      this.splice(i, 1);
    }
  }
  return false;
}

/* Extend the Function object.
 * Reference: http://www.robertsosinski.com/2009/04/28/binding-scope-in-javascript/
 * This useful function will bind the function to some particular object, so when you
 * refer to "this", you will get your object, and not say "Window" or "Canvas" because the scope was lost.
 */
Function.prototype.bind = function(scope)
{
    var _function = this;
    return function()
    {
        return _function.apply(scope, arguments);
    }
};

/* Extend the String object
 * From: http://sajjadhossain.com/2008/10/31/javascript-string-trimming-and-padding/
 */
//pads left
String.prototype.lpad = function(padString, length) 
{
   var str = this;
   while (str.length < length)
   {
      str = padString + str;
   }
   return str;
}
 
//pads right
String.prototype.rpad = function(padString, length) 
{
   var str = this;
   while (str.length < length)
   {
      str = str + padString;
   }
   return str;
}

//trimming space from both side of the string
String.prototype.trim = function() 
{
   return this.replace(/^\s+|\s+$/g,"");
}
 
//trimming space from left side of the string
String.prototype.ltrim = function() 
{
   return this.replace(/^\s+/,"");
}
 
//trimming space from right side of the string
String.prototype.rtrim = function() 
{
   return this.replace(/\s+$/,"");
}
   

