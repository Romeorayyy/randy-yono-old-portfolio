(function ($) {
	"use strict";


	/* global variables */
	var portfolioKeyword = "";
	var porftolioSingleActive = false;
	var porftolioSingleJustClosed = false;
	var soundEffects = false;
	var wind, windReverse, tick;



	/* DOCUMENT LOAD */
	$(function () {







		// ------------------------------

		// ------------------------------















		// ------------------------------
		// BACK TO TOP
		$("a[href='#card']").on("click", function () {
			$("html, body").animate({ scrollTop: 0 }, 800, "easeInOutExpo");
			return false;
		});
		// ------------------------------



		// ------------------------------
		// DETECT TOUCH DEVICE
		var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
		if (isTouch) {
			$('html').addClass('touch');
		} else {
			$('html').addClass('no-touch');
		}
		// ------------------------------



		// ------------------------------
		// Remove no-js class
		$('html').removeClass('no-js');
		// Remove no-js class
		$('html').addClass('ready');
		// ------------------------------



		// ------------------------------
		// SETUP
		setup();
		// ------------------------------




	});
	// DOCUMENT READY




	// WINDOW ONLOAD
	$(window).on("load", function () {

		hideLoader();
		$('html').addClass('loaded');

	});
	// WINDOW ONLOAD





	// ------------------------------
	// ------------------------------
	// FUNCTIONS
	// ------------------------------
	// ------------------------------






	// ------------------------------
	// SETUP : plugins
	function setup() {

		// MASONRY
		setupMasonry();

		// LIGHTBOX
		setupLightbox();

		// FILL SKILL BARS
		fillBars();

		// PORTFOLIO SINGLE AJAX
		setupAjax();






		// TABS
		tabs();

		// TOGGLES
		toggles();

		// FLUID MEDIA
		fluidMedia();

	}
	// ------------------------------



	// ------------------------------
	// MOBILE CHECK
	function isMobile() {
		return ($(window).width() < 992);
	}
	// ------------------------------




	// ------------------------------
	// PORTFOLIO SINGLE AJAX
	function setupAjax() {

		// PORTFOLIO DETAILS
		// Show details
		$(".one-page-layout .media-box .ajax, .one-page-layout .portfolio-nav .ajax a").on('click', function (event) {

			event.preventDefault();

			var url = $(this).attr('href');
			var baseUrl = $.address.baseURL();
			var detailUrl = giveDetailUrl();

			if (url.indexOf(baseUrl) !== -1) { // full url
				var total = url.length;
				detailUrl = url.slice(baseUrl.length + 1, total);
				$.address.path('/' + detailUrl);
			} else { // relative url
				detailUrl = url;
				$.address.path(portfolioKeyword + '/' + detailUrl);
			}

		});

	}
	// ------------------------------




	// ------------------------------
	// MASONRY - ISOTOPE
	function setupMasonry() {

		var masonry = $('.masonry, .gallery');
		if (masonry.length) {
			masonry.each(function (index, el) {

				// call isotope
				refreshMasonry();
				$(el).imagesLoaded(function () {
					$(el).isotope({
						layoutMode: $(el).data('layout') ? $(el).data('layout') : 'masonry'
					});
					// set columns
					refreshMasonry();
				});

				// filters
				if (!$(el).data('isotope')) {
					var filters = $(el).siblings('.filters');
					if (filters.length) {
						filters.find('a').on("click", function () {
							var selector = $(this).attr('data-filter');
							$(el).isotope({ filter: selector });
							$(this).parent().addClass('current').siblings().removeClass('current');
							return false;
						});
					}
				}

			}); //each
			$(window).on('resize debouncedresize', function () {
				setTimeout(function () { refreshMasonry(); }, 100);
			});
		}
	}
	// ------------------------------

	// ------------------------------
	// REFRSH MASONRY - ISOTOPE
	function refreshMasonry() {

		var masonry = $('.masonry');
		if (masonry.length) {
			masonry.each(function (index, el) {

				// check if isotope initialized
				if ($(el).data('isotope')) {

					var itemW = $(el).data('item-width');
					var containerW = $(el).width();
					var items = $(el).children('.hentry');
					var columns = Math.round(containerW / itemW);

					// set the widths (%) for each of item
					items.each(function (index, element) {
						var multiplier = $(this).hasClass('x2') && columns > 1 ? 2 : 1;
						var itemRealWidth = (Math.floor(containerW / columns) * 100 / containerW) * multiplier;
						$(this).css('width', itemRealWidth + '%');
					});

					var columnWidth = Math.floor(containerW / columns);

					$(el).isotope('option', { masonry: { columnWidth: columnWidth } });
					$(el).isotope('layout');
				}

			}); //each
		}

	}
	// ------------------------------



	// ------------------------------
	// LIGHTBOX - applied to porfolio and gallery post format
	function setupLightbox() {

		if ($(".lightbox, .gallery").length) {

			$('.media-box, .gallery').each(function (index, element) {
				var $media_box = $(this);
				$media_box.magnificPopup({
					delegate: '.lightbox, .gallery-item a[href$=".jpg"], .gallery-item a[href$=".jpeg"], .gallery-item a[href$=".png"], .gallery-item a[href$=".gif"]',
					type: 'image',
					image: {
						markup: '<div class="mfp-figure">' +
							'<div class="mfp-close"></div>' +
							'<div class="mfp-img"></div>' +
							'</div>' +
							'<div class="mfp-bottom-bar">' +
							'<div class="mfp-title"></div>' +
							'<div class="mfp-counter"></div>' +
							'</div>', // Popup HTML markup. `.mfp-img` div will be replaced with img tag, `.mfp-close` by close button

						cursor: 'mfp-zoom-out-cur', // Class that adds zoom cursor, will be added to body. Set to null to disable zoom out cursor.
						verticalFit: true, // Fits image in area vertically
						tError: '<a href="%url%">The image</a> could not be loaded.' // Error message
					},
					gallery: {
						enabled: true,
						tCounter: '<span class="mfp-counter">%curr% / %total%</span>' // markup of counter
					},
					iframe: {
						markup: '<div class="mfp-iframe-scaler">' +
							'<div class="mfp-close"></div>' +
							'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
							'<div class="mfp-title">Some caption</div>' +
							'</div>'
					},
					mainClass: 'mfp-zoom-in',
					tLoading: '',
					removalDelay: 300, //delay removal by X to allow out-animation
					callbacks: {
						markupParse: function (template, values, item) {
							var title = "";
							if (item.el.parents('.gallery-item').length) {
								title = item.el.parents('.gallery-item').find('.gallery-caption').text();
							} else {
								title = item.el.data('title') == undefined ? "" : item.el.data('title');
							}
							//return title;
							values.title = title;

						},
						imageLoadComplete: function () {
							var self = this;
							setTimeout(function () {
								self.wrap.addClass('mfp-image-loaded');
							}, 16);
						},
						close: function () {
							this.wrap.removeClass('mfp-image-loaded');
						},
						beforeAppend: function () {

							var self = this;

							// square aspect ratio for soundcloud embeds
							if (this.content.find('iframe[src*="soundcloud.com"]').length) {
								self.wrap.addClass('is-soundcloud');
							} else {
								self.wrap.removeClass('is-soundcloud');
							}

							this.content.find('iframe').on('load', function () {
								setTimeout(function () {
									self.wrap.addClass('mfp-image-loaded');
								}, 16);
							});

						}
					},
					closeBtnInside: false,
					closeOnContentClick: true,
					midClick: true
				});
			});
		}

	}
	// ------------------------------


	// ------------------------------
	// FILL PROGRESS BARS
	function fillBars() {

		var bar = $('.bar');
		if (bar.length) {
			$('.bar').each(function () {
				var bar = $(this);
				var percent = bar.attr('data-percent');
				bar.find('.progress').css('width', percent + '%').html('<span>' + percent + '</span>');
			});
		}

	}
	// ------------------------------


	// ------------------------------
	// TABS
	function tabs() {

		var tabs = $('.tabs');
		if (tabs.length) {

			$('.tabs').each(function () {
				if (!$(this).find('.tab-titles li a.active').length) {
					$(this).find('.tab-titles li:first-child a').addClass('active');
					$(this).find('.tab-content > div:first-child').show();
				} else {
					$(this).find('.tab-content > div').eq($(this).find('.tab-titles li a.active').parent().index()).show();
				}
			});

			$('.tabs .tab-titles li a').on("click", function () {
				if ($(this).hasClass('active')) { return; }
				$(this).parent().siblings().find('a').removeClass('active');
				$(this).addClass('active');
				$(this).parents('.tabs').find('.tab-content > div').hide().eq($(this).parent().index()).show();
				return false;
			});

		}

	}
	// ------------------------------


	// ------------------------------
	// TOGGLES
	function toggles() {

		if ($('.toggle').length) {

			var toggleSpeed = 300;
			$('.toggle h4.active + .toggle-content').show();

			$('.toggle h4').on("click", function () {
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
					$(this).next('.toggle-content').stop(true, true).slideUp(toggleSpeed);
				} else {

					$(this).addClass('active');
					$(this).next('.toggle-content').stop(true, true).slideDown(toggleSpeed);

					//accordion
					if ($(this).parents('.toggle-group').hasClass('accordion')) {
						$(this).parent().siblings().find('h4').removeClass('active');
						$(this).parent().siblings().find('.toggle-content').stop(true, true).slideUp(toggleSpeed);
					}

				}
				return false;
			});

		}

	}
	// ------------------------------


	// ------------------------------
	// FLUID MEDIA
	function fluidMedia() {

		if ($('iframe,video').length) {
			$("html").fitVids();
		}

	}
	// ------------------------------


	// ------------------------------


	// ------------------------------







	// ------------------------------
	// AJAX PORTFOLIO DETAILS
	var pActive;

	function showProjectDetails(url) {


		porftolioSingleJustClosed = true;
		porftolioSingleActive = true;

		showLoader();

		var p = $('.p-overlay:not(.active)').first();
		pActive = $('.p-overlay.active');

		// ajax : fill data
		p.empty().load(url + ' .portfolio-single', function () {

			NProgress.set(0.5);

			// wait for images to be loaded
			p.imagesLoaded(function () {

				hideLoader();

				if (pActive.length) {
					hideProjectDetails();
				}

				$('html').addClass('p-overlay-on');
				//$("body").scrollTop(0);

				// setup plugins
				setup();

				$('html').addClass('p-animating');

				// Play Sound Effect
				if (soundEffects) {
					tick.play();
				}

				p.removeClass('animate-in animate-out').addClass('animate-in').show();
				p.addClass('active');



				p.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
					function (e) {
						$('html').removeClass('p-animating');
					});



			});
		});
	}

	function hideProjectDetails(forever, safeClose) {

		porftolioSingleJustClosed = true;

		// Play Sound Effect
		if (soundEffects) {
			tick.play();
		}

		$('html').addClass('p-animating');

		// close completely by back link.
		if (forever) {
			pActive = $('.p-overlay.active');

			$('html').removeClass('p-overlay-on');

			if (!safeClose) {
				// remove detail url
				$.address.path(portfolioKeyword);
			}
		}

		pActive.removeClass('active animate-in animate-out').addClass('animate-out').show();


		pActive.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
			function (e) {
				$('html').removeClass('p-animating');
				pActive.hide().removeClass('animate-out').empty();
			});

		setTimeout(function () { pActive.hide().removeClass('animate-out').empty(); }, 550);

	}

	function giveDetailUrl() {

		var address = $.address.value();
		var detailUrl;

		if (address.indexOf("/" + portfolioKeyword + "/") != -1 && address.length > portfolioKeyword.length + 2) {
			var total = address.length;
			detailUrl = address.slice(portfolioKeyword.length + 2, total);
		} else {
			detailUrl = -1;
		}
		return detailUrl;
	}
	// ------------------------------



	// ------------------------------
	// AJAX LOADER
	function showLoader() {
		NProgress.start();
	}
	function hideLoader() {
		NProgress.done();
	}
	// ------------------------------


















})(jQuery);