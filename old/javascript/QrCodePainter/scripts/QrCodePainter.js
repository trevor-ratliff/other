//====
///
/// \file QrCodePainter.js
/// \brief holds the javascript to run the QrCodePainter application
/// \author Trevor Ratliff
/// \date 2012-03-13
/// Definitions:
///     GenerateQrTemplate() -- creates a blank QR Code template to paint
///     GetSize() -- calculates the size in modules of a side of the QR Code
///     PaintModule() -- switches the module from black to white or vise versa
///     PlaceMarker() -- adds special marks on QR Code template
///     UpdateForm() -- clears current data and generates a new template
///     
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-03-13  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  file 
///         creation  |
///     2012-03-14  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  added 
///         more functions to calculate sizes, clear/update the forms ...  |
//====


//====
///
/// \breif Generates all the div's needed to display a QR Code of the passed in version
/// \author Trevor Ratliff
/// \date 2012-03-13
/// 
/// The version determins the size of the QR Code.  The number of cells or modules
///     per side is determined by the following algorithum ((Version - 1) * 4) + 21
/// 
/// Definitions:
///     \param vintVersion -- the version of QR Code to generate (size)
///     
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-03-13  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  function 
///         creation  |
//====
function GenerateQrTemplate(vintVersion) {
    var lintSize = GetSize(vintVersion);
    var lintModuleSize = ValidateInt(document.getElementById("txtModuleSize"), 1, 20);
    var lstrData = "";
    var lobjContents = document.getElementById("content");
    var lobjCurEl = null;
    var lobjModule = null;
    
    //----
    // add divs
    //----
    for(ii = 0; ii < lintSize; ii++) {
        for(nn = 0; nn < lintSize; nn++) {
            lstrData += "<div id=\"div" + ii +"_"+ nn +
                "\" class=\"module off\" onclick=\"PaintModule(this);\"></div>";
        }
    }
    
    lobjContents.innerHTML = lstrData +"<br style=\"clear: both; height: 0ex;\" />";
    
    //----
    // adjust styles
    //----
    document.styleSheets[0].addRule(".module", "width: " + lintModuleSize + "ex; height:" + lintModuleSize + "ex;");
    document.styleSheets[0].addRule("#content", "width: " + (lintSize * lintModuleSize) + "ex;" +
        "margin: " + (lintModuleSize * 4) + "ex;");
    
    //----
    // add position markers
    //----
    PlaceMarker('position', 4, 4);
    PlaceMarker('position', 4, (lintSize - 3));
    PlaceMarker('position', (lintSize - 3), 4);
    
    //----
    // add alignment marks
    //----
    
    
    //----
    // add timing marks
    //----
    PlaceTiming(lintSize);
    
}


//====
///
/// \breif calculates the size of the qr code in modules/side
/// \author Trevor Ratliff
/// \date 2012-03-14
/// Definitions:
///     \param vintVersion -- the version of the qr code
///     
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-03-14  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  function 
///         creation  |
//====
function GetSize(vintVersion) {
    var lintSize = 0;
    
    lintSize = ((vintVersion - 1) * 4) + 21;
    
    return lintSize;
}


//====
///
/// \breif turns the module on or off
/// \author Trevor Ratliff
/// \date 2012-03-13
/// Definitions:
///     \param vobjDiv -- the div to turn on or off
///     
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-03-13  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  function 
///         creation  |
//====
function PaintModule(vobjDiv) {
    //----
    // test to see if this isn't a protected div
    //----
    if(vobjDiv.className.search('protected') < 0) {
        //----
        // test for the on class and swap states
        //----
        if(vobjDiv.className.match('on')) {
            vobjDiv.className = vobjDiv.className.replace('on', 'off');
        } else {
            vobjDiv.className = vobjDiv.className.replace('off', 'on');
        }
    }
}


//====
///
/// \breif generates a mark of specified type at specified point
/// \author Trevor Ratliff
/// \date 2012-03-13
/// Definitions:
///     \param vstrType -- the type of mark to make ['position' or 'alignment']
///     \param vintX -- the x position of the div
///     \param vintY -- the y position of the div
///     
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-03-13  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  function 
///         creation  |
///     2012-03-14  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  added 
///         masks to the markers
//====
function PlaceMarker(vstrType, vintX, vintY) {
    //----
    // set pattern masks
    //----
    var lintMask = 0;
    var larrPosition = new Array('on', 'on',  'on',  'on',  'on',  'on',  'on',
                                 'on', 'off', 'off', 'off', 'off', 'off', 'on',
                                 'on', 'off', 'on',  'on',  'on',  'off', 'on',
                                 'on', 'off', 'on',  'on',  'on',  'off', 'on',
                                 'on', 'off', 'on',  'on',  'on',  'off', 'on',
                                 'on', 'off', 'off', 'off', 'off', 'off', 'on',
                                 'on', 'on',  'on',  'on',  'on',  'on',  'on');
    
    var larrAlignment = new Array('on', 'on',  'on',  'on',  'on',
                                  'on', 'off', 'off', 'off', 'on',
                                  'on', 'off', 'on',  'off', 'on',
                                  'on', 'off', 'off', 'off', 'on',
                                  'on', 'on',  'on',  'on',  'on');
    
    //----
    // switch base on type
    //----
    switch(vstrType) {
        case "position":
            //----
            // do position mark
            //----
            for(ii=(vintY - 4); ii < (vintY + 3); ii++) {
                for(nn=(vintX - 4); nn < (vintX + 3); nn++) {
                    lobjModule = document.getElementById('div'+ ii +'_'+ nn);
                    lobjModule.className = lobjModule.className.replace('off', 
                        larrPosition[lintMask] + ' protected');
                    lintMask ++;
                }
            }
            
            break;
        default:
            //----
            // do alignment mark
            //----
            for(ii=(vintY - 2); ii <= (vintY + 2); ii++) {
                for(nn=(vintX - 2); nn <= (vintX + 2); nn++) {
                    lobjModule = document.getElementById('div'+ ii +'_'+ nn);
                    lobjModule.className = lobjModule.className.replace('off',  
                        larrPosition[lintMask] + ' protected');
                    lintMask ++;
                }
            }
            break;
    }
}


//====
///
/// \brief adds the timing marks for the QR Code
/// \author Trevor Ratliff
/// \date 2012-03-14
/// 
/// Definitions:
///     \param vintSize -- size of a side in modules
/// 
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-03-14  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  function 
///         creation  |
//====
function PlaceTiming(vintSize) {
    var lintSize = vintSize;
    var lobjCurEl = null;
    
    for(ii = 7; ii < (lintSize - 7); ii++) {
        lobjCurEl = document.getElementById("div6_"+ ii);
        if(lobjCurEl) {
            if(ii % 2 == 0) {
                lobjCurEl.className = lobjCurEl.className.replace('off', 'on protected');
            } else {
                lobjCurEl.className = lobjCurEl.className.replace('off', 'off protected');
            }
        }
    }
    
    for(ii = 7; ii < (lintSize - 7); ii++) {
        lobjCurEl = document.getElementById("div"+ ii + "_6");
        
        if(lobjCurEl) {
            if(ii % 2 == 0) {
                lobjCurEl.className = lobjCurEl.className.replace('off', 'on protected');
            } else {
                lobjCurEl.className = lobjCurEl.className.replace('off', 'off protected');
            }
        }
    }
    
    lobjCurEl = document.getElementById("div" + (lintSize - 8) + "_8");
    lobjCurEl.className = lobjCurEl.className.replace('off', 'on protected');
}


//====
///
/// \breif validates the user input to be within limits
/// \author Trevor Ratliff
/// \date 2012-03-14
/// Definitions:
///     \param robjElement -- the input element to validate
///     \param vintLow -- lower bound
///     \param vintHigh -- upper bound
///     
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-03-14  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  function 
///         creation  |
//====
function ValidateInt(robjElement, vintLow, vintHigh) {
    var lblnGood = false;
    var lintValue = 0;
    
    //----
    // get a integer from the user
    //----
    while(!lblnGood) {
        //----
        // make sure value is integer
        //----
        if(robjElement.value.toString().search(/^[0-9]*$/) >= 0) {
            //----
            // make sure value is between vintLow and vintHigh
            //----
            lintValue = parseInt(robjElement.value);
            if(vintLow <= lintValue && lintValue <= vintHigh) lblnGood = true;
        }
        
        if(!lblnGood) {
            lintValue = prompt("Please enter a number between '" + 
                vintLow.toString() + "' and '" + vintHigh.toString() + "'");
            
            robjElement.value = lintValue;
        }
    }
    
    return lintValue;
}


//====
///
/// \breif clears and regenerates a QR Code Template
/// \author Trevor Ratliff
/// \date 2012-03-14
/// Definitions:
///     
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2012-03-14  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  function 
///         creation  |
//====
function UpdateForm() {
    var lintVersion = ValidateInt(document.getElementById("txtVersion"), 1, 40);
    var lobjContent = document.getElementById("content");
    
    //----
    // clear form
    //----
    lobjContent.innerHTML = "";
    
    //----
    // generate a new one
    //----
    GenerateQrTemplate(lintVersion);
}
