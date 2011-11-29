/**
 * @fileOverview YAJSL Auxilaries
 * @version 1.2.2
 * @author yeremeiev@gmail.com
 * 
 * @requires YAJSL
 */

/* ------------------------------------------------------------ Get elements */
/**
 * @return {Element} HEAD
 */
YAJSL.getHead = function() {
	return YAJSL.$$({tagName: 'head'})[0];
};

/**
 * @return {Element} BODY
 */
YAJSL.getBody = function() {
	return YAJSL.$$({tagName: 'body'})[0];
};

/**
 * @param {Element | String} element
 * @return {Element} next sibling
 */
YAJSL.getNextSibling = function(element) {
	var next = YAJSL.$(element).nextSibling;
	
	while (next && next.nodeType !== 1) {
		next = next.nextSibling;
	}
	
	return next;
};

/**
 * @param {Element | String} element
 * @return {Element} previous sibling
 */
YAJSL.getPrevSibling = function(element) {
	var prev = YAJSL.$(element).previousSibling;
	
	while (prev && prev.nodeType !== 1) {
		prev = prev.previousSibling;
	}
	
	return prev;
};

/**
 * @param {Element | String} element
 * @return {Array.<Element>}
 */
YAJSL.getChildren = function(element) {
	var parent = YAJSL.$(element),
		childNodes = parent.childNodes,
		children = [];
	
	for (var i = 0, length = childNodes.length, child; i < length, child = childNodes[i]; i++) {
		if (child.nodeType === 1) {
			children.push(child[i]);
		}
	}
	
	return children;
};

/* ----------------------------------------------------- Add/Remove Elements */
/**
 * @param {String} src
 * @param {String} [id]
 * @return {Element} script
 */
YAJSL.addScript = function(src, id) {
	var script = document.createElement('script');
	
	script.type = 'text/javascript';
	script.src = src;

	if (id) {
		script.id = id;
	}

	YAJSL.getHead().appendChild(script);
	
	return script;
};

/**
 * @param {Element | String} script
 */
YAJSL.removeScript = function(script) {
	YAJSL.removeElement(script);
};

/**
 * @param {String} href
 * @param {String} [id]
 * @return {Element} stylesheet
 */
YAJSL.addStylesheet = function(href, id) {
	var stylesheet = document.createElement('link');
	
	stylesheet.type = 'text/css';
	stylesheet.rel = 'stylesheet';
	stylesheet.href = href;

	if (id) {
		stylesheet.id = id;
	}

	YAJSL.getHead().appendChild(stylesheet);
	
	return stylesheet;
};

/**
 * @param {Element | String} stylesheet
 */
YAJSL.removeStylesheet = function(stylesheet) {
	YAJSL.removeElement(stylesheet);
};

/* --------------------------------------------------------------- Measuring */
/**
 * @param {Element | String} element
 * @return {Object} {top, left}
 */
YAJSL.getPosition = function(element) {
	element = YAJSL.$(element);
	
	var leftPosition = 0,
		topPosition = 0;
	
	while (element.offsetParent) {
		leftPosition += element.offsetLeft;
		topPosition += element.offsetTop;
		element = element.offsetParent;
	}
	
	return {
		top: topPosition,
		left: leftPosition
	};
};

/**
 * @param {Element | String} element
 * @return {Object} {width, height}
 */
YAJSL.getSize = function(element) {
	element = YAJSL.$(element);

	var width = element.offsetWidth,
		height = element.offsetHeight;

	return {
		width: width,
		height: height
	};
};