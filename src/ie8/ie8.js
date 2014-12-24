// Polyfills for AngularJS 1.3

(function () {

  // detect IE8 one way or another
  /*one way
	var ie=function(){
		for(var e,i=3,n=document.createElement("div"),t=n.getElementsByTagName("i");
		n.innerHTML="<!--[if gt IE "+ ++i+"]><i></i><![endif]-->",t[0];);return i>4?i:e
	}();
	if (ie !== 8) {
		// proper browsers exit here
		return;
	}
  */

  // another way
  if (window.addEventListener) {
    // proper browsers exit here
    return;
  }

  // ie8 ftw...

  // ------ XMLHttpRequest.onload ------
  // monkey patch XMLHttpRequest to make IE8 call onload when readyState === 4
  var sendFn = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    // only if onreadystatechange has not already been set
    // to avoid breaking anything outside of angular
    if (!this.onreadystatechange) {
      this.onreadystatechange = function () {
        if (this.readyState === 4 && this.onload) {
          this.onload();
        }
      };
    }
    // apply this & args to original send
    sendFn.apply(this, arguments);
  };


  // ------ Object.create ------
  // force Object.create to this implementation for IE8
  // (es5-sham version doesn't work in this instance)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  Object.create = (function () {
    var Object = function () {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw Error('Second argument not supported');
      }
      if (typeof prototype != 'object') {
        throw TypeError('Argument must be an object');
      }
      Object.prototype = prototype;
      var result = new Object();
      Object.prototype = null;
      return result;
    };
  })();


  // ------ Object.getPrototypeOf ------
  // http://stackoverflow.com/a/15851520/674863
  if (typeof Object.getPrototypeOf !== 'function') {
    Object.getPrototypeOf = ''.__proto__ === String.prototype ? function (object) {
      return object.__proto__;
    } : function (object) {
      // May break if the constructor has been tampered with
      return object.constructor.prototype;
    };
  }

  // ------ addEventListener ------
  // https://gist.github.com/jonathantneal/3748027
  !window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
    WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
      var target = this;
      registry.unshift([target, type, listener,
    function (event) {
          event.currentTarget = target;
          event.preventDefault = function () {
            event.returnValue = false;
          };
          event.stopPropagation = function () {
            event.cancelBubble = true;
          };
          event.target = event.srcElement || target;
          listener.call(target, event);
    }]);
      this.attachEvent('on' + type, registry[0][3]);
    };
    WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
      for (var index = 0, register; register = registry[index]; ++index) {
        if (register[0] == this && register[1] == type && register[2] == listener) {
          return this.detachEvent('on' + type, registry.splice(index, 1)[0][3]);
        }
      }
    };
    WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
      return this.fireEvent('on' + eventObject.type, eventObject);
    };
  })(Window.prototype, HTMLDocument.prototype, Element.prototype, 'addEventListener', 'removeEventListener', 'dispatchEvent', []);

}());
