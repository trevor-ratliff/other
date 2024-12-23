//====
/// @file ChainReaction.js
/// @brief This file holds the interface for the Chain Reaction game
/// @author Trevor Ratliff
/// @date 2014-01-10
//  
//  Definitions:
//      gblnCanPlay -- flag to let user know he/she can play
//      gblnDebug -- flag for displaying debug info
//      gblnFirstPlayersTurn -- flag for player's turn
//      gblnLog -- flag for if console.log() is available
//      gblnWon -- flag for end of game
//      gintPlayCount -- counter for number of plays
//      $() -- wraper for document.querySelectorAll()
//      CellClick() -- handles a cell being clicked
//      GameInit() -- initializes the game
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  | 
///         file creation  |
/// @endverbatim
//====

var gblnCanPlay = true;
var gblnDebug = true;
var gblnFirstPlayersTurn = false;
var gblnLog = true;
var gblnWon = false;
var gintPlayCount = 0;
var gstrClosePopup = '<div class="close-pop-up" onclick="Hide(this.parentNode);">X</div>';


//====
/// @fn $( vstrPath )
/// @brief alias for document.querySelectorAll()
/// @author Trevor Ratliff
/// @date 2014-01-10
/// @param vstrPath -- string holding the css path
/// @return node list
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function $( vstrPath ) { 
    return document.querySelectorAll(vstrPath);
}


//====
/// @fn AddPieces(vobjCell, vstrPlayer, vintCount)
/// @brief adds the set number of pieces to the passed in cell for the selected player
/// @author Trevor Ratliff
/// @date 2015-02-26
/// @param vobjCell -- passed in cell object to add pieces to
/// @param vstrPlayer -- string of the player ['A','B']
/// @param vintCount -- number of pieces to add
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-02-26  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function AddPieces (vobjCell, vstrPlayer, vintCount) { 
    for (var lintII = 0; lintII < vintCount; lintII++) {
        var lobjNewPiece = $('#svgPlayer' + vstrPlayer)[0].cloneNode(true);
        lobjNewPiece.id = 'piece_' + gintPlayCount;
        lobjNewPiece.className += ' player-' + vstrPlayer.toLowerCase();
        vobjCell.appendChild(lobjNewPiece);
        gintPlayCount += 1;
    }
    vobjCell.setAttribute('pieces', vobjCell.querySelectorAll('.piece').length);
}


//====
/// @fn CellClick()
/// @brief handles a player's click on a cell of the board
/// @author Trevor Ratliff
/// @date 2014-01-10
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function CellClick() {
    Log('CellClick');
    //~ alert( 'first players turn = "' + gblnFirstPlayersTurn + 
        //~ '"\ncell id = "' + this.id + '"' );
    var lstrPlayer = gblnFirstPlayersTurn ? 'A' : 'B';
    var lobjCell = this.parentNode;
    
    try {
        //----
        // check to see if the player can go here
        //----
        if (gblnWon) {
            throw 'The game has been won';
        }
        
        if (lobjCell.getAttribute('player') != '' && 
            lobjCell.getAttribute('player') != lstrPlayer) {
            throw 'You can not play here';
        }
        
        if (!gblnCanPlay) {
            throw 'You need to wait for your turn';
        }
        
        //----
        // call PlacePiece() to add player's piece to the board
        //----
        PlacePiece(lobjCell)
        
        //----
        // set player turn and toggle player label
        //----
        gblnFirstPlayersTurn = !gblnFirstPlayersTurn;
        
        if (gblnFirstPlayersTurn) {
            $('#txtTurn')[0].innerHTML = 'A';
        } else {
            $('#txtTurn')[0].innerHTML = 'B';
        }
        
    } catch (err) {
        //----
        // process the error
        //----
        //~ alert(err.toString());
        var lobjMessages = $('#messages')[0];
        lobjMessages.innerHTML = gstrClosePopup + err.toString();
        Show(lobjMessages);     //.className = lobjMessages.className.replace(/no-show[ ]?/g, '');

    }
}


//====
/// @fn ChainReaction()
/// @brief 
/// @author Trevor Ratliff
/// @date 
/// @param 
/// @return 
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     _  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function ChainReaction() {
    Log('ChainReaction');
    //~ alert('chain reaction started');
    if (!gblnWon) {
        //----
        // setup reaction 'animation'
        //----
        window.setTimeout(PieceAnimateStart, 10);
        
        //----
        // set up reaction
        //----
        window.setTimeout(Reaction, 1500);
        
    }
}


//====
/// @fn FixBoardSize()
/// @brief adjusts the board size to make it fit the screen
/// @author Trevor Ratliff
/// @date 2014-01-17
//  
//  Definitions:
//      lintDimension -- integer representation of shortest Dimension of client screen
//      lstrDimension -- Dimension in css pixel notation
//      lobjBoard -- reference to the element with id of 'board'
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-17  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function FixBoardSize() {
    Log('FixBoardSize');
    var lintDimension = 0;
    var lstrDimension = '';
    var lobjBoard = $('#board')[0];
    
    //----
    // fix board width and height to 90% of client height or width
    //----
    if (document.body.clientHeight < document.body.clientWidth) {
        lintDimension = (document.body.clientHeight * 0.9);
    } else {
        lintDimension = (document.body.clientWidth * 0.9);
    }
    
    //----
    // adjust the pixel dimension to be odd to make IE happier
    //----
    if (lintDimension % 2 == 0) {
        lintDimension += 1;
    }
    
    //----
    // set dimension to pixels
    //----
    lstrDimension = lintDimension.toString() + 'px';
    
    //----
    // set boad size
    //----
    lobjBoard.style.height = lstrDimension;     // 'calc(' + lintBoardSize + '*2em + 1ex)';
    lobjBoard.style.width = lstrDimension;      //'calc(' + lintBoardSize + '*2em + 1ex)';
    Log('    ' + lstrDimension);
}


//====
/// @fn FixCells()
/// @brief fixes the board cells of any errors
/// @author Trevor Ratliff
/// @date 2014-01-27
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-27  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function FixCells() {
    //----
    // get any cells with a '.reacting' class
    //----
    larrCells = $('.reacting');
    
    //----
    // loop through and remove the .reacting class
    //----
    for(var lintII = 0; lintII < larrCells.length; lintII++) {
        larrCells[lintII].className = larrCells[lintII].className.replace(/ reacting/g, '');
    }
}


//====
/// @fn GameInit()
/// @brief Initalizes the game
/// @author Trevor Ratliff
/// @date 2014-01-10
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  | 
///         function creation  |
/// @endverbatim
//====
function GameInit() {
    Log('GameInit');
    //~ alert('init');
    var lstrDimension = "";
    
    //----
    // set values
    //----
    gblnCanPlay = true;
    gblnFirstPlayersTurn = true;
    gblnWon = false;
    gintPlayCount = 0;
    
    //----
    // generate board
    //----
    var lobjBoard = $('#board')[0];
    var lintBoardSize = $('#selBoardSize')[0].value;
    
    //----
    // loop through board size to create each cell
    //----
    lobjBoard.innerHTML = '';
    for (var lintII = 0; lintII < lintBoardSize; lintII++) {
        for (var lintNN = 0; lintNN < lintBoardSize; lintNN++) {
            //----
            // set up cell
            //----
            var lobjCell = document.createElement('div');
            lobjCell.id = 'r' + lintII + 'c' + lintNN;
            lobjCell.className = 'cell active s' + lintBoardSize;
            lobjCell.setAttribute('pieces', 0);
            lobjCell.setAttribute('player', '');
            
            //----
            // if this is the first in the row mark it as such
            //----
            if (lintNN == 0) lobjCell.className += ' first-in-row';
            
            //----
            // set max pieces
            //----
            // corners
            //----
            if (lintII == 0 || lintII == (lintBoardSize - 1)) {
                if (lintNN == 0 || lintNN == (lintBoardSize - 1)) {
                    lobjCell.setAttribute('maxPieces', 2);
                }
                
                //----
                // top and bottom edges
                //----
                if (lintNN > 0 && lintNN < (lintBoardSize - 1)) {
                    lobjCell.setAttribute('maxPieces', 3);
                }
                
            } else {
                //----
                // left and right edges
                //----
                if (lintNN == 0 || lintNN == (lintBoardSize - 1)) {
                    lobjCell.setAttribute('maxPieces', 3);
                    
                } else {
                    //----
                    // centers
                    //----
                    lobjCell.setAttribute('maxPieces', 4);
                }
            }
            
            //----
            // add cell to board
            //----
            lobjBoard.appendChild(lobjCell);
            
            //----
            // create and add a cell cover to attach click events so the pieces don't get in the way
            //----
            var lobjClickCover = document.createElement('div');
            lobjClickCover.className = 'click-cover';
            lobjCell.appendChild(lobjClickCover);
            
            //----
            // register events for this cell
            //----
            //~ lobjCell.addEventListener('click', CellClick, false);
            lobjClickCover.addEventListener('click', CellClick, false);
        }
    }
    
    //----
    // fix board width and height
    //----
    FixBoardSize();
    
    //----
    // set up players
    //----
    gblnFirstPlayersTurn = true;
    UpdateScores();
    
    return;
}


//====
/// @fn GetReactingCells()
/// @brief gets all cells that need to react
/// @author Trevor Ratliff
/// @date 2014-01-16
/// @return a node list
//  
//  Definitions:
//      lstrPlayer -- marker for current player so only their pieces are affected
//      larrReturn -- array to return to calling code
//      larrCells -- array of pieces that are the [max + 1] of their parent cell
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-16  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function GetReactingCells() {
    Log('GetReactingCells');
    
    return $(
        '.cell[pieces="7"][maxpieces="4"], ' + 
        '.cell[pieces="6"][maxpieces="4"], ' + 
        '.cell[pieces="5"][maxpieces="4"], ' + 
        '.cell[pieces="4"][maxpieces="4"], ' + 
    
        '.cell[pieces="6"][maxpieces="3"], ' + 
        '.cell[pieces="5"][maxpieces="3"], ' + 
        '.cell[pieces="4"][maxpieces="3"], ' + 
        '.cell[pieces="3"][maxpieces="3"], ' + 
        
        '.cell[pieces="5"][maxpieces="2"], ' + 
        '.cell[pieces="4"][maxpieces="2"], ' + 
        '.cell[pieces="3"][maxpieces="2"], ' + 
        '.cell[pieces="2"][maxpieces="2"]'
    );
}


//====
/// @fn Hide(vobjElement)
/// @brief adds the 'no-show' class so an element is hidden
/// @author Trevor Ratliff
/// @date 2015-03-02
/// @param vobjElement -- the element to hide (it's id or the element itself)
/// @return null
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-03-02  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function Hide(vobjElement) {
    var lobjE = null;

    try {
        //----
        // test for passed in string
        //----
        if (typeof vobjElement == 'string') {
            lobjE = $(vobjElement)[0];
        } else {
            lobjE = vobjElement;
        }

        //----
        // add 'no-show' class
        //----
        lobjE.className += ' no-show';
        
    } catch (err) {
        Log(err.toString());
    }

    return;
}


//====
/// @fn Log(vstrMessage)
/// @brief prints vstressage to the console.log() if available
/// @author Trevor Ratliff
/// @date 2014-01-26
/// @param vstrMessage -- the message to put in the log
/// @return bool
//  
//  Definitions:
//      lblnReturn -- success flag
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-26  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function Log(vstrMessage) {
    var lblnReturn = true;
    
    try {
        if (gblnLog && gblnDebug) {
            var lstrDate = new Date().toISOString();
            $('#log')[0].innerHTML += vstrMessage + ': ' + lstrDate + '<br>';
            if (console && console.log) console.log(vstrMessage + ': ' + lstrDate);
        }
    } catch (err) {
        lblnReturn = false;
    }
    
    return lblnReturn;
}


//====
/// @fn MoveDelay(vobjPiece, vintDelay)
/// @brief shakes the pieces prior to moving them
/// @author Trevor Ratliff
/// @date 2014-01-25
/// @param robjPiece -- reference to the piece to move
/// @param vintDelay -- base time to wait to start the animation
/// @return 
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-25  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function MoveDelay(lobjPiece, lintDelay, lstrDirection) {
    Log('MoveDelay');
    //----
    // move up
    //----
    window.setTimeout(
        function() {
            lobjPiece.style.top  = '-' + RandMinMax(1, 5).toString() + 'px';
            lobjPiece.style.left = '0px';
        },
        lintDelay
    );
    
    //----
    // move left
    //----
    window.setTimeout(
        function() {
            lobjPiece.style.top  = '0px';
            lobjPiece.style.left = RandMinMax(1, 5).toString() + 'px';
        },
        lintDelay + 250
    );
    
    //----
    // move down
    //----
    window.setTimeout(
        function() {
            lobjPiece.style.top  = RandMinMax(1, 5).toString() + 'px';
            lobjPiece.style.left = '0px';
        },
        lintDelay + 500
    );
    
    //----
    // move right
    //----
    window.setTimeout(
        function() {
            lobjPiece.style.top  = '0px';
            lobjPiece.style.left = '-' + RandMinMax(1, 5).toString() + 'px';
        },
        lintDelay + 750
    );
    
    //----
    // move back to origin
    //----
    window.setTimeout(
        function() {
            lobjPiece.style.top  = '0px';
            lobjPiece.style.left = '0px';
        },
        lintDelay + 1000
    );
}


//====
/// @fn PieceAnimateStart()
/// @brief makes the pieces wiggle prior to reaction
/// @author Trevor Ratliff
/// @date 2014-01-15
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-15  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function PieceAnimateStart() {
    Log('PieceAnimateStart');
    var larrCells = GetReactingCells();
    
    //----
    // loop through node list
    //----
    for (var lintII = 0; lintII < larrCells.length; lintII++) {
        var larrPieces = larrCells[lintII].querySelectorAll('.piece');
        
        //----
        // loop through pieces
        //----
        for (var lintNN = 0; lintNN < larrPieces.length; lintNN++) {
            //----
            // shake them
            //----
            MoveDelay(larrPieces[lintNN], 10);
        }
        larrCells[lintII].querySelector('.click-cover').className += ' reacting';
    }
}


//====
/// @fn PlacePiece(vobjCell)
/// @brief places a game piece on the board
/// @author Trevor Ratliff
/// @date 2014-01-12
/// @param vobjCell -- reference to the game board cell to modify
/// @return bool
//  
//  Definitions:
//      lblnReturn -- return flag (true = success; false = failure)
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function PlacePiece(vobjCell) {
    Log('PlacePiece');
    var lblnReturn = true;
    var lintPieces = 0;
    var lstrPlayer = gblnFirstPlayersTurn ? 'A' : 'B';
    var lobjNewPiece = $('#svgPlayer' + 
        lstrPlayer)[0].cloneNode(true);
    
    try {
        //----
        // error out if game is won
        //----
        if (gblnWon) {
            throw 'Game has been won';
        }
        
        //----
        // add the player's piece to the board
        //----
        lintPieces += parseInt(vobjCell.getAttribute('pieces')) + 1;
        vobjCell.setAttribute('pieces', lintPieces);
        vobjCell.setAttribute('player', lstrPlayer);
        
        lobjNewPiece.id = 'piece_' + gintPlayCount;
        lobjNewPiece.className += ' player-' + lstrPlayer.toLowerCase();
        vobjCell.appendChild(lobjNewPiece);
        
        //----
        // check for chain reaction
        //----
        if (vobjCell.getAttribute('maxPieces') <= lintPieces) {
            //----
            // start chain reaction
            //----
            gblnCanPlay = false;
            ChainReaction();
        } else {
            UpdateScores();
        }
        
        //----
        // update scores and increment play count
        //----
        gintPlayCount ++;
        
    } catch (err) {
        //----
        // process the error
        //----
        lblnReturn = false;
        //~ alert(err.toString());
        var lobjMessages = $('#messages')[0];
        lobjMessages.innerHTML = gstrClosePopup + err.toString();
        Show(lobjMessages);     //.className = lobjMessages.className.replace(/no-show[ ]?/g, '');
    }
    
    return lblnReturn;
}


//====
/// @fn RandMinMax(vintMin, vintMax)
/// @brief gets a random value between the min and max
/// @author Trevor Ratliff
/// @date 2014-01-26
/// @param vintMin -- minimum value
/// @param vintMax -- maximum value
/// @return int
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-26  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function RandMinMax(vintMin, vintMax)
{
    return Math.floor(Math.random()*(vintMax - vintMin + 1) + vintMin);
}


//====
/// @fn Reaction()
/// @brief moves the pieces involved in a chain reaction
/// @author Trevor Ratliff
/// @date 2014-01-15
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-15  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function Reaction() {
    Log('Reaction');
    //----
    // get reacting cells
    //----
    var larrCells = GetReactingCells();
    
    for (var lintII = 0; lintII < larrCells.length; lintII++) {
        var lintCount = 0;
        var lstrRow = larrCells[lintII].id.substring(0,2);
        var lstrCol = larrCells[lintII].id.substring(2);
        
        //----
        // get pieces in cell
        //----
        var larrPieces = larrCells[lintII].querySelectorAll('.piece');
        
        while (lintCount < larrPieces.length) {
            if (lintCount > 0) lintCount - 1;
            
            //----
            // move pieces
            //----
            // move one up
            //----
            if (lstrRow != "r0" && 
                lintCount < larrPieces.length) 
            {
                var lintNewRow = parseInt(lstrRow.substring(1)) - 1;
                var lobjCell = $('#r' + lintNewRow + lstrCol)[0];
                
                if (lobjCell) { 
                    lobjCell.appendChild(larrPieces[lintCount]);
                    lobjCell.setAttribute('pieces', parseInt(lobjCell.getAttribute('pieces')) + 1);
                    SwapPieces(lobjCell);
                }
                
                lintCount++;
            }
            
            //----
            // move one down
            //----
            if (lstrRow != ('r' + (Number($('#selBoardSize')[0].value) - 1)) && 
                lintCount < larrPieces.length) 
            {
                var lintNewRow = parseInt(lstrRow.substring(1)) + 1;
                var lobjCell = $('#r'+ lintNewRow + lstrCol)[0];
                
                if (lobjCell) {
                    lobjCell.appendChild(larrPieces[lintCount]);
                    lobjCell.setAttribute('pieces', parseInt(lobjCell.getAttribute('pieces')) + 1);
                    SwapPieces(lobjCell);
                }
                
                lintCount++;
            }
            
            //----
            // move one right
            //----
            if (lstrCol != ('c' + (Number($('#selBoardSize')[0].value) - 1)) && 
                lintCount < larrPieces.length) 
            {
                var lintNewCol = parseInt(lstrCol.substring(1)) + 1;
                var lobjCell = $('#'+ lstrRow + 'c' + lintNewCol)[0];
                
                if (lobjCell) {
                    lobjCell.appendChild(larrPieces[lintCount]);
                    lobjCell.setAttribute('pieces', parseInt(lobjCell.getAttribute('pieces')) + 1);
                    SwapPieces(lobjCell);
                }
                
                lintCount++;
            }
            
            //----
            // move one left
            //----
            if (lstrCol != "r0" && 
                lintCount < larrPieces.length) 
            {
                var lintNewCol = parseInt(lstrCol.substring(1)) - 1;
                var lobjCell = $('#' + lstrRow + 'c' + lintNewCol)[0];
                
                if (lobjCell) {
                    lobjCell.appendChild(larrPieces[lintCount]);
                    lobjCell.setAttribute('pieces', parseInt(lobjCell.getAttribute('pieces')) + 1);
                    SwapPieces(lobjCell);
                }
                
                lintCount++;
            }
        }
        
        //----
        // reset cell
        //----
        larrCells[lintII].setAttribute('pieces', larrCells[lintII].querySelectorAll('.piece').length);
        larrCells[lintII].setAttribute('player', '');
        
        //----
        // check to see if we need to run Reaction again
        //----
        var larrNewCells = GetReactingCells();
        
        if (larrNewCells.length > 0 &&
            $('.player-' + (gblnFirstPlayersTurn ? 'a' : 'b')).length > 0) 
        {
            //----
            // set up a call to ChainReaction to start process again
            //----
            window.setTimeout(ChainReaction, 50);
            
        } else {
            FixCells();
            UpdateScores();
            gblnCanPlay = true;
        }
    }
}


//====
/// @fn Show
/// @brief removes the 'no-show' class so an element is shown
/// @author Trevor Ratliff
/// @date 2015-03-02
/// @param vobjElement -- the element to show (it's id or the element itself)
/// @return null
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-03-02  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function Show(vobjElement) {
    var lobjE = null;

    try {
        //----
        // test for passed in string
        //----
        if (typeof vobjElement == 'string') {
            lobjE = $(vobjElement)[0];
        } else {
            lobjE = vobjElement;
        }

        //----
        // remove 'no-show' class
        //----
        lobjE.className = lobjE.className.replace(/[ ]?no-show/g, '');
        
    } catch (err) {
        Log(err.toString());
    }

    return;
}


//====
/// @fn SwapPieces(vobjCell)
/// @brief sets all the color's in a cell to the same one
/// @author Trevor Ratliff
/// @date 2014-01-16
/// @param vobjCell -- the cell in which pieces are to be swapped
/// @return boolean
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-16  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function SwapPieces(vobjCell) {
    Log('SwapPieces');
    var lblnReturn = true;
    
    try {
        //----
        // get new piece and opposite pieces
        //----
        var lstrPlayer = (!gblnFirstPlayersTurn ? 'A' : 'B')
        var lobjPiece = $('#svgPlayer' + lstrPlayer)[0];
        var larrPieces = vobjCell.querySelectorAll('.piece.player-' + 
            (gblnFirstPlayersTurn ? 'a' : 'b'));
        
        //----
        // set cell player attribute
        //----
        vobjCell.setAttribute('player', (!gblnFirstPlayersTurn ? 'A' : 'B'));
        
        //----
        // loop through opposite pieces and change them to the new piece
        //----
        for (var lintII = 0; lintII < larrPieces.length; lintII++) {
            //----
            // clone and adjust properties of new piece
            //----
            var lobjNew = lobjPiece.cloneNode(true)
            lobjNew.id = larrPieces[lintII].id;
            lobjNew.className += ' player-' + lstrPlayer.toLowerCase();
            
            //----
            // remove old and attach new piece
            //----
            vobjCell.removeChild(larrPieces[lintII]);
            vobjCell.appendChild(lobjNew);
        }
        
    } catch (err) {
        //----
        // handle the error
        //----
        //~ alert(err.toString());
        lblnReturn = false;
        var lobjMessages = $('#messages')[0];
        lobjMessages.innerHTML = gstrClosePopup + err.toString();
        Show(lobjMessages);     //.className = lobjMessages.className.replace(/no-show[ ]?/g, '');
    }
    
    return lblnReturn;
}


//====
/// @fn UpdateScores()
/// @brief updates the score display
/// @author Trevor Ratliff
/// @date 2014-01-15
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-15  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function UpdateScores() {
    Log('UpdateScores');
    if (!gblnWon) {
        var lobjPlayerA = $('.player-a');
        var lobjPlayerB = $('.player-b');
        
        //----
        // check to see if a player has a score of 0
        //----
        if ((lobjPlayerA.length < 1 || lobjPlayerB.length < 1) && gintPlayCount > 2) {
            gblnCanPlay = false;
            gblnWon = true;
            //~ throw 'Player ' + (lobjPlayerA.length < 1 ? 'B' : 'A') + ' Won!!';
            window.setTimeout( function () {
                //~ alert('Player' + (lobjPlayerA.length < 1 ? 'B' : 'A') + ' Won!!');
                var lobjMessages = $('#messages')[0];
                lobjMessages.innerHTML = gstrClosePopup + 'Player ' + (lobjPlayerA.length < 1 ? 'B' : 'A') + ' Won!!';
                Show(lobjMessages);     //.className = lobjMessages.className.replace(/no-show[ ]?/g, '');
            }, 500);
        }
        
        $('#playerScoreA')[0].innerHTML = lobjPlayerA.length;
        $('#playerScoreB')[0].innerHTML = lobjPlayerB.length;
    }
}


//====
// register events
//====
/// @fn onload()
/// @brief hook into onload event to initialize the page
/// @author Trevor Ratliff
/// @date 2014-01-10
/// @param 
/// @return 
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-01-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
window.addEventListener(
    'load', 
    function () {
        //~ alert('load');
        //----
        // set some flags
        //----
        gblnDebug = window.location.search.indexOf('debug') > 0 ? true : false;
        gblnLog = typeof console == 'object' ? (
                typeof console.log == 'function' ? true : false
            ) : false;
        
        //----
        // run init code
        //----
        GameInit();
        
        //----
        // add event listeners
        //----
        var lobjBoardSize = $('#selBoardSize')[0];
        lobjBoardSize.addEventListener(
            'change',
            function () {
                gblnFirstPlayersTurn = false;
                GameInit();
            },
            true
        );
        
        var lobjReset = $('#reset')[0];
        lobjReset.addEventListener('click', GameInit, true);
    },
    //~ GameInit,
    true
);


//----
// add FixBoardSize to the window resize event listener
//----
window.addEventListener (
    'resize',
    FixBoardSize,
    true
);
