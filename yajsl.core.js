/**
 * @fileOverview YAJSL Core
 * @version 1.2.2
 * @author yeremeiev@gmail.com
 */

/* ---------------------------------------------------------------- Elements */
var YAJSL = {
	/**
	 * Get element by id or by element
	 * @param {String | Element} id
	 * @return {Element}
	 */
	$: function(id) {
		return (typeof id === 'string') ? document.getElementById(id) : id;
	},

	/**
	 * Get elemets by tag and class
	 * @param {Object} tagProps
	 * @param {Element | String} [parent]
	 * @return {Array.<Element>}
	 */
	$$: function(tagProps, parent) {
		var tag = tagProps.tagName ? tagProps.tagName.toUpperCase() : '*',
			parentNode = parent ? YAJSL.$(parent) : document,
			children = parentNode.getElementsByTagName(tag),
			elements = [],
			classNameRE;

		if (!tagProps.className) {
			elements = children;
		} else {
			classNameRE = new RegExp('\\b' + tagProps.className + '\\b', 'g');

			for (var i = 0, length = children.length, child; i < length, child = children[i]; i++) {
				if (child.className.match(classNameRE)) {
					elements.push(child);
				}
			}
		}

		return elements;
	}
};

/* ----------------------------------------------------- Constants and Enums */
YAJSL.Events = {
	/** @constant {String} */
	READY: 'ready',
	/** @constant {String} */
	LOAD: 'load',
	/** @constant {String} */
	CLICK: 'click'
};

YAJSL.Time = {
	/** @constant {Number} */
	SECOND: 1000,
	/** @constant {Number} */
	MINUTE: 60 * 1000,
	/** @constant {Number} */
	HOUR: 60 * 60 * 1000,
	/** @constant {Number} */
	DAY: 24 * 60 * 60 * 1000
};

/* ---------------------------------------------------------------- Elements */
/**
 * @param {String} tagName
 * @param {Object} elementProps
 * @param {Element | String} [parent]
 * @return {Element}
 */
YAJSL.addElement = function(tagName, elementProps, parent) {
	var element = document.createElement(tagName.toUpperCase()),
		parentNode = parent ? YAJSL.$(parent) : YAJSL.$$({tagName: 'body'})[0];

	if (elementProps.id) {
		element.id = elementProps.id;
	}

	if (elementProps.className) {
		element.className = elementProps.className;
	}

	if (elementProps.styles) {
		if (typeof elementProps.styles === 'object') {
			for (var style in elementProps.styles) {
				YAJSL.setStyle(element, style, elementProps.styles[style]);
			}
		}
	}

	parentNode.appendChild(element);

	return element;
};

/**
 * @param {Element | String} element
 * @return {Element}
 */
YAJSL.removeElement = function(element) {
	element = YAJSL.$(element);

	element.parentNode.removeChild(element);

	return element;
};

/* -------------------------------------------------------------- ClassNames */
/**
 * @param {Element | String} element
 * @param {String} className
 */
YAJSL.addClass = function(element, className) {
	element = YAJSL.$(element);

	var classNameRE = new RegExp('\\b' + className + '\\b', 'g'),
		spacing = (element.className !== '') ? ' ' : '';

	if (!element.className.match(classNameRE)) {
		element.className += spacing + className;
	}
};

/**
 * @param {Element | String} element
 * @param {String} className
 */
YAJSL.removeClass = function(element, className) {
	element = YAJSL.$(element);

	var classNameRE = new RegExp('\\b'+ className +'\\b','g');

	if (element.className.match(classNameRE)) {
		element.className = element.className.replace(className, '');
	}
};

/**
 * @param {Element | String} element
 */
YAJSL.clearClass = function(element) {
	element = YAJSL.$(element);

	element.className = '';
};

/* ------------------------------------------------------------------ Styles */
/**
 * @param {Element | String} element
 * @param {String} styleProperty - both JS ('backgroundColor') and CSS ('background-color') syntax supported
 * @param {String} styleValue
 */
YAJSL.setStyle = function (element, styleProperty, styleValue) {
	element = YAJSL.$(element);

	var stylePropertySplit,
		stylePropertyFirstLetter;

	if (styleProperty === 'float') {
		styleProperty = 'cssFloat';
	}

	if (styleProperty.match(/-/g)) {
		stylePropertySplit = styleProperty.split('-');
		styleProperty = stylePropertySplit[0];

		for (var i = 1, length = stylePropertySplit.length, part; i < length, part = stylePropertySplit[i]; i++) {
			stylePropertyFirstLetter = part.substring(0, 1);
			styleProperty += stylePropertyFirstLetter.toUpperCase() + part.substring(1);
		}
	}

	element.style[styleProperty] = styleValue;
};

/* ------------------------------------------------------------------ Events */
/**
 * Cross-browser add event listener (including DOM ready)
 * @param {Element | String} element
 * @param {String} event @see YAJSL.Events
 * @param {Function} callbackFunc
 */
YAJSL.addEvent = function(element, event, callbackFunc) {
	if (element === document && event === YAJSL.Events.READY) {
		YAJSL.domReadyHandler(callbackFunc);
	} else {
		element = YAJSL.$(element);

		if (element.addEventListener) {
			element.addEventListener(event, callbackFunc, false);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, callbackFunc);
		} else {
			element['on' + event] = callbackFunc;
		}
	}
};

/**
 * Cross-browser remove event listener
 * @param {Element | String} element
 * @param {String} event @see YAJSL.Events
 * @param {Function} callbackFunc
 */
YAJSL.removeEvent = function(element, event, callbackFunc) {
	element = YAJSL.$(element);

	if (element.addEventListener) {
		element.removeEventListener(event, callbackFunc, false);
	} else if (element.detachEvent) {
		element.detachEvent('on' + event, callbackFunc);
	} else {
		element['on' + event] = null;
	}
};

/**
 * Cross-browser DOM ready
 * @param {Function} callbackFunc
 */
YAJSL.domReadyHandler = function(callbackFunc) {
	var isDomReady = false,
		win = window,
		doc = document,
		domReadyTimeout = win.setTimeout(function() {
			if (isDomReady) {
				win.clearTimeout(domReadyTimeout);
				callbackFunc();
			}
		}, 50),
		doScrollTimeout;

	if (doc.addEventListener) {
		win.clearTimeout(domReadyTimeout);
		doc.addEventListener('DOMContentLoaded', callbackFunc, false);
	} else if (doc.documentElement.doScroll || doc.attachEvent) {
		doScrollTimeout = win.setTimeout(function() {
			try {
				doc.documentElement.doScroll('left');
			} catch (e) {}
			win.clearTimeout(doScrollTimeout);
			isDomReady = true;
		}, 0);

		doc.attachEvent('onreadystatechange', function() {
			if (doc.readyState === 'complete') {
				doc.detachEvent('onreadystatechange', arguments.callee);
				isDomReady = true;
			}
		});
	} else {
		win.clearTimeout(domReadyTimeout);
		YAJSL.addEvent(win, YAJSL.Events.LOAD, callbackFunc);
	}
};

/* ----------------------------------------------------------------- Cookies */
/**
 * @param {String} name
 * @param {String} value
 * @param {Number} days
 */
YAJSL.createCookie = function(name, value, days) {
	var cookie = name + '=' + value,
		date,
		expire;

	if (days) {
		date = new Date();
		date.setTime(date.getTime() + (days * YAJSL.Time.DAY));
		expire = '; expires=' + date.toGMTString();
	} else {
		expire = '';
	}

	document.cookie = cookie + expire + '; path=/';
};

/**
 * @param {String} name
 * @return {String} cookie value
 */
YAJSL.readCookie = function(name) {
	var nameEq = name + '=',
		cookieArray = document.cookie.split(';'),
		result = null;

	for (var i = 0, length = cookieArray.length, cookie; i < length, cookie = cookieArray[i]; i++) {
		while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1, cookie.length);
		}
		if (cookie.indexOf(nameEq) === 0) {
			result = cookie.substring(nameEq.length, cookie.length);
		}
	}

	return result;
};

/**
 * @param {String} name
 */
YAJSL.removeCookie = function(name) {
	YAJSL.createCookie(name, '', -1);
};

/* --------------------------------------------------------------------- XHR */
/**
 * @param {String} url
 * @param {Function} callbackFunc
 * @param {String} data
 */
YAJSL.sendRequest = function(url, callbackFunc, data) {
	var request = YAJSL.getXhr(),
		method = (data) ? 'POST' : 'GET';

	request.open(method, url, true);
	request.setRequestHeader('User-Agent', 'XMLHTTP/1.0');

	if (data) {
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	}

	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200 || request.status === 304) {
				callbackFunc(request);
			}
		}
	};

	request.send(data);
};

/**
 * Cross-browser XMLHttpRequest
 * @return {Object} XMLHttpRequest
 */
YAJSL.getXhr = function() {
	var xhr = null,
		win = window,
		activeXs = ['Msxml3.XMLHTTP', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];

	if (win.XMLHttpRequest) {
		try {
			xhr = new XMLHttpRequest();
		} catch (e) {}
	} else if (win.ActiveXObject) {
		for (var i = 0, length = activeXs.length; i < length; i += 1) {
			try {
				xhr = new ActiveXObject(activeXs[i]);
			} catch (e) {}
		}
	}

	return xhr;
};