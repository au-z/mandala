var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var camelToDashMap = new Map();
function camelToDash(str) {
  var result = camelToDashMap.get(str);
  if (result === void 0) {
    result = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    camelToDashMap.set(str, result);
  }
  return result;
}
function pascalToDash(str) {
  return camelToDash(str.replace(/((?!([A-Z]{2}|^))[A-Z])/g, "-$1"));
}
function shadyCSS(fn, fallback) {
  var shady = window.ShadyCSS;
  if (shady && !shady.nativeShadow) {
    return fn(shady);
  }
  return fallback;
}
function stringifyElement(target) {
  return "<".concat(String(target.tagName).toLowerCase(), ">");
}
var IS_IE = "ActiveXObject" in window;
Promise.resolve();
var storePointer = new WeakMap();
function _typeof$8(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$8 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$8 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$8(obj);
}
var defaultTransform = function defaultTransform2(v) {
  return v;
};
var objectTransform = function objectTransform2(value) {
  if (_typeof$8(value) !== "object") {
    throw TypeError("Assigned value must be an object: ".concat(_typeof$8(value)));
  }
  return value && Object.freeze(value);
};
function property(value, connect) {
  var type = _typeof$8(value);
  var transform = defaultTransform;
  switch (type) {
    case "string":
      transform = String;
      break;
    case "number":
      transform = Number;
      break;
    case "boolean":
      transform = Boolean;
      break;
    case "function":
      transform = value;
      value = transform();
      break;
    case "object":
      if (value)
        Object.freeze(value);
      transform = objectTransform;
      break;
  }
  return {
    get: function get3(host) {
      var val = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : value;
      return val;
    },
    set: function set3(host, val, oldValue) {
      return transform(val, oldValue);
    },
    connect: type !== "object" && type !== "undefined" ? function(host, key2, invalidate2) {
      if (host[key2] === value) {
        var attrName = camelToDash(key2);
        if (host.hasAttribute(attrName)) {
          var attrValue = host.getAttribute(attrName);
          host[key2] = attrValue === "" && transform === Boolean ? true : attrValue;
        }
      }
      return connect && connect(host, key2, invalidate2);
    } : connect
  };
}
function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys$1(Object(source), true).forEach(function(key2) {
        _defineProperty$1(target, key2, source[key2]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
  }
  return target;
}
function _defineProperty$1(obj, key2, value) {
  if (key2 in obj) {
    Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key2] = value;
  }
  return obj;
}
function _typeof$7(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$7 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$7 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$7(obj);
}
function render(fn) {
  var customOptions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (typeof fn !== "function") {
    throw TypeError("The first argument must be a function: ".concat(_typeof$7(fn)));
  }
  var options = _objectSpread$1({
    shadowRoot: true
  }, customOptions);
  var shadowRootInit = {
    mode: "open"
  };
  if (_typeof$7(options.shadowRoot) === "object") {
    Object.assign(shadowRootInit, options.shadowRoot);
  }
  return {
    get: function get3(host) {
      var update = fn(host);
      var target = host;
      if (options.shadowRoot) {
        if (!host.shadowRoot)
          host.attachShadow(shadowRootInit);
        target = host.shadowRoot;
      }
      return function flush() {
        update(host, target);
        return target;
      };
    },
    observe: function observe2(host, flush) {
      flush();
    }
  };
}
var callbacks = new WeakMap();
var queue = new Set();
function execute() {
  try {
    queue.forEach(function(target) {
      try {
        callbacks.get(target)();
        queue.delete(target);
      } catch (e) {
        queue.delete(target);
        throw e;
      }
    });
  } catch (e) {
    if (queue.size)
      execute();
    throw e;
  }
}
function dispatch(target) {
  if (!queue.size) {
    requestAnimationFrame(execute);
  }
  queue.add(target);
}
function subscribe(target, cb) {
  callbacks.set(target, cb);
  dispatch(target);
  return function unsubscribe() {
    queue.delete(target);
    callbacks.delete(target);
  };
}
var entries = new WeakMap();
function getEntry(target, key2) {
  var targetMap = entries.get(target);
  if (!targetMap) {
    targetMap = new Map();
    entries.set(target, targetMap);
  }
  var entry = targetMap.get(key2);
  if (!entry) {
    entry = {
      target,
      key: key2,
      value: void 0,
      contexts: void 0,
      deps: void 0,
      state: 0,
      checksum: 0,
      observed: false
    };
    targetMap.set(key2, entry);
  }
  return entry;
}
function calculateChecksum(entry) {
  var checksum = entry.state;
  if (entry.deps) {
    entry.deps.forEach(function(depEntry) {
      checksum += depEntry.state;
    });
  }
  return checksum;
}
function dispatchDeep(entry) {
  if (entry.observed)
    dispatch(entry);
  if (entry.contexts)
    entry.contexts.forEach(dispatchDeep);
}
function restoreDeepDeps(entry, deps) {
  if (deps) {
    deps.forEach(function(depEntry) {
      entry.deps.add(depEntry);
      if (entry.observed) {
        if (!depEntry.contexts)
          depEntry.contexts = new Set();
        depEntry.contexts.add(entry);
      }
      restoreDeepDeps(entry, depEntry.deps);
    });
  }
}
var contextStack = new Set();
function get(target, key2, getter, validate) {
  var entry = getEntry(target, key2);
  if (contextStack.size && contextStack.has(entry)) {
    throw Error("Circular get invocation is forbidden: '".concat(key2, "'"));
  }
  contextStack.forEach(function(context) {
    if (!context.deps)
      context.deps = new Set();
    context.deps.add(entry);
    if (context.observed) {
      if (!entry.contexts)
        entry.contexts = new Set();
      entry.contexts.add(context);
    }
  });
  if ((validate && validate(entry.value) || !validate) && entry.checksum && entry.checksum === calculateChecksum(entry)) {
    return entry.value;
  }
  try {
    contextStack.add(entry);
    if (entry.observed && entry.deps && entry.deps.size) {
      entry.deps.forEach(function(depEntry) {
        if (depEntry.contexts)
          depEntry.contexts.delete(entry);
      });
    }
    entry.deps = void 0;
    var nextValue = getter(target, entry.value);
    if (entry.deps) {
      entry.deps.forEach(function(depEntry) {
        restoreDeepDeps(entry, depEntry.deps);
      });
    }
    if (nextValue !== entry.value) {
      entry.state += 1;
      entry.value = nextValue;
      dispatchDeep(entry);
    }
    entry.checksum = calculateChecksum(entry);
    contextStack.delete(entry);
  } catch (e) {
    entry.checksum = 0;
    contextStack.delete(entry);
    contextStack.forEach(function(context) {
      context.deps.delete(entry);
      if (context.observed)
        entry.contexts.delete(context);
    });
    throw e;
  }
  return entry.value;
}
function set$1(target, key2, setter, value) {
  var entry = getEntry(target, key2);
  var newValue = setter(target, value, entry.value);
  if (newValue !== entry.value) {
    entry.checksum = 0;
    entry.state += 1;
    entry.value = newValue;
    dispatchDeep(entry);
  }
}
var gcList = new Set();
function deleteEntry(entry) {
  if (!gcList.size) {
    requestAnimationFrame(function() {
      gcList.forEach(function(e) {
        if (!e.contexts || e.contexts && e.contexts.size === 0) {
          var targetMap = entries.get(e.target);
          targetMap.delete(e.key);
        }
      });
      gcList.clear();
    });
  }
  gcList.add(entry);
}
function invalidateEntry(entry, clearValue, deleteValue) {
  entry.checksum = 0;
  entry.state += 1;
  dispatchDeep(entry);
  if (deleteValue)
    deleteEntry(entry);
  if (clearValue) {
    entry.value = void 0;
  }
}
function invalidate(target, key2, clearValue, deleteValue) {
  if (contextStack.size) {
    throw Error("Invalidating property in chain of get calls is forbidden: '".concat(key2, "'"));
  }
  var entry = getEntry(target, key2);
  invalidateEntry(entry, clearValue, deleteValue);
}
function observe(target, key2, getter, fn) {
  var entry = getEntry(target, key2);
  entry.observed = true;
  var lastValue;
  var unsubscribe = subscribe(entry, function() {
    var value = get(target, key2, getter);
    if (value !== lastValue) {
      fn(target, value, lastValue);
      lastValue = value;
    }
  });
  if (entry.deps) {
    entry.deps.forEach(function(depEntry) {
      if (!depEntry.contexts)
        depEntry.contexts = new Set();
      depEntry.contexts.add(entry);
    });
  }
  return function unobserve() {
    unsubscribe();
    entry.observed = false;
    if (entry.deps && entry.deps.size) {
      entry.deps.forEach(function(depEntry) {
        if (depEntry.contexts)
          depEntry.contexts.delete(entry);
      });
    }
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  if (superClass)
    _setPrototypeOf(subClass, superClass);
}
function _createSuper(Derived) {
  return function() {
    var Super = _getPrototypeOf(Derived), result;
    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof$6(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2))
      return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2))
        return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _typeof$6(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$6 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$6 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$6(obj);
}
try {
  "production";
} catch (e) {
}
var defaultMethod = function defaultMethod2(host, value) {
  return value;
};
var callbacksMap = new WeakMap();
var propsMap = new WeakMap();
function compile(Hybrid, descriptors) {
  Hybrid.hybrids = descriptors;
  var callbacks2 = [];
  var props = Object.keys(descriptors);
  callbacksMap.set(Hybrid, callbacks2);
  propsMap.set(Hybrid, props);
  props.forEach(function(key2) {
    var desc = descriptors[key2];
    var type = _typeof$6(desc);
    var config;
    if (type === "function") {
      config = key2 === "render" ? render(desc) : {
        get: desc
      };
    } else if (type !== "object" || desc === null || Array.isArray(desc)) {
      config = property(desc);
    } else {
      config = {
        get: desc.get || defaultMethod,
        set: desc.set || !desc.get && defaultMethod || void 0,
        connect: desc.connect,
        observe: desc.observe
      };
    }
    Object.defineProperty(Hybrid.prototype, key2, {
      get: function get$1() {
        return get(this, key2, config.get);
      },
      set: config.set && function set3(newValue) {
        set$1(this, key2, config.set, newValue);
      },
      enumerable: true,
      configurable: false
    });
    if (config.observe) {
      callbacks2.unshift(function(host) {
        return observe(host, key2, config.get, config.observe);
      });
    }
    if (config.connect) {
      callbacks2.push(function(host) {
        return config.connect(host, key2, function() {
          invalidate(host, key2);
        });
      });
    }
  });
}
var disconnects = new WeakMap();
function defineElement(tagName, hybridsOrConstructor) {
  var type = _typeof$6(hybridsOrConstructor);
  if (type !== "object" && type !== "function") {
    throw TypeError("Second argument must be an object or a function: ".concat(type));
  }
  if (tagName !== null) {
    var CustomElement = window.customElements.get(tagName);
    if (type === "function") {
      if (CustomElement !== hybridsOrConstructor) {
        return window.customElements.define(tagName, hybridsOrConstructor);
      }
      return CustomElement;
    }
    if (CustomElement) {
      if (CustomElement.hybrids === hybridsOrConstructor) {
        return CustomElement;
      }
      throw Error("Element '".concat(tagName, "' already defined"));
    }
  }
  var Hybrid = /* @__PURE__ */ function(_HTMLElement) {
    _inherits(Hybrid2, _HTMLElement);
    var _super = _createSuper(Hybrid2);
    function Hybrid2() {
      var _this;
      _classCallCheck(this, Hybrid2);
      _this = _super.call(this);
      var props = propsMap.get(Hybrid2);
      for (var index = 0; index < props.length; index += 1) {
        var key2 = props[index];
        if (Object.prototype.hasOwnProperty.call(_assertThisInitialized(_this), key2)) {
          var value = _this[key2];
          delete _this[key2];
          _this[key2] = value;
        }
      }
      return _this;
    }
    _createClass(Hybrid2, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var callbacks2 = callbacksMap.get(Hybrid2);
        var list = [];
        for (var index = 0; index < callbacks2.length; index += 1) {
          var cb = callbacks2[index](this);
          if (cb)
            list.push(cb);
        }
        disconnects.set(this, list);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var list = disconnects.get(this);
        for (var index = 0; index < list.length; index += 1) {
          list[index]();
        }
      }
    }]);
    return Hybrid2;
  }(/* @__PURE__ */ _wrapNativeSuper(HTMLElement));
  compile(Hybrid, hybridsOrConstructor);
  if (tagName !== null) {
    Object.defineProperty(Hybrid, "name", {
      get: function get3() {
        return tagName;
      }
    });
    customElements.define(tagName, Hybrid);
  }
  return Hybrid;
}
function defineMap(elements) {
  return Object.keys(elements).reduce(function(acc, key2) {
    var tagName = pascalToDash(key2);
    acc[key2] = defineElement(tagName, elements[key2]);
    return acc;
  }, {});
}
function define() {
  if (_typeof$6(arguments.length <= 0 ? void 0 : arguments[0]) === "object" && (arguments.length <= 0 ? void 0 : arguments[0]) !== null) {
    return defineMap(arguments.length <= 0 ? void 0 : arguments[0]);
  }
  return defineElement.apply(void 0, arguments);
}
var map = new WeakMap();
var dataMap = {
  get: function get2(key2, defaultValue) {
    var value = map.get(key2);
    if (value)
      return value;
    if (defaultValue) {
      map.set(key2, defaultValue);
    }
    return defaultValue;
  },
  set: function set2(key2, value) {
    map.set(key2, value);
    return value;
  }
};
function getTemplateEnd(node) {
  var data;
  while (node && (data = dataMap.get(node)) && data.endNode) {
    node = data.endNode;
  }
  return node;
}
function removeTemplate(target) {
  if (target.nodeType !== Node.TEXT_NODE) {
    var child = target.childNodes[0];
    while (child) {
      target.removeChild(child);
      child = target.childNodes[0];
    }
  } else {
    var data = dataMap.get(target);
    if (data.startNode) {
      var endNode = getTemplateEnd(data.endNode);
      var node = data.startNode;
      var lastNextSibling = endNode.nextSibling;
      while (node) {
        var nextSibling = node.nextSibling;
        node.parentNode.removeChild(node);
        node = nextSibling !== lastNextSibling && nextSibling;
      }
    }
  }
}
var arrayMap = new WeakMap();
function movePlaceholder(target, previousSibling) {
  var data = dataMap.get(target);
  var startNode = data.startNode;
  var endNode = getTemplateEnd(data.endNode);
  previousSibling.parentNode.insertBefore(target, previousSibling.nextSibling);
  var prevNode = target;
  var node = startNode;
  while (node) {
    var nextNode = node.nextSibling;
    prevNode.parentNode.insertBefore(node, prevNode.nextSibling);
    prevNode = node;
    node = nextNode !== endNode.nextSibling && nextNode;
  }
}
function resolveArray(host, target, value, resolveValue2) {
  var lastEntries = arrayMap.get(target);
  var entries2 = value.map(function(item, index2) {
    return {
      id: Object.prototype.hasOwnProperty.call(item, "id") ? item.id : index2,
      value: item,
      placeholder: null,
      available: true
    };
  });
  arrayMap.set(target, entries2);
  if (lastEntries) {
    var ids = new Set();
    entries2.forEach(function(entry2) {
      return ids.add(entry2.id);
    });
    lastEntries = lastEntries.filter(function(entry2) {
      if (!ids.has(entry2.id)) {
        removeTemplate(entry2.placeholder);
        entry2.placeholder.parentNode.removeChild(entry2.placeholder);
        return false;
      }
      return true;
    });
  }
  var previousSibling = target;
  var lastIndex = value.length - 1;
  var data = dataMap.get(target);
  for (var index = 0; index < entries2.length; index += 1) {
    var entry = entries2[index];
    var matchedEntry = void 0;
    if (lastEntries) {
      for (var i = 0; i < lastEntries.length; i += 1) {
        if (lastEntries[i].available && lastEntries[i].id === entry.id) {
          matchedEntry = lastEntries[i];
          break;
        }
      }
    }
    if (matchedEntry) {
      matchedEntry.available = false;
      entry.placeholder = matchedEntry.placeholder;
      if (entry.placeholder.previousSibling !== previousSibling) {
        movePlaceholder(entry.placeholder, previousSibling);
      }
      if (matchedEntry.value !== entry.value) {
        resolveValue2(host, entry.placeholder, entry.value);
      }
    } else {
      entry.placeholder = document.createTextNode("");
      previousSibling.parentNode.insertBefore(entry.placeholder, previousSibling.nextSibling);
      resolveValue2(host, entry.placeholder, entry.value);
    }
    previousSibling = getTemplateEnd(dataMap.get(entry.placeholder).endNode || entry.placeholder);
    if (index === 0)
      data.startNode = entry.placeholder;
    if (index === lastIndex)
      data.endNode = previousSibling;
  }
  if (lastEntries) {
    lastEntries.forEach(function(entry2) {
      if (entry2.available) {
        removeTemplate(entry2.placeholder);
        entry2.placeholder.parentNode.removeChild(entry2.placeholder);
      }
    });
  }
}
function _typeof$5(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$5 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$5 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$5(obj);
}
function resolveValue$1(host, target, value) {
  var type = Array.isArray(value) ? "array" : _typeof$5(value);
  var data = dataMap.get(target, {});
  if (data.type !== type) {
    removeTemplate(target);
    if (type === "array")
      arrayMap.delete(target);
    data = dataMap.set(target, {
      type
    });
    if (target.textContent !== "") {
      target.textContent = "";
    }
  }
  switch (type) {
    case "function":
      value(host, target);
      break;
    case "array":
      resolveArray(host, target, value, resolveValue$1);
      break;
    default:
      target.textContent = type === "number" || value ? value : "";
  }
}
function _typeof$4(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$4 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$4 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$4(obj);
}
var targets = new WeakMap();
function resolveEventListener(eventType) {
  return function(host, target, value, lastValue) {
    if (lastValue) {
      var eventMap = targets.get(target);
      if (eventMap) {
        target.removeEventListener(eventType, eventMap.get(lastValue), lastValue.options !== void 0 ? lastValue.options : false);
      }
    }
    if (value) {
      if (typeof value !== "function") {
        throw Error("Event listener must be a function: ".concat(_typeof$4(value)));
      }
      var _eventMap = targets.get(target);
      if (!_eventMap) {
        _eventMap = new WeakMap();
        targets.set(target, _eventMap);
      }
      var callback = value.bind(null, host);
      _eventMap.set(value, callback);
      target.addEventListener(eventType, callback, value.options !== void 0 ? value.options : false);
    }
  };
}
function _typeof$3(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$3 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$3 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$3(obj);
}
function normalizeValue(value) {
  var set3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new Set();
  if (Array.isArray(value)) {
    value.forEach(function(className) {
      return set3.add(className);
    });
  } else if (value !== null && _typeof$3(value) === "object") {
    Object.keys(value).forEach(function(key2) {
      return value[key2] && set3.add(key2);
    });
  } else {
    set3.add(value);
  }
  return set3;
}
var classMap = new WeakMap();
function resolveClassList(host, target, value) {
  var previousList = classMap.get(target) || new Set();
  var list = normalizeValue(value);
  classMap.set(target, list);
  list.forEach(function(className) {
    target.classList.add(className);
    previousList.delete(className);
  });
  previousList.forEach(function(className) {
    target.classList.remove(className);
  });
}
function _typeof$2(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$2 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$2 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$2(obj);
}
var styleMap = new WeakMap();
function resolveStyle(host, target, value) {
  if (value === null || _typeof$2(value) !== "object") {
    throw TypeError("Style value must be an object in ".concat(stringifyElement(target), ":"), value);
  }
  var previousMap = styleMap.get(target) || new Map();
  var nextMap = Object.keys(value).reduce(function(map2, key2) {
    var dashKey = camelToDash(key2);
    var styleValue = value[key2];
    if (!styleValue && styleValue !== 0) {
      target.style.removeProperty(dashKey);
    } else {
      target.style.setProperty(dashKey, styleValue);
    }
    map2.set(dashKey, styleValue);
    previousMap.delete(dashKey);
    return map2;
  }, new Map());
  previousMap.forEach(function(styleValue, key2) {
    target.style[key2] = "";
  });
  styleMap.set(target, nextMap);
}
function resolveProperty(attrName, propertyName, isSVG) {
  if (propertyName.substr(0, 2) === "on") {
    var eventType = propertyName.substr(2);
    return resolveEventListener(eventType);
  }
  switch (attrName) {
    case "class":
      return resolveClassList;
    case "style":
      return resolveStyle;
    default:
      return function(host, target, value) {
        if (!isSVG && !(target instanceof SVGElement) && propertyName in target) {
          if (target[propertyName] !== value) {
            target[propertyName] = value;
          }
        } else if (value === false || value === void 0 || value === null) {
          target.removeAttribute(attrName);
        } else {
          var attrValue = value === true ? "" : String(value);
          target.setAttribute(attrName, attrValue);
        }
      };
  }
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$1 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$1(obj);
}
try {
  "production";
} catch (e) {
}
var TIMESTAMP = Date.now();
var getPlaceholder = function getPlaceholder2() {
  var id = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
  return "{{h-".concat(TIMESTAMP, "-").concat(id, "}}");
};
var PLACEHOLDER_REGEXP_TEXT = getPlaceholder("(\\d+)");
var PLACEHOLDER_REGEXP_EQUAL = new RegExp("^".concat(PLACEHOLDER_REGEXP_TEXT, "$"));
var PLACEHOLDER_REGEXP_ALL = new RegExp(PLACEHOLDER_REGEXP_TEXT, "g");
var ATTR_PREFIX = "--".concat(TIMESTAMP, "--");
var ATTR_REGEXP = new RegExp(ATTR_PREFIX, "g");
var preparedTemplates = new WeakMap();
function applyShadyCSS(template, tagName) {
  if (!tagName)
    return template;
  return shadyCSS(function(shady) {
    var map2 = preparedTemplates.get(template);
    if (!map2) {
      map2 = new Map();
      preparedTemplates.set(template, map2);
    }
    var clone = map2.get(tagName);
    if (!clone) {
      clone = document.createElement("template");
      clone.content.appendChild(template.content.cloneNode(true));
      map2.set(tagName, clone);
      var styles = clone.content.querySelectorAll("style");
      Array.from(styles).forEach(function(style2) {
        var count = style2.childNodes.length + 1;
        for (var i = 0; i < count; i += 1) {
          style2.parentNode.insertBefore(document.createTextNode(getPlaceholder()), style2);
        }
      });
      shady.prepareTemplate(clone, tagName.toLowerCase());
    }
    return clone;
  }, template);
}
function createSignature(parts, styles) {
  var signature = parts.reduce(function(acc, part, index) {
    if (index === 0) {
      return part;
    }
    if (parts.slice(index).join("").match(/^\s*<\/\s*(table|tr|thead|tbody|tfoot|colgroup)>/)) {
      return "".concat(acc, "<!--").concat(getPlaceholder(index - 1), "-->").concat(part);
    }
    return acc + getPlaceholder(index - 1) + part;
  }, "");
  if (styles) {
    signature += "<style>\n".concat(styles.join("\n/*------*/\n"), "\n</style>");
  }
  if (IS_IE) {
    return signature.replace(/style\s*=\s*(["][^"]+["]|['][^']+[']|[^\s"'<>/]+)/g, function(match) {
      return "".concat(ATTR_PREFIX).concat(match);
    });
  }
  return signature;
}
function getPropertyName(string) {
  return string.replace(/\s*=\s*['"]*$/g, "").split(/\s+/).pop();
}
function replaceComments(fragment) {
  var iterator = document.createNodeIterator(fragment, NodeFilter.SHOW_COMMENT, null, false);
  var node;
  while (node = iterator.nextNode()) {
    if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
      node.parentNode.insertBefore(document.createTextNode(node.textContent), node);
      node.parentNode.removeChild(node);
    }
  }
}
function createInternalWalker(context) {
  var node;
  return {
    get currentNode() {
      return node;
    },
    nextNode: function nextNode() {
      if (node === void 0) {
        node = context.childNodes[0];
      } else if (node.childNodes.length) {
        node = node.childNodes[0];
      } else if (node.nextSibling) {
        node = node.nextSibling;
      } else {
        var parentNode = node.parentNode;
        node = parentNode.nextSibling;
        while (!node && parentNode !== context) {
          parentNode = parentNode.parentNode;
          node = parentNode.nextSibling;
        }
      }
      return !!node;
    }
  };
}
function createExternalWalker(context) {
  return document.createTreeWalker(context, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
}
var createWalker = _typeof$1(window.ShadyDOM) === "object" && window.ShadyDOM.inUse ? createInternalWalker : createExternalWalker;
var container = document.createElement("div");
var styleSheetsMap = new Map();
function compileTemplate(rawParts, isSVG, styles) {
  var template = document.createElement("template");
  var parts = [];
  var signature = createSignature(rawParts, styles);
  if (isSVG)
    signature = "<svg>".concat(signature, "</svg>");
  if (IS_IE) {
    template.innerHTML = signature;
  } else {
    container.innerHTML = "<template>".concat(signature, "</template>");
    template.content.appendChild(container.children[0].content);
  }
  if (isSVG) {
    var svgRoot = template.content.firstChild;
    template.content.removeChild(svgRoot);
    Array.from(svgRoot.childNodes).forEach(function(node) {
      return template.content.appendChild(node);
    });
  }
  replaceComments(template.content);
  var compileWalker = createWalker(template.content);
  var compileIndex = 0;
  var _loop = function _loop2() {
    var node = compileWalker.currentNode;
    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.textContent;
      if (!text.match(PLACEHOLDER_REGEXP_EQUAL)) {
        var results = text.match(PLACEHOLDER_REGEXP_ALL);
        if (results) {
          var currentNode = node;
          results.reduce(function(acc, placeholder) {
            var _acc$pop$split = acc.pop().split(placeholder), _acc$pop$split2 = _slicedToArray(_acc$pop$split, 2), before = _acc$pop$split2[0], next = _acc$pop$split2[1];
            if (before)
              acc.push(before);
            acc.push(placeholder);
            if (next)
              acc.push(next);
            return acc;
          }, [text]).forEach(function(part, index) {
            if (index === 0) {
              currentNode.textContent = part;
            } else {
              currentNode = currentNode.parentNode.insertBefore(document.createTextNode(part), currentNode.nextSibling);
            }
          });
        }
      }
      var equal = node.textContent.match(PLACEHOLDER_REGEXP_EQUAL);
      if (equal) {
        if (!IS_IE)
          node.textContent = "";
        parts[equal[1]] = [compileIndex, resolveValue$1];
      }
    } else {
      if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.attributes).forEach(function(attr) {
          var value = attr.value.trim();
          var name = IS_IE ? attr.name.replace(ATTR_PREFIX, "") : attr.name;
          var equal2 = value.match(PLACEHOLDER_REGEXP_EQUAL);
          if (equal2) {
            var propertyName = getPropertyName(rawParts[equal2[1]]);
            parts[equal2[1]] = [compileIndex, resolveProperty(name, propertyName, isSVG)];
            node.removeAttribute(attr.name);
          } else {
            var _results = value.match(PLACEHOLDER_REGEXP_ALL);
            if (_results) {
              var partialName = "attr__".concat(name);
              _results.forEach(function(placeholder, index) {
                var _placeholder$match = placeholder.match(PLACEHOLDER_REGEXP_EQUAL), _placeholder$match2 = _slicedToArray(_placeholder$match, 2), id = _placeholder$match2[1];
                parts[id] = [compileIndex, function(host, target, attrValue) {
                  var data = dataMap.get(target, {});
                  data[partialName] = (data[partialName] || value).replace(placeholder, attrValue == null ? "" : attrValue);
                  if (_results.length === 1 || index + 1 === _results.length) {
                    target.setAttribute(name, data[partialName]);
                    data[partialName] = void 0;
                  }
                }];
              });
              attr.value = "";
              if (IS_IE && name !== attr.name) {
                node.removeAttribute(attr.name);
                node.setAttribute(name, "");
              }
            }
          }
        });
      }
    }
    compileIndex += 1;
  };
  while (compileWalker.nextNode()) {
    _loop();
  }
  return function updateTemplateInstance(host, target, args, styleSheets) {
    var data = dataMap.get(target, {
      type: "function"
    });
    if (template !== data.template) {
      if (data.template || target.nodeType === Node.ELEMENT_NODE) {
        removeTemplate(target);
      }
      data.prevArgs = null;
      var fragment = document.importNode(applyShadyCSS(template, host.tagName).content, true);
      var renderWalker = createWalker(fragment);
      var clonedParts = parts.slice(0);
      var renderIndex = 0;
      var currentPart = clonedParts.shift();
      var markers = [];
      data.template = template;
      data.markers = markers;
      while (renderWalker.nextNode()) {
        var node = renderWalker.currentNode;
        if (node.nodeType === Node.TEXT_NODE) {
          if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
            node.textContent = "";
          } else if (IS_IE) {
            node.textContent = node.textContent.replace(ATTR_REGEXP, "");
          }
        }
        while (currentPart && currentPart[0] === renderIndex) {
          markers.push([node, currentPart[1]]);
          currentPart = clonedParts.shift();
        }
        renderIndex += 1;
      }
      if (target.nodeType === Node.TEXT_NODE) {
        data.startNode = fragment.childNodes[0];
        data.endNode = fragment.childNodes[fragment.childNodes.length - 1];
        var previousChild = target;
        var child = fragment.childNodes[0];
        while (child) {
          target.parentNode.insertBefore(child, previousChild.nextSibling);
          previousChild = child;
          child = fragment.childNodes[0];
        }
      } else {
        target.appendChild(fragment);
      }
    }
    var adoptedStyleSheets = target.adoptedStyleSheets;
    if (styleSheets) {
      var isEqual = false;
      styleSheets = styleSheets.map(function(style2) {
        if (style2 instanceof CSSStyleSheet)
          return style2;
        var styleSheet = styleSheetsMap.get(style2);
        if (!styleSheet) {
          styleSheet = new CSSStyleSheet();
          styleSheet.replaceSync(style2);
          styleSheetsMap.set(style2, styleSheet);
        }
        return styleSheet;
      });
      if (styleSheets.length === adoptedStyleSheets.length) {
        isEqual = true;
        for (var i = 0; i < styleSheets.length; i += 1) {
          if (styleSheets[i] !== adoptedStyleSheets[i]) {
            isEqual = false;
            break;
          }
        }
      }
      if (!isEqual)
        target.adoptedStyleSheets = styleSheets;
    } else if (adoptedStyleSheets && adoptedStyleSheets.length) {
      target.adoptedStyleSheets = [];
    }
    var prevArgs = data.prevArgs;
    data.prevArgs = args;
    for (var index = 0; index < data.markers.length; index += 1) {
      var _data$markers$index = _slicedToArray(data.markers[index], 2), _node = _data$markers$index[0], marker = _data$markers$index[1];
      if (!prevArgs || prevArgs[index] !== args[index]) {
        try {
          marker(host, _node, args[index], prevArgs ? prevArgs[index] : void 0);
        } catch (error) {
          throw error;
        }
      }
    }
    if (target.nodeType !== Node.TEXT_NODE) {
      shadyCSS(function(shady) {
        if (host.shadowRoot) {
          if (prevArgs) {
            shady.styleSubtree(host);
          } else {
            shady.styleElement(host);
          }
        }
      });
    }
  };
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key2) {
        _defineProperty(target, key2, source[key2]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key2, value) {
  if (key2 in obj) {
    Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key2] = value;
  }
  return obj;
}
function resolveValue(_ref, setter) {
  var target = _ref.target;
  var value;
  switch (target.type) {
    case "radio":
    case "checkbox":
      value = target.checked && target.value;
      break;
    case "file":
      value = target.files;
      break;
    default:
      value = target.value;
  }
  setter(value);
}
function getPartialObject(name, value) {
  return name.split(".").reverse().reduce(function(acc, key2) {
    if (!acc)
      return _defineProperty({}, key2, value);
    return _defineProperty({}, key2, acc);
  }, null);
}
var stringCache = new Map();
var storeValues = new WeakMap();
function set(property2, valueOrPath) {
  if (!property2) {
    throw Error("The first argument must be a property name or an object instance: ".concat(property2));
  }
  if (_typeof(property2) === "object") {
    if (valueOrPath === void 0) {
      throw Error("For model instance property the second argument must be defined");
    }
    var store = storePointer.get(property2);
    if (!store) {
      throw Error("Provided object must be a model instance of the store");
    }
    if (valueOrPath === null) {
      return function() {
        store.set(property2, null);
      };
    }
    return function(host, event) {
      resolveValue(event, function(value) {
        var values = storeValues.get(property2);
        if (!values) {
          requestAnimationFrame(function() {
            var result = storeValues.get(property2);
            storeValues.delete(property2);
            store.set(property2, result).catch(function() {
            });
          });
        }
        storeValues.set(property2, _objectSpread({}, values, {}, getPartialObject(valueOrPath, value)));
      });
    };
  }
  if (arguments.length === 2) {
    return function(host) {
      host[property2] = valueOrPath;
    };
  }
  var fn = stringCache.get(property2);
  if (!fn) {
    fn = function fn2(host, event) {
      resolveValue(event, function(value) {
        host[property2] = value;
      });
    };
    stringCache.set(property2, fn);
  }
  return fn;
}
var promiseMap = new WeakMap();
function resolve(promise, placeholder) {
  var delay = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 200;
  return function(host, target) {
    var timeout;
    if (placeholder) {
      timeout = setTimeout(function() {
        timeout = void 0;
        requestAnimationFrame(function() {
          placeholder(host, target);
        });
      }, delay);
    }
    promiseMap.set(target, promise);
    promise.then(function(template) {
      if (timeout)
        clearTimeout(timeout);
      if (promiseMap.get(target) === promise) {
        template(host, target);
        promiseMap.set(target, null);
      }
    });
  };
}
var helpers = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  set,
  resolve
});
var PLACEHOLDER = getPlaceholder();
var SVG_PLACEHOLDER = getPlaceholder("svg");
var STYLE_IMPORT_REGEXP = /@import/;
var templatesMap = new Map();
var stylesMap = new WeakMap();
var methods = {
  define: function define$1(elements) {
    define(elements);
    return this;
  },
  key: function key(id) {
    this.id = id;
    return this;
  },
  style: function style() {
    for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
      styles[_key] = arguments[_key];
    }
    stylesMap.set(this, styles.filter(function(style2) {
      return style2;
    }));
    return this;
  }
};
function create(parts, args, isSVG) {
  var createTemplate = function createTemplate2(host) {
    var target = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : host;
    var styles = stylesMap.get(createTemplate2);
    var hasAdoptedStyleSheets;
    var id = parts.join(PLACEHOLDER);
    if (styles) {
      var joinedStyles = styles.join(PLACEHOLDER);
      hasAdoptedStyleSheets = !!target.adoptedStyleSheets && !STYLE_IMPORT_REGEXP.test(joinedStyles);
      if (!hasAdoptedStyleSheets)
        id += joinedStyles;
    }
    if (isSVG)
      id += SVG_PLACEHOLDER;
    var render2 = templatesMap.get(id);
    if (!render2) {
      render2 = compileTemplate(parts, isSVG, !hasAdoptedStyleSheets && styles);
      templatesMap.set(id, render2);
    }
    render2(host, target, args, hasAdoptedStyleSheets && styles);
  };
  return Object.assign(createTemplate, methods);
}
function html(parts) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  return create(parts, args);
}
function svg(parts) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }
  return create(parts, args, true);
}
Object.assign(html, helpers);
Object.assign(svg, helpers);
const range = (a, b) => {
  if (a != null && b == null) {
    b = a;
    a = 0;
  }
  return [...Array(b - a).keys()].map((v) => v + a);
};
function reflect(d) {
  let attrName;
  return {
    get: d.get,
    set: d.set,
    connect: (host, propName, invalidate2) => {
      var _a;
      attrName = propName.replace(/([A-Z])/g, "-$1").toLowerCase();
      return (_a = d.connect) == null ? void 0 : _a.call(d, host, propName, invalidate2);
    },
    observe: (host, val, last) => {
      var _a;
      host.setAttribute(attrName, typeof val === "object" ? JSON.stringify(val) : val);
      return (_a = d.observe) == null ? void 0 : _a.call(d, host, val, last);
    }
  };
}
const layerStyles = (R, h) => {
  return {
    position: h === 0 ? "relative" : "absolute",
    width: `${2 * R}px`,
    height: `${2 * R}px`,
    borderRadius: `${R}px`
  };
};
const nodeStyles = (R, N, r, n) => {
  const theta = 2 * Math.PI / N;
  const left = R * Math.sin(n * theta) + R - r;
  const bottom = R * Math.cos(n * theta) + R - r;
  return {
    left: `${left}px`,
    bottom: `${bottom}px`,
    width: `${2 * r}px`,
    height: `${2 * r}px`,
    borderRadius: `${r}px`
  };
};
const MandalaLayer = {
  tag: "mandala-layer",
  template: [],
  name: "m",
  nested: ({ template }) => {
    let templateCopy = __spreadValues({}, template);
    let h = 0;
    while ((templateCopy = templateCopy[3]) && h < 10)
      h++;
    return h;
  },
  height: 0,
  nodes: ({ template }) => range(template[1] || 0).map((n) => {
    var _a;
    return (_a = template[3]) != null ? _a : [];
  }),
  render: ({ template, name, nodes, height }) => html`
		<div class="layer" part="${`${name}-layer-${height}`}"
			style="${layerStyles(template[0], height)}">
			${nodes.map((node, n) => html`
				<div class="node" part="${`${name}-node-${height}`}"
					style="${nodeStyles(template[0], template[1], template[2], n)}">
					<mandala-layer name="${name}" template="${node}" height="${height + 1}"></mandala-layer>
				</div>`)}
		</div>

		<style>
			@keyframes spinCW {
				100% {transform: translate(-50%, -50%) rotate(360deg)}
			}

			@keyframes spinCCW {
				100% {transform: translate(-50%, -50%) rotate(-360deg)}
			}

			:host {
				width: 0;
				height: 0;
			}

			.layer {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}

			.node {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
				background: black;
			}
		</style>`,
  exportparts: reflect({
    get: ({ name, height, nested }) => range(height, height + nested + 1).map((i) => [`${name}-layer-${i}`, `${name}-node-${i}`]).flat().join(",")
  })
};
define("mandala-layer", MandalaLayer);
