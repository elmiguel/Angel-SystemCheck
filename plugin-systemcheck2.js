/**
 * New Angel System Check Nugget Helper Script
 * Author: Michael Bechtel
 * Created: 9/3/2013 8:42:22 AM
 * Modified: 9/5/2013 4:03:49 PM
 *
 * Function: To check the requirements and plugins in newer browsers.
 * TODO: Fix Crash in Mac Google Chrome Browser
 */



/**
 * We are using jQuery to properly wait until the entire page is loaded
 * before performing the browser check function. setTimeout doesn't
 * wait until the page is loaded, is only waits the time after the function
 * was triggered and depending on where the other JS scripts are placed the content
 * may not be fully loaded yet.
 */
$(document).ready(function (){
	browserCheck();
});


/**
 * "".format() function
 * This is a nice little function.ext I found.
 * It enables you to string formats like in other programming languages
 *
 *      example:
 *          "Hello {0}, how are you?".format("there");
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


/**
 * Browser Check looks at the window object and returns all the the broswer data.
 * Although feature detection would be optimal, Angel is not optimized for it.
 * We still have to look at the broser, as Angel is explicit to browser checks
 * At the bottom we use $.browser for some ease of browser checks but it is only
 * for Broswer Name and Broswer Version :(
 */
function browserCheck(){
	var _appCodeName	= window.navigator.appCodeName,		//return the browser code name
		_appName        = window.navigator.appName,     	//return the browser base name
		_appVersion     = window.navigator.appVersion,  	//return the verison per OS of the app
		_cookieEnabled  = window.navigator.cookieEnabled,   //checks to see if cookies are enabled
		_oscpu          = window.navigator.oscpu,           //returns the OS and architecture
		_platform       = window.navigator.platform,        //returns the short OS and architecture form
		_plugins        = {	acrobat: "x",                   //true if acrobat is installed
							pdf: "x",                       //true if pdf viewer is installed for chrome/webkit
							java: "x",                      //true if java is installed
							flash: "x",                     //true if Adobe Flash / Shockwave is installed
							wmp: "x",                       //true if Windows Media Player Plug-in is installed
							quicktime: "x"},                //true if Quicktime is installed
		_product        = window.navigator.product,         //returns broswer engine type
        _userAgent		= window.navigator.userAgent,       //returns the user agent of the browser
		_popups         = "x";                              //true if popups are enabled

		var popUp = window.open('', '', 'width=100, height=100, left=24, top=24, scrollbars, resizable');
		if (popUp == null || typeof(popUp)=='undefined') {
   			_popups = false;
		}
		else {
			_popups = "ok";
			popUp.close();
		}


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
			case /acrobat/i.test(plugin.name):_plugins.acrobat = "ok"; break;

			//Adobe Flash or Shockwave Flash
			case /flash/i.test(plugin.name):_plugins.flash = "ok";break;

			//Windows Media Player
			case /media\s+player/i.test(plugin.name):_plugins.wmp = "ok";break;

			//Quicktime player
			case /quicktime/i.test(plugin.name): _plugins.quicktime = "ok";break;

			//Java
			case /java/i.test(plugin.name):_plugins.java = "ok";break;

			//Chrome PDF Viewer or PDF something
			case /pdf/i.test(plugin.name):_plugins.pdf = "ok";break;

			//Adobe Acrobat, not the same as Acrobat Reader for some reason
			case /adobe\s+acrobat/i.test(plugin.name):_plugins.acrobat = "ok";break;

			//Flip4Mac for  Mac users, just setting the WMP as its just a codec
			case /flip4mac/i.test(plugin.name):_plugins.wmp = "ok";break;
		   }
	});

	var system_check = {
					codeName: _appCodeName,
					appName: _appName,
					appVersion: _appVersion,
					browser: "unknown",
					browserSafeName: "",
					browserVersion:$.browser.version,
					platform: _platform,
					cookies: (_cookieEnabled) ? "ok":"x", //check to see if cookies are enabled
					popups: _popups,
					ajax: ($.support.ajax) ? "ok":"x", //check to see if ajax is available
					java: _plugins.java,
					javascript: "ok", //Setting this to ok, as the noscript tag takes care of this before hand
					flash: _plugins.flash,
					wmp: _plugins.wmp,
					quicktime: _plugins.quicktime,
					acrobat: _plugins.acrobat,
					screenW: screen.width,
					screenH: screen.height,
					colorDepth: screen.colorDepth
					}

 	$.each({0:"msie", 1:"mozilla", 2:"webkit", 3:"opera"}, function(i,v){
		if($.browser[v]){
			system_check.browser = v; //Checks to see what browser base is set, Chrome and Firefox in window.navigator claim mozilla
		}
	});

	//Check for webkit, if not then IE, then finally Firefox
	if (system_check.browser == "webkit"){
		//Check for Chrome if not, then Safari
  		if(/chrome/i.test(system_check.appVersion)){
			system_check.browser = "chrome";
			system_check.browserSafeName = "Google Chrome"
			system_check.acrobat = _plugins.pdf;
		} else if(/safari/i.test(system_check.appVersion)){
			system_check.browser = "safari";
            system_check.browserSafeName = "Safari";
			system_check.acrobat = _plugins.acrobat;
		}
	} else if (system_check.browser == "msie"){
        system_check.browserSafeName = "Internet Explorer";
	} else if (system_check.browser == "mozilla"){
		if (/firefox/i.test(_userAgent)){
            system_check.browserSafeName = "Firefox";
            system_check.browser = "firefox";
		}
	}

	//Set the output to var and inject the values using the str.format() function.ext
	var html = ["<div class=\"broswer-info-container\">",
				"	<div class=\"browser-icon-size browser-icon-{0}\"></div>",
				"	<div class=\"browser-info\"><p>Broswer: {1}<br>Version: {2} Platform: {3}<br>Resolution: {4} x {5} Color Depth: {6}</p></div>",
				"</div>",
				"<div class=\"check-container\">",
				"	<div class=\"requirements\">",
				"		<h3>Requirements</h3>",
				"		<ul>",
		 		"			<li class=\"status-{7}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">Ajax</a></li>",
		 		"			<li class=\"status-{8}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">Cookies</a></li>",
		 		"			<li class=\"status-{9}\"><a class=\"help-link\" href=\"http://www.java.com\" target_=\"_blank\">Java</a></li>",
		 		"			<li class=\"status-{10}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">Javascript</a></li>",
		 		"			<li class=\"status-{11}\"><a class=\"help-link\" href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&amp;WCU=HELP&amp;ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">Popups</a></li>",
				"		</ul>",
				"	</div>",
				"	<div class=\"plugins\">",
				"		<h3>Plugins</h3>",
				"		<ul>",
            	"			<li class=\"status-{12}\"><a class=\"help-link\" href=\"http://get.adobe.com/reader\" target_=\"_blank\"><div class=\"plugin-acrobat\"></div>Acrobat Reader</a></li>",
            	"			<li class=\"status-{13}\"><a class=\"help-link\" href=\"http://get.adobe.com/flashplayer\" target_=\"_blank\"><div class=\"plugin-flash\"></div>Flash Player</a></li>",
            	"			<li class=\"status-{14}\"><a class=\"help-link\" href=\"http://www.apple.com/quicktime/download/\" target_=\"_blank\"><div class=\"plugin-quicktime\"></div>Quicktime Player</a></li>",
            	"			<li class=\"status-{15}\"><a class=\"help-link\" href=\"http://port25.technet.com/pages/windows-media-player-firefox-plugin-download.aspx\" target_=\"_blank\"><div class=\"plugin-wmp\"></div>Windows Media Player</a></li>",
				"		</ul>",
				"	</div>",
				"</div>",
				"<div id=\"systemCheckMessage\"><p>If you are experiencing any issues with the plugins please either click on the plugin link or you can <a href=\"https://angel.irsc.edu/Help/default.asp?WCI=pgDisplay&WCU=HELP&ENTRY_ID=5E949CE2B57346888EEA8625777A709B\">click here for System Check Help</a></p></div>"].join("").format(
		system_check.browser, system_check.browserSafeName, system_check.browserVersion, system_check.platform,
        system_check.screenW, system_check.screenH, system_check.colorDepth, system_check.ajax,
		system_check.cookies, system_check.java, system_check.javascript,
        system_check.popups, system_check.acrobat, system_check.flash,
		system_check.quicktime, system_check.wmp);

	//finally, write it to the page.
	$("#browserCheck").html(html);
}

