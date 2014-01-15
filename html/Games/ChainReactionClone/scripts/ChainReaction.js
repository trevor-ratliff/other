//====
/// @file 
/// @brief 
/// @author 
/// @date 
//  
//  Definitions:
//      gblnFirstPlayersTurn -- flag for player's turn
//      gintPlayCount -- counter for number of plays
//      $() -- alias for document.querySelectorAll()
//      CellClick() -- handles a cell being clicked
//      GameInit() -- initializes the game
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// @endverbatim
//====

var gblnFirstPlayersTurn = false;
var gintPlayCount = 0;


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
    //~ alert( 'first players turn = "' + gblnFirstPlayersTurn + 
        //~ '"\ncell id = "' + this.id + '"' );
    var lstrPlayer = gblnFirstPlayersTurn ? 'A' : 'B';
    
    try {
        //----
        // check to see if the player can go here
        //----
        if (this.getAttribute('player') != '' && 
            this.getAttribute('player') != lstrPlayer) {
            throw 'You can not play here';
        }
        
        //----
        // call PlacePiece() to add player's piece to the board
        //----
        PlacePiece(this)
        
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
        alert(err.toString());
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
    //~ alert('chain reaction started');
    
    //----
    // setup reaction 'animation'
    //----
    window.setTimeout(PieceAnimate, 50);
    
    //----
    // set up reaction
    //----
    window.setTimeout(Reaction, 1500);
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
    //~ alert('init');
    if (gblnFirstPlayersTurn) return;
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
            lobjCell.className = 'cell active';
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
            // register events for this cell
            //----
            lobjCell.addEventListener('click', CellClick, false);
        }
    }
    
    //----
    // fix board width and height
    //----
    $('#board')[0].style.height = 'calc(' + lintBoardSize + '*2em + 1ex)';
    $('#board')[0].style.width = 'calc(' + lintBoardSize + '*2em + 1ex)';
    
    //----
    // set up players
    //----
    gblnFirstPlayersTurn = true;
    
    return;
}


//====
/// @fn PieceAnimate()
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
function PieceAnimate() {
    var larrCells = $('.cell[pieces="4"][maxpieces="4"], ' + 
        '.cell[pieces="3"][maxpieces="3"], ' + 
        '.cell[pieces="2"][maxpieces="2"]');
    
    //----
    // loop through node list
    //----
    for (var lintII = 0; lintII < larrCells.length; lintII++) {
        //~ var larrPieces = larrCells[lintII].querySelectorAll('.piece');
        
        //~ //----
        //~ // loop through pieces
        //~ //----
        //~ for (var lintNN = 0; lintNN < larrPieces.length; lintNN++) {
            //~ //----
            //~ // shake them
            //~ //----
            //~ window.setTimeout(
                //~ function () {
                    //----
                    // use css transform
                    //----
                    //~ larrPieces[lintNN].style.transform = 'translate(-3,0)';
                    //~ larrPieces[lintNN].style.transform = 'translate(0,-3)';
                    //~ larrPieces[lintNN].style.transform = 'translate(3,0)';
                    //~ larrPieces[lintNN].style.transform = 'translate(0,3)';
                    //~ larrPieces[lintNN].style.transform = 'translate(0,0)';
                //~ }, 
                //~ 10
            //~ );
        //~ }
        larrCells[lintII].style.backgroundColor = '#ffff99';
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
    var lblnReturn = true;
    var lintPieces = 0;
    var lstrPlayer = gblnFirstPlayersTurn ? 'A' : 'B';
    var lobjNewPiece = $('#svgPlayer' + 
        lstrPlayer)[0].cloneNode();
    
    try {
        //----
        // add the player's piece to the board
        //----
        lintPieces += parseInt(vobjCell.getAttribute('pieces')) + 1;
        vobjCell.setAttribute('pieces', lintPieces);
        vobjCell.setAttribute('player', lstrPlayer);
        
        lobjNewPiece.id = 'piece_' + gintPlayCount;
        vobjCell.appendChild(lobjNewPiece);
        
        //----
        // check for chain reaction
        //----
        if (vobjCell.getAttribute('maxPieces') == lintPieces) {
            //----
            // start chain reaction
            //----
            ChainReaction();
        }
        
        //----
        // update scores and increment play count
        //----
        UpdateScores();
        gintPlayCount ++;
        
    } catch (err) {
        //----
        // process the error
        //----
        lblnReturn = false;
        alert('failure: ' + err.toString());
    }
    
    return lblnReturn;
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
    //----
    // get reacting cells
    //----
    var larrCells = $('.cell[pieces="4"][maxpieces="4"], ' + 
        '.cell[pieces="3"][maxpieces="3"], ' + 
        '.cell[pieces="2"][maxpieces="2"]');
    
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
                }
                
                lintCount++;
            }
            
            //----
            // move one right
            //----
            if (lstrCol != ('c' + $('#selBoardSize')[0].value) && 
                lintCount < larrPieces.length) 
            {
                var lintNewCol = parseInt(lstrCol.substring(1)) + 1;
                var lobjCell = $('#'+ lstrRow + 'c' + lintNewCol)[0];
                
                if (lobjCell) {
                    lobjCell.appendChild(larrPieces[lintCount]);
                    lobjCell.setAttribute('pieces', parseInt(lobjCell.getAttribute('pieces')) + 1);
                }
                
                lintCount++;
            }
            
            //----
            // move one down
            //----
            if (lstrRow != ('r' + $('#selBoardSize')[0].value) && 
                lintCount < larrPieces.length) 
            {
                var lintNewRow = parseInt(lstrRow.substring(1)) + 1;
                var lobjCell = $('#r'+ lintNewRow + lstrCol)[0];
                
                if (lobjCell) {
                    lobjCell.appendChild(larrPieces[lintCount]);
                    lobjCell.setAttribute('pieces', parseInt(lobjCell.getAttribute('pieces')) + 1);
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
                }
                
                lintCount++;
            }
        }
        
        //----
        // reset cell
        //----
        larrCells[lintII].setAttribute('pieces', 0);    // larrCells[lintII].querySelectorAll('.piece').length);
        larrCells[lintII].setAttribute('player', '');
        larrCells[lintII].style.backgroundColor = 'hsla(180, 100%, 98%, 1)';
        
        //----
        // check to see if we need to run Reaction again
        //----
        larrCells = $('.cell[pieces="4"][maxpieces="4"], ' + 
        '.cell[pieces="3"][maxpieces="3"], ' + 
        '.cell[pieces="2"][maxpieces="2"]');
        
        if (larrCells.length > 0) ChainReaction();
    }
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
    var lobjPlayerA = $('.player-a');
    var lobjPlayerB = $('.player-b');
    
    $('#playerScoreA')[0].innerHTML = lobjPlayerA.length - 1;
    $('#playerScoreB')[0].innerHTML = lobjPlayerB.length - 1;
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
        // run init code
        //----
        //~ if (typeof $('#board')[0] != 'undefined') {
            GameInit();
            
            var lobjBoardSize = $('#selBoardSize')[0];
            lobjBoardSize.addEventListener(
                'change',
                function () {
                    gblnFirstPlayersTurn = false;
                    GameInit();
                },
                true
            );
        //~ }
    },
    //~ GameInit,
    true
);
