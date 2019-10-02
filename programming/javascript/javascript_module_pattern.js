var UTIL = (function (parent, [OTHER_IMPORTED_LIBRARIES]) {
	var my = parent.ajax = parent.ajax || {};    //submodule registration

	my.get = function (url, params, callback) {
		// ok, so I'm cheating a bit :)
		return $.getJSON(url, params, callback);    //submodule method
	};

	// etc...

	return parent;   //returning updated parent object
}(UTIL || {}, jQuery));   //creates parent module if it doesn't exist, and passes in other libraries
