//====
/// @file 
/// @brief 
/// @author 
/// @date 
//  
//  Definitions:
//      gblnFirstPlayersTurn -- flag for player's turn
//      $() -- alias for document.querySelectorAll()
//      CellClick() -- handles a cell being clicked
//      GameInit() -- initializes the game
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// @endverbatim
//====

var gblnFirstPlayersTurn = false;


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
    alert( 'first players turn = "' + gblnFirstPlayersTurn + 
        '"\ncell id = "' + this.id + '"' );
    gblnFirstPlayersTurn = !gblnFirstPlayersTurn;
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
    alert('init');
    if (gblnFirstPlayersTurn) return;
    //----
    // generate board
    //----
    var lobjBoard = $('#board')[0];
    var lintBoardSize = $('#selBoardSize')[0].value;
    
    //----
    // loop through board size to create each cell
    //----
    for (var lintII = 0; lintII < lintBoardSize; lintII++) {
        for (var lintNN = 0; lintNN < lintBoardSize; lintNN++) {
            //----
            // set up cell
            //----
            var lobjCell = document.createElement('div');
            lobjCell.id = 'r' + lintII + 'c' + lintNN;
            lobjCell.className = 'cell active';
            
            //----
            // if this is the last in the row mark it as such
            //----
            if (lintNN == 0) lobjCell.className += ' last-in-row';
            
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
    // set up players
    //----
    gblnFirstPlayersTurn = true;
    
    return;
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
document.addEventListener(
    'load', 
    function () {
        alert('load');
        //----
        // run init code
        //----
        GameInit();
    },
    //~ GameInit,
    true
);
