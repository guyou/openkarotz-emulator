/*!
 * OpenKarotz Emulator
 *
 * Copyright (c) 2013 Olivier Bagot (http://github.com/hobbe/openkarotz-emulator)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * http://opensource.org/licenses/MIT
 *
 */

'use strict';

var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

var karotz = require('./karotz');
var log = require('./log');

/**
 * Handler for home page.
 * @param res - result
 * @param req - request
 */
function homepage(res, req) {
	log.trace('homepage: begin');

	var body = '<html>'
	        + '<head>'
	        + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
	        + '<title>OpenKarotz Emulator</title>'
	        + '</head>'
	        + '<body>'
	        + '<h1>OpenKarotz Emulator</h1>'
	        + '<h2>Status</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/status">status</a></li>'
	        + '<li><a target="results" href="/cgi-bin/get_version">get_version</a></li>'
	        + '<li><a target="results" href="/cgi-bin/get_free_space">get_free_space</a></li>'
	        + '<li><a target="results" href="/cgi-bin/sleep">sleep</a></li>'
	        + '<li><a target="results" href="/cgi-bin/wakeup?silent=0">wakeup</a>, <a target="results" href="/cgi-bin/wakeup?silent=1">wakeup(silent)</a></li>'
	        + '<li><a target="results" href="/cgi-bin/reboot">reboot</a></li>'
	        + '<li><a target="results" href="/cgi-bin/reset_install_flag">reset_install_flag</a></li>'
	        + '</ul>'
	        + '<h2>Leds</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/leds">leds</a></li>'
	        + '</ul>'
	        + '<h2>Ears</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/ears">ears</a></li>'
	        + '<li><a target="results" href="/cgi-bin/ears_reset">ears_reset</a></li>'
	        + '<li><a target="results" href="/cgi-bin/ears_random">ears_random</a></li>'
	        + '<li><a target="results" href="/cgi-bin/ears_mode?disable=0">ears_mode(enabled)</a>, <a target="results" href="/cgi-bin/ears_mode?disable=1">ears_mode(disabled)</a></li>'
	        + '</ul>'
	        + '<h2>Sound</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/sound_list">sound_list</a></li>'
	        + '<li><a target="results" href="/cgi-bin/radios_list">radios_list</a></li>'
	        + '<li><a target="results" href="/cgi-bin/sound?id=bip">sound(id)</a>, <a target="results" href="/cgi-bin/sound?url=http://play/sound">sound(url)</a></li>'
	        + '<li><a target="results" href="/cgi-bin/sound_control?cmd=quit">sound_control(quit)</a>, <a target="results" href="/cgi-bin/sound_control?cmd=pause">sound_control(pause)</a></li>'
	        + '</ul>'
	        + '<h2>Speech</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/voice_list">voice_list</a></li>'
	        + '<li><a target="results" href="/cgi-bin/tts?text=Hello%20World">tts</a></li>'
	        + '<li><a target="results" href="/cgi-bin/display_cache">display_cache</a></li>'
	        + '<li><a target="results" href="/cgi-bin/clear_cache">clear_cache</a></li>'
	        + '</ul>'
	        + '<h2>Photos</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/snapshot">snapshot</a></li>'
	        + '<li><a target="results" href="/cgi-bin/snapshot_ftp">snapshot_ftp</a></li>'
	        + '<li><a target="results" href="/cgi-bin/snapshot_list">snapshot_list</a></li>'
	        + '<li><a target="results" href="/cgi-bin/snapshot_get">snapshot_get</a>, <a target="results" href="/cgi-bin/snapshot_get?filename=snapshot.thumb.gif">snapshot_get(thumbnail)</a></li>'
	        + '<li><a target="results" href="/cgi-bin/clear_snapshots">clear_snapshots</a></li>'
	        + '</ul>'
	        + '<h2>RFID</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/rfid_list">rfid_list</a></li>'
	        + '<li><a target="results" href="/cgi-bin/rfid_list_ext">rfid_list_ext</a></li>'
	        + '<li><a target="results" href="/cgi-bin/rfid_start_record">rfid_start_record</a></li>'
	        + '<li><a target="results" href="/cgi-bin/rfid_stop_record">rfid_stop_record</a></li>'
	        + '</ul>'
	        + '<h2>Misc.</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/moods_list">moods_list</a></li>'
	        + '<li><a target="results" href="/cgi-bin/stories_list">stories_list</a></li>'
	        + '</ul>'
	        + '<h2>Apps</h2>'
	        + '<ul>'
	        + '<li><a target="results" href="/cgi-bin/apps/clock">clock</a>, <a target="results" href="/cgi-bin/apps/clock?hour=12">clock(12)</a></li>'
	        + '<li><a target="results" href="/cgi-bin/apps/moods">moods</a>, <a target="results" href="/cgi-bin/apps/moods?id=50">moods(50)</a></li>'
	        + '</ul>'
	        + '<hr/>'
	        + '<p><small>'
	        + '<a href="https://github.com/hobbe">Copyright &copy 2013</a> - '
	        + '<a href="https://github.com/hobbe/openkarotz-emulator">OpenKarotz Emulator</a> - '
	        + '<a href="https://github.com/hobbe/openkarotz-emulator/raw/master/LICENSE">MIT License</a>'
	        + '</small></p>'
	        + '</body>'
	        + '</html>';

	res.writeHead(200, {
	    'Server': 'OpenKarotz Emulator WebServer 1.0',
	    'Connection': 'close',
	    'Accept-Ranges': 'bytes',
	    'Content-Type' : 'text/html',
	    'Access-Control-Allow-Origin': '*'
	});
	res.write(body);
	res.end();
	log.trace('homepage: end');
}
exports.homepage = homepage;

function sendResponse(res, data) {
	log.trace('sendResponse: ' + data);
	res.writeHead(200, {
	    'Server': 'OpenKarotz WebServer 1.0',
	    'Connection': 'close',
	    'Accept-Ranges': 'bytes',
	    'Content-type': 'text/plain',
	    'Access-Control-Allow-Origin': '*'
	});
	res.write(data);
	res.end();
}

function getParameter(req, param, defaultValue) {
	var qs = url.parse(req.url).query;
	var value = querystring.parse(qs)[param];
	if (value === undefined) {
		return defaultValue;
	}
	return value;
}

function sleep(res, req) {
	log.trace('sleep: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is already sleeping."}';
	} else {
		karotz.sleep();
		data = '{"return":"0"}';
	}

	sendResponse(res, data);
	log.trace('sleep: end');
}
exports.sleep = sleep;

function wakeup(res, req) {
	log.trace('wakeup: begin');
	var silent = getParameter(req, "silent");

	karotz.wakeup();

	var data = '{"return":"0","silent":"' + silent + '"}';
	sendResponse(res, data);
	log.trace('wakeup: end');
}
exports.wakeup = wakeup;

function reboot(res, req) {
	log.trace('reboot: begin');

	karotz.reboot();

	var data = '{"return":"0"}';
	sendResponse(res, data);
	log.trace('reboot: end');
}
exports.reboot = reboot;

function status(res, req) {
	log.trace('status: begin');

	var sleep = karotz.isSleeping() ? 1 : 0;
	var pulse = karotz.isLedsPulse() ? 1 : 0;
	var earsDisabled = karotz.isEarsDisabled() ? 1 : 0;

	var data = '{"version":"' + karotz.getVersion() + '",'
		+ '"ears_disabled":"' + earsDisabled + '",'
		+ '"sleep":"' + sleep + '",'
		+ '"sleep_time":"' + karotz.getSleepTime() + '",'
		+ '"led_color":"' + karotz.getLedsColor() + '",'
		+ '"led_pulse":"' + pulse + '",'
		+ '"tts_cache_size":"4",'
		+ '"usb_free_space":"-1",'
		+ '"karotz_free_space":"148.4M",'
		+ '"eth_mac":"00:00:00:00:00:00",'
		+ '"wlan_mac":"01:23:45:67:89:AB",'
		+ '"nb_tags":"4",'
		+ '"nb_moods":"305",'
		+ '"nb_sounds":"14",'
		+ '"nb_stories":"0",'
		+ '"karotz_percent_used_space":"37",'
		+ '"usb_percent_used_space":""}';

	sendResponse(res, data);
	log.trace('status: end');
}
exports.status = status;

function get_version(res, req) {
	log.trace('get_version: begin');
	var data = '{"version":"' + karotz.getVersion() + '","return":"0"}';
	sendResponse(res, data);
	log.trace('get_version: end');
}
exports.get_version = get_version;

function get_free_space(res, req) {
	log.trace('get_free_space: begin');
	var data = '{"karotz_percent_used_space":"37","usb_percent_used_space":"-1"}';
	sendResponse(res, data);
	log.trace('get_free_space: end');
}
exports.get_free_space = get_free_space;

function leds(res, req) {
	log.trace('leds: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else {
		var color = getParameter(req, "color", "00FF00");
		var color2 = getParameter(req, "color2", "000000");
		var pulse = getParameter(req, "pulse", "0");
		var no_memory = getParameter(req, "no_memory", "0");
		var speed = getParameter(req, "speed", "");
		// TODO: handle blink parameter?

		karotz.leds(color, color2, pulse, speed);

		data = '{"color":"' + karotz.getLedsColor() + '",'
			+ '"secondary_color":"' + karotz.getLedsColor2() + '",'
			+ '"pulse":"' + karotz.isLedsPulse() + '",'
			+ '"no_memory":"' + no_memory + '",'
			+ '"speed":"' + karotz.getLedsSpeed() + '",'
			+ '"return":"0"}';
	}

	sendResponse(res, data);
	log.trace('leds: end');
}
exports.leds = leds;

function ears(res, req) {
	log.trace('ears: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else if (karotz.isEarsDisabled()){
		data = '{"return":"1","msg":"Unable to perform action, ears disabled."}';
	} else {
		var left = getParameter(req, "left");
		var right = getParameter(req, "right");
		// var noreset = getParameter(req, "noreset", "0"); // Unused

		if (left === undefined || right === undefined) {
			data = '{"return":"1","msg":"Missing mandatory parameters."}';
		} else {
			karotz.ears(left, right);
			data = '{"left":"' + left + '","right":"' + right + '","return":"0"}';
		}
	}

	sendResponse(res, data);
	log.trace('ears: end');
}
exports.ears = ears;

function ears_mode(res, req) {
	log.trace('ears_mode: begin');

	var mode = getParameter(req, "disable", 0);
	mode = (mode == 0 ? 0 : 1);
	if (mode == 1) {
		karotz.disableEars();
	} else {
		karotz.enableEars();
	}

	var data = '{"return":"0","disabled":"' + mode + '"}';

	sendResponse(res, data);
	log.trace('ears_mode: end');
}
exports.ears_mode = ears_mode;

function ears_reset(res, req) {
	log.trace('ears_reset: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else if (karotz.isEarsDisabled()){
		data = '{"return":"1","msg":"Unable to perform action, ears disabled."}';
	} else {
		karotz.ears(0, 0);
		data = '{"return":"0"}';
	}

	sendResponse(res, data);
	log.trace('ears_reset: end');
}
exports.ears_reset = ears_reset;

function ears_random(res, req) {
	log.trace('ears_random: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else if (karotz.isEarsDisabled()){
		data = '{"return":"1","msg":"Unable to perform action, ears disabled."}';
	} else {
		var left = Math.floor((Math.random() * 15) + 1);
		var right = Math.floor((Math.random() * 15) + 1);

		karotz.ears(left, right);
		data = '{"left":"' + left + '","right":"' + right + '","return":"0"}';
	}

	sendResponse(res, data);
	log.trace('ears_random: end');
}
exports.ears_random = ears_random;

function sound(res, req) {
	log.trace('sound: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else {
		var id = getParameter(req, "id");
		var uri = getParameter(req, "url");

		if (id && uri) {
			data = '{"return":"1","msg":"You cannot use ID and URL parameters at the same time."}';
		} else if ((id === undefined) && (uri === undefined)) {
			data = '{"return":"1","msg":"No sound to play."}';
		} else if (id) {
			data = '{"return":"0"}';
			// data = '{"return":"1","msg":"Unable to find sound : ' + id + '"}';
		} else {
			data = '{"return":"0"}';
		}
	}

	sendResponse(res, data);
	log.trace('sound: end');
}
exports.sound = sound;

function sound_control(res, req) {
	log.trace('sound_control: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else {
		var cmd = getParameter(req, "cmd");
		if (cmd === undefined) {
			data = '{"return":"1","msg":"No command specified."}';
		} else {
			data = '{"return":"0","cmd":"' + cmd + '"}';
		}
	}

	sendResponse(res, data);
	log.trace('sound_control: end');
}
exports.sound_control = sound_control;

function sound_list(res, req) {
	log.trace('sound_list: begin');

	var data = '{"sounds": ['
		+ '{"id":"bip1"},'
		+ '{"id":"bling"},'
		+ '{"id":"flush"},'
		+ '{"id":"install_ok"},'
		+ '{"id":"jet1"},'
		+ '{"id":"laser_15"},'
		+ '{"id":"merde"},'
		+ '{"id":"ready"},'
		+ '{"id":"rfid_error"},'
		+ '{"id":"rfid_ok"},'
		+ '{"id":"saut1"},'
		+ '{"id":"start"},'
		+ '{"id":"twang_01"},'
		+ '{"id":"twang_04"}'
		+ '],"return":"0"}';

	sendResponse(res, data);
	log.trace('sound_list: end');
}
exports.sound_list = sound_list;

function tts(res, req) {
	log.trace('tts: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else {
		var text = getParameter(req, "text");
		var voice = getParameter(req, "voice", "margaux");
		// var speed = getParameter(req, "speed"); // Unused
		var nocache = getParameter(req, "nocache", 0);
		// var engine = getParameter(req, "engine"); // Unused

		if (text === undefined) {
			data = '{"return":"1","msg":"Missing mandatory parameter(s)."}';
		} else {
			data = '{"played":"1","cache":"' + (nocache == 0 ? 1 : 0) + '","return":"0","voice":"' + voice + '"}';
		}
	}

	sendResponse(res, data);
	log.trace('tts: end');
}
exports.tts = tts;

function snapshot(res, req) {
	log.trace('snapshot: begin');

	// var silent = getParameter(req, "silent", 1); // Unused
	var filename = 'snapshot_2013_11_10_09_00_00';

	var data = '{"filename":"' + filename + '.jpg","thumb":"' + filename + '.thumb.gif","return":"0"}';

	sendResponse(res, data);
	log.trace('snapshot: end');
}
exports.snapshot = snapshot;

function snapshot_ftp(res, req) {
	// FTP upload is not done!
	// IDEA: Java applet could be used to do the FTP upload
	log.trace('snapshot_ftp: begin');

	var filename = 'snapshot_2013_11_10_09_00_00';

	var data = '{"filename":"' + filename + '.jpg","return":"0"}';

	sendResponse(res, data);
	log.trace('snapshot_ftp: end');
}
exports.snapshot_ftp = snapshot_ftp;

function snapshot_list(res, req) {
	log.trace('snapshot_list: begin');

	var data = '{"snapshots":['
		+ '{"id":"snapshot_2013_11_10_09_00_00.jpg"},'
		+ '{"id":"snapshot_2013_11_10_09_01_00.jpg"},'
		+ '{"id":"snapshot_2013_11_10_09_02_00.jpg"},'
		+ '{"id":"snapshot_2013_11_10_09_03_00.jpg"}'
		+ '],"return":"0"}';

	sendResponse(res, data);
	log.trace('snapshot_list: end');
}
exports.snapshot_list = snapshot_list;

function snapshot_get(res, req) {
	log.trace('snapshot_get: begin');

	var filename = getParameter(req, 'filename');
	var gif = (filename && filename.indexOf('.gif') > 0);
	var imageFile = gif ? 'img/snapshot.thumb.gif' : 'img/snapshot.jpg';

	fs.readFile(imageFile, 'binary', function(err, file) {
		if (err) {
			var data = '{"return":"1","msg":"' + err + '"}';
			sendResponse(res, data);
		} else {
			res.writeHead(200, {
				'Server': 'OpenKarotz WebServer 1.0',
				'Connection': 'close',
				'Accept-Ranges': 'bytes',
				// 'Content-Disposition' : 'attachment; filename=' + filename,
				'Cache-Control': 'private',
				'Pragma': 'private',
				'Content-type': (gif ? 'image/gif' : 'image/jpeg'),
				'Access-Control-Allow-Origin': '*'
			});
			res.write(file, 'binary');
			res.end();
		}
	});

	log.trace('snapshot_get: end');
}
exports.snapshot_get = snapshot_get;

function voice_list(res, req) {
	log.trace('voice_list: begin');

	var data = '{"voices":['
		+ '{"id":"alice","lang":"fr"},'
		+ '{"id":"claire","lang":"fr"},'
		+ '{"id":"julie","lang":"fr"},'
		+ '{"id":"justine","lang":"fr"},'
		+ '{"id":"margaux","lang":"fr"},'
		+ '{"id":"louise","lang":"fr"},'
		+ '{"id":"antoine","lang":"fr"},'
		+ '{"id":"bruno","lang":"fr"},'
		+ '{"id":"heather","lang":"us"},'
		+ '{"id":"ryan","lang":"us"}'
		+ '],"return":"0"}';

	sendResponse(res, data);
	log.trace('voice_list: end');
}
exports.voice_list = voice_list;

function radios_list(res, req) {
	log.trace('radios_list: begin');

	// Only a few ones...
	var data = '{"streams":['
		+ '{"id":1,"name":"Rire & Chanson","url":"http://mp3.live.tv-radio.com/rire_et_chansons/all/rir_124629.mp3"},'
		+ '{"id":2,"name":"RTL","url":"http://streaming.radio.rtl.fr/rtl-1-44-96"},'
		+ '{"id":3,"name":"RMC","url":"http://vipicecast.yacast.net/rmc"},'
		+ '{"id":4,"name":"Europe 1","url":"http://vipicecast.yacast.net/europe1"},'
		+ '{"id":5,"name":"RTL2","url":"http://streaming.radio.rtl2.fr/rtl2-1-44-96"}'
		+ '],"return":"0"}';

	sendResponse(res, data);
	log.trace('radios_list: end');
}
exports.radios_list = radios_list;

function reset_install_flag(res, req) {
	log.trace('reset_install_flag: begin');

	var data = '{"return":"0"}';

	sendResponse(res, data);
	log.trace('reset_install_flag: end');
}
exports.reset_install_flag = reset_install_flag;

function clear_cache(res, req) {
	log.trace('clear_cache: begin');

	var data = '{"return":"0"}';

	sendResponse(res, data);
	log.trace('clear_cache: end');
}
exports.clear_cache = clear_cache;

function display_cache(res, req) {
	log.trace('display_cache: begin');

	var data = '{"cache":[{"id":"6fcfe1b9dfc7fe6d3df40872d36f43ac","text":"bonjour lapin","voice":"margaux"}],"return":"0"}';

	sendResponse(res, data);
	log.trace('display_cache: end');
}
exports.display_cache = display_cache;

function clear_snapshots(res, req) {
	log.trace('clear_snapshots: begin');

	var data = '{"return":"0"}';

	sendResponse(res, data);
	log.trace('clear_snapshots: end');
}
exports.clear_snapshots = clear_snapshots;

function rfid_list(res, req) {
	log.trace('rfid_list: begin');

	var data = '{"tags":['
		+ '{"id":"D0021A35038F0CD2","type":"1","color":"4","cmd":"0","var":"-1","name":"" },'
		+ '{ "id":"D0021A3506196568","type":"1","color":"3","cmd":"3","var":"-1","name":"Radio"}'
		+ '],"return":"0"}';

	sendResponse(res, data);
	log.trace('rfid_list: end');
}
exports.rfid_list = rfid_list;

function rfid_list_ext(res, req) {
	log.trace('rfid_list_ext: begin');

	var data = '{"tags":['
		+ '{"id":"D0021A35038F0CD2","type":"1","type_name":"FLATANOZ","color":"4","color_name":"JAUNE"},'
		+ '{"id":"D0021A3506196568","type":"1","type_name":"FLATANOZ","color":"3","color_name":"VERT"}'
		+ '],"return":"0"}';

	sendResponse(res, data);
	log.trace('rfid_list_ext: end');
}
exports.rfid_list_ext = rfid_list_ext;

function rfid_start_record(res, req) {
	log.trace('rfid_start_record: begin');

	var data = '{"return":"0"}';

	sendResponse(res, data);
	log.trace('rfid_start_record: end');
}
exports.rfid_start_record = rfid_start_record;

function rfid_stop_record(res, req) {
	log.trace('rfid_stop_record: begin');

	var data = '{"return":"0"}';

	sendResponse(res, data);
	log.trace('rfid_stop_record: end');
}
exports.rfid_stop_record = rfid_stop_record;

function clock(res, req) {
	log.trace('clock: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else {
		var hour = getParameter(req, "hour");
		if (hour === undefined) {
			hour = new Date().getHours();
		}
		if (hour >= 0 && hour <= 23) {
			data = '{"return":"0","hour":"' + hour + '"}';
		} else {
			data = '{"return":"1","hour":"' + hour + '"}';
		}
	}

	sendResponse(res, data);
	log.trace('clock: end');
}
exports.clock = clock;

function moods(res, req) {
	log.trace('moods: begin');

	var data = '';
	if (karotz.isSleeping()) {
		data = '{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}';
	} else {
		var mood = getParameter(req, "id");
		//var lang = getParameter(req, "lang"); // Unused
		if (mood === undefined) {
			mood = Math.floor((Math.random() * 300) + 1);
		}

		data = '{"moods":"' + mood + '","return":"0"}';
	}

	sendResponse(res, data);
	log.trace('moods: end');
}
exports.moods = moods;

function moods_list(res, req) {
	log.trace('moods_list: begin');

	// Only the first 5
	var data = '{"moods":['
		+ '{"id":"1","text":"Ronflements"},'
		+ '{"id":"2","text":"B&acirc;illement"},'
		+ '{"id":"3","text":"Eternuement Pardon !"},'
		+ '{"id":"4","text":"Arracher les orties."},'
		+ '{"id":"5","text":"Bonjour ! Je suis un lapin, je suis gentil. Ha ha ha ha&hellip;"}'
		+ '],"return":"0"}';

	sendResponse(res, data);
	log.trace('moods_list: end');
}
exports.moods_list = moods_list;

function stories_list(res, req) {
	log.trace('stories_list: begin');

	var data = '{"stories":[],"return":"0"}';

	sendResponse(res, data);
	log.trace('stories_list: end');
}
exports.stories_list = stories_list;

