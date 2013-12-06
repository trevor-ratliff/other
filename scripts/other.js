//====
/// @file other.js
/// @brief holds site wide javascript
/// @author Trevor Ratliff
/// @date 2013-12-04
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-12-04  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         file creation  |
/// @endverbatim
//====

//----
// setup breadcrumbs
//----
var objCrumbs = new BreadCrumb({Separator: '&nbsp;>&nbsp;'});
objCrumbs.Add(window.location.toString(), document.title);


window.addEventListener('load', function (vobjEvent) {
	//----
	// do stuff here for page load
	//----
	//~ alert('hello');
	var lstrCrumbs = objCrumbs.Generate('style');
	
	document.querySelector('#breadcrumbs').innerHTML = lstrCrumbs;
});
