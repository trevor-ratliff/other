let _app = { cons: console || {} };

(function (self){
    if (!!_app.cons && !!_app.cons.log) {
        _app.cons.log("Hello from Tick-Tack-Toek");
    } else {
        self.alert("hello from tick-tack-toek");
    }
})(this);
