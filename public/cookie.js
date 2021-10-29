//对cookie的封装，采取getter、setter方式
(function(global){
	//获取cookie对象，以对象表示
	function getCookiesObj(){
		var cookies = {};
		if(document.cookie){
			var objs = document.cookie.split('; ');
			for(var i in objs){
				var index = objs[i].indexOf('='),
					name = objs[i].substr(0, index),
					value = objs[i].substr(index + 1, objs[i].length);
				cookies[name] = value;
			}
		}
		return cookies;
	}
	//设置cookie
	function set(name, value, opts){
		//opts maxAge, path, domain, secure
		if(name && value){
			var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			cookie += '; max-age=' + 5 * 365 * 24 * 60 * 60;
			//可选参数
			if(opts){
				if(opts.maxAge){
					cookie += '; max-age=' + 5 * 365 * 24 * 60 * 60;
				}
				if(opts.path){
					cookie += '; path=' + opts.path;
				}
				if(opts.domain){
					cookie += '; domain=' + opts.domain;
				}
				if(opts.secure){
					cookie += '; secure';
				}
			}
			document.cookie = cookie;
			return cookie;
		}else{
			return '';
		}
	}
	//获取cookie
	function get(name){
		return decodeURIComponent(getCookiesObj()[name]) || null;
	}

	//清除某个cookie
	function remove(name){
		if(getCookiesObj()[name]){
			document.cookie = name + '=; max-age=0';
		}
	}

	//清除所有cookie
	function clear(){
		var cookies = getCookiesObj();
		for(var key in cookies){
			document.cookie = key + '=; max-age=0';
		}
	}
	//获取所有cookies
	function getCookies(name){
		return getCookiesObj();
	}
	//解决冲突
	function noConflict(name){
		if(name && typeof name === 'string'){
			if(name && window['cookie']){
				window[name] = window['cookie'];
				delete window['cookie'];
				return window[name];
			}
		}else{
			return window['cookie'];
			delete window['cookie'];
		}
	}
	global['cookie'] = {
		'getCookies': getCookies,
		'set': set,
		'get': get,
		'remove': remove,
		'clear': clear,
		'noConflict': noConflict
	};
})(window);