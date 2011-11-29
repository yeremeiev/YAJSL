/**
 * @fileOverview YAJSL Fx
 * @version 1.1.3
 * @author yeremeiev@gmail.com
 * 
 * @requires YAJSL
 */

YAJSL.Fx = {};

/* --------------------------------------------------------------- Show/hide */
/**
 * @param {Element | String} element
 * @param {String} [displayStyle]
 */
YAJSL.Fx.show = function(element, displayStyle) {
	displayStyle = displayStyle || 'block';
	YAJSL.setStyle(element, 'display', displayStyle);
};

/**
 * @param {Element | String} element
 */
YAJSL.Fx.hide = function(element) {
	YAJSL.setStyle(element, 'display', 'none');
};

/* ------------------------------------------------------------- Fade out/in */
/**
 * @param {Element | String} element
 * @param {Number} duration
 */
YAJSL.Fx.fadeOut = function(element, duration) {
	duration = duration || YAJSL.Time.SECOND;
	
	var step = duration / 10,	
		opacityLevel = 9,
		win = window,
		interval = win.setInterval(function() {
			if (opacityLevel === -1) {
				win.clearInterval(interval);
			} else {
				YAJSL.setStyle(element, 'opacity', (opacityLevel / 10));
				YAJSL.setStyle(element, 'filter', 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (opacityLevel * 10) + ')');
				opacityLevel--;
			}
		}, step);
};

/**
 * @param {Element | String} element
 * @param {Number} duration
 */
YAJSL.Fx.fadeIn = function (element, duration) {
	duration = duration || YAJSL.Time.SECOND;
	
	var step = duration / 10,
		opacityLevel = 1,
		win = window,
		interval = win.setInterval(function() {
			if (opacityLevel === 11) {
				win.clearInterval(interval);
			} else {
				YAJSL.setStyle(element, 'opacity', (opacityLevel / 10));
				YAJSL.setStyle(element, 'filter', 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (opacityLevel * 10) + ')');
				opacityLevel++;
			}
		}, step);
};

/* --------------------------------------------------- Slideshow */
YAJSL.Fx.Slideshow = (function() {
	var showDuration = 3 * YAJSL.Time.SECOND,
		pauseDuration = YAJSL.Time.SECOND / 10,
		fadeInDuration = YAJSL.Time.SECOND,
		fadeOutDuration = YAJSL.Time.SECOND,
		container,
		slides,
		type,
		types = {
			RANDOM: 1,
			SEQUENT: 2
		},
		win = window,
		counter = -1;


	/**
	 * @param {Element | String} element
	 * @param {Array.<String>} slideStrings
	 * @param {Object} durations
	 * @param {Number} slideshowType
	 */
	function initialize(element, slideStrings, durations, slideshowType) {
		container = YAJSL.$(element);
		slides = slideStrings;
		showDuration = durations.show || showDuration;
		pauseDuration = durations.pause || pauseDuration;
		fadeInDuration = durations.fadeIn || fadeInDuration;
		fadeOutDuration = durations.fadeOut || fadeOutDuration;
		type = slideshowType || types.RANDOM;
	}

	/**
	 * @param {Element | String} element
	 * @param {Array.<String>} slideStrings
	 * @param {Object} durations
	 * @param {Number} slideshowType
	 */
	function start(element, slideStrings, durations, slideshowType) {
		if (!container) {
			initialize(element, slideStrings, durations, slideshowType);
		}

		showSlide();
	}

	function stop() {

	}

	function showSlide() {
		fadeOut();

		win.setTimeout(function() {
			counter = (counter === slides.length - 1) ? 0 : (counter + 1);
			showContent();

			win.setTimeout(function() {
				fadeIn();

				win.setTimeout(showSlide, (fadeInDuration + showDuration));
			}, pauseDuration);
		}, fadeOutDuration);
	}

	function showContent() {
		var randomSlide;

		switch (type) {
			case types.RANDOM:
				randomSlide = slides[Math.floor(Math.random() * slides.length)];

				if (randomSlide !== this.where.innerHTML) {
					container.innerHTML = randomSlide;
				} else {
					showContent();
				}
			break;

			default:
				container.innerHTML = slides[counter];
		}
	}

	function fadeOut() {
		YAJSL.Fx.fadeOut(container, fadeOutDuration);
	}

	function fadeIn() {
		YAJSL.Fx.fadeIn(container, fadeInDuration);
	}

	return {
		stop: stop,
		start: start,
		type: types
	};
})();