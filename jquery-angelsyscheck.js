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
		version: 2,
		winlinks: {
				"pdf": {"plugin":"Acrobat Reader", "link":"http://get.adobe.com/reader"},
				"flash": {"plugin":"Flash Player","link": "http://get.adobe.com/flash"},
				"quicktime": {"plugin":"Quicktime Player", "link": "http://www.apple.com/quicktime/download/"},
				"wmp": {"plugin":"Windows Media Player Plugin", "link": "http://port25.technet.com/pages/windows-media-player-firefox-plugin-download.aspx"}
		},
		maclinks: {
				"pdf": {"plugin":"Acrobat Reader", "link":"http://get.adobe.com/reader"},
				"flash": {"plugin":"Flash Player","link": "http://get.adobe.com/flash"},
				"quicktime": {"plugin":"Quicktime Player", "link": "http://www.apple.com/quicktime/download/"},
				"wmp":{"plugin": "Flip4Mac", "link":"http://www.telestream.net/flip4mac/"}		
		},
		linlinks: {
				"pdf": {"plugin":"Acrobat Reader", "link":"http://get.adobe.com/reader"},
				"flash": {"plugin":"Flash Player","link": "http://get.adobe.com/flash"},
				"quicktime": {"plugin": "MPlayer", "link": "http://www.mplayerhq.hu/design7/dload.html"},
				"wmp":{"plugin": "MPlayer", "link":"http://www.mplayerhq.hu/design7/dload.html"}
		}
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
					cookies: {"status": "x", "plugin": "No Cookies", "link":""},
					popups: {"status": "x", "plugin":"No Popups", "link":""},
					ajax: {"status": "x", "plugin":"No Ajax", "link":""},
					java: {"status":"x", "plugin": "No Java", "link":""},
					javascript: {"status":"ok","plugin": "Javascript", "link":""},    //Handled by noscript tags, if your here, then your good.
					flash: {"status":"x", "plugin": "No Flash", "link":""},
					wmp: {"status":"x", "plugin": "No WMP Codec", "link":""},
					quicktime: {"status":"x", "plugin": "No Quicktime", "link":""},
					acrobat: {"status":"x", "plugin": "No PDF Viewer", "link":""},
					screenW: screen.width,
					screenH: screen.height,
					colorDepth: screen.colorDepth
	};

	var methods = {
		init: function(options){
			var opts = $.extend({}, defaults, options);
			this.html(opts.name + " v" + opts.version);

			settings.codeName 		= window.navigator.appCodeName;		//return the browser code name
			settings.appName        = window.navigator.appName;     	//return the browser base name
			settings.appVersion     = window.navigator.appVersion,  	//return the verison per OS of the app
			settings.cookies  		= (window.navigator.cookieEnabled) ? {"status": "ok","plugin": "Cookies", "link": ""}:settings.cookies;  //checks to see if cookies are enabled
			settings.os          	= window.navigator.oscpu;           //returns the OS and architecture
			settings.platform       = window.navigator.platform;        //returns the short OS and architecture form
			settings.product        = window.navigator.product;         //returns broswer engine type
		    settings.userAgent		= window.navigator.userAgent;       //returns the user agent of the browser
			settings.ajax           = ($.support.ajax) ? {"status": "ok","plugin": "Ajax", "link": ""}:settings.ajax; //check to see if ajax is available


			methods.checkPlugins();
			methods.checkPopUps();
			methods.setBroswer();
			methods.setErrorLinks(opts);
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
                //Checking MimeTypes instead of plugin.name
                //Since MimeTypes are more reliable 
                /* Samples:
                 * video/mp4: MP4 video; Defined in RFC 4337
                 * video/quicktime: QuickTime video; Registered[15]
                 * video/x-ms-wmv: Windows Media Video; Documented in Microsoft KB 288102
                 * video/x-flv: Flash video (FLV files)
                 * application/pdf: Portable Document Format, PDF has been in use for document exchange on the Internet since 1993; Defined in RFC 3778                
                 */
                $.each(plugin, function(i, mime){
                    var mimetype = mime.type;
                    switch(true){
                        case /quicktime/i.test(mimetype):
                            settings.quicktime.status = "ok";
                            settings.quicktime.plugin = plugin.name;
                            break;
                        case /wmv/i.test(mimetype):
                            settings.wmp.status = "ok";
                            settings.wmp.plugin = plugin.name;
                            break;
                        case /flash/i.test(mimetype):
                            settings.flash.status = "ok";
                            settings.flash.plugin = plugin.name;
                            break;
                        case /pdf/i.test(mimetype):
                            settings.acrobat.status = "ok";
                            settings.acrobat.plugin = plugin.name;
                            break;
                        case /java/i.test(mimetype):
                            settings.java.status = "ok";
                            settings.java.plugin = plugin.name;
                            break;
                    }
                });

			});

		},//end of checkPlugins Add: , newMethod: function()
		checkPopUps: function(){
   			//console.log("systemCheck.methods.checkPopUps called...");
			var popUp = window.open('', '', 'width=100, height=100, left=24, top=24, scrollbars, resizable');
			if (popUp == null || typeof(popUp)=='undefined') {
	   			settings.popups = {"status": "x", "plugin":"No Popups"};
			} else {
				settings.popups = {"status": "ok", "plugin":"Popups"};
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
		setErrorLinks: function(opts){
				switch(true){
						case (/linux/i.test(settings.platform)):
							settings.acrobat.link = opts.linlinks.pdf.link;
							settings.flash.link = opts.linlinks.flash.link;
							settings.quicktime.link = opts.linlinks.quicktime.link;
							settings.wmp.link = opts.linlinks.wmp.link;
							break;
						case (/os/i.test(settings.platform)):
							settings.acrobat.link = opts.maclinks.pdf.link;
							settings.flash.link = opts.maclinks.flash.link;
							settings.quicktime.link = opts.maclinks.quicktime.link;
							settings.wmp.link = opts.maclinks.wmp.link;
							break;
						case (/win/i.test(settings.platform)):
							settings.acrobat.link = opts.winlinks.pdf.link;
							settings.flash.link = opts.winlinks.flash.link;
							settings.quicktime.link = opts.winlinks.quicktime.link;
							settings.wmp.link = opts.winlinks.wmp.link;
							break;
							
				}
		},//end of setErrorLink Add: , newMethod: function()
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
				 		"			<li class=\"status-{7}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">{8}</a></li>",
				 		"			<li class=\"status-{9}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">{10}</a></li>",
				 		"			<li class=\"status-{11}\"><a class=\"help-link\" href=\"http://www.java.com\" target_=\"_blank\">{12}</a></li>",
				 		"			<li class=\"status-{13}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">{14}</a></li>",
				 		"			<li class=\"status-{15}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">{16}</a></li>",
						"		</ul>",
						"	</div>",
						"	<div class=\"plugins\">",
						"		<h3>Plugins</h3>",
						"		<ul>",
		            	"			<li class=\"status-{17}\"><a class=\"help-link\" href=\"{18}\" target =\"_blank\"><div class=\"plugin-acrobat\"></div>{19}</a></li>",
		            	"			<li class=\"status-{20}\"><a class=\"help-link\" href=\"{21}\" target =\"_blank\"><div class=\"plugin-flash\"></div>{22}</a></li>",
		            	"			<li class=\"status-{23}\"><a class=\"help-link\" href=\"{24}\" target =\"_blank\"><div class=\"plugin-quicktime\"></div>{25}</a></li>",
		            	"			<li class=\"status-{26}\"><a class=\"help-link\" href=\"{27}\" target =\"_blank\"><div class=\"plugin-wmp\"></div>{28}</a></li>",
						"		</ul>",
						"	</div>",
						"</div>",
						"<div id=\"systemCheckMessage\"><p>If you are experiencing any issues with the plugins please either click on the plugin link or you can <a href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&WCU=HELP&ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">click here for System Check Help</a></p></div>"].join("").format(
				settings.browser, settings.browserSafeName, settings.browserVersion, settings.platform,
		        settings.screenW, settings.screenH, settings.colorDepth, settings.ajax.status, settings.ajax.plugin,
				settings.cookies.status, settings.cookies.plugin, settings.java.status, settings.java.plugin, settings.javascript.status,
				settings.javascript.plugin, settings.popups.status, settings.popups.plugin, settings.acrobat.status, settings.acrobat.link, 
				settings.acrobat.plugin, settings.flash.status, settings.flash.link, settings.flash.plugin, settings.quicktime.status, 
				settings.quicktime.link, settings.quicktime.plugin, settings.wmp.status, settings.wmp.link, settings.wmp.plugin);
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

