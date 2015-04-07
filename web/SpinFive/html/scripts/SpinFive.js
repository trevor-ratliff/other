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
	var lblnWin = false;
	var lstrTurn = '';
	
	//----
	// test for placed piece
	//----
	if (!gblnWon && robjTile.className.indexOf("red") < 0 && 
		robjTile.className.indexOf("blue") < 0)
	{
		//----
		// place the piece
		//----
		if (gstrTurn == 'red') {
			robjTile.className += " red";
			lstrTurn = 'blue';
		}
		else {
			robjTile.className += " blue";
			lstrTurn = 'red';
		}
		
		//----
		// set the cursor so it doesn't look playable any more
		//----
		SetCursor(robjTile);
		
		//----
		// check for win
		//----
		lblnWin = CheckWin();
		
		//----
		// reset turn and rotate flags
		//----
		if (!lblnWin) {
			gstrTurn = lstrTurn;
			gblnCanRotate = true;
		} else {
			alert(gstrTurn +' Won!!');
			gblnWon = lblnWin;
		}
	} else {
		if (gblnWon) {
			alert(gstrTurn + ' already won.');
		} else {
			alert('you can not play there');
		}
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
///     2015-04-07  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         adding logic  |
/// @endverbatim
//====
function CheckWin() {
	var lblnReturn = false;
	
	//----
	// check for enough pieces for a win
	//----
	if ($('.piece.' + gstrTurn).length > 4) {
		//----
		// look through rows
		//----
		if (!lblnReturn && InRowCount('1', 'top', gstrTurn) + 
			InRowCount('2', 'top', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('1', 'mid', gstrTurn) + 
			InRowCount('2', 'mid', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('1', 'bottom', gstrTurn) + 
			InRowCount('2', 'bottom', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('3', 'top', gstrTurn) + 
			InRowCount('4', 'top', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('3', 'mid', gstrTurn) + 
			InRowCount('4', 'mid', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('3', 'bottom', gstrTurn) + 
			InRowCount('4', 'bottom', gstrTurn) > 4) lblnReturn = true;
		
		//----
		// look through columns
		//----
		if (!lblnReturn && InRowCount('1', 'left', gstrTurn) + 
			InRowCount('3', 'left', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('1', 'center', gstrTurn) + 
			InRowCount('3', 'center', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('1', 'right', gstrTurn) + 
			InRowCount('3', 'right', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('2', 'left', gstrTurn) + 
			InRowCount('4', 'left', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('2', 'center', gstrTurn) + 
			InRowCount('4', 'center', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('2', 'right', gstrTurn) + 
			InRowCount('4', 'right', gstrTurn) > 4) lblnReturn = true;
		
		//----
		// look through diagonals: Top Left to Bottom Right
		//----
		if (!lblnReturn && InRowCount('1', 'diagTLBR', gstrTurn) + 
			InRowCount('4', 'diagTLBR', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('1', 'diagTLSR', gstrTurn) + 
			InRowCount('2', 'diagBL', gstrTurn) + 
			InRowCount('4', 'diagTLSR', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('1', 'diagTLSD', gstrTurn) + 
			InRowCount('3', 'diagTR', gstrTurn) + 
			InRowCount('4', 'diagTLSD', gstrTurn) > 4) lblnReturn = true;
		
		//----
		// look through diagonals: Top Right Bottom Left
		//----
		if (!lblnReturn && InRowCount('2', 'diagTRBL', gstrTurn) + 
			InRowCount('3', 'diagTRBL', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('2', 'diagTRSL', gstrTurn) + 
			InRowCount('1', 'diagBR', gstrTurn) + 
			InRowCount('3', 'diagTRSL', gstrTurn) > 4) lblnReturn = true;
		if (!lblnReturn && InRowCount('2', 'diagTRSD', gstrTurn) + 
			InRowCount('4', 'diagTL', gstrTurn) + 
			InRowCount('3', 'diagTRSD', gstrTurn) > 4) lblnReturn = true;
	}
	return lblnReturn;
}


//====
/// @fn InRowCount(vstrQuad, vstrRow, vstrPlayer)
/// @brief counts how many pieces are in a row
/// @author Trevor Ratliff
/// @date 2015-04-07
/// @param vstrQuad -- the quadrent to look at
/// @param vstrRow -- the row to look at (after rotation)
/// @param vstrPlayer -- which player's pieces to count
/// @return int -- count of pieces for vstrPlayer
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-04-07  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function InRowCount(vstrQuad, vstrRow, vstrPlayer) {
	var lintCount = 0;
	var lintRotMap = 0;
	var t1 = '';
	var t2 = '';
	var larrMap = [];
	var lobjQuad = {};
	
	//----
	// set map
	//----
	larrMap[0] = [[1,7,9,3], [2,4,8,6], [3,1,7,9]];
	larrMap[1] = [[4,8,6,2], [5,5,5,5], [6,2,4,8]];
	larrMap[2] = [[7,9,3,1], [8,6,2,4], [9,3,1,7]];
	
	//----
	// get current player's pieces
	//----
	lobjQuad.q = vstrQuad;
	lobjQuad.rotation = $('#Q' + vstrQuad)[0].getAttribute('sf_rotation');
	lobjQuad.pieces = $('[id^=q' + vstrQuad + '].piece.' + vstrPlayer);
	
	//----
	// set lintRotMap based on rotation
	//----
	lintRotMap = parseInt(lobjQuad.rotation) / 90;
	
	//----
	// set t1 and t2 to identifier parts
	//----
	t1 = '#q' + lobjQuad.q + 'p';
	t2 = '.' + vstrPlayer;
	
	//----
	// switch on vstrRow
	//----
	switch (vstrRow) {
		case 'top':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][0][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[0][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[0][2][lintRotMap] + t2).length;
			break;
		case 'mid':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[1][0][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][2][lintRotMap] + t2).length;
			break;
		case 'bottom':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[2][0][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][2][lintRotMap] + t2).length;
			break;
		case 'left':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][0][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][0][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][0][lintRotMap] + t2).length;
			break;
		case 'center':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][1][lintRotMap] + t2).length;
			break;
		case 'right':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][2][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][2][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][2][lintRotMap] + t2).length;
			break;
		case 'diagTLBR':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][0][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][2][lintRotMap] + t2).length;
			break;
		case 'diagTLSD':		//top left shift down
			lintCount = 
				document.querySelectorAll(t1 + larrMap[1][0][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][1][lintRotMap] + t2).length;
			break;
		case 'diagTLSR':		//top left shift right
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][2][lintRotMap] + t2).length;
			break;
		case 'diagTRBL':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][2][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][0][lintRotMap] + t2).length;
			break;
		case 'diagTRSD':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[1][2][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[2][1][lintRotMap] + t2).length;
			break;
		case 'diagTLSR':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][1][lintRotMap] + t2).length + 
				document.querySelectorAll(t1 + larrMap[1][0][lintRotMap] + t2).length;
			break;
		case 'diagBL':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[2][0][lintRotMap] + t2).length;
			break;
		case 'diagBR':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[2][2][lintRotMap] + t2).length;
			break;
		case 'diagTL':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][0][lintRotMap] + t2).length;
			break;
		case 'diagTR':
			lintCount = 
				document.querySelectorAll(t1 + larrMap[0][2][lintRotMap] + t2).length;
			break;
	}
	
	return lintCount;
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
