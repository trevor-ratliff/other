//====
/// @file learningPolymer.js
/// @brief javascript to run learning page
/// @author Trevor Ratliff
/// @date 2015-04-16
//  
//  Definitions:
//  	addOne(vstrId) -- adds a row to the row-repeat element specified
//  	subOne(vstrId) -- subtracts a row from the element
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///		2015-04-16  |  Trevor Ratliff  | trevor.w.ratliff@gmail.com  |
///			file creation  |
///		2015-04-17  |  Trevor Ratliff  | trevor.w.ratliff@gmail.com  |
///			adding addOne and subOne functions  |
///		2015-04-27  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///			these functions aren't used since I put the add/sub buttons in the 
///			row-repeat element  |
/// @endverbatim
//====

window.Polymer = window.Polymer || {};
window.Polymer.dom = 'shadow';

//====
/// @fn addOne (vstrId)
/// @author Trevor Ratliff
/// @date 2015-04-17
/// @param vstrId -- id of row repeater to modify
/// @return int -- the new count
//  
//  Definitions:
//      lobjRowRepeater -- reference to row repeater element
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-04-17  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
function addOne (vstrId) {	// returns int
	var lobjRowRepeater = document.getElementById(vstrId);

	//----
	// set count
	//----
	lobjRowRepeater.count++;

	return lobjRowRepeater.count;
}


//====
/// @fn subOne (vstrId)
/// @author Trevor Ratliff
/// @date 2015-04-17
/// @param vstrId -- id of row repeater element
/// @return int --the new count
//  
//  Definitions:
//      lobjRowRepeater -- reference to repeater element
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-04-17  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
function subOne (vstrId) {	//returns int
	var lobjRowRepeater = document.getElementById(vstrId);

	//----
	// set count
	//----
	lobjRowRepeater.count = lobjRowRepeater.count < 1 ? 0 : 
		lobjRowRepeater.count - 1;

	return lobjRowRepeater.count;
}


//====
/// @fn window.addEventListener ('load', function ())
/// @author Trevor Ratliff
/// @date 2015-06-16
/// @param 'load', function () -- sets event listeners for the row-repeats
/// @return null --	
//  
//  Definitions:
//      _ -- _
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-06-16  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
window.addEventListener('load', function (e) {
	var lobjRrp = document.getElementById('rrp');
	var lobjRrp2 = document.getElementById('rrp2');

	lobjRrp.addEventListener('rpt-loaded', function (e) {
		if (!!console && !!console.log) console.log('rrp load event');
	}, false);
	
	lobjRrp.addEventListener('rpt-changed', function (e) {
		if (!!console && !!console.log) console.log('rrp change event');
	}, false);

	lobjRrp2.addEventListener('rpt-loaded', function (e) {
		if (!!console && !!console.log) console.log('rrp2 load event');
	}, false);

	lobjRrp2.addEventListener('rpt-changed', function (e) {
		if (!!console && !!console.log) console.log('rrp2 change event');
	}, false);
	
}, false);

