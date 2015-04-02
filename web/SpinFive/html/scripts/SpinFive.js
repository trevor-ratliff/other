//====
/// @file SpinFive.js
/// @brief Holds the game logic for SpinFive
/// @author Trevor Ratliff
/// @date 2013-01-17
//  
//  Definitions:
//      PlacePiece() -- places a players piece
//      RotateQuadrent() -- rotates the selected quadrent
//      CheckWin() -- checks for a winning play
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// @endverbatim
//====


//====
/// @fn PlacePiece(robjTile)
/// @breif places users piece on tile selected
/// @author Trevor Ratliff
/// @date 2013-01-17
/// @param robjTile -- reference to an html element
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-01-17  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
function PlacePiece(robjTile){
    //----
    // test for placed piece
    //----
    if (robjTile.className.indexOf("red") < 0 && 
        robjTile.className.indexOf("blue") < 0)
    {
        //----
        // place the piece
        //----
        if (gstrTurn == 'red') {
            robjTile.className += " red";
            gstrTurn = 'blue';
        }
        else {
            robjTile.className += " blue";
            gstrTurn = 'red';
        }
        
        //----
        // reset rotate flag
        //----
        gblnCanRotate = true;
    }
    
    return;
}


//====
/// @fn RotateQuadrent(robjQuadrent, vblnClockwise)
/// @brief rotates the quadrent 90 deg in specified direction
/// @author Trevor Ratliff
/// @date 2013-01-17
/// @param robjQuadrent -- html element reference to a quadrent
/// @param vblnClockwise -- flag for clockwise rotation
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-01-17  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
function RotateQuadrent(robjQuadrent, vblnClockwise) {
    var lintRotateFrom = 0;
    var lintRotateTo = 0;
    var lintStep = 1;
    var ii = 0;
    
    //----
    // test if rotation allowed
    //----
    if (gblnCanRotate) {
        //----
        // set step and start and end points
        //----
        //~ lintStep = vblnClockwise ? 10 : -10;
        lintRotateFrom = parseInt(robjQuadrent.getAttribute("sf_rotation"));
        
        if (vblnClockwise) {
            lintStep = 1;
            lintRotateFrom = lintRotateFrom > 359 ? 
                lintRotateFrom - 360 : lintRotateFrom;
            lintRotateTo = lintRotateFrom + 90;
        } else {
            lintStep = -1;
            lintRotateFrom = lintRotateFrom < 0 ? 
                lintRotateFrom + 360 : lintRotateFrom;
            lintRotateTo = lintRotateFrom - 90;
        }
        
        //~ for (ii = lintRotateFrom; ii <= lintRotateTo; ii += lintStep) {
        while (lintRotateFrom != lintRotateTo) {
            lintRotateFrom += lintStep;
            ii += Math.abs(lintStep);
            
            window.setTimeout(RotateTo, 
                (10 * ii),
                robjQuadrent,
                lintRotateFrom);
        }
        
        //----
        // update variables
        //----
        gblnCanRotate = false;
        lintRotateTo = lintRotateTo > 359 ? lintRotateTo - 360 : 
            lintRotateTo < 0 ? lintRotateTo + 360 : lintRotateTo;
        robjQuadrent.setAttribute("sf_rotation", lintRotateTo.toString());
    }
}


//====
//====
function RotateTo(robjQuadrent, vintDegree) {
    robjQuadrent.style.Transform = "rotate(" + vintDegree + "deg)";
    robjQuadrent.style.msTransform = "rotate(" + vintDegree + "deg)";
    robjQuadrent.style.MozTransform = "rotate(" + vintDegree + "deg)";
    robjQuadrent.style.webkitTransform = "rotate(" + vintDegree + "deg)";
    robjQuadrent.style.oTransform = "rotate(" + vintDegree + "deg)";
}


//====
/// @fn CheckWin()
/// @brief checks for a winning state
/// @author Trevor Ratliff
/// @date 2013-01-17
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-01-17  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
function CheckWin() {
    return false;
}


//====
/// @fn SetCursor()
/// @brief changes the cursor to hand and back
/// @author Trevor Ratliff
/// @date 2013-01-23
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-01-17  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
function SetCursor(robjElement) {
    robjElement.style.cursor = robjElement.style.cursor == "pointer" ? 
        "default" : "pointer";
}
