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
  if (!window.XMLHttpRequest) {
    //console.log('XMLHttpRequest not enabled');

    window.XMLHttpRequest = function () {
      var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP'),
        out = {
          isFake: true,
          send: function (a) {
            xmlhttp.send(a);
          },
          open: function (a, b, c, d, e) {
            xmlhttp.open(a, b, c, d, e);
          },
          setRequestHeader: function (a, b) {
            xmlhttp.setRequestHeader(a, b);
          },
          getAllResponseHeaders: function () {
            return xmlhttp.getAllResponseHeaders();
          }
        };

      xmlhttp.onreadystatechange = function () {
        out.readyState = xmlhttp.readyState;

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          out.status = xmlhttp.status;
          out.responseText = xmlhttp.responseText;
          out.responseXML = xmlhttp.responseXML;
          out.statusText = xmlhttp.statusText;

          if (out.onload) {
            out.onload.apply(this, arguments);
          }
        }

        if (out.onreadystatechange) {
          out.onreadystatechange.apply(this, arguments);
        }

      };

      return out;

    };
  }

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

  // textContent shim using Sizzle / jQuery get & set text methods
  (function () {

    var getText = function (elem) {
      var node,
        ret = '',
        i = 0,
        nodeType = elem.nodeType;

      if (!nodeType) {
        // If no nodeType, this is expected to be an array
        while ((node = elem[i++])) {
          // Do not traverse comment nodes
          ret += getText(node);
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        // Traverse its children
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          ret += getText(elem);
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      }
      // Do not include comment or processing instruction nodes

      return ret;
    };

    if (Object.defineProperty && Object.getOwnPropertyDescriptor &&
      Object.getOwnPropertyDescriptor(Element.prototype, 'textContent') &&
      !Object.getOwnPropertyDescriptor(Element.prototype, 'textContent').get) {
      var innerText = Object.getOwnPropertyDescriptor(Element.prototype, 'innerText');
      Object.defineProperty(Element.prototype, 'textContent', {
        get: function () {
          return getText(this);
        },
        set: function (x) {
          //var $this = $(this);
          //return $this.empty().append(($this[0] && $this[0].ownerDocument || document).createTextNode(x));
          // empty
          while (this.hasChildNodes()) {
            this.removeChild(this.lastChild);
          }
          // add text node
          return this.appendChild((this && this.ownerDocument || document).createTextNode(x));
        }
      });
    }

  })();

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

      // http://msdn.microsoft.com/en-us/library/ie/hh180173%28v=vs.85%29.aspx
      if (type === 'load' && this.tagName && this.tagName === 'SCRIPT') {
        var reg = registry[0][3];
        this.onreadystatechange = function (event) {
          if (this.readyState === "loaded" || this.readyState === "complete") {
            reg.call(this, {
              type: "load"
            });
          }
        }
      } else {
        this.attachEvent('on' + type, registry[0][3]);
      }
    };
    WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
      for (var index = 0, register; register = registry[index]; ++index) {
        if (register[0] == this && register[1] == type && register[2] == listener) {
          if (type === 'load' && this.tagName && this.tagName === 'SCRIPT') {
            this.onreadystatechange = null;
          }

          return this.detachEvent('on' + type, registry.splice(index, 1)[0][3]);
        }
      }
    };
    WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
      return this.fireEvent('on' + eventObject.type, eventObject);
    };
  })(Window.prototype, HTMLDocument.prototype, Element.prototype, 'addEventListener', 'removeEventListener', 'dispatchEvent', []);

}());
