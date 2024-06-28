(function () {
'use strict';

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var isPure = false;

var setGlobal = function (key, value) {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(global_1, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.16.4',
  mode:  'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});
});

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var hasOwnProperty = {}.hasOwnProperty;

var has = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty.call(toObject(it), key);
};

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
};

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var process = global_1.process;
var Deno = global_1.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] < 4 ? 1 : match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var engineV8Version = version && +version;

/* eslint-disable es/no-symbol -- required for testing */



// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && engineV8Version && engineV8Version < 41;
});

/* eslint-disable es/no-symbol -- required for testing */


var useSymbolAsUid = nativeSymbol
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (nativeSymbol && has(Symbol$1, name)) {
      WellKnownSymbolsStore[name] = Symbol$1[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var isSymbol = useSymbolAsUid ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return typeof $Symbol == 'function' && Object(it) instanceof $Symbol;
};

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive = function (input, pref) {
  var fn, val;
  if (pref === 'string' && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (pref !== 'string' && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = input[TO_PRIMITIVE];
  var result;
  if (exoticToPrim !== undefined) {
    if (pref === undefined) pref = 'default';
    result = exoticToPrim.call(input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : String(key);
};

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var hiddenKeys = {};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

/* global ActiveXObject -- old IE, WSH */








var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var iterators = {};

var functionToString = Function.toString;

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var WeakMap = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap || sharedStore.state) {
  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    if (wmhas.call(store$1, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (has(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$1
};

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$2 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$2
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if ( !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

var defineProperty = objectDefineProperty.f;



var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

/* eslint-disable no-proto -- safe */



// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$2 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG$1] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
var objectToString = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!toStringTagSupport) {
  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
}

var toString_1 = function (argument) {
  if (isSymbol(argument)) throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};

// `String.prototype.codePointAt` methods implementation
var createMethod$1 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString_1(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$1(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$1(true)
};

var charAt = stringMultibyte.charAt;




var STRING_ITERATOR = 'String Iterator';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$1(this, {
    type: STRING_ITERATOR,
    string: toString_1(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$1(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var ITERATOR$2 = wellKnownSymbol('iterator');
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$2] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG$3]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
    }
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
}

var ITERATOR$3 = wellKnownSymbol('iterator');

var nativeUrl = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (isPure && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR$3]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty$1 = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$1({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$1(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var iteratorClose = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = iterator['return'];
    if (innerResult === undefined) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = innerResult.call(iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

var ITERATOR$4 = wellKnownSymbol('iterator');
var ArrayPrototype$1 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$4] === it);
};

var createProperty = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var ITERATOR$5 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$5]
    || it['@@iterator']
    || iterators[classof(it)];
};

var getIterator = function (it, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(it) : usingIterator;
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor$1 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
  delta += floor$1(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$1(delta / baseMinusTMin);
  }
  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line max-statements -- TODO
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor$1(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

var stringPunycodeToAscii = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`






















var nativeFetch = getBuiltIn('fetch');
var NativeRequest = getBuiltIn('Request');
var RequestPrototype = NativeRequest && NativeRequest.prototype;
var Headers = getBuiltIn('Headers');
var ITERATOR$6 = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$2 = internalState.set;
var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState$2(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState$2(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = getIterator(init, iteratorMethod);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: toString_1(first.value), value: toString_1(second.value) });
        }
      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: toString_1(init[key]) });
    } else {
      parseSearchParams(
        entries,
        typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : toString_1(init)
      );
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: toString_1(name), value: toString_1(value) });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = toString_1(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = toString_1(name);
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = toString_1(name);
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = toString_1(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = toString_1(name);
    var val = toString_1(value);
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR$6, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

_export({ global: true, forced: !nativeUrl }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
if (!nativeUrl && typeof Headers == 'function') {
  var wrapRequestOptions = function (init) {
    if (isObject(init)) {
      var body = init.body;
      var headers;
      if (classof(body) === URL_SEARCH_PARAMS) {
        headers = init.headers ? new Headers(init.headers) : new Headers();
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        return objectCreate(init, {
          body: createPropertyDescriptor(0, String(body)),
          headers: createPropertyDescriptor(0, headers)
        });
      }
    } return init;
  };

  if (typeof nativeFetch == 'function') {
    _export({ global: true, enumerable: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      }
    });
  }

  if (typeof NativeRequest == 'function') {
    var RequestConstructor = function Request(input /* , init */) {
      anInstance(this, RequestConstructor, 'Request');
      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
    };

    RequestPrototype.constructor = RequestConstructor;
    RequestConstructor.prototype = RequestPrototype;

    _export({ global: true, forced: true }, {
      Request: RequestConstructor
    });
  }
}

var web_urlSearchParams = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











var codeAt = stringMultibyte.codeAt;






var NativeURL = global_1.URL;
var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
var getInternalSearchParamsState = web_urlSearchParams.getState;
var setInternalState$3 = internalState.set;
var getInternalURLState = internalState.getterFor('URL');
var floor$2 = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
// eslint-disable-next-line regexp/no-obscure-range -- safe
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^0x/i;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
/* eslint-disable no-control-regex -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g;
var TAB_AND_NEW_LINE = /[\t\n\r]/g;
/* eslint-enable no-control-regex -- safe */
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = stringPunycodeToAscii(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor$2(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements -- TODO
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = toString_1(url);
  var state = setInternalState$3(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, toString_1(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams$1();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!descriptors) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URLConstructor(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (descriptors) {
  objectDefineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = toString_1(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, toString_1(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(toString_1(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(toString_1(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, toString_1(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, toString_1(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = toString_1(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, toString_1(pathname), PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = toString_1(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = toString_1(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
  URL: URLConstructor
});

// eslint-disable-next-line es/no-typed-arrays -- safe
var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
var toIndex = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};

// IEEE754 conversions based on https://github.com/feross/ieee754
var abs = Math.abs;
var pow$1 = Math.pow;
var floor$3 = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = new Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow$1(2, -24) - pow$1(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare -- NaN check
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor$3(log(number) / LN2);
    if (number * (c = pow$1(2, -exponent)) < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow$1(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow$1(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow$1(2, eBias - 1) * pow$1(2, mantissaLength);
      exponent = 0;
    }
  }
  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow$1(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow$1(2, exponent - mantissaLength);
};

var ieee754 = {
  pack: pack,
  unpack: unpack
};

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
var arrayFill = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var defineProperty$2 = objectDefineProperty.f;




var getInternalState$2 = internalState.get;
var setInternalState$4 = internalState.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE$1 = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global_1[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var $DataView = global_1[DATA_VIEW];
var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$1];
var ObjectPrototype$1 = Object.prototype;
var RangeError$1 = global_1.RangeError;

var packIEEE754 = ieee754.pack;
var unpackIEEE754 = ieee754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty$2(Constructor[PROTOTYPE$1], key, { get: function () { return getInternalState$2(this)[key]; } });
};

var get$1 = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState$2(view);
  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
  var bytes = getInternalState$2(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = bytes.slice(start, start + count);
  return isLittleEndian ? pack : pack.reverse();
};

var set$1 = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState$2(view);
  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
  var bytes = getInternalState$2(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!arrayBufferNative) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    setInternalState$4(this, {
      bytes: arrayFill.call(new Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!descriptors) this.byteLength = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = getInternalState$2(buffer).byteLength;
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
    setInternalState$4(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!descriptors) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  if (descriptors) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll($DataView[PROTOTYPE$1], {
    getInt8: function getInt8(byteOffset) {
      return get$1(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get$1(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set$1(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set$1(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set$1(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set$1(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  /* eslint-disable no-new -- required for testing */
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1);
  }) || fails(function () {
    new NativeArrayBuffer();
    new NativeArrayBuffer(1.5);
    new NativeArrayBuffer(NaN);
    return NativeArrayBuffer.name != ARRAY_BUFFER;
  })) {
  /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new NativeArrayBuffer(toIndex(length));
    };
    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$1] = NativeArrayBuffer[PROTOTYPE$1];
    for (var keys$1 = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys$1.length > j;) {
      if (!((key = keys$1[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }
    ArrayBufferPrototype.constructor = $ArrayBuffer;
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$1) {
    objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$1);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataViewPrototype.setInt8;
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

var arrayBuffer = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction$1(S);
};

var ArrayBuffer$1 = arrayBuffer.ArrayBuffer;
var DataView$1 = arrayBuffer.DataView;
var nativeArrayBufferSlice = ArrayBuffer$1.prototype.slice;

var INCORRECT_SLICE = fails(function () {
  return !new ArrayBuffer$1(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
_export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
  slice: function slice(start, end) {
    if (nativeArrayBufferSlice !== undefined && end === undefined) {
      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
    }
    var length = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = new (speciesConstructor(this, ArrayBuffer$1))(toLength(fin - first));
    var viewSource = new DataView$1(this);
    var viewTarget = new DataView$1(result);
    var index = 0;
    while (first < fin) {
      viewTarget.setUint8(index++, viewSource.getUint8(first++));
    } return result;
  }
});

var ITERATOR$7 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$7] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$7] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var defineProperty$3 = objectDefineProperty.f;





var Int8Array$1 = global_1.Int8Array;
var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
var Uint8ClampedArray$1 = global_1.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype$2 = Object.prototype;
var isPrototypeOf = ObjectPrototype$2.isPrototypeOf;

var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = uid('TYPED_ARRAY_CONSTRUCTOR');
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || has(TypedArrayConstructorsList, klass)
    || has(BigIntArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return has(TypedArrayConstructorsList, klass)
    || has(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (objectSetPrototypeOf && !isPrototypeOf.call(TypedArray, C)) {
    throw TypeError('Target is not a typed array constructor');
  } return C;
};

var exportTypedArrayMethod = function (KEY, property, forced) {
  if (!descriptors) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) { /* empty */ }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!descriptors) return;
  if (objectSetPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global_1[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR, Constructor);
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global_1[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR, Constructor);
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$2) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$4)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty$3(TypedArrayPrototype, TO_STRING_TAG$4, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global_1[NAME]) {
    createNonEnumerableProperty(global_1[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

var arrayBufferViewCore = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_CONSTRUCTOR: TYPED_ARRAY_CONSTRUCTOR,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};

/* eslint-disable no-new -- required for testing */



var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer$2 = global_1.ArrayBuffer;
var Int8Array$2 = global_1.Int8Array;

var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails(function () {
  Int8Array$2(1);
}) || !fails(function () {
  new Int8Array$2(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array$2();
  new Int8Array$2(null);
  new Int8Array$2(1.5);
  new Int8Array$2(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array$2(new ArrayBuffer$2(2), 1, undefined).length !== 1;
});

var floor$4 = Math.floor;

// `Number.isInteger` method implementation
// https://tc39.es/ecma262/#sec-number.isinteger
var isInteger = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor$4(it) === it;
};

var toPositiveInteger = function (it) {
  var result = toInteger(it);
  if (result < 0) throw RangeError("The argument can't be less than 0");
  return result;
};

var toOffset = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw RangeError('Wrong offset');
  return offset;
};

var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    O = [];
    while (!(step = next.call(iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = functionBindContext(mapfn, arguments[2], 2);
  }
  length = toLength(O.length);
  result = new (aTypedArrayConstructor$1(this))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

var SPECIES$1 = wellKnownSymbol('species');

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$1];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod$2 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$2(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$2(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$2(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$2(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$2(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$2(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$2(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod$2(7)
};

var SPECIES$2 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$2]) {
    defineProperty(Constructor, SPECIES$2, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

var typedArrayConstructor = createCommonjsModule(function (module) {




















var getOwnPropertyNames = objectGetOwnPropertyNames.f;

var forEach = arrayIteration.forEach;






var getInternalState = internalState.get;
var setInternalState = internalState.set;
var nativeDefineProperty = objectDefineProperty.f;
var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var round = Math.round;
var RangeError = global_1.RangeError;
var ArrayBuffer = arrayBuffer.ArrayBuffer;
var DataView = arrayBuffer.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_CONSTRUCTOR = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = arrayBufferViewCore.TypedArray;
var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = arrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && !isSymbol(key)
    && key in target
    && isInteger(+key)
    && key >= 0;
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  key = toPropertyKey(key);
  return isTypedArrayIndex(target, key)
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  key = toPropertyKey(key);
  if (isTypedArrayIndex(target, key)
    && isObject(descriptor)
    && has(descriptor, 'value')
    && !has(descriptor, 'get')
    && !has(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!has(descriptor, 'writable') || descriptor.writable)
    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (descriptors) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
    objectDefineProperty.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
    } else if (typedArrayConstructorsRequireWrappers) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_CONSTRUCTOR, TypedArrayConstructor);

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    _export({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };
});

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var min$2 = Math.min;

// `Array.prototype.copyWithin` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.copywithin
// eslint-disable-next-line es/no-array-prototype-copywithin -- safe
var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = min$2((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start /* , end */) {
  return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});

var $every = arrayIteration.every;

var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.every` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
  return $every(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.fill` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
// eslint-disable-next-line no-unused-vars -- required for `.length`
exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
  return arrayFill.apply(aTypedArray$3(this), arguments);
});

var arrayFromConstructorAndList = function (Constructor, list) {
  var index = 0;
  var length = list.length;
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var TYPED_ARRAY_CONSTRUCTOR$1 = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;

// a part of `TypedArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#typedarray-species-create
var typedArraySpeciesConstructor = function (originalArray) {
  return aTypedArrayConstructor$2(speciesConstructor(originalArray, originalArray[TYPED_ARRAY_CONSTRUCTOR$1]));
};

var typedArrayFromSpeciesAndList = function (instance, list) {
  return arrayFromConstructorAndList(typedArraySpeciesConstructor(instance), list);
};

var $filter = arrayIteration.filter;


var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filter` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
exportTypedArrayMethod$4('filter', function filter(callbackfn /* , thisArg */) {
  var list = $filter(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return typedArrayFromSpeciesAndList(this, list);
});

var $find = arrayIteration.find;

var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.find` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
  return $find(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var $findIndex = arrayIteration.findIndex;

var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
exportTypedArrayMethod$6('findIndex', function findIndex(predicate /* , thisArg */) {
  return $findIndex(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var $forEach = arrayIteration.forEach;

var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.forEach` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
exportTypedArrayMethod$7('forEach', function forEach(callbackfn /* , thisArg */) {
  $forEach(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

var $includes = arrayIncludes.includes;

var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.includes` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
exportTypedArrayMethod$8('includes', function includes(searchElement /* , fromIndex */) {
  return $includes(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

var $indexOf = arrayIncludes.indexOf;

var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
exportTypedArrayMethod$9('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return $indexOf(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

var ITERATOR$8 = wellKnownSymbol('iterator');
var Uint8Array$1 = global_1.Uint8Array;
var arrayValues = es_array_iterator.values;
var arrayKeys = es_array_iterator.keys;
var arrayEntries = es_array_iterator.entries;
var aTypedArray$a = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$8];

var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

var typedArrayValues = function values() {
  return arrayValues.call(aTypedArray$a(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
exportTypedArrayMethod$a('entries', function entries() {
  return arrayEntries.call(aTypedArray$a(this));
});
// `%TypedArray%.prototype.keys` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
exportTypedArrayMethod$a('keys', function keys() {
  return arrayKeys.call(aTypedArray$a(this));
});
// `%TypedArray%.prototype.values` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
exportTypedArrayMethod$a(ITERATOR$8, typedArrayValues, !CORRECT_ITER_NAME);

var aTypedArray$b = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
var $join = [].join;

// `%TypedArray%.prototype.join` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
// eslint-disable-next-line no-unused-vars -- required for `.length`
exportTypedArrayMethod$b('join', function join(separator) {
  return $join.apply(aTypedArray$b(this), arguments);
});

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

/* eslint-disable es/no-array-prototype-lastindexof -- safe */





var min$3 = Math.min;
var $lastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('lastIndexOf');
var FORCED = NEGATIVE_ZERO || !STRICT_METHOD;

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
var arrayLastIndexOf = FORCED ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO) return $lastIndexOf.apply(this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = toLength(O.length);
  var index = length - 1;
  if (arguments.length > 1) index = min$3(index, toInteger(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : $lastIndexOf;

var aTypedArray$c = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
// eslint-disable-next-line no-unused-vars -- required for `.length`
exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
});

var $map = arrayIteration.map;


var aTypedArray$d = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.map` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
  return $map(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
    return new (typedArraySpeciesConstructor(O))(length);
  });
});

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod$3 = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction$1(callbackfn);
    var O = toObject(that);
    var self = indexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod$3(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod$3(true)
};

var $reduce = arrayReduce.left;

var aTypedArray$e = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduce` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
exportTypedArrayMethod$e('reduce', function reduce(callbackfn /* , initialValue */) {
  return $reduce(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});

var $reduceRight = arrayReduce.right;

var aTypedArray$f = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduceRicht` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  return $reduceRight(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});

var aTypedArray$g = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
var floor$5 = Math.floor;

// `%TypedArray%.prototype.reverse` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
exportTypedArrayMethod$g('reverse', function reverse() {
  var that = this;
  var length = aTypedArray$g(that).length;
  var middle = floor$5(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  } return that;
});

var aTypedArray$h = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

var FORCED$1 = fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  new Int8Array(1).set({});
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod$h('set', function set(arrayLike /* , offset */) {
  aTypedArray$h(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var length = this.length;
  var src = toObject(arrayLike);
  var len = toLength(src.length);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, FORCED$1);

var aTypedArray$i = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
var $slice = [].slice;

var FORCED$2 = fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
exportTypedArrayMethod$i('slice', function slice(start, end) {
  var list = $slice.call(aTypedArray$i(this), start, end);
  var C = typedArraySpeciesConstructor(this);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED$2);

var $some = arrayIteration.some;

var aTypedArray$j = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.some` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
  return $some(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

// TODO: use something more complex like timsort?
var floor$6 = Math.floor;

var mergeSort = function (array, comparefn) {
  var length = array.length;
  var middle = floor$6(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(
    mergeSort(array.slice(0, middle), comparefn),
    mergeSort(array.slice(middle), comparefn),
    comparefn
  );
};

var insertionSort = function (array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;

  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++) array[j] = element;
  } return array;
};

var merge = function (left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;
  var result = [];

  while (lindex < llength || rindex < rlength) {
    if (lindex < llength && rindex < rlength) {
      result.push(comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]);
    } else {
      result.push(lindex < llength ? left[lindex++] : right[rindex++]);
    }
  } return result;
};

var arraySort = mergeSort;

var firefox = engineUserAgent.match(/firefox\/(\d+)/i);

var engineFfVersion = !!firefox && +firefox[1];

var engineIsIeOrEdge = /MSIE|Trident/.test(engineUserAgent);

var webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);

var engineWebkitVersion = !!webkit && +webkit[1];

var aTypedArray$k = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array$1 = global_1.Uint16Array;
var nativeSort = Uint16Array$1 && Uint16Array$1.prototype.sort;

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !fails(function () {
  var array = new Uint16Array$1(2);
  array.sort(null);
  array.sort({});
});

var STABLE_SORT = !!nativeSort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (engineV8Version) return engineV8Version < 74;
  if (engineFfVersion) return engineFfVersion < 67;
  if (engineIsIeOrEdge) return true;
  if (engineWebkitVersion) return engineWebkitVersion < 602;

  var array = new Uint16Array$1(516);
  var expected = Array(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  array.sort(function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod$k('sort', function sort(comparefn) {
  var array = this;
  if (comparefn !== undefined) aFunction$1(comparefn);
  if (STABLE_SORT) return nativeSort.call(array, comparefn);

  aTypedArray$k(array);
  var arrayLength = toLength(array.length);
  var items = Array(arrayLength);
  var index;

  for (index = 0; index < arrayLength; index++) {
    items[index] = array[index];
  }

  items = arraySort(array, getSortCompare(comparefn));

  for (index = 0; index < arrayLength; index++) {
    array[index] = items[index];
  }

  return array;
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

var aTypedArray$l = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.subarray` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
  var O = aTypedArray$l(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex(begin, length);
  var C = typedArraySpeciesConstructor(O);
  return new C(
    O.buffer,
    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
  );
});

var Int8Array$3 = global_1.Int8Array;
var aTypedArray$m = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
var $toLocaleString = [].toLocaleString;
var $slice$1 = [].slice;

// iOS Safari 6.x fails here
var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
  $toLocaleString.call(new Int8Array$3(1));
});

var FORCED$3 = fails(function () {
  return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
}) || !fails(function () {
  Int8Array$3.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
}, FORCED$3);

var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;



var Uint8Array$2 = global_1.Uint8Array;
var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype || {};
var arrayToString = [].toString;
var arrayJoin = [].join;

if (fails(function () { arrayToString.call({}); })) {
  arrayToString = function toString() {
    return arrayJoin.call(this);
  };
}

var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

// `%TypedArray%.prototype.toString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

// `Uint16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var SPECIES$3 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$3] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES$4 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES$4];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

var test$1 = [];
var nativeSort$1 = test$1.sort;

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test$1.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test$1.sort(null);
});
// Old WebKit
var STRICT_METHOD$1 = arrayMethodIsStrict('sort');

var STABLE_SORT$1 = !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (engineV8Version) return engineV8Version < 70;
  if (engineFfVersion && engineFfVersion > 3) return;
  if (engineIsIeOrEdge) return true;
  if (engineWebkitVersion) return engineWebkitVersion < 603;

  var result = '';
  var code, chr, value, index;

  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);

    switch (code) {
      case 66: case 69: case 70: case 72: value = 3; break;
      case 68: case 71: value = 4; break;
      default: value = 2;
    }

    for (index = 0; index < 47; index++) {
      test$1.push({ k: chr + index, v: value });
    }
  }

  test$1.sort(function (a, b) { return b.v - a.v; });

  for (index = 0; index < test$1.length; index++) {
    chr = test$1[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr) result += chr;
  }

  return result !== 'DGBEFHACIJK';
});

var FORCED$4 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$1 || !STABLE_SORT$1;

var getSortCompare$1 = function (comparefn) {
  return function (x, y) {
    if (y === undefined) return -1;
    if (x === undefined) return 1;
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    return toString_1(x) > toString_1(y) ? 1 : -1;
  };
};

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
_export({ target: 'Array', proto: true, forced: FORCED$4 }, {
  sort: function sort(comparefn) {
    if (comparefn !== undefined) aFunction$1(comparefn);

    var array = toObject(this);

    if (STABLE_SORT$1) return comparefn === undefined ? nativeSort$1.call(array) : nativeSort$1.call(array, comparefn);

    var items = [];
    var arrayLength = toLength(array.length);
    var itemsLength, index;

    for (index = 0; index < arrayLength; index++) {
      if (index in array) items.push(array[index]);
    }

    items = arraySort(items, getSortCompare$1(comparefn));
    itemsLength = items.length;
    index = 0;

    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) delete array[index++];

    return array;
  }
});

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = toString_1(R.source);
    var rf = R.flags;
    var f = toString_1(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global_1.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

var BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y,
	BROKEN_CARET: BROKEN_CARET
};

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp$1 = global_1.RegExp;

var regexpUnsupportedDotAll = fails(function () {
  var re = $RegExp$1('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp$2 = global_1.RegExp;

var regexpUnsupportedNcg = fails(function () {
  var re = $RegExp$2('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */





var getInternalState$3 = internalState.get;



var nativeExec = RegExp.prototype.exec;
var nativeReplace = shared('native-string-replace', String.prototype.replace);

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

if (PATCH) {
  // eslint-disable-next-line max-statements -- TODO
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState$3(re);
    var str = toString_1(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = patchedExec.call(raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = str.slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str.charAt(re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = objectCreate(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

var regexpExec = patchedExec;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

// TODO: Remove from `core-js@4` since it's moved to entry points







var SPECIES$5 = wellKnownSymbol('species');
var RegExpPrototype$1 = RegExp.prototype;

var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$5] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype$1.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });

    redefine(String.prototype, KEY, methods[0]);
    redefine(RegExpPrototype$1, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype$1[SYMBOL], 'sham', true);
};

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var charAt$1 = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt$1(S, index).length : 1);
};

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;
var arrayPush = [].push;
var min$4 = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

// @@split logic
fixRegexpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = toString_1(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegexp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(toString_1(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (string, limit) {
      var rx = anObject(this);
      var S = toString_1(string);
      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

      if (res.done) return res.value;

      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y$2 ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y$2 ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y$2 ? 0 : q;
        var z = regexpExecAbstract(splitter, UNSUPPORTED_Y$2 ? S.slice(q) : S);
        var e;
        if (
          z === null ||
          (e = min$4(toLength(splitter.lastIndex + (UNSUPPORTED_Y$2 ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y$2);

var floor$7 = Math.floor;
var replace$1 = ''.replace;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace$1.call(replacement, symbols, function (match, ch) {
    var capture;
    switch (ch.charAt(0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return str.slice(0, position);
      case "'": return str.slice(tailPos);
      case '<':
        capture = namedCaptures[ch.slice(1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor$7(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

var REPLACE = wellKnownSymbol('replace');
var max$2 = Math.max;
var min$5 = Math.min;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(toString_1(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString_1(string);

      if (
        typeof replaceValue === 'string' &&
        replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1 &&
        replaceValue.indexOf('$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = toString_1(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = toString_1(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString_1(result[0]);
        var position = max$2(min$5(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = toString_1(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

/* eslint-disable es/no-array-prototype-indexof -- required for testing */

var $indexOf$1 = arrayIncludes.indexOf;


var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO$1 = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO$1 || !STRICT_METHOD$2 }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO$1
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf$1(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// `Array.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
// eslint-disable-next-line es/no-array-prototype-lastindexof -- required for testing
_export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
  lastIndexOf: arrayLastIndexOf
});

var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return objectKeys(toObject(it));
  }
});

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
_export({ target: 'Object', stat: true }, {
  setPrototypeOf: objectSetPrototypeOf
});

var $map$1 = arrayIteration.map;


var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var engineIsNode = classofRaw(global_1.process) == 'process';

var $reduce$1 = arrayReduce.left;




var STRICT_METHOD$3 = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce$1(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// @@match logic
fixRegexpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](toString_1(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString_1(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regexpExecAbstract(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = toString_1(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

var nativeJoin = [].join;

var ES3_STRINGS = indexedObject != Object;
var STRICT_METHOD$4 = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$4 }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

// a string of all valid unicode whitespaces
var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$4 = function (TYPE) {
  return function ($this) {
    var string = toString_1(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod$4(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod$4(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod$4(3)
};

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
var stringTrimForced = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

var $trim = stringTrim.trim;


// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

var $forEach$1 = arrayIteration.forEach;


var STRICT_METHOD$5 = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
var arrayForEach = !STRICT_METHOD$5 ? function forEach(callbackfn /* , thisArg */) {
  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

for (var COLLECTION_NAME$1 in domIterables) {
  var Collection$1 = global_1[COLLECTION_NAME$1];
  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype$1 && CollectionPrototype$1.forEach !== arrayForEach) try {
    createNonEnumerableProperty(CollectionPrototype$1, 'forEach', arrayForEach);
  } catch (error) {
    CollectionPrototype$1.forEach = arrayForEach;
  }
}

var $filter$1 = arrayIteration.filter;


var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED$5 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$5 }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');

var max$3 = Math.max;
var min$6 = Math.min;
var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$6(max$3(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

var $find$1 = arrayIteration.find;


var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);

var defineProperty$4 = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME$1 = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (descriptors && !(NAME$1 in FunctionPrototype)) {
  defineProperty$4(FunctionPrototype, NAME$1, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

// `thisNumberValue` abstract operation
// https://tc39.es/ecma262/#sec-thisnumbervalue
var thisNumberValue = function (value) {
  if (typeof value != 'number' && classofRaw(value) != 'Number') {
    throw TypeError('Incorrect invocation');
  }
  return +value;
};

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
var stringRepeat = function repeat(count) {
  var str = toString_1(requireObjectCoercible(this));
  var result = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

var nativeToFixed = 1.0.toFixed;
var floor$8 = Math.floor;

var pow$2 = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow$2(x, n - 1, acc * x) : pow$2(x * x, n / 2, acc);
};

var log$1 = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

var multiply = function (data, n, c) {
  var index = -1;
  var c2 = c;
  while (++index < 6) {
    c2 += n * data[index];
    data[index] = c2 % 1e7;
    c2 = floor$8(c2 / 1e7);
  }
};

var divide = function (data, n) {
  var index = 6;
  var c = 0;
  while (--index >= 0) {
    c += data[index];
    data[index] = floor$8(c / n);
    c = (c % n) * 1e7;
  }
};

var dataToString = function (data) {
  var index = 6;
  var s = '';
  while (--index >= 0) {
    if (s !== '' || index === 0 || data[index] !== 0) {
      var t = String(data[index]);
      s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
    }
  } return s;
};

var FORCED$6 = nativeToFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !fails(function () {
  // V8 ~ Android 4.3-
  nativeToFixed.call({});
});

// `Number.prototype.toFixed` method
// https://tc39.es/ecma262/#sec-number.prototype.tofixed
_export({ target: 'Number', proto: true, forced: FORCED$6 }, {
  toFixed: function toFixed(fractionDigits) {
    var number = thisNumberValue(this);
    var fractDigits = toInteger(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
    var sign = '';
    var result = '0';
    var e, z, j, k;

    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare -- NaN check
    if (number != number) return 'NaN';
    if (number <= -1e21 || number >= 1e21) return String(number);
    if (number < 0) {
      sign = '-';
      number = -number;
    }
    if (number > 1e-21) {
      e = log$1(number * pow$2(2, 69, 1)) - 69;
      z = e < 0 ? number * pow$2(2, -e, 1) : number / pow$2(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(data, 0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(data, 1e7, 0);
          j -= 7;
        }
        multiply(data, pow$2(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(data, 1 << 23);
          j -= 23;
        }
        divide(data, 1 << j);
        multiply(data, 1, 1);
        divide(data, 2);
        result = dataToString(data);
      } else {
        multiply(data, 0, z);
        multiply(data, 1 << -e, 0);
        result = dataToString(data) + stringRepeat.call('0', fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits
        ? '0.' + stringRepeat.call('0', fractDigits - k) + result
        : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
    } else {
      result = sign + result;
    } return result;
  }
});

var ARRAY_BUFFER$1 = 'ArrayBuffer';
var ArrayBuffer$3 = arrayBuffer[ARRAY_BUFFER$1];
var NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1];

// `ArrayBuffer` constructor
// https://tc39.es/ecma262/#sec-arraybuffer-constructor
_export({ global: true, forced: NativeArrayBuffer$1 !== ArrayBuffer$3 }, {
  ArrayBuffer: ArrayBuffer$3
});

setSpecies(ARRAY_BUFFER$1);

// `Number.MAX_SAFE_INTEGER` constant
// https://tc39.es/ecma262/#sec-number.max_safe_integer
_export({ target: 'Number', stat: true }, {
  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
});

var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var defineProperty$5 = objectDefineProperty.f;
var trim = stringTrim.trim;

var NUMBER = 'Number';
var NativeNumber = global_1[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  if (isSymbol(argument)) throw TypeError('Cannot convert a Symbol value to a number');
  var it = toPrimitive(argument, 'number');
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys$2 = descriptors ? getOwnPropertyNames$1(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
    // ESNext
    'fromString,range'
  ).split(','), j$1 = 0, key$1; keys$2.length > j$1; j$1++) {
    if (has(NativeNumber, key$1 = keys$2[j$1]) && !has(NumberWrapper, key$1)) {
      defineProperty$5(NumberWrapper, key$1, getOwnPropertyDescriptor$2(NativeNumber, key$1));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global_1, NUMBER, NumberWrapper);
}

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

var FORCED$7 = descriptors && fails(function () {
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  return Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get.call({ dotAll: true, sticky: true }) !== 'sy';
});

// `RegExp.prototype.flags` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
if (FORCED$7) objectDefineProperty.f(RegExp.prototype, 'flags', {
  configurable: true,
  get: regexpFlags
});

var nativePromiseConstructor = global_1.Promise;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'return', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

var set$2 = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process$1 = global_1.process;
var MessageChannel = global_1.MessageChannel;
var Dispatch = global_1.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location$1, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location$1 = global_1.location;
} catch (error) { /* empty */ }

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins -- safe
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global_1.postMessage(String(id), location$1.protocol + '//' + location$1.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set$2 || !clear) {
  set$2 = function setImmediate(fn) {
    var args = [];
    var argumentsLength = arguments.length;
    var i = 1;
    while (argumentsLength > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (engineIsNode) {
    defer = function (id) {
      process$1.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global_1.addEventListener &&
    typeof postMessage == 'function' &&
    !global_1.importScripts &&
    location$1 && location$1.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task = {
  set: set$2,
  clear: clear
};

var engineIsIosPebble = /ipad|iphone|ipod/i.test(engineUserAgent) && global_1.Pebble !== undefined;

var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
var macrotask = task.set;





var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
var document$2 = global_1.document;
var process$2 = global_1.process;
var Promise$1 = global_1.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$3(global_1, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (engineIsNode && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
    toggle = true;
    node = document$2.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!engineIsIosPebble && Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise$1.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise$1;
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // Node.js without promises
  } else if (engineIsNode) {
    notify = function () {
      process$2.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global_1, flush);
    };
  }
}

var microtask = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction$1(resolve);
  this.reject = aFunction$1(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
var f$5 = function (C) {
  return new PromiseCapability(C);
};

var newPromiseCapability = {
	f: f$5
};

var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var hostReportErrors = function (a, b) {
  var console = global_1.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

var perform = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var engineIsBrowser = typeof window == 'object';

var task$1 = task.set;












var SPECIES$6 = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState$4 = internalState.get;
var setInternalState$5 = internalState.set;
var getInternalPromiseState = internalState.getterFor(PROMISE);
var NativePromisePrototype = nativePromiseConstructor && nativePromiseConstructor.prototype;
var PromiseConstructor = nativePromiseConstructor;
var PromiseConstructorPrototype = NativePromisePrototype;
var TypeError$1 = global_1.TypeError;
var document$3 = global_1.document;
var process$3 = global_1.process;
var newPromiseCapability$1 = newPromiseCapability.f;
var newGenericPromiseCapability = newPromiseCapability$1;
var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global_1.dispatchEvent);
var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var SUBCLASSING = false;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED$8 = isForced_1(PROMISE, function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && engineV8Version === 66) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (engineV8Version >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = new PromiseConstructor(function (resolve) { resolve(1); });
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES$6] = FakePromise;
  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
  if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  return !GLOBAL_CORE_JS_PROMISE && engineIsBrowser && !NATIVE_REJECTION_EVENT;
});

var INCORRECT_ITERATION = FORCED$8 || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify$1 = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$3.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global_1.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global_1['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (engineIsNode) {
          process$3.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise = state.facade;
    if (engineIsNode) {
      process$3.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify$1(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify$1(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED$8) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction$1(executor);
    Internal.call(this);
    var state = getInternalState$4(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  PromiseConstructorPrototype = PromiseConstructor.prototype;
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState$5(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructorPrototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = engineIsNode ? process$3.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify$1(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState$4(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if ( typeof nativePromiseConstructor == 'function' && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      redefine(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          nativeThen.call(that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });

      // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
      redefine(NativePromisePrototype, 'catch', PromiseConstructorPrototype['catch'], { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (objectSetPrototypeOf) {
      objectSetPrototypeOf(NativePromisePrototype, PromiseConstructorPrototype);
    }
  }
}

_export({ global: true, wrap: true, forced: FORCED$8 }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
_export({ target: PROMISE, stat: true, forced: FORCED$8 }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

_export({ target: PROMISE, stat: true, forced:  FORCED$8 }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve( this, x);
  }
});

_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

/* eslint-disable es/no-object-getownpropertynames -- safe */

var $getOwnPropertyNames = objectGetOwnPropertyNames.f;

var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$6 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$6
};

var getOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
var FAILS_ON_PRIMITIVES$1 = fails(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
  getOwnPropertyNames: getOwnPropertyNames$2
});

var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;


var FAILS_ON_PRIMITIVES$2 = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED$9 = !descriptors || FAILS_ON_PRIMITIVES$2;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
_export({ target: 'Object', stat: true, forced: FORCED$9, sham: !descriptors }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});

// `Number.isInteger` method
// https://tc39.es/ecma262/#sec-number.isinteger
_export({ target: 'Number', stat: true }, {
  isInteger: isInteger
});

// `Int8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int8', function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint8ClampedArray` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint8', function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

// `Int16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int16', function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Int32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int32', function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Float32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Float32', function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Float64Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Float64', function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var quot = /"/g;

// `CreateHTML` abstract operation
// https://tc39.es/ecma262/#sec-createhtml
var createHtml = function (string, tag, attribute, value) {
  var S = toString_1(requireObjectCoercible(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + toString_1(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
var stringHtmlForced = function (METHOD_NAME) {
  return fails(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};

// `String.prototype.link` method
// https://tc39.es/ecma262/#sec-string.prototype.link
_export({ target: 'String', proto: true, forced: stringHtmlForced('link') }, {
  link: function link(url) {
    return createHtml(this, 'a', 'href', url);
  }
});

var $trimStart = stringTrim.start;


var FORCED$a = stringTrimForced('trimStart');

var trimStart = FORCED$a ? function trimStart() {
  return $trimStart(this);
// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
} : ''.trimStart;

// `String.prototype.{ trimStart, trimLeft }` methods
// https://tc39.es/ecma262/#sec-string.prototype.trimstart
// https://tc39.es/ecma262/#String.prototype.trimleft
_export({ target: 'String', proto: true, forced: FORCED$a }, {
  trimStart: trimStart,
  trimLeft: trimStart
});

// `Array.prototype.fill` method
// https://tc39.es/ecma262/#sec-array.prototype.fill
_export({ target: 'Array', proto: true }, {
  fill: arrayFill
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');

var defineProperty$6 = objectDefineProperty.f;
var getOwnPropertyNames$3 = objectGetOwnPropertyNames.f;







var enforceInternalState = internalState.enforce;





var MATCH$1 = wellKnownSymbol('match');
var NativeRegExp = global_1.RegExp;
var RegExpPrototype$2 = NativeRegExp.prototype;
// TODO: Use only propper RegExpIdentifierName
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y;

var BASE_FORCED = descriptors &&
  (!CORRECT_NEW || UNSUPPORTED_Y$3 || regexpUnsupportedDotAll || regexpUnsupportedNcg || fails(function () {
    re2[MATCH$1] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  }));

var handleDotAll = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var brackets = false;
  var chr;
  for (; index <= length; index++) {
    chr = string.charAt(index);
    if (chr === '\\') {
      result += chr + string.charAt(++index);
      continue;
    }
    if (!brackets && chr === '.') {
      result += '[\\s\\S]';
    } else {
      if (chr === '[') {
        brackets = true;
      } else if (chr === ']') {
        brackets = false;
      } result += chr;
    }
  } return result;
};

var handleNCG = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var named = [];
  var names = {};
  var brackets = false;
  var ncg = false;
  var groupid = 0;
  var groupname = '';
  var chr;
  for (; index <= length; index++) {
    chr = string.charAt(index);
    if (chr === '\\') {
      chr = chr + string.charAt(++index);
    } else if (chr === ']') {
      brackets = false;
    } else if (!brackets) switch (true) {
      case chr === '[':
        brackets = true;
        break;
      case chr === '(':
        if (IS_NCG.test(string.slice(index + 1))) {
          index += 2;
          ncg = true;
        }
        result += chr;
        groupid++;
        continue;
      case chr === '>' && ncg:
        if (groupname === '' || has(names, groupname)) {
          throw new SyntaxError('Invalid capture group name');
        }
        names[groupname] = true;
        named.push([groupname, groupid]);
        ncg = false;
        groupname = '';
        continue;
    }
    if (ncg) groupname += chr;
    else result += chr;
  } return [result, named];
};

// `RegExp` constructor
// https://tc39.es/ecma262/#sec-regexp-constructor
if (isForced_1('RegExp', BASE_FORCED)) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = this instanceof RegExpWrapper;
    var patternIsRegExp = isRegexp(pattern);
    var flagsAreUndefined = flags === undefined;
    var groups = [];
    var rawPattern = pattern;
    var rawFlags, dotAll, sticky, handled, result, state;

    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
      return pattern;
    }

    if (patternIsRegExp || pattern instanceof RegExpWrapper) {
      pattern = pattern.source;
      if (flagsAreUndefined) flags = 'flags' in rawPattern ? rawPattern.flags : regexpFlags.call(rawPattern);
    }

    pattern = pattern === undefined ? '' : toString_1(pattern);
    flags = flags === undefined ? '' : toString_1(flags);
    rawPattern = pattern;

    if (regexpUnsupportedDotAll && 'dotAll' in re1) {
      dotAll = !!flags && flags.indexOf('s') > -1;
      if (dotAll) flags = flags.replace(/s/g, '');
    }

    rawFlags = flags;

    if (UNSUPPORTED_Y$3 && 'sticky' in re1) {
      sticky = !!flags && flags.indexOf('y') > -1;
      if (sticky) flags = flags.replace(/y/g, '');
    }

    if (regexpUnsupportedNcg) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }

    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$2, RegExpWrapper);

    if (dotAll || sticky || groups.length) {
      state = enforceInternalState(result);
      if (dotAll) {
        state.dotAll = true;
        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
      }
      if (sticky) state.sticky = true;
      if (groups.length) state.groups = groups;
    }

    if (pattern !== rawPattern) try {
      // fails in old engines, but we have no alternatives for unsupported regex syntax
      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
    } catch (error) { /* empty */ }

    return result;
  };

  var proxy = function (key) {
    key in RegExpWrapper || defineProperty$6(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };

  for (var keys$3 = getOwnPropertyNames$3(NativeRegExp), index = 0; keys$3.length > index;) {
    proxy(keys$3[index++]);
  }

  RegExpPrototype$2.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype$2;
  redefine(global_1, 'RegExp', RegExpWrapper);
}

// https://tc39.es/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');

var f$7 = wellKnownSymbol;

var wellKnownSymbolWrapped = {
	f: f$7
};

var path = global_1;

var defineProperty$7 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty$7(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

var $forEach$2 = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$2 = 'prototype';
var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');
var setInternalState$6 = internalState.set;
var getInternalState$5 = internalState.getterFor(SYMBOL);
var ObjectPrototype$3 = Object[PROTOTYPE$2];
var $Symbol = global_1.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty = objectDefineProperty.f;
var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore$1 = shared('wks');
var QObject = global_1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$3, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype$3[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$3) {
    nativeDefineProperty(ObjectPrototype$3, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$2]);
  setInternalState$6(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var $defineProperty$1 = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype$3) $defineProperty$1(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach$2(keys, function (key) {
    if (!descriptors || $propertyIsEnumerable$1.call(properties, key)) $defineProperty$1(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
};

var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype$3 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype$3 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames$1 = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach$2(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$3;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach$2(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$3, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : toString_1(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype$3) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$3, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return getInternalState$5(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  objectPropertyIsEnumerable.f = $propertyIsEnumerable$1;
  objectDefineProperty.f = $defineProperty$1;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor$1;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames$1;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

  wellKnownSymbolWrapped.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (descriptors) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE$2], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState$5(this).description;
      }
    });
    {
      redefine(ObjectPrototype$3, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
    }
  }
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach$2(objectKeys(WellKnownSymbolsStore$1), function (name) {
  defineWellKnownSymbol(name);
});

_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = toString_1(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty$1,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor$1
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames$1,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return objectGetOwnPropertySymbols.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE$2][TO_PRIMITIVE$1]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE$2], TO_PRIMITIVE$1, $Symbol[PROTOTYPE$2].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

var defineProperty$8 = objectDefineProperty.f;


var NativeSymbol = global_1.Symbol;

if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty$8(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  _export({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[0],{

/***/"./node_modules/fflate/esm/browser.js":




function node_modulesFflateEsmBrowserJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Deflate",function(){return Deflate;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AsyncDeflate",function(){return AsyncDeflate;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"deflate",function(){return deflate;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"deflateSync",function(){return deflateSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Inflate",function(){return Inflate;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AsyncInflate",function(){return AsyncInflate;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"inflate",function(){return inflate;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"inflateSync",function(){return inflateSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Gzip",function(){return Gzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AsyncGzip",function(){return AsyncGzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"gzip",function(){return gzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"gzipSync",function(){return gzipSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Gunzip",function(){return Gunzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AsyncGunzip",function(){return AsyncGunzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"gunzip",function(){return gunzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"gunzipSync",function(){return gunzipSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Zlib",function(){return Zlib;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AsyncZlib",function(){return AsyncZlib;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"zlib",function(){return zlib;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"zlibSync",function(){return zlibSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Unzlib",function(){return Unzlib;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AsyncUnzlib",function(){return AsyncUnzlib;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"unzlib",function(){return unzlib;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"unzlibSync",function(){return unzlibSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"compress",function(){return gzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AsyncCompress",function(){return AsyncGzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"compressSync",function(){return gzipSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Compress",function(){return Gzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Decompress",function(){return Decompress;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AsyncDecompress",function(){return AsyncDecompress;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"decompress",function(){return decompress;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"decompressSync",function(){return decompressSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"strToU8",function(){return strToU8;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"strFromU8",function(){return strFromU8;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"zip",function(){return zip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"zipSync",function(){return zipSync;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"unzip",function(){return unzip;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"unzipSync",function(){return unzipSync;});
// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Much of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// Many optimizations have been made, so the bundle size is ultimately smaller but performance is similar.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
var ch2={};
var wk=function wk(c,id,msg,transfer,cb){
var u=ch2[id]||(ch2[id]=URL.createObjectURL(new Blob([c],{type:'text/javascript'})));
var w=new Worker(u);
w.onerror=function(e){return cb(e.error,null);};
w.onmessage=function(e){return cb(null,e.data);};
w.postMessage(msg,transfer);
return w;
};

// aliases for shorter compressed code (most minifers don't do this)
var u8=Uint8Array,u16=Uint16Array,u32=Uint32Array;
// fixed length extra bits
var fleb=new u8([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,/* unused */0,0,/* impossible */0]);
// fixed distance extra bits
// see fleb note
var fdeb=new u8([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,/* unused */0,0]);
// code length index map
var clim=new u8([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
// get base, reverse index map from extra bits
var freb=function freb(eb,start){
var b=new u16(31);
for(var i=0;i<31;++i){
b[i]=start+=1<<eb[i-1];
}
// numbers here are at max 18 bits
var r=new u32(b[30]);
for(var i=1;i<30;++i){
for(var j=b[i];j<b[i+1];++j){
r[j]=j-b[i]<<5|i;
}
}
return [b,r];
};
var _a=freb(fleb,2),fl=_a[0],revfl=_a[1];
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28]=258,revfl[258]=28;
var _b=freb(fdeb,0),fd=_b[0],revfd=_b[1];
// map of value to reverse (assuming 16 bits)
var rev=new u16(32768);
for(var i=0;i<32768;++i){
// reverse table algorithm from SO
var x=(i&0xAAAA)>>>1|(i&0x5555)<<1;
x=(x&0xCCCC)>>>2|(x&0x3333)<<2;
x=(x&0xF0F0)>>>4|(x&0x0F0F)<<4;
rev[i]=((x&0xFF00)>>>8|(x&0x00FF)<<8)>>>1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap=function hMap(cd,mb,r){
var s=cd.length;
// index
var i=0;
// u16 "map": index -> # of codes with bit length = index
var l=new u16(mb);
// length of cd must be 288 (total # of codes)
for(;i<s;++i){
++l[cd[i]-1];}
// u16 "map": index -> minimum code for bit length = index
var le=new u16(mb);
for(i=0;i<mb;++i){
le[i]=le[i-1]+l[i-1]<<1;
}
var co;
if(r){
// u16 "map": index -> number of actual bits, symbol for code
co=new u16(1<<mb);
// bits to remove for reverser
var rvb=15-mb;
for(i=0;i<s;++i){
// ignore 0 lengths
if(cd[i]){
// num encoding both symbol and bits read
var sv=i<<4|cd[i];
// free bits
var r_1=mb-cd[i];
// start value
var v=le[cd[i]-1]++<<r_1;
// m is end value
for(var m=v|(1<<r_1)-1;v<=m;++v){
// every 16 bit value starting with the code yields the same result
co[rev[v]>>>rvb]=sv;
}
}
}
}else
{
co=new u16(s);
for(i=0;i<s;++i){
co[i]=rev[le[cd[i]-1]++]>>>15-cd[i];}
}
return co;
};
// fixed length tree
var flt=new u8(288);
for(var i=0;i<144;++i){
flt[i]=8;}
for(var i=144;i<256;++i){
flt[i]=9;}
for(var i=256;i<280;++i){
flt[i]=7;}
for(var i=280;i<288;++i){
flt[i]=8;}
// fixed distance tree
var fdt=new u8(32);
for(var i=0;i<32;++i){
fdt[i]=5;}
// fixed length map
var flm=/*#__PURE__*/hMap(flt,9,0),flrm=/*#__PURE__*/hMap(flt,9,1);
// fixed distance map
var fdm=/*#__PURE__*/hMap(fdt,5,0),fdrm=/*#__PURE__*/hMap(fdt,5,1);
// find max of array
var max=function max(a){
var m=a[0];
for(var i=1;i<a.length;++i){
if(a[i]>m)
m=a[i];
}
return m;
};
// read d, starting at bit p and mask with m
var bits=function bits(d,p,m){
var o=p/8>>0;
return (d[o]|d[o+1]<<8)>>>(p&7)&m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16=function bits16(d,p){
var o=p/8>>0;
return (d[o]|d[o+1]<<8|d[o+2]<<16)>>>(p&7);
};
// get end of byte
var shft=function shft(p){return (p/8>>0)+(p&7&&1);};
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc=function slc(v,s,e){
if(s==null||s<0)
s=0;
if(e==null||e>v.length)
e=v.length;
// can't use .constructor in case user-supplied
var n=new(v instanceof u16?u16:v instanceof u32?u32:u8)(e-s);
n.set(v.subarray(s,e));
return n;
};
// expands raw DEFLATE data
var inflt=function inflt(dat,buf,st){
// source length
var sl=dat.length;
// have to estimate size
var noBuf=!buf||st;
// no state
var noSt=!st||st.i;
if(!st)
st={};
// Assumes roughly 33% compression ratio average
if(!buf)
buf=new u8(sl*3);
// ensure buffer can fit at least l elements
var cbuf=function cbuf(l){
var bl=buf.length;
// need to increase size to fit
if(l>bl){
// Double or set to necessary, whichever is greater
var nbuf=new u8(Math.max(bl*2,l));
nbuf.set(buf);
buf=nbuf;
}
};
//  last chunk         bitpos           bytes
var final=st.f||0,pos=st.p||0,bt=st.b||0,lm=st.l,dm=st.d,lbt=st.m,dbt=st.n;
// total bits
var tbts=sl*8;
do{
if(!lm){
// BFINAL - this is only 1 when last chunk is next
st.f=final=bits(dat,pos,1);
// type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
var type=bits(dat,pos+1,3);
pos+=3;
if(!type){
// go to end of byte boundary
var s=shft(pos)+4,l=dat[s-4]|dat[s-3]<<8,t=s+l;
if(t>sl){
if(noSt)
throw 'unexpected EOF';
break;
}
// ensure size
if(noBuf)
cbuf(bt+l);
// Copy over uncompressed data
buf.set(dat.subarray(s,t),bt);
// Get new bitpos, update byte count
st.b=bt+=l,st.p=pos=t*8;
continue;
}else
if(type==1)
lm=flrm,dm=fdrm,lbt=9,dbt=5;else
if(type==2){
//  literal                            lengths
var hLit=bits(dat,pos,31)+257,hcLen=bits(dat,pos+10,15)+4;
var tl=hLit+bits(dat,pos+5,31)+1;
pos+=14;
// length+distance tree
var ldt=new u8(tl);
// code length tree
var clt=new u8(19);
for(var i=0;i<hcLen;++i){
// use index map to get real code
clt[clim[i]]=bits(dat,pos+i*3,7);
}
pos+=hcLen*3;
// code lengths bits
var clb=max(clt),clbmsk=(1<<clb)-1;
if(!noSt&&pos+tl*(clb+7)>tbts)
break;
// code lengths map
var clm=hMap(clt,clb,1);
for(var i=0;i<tl;){
var r=clm[bits(dat,pos,clbmsk)];
// bits read
pos+=r&15;
// symbol
var s=r>>>4;
// code length to copy
if(s<16){
ldt[i++]=s;
}else
{
//  copy   count
var c=0,n=0;
if(s==16)
n=3+bits(dat,pos,3),pos+=2,c=ldt[i-1];else
if(s==17)
n=3+bits(dat,pos,7),pos+=3;else
if(s==18)
n=11+bits(dat,pos,127),pos+=7;
while(n--){
ldt[i++]=c;}
}
}
//    length tree                 distance tree
var lt=ldt.subarray(0,hLit),dt=ldt.subarray(hLit);
// max length bits
lbt=max(lt);
// max dist bits
dbt=max(dt);
lm=hMap(lt,lbt,1);
dm=hMap(dt,dbt,1);
}else

throw 'invalid block type';
if(pos>tbts)
throw 'unexpected EOF';
}
// Make sure the buffer can hold this + the largest possible addition
// Maximum chunk size (practically, theoretically infinite) is 2^17;
if(noBuf)
cbuf(bt+131072);
var lms=(1<<lbt)-1,dms=(1<<dbt)-1;
var mxa=lbt+dbt+18;
while(noSt||pos+mxa<tbts){
// bits read, code
var c=lm[bits16(dat,pos)&lms],sym=c>>>4;
pos+=c&15;
if(pos>tbts)
throw 'unexpected EOF';
if(!c)
throw 'invalid length/literal';
if(sym<256)
buf[bt++]=sym;else
if(sym==256){
lm=null;
break;
}else
{
var add=sym-254;
// no extra bits needed if less
if(sym>264){
// index
var i=sym-257,b=fleb[i];
add=bits(dat,pos,(1<<b)-1)+fl[i];
pos+=b;
}
// dist
var d=dm[bits16(dat,pos)&dms],dsym=d>>>4;
if(!d)
throw 'invalid distance';
pos+=d&15;
var dt=fd[dsym];
if(dsym>3){
var b=fdeb[dsym];
dt+=bits16(dat,pos)&(1<<b)-1,pos+=b;
}
if(pos>tbts)
throw 'unexpected EOF';
if(noBuf)
cbuf(bt+131072);
var end=bt+add;
for(;bt<end;bt+=4){
buf[bt]=buf[bt-dt];
buf[bt+1]=buf[bt+1-dt];
buf[bt+2]=buf[bt+2-dt];
buf[bt+3]=buf[bt+3-dt];
}
bt=end;
}
}
st.l=lm,st.p=pos,st.b=bt;
if(lm)
final=1,st.m=lbt,st.d=dm,st.n=dbt;
}while(!final);
return bt==buf.length?buf:slc(buf,0,bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits=function wbits(d,p,v){
v<<=p&7;
var o=p/8>>0;
d[o]|=v;
d[o+1]|=v>>>8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16=function wbits16(d,p,v){
v<<=p&7;
var o=p/8>>0;
d[o]|=v;
d[o+1]|=v>>>8;
d[o+2]|=v>>>16;
};
// creates code lengths from a frequency table
var hTree=function hTree(d,mb){
// Need extra info to make a tree
var t=[];
for(var i=0;i<d.length;++i){
if(d[i])
t.push({s:i,f:d[i]});
}
var s=t.length;
var t2=t.slice();
if(!s)
return [new u8(0),0];
if(s==1){
var v=new u8(t[0].s+1);
v[t[0].s]=1;
return [v,1];
}
t.sort(function(a,b){return a.f-b.f;});
// after i2 reaches last ind, will be stopped
// freq must be greater than largest possible number of symbols
t.push({s:-1,f:25001});
var l=t[0],r=t[1],i0=0,i1=1,i2=2;
t[0]={s:-1,f:l.f+r.f,l:l,r:r};
// efficient algorithm from UZIP.js
// i0 is lookbehind, i2 is lookahead - after processing two low-freq
// symbols that combined have high freq, will start processing i2 (high-freq,
// non-composite) symbols instead
// see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
while(i1!=s-1){
l=t[t[i0].f<t[i2].f?i0++:i2++];
r=t[i0!=i1&&t[i0].f<t[i2].f?i0++:i2++];
t[i1++]={s:-1,f:l.f+r.f,l:l,r:r};
}
var maxSym=t2[0].s;
for(var i=1;i<s;++i){
if(t2[i].s>maxSym)
maxSym=t2[i].s;
}
// code lengths
var tr=new u16(maxSym+1);
// max bits in tree
var mbt=ln(t[i1-1],tr,0);
if(mbt>mb){
// more algorithms from UZIP.js
// TODO: find out how this code works (debt)
//  ind    debt
var i=0,dt=0;
//    left            cost
var lft=mbt-mb,cst=1<<lft;
t2.sort(function(a,b){return tr[b.s]-tr[a.s]||a.f-b.f;});
for(;i<s;++i){
var i2_1=t2[i].s;
if(tr[i2_1]>mb){
dt+=cst-(1<<mbt-tr[i2_1]);
tr[i2_1]=mb;
}else

break;
}
dt>>>=lft;
while(dt>0){
var i2_2=t2[i].s;
if(tr[i2_2]<mb)
dt-=1<<mb-tr[i2_2]++-1;else

++i;
}
for(;i>=0&&dt;--i){
var i2_3=t2[i].s;
if(tr[i2_3]==mb){
--tr[i2_3];
++dt;
}
}
mbt=mb;
}
return [new u8(tr),mbt];
};
// get the max length and assign length codes
var ln=function ln(n,l,d){
return n.s==-1?
Math.max(ln(n.l,l,d+1),ln(n.r,l,d+1)):
l[n.s]=d;
};
// length codes generation
var lc=function lc(c){
var s=c.length;
// Note that the semicolon was intentional
while(s&&!c[--s]){
}
var cl=new u16(++s);
//  ind      num         streak
var cli=0,cln=c[0],cls=1;
var w=function w(v){cl[cli++]=v;};
for(var i=1;i<=s;++i){
if(c[i]==cln&&i!=s)
++cls;else
{
if(!cln&&cls>2){
for(;cls>138;cls-=138){
w(32754);}
if(cls>2){
w(cls>10?cls-11<<5|28690:cls-3<<5|12305);
cls=0;
}
}else
if(cls>3){
w(cln),--cls;
for(;cls>6;cls-=6){
w(8304);}
if(cls>2)
w(cls-3<<5|8208),cls=0;
}
while(cls--){
w(cln);}
cls=1;
cln=c[i];
}
}
return [cl.subarray(0,cli),s];
};
// calculate the length of output from tree, code lengths
var clen=function clen(cf,cl){
var l=0;
for(var i=0;i<cl.length;++i){
l+=cf[i]*cl[i];}
return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk=function wfblk(out,pos,dat){
// no need to write 00 as type: TypedArray defaults to 0
var s=dat.length;
var o=shft(pos+2);
out[o]=s&255;
out[o+1]=s>>>8;
out[o+2]=out[o]^255;
out[o+3]=out[o+1]^255;
for(var i=0;i<s;++i){
out[o+i+4]=dat[i];}
return (o+4+s)*8;
};
// writes a block
var wblk=function wblk(dat,out,final,syms,lf,df,eb,li,bs,bl,p){
wbits(out,p++,final);
++lf[256];
var _a=hTree(lf,15),dlt=_a[0],mlb=_a[1];
var _b=hTree(df,15),ddt=_b[0],mdb=_b[1];
var _c=lc(dlt),lclt=_c[0],nlc=_c[1];
var _d=lc(ddt),lcdt=_d[0],ndc=_d[1];
var lcfreq=new u16(19);
for(var i=0;i<lclt.length;++i){
lcfreq[lclt[i]&31]++;}
for(var i=0;i<lcdt.length;++i){
lcfreq[lcdt[i]&31]++;}
var _e=hTree(lcfreq,7),lct=_e[0],mlcb=_e[1];
var nlcc=19;
for(;nlcc>4&&!lct[clim[nlcc-1]];--nlcc){
}
var flen=bl+5<<3;
var ftlen=clen(lf,flt)+clen(df,fdt)+eb;
var dtlen=clen(lf,dlt)+clen(df,ddt)+eb+14+3*nlcc+clen(lcfreq,lct)+(2*lcfreq[16]+3*lcfreq[17]+7*lcfreq[18]);
if(flen<=ftlen&&flen<=dtlen)
return wfblk(out,p,dat.subarray(bs,bs+bl));
var lm,ll,dm,dl;
wbits(out,p,1+(dtlen<ftlen)),p+=2;
if(dtlen<ftlen){
lm=hMap(dlt,mlb,0),ll=dlt,dm=hMap(ddt,mdb,0),dl=ddt;
var llm=hMap(lct,mlcb,0);
wbits(out,p,nlc-257);
wbits(out,p+5,ndc-1);
wbits(out,p+10,nlcc-4);
p+=14;
for(var i=0;i<nlcc;++i){
wbits(out,p+3*i,lct[clim[i]]);}
p+=3*nlcc;
var lcts=[lclt,lcdt];
for(var it=0;it<2;++it){
var clct=lcts[it];
for(var i=0;i<clct.length;++i){
var len=clct[i]&31;
wbits(out,p,llm[len]),p+=lct[len];
if(len>15)
wbits(out,p,clct[i]>>>5&127),p+=clct[i]>>>12;
}
}
}else
{
lm=flm,ll=flt,dm=fdm,dl=fdt;
}
for(var i=0;i<li;++i){
if(syms[i]>255){
var len=syms[i]>>>18&31;
wbits16(out,p,lm[len+257]),p+=ll[len+257];
if(len>7)
wbits(out,p,syms[i]>>>23&31),p+=fleb[len];
var dst=syms[i]&31;
wbits16(out,p,dm[dst]),p+=dl[dst];
if(dst>3)
wbits16(out,p,syms[i]>>>5&8191),p+=fdeb[dst];
}else
{
wbits16(out,p,lm[syms[i]]),p+=ll[syms[i]];
}
}
wbits16(out,p,lm[256]);
return p+ll[256];
};
// deflate options (nice << 13) | chain
var deo=/*#__PURE__*/new u32([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]);
// empty
var et=/*#__PURE__*/new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt=function dflt(dat,lvl,plvl,pre,post,lst){
var s=dat.length;
var o=new u8(pre+s+5*(1+Math.floor(s/7000))+post);
// writing to this writes to the output buffer
var w=o.subarray(pre,o.length-post);
var pos=0;
if(!lvl||s<8){
for(var i=0;i<=s;i+=65535){
// end
var e=i+65535;
if(e<s){
// write full block
pos=wfblk(w,pos,dat.subarray(i,e));
}else
{
// write final block
w[i]=lst;
pos=wfblk(w,pos,dat.subarray(i,s));
}
}
}else
{
var opt=deo[lvl-1];
var n=opt>>>13,c=opt&8191;
var msk_1=(1<<plvl)-1;
//    prev 2-byte val map    curr 2-byte val map
var prev=new u16(32768),head=new u16(msk_1+1);
var bs1_1=Math.ceil(plvl/3),bs2_1=2*bs1_1;
var hsh=function hsh(i){return (dat[i]^dat[i+1]<<bs1_1^dat[i+2]<<bs2_1)&msk_1;};
// 24576 is an arbitrary number of maximum symbols per block
// 424 buffer for last block
var syms=new u32(25000);
// length/literal freq   distance freq
var lf=new u16(288),df=new u16(32);
//  l/lcnt  exbits  index  l/lind  waitdx  bitpos
var lc_1=0,eb=0,i=0,li=0,wi=0,bs=0;
for(;i<s;++i){
// hash value
var hv=hsh(i);
// index mod 32768
var imod=i&32767;
// previous index with this value
var pimod=head[hv];
prev[imod]=pimod;
head[hv]=imod;
// We always should modify head and prev, but only add symbols if
// this data is not yet processed ("wait" for wait index)
if(wi<=i){
// bytes remaining
var rem=s-i;
if((lc_1>7000||li>24576)&&rem>423){
pos=wblk(dat,w,0,syms,lf,df,eb,li,bs,i-bs,pos);
li=lc_1=eb=0,bs=i;
for(var j=0;j<286;++j){
lf[j]=0;}
for(var j=0;j<30;++j){
df[j]=0;}
}
//  len    dist   chain
var l=2,d=0,ch_1=c,dif=imod-pimod&32767;
if(rem>2&&hv==hsh(i-dif)){
var maxn=Math.min(n,rem)-1;
var maxd=Math.min(32767,i);
// max possible length
// not capped at dif because decompressors implement "rolling" index population
var ml=Math.min(258,rem);
while(dif<=maxd&&--ch_1&&imod!=pimod){
if(dat[i+l]==dat[i+l-dif]){
var nl=0;
for(;nl<ml&&dat[i+nl]==dat[i+nl-dif];++nl){
}
if(nl>l){
l=nl,d=dif;
// break out early when we reach "nice" (we are satisfied enough)
if(nl>maxn)
break;
// now, find the rarest 2-byte sequence within this
// length of literals and search for that instead.
// Much faster than just using the start
var mmd=Math.min(dif,nl-2);
var md=0;
for(var j=0;j<mmd;++j){
var ti=i-dif+j+32768&32767;
var pti=prev[ti];
var cd=ti-pti+32768&32767;
if(cd>md)
md=cd,pimod=ti;
}
}
}
// check the previous match
imod=pimod,pimod=prev[imod];
dif+=imod-pimod+32768&32767;
}
}
// d will be nonzero only when a match was found
if(d){
// store both dist and len data in one Uint32
// Make sure this is recognized as a len/dist with 28th bit (2^28)
syms[li++]=268435456|revfl[l]<<18|revfd[d];
var lin=revfl[l]&31,din=revfd[d]&31;
eb+=fleb[lin]+fdeb[din];
++lf[257+lin];
++df[din];
wi=i+l;
++lc_1;
}else
{
syms[li++]=dat[i];
++lf[dat[i]];
}
}
}
pos=wblk(dat,w,lst,syms,lf,df,eb,li,bs,i-bs,pos);
// this is the easiest way to avoid needing to maintain state
if(!lst)
pos=wfblk(w,pos,et);
}
return slc(o,0,pre+shft(pos)+post);
};
// CRC32 table
var crct=/*#__PURE__*/function(){
var t=new u32(256);
for(var i=0;i<256;++i){
var c=i,k=9;
while(--k){
c=(c&1&&0xEDB88320)^c>>>1;}
t[i]=c;
}
return t;
}();
// CRC32
var crc=function crc(){
var c=0xFFFFFFFF;
return {
p:function p(d){
// closures have awful performance
var cr=c;
for(var i=0;i<d.length;++i){
cr=crct[cr&255^d[i]]^cr>>>8;}
c=cr;
},
d:function d(){return c^0xFFFFFFFF;}};

};
// Alder32
var adler=function adler(){
var a=1,b=0;
return {
p:function p(d){
// closures have awful performance
var n=a,m=b;
var l=d.length;
for(var i=0;i!=l;){
var e=Math.min(i+5552,l);
for(;i<e;++i){
n+=d[i],m+=n;}
n%=65521,m%=65521;
}
a=n,b=m;
},
d:function d(){return (a>>>8<<16|(b&255)<<8|b>>>8)+((a&255)<<23)*2;}};

};
// deflate with opts
var dopt=function dopt(dat,opt,pre,post,st){
return dflt(dat,opt.level==null?6:opt.level,opt.mem==null?Math.ceil(Math.max(8,Math.min(13,Math.log(dat.length)))*1.5):12+opt.mem,pre,post,!st);
};
// Walmart object spread
var mrg=function mrg(a,b){
var o={};
for(var k in a){
o[k]=a[k];}
for(var k in b){
o[k]=b[k];}
return o;
};
// worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.
var wcln=function wcln(fn,fnStr,td){
var dt=fn();
var st=fn.toString();
var ks=st.slice(st.indexOf('[')+1,st.lastIndexOf(']')).replace(/ /g,'').split(',');
for(var i=0;i<dt.length;++i){
var v=dt[i],k=ks[i];
if(typeof v=='function'){
fnStr+=';'+k+'=';
var st_1=v.toString();
if(v.prototype){
// for global objects
if(st_1.indexOf('[native code]')!=-1){
var spInd=st_1.indexOf(' ',8)+1;
fnStr+=st_1.slice(spInd,st_1.indexOf('(',spInd));
}else
{
fnStr+=st_1;
for(var t in v.prototype){
fnStr+=';'+k+'.prototype.'+t+'='+v.prototype[t].toString();}
}
}else

fnStr+=st_1;
}else

td[k]=v;
}
return [fnStr,td];
};
var ch=[];
// clone bufs
var cbfs=function cbfs(v){
var tl=[];
for(var k in v){
if(v[k]instanceof u8||v[k]instanceof u16||v[k]instanceof u32)
tl.push((v[k]=new v[k].constructor(v[k])).buffer);
}
return tl;
};
// use a worker to execute code
var wrkr=function wrkr(fns,init,id,cb){
var _a;
if(!ch[id]){
var fnStr='',td_1={},m=fns.length-1;
for(var i=0;i<m;++i){
_a=wcln(fns[i],fnStr,td_1),fnStr=_a[0],td_1=_a[1];}
ch[id]=wcln(fns[m],fnStr,td_1);
}
var td=mrg({},ch[id][1]);
return wk(ch[id][0]+';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage='+init.toString()+'}',id,td,cbfs(td),cb);
};
// base async inflate fn
var bInflt=function bInflt(){return [u8,u16,u32,fleb,fdeb,clim,fl,fd,flrm,fdrm,rev,hMap,max,bits,bits16,shft,slc,inflt,inflateSync,pbf,gu8];};
var bDflt=function bDflt(){return [u8,u16,u32,fleb,fdeb,clim,revfl,revfd,flm,flt,fdm,fdt,rev,deo,et,hMap,wbits,wbits16,hTree,ln,lc,clen,wfblk,wblk,shft,slc,dflt,dopt,deflateSync,pbf];};
// gzip extra
var gze=function gze(){return [gzh,gzhl,wbytes,crc,crct];};
// gunzip extra
var guze=function guze(){return [gzs,gzl];};
// zlib extra
var zle=function zle(){return [zlh,wbytes,adler];};
// unzlib extra
var zule=function zule(){return [zlv];};
// post buf
var pbf=function pbf(msg){return postMessage(msg,[msg.buffer]);};
// get u8
var gu8=function gu8(o){return o&&o.size&&new u8(o.size);};
// async helper
var cbify=function cbify(dat,opts,fns,init,id,cb){
var w=wrkr(fns,init,id,function(err,dat){
w.terminate();
cb(err,dat);
});
if(!opts.consume)
dat=new u8(dat);
w.postMessage([dat,opts],[dat.buffer]);
return function(){w.terminate();};
};
// auto stream
var astrm=function astrm(strm){
strm.ondata=function(dat,final){return postMessage([dat,final],[dat.buffer]);};
return function(ev){return strm.push(ev.data[0],ev.data[1]);};
};
// async stream attach
var astrmify=function astrmify(fns,strm,opts,init,id){
var t;
var w=wrkr(fns,init,id,function(err,dat){
if(err)
w.terminate(),strm.ondata.call(strm,err);else
{
if(dat[1])
w.terminate();
strm.ondata.call(strm,err,dat[0],dat[1]);
}
});
w.postMessage(opts);
strm.push=function(d,f){
if(t)
throw 'stream finished';
if(!strm.ondata)
throw 'no stream handler';
w.postMessage([d,t=f],[d.buffer]);
};
strm.terminate=function(){w.terminate();};
};
// read 2 bytes
var b2=function b2(d,b){return d[b]|d[b+1]<<8;};
// read 4 bytes
var b4=function b4(d,b){return (d[b]|d[b+1]<<8|d[b+2]<<16)+(d[b+3]<<23)*2;};
// write bytes
var wbytes=function wbytes(d,b,v){
for(;v;++b){
d[b]=v,v>>>=8;}
};
// gzip header
var gzh=function gzh(c,o){
var fn=o.filename;
c[0]=31,c[1]=139,c[2]=8,c[8]=o.level<2?4:o.level==9?2:0,c[9]=3;// assume Unix
if(o.mtime!=0)
wbytes(c,4,Math.floor(new Date(o.mtime||Date.now())/1000));
if(fn){
c[3]=8;
for(var i=0;i<=fn.length;++i){
c[i+10]=fn.charCodeAt(i);}
}
};
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs=function gzs(d){
if(d[0]!=31||d[1]!=139||d[2]!=8)
throw 'invalid gzip data';
var flg=d[3];
var st=10;
if(flg&4)
st+=d[10]|(d[11]<<8)+2;
for(var zs=(flg>>3&1)+(flg>>4&1);zs>0;zs-=!d[st++]){
}
return st+(flg&2);
};
// gzip length
var gzl=function gzl(d){
var l=d.length;
return (d[l-4]|d[l-3]<<8|d[l-2]<<16)+2*(d[l-1]<<23);
};
// gzip header length
var gzhl=function gzhl(o){return 10+(o.filename&&o.filename.length+1||0);};
// zlib header
var zlh=function zlh(c,o){
var lv=o.level,fl=lv==0?0:lv<6?1:lv==9?3:2;
c[0]=120,c[1]=fl<<6|(fl?32-2*fl:1);
};
// zlib valid
var zlv=function zlv(d){
if((d[0]&15)!=8||d[0]>>>4>7||(d[0]<<8|d[1])%31)
throw 'invalid zlib data';
if(d[1]&32)
throw 'invalid zlib data: preset dictionaries not supported';
};
function AsyncCmpStrm(opts,cb){
if(!cb&&typeof opts=='function')
cb=opts,opts={};
this.ondata=cb;
return opts;
}
// zlib footer: -4 to -0 is Adler32
/**
 * Streaming DEFLATE compression
 */
var Deflate=function(){
function Deflate(opts,cb){
if(!cb&&typeof opts=='function')
cb=opts,opts={};
this.ondata=cb;
this.o=opts||{};
}
Deflate.prototype.p=function(c,f){
this.ondata(dopt(c,this.o,0,0,!f),f);
};
/**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
Deflate.prototype.push=function(chunk,final){
if(this.d)
throw 'stream finished';
if(!this.ondata)
throw 'no stream handler';
this.d=final;
this.p(chunk,final||false);
};
return Deflate;
}();

/**
 * Asynchronous streaming DEFLATE compression
 */
var AsyncDeflate=function(){
function AsyncDeflate(opts,cb){
astrmify([
bDflt,
function(){return [astrm,Deflate];}],
this,AsyncCmpStrm.call(this,opts,cb),function(ev){
var strm=new Deflate(ev.data);
onmessage=astrm(strm);
},6);
}
return AsyncDeflate;
}();

function deflate(data,opts,cb){
if(!cb)
cb=opts,opts={};
if(typeof cb!='function')
throw 'no callback';
return cbify(data,opts,[
bDflt],
function(ev){return pbf(deflateSync(ev.data[0],ev.data[1]));},0,cb);
}
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
function deflateSync(data,opts){
if(opts===void 0){opts={};}
return dopt(data,opts,0,0);
}
/**
 * Streaming DEFLATE decompression
 */
var Inflate=function(){
/**
     * Creates an inflation stream
     * @param cb The callback to call whenever data is inflated
     */
function Inflate(cb){
this.s={};
this.p=new u8(0);
this.ondata=cb;
}
Inflate.prototype.e=function(c){
if(this.d)
throw 'stream finished';
if(!this.ondata)
throw 'no stream handler';
var l=this.p.length;
var n=new u8(l+c.length);
n.set(this.p),n.set(c,l),this.p=n;
};
Inflate.prototype.c=function(final){
this.d=this.s.i=final||false;
var bts=this.s.b;
var dt=inflt(this.p,this.o,this.s);
this.ondata(slc(dt,bts,this.s.b),this.d);
this.o=slc(dt,this.s.b-32768),this.s.b=this.o.length;
this.p=slc(this.p,this.s.p/8>>0),this.s.p&=7;
};
/**
     * Pushes a chunk to be inflated
     * @param chunk The chunk to push
     * @param final Whether this is the final chunk
     */
Inflate.prototype.push=function(chunk,final){
this.e(chunk),this.c(final);
};
return Inflate;
}();

/**
 * Asynchronous streaming DEFLATE decompression
 */
var AsyncInflate=function(){
/**
     * Creates an asynchronous inflation stream
     * @param cb The callback to call whenever data is deflated
     */
function AsyncInflate(cb){
this.ondata=cb;
astrmify([
bInflt,
function(){return [astrm,Inflate];}],
this,0,function(){
var strm=new Inflate();
onmessage=astrm(strm);
},7);
}
return AsyncInflate;
}();

function inflate(data,opts,cb){
if(!cb)
cb=opts,opts={};
if(typeof cb!='function')
throw 'no callback';
return cbify(data,opts,[
bInflt],
function(ev){return pbf(inflateSync(ev.data[0],gu8(ev.data[1])));},1,cb);
}
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function inflateSync(data,out){
return inflt(data,out);
}
// before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.
/**
 * Streaming GZIP compression
 */
var Gzip=function(){
function Gzip(opts,cb){
this.c=crc();
this.l=0;
this.v=1;
Deflate.call(this,opts,cb);
}
/**
     * Pushes a chunk to be GZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
Gzip.prototype.push=function(chunk,final){
Deflate.prototype.push.call(this,chunk,final);
};
Gzip.prototype.p=function(c,f){
this.c.p(c);
this.l+=c.length;
var raw=dopt(c,this.o,this.v&&gzhl(this.o),f&&8,!f);
if(this.v)
gzh(raw,this.o),this.v=0;
if(f)
wbytes(raw,raw.length-8,this.c.d()),wbytes(raw,raw.length-4,this.l);
this.ondata(raw,f);
};
return Gzip;
}();

/**
 * Asynchronous streaming GZIP compression
 */
var AsyncGzip=function(){
function AsyncGzip(opts,cb){
astrmify([
bDflt,
gze,
function(){return [astrm,Deflate,Gzip];}],
this,AsyncCmpStrm.call(this,opts,cb),function(ev){
var strm=new Gzip(ev.data);
onmessage=astrm(strm);
},8);
}
return AsyncGzip;
}();

function gzip(data,opts,cb){
if(!cb)
cb=opts,opts={};
if(typeof cb!='function')
throw 'no callback';
return cbify(data,opts,[
bDflt,
gze,
function(){return [gzipSync];}],
function(ev){return pbf(gzipSync(ev.data[0],ev.data[1]));},2,cb);
}
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
function gzipSync(data,opts){
if(opts===void 0){opts={};}
var c=crc(),l=data.length;
c.p(data);
var d=dopt(data,opts,gzhl(opts),8),s=d.length;
return gzh(d,opts),wbytes(d,s-8,c.d()),wbytes(d,s-4,l),d;
}
/**
 * Streaming GZIP decompression
 */
var Gunzip=function(){
/**
     * Creates a GUNZIP stream
     * @param cb The callback to call whenever data is inflated
     */
function Gunzip(cb){
this.v=1;
Inflate.call(this,cb);
}
/**
     * Pushes a chunk to be GUNZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
Gunzip.prototype.push=function(chunk,final){
Inflate.prototype.e.call(this,chunk);
if(this.v){
var s=gzs(this.p);
if(s>=this.p.length&&!final)
return;
this.p=this.p.subarray(s),this.v=0;
}
if(final){
if(this.p.length<8)
throw 'invalid gzip stream';
this.p=this.p.subarray(0,-8);
}
// necessary to prevent TS from using the closure value
// This allows for workerization to function correctly
Inflate.prototype.c.call(this,final);
};
return Gunzip;
}();

/**
 * Asynchronous streaming GZIP decompression
 */
var AsyncGunzip=function(){
/**
     * Creates an asynchronous GUNZIP stream
     * @param cb The callback to call whenever data is deflated
     */
function AsyncGunzip(cb){
this.ondata=cb;
astrmify([
bInflt,
guze,
function(){return [astrm,Inflate,Gunzip];}],
this,0,function(){
var strm=new Gunzip();
onmessage=astrm(strm);
},9);
}
return AsyncGunzip;
}();

function gunzip(data,opts,cb){
if(!cb)
cb=opts,opts={};
if(typeof cb!='function')
throw 'no callback';
return cbify(data,opts,[
bInflt,
guze,
function(){return [gunzipSync];}],
function(ev){return pbf(gunzipSync(ev.data[0]));},3,cb);
}
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
function gunzipSync(data,out){
return inflt(data.subarray(gzs(data),-8),out||new u8(gzl(data)));
}
/**
 * Streaming Zlib compression
 */
var Zlib=function(){
function Zlib(opts,cb){
this.c=adler();
this.v=1;
Deflate.call(this,opts,cb);
}
/**
     * Pushes a chunk to be zlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
Zlib.prototype.push=function(chunk,final){
Deflate.prototype.push.call(this,chunk,final);
};
Zlib.prototype.p=function(c,f){
this.c.p(c);
var raw=dopt(c,this.o,this.v&&2,f&&4,!f);
if(this.v)
zlh(raw,this.o),this.v=0;
if(f)
wbytes(raw,raw.length-4,this.c.d());
this.ondata(raw,f);
};
return Zlib;
}();

/**
 * Asynchronous streaming Zlib compression
 */
var AsyncZlib=function(){
function AsyncZlib(opts,cb){
astrmify([
bDflt,
zle,
function(){return [astrm,Deflate,Zlib];}],
this,AsyncCmpStrm.call(this,opts,cb),function(ev){
var strm=new Zlib(ev.data);
onmessage=astrm(strm);
},10);
}
return AsyncZlib;
}();

function zlib(data,opts,cb){
if(!cb)
cb=opts,opts={};
if(typeof cb!='function')
throw 'no callback';
return cbify(data,opts,[
bDflt,
zle,
function(){return [zlibSync];}],
function(ev){return pbf(zlibSync(ev.data[0],ev.data[1]));},4,cb);
}
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
function zlibSync(data,opts){
if(opts===void 0){opts={};}
var a=adler();
a.p(data);
var d=dopt(data,opts,2,4);
return zlh(d,opts),wbytes(d,d.length-4,a.d()),d;
}
/**
 * Streaming Zlib decompression
 */
var Unzlib=function(){
/**
     * Creates a Zlib decompression stream
     * @param cb The callback to call whenever data is inflated
     */
function Unzlib(cb){
this.v=1;
Inflate.call(this,cb);
}
/**
     * Pushes a chunk to be unzlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
Unzlib.prototype.push=function(chunk,final){
Inflate.prototype.e.call(this,chunk);
if(this.v){
if(this.p.length<2&&!final)
return;
this.p=this.p.subarray(2),this.v=0;
}
if(final){
if(this.p.length<4)
throw 'invalid zlib stream';
this.p=this.p.subarray(0,-4);
}
// necessary to prevent TS from using the closure value
// This allows for workerization to function correctly
Inflate.prototype.c.call(this,final);
};
return Unzlib;
}();

/**
 * Asynchronous streaming Zlib decompression
 */
var AsyncUnzlib=function(){
/**
     * Creates an asynchronous Zlib decompression stream
     * @param cb The callback to call whenever data is deflated
     */
function AsyncUnzlib(cb){
this.ondata=cb;
astrmify([
bInflt,
zule,
function(){return [astrm,Inflate,Unzlib];}],
this,0,function(){
var strm=new Unzlib();
onmessage=astrm(strm);
},11);
}
return AsyncUnzlib;
}();

function unzlib(data,opts,cb){
if(!cb)
cb=opts,opts={};
if(typeof cb!='function')
throw 'no callback';
return cbify(data,opts,[
bInflt,
zule,
function(){return [unzlibSync];}],
function(ev){return pbf(unzlibSync(ev.data[0],gu8(ev.data[1])));},5,cb);
}
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function unzlibSync(data,out){
return inflt((zlv(data),data.subarray(2,-4)),out);
}
// Default algorithm for compression (used because having a known output size allows faster decompression)

// Default algorithm for compression (used because having a known output size allows faster decompression)

/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var Decompress=function(){
/**
     * Creates a decompression stream
     * @param cb The callback to call whenever data is decompressed
     */
function Decompress(cb){
this.G=Gunzip;
this.I=Inflate;
this.Z=Unzlib;
this.ondata=cb;
}
/**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
Decompress.prototype.push=function(chunk,final){
if(!this.ondata)
throw 'no stream handler';
if(!this.s){
if(this.p&&this.p.length){
var n=new u8(this.p.length+chunk.length);
n.set(this.p),n.set(chunk,this.p.length);
}else

this.p=chunk;
if(this.p.length>2){
var _this_1=this;
var cb=function cb(){_this_1.ondata.apply(_this_1,arguments);};
this.s=this.p[0]==31&&this.p[1]==139&&this.p[2]==8?
new this.G(cb):
(this.p[0]&15)!=8||this.p[0]>>4>7||(this.p[0]<<8|this.p[1])%31?
new this.I(cb):
new this.Z(cb);
this.s.push(this.p,final);
this.p=null;
}
}else

this.s.push(chunk,final);
};
return Decompress;
}();

/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var AsyncDecompress=function(){
/**
   * Creates an asynchronous decompression stream
   * @param cb The callback to call whenever data is decompressed
   */
function AsyncDecompress(cb){
this.G=AsyncGunzip;
this.I=AsyncInflate;
this.Z=AsyncUnzlib;
this.ondata=cb;
}
/**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
AsyncDecompress.prototype.push=function(chunk,final){
Decompress.prototype.push.call(this,chunk,final);
};
return AsyncDecompress;
}();

function decompress(data,opts,cb){
if(!cb)
cb=opts,opts={};
if(typeof cb!='function')
throw 'no callback';
return data[0]==31&&data[1]==139&&data[2]==8?
gunzip(data,opts,cb):
(data[0]&15)!=8||data[0]>>4>7||(data[0]<<8|data[1])%31?
inflate(data,opts,cb):
unzlib(data,opts,cb);
}
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function decompressSync(data,out){
return data[0]==31&&data[1]==139&&data[2]==8?
gunzipSync(data,out):
(data[0]&15)!=8||data[0]>>4>7||(data[0]<<8|data[1])%31?
inflateSync(data,out):
unzlibSync(data,out);
}
// flatten a directory structure
var fltn=function fltn(d,p,t,o){
for(var k in d){
var val=d[k],n=p+k;
if(val instanceof u8)
t[n]=[val,o];else
if(Array.isArray(val))
t[n]=[val[0],mrg(o,val[1])];else

fltn(val,n+'/',t,o);
}
};
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str,latin1){
var l=str.length;
if(!latin1&&typeof TextEncoder!='undefined')
return new TextEncoder().encode(str);
var ar=new u8(str.length+(str.length>>>1));
var ai=0;
var w=function w(v){ar[ai++]=v;};
for(var i=0;i<l;++i){
if(ai+5>ar.length){
var n=new u8(ai+8+(l-i<<1));
n.set(ar);
ar=n;
}
var c=str.charCodeAt(i);
if(c<128||latin1)
w(c);else
if(c<2048)
w(192|c>>>6),w(128|c&63);else
if(c>55295&&c<57344)
c=65536+(c&1023<<10)|str.charCodeAt(++i)&1023,
w(240|c>>>18),w(128|c>>>12&63),w(128|c>>>6&63),w(128|c&63);else

w(224|c>>>12),w(128|c>>>6&63),w(128|c&63);
}
return slc(ar,0,ai);
}
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat,latin1){
var r='';
if(!latin1&&typeof TextDecoder!='undefined')
return new TextDecoder().decode(dat);
for(var i=0;i<dat.length;){
var c=dat[i++];
if(c<128||latin1)
r+=String.fromCharCode(c);else
if(c<224)
r+=String.fromCharCode((c&31)<<6|dat[i++]&63);else
if(c<240)
r+=String.fromCharCode((c&15)<<12|(dat[i++]&63)<<6|dat[i++]&63);else

c=((c&15)<<18|(dat[i++]&63)<<12|(dat[i++]&63)<<6|dat[i++]&63)-65536,
r+=String.fromCharCode(55296|c>>10,56320|c&1023);
}
return r;
}
// skip local zip header
var slzh=function slzh(d,b){return b+30+b2(d,b+26)+b2(d,b+28);};
// read zip header
var zh=function zh(d,b,z){
var fnl=b2(d,b+28),fn=strFromU8(d.subarray(b+46,b+46+fnl),!(b2(d,b+8)&2048)),es=b+46+fnl;
var _a=z?z64e(d,es):[b4(d,b+20),b4(d,b+24),b4(d,b+42)],sc=_a[0],su=_a[1],off=_a[2];
return [b2(d,b+10),sc,su,fn,es+b2(d,b+30)+b2(d,b+32),off];
};
// read zip64 extra field
var z64e=function z64e(d,b){
for(;b2(d,b)!=1;b+=4+b2(d,b+2)){
}
return [b4(d,b+12),b4(d,b+4),b4(d,b+20)];
};
// write zip header
var wzh=function wzh(d,b,c,cmp,su,fn,u,o,ce,t){
var fl=fn.length,l=cmp.length;
wbytes(d,b,ce!=null?0x2014B50:0x4034B50),b+=4;
if(ce!=null)
d[b]=20,b+=2;
d[b]=20,b+=2;// spec compliance? what's that?
d[b++]=t==8&&(o.level==1?6:o.level<6?4:o.level==9?2:0),d[b++]=u&&8;
d[b]=t,b+=2;
var dt=new Date(o.mtime||Date.now()),y=dt.getFullYear()-1980;
if(y<0||y>119)
throw 'date not in range 1980-2099';
wbytes(d,b,(y<<24)*2|dt.getMonth()+1<<21|dt.getDate()<<16|dt.getHours()<<11|dt.getMinutes()<<5|dt.getSeconds()>>>1);
b+=4;
wbytes(d,b,c);
wbytes(d,b+4,l);
wbytes(d,b+8,su);
wbytes(d,b+12,fl),b+=16;// skip extra field, comment
if(ce!=null)
wbytes(d,b+=10,ce),b+=4;
d.set(fn,b);
b+=fl;
if(ce==null)
d.set(cmp,b);
};
// write zip footer (end of central directory)
var wzf=function wzf(o,b,c,d,e){
wbytes(o,b,0x6054B50);// skip disk
wbytes(o,b+8,c);
wbytes(o,b+10,c);
wbytes(o,b+12,d);
wbytes(o,b+16,e);
};
function zip(data,opts,cb){
if(!cb)
cb=opts,opts={};
if(typeof cb!='function')
throw 'no callback';
var r={};
fltn(data,'',r,opts);
var k=Object.keys(r);
var lft=k.length,o=0,tot=0;
var slft=lft,files=new Array(lft);
var term=[];
var tAll=function tAll(){
for(var i=0;i<term.length;++i){
term[i]();}
};
var cbf=function cbf(){
var out=new u8(tot+22),oe=o,cdl=tot-o;
tot=0;
for(var i=0;i<slft;++i){
var f=files[i];
try{
wzh(out,tot,f.c,f.d,f.m,f.n,f.u,f.p,null,f.t);
wzh(out,o,f.c,f.d,f.m,f.n,f.u,f.p,tot,f.t),o+=46+f.n.length,tot+=30+f.n.length+f.d.length;
}
catch(e){
return cb(e,null);
}
}
wzf(out,o,files.length,cdl,oe);
cb(null,out);
};
if(!lft)
cbf();
var _loop_1=function _loop_1(i){
var fn=k[i];
var _a=r[fn],file=_a[0],p=_a[1];
var c=crc(),m=file.length;
c.p(file);
var n=strToU8(fn),s=n.length;
var t=p.level==0?0:8;
var cbl=function cbl(e,d){
if(e){
tAll();
cb(e,null);
}else
{
var l=d.length;
files[i]={
t:t,
d:d,
m:m,
c:c.d(),
u:fn.length!=l,
n:n,
p:p};

o+=30+s+l;
tot+=76+2*s+l;
if(! --lft)
cbf();
}
};
if(n.length>65535)
cbl('filename too long',null);
if(!t)
cbl(null,file);else
if(m<160000){
try{
cbl(null,deflateSync(file,p));
}
catch(e){
cbl(e,null);
}
}else

term.push(deflate(file,p,cbl));
};
// Cannot use lft because it can decrease
for(var i=0;i<slft;++i){
_loop_1(i);
}
return tAll;
}
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
function zipSync(data,opts){
if(opts===void 0){opts={};}
var r={};
var files=[];
fltn(data,'',r,opts);
var o=0;
var tot=0;
for(var fn in r){
var _a=r[fn],file=_a[0],p=_a[1];
var t=p.level==0?0:8;
var n=strToU8(fn),s=n.length;
if(n.length>65535)
throw 'filename too long';
var d=t?deflateSync(file,p):file,l=d.length;
var c=crc();
c.p(file);
files.push({
t:t,
d:d,
m:file.length,
c:c.d(),
u:fn.length!=s,
n:n,
o:o,
p:p});

o+=30+s+l;
tot+=76+2*s+l;
}
var out=new u8(tot+22),oe=o,cdl=tot-o;
for(var i=0;i<files.length;++i){
var f=files[i];
wzh(out,f.o,f.c,f.d,f.m,f.n,f.u,f.p,null,f.t);
wzh(out,o,f.c,f.d,f.m,f.n,f.u,f.p,f.o,f.t),o+=46+f.n.length;
}
wzf(out,o,files.length,cdl,oe);
return out;
}
/**
 * Asynchronously decompresses a ZIP archive
 * @param data The raw compressed ZIP file
 * @param cb The callback to call with the decompressed files
 * @returns A function that can be used to immediately terminate the unzipping
 */
function unzip(data,cb){
if(typeof cb!='function')
throw 'no callback';
var term=[];
var tAll=function tAll(){
for(var i=0;i<term.length;++i){
term[i]();}
};
var files={};
var e=data.length-22;
for(;b4(data,e)!=0x6054B50;--e){
if(!e||data.length-e>65558){
cb('invalid zip file',null);
return;
}
}
var lft=b2(data,e+8);
if(!lft)
cb(null,{});
var c=lft;
var o=b4(data,e+16);
var z=o==4294967295;
if(z){
e=b4(data,e-12);
if(b4(data,e)!=0x6064B50)
throw 'invalid zip file';
c=lft=b4(data,e+32);
o=b4(data,e+48);
}
var _loop_2=function _loop_2(i){
var _a=zh(data,o,z),c_1=_a[0],sc=_a[1],su=_a[2],fn=_a[3],no=_a[4],off=_a[5],b=slzh(data,off);
o=no;
var cbl=function cbl(e,d){
if(e){
tAll();
cb(e,null);
}else
{
files[fn]=d;
if(! --lft)
cb(null,files);
}
};
if(!c_1)
cbl(null,slc(data,b,b+sc));else
if(c_1==8){
var infl=data.subarray(b,b+sc);
if(sc<320000){
try{
cbl(null,inflateSync(infl,new u8(su)));
}
catch(e){
cbl(e,null);
}
}else

term.push(inflate(infl,{size:su},cbl));
}else

cbl('unknown compression type '+c_1,null);
};
for(var i=0;i<c;++i){
_loop_2();
}
return tAll;
}
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @returns The decompressed files
 */
function unzipSync(data){
var files={};
var e=data.length-22;
for(;b4(data,e)!=0x6054B50;--e){
if(!e||data.length-e>65558)
throw 'invalid zip file';
}
var c=b2(data,e+8);
if(!c)
return {};
var o=b4(data,e+16);
var z=o==4294967295;
if(z){
e=b4(data,e-12);
if(b4(data,e)!=0x6064B50)
throw 'invalid zip file';
c=b4(data,e+32);
o=b4(data,e+48);
}
for(var i=0;i<c;++i){
var _a=zh(data,o,z),c_2=_a[0],sc=_a[1],su=_a[2],fn=_a[3],no=_a[4],off=_a[5],b=slzh(data,off);
o=no;
if(!c_2)
files[fn]=slc(data,b,b+sc);else
if(c_2==8)
files[fn]=inflateSync(data.subarray(b,b+sc),new u8(su));else

throw 'unknown compression type '+c_2;
}
return files;
}


/***/},

/***/"./node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js":




function node_modulesJspdfAutotableDistJspdfPluginAutotableJs(module,exports,__webpack_require__){

/*!
 * 
 *               jsPDF AutoTable plugin v3.5.20
 *
 *               Copyright (c) 2021 Simon Bengtsson, https://github.com/simonbengtsson/jsPDF-AutoTable
 *               Licensed under the MIT License.
 *               http://opensource.org/licenses/mit-license
 *
 */
!function(t,e){module.exports=e(function(){try{return __webpack_require__(/*! jspdf */"./node_modules/jspdf/dist/jspdf.es.min.js");}catch(t){}}());}(void 0!==this?this:window,function(t){return function(){var e={662:function _(t,e){var _n2,o=this&&this.__extends||(_n2=function n(t,e){return (_n2=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e){Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);}})(t,e);},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t;}_n2(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o());});Object.defineProperty(e,"__esModule",{value:!0}),e.CellHookData=e.HookData=void 0;var r=function r(t,e,n){this.table=e,this.pageNumber=e.pageNumber,this.pageCount=this.pageNumber,this.settings=e.settings,this.cursor=n,this.doc=t.getDocument();};e.HookData=r;var i=function(t){function e(e,n,o,r,i,l){var a=t.call(this,e,n,l)||this;return a.cell=o,a.row=r,a.column=i,a.section=r.section,a;}return o(e,t),e;}(r);e.CellHookData=i;},790:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(148),r=n(938),i=n(323),l=n(587),a=n(49),s=n(858);e.default=function(t){t.API.autoTable=function(){for(var t,e=[],n=0;n<arguments.length;n++){e[n]=arguments[n];}1===e.length?t=e[0]:(console.error("Use of deprecated autoTable initiation"),(t=e[2]||{}).columns=e[0],t.body=e[1]);var o=l.parseInput(this,t),r=s.createTable(this,o);return a.drawTable(this,r),this;},t.API.lastAutoTable=!1,t.API.previousAutoTable=!1,t.API.autoTable.previous=!1,t.API.autoTableText=function(t,e,n,o){r.default(t,e,n,o,this);},t.API.autoTableSetDefaults=function(t){return i.DocHandler.setDefaults(t,this),this;},t.autoTableSetDefaults=function(t,e){i.DocHandler.setDefaults(t,e);},t.API.autoTableHtmlToJson=function(t,e){if(void 0===e&&(e=!1),"undefined"==typeof window)return console.error("Cannot run autoTableHtmlToJson in non browser environment"),null;var n=new i.DocHandler(this),r=o.parseHtml(n,t,window,e,!1),l=r.head,a=r.body;return {columns:l[0].map(function(t){return t.content;}),rows:a,data:a};},t.API.autoTableEndPosY=function(){console.error("Use of deprecated function: autoTableEndPosY. Use doc.lastAutoTable.finalY instead.");var t=this.lastAutoTable;return t&&t.finalY?t.finalY:0;},t.API.autoTableAddPageContent=function(e){return console.error("Use of deprecated function: autoTableAddPageContent. Use jsPDF.autoTableSetDefaults({didDrawPage: () => {}}) instead."),t.API.autoTable.globalDefaults||(t.API.autoTable.globalDefaults={}),t.API.autoTable.globalDefaults.addPageContent=e,this;},t.API.autoTableAddPage=function(){return console.error("Use of deprecated function: autoTableAddPage. Use doc.addPage()"),this.addPage(),this;};};},938:function _(t,e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,n,o,r){o=o||{};var i=1.15,l=r.internal.scaleFactor,a=r.internal.getFontSize()/l,s="",u=1;if("middle"!==o.valign&&"bottom"!==o.valign&&"center"!==o.halign&&"right"!==o.halign||(u=(s="string"==typeof t?t.split(/\r\n|\r|\n/g):t).length||1),n+=a*(2-i),"middle"===o.valign?n-=u/2*a*i:"bottom"===o.valign&&(n-=u*a*i),"center"===o.halign||"right"===o.halign){var d=a;if("center"===o.halign&&(d*=.5),s&&u>=1){for(var h=0;h<s.length;h++){r.text(s[h],e-r.getStringUnitWidth(s[h])*d,n),n+=a*i;}return r;}e-=r.getStringUnitWidth(t)*d;}return "justify"===o.halign?r.text(t,e,n,{maxWidth:o.maxWidth||100,align:"justify"}):r.text(t,e,n),r;};},200:function _(t,e){function n(t,e){var n=t>0,o=e||0===e;return n&&o?"DF":n?"S":o?"F":null;}Object.defineProperty(e,"__esModule",{value:!0}),e.parseSpacing=e.getFillStyle=e.addTableBorder=e.getStringWidth=void 0,e.getStringWidth=function(t,e,n){return n.applyStyles(e,!0),(Array.isArray(t)?t:[t]).map(function(t){return n.getTextWidth(t);}).reduce(function(t,e){return Math.max(t,e);},0);},e.addTableBorder=function(t,e,o,r){var i=e.settings.tableLineWidth,l=e.settings.tableLineColor;t.applyStyles({lineWidth:i,lineColor:l});var a=n(i,!1);a&&t.rect(o.x,o.y,e.getWidth(t.pageSize().width),r.y-o.y,a);},e.getFillStyle=n,e.parseSpacing=function(t,e){var n,o,r,i;if(t=t||e,Array.isArray(t)){if(t.length>=4)return {top:t[0],right:t[1],bottom:t[2],left:t[3]};if(3===t.length)return {top:t[0],right:t[1],bottom:t[2],left:t[1]};if(2===t.length)return {top:t[0],right:t[1],bottom:t[0],left:t[1]};t=1===t.length?t[0]:e;}return "object"==typeof t?("number"==typeof t.vertical&&(t.top=t.vertical,t.bottom=t.vertical),"number"==typeof t.horizontal&&(t.right=t.horizontal,t.left=t.horizontal),{left:null!==(n=t.left)&&void 0!==n?n:e,top:null!==(o=t.top)&&void 0!==o?o:e,right:null!==(r=t.right)&&void 0!==r?r:e,bottom:null!==(i=t.bottom)&&void 0!==i?i:e}):("number"!=typeof t&&(t=e),{top:t,right:t,bottom:t,left:t});};},913:function _(t,e){var _n3,o=this&&this.__extends||(_n3=function n(t,e){return (_n3=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e){Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);}})(t,e);},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t;}_n3(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o());});Object.defineProperty(e,"__esModule",{value:!0}),e.getTheme=e.defaultStyles=e.HtmlRowInput=e.FONT_ROW_RATIO=void 0,e.FONT_ROW_RATIO=1.15;var r=function(t){function e(e){var n=t.call(this)||this;return n._element=e,n;}return o(e,t),e;}(Array);e.HtmlRowInput=r,e.defaultStyles=function(t){return {font:"helvetica",fontStyle:"normal",overflow:"linebreak",fillColor:!1,textColor:20,halign:"left",valign:"top",fontSize:10,cellPadding:5/t,lineColor:200,lineWidth:0,cellWidth:"auto",minCellHeight:0,minCellWidth:0};},e.getTheme=function(t){return {striped:{table:{fillColor:255,textColor:80,fontStyle:"normal"},head:{textColor:255,fillColor:[41,128,185],fontStyle:"bold"},body:{},foot:{textColor:255,fillColor:[41,128,185],fontStyle:"bold"},alternateRow:{fillColor:245}},grid:{table:{fillColor:255,textColor:80,fontStyle:"normal",lineWidth:.1},head:{textColor:255,fillColor:[26,188,156],fontStyle:"bold",lineWidth:0},body:{},foot:{textColor:255,fillColor:[26,188,156],fontStyle:"bold",lineWidth:0},alternateRow:{}},plain:{head:{fontStyle:"bold"},foot:{fontStyle:"bold"}}}[t];};},259:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.parseCss=void 0;var o=n(200);function r(t,e){var n=i(t,e);if(!n)return null;var o=n.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d*))?\)$/);if(!o||!Array.isArray(o))return null;var r=[parseInt(o[1]),parseInt(o[2]),parseInt(o[3])];return 0===parseInt(o[4])||isNaN(r[0])||isNaN(r[1])||isNaN(r[2])?null:r;}function i(t,e){var n=e(t);return "rgba(0, 0, 0, 0)"===n||"transparent"===n||"initial"===n||"inherit"===n?null==t.parentElement?null:i(t.parentElement,e):n;}e.parseCss=function(t,e,n,i,l){var a={},s=96/72,u=r(e,function(t){return l.getComputedStyle(t).backgroundColor;});null!=u&&(a.fillColor=u);var d=r(e,function(t){return l.getComputedStyle(t).color;});null!=d&&(a.textColor=d);var h=r(e,function(t){return l.getComputedStyle(t).borderTopColor;});null!=h&&(a.lineColor=h);var c=function(t,e){var n=[t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft],r=96/(72/e),i=(parseInt(t.lineHeight)-parseInt(t.fontSize))/e/2,l=n.map(function(t){return parseInt(t||"0")/r;}),a=o.parseSpacing(l,0);i>a.top&&(a.top=i);i>a.bottom&&(a.bottom=i);return a;}(i,n);c&&(a.cellPadding=c);var f=parseInt(i.borderTopWidth||"");(f=f/s/n)&&(a.lineWidth=f);var p=["left","right","center","justify"];-1!==p.indexOf(i.textAlign)&&(a.halign=i.textAlign),-1!==(p=["middle","bottom","top"]).indexOf(i.verticalAlign)&&(a.valign=i.verticalAlign);var g=parseInt(i.fontSize||"");isNaN(g)||(a.fontSize=g/s);var y=function(t){var e="";("bold"===t.fontWeight||"bolder"===t.fontWeight||parseInt(t.fontWeight)>=700)&&(e="bold");"italic"!==t.fontStyle&&"oblique"!==t.fontStyle||(e+="italic");return e;}(i);y&&(a.fontStyle=y);var v=(i.fontFamily||"").toLowerCase();return -1!==t.indexOf(v)&&(a.font=v),a;};},323:function _(t,e){Object.defineProperty(e,"__esModule",{value:!0}),e.DocHandler=void 0;var n={},o=function(){function t(t){this.jsPDFDocument=t,this.userStyles={textColor:t.getTextColor?this.jsPDFDocument.getTextColor():0,fontSize:t.internal.getFontSize(),fontStyle:t.internal.getFont().fontStyle,font:t.internal.getFont().fontName};}return t.setDefaults=function(t,e){void 0===e&&(e=null),e?e.__autoTableDocumentDefaults=t:n=t;},t.unifyColor=function(t){return Array.isArray(t)?t:"number"==typeof t?[t,t,t]:"string"==typeof t?[t]:null;},t.prototype.applyStyles=function(e,n){var o,r,i;void 0===n&&(n=!1),e.fontStyle&&this.jsPDFDocument.setFontStyle&&this.jsPDFDocument.setFontStyle(e.fontStyle);var l=this.jsPDFDocument.internal.getFont(),a=l.fontStyle,s=l.fontName;if(e.font&&(s=e.font),e.fontStyle){a=e.fontStyle;var u=this.getFontList()[s];u&&-1===u.indexOf(a)&&(this.jsPDFDocument.setFontStyle&&this.jsPDFDocument.setFontStyle(u[0]),a=u[0]);}if(this.jsPDFDocument.setFont(s,a),e.fontSize&&this.jsPDFDocument.setFontSize(e.fontSize),!n){var d=t.unifyColor(e.fillColor);d&&(o=this.jsPDFDocument).setFillColor.apply(o,d),(d=t.unifyColor(e.textColor))&&(r=this.jsPDFDocument).setTextColor.apply(r,d),(d=t.unifyColor(e.lineColor))&&(i=this.jsPDFDocument).setDrawColor.apply(i,d),"number"==typeof e.lineWidth&&this.jsPDFDocument.setLineWidth(e.lineWidth);}},t.prototype.splitTextToSize=function(t,e,n){return this.jsPDFDocument.splitTextToSize(t,e,n);},t.prototype.rect=function(t,e,n,o,r){return this.jsPDFDocument.rect(t,e,n,o,r);},t.prototype.getLastAutoTable=function(){return this.jsPDFDocument.lastAutoTable||null;},t.prototype.getTextWidth=function(t){return this.jsPDFDocument.getTextWidth(t);},t.prototype.getDocument=function(){return this.jsPDFDocument;},t.prototype.setPage=function(t){this.jsPDFDocument.setPage(t);},t.prototype.addPage=function(){return this.jsPDFDocument.addPage();},t.prototype.getFontList=function(){return this.jsPDFDocument.getFontList();},t.prototype.getGlobalOptions=function(){return n||{};},t.prototype.getDocumentOptions=function(){return this.jsPDFDocument.__autoTableDocumentDefaults||{};},t.prototype.pageSize=function(){var t=this.jsPDFDocument.internal.pageSize;return null==t.width&&(t={width:t.getWidth(),height:t.getHeight()}),t;},t.prototype.scaleFactor=function(){return this.jsPDFDocument.internal.scaleFactor;},t.prototype.pageNumber=function(){var t=this.jsPDFDocument.internal.getCurrentPageInfo();return t?t.pageNumber:this.jsPDFDocument.internal.getNumberOfPages();},t;}();e.DocHandler=o;},148:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.parseHtml=void 0;var o=n(259),r=n(913);function i(t,e,n,i,a,s){for(var u=new r.HtmlRowInput(i),d=0;d<i.cells.length;d++){var h=i.cells[d],c=n.getComputedStyle(h);if(a||"none"!==c.display){var f=void 0;s&&(f=o.parseCss(t,h,e,c,n)),u.push({rowSpan:h.rowSpan,colSpan:h.colSpan,styles:f,_element:h,content:l(h)});}}var p=n.getComputedStyle(i);if(u.length>0&&(a||"none"!==p.display))return u;}function l(t){var e=t.cloneNode(!0);return e.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/ +/g," "),e.innerHTML=e.innerHTML.split(/\<br.*?\>/).map(function(t){return t.trim();}).join("\n"),e.innerText||e.textContent||"";}e.parseHtml=function(t,e,n,o,r){var l,a,s;void 0===o&&(o=!1),void 0===r&&(r=!1),s="string"==typeof e?n.document.querySelector(e):e;var u=Object.keys(t.getFontList()),d=t.scaleFactor(),h=[],c=[],f=[];if(!s)return console.error("Html table could not be found with input: ",e),{head:h,body:c,foot:f};for(var p=0;p<s.rows.length;p++){var g=s.rows[p],y=null===(a=null===(l=null==g?void 0:g.parentElement)||void 0===l?void 0:l.tagName)||void 0===a?void 0:a.toLowerCase(),v=i(u,d,n,g,o,r);v&&("thead"===y?h.push(v):"tfoot"===y?f.push(v):c.push(v));}return {head:h,body:c,foot:f};};},587:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.parseInput=void 0;var o=n(148),r=n(360),i=n(200),l=n(323),a=n(291);function s(t,e,n){var o=t[0]||e[0]||n[0]||[],r=[];return Object.keys(o).filter(function(t){return "_element"!==t;}).forEach(function(t){var e,n=1;"object"!=typeof(e=Array.isArray(o)?o[parseInt(t)]:o[t])||Array.isArray(e)||(n=(null==e?void 0:e.colSpan)||1);for(var i=0;i<n;i++){var l={dataKey:Array.isArray(o)?r.length:t+(i>0?"_"+i:"")};r.push(l);}}),r;}e.parseInput=function(t,e){var n=new l.DocHandler(t),u=n.getDocumentOptions(),d=n.getGlobalOptions();a.default(n,d,u,e);var h,c=r.assign({},d,u,e);"undefined"!=typeof window&&(h=window);var f=function(t,e,n){for(var o={styles:{},headStyles:{},bodyStyles:{},footStyles:{},alternateRowStyles:{},columnStyles:{}},i=function i(_i2){if("columnStyles"===_i2){var l=t[_i2],a=e[_i2],s=n[_i2];o.columnStyles=r.assign({},l,a,s);}else {var u=[t,e,n].map(function(t){return t[_i2]||{};});o[_i2]=r.assign({},u[0],u[1],u[2]);}},l=0,a=Object.keys(o);l<a.length;l++){i(a[l]);}return o;}(d,u,e),p=function(t,e,n){for(var o={didParseCell:[],willDrawCell:[],didDrawCell:[],didDrawPage:[]},r=0,i=[t,e,n];r<i.length;r++){var l=i[r];l.didParseCell&&o.didParseCell.push(l.didParseCell),l.willDrawCell&&o.willDrawCell.push(l.willDrawCell),l.didDrawCell&&o.didDrawCell.push(l.didDrawCell),l.didDrawPage&&o.didDrawPage.push(l.didDrawPage);}return o;}(d,u,e),g=function(t,e){var n,o,r,l,a,s,u,d,h,c,f,p,g,y=i.parseSpacing(e.margin,40/t.scaleFactor()),v=null!==(n=function(t,e){var n=t.getLastAutoTable(),o=t.scaleFactor(),r=t.pageNumber(),i=!1;if(n&&n.startPageNumber){i=n.startPageNumber+n.pageNumber-1===r;}if("number"==typeof e)return e;if((null==e||!1===e)&&i&&null!=(null==n?void 0:n.finalY))return n.finalY+20/o;return null;}(t,e.startY))&&void 0!==n?n:y.top;p=!0===e.showFoot?"everyPage":!1===e.showFoot?"never":null!==(o=e.showFoot)&&void 0!==o?o:"everyPage";g=!0===e.showHead?"everyPage":!1===e.showHead?"never":null!==(r=e.showHead)&&void 0!==r?r:"everyPage";var m=null!==(l=e.useCss)&&void 0!==l&&l,b=e.theme||(m?"plain":"striped"),w=!!e.horizontalPageBreak,S=null!==(a=e.horizontalPageBreakRepeat)&&void 0!==a?a:null;return {includeHiddenHtml:null!==(s=e.includeHiddenHtml)&&void 0!==s&&s,useCss:m,theme:b,startY:v,margin:y,pageBreak:null!==(u=e.pageBreak)&&void 0!==u?u:"auto",rowPageBreak:null!==(d=e.rowPageBreak)&&void 0!==d?d:"auto",tableWidth:null!==(h=e.tableWidth)&&void 0!==h?h:"auto",showHead:g,showFoot:p,tableLineWidth:null!==(c=e.tableLineWidth)&&void 0!==c?c:0,tableLineColor:null!==(f=e.tableLineColor)&&void 0!==f?f:200,horizontalPageBreak:w,horizontalPageBreakRepeat:S};}(n,c),y=function(t,e,n){var r=e.head||[],i=e.body||[],l=e.foot||[];if(e.html){var a=e.includeHiddenHtml;if(n){var u=o.parseHtml(t,e.html,n,a,e.useCss)||{};r=u.head||r,i=u.body||r,l=u.foot||r;}else console.error("Cannot parse html in non browser environment");}return {columns:e.columns||s(r,i,l),head:r,body:i,foot:l};}(n,c,h);return {id:e.tableId,content:y,hooks:p,styles:f,settings:g};};},291:function _(t,e){function n(t){t.rowHeight?(console.error("Use of deprecated style rowHeight. It is renamed to minCellHeight."),t.minCellHeight||(t.minCellHeight=t.rowHeight)):t.columnWidth&&(console.error("Use of deprecated style columnWidth. It is renamed to cellWidth."),t.cellWidth||(t.cellWidth=t.columnWidth));}Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,o,r){for(var i=function i(e){e&&"object"!=typeof e&&console.error("The options parameter should be of type object, is: "+typeof e),void 0!==e.extendWidth&&(e.tableWidth=e.extendWidth?"auto":"wrap",console.error("Use of deprecated option: extendWidth, use tableWidth instead.")),void 0!==e.margins&&(void 0===e.margin&&(e.margin=e.margins),console.error("Use of deprecated option: margins, use margin instead.")),e.startY&&"number"!=typeof e.startY&&(console.error("Invalid value for startY option",e.startY),delete e.startY),!e.didDrawPage&&(e.afterPageContent||e.beforePageContent||e.afterPageAdd)&&(console.error("The afterPageContent, beforePageContent and afterPageAdd hooks are deprecated. Use didDrawPage instead"),e.didDrawPage=function(n){t.applyStyles(t.userStyles),e.beforePageContent&&e.beforePageContent(n),t.applyStyles(t.userStyles),e.afterPageContent&&e.afterPageContent(n),t.applyStyles(t.userStyles),e.afterPageAdd&&n.pageNumber>1&&n.afterPageAdd(n),t.applyStyles(t.userStyles);}),["createdHeaderCell","drawHeaderRow","drawRow","drawHeaderCell"].forEach(function(t){e[t]&&console.error('The "'+t+'" hook has changed in version 3.0, check the changelog for how to migrate.');}),[["showFoot","showFooter"],["showHead","showHeader"],["didDrawPage","addPageContent"],["didParseCell","createdCell"],["headStyles","headerStyles"]].forEach(function(t){var n=t[0],o=t[1];e[o]&&(console.error("Use of deprecated option "+o+". Use "+n+" instead"),e[n]=e[o]);}),[["padding","cellPadding"],["lineHeight","rowHeight"],"fontSize","overflow"].forEach(function(t){var n="string"==typeof t?t:t[0],o="string"==typeof t?t:t[1];void 0!==e[n]&&(void 0===e.styles[o]&&(e.styles[o]=e[n]),console.error("Use of deprecated option: "+n+", use the style "+o+" instead."));});for(var o=0,r=["styles","bodyStyles","headStyles","footStyles"];o<r.length;o++){n(e[r[o]]||{});}for(var i=e.columnStyles||{},l=0,a=Object.keys(i);l<a.length;l++){n(i[a[l]]||{});}},l=0,a=[e,o,r];l<a.length;l++){i(a[l]);}};},287:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.Column=e.Cell=e.Row=e.Table=void 0;var o=n(913),r=n(662),i=n(200),l=function(){function t(t,e){this.pageNumber=1,this.pageCount=1,this.id=t.id,this.settings=t.settings,this.styles=t.styles,this.hooks=t.hooks,this.columns=e.columns,this.head=e.head,this.body=e.body,this.foot=e.foot;}return t.prototype.getHeadHeight=function(t){return this.head.reduce(function(e,n){return e+n.getMaxCellHeight(t);},0);},t.prototype.getFootHeight=function(t){return this.foot.reduce(function(e,n){return e+n.getMaxCellHeight(t);},0);},t.prototype.allRows=function(){return this.head.concat(this.body).concat(this.foot);},t.prototype.callCellHooks=function(t,e,n,o,i,l){for(var a=0,s=e;a<s.length;a++){var u=!1===(0, s[a])(new r.CellHookData(t,this,n,o,i,l));if(n.text=Array.isArray(n.text)?n.text:[n.text],u)return !1;}return !0;},t.prototype.callEndPageHooks=function(t,e){t.applyStyles(t.userStyles);for(var n=0,o=this.hooks.didDrawPage;n<o.length;n++){(0, o[n])(new r.HookData(t,this,e));}},t.prototype.getWidth=function(t){if("number"==typeof this.settings.tableWidth)return this.settings.tableWidth;if("wrap"===this.settings.tableWidth)return this.columns.reduce(function(t,e){return t+e.wrappedWidth;},0);var e=this.settings.margin;return t-e.left-e.right;},t;}();e.Table=l;var a=function(){function t(t,e,n,r,i){void 0===i&&(i=!1),this.height=0,this.raw=t,t instanceof o.HtmlRowInput&&(this.raw=t._element,this.element=t._element),this.index=e,this.section=n,this.cells=r,this.spansMultiplePages=i;}return t.prototype.getMaxCellHeight=function(t){var e=this;return t.reduce(function(t,n){var o;return Math.max(t,(null===(o=e.cells[n.index])||void 0===o?void 0:o.height)||0);},0);},t.prototype.hasRowSpan=function(t){var e=this;return t.filter(function(t){var n=e.cells[t.index];return !!n&&n.rowSpan>1;}).length>0;},t.prototype.canEntireRowFit=function(t,e){return this.getMaxCellHeight(e)<=t;},t.prototype.getMinimumRowHeight=function(t,e){var n=this;return t.reduce(function(t,r){var i=n.cells[r.index];if(!i)return 0;var l=i.styles.fontSize/e.scaleFactor()*o.FONT_ROW_RATIO,a=i.padding("vertical")+l;return a>t?a:t;},0);},t;}();e.Row=a;var s=function(){function t(t,e,n){var o,r;this.contentHeight=0,this.contentWidth=0,this.wrappedWidth=0,this.minReadableWidth=0,this.minWidth=0,this.width=0,this.height=0,this.x=0,this.y=0,this.styles=e,this.section=n,this.raw=t;var i=t;null==t||"object"!=typeof t||Array.isArray(t)?(this.rowSpan=1,this.colSpan=1):(this.rowSpan=t.rowSpan||1,this.colSpan=t.colSpan||1,i=null!==(r=null!==(o=t.content)&&void 0!==o?o:t.title)&&void 0!==r?r:t,t._element&&(this.raw=t._element));var l=null!=i?""+i:"";this.text=l.split(/\r\n|\r|\n/g);}return t.prototype.getTextPos=function(){var t,e;if("top"===this.styles.valign)t=this.y+this.padding("top");else if("bottom"===this.styles.valign)t=this.y+this.height-this.padding("bottom");else {var n=this.height-this.padding("vertical");t=this.y+n/2+this.padding("top");}if("right"===this.styles.halign)e=this.x+this.width-this.padding("right");else if("center"===this.styles.halign){var o=this.width-this.padding("horizontal");e=this.x+o/2+this.padding("left");}else e=this.x+this.padding("left");return {x:e,y:t};},t.prototype.getContentHeight=function(t){var e=(Array.isArray(this.text)?this.text.length:1)*(this.styles.fontSize/t*o.FONT_ROW_RATIO)+this.padding("vertical");return Math.max(e,this.styles.minCellHeight);},t.prototype.padding=function(t){var e=i.parseSpacing(this.styles.cellPadding,0);return "vertical"===t?e.top+e.bottom:"horizontal"===t?e.left+e.right:e[t];},t;}();e.Cell=s;var u=function(){function t(t,e,n){this.wrappedWidth=0,this.minReadableWidth=0,this.minWidth=0,this.width=0,this.dataKey=t,this.raw=e,this.index=n;}return t.prototype.getMaxCustomCellWidth=function(t){for(var e=0,n=0,o=t.allRows();n<o.length;n++){var r=o[n].cells[this.index];r&&"number"==typeof r.styles.cellWidth&&(e=Math.max(e,r.styles.cellWidth));}return e;},t;}();e.Column=u;},360:function _(t,e){Object.defineProperty(e,"__esModule",{value:!0}),e.assign=void 0,e.assign=function(t,e,n,o,r){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var i=Object(t),l=1;l<arguments.length;l++){var a=arguments[l];if(null!=a)for(var s in a){Object.prototype.hasOwnProperty.call(a,s)&&(i[s]=a[s]);}}return i;};},858:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.createTable=void 0;var o=n(323),r=n(287),i=n(189),l=n(913),a=n(360);function s(t,e,n,o,i,l){var a={};return e.map(function(e,s){for(var u=0,h={},c=0,f=0,p=0,g=n;p<g.length;p++){var y=g[p];if(null==a[y.index]||0===a[y.index].left){if(0===f){var v=void 0,m={};"object"!=typeof(v=Array.isArray(e)?e[y.index-c-u]:e[y.dataKey])||Array.isArray(v)||(m=(null==v?void 0:v.styles)||{});var b=d(t,y,s,i,o,l,m),w=new r.Cell(v,b,t);h[y.dataKey]=w,h[y.index]=w,f=w.colSpan-1,a[y.index]={left:w.rowSpan-1,times:f};}else f--,c++;}else a[y.index].left--,f=a[y.index].times,u++;}return new r.Row(e,s,t,h);});}function u(t,e){var n={};return t.forEach(function(t){if(null!=t.raw){var o=function(t,e){if("head"===t){if("object"==typeof e)return e.header||e.title||null;if("string"==typeof e||"number"==typeof e)return e;}else if("foot"===t&&"object"==typeof e)return e.footer;return null;}(e,t.raw);null!=o&&(n[t.dataKey]=o);}}),Object.keys(n).length>0?n:null;}function d(t,e,n,o,r,i,s){var u,d=l.getTheme(o);"head"===t?u=r.headStyles:"body"===t?u=r.bodyStyles:"foot"===t&&(u=r.footStyles);var h=a.assign({},d.table,d[t],r.styles,u),c=r.columnStyles[e.dataKey]||r.columnStyles[e.index]||{},f="body"===t?c:{},p="body"===t&&n%2==0?a.assign({},d.alternateRow,r.alternateRowStyles):{},g=l.defaultStyles(i),y=a.assign({},g,h,p,f);return a.assign(y,s);}e.createTable=function(t,e){var n=new o.DocHandler(t),l=function(t,e){var n=t.content,o=function(t){return t.map(function(t,e){var n,o,i;return i="object"==typeof t&&null!==(o=null!==(n=t.dataKey)&&void 0!==n?n:t.key)&&void 0!==o?o:e,new r.Column(i,t,e);});}(n.columns);if(0===n.head.length){(i=u(o,"head"))&&n.head.push(i);}if(0===n.foot.length){var i;(i=u(o,"foot"))&&n.foot.push(i);}var l=t.settings.theme,a=t.styles;return {columns:o,head:s("head",n.head,o,a,l,e),body:s("body",n.body,o,a,l,e),foot:s("foot",n.foot,o,a,l,e)};}(e,n.scaleFactor()),a=new r.Table(e,l);return i.calculateWidths(n,a),n.applyStyles(n.userStyles),a;};},49:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.addPage=e.drawTable=void 0;var o=n(913),r=n(200),i=n(287),l=n(323),a=n(360),s=n(938),u=n(435);function d(t,e,n){var r=t.styles.fontSize/n.scaleFactor()*o.FONT_ROW_RATIO,i=t.padding("vertical"),l=Math.floor((e-i)/r);return Math.max(0,l);}function h(t,e,n,o,r,l,s){var u=function(t,e,n,o){var r=e.settings.margin.bottom,i=e.settings.showFoot;("everyPage"===i||"lastPage"===i&&n)&&(r+=e.getFootHeight(e.columns));return t.pageSize().height-o.y-r;}(t,e,o,l);if(n.canEntireRowFit(u,s))c(t,e,n,l,s);else if(function(t,e,n,o){var r=t.pageSize().height,i=o.settings.margin,l=r-(i.top+i.bottom);"body"===e.section&&(l-=o.getHeadHeight(o.columns)+o.getFootHeight(o.columns));var a=e.getMinimumRowHeight(o.columns,t),s=a<n;if(a>l)return console.error("Will not be able to print row "+e.index+" correctly since it's minimum height is larger than page height"),!0;if(!s)return !1;var u=e.hasRowSpan(o.columns);return e.getMaxCellHeight(o.columns)>l?(u&&console.error("The content of row "+e.index+" will not be drawn correctly since drawing rows with a height larger than the page height and has cells with rowspans is not supported."),!0):!u&&"avoid"!==o.settings.rowPageBreak;}(t,n,u,e)){var f=function(t,e,n,o){var r={};t.spansMultiplePages=!0,t.height=0;for(var l=0,s=0,u=n.columns;s<u.length;s++){var h=u[s];if(m=t.cells[h.index]){Array.isArray(m.text)||(m.text=[m.text]);var c=new i.Cell(m.raw,m.styles,m.section);(c=a.assign(c,m)).text=[];var f=d(m,e,o);m.text.length>f&&(c.text=m.text.splice(f,m.text.length));var p=o.scaleFactor();m.contentHeight=m.getContentHeight(p),m.contentHeight>=e&&(m.contentHeight=e,c.styles.minCellHeight-=e),m.contentHeight>t.height&&(t.height=m.contentHeight),c.contentHeight=c.getContentHeight(p),c.contentHeight>l&&(l=c.contentHeight),r[h.index]=c;}}var g=new i.Row(t.raw,-1,t.section,r,!0);g.height=l;for(var y=0,v=n.columns;y<v.length;y++){var m;h=v[y],(c=g.cells[h.index])&&(c.height=g.height),(m=t.cells[h.index])&&(m.height=t.height);}return g;}(n,u,e,t);c(t,e,n,l,s),p(t,e,r,l,s),h(t,e,f,o,r,l,s);}else p(t,e,r,l,s),h(t,e,n,o,r,l,s);}function c(t,e,n,o,r){o.x=e.settings.margin.left;for(var i=0,l=r;i<l.length;i++){var a=l[i],u=n.cells[a.index];if(u){if(t.applyStyles(u.styles),u.x=o.x,u.y=o.y,!1!==e.callCellHooks(t,e.hooks.willDrawCell,u,n,a,o)){f(t,u,o);var d=u.getTextPos();s.default(u.text,d.x,d.y,{halign:u.styles.halign,valign:u.styles.valign,maxWidth:Math.ceil(u.width-u.padding("left")-u.padding("right"))},t.getDocument()),e.callCellHooks(t,e.hooks.didDrawCell,u,n,a,o),o.x+=a.width;}else o.x+=a.width;}else o.x+=a.width;}o.y+=n.height;}function f(t,e,n){var o=e.styles;if("number"==typeof o.lineWidth){var i=r.getFillStyle(o.lineWidth,o.fillColor);i&&t.rect(e.x,n.y,e.width,e.height,i);}else if("object"==typeof o.lineWidth){var l=Object.keys(o.lineWidth),a=o.lineWidth;l.map(function(i){var l=r.getFillStyle(a[i],o.fillColor);!function(t,e,n,o,r,i){var l,a,s,u;switch(o){case"top":l=n.x,a=n.y,s=n.x+e.width,u=n.y;break;case"left":l=n.x,a=n.y,s=n.x,u=n.y+e.height;break;case"right":l=n.x+e.width,a=n.y,s=n.x+e.width,u=n.y+e.height;break;default:l=n.x,a=n.y+e.height,s=n.x+e.width,u=n.y+e.height;}t.getDocument().setLineWidth(i),t.getDocument().line(l,a,s,u,r);}(t,e,n,i,l||"S",a[i]);});}}function p(t,e,n,o,i){void 0===i&&(i=[]),t.applyStyles(t.userStyles),"everyPage"===e.settings.showFoot&&e.foot.forEach(function(n){return c(t,e,n,o,i);}),e.callEndPageHooks(t,o);var l=e.settings.margin;r.addTableBorder(t,e,n,o),g(t),e.pageNumber++,e.pageCount++,o.x=l.left,o.y=l.top,"everyPage"===e.settings.showHead&&e.head.forEach(function(n){return c(t,e,n,o,i);});}function g(t){var e=t.pageNumber();t.setPage(e+1),t.pageNumber()===e&&t.addPage();}e.drawTable=function(t,e){var n=e.settings,o=n.startY,i=n.margin,s={x:i.left,y:o},d=e.getHeadHeight(e.columns)+e.getFootHeight(e.columns),f=o+i.bottom+d;"avoid"===n.pageBreak&&(f+=e.allRows().reduce(function(t,e){return t+e.height;},0));var y=new l.DocHandler(t);("always"===n.pageBreak||null!=n.startY&&f>y.pageSize().height)&&(g(y),s.y=i.top);var v=a.assign({},s);e.startPageNumber=y.pageNumber(),!0===n.horizontalPageBreak?function(t,e,n,o){u.default.calculateAllColumnsCanFitInPage(t,e).map(function(r,i){t.applyStyles(t.userStyles),i>0?p(t,e,n,o,r.columns):function(t,e,n,o){var r=e.settings;t.applyStyles(t.userStyles),("firstPage"===r.showHead||"everyPage"===r.showHead)&&e.head.forEach(function(r){return c(t,e,r,n,o);});}(t,e,o,r.columns),function(t,e,n,o,r){t.applyStyles(t.userStyles),e.body.forEach(function(i,l){var a=l===e.body.length-1;h(t,e,i,a,n,o,r);});}(t,e,n,o,r.columns),function(t,e,n,o){var r=e.settings;t.applyStyles(t.userStyles),("lastPage"===r.showFoot||"everyPage"===r.showFoot)&&e.foot.forEach(function(r){return c(t,e,r,n,o);});}(t,e,o,r.columns);});}(y,e,v,s):(y.applyStyles(y.userStyles),"firstPage"!==n.showHead&&"everyPage"!==n.showHead||e.head.forEach(function(t){return c(y,e,t,s,e.columns);}),y.applyStyles(y.userStyles),e.body.forEach(function(t,n){var o=n===e.body.length-1;h(y,e,t,o,v,s,e.columns);}),y.applyStyles(y.userStyles),"lastPage"!==n.showFoot&&"everyPage"!==n.showFoot||e.foot.forEach(function(t){return c(y,e,t,s,e.columns);})),r.addTableBorder(y,e,v,s),e.callEndPageHooks(y,s),e.finalY=s.y,t.lastAutoTable=e,t.previousAutoTable=e,t.autoTable&&(t.autoTable.previous=e),y.applyStyles(y.userStyles);},e.addPage=p;},435:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var o=n(200),r=function r(t,e){var n=o.parseSpacing(e.settings.margin,0);return t.pageSize().width-(n.left+n.right);},i=function i(t,e,n){void 0===n&&(n={});var o=r(t,e),i=e.settings.horizontalPageBreakRepeat,l=null,a=[],s=[],u=e.columns.length,d=n&&n.start?n.start:0;for(null!=i&&(l=e.columns.find(function(t){return t.dataKey===i||t.index===i;}))&&(a.push(l.index),s.push(e.columns[l.index]),o-=l.wrappedWidth);d<u;){if((null==l?void 0:l.index)!==d){var h=e.columns[d].wrappedWidth;if(o<h){0!==d&&d!==n.start||(a.push(d),s.push(e.columns[d]));break;}a.push(d),s.push(e.columns[d]),o-=h,d++;}else d++;}return {colIndexes:a,columns:s,lastIndex:d};};e.default={getColumnsCanFitInPage:i,calculateAllColumnsCanFitInPage:function calculateAllColumnsCanFitInPage(t,e){for(var n=[],o=0,r=e.columns.length;o<r;){var l=i(t,e,{start:0===o?0:o});l&&l.columns&&l.columns.length?(o=l.lastIndex,n.push(l)):o++;}return n;},getPageAvailableWidth:r};},189:function _(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.ellipsize=e.resizeColumns=e.calculateWidths=void 0;var o=n(200),r=n(435);function i(t,e,n){for(var o=e,r=t.reduce(function(t,e){return t+e.wrappedWidth;},0),l=0;l<t.length;l++){var a=t[l],s=o*(a.wrappedWidth/r),u=a.width+s,d=n(a),h=u<d?d:u;e-=h-a.width,a.width=h;}if(e=Math.round(1e10*e)/1e10){var c=t.filter(function(t){return !(e<0)||t.width>n(t);});c.length&&(e=i(c,e,n));}return e;}function l(t,e,n,r,i){return t.map(function(t){return function(t,e,n,r,i){var l=1e4*r.scaleFactor();if((e=Math.ceil(e*l)/l)>=o.getStringWidth(t,n,r))return t;for(;e<o.getStringWidth(t+i,n,r)&&!(t.length<=1);){t=t.substring(0,t.length-1);}return t.trim()+i;}(t,e,n,r,i);});}e.calculateWidths=function(t,e){!function(t,e){var n=t.scaleFactor(),i=e.settings.horizontalPageBreak,l=r.default.getPageAvailableWidth(t,e);e.allRows().forEach(function(r){for(var a=0,s=e.columns;a<s.length;a++){var u=s[a],d=r.cells[u.index];if(d){var h=e.hooks.didParseCell;e.callCellHooks(t,h,d,r,u,null);var c=d.padding("horizontal");d.contentWidth=o.getStringWidth(d.text,d.styles,t)+c;var f=o.getStringWidth(d.text.join(" ").split(/\s+/),d.styles,t);if(d.minReadableWidth=f+d.padding("horizontal"),"number"==typeof d.styles.cellWidth)d.minWidth=d.styles.cellWidth,d.wrappedWidth=d.styles.cellWidth;else if("wrap"===d.styles.cellWidth||!0===i)d.contentWidth>l?(d.minWidth=l,d.wrappedWidth=l):(d.minWidth=d.contentWidth,d.wrappedWidth=d.contentWidth);else {var p=10/n;d.minWidth=d.styles.minCellWidth||p,d.wrappedWidth=d.contentWidth,d.minWidth>d.wrappedWidth&&(d.wrappedWidth=d.minWidth);}}}}),e.allRows().forEach(function(t){for(var n=0,o=e.columns;n<o.length;n++){var r=o[n],i=t.cells[r.index];if(i&&1===i.colSpan)r.wrappedWidth=Math.max(r.wrappedWidth,i.wrappedWidth),r.minWidth=Math.max(r.minWidth,i.minWidth),r.minReadableWidth=Math.max(r.minReadableWidth,i.minReadableWidth);else {var l=e.styles.columnStyles[r.dataKey]||e.styles.columnStyles[r.index]||{},a=l.cellWidth||l.minCellWidth;a&&"number"==typeof a&&(r.minWidth=a,r.wrappedWidth=a);}i&&(i.colSpan>1&&!r.minWidth&&(r.minWidth=i.minWidth),i.colSpan>1&&!r.wrappedWidth&&(r.wrappedWidth=i.minWidth));}});}(t,e);var n=[],a=0;e.columns.forEach(function(t){var o=t.getMaxCustomCellWidth(e);o?t.width=o:(t.width=t.wrappedWidth,n.push(t)),a+=t.width;});var s=e.getWidth(t.pageSize().width)-a;s&&(s=i(n,s,function(t){return Math.max(t.minReadableWidth,t.minWidth);})),s&&(s=i(n,s,function(t){return t.minWidth;})),s=Math.abs(s),!e.settings.horizontalPageBreak&&s>.1/t.scaleFactor()&&(s=s<1?s:Math.round(s),console.error("Of the table content, "+s+" units width could not fit page")),function(t){for(var e=t.allRows(),n=0;n<e.length;n++){for(var o=e[n],r=null,i=0,l=0,a=0;a<t.columns.length;a++){var s=t.columns[a];if((l-=1)>1&&t.columns[a+1])i+=s.width,delete o.cells[s.index];else if(r){var u=r;delete o.cells[s.index],r=null,u.width=s.width+i;}else {if(!(u=o.cells[s.index]))continue;if(l=u.colSpan,i=0,u.colSpan>1){r=u,i+=s.width;continue;}u.width=s.width+i;}}}}(e),function(t,e){for(var n={count:0,height:0},o=0,r=t.allRows();o<r.length;o++){for(var i=r[o],a=0,s=t.columns;a<s.length;a++){var u=s[a],d=i.cells[u.index];if(d){e.applyStyles(d.styles,!0);var h=d.width-d.padding("horizontal");"linebreak"===d.styles.overflow?d.text=e.splitTextToSize(d.text,h+1/e.scaleFactor(),{fontSize:d.styles.fontSize}):"ellipsize"===d.styles.overflow?d.text=l(d.text,h,d.styles,e,"..."):"hidden"===d.styles.overflow?d.text=l(d.text,h,d.styles,e,""):"function"==typeof d.styles.overflow&&(d.text=d.styles.overflow(d.text,h)),d.contentHeight=d.getContentHeight(e.scaleFactor());var c=d.contentHeight/d.rowSpan;d.rowSpan>1&&n.count*n.height<c*d.rowSpan?n={height:c,count:d.rowSpan}:n&&n.count>0&&n.height>c&&(c=n.height),c>i.height&&(i.height=c);}}n.count--;}}(e,t),function(t){for(var e={},n=1,o=t.allRows(),r=0;r<o.length;r++){for(var i=o[r],l=0,a=t.columns;l<a.length;l++){var s=a[l],u=e[s.index];if(n>1)n--,delete i.cells[s.index];else if(u)u.cell.height+=i.height,n=u.cell.colSpan,delete i.cells[s.index],u.left--,u.left<=1&&delete e[s.index];else {var d=i.cells[s.index];if(!d)continue;if(d.height=i.height,d.rowSpan>1){var h=o.length-r,c=d.rowSpan>h?h:d.rowSpan;e[s.index]={cell:d,left:c,row:i};}}}}}(e);},e.resizeColumns=i,e.ellipsize=l;},465:function _(e){if(void 0===t){var n=new Error("Cannot find module 'undefined'");throw n.code="MODULE_NOT_FOUND",n;}e.exports=t;}},n={};function o(t){var r=n[t];if(void 0!==r)return r.exports;var i=n[t]={exports:{}};return e[t].call(i.exports,i,i.exports,o),i.exports;}var r={};return function(){var t=r;Object.defineProperty(t,"__esModule",{value:!0}),t.Cell=t.Column=t.Row=t.Table=t.CellHookData=t.__drawTable=t.__createTable=t.applyPlugin=void 0;var e=o(790),n=o(587),i=o(49),l=o(858),a=o(287);Object.defineProperty(t,"Table",{enumerable:!0,get:function get(){return a.Table;}});var s=o(662);Object.defineProperty(t,"CellHookData",{enumerable:!0,get:function get(){return s.CellHookData;}});var u=o(287);function d(t){e.default(t);}Object.defineProperty(t,"Cell",{enumerable:!0,get:function get(){return u.Cell;}}),Object.defineProperty(t,"Column",{enumerable:!0,get:function get(){return u.Column;}}),Object.defineProperty(t,"Row",{enumerable:!0,get:function get(){return u.Row;}}),t.applyPlugin=d,t.default=function(t,e){var o=n.parseInput(t,e),r=l.createTable(t,o);i.drawTable(t,r);},t.__createTable=function(t,e){var o=n.parseInput(t,e);return l.createTable(t,o);},t.__drawTable=function(t,e){i.drawTable(t,e);};try{var h=o(465);h.jsPDF&&(h=h.jsPDF),d(h);}catch(t){}}(),r;}();});

/***/},

/***/"./node_modules/jspdf/dist/jspdf.es.min.js":




function node_modulesJspdfDistJspdfEsMinJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global){/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroForm",function(){return Lt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormAppearance",function(){return wt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormButton",function(){return dt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormCheckBox",function(){return vt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormChoiceField",function(){return ct;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormComboBox",function(){return ht;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormEditBox",function(){return ft;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormListBox",function(){return lt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormPasswordField",function(){return yt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormPushButton",function(){return pt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormRadioButton",function(){return gt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AcroFormTextField",function(){return bt;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"GState",function(){return I;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"ShadingPattern",function(){return C;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"TilingPattern",function(){return j;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"jsPDF",function(){return O;});
/* harmony import */var fflate__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! fflate */"./node_modules/fflate/esm/browser.js");
/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 * Version 2.3.1 Built on 2021-03-08T15:44:11.674Z
 *                      CommitID 00000000
 *
 * Copyright (c) 2010-2020 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2020 yWorks GmbH, http://www.yworks.com
 *               2015-2020 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2016-2018 Aras Abbasi <aras.abbasi@gmail.com>
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Steven Spungin, https://github.com/Flamenco
 *               2014 Kenneth Glassey, https://github.com/Gavvers
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */

var r=function(){return "undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this;}();function n(){r.console&&"function"==typeof r.console.log&&r.console.log.apply(r.console,arguments);}var i={log:n,warn:function warn(t){r.console&&("function"==typeof r.console.warn?r.console.warn.apply(r.console,arguments):n.call(null,arguments));},error:function error(t){r.console&&("function"==typeof r.console.error?r.console.error.apply(r.console,arguments):n(t));}};
/**
 * @license
 * FileSaver.js
 * A saveAs() FileSaver implementation.
 *
 * By Eli Grey, http://eligrey.com
 *
 * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
 * source  : http://purl.eligrey.com/github/FileSaver.js
 */function a(t,e,r){var n=new XMLHttpRequest();n.open("GET",t),n.responseType="blob",n.onload=function(){l(n.response,e,r);},n.onerror=function(){i.error("could not download file");},n.send();}function o(t){var e=new XMLHttpRequest();e.open("HEAD",t,!1);try{e.send();}catch(t){}return e.status>=200&&e.status<=299;}function s(t){try{t.dispatchEvent(new MouseEvent("click"));}catch(r){var e=document.createEvent("MouseEvents");e.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),t.dispatchEvent(e);}}var u,c,l=r.saveAs||("object"!=typeof window||window!==r?function(){}:"undefined"!=typeof HTMLAnchorElement&&"download"in HTMLAnchorElement.prototype?function(t,e,n){var i=r.URL||r.webkitURL,u=document.createElement("a");e=e||t.name||"download",u.download=e,u.rel="noopener","string"==typeof t?(u.href=t,u.origin!==location.origin?o(u.href)?a(t,e,n):s(u,u.target="_blank"):s(u)):(u.href=i.createObjectURL(t),setTimeout(function(){i.revokeObjectURL(u.href);},4e4),setTimeout(function(){s(u);},0));}:"msSaveOrOpenBlob"in navigator?function(t,e,r){if(e=e||t.name||"download","string"==typeof t){if(o(t))a(t,e,r);else {var n=document.createElement("a");n.href=t,n.target="_blank",setTimeout(function(){s(n);});}}else navigator.msSaveOrOpenBlob(function(t,e){return void 0===e?e={autoBom:!1}:"object"!=typeof e&&(i.warn("Deprecated: Expected third argument to be a object"),e={autoBom:!e}),e.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t;}(t,r),e);}:function(t,e,n,i){if((i=i||open("","_blank"))&&(i.document.title=i.document.body.innerText="downloading..."),"string"==typeof t)return a(t,e,n);var o="application/octet-stream"===t.type,s=/constructor/i.test(r.HTMLElement)||r.safari,u=/CriOS\/[\d]+/.test(navigator.userAgent);if((u||o&&s)&&"object"==typeof FileReader){var c=new FileReader();c.onloadend=function(){var t=c.result;t=u?t:t.replace(/^data:[^;]*;/,"data:attachment/file;"),i?i.location.href=t:location=t,i=null;},c.readAsDataURL(t);}else {var l=r.URL||r.webkitURL,h=l.createObjectURL(t);i?i.location=h:location.href=h,i=null,setTimeout(function(){l.revokeObjectURL(h);},4e4);}});
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * {@link   http://www.phpied.com/rgb-color-parser-in-javascript/}
 * @license Use it if you like it
 */function h(t){var e;t=t||"",this.ok=!1,"#"==t.charAt(0)&&(t=t.substr(1,6));t={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"}[t=(t=t.replace(/ /g,"")).toLowerCase()]||t;for(var r=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function process(t){return [parseInt(t[1]),parseInt(t[2]),parseInt(t[3])];}},{re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function process(t){return [parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)];}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function process(t){return [parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)];}}],n=0;n<r.length;n++){var i=r[n].re,a=r[n].process,o=i.exec(t);o&&(e=a(o),this.r=e[0],this.g=e[1],this.b=e[2],this.ok=!0);}this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r,this.g=this.g<0||isNaN(this.g)?0:this.g>255?255:this.g,this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b,this.toRGB=function(){return "rgb("+this.r+", "+this.g+", "+this.b+")";},this.toHex=function(){var t=this.r.toString(16),e=this.g.toString(16),r=this.b.toString(16);return 1==t.length&&(t="0"+t),1==e.length&&(e="0"+e),1==r.length&&(r="0"+r),"#"+t+e+r;};}
/**
 * @license
 * Joseph Myers does not specify a particular license for his work.
 *
 * Author: Joseph Myers
 * Accessed from: http://www.myersdaily.org/joseph/javascript/md5.js
 *
 * Modified by: Owen Leong
 */
function f(t,e){var r=t[0],n=t[1],i=t[2],a=t[3];r=p(r,n,i,a,e[0],7,-680876936),a=p(a,r,n,i,e[1],12,-389564586),i=p(i,a,r,n,e[2],17,606105819),n=p(n,i,a,r,e[3],22,-1044525330),r=p(r,n,i,a,e[4],7,-176418897),a=p(a,r,n,i,e[5],12,1200080426),i=p(i,a,r,n,e[6],17,-1473231341),n=p(n,i,a,r,e[7],22,-45705983),r=p(r,n,i,a,e[8],7,1770035416),a=p(a,r,n,i,e[9],12,-1958414417),i=p(i,a,r,n,e[10],17,-42063),n=p(n,i,a,r,e[11],22,-1990404162),r=p(r,n,i,a,e[12],7,1804603682),a=p(a,r,n,i,e[13],12,-40341101),i=p(i,a,r,n,e[14],17,-1502002290),r=g(r,n=p(n,i,a,r,e[15],22,1236535329),i,a,e[1],5,-165796510),a=g(a,r,n,i,e[6],9,-1069501632),i=g(i,a,r,n,e[11],14,643717713),n=g(n,i,a,r,e[0],20,-373897302),r=g(r,n,i,a,e[5],5,-701558691),a=g(a,r,n,i,e[10],9,38016083),i=g(i,a,r,n,e[15],14,-660478335),n=g(n,i,a,r,e[4],20,-405537848),r=g(r,n,i,a,e[9],5,568446438),a=g(a,r,n,i,e[14],9,-1019803690),i=g(i,a,r,n,e[3],14,-187363961),n=g(n,i,a,r,e[8],20,1163531501),r=g(r,n,i,a,e[13],5,-1444681467),a=g(a,r,n,i,e[2],9,-51403784),i=g(i,a,r,n,e[7],14,1735328473),r=m(r,n=g(n,i,a,r,e[12],20,-1926607734),i,a,e[5],4,-378558),a=m(a,r,n,i,e[8],11,-2022574463),i=m(i,a,r,n,e[11],16,1839030562),n=m(n,i,a,r,e[14],23,-35309556),r=m(r,n,i,a,e[1],4,-1530992060),a=m(a,r,n,i,e[4],11,1272893353),i=m(i,a,r,n,e[7],16,-155497632),n=m(n,i,a,r,e[10],23,-1094730640),r=m(r,n,i,a,e[13],4,681279174),a=m(a,r,n,i,e[0],11,-358537222),i=m(i,a,r,n,e[3],16,-722521979),n=m(n,i,a,r,e[6],23,76029189),r=m(r,n,i,a,e[9],4,-640364487),a=m(a,r,n,i,e[12],11,-421815835),i=m(i,a,r,n,e[15],16,530742520),r=v(r,n=m(n,i,a,r,e[2],23,-995338651),i,a,e[0],6,-198630844),a=v(a,r,n,i,e[7],10,1126891415),i=v(i,a,r,n,e[14],15,-1416354905),n=v(n,i,a,r,e[5],21,-57434055),r=v(r,n,i,a,e[12],6,1700485571),a=v(a,r,n,i,e[3],10,-1894986606),i=v(i,a,r,n,e[10],15,-1051523),n=v(n,i,a,r,e[1],21,-2054922799),r=v(r,n,i,a,e[8],6,1873313359),a=v(a,r,n,i,e[15],10,-30611744),i=v(i,a,r,n,e[6],15,-1560198380),n=v(n,i,a,r,e[13],21,1309151649),r=v(r,n,i,a,e[4],6,-145523070),a=v(a,r,n,i,e[11],10,-1120210379),i=v(i,a,r,n,e[2],15,718787259),n=v(n,i,a,r,e[9],21,-343485551),t[0]=x(r,t[0]),t[1]=x(n,t[1]),t[2]=x(i,t[2]),t[3]=x(a,t[3]);}function d(t,e,r,n,i,a){return e=x(x(e,t),x(n,a)),x(e<<i|e>>>32-i,r);}function p(t,e,r,n,i,a,o){return d(e&r|~e&n,t,e,i,a,o);}function g(t,e,r,n,i,a,o){return d(e&n|r&~n,t,e,i,a,o);}function m(t,e,r,n,i,a,o){return d(e^r^n,t,e,i,a,o);}function v(t,e,r,n,i,a,o){return d(r^(e|~n),t,e,i,a,o);}function b(t){var e,r=t.length,n=[1732584193,-271733879,-1732584194,271733878];for(e=64;e<=t.length;e+=64){f(n,y(t.substring(e-64,e)));}t=t.substring(e-64);var i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<t.length;e++){i[e>>2]|=t.charCodeAt(e)<<(e%4<<3);}if(i[e>>2]|=128<<(e%4<<3),e>55)for(f(n,i),e=0;e<16;e++){i[e]=0;}return i[14]=8*r,f(n,i),n;}function y(t){var e,r=[];for(e=0;e<64;e+=4){r[e>>2]=t.charCodeAt(e)+(t.charCodeAt(e+1)<<8)+(t.charCodeAt(e+2)<<16)+(t.charCodeAt(e+3)<<24);}return r;}u=r.atob.bind(r),c=r.btoa.bind(r);var w="0123456789abcdef".split("");function N(t){for(var e="",r=0;r<4;r++){e+=w[t>>8*r+4&15]+w[t>>8*r&15];}return e;}function L(t){return String.fromCharCode((255&t)>>0,(65280&t)>>8,(16711680&t)>>16,(4278190080&t)>>24);}function A(t){return b(t).map(L).join("");}function x(t,e){return t+e&4294967295;}if("5d41402abc4b2a76b9719d911017c592"!=function(t){for(var e=0;e<t.length;e++){t[e]=N(t[e]);}return t.join("");}(b("hello")));
/**
 * @license
 * FPDF is released under a permissive license: there is no usage restriction.
 * You may embed it freely in your application (commercial or not), with or
 * without modifications.
 *
 * Reference: http://www.fpdf.org/en/script/script37.php
 */function S(t,e){var r,n,i,a;if(t!==r){for(var o=(i=t,a=1+(256/t.length>>0),new Array(a+1).join(i)),s=[],u=0;u<256;u++){s[u]=u;}var c=0;for(u=0;u<256;u++){var l=s[u];c=(c+l+o.charCodeAt(u))%256,s[u]=s[c],s[c]=l;}r=t,n=s;}else s=n;var h=e.length,f=0,d=0,p="";for(u=0;u<h;u++){d=(d+(l=s[f=(f+1)%256]))%256,s[f]=s[d],s[d]=l,o=s[(s[f]+s[d])%256],p+=String.fromCharCode(e.charCodeAt(u)^o);}return p;}
/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 * Author: Owen Leong (@owenl131)
 * Date: 15 Oct 2020
 * References:
 * https://www.cs.cmu.edu/~dst/Adobe/Gallery/anon21jul01-pdf-encryption.txt
 * https://github.com/foliojs/pdfkit/blob/master/lib/security.js
 * http://www.fpdf.org/en/script/script37.php
 */var _={print:4,modify:8,copy:16,"annot-forms":32};function P(t,e,r,n){this.v=1,this.r=2;var i=192;t.forEach(function(t){if(void 0!==_.perm)throw new Error("Invalid permission: "+t);i+=_[t];}),this.padding="(¿N^NuAd\0NVÿú\b..\0¶Ðh>/\f©þdSiz";var a=(e+this.padding).substr(0,32),o=(r+this.padding).substr(0,32);this.O=this.processOwnerPassword(a,o),this.P=-(1+(255^i)),this.encryptionKey=A(a+this.O+this.lsbFirstWord(this.P)+this.hexToBytes(n)).substr(0,5),this.U=S(this.encryptionKey,this.padding);}function k(t){if("object"!=typeof t)throw new Error("Invalid Context passed to initialize PubSub (jsPDF-module)");var e={};this.subscribe=function(t,r,n){if(n=n||!1,"string"!=typeof t||"function"!=typeof r||"boolean"!=typeof n)throw new Error("Invalid arguments passed to PubSub.subscribe (jsPDF-module)");e.hasOwnProperty(t)||(e[t]={});var i=Math.random().toString(35);return e[t][i]=[r,!!n],i;},this.unsubscribe=function(t){for(var r in e){if(e[r][t])return delete e[r][t],0===Object.keys(e[r]).length&&delete e[r],!0;}return !1;},this.publish=function(n){if(e.hasOwnProperty(n)){var a=Array.prototype.slice.call(arguments,1),o=[];for(var s in e[n]){var u=e[n][s];try{u[0].apply(t,a);}catch(t){r.console&&i.error("jsPDF PubSub Error",t.message,t);}u[1]&&o.push(s);}o.length&&o.forEach(this.unsubscribe);}},this.getTopics=function(){return e;};}function I(t){if(!(this instanceof I))return new I(t);var e="opacity,stroke-opacity".split(",");for(var r in t){t.hasOwnProperty(r)&&e.indexOf(r)>=0&&(this[r]=t[r]);}this.id="",this.objectNumber=-1;}function F(t,e){this.gState=t,this.matrix=e,this.id="",this.objectNumber=-1;}function C(t,e,r,n,i){if(!(this instanceof C))return new C(t,e,r,n,i);this.type="axial"===t?2:3,this.coords=e,this.colors=r,F.call(this,n,i);}function j(t,e,r,n,i){if(!(this instanceof j))return new j(t,e,r,n,i);this.boundingBox=t,this.xStep=e,this.yStep=r,this.stream="",this.cloneIndex=0,F.call(this,n,i);}function O(t){var e,n="string"==typeof arguments[0]?arguments[0]:"p",a=arguments[1],o=arguments[2],s=arguments[3],u=[],f=1,d=16,p="S",g=null;"object"==typeof(t=t||{})&&(n=t.orientation,a=t.unit||a,o=t.format||o,s=t.compress||t.compressPdf||s,null!==(g=t.encryption||null)&&(g.userPassword=g.userPassword||"",g.ownerPassword=g.ownerPassword||"",g.userPermissions=g.userPermissions||[]),f="number"==typeof t.userUnit?Math.abs(t.userUnit):1,void 0!==t.precision&&(e=t.precision),void 0!==t.floatPrecision&&(d=t.floatPrecision),p=t.defaultPathOperation||"S"),u=t.filters||(!0===s?["FlateEncode"]:u),a=a||"mm",n=(""+(n||"P")).toLowerCase();var m=t.putOnlyUsedFonts||!1,v={},b={internal:{},__private__:{}};b.__private__.PubSub=k;var y="1.3",w=b.__private__.getPdfVersion=function(){return y;};b.__private__.setPdfVersion=function(t){y=t;};var N={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]};b.__private__.getPageFormats=function(){return N;};var L=b.__private__.getPageFormat=function(t){return N[t];};o=o||"a4";var A={COMPAT:"compat",ADVANCED:"advanced"},x=A.COMPAT;function S(){this.saveGraphicsState(),ct(new Ht(xt,0,0,-xt,0,Er()*xt).toString()+" cm"),this.setFontSize(this.getFontSize()/xt),p="n",x=A.ADVANCED;}function _(){this.restoreGraphicsState(),p="S",x=A.COMPAT;}var F=function F(t,e){if("bold"==t&&"normal"==e||"bold"==t&&400==e||"normal"==t&&"italic"==e||"bold"==t&&"italic"==e)throw new Error("Invalid Combination of fontweight and fontstyle");return e&&t!==e&&(t=400==e?"italic"==t?"italic":"normal":700==e&&"italic"!==t?"bold":t+""+e),t;};b.advancedAPI=function(t){var e=x===A.COMPAT;return e&&S.call(this),"function"!=typeof t||(t(this),e&&_.call(this)),this;},b.compatAPI=function(t){var e=x===A.ADVANCED;return e&&_.call(this),"function"!=typeof t||(t(this),e&&S.call(this)),this;},b.isAdvancedAPI=function(){return x===A.ADVANCED;};var B,M=function M(t){if(x!==A.ADVANCED)throw new Error(t+" is only available in 'advanced' API mode. You need to call advancedAPI() first.");},E=b.roundToPrecision=b.__private__.roundToPrecision=function(t,r){var n=e||r;if(isNaN(t)||isNaN(n))throw new Error("Invalid argument passed to jsPDF.roundToPrecision");return t.toFixed(n).replace(/0+$/,"");};B=b.hpf=b.__private__.hpf="number"==typeof d?function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.hpf");return E(t,d);}:"smart"===d?function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.hpf");return E(t,t>-1&&t<1?16:5);}:function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.hpf");return E(t,16);};var q=b.f2=b.__private__.f2=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return E(t,2);},R=b.__private__.f3=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f3");return E(t,3);},T=b.scale=b.__private__.scale=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.scale");return x===A.COMPAT?t*xt:x===A.ADVANCED?t:void 0;},D=function D(t){return x===A.COMPAT?Er()-t:x===A.ADVANCED?t:void 0;},U=function U(t){return T(D(t));};b.__private__.setPrecision=b.setPrecision=function(t){"number"==typeof parseInt(t,10)&&(e=parseInt(t,10));};var z,H="00000000000000000000000000000000",V=b.__private__.getFileId=function(){return H;},W=b.__private__.setFileId=function(t){return H=void 0!==t&&/^[a-fA-F0-9]{32}$/.test(t)?t.toUpperCase():H.split("").map(function(){return "ABCDEF0123456789".charAt(Math.floor(16*Math.random()));}).join(""),null!==g&&(We=new P(g.userPermissions,g.userPassword,g.ownerPassword,H)),H;};b.setFileId=function(t){return W(t),this;},b.getFileId=function(){return V();};var G=b.__private__.convertDateToPDFDate=function(t){var e=t.getTimezoneOffset(),r=e<0?"+":"-",n=Math.floor(Math.abs(e/60)),i=Math.abs(e%60),a=[r,Z(n),"'",Z(i),"'"].join("");return ["D:",t.getFullYear(),Z(t.getMonth()+1),Z(t.getDate()),Z(t.getHours()),Z(t.getMinutes()),Z(t.getSeconds()),a].join("");},Y=b.__private__.convertPDFDateToDate=function(t){var e=parseInt(t.substr(2,4),10),r=parseInt(t.substr(6,2),10)-1,n=parseInt(t.substr(8,2),10),i=parseInt(t.substr(10,2),10),a=parseInt(t.substr(12,2),10),o=parseInt(t.substr(14,2),10);return new Date(e,r,n,i,a,o,0);},J=b.__private__.setCreationDate=function(t){var e;if(void 0===t&&(t=new Date()),t instanceof Date)e=G(t);else {if(!/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|-0[0-9]|-1[0-1])'(0[0-9]|[1-5][0-9])'?$/.test(t))throw new Error("Invalid argument passed to jsPDF.setCreationDate");e=t;}return z=e;},X=b.__private__.getCreationDate=function(t){var e=z;return "jsDate"===t&&(e=Y(z)),e;};b.setCreationDate=function(t){return J(t),this;},b.getCreationDate=function(t){return X(t);};var K,Z=b.__private__.padd2=function(t){return ("0"+parseInt(t)).slice(-2);},$=b.__private__.padd2Hex=function(t){return ("00"+(t=t.toString())).substr(t.length);},Q=0,tt=[],et=[],rt=0,nt=[],it=[],at=!1,ot=et,st=function st(){Q=0,rt=0,et=[],tt=[],nt=[],Zt=Jt(),$t=Jt();};b.__private__.setCustomOutputDestination=function(t){at=!0,ot=t;};var ut=function ut(t){at||(ot=t);};b.__private__.resetCustomOutputDestination=function(){at=!1,ot=et;};var ct=b.__private__.out=function(t){return t=t.toString(),rt+=t.length+1,ot.push(t),ot;},lt=b.__private__.write=function(t){return ct(1===arguments.length?t.toString():Array.prototype.join.call(arguments," "));},ht=b.__private__.getArrayBuffer=function(t){for(var e=t.length,r=new ArrayBuffer(e),n=new Uint8Array(r);e--;){n[e]=t.charCodeAt(e);}return r;},ft=[["Helvetica","helvetica","normal","WinAnsiEncoding"],["Helvetica-Bold","helvetica","bold","WinAnsiEncoding"],["Helvetica-Oblique","helvetica","italic","WinAnsiEncoding"],["Helvetica-BoldOblique","helvetica","bolditalic","WinAnsiEncoding"],["Courier","courier","normal","WinAnsiEncoding"],["Courier-Bold","courier","bold","WinAnsiEncoding"],["Courier-Oblique","courier","italic","WinAnsiEncoding"],["Courier-BoldOblique","courier","bolditalic","WinAnsiEncoding"],["Times-Roman","times","normal","WinAnsiEncoding"],["Times-Bold","times","bold","WinAnsiEncoding"],["Times-Italic","times","italic","WinAnsiEncoding"],["Times-BoldItalic","times","bolditalic","WinAnsiEncoding"],["ZapfDingbats","zapfdingbats","normal",null],["Symbol","symbol","normal",null]];b.__private__.getStandardFonts=function(){return ft;};var dt=t.fontSize||16;b.__private__.setFontSize=b.setFontSize=function(t){return dt=x===A.ADVANCED?t/xt:t,this;};var pt,gt=b.__private__.getFontSize=b.getFontSize=function(){return x===A.COMPAT?dt:dt*xt;},mt=t.R2L||!1;b.__private__.setR2L=b.setR2L=function(t){return mt=t,this;},b.__private__.getR2L=b.getR2L=function(){return mt;};var vt,bt=b.__private__.setZoomMode=function(t){var e=[void 0,null,"fullwidth","fullheight","fullpage","original"];if(/^\d*\.?\d*%$/.test(t))pt=t;else if(isNaN(t)){if(-1===e.indexOf(t))throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "'+t+'" is not recognized.');pt=t;}else pt=parseInt(t,10);};b.__private__.getZoomMode=function(){return pt;};var yt,wt=b.__private__.setPageMode=function(t){if(-1==[void 0,null,"UseNone","UseOutlines","UseThumbs","FullScreen"].indexOf(t))throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "'+t+'" is not recognized.');vt=t;};b.__private__.getPageMode=function(){return vt;};var Nt=b.__private__.setLayoutMode=function(t){if(-1==[void 0,null,"continuous","single","twoleft","tworight","two"].indexOf(t))throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "'+t+'" is not recognized.');yt=t;};b.__private__.getLayoutMode=function(){return yt;},b.__private__.setDisplayMode=b.setDisplayMode=function(t,e,r){return bt(t),Nt(e),wt(r),this;};var Lt={title:"",subject:"",author:"",keywords:"",creator:""};b.__private__.getDocumentProperty=function(t){if(-1===Object.keys(Lt).indexOf(t))throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");return Lt[t];},b.__private__.getDocumentProperties=function(){return Lt;},b.__private__.setDocumentProperties=b.setProperties=b.setDocumentProperties=function(t){for(var e in Lt){Lt.hasOwnProperty(e)&&t[e]&&(Lt[e]=t[e]);}return this;},b.__private__.setDocumentProperty=function(t,e){if(-1===Object.keys(Lt).indexOf(t))throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");return Lt[t]=e;};var At,xt,St,_t,Pt,kt={},It={},Ft=[],Ct={},jt={},Ot={},Bt={},Mt=null,Et=0,qt=[],Rt=new k(b),Tt=t.hotfixes||[],Dt={},Ut={},zt=[],Ht=function Ht(t,e,r,n,i,a){if(!(this instanceof Ht))return new Ht(t,e,r,n,i,a);isNaN(t)&&(t=1),isNaN(e)&&(e=0),isNaN(r)&&(r=0),isNaN(n)&&(n=1),isNaN(i)&&(i=0),isNaN(a)&&(a=0),this._matrix=[t,e,r,n,i,a];};Object.defineProperty(Ht.prototype,"sx",{get:function get(){return this._matrix[0];},set:function set(t){this._matrix[0]=t;}}),Object.defineProperty(Ht.prototype,"shy",{get:function get(){return this._matrix[1];},set:function set(t){this._matrix[1]=t;}}),Object.defineProperty(Ht.prototype,"shx",{get:function get(){return this._matrix[2];},set:function set(t){this._matrix[2]=t;}}),Object.defineProperty(Ht.prototype,"sy",{get:function get(){return this._matrix[3];},set:function set(t){this._matrix[3]=t;}}),Object.defineProperty(Ht.prototype,"tx",{get:function get(){return this._matrix[4];},set:function set(t){this._matrix[4]=t;}}),Object.defineProperty(Ht.prototype,"ty",{get:function get(){return this._matrix[5];},set:function set(t){this._matrix[5]=t;}}),Object.defineProperty(Ht.prototype,"a",{get:function get(){return this._matrix[0];},set:function set(t){this._matrix[0]=t;}}),Object.defineProperty(Ht.prototype,"b",{get:function get(){return this._matrix[1];},set:function set(t){this._matrix[1]=t;}}),Object.defineProperty(Ht.prototype,"c",{get:function get(){return this._matrix[2];},set:function set(t){this._matrix[2]=t;}}),Object.defineProperty(Ht.prototype,"d",{get:function get(){return this._matrix[3];},set:function set(t){this._matrix[3]=t;}}),Object.defineProperty(Ht.prototype,"e",{get:function get(){return this._matrix[4];},set:function set(t){this._matrix[4]=t;}}),Object.defineProperty(Ht.prototype,"f",{get:function get(){return this._matrix[5];},set:function set(t){this._matrix[5]=t;}}),Object.defineProperty(Ht.prototype,"rotation",{get:function get(){return Math.atan2(this.shx,this.sx);}}),Object.defineProperty(Ht.prototype,"scaleX",{get:function get(){return this.decompose().scale.sx;}}),Object.defineProperty(Ht.prototype,"scaleY",{get:function get(){return this.decompose().scale.sy;}}),Object.defineProperty(Ht.prototype,"isIdentity",{get:function get(){return 1===this.sx&&0===this.shy&&0===this.shx&&1===this.sy&&0===this.tx&&0===this.ty;}}),Ht.prototype.join=function(t){return [this.sx,this.shy,this.shx,this.sy,this.tx,this.ty].map(B).join(t);},Ht.prototype.multiply=function(t){var e=t.sx*this.sx+t.shy*this.shx,r=t.sx*this.shy+t.shy*this.sy,n=t.shx*this.sx+t.sy*this.shx,i=t.shx*this.shy+t.sy*this.sy,a=t.tx*this.sx+t.ty*this.shx+this.tx,o=t.tx*this.shy+t.ty*this.sy+this.ty;return new Ht(e,r,n,i,a,o);},Ht.prototype.decompose=function(){var t=this.sx,e=this.shy,r=this.shx,n=this.sy,i=this.tx,a=this.ty,o=Math.sqrt(t*t+e*e),s=(t/=o)*r+(e/=o)*n;r-=t*s,n-=e*s;var u=Math.sqrt(r*r+n*n);return s/=u,t*(n/=u)<e*(r/=u)&&(t=-t,e=-e,s=-s,o=-o),{scale:new Ht(o,0,0,u,0,0),translate:new Ht(1,0,0,1,i,a),rotate:new Ht(t,e,-e,t,0,0),skew:new Ht(1,0,s,1,0,0)};},Ht.prototype.toString=function(t){return this.join(" ");},Ht.prototype.inversed=function(){var t=this.sx,e=this.shy,r=this.shx,n=this.sy,i=this.tx,a=this.ty,o=1/(t*n-e*r),s=n*o,u=-e*o,c=-r*o,l=t*o;return new Ht(s,u,c,l,-s*i-c*a,-u*i-l*a);},Ht.prototype.applyToPoint=function(t){var e=t.x*this.sx+t.y*this.shx+this.tx,r=t.x*this.shy+t.y*this.sy+this.ty;return new kr(e,r);},Ht.prototype.applyToRectangle=function(t){var e=this.applyToPoint(t),r=this.applyToPoint(new kr(t.x+t.w,t.y+t.h));return new Ir(e.x,e.y,r.x-e.x,r.y-e.y);},Ht.prototype.clone=function(){var t=this.sx,e=this.shy,r=this.shx,n=this.sy,i=this.tx,a=this.ty;return new Ht(t,e,r,n,i,a);},b.Matrix=Ht;var Vt=b.matrixMult=function(t,e){return e.multiply(t);},Wt=new Ht(1,0,0,1,0,0);b.unitMatrix=b.identityMatrix=Wt;var Gt=function Gt(t,e){if(!jt[t]){var r=(e instanceof C?"Sh":"P")+(Object.keys(Ct).length+1).toString(10);e.id=r,jt[t]=r,Ct[r]=e,Rt.publish("addPattern",e);}};b.ShadingPattern=C,b.TilingPattern=j,b.addShadingPattern=function(t,e){return M("addShadingPattern()"),Gt(t,e),this;},b.beginTilingPattern=function(t){M("beginTilingPattern()"),Cr(t.boundingBox[0],t.boundingBox[1],t.boundingBox[2]-t.boundingBox[0],t.boundingBox[3]-t.boundingBox[1],t.matrix);},b.endTilingPattern=function(t,e){M("endTilingPattern()"),e.stream=it[K].join("\n"),Gt(t,e),Rt.publish("endTilingPattern",e),zt.pop().restore();};var Yt=b.__private__.newObject=function(){var t=Jt();return Xt(t,!0),t;},Jt=b.__private__.newObjectDeferred=function(){return Q++,tt[Q]=function(){return rt;},Q;},Xt=function Xt(t,e){return e="boolean"==typeof e&&e,tt[t]=rt,e&&ct(t+" 0 obj"),t;},Kt=b.__private__.newAdditionalObject=function(){var t={objId:Jt(),content:""};return nt.push(t),t;},Zt=Jt(),$t=Jt(),Qt=b.__private__.decodeColorString=function(t){var e=t.split(" ");if(2!==e.length||"g"!==e[1]&&"G"!==e[1]){if(5===e.length&&("k"===e[4]||"K"===e[4])){e=[(1-e[0])*(1-e[3]),(1-e[1])*(1-e[3]),(1-e[2])*(1-e[3]),"r"];}}else {var r=parseFloat(e[0]);e=[r,r,r,"r"];}for(var n="#",i=0;i<3;i++){n+=("0"+Math.floor(255*parseFloat(e[i])).toString(16)).slice(-2);}return n;},te=b.__private__.encodeColorString=function(t){var e;"string"==typeof t&&(t={ch1:t});var r=t.ch1,n=t.ch2,i=t.ch3,a=t.ch4,o="draw"===t.pdfColorType?["G","RG","K"]:["g","rg","k"];if("string"==typeof r&&"#"!==r.charAt(0)){var s=new h(r);if(s.ok)r=s.toHex();else if(!/^\d*\.?\d*$/.test(r))throw new Error('Invalid color "'+r+'" passed to jsPDF.encodeColorString.');}if("string"==typeof r&&/^#[0-9A-Fa-f]{3}$/.test(r)&&(r="#"+r[1]+r[1]+r[2]+r[2]+r[3]+r[3]),"string"==typeof r&&/^#[0-9A-Fa-f]{6}$/.test(r)){var u=parseInt(r.substr(1),16);r=u>>16&255,n=u>>8&255,i=255&u;}if(void 0===n||void 0===a&&r===n&&n===i){if("string"==typeof r)e=r+" "+o[0];else switch(t.precision){case 2:e=q(r/255)+" "+o[0];break;case 3:default:e=R(r/255)+" "+o[0];}}else if(void 0===a||"object"==typeof a){if(a&&!isNaN(a.a)&&0===a.a)return e=["1.","1.","1.",o[1]].join(" ");if("string"==typeof r)e=[r,n,i,o[1]].join(" ");else switch(t.precision){case 2:e=[q(r/255),q(n/255),q(i/255),o[1]].join(" ");break;default:case 3:e=[R(r/255),R(n/255),R(i/255),o[1]].join(" ");}}else if("string"==typeof r)e=[r,n,i,a,o[2]].join(" ");else switch(t.precision){case 2:e=[q(r),q(n),q(i),q(a),o[2]].join(" ");break;case 3:default:e=[R(r),R(n),R(i),R(a),o[2]].join(" ");}return e;},ee=b.__private__.getFilters=function(){return u;},re=b.__private__.putStream=function(t){var e=(t=t||{}).data||"",r=t.filters||ee(),n=t.alreadyAppliedFilters||[],i=t.addLength1||!1,a=e.length,o=t.objectId,s=function s(t){return t;};if(null!==g&&void 0===o)throw new Error("ObjectId must be passed to putStream for file encryption");null!==g&&(s=We.encryptor(o,0));var u={};!0===r&&(r=["FlateEncode"]);var c=t.additionalKeyValues||[],l=(u=void 0!==O.API.processDataByFilters?O.API.processDataByFilters(e,r):{data:e,reverseChain:[]}).reverseChain+(Array.isArray(n)?n.join(" "):n.toString());if(0!==u.data.length&&(c.push({key:"Length",value:u.data.length}),!0===i&&c.push({key:"Length1",value:a})),0!=l.length)if(l.split("/").length-1==1)c.push({key:"Filter",value:l});else {c.push({key:"Filter",value:"["+l+"]"});for(var h=0;h<c.length;h+=1){if("DecodeParms"===c[h].key){for(var f=[],d=0;d<u.reverseChain.split("/").length-1;d+=1){f.push("null");}f.push(c[h].value),c[h].value="["+f.join(" ")+"]";}}}ct("<<");for(var p=0;p<c.length;p++){ct("/"+c[p].key+" "+c[p].value);}ct(">>"),0!==u.data.length&&(ct("stream"),ct(s(u.data)),ct("endstream"));},ne=b.__private__.putPage=function(t){var e=t.number,r=t.data,n=t.objId,i=t.contentsObjId;Xt(n,!0),ct("<</Type /Page"),ct("/Parent "+t.rootDictionaryObjId+" 0 R"),ct("/Resources "+t.resourceDictionaryObjId+" 0 R"),ct("/MediaBox ["+parseFloat(B(t.mediaBox.bottomLeftX))+" "+parseFloat(B(t.mediaBox.bottomLeftY))+" "+B(t.mediaBox.topRightX)+" "+B(t.mediaBox.topRightY)+"]"),null!==t.cropBox&&ct("/CropBox ["+B(t.cropBox.bottomLeftX)+" "+B(t.cropBox.bottomLeftY)+" "+B(t.cropBox.topRightX)+" "+B(t.cropBox.topRightY)+"]"),null!==t.bleedBox&&ct("/BleedBox ["+B(t.bleedBox.bottomLeftX)+" "+B(t.bleedBox.bottomLeftY)+" "+B(t.bleedBox.topRightX)+" "+B(t.bleedBox.topRightY)+"]"),null!==t.trimBox&&ct("/TrimBox ["+B(t.trimBox.bottomLeftX)+" "+B(t.trimBox.bottomLeftY)+" "+B(t.trimBox.topRightX)+" "+B(t.trimBox.topRightY)+"]"),null!==t.artBox&&ct("/ArtBox ["+B(t.artBox.bottomLeftX)+" "+B(t.artBox.bottomLeftY)+" "+B(t.artBox.topRightX)+" "+B(t.artBox.topRightY)+"]"),"number"==typeof t.userUnit&&1!==t.userUnit&&ct("/UserUnit "+t.userUnit),Rt.publish("putPage",{objId:n,pageContext:qt[e],pageNumber:e,page:r}),ct("/Contents "+i+" 0 R"),ct(">>"),ct("endobj");var a=r.join("\n");return x===A.ADVANCED&&(a+="\nQ"),Xt(i,!0),re({data:a,filters:ee(),objectId:i}),ct("endobj"),n;},ie=b.__private__.putPages=function(){var t,e,r=[];for(t=1;t<=Et;t++){qt[t].objId=Jt(),qt[t].contentsObjId=Jt();}for(t=1;t<=Et;t++){r.push(ne({number:t,data:it[t],objId:qt[t].objId,contentsObjId:qt[t].contentsObjId,mediaBox:qt[t].mediaBox,cropBox:qt[t].cropBox,bleedBox:qt[t].bleedBox,trimBox:qt[t].trimBox,artBox:qt[t].artBox,userUnit:qt[t].userUnit,rootDictionaryObjId:Zt,resourceDictionaryObjId:$t}));}Xt(Zt,!0),ct("<</Type /Pages");var n="/Kids [";for(e=0;e<Et;e++){n+=r[e]+" 0 R ";}ct(n+"]"),ct("/Count "+Et),ct(">>"),ct("endobj"),Rt.publish("postPutPages");},ae=function ae(t){var e=function e(t,_e2){return -1!==t.indexOf(" ")?"("+Ie(t,_e2)+")":Ie(t,_e2);};Rt.publish("putFont",{font:t,out:ct,newObject:Yt,putStream:re,pdfEscapeWithNeededParanthesis:e}),!0!==t.isAlreadyPutted&&(t.objectNumber=Yt(),ct("<<"),ct("/Type /Font"),ct("/BaseFont /"+e(t.postScriptName)),ct("/Subtype /Type1"),"string"==typeof t.encoding&&ct("/Encoding /"+t.encoding),ct("/FirstChar 32"),ct("/LastChar 255"),ct(">>"),ct("endobj"));},oe=function oe(){for(var t in kt){kt.hasOwnProperty(t)&&(!1===m||!0===m&&v.hasOwnProperty(t))&&ae(kt[t]);}},se=function se(t){t.objectNumber=Yt();var e=[];e.push({key:"Type",value:"/XObject"}),e.push({key:"Subtype",value:"/Form"}),e.push({key:"BBox",value:"["+[B(t.x),B(t.y),B(t.x+t.width),B(t.y+t.height)].join(" ")+"]"}),e.push({key:"Matrix",value:"["+t.matrix.toString()+"]"});var r=t.pages[1].join("\n");re({data:r,additionalKeyValues:e,objectId:t.objectNumber}),ct("endobj");},ue=function ue(){for(var t in Dt){Dt.hasOwnProperty(t)&&se(Dt[t]);}},ce=function ce(t,e){var r,n=[],i=1/(e-1);for(r=0;r<1;r+=i){n.push(r);}if(n.push(1),0!=t[0].offset){var a={offset:0,color:t[0].color};t.unshift(a);}if(1!=t[t.length-1].offset){var o={offset:1,color:t[t.length-1].color};t.push(o);}for(var s="",u=0,c=0;c<n.length;c++){for(r=n[c];r>t[u+1].offset;){u++;}var l=t[u].offset,h=(r-l)/(t[u+1].offset-l),f=t[u].color,d=t[u+1].color;s+=$(Math.round((1-h)*f[0]+h*d[0]).toString(16))+$(Math.round((1-h)*f[1]+h*d[1]).toString(16))+$(Math.round((1-h)*f[2]+h*d[2]).toString(16));}return s.trim();},le=function le(t,e){e||(e=21);var r=Yt(),n=ce(t.colors,e),i=[];i.push({key:"FunctionType",value:"0"}),i.push({key:"Domain",value:"[0.0 1.0]"}),i.push({key:"Size",value:"["+e+"]"}),i.push({key:"BitsPerSample",value:"8"}),i.push({key:"Range",value:"[0.0 1.0 0.0 1.0 0.0 1.0]"}),i.push({key:"Decode",value:"[0.0 1.0 0.0 1.0 0.0 1.0]"}),re({data:n,additionalKeyValues:i,alreadyAppliedFilters:["/ASCIIHexDecode"],objectId:r}),ct("endobj"),t.objectNumber=Yt(),ct("<< /ShadingType "+t.type),ct("/ColorSpace /DeviceRGB");var a="/Coords ["+B(parseFloat(t.coords[0]))+" "+B(parseFloat(t.coords[1]))+" ";2===t.type?a+=B(parseFloat(t.coords[2]))+" "+B(parseFloat(t.coords[3])):a+=B(parseFloat(t.coords[2]))+" "+B(parseFloat(t.coords[3]))+" "+B(parseFloat(t.coords[4]))+" "+B(parseFloat(t.coords[5])),ct(a+="]"),t.matrix&&ct("/Matrix ["+t.matrix.toString()+"]"),ct("/Function "+r+" 0 R"),ct("/Extend [true true]"),ct(">>"),ct("endobj");},he=function he(t,e){var r=Jt(),n=Yt();e.push({resourcesOid:r,objectOid:n}),t.objectNumber=n;var i=[];i.push({key:"Type",value:"/Pattern"}),i.push({key:"PatternType",value:"1"}),i.push({key:"PaintType",value:"1"}),i.push({key:"TilingType",value:"1"}),i.push({key:"BBox",value:"["+t.boundingBox.map(B).join(" ")+"]"}),i.push({key:"XStep",value:B(t.xStep)}),i.push({key:"YStep",value:B(t.yStep)}),i.push({key:"Resources",value:r+" 0 R"}),t.matrix&&i.push({key:"Matrix",value:"["+t.matrix.toString()+"]"}),re({data:t.stream,additionalKeyValues:i,objectId:t.objectNumber}),ct("endobj");},fe=function fe(t){var e;for(e in Ct){Ct.hasOwnProperty(e)&&(Ct[e]instanceof C?le(Ct[e]):Ct[e]instanceof j&&he(Ct[e],t));}},de=function de(t){for(var e in t.objectNumber=Yt(),ct("<<"),t){switch(e){case"opacity":ct("/ca "+q(t[e]));break;case"stroke-opacity":ct("/CA "+q(t[e]));}}ct(">>"),ct("endobj");},pe=function pe(){var t;for(t in Ot){Ot.hasOwnProperty(t)&&de(Ot[t]);}},ge=function ge(){for(var t in ct("/XObject <<"),Dt){Dt.hasOwnProperty(t)&&Dt[t].objectNumber>=0&&ct("/"+t+" "+Dt[t].objectNumber+" 0 R");}Rt.publish("putXobjectDict"),ct(">>");},me=function me(){We.oid=Yt(),ct("<<"),ct("/Filter /Standard"),ct("/V "+We.v),ct("/R "+We.r),ct("/U <"+We.toHexString(We.U)+">"),ct("/O <"+We.toHexString(We.O)+">"),ct("/P "+We.P),ct(">>"),ct("endobj");},ve=function ve(){for(var t in ct("/Font <<"),kt){kt.hasOwnProperty(t)&&(!1===m||!0===m&&v.hasOwnProperty(t))&&ct("/"+t+" "+kt[t].objectNumber+" 0 R");}ct(">>");},be=function be(){if(Object.keys(Ct).length>0){for(var t in ct("/Shading <<"),Ct){Ct.hasOwnProperty(t)&&Ct[t]instanceof C&&Ct[t].objectNumber>=0&&ct("/"+t+" "+Ct[t].objectNumber+" 0 R");}Rt.publish("putShadingPatternDict"),ct(">>");}},ye=function ye(t){if(Object.keys(Ct).length>0){for(var e in ct("/Pattern <<"),Ct){Ct.hasOwnProperty(e)&&Ct[e]instanceof b.TilingPattern&&Ct[e].objectNumber>=0&&Ct[e].objectNumber<t&&ct("/"+e+" "+Ct[e].objectNumber+" 0 R");}Rt.publish("putTilingPatternDict"),ct(">>");}},we=function we(){if(Object.keys(Ot).length>0){var t;for(t in ct("/ExtGState <<"),Ot){Ot.hasOwnProperty(t)&&Ot[t].objectNumber>=0&&ct("/"+t+" "+Ot[t].objectNumber+" 0 R");}Rt.publish("putGStateDict"),ct(">>");}},Ne=function Ne(t){Xt(t.resourcesOid,!0),ct("<<"),ct("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"),ve(),be(),ye(t.objectOid),we(),ge(),ct(">>"),ct("endobj");},Le=function Le(){var t=[];oe(),pe(),ue(),fe(t),Rt.publish("putResources"),t.forEach(Ne),Ne({resourcesOid:$t,objectOid:Number.MAX_SAFE_INTEGER}),Rt.publish("postPutResources");},Ae=function Ae(){Rt.publish("putAdditionalObjects");for(var t=0;t<nt.length;t++){var e=nt[t];Xt(e.objId,!0),ct(e.content),ct("endobj");}Rt.publish("postPutAdditionalObjects");},xe=function xe(t){It[t.fontName]=It[t.fontName]||{},It[t.fontName][t.fontStyle]=t.id;},Se=function Se(t,e,r,n,i){var a={id:"F"+(Object.keys(kt).length+1).toString(10),postScriptName:t,fontName:e,fontStyle:r,encoding:n,isStandardFont:i||!1,metadata:{}};return Rt.publish("addFont",{font:a,instance:this}),kt[a.id]=a,xe(a),a.id;},_e=function _e(t){for(var e=0,r=ft.length;e<r;e++){var n=Se.call(this,t[e][0],t[e][1],t[e][2],ft[e][3],!0);!1===m&&(v[n]=!0);var i=t[e][0].split("-");xe({id:n,fontName:i[0],fontStyle:i[1]||""});}Rt.publish("addFonts",{fonts:kt,dictionary:It});},Pe=function Pe(t){return t.foo=function(){try{return t.apply(this,arguments);}catch(t){var e=t.stack||"";~e.indexOf(" at ")&&(e=e.split(" at ")[1]);var n="Error in function "+e.split("\n")[0].split("<")[0]+": "+t.message;if(!r.console)throw new Error(n);r.console.error(n,t),r.alert&&alert(n);}},t.foo.bar=t,t.foo;},ke=function ke(t,e){var r,n,i,a,o,s,u,c,l;if(i=(e=e||{}).sourceEncoding||"Unicode",o=e.outputEncoding,(e.autoencode||o)&&kt[At].metadata&&kt[At].metadata[i]&&kt[At].metadata[i].encoding&&(a=kt[At].metadata[i].encoding,!o&&kt[At].encoding&&(o=kt[At].encoding),!o&&a.codePages&&(o=a.codePages[0]),"string"==typeof o&&(o=a[o]),o)){for(u=!1,s=[],r=0,n=t.length;r<n;r++){(c=o[t.charCodeAt(r)])?s.push(String.fromCharCode(c)):s.push(t[r]),s[r].charCodeAt(0)>>8&&(u=!0);}t=s.join("");}for(r=t.length;void 0===u&&0!==r;){t.charCodeAt(r-1)>>8&&(u=!0),r--;}if(!u)return t;for(s=e.noBOM?[]:[254,255],r=0,n=t.length;r<n;r++){if((l=(c=t.charCodeAt(r))>>8)>>8)throw new Error("Character at position "+r+" of string '"+t+"' exceeds 16bits. Cannot be encoded into UCS-2 BE");s.push(l),s.push(c-(l<<8));}return String.fromCharCode.apply(void 0,s);},Ie=b.__private__.pdfEscape=b.pdfEscape=function(t,e){return ke(t,e).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");},Fe=b.__private__.beginPage=function(t){it[++Et]=[],qt[Et]={objId:0,contentsObjId:0,userUnit:Number(f),artBox:null,bleedBox:null,cropBox:null,trimBox:null,mediaBox:{bottomLeftX:0,bottomLeftY:0,topRightX:Number(t[0]),topRightY:Number(t[1])}},Oe(Et),ut(it[K]);},Ce=function Ce(t,e){var r,a,s;switch(n=e||n,"string"==typeof t&&(r=L(t.toLowerCase()),Array.isArray(r)&&(a=r[0],s=r[1])),Array.isArray(t)&&(a=t[0]*xt,s=t[1]*xt),isNaN(a)&&(a=o[0],s=o[1]),(a>14400||s>14400)&&(i.warn("A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"),a=Math.min(14400,a),s=Math.min(14400,s)),o=[a,s],n.substr(0,1)){case"l":s>a&&(o=[s,a]);break;case"p":a>s&&(o=[s,a]);}Fe(o),hr(lr),ct(yr),0!==Sr&&ct(Sr+" J"),0!==_r&&ct(_r+" j"),Rt.publish("addPage",{pageNumber:Et});},je=function je(t){t>0&&t<=Et&&(it.splice(t,1),qt.splice(t,1),Et--,K>Et&&(K=Et),this.setPage(K));},Oe=function Oe(t){t>0&&t<=Et&&(K=t);},Be=b.__private__.getNumberOfPages=b.getNumberOfPages=function(){return it.length-1;},Me=function Me(t,e,r){var n,a=void 0;return r=r||{},t=void 0!==t?t:kt[At].fontName,e=void 0!==e?e:kt[At].fontStyle,n=t.toLowerCase(),void 0!==It[n]&&void 0!==It[n][e]?a=It[n][e]:void 0!==It[t]&&void 0!==It[t][e]?a=It[t][e]:!1===r.disableWarning&&i.warn("Unable to look up font label for font '"+t+"', '"+e+"'. Refer to getFontList() for available fonts."),a||r.noFallback||null==(a=It.times[e])&&(a=It.times.normal),a;},Ee=b.__private__.putInfo=function(){var t=Yt(),e=function e(t){return t;};for(var r in null!==g&&(e=We.encryptor(t,0)),ct("<<"),ct("/Producer ("+Ie(e("jsPDF "+O.version))+")"),Lt){Lt.hasOwnProperty(r)&&Lt[r]&&ct("/"+r.substr(0,1).toUpperCase()+r.substr(1)+" ("+Ie(e(Lt[r]))+")");}ct("/CreationDate ("+Ie(e(z))+")"),ct(">>"),ct("endobj");},qe=b.__private__.putCatalog=function(t){var e=(t=t||{}).rootDictionaryObjId||Zt;switch(Yt(),ct("<<"),ct("/Type /Catalog"),ct("/Pages "+e+" 0 R"),pt||(pt="fullwidth"),pt){case"fullwidth":ct("/OpenAction [3 0 R /FitH null]");break;case"fullheight":ct("/OpenAction [3 0 R /FitV null]");break;case"fullpage":ct("/OpenAction [3 0 R /Fit]");break;case"original":ct("/OpenAction [3 0 R /XYZ null null 1]");break;default:var r=""+pt;"%"===r.substr(r.length-1)&&(pt=parseInt(pt)/100),"number"==typeof pt&&ct("/OpenAction [3 0 R /XYZ null null "+q(pt)+"]");}switch(yt||(yt="continuous"),yt){case"continuous":ct("/PageLayout /OneColumn");break;case"single":ct("/PageLayout /SinglePage");break;case"two":case"twoleft":ct("/PageLayout /TwoColumnLeft");break;case"tworight":ct("/PageLayout /TwoColumnRight");}vt&&ct("/PageMode /"+vt),Rt.publish("putCatalog"),ct(">>"),ct("endobj");},Re=b.__private__.putTrailer=function(){ct("trailer"),ct("<<"),ct("/Size "+(Q+1)),ct("/Root "+Q+" 0 R"),ct("/Info "+(Q-1)+" 0 R"),null!==g&&ct("/Encrypt "+We.oid+" 0 R"),ct("/ID [ <"+H+"> <"+H+"> ]"),ct(">>");},Te=b.__private__.putHeader=function(){ct("%PDF-"+y),ct("%ºß¬à");},De=b.__private__.putXRef=function(){var t="0000000000";ct("xref"),ct("0 "+(Q+1)),ct("0000000000 65535 f ");for(var e=1;e<=Q;e++){"function"==typeof tt[e]?ct((t+tt[e]()).slice(-10)+" 00000 n "):void 0!==tt[e]?ct((t+tt[e]).slice(-10)+" 00000 n "):ct("0000000000 00000 n ");}},Ue=b.__private__.buildDocument=function(){st(),ut(et),Rt.publish("buildDocument"),Te(),ie(),Ae(),Le(),null!==g&&me(),Ee(),qe();var t=rt;return De(),Re(),ct("startxref"),ct(""+t),ct("%%EOF"),ut(it[K]),et.join("\n");},ze=b.__private__.getBlob=function(t){return new Blob([ht(t)],{type:"application/pdf"});},He=b.output=b.__private__.output=Pe(function(t,e){switch("string"==typeof(e=e||{})?e={filename:e}:e.filename=e.filename||"generated.pdf",t){case void 0:return Ue();case"save":b.save(e.filename);break;case"arraybuffer":return ht(Ue());case"blob":return ze(Ue());case"bloburi":case"bloburl":if(void 0!==r.URL&&"function"==typeof r.URL.createObjectURL)return r.URL&&r.URL.createObjectURL(ze(Ue()))||void 0;i.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");break;case"datauristring":case"dataurlstring":var n="",a=Ue();try{n=c(a);}catch(t){n=c(unescape(encodeURIComponent(a)));}return "data:application/pdf;filename="+e.filename+";base64,"+n;case"pdfobjectnewwindow":if("[object Window]"===Object.prototype.toString.call(r)){var o='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><script src="'+(e.pdfObjectUrl||"https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js")+'"><\/script><script >PDFObject.embed("'+this.output("dataurlstring")+'", '+JSON.stringify(e)+");<\/script></body></html>",s=r.open();return null!==s&&s.document.write(o),s;}throw new Error("The option pdfobjectnewwindow just works in a browser-environment.");case"pdfjsnewwindow":if("[object Window]"===Object.prototype.toString.call(r)){var u='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe id="pdfViewer" src="'+(e.pdfJsUrl||"examples/PDF.js/web/viewer.html")+"?file=&downloadName="+e.filename+'" width="500px" height="400px" /></body></html>',l=r.open();if(null!==l){l.document.write(u);var h=this;l.document.documentElement.querySelector("#pdfViewer").onload=function(){l.document.title=e.filename,l.document.documentElement.querySelector("#pdfViewer").contentWindow.PDFViewerApplication.open(h.output("bloburl"));};}return l;}throw new Error("The option pdfjsnewwindow just works in a browser-environment.");case"dataurlnewwindow":if("[object Window]"!==Object.prototype.toString.call(r))throw new Error("The option dataurlnewwindow just works in a browser-environment.");var f='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe src="'+this.output("datauristring",e)+'"></iframe></body></html>',d=r.open();if(null!==d&&(d.document.write(f),d.document.title=e.filename),d||"undefined"==typeof safari)return d;break;case"datauri":case"dataurl":return r.document.location.href=this.output("datauristring",e);default:return null;}}),Ve=function Ve(t){return !0===Array.isArray(Tt)&&Tt.indexOf(t)>-1;};switch(a){case"pt":xt=1;break;case"mm":xt=72/25.4;break;case"cm":xt=72/2.54;break;case"in":xt=72;break;case"px":xt=1==Ve("px_scaling")?.75:96/72;break;case"pc":case"em":xt=12;break;case"ex":xt=6;break;default:throw new Error("Invalid unit: "+a);}var We=null;J(),W();var Ge=function Ge(t){return null!==g?We.encryptor(t,0):function(t){return t;};},Ye=b.__private__.getPageInfo=b.getPageInfo=function(t){if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfo");return {objId:qt[t].objId,pageNumber:t,pageContext:qt[t]};},Je=b.__private__.getPageInfoByObjId=function(t){if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");for(var e in qt){if(qt[e].objId===t)break;}return Ye(e);},Xe=b.__private__.getCurrentPageInfo=b.getCurrentPageInfo=function(){return {objId:qt[K].objId,pageNumber:K,pageContext:qt[K]};};b.addPage=function(){return Ce.apply(this,arguments),this;},b.setPage=function(){return Oe.apply(this,arguments),ut.call(this,it[K]),this;},b.insertPage=function(t){return this.addPage(),this.movePage(K,t),this;},b.movePage=function(t,e){var r,n;if(t>e){r=it[t],n=qt[t];for(var i=t;i>e;i--){it[i]=it[i-1],qt[i]=qt[i-1];}it[e]=r,qt[e]=n,this.setPage(e);}else if(t<e){r=it[t],n=qt[t];for(var a=t;a<e;a++){it[a]=it[a+1],qt[a]=qt[a+1];}it[e]=r,qt[e]=n,this.setPage(e);}return this;},b.deletePage=function(){return je.apply(this,arguments),this;},b.__private__.text=b.text=function(t,e,r,n,i){var a,o,s,u,c,l,h,f,d=(n=n||{}).scope||this;if("number"==typeof t&&"number"==typeof e&&("string"==typeof r||Array.isArray(r))){var p=r;r=e,e=t,t=p;}if(arguments[3]instanceof Ht==!1?(s=arguments[4],u=arguments[5],"object"==typeof(h=arguments[3])&&null!==h||("string"==typeof s&&(u=s,s=null),"string"==typeof h&&(u=h,h=null),"number"==typeof h&&(s=h,h=null),n={flags:h,angle:s,align:u})):(M("The transform parameter of text() with a Matrix value"),f=i),isNaN(e)||isNaN(r)||null==t)throw new Error("Invalid arguments passed to jsPDF.text");if(0===t.length)return d;var g="",m=!1,b="number"==typeof n.lineHeightFactor?n.lineHeightFactor:cr,y=d.internal.scaleFactor;function w(t){return t=t.split("\t").join(Array(n.TabLen||9).join(" ")),Ie(t,h);}function N(t){for(var e,r=t.concat(),n=[],i=r.length;i--;){"string"==typeof(e=r.shift())?n.push(e):Array.isArray(t)&&(1===e.length||void 0===e[1]&&void 0===e[2])?n.push(e[0]):n.push([e[0],e[1],e[2]]);}return n;}function L(t,e){var r;if("string"==typeof t)r=e(t)[0];else if(Array.isArray(t)){for(var n,i,a=t.concat(),o=[],s=a.length;s--;){"string"==typeof(n=a.shift())?o.push(e(n)[0]):Array.isArray(n)&&"string"==typeof n[0]&&(i=e(n[0],n[1],n[2]),o.push([i[0],i[1],i[2]]));}r=o;}return r;}var S=!1,_=!0;if("string"==typeof t)S=!0;else if(Array.isArray(t)){var P=t.concat();o=[];for(var k,I=P.length;I--;){("string"!=typeof(k=P.shift())||Array.isArray(k)&&"string"!=typeof k[0])&&(_=!1);}S=_;}if(!1===S)throw new Error('Type of text must be string or Array. "'+t+'" is not recognized.');"string"==typeof t&&(t=t.match(/[\r?\n]/)?t.split(/\r\n|\r|\n/g):[t]);var F=dt/d.internal.scaleFactor,C=F*(cr-1);switch(n.baseline){case"bottom":r-=C;break;case"top":r+=F-C;break;case"hanging":r+=F-2*C;break;case"middle":r+=F/2-C;}if((l=n.maxWidth||0)>0&&("string"==typeof t?t=d.splitTextToSize(t,l):"[object Array]"===Object.prototype.toString.call(t)&&(t=t.reduce(function(t,e){return t.concat(d.splitTextToSize(e,l));},[]))),a={text:t,x:e,y:r,options:n,mutex:{pdfEscape:Ie,activeFontKey:At,fonts:kt,activeFontSize:dt}},Rt.publish("preProcessText",a),t=a.text,s=(n=a.options).angle,f instanceof Ht==!1&&s&&"number"==typeof s){s*=Math.PI/180,0===n.rotationDirection&&(s=-s),x===A.ADVANCED&&(s=-s);var j=Math.cos(s),O=Math.sin(s);f=new Ht(j,O,-O,j,0,0);}else s&&s instanceof Ht&&(f=s);x!==A.ADVANCED||f||(f=Wt),void 0!==(c=n.charSpace||Ar)&&(g+=B(T(c))+" Tc\n",this.setCharSpace(this.getCharSpace()||0));n.lang;var E=-1,q=void 0!==n.renderingMode?n.renderingMode:n.stroke,R=d.internal.getCurrentPageInfo().pageContext;switch(q){case 0:case!1:case"fill":E=0;break;case 1:case!0:case"stroke":E=1;break;case 2:case"fillThenStroke":E=2;break;case 3:case"invisible":E=3;break;case 4:case"fillAndAddForClipping":E=4;break;case 5:case"strokeAndAddPathForClipping":E=5;break;case 6:case"fillThenStrokeAndAddToPathForClipping":E=6;break;case 7:case"addToPathForClipping":E=7;}var D=void 0!==R.usedRenderingMode?R.usedRenderingMode:-1;-1!==E?g+=E+" Tr\n":-1!==D&&(g+="0 Tr\n"),-1!==E&&(R.usedRenderingMode=E),u=n.align||"left";var U,z=dt*b,H=d.internal.pageSize.getWidth(),V=kt[At];c=n.charSpace||Ar,l=n.maxWidth||0,h=Object.assign({autoencode:!0,noBOM:!0},n.flags);var W=[];if("[object Array]"===Object.prototype.toString.call(t)){var G;o=N(t),"left"!==u&&(U=o.map(function(t){return d.getStringUnitWidth(t,{font:V,charSpace:c,fontSize:dt,doKerning:!1})*dt/y;}));var Y,J=0;if("right"===u){e-=U[0],t=[],I=o.length;for(var X=0;X<I;X++){0===X?(Y=gr(e),G=mr(r)):(Y=T(J-U[X]),G=-z),t.push([o[X],Y,G]),J=U[X];}}else if("center"===u){e-=U[0]/2,t=[],I=o.length;for(var K=0;K<I;K++){0===K?(Y=gr(e),G=mr(r)):(Y=T((J-U[K])/2),G=-z),t.push([o[K],Y,G]),J=U[K];}}else if("left"===u){t=[],I=o.length;for(var Z=0;Z<I;Z++){t.push(o[Z]);}}else {if("justify"!==u)throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');t=[],I=o.length,l=0!==l?l:H;for(var $=0;$<I;$++){G=0===$?mr(r):-z,Y=0===$?gr(e):0,$<I-1&&W.push(B(T((l-U[$])/(o[$].split(" ").length-1)))),t.push([o[$],Y,G]);}}}var Q="boolean"==typeof n.R2L?n.R2L:mt;!0===Q&&(t=L(t,function(t,e,r){return [t.split("").reverse().join(""),e,r];})),a={text:t,x:e,y:r,options:n,mutex:{pdfEscape:Ie,activeFontKey:At,fonts:kt,activeFontSize:dt}},Rt.publish("postProcessText",a),t=a.text,m=a.mutex.isHex||!1;var tt=kt[At].encoding;"WinAnsiEncoding"!==tt&&"StandardEncoding"!==tt||(t=L(t,function(t,e,r){return [w(t),e,r];})),o=N(t),t=[];for(var et,rt,nt,it=0,at=1,ot=Array.isArray(o[0])?at:it,st="",ut=function ut(t,e,r){var i="";return r instanceof Ht?(r="number"==typeof n.angle?Vt(r,new Ht(1,0,0,1,t,e)):Vt(new Ht(1,0,0,1,t,e),r),x===A.ADVANCED&&(r=Vt(new Ht(1,0,0,-1,0,0),r)),i=r.join(" ")+" Tm\n"):i=B(t)+" "+B(e)+" Td\n",i;},lt=0;lt<o.length;lt++){switch(st="",ot){case at:nt=(m?"<":"(")+o[lt][0]+(m?">":")"),et=parseFloat(o[lt][1]),rt=parseFloat(o[lt][2]);break;case it:nt=(m?"<":"(")+o[lt]+(m?">":")"),et=gr(e),rt=mr(r);}void 0!==W&&void 0!==W[lt]&&(st=W[lt]+" Tw\n"),0===lt?t.push(st+ut(et,rt,f)+nt):ot===it?t.push(st+nt):ot===at&&t.push(st+ut(et,rt,f)+nt);}t=ot===it?t.join(" Tj\nT* "):t.join(" Tj\n"),t+=" Tj\n";var ht="BT\n/";return ht+=At+" "+dt+" Tf\n",ht+=B(dt*b)+" TL\n",ht+=Nr+"\n",ht+=g,ht+=t,ct(ht+="ET"),v[At]=!0,d;};var Ke=b.__private__.clip=b.clip=function(t){return ct("evenodd"===t?"W*":"W"),this;};b.clipEvenOdd=function(){return Ke("evenodd");},b.__private__.discardPath=b.discardPath=function(){return ct("n"),this;};var Ze=b.__private__.isValidStyle=function(t){var e=!1;return -1!==[void 0,null,"S","D","F","DF","FD","f","f*","B","B*","n"].indexOf(t)&&(e=!0),e;};b.__private__.setDefaultPathOperation=b.setDefaultPathOperation=function(t){return Ze(t)&&(p=t),this;};var $e=b.__private__.getStyle=b.getStyle=function(t){var e=p;switch(t){case"D":case"S":e="S";break;case"F":e="f";break;case"FD":case"DF":e="B";break;case"f":case"f*":case"B":case"B*":e=t;}return e;},Qe=b.close=function(){return ct("h"),this;};b.stroke=function(){return ct("S"),this;},b.fill=function(t){return tr("f",t),this;},b.fillEvenOdd=function(t){return tr("f*",t),this;},b.fillStroke=function(t){return tr("B",t),this;},b.fillStrokeEvenOdd=function(t){return tr("B*",t),this;};var tr=function tr(t,e){"object"==typeof e?nr(e,t):ct(t);},er=function er(t){null===t||x===A.ADVANCED&&void 0===t||(t=$e(t),ct(t));};function rr(t,e,r,n,i){var a=new j(e||this.boundingBox,r||this.xStep,n||this.yStep,this.gState,i||this.matrix);a.stream=this.stream;var o=t+"$$"+this.cloneIndex++ +"$$";return Gt(o,a),a;}var nr=function nr(t,e){var r=jt[t.key],n=Ct[r];if(n instanceof C)ct("q"),ct(ir(e)),n.gState&&b.setGState(n.gState),ct(t.matrix.toString()+" cm"),ct("/"+r+" sh"),ct("Q");else if(n instanceof j){var i=new Ht(1,0,0,-1,0,Er());t.matrix&&(i=i.multiply(t.matrix||Wt),r=rr.call(n,t.key,t.boundingBox,t.xStep,t.yStep,i).id),ct("q"),ct("/Pattern cs"),ct("/"+r+" scn"),n.gState&&b.setGState(n.gState),ct(e),ct("Q");}},ir=function ir(t){switch(t){case"f":case"F":return "W n";case"f*":return "W* n";case"B":return "W S";case"B*":return "W* S";case"S":return "W S";case"n":return "W n";}},ar=b.moveTo=function(t,e){return ct(B(T(t))+" "+B(U(e))+" m"),this;},or=b.lineTo=function(t,e){return ct(B(T(t))+" "+B(U(e))+" l"),this;},sr=b.curveTo=function(t,e,r,n,i,a){return ct([B(T(t)),B(U(e)),B(T(r)),B(U(n)),B(T(i)),B(U(a)),"c"].join(" ")),this;};b.__private__.line=b.line=function(t,e,r,n,i){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||!Ze(i))throw new Error("Invalid arguments passed to jsPDF.line");return x===A.COMPAT?this.lines([[r-t,n-e]],t,e,[1,1],i||"S"):this.lines([[r-t,n-e]],t,e,[1,1]).stroke();},b.__private__.lines=b.lines=function(t,e,r,n,i,a){var o,s,u,c,l,h,f,d,p,g,m,v;if("number"==typeof t&&(v=r,r=e,e=t,t=v),n=n||[1,1],a=a||!1,isNaN(e)||isNaN(r)||!Array.isArray(t)||!Array.isArray(n)||!Ze(i)||"boolean"!=typeof a)throw new Error("Invalid arguments passed to jsPDF.lines");for(ar(e,r),o=n[0],s=n[1],c=t.length,g=e,m=r,u=0;u<c;u++){2===(l=t[u]).length?(g=l[0]*o+g,m=l[1]*s+m,or(g,m)):(h=l[0]*o+g,f=l[1]*s+m,d=l[2]*o+g,p=l[3]*s+m,g=l[4]*o+g,m=l[5]*s+m,sr(h,f,d,p,g,m));}return a&&Qe(),er(i),this;},b.path=function(t){for(var e=0;e<t.length;e++){var r=t[e],n=r.c;switch(r.op){case"m":ar(n[0],n[1]);break;case"l":or(n[0],n[1]);break;case"c":sr.apply(this,n);break;case"h":Qe();}}return this;},b.__private__.rect=b.rect=function(t,e,r,n,i){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||!Ze(i))throw new Error("Invalid arguments passed to jsPDF.rect");return x===A.COMPAT&&(n=-n),ct([B(T(t)),B(U(e)),B(T(r)),B(T(n)),"re"].join(" ")),er(i),this;},b.__private__.triangle=b.triangle=function(t,e,r,n,i,a,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||isNaN(a)||!Ze(o))throw new Error("Invalid arguments passed to jsPDF.triangle");return this.lines([[r-t,n-e],[i-r,a-n],[t-i,e-a]],t,e,[1,1],o,!0),this;},b.__private__.roundedRect=b.roundedRect=function(t,e,r,n,i,a,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||isNaN(a)||!Ze(o))throw new Error("Invalid arguments passed to jsPDF.roundedRect");var s=4/3*(Math.SQRT2-1);return i=Math.min(i,.5*r),a=Math.min(a,.5*n),this.lines([[r-2*i,0],[i*s,0,i,a-a*s,i,a],[0,n-2*a],[0,a*s,-i*s,a,-i,a],[2*i-r,0],[-i*s,0,-i,-a*s,-i,-a],[0,2*a-n],[0,-a*s,i*s,-a,i,-a]],t+i,e,[1,1],o,!0),this;},b.__private__.ellipse=b.ellipse=function(t,e,r,n,i){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||!Ze(i))throw new Error("Invalid arguments passed to jsPDF.ellipse");var a=4/3*(Math.SQRT2-1)*r,o=4/3*(Math.SQRT2-1)*n;return ar(t+r,e),sr(t+r,e-o,t+a,e-n,t,e-n),sr(t-a,e-n,t-r,e-o,t-r,e),sr(t-r,e+o,t-a,e+n,t,e+n),sr(t+a,e+n,t+r,e+o,t+r,e),er(i),this;},b.__private__.circle=b.circle=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||!Ze(n))throw new Error("Invalid arguments passed to jsPDF.circle");return this.ellipse(t,e,r,r,n);},b.setFont=function(t,e,r){return r&&(e=F(e,r)),At=Me(t,e,{disableWarning:!1}),this;};var ur=b.__private__.getFont=b.getFont=function(){return kt[Me.apply(b,arguments)];};b.__private__.getFontList=b.getFontList=function(){var t,e,r={};for(t in It){if(It.hasOwnProperty(t))for(e in r[t]=[],It[t]){It[t].hasOwnProperty(e)&&r[t].push(e);}}return r;},b.addFont=function(t,e,r,n,i){var a=["StandardEncoding","MacRomanEncoding","Identity-H","WinAnsiEncoding"];return arguments[3]&&-1!==a.indexOf(arguments[3])?i=arguments[3]:arguments[3]&&-1==a.indexOf(arguments[3])&&(r=F(r,n)),i=i||"Identity-H",Se.call(this,t,e,r,i);};var cr,lr=t.lineWidth||.200025,hr=b.__private__.setLineWidth=b.setLineWidth=function(t){return ct(B(T(t))+" w"),this;};b.__private__.setLineDash=O.API.setLineDash=O.API.setLineDashPattern=function(t,e){if(t=t||[],e=e||0,isNaN(e)||!Array.isArray(t))throw new Error("Invalid arguments passed to jsPDF.setLineDash");return t=t.map(function(t){return B(T(t));}).join(" "),e=B(T(e)),ct("["+t+"] "+e+" d"),this;};var fr=b.__private__.getLineHeight=b.getLineHeight=function(){return dt*cr;};b.__private__.getLineHeight=b.getLineHeight=function(){return dt*cr;};var dr=b.__private__.setLineHeightFactor=b.setLineHeightFactor=function(t){return "number"==typeof(t=t||1.15)&&(cr=t),this;},pr=b.__private__.getLineHeightFactor=b.getLineHeightFactor=function(){return cr;};dr(t.lineHeight);var gr=b.__private__.getHorizontalCoordinate=function(t){return T(t);},mr=b.__private__.getVerticalCoordinate=function(t){return x===A.ADVANCED?t:qt[K].mediaBox.topRightY-qt[K].mediaBox.bottomLeftY-T(t);},vr=b.__private__.getHorizontalCoordinateString=b.getHorizontalCoordinateString=function(t){return B(gr(t));},br=b.__private__.getVerticalCoordinateString=b.getVerticalCoordinateString=function(t){return B(mr(t));},yr=t.strokeColor||"0 G";b.__private__.getStrokeColor=b.getDrawColor=function(){return Qt(yr);},b.__private__.setStrokeColor=b.setDrawColor=function(t,e,r,n){return yr=te({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"draw",precision:2}),ct(yr),this;};var wr=t.fillColor||"0 g";b.__private__.getFillColor=b.getFillColor=function(){return Qt(wr);},b.__private__.setFillColor=b.setFillColor=function(t,e,r,n){return wr=te({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"fill",precision:2}),ct(wr),this;};var Nr=t.textColor||"0 g",Lr=b.__private__.getTextColor=b.getTextColor=function(){return Qt(Nr);};b.__private__.setTextColor=b.setTextColor=function(t,e,r,n){return Nr=te({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"text",precision:3}),this;};var Ar=t.charSpace,xr=b.__private__.getCharSpace=b.getCharSpace=function(){return parseFloat(Ar||0);};b.__private__.setCharSpace=b.setCharSpace=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.setCharSpace");return Ar=t,this;};var Sr=0;b.CapJoinStyles={0:0,butt:0,but:0,miter:0,1:1,round:1,rounded:1,circle:1,2:2,projecting:2,project:2,square:2,bevel:2},b.__private__.setLineCap=b.setLineCap=function(t){var e=b.CapJoinStyles[t];if(void 0===e)throw new Error("Line cap style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return Sr=e,ct(e+" J"),this;};var _r=0;b.__private__.setLineJoin=b.setLineJoin=function(t){var e=b.CapJoinStyles[t];if(void 0===e)throw new Error("Line join style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return _r=e,ct(e+" j"),this;},b.__private__.setLineMiterLimit=b.__private__.setMiterLimit=b.setLineMiterLimit=b.setMiterLimit=function(t){if(t=t||0,isNaN(t))throw new Error("Invalid argument passed to jsPDF.setLineMiterLimit");return ct(B(T(t))+" M"),this;},b.GState=I,b.setGState=function(t){(t="string"==typeof t?Ot[Bt[t]]:Pr(null,t)).equals(Mt)||(ct("/"+t.id+" gs"),Mt=t);};var Pr=function Pr(t,e){if(!t||!Bt[t]){var r=!1;for(var n in Ot){if(Ot.hasOwnProperty(n)&&Ot[n].equals(e)){r=!0;break;}}if(r)e=Ot[n];else {var i="GS"+(Object.keys(Ot).length+1).toString(10);Ot[i]=e,e.id=i;}return t&&(Bt[t]=e.id),Rt.publish("addGState",e),e;}};b.addGState=function(t,e){return Pr(t,e),this;},b.saveGraphicsState=function(){return ct("q"),Ft.push({key:At,size:dt,color:Nr}),this;},b.restoreGraphicsState=function(){ct("Q");var t=Ft.pop();return At=t.key,dt=t.size,Nr=t.color,Mt=null,this;},b.setCurrentTransformationMatrix=function(t){return ct(t.toString()+" cm"),this;},b.comment=function(t){return ct("#"+t),this;};var kr=function kr(t,e){var r=t||0;Object.defineProperty(this,"x",{enumerable:!0,get:function get(){return r;},set:function set(t){isNaN(t)||(r=parseFloat(t));}});var n=e||0;Object.defineProperty(this,"y",{enumerable:!0,get:function get(){return n;},set:function set(t){isNaN(t)||(n=parseFloat(t));}});var i="pt";return Object.defineProperty(this,"type",{enumerable:!0,get:function get(){return i;},set:function set(t){i=t.toString();}}),this;},Ir=function Ir(t,e,r,n){kr.call(this,t,e),this.type="rect";var i=r||0;Object.defineProperty(this,"w",{enumerable:!0,get:function get(){return i;},set:function set(t){isNaN(t)||(i=parseFloat(t));}});var a=n||0;return Object.defineProperty(this,"h",{enumerable:!0,get:function get(){return a;},set:function set(t){isNaN(t)||(a=parseFloat(t));}}),this;},Fr=function Fr(){this.page=Et,this.currentPage=K,this.pages=it.slice(0),this.pagesContext=qt.slice(0),this.x=St,this.y=_t,this.matrix=Pt,this.width=Br(K),this.height=Er(K),this.outputDestination=ot,this.id="",this.objectNumber=-1;};Fr.prototype.restore=function(){Et=this.page,K=this.currentPage,qt=this.pagesContext,it=this.pages,St=this.x,_t=this.y,Pt=this.matrix,Mr(K,this.width),qr(K,this.height),ot=this.outputDestination;};var Cr=function Cr(t,e,r,n,i){zt.push(new Fr()),Et=K=0,it=[],St=t,_t=e,Pt=i,Fe([r,n]);},jr=function jr(t){if(!Ut[t]){var e=new Fr(),r="Xo"+(Object.keys(Dt).length+1).toString(10);e.id=r,Ut[t]=r,Dt[r]=e,Rt.publish("addFormObject",e),zt.pop().restore();}};for(var Or in b.beginFormObject=function(t,e,r,n,i){return Cr(t,e,r,n,i),this;},b.endFormObject=function(t){return jr(t),this;},b.doFormObject=function(t,e){var r=Dt[Ut[t]];return ct("q"),ct(e.toString()+" cm"),ct("/"+r.id+" Do"),ct("Q"),this;},b.getFormObject=function(t){var e=Dt[Ut[t]];return {x:e.x,y:e.y,width:e.width,height:e.height,matrix:e.matrix};},b.save=function(t,e){return t=t||"generated.pdf",(e=e||{}).returnPromise=e.returnPromise||!1,!1===e.returnPromise?(l(ze(Ue()),t),"function"==typeof l.unload&&r.setTimeout&&setTimeout(l.unload,911),this):new Promise(function(e,n){try{var i=l(ze(Ue()),t);"function"==typeof l.unload&&r.setTimeout&&setTimeout(l.unload,911),e(i);}catch(t){n(t.message);}});},O.API){O.API.hasOwnProperty(Or)&&("events"===Or&&O.API.events.length?function(t,e){var r,n,i;for(i=e.length-1;-1!==i;i--){r=e[i][0],n=e[i][1],t.subscribe.apply(t,[r].concat("function"==typeof n?[n]:n));}}(Rt,O.API.events):b[Or]=O.API[Or]);}var Br=b.getPageWidth=function(t){return (qt[t=t||K].mediaBox.topRightX-qt[t].mediaBox.bottomLeftX)/xt;},Mr=b.setPageWidth=function(t,e){qt[t].mediaBox.topRightX=e*xt+qt[t].mediaBox.bottomLeftX;},Er=b.getPageHeight=function(t){return (qt[t=t||K].mediaBox.topRightY-qt[t].mediaBox.bottomLeftY)/xt;},qr=b.setPageHeight=function(t,e){qt[t].mediaBox.topRightY=e*xt+qt[t].mediaBox.bottomLeftY;};return b.internal={pdfEscape:Ie,getStyle:$e,getFont:ur,getFontSize:gt,getCharSpace:xr,getTextColor:Lr,getLineHeight:fr,getLineHeightFactor:pr,write:lt,getHorizontalCoordinate:gr,getVerticalCoordinate:mr,getCoordinateString:vr,getVerticalCoordinateString:br,collections:{},newObject:Yt,newAdditionalObject:Kt,newObjectDeferred:Jt,newObjectDeferredBegin:Xt,getFilters:ee,putStream:re,events:Rt,scaleFactor:xt,pageSize:{getWidth:function getWidth(){return Br(K);},setWidth:function setWidth(t){Mr(K,t);},getHeight:function getHeight(){return Er(K);},setHeight:function setHeight(t){qr(K,t);}},encryptionOptions:g,encryption:We,getEncryptor:Ge,output:He,getNumberOfPages:Be,pages:it,out:ct,f2:q,f3:R,getPageInfo:Ye,getPageInfoByObjId:Je,getCurrentPageInfo:Xe,getPDFVersion:w,Point:kr,Rectangle:Ir,Matrix:Ht,hasHotfix:Ve},Object.defineProperty(b.internal.pageSize,"width",{get:function get(){return Br(K);},set:function set(t){Mr(K,t);},enumerable:!0,configurable:!0}),Object.defineProperty(b.internal.pageSize,"height",{get:function get(){return Er(K);},set:function set(t){qr(K,t);},enumerable:!0,configurable:!0}),_e.call(b,ft),At="F1",Ce(o,n),Rt.publish("initialized"),b;}P.prototype.lsbFirstWord=function(t){return String.fromCharCode(t>>0&255,t>>8&255,t>>16&255,t>>24&255);},P.prototype.toHexString=function(t){return t.split("").map(function(t){return ("0"+(255&t.charCodeAt(0)).toString(16)).slice(-2);}).join("");},P.prototype.hexToBytes=function(t){for(var e=[],r=0;r<t.length;r+=2){e.push(String.fromCharCode(parseInt(t.substr(r,2),16)));}return e.join("");},P.prototype.processOwnerPassword=function(t,e){return S(A(e).substr(0,5),t);},P.prototype.encryptor=function(t,e){var r=A(this.encryptionKey+String.fromCharCode(255&t,t>>8&255,t>>16&255,255&e,e>>8&255)).substr(0,10);return function(t){return S(r,t);};},I.prototype.equals=function(t){var e,r="id,objectNumber,equals";if(!t||typeof t!=typeof this)return !1;var n=0;for(e in this){if(!(r.indexOf(e)>=0)){if(this.hasOwnProperty(e)&&!t.hasOwnProperty(e))return !1;if(this[e]!==t[e])return !1;n++;}}for(e in t){t.hasOwnProperty(e)&&r.indexOf(e)<0&&n--;}return 0===n;},O.API={events:[]},O.version="2.3.1";var B=O.API,M=1,E=function E(t){return t.replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");},q=function q(t){return t.replace(/\\\\/g,"\\").replace(/\\\(/g,"(").replace(/\\\)/g,")");},R=function R(t){return t.toFixed(2);},T=function T(t){return t.toFixed(5);};B.__acroform__={};var D=function D(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t;},U=function U(t){return t*M;},z=function z(t){var e=new ot(),r=wt.internal.getHeight(t)||0,n=wt.internal.getWidth(t)||0;return e.BBox=[0,0,Number(R(n)),Number(R(r))],e;},H=B.__acroform__.setBit=function(t,e){if(t=t||0,e=e||0,isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit");return t|=1<<e;},V=B.__acroform__.clearBit=function(t,e){if(t=t||0,e=e||0,isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit");return t&=~(1<<e);},W=B.__acroform__.getBit=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit");return 0==(t&1<<e)?0:1;},G=B.__acroform__.getBitForPdf=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf");return W(t,e-1);},Y=B.__acroform__.setBitForPdf=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf");return H(t,e-1);},J=B.__acroform__.clearBitForPdf=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf");return V(t,e-1);},X=B.__acroform__.calculateCoordinates=function(t,e){var r=e.internal.getHorizontalCoordinate,n=e.internal.getVerticalCoordinate,i=t[0],a=t[1],o=t[2],s=t[3],u={};return u.lowerLeft_X=r(i)||0,u.lowerLeft_Y=n(a+s)||0,u.upperRight_X=r(i+o)||0,u.upperRight_Y=n(a)||0,[Number(R(u.lowerLeft_X)),Number(R(u.lowerLeft_Y)),Number(R(u.upperRight_X)),Number(R(u.upperRight_Y))];},K=function K(t){if(t.appearanceStreamContent)return t.appearanceStreamContent;if(t.V||t.DV){var e=[],r=t._V||t.DV,n=Z(t,r),i=t.scope.internal.getFont(t.fontName,t.fontStyle).id;e.push("/Tx BMC"),e.push("q"),e.push("BT"),e.push(t.scope.__private__.encodeColorString(t.color)),e.push("/"+i+" "+R(n.fontSize)+" Tf"),e.push("1 0 0 1 0 0 Tm"),e.push(n.text),e.push("ET"),e.push("Q"),e.push("EMC");var a=z(t);return a.scope=t.scope,a.stream=e.join("\n"),a;}},Z=function Z(t,e){var r=0===t.fontSize?t.maxFontSize:t.fontSize,n={text:"",fontSize:""},i=(e=")"==(e="("==e.substr(0,1)?e.substr(1):e).substr(e.length-1)?e.substr(0,e.length-1):e).split(" "),a=r,o=wt.internal.getHeight(t)||0;o=o<0?-o:o;var s=wt.internal.getWidth(t)||0;s=s<0?-s:s;var u=function u(e,r,n){if(e+1<i.length){var a=r+" "+i[e+1];return $(a,t,n).width<=s-4;}return !1;};a++;t:for(;a>0;){e="",a--;var c,l,h=$("3",t,a).height,f=t.multiline?o-a:(o-h)/2,d=f+=2,p=0,g=0;if(a<=0){e="(...) Tj\n",e+="% Width of Text: "+$(e,t,a=12).width+", FieldWidth:"+s+"\n";break;}var m="",v=0;for(var b in i){if(i.hasOwnProperty(b)){m=" "==(m+=i[b]+" ").substr(m.length-1)?m.substr(0,m.length-1):m;var y=parseInt(b),w=u(y,m,a),N=b>=i.length-1;if(w&&!N){m+=" ";continue;}if(w||N){if(N)g=y;else if(t.multiline&&(h+2)*(v+2)+2>o)continue t;}else {if(!t.multiline)continue t;if((h+2)*(v+2)+2>o)continue t;g=y;}for(var L="",A=p;A<=g;A++){L+=i[A]+" ";}switch(L=" "==L.substr(L.length-1)?L.substr(0,L.length-1):L,l=$(L,t,a).width,t.textAlign){case"right":c=s-l-2;break;case"center":c=(s-l)/2;break;case"left":default:c=2;}e+=R(c)+" "+R(d)+" Td\n",e+="("+E(L)+") Tj\n",e+=-R(c)+" 0 Td\n",d=-(a+2),l=0,p=g+1,v++,m="";}}break;}return n.text=e,n.fontSize=a,n;},$=function $(t,e,r){var n=e.scope.internal.getFont(e.fontName,e.fontStyle),i=e.scope.getStringUnitWidth(t,{font:n,fontSize:parseFloat(r),charSpace:0})*parseFloat(r);return {height:e.scope.getStringUnitWidth("3",{font:n,fontSize:parseFloat(r),charSpace:0})*parseFloat(r)*1.5,width:i};},Q={fields:[],xForms:[],acroFormDictionaryRoot:null,printedOut:!1,internal:null,isInitialized:!1},tt=function tt(t,e){var r={type:"reference",object:t};void 0===e.internal.getPageInfo(t.page).pageContext.annotations.find(function(t){return t.type===r.type&&t.object===r.object;})&&e.internal.getPageInfo(t.page).pageContext.annotations.push(r);},et=function et(t,e){for(var r in t){if(t.hasOwnProperty(r)){var n=r,i=t[r];e.internal.newObjectDeferredBegin(i.objId,!0),"object"==typeof i&&"function"==typeof i.putStream&&i.putStream(),delete t[n];}}},rt=function rt(t,e){if(e.scope=t,void 0!==t.internal&&(void 0===t.internal.acroformPlugin||!1===t.internal.acroformPlugin.isInitialized)){if(ut.FieldNum=0,t.internal.acroformPlugin=JSON.parse(JSON.stringify(Q)),t.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("Exception while creating AcroformDictionary");M=t.internal.scaleFactor,t.internal.acroformPlugin.acroFormDictionaryRoot=new st(),t.internal.acroformPlugin.acroFormDictionaryRoot.scope=t,t.internal.acroformPlugin.acroFormDictionaryRoot._eventID=t.internal.events.subscribe("postPutResources",function(){!function(t){t.internal.events.unsubscribe(t.internal.acroformPlugin.acroFormDictionaryRoot._eventID),delete t.internal.acroformPlugin.acroFormDictionaryRoot._eventID,t.internal.acroformPlugin.printedOut=!0;}(t);}),t.internal.events.subscribe("buildDocument",function(){!function(t){t.internal.acroformPlugin.acroFormDictionaryRoot.objId=void 0;var e=t.internal.acroformPlugin.acroFormDictionaryRoot.Fields;for(var r in e){if(e.hasOwnProperty(r)){var n=e[r];n.objId=void 0,n.hasAnnotation&&tt(n,t);}}}(t);}),t.internal.events.subscribe("putCatalog",function(){!function(t){if(void 0===t.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("putCatalogCallback: Root missing.");t.internal.write("/AcroForm "+t.internal.acroformPlugin.acroFormDictionaryRoot.objId+" 0 R");}(t);}),t.internal.events.subscribe("postPutPages",function(e){!function(t,e){var r=!t;for(var n in t||(e.internal.newObjectDeferredBegin(e.internal.acroformPlugin.acroFormDictionaryRoot.objId,!0),e.internal.acroformPlugin.acroFormDictionaryRoot.putStream()),t=t||e.internal.acroformPlugin.acroFormDictionaryRoot.Kids){if(t.hasOwnProperty(n)){var i=t[n],a=[],o=i.Rect;if(i.Rect&&(i.Rect=X(i.Rect,e)),e.internal.newObjectDeferredBegin(i.objId,!0),i.DA=wt.createDefaultAppearanceStream(i),"object"==typeof i&&"function"==typeof i.getKeyValueListForStream&&(a=i.getKeyValueListForStream()),i.Rect=o,i.hasAppearanceStream&&!i.appearanceStreamContent){var s=K(i);a.push({key:"AP",value:"<</N "+s+">>"}),e.internal.acroformPlugin.xForms.push(s);}if(i.appearanceStreamContent){var u="";for(var c in i.appearanceStreamContent){if(i.appearanceStreamContent.hasOwnProperty(c)){var l=i.appearanceStreamContent[c];if(u+="/"+c+" ",u+="<<",Object.keys(l).length>=1||Array.isArray(l)){for(var n in l){if(l.hasOwnProperty(n)){var h=l[n];"function"==typeof h&&(h=h.call(e,i)),u+="/"+n+" "+h+" ",e.internal.acroformPlugin.xForms.indexOf(h)>=0||e.internal.acroformPlugin.xForms.push(h);}}}else "function"==typeof(h=l)&&(h=h.call(e,i)),u+="/"+n+" "+h,e.internal.acroformPlugin.xForms.indexOf(h)>=0||e.internal.acroformPlugin.xForms.push(h);u+=">>";}}a.push({key:"AP",value:"<<\n"+u+">>"});}e.internal.putStream({additionalKeyValues:a,objectId:i.objId}),e.internal.out("endobj");}}r&&et(e.internal.acroformPlugin.xForms,e);}(e,t);}),t.internal.acroformPlugin.isInitialized=!0;}},nt=B.__acroform__.arrayToPdfArray=function(t,e,r){var n=function n(t){return t;};if(Array.isArray(t)){for(var i="[",a=0;a<t.length;a++){switch(0!==a&&(i+=" "),typeof t[a]){case"boolean":case"number":case"object":i+=t[a].toString();break;case"string":"/"!==t[a].substr(0,1)?(void 0!==e&&r&&(n=r.internal.getEncryptor(e)),i+="("+E(n(t[a].toString()))+")"):i+=t[a].toString();}}return i+="]";}throw new Error("Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray");};var it=function it(t,e,r){var n=function n(t){return t;};return void 0!==e&&r&&(n=r.internal.getEncryptor(e)),(t=t||"").toString(),t="("+E(n(t))+")";},at=function at(){this._objId=void 0,this._scope=void 0,Object.defineProperty(this,"objId",{get:function get(){if(void 0===this._objId){if(void 0===this.scope)return;this._objId=this.scope.internal.newObjectDeferred();}return this._objId;},set:function set(t){this._objId=t;}}),Object.defineProperty(this,"scope",{value:this._scope,writable:!0});};at.prototype.toString=function(){return this.objId+" 0 R";},at.prototype.putStream=function(){var t=this.getKeyValueListForStream();this.scope.internal.putStream({data:this.stream,additionalKeyValues:t,objectId:this.objId}),this.scope.internal.out("endobj");},at.prototype.getKeyValueListForStream=function(){var t=[],e=Object.getOwnPropertyNames(this).filter(function(t){return "content"!=t&&"appearanceStreamContent"!=t&&"scope"!=t&&"objId"!=t&&"_"!=t.substring(0,1);});for(var r in e){if(!1===Object.getOwnPropertyDescriptor(this,e[r]).configurable){var n=e[r],i=this[n];i&&(Array.isArray(i)?t.push({key:n,value:nt(i,this.objId,this.scope)}):i instanceof at?(i.scope=this.scope,t.push({key:n,value:i.objId+" 0 R"})):"function"!=typeof i&&t.push({key:n,value:i}));}}return t;};var ot=function ot(){at.call(this),Object.defineProperty(this,"Type",{value:"/XObject",configurable:!1,writable:!0}),Object.defineProperty(this,"Subtype",{value:"/Form",configurable:!1,writable:!0}),Object.defineProperty(this,"FormType",{value:1,configurable:!1,writable:!0});var t,e=[];Object.defineProperty(this,"BBox",{configurable:!1,get:function get(){return e;},set:function set(t){e=t;}}),Object.defineProperty(this,"Resources",{value:"2 0 R",configurable:!1,writable:!0}),Object.defineProperty(this,"stream",{enumerable:!1,configurable:!0,set:function set(e){t=e.trim();},get:function get(){return t||null;}});};D(ot,at);var st=function st(){at.call(this);var t,e=[];Object.defineProperty(this,"Kids",{enumerable:!1,configurable:!0,get:function get(){return e.length>0?e:void 0;}}),Object.defineProperty(this,"Fields",{enumerable:!1,configurable:!1,get:function get(){return e;}}),Object.defineProperty(this,"DA",{enumerable:!1,configurable:!1,get:function get(){if(t){var e=function e(t){return t;};return this.scope&&(e=this.scope.internal.getEncryptor(this.objId)),"("+E(e(t))+")";}},set:function set(e){t=e;}});};D(st,at);var ut=function ut(){at.call(this);var t=4;Object.defineProperty(this,"F",{enumerable:!1,configurable:!1,get:function get(){return t;},set:function set(e){if(isNaN(e))throw new Error('Invalid value "'+e+'" for attribute F supplied.');t=e;}}),Object.defineProperty(this,"showWhenPrinted",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(t,3));},set:function set(e){!0===Boolean(e)?this.F=Y(t,3):this.F=J(t,3);}});var e=0;Object.defineProperty(this,"Ff",{enumerable:!1,configurable:!1,get:function get(){return e;},set:function set(t){if(isNaN(t))throw new Error('Invalid value "'+t+'" for attribute Ff supplied.');e=t;}});var r=[];Object.defineProperty(this,"Rect",{enumerable:!1,configurable:!1,get:function get(){if(0!==r.length)return r;},set:function set(t){r=void 0!==t?t:[];}}),Object.defineProperty(this,"x",{enumerable:!0,configurable:!0,get:function get(){return !r||isNaN(r[0])?0:r[0];},set:function set(t){r[0]=t;}}),Object.defineProperty(this,"y",{enumerable:!0,configurable:!0,get:function get(){return !r||isNaN(r[1])?0:r[1];},set:function set(t){r[1]=t;}}),Object.defineProperty(this,"width",{enumerable:!0,configurable:!0,get:function get(){return !r||isNaN(r[2])?0:r[2];},set:function set(t){r[2]=t;}}),Object.defineProperty(this,"height",{enumerable:!0,configurable:!0,get:function get(){return !r||isNaN(r[3])?0:r[3];},set:function set(t){r[3]=t;}});var n="";Object.defineProperty(this,"FT",{enumerable:!0,configurable:!1,get:function get(){return n;},set:function set(t){switch(t){case"/Btn":case"/Tx":case"/Ch":case"/Sig":n=t;break;default:throw new Error('Invalid value "'+t+'" for attribute FT supplied.');}}});var i=null;Object.defineProperty(this,"T",{enumerable:!0,configurable:!1,get:function get(){if(!i||i.length<1){if(this instanceof mt)return;i="FieldObject"+ut.FieldNum++;}var t=function t(_t2){return _t2;};return this.scope&&(t=this.scope.internal.getEncryptor(this.objId)),"("+E(t(i))+")";},set:function set(t){i=t.toString();}}),Object.defineProperty(this,"fieldName",{configurable:!0,enumerable:!0,get:function get(){return i;},set:function set(t){i=t;}});var a="helvetica";Object.defineProperty(this,"fontName",{enumerable:!0,configurable:!0,get:function get(){return a;},set:function set(t){a=t;}});var o="normal";Object.defineProperty(this,"fontStyle",{enumerable:!0,configurable:!0,get:function get(){return o;},set:function set(t){o=t;}});var s=0;Object.defineProperty(this,"fontSize",{enumerable:!0,configurable:!0,get:function get(){return s;},set:function set(t){s=t;}});var u=void 0;Object.defineProperty(this,"maxFontSize",{enumerable:!0,configurable:!0,get:function get(){return void 0===u?50/M:u;},set:function set(t){u=t;}});var c="black";Object.defineProperty(this,"color",{enumerable:!0,configurable:!0,get:function get(){return c;},set:function set(t){c=t;}});var l="/F1 0 Tf 0 g";Object.defineProperty(this,"DA",{enumerable:!0,configurable:!1,get:function get(){if(!(!l||this instanceof mt||this instanceof bt))return it(l,this.objId,this.scope);},set:function set(t){t=t.toString(),l=t;}});var h=null;Object.defineProperty(this,"DV",{enumerable:!1,configurable:!1,get:function get(){if(h)return this instanceof dt==!1?it(h,this.objId,this.scope):h;},set:function set(t){t=t.toString(),h=this instanceof dt==!1?"("===t.substr(0,1)?q(t.substr(1,t.length-2)):q(t):t;}}),Object.defineProperty(this,"defaultValue",{enumerable:!0,configurable:!0,get:function get(){return this instanceof dt==!0?q(h.substr(1,h.length-1)):h;},set:function set(t){t=t.toString(),h=this instanceof dt==!0?"/"+t:t;}});var f=null;Object.defineProperty(this,"_V",{enumerable:!1,configurable:!1,get:function get(){if(f)return f;},set:function set(t){this.V=t;}}),Object.defineProperty(this,"V",{enumerable:!1,configurable:!1,get:function get(){if(f)return this instanceof dt==!1?it(f,this.objId,this.scope):f;},set:function set(t){t=t.toString(),f=this instanceof dt==!1?"("===t.substr(0,1)?q(t.substr(1,t.length-2)):q(t):t;}}),Object.defineProperty(this,"value",{enumerable:!0,configurable:!0,get:function get(){return this instanceof dt==!0?q(f.substr(1,f.length-1)):f;},set:function set(t){t=t.toString(),f=this instanceof dt==!0?"/"+t:t;}}),Object.defineProperty(this,"hasAnnotation",{enumerable:!0,configurable:!0,get:function get(){return this.Rect;}}),Object.defineProperty(this,"Type",{enumerable:!0,configurable:!1,get:function get(){return this.hasAnnotation?"/Annot":null;}}),Object.defineProperty(this,"Subtype",{enumerable:!0,configurable:!1,get:function get(){return this.hasAnnotation?"/Widget":null;}});var d,p=!1;Object.defineProperty(this,"hasAppearanceStream",{enumerable:!0,configurable:!0,get:function get(){return p;},set:function set(t){t=Boolean(t),p=t;}}),Object.defineProperty(this,"page",{enumerable:!0,configurable:!0,get:function get(){if(d)return d;},set:function set(t){d=t;}}),Object.defineProperty(this,"readOnly",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,1));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,1):this.Ff=J(this.Ff,1);}}),Object.defineProperty(this,"required",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,2));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,2):this.Ff=J(this.Ff,2);}}),Object.defineProperty(this,"noExport",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,3));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,3):this.Ff=J(this.Ff,3);}});var g=null;Object.defineProperty(this,"Q",{enumerable:!0,configurable:!1,get:function get(){if(null!==g)return g;},set:function set(t){if(-1===[0,1,2].indexOf(t))throw new Error('Invalid value "'+t+'" for attribute Q supplied.');g=t;}}),Object.defineProperty(this,"textAlign",{get:function get(){var t;switch(g){case 0:default:t="left";break;case 1:t="center";break;case 2:t="right";}return t;},configurable:!0,enumerable:!0,set:function set(t){switch(t){case"right":case 2:g=2;break;case"center":case 1:g=1;break;case"left":case 0:default:g=0;}}});};D(ut,at);var ct=function ct(){ut.call(this),this.FT="/Ch",this.V="()",this.fontName="zapfdingbats";var t=0;Object.defineProperty(this,"TI",{enumerable:!0,configurable:!1,get:function get(){return t;},set:function set(e){t=e;}}),Object.defineProperty(this,"topIndex",{enumerable:!0,configurable:!0,get:function get(){return t;},set:function set(e){t=e;}});var e=[];Object.defineProperty(this,"Opt",{enumerable:!0,configurable:!1,get:function get(){return nt(e,this.objId,this.scope);},set:function set(t){var r,n;n=[],"string"==typeof(r=t)&&(n=function(t,e,r){r||(r=1);for(var n,i=[];n=e.exec(t);){i.push(n[r]);}return i;}(r,/\((.*?)\)/g)),e=n;}}),this.getOptions=function(){return e;},this.setOptions=function(t){e=t,this.sort&&e.sort();},this.addOption=function(t){t=(t=t||"").toString(),e.push(t),this.sort&&e.sort();},this.removeOption=function(t,r){for(r=r||!1,t=(t=t||"").toString();-1!==e.indexOf(t)&&(e.splice(e.indexOf(t),1),!1!==r);){}},Object.defineProperty(this,"combo",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,18));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,18):this.Ff=J(this.Ff,18);}}),Object.defineProperty(this,"edit",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,19));},set:function set(t){!0===this.combo&&(!0===Boolean(t)?this.Ff=Y(this.Ff,19):this.Ff=J(this.Ff,19));}}),Object.defineProperty(this,"sort",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,20));},set:function set(t){!0===Boolean(t)?(this.Ff=Y(this.Ff,20),e.sort()):this.Ff=J(this.Ff,20);}}),Object.defineProperty(this,"multiSelect",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,22));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,22):this.Ff=J(this.Ff,22);}}),Object.defineProperty(this,"doNotSpellCheck",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,23));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,23):this.Ff=J(this.Ff,23);}}),Object.defineProperty(this,"commitOnSelChange",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,27));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,27):this.Ff=J(this.Ff,27);}}),this.hasAppearanceStream=!1;};D(ct,ut);var lt=function lt(){ct.call(this),this.fontName="helvetica",this.combo=!1;};D(lt,ct);var ht=function ht(){lt.call(this),this.combo=!0;};D(ht,lt);var ft=function ft(){ht.call(this),this.edit=!0;};D(ft,ht);var dt=function dt(){ut.call(this),this.FT="/Btn",Object.defineProperty(this,"noToggleToOff",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,15));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,15):this.Ff=J(this.Ff,15);}}),Object.defineProperty(this,"radio",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,16));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,16):this.Ff=J(this.Ff,16);}}),Object.defineProperty(this,"pushButton",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,17));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,17):this.Ff=J(this.Ff,17);}}),Object.defineProperty(this,"radioIsUnison",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,26));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,26):this.Ff=J(this.Ff,26);}});var t,e={};Object.defineProperty(this,"MK",{enumerable:!1,configurable:!1,get:function get(){var t=function t(_t3){return _t3;};if(this.scope&&(t=this.scope.internal.getEncryptor(this.objId)),0!==Object.keys(e).length){var r,n=[];for(r in n.push("<<"),e){n.push("/"+r+" ("+E(t(e[r]))+")");}return n.push(">>"),n.join("\n");}},set:function set(t){"object"==typeof t&&(e=t);}}),Object.defineProperty(this,"caption",{enumerable:!0,configurable:!0,get:function get(){return e.CA||"";},set:function set(t){"string"==typeof t&&(e.CA=t);}}),Object.defineProperty(this,"AS",{enumerable:!1,configurable:!1,get:function get(){return t;},set:function set(e){t=e;}}),Object.defineProperty(this,"appearanceState",{enumerable:!0,configurable:!0,get:function get(){return t.substr(1,t.length-1);},set:function set(e){t="/"+e;}});};D(dt,ut);var pt=function pt(){dt.call(this),this.pushButton=!0;};D(pt,dt);var gt=function gt(){dt.call(this),this.radio=!0,this.pushButton=!1;var t=[];Object.defineProperty(this,"Kids",{enumerable:!0,configurable:!1,get:function get(){return t;},set:function set(e){t=void 0!==e?e:[];}});};D(gt,dt);var mt=function mt(){var t,e;ut.call(this),Object.defineProperty(this,"Parent",{enumerable:!1,configurable:!1,get:function get(){return t;},set:function set(e){t=e;}}),Object.defineProperty(this,"optionName",{enumerable:!1,configurable:!0,get:function get(){return e;},set:function set(t){e=t;}});var r,n={};Object.defineProperty(this,"MK",{enumerable:!1,configurable:!1,get:function get(){var t=function t(_t4){return _t4;};this.scope&&(t=this.scope.internal.getEncryptor(this.objId));var e,r=[];for(e in r.push("<<"),n){r.push("/"+e+" ("+E(t(n[e]))+")");}return r.push(">>"),r.join("\n");},set:function set(t){"object"==typeof t&&(n=t);}}),Object.defineProperty(this,"caption",{enumerable:!0,configurable:!0,get:function get(){return n.CA||"";},set:function set(t){"string"==typeof t&&(n.CA=t);}}),Object.defineProperty(this,"AS",{enumerable:!1,configurable:!1,get:function get(){return r;},set:function set(t){r=t;}}),Object.defineProperty(this,"appearanceState",{enumerable:!0,configurable:!0,get:function get(){return r.substr(1,r.length-1);},set:function set(t){r="/"+t;}}),this.caption="l",this.appearanceState="Off",this._AppearanceType=wt.RadioButton.Circle,this.appearanceStreamContent=this._AppearanceType.createAppearanceStream(this.optionName);};D(mt,ut),gt.prototype.setAppearance=function(t){if(!("createAppearanceStream"in t)||!("getCA"in t))throw new Error("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");for(var e in this.Kids){if(this.Kids.hasOwnProperty(e)){var r=this.Kids[e];r.appearanceStreamContent=t.createAppearanceStream(r.optionName),r.caption=t.getCA();}}},gt.prototype.createOption=function(t){var e=new mt();return e.Parent=this,e.optionName=t,this.Kids.push(e),Nt.call(this.scope,e),e;};var vt=function vt(){dt.call(this),this.fontName="zapfdingbats",this.caption="3",this.appearanceState="On",this.value="On",this.textAlign="center",this.appearanceStreamContent=wt.CheckBox.createAppearanceStream();};D(vt,dt);var bt=function bt(){ut.call(this),this.FT="/Tx",Object.defineProperty(this,"multiline",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,13));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,13):this.Ff=J(this.Ff,13);}}),Object.defineProperty(this,"fileSelect",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,21));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,21):this.Ff=J(this.Ff,21);}}),Object.defineProperty(this,"doNotSpellCheck",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,23));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,23):this.Ff=J(this.Ff,23);}}),Object.defineProperty(this,"doNotScroll",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,24));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,24):this.Ff=J(this.Ff,24);}}),Object.defineProperty(this,"comb",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,25));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,25):this.Ff=J(this.Ff,25);}}),Object.defineProperty(this,"richText",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,26));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,26):this.Ff=J(this.Ff,26);}});var t=null;Object.defineProperty(this,"MaxLen",{enumerable:!0,configurable:!1,get:function get(){return t;},set:function set(e){t=e;}}),Object.defineProperty(this,"maxLength",{enumerable:!0,configurable:!0,get:function get(){return t;},set:function set(e){Number.isInteger(e)&&(t=e);}}),Object.defineProperty(this,"hasAppearanceStream",{enumerable:!0,configurable:!0,get:function get(){return this.V||this.DV;}});};D(bt,ut);var yt=function yt(){bt.call(this),Object.defineProperty(this,"password",{enumerable:!0,configurable:!0,get:function get(){return Boolean(G(this.Ff,14));},set:function set(t){!0===Boolean(t)?this.Ff=Y(this.Ff,14):this.Ff=J(this.Ff,14);}}),this.password=!0;};D(yt,bt);var wt={CheckBox:{createAppearanceStream:function createAppearanceStream(){return {N:{On:wt.CheckBox.YesNormal},D:{On:wt.CheckBox.YesPushDown,Off:wt.CheckBox.OffPushDown}};},YesPushDown:function YesPushDown(t){var e=z(t);e.scope=t.scope;var r=[],n=t.scope.internal.getFont(t.fontName,t.fontStyle).id,i=t.scope.__private__.encodeColorString(t.color),a=Z(t,t.caption);return r.push("0.749023 g"),r.push("0 0 "+R(wt.internal.getWidth(t))+" "+R(wt.internal.getHeight(t))+" re"),r.push("f"),r.push("BMC"),r.push("q"),r.push("0 0 1 rg"),r.push("/"+n+" "+R(a.fontSize)+" Tf "+i),r.push("BT"),r.push(a.text),r.push("ET"),r.push("Q"),r.push("EMC"),e.stream=r.join("\n"),e;},YesNormal:function YesNormal(t){var e=z(t);e.scope=t.scope;var r=t.scope.internal.getFont(t.fontName,t.fontStyle).id,n=t.scope.__private__.encodeColorString(t.color),i=[],a=wt.internal.getHeight(t),o=wt.internal.getWidth(t),s=Z(t,t.caption);return i.push("1 g"),i.push("0 0 "+R(o)+" "+R(a)+" re"),i.push("f"),i.push("q"),i.push("0 0 1 rg"),i.push("0 0 "+R(o-1)+" "+R(a-1)+" re"),i.push("W"),i.push("n"),i.push("0 g"),i.push("BT"),i.push("/"+r+" "+R(s.fontSize)+" Tf "+n),i.push(s.text),i.push("ET"),i.push("Q"),e.stream=i.join("\n"),e;},OffPushDown:function OffPushDown(t){var e=z(t);e.scope=t.scope;var r=[];return r.push("0.749023 g"),r.push("0 0 "+R(wt.internal.getWidth(t))+" "+R(wt.internal.getHeight(t))+" re"),r.push("f"),e.stream=r.join("\n"),e;}},RadioButton:{Circle:{createAppearanceStream:function createAppearanceStream(t){var e={D:{Off:wt.RadioButton.Circle.OffPushDown},N:{}};return e.N[t]=wt.RadioButton.Circle.YesNormal,e.D[t]=wt.RadioButton.Circle.YesPushDown,e;},getCA:function getCA(){return "l";},YesNormal:function YesNormal(t){var e=z(t);e.scope=t.scope;var r=[],n=wt.internal.getWidth(t)<=wt.internal.getHeight(t)?wt.internal.getWidth(t)/4:wt.internal.getHeight(t)/4;n=Number((.9*n).toFixed(5));var i=wt.internal.Bezier_C,a=Number((n*i).toFixed(5));return r.push("q"),r.push("1 0 0 1 "+T(wt.internal.getWidth(t)/2)+" "+T(wt.internal.getHeight(t)/2)+" cm"),r.push(n+" 0 m"),r.push(n+" "+a+" "+a+" "+n+" 0 "+n+" c"),r.push("-"+a+" "+n+" -"+n+" "+a+" -"+n+" 0 c"),r.push("-"+n+" -"+a+" -"+a+" -"+n+" 0 -"+n+" c"),r.push(a+" -"+n+" "+n+" -"+a+" "+n+" 0 c"),r.push("f"),r.push("Q"),e.stream=r.join("\n"),e;},YesPushDown:function YesPushDown(t){var e=z(t);e.scope=t.scope;var r=[],n=wt.internal.getWidth(t)<=wt.internal.getHeight(t)?wt.internal.getWidth(t)/4:wt.internal.getHeight(t)/4;n=Number((.9*n).toFixed(5));var i=Number((2*n).toFixed(5)),a=Number((i*wt.internal.Bezier_C).toFixed(5)),o=Number((n*wt.internal.Bezier_C).toFixed(5));return r.push("0.749023 g"),r.push("q"),r.push("1 0 0 1 "+T(wt.internal.getWidth(t)/2)+" "+T(wt.internal.getHeight(t)/2)+" cm"),r.push(i+" 0 m"),r.push(i+" "+a+" "+a+" "+i+" 0 "+i+" c"),r.push("-"+a+" "+i+" -"+i+" "+a+" -"+i+" 0 c"),r.push("-"+i+" -"+a+" -"+a+" -"+i+" 0 -"+i+" c"),r.push(a+" -"+i+" "+i+" -"+a+" "+i+" 0 c"),r.push("f"),r.push("Q"),r.push("0 g"),r.push("q"),r.push("1 0 0 1 "+T(wt.internal.getWidth(t)/2)+" "+T(wt.internal.getHeight(t)/2)+" cm"),r.push(n+" 0 m"),r.push(n+" "+o+" "+o+" "+n+" 0 "+n+" c"),r.push("-"+o+" "+n+" -"+n+" "+o+" -"+n+" 0 c"),r.push("-"+n+" -"+o+" -"+o+" -"+n+" 0 -"+n+" c"),r.push(o+" -"+n+" "+n+" -"+o+" "+n+" 0 c"),r.push("f"),r.push("Q"),e.stream=r.join("\n"),e;},OffPushDown:function OffPushDown(t){var e=z(t);e.scope=t.scope;var r=[],n=wt.internal.getWidth(t)<=wt.internal.getHeight(t)?wt.internal.getWidth(t)/4:wt.internal.getHeight(t)/4;n=Number((.9*n).toFixed(5));var i=Number((2*n).toFixed(5)),a=Number((i*wt.internal.Bezier_C).toFixed(5));return r.push("0.749023 g"),r.push("q"),r.push("1 0 0 1 "+T(wt.internal.getWidth(t)/2)+" "+T(wt.internal.getHeight(t)/2)+" cm"),r.push(i+" 0 m"),r.push(i+" "+a+" "+a+" "+i+" 0 "+i+" c"),r.push("-"+a+" "+i+" -"+i+" "+a+" -"+i+" 0 c"),r.push("-"+i+" -"+a+" -"+a+" -"+i+" 0 -"+i+" c"),r.push(a+" -"+i+" "+i+" -"+a+" "+i+" 0 c"),r.push("f"),r.push("Q"),e.stream=r.join("\n"),e;}},Cross:{createAppearanceStream:function createAppearanceStream(t){var e={D:{Off:wt.RadioButton.Cross.OffPushDown},N:{}};return e.N[t]=wt.RadioButton.Cross.YesNormal,e.D[t]=wt.RadioButton.Cross.YesPushDown,e;},getCA:function getCA(){return "8";},YesNormal:function YesNormal(t){var e=z(t);e.scope=t.scope;var r=[],n=wt.internal.calculateCross(t);return r.push("q"),r.push("1 1 "+R(wt.internal.getWidth(t)-2)+" "+R(wt.internal.getHeight(t)-2)+" re"),r.push("W"),r.push("n"),r.push(R(n.x1.x)+" "+R(n.x1.y)+" m"),r.push(R(n.x2.x)+" "+R(n.x2.y)+" l"),r.push(R(n.x4.x)+" "+R(n.x4.y)+" m"),r.push(R(n.x3.x)+" "+R(n.x3.y)+" l"),r.push("s"),r.push("Q"),e.stream=r.join("\n"),e;},YesPushDown:function YesPushDown(t){var e=z(t);e.scope=t.scope;var r=wt.internal.calculateCross(t),n=[];return n.push("0.749023 g"),n.push("0 0 "+R(wt.internal.getWidth(t))+" "+R(wt.internal.getHeight(t))+" re"),n.push("f"),n.push("q"),n.push("1 1 "+R(wt.internal.getWidth(t)-2)+" "+R(wt.internal.getHeight(t)-2)+" re"),n.push("W"),n.push("n"),n.push(R(r.x1.x)+" "+R(r.x1.y)+" m"),n.push(R(r.x2.x)+" "+R(r.x2.y)+" l"),n.push(R(r.x4.x)+" "+R(r.x4.y)+" m"),n.push(R(r.x3.x)+" "+R(r.x3.y)+" l"),n.push("s"),n.push("Q"),e.stream=n.join("\n"),e;},OffPushDown:function OffPushDown(t){var e=z(t);e.scope=t.scope;var r=[];return r.push("0.749023 g"),r.push("0 0 "+R(wt.internal.getWidth(t))+" "+R(wt.internal.getHeight(t))+" re"),r.push("f"),e.stream=r.join("\n"),e;}}},createDefaultAppearanceStream:function createDefaultAppearanceStream(t){var e=t.scope.internal.getFont(t.fontName,t.fontStyle).id,r=t.scope.__private__.encodeColorString(t.color);return "/"+e+" "+t.fontSize+" Tf "+r;}};wt.internal={Bezier_C:.551915024494,calculateCross:function calculateCross(t){var e=wt.internal.getWidth(t),r=wt.internal.getHeight(t),n=Math.min(e,r);return {x1:{x:(e-n)/2,y:(r-n)/2+n},x2:{x:(e-n)/2+n,y:(r-n)/2},x3:{x:(e-n)/2,y:(r-n)/2},x4:{x:(e-n)/2+n,y:(r-n)/2+n}};}},wt.internal.getWidth=function(t){var e=0;return "object"==typeof t&&(e=U(t.Rect[2])),e;},wt.internal.getHeight=function(t){var e=0;return "object"==typeof t&&(e=U(t.Rect[3])),e;};var Nt=B.addField=function(t){if(rt(this,t),!(t instanceof ut))throw new Error("Invalid argument passed to jsPDF.addField.");var e;return (e=t).scope.internal.acroformPlugin.printedOut&&(e.scope.internal.acroformPlugin.printedOut=!1,e.scope.internal.acroformPlugin.acroFormDictionaryRoot=null),e.scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(e),t.page=t.scope.internal.getCurrentPageInfo().pageNumber,this;};B.AcroFormChoiceField=ct,B.AcroFormListBox=lt,B.AcroFormComboBox=ht,B.AcroFormEditBox=ft,B.AcroFormButton=dt,B.AcroFormPushButton=pt,B.AcroFormRadioButton=gt,B.AcroFormCheckBox=vt,B.AcroFormTextField=bt,B.AcroFormPasswordField=yt,B.AcroFormAppearance=wt,B.AcroForm={ChoiceField:ct,ListBox:lt,ComboBox:ht,EditBox:ft,Button:dt,PushButton:pt,RadioButton:gt,CheckBox:vt,TextField:bt,PasswordField:yt,Appearance:wt},O.AcroForm={ChoiceField:ct,ListBox:lt,ComboBox:ht,EditBox:ft,Button:dt,PushButton:pt,RadioButton:gt,CheckBox:vt,TextField:bt,PasswordField:yt,Appearance:wt};var Lt=O.AcroForm;
/** @license
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */function At(t){return t.reduce(function(t,e,r){return t[e]=r,t;},{});}!function(t){t.__addimage__={};var e="UNKNOWN",r={PNG:[[137,80,78,71]],TIFF:[[77,77,0,42],[73,73,42,0]],JPEG:[[255,216,255,224,void 0,void 0,74,70,73,70,0],[255,216,255,225,void 0,void 0,69,120,105,102,0,0],[255,216,255,219],[255,216,255,238]],JPEG2000:[[0,0,0,12,106,80,32,32]],GIF87a:[[71,73,70,56,55,97]],GIF89a:[[71,73,70,56,57,97]],WEBP:[[82,73,70,70,void 0,void 0,void 0,void 0,87,69,66,80]],BMP:[[66,77],[66,65],[67,73],[67,80],[73,67],[80,84]]},n=t.__addimage__.getImageFileTypeByImageData=function(t,n){var i,a;n=n||e;var o,s,u,c=e;if(x(t))for(u in r){for(o=r[u],i=0;i<o.length;i+=1){for(s=!0,a=0;a<o[i].length;a+=1){if(void 0!==o[i][a]&&o[i][a]!==t[a]){s=!1;break;}}if(!0===s){c=u;break;}}}else for(u in r){for(o=r[u],i=0;i<o.length;i+=1){for(s=!0,a=0;a<o[i].length;a+=1){if(void 0!==o[i][a]&&o[i][a]!==t.charCodeAt(a)){s=!1;break;}}if(!0===s){c=u;break;}}}return c===e&&n!==e&&(c=n),c;},i=function i(t){for(var e=this.internal.write,r=this.internal.putStream,n=(0, this.internal.getFilters)();-1!==n.indexOf("FlateEncode");){n.splice(n.indexOf("FlateEncode"),1);}t.objectId=this.internal.newObject();var a=[];if(a.push({key:"Type",value:"/XObject"}),a.push({key:"Subtype",value:"/Image"}),a.push({key:"Width",value:t.width}),a.push({key:"Height",value:t.height}),t.colorSpace===b.INDEXED?a.push({key:"ColorSpace",value:"[/Indexed /DeviceRGB "+(t.palette.length/3-1)+" "+("sMask"in t&&void 0!==t.sMask?t.objectId+2:t.objectId+1)+" 0 R]"}):(a.push({key:"ColorSpace",value:"/"+t.colorSpace}),t.colorSpace===b.DEVICE_CMYK&&a.push({key:"Decode",value:"[1 0 1 0 1 0 1 0]"})),a.push({key:"BitsPerComponent",value:t.bitsPerComponent}),"decodeParameters"in t&&void 0!==t.decodeParameters&&a.push({key:"DecodeParms",value:"<<"+t.decodeParameters+">>"}),"transparency"in t&&Array.isArray(t.transparency)){for(var o="",s=0,u=t.transparency.length;s<u;s++){o+=t.transparency[s]+" "+t.transparency[s]+" ";}a.push({key:"Mask",value:"["+o+"]"});}void 0!==t.sMask&&a.push({key:"SMask",value:t.objectId+1+" 0 R"});var c=void 0!==t.filter?["/"+t.filter]:void 0;if(r({data:t.data,additionalKeyValues:a,alreadyAppliedFilters:c,objectId:t.objectId}),e("endobj"),"sMask"in t&&void 0!==t.sMask){var l="/Predictor "+t.predictor+" /Colors 1 /BitsPerComponent "+t.bitsPerComponent+" /Columns "+t.width,h={width:t.width,height:t.height,colorSpace:"DeviceGray",bitsPerComponent:t.bitsPerComponent,decodeParameters:l,data:t.sMask};"filter"in t&&(h.filter=t.filter),i.call(this,h);}if(t.colorSpace===b.INDEXED){var f=this.internal.newObject();r({data:_(new Uint8Array(t.palette)),objectId:f}),e("endobj");}},a=function a(){var t=this.internal.collections.addImage_images;for(var e in t){i.call(this,t[e]);}},o=function o(){var t,e=this.internal.collections.addImage_images,r=this.internal.write;for(var n in e){r("/I"+(t=e[n]).index,t.objectId,"0","R");}},s=function s(){this.internal.collections.addImage_images||(this.internal.collections.addImage_images={},this.internal.events.subscribe("putResources",a),this.internal.events.subscribe("putXobjectDict",o));},l=function l(){var t=this.internal.collections.addImage_images;return s.call(this),t;},h=function h(){return Object.keys(this.internal.collections.addImage_images).length;},f=function f(e){return "function"==typeof t["process"+e.toUpperCase()];},d=function d(t){return "object"==typeof t&&1===t.nodeType;},p=function p(e,r){if("IMG"===e.nodeName&&e.hasAttribute("src")){var n=""+e.getAttribute("src");if(0===n.indexOf("data:image/"))return u(unescape(n).split("base64,").pop());var i=t.loadFile(n,!0);if(void 0!==i)return i;}if("CANVAS"===e.nodeName){var a;switch(r){case"PNG":a="image/png";break;case"WEBP":a="image/webp";break;case"JPEG":case"JPG":default:a="image/jpeg";}return u(e.toDataURL(a,1).split("base64,").pop());}},g=function g(t){var e=this.internal.collections.addImage_images;if(e)for(var r in e){if(t===e[r].alias)return e[r];}},m=function m(t,e,r){return t||e||(t=-96,e=-96),t<0&&(t=-1*r.width*72/t/this.internal.scaleFactor),e<0&&(e=-1*r.height*72/e/this.internal.scaleFactor),0===t&&(t=e*r.width/r.height),0===e&&(e=t*r.height/r.width),[t,e];},v=function v(t,e,r,n,i,a){var o=m.call(this,r,n,i),s=this.internal.getCoordinateString,u=this.internal.getVerticalCoordinateString,c=l.call(this);if(r=o[0],n=o[1],c[i.index]=i,a){a*=Math.PI/180;var h=Math.cos(a),f=Math.sin(a),d=function d(t){return t.toFixed(4);},p=[d(h),d(f),d(-1*f),d(h),0,0,"cm"];}this.internal.write("q"),a?(this.internal.write([1,"0","0",1,s(t),u(e+n),"cm"].join(" ")),this.internal.write(p.join(" ")),this.internal.write([s(r),"0","0",s(n),"0","0","cm"].join(" "))):this.internal.write([s(r),"0","0",s(n),s(t),u(e+n),"cm"].join(" ")),this.isAdvancedAPI()&&this.internal.write([1,0,0,-1,0,0,"cm"].join(" ")),this.internal.write("/I"+i.index+" Do"),this.internal.write("Q");},b=t.color_spaces={DEVICE_RGB:"DeviceRGB",DEVICE_GRAY:"DeviceGray",DEVICE_CMYK:"DeviceCMYK",CAL_GREY:"CalGray",CAL_RGB:"CalRGB",LAB:"Lab",ICC_BASED:"ICCBased",INDEXED:"Indexed",PATTERN:"Pattern",SEPARATION:"Separation",DEVICE_N:"DeviceN"};t.decode={DCT_DECODE:"DCTDecode",FLATE_DECODE:"FlateDecode",LZW_DECODE:"LZWDecode",JPX_DECODE:"JPXDecode",JBIG2_DECODE:"JBIG2Decode",ASCII85_DECODE:"ASCII85Decode",ASCII_HEX_DECODE:"ASCIIHexDecode",RUN_LENGTH_DECODE:"RunLengthDecode",CCITT_FAX_DECODE:"CCITTFaxDecode"};var y=t.image_compression={NONE:"NONE",FAST:"FAST",MEDIUM:"MEDIUM",SLOW:"SLOW"},w=t.__addimage__.sHashCode=function(t){var e,r,n=0;if("string"==typeof t)for(r=t.length,e=0;e<r;e++){n=(n<<5)-n+t.charCodeAt(e),n|=0;}else if(x(t))for(r=t.byteLength/2,e=0;e<r;e++){n=(n<<5)-n+t[e],n|=0;}return n;},N=t.__addimage__.validateStringAsBase64=function(t){(t=t||"").toString().trim();var e=!0;return 0===t.length&&(e=!1),t.length%4!=0&&(e=!1),!1===/^[A-Za-z0-9+/]+$/.test(t.substr(0,t.length-2))&&(e=!1),!1===/^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(t.substr(-2))&&(e=!1),e;},L=t.__addimage__.extractImageFromDataUrl=function(t){var e=(t=t||"").split("base64,"),r=null;if(2===e.length){var n=/^data:(\w*\/\w*);*(charset=(?!charset=)[\w=-]*)*;*$/.exec(e[0]);Array.isArray(n)&&(r={mimeType:n[1],charset:n[2],data:e[1]});}return r;},A=t.__addimage__.supportsArrayBuffer=function(){return "undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array;};t.__addimage__.isArrayBuffer=function(t){return A()&&t instanceof ArrayBuffer;};var x=t.__addimage__.isArrayBufferView=function(t){return A()&&"undefined"!=typeof Uint32Array&&(t instanceof Int8Array||t instanceof Uint8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array);},S=t.__addimage__.binaryStringToUint8Array=function(t){for(var e=t.length,r=new Uint8Array(e),n=0;n<e;n++){r[n]=t.charCodeAt(n);}return r;},_=t.__addimage__.arrayBufferToBinaryString=function(t){try{return u(c(String.fromCharCode.apply(null,t)));}catch(e){if("undefined"!=typeof Uint8Array&&void 0!==Uint8Array.prototype.reduce)return new Uint8Array(t).reduce(function(t,e){return t.push(String.fromCharCode(e)),t;},[]).join("");}};t.addImage=function(){var t,r,n,i,a,o,u,c,l;if("number"==typeof arguments[1]?(r=e,n=arguments[1],i=arguments[2],a=arguments[3],o=arguments[4],u=arguments[5],c=arguments[6],l=arguments[7]):(r=arguments[1],n=arguments[2],i=arguments[3],a=arguments[4],o=arguments[5],u=arguments[6],c=arguments[7],l=arguments[8]),"object"==typeof(t=arguments[0])&&!d(t)&&"imageData"in t){var h=t;t=h.imageData,r=h.format||r||e,n=h.x||n||0,i=h.y||i||0,a=h.w||h.width||a,o=h.h||h.height||o,u=h.alias||u,c=h.compression||c,l=h.rotation||h.angle||l;}var f=this.internal.getFilters();if(void 0===c&&-1!==f.indexOf("FlateEncode")&&(c="SLOW"),isNaN(n)||isNaN(i))throw new Error("Invalid coordinates passed to jsPDF.addImage");s.call(this);var p=P.call(this,t,r,u,c);return v.call(this,n,i,a,o,p,l),this;};var P=function P(r,i,a,o){var s,u,c;if("string"==typeof r&&n(r)===e){r=unescape(r);var l=k(r,!1);(""!==l||void 0!==(l=t.loadFile(r,!0)))&&(r=l);}if(d(r)&&(r=p(r,i)),i=n(r,i),!f(i))throw new Error("addImage does not support files of type '"+i+"', please ensure that a plugin for '"+i+"' support is added.");if((null==(c=a)||0===c.length)&&(a=function(t){return "string"==typeof t||x(t)?w(t):null;}(r)),(s=g.call(this,a))||(A()&&(r instanceof Uint8Array||(u=r,r=S(r))),s=this["process"+i.toUpperCase()](r,h.call(this),a,function(e){return e&&"string"==typeof e&&(e=e.toUpperCase()),e in t.image_compression?e:y.NONE;}(o),u)),!s)throw new Error("An unknown error occurred whilst processing the image.");return s;},k=t.__addimage__.convertBase64ToBinaryString=function(t,e){var r;e="boolean"!=typeof e||e;var n,i="";if("string"==typeof t){n=null!==(r=L(t))?r.data:t;try{i=u(n);}catch(t){if(e)throw N(n)?new Error("atob-Error in jsPDF.convertBase64ToBinaryString "+t.message):new Error("Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString ");}}return i;};t.getImageProperties=function(r){var i,a,o="";if(d(r)&&(r=p(r)),"string"==typeof r&&n(r)===e&&(""===(o=k(r,!1))&&(o=t.loadFile(r)||""),r=o),a=n(r),!f(a))throw new Error("addImage does not support files of type '"+a+"', please ensure that a plugin for '"+a+"' support is added.");if(!A()||r instanceof Uint8Array||(r=S(r)),!(i=this["process"+a.toUpperCase()](r)))throw new Error("An unknown error occurred whilst processing the image");return i.fileType=a,i;};}(O.API),
/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){var e=function e(t){if(void 0!==t&&""!=t)return !0;};O.API.events.push(["addPage",function(t){this.internal.getPageInfo(t.pageNumber).pageContext.annotations=[];}]),t.events.push(["putPage",function(t){for(var r,n,i,a=this.internal.getCoordinateString,o=this.internal.getVerticalCoordinateString,s=this.internal.getPageInfoByObjId(t.objId),u=t.pageContext.annotations,c=!1,l=0;l<u.length&&!c;l++){switch((r=u[l]).type){case"link":(e(r.options.url)||e(r.options.pageNumber))&&(c=!0);break;case"reference":case"text":case"freetext":c=!0;}}if(0!=c){this.internal.write("/Annots [");for(var h=0;h<u.length;h++){r=u[h];var f=this.internal.pdfEscape,d=this.internal.getEncryptor(t.objId);switch(r.type){case"reference":this.internal.write(" "+r.object.objId+" 0 R ");break;case"text":var p=this.internal.newAdditionalObject(),g=this.internal.newAdditionalObject(),m=this.internal.getEncryptor(p.objId),v=r.title||"Note";i="<</Type /Annot /Subtype /Text "+(n="/Rect ["+a(r.bounds.x)+" "+o(r.bounds.y+r.bounds.h)+" "+a(r.bounds.x+r.bounds.w)+" "+o(r.bounds.y)+"] ")+"/Contents ("+f(m(r.contents))+")",i+=" /Popup "+g.objId+" 0 R",i+=" /P "+s.objId+" 0 R",i+=" /T ("+f(m(v))+") >>",p.content=i;var b=p.objId+" 0 R";i="<</Type /Annot /Subtype /Popup "+(n="/Rect ["+a(r.bounds.x+30)+" "+o(r.bounds.y+r.bounds.h)+" "+a(r.bounds.x+r.bounds.w+30)+" "+o(r.bounds.y)+"] ")+" /Parent "+b,r.open&&(i+=" /Open true"),i+=" >>",g.content=i,this.internal.write(p.objId,"0 R",g.objId,"0 R");break;case"freetext":n="/Rect ["+a(r.bounds.x)+" "+o(r.bounds.y)+" "+a(r.bounds.x+r.bounds.w)+" "+o(r.bounds.y+r.bounds.h)+"] ";var y=r.color||"#000000";i="<</Type /Annot /Subtype /FreeText "+n+"/Contents ("+f(d(r.contents))+")",i+=" /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#"+y+")",i+=" /Border [0 0 0]",i+=" >>",this.internal.write(i);break;case"link":if(r.options.name){var w=this.annotations._nameMap[r.options.name];r.options.pageNumber=w.page,r.options.top=w.y;}else r.options.top||(r.options.top=0);if(n="/Rect ["+r.finalBounds.x+" "+r.finalBounds.y+" "+r.finalBounds.w+" "+r.finalBounds.h+"] ",i="",r.options.url)i="<</Type /Annot /Subtype /Link "+n+"/Border [0 0 0] /A <</S /URI /URI ("+f(d(r.options.url))+") >>";else if(r.options.pageNumber){switch(i="<</Type /Annot /Subtype /Link "+n+"/Border [0 0 0] /Dest ["+this.internal.getPageInfo(r.options.pageNumber).objId+" 0 R",r.options.magFactor=r.options.magFactor||"XYZ",r.options.magFactor){case"Fit":i+=" /Fit]";break;case"FitH":i+=" /FitH "+r.options.top+"]";break;case"FitV":r.options.left=r.options.left||0,i+=" /FitV "+r.options.left+"]";break;case"XYZ":default:var N=o(r.options.top);r.options.left=r.options.left||0,void 0===r.options.zoom&&(r.options.zoom=0),i+=" /XYZ "+r.options.left+" "+N+" "+r.options.zoom+"]";}}""!=i&&(i+=" >>",this.internal.write(i));}}this.internal.write("]");}}]),t.createAnnotation=function(t){var e=this.internal.getCurrentPageInfo();switch(t.type){case"link":this.link(t.bounds.x,t.bounds.y,t.bounds.w,t.bounds.h,t);break;case"text":case"freetext":e.pageContext.annotations.push(t);}},t.link=function(t,e,r,n,i){var a=this.internal.getCurrentPageInfo(),o=this.internal.getCoordinateString,s=this.internal.getVerticalCoordinateString;a.pageContext.annotations.push({finalBounds:{x:o(t),y:s(e),w:o(t+r),h:s(e+n)},options:i,type:"link"});},t.textWithLink=function(t,e,r,n){var i=this.getTextWidth(t),a=this.internal.getLineHeight()/this.internal.scaleFactor;return this.text(t,e,r,n),r+=.2*a,"center"===n.align&&(e-=i/2),"right"===n.align&&(e-=i),this.link(e,r-a,i,a,n),i;},t.getTextWidth=function(t){var e=this.internal.getFontSize();return this.getStringUnitWidth(t)*e/this.internal.scaleFactor;};}(O.API),
/**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){var e={1569:[65152],1570:[65153,65154],1571:[65155,65156],1572:[65157,65158],1573:[65159,65160],1574:[65161,65162,65163,65164],1575:[65165,65166],1576:[65167,65168,65169,65170],1577:[65171,65172],1578:[65173,65174,65175,65176],1579:[65177,65178,65179,65180],1580:[65181,65182,65183,65184],1581:[65185,65186,65187,65188],1582:[65189,65190,65191,65192],1583:[65193,65194],1584:[65195,65196],1585:[65197,65198],1586:[65199,65200],1587:[65201,65202,65203,65204],1588:[65205,65206,65207,65208],1589:[65209,65210,65211,65212],1590:[65213,65214,65215,65216],1591:[65217,65218,65219,65220],1592:[65221,65222,65223,65224],1593:[65225,65226,65227,65228],1594:[65229,65230,65231,65232],1601:[65233,65234,65235,65236],1602:[65237,65238,65239,65240],1603:[65241,65242,65243,65244],1604:[65245,65246,65247,65248],1605:[65249,65250,65251,65252],1606:[65253,65254,65255,65256],1607:[65257,65258,65259,65260],1608:[65261,65262],1609:[65263,65264,64488,64489],1610:[65265,65266,65267,65268],1649:[64336,64337],1655:[64477],1657:[64358,64359,64360,64361],1658:[64350,64351,64352,64353],1659:[64338,64339,64340,64341],1662:[64342,64343,64344,64345],1663:[64354,64355,64356,64357],1664:[64346,64347,64348,64349],1667:[64374,64375,64376,64377],1668:[64370,64371,64372,64373],1670:[64378,64379,64380,64381],1671:[64382,64383,64384,64385],1672:[64392,64393],1676:[64388,64389],1677:[64386,64387],1678:[64390,64391],1681:[64396,64397],1688:[64394,64395],1700:[64362,64363,64364,64365],1702:[64366,64367,64368,64369],1705:[64398,64399,64400,64401],1709:[64467,64468,64469,64470],1711:[64402,64403,64404,64405],1713:[64410,64411,64412,64413],1715:[64406,64407,64408,64409],1722:[64414,64415],1723:[64416,64417,64418,64419],1726:[64426,64427,64428,64429],1728:[64420,64421],1729:[64422,64423,64424,64425],1733:[64480,64481],1734:[64473,64474],1735:[64471,64472],1736:[64475,64476],1737:[64482,64483],1739:[64478,64479],1740:[64508,64509,64510,64511],1744:[64484,64485,64486,64487],1746:[64430,64431],1747:[64432,64433]},r={65247:{65154:65269,65156:65271,65160:65273,65166:65275},65248:{65154:65270,65156:65272,65160:65274,65166:65276},65165:{65247:{65248:{65258:65010}}},1617:{1612:64606,1613:64607,1614:64608,1615:64609,1616:64610}},n={1612:64606,1613:64607,1614:64608,1615:64609,1616:64610},i=[1570,1571,1573,1575];t.__arabicParser__={};var a=t.__arabicParser__.isInArabicSubstitutionA=function(t){return void 0!==e[t.charCodeAt(0)];},o=t.__arabicParser__.isArabicLetter=function(t){return "string"==typeof t&&/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(t);},s=t.__arabicParser__.isArabicEndLetter=function(t){return o(t)&&a(t)&&e[t.charCodeAt(0)].length<=2;},u=t.__arabicParser__.isArabicAlfLetter=function(t){return o(t)&&i.indexOf(t.charCodeAt(0))>=0;};t.__arabicParser__.arabicLetterHasIsolatedForm=function(t){return o(t)&&a(t)&&e[t.charCodeAt(0)].length>=1;};var c=t.__arabicParser__.arabicLetterHasFinalForm=function(t){return o(t)&&a(t)&&e[t.charCodeAt(0)].length>=2;};t.__arabicParser__.arabicLetterHasInitialForm=function(t){return o(t)&&a(t)&&e[t.charCodeAt(0)].length>=3;};var l=t.__arabicParser__.arabicLetterHasMedialForm=function(t){return o(t)&&a(t)&&4==e[t.charCodeAt(0)].length;},h=t.__arabicParser__.resolveLigatures=function(t){var e=0,n=r,i="",a=0;for(e=0;e<t.length;e+=1){void 0!==n[t.charCodeAt(e)]?(a++,"number"==typeof(n=n[t.charCodeAt(e)])&&(i+=String.fromCharCode(n),n=r,a=0),e===t.length-1&&(n=r,i+=t.charAt(e-(a-1)),e-=a-1,a=0)):(n=r,i+=t.charAt(e-a),e-=a,a=0);}return i;};t.__arabicParser__.isArabicDiacritic=function(t){return void 0!==t&&void 0!==n[t.charCodeAt(0)];};var f=t.__arabicParser__.getCorrectForm=function(t,e,r){return o(t)?!1===a(t)?-1:!c(t)||!o(e)&&!o(r)||!o(r)&&s(e)||s(t)&&!o(e)||s(t)&&u(e)||s(t)&&s(e)?0:l(t)&&o(e)&&!s(e)&&o(r)&&c(r)?3:s(t)||!o(r)?1:2:-1;},d=function d(t){var r=0,n=0,i=0,a="",s="",u="",c=(t=t||"").split("\\s+"),l=[];for(r=0;r<c.length;r+=1){for(l.push(""),n=0;n<c[r].length;n+=1){a=c[r][n],s=c[r][n-1],u=c[r][n+1],o(a)?(i=f(a,s,u),l[r]+=-1!==i?String.fromCharCode(e[a.charCodeAt(0)][i]):a):l[r]+=a;}l[r]=h(l[r]);}return l.join(" ");},p=t.__arabicParser__.processArabic=t.processArabic=function(){var t,e="string"==typeof arguments[0]?arguments[0]:arguments[0].text,r=[];if(Array.isArray(e)){var n=0;for(r=[],n=0;n<e.length;n+=1){Array.isArray(e[n])?r.push([d(e[n][0]),e[n][1],e[n][2]]):r.push([d(e[n])]);}t=r;}else t=d(e);return "string"==typeof arguments[0]?t:(arguments[0].text=t,arguments[0]);};t.events.push(["preProcessText",p]);}(O.API),O.API.autoPrint=function(t){var e;switch((t=t||{}).variant=t.variant||"non-conform",t.variant){case"javascript":this.addJS("print({});");break;case"non-conform":default:this.internal.events.subscribe("postPutResources",function(){e=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/S /Named"),this.internal.out("/Type /Action"),this.internal.out("/N /Print"),this.internal.out(">>"),this.internal.out("endobj");}),this.internal.events.subscribe("putCatalog",function(){this.internal.out("/OpenAction "+e+" 0 R");});}return this;},
/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){var e=function e(){var t=void 0;Object.defineProperty(this,"pdf",{get:function get(){return t;},set:function set(e){t=e;}});var e=150;Object.defineProperty(this,"width",{get:function get(){return e;},set:function set(t){e=isNaN(t)||!1===Number.isInteger(t)||t<0?150:t,this.getContext("2d").pageWrapXEnabled&&(this.getContext("2d").pageWrapX=e+1);}});var r=300;Object.defineProperty(this,"height",{get:function get(){return r;},set:function set(t){r=isNaN(t)||!1===Number.isInteger(t)||t<0?300:t,this.getContext("2d").pageWrapYEnabled&&(this.getContext("2d").pageWrapY=r+1);}});var n=[];Object.defineProperty(this,"childNodes",{get:function get(){return n;},set:function set(t){n=t;}});var i={};Object.defineProperty(this,"style",{get:function get(){return i;},set:function set(t){i=t;}}),Object.defineProperty(this,"parentNode",{});};e.prototype.getContext=function(t,e){var r;if("2d"!==(t=t||"2d"))return null;for(r in e){this.pdf.context2d.hasOwnProperty(r)&&(this.pdf.context2d[r]=e[r]);}return this.pdf.context2d._canvas=this,this.pdf.context2d;},e.prototype.toDataURL=function(){throw new Error("toDataURL is not implemented.");},t.events.push(["initialized",function(){this.canvas=new e(),this.canvas.pdf=this;}]);}(O.API),
/**
 * @license
 * ====================================================================
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
 *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Hall, james@parall.ax
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(t){var e={left:0,top:0,bottom:0,right:0},r=!1,n=function n(){void 0===this.internal.__cell__&&(this.internal.__cell__={},this.internal.__cell__.padding=3,this.internal.__cell__.headerFunction=void 0,this.internal.__cell__.margins=Object.assign({},e),this.internal.__cell__.margins.width=this.getPageWidth(),i.call(this));},i=function i(){this.internal.__cell__.lastCell=new a(),this.internal.__cell__.pages=1;},a=function a(){var t=arguments[0];Object.defineProperty(this,"x",{enumerable:!0,get:function get(){return t;},set:function set(e){t=e;}});var e=arguments[1];Object.defineProperty(this,"y",{enumerable:!0,get:function get(){return e;},set:function set(t){e=t;}});var r=arguments[2];Object.defineProperty(this,"width",{enumerable:!0,get:function get(){return r;},set:function set(t){r=t;}});var n=arguments[3];Object.defineProperty(this,"height",{enumerable:!0,get:function get(){return n;},set:function set(t){n=t;}});var i=arguments[4];Object.defineProperty(this,"text",{enumerable:!0,get:function get(){return i;},set:function set(t){i=t;}});var a=arguments[5];Object.defineProperty(this,"lineNumber",{enumerable:!0,get:function get(){return a;},set:function set(t){a=t;}});var o=arguments[6];return Object.defineProperty(this,"align",{enumerable:!0,get:function get(){return o;},set:function set(t){o=t;}}),this;};a.prototype.clone=function(){return new a(this.x,this.y,this.width,this.height,this.text,this.lineNumber,this.align);},a.prototype.toArray=function(){return [this.x,this.y,this.width,this.height,this.text,this.lineNumber,this.align];},t.setHeaderFunction=function(t){return n.call(this),this.internal.__cell__.headerFunction="function"==typeof t?t:void 0,this;},t.getTextDimensions=function(t,e){n.call(this);var r=(e=e||{}).fontSize||this.getFontSize(),i=e.font||this.getFont(),a=e.scaleFactor||this.internal.scaleFactor,o=0,s=0,u=0,c=this;if(!Array.isArray(t)&&"string"!=typeof t){if("number"!=typeof t)throw new Error("getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings.");t=String(t);}var l=e.maxWidth;l>0?"string"==typeof t?t=this.splitTextToSize(t,l):"[object Array]"===Object.prototype.toString.call(t)&&(t=t.reduce(function(t,e){return t.concat(c.splitTextToSize(e,l));},[])):t=Array.isArray(t)?t:[t];for(var h=0;h<t.length;h++){o<(u=this.getStringUnitWidth(t[h],{font:i})*r)&&(o=u);}return 0!==o&&(s=t.length),{w:o/=a,h:Math.max((s*r*this.getLineHeightFactor()-r*(this.getLineHeightFactor()-1))/a,0)};},t.cellAddPage=function(){n.call(this),this.addPage();var t=this.internal.__cell__.margins||e;return this.internal.__cell__.lastCell=new a(t.left,t.top,void 0,void 0),this.internal.__cell__.pages+=1,this;};var o=t.cell=function(){var t;t=arguments[0]instanceof a?arguments[0]:new a(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]),n.call(this);var i=this.internal.__cell__.lastCell,o=this.internal.__cell__.padding,s=this.internal.__cell__.margins||e,u=this.internal.__cell__.tableHeaderRow,c=this.internal.__cell__.printHeaders;return void 0!==i.lineNumber&&(i.lineNumber===t.lineNumber?(t.x=(i.x||0)+(i.width||0),t.y=i.y||0):i.y+i.height+t.height+s.bottom>this.getPageHeight()?(this.cellAddPage(),t.y=s.top,c&&u&&(this.printHeaderRow(t.lineNumber,!0),t.y+=u[0].height)):t.y=i.y+i.height||t.y),void 0!==t.text[0]&&(this.rect(t.x,t.y,t.width,t.height,!0===r?"FD":void 0),"right"===t.align?this.text(t.text,t.x+t.width-o,t.y+o,{align:"right",baseline:"top"}):"center"===t.align?this.text(t.text,t.x+t.width/2,t.y+o,{align:"center",baseline:"top",maxWidth:t.width-o-o}):this.text(t.text,t.x+o,t.y+o,{align:"left",baseline:"top",maxWidth:t.width-o-o})),this.internal.__cell__.lastCell=t,this;};t.table=function(t,r,u,c,l){if(n.call(this),!u)throw new Error("No data for PDF table.");var h,f,d,p,g=[],m=[],v=[],b={},y={},w=[],N=[],L=(l=l||{}).autoSize||!1,A=!1!==l.printHeaders,x=l.css&&void 0!==l.css["font-size"]?16*l.css["font-size"]:l.fontSize||12,S=l.margins||Object.assign({width:this.getPageWidth()},e),_="number"==typeof l.padding?l.padding:3,P=l.headerBackgroundColor||"#c8c8c8";if(i.call(this),this.internal.__cell__.printHeaders=A,this.internal.__cell__.margins=S,this.internal.__cell__.table_font_size=x,this.internal.__cell__.padding=_,this.internal.__cell__.headerBackgroundColor=P,this.setFontSize(x),null==c)m=g=Object.keys(u[0]),v=g.map(function(){return "left";});else if(Array.isArray(c)&&"object"==typeof c[0])for(g=c.map(function(t){return t.name;}),m=c.map(function(t){return t.prompt||t.name||"";}),v=c.map(function(t){return t.align||"left";}),h=0;h<c.length;h+=1){y[c[h].name]=c[h].width*(19.049976/25.4);}else Array.isArray(c)&&"string"==typeof c[0]&&(m=g=c,v=g.map(function(){return "left";}));if(L||Array.isArray(c)&&"string"==typeof c[0])for(h=0;h<g.length;h+=1){for(b[p=g[h]]=u.map(function(t){return t[p];}),this.setFont(void 0,"bold"),w.push(this.getTextDimensions(m[h],{fontSize:this.internal.__cell__.table_font_size,scaleFactor:this.internal.scaleFactor}).w),f=b[p],this.setFont(void 0,"normal"),d=0;d<f.length;d+=1){w.push(this.getTextDimensions(f[d],{fontSize:this.internal.__cell__.table_font_size,scaleFactor:this.internal.scaleFactor}).w);}y[p]=Math.max.apply(null,w)+_+_,w=[];}if(A){var k={};for(h=0;h<g.length;h+=1){k[g[h]]={},k[g[h]].text=m[h],k[g[h]].align=v[h];}var I=s.call(this,k,y);N=g.map(function(e){return new a(t,r,y[e],I,k[e].text,void 0,k[e].align);}),this.setTableHeaderRow(N),this.printHeaderRow(1,!1);}var F=c.reduce(function(t,e){return t[e.name]=e.align,t;},{});for(h=0;h<u.length;h+=1){var C=s.call(this,u[h],y);for(d=0;d<g.length;d+=1){o.call(this,new a(t,r,y[g[d]],C,u[h][g[d]],h+2,F[g[d]]));}}return this.internal.__cell__.table_x=t,this.internal.__cell__.table_y=r,this;};var s=function s(t,e){var r=this.internal.__cell__.padding,n=this.internal.__cell__.table_font_size,i=this.internal.scaleFactor;return Object.keys(t).map(function(n){var i=t[n];return this.splitTextToSize(i.hasOwnProperty("text")?i.text:i,e[n]-r-r);},this).map(function(t){return this.getLineHeightFactor()*t.length*n/i+r+r;},this).reduce(function(t,e){return Math.max(t,e);},0);};t.setTableHeaderRow=function(t){n.call(this),this.internal.__cell__.tableHeaderRow=t;},t.printHeaderRow=function(t,e){if(n.call(this),!this.internal.__cell__.tableHeaderRow)throw new Error("Property tableHeaderRow does not exist.");var i;if(r=!0,"function"==typeof this.internal.__cell__.headerFunction){var s=this.internal.__cell__.headerFunction(this,this.internal.__cell__.pages);this.internal.__cell__.lastCell=new a(s[0],s[1],s[2],s[3],void 0,-1);}this.setFont(void 0,"bold");for(var u=[],c=0;c<this.internal.__cell__.tableHeaderRow.length;c+=1){i=this.internal.__cell__.tableHeaderRow[c].clone(),e&&(i.y=this.internal.__cell__.margins.top||0,u.push(i)),i.lineNumber=t,this.setFillColor(this.internal.__cell__.headerBackgroundColor),o.call(this,i);}u.length>0&&this.setTableHeaderRow(u),this.setFont(void 0,"normal"),r=!1;};}(O.API);var xt={italic:["italic","oblique","normal"],oblique:["oblique","italic","normal"],normal:["normal","oblique","italic"]},St=["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded"],_t=At(St),Pt=[100,200,300,400,500,600,700,800,900],kt=At(Pt);function It(t){var e=t.family.replace(/"|'/g,"").toLowerCase(),r=function(t){return xt[t=t||"normal"]?t:"normal";}(t.style),n=function(t){if(!t)return 400;if("number"==typeof t)return t>=100&&t<=900&&t%100==0?t:400;if(/^\d00$/.test(t))return parseInt(t);switch(t){case"bold":return 700;case"normal":default:return 400;}}(t.weight),i=function(t){return "number"==typeof _t[t=t||"normal"]?t:"normal";}(t.stretch);return {family:e,style:r,weight:n,stretch:i,src:t.src||[],ref:t.ref||{name:e,style:[i,r,n].join(" ")}};}function Ft(t,e,r,n){var i;for(i=r;i>=0&&i<e.length;i+=n){if(t[e[i]])return t[e[i]];}for(i=r;i>=0&&i<e.length;i-=n){if(t[e[i]])return t[e[i]];}}var Ct={"sans-serif":"helvetica",fixed:"courier",monospace:"courier",terminal:"courier",cursive:"times",fantasy:"times",serif:"times"},jt={caption:"times",icon:"times",menu:"times","message-box":"times","small-caption":"times","status-bar":"times"};function Ot(t){return [t.stretch,t.style,t.weight,t.family].join(" ");}function Bt(t,e,r){for(var n=(r=r||{}).defaultFontFamily||"times",i=Object.assign({},Ct,r.genericFontFamilies||{}),a=null,o=null,s=0;s<e.length;++s){if(i[(a=It(e[s])).family]&&(a.family=i[a.family]),t.hasOwnProperty(a.family)){o=t[a.family];break;}}if(!(o=o||t[n]))throw new Error("Could not find a font-family for the rule '"+Ot(a)+"' and default family '"+n+"'.");if(o=function(t,e){if(e[t])return e[t];var r=_t[t],n=r<=_t.normal?-1:1,i=Ft(e,St,r,n);if(!i)throw new Error("Could not find a matching font-stretch value for "+t);return i;}(a.stretch,o),o=function(t,e){if(e[t])return e[t];for(var r=xt[t],n=0;n<r.length;++n){if(e[r[n]])return e[r[n]];}throw new Error("Could not find a matching font-style for "+t);}(a.style,o),!(o=function(t,e){if(e[t])return e[t];if(400===t&&e[500])return e[500];if(500===t&&e[400])return e[400];var r=kt[t],n=Ft(e,Pt,r,t<400?-1:1);if(!n)throw new Error("Could not find a matching font-weight for value "+t);return n;}(a.weight,o)))throw new Error("Failed to resolve a font for the rule '"+Ot(a)+"'.");return o;}function Mt(t){return t.trimLeft();}function Et(t,e){for(var r=0;r<t.length;){if(t.charAt(r)===e)return [t.substring(0,r),t.substring(r+1)];r+=1;}return null;}function qt(t){var e=t.match(/^(-[a-z_]|[a-z_])[a-z0-9_-]*/i);return null===e?null:[e[0],t.substring(e[0].length)];}var Rt,Tt,Dt,Ut=["times"];!function(t){var e,r,n,a,o,s,u,c,l,f=function f(t){return t=t||{},this.isStrokeTransparent=t.isStrokeTransparent||!1,this.strokeOpacity=t.strokeOpacity||1,this.strokeStyle=t.strokeStyle||"#000000",this.fillStyle=t.fillStyle||"#000000",this.isFillTransparent=t.isFillTransparent||!1,this.fillOpacity=t.fillOpacity||1,this.font=t.font||"10px sans-serif",this.textBaseline=t.textBaseline||"alphabetic",this.textAlign=t.textAlign||"left",this.lineWidth=t.lineWidth||1,this.lineJoin=t.lineJoin||"miter",this.lineCap=t.lineCap||"butt",this.path=t.path||[],this.transform=void 0!==t.transform?t.transform.clone():new c(),this.globalCompositeOperation=t.globalCompositeOperation||"normal",this.globalAlpha=t.globalAlpha||1,this.clip_path=t.clip_path||[],this.currentPoint=t.currentPoint||new s(),this.miterLimit=t.miterLimit||10,this.lastPoint=t.lastPoint||new s(),this.ignoreClearRect="boolean"!=typeof t.ignoreClearRect||t.ignoreClearRect,this;};t.events.push(["initialized",function(){this.context2d=new d(this),e=this.internal.f2,r=this.internal.getCoordinateString,n=this.internal.getVerticalCoordinateString,a=this.internal.getHorizontalCoordinate,o=this.internal.getVerticalCoordinate,s=this.internal.Point,u=this.internal.Rectangle,c=this.internal.Matrix,l=new f();}]);var d=function d(t){Object.defineProperty(this,"canvas",{get:function get(){return {parentNode:!1,style:!1};}});var e=t;Object.defineProperty(this,"pdf",{get:function get(){return e;}});var r=!1;Object.defineProperty(this,"pageWrapXEnabled",{get:function get(){return r;},set:function set(t){r=Boolean(t);}});var n=!1;Object.defineProperty(this,"pageWrapYEnabled",{get:function get(){return n;},set:function set(t){n=Boolean(t);}});var i=0;Object.defineProperty(this,"posX",{get:function get(){return i;},set:function set(t){isNaN(t)||(i=t);}});var a=0;Object.defineProperty(this,"posY",{get:function get(){return a;},set:function set(t){isNaN(t)||(a=t);}});var o=!1;Object.defineProperty(this,"autoPaging",{get:function get(){return o;},set:function set(t){o=Boolean(t);}});var s=0;Object.defineProperty(this,"lastBreak",{get:function get(){return s;},set:function set(t){s=t;}});var u=[];Object.defineProperty(this,"pageBreaks",{get:function get(){return u;},set:function set(t){u=t;}}),Object.defineProperty(this,"ctx",{get:function get(){return l;},set:function set(t){t instanceof f&&(l=t);}}),Object.defineProperty(this,"path",{get:function get(){return l.path;},set:function set(t){l.path=t;}});var c=[];Object.defineProperty(this,"ctxStack",{get:function get(){return c;},set:function set(t){c=t;}}),Object.defineProperty(this,"fillStyle",{get:function get(){return this.ctx.fillStyle;},set:function set(t){var e;e=p(t),this.ctx.fillStyle=e.style,this.ctx.isFillTransparent=0===e.a,this.ctx.fillOpacity=e.a,this.pdf.setFillColor(e.r,e.g,e.b,{a:e.a}),this.pdf.setTextColor(e.r,e.g,e.b,{a:e.a});}}),Object.defineProperty(this,"strokeStyle",{get:function get(){return this.ctx.strokeStyle;},set:function set(t){var e=p(t);this.ctx.strokeStyle=e.style,this.ctx.isStrokeTransparent=0===e.a,this.ctx.strokeOpacity=e.a,0===e.a?this.pdf.setDrawColor(255,255,255):(e.a,this.pdf.setDrawColor(e.r,e.g,e.b));}}),Object.defineProperty(this,"lineCap",{get:function get(){return this.ctx.lineCap;},set:function set(t){-1!==["butt","round","square"].indexOf(t)&&(this.ctx.lineCap=t,this.pdf.setLineCap(t));}}),Object.defineProperty(this,"lineWidth",{get:function get(){return this.ctx.lineWidth;},set:function set(t){isNaN(t)||(this.ctx.lineWidth=t,this.pdf.setLineWidth(t));}}),Object.defineProperty(this,"lineJoin",{get:function get(){return this.ctx.lineJoin;},set:function set(t){-1!==["bevel","round","miter"].indexOf(t)&&(this.ctx.lineJoin=t,this.pdf.setLineJoin(t));}}),Object.defineProperty(this,"miterLimit",{get:function get(){return this.ctx.miterLimit;},set:function set(t){isNaN(t)||(this.ctx.miterLimit=t,this.pdf.setMiterLimit(t));}}),Object.defineProperty(this,"textBaseline",{get:function get(){return this.ctx.textBaseline;},set:function set(t){this.ctx.textBaseline=t;}}),Object.defineProperty(this,"textAlign",{get:function get(){return this.ctx.textAlign;},set:function set(t){-1!==["right","end","center","left","start"].indexOf(t)&&(this.ctx.textAlign=t);}});var h=null;function d(t,e){if(null===h){var r=function(t){var e=[];return Object.keys(t).forEach(function(r){t[r].forEach(function(t){var n=null;switch(t){case"bold":n={family:r,weight:"bold"};break;case"italic":n={family:r,style:"italic"};break;case"bolditalic":n={family:r,weight:"bold",style:"italic"};break;case"":case"normal":n={family:r};}null!==n&&(n.ref={name:r,style:t},e.push(n));});}),e;}(t.getFontList());h=function(t){for(var e={},r=0;r<t.length;++r){var n=It(t[r]),i=n.family,a=n.stretch,o=n.style,s=n.weight;e[i]=e[i]||{},e[i][a]=e[i][a]||{},e[i][a][o]=e[i][a][o]||{},e[i][a][o][s]=n;}return e;}(r.concat(e));}return h;}var g=null;Object.defineProperty(this,"fontFaces",{get:function get(){return g;},set:function set(t){h=null,g=t;}}),Object.defineProperty(this,"font",{get:function get(){return this.ctx.font;},set:function set(t){var e;if(this.ctx.font=t,null!==(e=/^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i.exec(t))){var r=e[1],n=(e[2],e[3]),i=e[4],a=(e[5],e[6]),o=/^([.\d]+)((?:%|in|[cem]m|ex|p[ctx]))$/i.exec(i)[2];i="px"===o?Math.floor(parseFloat(i)*this.pdf.internal.scaleFactor):"em"===o?Math.floor(parseFloat(i)*this.pdf.getFontSize()):Math.floor(parseFloat(i)*this.pdf.internal.scaleFactor),this.pdf.setFontSize(i);var s=function(t){var e,r,n=[],i=t.trim();if(""===i)return Ut;if(i in jt)return [jt[i]];for(;""!==i;){switch(r=null,e=(i=Mt(i)).charAt(0)){case'"':case"'":r=Et(i.substring(1),e);break;default:r=qt(i);}if(null===r)return Ut;if(n.push(r[0]),""!==(i=Mt(r[1]))&&","!==i.charAt(0))return Ut;i=i.replace(/^,/,"");}return n;}(a);if(this.fontFaces){var u=Bt(d(this.pdf,this.fontFaces),s.map(function(t){return {family:t,stretch:"normal",weight:n,style:r};}));this.pdf.setFont(u.ref.name,u.ref.style);}else {var c="";("bold"===n||parseInt(n,10)>=700||"bold"===r)&&(c="bold"),"italic"===r&&(c+="italic"),0===c.length&&(c="normal");for(var l="",h={arial:"Helvetica",Arial:"Helvetica",verdana:"Helvetica",Verdana:"Helvetica",helvetica:"Helvetica",Helvetica:"Helvetica","sans-serif":"Helvetica",fixed:"Courier",monospace:"Courier",terminal:"Courier",cursive:"Times",fantasy:"Times",serif:"Times"},f=0;f<s.length;f++){if(void 0!==this.pdf.internal.getFont(s[f],c,{noFallback:!0,disableWarning:!0})){l=s[f];break;}if("bolditalic"===c&&void 0!==this.pdf.internal.getFont(s[f],"bold",{noFallback:!0,disableWarning:!0}))l=s[f],c="bold";else if(void 0!==this.pdf.internal.getFont(s[f],"normal",{noFallback:!0,disableWarning:!0})){l=s[f],c="normal";break;}}if(""===l)for(var p=0;p<s.length;p++){if(h[s[p]]){l=h[s[p]];break;}}l=""===l?"Times":l,this.pdf.setFont(l,c);}}}}),Object.defineProperty(this,"globalCompositeOperation",{get:function get(){return this.ctx.globalCompositeOperation;},set:function set(t){this.ctx.globalCompositeOperation=t;}}),Object.defineProperty(this,"globalAlpha",{get:function get(){return this.ctx.globalAlpha;},set:function set(t){this.ctx.globalAlpha=t;}}),Object.defineProperty(this,"ignoreClearRect",{get:function get(){return this.ctx.ignoreClearRect;},set:function set(t){this.ctx.ignoreClearRect=Boolean(t);}});};d.prototype.fill=function(){N.call(this,"fill",!1);},d.prototype.stroke=function(){N.call(this,"stroke",!1);},d.prototype.beginPath=function(){this.path=[{type:"begin"}];},d.prototype.moveTo=function(t,e){if(isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.moveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.moveTo");var r=this.ctx.transform.applyToPoint(new s(t,e));this.path.push({type:"mt",x:r.x,y:r.y}),this.ctx.lastPoint=new s(t,e);},d.prototype.closePath=function(){var t=new s(0,0),e=0;for(e=this.path.length-1;-1!==e;e--){if("begin"===this.path[e].type&&"object"==typeof this.path[e+1]&&"number"==typeof this.path[e+1].x){t=new s(this.path[e+1].x,this.path[e+1].y),this.path.push({type:"lt",x:t.x,y:t.y});break;}}"object"==typeof this.path[e+2]&&"number"==typeof this.path[e+2].x&&this.path.push(JSON.parse(JSON.stringify(this.path[e+2]))),this.path.push({type:"close"}),this.ctx.lastPoint=new s(t.x,t.y);},d.prototype.lineTo=function(t,e){if(isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.lineTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.lineTo");var r=this.ctx.transform.applyToPoint(new s(t,e));this.path.push({type:"lt",x:r.x,y:r.y}),this.ctx.lastPoint=new s(r.x,r.y);},d.prototype.clip=function(){this.ctx.clip_path=JSON.parse(JSON.stringify(this.path)),N.call(this,null,!0);},d.prototype.quadraticCurveTo=function(t,e,r,n){if(isNaN(r)||isNaN(n)||isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.quadraticCurveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo");var a=this.ctx.transform.applyToPoint(new s(r,n)),o=this.ctx.transform.applyToPoint(new s(t,e));this.path.push({type:"qct",x1:o.x,y1:o.y,x:a.x,y:a.y}),this.ctx.lastPoint=new s(a.x,a.y);},d.prototype.bezierCurveTo=function(t,e,r,n,a,o){if(isNaN(a)||isNaN(o)||isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.bezierCurveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo");var u=this.ctx.transform.applyToPoint(new s(a,o)),c=this.ctx.transform.applyToPoint(new s(t,e)),l=this.ctx.transform.applyToPoint(new s(r,n));this.path.push({type:"bct",x1:c.x,y1:c.y,x2:l.x,y2:l.y,x:u.x,y:u.y}),this.ctx.lastPoint=new s(u.x,u.y);},d.prototype.arc=function(t,e,r,n,a,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(a))throw i.error("jsPDF.context2d.arc: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.arc");if(o=Boolean(o),!this.ctx.transform.isIdentity){var u=this.ctx.transform.applyToPoint(new s(t,e));t=u.x,e=u.y;var c=this.ctx.transform.applyToPoint(new s(0,r)),l=this.ctx.transform.applyToPoint(new s(0,0));r=Math.sqrt(Math.pow(c.x-l.x,2)+Math.pow(c.y-l.y,2));}Math.abs(a-n)>=2*Math.PI&&(n=0,a=2*Math.PI),this.path.push({type:"arc",x:t,y:e,radius:r,startAngle:n,endAngle:a,counterclockwise:o});},d.prototype.arcTo=function(t,e,r,n,i){throw new Error("arcTo not implemented.");},d.prototype.rect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.rect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.rect");this.moveTo(t,e),this.lineTo(t+r,e),this.lineTo(t+r,e+n),this.lineTo(t,e+n),this.lineTo(t,e),this.lineTo(t+r,e),this.lineTo(t,e);},d.prototype.fillRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.fillRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.fillRect");if(!g.call(this)){var a={};"butt"!==this.lineCap&&(a.lineCap=this.lineCap,this.lineCap="butt"),"miter"!==this.lineJoin&&(a.lineJoin=this.lineJoin,this.lineJoin="miter"),this.beginPath(),this.rect(t,e,r,n),this.fill(),a.hasOwnProperty("lineCap")&&(this.lineCap=a.lineCap),a.hasOwnProperty("lineJoin")&&(this.lineJoin=a.lineJoin);}},d.prototype.strokeRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.strokeRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");m.call(this)||(this.beginPath(),this.rect(t,e,r,n),this.stroke());},d.prototype.clearRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.clearRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.clearRect");this.ignoreClearRect||(this.fillStyle="#ffffff",this.fillRect(t,e,r,n));},d.prototype.save=function(t){t="boolean"!=typeof t||t;for(var e=this.pdf.internal.getCurrentPageInfo().pageNumber,r=0;r<this.pdf.internal.getNumberOfPages();r++){this.pdf.setPage(r+1),this.pdf.internal.out("q");}if(this.pdf.setPage(e),t){this.ctx.fontSize=this.pdf.internal.getFontSize();var n=new f(this.ctx);this.ctxStack.push(this.ctx),this.ctx=n;}},d.prototype.restore=function(t){t="boolean"!=typeof t||t;for(var e=this.pdf.internal.getCurrentPageInfo().pageNumber,r=0;r<this.pdf.internal.getNumberOfPages();r++){this.pdf.setPage(r+1),this.pdf.internal.out("Q");}this.pdf.setPage(e),t&&0!==this.ctxStack.length&&(this.ctx=this.ctxStack.pop(),this.fillStyle=this.ctx.fillStyle,this.strokeStyle=this.ctx.strokeStyle,this.font=this.ctx.font,this.lineCap=this.ctx.lineCap,this.lineWidth=this.ctx.lineWidth,this.lineJoin=this.ctx.lineJoin);},d.prototype.toDataURL=function(){throw new Error("toDataUrl not implemented.");};var p=function p(t){var e,r,n,i;if(!0===t.isCanvasGradient&&(t=t.getColor()),!t)return {r:0,g:0,b:0,a:0,style:t};if(/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/.test(t))e=0,r=0,n=0,i=0;else {var a=/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(t);if(null!==a)e=parseInt(a[1]),r=parseInt(a[2]),n=parseInt(a[3]),i=1;else if(null!==(a=/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/.exec(t)))e=parseInt(a[1]),r=parseInt(a[2]),n=parseInt(a[3]),i=parseFloat(a[4]);else {if(i=1,"string"==typeof t&&"#"!==t.charAt(0)){var o=new h(t);t=o.ok?o.toHex():"#000000";}4===t.length?(e=t.substring(1,2),e+=e,r=t.substring(2,3),r+=r,n=t.substring(3,4),n+=n):(e=t.substring(1,3),r=t.substring(3,5),n=t.substring(5,7)),e=parseInt(e,16),r=parseInt(r,16),n=parseInt(n,16);}}return {r:e,g:r,b:n,a:i,style:t};},g=function g(){return this.ctx.isFillTransparent||0==this.globalAlpha;},m=function m(){return Boolean(this.ctx.isStrokeTransparent||0==this.globalAlpha);};d.prototype.fillText=function(t,e,r,n){if(isNaN(e)||isNaN(r)||"string"!=typeof t)throw i.error("jsPDF.context2d.fillText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.fillText");if(n=isNaN(n)?void 0:n,!g.call(this)){r=A.call(this,r);var a=B(this.ctx.transform.rotation),o=this.ctx.transform.scaleX;k.call(this,{text:t,x:e,y:r,scale:o,angle:a,align:this.textAlign,maxWidth:n});}},d.prototype.strokeText=function(t,e,r,n){if(isNaN(e)||isNaN(r)||"string"!=typeof t)throw i.error("jsPDF.context2d.strokeText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.strokeText");if(!m.call(this)){n=isNaN(n)?void 0:n,r=A.call(this,r);var a=B(this.ctx.transform.rotation),o=this.ctx.transform.scaleX;k.call(this,{text:t,x:e,y:r,scale:o,renderingMode:"stroke",angle:a,align:this.textAlign,maxWidth:n});}},d.prototype.measureText=function(t){if("string"!=typeof t)throw i.error("jsPDF.context2d.measureText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.measureText");var e=this.pdf,r=this.pdf.internal.scaleFactor,n=e.internal.getFontSize(),a=e.getStringUnitWidth(t)*n/e.internal.scaleFactor,o=function o(t){var e=(t=t||{}).width||0;return Object.defineProperty(this,"width",{get:function get(){return e;}}),this;};return new o({width:a*=Math.round(96*r/72*1e4)/1e4});},d.prototype.scale=function(t,e){if(isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.scale: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.scale");var r=new c(t,0,0,e,0,0);this.ctx.transform=this.ctx.transform.multiply(r);},d.prototype.rotate=function(t){if(isNaN(t))throw i.error("jsPDF.context2d.rotate: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.rotate");var e=new c(Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0);this.ctx.transform=this.ctx.transform.multiply(e);},d.prototype.translate=function(t,e){if(isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.translate: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.translate");var r=new c(1,0,0,1,t,e);this.ctx.transform=this.ctx.transform.multiply(r);},d.prototype.transform=function(t,e,r,n,a,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(a)||isNaN(o))throw i.error("jsPDF.context2d.transform: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.transform");var s=new c(t,e,r,n,a,o);this.ctx.transform=this.ctx.transform.multiply(s);},d.prototype.setTransform=function(t,e,r,n,i,a){t=isNaN(t)?1:t,e=isNaN(e)?0:e,r=isNaN(r)?0:r,n=isNaN(n)?1:n,i=isNaN(i)?0:i,a=isNaN(a)?0:a,this.ctx.transform=new c(t,e,r,n,i,a);},d.prototype.drawImage=function(t,e,r,n,i,a,o,s,l){var h=this.pdf.getImageProperties(t),f=1,d=1,p=1,g=1;void 0!==n&&void 0!==s&&(p=s/n,g=l/i,f=h.width/n*s/n,d=h.height/i*l/i),void 0===a&&(a=e,o=r,e=0,r=0),void 0!==n&&void 0===s&&(s=n,l=i),void 0===n&&void 0===s&&(s=h.width,l=h.height);for(var m,b=this.ctx.transform.decompose(),N=B(b.rotate.shx),A=new c(),x=(A=(A=(A=A.multiply(b.translate)).multiply(b.skew)).multiply(b.scale)).applyToRectangle(new u(a-e*p,o-r*g,n*f,i*d)),S=v.call(this,x),_=[],P=0;P<S.length;P+=1){-1===_.indexOf(S[P])&&_.push(S[P]);}if(w(_),this.autoPaging)for(var k=_[0],I=_[_.length-1],F=k;F<I+1;F++){if(this.pdf.setPage(F),0!==this.ctx.clip_path.length){var C=this.path;m=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=y(m,this.posX,-1*this.pdf.internal.pageSize.height*(F-1)+this.posY),L.call(this,"fill",!0),this.path=C;}var j=JSON.parse(JSON.stringify(x));j=y([j],this.posX,-1*this.pdf.internal.pageSize.height*(F-1)+this.posY)[0],this.pdf.addImage(t,"JPEG",j.x,j.y,j.w,j.h,null,null,N);}else this.pdf.addImage(t,"JPEG",x.x,x.y,x.w,x.h,null,null,N);};var v=function v(t,e,r){var n=[];switch(e=e||this.pdf.internal.pageSize.width,r=r||this.pdf.internal.pageSize.height,t.type){default:case"mt":case"lt":n.push(Math.floor((t.y+this.posY)/r)+1);break;case"arc":n.push(Math.floor((t.y+this.posY-t.radius)/r)+1),n.push(Math.floor((t.y+this.posY+t.radius)/r)+1);break;case"qct":var i=M(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x,t.y);n.push(Math.floor(i.y/r)+1),n.push(Math.floor((i.y+i.h)/r)+1);break;case"bct":var a=E(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x2,t.y2,t.x,t.y);n.push(Math.floor(a.y/r)+1),n.push(Math.floor((a.y+a.h)/r)+1);break;case"rect":n.push(Math.floor((t.y+this.posY)/r)+1),n.push(Math.floor((t.y+t.h+this.posY)/r)+1);}for(var o=0;o<n.length;o+=1){for(;this.pdf.internal.getNumberOfPages()<n[o];){b.call(this);}}return n;},b=function b(){var t=this.fillStyle,e=this.strokeStyle,r=this.font,n=this.lineCap,i=this.lineWidth,a=this.lineJoin;this.pdf.addPage(),this.fillStyle=t,this.strokeStyle=e,this.font=r,this.lineCap=n,this.lineWidth=i,this.lineJoin=a;},y=function y(t,e,r){for(var n=0;n<t.length;n++){switch(t[n].type){case"bct":t[n].x2+=e,t[n].y2+=r;case"qct":t[n].x1+=e,t[n].y1+=r;case"mt":case"lt":case"arc":default:t[n].x+=e,t[n].y+=r;}}return t;},w=function w(t){return t.sort(function(t,e){return t-e;});},N=function N(t,e){for(var r,n,i=this.fillStyle,a=this.strokeStyle,o=this.lineCap,s=this.lineWidth,u=s*this.ctx.transform.scaleX,c=this.lineJoin,l=JSON.parse(JSON.stringify(this.path)),h=JSON.parse(JSON.stringify(this.path)),f=[],d=0;d<h.length;d++){if(void 0!==h[d].x)for(var p=v.call(this,h[d]),g=0;g<p.length;g+=1){-1===f.indexOf(p[g])&&f.push(p[g]);}}for(var m=0;m<f.length;m++){for(;this.pdf.internal.getNumberOfPages()<f[m];){b.call(this);}}if(w(f),this.autoPaging)for(var N=f[0],A=f[f.length-1],x=N;x<A+1;x++){if(this.pdf.setPage(x),this.fillStyle=i,this.strokeStyle=a,this.lineCap=o,this.lineWidth=u,this.lineJoin=c,0!==this.ctx.clip_path.length){var S=this.path;r=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=y(r,this.posX,-1*this.pdf.internal.pageSize.height*(x-1)+this.posY),L.call(this,t,!0),this.path=S;}n=JSON.parse(JSON.stringify(l)),this.path=y(n,this.posX,-1*this.pdf.internal.pageSize.height*(x-1)+this.posY),!1!==e&&0!==x||L.call(this,t,e),this.lineWidth=s;}else this.lineWidth=u,L.call(this,t,e),this.lineWidth=s;this.path=l;},L=function L(t,e){if(("stroke"!==t||e||!m.call(this))&&("stroke"===t||e||!g.call(this))){for(var r,n,i=[],a=this.path,o=0;o<a.length;o++){var s=a[o];switch(s.type){case"begin":i.push({begin:!0});break;case"close":i.push({close:!0});break;case"mt":i.push({start:s,deltas:[],abs:[]});break;case"lt":var u=i.length;if(!isNaN(a[o-1].x)&&(r=[s.x-a[o-1].x,s.y-a[o-1].y],u>0))for(;u>=0;u--){if(!0!==i[u-1].close&&!0!==i[u-1].begin){i[u-1].deltas.push(r),i[u-1].abs.push(s);break;}}break;case"bct":r=[s.x1-a[o-1].x,s.y1-a[o-1].y,s.x2-a[o-1].x,s.y2-a[o-1].y,s.x-a[o-1].x,s.y-a[o-1].y],i[i.length-1].deltas.push(r);break;case"qct":var c=a[o-1].x+2/3*(s.x1-a[o-1].x),l=a[o-1].y+2/3*(s.y1-a[o-1].y),h=s.x+2/3*(s.x1-s.x),f=s.y+2/3*(s.y1-s.y),d=s.x,p=s.y;r=[c-a[o-1].x,l-a[o-1].y,h-a[o-1].x,f-a[o-1].y,d-a[o-1].x,p-a[o-1].y],i[i.length-1].deltas.push(r);break;case"arc":i.push({deltas:[],abs:[],arc:!0}),Array.isArray(i[i.length-1].abs)&&i[i.length-1].abs.push(s);}}n=e?null:"stroke"===t?"stroke":"fill";for(var v=0;v<i.length;v++){if(i[v].arc){for(var b=i[v].abs,y=0;y<b.length;y++){var w=b[y];"arc"===w.type?x.call(this,w.x,w.y,w.radius,w.startAngle,w.endAngle,w.counterclockwise,void 0,e):I.call(this,w.x,w.y);}S.call(this,n),this.pdf.internal.out("h");}if(!i[v].arc&&!0!==i[v].close&&!0!==i[v].begin){var N=i[v].start.x,L=i[v].start.y;F.call(this,i[v].deltas,N,L);}}n&&S.call(this,n),e&&_.call(this);}},A=function A(t){var e=this.pdf.internal.getFontSize()/this.pdf.internal.scaleFactor,r=e*(this.pdf.internal.getLineHeightFactor()-1);switch(this.ctx.textBaseline){case"bottom":return t-r;case"top":return t+e-r;case"hanging":return t+e-2*r;case"middle":return t+e/2-r;case"ideographic":return t;case"alphabetic":default:return t;}};d.prototype.createLinearGradient=function(){var t=function t(){};return t.colorStops=[],t.addColorStop=function(t,e){this.colorStops.push([t,e]);},t.getColor=function(){return 0===this.colorStops.length?"#000000":this.colorStops[0][1];},t.isCanvasGradient=!0,t;},d.prototype.createPattern=function(){return this.createLinearGradient();},d.prototype.createRadialGradient=function(){return this.createLinearGradient();};var x=function x(t,e,r,n,i,a,o,s){for(var u=j.call(this,r,n,i,a),c=0;c<u.length;c++){var l=u[c];0===c&&P.call(this,l.x1+t,l.y1+e),C.call(this,t,e,l.x2,l.y2,l.x3,l.y3,l.x4,l.y4);}s?_.call(this):S.call(this,o);},S=function S(t){switch(t){case"stroke":this.pdf.internal.out("S");break;case"fill":this.pdf.internal.out("f");}},_=function _(){this.pdf.clip(),this.pdf.discardPath();},P=function P(t,e){this.pdf.internal.out(r(t)+" "+n(e)+" m");},k=function k(t){var e;switch(t.align){case"right":case"end":e="right";break;case"center":e="center";break;case"left":case"start":default:e="left";}var r=this.ctx.transform.applyToPoint(new s(t.x,t.y)),n=this.ctx.transform.decompose(),i=new c();i=(i=(i=i.multiply(n.translate)).multiply(n.skew)).multiply(n.scale);for(var a,o,l,h=this.pdf.getTextDimensions(t.text),f=this.ctx.transform.applyToRectangle(new u(t.x,t.y,h.w,h.h)),d=i.applyToRectangle(new u(t.x,t.y-h.h,h.w,h.h)),p=v.call(this,d),g=[],m=0;m<p.length;m+=1){-1===g.indexOf(p[m])&&g.push(p[m]);}if(w(g),!0===this.autoPaging)for(var b=g[0],N=g[g.length-1],A=b;A<N+1;A++){if(this.pdf.setPage(A),0!==this.ctx.clip_path.length){var x=this.path;a=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=y(a,this.posX,-1*this.pdf.internal.pageSize.height*(A-1)+this.posY),L.call(this,"fill",!0),this.path=x;}var S=JSON.parse(JSON.stringify(f));S=y([S],this.posX,-1*this.pdf.internal.pageSize.height*(A-1)+this.posY)[0],t.scale>=.01&&(o=this.pdf.internal.getFontSize(),this.pdf.setFontSize(o*t.scale),l=this.lineWidth,this.lineWidth=l*t.scale),this.pdf.text(t.text,S.x,S.y,{angle:t.angle,align:e,renderingMode:t.renderingMode,maxWidth:t.maxWidth}),t.scale>=.01&&(this.pdf.setFontSize(o),this.lineWidth=l);}else t.scale>=.01&&(o=this.pdf.internal.getFontSize(),this.pdf.setFontSize(o*t.scale),l=this.lineWidth,this.lineWidth=l*t.scale),this.pdf.text(t.text,r.x+this.posX,r.y+this.posY,{angle:t.angle,align:e,renderingMode:t.renderingMode,maxWidth:t.maxWidth}),t.scale>=.01&&(this.pdf.setFontSize(o),this.lineWidth=l);},I=function I(t,e,i,a){i=i||0,a=a||0,this.pdf.internal.out(r(t+i)+" "+n(e+a)+" l");},F=function F(t,e,r){return this.pdf.lines(t,e,r,null,null);},C=function C(t,r,n,i,s,u,c,l){this.pdf.internal.out([e(a(n+t)),e(o(i+r)),e(a(s+t)),e(o(u+r)),e(a(c+t)),e(o(l+r)),"c"].join(" "));},j=function j(t,e,r,n){for(var i=2*Math.PI,a=Math.PI/2;e>r;){e-=i;}var o=Math.abs(r-e);o<i&&n&&(o=i-o);for(var s=[],u=n?-1:1,c=e;o>1e-5;){var l=c+u*Math.min(o,a);s.push(O.call(this,t,c,l)),o-=Math.abs(l-c),c=l;}return s;},O=function O(t,e,r){var n=(r-e)/2,i=t*Math.cos(n),a=t*Math.sin(n),o=i,s=-a,u=o*o+s*s,c=u+o*i+s*a,l=4/3*(Math.sqrt(2*u*c)-c)/(o*a-s*i),h=o-l*s,f=s+l*o,d=h,p=-f,g=n+e,m=Math.cos(g),v=Math.sin(g);return {x1:t*Math.cos(e),y1:t*Math.sin(e),x2:h*m-f*v,y2:h*v+f*m,x3:d*m-p*v,y3:d*v+p*m,x4:t*Math.cos(r),y4:t*Math.sin(r)};},B=function B(t){return 180*t/Math.PI;},M=function M(t,e,r,n,i,a){var o=t+.5*(r-t),s=e+.5*(n-e),c=i+.5*(r-i),l=a+.5*(n-a),h=Math.min(t,i,o,c),f=Math.max(t,i,o,c),d=Math.min(e,a,s,l),p=Math.max(e,a,s,l);return new u(h,d,f-h,p-d);},E=function E(t,e,r,n,i,a,o,s){var c,l,h,f,d,p,g,m,v,b,y,w,N,L,A=r-t,x=n-e,S=i-r,_=a-n,P=o-i,k=s-a;for(l=0;l<41;l++){v=(g=(h=t+(c=l/40)*A)+c*((d=r+c*S)-h))+c*(d+c*(i+c*P-d)-g),b=(m=(f=e+c*x)+c*((p=n+c*_)-f))+c*(p+c*(a+c*k-p)-m),0==l?(y=v,w=b,N=v,L=b):(y=Math.min(y,v),w=Math.min(w,b),N=Math.max(N,v),L=Math.max(L,b));}return new u(Math.round(y),Math.round(w),Math.round(N-y),Math.round(L-w));};}(O.API),
/**
 * @license
 * jsPDF filters PlugIn
 * Copyright (c) 2014 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(e){var r=function r(t){var e,r,n,i,a,o,s,u,c,l;for(/[^\x00-\xFF]/.test(t),r=[],n=0,i=(t+=e="\0\0\0\0".slice(t.length%4||4)).length;i>n;n+=4){0!==(a=(t.charCodeAt(n)<<24)+(t.charCodeAt(n+1)<<16)+(t.charCodeAt(n+2)<<8)+t.charCodeAt(n+3))?(o=(a=((a=((a=((a=(a-(l=a%85))/85)-(c=a%85))/85)-(u=a%85))/85)-(s=a%85))/85)%85,r.push(o+33,s+33,u+33,c+33,l+33)):r.push(122);}return function(t,e){for(var r=e;r>0;r--){t.pop();}}(r,e.length),String.fromCharCode.apply(String,r)+"~>";},n=function n(t){var e,r,n,i,a,o=String,s="length",u=255,c="charCodeAt",l="slice",h="replace";for(t[l](-2),t=t[l](0,-2)[h](/\s/g,"")[h]("z","!!!!!"),n=[],i=0,a=(t+=e="uuuuu"[l](t[s]%5||5))[s];a>i;i+=5){r=52200625*(t[c](i)-33)+614125*(t[c](i+1)-33)+7225*(t[c](i+2)-33)+85*(t[c](i+3)-33)+(t[c](i+4)-33),n.push(u&r>>24,u&r>>16,u&r>>8,u&r);}return function(t,e){for(var r=e;r>0;r--){t.pop();}}(n,e[s]),o.fromCharCode.apply(o,n);},i=function i(t){var e=new RegExp(/^([0-9A-Fa-f]{2})+$/);if(-1!==(t=t.replace(/\s/g,"")).indexOf(">")&&(t=t.substr(0,t.indexOf(">"))),t.length%2&&(t+="0"),!1===e.test(t))return "";for(var r="",n=0;n<t.length;n+=2){r+=String.fromCharCode("0x"+(t[n]+t[n+1]));}return r;},a=function a(e){for(var r=new Uint8Array(e.length),n=e.length;n--;){r[n]=e.charCodeAt(n);}return e=(r=Object(fflate__WEBPACK_IMPORTED_MODULE_0__["zlibSync"])(r)).reduce(function(t,e){return t+String.fromCharCode(e);},"");};e.processDataByFilters=function(t,e){var o=0,s=t||"",u=[];for("string"==typeof(e=e||[])&&(e=[e]),o=0;o<e.length;o+=1){switch(e[o]){case"ASCII85Decode":case"/ASCII85Decode":s=n(s),u.push("/ASCII85Encode");break;case"ASCII85Encode":case"/ASCII85Encode":s=r(s),u.push("/ASCII85Decode");break;case"ASCIIHexDecode":case"/ASCIIHexDecode":s=i(s),u.push("/ASCIIHexEncode");break;case"ASCIIHexEncode":case"/ASCIIHexEncode":s=s.split("").map(function(t){return ("0"+t.charCodeAt().toString(16)).slice(-2);}).join("")+">",u.push("/ASCIIHexDecode");break;case"FlateEncode":case"/FlateEncode":s=a(s),u.push("/FlateDecode");break;default:throw new Error('The filter: "'+e[o]+'" is not implemented');}}return {data:s,reverseChain:u.reverse().join(" ")};};}(O.API),
/**
 * @license
 * jsPDF fileloading PlugIn
 * Copyright (c) 2018 Aras Abbasi (aras.abbasi@gmail.com)
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){t.loadFile=function(t,e,r){return function(t,e,r){e=!1!==e,r="function"==typeof r?r:function(){};var n=void 0;try{n=function(t,e,r){var n=new XMLHttpRequest(),i=0,a=function a(t){var e=t.length,r=[],n=String.fromCharCode;for(i=0;i<e;i+=1){r.push(n(255&t.charCodeAt(i)));}return r.join("");};if(n.open("GET",t,!e),n.overrideMimeType("text/plain; charset=x-user-defined"),!1===e&&(n.onload=function(){200===n.status?r(a(this.responseText)):r(void 0);}),n.send(null),e&&200===n.status)return a(n.responseText);}(t,e,r);}catch(t){}return n;}(t,e,r);},t.loadImageFile=t.loadFile;}(O.API),
/**
 * @license
 * Copyright (c) 2018 Erik Koopmans
 * Released under the MIT License.
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){function e(){return (r.html2canvas?Promise.resolve(r.html2canvas):__webpack_require__.e(/*! import() */6).then(__webpack_require__.t.bind(null,/*! html2canvas */"./node_modules/html2canvas/dist/html2canvas.js",7))).catch(function(t){return Promise.reject(new Error("Could not load html2canvas: "+t));}).then(function(t){return t.default?t.default:t;});}function n(){return (r.DOMPurify?Promise.resolve(r.DOMPurify):__webpack_require__.e(/*! import() */5).then(__webpack_require__.t.bind(null,/*! dompurify */"./node_modules/dompurify/dist/purify.js",7))).catch(function(t){return Promise.reject(new Error("Could not load dompurify: "+t));}).then(function(t){return t.default?t.default:t;});}var i=function i(t){var e=typeof t;return "undefined"===e?"undefined":"string"===e||t instanceof String?"string":"number"===e||t instanceof Number?"number":"function"===e||t instanceof Function?"function":t&&t.constructor===Array?"array":t&&1===t.nodeType?"element":"object"===e?"object":"unknown";},a=function a(t,e){var r=document.createElement(t);for(var n in e.className&&(r.className=e.className),e.innerHTML&&e.dompurify&&(r.innerHTML=e.dompurify.sanitize(e.innerHTML)),e.style){r.style[n]=e.style[n];}return r;},o=function o(t,e){for(var r=3===t.nodeType?document.createTextNode(t.nodeValue):t.cloneNode(!1),n=t.firstChild;n;n=n.nextSibling){!0!==e&&1===n.nodeType&&"SCRIPT"===n.nodeName||r.appendChild(o(n,e));}return 1===t.nodeType&&("CANVAS"===t.nodeName?(r.width=t.width,r.height=t.height,r.getContext("2d").drawImage(t,0,0)):"TEXTAREA"!==t.nodeName&&"SELECT"!==t.nodeName||(r.value=t.value),r.addEventListener("load",function(){r.scrollTop=t.scrollTop,r.scrollLeft=t.scrollLeft;},!0)),r;},s=function t(e){var r=Object.assign(t.convert(Promise.resolve()),JSON.parse(JSON.stringify(t.template))),n=t.convert(Promise.resolve(),r);return n=(n=n.setProgress(1,t,1,[t])).set(e);};(s.prototype=Object.create(Promise.prototype)).constructor=s,s.convert=function(t,e){return t.__proto__=e||s.prototype,t;},s.template={prop:{src:null,container:null,overlay:null,canvas:null,img:null,pdf:null,pageSize:null,callback:function callback(){}},progress:{val:0,state:null,n:0,stack:[]},opt:{filename:"file.pdf",margin:[0,0,0,0],enableLinks:!0,x:0,y:0,html2canvas:{},jsPDF:{},backgroundColor:"transparent"}},s.prototype.from=function(t,e){return this.then(function(){switch(e=e||function(t){switch(i(t)){case"string":return "string";case"element":return "canvas"===t.nodeName.toLowerCase()?"canvas":"element";default:return "unknown";}}(t)){case"string":return this.then(n).then(function(e){return this.set({src:a("div",{innerHTML:t,dompurify:e})});});case"element":return this.set({src:t});case"canvas":return this.set({canvas:t});case"img":return this.set({img:t});default:return this.error("Unknown source type.");}});},s.prototype.to=function(t){switch(t){case"container":return this.toContainer();case"canvas":return this.toCanvas();case"img":return this.toImg();case"pdf":return this.toPdf();default:return this.error("Invalid target.");}},s.prototype.toContainer=function(){return this.thenList([function(){return this.prop.src||this.error("Cannot duplicate - no source HTML.");},function(){return this.prop.pageSize||this.setPageSize();}]).then(function(){var t={position:"relative",display:"inline-block",width:Math.max(this.prop.src.clientWidth,this.prop.src.scrollWidth,this.prop.src.offsetWidth)+"px",left:0,right:0,top:0,margin:"auto",backgroundColor:this.opt.backgroundColor},e=o(this.prop.src,this.opt.html2canvas.javascriptEnabled);"BODY"===e.tagName&&(t.height=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight)+"px"),this.prop.overlay=a("div",{className:"html2pdf__overlay",style:{position:"fixed",overflow:"hidden",zIndex:1e3,left:"-100000px",right:0,bottom:0,top:0}}),this.prop.container=a("div",{className:"html2pdf__container",style:t}),this.prop.container.appendChild(e),this.prop.container.firstChild.appendChild(a("div",{style:{clear:"both",border:"0 none transparent",margin:0,padding:0,height:0}})),this.prop.container.style.float="none",this.prop.overlay.appendChild(this.prop.container),document.body.appendChild(this.prop.overlay),this.prop.container.firstChild.style.position="relative",this.prop.container.height=Math.max(this.prop.container.firstChild.clientHeight,this.prop.container.firstChild.scrollHeight,this.prop.container.firstChild.offsetHeight)+"px";});},s.prototype.toCanvas=function(){var t=[function(){return document.body.contains(this.prop.container)||this.toContainer();}];return this.thenList(t).then(e).then(function(t){var e=Object.assign({},this.opt.html2canvas);return delete e.onrendered,t(this.prop.container,e);}).then(function(t){(this.opt.html2canvas.onrendered||function(){})(t),this.prop.canvas=t,document.body.removeChild(this.prop.overlay);});},s.prototype.toContext2d=function(){var t=[function(){return document.body.contains(this.prop.container)||this.toContainer();}];return this.thenList(t).then(e).then(function(t){var e=this.opt.jsPDF,r=this.opt.fontFaces,n=Object.assign({async:!0,allowTaint:!0,scale:1,scrollX:this.opt.scrollX||0,scrollY:this.opt.scrollY||0,backgroundColor:"#ffffff",imageTimeout:15e3,logging:!0,proxy:null,removeContainer:!0,foreignObjectRendering:!1,useCORS:!1},this.opt.html2canvas);if(delete n.onrendered,e.context2d.autoPaging=!0,e.context2d.posX=this.opt.x,e.context2d.posY=this.opt.y,e.context2d.fontFaces=r,r)for(var i=0;i<r.length;++i){var a=r[i],o=a.src.find(function(t){return "truetype"===t.format;});o&&e.addFont(o.url,a.ref.name,a.ref.style);}return n.windowHeight=n.windowHeight||0,n.windowHeight=0==n.windowHeight?Math.max(this.prop.container.clientHeight,this.prop.container.scrollHeight,this.prop.container.offsetHeight):n.windowHeight,t(this.prop.container,n);}).then(function(t){(this.opt.html2canvas.onrendered||function(){})(t),this.prop.canvas=t,document.body.removeChild(this.prop.overlay);});},s.prototype.toImg=function(){return this.thenList([function(){return this.prop.canvas||this.toCanvas();}]).then(function(){var t=this.prop.canvas.toDataURL("image/"+this.opt.image.type,this.opt.image.quality);this.prop.img=document.createElement("img"),this.prop.img.src=t;});},s.prototype.toPdf=function(){return this.thenList([function(){return this.toContext2d();}]).then(function(){this.prop.pdf=this.prop.pdf||this.opt.jsPDF;});},s.prototype.output=function(t,e,r){return "img"===(r=r||"pdf").toLowerCase()||"image"===r.toLowerCase()?this.outputImg(t,e):this.outputPdf(t,e);},s.prototype.outputPdf=function(t,e){return this.thenList([function(){return this.prop.pdf||this.toPdf();}]).then(function(){return this.prop.pdf.output(t,e);});},s.prototype.outputImg=function(t){return this.thenList([function(){return this.prop.img||this.toImg();}]).then(function(){switch(t){case void 0:case"img":return this.prop.img;case"datauristring":case"dataurlstring":return this.prop.img.src;case"datauri":case"dataurl":return document.location.href=this.prop.img.src;default:throw 'Image output type "'+t+'" is not supported.';}});},s.prototype.save=function(t){return this.thenList([function(){return this.prop.pdf||this.toPdf();}]).set(t?{filename:t}:null).then(function(){this.prop.pdf.save(this.opt.filename);});},s.prototype.doCallback=function(){return this.thenList([function(){return this.prop.pdf||this.toPdf();}]).then(function(){this.prop.callback(this.prop.pdf);});},s.prototype.set=function(t){if("object"!==i(t))return this;var e=Object.keys(t||{}).map(function(e){if(e in s.template.prop)return function(){this.prop[e]=t[e];};switch(e){case"margin":return this.setMargin.bind(this,t.margin);case"jsPDF":return function(){return this.opt.jsPDF=t.jsPDF,this.setPageSize();};case"pageSize":return this.setPageSize.bind(this,t.pageSize);default:return function(){this.opt[e]=t[e];};}},this);return this.then(function(){return this.thenList(e);});},s.prototype.get=function(t,e){return this.then(function(){var r=t in s.template.prop?this.prop[t]:this.opt[t];return e?e(r):r;});},s.prototype.setMargin=function(t){return this.then(function(){switch(i(t)){case"number":t=[t,t,t,t];case"array":if(2===t.length&&(t=[t[0],t[1],t[0],t[1]]),4===t.length)break;default:return this.error("Invalid margin array.");}this.opt.margin=t;}).then(this.setPageSize);},s.prototype.setPageSize=function(t){function e(t,e){return Math.floor(t*e/72*96);}return this.then(function(){(t=t||O.getPageSize(this.opt.jsPDF)).hasOwnProperty("inner")||(t.inner={width:t.width-this.opt.margin[1]-this.opt.margin[3],height:t.height-this.opt.margin[0]-this.opt.margin[2]},t.inner.px={width:e(t.inner.width,t.k),height:e(t.inner.height,t.k)},t.inner.ratio=t.inner.height/t.inner.width),this.prop.pageSize=t;});},s.prototype.setProgress=function(t,e,r,n){return null!=t&&(this.progress.val=t),null!=e&&(this.progress.state=e),null!=r&&(this.progress.n=r),null!=n&&(this.progress.stack=n),this.progress.ratio=this.progress.val/this.progress.state,this;},s.prototype.updateProgress=function(t,e,r,n){return this.setProgress(t?this.progress.val+t:null,e||null,r?this.progress.n+r:null,n?this.progress.stack.concat(n):null);},s.prototype.then=function(t,e){var r=this;return this.thenCore(t,e,function(t,e){return r.updateProgress(null,null,1,[t]),Promise.prototype.then.call(this,function(e){return r.updateProgress(null,t),e;}).then(t,e).then(function(t){return r.updateProgress(1),t;});});},s.prototype.thenCore=function(t,e,r){r=r||Promise.prototype.then;t&&(t=t.bind(this)),e&&(e=e.bind(this));var n=-1!==Promise.toString().indexOf("[native code]")&&"Promise"===Promise.name?this:s.convert(Object.assign({},this),Promise.prototype),i=r.call(n,t,e);return s.convert(i,this.__proto__);},s.prototype.thenExternal=function(t,e){return Promise.prototype.then.call(this,t,e);},s.prototype.thenList=function(t){var e=this;return t.forEach(function(t){e=e.thenCore(t);}),e;},s.prototype.catch=function(t){t&&(t=t.bind(this));var e=Promise.prototype.catch.call(this,t);return s.convert(e,this);},s.prototype.catchExternal=function(t){return Promise.prototype.catch.call(this,t);},s.prototype.error=function(t){return this.then(function(){throw new Error(t);});},s.prototype.using=s.prototype.set,s.prototype.saveAs=s.prototype.save,s.prototype.export=s.prototype.output,s.prototype.run=s.prototype.then,O.getPageSize=function(t,e,r){if("object"==typeof t){var n=t;t=n.orientation,e=n.unit||e,r=n.format||r;}e=e||"mm",r=r||"a4",t=(""+(t||"P")).toLowerCase();var i,a=(""+r).toLowerCase(),o={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]};switch(e){case"pt":i=1;break;case"mm":i=72/25.4;break;case"cm":i=72/2.54;break;case"in":i=72;break;case"px":i=.75;break;case"pc":case"em":i=12;break;case"ex":i=6;break;default:throw "Invalid unit: "+e;}var s,u=0,c=0;if(o.hasOwnProperty(a))u=o[a][1]/i,c=o[a][0]/i;else try{u=r[1],c=r[0];}catch(t){throw new Error("Invalid format: "+r);}if("p"===t||"portrait"===t)t="p",c>u&&(s=c,c=u,u=s);else {if("l"!==t&&"landscape"!==t)throw "Invalid orientation: "+t;t="l",u>c&&(s=c,c=u,u=s);}return {width:c,height:u,unit:e,k:i,orientation:t};},t.html=function(t,e){(e=e||{}).callback=e.callback||function(){},e.html2canvas=e.html2canvas||{},e.html2canvas.canvas=e.html2canvas.canvas||this.canvas,e.jsPDF=e.jsPDF||this,e.fontFaces=e.fontFaces?e.fontFaces.map(It):null;var r=new s(e);return e.worker?r:r.from(t).doCallback();};}(O.API),O.API.addJS=function(t){return Dt=t,this.internal.events.subscribe("postPutResources",function(){Rt=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/Names [(EmbeddedJS) "+(Rt+1)+" 0 R]"),this.internal.out(">>"),this.internal.out("endobj"),Tt=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/S /JavaScript"),this.internal.out("/JS ("+Dt+")"),this.internal.out(">>"),this.internal.out("endobj");}),this.internal.events.subscribe("putCatalog",function(){void 0!==Rt&&void 0!==Tt&&this.internal.out("/Names <</JavaScript "+Rt+" 0 R>>");}),this;},
/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){var e;t.events.push(["postPutResources",function(){var t=this,r=/^(\d+) 0 obj$/;if(this.outline.root.children.length>0)for(var n=t.outline.render().split(/\r\n/),i=0;i<n.length;i++){var a=n[i],o=r.exec(a);if(null!=o){var s=o[1];t.internal.newObjectDeferredBegin(s,!1);}t.internal.write(a);}if(this.outline.createNamedDestinations){var u=this.internal.pages.length,c=[];for(i=0;i<u;i++){var l=t.internal.newObject();c.push(l);var h=t.internal.getPageInfo(i+1);t.internal.write("<< /D["+h.objId+" 0 R /XYZ null null null]>> endobj");}var f=t.internal.newObject();t.internal.write("<< /Names [ ");for(i=0;i<c.length;i++){t.internal.write("(page_"+(i+1)+")"+c[i]+" 0 R");}t.internal.write(" ] >>","endobj"),e=t.internal.newObject(),t.internal.write("<< /Dests "+f+" 0 R"),t.internal.write(">>","endobj");}}]),t.events.push(["putCatalog",function(){this.outline.root.children.length>0&&(this.internal.write("/Outlines",this.outline.makeRef(this.outline.root)),this.outline.createNamedDestinations&&this.internal.write("/Names "+e+" 0 R"));}]),t.events.push(["initialized",function(){var t=this;t.outline={createNamedDestinations:!1,root:{children:[]}},t.outline.add=function(t,e,r){var n={title:e,options:r,children:[]};return null==t&&(t=this.root),t.children.push(n),n;},t.outline.render=function(){return this.ctx={},this.ctx.val="",this.ctx.pdf=t,this.genIds_r(this.root),this.renderRoot(this.root),this.renderItems(this.root),this.ctx.val;},t.outline.genIds_r=function(e){e.id=t.internal.newObjectDeferred();for(var r=0;r<e.children.length;r++){this.genIds_r(e.children[r]);}},t.outline.renderRoot=function(t){this.objStart(t),this.line("/Type /Outlines"),t.children.length>0&&(this.line("/First "+this.makeRef(t.children[0])),this.line("/Last "+this.makeRef(t.children[t.children.length-1]))),this.line("/Count "+this.count_r({count:0},t)),this.objEnd();},t.outline.renderItems=function(e){for(var r=this.ctx.pdf.internal.getVerticalCoordinateString,n=0;n<e.children.length;n++){var i=e.children[n];this.objStart(i),this.line("/Title "+this.makeString(i.title)),this.line("/Parent "+this.makeRef(e)),n>0&&this.line("/Prev "+this.makeRef(e.children[n-1])),n<e.children.length-1&&this.line("/Next "+this.makeRef(e.children[n+1])),i.children.length>0&&(this.line("/First "+this.makeRef(i.children[0])),this.line("/Last "+this.makeRef(i.children[i.children.length-1])));var a=this.count=this.count_r({count:0},i);if(a>0&&this.line("/Count "+a),i.options&&i.options.pageNumber){var o=t.internal.getPageInfo(i.options.pageNumber);this.line("/Dest ["+o.objId+" 0 R /XYZ 0 "+r(0)+" 0]");}this.objEnd();}for(var s=0;s<e.children.length;s++){this.renderItems(e.children[s]);}},t.outline.line=function(t){this.ctx.val+=t+"\r\n";},t.outline.makeRef=function(t){return t.id+" 0 R";},t.outline.makeString=function(e){return "("+t.internal.pdfEscape(e)+")";},t.outline.objStart=function(t){this.ctx.val+="\r\n"+t.id+" 0 obj\r\n<<\r\n";},t.outline.objEnd=function(){this.ctx.val+=">> \r\nendobj\r\n";},t.outline.count_r=function(t,e){for(var r=0;r<e.children.length;r++){t.count++,this.count_r(t,e.children[r]);}return t.count;};}]);}(O.API),
/**
 * @license
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){var e=[192,193,194,195,196,197,198,199];t.processJPEG=function(t,r,n,i,a,o){var s,u=this.decode.DCT_DECODE,c=null;if("string"==typeof t||this.__addimage__.isArrayBuffer(t)||this.__addimage__.isArrayBufferView(t)){switch(t=a||t,t=this.__addimage__.isArrayBuffer(t)?new Uint8Array(t):t,(s=function(t){for(var r,n=256*t.charCodeAt(4)+t.charCodeAt(5),i=t.length,a={width:0,height:0,numcomponents:1},o=4;o<i;o+=2){if(o+=n,-1!==e.indexOf(t.charCodeAt(o+1))){r=256*t.charCodeAt(o+5)+t.charCodeAt(o+6),a={width:256*t.charCodeAt(o+7)+t.charCodeAt(o+8),height:r,numcomponents:t.charCodeAt(o+9)};break;}n=256*t.charCodeAt(o+2)+t.charCodeAt(o+3);}return a;}(t=this.__addimage__.isArrayBufferView(t)?this.__addimage__.arrayBufferToBinaryString(t):t)).numcomponents){case 1:o=this.color_spaces.DEVICE_GRAY;break;case 4:o=this.color_spaces.DEVICE_CMYK;break;case 3:o=this.color_spaces.DEVICE_RGB;}c={data:t,width:s.width,height:s.height,colorSpace:o,bitsPerComponent:8,filter:u,index:r,alias:n};}return c;};}(O.API);var zt,Ht,Vt,Wt,Gt,Yt=function(){var t,n,i;function a(t){var e,r,n,i,a,o,s,u,c,l,h,f,d,p;for(this.data=t,this.pos=8,this.palette=[],this.imgData=[],this.transparency={},this.animation=null,this.text={},o=null;;){switch(e=this.readUInt32(),c=function(){var t,e;for(e=[],t=0;t<4;++t){e.push(String.fromCharCode(this.data[this.pos++]));}return e;}.call(this).join("")){case"IHDR":this.width=this.readUInt32(),this.height=this.readUInt32(),this.bits=this.data[this.pos++],this.colorType=this.data[this.pos++],this.compressionMethod=this.data[this.pos++],this.filterMethod=this.data[this.pos++],this.interlaceMethod=this.data[this.pos++];break;case"acTL":this.animation={numFrames:this.readUInt32(),numPlays:this.readUInt32()||1/0,frames:[]};break;case"PLTE":this.palette=this.read(e);break;case"fcTL":o&&this.animation.frames.push(o),this.pos+=4,o={width:this.readUInt32(),height:this.readUInt32(),xOffset:this.readUInt32(),yOffset:this.readUInt32()},a=this.readUInt16(),i=this.readUInt16()||100,o.delay=1e3*a/i,o.disposeOp=this.data[this.pos++],o.blendOp=this.data[this.pos++],o.data=[];break;case"IDAT":case"fdAT":for("fdAT"===c&&(this.pos+=4,e-=4),t=(null!=o?o.data:void 0)||this.imgData,f=0;0<=e?f<e:f>e;0<=e?++f:--f){t.push(this.data[this.pos++]);}break;case"tRNS":switch(this.transparency={},this.colorType){case 3:if(n=this.palette.length/3,this.transparency.indexed=this.read(e),this.transparency.indexed.length>n)throw new Error("More transparent colors than palette size");if((l=n-this.transparency.indexed.length)>0)for(d=0;0<=l?d<l:d>l;0<=l?++d:--d){this.transparency.indexed.push(255);}break;case 0:this.transparency.grayscale=this.read(e)[0];break;case 2:this.transparency.rgb=this.read(e);}break;case"tEXt":s=(h=this.read(e)).indexOf(0),u=String.fromCharCode.apply(String,h.slice(0,s)),this.text[u]=String.fromCharCode.apply(String,h.slice(s+1));break;case"IEND":return o&&this.animation.frames.push(o),this.colors=function(){switch(this.colorType){case 0:case 3:case 4:return 1;case 2:case 6:return 3;}}.call(this),this.hasAlphaChannel=4===(p=this.colorType)||6===p,r=this.colors+(this.hasAlphaChannel?1:0),this.pixelBitlength=this.bits*r,this.colorSpace=function(){switch(this.colors){case 1:return "DeviceGray";case 3:return "DeviceRGB";}}.call(this),void(this.imgData=new Uint8Array(this.imgData));default:this.pos+=e;}if(this.pos+=4,this.pos>this.data.length)throw new Error("Incomplete or corrupt PNG file");}}a.prototype.read=function(t){var e,r;for(r=[],e=0;0<=t?e<t:e>t;0<=t?++e:--e){r.push(this.data[this.pos++]);}return r;},a.prototype.readUInt32=function(){return this.data[this.pos++]<<24|this.data[this.pos++]<<16|this.data[this.pos++]<<8|this.data[this.pos++];},a.prototype.readUInt16=function(){return this.data[this.pos++]<<8|this.data[this.pos++];},a.prototype.decodePixels=function(t){var r=this.pixelBitlength/8,n=new Uint8Array(this.width*this.height*r),i=0,a=this;if(null==t&&(t=this.imgData),0===t.length)return new Uint8Array(0);function o(e,o,s,u){var c,l,h,f,d,p,g,m,v,b,y,w,N,L,A,x,S,_,P,k,I,F=Math.ceil((a.width-e)/s),C=Math.ceil((a.height-o)/u),j=a.width==F&&a.height==C;for(L=r*F,w=j?n:new Uint8Array(L*C),p=t.length,N=0,l=0;N<C&&i<p;){switch(t[i++]){case 0:for(f=S=0;S<L;f=S+=1){w[l++]=t[i++];}break;case 1:for(f=_=0;_<L;f=_+=1){c=t[i++],d=f<r?0:w[l-r],w[l++]=(c+d)%256;}break;case 2:for(f=P=0;P<L;f=P+=1){c=t[i++],h=(f-f%r)/r,A=N&&w[(N-1)*L+h*r+f%r],w[l++]=(A+c)%256;}break;case 3:for(f=k=0;k<L;f=k+=1){c=t[i++],h=(f-f%r)/r,d=f<r?0:w[l-r],A=N&&w[(N-1)*L+h*r+f%r],w[l++]=(c+Math.floor((d+A)/2))%256;}break;case 4:for(f=I=0;I<L;f=I+=1){c=t[i++],h=(f-f%r)/r,d=f<r?0:w[l-r],0===N?A=x=0:(A=w[(N-1)*L+h*r+f%r],x=h&&w[(N-1)*L+(h-1)*r+f%r]),g=d+A-x,m=Math.abs(g-d),b=Math.abs(g-A),y=Math.abs(g-x),v=m<=b&&m<=y?d:b<=y?A:x,w[l++]=(c+v)%256;}break;default:throw new Error("Invalid filter algorithm: "+t[i-1]);}if(!j){var O=((o+N*u)*a.width+e)*r,B=N*L;for(f=0;f<F;f+=1){for(var M=0;M<r;M+=1){n[O++]=w[B++];}O+=(s-1)*r;}}N++;}}return t=Object(fflate__WEBPACK_IMPORTED_MODULE_0__["unzlibSync"])(t),1==a.interlaceMethod?(o(0,0,8,8),o(4,0,8,8),o(0,4,4,8),o(2,0,4,4),o(0,2,2,4),o(1,0,2,2),o(0,1,1,2)):o(0,0,1,1),n;},a.prototype.decodePalette=function(){var t,e,r,n,i,a,o,s,u;for(r=this.palette,a=this.transparency.indexed||[],i=new Uint8Array((a.length||0)+r.length),n=0,t=0,e=o=0,s=r.length;o<s;e=o+=3){i[n++]=r[e],i[n++]=r[e+1],i[n++]=r[e+2],i[n++]=null!=(u=a[t++])?u:255;}return i;},a.prototype.copyToImageData=function(t,e){var r,n,i,a,o,s,u,c,l,h,f;if(n=this.colors,l=null,r=this.hasAlphaChannel,this.palette.length&&(l=null!=(f=this._decodedPalette)?f:this._decodedPalette=this.decodePalette(),n=4,r=!0),c=(i=t.data||t).length,o=l||e,a=s=0,1===n)for(;a<c;){u=l?4*e[a/4]:s,h=o[u++],i[a++]=h,i[a++]=h,i[a++]=h,i[a++]=r?o[u++]:255,s=u;}else for(;a<c;){u=l?4*e[a/4]:s,i[a++]=o[u++],i[a++]=o[u++],i[a++]=o[u++],i[a++]=r?o[u++]:255,s=u;}},a.prototype.decode=function(){var t;return t=new Uint8Array(this.width*this.height*4),this.copyToImageData(t,this.decodePixels()),t;};var o=function o(){if("[object Window]"===Object.prototype.toString.call(r)){try{n=r.document.createElement("canvas"),i=n.getContext("2d");}catch(t){return !1;}return !0;}return !1;};return o(),t=function t(_t5){var e;if(!0===o())return i.width=_t5.width,i.height=_t5.height,i.clearRect(0,0,_t5.width,_t5.height),i.putImageData(_t5,0,0),(e=new Image()).src=n.toDataURL(),e;throw new Error("This method requires a Browser with Canvas-capability.");},a.prototype.decodeFrames=function(e){var r,n,i,a,o,s,u,c;if(this.animation){for(c=[],n=o=0,s=(u=this.animation.frames).length;o<s;n=++o){r=u[n],i=e.createImageData(r.width,r.height),a=this.decodePixels(new Uint8Array(r.data)),this.copyToImageData(i,a),r.imageData=i,c.push(r.image=t(i));}return c;}},a.prototype.renderFrame=function(t,e){var r,n,i;return r=(n=this.animation.frames)[e],i=n[e-1],0===e&&t.clearRect(0,0,this.width,this.height),1===(null!=i?i.disposeOp:void 0)?t.clearRect(i.xOffset,i.yOffset,i.width,i.height):2===(null!=i?i.disposeOp:void 0)&&t.putImageData(i.imageData,i.xOffset,i.yOffset),0===r.blendOp&&t.clearRect(r.xOffset,r.yOffset,r.width,r.height),t.drawImage(r.image,r.xOffset,r.yOffset);},a.prototype.animate=function(t){var _e3,r,n,i,a,o,s=this;return r=0,o=this.animation,i=o.numFrames,n=o.frames,a=o.numPlays,(_e3=function e(){var o,u;if(o=r++%i,u=n[o],s.renderFrame(t,o),i>1&&r/i<a)return s.animation._timeout=setTimeout(_e3,u.delay);})();},a.prototype.stopAnimation=function(){var t;return clearTimeout(null!=(t=this.animation)?t._timeout:void 0);},a.prototype.render=function(t){var e,r;return t._png&&t._png.stopAnimation(),t._png=this,t.width=this.width,t.height=this.height,e=t.getContext("2d"),this.animation?(this.decodeFrames(e),this.animate(e)):(r=e.createImageData(this.width,this.height),this.copyToImageData(r,this.decodePixels()),e.putImageData(r,0,0));},a;}();
/**
 * @license
 *
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
/**
 * @license
 * (c) Dean McNamee <dean@gmail.com>, 2013.
 *
 * https://github.com/deanm/omggif
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
 * including animation and compression.  It does not rely on any specific
 * underlying system, so should run in the browser, Node, or Plask.
 */
function Jt(t){var e=0;if(71!==t[e++]||73!==t[e++]||70!==t[e++]||56!==t[e++]||56!=(t[e++]+1&253)||97!==t[e++])throw new Error("Invalid GIF 87a/89a header.");var r=t[e++]|t[e++]<<8,n=t[e++]|t[e++]<<8,i=t[e++],a=i>>7,o=1<<(7&i)+1;t[e++];t[e++];var s=null,u=null;a&&(s=e,u=o,e+=3*o);var c=!0,l=[],h=0,f=null,d=0,p=null;for(this.width=r,this.height=n;c&&e<t.length;){switch(t[e++]){case 33:switch(t[e++]){case 255:if(11!==t[e]||78==t[e+1]&&69==t[e+2]&&84==t[e+3]&&83==t[e+4]&&67==t[e+5]&&65==t[e+6]&&80==t[e+7]&&69==t[e+8]&&50==t[e+9]&&46==t[e+10]&&48==t[e+11]&&3==t[e+12]&&1==t[e+13]&&0==t[e+16])e+=14,p=t[e++]|t[e++]<<8,e++;else for(e+=12;;){if(!((P=t[e++])>=0))throw Error("Invalid block size");if(0===P)break;e+=P;}break;case 249:if(4!==t[e++]||0!==t[e+4])throw new Error("Invalid graphics extension block.");var g=t[e++];h=t[e++]|t[e++]<<8,f=t[e++],0==(1&g)&&(f=null),d=g>>2&7,e++;break;case 254:for(;;){if(!((P=t[e++])>=0))throw Error("Invalid block size");if(0===P)break;e+=P;}break;default:throw new Error("Unknown graphic control label: 0x"+t[e-1].toString(16));}break;case 44:var m=t[e++]|t[e++]<<8,v=t[e++]|t[e++]<<8,b=t[e++]|t[e++]<<8,y=t[e++]|t[e++]<<8,w=t[e++],N=w>>6&1,L=1<<(7&w)+1,A=s,x=u,S=!1;if(w>>7){S=!0;A=e,x=L,e+=3*L;}var _=e;for(e++;;){var P;if(!((P=t[e++])>=0))throw Error("Invalid block size");if(0===P)break;e+=P;}l.push({x:m,y:v,width:b,height:y,has_local_palette:S,palette_offset:A,palette_size:x,data_offset:_,data_length:e-_,transparent_index:f,interlaced:!!N,delay:h,disposal:d});break;case 59:c=!1;break;default:throw new Error("Unknown gif block: 0x"+t[e-1].toString(16));}}this.numFrames=function(){return l.length;},this.loopCount=function(){return p;},this.frameInfo=function(t){if(t<0||t>=l.length)throw new Error("Frame index out of range.");return l[t];},this.decodeAndBlitFrameBGRA=function(e,n){var i=this.frameInfo(e),a=i.width*i.height,o=new Uint8Array(a);Xt(t,i.data_offset,o,a);var s=i.palette_offset,u=i.transparent_index;null===u&&(u=256);var c=i.width,l=r-c,h=c,f=4*(i.y*r+i.x),d=4*((i.y+i.height)*r+i.x),p=f,g=4*l;!0===i.interlaced&&(g+=4*r*7);for(var m=8,v=0,b=o.length;v<b;++v){var y=o[v];if(0===h&&(h=c,(p+=g)>=d&&(g=4*l+4*r*(m-1),p=f+(c+l)*(m<<1),m>>=1)),y===u)p+=4;else {var w=t[s+3*y],N=t[s+3*y+1],L=t[s+3*y+2];n[p++]=L,n[p++]=N,n[p++]=w,n[p++]=255;}--h;}},this.decodeAndBlitFrameRGBA=function(e,n){var i=this.frameInfo(e),a=i.width*i.height,o=new Uint8Array(a);Xt(t,i.data_offset,o,a);var s=i.palette_offset,u=i.transparent_index;null===u&&(u=256);var c=i.width,l=r-c,h=c,f=4*(i.y*r+i.x),d=4*((i.y+i.height)*r+i.x),p=f,g=4*l;!0===i.interlaced&&(g+=4*r*7);for(var m=8,v=0,b=o.length;v<b;++v){var y=o[v];if(0===h&&(h=c,(p+=g)>=d&&(g=4*l+4*r*(m-1),p=f+(c+l)*(m<<1),m>>=1)),y===u)p+=4;else {var w=t[s+3*y],N=t[s+3*y+1],L=t[s+3*y+2];n[p++]=w,n[p++]=N,n[p++]=L,n[p++]=255;}--h;}};}function Xt(t,e,r,n){for(var a=t[e++],o=1<<a,s=o+1,u=s+1,c=a+1,l=(1<<c)-1,h=0,f=0,d=0,p=t[e++],g=new Int32Array(4096),m=null;;){for(;h<16&&0!==p;){f|=t[e++]<<h,h+=8,1===p?p=t[e++]:--p;}if(h<c)break;var v=f&l;if(f>>=c,h-=c,v!==o){if(v===s)break;for(var b=v<u?v:m,y=0,w=b;w>o;){w=g[w]>>8,++y;}var N=w;if(d+y+(b!==v?1:0)>n)return void i.log("Warning, gif stream longer than expected.");r[d++]=N;var L=d+=y;for(b!==v&&(r[d++]=N),w=b;y--;){w=g[w],r[--L]=255&w,w>>=8;}null!==m&&u<4096&&(g[u++]=m<<8|N,u>=l+1&&c<12&&(++c,l=l<<1|1)),m=v;}else u=s+1,l=(1<<(c=a+1))-1,m=null;}return d!==n&&i.log("Warning, gif stream shorter than expected."),r;}
/**
 * @license
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.

  Redistribution and use in source and binary forms, with or without 
  modification, are permitted provided that the following conditions are
  met:

  * Redistributions of source code must retain the above copyright notice, 
    this list of conditions and the following disclaimer.
  
  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the 
    documentation and/or other materials provided with the distribution.
  
  * Neither the name of Adobe Systems Incorporated nor the names of its 
    contributors may be used to endorse or promote products derived from 
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/function Kt(t){var e,r,n,i,a,o=Math.floor,s=new Array(64),u=new Array(64),c=new Array(64),l=new Array(64),h=new Array(65535),f=new Array(65535),d=new Array(64),p=new Array(64),g=[],m=0,v=7,b=new Array(64),y=new Array(64),w=new Array(64),N=new Array(256),L=new Array(2048),A=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],x=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],S=[0,1,2,3,4,5,6,7,8,9,10,11],_=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],P=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],k=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],I=[0,1,2,3,4,5,6,7,8,9,10,11],F=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],C=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];function j(t,e){for(var r=0,n=0,i=new Array(),a=1;a<=16;a++){for(var o=1;o<=t[a];o++){i[e[n]]=[],i[e[n]][0]=r,i[e[n]][1]=a,n++,r++;}r*=2;}return i;}function O(t){for(var e=t[0],r=t[1]-1;r>=0;){e&1<<r&&(m|=1<<v),r--,--v<0&&(255==m?(B(255),B(0)):B(m),v=7,m=0);}}function B(t){g.push(t);}function M(t){B(t>>8&255),B(255&t);}function E(t,e,r,n,i){for(var a,o=i[0],s=i[240],u=function(t,e){var r,n,i,a,o,s,u,c,l,h,f=0;for(l=0;l<8;++l){r=t[f],n=t[f+1],i=t[f+2],a=t[f+3],o=t[f+4],s=t[f+5],u=t[f+6];var p=r+(c=t[f+7]),g=r-c,m=n+u,v=n-u,b=i+s,y=i-s,w=a+o,N=a-o,L=p+w,A=p-w,x=m+b,S=m-b;t[f]=L+x,t[f+4]=L-x;var _=.707106781*(S+A);t[f+2]=A+_,t[f+6]=A-_;var P=.382683433*((L=N+y)-(S=v+g)),k=.5411961*L+P,I=1.306562965*S+P,F=.707106781*(x=y+v),C=g+F,j=g-F;t[f+5]=j+k,t[f+3]=j-k,t[f+1]=C+I,t[f+7]=C-I,f+=8;}for(f=0,l=0;l<8;++l){r=t[f],n=t[f+8],i=t[f+16],a=t[f+24],o=t[f+32],s=t[f+40],u=t[f+48];var O=r+(c=t[f+56]),B=r-c,M=n+u,E=n-u,q=i+s,R=i-s,T=a+o,D=a-o,U=O+T,z=O-T,H=M+q,V=M-q;t[f]=U+H,t[f+32]=U-H;var W=.707106781*(V+z);t[f+16]=z+W,t[f+48]=z-W;var G=.382683433*((U=D+R)-(V=E+B)),Y=.5411961*U+G,J=1.306562965*V+G,X=.707106781*(H=R+E),K=B+X,Z=B-X;t[f+40]=Z+Y,t[f+24]=Z-Y,t[f+8]=K+J,t[f+56]=K-J,f++;}for(l=0;l<64;++l){h=t[l]*e[l],d[l]=h>0?h+.5|0:h-.5|0;}return d;}(t,e),c=0;c<64;++c){p[A[c]]=u[c];}var l=p[0]-r;r=p[0],0==l?O(n[0]):(O(n[f[a=32767+l]]),O(h[a]));for(var g=63;g>0&&0==p[g];){g--;}if(0==g)return O(o),r;for(var m,v=1;v<=g;){for(var b=v;0==p[v]&&v<=g;){++v;}var y=v-b;if(y>=16){m=y>>4;for(var w=1;w<=m;++w){O(s);}y&=15;}a=32767+p[v],O(i[(y<<4)+f[a]]),O(h[a]),v++;}return 63!=g&&O(o),r;}function q(t){(t=Math.min(Math.max(t,1),100),a!=t)&&(!function(t){for(var e=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],r=0;r<64;r++){var n=o((e[r]*t+50)/100);n=Math.min(Math.max(n,1),255),s[A[r]]=n;}for(var i=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],a=0;a<64;a++){var h=o((i[a]*t+50)/100);h=Math.min(Math.max(h,1),255),u[A[a]]=h;}for(var f=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],d=0,p=0;p<8;p++){for(var g=0;g<8;g++){c[d]=1/(s[A[d]]*f[p]*f[g]*8),l[d]=1/(u[A[d]]*f[p]*f[g]*8),d++;}}}(t<50?Math.floor(5e3/t):Math.floor(200-2*t)),a=t);}this.encode=function(t,a){a&&q(a),g=new Array(),m=0,v=7,M(65496),M(65504),M(16),B(74),B(70),B(73),B(70),B(0),B(1),B(1),B(0),M(1),M(1),B(0),B(0),function(){M(65499),M(132),B(0);for(var t=0;t<64;t++){B(s[t]);}B(1);for(var e=0;e<64;e++){B(u[e]);}}(),function(t,e){M(65472),M(17),B(8),M(e),M(t),B(3),B(1),B(17),B(0),B(2),B(17),B(1),B(3),B(17),B(1);}(t.width,t.height),function(){M(65476),M(418),B(0);for(var t=0;t<16;t++){B(x[t+1]);}for(var e=0;e<=11;e++){B(S[e]);}B(16);for(var r=0;r<16;r++){B(_[r+1]);}for(var n=0;n<=161;n++){B(P[n]);}B(1);for(var i=0;i<16;i++){B(k[i+1]);}for(var a=0;a<=11;a++){B(I[a]);}B(17);for(var o=0;o<16;o++){B(F[o+1]);}for(var s=0;s<=161;s++){B(C[s]);}}(),M(65498),M(12),B(3),B(1),B(0),B(2),B(17),B(3),B(17),B(0),B(63),B(0);var o=0,h=0,f=0;m=0,v=7,this.encode.displayName="_encode_";for(var d,p,N,A,j,R,T,D,U,z=t.data,H=t.width,V=t.height,W=4*H,G=0;G<V;){for(d=0;d<W;){for(j=W*G+d,T=-1,D=0,U=0;U<64;U++){R=j+(D=U>>3)*W+(T=4*(7&U)),G+D>=V&&(R-=W*(G+1+D-V)),d+T>=W&&(R-=d+T-W+4),p=z[R++],N=z[R++],A=z[R++],b[U]=(L[p]+L[N+256>>0]+L[A+512>>0]>>16)-128,y[U]=(L[p+768>>0]+L[N+1024>>0]+L[A+1280>>0]>>16)-128,w[U]=(L[p+1280>>0]+L[N+1536>>0]+L[A+1792>>0]>>16)-128;}o=E(b,c,o,e,n),h=E(y,l,h,r,i),f=E(w,l,f,r,i),d+=32;}G+=8;}if(v>=0){var Y=[];Y[1]=v+1,Y[0]=(1<<v+1)-1,O(Y);}return M(65497),new Uint8Array(g);},t=t||50,function(){for(var t=String.fromCharCode,e=0;e<256;e++){N[e]=t(e);}}(),e=j(x,S),r=j(k,I),n=j(_,P),i=j(F,C),function(){for(var t=1,e=2,r=1;r<=15;r++){for(var n=t;n<e;n++){f[32767+n]=r,h[32767+n]=[],h[32767+n][1]=r,h[32767+n][0]=n;}for(var i=-(e-1);i<=-t;i++){f[32767+i]=r,h[32767+i]=[],h[32767+i][1]=r,h[32767+i][0]=e-1+i;}t<<=1,e<<=1;}}(),function(){for(var t=0;t<256;t++){L[t]=19595*t,L[t+256>>0]=38470*t,L[t+512>>0]=7471*t+32768,L[t+768>>0]=-11059*t,L[t+1024>>0]=-21709*t,L[t+1280>>0]=32768*t+8421375,L[t+1536>>0]=-27439*t,L[t+1792>>0]=-5329*t;}}(),q(t);}
/**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */function Zt(t,e){if(this.pos=0,this.buffer=t,this.datav=new DataView(t.buffer),this.is_with_alpha=!!e,this.bottom_up=!0,this.flag=String.fromCharCode(this.buffer[0])+String.fromCharCode(this.buffer[1]),this.pos+=2,-1===["BM","BA","CI","CP","IC","PT"].indexOf(this.flag))throw new Error("Invalid BMP File");this.parseHeader(),this.parseBGR();}function $t(t){function e(t){if(!t)throw Error("assert :P");}function r(t,e,r){for(var n=0;4>n;n++){if(t[e+n]!=r.charCodeAt(n))return !0;}return !1;}function n(t,e,r,n,i){for(var a=0;a<i;a++){t[e+a]=r[n+a];}}function i(t,e,r,n){for(var i=0;i<n;i++){t[e+i]=r;}}function a(t){return new Int32Array(t);}function o(t,e){for(var r=[],n=0;n<t;n++){r.push(new e());}return r;}function s(t,e){var r=[];return function t(r,n,i){for(var a=i[n],o=0;o<a&&(r.push(i.length>n+1?[]:new e()),!(i.length<n+1));o++){t(r[o],n+1,i);}}(r,0,t),r;}function u(t,e){for(var r="",n=0;n<4;n++){r+=String.fromCharCode(t[e++]);}return r;}function c(t,e){return (t[e+0]<<0|t[e+1]<<8|t[e+2]<<16)>>>0;}function l(t,e){return (t[e+0]<<0|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0;}new($t=function $t(){var t=this;function u(t,e){for(var r=1<<e-1>>>0;t&r;){r>>>=1;}return r?(t&r-1)+r:t;}function c(t,r,n,i,a){e(!(i%n));do{t[r+(i-=n)]=a;}while(0<i);}function l(t,r,n,i,o){if(e(2328>=o),512>=o)var s=a(512);else if(null==(s=a(o)))return 0;return function(t,r,n,i,o,s){var l,f,d=r,p=1<<n,g=a(16),m=a(16);for(e(0!=o),e(null!=i),e(null!=t),e(0<n),f=0;f<o;++f){if(15<i[f])return 0;++g[i[f]];}if(g[0]==o)return 0;for(m[1]=0,l=1;15>l;++l){if(g[l]>1<<l)return 0;m[l+1]=m[l]+g[l];}for(f=0;f<o;++f){l=i[f],0<i[f]&&(s[m[l]++]=f);}if(1==m[15])return (i=new h()).g=0,i.value=s[0],c(t,d,1,p,i),p;var v,b=-1,y=p-1,w=0,N=1,L=1,A=1<<n;for(f=0,l=1,o=2;l<=n;++l,o<<=1){if(N+=L<<=1,0>(L-=g[l]))return 0;for(;0<g[l];--g[l]){(i=new h()).g=l,i.value=s[f++],c(t,d+w,o,A,i),w=u(w,l);}}for(l=n+1,o=2;15>=l;++l,o<<=1){if(N+=L<<=1,0>(L-=g[l]))return 0;for(;0<g[l];--g[l]){if(i=new h(),(w&y)!=b){for(d+=A,v=1<<(b=l)-n;15>b&&!(0>=(v-=g[b]));){++b,v<<=1;}p+=A=1<<(v=b-n),t[r+(b=w&y)].g=v+n,t[r+b].value=d-r-b;}i.g=l-n,i.value=s[f++],c(t,d+(w>>n),o,A,i),w=u(w,l);}}return N!=2*m[15]-1?0:p;}(t,r,n,i,o,s);}function h(){this.value=this.g=0;}function f(){this.value=this.g=0;}function d(){this.G=o(5,h),this.H=a(5),this.jc=this.Qb=this.qb=this.nd=0,this.pd=o(Rr,f);}function p(t,r,n,i){e(null!=t),e(null!=r),e(2147483648>i),t.Ca=254,t.I=0,t.b=-8,t.Ka=0,t.oa=r,t.pa=n,t.Jd=r,t.Yc=n+i,t.Zc=4<=i?n+i-4+1:n,_(t);}function g(t,e){for(var r=0;0<e--;){r|=k(t,128)<<e;}return r;}function m(t,e){var r=g(t,e);return P(t)?-r:r;}function v(t,r,n,i){var a,o=0;for(e(null!=t),e(null!=r),e(4294967288>i),t.Sb=i,t.Ra=0,t.u=0,t.h=0,4<i&&(i=4),a=0;a<i;++a){o+=r[n+a]<<8*a;}t.Ra=o,t.bb=i,t.oa=r,t.pa=n;}function b(t){for(;8<=t.u&&t.bb<t.Sb;){t.Ra>>>=8,t.Ra+=t.oa[t.pa+t.bb]<<Ur-8>>>0,++t.bb,t.u-=8;}A(t)&&(t.h=1,t.u=0);}function y(t,r){if(e(0<=r),!t.h&&r<=Dr){var n=L(t)&Tr[r];return t.u+=r,b(t),n;}return t.h=1,t.u=0;}function w(){this.b=this.Ca=this.I=0,this.oa=[],this.pa=0,this.Jd=[],this.Yc=0,this.Zc=[],this.Ka=0;}function N(){this.Ra=0,this.oa=[],this.h=this.u=this.bb=this.Sb=this.pa=0;}function L(t){return t.Ra>>>(t.u&Ur-1)>>>0;}function A(t){return e(t.bb<=t.Sb),t.h||t.bb==t.Sb&&t.u>Ur;}function x(t,e){t.u=e,t.h=A(t);}function S(t){t.u>=zr&&(e(t.u>=zr),b(t));}function _(t){e(null!=t&&null!=t.oa),t.pa<t.Zc?(t.I=(t.oa[t.pa++]|t.I<<8)>>>0,t.b+=8):(e(null!=t&&null!=t.oa),t.pa<t.Yc?(t.b+=8,t.I=t.oa[t.pa++]|t.I<<8):t.Ka?t.b=0:(t.I<<=8,t.b+=8,t.Ka=1));}function P(t){return g(t,1);}function k(t,e){var r=t.Ca;0>t.b&&_(t);var n=t.b,i=r*e>>>8,a=(t.I>>>n>i)+0;for(a?(r-=i,t.I-=i+1<<n>>>0):r=i+1,n=r,i=0;256<=n;){i+=8,n>>=8;}return n=7^i+Hr[n],t.b-=n,t.Ca=(r<<n)-1,a;}function I(t,e,r){t[e+0]=r>>24&255,t[e+1]=r>>16&255,t[e+2]=r>>8&255,t[e+3]=r>>0&255;}function F(t,e){return t[e+0]<<0|t[e+1]<<8;}function C(t,e){return F(t,e)|t[e+2]<<16;}function j(t,e){return F(t,e)|F(t,e+2)<<16;}function O(t,r){var n=1<<r;return e(null!=t),e(0<r),t.X=a(n),null==t.X?0:(t.Mb=32-r,t.Xa=r,1);}function B(t,r){e(null!=t),e(null!=r),e(t.Xa==r.Xa),n(r.X,0,t.X,0,1<<r.Xa);}function M(){this.X=[],this.Xa=this.Mb=0;}function E(t,r,n,i){e(null!=n),e(null!=i);var a=n[0],o=i[0];return 0==a&&(a=(t*o+r/2)/r),0==o&&(o=(r*a+t/2)/t),0>=a||0>=o?0:(n[0]=a,i[0]=o,1);}function q(t,e){return t+(1<<e)-1>>>e;}function R(t,e){return ((4278255360&t)+(4278255360&e)>>>0&4278255360)+((16711935&t)+(16711935&e)>>>0&16711935)>>>0;}function T(e,r){t[r]=function(r,n,i,a,o,s,u){var c;for(c=0;c<o;++c){var l=t[e](s[u+c-1],i,a+c);s[u+c]=R(r[n+c],l);}};}function D(){this.ud=this.hd=this.jd=0;}function U(t,e){return ((4278124286&(t^e))>>>1)+(t&e)>>>0;}function z(t){return 0<=t&&256>t?t:0>t?0:255<t?255:void 0;}function H(t,e){return z(t+(t-e+.5>>1));}function V(t,e,r){return Math.abs(e-r)-Math.abs(t-r);}function W(t,e,r,n,i,a,o){for(n=a[o-1],r=0;r<i;++r){a[o+r]=n=R(t[e+r],n);}}function G(t,e,r,n,i){var a;for(a=0;a<r;++a){var o=t[e+a],s=o>>8&255,u=16711935&(u=(u=16711935&o)+((s<<16)+s));n[i+a]=(4278255360&o)+u>>>0;}}function Y(t,e){e.jd=t>>0&255,e.hd=t>>8&255,e.ud=t>>16&255;}function J(t,e,r,n,i,a){var o;for(o=0;o<n;++o){var s=e[r+o],u=s>>>8,c=s,l=255&(l=(l=s>>>16)+((t.jd<<24>>24)*(u<<24>>24)>>>5));c=255&(c=(c=c+((t.hd<<24>>24)*(u<<24>>24)>>>5))+((t.ud<<24>>24)*(l<<24>>24)>>>5));i[a+o]=(4278255360&s)+(l<<16)+c;}}function X(e,r,n,i,a){t[r]=function(t,e,r,n,o,s,u,c,l){for(n=u;n<c;++n){for(u=0;u<l;++u){o[s++]=a(r[i(t[e++])]);}}},t[e]=function(e,r,o,s,u,c,l){var h=8>>e.b,f=e.Ea,d=e.K[0],p=e.w;if(8>h)for(e=(1<<e.b)-1,p=(1<<h)-1;r<o;++r){var g,m=0;for(g=0;g<f;++g){g&e||(m=i(s[u++])),c[l++]=a(d[m&p]),m>>=h;}}else t["VP8LMapColor"+n](s,u,d,p,c,l,r,o,f);};}function K(t,e,r,n,i){for(r=e+r;e<r;){var a=t[e++];n[i++]=a>>16&255,n[i++]=a>>8&255,n[i++]=a>>0&255;}}function Z(t,e,r,n,i){for(r=e+r;e<r;){var a=t[e++];n[i++]=a>>16&255,n[i++]=a>>8&255,n[i++]=a>>0&255,n[i++]=a>>24&255;}}function $(t,e,r,n,i){for(r=e+r;e<r;){var a=(o=t[e++])>>16&240|o>>12&15,o=o>>0&240|o>>28&15;n[i++]=a,n[i++]=o;}}function Q(t,e,r,n,i){for(r=e+r;e<r;){var a=(o=t[e++])>>16&248|o>>13&7,o=o>>5&224|o>>3&31;n[i++]=a,n[i++]=o;}}function tt(t,e,r,n,i){for(r=e+r;e<r;){var a=t[e++];n[i++]=a>>0&255,n[i++]=a>>8&255,n[i++]=a>>16&255;}}function et(t,e,r,i,a,o){if(0==o)for(r=e+r;e<r;){I(i,((o=t[e++])[0]>>24|o[1]>>8&65280|o[2]<<8&16711680|o[3]<<24)>>>0),a+=32;}else n(i,a,t,e,r);}function rt(e,r){t[r][0]=t[e+"0"],t[r][1]=t[e+"1"],t[r][2]=t[e+"2"],t[r][3]=t[e+"3"],t[r][4]=t[e+"4"],t[r][5]=t[e+"5"],t[r][6]=t[e+"6"],t[r][7]=t[e+"7"],t[r][8]=t[e+"8"],t[r][9]=t[e+"9"],t[r][10]=t[e+"10"],t[r][11]=t[e+"11"],t[r][12]=t[e+"12"],t[r][13]=t[e+"13"],t[r][14]=t[e+"0"],t[r][15]=t[e+"0"];}function nt(t){return t==Hn||t==Vn||t==Wn||t==Gn;}function it(){this.eb=[],this.size=this.A=this.fb=0;}function at(){this.y=[],this.f=[],this.ea=[],this.F=[],this.Tc=this.Ed=this.Cd=this.Fd=this.lb=this.Db=this.Ab=this.fa=this.J=this.W=this.N=this.O=0;}function ot(){this.Rd=this.height=this.width=this.S=0,this.f={},this.f.RGBA=new it(),this.f.kb=new at(),this.sd=null;}function st(){this.width=[0],this.height=[0],this.Pd=[0],this.Qd=[0],this.format=[0];}function ut(){this.Id=this.fd=this.Md=this.hb=this.ib=this.da=this.bd=this.cd=this.j=this.v=this.Da=this.Sd=this.ob=0;}function ct(t){return alert("todo:WebPSamplerProcessPlane"),t.T;}function lt(t,e){var r=t.T,i=e.ba.f.RGBA,a=i.eb,o=i.fb+t.ka*i.A,s=vi[e.ba.S],u=t.y,c=t.O,l=t.f,h=t.N,f=t.ea,d=t.W,p=e.cc,g=e.dc,m=e.Mc,v=e.Nc,b=t.ka,y=t.ka+t.T,w=t.U,N=w+1>>1;for(0==b?s(u,c,null,null,l,h,f,d,l,h,f,d,a,o,null,null,w):(s(e.ec,e.fc,u,c,p,g,m,v,l,h,f,d,a,o-i.A,a,o,w),++r);b+2<y;b+=2){p=l,g=h,m=f,v=d,h+=t.Rc,d+=t.Rc,o+=2*i.A,s(u,(c+=2*t.fa)-t.fa,u,c,p,g,m,v,l,h,f,d,a,o-i.A,a,o,w);}return c+=t.fa,t.j+y<t.o?(n(e.ec,e.fc,u,c,w),n(e.cc,e.dc,l,h,N),n(e.Mc,e.Nc,f,d,N),r--):1&y||s(u,c,null,null,l,h,f,d,l,h,f,d,a,o+i.A,null,null,w),r;}function ht(t,r,n){var i=t.F,a=[t.J];if(null!=i){var o=t.U,s=r.ba.S,u=s==Dn||s==Wn;r=r.ba.f.RGBA;var c=[0],l=t.ka;c[0]=t.T,t.Kb&&(0==l?--c[0]:(--l,a[0]-=t.width),t.j+t.ka+t.T==t.o&&(c[0]=t.o-t.j-l));var h=r.eb;l=r.fb+l*r.A;t=Sn(i,a[0],t.width,o,c,h,l+(u?0:3),r.A),e(n==c),t&&nt(s)&&An(h,l,u,o,c,r.A);}return 0;}function ft(t){var e=t.ma,r=e.ba.S,n=11>r,i=r==qn||r==Tn||r==Dn||r==Un||12==r||nt(r);if(e.memory=null,e.Ib=null,e.Jb=null,e.Nd=null,!Mr(e.Oa,t,i?11:12))return 0;if(i&&nt(r)&&br(),t.da)alert("todo:use_scaling");else {if(n){if(e.Ib=ct,t.Kb){if(r=t.U+1>>1,e.memory=a(t.U+2*r),null==e.memory)return 0;e.ec=e.memory,e.fc=0,e.cc=e.ec,e.dc=e.fc+t.U,e.Mc=e.cc,e.Nc=e.dc+r,e.Ib=lt,br();}}else alert("todo:EmitYUV");i&&(e.Jb=ht,n&&mr());}if(n&&!Ci){for(t=0;256>t;++t){ji[t]=89858*(t-128)+_i>>Si,Mi[t]=-22014*(t-128)+_i,Bi[t]=-45773*(t-128),Oi[t]=113618*(t-128)+_i>>Si;}for(t=Pi;t<ki;++t){e=76283*(t-16)+_i>>Si,Ei[t-Pi]=Wt(e,255),qi[t-Pi]=Wt(e+8>>4,15);}Ci=1;}return 1;}function dt(t){var r=t.ma,n=t.U,i=t.T;return e(!(1&t.ka)),0>=n||0>=i?0:(n=r.Ib(t,r),null!=r.Jb&&r.Jb(t,r,n),r.Dc+=n,1);}function pt(t){t.ma.memory=null;}function gt(t,e,r,n){return 47!=y(t,8)?0:(e[0]=y(t,14)+1,r[0]=y(t,14)+1,n[0]=y(t,1),0!=y(t,3)?0:!t.h);}function mt(t,e){if(4>t)return t+1;var r=t-2>>1;return (2+(1&t)<<r)+y(e,r)+1;}function vt(t,e){return 120<e?e-120:1<=(r=((r=$n[e-1])>>4)*t+(8-(15&r)))?r:1;var r;}function bt(t,e,r){var n=L(r),i=t[e+=255&n].g-8;return 0<i&&(x(r,r.u+8),n=L(r),e+=t[e].value,e+=n&(1<<i)-1),x(r,r.u+t[e].g),t[e].value;}function yt(t,r,n){return n.g+=t.g,n.value+=t.value<<r>>>0,e(8>=n.g),t.g;}function wt(t,r,n){var i=t.xc;return e((r=0==i?0:t.vc[t.md*(n>>i)+(r>>i)])<t.Wb),t.Ya[r];}function Nt(t,r,i,a){var o=t.ab,s=t.c*r,u=t.C;r=u+r;var c=i,l=a;for(a=t.Ta,i=t.Ua;0<o--;){var h=t.gc[o],f=u,d=r,p=c,g=l,m=(l=a,c=i,h.Ea);switch(e(f<d),e(d<=h.nc),h.hc){case 2:Gr(p,g,(d-f)*m,l,c);break;case 0:var v=f,b=d,y=l,w=c,N=(_=h).Ea;0==v&&(Vr(p,g,null,null,1,y,w),W(p,g+1,0,0,N-1,y,w+1),g+=N,w+=N,++v);for(var L=1<<_.b,A=L-1,x=q(N,_.b),S=_.K,_=_.w+(v>>_.b)*x;v<b;){var P=S,k=_,I=1;for(Wr(p,g,y,w-N,1,y,w);I<N;){var F=(I&~A)+L;F>N&&(F=N),(0, Zr[P[k++]>>8&15])(p,g+ +I,y,w+I-N,F-I,y,w+I),I=F;}g+=N,w+=N,++v&A||(_+=x);}d!=h.nc&&n(l,c-m,l,c+(d-f-1)*m,m);break;case 1:for(m=p,b=g,N=(p=h.Ea)-(w=p&~(y=(g=1<<h.b)-1)),v=q(p,h.b),L=h.K,h=h.w+(f>>h.b)*v;f<d;){for(A=L,x=h,S=new D(),_=b+w,P=b+p;b<_;){Y(A[x++],S),$r(S,m,b,g,l,c),b+=g,c+=g;}b<P&&(Y(A[x++],S),$r(S,m,b,N,l,c),b+=N,c+=N),++f&y||(h+=v);}break;case 3:if(p==l&&g==c&&0<h.b){for(b=l,p=m=c+(d-f)*m-(w=(d-f)*q(h.Ea,h.b)),g=l,y=c,v=[],w=(N=w)-1;0<=w;--w){v[w]=g[y+w];}for(w=N-1;0<=w;--w){b[p+w]=v[w];}Yr(h,f,d,l,m,l,c);}else Yr(h,f,d,p,g,l,c);}c=a,l=i;}l!=i&&n(a,i,c,l,s);}function Lt(t,r){var n=t.V,i=t.Ba+t.c*t.C,a=r-t.C;if(e(r<=t.l.o),e(16>=a),0<a){var o=t.l,s=t.Ta,u=t.Ua,c=o.width;if(Nt(t,a,n,i),a=u=[u],e((n=t.C)<(i=r)),e(o.v<o.va),i>o.o&&(i=o.o),n<o.j){var l=o.j-n;n=o.j;a[0]+=l*c;}if(n>=i?n=0:(a[0]+=4*o.v,o.ka=n-o.j,o.U=o.va-o.v,o.T=i-n,n=1),n){if(u=u[0],11>(n=t.ca).S){var h=n.f.RGBA,f=(i=n.S,a=o.U,o=o.T,l=h.eb,h.A),d=o;for(h=h.fb+t.Ma*h.A;0<d--;){var p=s,g=u,m=a,v=l,b=h;switch(i){case En:Qr(p,g,m,v,b);break;case qn:tn(p,g,m,v,b);break;case Hn:tn(p,g,m,v,b),An(v,b,0,m,1,0);break;case Rn:nn(p,g,m,v,b);break;case Tn:et(p,g,m,v,b,1);break;case Vn:et(p,g,m,v,b,1),An(v,b,0,m,1,0);break;case Dn:et(p,g,m,v,b,0);break;case Wn:et(p,g,m,v,b,0),An(v,b,1,m,1,0);break;case Un:en(p,g,m,v,b);break;case Gn:en(p,g,m,v,b),xn(v,b,m,1,0);break;case zn:rn(p,g,m,v,b);break;default:e(0);}u+=c,h+=f;}t.Ma+=o;}else alert("todo:EmitRescaledRowsYUVA");e(t.Ma<=n.height);}}t.C=r,e(t.C<=t.i);}function At(t){var e;if(0<t.ua)return 0;for(e=0;e<t.Wb;++e){var r=t.Ya[e].G,n=t.Ya[e].H;if(0<r[1][n[1]+0].g||0<r[2][n[2]+0].g||0<r[3][n[3]+0].g)return 0;}return 1;}function xt(t,r,n,i,a,o){if(0!=t.Z){var s=t.qd,u=t.rd;for(e(null!=mi[t.Z]);r<n;++r){mi[t.Z](s,u,i,a,i,a,o),s=i,u=a,a+=o;}t.qd=s,t.rd=u;}}function St(t,r){var n=t.l.ma,i=0==n.Z||1==n.Z?t.l.j:t.C;i=t.C<i?i:t.C;if(e(r<=t.l.o),r>i){var a=t.l.width,o=n.ca,s=n.tb+a*i,u=t.V,c=t.Ba+t.c*i,l=t.gc;e(1==t.ab),e(3==l[0].hc),Xr(l[0],i,r,u,c,o,s),xt(n,i,r,o,s,a);}t.C=t.Ma=r;}function _t(t,r,n,i,a,o,s){var u=t.$/i,c=t.$%i,l=t.m,h=t.s,f=n+t.$,d=f;a=n+i*a;var p=n+i*o,g=280+h.ua,m=t.Pb?u:16777216,v=0<h.ua?h.Wa:null,b=h.wc,y=f<p?wt(h,c,u):null;e(t.C<o),e(p<=a);var w=!1;t:for(;;){for(;w||f<p;){var N=0;if(u>=m){var _=f-n;e((m=t).Pb),m.wd=m.m,m.xd=_,0<m.s.ua&&B(m.s.Wa,m.s.vb),m=u+ti;}if(c&b||(y=wt(h,c,u)),e(null!=y),y.Qb&&(r[f]=y.qb,w=!0),!w)if(S(l),y.jc){N=l,_=r;var P=f,k=y.pd[L(N)&Rr-1];e(y.jc),256>k.g?(x(N,N.u+k.g),_[P]=k.value,N=0):(x(N,N.u+k.g-256),e(256<=k.value),N=k.value),0==N&&(w=!0);}else N=bt(y.G[0],y.H[0],l);if(l.h)break;if(w||256>N){if(!w)if(y.nd)r[f]=(y.qb|N<<8)>>>0;else {if(S(l),w=bt(y.G[1],y.H[1],l),S(l),_=bt(y.G[2],y.H[2],l),P=bt(y.G[3],y.H[3],l),l.h)break;r[f]=(P<<24|w<<16|N<<8|_)>>>0;}if(w=!1,++f,++c>=i&&(c=0,++u,null!=s&&u<=o&&!(u%16)&&s(t,u),null!=v))for(;d<f;){N=r[d++],v.X[(506832829*N&4294967295)>>>v.Mb]=N;}}else if(280>N){if(N=mt(N-256,l),_=bt(y.G[4],y.H[4],l),S(l),_=vt(i,_=mt(_,l)),l.h)break;if(f-n<_||a-f<N)break t;for(P=0;P<N;++P){r[f+P]=r[f+P-_];}for(f+=N,c+=N;c>=i;){c-=i,++u,null!=s&&u<=o&&!(u%16)&&s(t,u);}if(e(f<=a),c&b&&(y=wt(h,c,u)),null!=v)for(;d<f;){N=r[d++],v.X[(506832829*N&4294967295)>>>v.Mb]=N;}}else {if(!(N<g))break t;for(w=N-280,e(null!=v);d<f;){N=r[d++],v.X[(506832829*N&4294967295)>>>v.Mb]=N;}N=f,e(!(w>>>(_=v).Xa)),r[N]=_.X[w],w=!0;}w||e(l.h==A(l));}if(t.Pb&&l.h&&f<a)e(t.m.h),t.a=5,t.m=t.wd,t.$=t.xd,0<t.s.ua&&B(t.s.vb,t.s.Wa);else {if(l.h)break t;null!=s&&s(t,u>o?o:u),t.a=0,t.$=f-n;}return 1;}return t.a=3,0;}function Pt(t){e(null!=t),t.vc=null,t.yc=null,t.Ya=null;var r=t.Wa;null!=r&&(r.X=null),t.vb=null,e(null!=t);}function kt(){var e=new or();return null==e?null:(e.a=0,e.xb=gi,rt("Predictor","VP8LPredictors"),rt("Predictor","VP8LPredictors_C"),rt("PredictorAdd","VP8LPredictorsAdd"),rt("PredictorAdd","VP8LPredictorsAdd_C"),Gr=G,$r=J,Qr=K,tn=Z,en=$,rn=Q,nn=tt,t.VP8LMapColor32b=Jr,t.VP8LMapColor8b=Kr,e);}function It(t,r,n,s,u){var c=1,f=[t],p=[r],g=s.m,m=s.s,v=null,b=0;t:for(;;){if(n)for(;c&&y(g,1);){var w=f,N=p,A=s,_=1,P=A.m,k=A.gc[A.ab],I=y(P,2);if(A.Oc&1<<I)c=0;else {switch(A.Oc|=1<<I,k.hc=I,k.Ea=w[0],k.nc=N[0],k.K=[null],++A.ab,e(4>=A.ab),I){case 0:case 1:k.b=y(P,3)+2,_=It(q(k.Ea,k.b),q(k.nc,k.b),0,A,k.K),k.K=k.K[0];break;case 3:var F,C=y(P,8)+1,j=16<C?0:4<C?1:2<C?2:3;if(w[0]=q(k.Ea,j),k.b=j,F=_=It(C,1,0,A,k.K)){var B,M=C,E=k,T=1<<(8>>E.b),D=a(T);if(null==D)F=0;else {var U=E.K[0],z=E.w;for(D[0]=E.K[0][0],B=1;B<1*M;++B){D[B]=R(U[z+B],D[B-1]);}for(;B<4*T;++B){D[B]=0;}E.K[0]=null,E.K[0]=D,F=1;}}_=F;break;case 2:break;default:e(0);}c=_;}}if(f=f[0],p=p[0],c&&y(g,1)&&!(c=1<=(b=y(g,4))&&11>=b)){s.a=3;break t;}var H;if(H=c)e:{var V,W,G,Y=s,J=f,X=p,K=b,Z=n,$=Y.m,Q=Y.s,tt=[null],et=1,rt=0,nt=Qn[K];r:for(;;){if(Z&&y($,1)){var it=y($,3)+2,at=q(J,it),ot=q(X,it),st=at*ot;if(!It(at,ot,0,Y,tt))break r;for(tt=tt[0],Q.xc=it,V=0;V<st;++V){var ut=tt[V]>>8&65535;tt[V]=ut,ut>=et&&(et=ut+1);}}if($.h)break r;for(W=0;5>W;++W){var ct=Xn[W];!W&&0<K&&(ct+=1<<K),rt<ct&&(rt=ct);}var lt=o(et*nt,h),ht=et,ft=o(ht,d);if(null==ft)var dt=null;else e(65536>=ht),dt=ft;var pt=a(rt);if(null==dt||null==pt||null==lt){Y.a=1;break r;}var gt=lt;for(V=G=0;V<et;++V){var mt=dt[V],vt=mt.G,bt=mt.H,wt=0,Nt=1,Lt=0;for(W=0;5>W;++W){ct=Xn[W],vt[W]=gt,bt[W]=G,!W&&0<K&&(ct+=1<<K);n:{var At,xt=ct,St=Y,kt=pt,Ft=gt,Ct=G,jt=0,Ot=St.m,Bt=y(Ot,1);if(i(kt,0,0,xt),Bt){var Mt=y(Ot,1)+1,Et=y(Ot,1),qt=y(Ot,0==Et?1:8);kt[qt]=1,2==Mt&&(kt[qt=y(Ot,8)]=1);var Rt=1;}else {var Tt=a(19),Dt=y(Ot,4)+4;if(19<Dt){St.a=3;var Ut=0;break n;}for(At=0;At<Dt;++At){Tt[Zn[At]]=y(Ot,3);}var zt=void 0,Ht=void 0,Vt=St,Wt=Tt,Gt=xt,Yt=kt,Jt=0,Xt=Vt.m,Kt=8,Zt=o(128,h);i:for(;l(Zt,0,7,Wt,19);){if(y(Xt,1)){var $t=2+2*y(Xt,3);if((zt=2+y(Xt,$t))>Gt)break i;}else zt=Gt;for(Ht=0;Ht<Gt&&zt--;){S(Xt);var Qt=Zt[0+(127&L(Xt))];x(Xt,Xt.u+Qt.g);var te=Qt.value;if(16>te)Yt[Ht++]=te,0!=te&&(Kt=te);else {var ee=16==te,re=te-16,ne=Jn[re],ie=y(Xt,Yn[re])+ne;if(Ht+ie>Gt)break i;for(var ae=ee?Kt:0;0<ie--;){Yt[Ht++]=ae;}}}Jt=1;break i;}Jt||(Vt.a=3),Rt=Jt;}(Rt=Rt&&!Ot.h)&&(jt=l(Ft,Ct,8,kt,xt)),Rt&&0!=jt?Ut=jt:(St.a=3,Ut=0);}if(0==Ut)break r;if(Nt&&1==Kn[W]&&(Nt=0==gt[G].g),wt+=gt[G].g,G+=Ut,3>=W){var oe,se=pt[0];for(oe=1;oe<ct;++oe){pt[oe]>se&&(se=pt[oe]);}Lt+=se;}}if(mt.nd=Nt,mt.Qb=0,Nt&&(mt.qb=(vt[3][bt[3]+0].value<<24|vt[1][bt[1]+0].value<<16|vt[2][bt[2]+0].value)>>>0,0==wt&&256>vt[0][bt[0]+0].value&&(mt.Qb=1,mt.qb+=vt[0][bt[0]+0].value<<8)),mt.jc=!mt.Qb&&6>Lt,mt.jc){var ue,ce=mt;for(ue=0;ue<Rr;++ue){var le=ue,he=ce.pd[le],fe=ce.G[0][ce.H[0]+le];256<=fe.value?(he.g=fe.g+256,he.value=fe.value):(he.g=0,he.value=0,le>>=yt(fe,8,he),le>>=yt(ce.G[1][ce.H[1]+le],16,he),le>>=yt(ce.G[2][ce.H[2]+le],0,he),yt(ce.G[3][ce.H[3]+le],24,he));}}}Q.vc=tt,Q.Wb=et,Q.Ya=dt,Q.yc=lt,H=1;break e;}H=0;}if(!(c=H)){s.a=3;break t;}if(0<b){if(m.ua=1<<b,!O(m.Wa,b)){s.a=1,c=0;break t;}}else m.ua=0;var de=s,pe=f,ge=p,me=de.s,ve=me.xc;if(de.c=pe,de.i=ge,me.md=q(pe,ve),me.wc=0==ve?-1:(1<<ve)-1,n){s.xb=pi;break t;}if(null==(v=a(f*p))){s.a=1,c=0;break t;}c=(c=_t(s,v,0,f,p,p,null))&&!g.h;break t;}return c?(null!=u?u[0]=v:(e(null==v),e(n)),s.$=0,n||Pt(m)):Pt(m),c;}function Ft(t,r){var n=t.c*t.i,i=n+r+16*r;return e(t.c<=r),t.V=a(i),null==t.V?(t.Ta=null,t.Ua=0,t.a=1,0):(t.Ta=t.V,t.Ua=t.Ba+n+r,1);}function Ct(t,r){var n=t.C,i=r-n,a=t.V,o=t.Ba+t.c*n;for(e(r<=t.l.o);0<i;){var s=16<i?16:i,u=t.l.ma,c=t.l.width,l=c*s,h=u.ca,f=u.tb+c*n,d=t.Ta,p=t.Ua;Nt(t,s,a,o),_n(d,p,h,f,l),xt(u,n,n+s,h,f,c),i-=s,a+=s*t.c,n+=s;}e(n==r),t.C=t.Ma=r;}function jt(){this.ub=this.yd=this.td=this.Rb=0;}function Ot(){this.Kd=this.Ld=this.Ud=this.Td=this.i=this.c=0;}function Bt(){this.Fb=this.Bb=this.Cb=0,this.Zb=a(4),this.Lb=a(4);}function Mt(){this.Yb=function(){var t=[];return function t(e,r,n){for(var i=n[r],a=0;a<i&&(e.push(n.length>r+1?[]:0),!(n.length<r+1));a++){t(e[a],r+1,n);}}(t,0,[3,11]),t;}();}function Et(){this.jb=a(3),this.Wc=s([4,8],Mt),this.Xc=s([4,17],Mt);}function qt(){this.Pc=this.wb=this.Tb=this.zd=0,this.vd=new a(4),this.od=new a(4);}function Rt(){this.ld=this.La=this.dd=this.tc=0;}function Tt(){this.Na=this.la=0;}function Dt(){this.Sc=[0,0],this.Eb=[0,0],this.Qc=[0,0],this.ia=this.lc=0;}function Ut(){this.ad=a(384),this.Za=0,this.Ob=a(16),this.$b=this.Ad=this.ia=this.Gc=this.Hc=this.Dd=0;}function zt(){this.uc=this.M=this.Nb=0,this.wa=Array(new Rt()),this.Y=0,this.ya=Array(new Ut()),this.aa=0,this.l=new Gt();}function Ht(){this.y=a(16),this.f=a(8),this.ea=a(8);}function Vt(){this.cb=this.a=0,this.sc="",this.m=new w(),this.Od=new jt(),this.Kc=new Ot(),this.ed=new qt(),this.Qa=new Bt(),this.Ic=this.$c=this.Aa=0,this.D=new zt(),this.Xb=this.Va=this.Hb=this.zb=this.yb=this.Ub=this.za=0,this.Jc=o(8,w),this.ia=0,this.pb=o(4,Dt),this.Pa=new Et(),this.Bd=this.kc=0,this.Ac=[],this.Bc=0,this.zc=[0,0,0,0],this.Gd=Array(new Ht()),this.Hd=0,this.rb=Array(new Tt()),this.sb=0,this.wa=Array(new Rt()),this.Y=0,this.oc=[],this.pc=0,this.sa=[],this.ta=0,this.qa=[],this.ra=0,this.Ha=[],this.B=this.R=this.Ia=0,this.Ec=[],this.M=this.ja=this.Vb=this.Fc=0,this.ya=Array(new Ut()),this.L=this.aa=0,this.gd=s([4,2],Rt),this.ga=null,this.Fa=[],this.Cc=this.qc=this.P=0,this.Gb=[],this.Uc=0,this.mb=[],this.nb=0,this.rc=[],this.Ga=this.Vc=0;}function Wt(t,e){return 0>t?0:t>e?e:t;}function Gt(){this.T=this.U=this.ka=this.height=this.width=0,this.y=[],this.f=[],this.ea=[],this.Rc=this.fa=this.W=this.N=this.O=0,this.ma="void",this.put="VP8IoPutHook",this.ac="VP8IoSetupHook",this.bc="VP8IoTeardownHook",this.ha=this.Kb=0,this.data=[],this.hb=this.ib=this.da=this.o=this.j=this.va=this.v=this.Da=this.ob=this.w=0,this.F=[],this.J=0;}function Yt(){var t=new Vt();return null!=t&&(t.a=0,t.sc="OK",t.cb=0,t.Xb=0,ni||(ni=Zt)),t;}function Jt(t,e,r){return 0==t.a&&(t.a=e,t.sc=r,t.cb=0),0;}function Xt(t,e,r){return 3<=r&&157==t[e+0]&&1==t[e+1]&&42==t[e+2];}function Kt(t,r){if(null==t)return 0;if(t.a=0,t.sc="OK",null==r)return Jt(t,2,"null VP8Io passed to VP8GetHeaders()");var n=r.data,a=r.w,o=r.ha;if(4>o)return Jt(t,7,"Truncated header.");var s=n[a+0]|n[a+1]<<8|n[a+2]<<16,u=t.Od;if(u.Rb=!(1&s),u.td=s>>1&7,u.yd=s>>4&1,u.ub=s>>5,3<u.td)return Jt(t,3,"Incorrect keyframe parameters.");if(!u.yd)return Jt(t,4,"Frame not displayable.");a+=3,o-=3;var c=t.Kc;if(u.Rb){if(7>o)return Jt(t,7,"cannot parse picture header");if(!Xt(n,a,o))return Jt(t,3,"Bad code word");c.c=16383&(n[a+4]<<8|n[a+3]),c.Td=n[a+4]>>6,c.i=16383&(n[a+6]<<8|n[a+5]),c.Ud=n[a+6]>>6,a+=7,o-=7,t.za=c.c+15>>4,t.Ub=c.i+15>>4,r.width=c.c,r.height=c.i,r.Da=0,r.j=0,r.v=0,r.va=r.width,r.o=r.height,r.da=0,r.ib=r.width,r.hb=r.height,r.U=r.width,r.T=r.height,i((s=t.Pa).jb,0,255,s.jb.length),e(null!=(s=t.Qa)),s.Cb=0,s.Bb=0,s.Fb=1,i(s.Zb,0,0,s.Zb.length),i(s.Lb,0,0,s.Lb);}if(u.ub>o)return Jt(t,7,"bad partition length");p(s=t.m,n,a,u.ub),a+=u.ub,o-=u.ub,u.Rb&&(c.Ld=P(s),c.Kd=P(s)),c=t.Qa;var l,h=t.Pa;if(e(null!=s),e(null!=c),c.Cb=P(s),c.Cb){if(c.Bb=P(s),P(s)){for(c.Fb=P(s),l=0;4>l;++l){c.Zb[l]=P(s)?m(s,7):0;}for(l=0;4>l;++l){c.Lb[l]=P(s)?m(s,6):0;}}if(c.Bb)for(l=0;3>l;++l){h.jb[l]=P(s)?g(s,8):255;}}else c.Bb=0;if(s.Ka)return Jt(t,3,"cannot parse segment header");if((c=t.ed).zd=P(s),c.Tb=g(s,6),c.wb=g(s,3),c.Pc=P(s),c.Pc&&P(s)){for(h=0;4>h;++h){P(s)&&(c.vd[h]=m(s,6));}for(h=0;4>h;++h){P(s)&&(c.od[h]=m(s,6));}}if(t.L=0==c.Tb?0:c.zd?1:2,s.Ka)return Jt(t,3,"cannot parse filter header");var f=o;if(o=l=a,a=l+f,c=f,t.Xb=(1<<g(t.m,2))-1,f<3*(h=t.Xb))n=7;else {for(l+=3*h,c-=3*h,f=0;f<h;++f){var d=n[o+0]|n[o+1]<<8|n[o+2]<<16;d>c&&(d=c),p(t.Jc[+f],n,l,d),l+=d,c-=d,o+=3;}p(t.Jc[+h],n,l,c),n=l<a?0:5;}if(0!=n)return Jt(t,n,"cannot parse partitions");for(n=g(l=t.m,7),o=P(l)?m(l,4):0,a=P(l)?m(l,4):0,c=P(l)?m(l,4):0,h=P(l)?m(l,4):0,l=P(l)?m(l,4):0,f=t.Qa,d=0;4>d;++d){if(f.Cb){var v=f.Zb[d];f.Fb||(v+=n);}else {if(0<d){t.pb[d]=t.pb[0];continue;}v=n;}var b=t.pb[d];b.Sc[0]=ei[Wt(v+o,127)],b.Sc[1]=ri[Wt(v+0,127)],b.Eb[0]=2*ei[Wt(v+a,127)],b.Eb[1]=101581*ri[Wt(v+c,127)]>>16,8>b.Eb[1]&&(b.Eb[1]=8),b.Qc[0]=ei[Wt(v+h,117)],b.Qc[1]=ri[Wt(v+l,127)],b.lc=v+l;}if(!u.Rb)return Jt(t,4,"Not a key frame.");for(P(s),u=t.Pa,n=0;4>n;++n){for(o=0;8>o;++o){for(a=0;3>a;++a){for(c=0;11>c;++c){h=k(s,ci[n][o][a][c])?g(s,8):si[n][o][a][c],u.Wc[n][o].Yb[a][c]=h;}}}for(o=0;17>o;++o){u.Xc[n][o]=u.Wc[n][li[o]];}}return t.kc=P(s),t.kc&&(t.Bd=g(s,8)),t.cb=1;}function Zt(t,e,r,n,i,a,o){var s=e[i].Yb[r];for(r=0;16>i;++i){if(!k(t,s[r+0]))return i;for(;!k(t,s[r+1]);){if(s=e[++i].Yb[0],r=0,16==i)return 16;}var u=e[i+1].Yb;if(k(t,s[r+2])){var c=t,l=0;if(k(c,(f=s)[(h=r)+3])){if(k(c,f[h+6])){for(s=0,h=2*(l=k(c,f[h+8]))+(f=k(c,f[h+9+l])),l=0,f=ii[h];f[s];++s){l+=l+k(c,f[s]);}l+=3+(8<<h);}else k(c,f[h+7])?(l=7+2*k(c,165),l+=k(c,145)):l=5+k(c,159);}else l=k(c,f[h+4])?3+k(c,f[h+5]):2;s=u[2];}else l=1,s=u[1];u=o+ai[i],0>(c=t).b&&_(c);var h,f=c.b,d=(h=c.Ca>>1)-(c.I>>f)>>31;--c.b,c.Ca+=d,c.Ca|=1,c.I-=(h+1&d)<<f,a[u]=((l^d)-d)*n[(0<i)+0];}return 16;}function $t(t){var e=t.rb[t.sb-1];e.la=0,e.Na=0,i(t.zc,0,0,t.zc.length),t.ja=0;}function Qt(t,r){if(null==t)return 0;if(null==r)return Jt(t,2,"NULL VP8Io parameter in VP8Decode().");if(!t.cb&&!Kt(t,r))return 0;if(e(t.cb),null==r.ac||r.ac(r)){r.ob&&(t.L=0);var s=Ti[t.L];if(2==t.L?(t.yb=0,t.zb=0):(t.yb=r.v-s>>4,t.zb=r.j-s>>4,0>t.yb&&(t.yb=0),0>t.zb&&(t.zb=0)),t.Va=r.o+15+s>>4,t.Hb=r.va+15+s>>4,t.Hb>t.za&&(t.Hb=t.za),t.Va>t.Ub&&(t.Va=t.Ub),0<t.L){var u=t.ed;for(s=0;4>s;++s){var c;if(t.Qa.Cb){var l=t.Qa.Lb[s];t.Qa.Fb||(l+=u.Tb);}else l=u.Tb;for(c=0;1>=c;++c){var h=t.gd[s][c],f=l;if(u.Pc&&(f+=u.vd[0],c&&(f+=u.od[0])),0<(f=0>f?0:63<f?63:f)){var d=f;0<u.wb&&(d=4<u.wb?d>>2:d>>1)>9-u.wb&&(d=9-u.wb),1>d&&(d=1),h.dd=d,h.tc=2*f+d,h.ld=40<=f?2:15<=f?1:0;}else h.tc=0;h.La=c;}}}s=0;}else Jt(t,6,"Frame setup failed"),s=t.a;if(s=0==s){if(s){t.$c=0,0<t.Aa||(t.Ic=Ui);t:{s=t.Ic;u=4*(d=t.za);var p=32*d,g=d+1,m=0<t.L?d*(0<t.Aa?2:1):0,v=(2==t.Aa?2:1)*d;if((h=u+832+(c=3*(16*s+Ti[t.L])/2*p)+(l=null!=t.Fa&&0<t.Fa.length?t.Kc.c*t.Kc.i:0))!=h)s=0;else {if(h>t.Vb){if(t.Vb=0,t.Ec=a(h),t.Fc=0,null==t.Ec){s=Jt(t,1,"no memory during frame initialization.");break t;}t.Vb=h;}h=t.Ec,f=t.Fc,t.Ac=h,t.Bc=f,f+=u,t.Gd=o(p,Ht),t.Hd=0,t.rb=o(g+1,Tt),t.sb=1,t.wa=m?o(m,Rt):null,t.Y=0,t.D.Nb=0,t.D.wa=t.wa,t.D.Y=t.Y,0<t.Aa&&(t.D.Y+=d),e(!0),t.oc=h,t.pc=f,f+=832,t.ya=o(v,Ut),t.aa=0,t.D.ya=t.ya,t.D.aa=t.aa,2==t.Aa&&(t.D.aa+=d),t.R=16*d,t.B=8*d,d=(p=Ti[t.L])*t.R,p=p/2*t.B,t.sa=h,t.ta=f+d,t.qa=t.sa,t.ra=t.ta+16*s*t.R+p,t.Ha=t.qa,t.Ia=t.ra+8*s*t.B+p,t.$c=0,f+=c,t.mb=l?h:null,t.nb=l?f:null,e(f+l<=t.Fc+t.Vb),$t(t),i(t.Ac,t.Bc,0,u),s=1;}}if(s){if(r.ka=0,r.y=t.sa,r.O=t.ta,r.f=t.qa,r.N=t.ra,r.ea=t.Ha,r.Vd=t.Ia,r.fa=t.R,r.Rc=t.B,r.F=null,r.J=0,!Cn){for(s=-255;255>=s;++s){Pn[255+s]=0>s?-s:s;}for(s=-1020;1020>=s;++s){kn[1020+s]=-128>s?-128:127<s?127:s;}for(s=-112;112>=s;++s){In[112+s]=-16>s?-16:15<s?15:s;}for(s=-255;510>=s;++s){Fn[255+s]=0>s?0:255<s?255:s;}Cn=1;}an=ce,on=ae,un=oe,cn=se,ln=ue,sn=ie,hn=Je,fn=Xe,dn=$e,pn=Qe,gn=Ke,mn=Ze,vn=tr,bn=er,yn=ze,wn=He,Nn=Ve,Ln=We,fi[0]=xe,fi[1]=he,fi[2]=Le,fi[3]=Ae,fi[4]=Se,fi[5]=Pe,fi[6]=_e,fi[7]=ke,fi[8]=Fe,fi[9]=Ie,hi[0]=ve,hi[1]=de,hi[2]=pe,hi[3]=ge,hi[4]=be,hi[5]=ye,hi[6]=we,di[0]=Be,di[1]=fe,di[2]=Ce,di[3]=je,di[4]=Ee,di[5]=Me,di[6]=qe,s=1;}else s=0;}s&&(s=function(t,r){for(t.M=0;t.M<t.Va;++t.M){var o,s=t.Jc[t.M&t.Xb],u=t.m,c=t;for(o=0;o<c.za;++o){var l=u,h=c,f=h.Ac,d=h.Bc+4*o,p=h.zc,g=h.ya[h.aa+o];if(h.Qa.Bb?g.$b=k(l,h.Pa.jb[0])?2+k(l,h.Pa.jb[2]):k(l,h.Pa.jb[1]):g.$b=0,h.kc&&(g.Ad=k(l,h.Bd)),g.Za=!k(l,145)+0,g.Za){var m=g.Ob,v=0;for(h=0;4>h;++h){var b,y=p[0+h];for(b=0;4>b;++b){y=ui[f[d+b]][y];for(var w=oi[k(l,y[0])];0<w;){w=oi[2*w+k(l,y[w])];}y=-w,f[d+b]=y;}n(m,v,f,d,4),v+=4,p[0+h]=y;}}else y=k(l,156)?k(l,128)?1:3:k(l,163)?2:0,g.Ob[0]=y,i(f,d,y,4),i(p,0,y,4);g.Dd=k(l,142)?k(l,114)?k(l,183)?1:3:2:0;}if(c.m.Ka)return Jt(t,7,"Premature end-of-partition0 encountered.");for(;t.ja<t.za;++t.ja){if(c=s,l=(u=t).rb[u.sb-1],f=u.rb[u.sb+u.ja],o=u.ya[u.aa+u.ja],d=u.kc?o.Ad:0)l.la=f.la=0,o.Za||(l.Na=f.Na=0),o.Hc=0,o.Gc=0,o.ia=0;else {var N,L;l=f,f=c,d=u.Pa.Xc,p=u.ya[u.aa+u.ja],g=u.pb[p.$b];if(h=p.ad,m=0,v=u.rb[u.sb-1],y=b=0,i(h,m,0,384),p.Za)var A=0,x=d[3];else {w=a(16);var S=l.Na+v.Na;if(S=ni(f,d[1],S,g.Eb,0,w,0),l.Na=v.Na=(0<S)+0,1<S)an(w,0,h,m);else {var _=w[0]+3>>3;for(w=0;256>w;w+=16){h[m+w]=_;}}A=1,x=d[0];}var P=15&l.la,I=15&v.la;for(w=0;4>w;++w){var F=1&I;for(_=L=0;4>_;++_){P=P>>1|(F=(S=ni(f,x,S=F+(1&P),g.Sc,A,h,m))>A)<<7,L=L<<2|(3<S?3:1<S?2:0!=h[m+0]),m+=16;}P>>=4,I=I>>1|F<<7,b=(b<<8|L)>>>0;}for(x=P,A=I>>4,N=0;4>N;N+=2){for(L=0,P=l.la>>4+N,I=v.la>>4+N,w=0;2>w;++w){for(F=1&I,_=0;2>_;++_){S=F+(1&P),P=P>>1|(F=0<(S=ni(f,d[2],S,g.Qc,0,h,m)))<<3,L=L<<2|(3<S?3:1<S?2:0!=h[m+0]),m+=16;}P>>=2,I=I>>1|F<<5;}y|=L<<4*N,x|=P<<4<<N,A|=(240&I)<<N;}l.la=x,v.la=A,p.Hc=b,p.Gc=y,p.ia=43690&y?0:g.ia,d=!(b|y);}if(0<u.L&&(u.wa[u.Y+u.ja]=u.gd[o.$b][o.Za],u.wa[u.Y+u.ja].La|=!d),c.Ka)return Jt(t,7,"Premature end-of-file encountered.");}if($t(t),u=r,c=1,o=(s=t).D,l=0<s.L&&s.M>=s.zb&&s.M<=s.Va,0==s.Aa)t:{if(o.M=s.M,o.uc=l,Or(s,o),c=1,o=(L=s.D).Nb,l=(y=Ti[s.L])*s.R,f=y/2*s.B,w=16*o*s.R,_=8*o*s.B,d=s.sa,p=s.ta-l+w,g=s.qa,h=s.ra-f+_,m=s.Ha,v=s.Ia-f+_,I=0==(P=L.M),b=P>=s.Va-1,2==s.Aa&&Or(s,L),L.uc)for(F=(S=s).D.M,e(S.D.uc),L=S.yb;L<S.Hb;++L){A=L,x=F;var C=(j=(U=S).D).Nb;N=U.R;var j=j.wa[j.Y+A],O=U.sa,B=U.ta+16*C*N+16*A,M=j.dd,E=j.tc;if(0!=E)if(e(3<=E),1==U.L)0<A&&wn(O,B,N,E+4),j.La&&Ln(O,B,N,E),0<x&&yn(O,B,N,E+4),j.La&&Nn(O,B,N,E);else {var q=U.B,R=U.qa,T=U.ra+8*C*q+8*A,D=U.Ha,U=U.Ia+8*C*q+8*A;C=j.ld;0<A&&(fn(O,B,N,E+4,M,C),pn(R,T,D,U,q,E+4,M,C)),j.La&&(mn(O,B,N,E,M,C),bn(R,T,D,U,q,E,M,C)),0<x&&(hn(O,B,N,E+4,M,C),dn(R,T,D,U,q,E+4,M,C)),j.La&&(gn(O,B,N,E,M,C),vn(R,T,D,U,q,E,M,C));}}if(s.ia&&alert("todo:DitherRow"),null!=u.put){if(L=16*P,P=16*(P+1),I?(u.y=s.sa,u.O=s.ta+w,u.f=s.qa,u.N=s.ra+_,u.ea=s.Ha,u.W=s.Ia+_):(L-=y,u.y=d,u.O=p,u.f=g,u.N=h,u.ea=m,u.W=v),b||(P-=y),P>u.o&&(P=u.o),u.F=null,u.J=null,null!=s.Fa&&0<s.Fa.length&&L<P&&(u.J=hr(s,u,L,P-L),u.F=s.mb,null==u.F&&0==u.F.length)){c=Jt(s,3,"Could not decode alpha data.");break t;}L<u.j&&(y=u.j-L,L=u.j,e(!(1&y)),u.O+=s.R*y,u.N+=s.B*(y>>1),u.W+=s.B*(y>>1),null!=u.F&&(u.J+=u.width*y)),L<P&&(u.O+=u.v,u.N+=u.v>>1,u.W+=u.v>>1,null!=u.F&&(u.J+=u.v),u.ka=L-u.j,u.U=u.va-u.v,u.T=P-L,c=u.put(u));}o+1!=s.Ic||b||(n(s.sa,s.ta-l,d,p+16*s.R,l),n(s.qa,s.ra-f,g,h+8*s.B,f),n(s.Ha,s.Ia-f,m,v+8*s.B,f));}if(!c)return Jt(t,6,"Output aborted.");}return 1;}(t,r)),null!=r.bc&&r.bc(r),s&=1;}return s?(t.cb=0,s):0;}function te(t,e,r,n,i){i=t[e+r+32*n]+(i>>3),t[e+r+32*n]=-256&i?0>i?0:255:i;}function ee(t,e,r,n,i,a){te(t,e,0,r,n+i),te(t,e,1,r,n+a),te(t,e,2,r,n-a),te(t,e,3,r,n-i);}function re(t){return (20091*t>>16)+t;}function ne(t,e,r,n){var i,o=0,s=a(16);for(i=0;4>i;++i){var u=t[e+0]+t[e+8],c=t[e+0]-t[e+8],l=(35468*t[e+4]>>16)-re(t[e+12]),h=re(t[e+4])+(35468*t[e+12]>>16);s[o+0]=u+h,s[o+1]=c+l,s[o+2]=c-l,s[o+3]=u-h,o+=4,e++;}for(i=o=0;4>i;++i){u=(t=s[o+0]+4)+s[o+8],c=t-s[o+8],l=(35468*s[o+4]>>16)-re(s[o+12]),te(r,n,0,0,u+(h=re(s[o+4])+(35468*s[o+12]>>16))),te(r,n,1,0,c+l),te(r,n,2,0,c-l),te(r,n,3,0,u-h),o++,n+=32;}}function ie(t,e,r,n){var i=t[e+0]+4,a=35468*t[e+4]>>16,o=re(t[e+4]),s=35468*t[e+1]>>16;ee(r,n,0,i+o,t=re(t[e+1]),s),ee(r,n,1,i+a,t,s),ee(r,n,2,i-a,t,s),ee(r,n,3,i-o,t,s);}function ae(t,e,r,n,i){ne(t,e,r,n),i&&ne(t,e+16,r,n+4);}function oe(t,e,r,n){on(t,e+0,r,n,1),on(t,e+32,r,n+128,1);}function se(t,e,r,n){var i;for(t=t[e+0]+4,i=0;4>i;++i){for(e=0;4>e;++e){te(r,n,e,i,t);}}}function ue(t,e,r,n){t[e+0]&&cn(t,e+0,r,n),t[e+16]&&cn(t,e+16,r,n+4),t[e+32]&&cn(t,e+32,r,n+128),t[e+48]&&cn(t,e+48,r,n+128+4);}function ce(t,e,r,n){var i,o=a(16);for(i=0;4>i;++i){var s=t[e+0+i]+t[e+12+i],u=t[e+4+i]+t[e+8+i],c=t[e+4+i]-t[e+8+i],l=t[e+0+i]-t[e+12+i];o[0+i]=s+u,o[8+i]=s-u,o[4+i]=l+c,o[12+i]=l-c;}for(i=0;4>i;++i){s=(t=o[0+4*i]+3)+o[3+4*i],u=o[1+4*i]+o[2+4*i],c=o[1+4*i]-o[2+4*i],l=t-o[3+4*i],r[n+0]=s+u>>3,r[n+16]=l+c>>3,r[n+32]=s-u>>3,r[n+48]=l-c>>3,n+=64;}}function le(t,e,r){var n,i=e-32,a=Bn,o=255-t[i-1];for(n=0;n<r;++n){var s,u=a,c=o+t[e-1];for(s=0;s<r;++s){t[e+s]=u[c+t[i+s]];}e+=32;}}function he(t,e){le(t,e,4);}function fe(t,e){le(t,e,8);}function de(t,e){le(t,e,16);}function pe(t,e){var r;for(r=0;16>r;++r){n(t,e+32*r,t,e-32,16);}}function ge(t,e){var r;for(r=16;0<r;--r){i(t,e,t[e-1],16),e+=32;}}function me(t,e,r){var n;for(n=0;16>n;++n){i(e,r+32*n,t,16);}}function ve(t,e){var r,n=16;for(r=0;16>r;++r){n+=t[e-1+32*r]+t[e+r-32];}me(n>>5,t,e);}function be(t,e){var r,n=8;for(r=0;16>r;++r){n+=t[e-1+32*r];}me(n>>4,t,e);}function ye(t,e){var r,n=8;for(r=0;16>r;++r){n+=t[e+r-32];}me(n>>4,t,e);}function we(t,e){me(128,t,e);}function Ne(t,e,r){return t+2*e+r+2>>2;}function Le(t,e){var r,i=e-32;i=new Uint8Array([Ne(t[i-1],t[i+0],t[i+1]),Ne(t[i+0],t[i+1],t[i+2]),Ne(t[i+1],t[i+2],t[i+3]),Ne(t[i+2],t[i+3],t[i+4])]);for(r=0;4>r;++r){n(t,e+32*r,i,0,i.length);}}function Ae(t,e){var r=t[e-1],n=t[e-1+32],i=t[e-1+64],a=t[e-1+96];I(t,e+0,16843009*Ne(t[e-1-32],r,n)),I(t,e+32,16843009*Ne(r,n,i)),I(t,e+64,16843009*Ne(n,i,a)),I(t,e+96,16843009*Ne(i,a,a));}function xe(t,e){var r,n=4;for(r=0;4>r;++r){n+=t[e+r-32]+t[e-1+32*r];}for(n>>=3,r=0;4>r;++r){i(t,e+32*r,n,4);}}function Se(t,e){var r=t[e-1+0],n=t[e-1+32],i=t[e-1+64],a=t[e-1-32],o=t[e+0-32],s=t[e+1-32],u=t[e+2-32],c=t[e+3-32];t[e+0+96]=Ne(n,i,t[e-1+96]),t[e+1+96]=t[e+0+64]=Ne(r,n,i),t[e+2+96]=t[e+1+64]=t[e+0+32]=Ne(a,r,n),t[e+3+96]=t[e+2+64]=t[e+1+32]=t[e+0+0]=Ne(o,a,r),t[e+3+64]=t[e+2+32]=t[e+1+0]=Ne(s,o,a),t[e+3+32]=t[e+2+0]=Ne(u,s,o),t[e+3+0]=Ne(c,u,s);}function _e(t,e){var r=t[e+1-32],n=t[e+2-32],i=t[e+3-32],a=t[e+4-32],o=t[e+5-32],s=t[e+6-32],u=t[e+7-32];t[e+0+0]=Ne(t[e+0-32],r,n),t[e+1+0]=t[e+0+32]=Ne(r,n,i),t[e+2+0]=t[e+1+32]=t[e+0+64]=Ne(n,i,a),t[e+3+0]=t[e+2+32]=t[e+1+64]=t[e+0+96]=Ne(i,a,o),t[e+3+32]=t[e+2+64]=t[e+1+96]=Ne(a,o,s),t[e+3+64]=t[e+2+96]=Ne(o,s,u),t[e+3+96]=Ne(s,u,u);}function Pe(t,e){var r=t[e-1+0],n=t[e-1+32],i=t[e-1+64],a=t[e-1-32],o=t[e+0-32],s=t[e+1-32],u=t[e+2-32],c=t[e+3-32];t[e+0+0]=t[e+1+64]=a+o+1>>1,t[e+1+0]=t[e+2+64]=o+s+1>>1,t[e+2+0]=t[e+3+64]=s+u+1>>1,t[e+3+0]=u+c+1>>1,t[e+0+96]=Ne(i,n,r),t[e+0+64]=Ne(n,r,a),t[e+0+32]=t[e+1+96]=Ne(r,a,o),t[e+1+32]=t[e+2+96]=Ne(a,o,s),t[e+2+32]=t[e+3+96]=Ne(o,s,u),t[e+3+32]=Ne(s,u,c);}function ke(t,e){var r=t[e+0-32],n=t[e+1-32],i=t[e+2-32],a=t[e+3-32],o=t[e+4-32],s=t[e+5-32],u=t[e+6-32],c=t[e+7-32];t[e+0+0]=r+n+1>>1,t[e+1+0]=t[e+0+64]=n+i+1>>1,t[e+2+0]=t[e+1+64]=i+a+1>>1,t[e+3+0]=t[e+2+64]=a+o+1>>1,t[e+0+32]=Ne(r,n,i),t[e+1+32]=t[e+0+96]=Ne(n,i,a),t[e+2+32]=t[e+1+96]=Ne(i,a,o),t[e+3+32]=t[e+2+96]=Ne(a,o,s),t[e+3+64]=Ne(o,s,u),t[e+3+96]=Ne(s,u,c);}function Ie(t,e){var r=t[e-1+0],n=t[e-1+32],i=t[e-1+64],a=t[e-1+96];t[e+0+0]=r+n+1>>1,t[e+2+0]=t[e+0+32]=n+i+1>>1,t[e+2+32]=t[e+0+64]=i+a+1>>1,t[e+1+0]=Ne(r,n,i),t[e+3+0]=t[e+1+32]=Ne(n,i,a),t[e+3+32]=t[e+1+64]=Ne(i,a,a),t[e+3+64]=t[e+2+64]=t[e+0+96]=t[e+1+96]=t[e+2+96]=t[e+3+96]=a;}function Fe(t,e){var r=t[e-1+0],n=t[e-1+32],i=t[e-1+64],a=t[e-1+96],o=t[e-1-32],s=t[e+0-32],u=t[e+1-32],c=t[e+2-32];t[e+0+0]=t[e+2+32]=r+o+1>>1,t[e+0+32]=t[e+2+64]=n+r+1>>1,t[e+0+64]=t[e+2+96]=i+n+1>>1,t[e+0+96]=a+i+1>>1,t[e+3+0]=Ne(s,u,c),t[e+2+0]=Ne(o,s,u),t[e+1+0]=t[e+3+32]=Ne(r,o,s),t[e+1+32]=t[e+3+64]=Ne(n,r,o),t[e+1+64]=t[e+3+96]=Ne(i,n,r),t[e+1+96]=Ne(a,i,n);}function Ce(t,e){var r;for(r=0;8>r;++r){n(t,e+32*r,t,e-32,8);}}function je(t,e){var r;for(r=0;8>r;++r){i(t,e,t[e-1],8),e+=32;}}function Oe(t,e,r){var n;for(n=0;8>n;++n){i(e,r+32*n,t,8);}}function Be(t,e){var r,n=8;for(r=0;8>r;++r){n+=t[e+r-32]+t[e-1+32*r];}Oe(n>>4,t,e);}function Me(t,e){var r,n=4;for(r=0;8>r;++r){n+=t[e+r-32];}Oe(n>>3,t,e);}function Ee(t,e){var r,n=4;for(r=0;8>r;++r){n+=t[e-1+32*r];}Oe(n>>3,t,e);}function qe(t,e){Oe(128,t,e);}function Re(t,e,r){var n=t[e-r],i=t[e+0],a=3*(i-n)+jn[1020+t[e-2*r]-t[e+r]],o=On[112+(a+4>>3)];t[e-r]=Bn[255+n+On[112+(a+3>>3)]],t[e+0]=Bn[255+i-o];}function Te(t,e,r,n){var i=t[e+0],a=t[e+r];return Mn[255+t[e-2*r]-t[e-r]]>n||Mn[255+a-i]>n;}function De(t,e,r,n){return 4*Mn[255+t[e-r]-t[e+0]]+Mn[255+t[e-2*r]-t[e+r]]<=n;}function Ue(t,e,r,n,i){var a=t[e-3*r],o=t[e-2*r],s=t[e-r],u=t[e+0],c=t[e+r],l=t[e+2*r],h=t[e+3*r];return 4*Mn[255+s-u]+Mn[255+o-c]>n?0:Mn[255+t[e-4*r]-a]<=i&&Mn[255+a-o]<=i&&Mn[255+o-s]<=i&&Mn[255+h-l]<=i&&Mn[255+l-c]<=i&&Mn[255+c-u]<=i;}function ze(t,e,r,n){var i=2*n+1;for(n=0;16>n;++n){De(t,e+n,r,i)&&Re(t,e+n,r);}}function He(t,e,r,n){var i=2*n+1;for(n=0;16>n;++n){De(t,e+n*r,1,i)&&Re(t,e+n*r,1);}}function Ve(t,e,r,n){var i;for(i=3;0<i;--i){ze(t,e+=4*r,r,n);}}function We(t,e,r,n){var i;for(i=3;0<i;--i){He(t,e+=4,r,n);}}function Ge(t,e,r,n,i,a,o,s){for(a=2*a+1;0<i--;){if(Ue(t,e,r,a,o))if(Te(t,e,r,s))Re(t,e,r);else {var u=t,c=e,l=r,h=u[c-2*l],f=u[c-l],d=u[c+0],p=u[c+l],g=u[c+2*l],m=27*(b=jn[1020+3*(d-f)+jn[1020+h-p]])+63>>7,v=18*b+63>>7,b=9*b+63>>7;u[c-3*l]=Bn[255+u[c-3*l]+b],u[c-2*l]=Bn[255+h+v],u[c-l]=Bn[255+f+m],u[c+0]=Bn[255+d-m],u[c+l]=Bn[255+p-v],u[c+2*l]=Bn[255+g-b];}e+=n;}}function Ye(t,e,r,n,i,a,o,s){for(a=2*a+1;0<i--;){if(Ue(t,e,r,a,o))if(Te(t,e,r,s))Re(t,e,r);else {var u=t,c=e,l=r,h=u[c-l],f=u[c+0],d=u[c+l],p=On[112+((g=3*(f-h))+4>>3)],g=On[112+(g+3>>3)],m=p+1>>1;u[c-2*l]=Bn[255+u[c-2*l]+m],u[c-l]=Bn[255+h+g],u[c+0]=Bn[255+f-p],u[c+l]=Bn[255+d-m];}e+=n;}}function Je(t,e,r,n,i,a){Ge(t,e,r,1,16,n,i,a);}function Xe(t,e,r,n,i,a){Ge(t,e,1,r,16,n,i,a);}function Ke(t,e,r,n,i,a){var o;for(o=3;0<o;--o){Ye(t,e+=4*r,r,1,16,n,i,a);}}function Ze(t,e,r,n,i,a){var o;for(o=3;0<o;--o){Ye(t,e+=4,1,r,16,n,i,a);}}function $e(t,e,r,n,i,a,o,s){Ge(t,e,i,1,8,a,o,s),Ge(r,n,i,1,8,a,o,s);}function Qe(t,e,r,n,i,a,o,s){Ge(t,e,1,i,8,a,o,s),Ge(r,n,1,i,8,a,o,s);}function tr(t,e,r,n,i,a,o,s){Ye(t,e+4*i,i,1,8,a,o,s),Ye(r,n+4*i,i,1,8,a,o,s);}function er(t,e,r,n,i,a,o,s){Ye(t,e+4,1,i,8,a,o,s),Ye(r,n+4,1,i,8,a,o,s);}function rr(){this.ba=new ot(),this.ec=[],this.cc=[],this.Mc=[],this.Dc=this.Nc=this.dc=this.fc=0,this.Oa=new ut(),this.memory=0,this.Ib="OutputFunc",this.Jb="OutputAlphaFunc",this.Nd="OutputRowFunc";}function nr(){this.data=[],this.offset=this.kd=this.ha=this.w=0,this.na=[],this.xa=this.gb=this.Ja=this.Sa=this.P=0;}function ir(){this.nc=this.Ea=this.b=this.hc=0,this.K=[],this.w=0;}function ar(){this.ua=0,this.Wa=new M(),this.vb=new M(),this.md=this.xc=this.wc=0,this.vc=[],this.Wb=0,this.Ya=new d(),this.yc=new h();}function or(){this.xb=this.a=0,this.l=new Gt(),this.ca=new ot(),this.V=[],this.Ba=0,this.Ta=[],this.Ua=0,this.m=new N(),this.Pb=0,this.wd=new N(),this.Ma=this.$=this.C=this.i=this.c=this.xd=0,this.s=new ar(),this.ab=0,this.gc=o(4,ir),this.Oc=0;}function sr(){this.Lc=this.Z=this.$a=this.i=this.c=0,this.l=new Gt(),this.ic=0,this.ca=[],this.tb=0,this.qd=null,this.rd=0;}function ur(t,e,r,n,i,a,o){for(t=null==t?0:t[e+0],e=0;e<o;++e){i[a+e]=t+r[n+e]&255,t=i[a+e];}}function cr(t,e,r,n,i,a,o){var s;if(null==t)ur(null,null,r,n,i,a,o);else for(s=0;s<o;++s){i[a+s]=t[e+s]+r[n+s]&255;}}function lr(t,e,r,n,i,a,o){if(null==t)ur(null,null,r,n,i,a,o);else {var s,u=t[e+0],c=u,l=u;for(s=0;s<o;++s){c=l+(u=t[e+s])-c,l=r[n+s]+(-256&c?0>c?0:255:c)&255,c=u,i[a+s]=l;}}}function hr(t,r,i,o){var s=r.width,u=r.o;if(e(null!=t&&null!=r),0>i||0>=o||i+o>u)return null;if(!t.Cc){if(null==t.ga){var c;if(t.ga=new sr(),(c=null==t.ga)||(c=r.width*r.o,e(0==t.Gb.length),t.Gb=a(c),t.Uc=0,null==t.Gb?c=0:(t.mb=t.Gb,t.nb=t.Uc,t.rc=null,c=1),c=!c),!c){c=t.ga;var l=t.Fa,h=t.P,f=t.qc,d=t.mb,p=t.nb,g=h+1,m=f-1,b=c.l;if(e(null!=l&&null!=d&&null!=r),mi[0]=null,mi[1]=ur,mi[2]=cr,mi[3]=lr,c.ca=d,c.tb=p,c.c=r.width,c.i=r.height,e(0<c.c&&0<c.i),1>=f)r=0;else if(c.$a=l[h+0]>>0&3,c.Z=l[h+0]>>2&3,c.Lc=l[h+0]>>4&3,h=l[h+0]>>6&3,0>c.$a||1<c.$a||4<=c.Z||1<c.Lc||h)r=0;else if(b.put=dt,b.ac=ft,b.bc=pt,b.ma=c,b.width=r.width,b.height=r.height,b.Da=r.Da,b.v=r.v,b.va=r.va,b.j=r.j,b.o=r.o,c.$a)t:{e(1==c.$a),r=kt();e:for(;;){if(null==r){r=0;break t;}if(e(null!=c),c.mc=r,r.c=c.c,r.i=c.i,r.l=c.l,r.l.ma=c,r.l.width=c.c,r.l.height=c.i,r.a=0,v(r.m,l,g,m),!It(c.c,c.i,1,r,null))break e;if(1==r.ab&&3==r.gc[0].hc&&At(r.s)?(c.ic=1,l=r.c*r.i,r.Ta=null,r.Ua=0,r.V=a(l),r.Ba=0,null==r.V?(r.a=1,r=0):r=1):(c.ic=0,r=Ft(r,c.c)),!r)break e;r=1;break t;}c.mc=null,r=0;}else r=m>=c.c*c.i;c=!r;}if(c)return null;1!=t.ga.Lc?t.Ga=0:o=u-i;}e(null!=t.ga),e(i+o<=u);t:{if(r=(l=t.ga).c,u=l.l.o,0==l.$a){if(g=t.rc,m=t.Vc,b=t.Fa,h=t.P+1+i*r,f=t.mb,d=t.nb+i*r,e(h<=t.P+t.qc),0!=l.Z)for(e(null!=mi[l.Z]),c=0;c<o;++c){mi[l.Z](g,m,b,h,f,d,r),g=f,m=d,d+=r,h+=r;}else for(c=0;c<o;++c){n(f,d,b,h,r),g=f,m=d,d+=r,h+=r;}t.rc=g,t.Vc=m;}else {if(e(null!=l.mc),r=i+o,e(null!=(c=l.mc)),e(r<=c.i),c.C>=r)r=1;else if(l.ic||mr(),l.ic){l=c.V,g=c.Ba,m=c.c;var y=c.i,w=(b=1,h=c.$/m,f=c.$%m,d=c.m,p=c.s,c.$),N=m*y,L=m*r,x=p.wc,_=w<L?wt(p,f,h):null;e(w<=N),e(r<=y),e(At(p));e:for(;;){for(;!d.h&&w<L;){if(f&x||(_=wt(p,f,h)),e(null!=_),S(d),256>(y=bt(_.G[0],_.H[0],d)))l[g+w]=y,++w,++f>=m&&(f=0,++h<=r&&!(h%16)&&St(c,h));else {if(!(280>y)){b=0;break e;}y=mt(y-256,d);var P,k=bt(_.G[4],_.H[4],d);if(S(d),!(w>=(k=vt(m,k=mt(k,d)))&&N-w>=y)){b=0;break e;}for(P=0;P<y;++P){l[g+w+P]=l[g+w+P-k];}for(w+=y,f+=y;f>=m;){f-=m,++h<=r&&!(h%16)&&St(c,h);}w<L&&f&x&&(_=wt(p,f,h));}e(d.h==A(d));}St(c,h>r?r:h);break e;}!b||d.h&&w<N?(b=0,c.a=d.h?5:3):c.$=w,r=b;}else r=_t(c,c.V,c.Ba,c.c,c.i,r,Ct);if(!r){o=0;break t;}}i+o>=u&&(t.Cc=1),o=1;}if(!o)return null;if(t.Cc&&(null!=(o=t.ga)&&(o.mc=null),t.ga=null,0<t.Ga))return alert("todo:WebPDequantizeLevels"),null;}return t.nb+i*s;}function fr(t,e,r,n,i,a){for(;0<i--;){var o,s=t,u=e+(r?1:0),c=t,l=e+(r?0:3);for(o=0;o<n;++o){var h=c[l+4*o];255!=h&&(h*=32897,s[u+4*o+0]=s[u+4*o+0]*h>>23,s[u+4*o+1]=s[u+4*o+1]*h>>23,s[u+4*o+2]=s[u+4*o+2]*h>>23);}e+=a;}}function dr(t,e,r,n,i){for(;0<n--;){var a;for(a=0;a<r;++a){var o=t[e+2*a+0],s=15&(c=t[e+2*a+1]),u=4369*s,c=(240&c|c>>4)*u>>16;t[e+2*a+0]=(240&o|o>>4)*u>>16&240|(15&o|o<<4)*u>>16>>4&15,t[e+2*a+1]=240&c|s;}e+=i;}}function pr(t,e,r,n,i,a,o,s){var u,c,l=255;for(c=0;c<i;++c){for(u=0;u<n;++u){var h=t[e+u];a[o+4*u]=h,l&=h;}e+=r,o+=s;}return 255!=l;}function gr(t,e,r,n,i){var a;for(a=0;a<i;++a){r[n+a]=t[e+a]>>8;}}function mr(){An=fr,xn=dr,Sn=pr,_n=gr;}function vr(r,n,i){t[r]=function(t,r,a,o,s,u,c,l,h,f,d,p,g,m,v,b,y){var w,N=y-1>>1,L=s[u+0]|c[l+0]<<16,A=h[f+0]|d[p+0]<<16;e(null!=t);var x=3*L+A+131074>>2;for(n(t[r+0],255&x,x>>16,g,m),null!=a&&(x=3*A+L+131074>>2,n(a[o+0],255&x,x>>16,v,b)),w=1;w<=N;++w){var S=s[u+w]|c[l+w]<<16,_=h[f+w]|d[p+w]<<16,P=L+S+A+_+524296,k=P+2*(S+A)>>3;x=k+L>>1,L=(P=P+2*(L+_)>>3)+S>>1,n(t[r+2*w-1],255&x,x>>16,g,m+(2*w-1)*i),n(t[r+2*w-0],255&L,L>>16,g,m+(2*w-0)*i),null!=a&&(x=P+A>>1,L=k+_>>1,n(a[o+2*w-1],255&x,x>>16,v,b+(2*w-1)*i),n(a[o+2*w+0],255&L,L>>16,v,b+(2*w+0)*i)),L=S,A=_;}1&y||(x=3*L+A+131074>>2,n(t[r+y-1],255&x,x>>16,g,m+(y-1)*i),null!=a&&(x=3*A+L+131074>>2,n(a[o+y-1],255&x,x>>16,v,b+(y-1)*i)));};}function br(){vi[En]=bi,vi[qn]=wi,vi[Rn]=yi,vi[Tn]=Ni,vi[Dn]=Li,vi[Un]=Ai,vi[zn]=xi,vi[Hn]=wi,vi[Vn]=Ni,vi[Wn]=Li,vi[Gn]=Ai;}function yr(t){return t&~Fi?0>t?0:255:t>>Ii;}function wr(t,e){return yr((19077*t>>8)+(26149*e>>8)-14234);}function Nr(t,e,r){return yr((19077*t>>8)-(6419*e>>8)-(13320*r>>8)+8708);}function Lr(t,e){return yr((19077*t>>8)+(33050*e>>8)-17685);}function Ar(t,e,r,n,i){n[i+0]=wr(t,r),n[i+1]=Nr(t,e,r),n[i+2]=Lr(t,e);}function xr(t,e,r,n,i){n[i+0]=Lr(t,e),n[i+1]=Nr(t,e,r),n[i+2]=wr(t,r);}function Sr(t,e,r,n,i){var a=Nr(t,e,r);e=a<<3&224|Lr(t,e)>>3,n[i+0]=248&wr(t,r)|a>>5,n[i+1]=e;}function _r(t,e,r,n,i){var a=240&Lr(t,e)|15;n[i+0]=240&wr(t,r)|Nr(t,e,r)>>4,n[i+1]=a;}function Pr(t,e,r,n,i){n[i+0]=255,Ar(t,e,r,n,i+1);}function kr(t,e,r,n,i){xr(t,e,r,n,i),n[i+3]=255;}function Ir(t,e,r,n,i){Ar(t,e,r,n,i),n[i+3]=255;}function Wt(t,e){return 0>t?0:t>e?e:t;}function Fr(e,r,n){t[e]=function(t,e,i,a,o,s,u,c,l){for(var h=c+(-2&l)*n;c!=h;){r(t[e+0],i[a+0],o[s+0],u,c),r(t[e+1],i[a+0],o[s+0],u,c+n),e+=2,++a,++s,c+=2*n;}1&l&&r(t[e+0],i[a+0],o[s+0],u,c);};}function Cr(t,e,r){return 0==r?0==t?0==e?6:5:0==e?4:0:r;}function jr(t,e,r,n,i){switch(t>>>30){case 3:on(e,r,n,i,0);break;case 2:sn(e,r,n,i);break;case 1:cn(e,r,n,i);}}function Or(t,e){var r,a,o=e.M,s=e.Nb,u=t.oc,c=t.pc+40,l=t.oc,h=t.pc+584,f=t.oc,d=t.pc+600;for(r=0;16>r;++r){u[c+32*r-1]=129;}for(r=0;8>r;++r){l[h+32*r-1]=129,f[d+32*r-1]=129;}for(0<o?u[c-1-32]=l[h-1-32]=f[d-1-32]=129:(i(u,c-32-1,127,21),i(l,h-32-1,127,9),i(f,d-32-1,127,9)),a=0;a<t.za;++a){var p=e.ya[e.aa+a];if(0<a){for(r=-1;16>r;++r){n(u,c+32*r-4,u,c+32*r+12,4);}for(r=-1;8>r;++r){n(l,h+32*r-4,l,h+32*r+4,4),n(f,d+32*r-4,f,d+32*r+4,4);}}var g=t.Gd,m=t.Hd+a,v=p.ad,b=p.Hc;if(0<o&&(n(u,c-32,g[m].y,0,16),n(l,h-32,g[m].f,0,8),n(f,d-32,g[m].ea,0,8)),p.Za){var y=u,w=c-32+16;for(0<o&&(a>=t.za-1?i(y,w,g[m].y[15],4):n(y,w,g[m+1].y,0,4)),r=0;4>r;r++){y[w+128+r]=y[w+256+r]=y[w+384+r]=y[w+0+r];}for(r=0;16>r;++r,b<<=2){y=u,w=c+Ri[r],fi[p.Ob[r]](y,w),jr(b,v,16*+r,y,w);}}else if(y=Cr(a,o,p.Ob[0]),hi[y](u,c),0!=b)for(r=0;16>r;++r,b<<=2){jr(b,v,16*+r,u,c+Ri[r]);}for(r=p.Gc,y=Cr(a,o,p.Dd),di[y](l,h),di[y](f,d),b=v,y=l,w=h,255&(p=r>>0)&&(170&p?un(b,256,y,w):ln(b,256,y,w)),p=f,b=d,255&(r>>=8)&&(170&r?un(v,320,p,b):ln(v,320,p,b)),o<t.Ub-1&&(n(g[m].y,0,u,c+480,16),n(g[m].f,0,l,h+224,8),n(g[m].ea,0,f,d+224,8)),r=8*s*t.B,g=t.sa,m=t.ta+16*a+16*s*t.R,v=t.qa,p=t.ra+8*a+r,b=t.Ha,y=t.Ia+8*a+r,r=0;16>r;++r){n(g,m+r*t.R,u,c+32*r,16);}for(r=0;8>r;++r){n(v,p+r*t.B,l,h+32*r,8),n(b,y+r*t.B,f,d+32*r,8);}}}function Br(t,n,i,a,o,s,u,c,l){var h=[0],f=[0],d=0,p=null!=l?l.kd:0,g=null!=l?l:new nr();if(null==t||12>i)return 7;g.data=t,g.w=n,g.ha=i,n=[n],i=[i],g.gb=[g.gb];t:{var m=n,b=i,y=g.gb;if(e(null!=t),e(null!=b),e(null!=y),y[0]=0,12<=b[0]&&!r(t,m[0],"RIFF")){if(r(t,m[0]+8,"WEBP")){y=3;break t;}var w=j(t,m[0]+4);if(12>w||4294967286<w){y=3;break t;}if(p&&w>b[0]-8){y=7;break t;}y[0]=w,m[0]+=12,b[0]-=12;}y=0;}if(0!=y)return y;for(w=0<g.gb[0],i=i[0];;){t:{var L=t;b=n,y=i;var A=h,x=f,S=m=[0];if((k=d=[d])[0]=0,8>y[0])y=7;else {if(!r(L,b[0],"VP8X")){if(10!=j(L,b[0]+4)){y=3;break t;}if(18>y[0]){y=7;break t;}var _=j(L,b[0]+8),P=1+C(L,b[0]+12);if(2147483648<=P*(L=1+C(L,b[0]+15))){y=3;break t;}null!=S&&(S[0]=_),null!=A&&(A[0]=P),null!=x&&(x[0]=L),b[0]+=18,y[0]-=18,k[0]=1;}y=0;}}if(d=d[0],m=m[0],0!=y)return y;if(b=!!(2&m),!w&&d)return 3;if(null!=s&&(s[0]=!!(16&m)),null!=u&&(u[0]=b),null!=c&&(c[0]=0),u=h[0],m=f[0],d&&b&&null==l){y=0;break;}if(4>i){y=7;break;}if(w&&d||!w&&!d&&!r(t,n[0],"ALPH")){i=[i],g.na=[g.na],g.P=[g.P],g.Sa=[g.Sa];t:{_=t,y=n,w=i;var k=g.gb;A=g.na,x=g.P,S=g.Sa;P=22,e(null!=_),e(null!=w),L=y[0];var I=w[0];for(e(null!=A),e(null!=S),A[0]=null,x[0]=null,S[0]=0;;){if(y[0]=L,w[0]=I,8>I){y=7;break t;}var F=j(_,L+4);if(4294967286<F){y=3;break t;}var O=8+F+1&-2;if(P+=O,0<k&&P>k){y=3;break t;}if(!r(_,L,"VP8 ")||!r(_,L,"VP8L")){y=0;break t;}if(I[0]<O){y=7;break t;}r(_,L,"ALPH")||(A[0]=_,x[0]=L+8,S[0]=F),L+=O,I-=O;}}if(i=i[0],g.na=g.na[0],g.P=g.P[0],g.Sa=g.Sa[0],0!=y)break;}i=[i],g.Ja=[g.Ja],g.xa=[g.xa];t:if(k=t,y=n,w=i,A=g.gb[0],x=g.Ja,S=g.xa,_=y[0],L=!r(k,_,"VP8 "),P=!r(k,_,"VP8L"),e(null!=k),e(null!=w),e(null!=x),e(null!=S),8>w[0])y=7;else {if(L||P){if(k=j(k,_+4),12<=A&&k>A-12){y=3;break t;}if(p&&k>w[0]-8){y=7;break t;}x[0]=k,y[0]+=8,w[0]-=8,S[0]=P;}else S[0]=5<=w[0]&&47==k[_+0]&&!(k[_+4]>>5),x[0]=w[0];y=0;}if(i=i[0],g.Ja=g.Ja[0],g.xa=g.xa[0],n=n[0],0!=y)break;if(4294967286<g.Ja)return 3;if(null==c||b||(c[0]=g.xa?2:1),u=[u],m=[m],g.xa){if(5>i){y=7;break;}c=u,p=m,b=s,null==t||5>i?t=0:5<=i&&47==t[n+0]&&!(t[n+4]>>5)?(w=[0],k=[0],A=[0],v(x=new N(),t,n,i),gt(x,w,k,A)?(null!=c&&(c[0]=w[0]),null!=p&&(p[0]=k[0]),null!=b&&(b[0]=A[0]),t=1):t=0):t=0;}else {if(10>i){y=7;break;}c=m,null==t||10>i||!Xt(t,n+3,i-3)?t=0:(p=t[n+0]|t[n+1]<<8|t[n+2]<<16,b=16383&(t[n+7]<<8|t[n+6]),t=16383&(t[n+9]<<8|t[n+8]),1&p||3<(p>>1&7)||!(p>>4&1)||p>>5>=g.Ja||!b||!t?t=0:(u&&(u[0]=b),c&&(c[0]=t),t=1));}if(!t)return 3;if(u=u[0],m=m[0],d&&(h[0]!=u||f[0]!=m))return 3;null!=l&&(l[0]=g,l.offset=n-l.w,e(4294967286>n-l.w),e(l.offset==l.ha-i));break;}return 0==y||7==y&&d&&null==l?(null!=s&&(s[0]|=null!=g.na&&0<g.na.length),null!=a&&(a[0]=u),null!=o&&(o[0]=m),0):y;}function Mr(t,e,r){var n=e.width,i=e.height,a=0,o=0,s=n,u=i;if(e.Da=null!=t&&0<t.Da,e.Da&&(s=t.cd,u=t.bd,a=t.v,o=t.j,11>r||(a&=-2,o&=-2),0>a||0>o||0>=s||0>=u||a+s>n||o+u>i))return 0;if(e.v=a,e.j=o,e.va=a+s,e.o=o+u,e.U=s,e.T=u,e.da=null!=t&&0<t.da,e.da){if(!E(s,u,r=[t.ib],a=[t.hb]))return 0;e.ib=r[0],e.hb=a[0];}return e.ob=null!=t&&t.ob,e.Kb=null==t||!t.Sd,e.da&&(e.ob=e.ib<3*n/4&&e.hb<3*i/4,e.Kb=0),1;}function Er(t){if(null==t)return 2;if(11>t.S){var e=t.f.RGBA;e.fb+=(t.height-1)*e.A,e.A=-e.A;}else e=t.f.kb,t=t.height,e.O+=(t-1)*e.fa,e.fa=-e.fa,e.N+=(t-1>>1)*e.Ab,e.Ab=-e.Ab,e.W+=(t-1>>1)*e.Db,e.Db=-e.Db,null!=e.F&&(e.J+=(t-1)*e.lb,e.lb=-e.lb);return 0;}function qr(t,e,r,n){if(null==n||0>=t||0>=e)return 2;if(null!=r){if(r.Da){var i=r.cd,o=r.bd,s=-2&r.v,u=-2&r.j;if(0>s||0>u||0>=i||0>=o||s+i>t||u+o>e)return 2;t=i,e=o;}if(r.da){if(!E(t,e,i=[r.ib],o=[r.hb]))return 2;t=i[0],e=o[0];}}n.width=t,n.height=e;t:{var c=n.width,l=n.height;if(t=n.S,0>=c||0>=l||!(t>=En&&13>t))t=2;else {if(0>=n.Rd&&null==n.sd){s=o=i=e=0;var h=(u=c*zi[t])*l;if(11>t||(o=(l+1)/2*(e=(c+1)/2),12==t&&(s=(i=c)*l)),null==(l=a(h+2*o+s))){t=1;break t;}n.sd=l,11>t?((c=n.f.RGBA).eb=l,c.fb=0,c.A=u,c.size=h):((c=n.f.kb).y=l,c.O=0,c.fa=u,c.Fd=h,c.f=l,c.N=0+h,c.Ab=e,c.Cd=o,c.ea=l,c.W=0+h+o,c.Db=e,c.Ed=o,12==t&&(c.F=l,c.J=0+h+2*o),c.Tc=s,c.lb=i);}if(e=1,i=n.S,o=n.width,s=n.height,i>=En&&13>i){if(11>i)t=n.f.RGBA,e&=(u=Math.abs(t.A))*(s-1)+o<=t.size,e&=u>=o*zi[i],e&=null!=t.eb;else {t=n.f.kb,u=(o+1)/2,h=(s+1)/2,c=Math.abs(t.fa);l=Math.abs(t.Ab);var f=Math.abs(t.Db),d=Math.abs(t.lb),p=d*(s-1)+o;e&=c*(s-1)+o<=t.Fd,e&=l*(h-1)+u<=t.Cd,e=(e&=f*(h-1)+u<=t.Ed)&c>=o&l>=u&f>=u,e&=null!=t.y,e&=null!=t.f,e&=null!=t.ea,12==i&&(e&=d>=o,e&=p<=t.Tc,e&=null!=t.F);}}else e=0;t=e?0:2;}}return 0!=t||null!=r&&r.fd&&(t=Er(n)),t;}var Rr=64,Tr=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215],Dr=24,Ur=32,zr=8,Hr=[0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7];T("Predictor0","PredictorAdd0"),t.Predictor0=function(){return 4278190080;},t.Predictor1=function(t){return t;},t.Predictor2=function(t,e,r){return e[r+0];},t.Predictor3=function(t,e,r){return e[r+1];},t.Predictor4=function(t,e,r){return e[r-1];},t.Predictor5=function(t,e,r){return U(U(t,e[r+1]),e[r+0]);},t.Predictor6=function(t,e,r){return U(t,e[r-1]);},t.Predictor7=function(t,e,r){return U(t,e[r+0]);},t.Predictor8=function(t,e,r){return U(e[r-1],e[r+0]);},t.Predictor9=function(t,e,r){return U(e[r+0],e[r+1]);},t.Predictor10=function(t,e,r){return U(U(t,e[r-1]),U(e[r+0],e[r+1]));},t.Predictor11=function(t,e,r){var n=e[r+0];return 0>=V(n>>24&255,t>>24&255,(e=e[r-1])>>24&255)+V(n>>16&255,t>>16&255,e>>16&255)+V(n>>8&255,t>>8&255,e>>8&255)+V(255&n,255&t,255&e)?n:t;},t.Predictor12=function(t,e,r){var n=e[r+0];return (z((t>>24&255)+(n>>24&255)-((e=e[r-1])>>24&255))<<24|z((t>>16&255)+(n>>16&255)-(e>>16&255))<<16|z((t>>8&255)+(n>>8&255)-(e>>8&255))<<8|z((255&t)+(255&n)-(255&e)))>>>0;},t.Predictor13=function(t,e,r){var n=e[r-1];return (H((t=U(t,e[r+0]))>>24&255,n>>24&255)<<24|H(t>>16&255,n>>16&255)<<16|H(t>>8&255,n>>8&255)<<8|H(t>>0&255,n>>0&255))>>>0;};var Vr=t.PredictorAdd0;t.PredictorAdd1=W,T("Predictor2","PredictorAdd2"),T("Predictor3","PredictorAdd3"),T("Predictor4","PredictorAdd4"),T("Predictor5","PredictorAdd5"),T("Predictor6","PredictorAdd6"),T("Predictor7","PredictorAdd7"),T("Predictor8","PredictorAdd8"),T("Predictor9","PredictorAdd9"),T("Predictor10","PredictorAdd10"),T("Predictor11","PredictorAdd11"),T("Predictor12","PredictorAdd12"),T("Predictor13","PredictorAdd13");var Wr=t.PredictorAdd2;X("ColorIndexInverseTransform","MapARGB","32b",function(t){return t>>8&255;},function(t){return t;}),X("VP8LColorIndexInverseTransformAlpha","MapAlpha","8b",function(t){return t;},function(t){return t>>8&255;});var Gr,Yr=t.ColorIndexInverseTransform,Jr=t.MapARGB,Xr=t.VP8LColorIndexInverseTransformAlpha,Kr=t.MapAlpha,Zr=t.VP8LPredictorsAdd=[];Zr.length=16,(t.VP8LPredictors=[]).length=16,(t.VP8LPredictorsAdd_C=[]).length=16,(t.VP8LPredictors_C=[]).length=16;var $r,Qr,tn,en,rn,nn,an,on,sn,un,cn,ln,hn,fn,dn,pn,gn,mn,vn,bn,yn,wn,Nn,Ln,An,xn,Sn,_n,Pn=a(511),kn=a(2041),In=a(225),Fn=a(767),Cn=0,jn=kn,On=In,Bn=Fn,Mn=Pn,En=0,qn=1,Rn=2,Tn=3,Dn=4,Un=5,zn=6,Hn=7,Vn=8,Wn=9,Gn=10,Yn=[2,3,7],Jn=[3,3,11],Xn=[280,256,256,256,40],Kn=[0,1,1,1,0],Zn=[17,18,0,1,2,3,4,5,16,6,7,8,9,10,11,12,13,14,15],$n=[24,7,23,25,40,6,39,41,22,26,38,42,56,5,55,57,21,27,54,58,37,43,72,4,71,73,20,28,53,59,70,74,36,44,88,69,75,52,60,3,87,89,19,29,86,90,35,45,68,76,85,91,51,61,104,2,103,105,18,30,102,106,34,46,84,92,67,77,101,107,50,62,120,1,119,121,83,93,17,31,100,108,66,78,118,122,33,47,117,123,49,63,99,109,82,94,0,116,124,65,79,16,32,98,110,48,115,125,81,95,64,114,126,97,111,80,113,127,96,112],Qn=[2954,2956,2958,2962,2970,2986,3018,3082,3212,3468,3980,5004],ti=8,ei=[4,5,6,7,8,9,10,10,11,12,13,14,15,16,17,17,18,19,20,20,21,21,22,22,23,23,24,25,25,26,27,28,29,30,31,32,33,34,35,36,37,37,38,39,40,41,42,43,44,45,46,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,76,77,78,79,80,81,82,83,84,85,86,87,88,89,91,93,95,96,98,100,101,102,104,106,108,110,112,114,116,118,122,124,126,128,130,132,134,136,138,140,143,145,148,151,154,157],ri=[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,119,122,125,128,131,134,137,140,143,146,149,152,155,158,161,164,167,170,173,177,181,185,189,193,197,201,205,209,213,217,221,225,229,234,239,245,249,254,259,264,269,274,279,284],ni=null,ii=[[173,148,140,0],[176,155,140,135,0],[180,157,141,134,130,0],[254,254,243,230,196,177,153,140,133,130,129,0]],ai=[0,1,4,8,5,2,3,6,9,12,13,10,7,11,14,15],oi=[-0,1,-1,2,-2,3,4,6,-3,5,-4,-5,-6,7,-7,8,-8,-9],si=[[[[128,128,128,128,128,128,128,128,128,128,128],[128,128,128,128,128,128,128,128,128,128,128],[128,128,128,128,128,128,128,128,128,128,128]],[[253,136,254,255,228,219,128,128,128,128,128],[189,129,242,255,227,213,255,219,128,128,128],[106,126,227,252,214,209,255,255,128,128,128]],[[1,98,248,255,236,226,255,255,128,128,128],[181,133,238,254,221,234,255,154,128,128,128],[78,134,202,247,198,180,255,219,128,128,128]],[[1,185,249,255,243,255,128,128,128,128,128],[184,150,247,255,236,224,128,128,128,128,128],[77,110,216,255,236,230,128,128,128,128,128]],[[1,101,251,255,241,255,128,128,128,128,128],[170,139,241,252,236,209,255,255,128,128,128],[37,116,196,243,228,255,255,255,128,128,128]],[[1,204,254,255,245,255,128,128,128,128,128],[207,160,250,255,238,128,128,128,128,128,128],[102,103,231,255,211,171,128,128,128,128,128]],[[1,152,252,255,240,255,128,128,128,128,128],[177,135,243,255,234,225,128,128,128,128,128],[80,129,211,255,194,224,128,128,128,128,128]],[[1,1,255,128,128,128,128,128,128,128,128],[246,1,255,128,128,128,128,128,128,128,128],[255,128,128,128,128,128,128,128,128,128,128]]],[[[198,35,237,223,193,187,162,160,145,155,62],[131,45,198,221,172,176,220,157,252,221,1],[68,47,146,208,149,167,221,162,255,223,128]],[[1,149,241,255,221,224,255,255,128,128,128],[184,141,234,253,222,220,255,199,128,128,128],[81,99,181,242,176,190,249,202,255,255,128]],[[1,129,232,253,214,197,242,196,255,255,128],[99,121,210,250,201,198,255,202,128,128,128],[23,91,163,242,170,187,247,210,255,255,128]],[[1,200,246,255,234,255,128,128,128,128,128],[109,178,241,255,231,245,255,255,128,128,128],[44,130,201,253,205,192,255,255,128,128,128]],[[1,132,239,251,219,209,255,165,128,128,128],[94,136,225,251,218,190,255,255,128,128,128],[22,100,174,245,186,161,255,199,128,128,128]],[[1,182,249,255,232,235,128,128,128,128,128],[124,143,241,255,227,234,128,128,128,128,128],[35,77,181,251,193,211,255,205,128,128,128]],[[1,157,247,255,236,231,255,255,128,128,128],[121,141,235,255,225,227,255,255,128,128,128],[45,99,188,251,195,217,255,224,128,128,128]],[[1,1,251,255,213,255,128,128,128,128,128],[203,1,248,255,255,128,128,128,128,128,128],[137,1,177,255,224,255,128,128,128,128,128]]],[[[253,9,248,251,207,208,255,192,128,128,128],[175,13,224,243,193,185,249,198,255,255,128],[73,17,171,221,161,179,236,167,255,234,128]],[[1,95,247,253,212,183,255,255,128,128,128],[239,90,244,250,211,209,255,255,128,128,128],[155,77,195,248,188,195,255,255,128,128,128]],[[1,24,239,251,218,219,255,205,128,128,128],[201,51,219,255,196,186,128,128,128,128,128],[69,46,190,239,201,218,255,228,128,128,128]],[[1,191,251,255,255,128,128,128,128,128,128],[223,165,249,255,213,255,128,128,128,128,128],[141,124,248,255,255,128,128,128,128,128,128]],[[1,16,248,255,255,128,128,128,128,128,128],[190,36,230,255,236,255,128,128,128,128,128],[149,1,255,128,128,128,128,128,128,128,128]],[[1,226,255,128,128,128,128,128,128,128,128],[247,192,255,128,128,128,128,128,128,128,128],[240,128,255,128,128,128,128,128,128,128,128]],[[1,134,252,255,255,128,128,128,128,128,128],[213,62,250,255,255,128,128,128,128,128,128],[55,93,255,128,128,128,128,128,128,128,128]],[[128,128,128,128,128,128,128,128,128,128,128],[128,128,128,128,128,128,128,128,128,128,128],[128,128,128,128,128,128,128,128,128,128,128]]],[[[202,24,213,235,186,191,220,160,240,175,255],[126,38,182,232,169,184,228,174,255,187,128],[61,46,138,219,151,178,240,170,255,216,128]],[[1,112,230,250,199,191,247,159,255,255,128],[166,109,228,252,211,215,255,174,128,128,128],[39,77,162,232,172,180,245,178,255,255,128]],[[1,52,220,246,198,199,249,220,255,255,128],[124,74,191,243,183,193,250,221,255,255,128],[24,71,130,219,154,170,243,182,255,255,128]],[[1,182,225,249,219,240,255,224,128,128,128],[149,150,226,252,216,205,255,171,128,128,128],[28,108,170,242,183,194,254,223,255,255,128]],[[1,81,230,252,204,203,255,192,128,128,128],[123,102,209,247,188,196,255,233,128,128,128],[20,95,153,243,164,173,255,203,128,128,128]],[[1,222,248,255,216,213,128,128,128,128,128],[168,175,246,252,235,205,255,255,128,128,128],[47,116,215,255,211,212,255,255,128,128,128]],[[1,121,236,253,212,214,255,255,128,128,128],[141,84,213,252,201,202,255,219,128,128,128],[42,80,160,240,162,185,255,205,128,128,128]],[[1,1,255,128,128,128,128,128,128,128,128],[244,1,255,128,128,128,128,128,128,128,128],[238,1,255,128,128,128,128,128,128,128,128]]]],ui=[[[231,120,48,89,115,113,120,152,112],[152,179,64,126,170,118,46,70,95],[175,69,143,80,85,82,72,155,103],[56,58,10,171,218,189,17,13,152],[114,26,17,163,44,195,21,10,173],[121,24,80,195,26,62,44,64,85],[144,71,10,38,171,213,144,34,26],[170,46,55,19,136,160,33,206,71],[63,20,8,114,114,208,12,9,226],[81,40,11,96,182,84,29,16,36]],[[134,183,89,137,98,101,106,165,148],[72,187,100,130,157,111,32,75,80],[66,102,167,99,74,62,40,234,128],[41,53,9,178,241,141,26,8,107],[74,43,26,146,73,166,49,23,157],[65,38,105,160,51,52,31,115,128],[104,79,12,27,217,255,87,17,7],[87,68,71,44,114,51,15,186,23],[47,41,14,110,182,183,21,17,194],[66,45,25,102,197,189,23,18,22]],[[88,88,147,150,42,46,45,196,205],[43,97,183,117,85,38,35,179,61],[39,53,200,87,26,21,43,232,171],[56,34,51,104,114,102,29,93,77],[39,28,85,171,58,165,90,98,64],[34,22,116,206,23,34,43,166,73],[107,54,32,26,51,1,81,43,31],[68,25,106,22,64,171,36,225,114],[34,19,21,102,132,188,16,76,124],[62,18,78,95,85,57,50,48,51]],[[193,101,35,159,215,111,89,46,111],[60,148,31,172,219,228,21,18,111],[112,113,77,85,179,255,38,120,114],[40,42,1,196,245,209,10,25,109],[88,43,29,140,166,213,37,43,154],[61,63,30,155,67,45,68,1,209],[100,80,8,43,154,1,51,26,71],[142,78,78,16,255,128,34,197,171],[41,40,5,102,211,183,4,1,221],[51,50,17,168,209,192,23,25,82]],[[138,31,36,171,27,166,38,44,229],[67,87,58,169,82,115,26,59,179],[63,59,90,180,59,166,93,73,154],[40,40,21,116,143,209,34,39,175],[47,15,16,183,34,223,49,45,183],[46,17,33,183,6,98,15,32,183],[57,46,22,24,128,1,54,17,37],[65,32,73,115,28,128,23,128,205],[40,3,9,115,51,192,18,6,223],[87,37,9,115,59,77,64,21,47]],[[104,55,44,218,9,54,53,130,226],[64,90,70,205,40,41,23,26,57],[54,57,112,184,5,41,38,166,213],[30,34,26,133,152,116,10,32,134],[39,19,53,221,26,114,32,73,255],[31,9,65,234,2,15,1,118,73],[75,32,12,51,192,255,160,43,51],[88,31,35,67,102,85,55,186,85],[56,21,23,111,59,205,45,37,192],[55,38,70,124,73,102,1,34,98]],[[125,98,42,88,104,85,117,175,82],[95,84,53,89,128,100,113,101,45],[75,79,123,47,51,128,81,171,1],[57,17,5,71,102,57,53,41,49],[38,33,13,121,57,73,26,1,85],[41,10,67,138,77,110,90,47,114],[115,21,2,10,102,255,166,23,6],[101,29,16,10,85,128,101,196,26],[57,18,10,102,102,213,34,20,43],[117,20,15,36,163,128,68,1,26]],[[102,61,71,37,34,53,31,243,192],[69,60,71,38,73,119,28,222,37],[68,45,128,34,1,47,11,245,171],[62,17,19,70,146,85,55,62,70],[37,43,37,154,100,163,85,160,1],[63,9,92,136,28,64,32,201,85],[75,15,9,9,64,255,184,119,16],[86,6,28,5,64,255,25,248,1],[56,8,17,132,137,255,55,116,128],[58,15,20,82,135,57,26,121,40]],[[164,50,31,137,154,133,25,35,218],[51,103,44,131,131,123,31,6,158],[86,40,64,135,148,224,45,183,128],[22,26,17,131,240,154,14,1,209],[45,16,21,91,64,222,7,1,197],[56,21,39,155,60,138,23,102,213],[83,12,13,54,192,255,68,47,28],[85,26,85,85,128,128,32,146,171],[18,11,7,63,144,171,4,4,246],[35,27,10,146,174,171,12,26,128]],[[190,80,35,99,180,80,126,54,45],[85,126,47,87,176,51,41,20,32],[101,75,128,139,118,146,116,128,85],[56,41,15,176,236,85,37,9,62],[71,30,17,119,118,255,17,18,138],[101,38,60,138,55,70,43,26,142],[146,36,19,30,171,255,97,27,20],[138,45,61,62,219,1,81,188,64],[32,41,20,117,151,142,20,21,163],[112,19,12,61,195,128,48,4,24]]],ci=[[[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[176,246,255,255,255,255,255,255,255,255,255],[223,241,252,255,255,255,255,255,255,255,255],[249,253,253,255,255,255,255,255,255,255,255]],[[255,244,252,255,255,255,255,255,255,255,255],[234,254,254,255,255,255,255,255,255,255,255],[253,255,255,255,255,255,255,255,255,255,255]],[[255,246,254,255,255,255,255,255,255,255,255],[239,253,254,255,255,255,255,255,255,255,255],[254,255,254,255,255,255,255,255,255,255,255]],[[255,248,254,255,255,255,255,255,255,255,255],[251,255,254,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,253,254,255,255,255,255,255,255,255,255],[251,254,254,255,255,255,255,255,255,255,255],[254,255,254,255,255,255,255,255,255,255,255]],[[255,254,253,255,254,255,255,255,255,255,255],[250,255,254,255,254,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]]],[[[217,255,255,255,255,255,255,255,255,255,255],[225,252,241,253,255,255,254,255,255,255,255],[234,250,241,250,253,255,253,254,255,255,255]],[[255,254,255,255,255,255,255,255,255,255,255],[223,254,254,255,255,255,255,255,255,255,255],[238,253,254,254,255,255,255,255,255,255,255]],[[255,248,254,255,255,255,255,255,255,255,255],[249,254,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,253,255,255,255,255,255,255,255,255,255],[247,254,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,253,254,255,255,255,255,255,255,255,255],[252,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,254,254,255,255,255,255,255,255,255,255],[253,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,254,253,255,255,255,255,255,255,255,255],[250,255,255,255,255,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]]],[[[186,251,250,255,255,255,255,255,255,255,255],[234,251,244,254,255,255,255,255,255,255,255],[251,251,243,253,254,255,254,255,255,255,255]],[[255,253,254,255,255,255,255,255,255,255,255],[236,253,254,255,255,255,255,255,255,255,255],[251,253,253,254,254,255,255,255,255,255,255]],[[255,254,254,255,255,255,255,255,255,255,255],[254,254,254,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,254,255,255,255,255,255,255,255,255,255],[254,254,255,255,255,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]]],[[[248,255,255,255,255,255,255,255,255,255,255],[250,254,252,254,255,255,255,255,255,255,255],[248,254,249,253,255,255,255,255,255,255,255]],[[255,253,253,255,255,255,255,255,255,255,255],[246,253,253,255,255,255,255,255,255,255,255],[252,254,251,254,254,255,255,255,255,255,255]],[[255,254,252,255,255,255,255,255,255,255,255],[248,254,253,255,255,255,255,255,255,255,255],[253,255,254,254,255,255,255,255,255,255,255]],[[255,251,254,255,255,255,255,255,255,255,255],[245,251,254,255,255,255,255,255,255,255,255],[253,253,254,255,255,255,255,255,255,255,255]],[[255,251,253,255,255,255,255,255,255,255,255],[252,253,254,255,255,255,255,255,255,255,255],[255,254,255,255,255,255,255,255,255,255,255]],[[255,252,255,255,255,255,255,255,255,255,255],[249,255,254,255,255,255,255,255,255,255,255],[255,255,254,255,255,255,255,255,255,255,255]],[[255,255,253,255,255,255,255,255,255,255,255],[250,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]]]],li=[0,1,2,3,6,4,5,6,6,6,6,6,6,6,6,7,0],hi=[],fi=[],di=[],pi=1,gi=2,mi=[],vi=[];vr("UpsampleRgbLinePair",Ar,3),vr("UpsampleBgrLinePair",xr,3),vr("UpsampleRgbaLinePair",Ir,4),vr("UpsampleBgraLinePair",kr,4),vr("UpsampleArgbLinePair",Pr,4),vr("UpsampleRgba4444LinePair",_r,2),vr("UpsampleRgb565LinePair",Sr,2);var bi=t.UpsampleRgbLinePair,yi=t.UpsampleBgrLinePair,wi=t.UpsampleRgbaLinePair,Ni=t.UpsampleBgraLinePair,Li=t.UpsampleArgbLinePair,Ai=t.UpsampleRgba4444LinePair,xi=t.UpsampleRgb565LinePair,Si=16,_i=1<<Si-1,Pi=-227,ki=482,Ii=6,Fi=(256<<Ii)-1,Ci=0,ji=a(256),Oi=a(256),Bi=a(256),Mi=a(256),Ei=a(ki-Pi),qi=a(ki-Pi);Fr("YuvToRgbRow",Ar,3),Fr("YuvToBgrRow",xr,3),Fr("YuvToRgbaRow",Ir,4),Fr("YuvToBgraRow",kr,4),Fr("YuvToArgbRow",Pr,4),Fr("YuvToRgba4444Row",_r,2),Fr("YuvToRgb565Row",Sr,2);var Ri=[0,4,8,12,128,132,136,140,256,260,264,268,384,388,392,396],Ti=[0,2,8],Di=[8,7,6,4,4,2,2,2,1,1,1,1],Ui=1;this.WebPDecodeRGBA=function(t,r,n,i,a){var o=qn,s=new rr(),u=new ot();s.ba=u,u.S=o,u.width=[u.width],u.height=[u.height];var c=u.width,l=u.height,h=new st();if(null==h||null==t)var f=2;else e(null!=h),f=Br(t,r,n,h.width,h.height,h.Pd,h.Qd,h.format,null);if(0!=f?c=0:(null!=c&&(c[0]=h.width[0]),null!=l&&(l[0]=h.height[0]),c=1),c){u.width=u.width[0],u.height=u.height[0],null!=i&&(i[0]=u.width),null!=a&&(a[0]=u.height);t:{if(i=new Gt(),(a=new nr()).data=t,a.w=r,a.ha=n,a.kd=1,r=[0],e(null!=a),(0==(t=Br(a.data,a.w,a.ha,null,null,null,r,null,a))||7==t)&&r[0]&&(t=4),0==(r=t)){if(e(null!=s),i.data=a.data,i.w=a.w+a.offset,i.ha=a.ha-a.offset,i.put=dt,i.ac=ft,i.bc=pt,i.ma=s,a.xa){if(null==(t=kt())){s=1;break t;}if(function(t,r){var n=[0],i=[0],a=[0];e:for(;;){if(null==t)return 0;if(null==r)return t.a=2,0;if(t.l=r,t.a=0,v(t.m,r.data,r.w,r.ha),!gt(t.m,n,i,a)){t.a=3;break e;}if(t.xb=gi,r.width=n[0],r.height=i[0],!It(n[0],i[0],1,t,null))break e;return 1;}return e(0!=t.a),0;}(t,i)){if(i=0==(r=qr(i.width,i.height,s.Oa,s.ba))){e:{i=t;r:for(;;){if(null==i){i=0;break e;}if(e(null!=i.s.yc),e(null!=i.s.Ya),e(0<i.s.Wb),e(null!=(n=i.l)),e(null!=(a=n.ma)),0!=i.xb){if(i.ca=a.ba,i.tb=a.tb,e(null!=i.ca),!Mr(a.Oa,n,Tn)){i.a=2;break r;}if(!Ft(i,n.width))break r;if(n.da)break r;if((n.da||nt(i.ca.S))&&mr(),11>i.ca.S||(alert("todo:WebPInitConvertARGBToYUV"),null!=i.ca.f.kb.F&&mr()),i.Pb&&0<i.s.ua&&null==i.s.vb.X&&!O(i.s.vb,i.s.Wa.Xa)){i.a=1;break r;}i.xb=0;}if(!_t(i,i.V,i.Ba,i.c,i.i,n.o,Lt))break r;a.Dc=i.Ma,i=1;break e;}e(0!=i.a),i=0;}i=!i;}i&&(r=t.a);}else r=t.a;}else {if(null==(t=new Yt())){s=1;break t;}if(t.Fa=a.na,t.P=a.P,t.qc=a.Sa,Kt(t,i)){if(0==(r=qr(i.width,i.height,s.Oa,s.ba))){if(t.Aa=0,n=s.Oa,e(null!=(a=t)),null!=n){if(0<(c=0>(c=n.Md)?0:100<c?255:255*c/100)){for(l=h=0;4>l;++l){12>(f=a.pb[l]).lc&&(f.ia=c*Di[0>f.lc?0:f.lc]>>3),h|=f.ia;}h&&(alert("todo:VP8InitRandom"),a.ia=1);}a.Ga=n.Id,100<a.Ga?a.Ga=100:0>a.Ga&&(a.Ga=0);}Qt(t,i)||(r=t.a);}}else r=t.a;}0==r&&null!=s.Oa&&s.Oa.fd&&(r=Er(s.ba));}s=r;}o=0!=s?null:11>o?u.f.RGBA.eb:u.f.kb.y;}else o=null;return o;};var zi=[3,4,3,4,4,2,2,4,4,4,2,1,1];})();var h=[0],f=[0],d=[],p=new $t(),g=t,m=function(t,e){var r={},n=0,i=!1,a=0,o=0;if(r.frames=[],!
/** @license
   * Copyright (c) 2017 Dominik Homberger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

https://webpjs.appspot.com
WebPRiffParser dominikhlbg@gmail.com
*/
function(t,e,r,n){for(var i=0;i<n;i++){if(t[e+i]!=r.charCodeAt(i))return !0;}return !1;}(t,e,"RIFF",4)){var s,h;l(t,e+=4);for(e+=8;e<t.length;){var f=u(t,e),d=l(t,e+=4);e+=4;var p=d+(1&d);switch(f){case"VP8 ":case"VP8L":void 0===r.frames[n]&&(r.frames[n]={});(v=r.frames[n]).src_off=i?o:e-8,v.src_size=a+d+8,n++,i&&(i=!1,a=0,o=0);break;case"VP8X":(v=r.header={}).feature_flags=t[e];var g=e+4;v.canvas_width=1+c(t,g);g+=3;v.canvas_height=1+c(t,g);g+=3;break;case"ALPH":i=!0,a=p+8,o=e-8;break;case"ANIM":(v=r.header).bgcolor=l(t,e);g=e+4;v.loop_count=(s=t)[(h=g)+0]<<0|s[h+1]<<8;g+=2;break;case"ANMF":var m,v;(v=r.frames[n]={}).offset_x=2*c(t,e),e+=3,v.offset_y=2*c(t,e),e+=3,v.width=1+c(t,e),e+=3,v.height=1+c(t,e),e+=3,v.duration=c(t,e),e+=3,m=t[e++],v.dispose=1&m,v.blend=m>>1&1;}"ANMF"!=f&&(e+=p);}return r;}}(g,0);m.response=g,m.rgbaoutput=!0,m.dataurl=!1;var v=m.header?m.header:null,b=m.frames?m.frames:null;if(v){v.loop_counter=v.loop_count,h=[v.canvas_height],f=[v.canvas_width];for(var y=0;y<b.length&&0!=b[y].blend;y++){}}var w=b[0],N=p.WebPDecodeRGBA(g,w.src_off,w.src_size,f,h);w.rgba=N,w.imgwidth=f[0],w.imgheight=h[0];for(var L=0;L<f[0]*h[0]*4;L++){d[L]=N[L];}return this.width=f,this.height=h,this.data=d,this;}!function(e){var r=function r(){return "function"==typeof fflate__WEBPACK_IMPORTED_MODULE_0__["zlibSync"];},n=function n(r,_n4,a,l){var h=4,f=s;switch(l){case e.image_compression.FAST:h=1,f=o;break;case e.image_compression.MEDIUM:h=6,f=u;break;case e.image_compression.SLOW:h=9,f=c;}r=i(r,_n4,a,f);var d=Object(fflate__WEBPACK_IMPORTED_MODULE_0__["zlibSync"])(r,{level:h});return e.__addimage__.arrayBufferToBinaryString(d);},i=function i(t,e,r,n){for(var i,a,o,s=t.length/e,u=new Uint8Array(t.length+s),c=h(),l=0;l<s;l+=1){if(o=l*e,i=t.subarray(o,o+e),n)u.set(n(i,r,a),o+l);else {for(var d,p=c.length,g=[];d<p;d+=1){g[d]=c[d](i,r,a);}var m=f(g.concat());u.set(g[m],o+l);}a=i;}return u;},a=function a(t){var e=Array.apply([],t);return e.unshift(0),e;},o=function o(t,e){var r,n=[],i=t.length;n[0]=1;for(var a=0;a<i;a+=1){r=t[a-e]||0,n[a+1]=t[a]-r+256&255;}return n;},s=function s(t,e,r){var n,i=[],a=t.length;i[0]=2;for(var o=0;o<a;o+=1){n=r&&r[o]||0,i[o+1]=t[o]-n+256&255;}return i;},u=function u(t,e,r){var n,i,a=[],o=t.length;a[0]=3;for(var s=0;s<o;s+=1){n=t[s-e]||0,i=r&&r[s]||0,a[s+1]=t[s]+256-(n+i>>>1)&255;}return a;},c=function c(t,e,r){var n,i,a,o,s=[],u=t.length;s[0]=4;for(var c=0;c<u;c+=1){n=t[c-e]||0,i=r&&r[c]||0,a=r&&r[c-e]||0,o=l(n,i,a),s[c+1]=t[c]-o+256&255;}return s;},l=function l(t,e,r){if(t===e&&e===r)return t;var n=Math.abs(e-r),i=Math.abs(t-r),a=Math.abs(t+e-r-r);return n<=i&&n<=a?t:i<=a?e:r;},h=function h(){return [a,o,s,u,c];},f=function f(t){var e=t.map(function(t){return t.reduce(function(t,e){return t+Math.abs(e);},0);});return e.indexOf(Math.min.apply(null,e));};e.processPNG=function(t,i,a,o){var s,u,c,l,h,f,d,p,g,m,v,b,y,w,N,L=this.decode.FLATE_DECODE,A="";if(this.__addimage__.isArrayBuffer(t)&&(t=new Uint8Array(t)),this.__addimage__.isArrayBufferView(t)){if(t=(c=new Yt(t)).imgData,u=c.bits,s=c.colorSpace,h=c.colors,-1!==[4,6].indexOf(c.colorType)){if(8===c.bits){g=(p=32==c.pixelBitlength?new Uint32Array(c.decodePixels().buffer):16==c.pixelBitlength?new Uint16Array(c.decodePixels().buffer):new Uint8Array(c.decodePixels().buffer)).length,v=new Uint8Array(g*c.colors),m=new Uint8Array(g);var x,S=c.pixelBitlength-c.bits;for(w=0,N=0;w<g;w++){for(y=p[w],x=0;x<S;){v[N++]=y>>>x&255,x+=c.bits;}m[w]=y>>>x&255;}}if(16===c.bits){g=(p=new Uint32Array(c.decodePixels().buffer)).length,v=new Uint8Array(g*(32/c.pixelBitlength)*c.colors),m=new Uint8Array(g*(32/c.pixelBitlength)),b=c.colors>1,w=0,N=0;for(var _=0;w<g;){y=p[w++],v[N++]=y>>>0&255,b&&(v[N++]=y>>>16&255,y=p[w++],v[N++]=y>>>0&255),m[_++]=y>>>16&255;}u=8;}o!==e.image_compression.NONE&&r()?(t=n(v,c.width*c.colors,c.colors,o),d=n(m,c.width,1,o)):(t=v,d=m,L=void 0);}if(3===c.colorType&&(s=this.color_spaces.INDEXED,f=c.palette,c.transparency.indexed)){var P=c.transparency.indexed,k=0;for(w=0,g=P.length;w<g;++w){k+=P[w];}if((k/=255)===g-1&&-1!==P.indexOf(0))l=[P.indexOf(0)];else if(k!==g){for(p=c.decodePixels(),m=new Uint8Array(p.length),w=0,g=p.length;w<g;w++){m[w]=P[p[w]];}d=n(m,c.width,1);}}var I=function(t){var r;switch(t){case e.image_compression.FAST:r=11;break;case e.image_compression.MEDIUM:r=13;break;case e.image_compression.SLOW:r=14;break;default:r=12;}return r;}(o);return L===this.decode.FLATE_DECODE&&(A="/Predictor "+I+" "),A+="/Colors "+h+" /BitsPerComponent "+u+" /Columns "+c.width,(this.__addimage__.isArrayBuffer(t)||this.__addimage__.isArrayBufferView(t))&&(t=this.__addimage__.arrayBufferToBinaryString(t)),(d&&this.__addimage__.isArrayBuffer(d)||this.__addimage__.isArrayBufferView(d))&&(d=this.__addimage__.arrayBufferToBinaryString(d)),{alias:a,data:t,index:i,filter:L,decodeParameters:A,transparency:l,palette:f,sMask:d,predictor:I,width:c.width,height:c.height,bitsPerComponent:u,colorSpace:s};}};}(O.API),function(t){t.processGIF89A=function(e,r,n,i){var a=new Jt(e),o=a.width,s=a.height,u=[];a.decodeAndBlitFrameRGBA(0,u);var c={data:u,width:o,height:s},l=new Kt(100).encode(c,100);return t.processJPEG.call(this,l,r,n,i);},t.processGIF87A=t.processGIF89A;}(O.API),Zt.prototype.parseHeader=function(){if(this.fileSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.reserved=this.datav.getUint32(this.pos,!0),this.pos+=4,this.offset=this.datav.getUint32(this.pos,!0),this.pos+=4,this.headerSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.width=this.datav.getUint32(this.pos,!0),this.pos+=4,this.height=this.datav.getInt32(this.pos,!0),this.pos+=4,this.planes=this.datav.getUint16(this.pos,!0),this.pos+=2,this.bitPP=this.datav.getUint16(this.pos,!0),this.pos+=2,this.compress=this.datav.getUint32(this.pos,!0),this.pos+=4,this.rawSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.hr=this.datav.getUint32(this.pos,!0),this.pos+=4,this.vr=this.datav.getUint32(this.pos,!0),this.pos+=4,this.colors=this.datav.getUint32(this.pos,!0),this.pos+=4,this.importantColors=this.datav.getUint32(this.pos,!0),this.pos+=4,16===this.bitPP&&this.is_with_alpha&&(this.bitPP=15),this.bitPP<15){var t=0===this.colors?1<<this.bitPP:this.colors;this.palette=new Array(t);for(var e=0;e<t;e++){var r=this.datav.getUint8(this.pos++,!0),n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),a=this.datav.getUint8(this.pos++,!0);this.palette[e]={red:i,green:n,blue:r,quad:a};}}this.height<0&&(this.height*=-1,this.bottom_up=!1);},Zt.prototype.parseBGR=function(){this.pos=this.offset;try{var t="bit"+this.bitPP,e=this.width*this.height*4;this.data=new Uint8Array(e),this[t]();}catch(t){i.log("bit decode error:"+t);}},Zt.prototype.bit1=function(){var t,e=Math.ceil(this.width/8),r=e%4;for(t=this.height-1;t>=0;t--){for(var n=this.bottom_up?t:this.height-1-t,i=0;i<e;i++){for(var a=this.datav.getUint8(this.pos++,!0),o=n*this.width*4+8*i*4,s=0;s<8&&8*i+s<this.width;s++){var u=this.palette[a>>7-s&1];this.data[o+4*s]=u.blue,this.data[o+4*s+1]=u.green,this.data[o+4*s+2]=u.red,this.data[o+4*s+3]=255;}}0!==r&&(this.pos+=4-r);}},Zt.prototype.bit4=function(){for(var t=Math.ceil(this.width/2),e=t%4,r=this.height-1;r>=0;r--){for(var n=this.bottom_up?r:this.height-1-r,i=0;i<t;i++){var a=this.datav.getUint8(this.pos++,!0),o=n*this.width*4+2*i*4,s=a>>4,u=15&a,c=this.palette[s];if(this.data[o]=c.blue,this.data[o+1]=c.green,this.data[o+2]=c.red,this.data[o+3]=255,2*i+1>=this.width)break;c=this.palette[u],this.data[o+4]=c.blue,this.data[o+4+1]=c.green,this.data[o+4+2]=c.red,this.data[o+4+3]=255;}0!==e&&(this.pos+=4-e);}},Zt.prototype.bit8=function(){for(var t=this.width%4,e=this.height-1;e>=0;e--){for(var r=this.bottom_up?e:this.height-1-e,n=0;n<this.width;n++){var i=this.datav.getUint8(this.pos++,!0),a=r*this.width*4+4*n;if(i<this.palette.length){var o=this.palette[i];this.data[a]=o.red,this.data[a+1]=o.green,this.data[a+2]=o.blue,this.data[a+3]=255;}else this.data[a]=255,this.data[a+1]=255,this.data[a+2]=255,this.data[a+3]=255;}0!==t&&(this.pos+=4-t);}},Zt.prototype.bit15=function(){for(var t=this.width%3,e=parseInt("11111",2),r=this.height-1;r>=0;r--){for(var n=this.bottom_up?r:this.height-1-r,i=0;i<this.width;i++){var a=this.datav.getUint16(this.pos,!0);this.pos+=2;var o=(a&e)/e*255|0,s=(a>>5&e)/e*255|0,u=(a>>10&e)/e*255|0,c=a>>15?255:0,l=n*this.width*4+4*i;this.data[l]=u,this.data[l+1]=s,this.data[l+2]=o,this.data[l+3]=c;}this.pos+=t;}},Zt.prototype.bit16=function(){for(var t=this.width%3,e=parseInt("11111",2),r=parseInt("111111",2),n=this.height-1;n>=0;n--){for(var i=this.bottom_up?n:this.height-1-n,a=0;a<this.width;a++){var o=this.datav.getUint16(this.pos,!0);this.pos+=2;var s=(o&e)/e*255|0,u=(o>>5&r)/r*255|0,c=(o>>11)/e*255|0,l=i*this.width*4+4*a;this.data[l]=c,this.data[l+1]=u,this.data[l+2]=s,this.data[l+3]=255;}this.pos+=t;}},Zt.prototype.bit24=function(){for(var t=this.height-1;t>=0;t--){for(var e=this.bottom_up?t:this.height-1-t,r=0;r<this.width;r++){var n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),a=this.datav.getUint8(this.pos++,!0),o=e*this.width*4+4*r;this.data[o]=a,this.data[o+1]=i,this.data[o+2]=n,this.data[o+3]=255;}this.pos+=this.width%4;}},Zt.prototype.bit32=function(){for(var t=this.height-1;t>=0;t--){for(var e=this.bottom_up?t:this.height-1-t,r=0;r<this.width;r++){var n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),a=this.datav.getUint8(this.pos++,!0),o=this.datav.getUint8(this.pos++,!0),s=e*this.width*4+4*r;this.data[s]=a,this.data[s+1]=i,this.data[s+2]=n,this.data[s+3]=o;}}},Zt.prototype.getData=function(){return this.data;},
/**
 * @license
 * Copyright (c) 2018 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){t.processBMP=function(e,r,n,i){var a=new Zt(e,!1),o=a.width,s=a.height,u={data:a.getData(),width:o,height:s},c=new Kt(100).encode(u,100);return t.processJPEG.call(this,c,r,n,i);};}(O.API),$t.prototype.getData=function(){return this.data;},
/**
 * @license
 * Copyright (c) 2019 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){t.processWEBP=function(e,r,n,i){var a=new $t(e,!1),o=a.width,s=a.height,u={data:a.getData(),width:o,height:s},c=new Kt(100).encode(u,100);return t.processJPEG.call(this,c,r,n,i);};}(O.API),O.API.setLanguage=function(t){return void 0===this.internal.languageSettings&&(this.internal.languageSettings={},this.internal.languageSettings.isSubscribed=!1),void 0!=={af:"Afrikaans",sq:"Albanian",ar:"Arabic (Standard)","ar-DZ":"Arabic (Algeria)","ar-BH":"Arabic (Bahrain)","ar-EG":"Arabic (Egypt)","ar-IQ":"Arabic (Iraq)","ar-JO":"Arabic (Jordan)","ar-KW":"Arabic (Kuwait)","ar-LB":"Arabic (Lebanon)","ar-LY":"Arabic (Libya)","ar-MA":"Arabic (Morocco)","ar-OM":"Arabic (Oman)","ar-QA":"Arabic (Qatar)","ar-SA":"Arabic (Saudi Arabia)","ar-SY":"Arabic (Syria)","ar-TN":"Arabic (Tunisia)","ar-AE":"Arabic (U.A.E.)","ar-YE":"Arabic (Yemen)",an:"Aragonese",hy:"Armenian",as:"Assamese",ast:"Asturian",az:"Azerbaijani",eu:"Basque",be:"Belarusian",bn:"Bengali",bs:"Bosnian",br:"Breton",bg:"Bulgarian",my:"Burmese",ca:"Catalan",ch:"Chamorro",ce:"Chechen",zh:"Chinese","zh-HK":"Chinese (Hong Kong)","zh-CN":"Chinese (PRC)","zh-SG":"Chinese (Singapore)","zh-TW":"Chinese (Taiwan)",cv:"Chuvash",co:"Corsican",cr:"Cree",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch (Standard)","nl-BE":"Dutch (Belgian)",en:"English","en-AU":"English (Australia)","en-BZ":"English (Belize)","en-CA":"English (Canada)","en-IE":"English (Ireland)","en-JM":"English (Jamaica)","en-NZ":"English (New Zealand)","en-PH":"English (Philippines)","en-ZA":"English (South Africa)","en-TT":"English (Trinidad & Tobago)","en-GB":"English (United Kingdom)","en-US":"English (United States)","en-ZW":"English (Zimbabwe)",eo:"Esperanto",et:"Estonian",fo:"Faeroese",fj:"Fijian",fi:"Finnish",fr:"French (Standard)","fr-BE":"French (Belgium)","fr-CA":"French (Canada)","fr-FR":"French (France)","fr-LU":"French (Luxembourg)","fr-MC":"French (Monaco)","fr-CH":"French (Switzerland)",fy:"Frisian",fur:"Friulian",gd:"Gaelic (Scots)","gd-IE":"Gaelic (Irish)",gl:"Galacian",ka:"Georgian",de:"German (Standard)","de-AT":"German (Austria)","de-DE":"German (Germany)","de-LI":"German (Liechtenstein)","de-LU":"German (Luxembourg)","de-CH":"German (Switzerland)",el:"Greek",gu:"Gujurati",ht:"Haitian",he:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",iu:"Inuktitut",ga:"Irish",it:"Italian (Standard)","it-CH":"Italian (Switzerland)",ja:"Japanese",kn:"Kannada",ks:"Kashmiri",kk:"Kazakh",km:"Khmer",ky:"Kirghiz",tlh:"Klingon",ko:"Korean","ko-KP":"Korean (North Korea)","ko-KR":"Korean (South Korea)",la:"Latin",lv:"Latvian",lt:"Lithuanian",lb:"Luxembourgish",mk:"FYRO Macedonian",ms:"Malay",ml:"Malayalam",mt:"Maltese",mi:"Maori",mr:"Marathi",mo:"Moldavian",nv:"Navajo",ng:"Ndonga",ne:"Nepali",no:"Norwegian",nb:"Norwegian (Bokmal)",nn:"Norwegian (Nynorsk)",oc:"Occitan",or:"Oriya",om:"Oromo",fa:"Persian","fa-IR":"Persian/Iran",pl:"Polish",pt:"Portuguese","pt-BR":"Portuguese (Brazil)",pa:"Punjabi","pa-IN":"Punjabi (India)","pa-PK":"Punjabi (Pakistan)",qu:"Quechua",rm:"Rhaeto-Romanic",ro:"Romanian","ro-MO":"Romanian (Moldavia)",ru:"Russian","ru-MO":"Russian (Moldavia)",sz:"Sami (Lappish)",sg:"Sango",sa:"Sanskrit",sc:"Sardinian",sd:"Sindhi",si:"Singhalese",sr:"Serbian",sk:"Slovak",sl:"Slovenian",so:"Somani",sb:"Sorbian",es:"Spanish","es-AR":"Spanish (Argentina)","es-BO":"Spanish (Bolivia)","es-CL":"Spanish (Chile)","es-CO":"Spanish (Colombia)","es-CR":"Spanish (Costa Rica)","es-DO":"Spanish (Dominican Republic)","es-EC":"Spanish (Ecuador)","es-SV":"Spanish (El Salvador)","es-GT":"Spanish (Guatemala)","es-HN":"Spanish (Honduras)","es-MX":"Spanish (Mexico)","es-NI":"Spanish (Nicaragua)","es-PA":"Spanish (Panama)","es-PY":"Spanish (Paraguay)","es-PE":"Spanish (Peru)","es-PR":"Spanish (Puerto Rico)","es-ES":"Spanish (Spain)","es-UY":"Spanish (Uruguay)","es-VE":"Spanish (Venezuela)",sx:"Sutu",sw:"Swahili",sv:"Swedish","sv-FI":"Swedish (Finland)","sv-SV":"Swedish (Sweden)",ta:"Tamil",tt:"Tatar",te:"Teluga",th:"Thai",tig:"Tigre",ts:"Tsonga",tn:"Tswana",tr:"Turkish",tk:"Turkmen",uk:"Ukrainian",hsb:"Upper Sorbian",ur:"Urdu",ve:"Venda",vi:"Vietnamese",vo:"Volapuk",wa:"Walloon",cy:"Welsh",xh:"Xhosa",ji:"Yiddish",zu:"Zulu"}[t]&&(this.internal.languageSettings.languageCode=t,!1===this.internal.languageSettings.isSubscribed&&(this.internal.events.subscribe("putCatalog",function(){this.internal.write("/Lang ("+this.internal.languageSettings.languageCode+")");}),this.internal.languageSettings.isSubscribed=!0)),this;},
/** @license
 * MIT license.
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
zt=O.API,Ht=zt.getCharWidthsArray=function(t,e){var r,n,i=(e=e||{}).font||this.internal.getFont(),a=e.fontSize||this.internal.getFontSize(),o=e.charSpace||this.internal.getCharSpace(),s=e.widths?e.widths:i.metadata.Unicode.widths,u=s.fof?s.fof:1,c=e.kerning?e.kerning:i.metadata.Unicode.kerning,l=c.fof?c.fof:1,h=!1!==e.doKerning,f=0,d=t.length,p=0,g=s[0]||u,m=[];for(r=0;r<d;r++){n=t.charCodeAt(r),"function"==typeof i.metadata.widthOfString?m.push((i.metadata.widthOfGlyph(i.metadata.characterToGlyph(n))+o*(1e3/a)||0)/1e3):(f=h&&"object"==typeof c[n]&&!isNaN(parseInt(c[n][p],10))?c[n][p]/l:0,m.push((s[n]||g)/u+f)),p=n;}return m;},Vt=zt.getStringUnitWidth=function(t,e){var r=(e=e||{}).fontSize||this.internal.getFontSize(),n=e.font||this.internal.getFont(),i=e.charSpace||this.internal.getCharSpace();return zt.processArabic&&(t=zt.processArabic(t)),"function"==typeof n.metadata.widthOfString?n.metadata.widthOfString(t,r,i)/r:Ht.apply(this,arguments).reduce(function(t,e){return t+e;},0);},Wt=function Wt(t,e,r,n){for(var i=[],a=0,o=t.length,s=0;a!==o&&s+e[a]<r;){s+=e[a],a++;}i.push(t.slice(0,a));var u=a;for(s=0;a!==o;){s+e[a]>n&&(i.push(t.slice(u,a)),s=0,u=a),s+=e[a],a++;}return u!==a&&i.push(t.slice(u,a)),i;},Gt=function Gt(t,e,r){r||(r={});var n,i,a,o,s,u,c,l=[],h=[l],f=r.textIndent||0,d=0,p=0,g=t.split(" "),m=Ht.apply(this,[" ",r])[0];if(u=-1===r.lineIndent?g[0].length+2:r.lineIndent||0){var v=Array(u).join(" "),b=[];g.map(function(t){(t=t.split(/\s*\n/)).length>1?b=b.concat(t.map(function(t,e){return (e&&t.length?"\n":"")+t;})):b.push(t[0]);}),g=b,u=Vt.apply(this,[v,r]);}for(a=0,o=g.length;a<o;a++){var y=0;if(n=g[a],u&&"\n"==n[0]&&(n=n.substr(1),y=1),f+d+(p=(i=Ht.apply(this,[n,r])).reduce(function(t,e){return t+e;},0))>e||y){if(p>e){for(s=Wt.apply(this,[n,i,e-(f+d),e]),l.push(s.shift()),l=[s.pop()];s.length;){h.push([s.shift()]);}p=i.slice(n.length-(l[0]?l[0].length:0)).reduce(function(t,e){return t+e;},0);}else l=[n];h.push(l),f=p+u,d=m;}else l.push(n),f+=d+p,d=m;}return c=u?function(t,e){return (e?v:"")+t.join(" ");}:function(t){return t.join(" ");},h.map(c);},zt.splitTextToSize=function(t,e,r){var n,i=(r=r||{}).fontSize||this.internal.getFontSize(),a=function(t){if(t.widths&&t.kerning)return {widths:t.widths,kerning:t.kerning};var e=this.internal.getFont(t.fontName,t.fontStyle);return e.metadata.Unicode?{widths:e.metadata.Unicode.widths||{0:1},kerning:e.metadata.Unicode.kerning||{}}:{font:e.metadata,fontSize:this.internal.getFontSize(),charSpace:this.internal.getCharSpace()};}.call(this,r);n=Array.isArray(t)?t:String(t).split(/\r?\n/);var o=1*this.internal.scaleFactor*e/i;a.textIndent=r.textIndent?1*r.textIndent*this.internal.scaleFactor/i:0,a.lineIndent=r.lineIndent;var s,u,c=[];for(s=0,u=n.length;s<u;s++){c=c.concat(Gt.apply(this,[n[s],o,a]));}return c;},
/** @license
 jsPDF standard_fonts_metrics plugin
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 * MIT license.
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(t){t.__fontmetrics__=t.__fontmetrics__||{};for(var e="klmnopqrstuvwxyz",r={},n={},i=0;i<e.length;i++){r[e[i]]="0123456789abcdef"[i],n["0123456789abcdef"[i]]=e[i];}var a=function a(t){return "0x"+parseInt(t,10).toString(16);},o=t.__fontmetrics__.compress=function(t){var e,r,i,s,u=["{"];for(var c in t){if(e=t[c],isNaN(parseInt(c,10))?r="'"+c+"'":(c=parseInt(c,10),r=(r=a(c).slice(2)).slice(0,-1)+n[r.slice(-1)]),"number"==typeof e)e<0?(i=a(e).slice(3),s="-"):(i=a(e).slice(2),s=""),i=s+i.slice(0,-1)+n[i.slice(-1)];else {if("object"!=typeof e)throw new Error("Don't know what to do with value type "+typeof e+".");i=o(e);}u.push(r+i);}return u.push("}"),u.join("");},s=t.__fontmetrics__.uncompress=function(t){if("string"!=typeof t)throw new Error("Invalid argument passed to uncompress.");for(var e,n,i,a,o={},s=1,u=o,c=[],l="",h="",f=t.length-1,d=1;d<f;d+=1){"'"==(a=t[d])?e?(i=e.join(""),e=void 0):e=[]:e?e.push(a):"{"==a?(c.push([u,i]),u={},i=void 0):"}"==a?((n=c.pop())[0][n[1]]=u,i=void 0,u=n[0]):"-"==a?s=-1:void 0===i?r.hasOwnProperty(a)?(l+=r[a],i=parseInt(l,16)*s,s=1,l=""):l+=a:r.hasOwnProperty(a)?(h+=r[a],u[i]=parseInt(h,16)*s,s=1,i=void 0,h=""):h+=a;}return o;},u={codePages:["WinAnsiEncoding"],WinAnsiEncoding:s("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")},c={Unicode:{Courier:u,"Courier-Bold":u,"Courier-BoldOblique":u,"Courier-Oblique":u,Helvetica:u,"Helvetica-Bold":u,"Helvetica-BoldOblique":u,"Helvetica-Oblique":u,"Times-Roman":u,"Times-Bold":u,"Times-BoldItalic":u,"Times-Italic":u}},l={Unicode:{"Courier-Oblique":s("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-BoldItalic":s("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),"Helvetica-Bold":s("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),Courier:s("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-BoldOblique":s("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Bold":s("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),Symbol:s("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"),Helvetica:s("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),"Helvetica-BoldOblique":s("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),ZapfDingbats:s("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-Bold":s("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Italic":s("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),"Times-Roman":s("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),"Helvetica-Oblique":s("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")}};t.events.push(["addFont",function(t){var e=t.font,r=l.Unicode[e.postScriptName];r&&(e.metadata.Unicode={},e.metadata.Unicode.widths=r.widths,e.metadata.Unicode.kerning=r.kerning);var n=c.Unicode[e.postScriptName];n&&(e.metadata.Unicode.encoding=n,e.encoding=n.codePages[0]);}]);}(O.API),
/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){var e=function e(t){for(var e=t.length,r=new Uint8Array(e),n=0;n<e;n++){r[n]=t.charCodeAt(n);}return r;};t.API.events.push(["addFont",function(r){var n=void 0,i=r.font,a=r.instance;if(!i.isStandardFont){if(void 0===a)throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('"+i.postScriptName+"').");if("string"!=typeof(n=!1===a.existsFileInVFS(i.postScriptName)?a.loadFile(i.postScriptName):a.getFileFromVFS(i.postScriptName)))throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('"+i.postScriptName+"').");!function(r,n){n=/^\x00\x01\x00\x00/.test(n)?e(n):e(u(n)),r.metadata=t.API.TTFFont.open(n),r.metadata.Unicode=r.metadata.Unicode||{encoding:{},kerning:{},widths:[]},r.metadata.glyIdsUsed=[0];}(i,n);}}]);}(O),
/** @license
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(t){function e(){return (r.canvg?Promise.resolve(r.canvg):__webpack_require__.e(/*! import() */1).then(__webpack_require__.bind(null,/*! canvg */"./node_modules/canvg/lib/index.es.js"))).catch(function(t){return Promise.reject(new Error("Could not load canvg: "+t));}).then(function(t){return t.default?t.default:t;});}O.API.addSvgAsImage=function(t,r,n,a,o,s,u,c){if(isNaN(r)||isNaN(n))throw i.error("jsPDF.addSvgAsImage: Invalid coordinates",arguments),new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");if(isNaN(a)||isNaN(o))throw i.error("jsPDF.addSvgAsImage: Invalid measurements",arguments),new Error("Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage");var l=document.createElement("canvas");l.width=a,l.height=o;var h=l.getContext("2d");h.fillStyle="#fff",h.fillRect(0,0,l.width,l.height);var f={ignoreMouse:!0,ignoreAnimation:!0,ignoreDimensions:!0},d=this;return e().then(function(e){return e.fromString(h,t,f);},function(){return Promise.reject(new Error("Could not load canvg."));}).then(function(t){return t.render(f);}).then(function(){d.addImage(l.toDataURL("image/jpeg",1),r,n,a,o,u,c);});};}(),O.API.putTotalPages=function(t){var e,r=0;parseInt(this.internal.getFont().id.substr(1),10)<15?(e=new RegExp(t,"g"),r=this.internal.getNumberOfPages()):(e=new RegExp(this.pdfEscape16(t,this.internal.getFont()),"g"),r=this.pdfEscape16(this.internal.getNumberOfPages()+"",this.internal.getFont()));for(var n=1;n<=this.internal.getNumberOfPages();n++){for(var i=0;i<this.internal.pages[n].length;i++){this.internal.pages[n][i]=this.internal.pages[n][i].replace(e,r);}}return this;},O.API.viewerPreferences=function(t,e){var r;t=t||{},e=e||!1;var n,i,a,o={HideToolbar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideMenubar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideWindowUI:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},FitWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},CenterWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},DisplayDocTitle:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.4},NonFullScreenPageMode:{defaultValue:"UseNone",value:"UseNone",type:"name",explicitSet:!1,valueSet:["UseNone","UseOutlines","UseThumbs","UseOC"],pdfVersion:1.3},Direction:{defaultValue:"L2R",value:"L2R",type:"name",explicitSet:!1,valueSet:["L2R","R2L"],pdfVersion:1.3},ViewArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},ViewClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintScaling:{defaultValue:"AppDefault",value:"AppDefault",type:"name",explicitSet:!1,valueSet:["AppDefault","None"],pdfVersion:1.6},Duplex:{defaultValue:"",value:"none",type:"name",explicitSet:!1,valueSet:["Simplex","DuplexFlipShortEdge","DuplexFlipLongEdge","none"],pdfVersion:1.7},PickTrayByPDFSize:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.7},PrintPageRange:{defaultValue:"",value:"",type:"array",explicitSet:!1,valueSet:null,pdfVersion:1.7},NumCopies:{defaultValue:1,value:1,type:"integer",explicitSet:!1,valueSet:null,pdfVersion:1.7}},s=Object.keys(o),u=[],c=0,l=0,h=0;function f(t,e){var r,n=!1;for(r=0;r<t.length;r+=1){t[r]===e&&(n=!0);}return n;}if(void 0===this.internal.viewerpreferences&&(this.internal.viewerpreferences={},this.internal.viewerpreferences.configuration=JSON.parse(JSON.stringify(o)),this.internal.viewerpreferences.isSubscribed=!1),r=this.internal.viewerpreferences.configuration,"reset"===t||!0===e){var d=s.length;for(h=0;h<d;h+=1){r[s[h]].value=r[s[h]].defaultValue,r[s[h]].explicitSet=!1;}}if("object"==typeof t)for(i in t){if(a=t[i],f(s,i)&&void 0!==a){if("boolean"===r[i].type&&"boolean"==typeof a)r[i].value=a;else if("name"===r[i].type&&f(r[i].valueSet,a))r[i].value=a;else if("integer"===r[i].type&&Number.isInteger(a))r[i].value=a;else if("array"===r[i].type){for(c=0;c<a.length;c+=1){if(n=!0,1===a[c].length&&"number"==typeof a[c][0])u.push(String(a[c]-1));else if(a[c].length>1){for(l=0;l<a[c].length;l+=1){"number"!=typeof a[c][l]&&(n=!1);}!0===n&&u.push([a[c][0]-1,a[c][1]-1].join(" "));}}r[i].value="["+u.join(" ")+"]";}else r[i].value=r[i].defaultValue;r[i].explicitSet=!0;}}return !1===this.internal.viewerpreferences.isSubscribed&&(this.internal.events.subscribe("putCatalog",function(){var t,e=[];for(t in r){!0===r[t].explicitSet&&("name"===r[t].type?e.push("/"+t+" /"+r[t].value):e.push("/"+t+" "+r[t].value));}0!==e.length&&this.internal.write("/ViewerPreferences\n<<\n"+e.join("\n")+"\n>>");}),this.internal.viewerpreferences.isSubscribed=!0),this.internal.viewerpreferences.configuration=r,this;},
/** ====================================================================
 * @license
 * jsPDF XMP metadata plugin
 * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(t){var e=function e(){var t='<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="'+this.internal.__metadata__.namespaceuri+'"><jspdf:metadata>',e=unescape(encodeURIComponent('<x:xmpmeta xmlns:x="adobe:ns:meta/">')),r=unescape(encodeURIComponent(t)),n=unescape(encodeURIComponent(this.internal.__metadata__.metadata)),i=unescape(encodeURIComponent("</jspdf:metadata></rdf:Description></rdf:RDF>")),a=unescape(encodeURIComponent("</x:xmpmeta>")),o=r.length+n.length+i.length+e.length+a.length;this.internal.__metadata__.metadata_object_number=this.internal.newObject(),this.internal.write("<< /Type /Metadata /Subtype /XML /Length "+o+" >>"),this.internal.write("stream"),this.internal.write(e+r+n+i+a),this.internal.write("endstream"),this.internal.write("endobj");},r=function r(){this.internal.__metadata__.metadata_object_number&&this.internal.write("/Metadata "+this.internal.__metadata__.metadata_object_number+" 0 R");};t.addMetadata=function(t,n){return void 0===this.internal.__metadata__&&(this.internal.__metadata__={metadata:t,namespaceuri:n||"http://jspdf.default.namespaceuri/"},this.internal.events.subscribe("putCatalog",r),this.internal.events.subscribe("postPutResources",e)),this;};}(O.API),function(t){var e=t.API,r=e.pdfEscape16=function(t,e){for(var r,n=e.metadata.Unicode.widths,i=["","0","00","000","0000"],a=[""],o=0,s=t.length;o<s;++o){if(r=e.metadata.characterToGlyph(t.charCodeAt(o)),e.metadata.glyIdsUsed.push(r),e.metadata.toUnicode[r]=t.charCodeAt(o),-1==n.indexOf(r)&&(n.push(r),n.push([parseInt(e.metadata.widthOfGlyph(r),10)])),"0"==r)return a.join("");r=r.toString(16),a.push(i[4-r.length],r);}return a.join("");},n=function n(t){var e,r,n,i,a,o,s;for(a="/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange",n=[],o=0,s=(r=Object.keys(t).sort(function(t,e){return t-e;})).length;o<s;o++){e=r[o],n.length>=100&&(a+="\n"+n.length+" beginbfchar\n"+n.join("\n")+"\nendbfchar",n=[]),void 0!==t[e]&&null!==t[e]&&"function"==typeof t[e].toString&&(i=("0000"+t[e].toString(16)).slice(-4),e=("0000"+(+e).toString(16)).slice(-4),n.push("<"+e+"><"+i+">"));}return n.length&&(a+="\n"+n.length+" beginbfchar\n"+n.join("\n")+"\nendbfchar\n"),a+="endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend";};e.events.push(["putFont",function(e){!function(e){var r=e.font,i=e.out,a=e.newObject,o=e.putStream,s=e.pdfEscapeWithNeededParanthesis;if(r.metadata instanceof t.API.TTFFont&&"Identity-H"===r.encoding){for(var u=r.metadata.Unicode.widths,c=r.metadata.subset.encode(r.metadata.glyIdsUsed,1),l="",h=0;h<c.length;h++){l+=String.fromCharCode(c[h]);}var f=a();o({data:l,addLength1:!0,objectId:f}),i("endobj");var d=a();o({data:n(r.metadata.toUnicode),addLength1:!0,objectId:d}),i("endobj");var p=a();i("<<"),i("/Type /FontDescriptor"),i("/FontName /"+s(r.fontName)),i("/FontFile2 "+f+" 0 R"),i("/FontBBox "+t.API.PDFObject.convert(r.metadata.bbox)),i("/Flags "+r.metadata.flags),i("/StemV "+r.metadata.stemV),i("/ItalicAngle "+r.metadata.italicAngle),i("/Ascent "+r.metadata.ascender),i("/Descent "+r.metadata.decender),i("/CapHeight "+r.metadata.capHeight),i(">>"),i("endobj");var g=a();i("<<"),i("/Type /Font"),i("/BaseFont /"+s(r.fontName)),i("/FontDescriptor "+p+" 0 R"),i("/W "+t.API.PDFObject.convert(u)),i("/CIDToGIDMap /Identity"),i("/DW 1000"),i("/Subtype /CIDFontType2"),i("/CIDSystemInfo"),i("<<"),i("/Supplement 0"),i("/Registry (Adobe)"),i("/Ordering ("+r.encoding+")"),i(">>"),i(">>"),i("endobj"),r.objectNumber=a(),i("<<"),i("/Type /Font"),i("/Subtype /Type0"),i("/ToUnicode "+d+" 0 R"),i("/BaseFont /"+s(r.fontName)),i("/Encoding /"+r.encoding),i("/DescendantFonts ["+g+" 0 R]"),i(">>"),i("endobj"),r.isAlreadyPutted=!0;}}(e);}]);e.events.push(["putFont",function(e){!function(e){var r=e.font,i=e.out,a=e.newObject,o=e.putStream,s=e.pdfEscapeWithNeededParanthesis;if(r.metadata instanceof t.API.TTFFont&&"WinAnsiEncoding"===r.encoding){for(var u=r.metadata.rawData,c="",l=0;l<u.length;l++){c+=String.fromCharCode(u[l]);}var h=a();o({data:c,addLength1:!0,objectId:h}),i("endobj");var f=a();o({data:n(r.metadata.toUnicode),addLength1:!0,objectId:f}),i("endobj");var d=a();i("<<"),i("/Descent "+r.metadata.decender),i("/CapHeight "+r.metadata.capHeight),i("/StemV "+r.metadata.stemV),i("/Type /FontDescriptor"),i("/FontFile2 "+h+" 0 R"),i("/Flags 96"),i("/FontBBox "+t.API.PDFObject.convert(r.metadata.bbox)),i("/FontName /"+s(r.fontName)),i("/ItalicAngle "+r.metadata.italicAngle),i("/Ascent "+r.metadata.ascender),i(">>"),i("endobj"),r.objectNumber=a();for(var p=0;p<r.metadata.hmtx.widths.length;p++){r.metadata.hmtx.widths[p]=parseInt(r.metadata.hmtx.widths[p]*(1e3/r.metadata.head.unitsPerEm));}i("<</Subtype/TrueType/Type/Font/ToUnicode "+f+" 0 R/BaseFont/"+s(r.fontName)+"/FontDescriptor "+d+" 0 R/Encoding/"+r.encoding+" /FirstChar 29 /LastChar 255 /Widths "+t.API.PDFObject.convert(r.metadata.hmtx.widths)+">>"),i("endobj"),r.isAlreadyPutted=!0;}}(e);}]);var i=function i(t){var e,n=t.text||"",i=t.x,a=t.y,o=t.options||{},s=t.mutex||{},u=s.pdfEscape,c=s.activeFontKey,l=s.fonts,h=c,f="",d=0,p="",g=l[h].encoding;if("Identity-H"!==l[h].encoding)return {text:n,x:i,y:a,options:o,mutex:s};for(p=n,h=c,Array.isArray(n)&&(p=n[0]),d=0;d<p.length;d+=1){l[h].metadata.hasOwnProperty("cmap")&&(e=l[h].metadata.cmap.unicode.codeMap[p[d].charCodeAt(0)]),e||p[d].charCodeAt(0)<256&&l[h].metadata.hasOwnProperty("Unicode")?f+=p[d]:f+="";}var m="";return parseInt(h.slice(1))<14||"WinAnsiEncoding"===g?m=u(f,h).split("").map(function(t){return t.charCodeAt(0).toString(16);}).join(""):"Identity-H"===g&&(m=r(f,l[h])),s.isHex=!0,{text:m,x:i,y:a,options:o,mutex:s};};e.events.push(["postProcessText",function(t){var e=t.text||"",r=[],n={text:e,x:t.x,y:t.y,options:t.options,mutex:t.mutex};if(Array.isArray(e)){var a=0;for(a=0;a<e.length;a+=1){Array.isArray(e[a])&&3===e[a].length?r.push([i(Object.assign({},n,{text:e[a][0]})).text,e[a][1],e[a][2]]):r.push(i(Object.assign({},n,{text:e[a]})).text);}t.text=r;}else t.text=i(Object.assign({},n,{text:e})).text;}]);}(O),
/**
 * @license
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t){var e=function e(){return void 0===this.internal.vFS&&(this.internal.vFS={}),!0;};t.existsFileInVFS=function(t){return e.call(this),void 0!==this.internal.vFS[t];},t.addFileToVFS=function(t,r){return e.call(this),this.internal.vFS[t]=r,this;},t.getFileFromVFS=function(t){return e.call(this),void 0!==this.internal.vFS[t]?this.internal.vFS[t]:null;};}(O.API),
/**
 * @license
 * Unicode Bidi Engine based on the work of Alex Shensis (@asthensis)
 * MIT License
 */
function(t){t.__bidiEngine__=t.prototype.__bidiEngine__=function(t){var r,n,i,a,o,s,u,c=e,l=[[0,3,0,1,0,0,0],[0,3,0,1,2,2,0],[0,3,0,17,2,0,1],[0,3,5,5,4,1,0],[0,3,21,21,4,0,1],[0,3,5,5,4,2,0]],h=[[2,0,1,1,0,1,0],[2,0,1,1,0,2,0],[2,0,2,1,3,2,0],[2,0,2,33,3,1,1]],f={L:0,R:1,EN:2,AN:3,N:4,B:5,S:6},d={0:0,5:1,6:2,7:3,32:4,251:5,254:6,255:7},p=["(",")","(","<",">","<","[","]","[","{","}","{","«","»","«","‹","›","‹","⁅","⁆","⁅","⁽","⁾","⁽","₍","₎","₍","≤","≥","≤","〈","〉","〈","﹙","﹚","﹙","﹛","﹜","﹛","﹝","﹞","﹝","﹤","﹥","﹤"],g=new RegExp(/^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/),m=!1,v=0;this.__bidiEngine__={};var b=function b(t){var e=t.charCodeAt(),r=e>>8,n=d[r];return void 0!==n?c[256*n+(255&e)]:252===r||253===r?"AL":g.test(r)?"L":8===r?"R":"N";},y=function y(t){for(var e,r=0;r<t.length;r++){if("L"===(e=b(t.charAt(r))))return !1;if("R"===e)return !0;}return !1;},w=function w(t,e,o,s){var u,c,l,h,f=e[s];switch(f){case"L":case"R":m=!1;break;case"N":case"AN":break;case"EN":m&&(f="AN");break;case"AL":m=!0,f="R";break;case"WS":f="N";break;case"CS":s<1||s+1>=e.length||"EN"!==(u=o[s-1])&&"AN"!==u||"EN"!==(c=e[s+1])&&"AN"!==c?f="N":m&&(c="AN"),f=c===u?c:"N";break;case"ES":f="EN"===(u=s>0?o[s-1]:"B")&&s+1<e.length&&"EN"===e[s+1]?"EN":"N";break;case"ET":if(s>0&&"EN"===o[s-1]){f="EN";break;}if(m){f="N";break;}for(l=s+1,h=e.length;l<h&&"ET"===e[l];){l++;}f=l<h&&"EN"===e[l]?"EN":"N";break;case"NSM":if(i&&!a){for(h=e.length,l=s+1;l<h&&"NSM"===e[l];){l++;}if(l<h){var d=t[s],p=d>=1425&&d<=2303||64286===d;if(u=e[l],p&&("R"===u||"AL"===u)){f="R";break;}}}f=s<1||"B"===(u=e[s-1])?"N":o[s-1];break;case"B":m=!1,r=!0,f=v;break;case"S":n=!0,f="N";break;case"LRE":case"RLE":case"LRO":case"RLO":case"PDF":m=!1;break;case"BN":f="N";}return f;},N=function N(t,e,r){var n=t.split("");return r&&L(n,r,{hiLevel:v}),n.reverse(),e&&e.reverse(),n.join("");},L=function L(t,e,i){var a,o,s,u,c,d=-1,p=t.length,g=0,y=[],N=v?h:l,L=[];for(m=!1,r=!1,n=!1,o=0;o<p;o++){L[o]=b(t[o]);}for(s=0;s<p;s++){if(c=g,y[s]=w(t,L,y,s),a=240&(g=N[c][f[y[s]]]),g&=15,e[s]=u=N[g][5],a>0)if(16===a){for(o=d;o<s;o++){e[o]=1;}d=-1;}else d=-1;if(N[g][6])-1===d&&(d=s);else if(d>-1){for(o=d;o<s;o++){e[o]=u;}d=-1;}"B"===L[s]&&(e[s]=0),i.hiLevel|=u;}n&&function(t,e,r){for(var n=0;n<r;n++){if("S"===t[n]){e[n]=v;for(var i=n-1;i>=0&&"WS"===t[i];i--){e[i]=v;}}}}(L,e,p);},A=function A(t,e,n,i,a){if(!(a.hiLevel<t)){if(1===t&&1===v&&!r)return e.reverse(),void(n&&n.reverse());for(var o,s,u,c,l=e.length,h=0;h<l;){if(i[h]>=t){for(u=h+1;u<l&&i[u]>=t;){u++;}for(c=h,s=u-1;c<s;c++,s--){o=e[c],e[c]=e[s],e[s]=o,n&&(o=n[c],n[c]=n[s],n[s]=o);}h=u;}h++;}}},x=function x(t,e,r){var n=t.split(""),i={hiLevel:v};return r||(r=[]),L(n,r,i),function(t,e,r){if(0!==r.hiLevel&&u)for(var n,i=0;i<t.length;i++){1===e[i]&&(n=p.indexOf(t[i]))>=0&&(t[i]=p[n+1]);}}(n,r,i),A(2,n,e,r,i),A(1,n,e,r,i),n.join("");};return this.__bidiEngine__.doBidiReorder=function(t,e,r){if(function(t,e){if(e)for(var r=0;r<t.length;r++){e[r]=r;}void 0===a&&(a=y(t)),void 0===s&&(s=y(t));}(t,e),i||!o||s){if(i&&o&&a^s)v=a?1:0,t=N(t,e,r);else if(!i&&o&&s)v=a?1:0,t=x(t,e,r),t=N(t,e);else if(!i||a||o||s){if(i&&!o&&a^s)t=N(t,e),a?(v=0,t=x(t,e,r)):(v=1,t=x(t,e,r),t=N(t,e));else if(i&&a&&!o&&s)v=1,t=x(t,e,r),t=N(t,e);else if(!i&&!o&&a^s){var n=u;a?(v=1,t=x(t,e,r),v=0,u=!1,t=x(t,e,r),u=n):(v=0,t=x(t,e,r),t=N(t,e),v=1,u=!1,t=x(t,e,r),u=n,t=N(t,e));}}else v=0,t=x(t,e,r);}else v=a?1:0,t=x(t,e,r);return t;},this.__bidiEngine__.setOptions=function(t){t&&(i=t.isInputVisual,o=t.isOutputVisual,a=t.isInputRtl,s=t.isOutputRtl,u=t.isSymmetricSwapping);},this.__bidiEngine__.setOptions(t),this.__bidiEngine__;};var e=["BN","BN","BN","BN","BN","BN","BN","BN","BN","S","B","S","WS","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","B","B","B","S","WS","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","BN","BN","BN","BN","BN","BN","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","CS","N","ET","ET","ET","ET","N","N","N","N","L","N","N","BN","N","N","ET","ET","EN","EN","N","L","N","N","N","EN","L","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","N","N","N","N","N","ET","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","NSM","R","NSM","NSM","R","NSM","NSM","R","NSM","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","N","N","N","N","N","R","R","R","R","R","N","N","N","N","N","N","N","N","N","N","N","AN","AN","AN","AN","AN","AN","N","N","AL","ET","ET","AL","CS","AL","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","AN","AN","AN","AN","AN","AN","AN","AN","AN","ET","AN","AN","AL","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","N","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","NSM","NSM","N","NSM","NSM","NSM","NSM","AL","AL","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","R","N","N","N","N","R","N","N","N","N","N","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","BN","BN","BN","L","R","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","B","LRE","RLE","PDF","LRO","RLO","CS","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","BN","BN","BN","BN","BN","N","LRI","RLI","FSI","PDI","BN","BN","BN","BN","BN","BN","EN","L","N","N","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","L","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","N","N","N","N","N","R","NSM","R","R","R","R","R","R","R","R","R","R","ES","R","R","R","R","R","R","R","R","R","R","R","R","R","N","R","R","R","R","R","N","R","N","R","R","N","R","R","N","R","R","R","R","R","R","R","R","R","R","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","CS","N","N","CS","N","N","N","N","N","N","N","N","N","ET","N","N","ES","ES","N","N","N","N","N","ET","ET","N","N","N","N","N","AL","AL","AL","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","BN","N","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","N","N","N","ET","ET","N","N","N","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N"],r=new t.__bidiEngine__({isInputVisual:!0});t.API.events.push(["postProcessText",function(t){var e=t.text,n=(t.x,t.y,t.options||{}),i=(t.mutex,n.lang,[]);if(n.isInputVisual="boolean"!=typeof n.isInputVisual||n.isInputVisual,r.setOptions(n),"[object Array]"===Object.prototype.toString.call(e)){var a=0;for(i=[],a=0;a<e.length;a+=1){"[object Array]"===Object.prototype.toString.call(e[a])?i.push([r.doBidiReorder(e[a][0]),e[a][1],e[a][2]]):i.push([r.doBidiReorder(e[a])]);}t.text=i;}else t.text=r.doBidiReorder(e);r.setOptions({isInputVisual:!0});}]);}(O),O.API.TTFFont=function(){function t(t){var e;if(this.rawData=t,e=this.contents=new te(t),this.contents.pos=4,"ttcf"===e.readString(4))throw new Error("TTCF not supported.");e.pos=0,this.parse(),this.subset=new ye(this),this.registerTTF();}return t.open=function(e){return new t(e);},t.prototype.parse=function(){return this.directory=new ee(this.contents),this.head=new ie(this),this.name=new he(this),this.cmap=new oe(this),this.toUnicode={},this.hhea=new se(this),this.maxp=new fe(this),this.hmtx=new de(this),this.post=new ce(this),this.os2=new ue(this),this.loca=new be(this),this.glyf=new ge(this),this.ascender=this.os2.exists&&this.os2.ascender||this.hhea.ascender,this.decender=this.os2.exists&&this.os2.decender||this.hhea.decender,this.lineGap=this.os2.exists&&this.os2.lineGap||this.hhea.lineGap,this.bbox=[this.head.xMin,this.head.yMin,this.head.xMax,this.head.yMax];},t.prototype.registerTTF=function(){var t,e,r,n,i;if(this.scaleFactor=1e3/this.head.unitsPerEm,this.bbox=function(){var e,r,n,i;for(i=[],e=0,r=(n=this.bbox).length;e<r;e++){t=n[e],i.push(Math.round(t*this.scaleFactor));}return i;}.call(this),this.stemV=0,this.post.exists?(r=255&(n=this.post.italic_angle),0!=(32768&(e=n>>16))&&(e=-(1+(65535^e))),this.italicAngle=+(e+"."+r)):this.italicAngle=0,this.ascender=Math.round(this.ascender*this.scaleFactor),this.decender=Math.round(this.decender*this.scaleFactor),this.lineGap=Math.round(this.lineGap*this.scaleFactor),this.capHeight=this.os2.exists&&this.os2.capHeight||this.ascender,this.xHeight=this.os2.exists&&this.os2.xHeight||0,this.familyClass=(this.os2.exists&&this.os2.familyClass||0)>>8,this.isSerif=1===(i=this.familyClass)||2===i||3===i||4===i||5===i||7===i,this.isScript=10===this.familyClass,this.flags=0,this.post.isFixedPitch&&(this.flags|=1),this.isSerif&&(this.flags|=2),this.isScript&&(this.flags|=8),0!==this.italicAngle&&(this.flags|=64),this.flags|=32,!this.cmap.unicode)throw new Error("No unicode cmap for font");},t.prototype.characterToGlyph=function(t){var e;return (null!=(e=this.cmap.unicode)?e.codeMap[t]:void 0)||0;},t.prototype.widthOfGlyph=function(t){var e;return e=1e3/this.head.unitsPerEm,this.hmtx.forGlyph(t).advance*e;},t.prototype.widthOfString=function(t,e,r){var n,i,a,o;for(a=0,i=0,o=(t=""+t).length;0<=o?i<o:i>o;i=0<=o?++i:--i){n=t.charCodeAt(i),a+=this.widthOfGlyph(this.characterToGlyph(n))+r*(1e3/e)||0;}return a*(e/1e3);},t.prototype.lineHeight=function(t,e){var r;return null==e&&(e=!1),r=e?this.lineGap:0,(this.ascender+r-this.decender)/1e3*t;},t;}();var Qt,te=function(){function t(t){this.data=null!=t?t:[],this.pos=0,this.length=this.data.length;}return t.prototype.readByte=function(){return this.data[this.pos++];},t.prototype.writeByte=function(t){return this.data[this.pos++]=t;},t.prototype.readUInt32=function(){return 16777216*this.readByte()+(this.readByte()<<16)+(this.readByte()<<8)+this.readByte();},t.prototype.writeUInt32=function(t){return this.writeByte(t>>>24&255),this.writeByte(t>>16&255),this.writeByte(t>>8&255),this.writeByte(255&t);},t.prototype.readInt32=function(){var t;return (t=this.readUInt32())>=2147483648?t-4294967296:t;},t.prototype.writeInt32=function(t){return t<0&&(t+=4294967296),this.writeUInt32(t);},t.prototype.readUInt16=function(){return this.readByte()<<8|this.readByte();},t.prototype.writeUInt16=function(t){return this.writeByte(t>>8&255),this.writeByte(255&t);},t.prototype.readInt16=function(){var t;return (t=this.readUInt16())>=32768?t-65536:t;},t.prototype.writeInt16=function(t){return t<0&&(t+=65536),this.writeUInt16(t);},t.prototype.readString=function(t){var e,r;for(r=[],e=0;0<=t?e<t:e>t;e=0<=t?++e:--e){r[e]=String.fromCharCode(this.readByte());}return r.join("");},t.prototype.writeString=function(t){var e,r,n;for(n=[],e=0,r=t.length;0<=r?e<r:e>r;e=0<=r?++e:--e){n.push(this.writeByte(t.charCodeAt(e)));}return n;},t.prototype.readShort=function(){return this.readInt16();},t.prototype.writeShort=function(t){return this.writeInt16(t);},t.prototype.readLongLong=function(){var t,e,r,n,i,a,o,s;return t=this.readByte(),e=this.readByte(),r=this.readByte(),n=this.readByte(),i=this.readByte(),a=this.readByte(),o=this.readByte(),s=this.readByte(),128&t?-1*(72057594037927940*(255^t)+281474976710656*(255^e)+1099511627776*(255^r)+4294967296*(255^n)+16777216*(255^i)+65536*(255^a)+256*(255^o)+(255^s)+1):72057594037927940*t+281474976710656*e+1099511627776*r+4294967296*n+16777216*i+65536*a+256*o+s;},t.prototype.writeLongLong=function(t){var e,r;return e=Math.floor(t/4294967296),r=4294967295&t,this.writeByte(e>>24&255),this.writeByte(e>>16&255),this.writeByte(e>>8&255),this.writeByte(255&e),this.writeByte(r>>24&255),this.writeByte(r>>16&255),this.writeByte(r>>8&255),this.writeByte(255&r);},t.prototype.readInt=function(){return this.readInt32();},t.prototype.writeInt=function(t){return this.writeInt32(t);},t.prototype.read=function(t){var e,r;for(e=[],r=0;0<=t?r<t:r>t;r=0<=t?++r:--r){e.push(this.readByte());}return e;},t.prototype.write=function(t){var e,r,n,i;for(i=[],r=0,n=t.length;r<n;r++){e=t[r],i.push(this.writeByte(e));}return i;},t;}(),ee=function(){var t;function e(t){var e,r,n;for(this.scalarType=t.readInt(),this.tableCount=t.readShort(),this.searchRange=t.readShort(),this.entrySelector=t.readShort(),this.rangeShift=t.readShort(),this.tables={},r=0,n=this.tableCount;0<=n?r<n:r>n;r=0<=n?++r:--r){e={tag:t.readString(4),checksum:t.readInt(),offset:t.readInt(),length:t.readInt()},this.tables[e.tag]=e;}}return e.prototype.encode=function(e){var r,n,i,a,o,s,u,c,l,h,f,d,p;for(p in f=Object.keys(e).length,s=Math.log(2),l=16*Math.floor(Math.log(f)/s),a=Math.floor(l/s),c=16*f-l,(n=new te()).writeInt(this.scalarType),n.writeShort(f),n.writeShort(l),n.writeShort(a),n.writeShort(c),i=16*f,u=n.pos+i,o=null,d=[],e){for(h=e[p],n.writeString(p),n.writeInt(t(h)),n.writeInt(u),n.writeInt(h.length),d=d.concat(h),"head"===p&&(o=u),u+=h.length;u%4;){d.push(0),u++;}}return n.write(d),r=2981146554-t(n.data),n.pos=o+8,n.writeUInt32(r),n.data;},t=function t(_t6){var e,r,n,i;for(_t6=pe.call(_t6);_t6.length%4;){_t6.push(0);}for(n=new te(_t6),r=0,e=0,i=_t6.length;e<i;e=e+=4){r+=n.readUInt32();}return 4294967295&r;},e;}(),re={}.hasOwnProperty,ne=function ne(t,e){for(var r in e){re.call(e,r)&&(t[r]=e[r]);}function n(){this.constructor=t;}return n.prototype=e.prototype,t.prototype=new n(),t.__super__=e.prototype,t;};Qt=function(){function t(t){var e;this.file=t,e=this.file.directory.tables[this.tag],this.exists=!!e,e&&(this.offset=e.offset,this.length=e.length,this.parse(this.file.contents));}return t.prototype.parse=function(){},t.prototype.encode=function(){},t.prototype.raw=function(){return this.exists?(this.file.contents.pos=this.offset,this.file.contents.read(this.length)):null;},t;}();var ie=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="head",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.revision=t.readInt(),this.checkSumAdjustment=t.readInt(),this.magicNumber=t.readInt(),this.flags=t.readShort(),this.unitsPerEm=t.readShort(),this.created=t.readLongLong(),this.modified=t.readLongLong(),this.xMin=t.readShort(),this.yMin=t.readShort(),this.xMax=t.readShort(),this.yMax=t.readShort(),this.macStyle=t.readShort(),this.lowestRecPPEM=t.readShort(),this.fontDirectionHint=t.readShort(),this.indexToLocFormat=t.readShort(),this.glyphDataFormat=t.readShort();},e.prototype.encode=function(t){var e;return (e=new te()).writeInt(this.version),e.writeInt(this.revision),e.writeInt(this.checkSumAdjustment),e.writeInt(this.magicNumber),e.writeShort(this.flags),e.writeShort(this.unitsPerEm),e.writeLongLong(this.created),e.writeLongLong(this.modified),e.writeShort(this.xMin),e.writeShort(this.yMin),e.writeShort(this.xMax),e.writeShort(this.yMax),e.writeShort(this.macStyle),e.writeShort(this.lowestRecPPEM),e.writeShort(this.fontDirectionHint),e.writeShort(t),e.writeShort(this.glyphDataFormat),e.data;},e;}(),ae=function(){function t(t,e){var r,n,i,a,o,s,u,c,l,h,f,d,p,g,m,v,b;switch(this.platformID=t.readUInt16(),this.encodingID=t.readShort(),this.offset=e+t.readInt(),l=t.pos,t.pos=this.offset,this.format=t.readUInt16(),this.length=t.readUInt16(),this.language=t.readUInt16(),this.isUnicode=3===this.platformID&&1===this.encodingID&&4===this.format||0===this.platformID&&4===this.format,this.codeMap={},this.format){case 0:for(s=0;s<256;++s){this.codeMap[s]=t.readByte();}break;case 4:for(f=t.readUInt16(),h=f/2,t.pos+=6,i=function(){var e,r;for(r=[],s=e=0;0<=h?e<h:e>h;s=0<=h?++e:--e){r.push(t.readUInt16());}return r;}(),t.pos+=2,p=function(){var e,r;for(r=[],s=e=0;0<=h?e<h:e>h;s=0<=h?++e:--e){r.push(t.readUInt16());}return r;}(),u=function(){var e,r;for(r=[],s=e=0;0<=h?e<h:e>h;s=0<=h?++e:--e){r.push(t.readUInt16());}return r;}(),c=function(){var e,r;for(r=[],s=e=0;0<=h?e<h:e>h;s=0<=h?++e:--e){r.push(t.readUInt16());}return r;}(),n=(this.length-t.pos+this.offset)/2,o=function(){var e,r;for(r=[],s=e=0;0<=n?e<n:e>n;s=0<=n?++e:--e){r.push(t.readUInt16());}return r;}(),s=m=0,b=i.length;m<b;s=++m){for(g=i[s],r=v=d=p[s];d<=g?v<=g:v>=g;r=d<=g?++v:--v){0===c[s]?a=r+u[s]:0!==(a=o[c[s]/2+(r-d)-(h-s)]||0)&&(a+=u[s]),this.codeMap[r]=65535&a;}}}t.pos=l;}return t.encode=function(t,e){var r,n,i,a,o,s,u,c,l,h,f,d,p,g,m,v,b,y,w,N,L,A,x,S,_,P,k,I,F,C,j,O,B,M,E,q,R,T,D,U,z,H,V,W,G,Y;switch(I=new te(),a=Object.keys(t).sort(function(t,e){return t-e;}),e){case"macroman":for(p=0,g=function(){var t=[];for(d=0;d<256;++d){t.push(0);}return t;}(),v={0:0},i={},F=0,B=a.length;F<B;F++){null==v[V=t[n=a[F]]]&&(v[V]=++p),i[n]={old:t[n],new:v[t[n]]},g[n]=v[t[n]];}return I.writeUInt16(1),I.writeUInt16(0),I.writeUInt32(12),I.writeUInt16(0),I.writeUInt16(262),I.writeUInt16(0),I.write(g),{charMap:i,subtable:I.data,maxGlyphID:p+1};case"unicode":for(P=[],l=[],b=0,v={},r={},m=u=null,C=0,M=a.length;C<M;C++){null==v[w=t[n=a[C]]]&&(v[w]=++b),r[n]={old:w,new:v[w]},o=v[w]-n,null!=m&&o===u||(m&&l.push(m),P.push(n),u=o),m=n;}for(m&&l.push(m),l.push(65535),P.push(65535),S=2*(x=P.length),A=2*Math.pow(Math.log(x)/Math.LN2,2),h=Math.log(A/2)/Math.LN2,L=2*x-A,s=[],N=[],f=[],d=j=0,E=P.length;j<E;d=++j){if(_=P[d],c=l[d],65535===_){s.push(0),N.push(0);break;}if(_-(k=r[_].new)>=32768)for(s.push(0),N.push(2*(f.length+x-d)),n=O=_;_<=c?O<=c:O>=c;n=_<=c?++O:--O){f.push(r[n].new);}else s.push(k-_),N.push(0);}for(I.writeUInt16(3),I.writeUInt16(1),I.writeUInt32(12),I.writeUInt16(4),I.writeUInt16(16+8*x+2*f.length),I.writeUInt16(0),I.writeUInt16(S),I.writeUInt16(A),I.writeUInt16(h),I.writeUInt16(L),z=0,q=l.length;z<q;z++){n=l[z],I.writeUInt16(n);}for(I.writeUInt16(0),H=0,R=P.length;H<R;H++){n=P[H],I.writeUInt16(n);}for(W=0,T=s.length;W<T;W++){o=s[W],I.writeUInt16(o);}for(G=0,D=N.length;G<D;G++){y=N[G],I.writeUInt16(y);}for(Y=0,U=f.length;Y<U;Y++){p=f[Y],I.writeUInt16(p);}return {charMap:r,subtable:I.data,maxGlyphID:b+1};}},t;}(),oe=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="cmap",e.prototype.parse=function(t){var e,r,n;for(t.pos=this.offset,this.version=t.readUInt16(),n=t.readUInt16(),this.tables=[],this.unicode=null,r=0;0<=n?r<n:r>n;r=0<=n?++r:--r){e=new ae(t,this.offset),this.tables.push(e),e.isUnicode&&null==this.unicode&&(this.unicode=e);}return !0;},e.encode=function(t,e){var r,n;return null==e&&(e="macroman"),r=ae.encode(t,e),(n=new te()).writeUInt16(0),n.writeUInt16(1),r.table=n.data.concat(r.subtable),r;},e;}(),se=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="hhea",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.ascender=t.readShort(),this.decender=t.readShort(),this.lineGap=t.readShort(),this.advanceWidthMax=t.readShort(),this.minLeftSideBearing=t.readShort(),this.minRightSideBearing=t.readShort(),this.xMaxExtent=t.readShort(),this.caretSlopeRise=t.readShort(),this.caretSlopeRun=t.readShort(),this.caretOffset=t.readShort(),t.pos+=8,this.metricDataFormat=t.readShort(),this.numberOfMetrics=t.readUInt16();},e;}(),ue=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="OS/2",e.prototype.parse=function(t){if(t.pos=this.offset,this.version=t.readUInt16(),this.averageCharWidth=t.readShort(),this.weightClass=t.readUInt16(),this.widthClass=t.readUInt16(),this.type=t.readShort(),this.ySubscriptXSize=t.readShort(),this.ySubscriptYSize=t.readShort(),this.ySubscriptXOffset=t.readShort(),this.ySubscriptYOffset=t.readShort(),this.ySuperscriptXSize=t.readShort(),this.ySuperscriptYSize=t.readShort(),this.ySuperscriptXOffset=t.readShort(),this.ySuperscriptYOffset=t.readShort(),this.yStrikeoutSize=t.readShort(),this.yStrikeoutPosition=t.readShort(),this.familyClass=t.readShort(),this.panose=function(){var e,r;for(r=[],e=0;e<10;++e){r.push(t.readByte());}return r;}(),this.charRange=function(){var e,r;for(r=[],e=0;e<4;++e){r.push(t.readInt());}return r;}(),this.vendorID=t.readString(4),this.selection=t.readShort(),this.firstCharIndex=t.readShort(),this.lastCharIndex=t.readShort(),this.version>0&&(this.ascent=t.readShort(),this.descent=t.readShort(),this.lineGap=t.readShort(),this.winAscent=t.readShort(),this.winDescent=t.readShort(),this.codePageRange=function(){var e,r;for(r=[],e=0;e<2;e=++e){r.push(t.readInt());}return r;}(),this.version>1))return this.xHeight=t.readShort(),this.capHeight=t.readShort(),this.defaultChar=t.readShort(),this.breakChar=t.readShort(),this.maxContext=t.readShort();},e;}(),ce=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="post",e.prototype.parse=function(t){var e,r,n;switch(t.pos=this.offset,this.format=t.readInt(),this.italicAngle=t.readInt(),this.underlinePosition=t.readShort(),this.underlineThickness=t.readShort(),this.isFixedPitch=t.readInt(),this.minMemType42=t.readInt(),this.maxMemType42=t.readInt(),this.minMemType1=t.readInt(),this.maxMemType1=t.readInt(),this.format){case 65536:break;case 131072:var i;for(r=t.readUInt16(),this.glyphNameIndex=[],i=0;0<=r?i<r:i>r;i=0<=r?++i:--i){this.glyphNameIndex.push(t.readUInt16());}for(this.names=[],n=[];t.pos<this.offset+this.length;){e=t.readByte(),n.push(this.names.push(t.readString(e)));}return n;case 151552:return r=t.readUInt16(),this.offsets=t.read(r);case 196608:break;case 262144:return this.map=function(){var e,r,n;for(n=[],i=e=0,r=this.file.maxp.numGlyphs;0<=r?e<r:e>r;i=0<=r?++e:--e){n.push(t.readUInt32());}return n;}.call(this);}},e;}(),le=function le(t,e){this.raw=t,this.length=t.length,this.platformID=e.platformID,this.encodingID=e.encodingID,this.languageID=e.languageID;},he=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="name",e.prototype.parse=function(t){var e,r,n,i,a,o,s,u,c,l,h;for(t.pos=this.offset,t.readShort(),e=t.readShort(),o=t.readShort(),r=[],i=0;0<=e?i<e:i>e;i=0<=e?++i:--i){r.push({platformID:t.readShort(),encodingID:t.readShort(),languageID:t.readShort(),nameID:t.readShort(),length:t.readShort(),offset:this.offset+o+t.readShort()});}for(s={},i=c=0,l=r.length;c<l;i=++c){n=r[i],t.pos=n.offset,u=t.readString(n.length),a=new le(u,n),null==s[h=n.nameID]&&(s[h]=[]),s[n.nameID].push(a);}this.strings=s,this.copyright=s[0],this.fontFamily=s[1],this.fontSubfamily=s[2],this.uniqueSubfamily=s[3],this.fontName=s[4],this.version=s[5];try{this.postscriptName=s[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"");}catch(t){this.postscriptName=s[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"");}return this.trademark=s[7],this.manufacturer=s[8],this.designer=s[9],this.description=s[10],this.vendorUrl=s[11],this.designerUrl=s[12],this.license=s[13],this.licenseUrl=s[14],this.preferredFamily=s[15],this.preferredSubfamily=s[17],this.compatibleFull=s[18],this.sampleText=s[19];},e;}(),fe=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="maxp",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.numGlyphs=t.readUInt16(),this.maxPoints=t.readUInt16(),this.maxContours=t.readUInt16(),this.maxCompositePoints=t.readUInt16(),this.maxComponentContours=t.readUInt16(),this.maxZones=t.readUInt16(),this.maxTwilightPoints=t.readUInt16(),this.maxStorage=t.readUInt16(),this.maxFunctionDefs=t.readUInt16(),this.maxInstructionDefs=t.readUInt16(),this.maxStackElements=t.readUInt16(),this.maxSizeOfInstructions=t.readUInt16(),this.maxComponentElements=t.readUInt16(),this.maxComponentDepth=t.readUInt16();},e;}(),de=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="hmtx",e.prototype.parse=function(t){var e,r,n,i,a,o,s;for(t.pos=this.offset,this.metrics=[],e=0,o=this.file.hhea.numberOfMetrics;0<=o?e<o:e>o;e=0<=o?++e:--e){this.metrics.push({advance:t.readUInt16(),lsb:t.readInt16()});}for(n=this.file.maxp.numGlyphs-this.file.hhea.numberOfMetrics,this.leftSideBearings=function(){var r,i;for(i=[],e=r=0;0<=n?r<n:r>n;e=0<=n?++r:--r){i.push(t.readInt16());}return i;}(),this.widths=function(){var t,e,r,n;for(n=[],t=0,e=(r=this.metrics).length;t<e;t++){i=r[t],n.push(i.advance);}return n;}.call(this),r=this.widths[this.widths.length-1],s=[],e=a=0;0<=n?a<n:a>n;e=0<=n?++a:--a){s.push(this.widths.push(r));}return s;},e.prototype.forGlyph=function(t){return t in this.metrics?this.metrics[t]:{advance:this.metrics[this.metrics.length-1].advance,lsb:this.leftSideBearings[t-this.metrics.length]};},e;}(),pe=[].slice,ge=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="glyf",e.prototype.parse=function(){return this.cache={};},e.prototype.glyphFor=function(t){var e,r,n,i,a,o,s,u,c,l;return t in this.cache?this.cache[t]:(i=this.file.loca,e=this.file.contents,r=i.indexOf(t),0===(n=i.lengthOf(t))?this.cache[t]=null:(e.pos=this.offset+r,a=(o=new te(e.read(n))).readShort(),u=o.readShort(),l=o.readShort(),s=o.readShort(),c=o.readShort(),this.cache[t]=-1===a?new ve(o,u,l,s,c):new me(o,a,u,l,s,c),this.cache[t]));},e.prototype.encode=function(t,e,r){var n,i,a,o,s;for(a=[],i=[],o=0,s=e.length;o<s;o++){n=t[e[o]],i.push(a.length),n&&(a=a.concat(n.encode(r)));}return i.push(a.length),{table:a,offsets:i};},e;}(),me=function(){function t(t,e,r,n,i,a){this.raw=t,this.numberOfContours=e,this.xMin=r,this.yMin=n,this.xMax=i,this.yMax=a,this.compound=!1;}return t.prototype.encode=function(){return this.raw.data;},t;}(),ve=function(){function t(t,e,r,n,i){var a,o;for(this.raw=t,this.xMin=e,this.yMin=r,this.xMax=n,this.yMax=i,this.compound=!0,this.glyphIDs=[],this.glyphOffsets=[],a=this.raw;o=a.readShort(),this.glyphOffsets.push(a.pos),this.glyphIDs.push(a.readUInt16()),32&o;){a.pos+=1&o?4:2,128&o?a.pos+=8:64&o?a.pos+=4:8&o&&(a.pos+=2);}}return t.prototype.encode=function(){var t,e,r;for(e=new te(pe.call(this.raw.data)),t=0,r=this.glyphIDs.length;t<r;++t){e.pos=this.glyphOffsets[t];}return e.data;},t;}(),be=function(t){function e(){return e.__super__.constructor.apply(this,arguments);}return ne(e,Qt),e.prototype.tag="loca",e.prototype.parse=function(t){var e,r;return t.pos=this.offset,e=this.file.head.indexToLocFormat,this.offsets=0===e?function(){var e,n;for(n=[],r=0,e=this.length;r<e;r+=2){n.push(2*t.readUInt16());}return n;}.call(this):function(){var e,n;for(n=[],r=0,e=this.length;r<e;r+=4){n.push(t.readUInt32());}return n;}.call(this);},e.prototype.indexOf=function(t){return this.offsets[t];},e.prototype.lengthOf=function(t){return this.offsets[t+1]-this.offsets[t];},e.prototype.encode=function(t,e){for(var r=new Uint32Array(this.offsets.length),n=0,i=0,a=0;a<r.length;++a){if(r[a]=n,i<e.length&&e[i]==a){++i,r[a]=n;var o=this.offsets[a],s=this.offsets[a+1]-o;s>0&&(n+=s);}}for(var u=new Array(4*r.length),c=0;c<r.length;++c){u[4*c+3]=255&r[c],u[4*c+2]=(65280&r[c])>>8,u[4*c+1]=(16711680&r[c])>>16,u[4*c]=(4278190080&r[c])>>24;}return u;},e;}(),ye=function(){function t(t){this.font=t,this.subset={},this.unicodes={},this.next=33;}return t.prototype.generateCmap=function(){var t,e,r,n,i;for(e in n=this.font.cmap.tables[0].codeMap,t={},i=this.subset){r=i[e],t[e]=n[r];}return t;},t.prototype.glyphsFor=function(t){var e,r,n,i,a,o,s;for(n={},a=0,o=t.length;a<o;a++){n[i=t[a]]=this.font.glyf.glyphFor(i);}for(i in e=[],n){(null!=(r=n[i])?r.compound:void 0)&&e.push.apply(e,r.glyphIDs);}if(e.length>0)for(i in s=this.glyphsFor(e)){r=s[i],n[i]=r;}return n;},t.prototype.encode=function(t,e){var r,n,i,a,o,s,u,c,l,h,f,d,p,g,m;for(n in r=oe.encode(this.generateCmap(),"unicode"),a=this.glyphsFor(t),f={0:0},m=r.charMap){f[(s=m[n]).old]=s.new;}for(d in h=r.maxGlyphID,a){d in f||(f[d]=h++);}return c=function(t){var e,r;for(e in r={},t){r[t[e]]=e;}return r;}(f),l=Object.keys(c).sort(function(t,e){return t-e;}),p=function(){var t,e,r;for(r=[],t=0,e=l.length;t<e;t++){o=l[t],r.push(c[o]);}return r;}(),i=this.font.glyf.encode(a,p,f),u=this.font.loca.encode(i.offsets,p),g={cmap:this.font.cmap.raw(),glyf:i.table,loca:u,hmtx:this.font.hmtx.raw(),hhea:this.font.hhea.raw(),maxp:this.font.maxp.raw(),post:this.font.post.raw(),name:this.font.name.raw(),head:this.font.head.encode(e)},this.font.os2.exists&&(g["OS/2"]=this.font.os2.raw()),this.font.directory.encode(g);},t;}();O.API.PDFObject=function(){var t;function e(){}return t=function t(_t7,e){return (Array(e+1).join("0")+_t7).slice(-e);},e.convert=function(r){var n,i,a,o;if(Array.isArray(r))return "["+function(){var t,i,a;for(a=[],t=0,i=r.length;t<i;t++){n=r[t],a.push(e.convert(n));}return a;}().join(" ")+"]";if("string"==typeof r)return "/"+r;if(null!=r?r.isString:void 0)return "("+r+")";if(r instanceof Date)return "(D:"+t(r.getUTCFullYear(),4)+t(r.getUTCMonth(),2)+t(r.getUTCDate(),2)+t(r.getUTCHours(),2)+t(r.getUTCMinutes(),2)+t(r.getUTCSeconds(),2)+"Z)";if("[object Object]"==={}.toString.call(r)){for(i in a=["<<"],r){o=r[i],a.push("/"+i+" "+e.convert(o));}return a.push(">>"),a.join("\n");}return ""+r;},e;}();/* harmony default export */__webpack_exports__["default"]=O;


/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(/*! ./../../webpack/buildin/global.js */"./node_modules/webpack/buildin/global.js"));

/***/}}]);

}());
