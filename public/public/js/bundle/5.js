(function () {
'use strict';

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

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
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

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
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

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$1 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$1
};

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f$2 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
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
	f: f$2
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

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

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

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

var iterators = {};

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

var createProperty = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
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
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

var ITERATOR$1 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1]
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

var ITERATOR$2 = wellKnownSymbol('iterator');
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
  iteratorWithReturn[ITERATOR$2] = function () {
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
    object[ITERATOR$2] = function () {
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

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: arrayFrom
});

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

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

var ITERATOR$3 = wellKnownSymbol('iterator');
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
  return IteratorPrototype[ITERATOR$3].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if ( !has(IteratorPrototype, ITERATOR$3)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

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

/* global ActiveXObject -- old IE, WSH */








var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey('IE_PROTO');

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

hiddenKeys[IE_PROTO$1] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

var defineProperty = objectDefineProperty.f;



var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
    defineProperty(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
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
var ITERATOR$4 = wellKnownSymbol('iterator');
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
  var nativeIterator = IterablePrototype[ITERATOR$4]
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
        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
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
  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
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

var charAt = stringMultibyte.charAt;




var STRING_ITERATOR = 'String Iterator';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString_1(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
_export({ target: 'Object', stat: true }, {
  setPrototypeOf: objectSetPrototypeOf
});

// eslint-disable-next-line es/no-object-isfrozen -- safe
var $isFrozen = Object.isFrozen;
var FAILS_ON_PRIMITIVES = fails(function () { $isFrozen(1); });

// `Object.isFrozen` method
// https://tc39.es/ecma262/#sec-object.isfrozen
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  isFrozen: function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  }
});

var FAILS_ON_PRIMITIVES$1 = fails(function () { objectGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !correctPrototypeGetter }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return objectGetPrototypeOf(toObject(it));
  }
});

var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;


var FAILS_ON_PRIMITIVES$2 = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !descriptors || FAILS_ON_PRIMITIVES$2;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
_export({ target: 'Object', stat: true, forced: FORCED, sham: !descriptors }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});

var freezing = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
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
var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$5
};

var internalMetadata = createCommonjsModule(function (module) {
var defineProperty = objectDefineProperty.f;





var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

// eslint-disable-next-line es/no-object-isextensible -- safe
var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (freezing && REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var splice = [].splice;
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    objectGetOwnPropertyNames.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice.call(result, i, 1);
          break;
        }
      } return result;
    };

    _export({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;
});
var internalMetadata_1 = internalMetadata.enable;
var internalMetadata_2 = internalMetadata.fastKey;
var internalMetadata_3 = internalMetadata.getWeakData;
var internalMetadata_4 = internalMetadata.onFreeze;

var onFreeze = internalMetadata.onFreeze;

// eslint-disable-next-line es/no-object-freeze -- safe
var $freeze = Object.freeze;
var FAILS_ON_PRIMITIVES$3 = fails(function () { $freeze(1); });

// `Object.freeze` method
// https://tc39.es/ecma262/#sec-object.freeze
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3, sham: !freezing }, {
  freeze: function freeze(it) {
    return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it;
  }
});

var onFreeze$1 = internalMetadata.onFreeze;



// eslint-disable-next-line es/no-object-seal -- safe
var $seal = Object.seal;
var FAILS_ON_PRIMITIVES$4 = fails(function () { $seal(1); });

// `Object.seal` method
// https://tc39.es/ecma262/#sec-object.seal
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4, sham: !freezing }, {
  seal: function seal(it) {
    return $seal && isObject(it) ? $seal(onFreeze$1(it)) : it;
  }
});

var nativeApply = getBuiltIn('Reflect', 'apply');
var functionApply = Function.apply;

// MS Edge argumentsList argument is optional
var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
  nativeApply(function () { /* empty */ });
});

// `Reflect.apply` method
// https://tc39.es/ecma262/#sec-reflect.apply
_export({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
  apply: function apply(target, thisArgument, argumentsList) {
    aFunction$1(target);
    anObject(argumentsList);
    return nativeApply
      ? nativeApply(target, thisArgument, argumentsList)
      : functionApply.call(target, thisArgument, argumentsList);
  }
});

var slice = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func -- we have no proper alternatives, IE8- only
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
var functionBind = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction$1(this);
  var partArgs = slice.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};

var nativeConstruct = getBuiltIn('Reflect', 'construct');

// `Reflect.construct` method
// https://tc39.es/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED$1 = NEW_TARGET_BUG || ARGS_BUG;

_export({ target: 'Reflect', stat: true, forced: FORCED$1, sham: FORCED$1 }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction$1(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction$1(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (functionBind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

var SPECIES = wellKnownSymbol('species');

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var SPECIES$1 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$1] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

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

var FORCED$2 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$2 }, {
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





var getInternalState$1 = internalState.get;



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
    var state = getInternalState$1(re);
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







var SPECIES$2 = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

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
      re.constructor[SPECIES$2] = function () { return re; };
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
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
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
    redefine(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
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

var floor$1 = Math.floor;
var replace = ''.replace;
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
  return replace.call(replacement, symbols, function (match, ch) {
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
          var f = floor$1(n / 10);
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
var max$1 = Math.max;
var min$2 = Math.min;

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
        var position = max$1(min$2(toInteger(result.index), S.length), 0);
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

// a string of all valid unicode whitespaces
var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$2 = function (TYPE) {
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
  start: createMethod$2(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod$2(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod$2(3)
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

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var SPECIES$3 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
    defineProperty(Constructor, SPECIES$3, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var defineProperty$1 = objectDefineProperty.f;
var getOwnPropertyNames = objectGetOwnPropertyNames.f;







var enforceInternalState = internalState.enforce;





var MATCH$1 = wellKnownSymbol('match');
var NativeRegExp = global_1.RegExp;
var RegExpPrototype$1 = NativeRegExp.prototype;
// TODO: Use only propper RegExpIdentifierName
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;

var BASE_FORCED = descriptors &&
  (!CORRECT_NEW || UNSUPPORTED_Y$2 || regexpUnsupportedDotAll || regexpUnsupportedNcg || fails(function () {
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

    if (UNSUPPORTED_Y$2 && 'sticky' in re1) {
      sticky = !!flags && flags.indexOf('y') > -1;
      if (sticky) flags = flags.replace(/y/g, '');
    }

    if (regexpUnsupportedNcg) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }

    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);

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
    key in RegExpWrapper || defineProperty$1(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };

  for (var keys$1 = getOwnPropertyNames(NativeRegExp), index = 0; keys$1.length > index;) {
    proxy(keys$1[index++]);
  }

  RegExpPrototype$1.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype$1;
  redefine(global_1, 'RegExp', RegExpWrapper);
}

// https://tc39.es/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');

var TO_STRING = 'toString';
var RegExpPrototype$2 = RegExp.prototype;
var nativeToString = RegExpPrototype$2[TO_STRING];

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
    var f = toString_1(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$2) ? regexpFlags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

var f$6 = wellKnownSymbol;

var wellKnownSymbolWrapped = {
	f: f$6
};

var path = global_1;

var defineProperty$2 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty$2(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod$3 = function (TYPE) {
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
  forEach: createMethod$3(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$3(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$3(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$3(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$3(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$3(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$3(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod$3(7)
};

var $forEach = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';
var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');
var setInternalState$1 = internalState.set;
var getInternalState$2 = internalState.getterFor(SYMBOL);
var ObjectPrototype$1 = Object[PROTOTYPE$1];
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
var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
    nativeDefineProperty(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
  setInternalState$1(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var $defineProperty$1 = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype$1) $defineProperty$1(ObjectPrototypeSymbols, P, Attributes);
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
  $forEach(keys, function (key) {
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
  if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames$1 = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
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
      if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
    return getInternalState$2(this).tag;
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
    nativeDefineProperty($Symbol[PROTOTYPE$1], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState$2(this).description;
      }
    });
    {
      redefine(ObjectPrototype$1, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
    }
  }
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
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
if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE$1]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE$1, $Symbol[PROTOTYPE$1].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

var defineProperty$3 = objectDefineProperty.f;


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
  defineProperty$3(symbolPrototype, 'description', {
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

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype$1 = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype$1[UNSCOPABLES][key] = true;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$2 = internalState.set;
var getInternalState$3 = internalState.getterFor(ARRAY_ITERATOR);

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
  setInternalState$2(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$3(this);
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

var ITERATOR$5 = wellKnownSymbol('iterator');
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$5] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$5, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$5] = ArrayValues;
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

var defineProperty$4 = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (descriptors && !(NAME in FunctionPrototype)) {
  defineProperty$4(FunctionPrototype, NAME, {
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

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

/* eslint-disable es/no-array-prototype-indexof -- required for testing */

var $indexOf = arrayIncludes.indexOf;


var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{

/***/"./node_modules/dompurify/dist/purify.js":




function node_modulesDompurifyDistPurifyJs(module,exports,__webpack_require__){

/*! @license DOMPurify 2.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.3.1/LICENSE */

(function(global,factory){
module.exports=factory();
})(this,function(){
function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else {return Array.from(arr);}}

var hasOwnProperty=Object.hasOwnProperty,
setPrototypeOf=Object.setPrototypeOf,
isFrozen=Object.isFrozen,
getPrototypeOf=Object.getPrototypeOf,
getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor;
var freeze=Object.freeze,
seal=Object.seal,
create=Object.create;// eslint-disable-line import/no-mutable-exports

var _ref=typeof Reflect!=='undefined'&&Reflect,
apply=_ref.apply,
construct=_ref.construct;

if(!apply){
apply=function apply(fun,thisValue,args){
return fun.apply(thisValue,args);
};
}

if(!freeze){
freeze=function freeze(x){
return x;
};
}

if(!seal){
seal=function seal(x){
return x;
};
}

if(!construct){
construct=function construct(Func,args){
return new(Function.prototype.bind.apply(Func,[null].concat(_toConsumableArray(args))))();
};
}

var arrayForEach=unapply(Array.prototype.forEach);
var arrayPop=unapply(Array.prototype.pop);
var arrayPush=unapply(Array.prototype.push);

var stringToLowerCase=unapply(String.prototype.toLowerCase);
var stringMatch=unapply(String.prototype.match);
var stringReplace=unapply(String.prototype.replace);
var stringIndexOf=unapply(String.prototype.indexOf);
var stringTrim=unapply(String.prototype.trim);

var regExpTest=unapply(RegExp.prototype.test);

var typeErrorCreate=unconstruct(TypeError);

function unapply(func){
return function(thisArg){
for(var _len=arguments.length,args=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){
args[_key-1]=arguments[_key];
}

return apply(func,thisArg,args);
};
}

function unconstruct(func){
return function(){
for(var _len2=arguments.length,args=Array(_len2),_key2=0;_key2<_len2;_key2++){
args[_key2]=arguments[_key2];
}

return construct(func,args);
};
}

/* Add properties to a lookup table */
function addToSet(set,array){
if(setPrototypeOf){
// Make 'in' and truthy checks like Boolean(set.constructor)
// independent of any properties defined on Object.prototype.
// Prevent prototype setters from intercepting set as a this value.
setPrototypeOf(set,null);
}

var l=array.length;
while(l--){
var element=array[l];
if(typeof element==='string'){
var lcElement=stringToLowerCase(element);
if(lcElement!==element){
// Config presets (e.g. tags.js, attrs.js) are immutable.
if(!isFrozen(array)){
array[l]=lcElement;
}

element=lcElement;
}
}

set[element]=true;
}

return set;
}

/* Shallow clone an object */
function clone(object){
var newObject=create(null);

var property=void 0;
for(property in object){
if(apply(hasOwnProperty,object,[property])){
newObject[property]=object[property];
}
}

return newObject;
}

/* IE10 doesn't support __lookupGetter__ so lets'
   * simulate it. It also automatically checks
   * if the prop is function or getter and behaves
   * accordingly. */
function lookupGetter(object,prop){
while(object!==null){
var desc=getOwnPropertyDescriptor(object,prop);
if(desc){
if(desc.get){
return unapply(desc.get);
}

if(typeof desc.value==='function'){
return unapply(desc.value);
}
}

object=getPrototypeOf(object);
}

function fallbackValue(element){
console.warn('fallback value for',element);
return null;
}

return fallbackValue;
}

var html=freeze(['a','abbr','acronym','address','area','article','aside','audio','b','bdi','bdo','big','blink','blockquote','body','br','button','canvas','caption','center','cite','code','col','colgroup','content','data','datalist','dd','decorator','del','details','dfn','dialog','dir','div','dl','dt','element','em','fieldset','figcaption','figure','font','footer','form','h1','h2','h3','h4','h5','h6','head','header','hgroup','hr','html','i','img','input','ins','kbd','label','legend','li','main','map','mark','marquee','menu','menuitem','meter','nav','nobr','ol','optgroup','option','output','p','picture','pre','progress','q','rp','rt','ruby','s','samp','section','select','shadow','small','source','spacer','span','strike','strong','style','sub','summary','sup','table','tbody','td','template','textarea','tfoot','th','thead','time','tr','track','tt','u','ul','var','video','wbr']);

// SVG
var svg=freeze(['svg','a','altglyph','altglyphdef','altglyphitem','animatecolor','animatemotion','animatetransform','circle','clippath','defs','desc','ellipse','filter','font','g','glyph','glyphref','hkern','image','line','lineargradient','marker','mask','metadata','mpath','path','pattern','polygon','polyline','radialgradient','rect','stop','style','switch','symbol','text','textpath','title','tref','tspan','view','vkern']);

var svgFilters=freeze(['feBlend','feColorMatrix','feComponentTransfer','feComposite','feConvolveMatrix','feDiffuseLighting','feDisplacementMap','feDistantLight','feFlood','feFuncA','feFuncB','feFuncG','feFuncR','feGaussianBlur','feMerge','feMergeNode','feMorphology','feOffset','fePointLight','feSpecularLighting','feSpotLight','feTile','feTurbulence']);

// List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.
var svgDisallowed=freeze(['animate','color-profile','cursor','discard','fedropshadow','feimage','font-face','font-face-format','font-face-name','font-face-src','font-face-uri','foreignobject','hatch','hatchpath','mesh','meshgradient','meshpatch','meshrow','missing-glyph','script','set','solidcolor','unknown','use']);

var mathMl=freeze(['math','menclose','merror','mfenced','mfrac','mglyph','mi','mlabeledtr','mmultiscripts','mn','mo','mover','mpadded','mphantom','mroot','mrow','ms','mspace','msqrt','mstyle','msub','msup','msubsup','mtable','mtd','mtext','mtr','munder','munderover']);

// Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.
var mathMlDisallowed=freeze(['maction','maligngroup','malignmark','mlongdiv','mscarries','mscarry','msgroup','mstack','msline','msrow','semantics','annotation','annotation-xml','mprescripts','none']);

var text=freeze(['#text']);

var html$1=freeze(['accept','action','align','alt','autocapitalize','autocomplete','autopictureinpicture','autoplay','background','bgcolor','border','capture','cellpadding','cellspacing','checked','cite','class','clear','color','cols','colspan','controls','controlslist','coords','crossorigin','datetime','decoding','default','dir','disabled','disablepictureinpicture','disableremoteplayback','download','draggable','enctype','enterkeyhint','face','for','headers','height','hidden','high','href','hreflang','id','inputmode','integrity','ismap','kind','label','lang','list','loading','loop','low','max','maxlength','media','method','min','minlength','multiple','muted','name','noshade','novalidate','nowrap','open','optimum','pattern','placeholder','playsinline','poster','preload','pubdate','radiogroup','readonly','rel','required','rev','reversed','role','rows','rowspan','spellcheck','scope','selected','shape','size','sizes','span','srclang','start','src','srcset','step','style','summary','tabindex','title','translate','type','usemap','valign','value','width','xmlns','slot']);

var svg$1=freeze(['accent-height','accumulate','additive','alignment-baseline','ascent','attributename','attributetype','azimuth','basefrequency','baseline-shift','begin','bias','by','class','clip','clippathunits','clip-path','clip-rule','color','color-interpolation','color-interpolation-filters','color-profile','color-rendering','cx','cy','d','dx','dy','diffuseconstant','direction','display','divisor','dur','edgemode','elevation','end','fill','fill-opacity','fill-rule','filter','filterunits','flood-color','flood-opacity','font-family','font-size','font-size-adjust','font-stretch','font-style','font-variant','font-weight','fx','fy','g1','g2','glyph-name','glyphref','gradientunits','gradienttransform','height','href','id','image-rendering','in','in2','k','k1','k2','k3','k4','kerning','keypoints','keysplines','keytimes','lang','lengthadjust','letter-spacing','kernelmatrix','kernelunitlength','lighting-color','local','marker-end','marker-mid','marker-start','markerheight','markerunits','markerwidth','maskcontentunits','maskunits','max','mask','media','method','mode','min','name','numoctaves','offset','operator','opacity','order','orient','orientation','origin','overflow','paint-order','path','pathlength','patterncontentunits','patterntransform','patternunits','points','preservealpha','preserveaspectratio','primitiveunits','r','rx','ry','radius','refx','refy','repeatcount','repeatdur','restart','result','rotate','scale','seed','shape-rendering','specularconstant','specularexponent','spreadmethod','startoffset','stddeviation','stitchtiles','stop-color','stop-opacity','stroke-dasharray','stroke-dashoffset','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-opacity','stroke','stroke-width','style','surfacescale','systemlanguage','tabindex','targetx','targety','transform','text-anchor','text-decoration','text-rendering','textlength','type','u1','u2','unicode','values','viewbox','visibility','version','vert-adv-y','vert-origin-x','vert-origin-y','width','word-spacing','wrap','writing-mode','xchannelselector','ychannelselector','x','x1','x2','xmlns','y','y1','y2','z','zoomandpan']);

var mathMl$1=freeze(['accent','accentunder','align','bevelled','close','columnsalign','columnlines','columnspan','denomalign','depth','dir','display','displaystyle','encoding','fence','frame','height','href','id','largeop','length','linethickness','lspace','lquote','mathbackground','mathcolor','mathsize','mathvariant','maxsize','minsize','movablelimits','notation','numalign','open','rowalign','rowlines','rowspacing','rowspan','rspace','rquote','scriptlevel','scriptminsize','scriptsizemultiplier','selection','separator','separators','stretchy','subscriptshift','supscriptshift','symmetric','voffset','width','xmlns']);

var xml=freeze(['xlink:href','xml:id','xlink:title','xml:space','xmlns:xlink']);

// eslint-disable-next-line unicorn/better-regex
var MUSTACHE_EXPR=seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm);// Specify template detection regex for SAFE_FOR_TEMPLATES mode
var ERB_EXPR=seal(/<%[\s\S]*|[\s\S]*%>/gm);
var DATA_ATTR=seal(/^data-[\-\w.\u00B7-\uFFFF]/);// eslint-disable-line no-useless-escape
var ARIA_ATTR=seal(/^aria-[\-\w]+$/);// eslint-disable-line no-useless-escape
var IS_ALLOWED_URI=seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i// eslint-disable-line no-useless-escape
);
var IS_SCRIPT_OR_DATA=seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE=seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g// eslint-disable-line no-control-regex
);

var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};

function _toConsumableArray$1(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else {return Array.from(arr);}}

var getGlobal=function getGlobal(){
return typeof window==='undefined'?null:window;
};

/**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {Document} document The document object (to determine policy name suffix)
   * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported).
   */
var _createTrustedTypesPolicy=function _createTrustedTypesPolicy(trustedTypes,document){
if((typeof trustedTypes==='undefined'?'undefined':_typeof(trustedTypes))!=='object'||typeof trustedTypes.createPolicy!=='function'){
return null;
}

// Allow the callers to control the unique policy name
// by adding a data-tt-policy-suffix to the script element with the DOMPurify.
// Policy creation with duplicate names throws in Trusted Types.
var suffix=null;
var ATTR_NAME='data-tt-policy-suffix';
if(document.currentScript&&document.currentScript.hasAttribute(ATTR_NAME)){
suffix=document.currentScript.getAttribute(ATTR_NAME);
}

var policyName='dompurify'+(suffix?'#'+suffix:'');

try{
return trustedTypes.createPolicy(policyName,{
createHTML:function createHTML(html$$1){
return html$$1;
}});

}catch(_){
// Policy creation failed (most likely another DOMPurify script has
// already run). Skip creating the policy, as this will only cause errors
// if TT are enforced.
console.warn('TrustedTypes policy '+policyName+' could not be created.');
return null;
}
};

function createDOMPurify(){
var window=arguments.length>0&&arguments[0]!==undefined?arguments[0]:getGlobal();

var DOMPurify=function DOMPurify(root){
return createDOMPurify(root);
};

/**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */
DOMPurify.version='2.3.1';

/**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */
DOMPurify.removed=[];

if(!window||!window.document||window.document.nodeType!==9){
// Not running in a browser, provide a factory function
// so that you can pass your own Window
DOMPurify.isSupported=false;

return DOMPurify;
}

var originalDocument=window.document;

var document=window.document;
var DocumentFragment=window.DocumentFragment,
HTMLTemplateElement=window.HTMLTemplateElement,
Node=window.Node,
Element=window.Element,
NodeFilter=window.NodeFilter,
_window$NamedNodeMap=window.NamedNodeMap,
NamedNodeMap=_window$NamedNodeMap===undefined?window.NamedNodeMap||window.MozNamedAttrMap:_window$NamedNodeMap,
Text=window.Text,
Comment=window.Comment,
DOMParser=window.DOMParser,
trustedTypes=window.trustedTypes;


var ElementPrototype=Element.prototype;

var cloneNode=lookupGetter(ElementPrototype,'cloneNode');
var getNextSibling=lookupGetter(ElementPrototype,'nextSibling');
var getChildNodes=lookupGetter(ElementPrototype,'childNodes');
var getParentNode=lookupGetter(ElementPrototype,'parentNode');

// As per issue #47, the web-components registry is inherited by a
// new document created via createHTMLDocument. As per the spec
// (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
// a new empty registry is used when creating a template contents owner
// document, so we use that as our parent document to ensure nothing
// is inherited.
if(typeof HTMLTemplateElement==='function'){
var template=document.createElement('template');
if(template.content&&template.content.ownerDocument){
document=template.content.ownerDocument;
}
}

var trustedTypesPolicy=_createTrustedTypesPolicy(trustedTypes,originalDocument);
var emptyHTML=trustedTypesPolicy&&RETURN_TRUSTED_TYPE?trustedTypesPolicy.createHTML(''):'';

var _document=document,
implementation=_document.implementation,
createNodeIterator=_document.createNodeIterator,
createDocumentFragment=_document.createDocumentFragment,
getElementsByTagName=_document.getElementsByTagName;
var importNode=originalDocument.importNode;


var documentMode={};
try{
documentMode=clone(document).documentMode?document.documentMode:{};
}catch(_){}

var hooks={};

/**
     * Expose whether this browser supports running the full DOMPurify.
     */
DOMPurify.isSupported=typeof getParentNode==='function'&&implementation&&typeof implementation.createHTMLDocument!=='undefined'&&documentMode!==9;

var MUSTACHE_EXPR$$1=MUSTACHE_EXPR,
ERB_EXPR$$1=ERB_EXPR,
DATA_ATTR$$1=DATA_ATTR,
ARIA_ATTR$$1=ARIA_ATTR,
IS_SCRIPT_OR_DATA$$1=IS_SCRIPT_OR_DATA,
ATTR_WHITESPACE$$1=ATTR_WHITESPACE;
var IS_ALLOWED_URI$$1=IS_ALLOWED_URI;

/**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

/* allowed element names */

var ALLOWED_TAGS=null;
var DEFAULT_ALLOWED_TAGS=addToSet({},[].concat(_toConsumableArray$1(html),_toConsumableArray$1(svg),_toConsumableArray$1(svgFilters),_toConsumableArray$1(mathMl),_toConsumableArray$1(text)));

/* Allowed attribute names */
var ALLOWED_ATTR=null;
var DEFAULT_ALLOWED_ATTR=addToSet({},[].concat(_toConsumableArray$1(html$1),_toConsumableArray$1(svg$1),_toConsumableArray$1(mathMl$1),_toConsumableArray$1(xml)));

/* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
var FORBID_TAGS=null;

/* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
var FORBID_ATTR=null;

/* Decide if ARIA attributes are okay */
var ALLOW_ARIA_ATTR=true;

/* Decide if custom data attributes are okay */
var ALLOW_DATA_ATTR=true;

/* Decide if unknown protocols are okay */
var ALLOW_UNKNOWN_PROTOCOLS=false;

/* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */
var SAFE_FOR_TEMPLATES=false;

/* Decide if document with <html>... should be returned */
var WHOLE_DOCUMENT=false;

/* Track whether config is already set on this instance of DOMPurify. */
var SET_CONFIG=false;

/* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */
var FORCE_BODY=false;

/* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */
var RETURN_DOM=false;

/* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */
var RETURN_DOM_FRAGMENT=false;

/* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
     * `Node` is imported into the current `Document`. If this flag is not enabled the
     * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
     * DOMPurify.
     *
     * This defaults to `true` starting DOMPurify 2.2.0. Note that setting it to `false`
     * might cause XSS from attacks hidden in closed shadowroots in case the browser
     * supports Declarative Shadow: DOM https://web.dev/declarative-shadow-dom/
     */
var RETURN_DOM_IMPORT=true;

/* Try to return a Trusted Type object instead of a string, return a string in
     * case Trusted Types are not supported  */
var RETURN_TRUSTED_TYPE=false;

/* Output should be free from DOM clobbering attacks? */
var SANITIZE_DOM=true;

/* Keep element content when removing element? */
var KEEP_CONTENT=true;

/* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */
var IN_PLACE=false;

/* Allow usage of profiles like html, svg and mathMl */
var USE_PROFILES={};

/* Tags to ignore content of when KEEP_CONTENT is true */
var FORBID_CONTENTS=null;
var DEFAULT_FORBID_CONTENTS=addToSet({},['annotation-xml','audio','colgroup','desc','foreignobject','head','iframe','math','mi','mn','mo','ms','mtext','noembed','noframes','noscript','plaintext','script','style','svg','template','thead','title','video','xmp']);

/* Tags that are safe for data: URIs */
var DATA_URI_TAGS=null;
var DEFAULT_DATA_URI_TAGS=addToSet({},['audio','video','img','source','image','track']);

/* Attributes safe for values like "javascript:" */
var URI_SAFE_ATTRIBUTES=null;
var DEFAULT_URI_SAFE_ATTRIBUTES=addToSet({},['alt','class','for','id','label','name','pattern','placeholder','role','summary','title','value','style','xmlns']);

var MATHML_NAMESPACE='http://www.w3.org/1998/Math/MathML';
var SVG_NAMESPACE='http://www.w3.org/2000/svg';
var HTML_NAMESPACE='http://www.w3.org/1999/xhtml';
/* Document namespace */
var NAMESPACE=HTML_NAMESPACE;
var IS_EMPTY_INPUT=false;

/* Keep a reference to config to pass to hooks */
var CONFIG=null;

/* Ideally, do not touch anything below this line */
/* ______________________________________________ */

var formElement=document.createElement('form');

/**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */
// eslint-disable-next-line complexity
var _parseConfig=function _parseConfig(cfg){
if(CONFIG&&CONFIG===cfg){
return;
}

/* Shield configuration object from tampering */
if(!cfg||(typeof cfg==='undefined'?'undefined':_typeof(cfg))!=='object'){
cfg={};
}

/* Shield configuration object from prototype pollution */
cfg=clone(cfg);

/* Set configuration parameters */
ALLOWED_TAGS='ALLOWED_TAGS'in cfg?addToSet({},cfg.ALLOWED_TAGS):DEFAULT_ALLOWED_TAGS;
ALLOWED_ATTR='ALLOWED_ATTR'in cfg?addToSet({},cfg.ALLOWED_ATTR):DEFAULT_ALLOWED_ATTR;
URI_SAFE_ATTRIBUTES='ADD_URI_SAFE_ATTR'in cfg?addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES),cfg.ADD_URI_SAFE_ATTR):DEFAULT_URI_SAFE_ATTRIBUTES;
DATA_URI_TAGS='ADD_DATA_URI_TAGS'in cfg?addToSet(clone(DEFAULT_DATA_URI_TAGS),cfg.ADD_DATA_URI_TAGS):DEFAULT_DATA_URI_TAGS;
FORBID_CONTENTS='FORBID_CONTENTS'in cfg?addToSet({},cfg.FORBID_CONTENTS):DEFAULT_FORBID_CONTENTS;
FORBID_TAGS='FORBID_TAGS'in cfg?addToSet({},cfg.FORBID_TAGS):{};
FORBID_ATTR='FORBID_ATTR'in cfg?addToSet({},cfg.FORBID_ATTR):{};
USE_PROFILES='USE_PROFILES'in cfg?cfg.USE_PROFILES:false;
ALLOW_ARIA_ATTR=cfg.ALLOW_ARIA_ATTR!==false;// Default true
ALLOW_DATA_ATTR=cfg.ALLOW_DATA_ATTR!==false;// Default true
ALLOW_UNKNOWN_PROTOCOLS=cfg.ALLOW_UNKNOWN_PROTOCOLS||false;// Default false
SAFE_FOR_TEMPLATES=cfg.SAFE_FOR_TEMPLATES||false;// Default false
WHOLE_DOCUMENT=cfg.WHOLE_DOCUMENT||false;// Default false
RETURN_DOM=cfg.RETURN_DOM||false;// Default false
RETURN_DOM_FRAGMENT=cfg.RETURN_DOM_FRAGMENT||false;// Default false
RETURN_DOM_IMPORT=cfg.RETURN_DOM_IMPORT!==false;// Default true
RETURN_TRUSTED_TYPE=cfg.RETURN_TRUSTED_TYPE||false;// Default false
FORCE_BODY=cfg.FORCE_BODY||false;// Default false
SANITIZE_DOM=cfg.SANITIZE_DOM!==false;// Default true
KEEP_CONTENT=cfg.KEEP_CONTENT!==false;// Default true
IN_PLACE=cfg.IN_PLACE||false;// Default false
IS_ALLOWED_URI$$1=cfg.ALLOWED_URI_REGEXP||IS_ALLOWED_URI$$1;
NAMESPACE=cfg.NAMESPACE||HTML_NAMESPACE;
if(SAFE_FOR_TEMPLATES){
ALLOW_DATA_ATTR=false;
}

if(RETURN_DOM_FRAGMENT){
RETURN_DOM=true;
}

/* Parse profile info */
if(USE_PROFILES){
ALLOWED_TAGS=addToSet({},[].concat(_toConsumableArray$1(text)));
ALLOWED_ATTR=[];
if(USE_PROFILES.html===true){
addToSet(ALLOWED_TAGS,html);
addToSet(ALLOWED_ATTR,html$1);
}

if(USE_PROFILES.svg===true){
addToSet(ALLOWED_TAGS,svg);
addToSet(ALLOWED_ATTR,svg$1);
addToSet(ALLOWED_ATTR,xml);
}

if(USE_PROFILES.svgFilters===true){
addToSet(ALLOWED_TAGS,svgFilters);
addToSet(ALLOWED_ATTR,svg$1);
addToSet(ALLOWED_ATTR,xml);
}

if(USE_PROFILES.mathMl===true){
addToSet(ALLOWED_TAGS,mathMl);
addToSet(ALLOWED_ATTR,mathMl$1);
addToSet(ALLOWED_ATTR,xml);
}
}

/* Merge configuration parameters */
if(cfg.ADD_TAGS){
if(ALLOWED_TAGS===DEFAULT_ALLOWED_TAGS){
ALLOWED_TAGS=clone(ALLOWED_TAGS);
}

addToSet(ALLOWED_TAGS,cfg.ADD_TAGS);
}

if(cfg.ADD_ATTR){
if(ALLOWED_ATTR===DEFAULT_ALLOWED_ATTR){
ALLOWED_ATTR=clone(ALLOWED_ATTR);
}

addToSet(ALLOWED_ATTR,cfg.ADD_ATTR);
}

if(cfg.ADD_URI_SAFE_ATTR){
addToSet(URI_SAFE_ATTRIBUTES,cfg.ADD_URI_SAFE_ATTR);
}

if(cfg.FORBID_CONTENTS){
if(FORBID_CONTENTS===DEFAULT_FORBID_CONTENTS){
FORBID_CONTENTS=clone(FORBID_CONTENTS);
}

addToSet(FORBID_CONTENTS,cfg.FORBID_CONTENTS);
}

/* Add #text in case KEEP_CONTENT is set to true */
if(KEEP_CONTENT){
ALLOWED_TAGS['#text']=true;
}

/* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
if(WHOLE_DOCUMENT){
addToSet(ALLOWED_TAGS,['html','head','body']);
}

/* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
if(ALLOWED_TAGS.table){
addToSet(ALLOWED_TAGS,['tbody']);
delete FORBID_TAGS.tbody;
}

// Prevent further manipulation of configuration.
// Not available in IE8, Safari 5, etc.
if(freeze){
freeze(cfg);
}

CONFIG=cfg;
};

var MATHML_TEXT_INTEGRATION_POINTS=addToSet({},['mi','mo','mn','ms','mtext']);

var HTML_INTEGRATION_POINTS=addToSet({},['foreignobject','desc','title','annotation-xml']);

/* Keep track of all possible SVG and MathML tags
     * so that we can perform the namespace checks
     * correctly. */
var ALL_SVG_TAGS=addToSet({},svg);
addToSet(ALL_SVG_TAGS,svgFilters);
addToSet(ALL_SVG_TAGS,svgDisallowed);

var ALL_MATHML_TAGS=addToSet({},mathMl);
addToSet(ALL_MATHML_TAGS,mathMlDisallowed);

/**
     *
     *
     * @param  {Element} element a DOM element whose namespace is being checked
     * @returns {boolean} Return false if the element has a
     *  namespace that a spec-compliant parser would never
     *  return. Return true otherwise.
     */
var _checkValidNamespace=function _checkValidNamespace(element){
var parent=getParentNode(element);

// In JSDOM, if we're inside shadow DOM, then parentNode
// can be null. We just simulate parent in this case.
if(!parent||!parent.tagName){
parent={
namespaceURI:HTML_NAMESPACE,
tagName:'template'};

}

var tagName=stringToLowerCase(element.tagName);
var parentTagName=stringToLowerCase(parent.tagName);

if(element.namespaceURI===SVG_NAMESPACE){
// The only way to switch from HTML namespace to SVG
// is via <svg>. If it happens via any other tag, then
// it should be killed.
if(parent.namespaceURI===HTML_NAMESPACE){
return tagName==='svg';
}

// The only way to switch from MathML to SVG is via
// svg if parent is either <annotation-xml> or MathML
// text integration points.
if(parent.namespaceURI===MATHML_NAMESPACE){
return tagName==='svg'&&(parentTagName==='annotation-xml'||MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
}

// We only allow elements that are defined in SVG
// spec. All others are disallowed in SVG namespace.
return Boolean(ALL_SVG_TAGS[tagName]);
}

if(element.namespaceURI===MATHML_NAMESPACE){
// The only way to switch from HTML namespace to MathML
// is via <math>. If it happens via any other tag, then
// it should be killed.
if(parent.namespaceURI===HTML_NAMESPACE){
return tagName==='math';
}

// The only way to switch from SVG to MathML is via
// <math> and HTML integration points
if(parent.namespaceURI===SVG_NAMESPACE){
return tagName==='math'&&HTML_INTEGRATION_POINTS[parentTagName];
}

// We only allow elements that are defined in MathML
// spec. All others are disallowed in MathML namespace.
return Boolean(ALL_MATHML_TAGS[tagName]);
}

if(element.namespaceURI===HTML_NAMESPACE){
// The only way to switch from SVG to HTML is via
// HTML integration points, and from MathML to HTML
// is via MathML text integration points
if(parent.namespaceURI===SVG_NAMESPACE&&!HTML_INTEGRATION_POINTS[parentTagName]){
return false;
}

if(parent.namespaceURI===MATHML_NAMESPACE&&!MATHML_TEXT_INTEGRATION_POINTS[parentTagName]){
return false;
}

// Certain elements are allowed in both SVG and HTML
// namespace. We need to specify them explicitly
// so that they don't get erronously deleted from
// HTML namespace.
var commonSvgAndHTMLElements=addToSet({},['title','style','font','a','script']);

// We disallow tags that are specific for MathML
// or SVG and should never appear in HTML namespace
return !ALL_MATHML_TAGS[tagName]&&(commonSvgAndHTMLElements[tagName]||!ALL_SVG_TAGS[tagName]);
}

// The code should never reach this place (this means
// that the element somehow got namespace that is not
// HTML, SVG or MathML). Return false just in case.
return false;
};

/**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */
var _forceRemove=function _forceRemove(node){
arrayPush(DOMPurify.removed,{element:node});
try{
// eslint-disable-next-line unicorn/prefer-dom-node-remove
node.parentNode.removeChild(node);
}catch(_){
try{
node.outerHTML=emptyHTML;
}catch(_){
node.remove();
}
}
};

/**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */
var _removeAttribute=function _removeAttribute(name,node){
try{
arrayPush(DOMPurify.removed,{
attribute:node.getAttributeNode(name),
from:node});

}catch(_){
arrayPush(DOMPurify.removed,{
attribute:null,
from:node});

}

node.removeAttribute(name);

// We void attribute values for unremovable "is"" attributes
if(name==='is'&&!ALLOWED_ATTR[name]){
if(RETURN_DOM||RETURN_DOM_FRAGMENT){
try{
_forceRemove(node);
}catch(_){}
}else {
try{
node.setAttribute(name,'');
}catch(_){}
}
}
};

/**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */
var _initDocument=function _initDocument(dirty){
/* Create a HTML document */
var doc=void 0;
var leadingWhitespace=void 0;

if(FORCE_BODY){
dirty='<remove></remove>'+dirty;
}else {
/* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
var matches=stringMatch(dirty,/^[\r\n\t ]+/);
leadingWhitespace=matches&&matches[0];
}

var dirtyPayload=trustedTypesPolicy?trustedTypesPolicy.createHTML(dirty):dirty;
/*
       * Use the DOMParser API by default, fallback later if needs be
       * DOMParser not work for svg when has multiple root element.
       */
if(NAMESPACE===HTML_NAMESPACE){
try{
doc=new DOMParser().parseFromString(dirtyPayload,'text/html');
}catch(_){}
}

/* Use createHTMLDocument in case DOMParser is not available */
if(!doc||!doc.documentElement){
doc=implementation.createDocument(NAMESPACE,'template',null);
try{
doc.documentElement.innerHTML=IS_EMPTY_INPUT?'':dirtyPayload;
}catch(_){
// Syntax error if dirtyPayload is invalid xml
}
}

var body=doc.body||doc.documentElement;

if(dirty&&leadingWhitespace){
body.insertBefore(document.createTextNode(leadingWhitespace),body.childNodes[0]||null);
}

/* Work on whole document or just its body */
if(NAMESPACE===HTML_NAMESPACE){
return getElementsByTagName.call(doc,WHOLE_DOCUMENT?'html':'body')[0];
}

return WHOLE_DOCUMENT?doc.documentElement:body;
};

/**
     * _createIterator
     *
     * @param  {Document} root document/fragment to create iterator for
     * @return {Iterator} iterator instance
     */
var _createIterator=function _createIterator(root){
return createNodeIterator.call(root.ownerDocument||root,root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_COMMENT|NodeFilter.SHOW_TEXT,null,false);
};

/**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */
var _isClobbered=function _isClobbered(elm){
if(elm instanceof Text||elm instanceof Comment){
return false;
}

if(typeof elm.nodeName!=='string'||typeof elm.textContent!=='string'||typeof elm.removeChild!=='function'||!(elm.attributes instanceof NamedNodeMap)||typeof elm.removeAttribute!=='function'||typeof elm.setAttribute!=='function'||typeof elm.namespaceURI!=='string'||typeof elm.insertBefore!=='function'){
return true;
}

return false;
};

/**
     * _isNode
     *
     * @param  {Node} obj object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */
var _isNode=function _isNode(object){
return (typeof Node==='undefined'?'undefined':_typeof(Node))==='object'?object instanceof Node:object&&(typeof object==='undefined'?'undefined':_typeof(object))==='object'&&typeof object.nodeType==='number'&&typeof object.nodeName==='string';
};

/**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */
var _executeHook=function _executeHook(entryPoint,currentNode,data){
if(!hooks[entryPoint]){
return;
}

arrayForEach(hooks[entryPoint],function(hook){
hook.call(DOMPurify,currentNode,data,CONFIG);
});
};

/**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */
var _sanitizeElements=function _sanitizeElements(currentNode){
var content=void 0;

/* Execute a hook if present */
_executeHook('beforeSanitizeElements',currentNode,null);

/* Check if element is clobbered or can clobber */
if(_isClobbered(currentNode)){
_forceRemove(currentNode);
return true;
}

/* Check if tagname contains Unicode */
if(stringMatch(currentNode.nodeName,/[\u0080-\uFFFF]/)){
_forceRemove(currentNode);
return true;
}

/* Now let's check the element's type and name */
var tagName=stringToLowerCase(currentNode.nodeName);

/* Execute a hook if present */
_executeHook('uponSanitizeElement',currentNode,{
tagName:tagName,
allowedTags:ALLOWED_TAGS});


/* Detect mXSS attempts abusing namespace confusion */
if(!_isNode(currentNode.firstElementChild)&&(!_isNode(currentNode.content)||!_isNode(currentNode.content.firstElementChild))&&regExpTest(/<[/\w]/g,currentNode.innerHTML)&&regExpTest(/<[/\w]/g,currentNode.textContent)){
_forceRemove(currentNode);
return true;
}

/* Mitigate a problem with templates inside select */
if(tagName==='select'&&regExpTest(/<template/i,currentNode.innerHTML)){
_forceRemove(currentNode);
return true;
}

/* Remove element if anything forbids its presence */
if(!ALLOWED_TAGS[tagName]||FORBID_TAGS[tagName]){
/* Keep content except for bad-listed elements */
if(KEEP_CONTENT&&!FORBID_CONTENTS[tagName]){
var parentNode=getParentNode(currentNode)||currentNode.parentNode;
var childNodes=getChildNodes(currentNode)||currentNode.childNodes;

if(childNodes&&parentNode){
var childCount=childNodes.length;

for(var i=childCount-1;i>=0;--i){
parentNode.insertBefore(cloneNode(childNodes[i],true),getNextSibling(currentNode));
}
}
}

_forceRemove(currentNode);
return true;
}

/* Check whether element has a valid namespace */
if(currentNode instanceof Element&&!_checkValidNamespace(currentNode)){
_forceRemove(currentNode);
return true;
}

if((tagName==='noscript'||tagName==='noembed')&&regExpTest(/<\/no(script|embed)/i,currentNode.innerHTML)){
_forceRemove(currentNode);
return true;
}

/* Sanitize element content to be template-safe */
if(SAFE_FOR_TEMPLATES&&currentNode.nodeType===3){
/* Get the element's text content */
content=currentNode.textContent;
content=stringReplace(content,MUSTACHE_EXPR$$1,' ');
content=stringReplace(content,ERB_EXPR$$1,' ');
if(currentNode.textContent!==content){
arrayPush(DOMPurify.removed,{element:currentNode.cloneNode()});
currentNode.textContent=content;
}
}

/* Execute a hook if present */
_executeHook('afterSanitizeElements',currentNode,null);

return false;
};

/**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */
// eslint-disable-next-line complexity
var _isValidAttribute=function _isValidAttribute(lcTag,lcName,value){
/* Make sure attribute cannot clobber */
if(SANITIZE_DOM&&(lcName==='id'||lcName==='name')&&(value in document||value in formElement)){
return false;
}

/* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */
if(ALLOW_DATA_ATTR&&!FORBID_ATTR[lcName]&&regExpTest(DATA_ATTR$$1,lcName));else if(ALLOW_ARIA_ATTR&&regExpTest(ARIA_ATTR$$1,lcName));else if(!ALLOWED_ATTR[lcName]||FORBID_ATTR[lcName]){
return false;

/* Check value is safe. First, is attr inert? If so, is safe */
}else if(URI_SAFE_ATTRIBUTES[lcName]);else if(regExpTest(IS_ALLOWED_URI$$1,stringReplace(value,ATTR_WHITESPACE$$1,'')));else if((lcName==='src'||lcName==='xlink:href'||lcName==='href')&&lcTag!=='script'&&stringIndexOf(value,'data:')===0&&DATA_URI_TAGS[lcTag]);else if(ALLOW_UNKNOWN_PROTOCOLS&&!regExpTest(IS_SCRIPT_OR_DATA$$1,stringReplace(value,ATTR_WHITESPACE$$1,'')));else if(!value);else {
return false;
}

return true;
};

/**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */
var _sanitizeAttributes=function _sanitizeAttributes(currentNode){
var attr=void 0;
var value=void 0;
var lcName=void 0;
var l=void 0;
/* Execute a hook if present */
_executeHook('beforeSanitizeAttributes',currentNode,null);

var attributes=currentNode.attributes;

/* Check if we have attributes; if not we might have a text node */

if(!attributes){
return;
}

var hookEvent={
attrName:'',
attrValue:'',
keepAttr:true,
allowedAttributes:ALLOWED_ATTR};

l=attributes.length;

/* Go backwards over all attributes; safely remove bad ones */
while(l--){
attr=attributes[l];
var _attr=attr,
name=_attr.name,
namespaceURI=_attr.namespaceURI;

value=stringTrim(attr.value);
lcName=stringToLowerCase(name);

/* Execute a hook if present */
hookEvent.attrName=lcName;
hookEvent.attrValue=value;
hookEvent.keepAttr=true;
hookEvent.forceKeepAttr=undefined;// Allows developers to see this is a property they can set
_executeHook('uponSanitizeAttribute',currentNode,hookEvent);
value=hookEvent.attrValue;
/* Did the hooks approve of the attribute? */
if(hookEvent.forceKeepAttr){
continue;
}

/* Remove attribute */
_removeAttribute(name,currentNode);

/* Did the hooks approve of the attribute? */
if(!hookEvent.keepAttr){
continue;
}

/* Work around a security issue in jQuery 3.0 */
if(regExpTest(/\/>/i,value)){
_removeAttribute(name,currentNode);
continue;
}

/* Sanitize attribute content to be template-safe */
if(SAFE_FOR_TEMPLATES){
value=stringReplace(value,MUSTACHE_EXPR$$1,' ');
value=stringReplace(value,ERB_EXPR$$1,' ');
}

/* Is `value` valid for this attribute? */
var lcTag=currentNode.nodeName.toLowerCase();
if(!_isValidAttribute(lcTag,lcName,value)){
continue;
}

/* Handle invalid data-* attribute set by try-catching it */
try{
if(namespaceURI){
currentNode.setAttributeNS(namespaceURI,name,value);
}else {
/* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
currentNode.setAttribute(name,value);
}

arrayPop(DOMPurify.removed);
}catch(_){}
}

/* Execute a hook if present */
_executeHook('afterSanitizeAttributes',currentNode,null);
};

/**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */
var _sanitizeShadowDOM=function _sanitizeShadowDOM(fragment){
var shadowNode=void 0;
var shadowIterator=_createIterator(fragment);

/* Execute a hook if present */
_executeHook('beforeSanitizeShadowDOM',fragment,null);

while(shadowNode=shadowIterator.nextNode()){
/* Execute a hook if present */
_executeHook('uponSanitizeShadowNode',shadowNode,null);

/* Sanitize tags and elements */
if(_sanitizeElements(shadowNode)){
continue;
}

/* Deep shadow DOM detected */
if(shadowNode.content instanceof DocumentFragment){
_sanitizeShadowDOM(shadowNode.content);
}

/* Check attributes, sanitize if necessary */
_sanitizeAttributes(shadowNode);
}

/* Execute a hook if present */
_executeHook('afterSanitizeShadowDOM',fragment,null);
};

/**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
// eslint-disable-next-line complexity
DOMPurify.sanitize=function(dirty,cfg){
var body=void 0;
var importedNode=void 0;
var currentNode=void 0;
var oldNode=void 0;
var returnNode=void 0;
/* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */
IS_EMPTY_INPUT=!dirty;
if(IS_EMPTY_INPUT){
dirty='<!-->';
}

/* Stringify, in case dirty is an object */
if(typeof dirty!=='string'&&!_isNode(dirty)){
// eslint-disable-next-line no-negated-condition
if(typeof dirty.toString!=='function'){
throw typeErrorCreate('toString is not a function');
}else {
dirty=dirty.toString();
if(typeof dirty!=='string'){
throw typeErrorCreate('dirty is not a string, aborting');
}
}
}

/* Check we can run. Otherwise fall back or ignore */
if(!DOMPurify.isSupported){
if(_typeof(window.toStaticHTML)==='object'||typeof window.toStaticHTML==='function'){
if(typeof dirty==='string'){
return window.toStaticHTML(dirty);
}

if(_isNode(dirty)){
return window.toStaticHTML(dirty.outerHTML);
}
}

return dirty;
}

/* Assign config vars */
if(!SET_CONFIG){
_parseConfig(cfg);
}

/* Clean up removed elements */
DOMPurify.removed=[];

/* Check if dirty is correctly typed for IN_PLACE */
if(typeof dirty==='string'){
IN_PLACE=false;
}

if(IN_PLACE);else if(dirty instanceof Node){
/* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
body=_initDocument('<!---->');
importedNode=body.ownerDocument.importNode(dirty,true);
if(importedNode.nodeType===1&&importedNode.nodeName==='BODY'){
/* Node is already a body, use as is */
body=importedNode;
}else if(importedNode.nodeName==='HTML'){
body=importedNode;
}else {
// eslint-disable-next-line unicorn/prefer-dom-node-append
body.appendChild(importedNode);
}
}else {
/* Exit directly if we have nothing to do */
if(!RETURN_DOM&&!SAFE_FOR_TEMPLATES&&!WHOLE_DOCUMENT&&
// eslint-disable-next-line unicorn/prefer-includes
dirty.indexOf('<')===-1){
return trustedTypesPolicy&&RETURN_TRUSTED_TYPE?trustedTypesPolicy.createHTML(dirty):dirty;
}

/* Initialize the document to work on */
body=_initDocument(dirty);

/* Check we have a DOM node from the data */
if(!body){
return RETURN_DOM?null:emptyHTML;
}
}

/* Remove first element node (ours) if FORCE_BODY is set */
if(body&&FORCE_BODY){
_forceRemove(body.firstChild);
}

/* Get node iterator */
var nodeIterator=_createIterator(IN_PLACE?dirty:body);

/* Now start iterating over the created document */
while(currentNode=nodeIterator.nextNode()){
/* Fix IE's strange behavior with manipulated textNodes #89 */
if(currentNode.nodeType===3&&currentNode===oldNode){
continue;
}

/* Sanitize tags and elements */
if(_sanitizeElements(currentNode)){
continue;
}

/* Shadow DOM detected, sanitize it */
if(currentNode.content instanceof DocumentFragment){
_sanitizeShadowDOM(currentNode.content);
}

/* Check attributes, sanitize if necessary */
_sanitizeAttributes(currentNode);

oldNode=currentNode;
}

oldNode=null;

/* If we sanitized `dirty` in-place, return it. */
if(IN_PLACE){
return dirty;
}

/* Return sanitized string or DOM */
if(RETURN_DOM){
if(RETURN_DOM_FRAGMENT){
returnNode=createDocumentFragment.call(body.ownerDocument);

while(body.firstChild){
// eslint-disable-next-line unicorn/prefer-dom-node-append
returnNode.appendChild(body.firstChild);
}
}else {
returnNode=body;
}

if(RETURN_DOM_IMPORT){
/*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */
returnNode=importNode.call(originalDocument,returnNode,true);
}

return returnNode;
}

var serializedHTML=WHOLE_DOCUMENT?body.outerHTML:body.innerHTML;

/* Sanitize final string template-safe */
if(SAFE_FOR_TEMPLATES){
serializedHTML=stringReplace(serializedHTML,MUSTACHE_EXPR$$1,' ');
serializedHTML=stringReplace(serializedHTML,ERB_EXPR$$1,' ');
}

return trustedTypesPolicy&&RETURN_TRUSTED_TYPE?trustedTypesPolicy.createHTML(serializedHTML):serializedHTML;
};

/**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */
DOMPurify.setConfig=function(cfg){
_parseConfig(cfg);
SET_CONFIG=true;
};

/**
     * Public method to remove the configuration
     * clearConfig
     *
     */
DOMPurify.clearConfig=function(){
CONFIG=null;
SET_CONFIG=false;
};

/**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {string} tag Tag name of containing element.
     * @param  {string} attr Attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */
DOMPurify.isValidAttribute=function(tag,attr,value){
/* Initialize shared config vars if necessary. */
if(!CONFIG){
_parseConfig({});
}

var lcTag=stringToLowerCase(tag);
var lcName=stringToLowerCase(attr);
return _isValidAttribute(lcTag,lcName,value);
};

/**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */
DOMPurify.addHook=function(entryPoint,hookFunction){
if(typeof hookFunction!=='function'){
return;
}

hooks[entryPoint]=hooks[entryPoint]||[];
arrayPush(hooks[entryPoint],hookFunction);
};

/**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     */
DOMPurify.removeHook=function(entryPoint){
if(hooks[entryPoint]){
arrayPop(hooks[entryPoint]);
}
};

/**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */
DOMPurify.removeHooks=function(entryPoint){
if(hooks[entryPoint]){
hooks[entryPoint]=[];
}
};

/**
     * RemoveAllHooks
     * Public method to remove all DOMPurify hooks
     *
     */
DOMPurify.removeAllHooks=function(){
hooks={};
};

return DOMPurify;
}

var purify=createDOMPurify();

return purify;

});



/***/}}]);

}());
