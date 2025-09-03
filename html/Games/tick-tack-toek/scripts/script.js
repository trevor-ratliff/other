let _app = { 
    cons: console || {},
    turn: 'x',
    hasWon: false
};

(function (self){
    // add greeting
    if (!!_app.cons && !!_app.cons.log) {
        _app.cons.log("Hello from Tick-Tack-Toek");
    } else {
        self.alert("hello from tick-tack-toek");
    }

    // add click handler to '.grid-item'
    
})(this);
