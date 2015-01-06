var LexIrishDance = LexIrishDance || {};

LexIrishDance.GoTo = function () {
  window.location.href = this.getAttribute('ref');
  return;
};

//====
// set up on load event
//====
window.addEventListener('load', function (e) {
  //~ alert('main.js');
  var larrMenus = document.querySelectorAll("#menu li");
  
  for (var lintII = 0; lintII < larrMenus.length; lintII++) {
    larrMenus[lintII].addEventListener('click', LexIrishDance.GoTo);
  }
});
