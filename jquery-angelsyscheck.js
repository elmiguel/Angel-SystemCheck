/**
 * "".format() function
 * This is a nice little function.ext I found.
 * It enables you to string formats like in other programming languages
 *
 *      example:
 *          "Hello {0}, how are you{1}".format("there", "?");
 *
 *      output:
 *          Hello there, how are you?
 */

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {return typeof args[number] != 'undefined' ? args[number] : match;});
  };
}


(function($){
	var defaults = {
		name: "System Check",
		version: 2
	};

    var settings = {
					codeName: "unknown",
					appName: "unknown",
					appVersion: "unknown",
					browser: "unknown",
					browserSafeName: "unknown",
					browserVersion:"unknown",
					platform: "unknown",
					userAgent: "unknown",
					product: "unknown",
					os: "unknown",
					cookies: "unknown",
					popups: "x",
					ajax: "x",
					java: {"status":"x", "plugin": "unknown"},
					javascript: "ok",                              //Handled by noscript tags, if your here, then your good.
					flash: {"status":"x", "plugin": "unknown"},
					wmp: {"status":"x", "plugin": "unknown"},
					quicktime: {"status":"x", "plugin": "unknown"},
					acrobat: {"status":"x", "plugin": "unknown"},
					screenW: screen.width,
					screenH: screen.height,
					colorDepth: screen.colorDepth
	};

	var methods = {
		init: function(options){
			var o = $.extend({}, defaults, options);
			this.html(o.name + " v" + o.version);

			settings.codeName 		= window.navigator.appCodeName;		//return the browser code name
			settings.appName        = window.navigator.appName;     	//return the browser base name
			settings.appVersion     = window.navigator.appVersion,  	//return the verison per OS of the app
			settings.cookies  		= (window.navigator.cookieEnabled) ? "ok":"x";   //checks to see if cookies are enabled
			settings.os          	= window.navigator.oscpu;           //returns the OS and architecture
			settings.platform       = window.navigator.platform;        //returns the short OS and architecture form
			settings.product        = window.navigator.product;         //returns broswer engine type
		    settings.userAgent		= window.navigator.userAgent;       //returns the user agent of the browser
			settings.ajax           = ($.support.ajax) ? "ok":"x"; 		//check to see if ajax is available


			methods.checkPlugins();
			methods.checkPopUps();
			methods.setBroswer();
			//console.log(settings);

			//set the main container to the new html data
			this.html(methods.setHtml());
		},//end of init. Add: , newMethod: function()
		checkPlugins: function(){
   			//console.log("systemCheck.methods.checkPlugins called...");
			/**
			 * Using JavaScript RegExps, we check for the necessary plugins
			 * if true, set the option in _plugins to true.
			 *
			 * The window.ActiveXObject only tests for specifics, we loop through the plugins
			 * and find a match for the type we need in general. Chrome for instance has
			 * Chrome PDF Viewer and not Adobe Acrobat Reader. IF you have one or the other, this
			 * will set it to "true".
			 *
			 * example:
			 *	/regex_patter/i.test(str_to_search)
			 *
			 *	* i = ingore case
			**/
			$.each(window.navigator.plugins, function(index, plugin){
				switch(true){
					//Acrobat Reader
					case /acrobat/i.test(plugin.name):settings.acrobat = {"status": "ok", "plugin": plugin.name}; break;

					//Adobe Flash or Shockwave Flash
					case /flash/i.test(plugin.name):settings.flash = {"status": "ok", "plugin": plugin.name}; break;

					//Windows Media Player
					case /media\s+player/i.test(plugin.name):settings.wmp = {"status": "ok", "plugin": plugin.name}; break;

					//Quicktime player
					case /quicktime/i.test(plugin.name): settings.quicktime = {"status": "ok", "plugin": plugin.name}; break;

					//Java
					case /java.*SE/i.test(plugin.name):settings.java = {"status": "ok", "plugin": plugin.name}; break;

					//Chrome PDF Viewer or PDF something
					case /pdf/i.test(plugin.name):settings.acrobat = {"status": "ok", "plugin": plugin.name}; break;

					//Adobe Acrobat, not the same as Acrobat Reader for some reason
					case /adobe\s+acrobat/i.test(plugin.name):settings.acrobat = {"status": "ok", "plugin": plugin.name}; break;

					//Flip4Mac for  Mac users, just setting the WMP as its just a codec
					case /flip4mac/i.test(plugin.name):settings.wmp = {"status": "ok", "plugin": plugin.name}; break;
				   }
			});

		},//end of checkPlugins Add: , newMethod: function()
		checkPopUps: function(){
   			//console.log("systemCheck.methods.checkPopUps called...");
			var popUp = window.open('', '', 'width=100, height=100, left=24, top=24, scrollbars, resizable');
			if (popUp == null || typeof(popUp)=='undefined') {
	   			settings.popups = "x";
			} else {
				settings.popups = "ok";
				popUp.close();
			}
		},//end of checkPopUps Add: , newMethod: function()
		setBroswer: function(){
			//console.log("systemCheck.methods.setBrowser called...");
		 	$.each({0:"msie", 1:"mozilla", 2:"webkit", 3:"opera"}, function(i,v){
				if($.browser[v]){
					settings.browser = v; //Checks to see what browser base is set, Chrome and Firefox in window.navigator claim mozilla
				}
			});

			//Check for webkit, if not then IE, then finally Firefox
			if (settings.browser == "webkit"){
				//Check for Chrome if not, then Safari
		  		if(/chrome/i.test(settings.appVersion)){
					settings.browser = "chrome";
					settings.browserSafeName = "Google Chrome"
				} else if(/safari/i.test(settings.appVersion)){
					settings.browser = "safari";
		            settings.browserSafeName = "Safari";
				}
			} else if (settings.browser == "msie"){
		        settings.browserSafeName = "Internet Explorer";
			} else if (settings.browser == "mozilla"){
				if (/firefox/i.test(settings.userAgent)){
		            settings.browserSafeName = "Firefox";
		            settings.browser = "firefox";
				}
			}

			settings.browserVersion = $.browser.version;
		},//end of setBroswer Add: , newMethod: function()
		setHtml: function(){
			//console.log("systemCheck.methods.setHtml called...");
           //Set the output to var and inject the values using the str.format() function.ext
			var html = ["<div class=\"broswer-info-container\">",
						"	<div class=\"browser-icon-size browser-icon-{0}\"></div>",
						"	<div class=\"browser-info\"><p>Broswer: {1}<br>Version: {2} Platform: {3}<br>Resolution: {4} x {5} ({6} color depth)</p></div>",
						"</div>",
						"<div class=\"check-container\">",
						"	<div class=\"requirements\">",
						"		<h3>Requirements</h3>",
						"		<ul>",
				 		"			<li class=\"status-{7}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">Ajax</a></li>",
				 		"			<li class=\"status-{8}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">Cookies</a></li>",
				 		"			<li class=\"status-{9}\"><a class=\"help-link\" href=\"http://www.java.com\" target_=\"_blank\">{10}</a></li>",
				 		"			<li class=\"status-{11}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">Javascript</a></li>",
				 		"			<li class=\"status-{12}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">Popups</a></li>",
						"		</ul>",
						"	</div>",
						"	<div class=\"plugins\">",
						"		<h3>Plugins</h3>",
						"		<ul>",
		            	"			<li class=\"status-{13}\"><a class=\"help-link\" href=\"http://get.adobe.com/reader\" target_=\"_blank\"><div class=\"plugin-acrobat\"></div>{14}</a></li>",
		            	"			<li class=\"status-{15}\"><a class=\"help-link\" href=\"http://get.adobe.com/flashplayer\" target_=\"_blank\"><div class=\"plugin-flash\"></div>{16}</a></li>",
		            	"			<li class=\"status-{17}\"><a class=\"help-link\" href=\"http://www.apple.com/quicktime/download/\" target_=\"_blank\"><div class=\"plugin-quicktime\"></div>{18}</a></li>",
		            	"			<li class=\"status-{19}\"><a class=\"help-link\" href=\"http://port25.technet.com/pages/windows-media-player-firefox-plugin-download.aspx\" target_=\"_blank\"><div class=\"plugin-wmp\"></div>{20}</a></li>",
						"		</ul>",
						"	</div>",
						"</div>",
						"<div id=\"systemCheckMessage\"><p>If you are experiencing any issues with the plugins please either click on the plugin link or you can <a href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&WCU=HELP&ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">click here for System Check Help</a></p></div>"].join("").format(
				settings.browser, settings.browserSafeName, settings.browserVersion, settings.platform,
		        settings.screenW, settings.screenH, settings.colorDepth, settings.ajax,
				settings.cookies, settings.java.status, settings.java.plugin, settings.javascript,
		        settings.popups, settings.acrobat.status, settings.acrobat.plugin, settings.flash.status,
                settings.flash.plugin,settings.quicktime.status, settings.quicktime.plugin, settings.wmp.status, settings.wmp.plugin);
			return html;
		}
	};

	$.fn.extend({
		systemCheck: function(methodOrOptions){
			if ( methods[methodOrOptions] ) {
	            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
	            // Default to "init"
	            return methods.init.apply( this, arguments );
	        } else {
	            $.error( 'Method ' +  method + ' does not exist on jQuery.systemCheck' );
	        }
		}
	});
})(jQuery);

