//====
/// @file cssTabsTest.js
/// @brief javascript functions to make tabs work in IE
/// @author Trevor Ratliff
/// @date 2013-06-04
//  
//  Definitions:
//      TabClick() -- function that shows tab content for clicked tab and hides 
//          all others
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-06-04  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  | 
///         file creation  |
/// @endverbatim
//====


//====
/// @fn TabClick(my_param)
/// @brief function that shows tab content for clicked tab and hides 
///          all others
/// @author Trevor Ratliff
/// @date 2013-06-04
/// @param robjE -- reference to calling element
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// @endverbatim
//====
function TabClick(robjE){
    //----
    // show one tab and hide others
    //----
    var lstrMessage = "";
    var larrLi = document.getElementsByTagName("li")
    
    //~ for (ii in robjE) {
        //~ lstrMessage += "<br />" + ii + ": " + robjE[ii];
    //~ }
    //~ document.getElementById('messages').innerHTML = lstrMessage;
    
    for (var ii = 0; ii < larrLi.length; ii++) {
        //~ alert(larrLi[ii]);
        larrLi[ii].className = larrLi[ii].className.replace(" active", "");
        larrLi[ii].style.zIndex = 20;
    }
    
    setTimeout(function () {
        document.querySelector(
            "[href='" + location.hash + "']"
        ).parentNode.className += ' active';
        
        document.querySelector(
            "[href='" + location.hash + "']"
        ).parentNode.style.zIndex = 200;
    }, 10);
    
    if (isMSIE) {
        larrLi = document.querySelectorAll(".tabpanel");
        
        for (var ii = 0; ii < larrLi.length; ii++) {
            larrLi[ii].style.zIndex = 10;
        }
        
        setTimeout(function () {
            document.getElementById(location.hash.substring(1)).style.zIndex = 100;
        }, 10);
    }
}


//====
/// @fn anonymous
/// @brief sets up event listeners for IE to make tabs work
/// @author Trevor Ratliff
/// @date 2013-06-04
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-06-04  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
var isMSIE = /*@cc_on!@*/0;
function Init() {
    //----
    // ie test: if true add event listeners to make tabs work in ie
    //----
    if (isMSIE) {
        // do IE-specific things
        document.getElementById("contentDefault").style.display = "block";
    } else {
        // do non IE-specific things
    }
    
    if (location.hash == "") {
        location.href = "#contentDefault";
    }
    
    var larrLi = document.getElementsByTagName("li")
    
    for (var ii = 0; ii < larrLi.length; ii++) {
        larrLi[ii].onclick = TabClick;
    }
}
