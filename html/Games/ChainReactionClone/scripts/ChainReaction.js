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
    alert('chain reaction started');
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
    var lobjNewPiece = $('#svgPlayer' + 
        (gblnFirstPlayersTurn ? 'A' : 'B'))[0].cloneNode();
    
    try {
        //----
        // add the player's piece to the board
        //----
        lintPieces += parseInt(vobjCell.getAttribute('pieces')) + 1;
        vobjCell.setAttribute('pieces', lintPieces);
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
            
            //----
            // reset cell
            //----
            vobjCell.setAttribute('pieces', 0);
        }
        
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

