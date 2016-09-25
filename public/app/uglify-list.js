function getDefaultDeviceSettings(){var e={showSoftKeys:true,pinTitleBar:true,alwaysOnTop:false,bitrate:0,resolution:0,decoder:0};return e}function sanitizeDeviceSettings(e){if(!e)return null;if(e.friendlyName&&!e.friendlyName.length)delete e.friendlyName;return e}function loadAllDeviceSettings(e){if(window.chrome&&window.chrome.storage){chrome.storage.local.get("device-settings",function(t){e(t["device-settings"]||{})})}else{e({})}}function loadDeviceSettings(e,t){if(!e)e="web";var n=getDefaultDeviceSettings();if(e=="inkwire"){n.pinTitleBar=false;n.showSoftKeys=false}loadAllDeviceSettings(function(o){t(sanitizeDeviceSettings(o[e]||n))})}function saveDeviceSettings(e,t,n){sanitizeDeviceSettings(t);if(!window.chrome||!window.chrome.storage){if(n)n();return}if(!e||e.indexOf("127.0.0.1")!=-1){if(n)n();return}loadAllDeviceSettings(function(o){o[e]=t;chrome.storage.local.set({"device-settings":o},n)})}function applyDeviceSettings(e){$("#new-display-name").prop("value",e.friendlyName);$("#softkeys-check").prop("checked",e.showSoftKeys?true:false).change();$("#pin-title-check").prop("checked",e.pinTitleBar?true:false).change();$("#always-on-top-check").prop("checked",e.alwaysOnTop?true:false).change();$("#bitrate").prop("selectedIndex",e.bitrate||0);$("#decoder").prop("selectedIndex",e.decoder||0);$("#resolution").prop("selectedIndex",e.resolution||0)}function getWhitelist(e){chrome.storage.local.get("whitelist",function(t){var n={};if(!t.whitelist||t.whitelist.constructor.name!="Array"){e(n);return}$.each(t.whitelist,function(e,t){n[t]=true});e(n)})}function saveWhitelist(e,t){chrome.storage.local.set({whitelist:Object.keys(e)},t)}function addToWhitelist(e,t){getWhitelist(function(n){n[e]=true;saveWhitelist(n,t)})}function clearWhitelist(){chrome.storage.local.remove("whitelist")}function isWhitelisted(e,t){chrome.storage.local.get(["whitelist","serverMode"],function(n){if(n.serverMode==1){t(true);return}if(n.serverMode!=2){var o={};if(!n.whitelist||n.whitelist.constructor.name!="Array"){t(false,true);return}t(n.whitelist.indexOf(e)!=-1,true);return}getAuthToken(false,function(n){if(!n){console.error("unable to get token for vysor enterprise whitelist check");t(false);return}$.ajax({type:"get",url:"https://billing.vysor.io/whitelist",headers:{Authorization:"Bearer "+n},data:{email:e},error:function(){console.error("failure checking vysor enterprise whitelist",arguments);t(false)},success:function(n){if(!n.whitelist)console.error("access denied to",e,n);t(n.whitelist,false)}})})})}function getVysorWhitelistStatus(e){chrome.storage.local.get(["whitelist","serverMode"],function(t){if(t.serverMode==1){e("Any user can access this server.");return}if(t.serverMode==2){e("Your Vysor Enterprise users can access this server.");return}var n;if(!t.whitelist||t.whitelist.constructor.name!="Array")n=0;else n=t.whitelist.length;e(n+" user(s) can access this server.")})}function nextTick(e){setTimeout(e,0)}function make4Len16(e){var t=e.toString(16);while(t.length<4){t="0"+t}return t}function encode_utf8(e){return unescape(encodeURIComponent(e))}function decode_utf8(e){return decodeURIComponent(escape(e))}function ab2str(e){if(e.constructor.name=="ArrayBuffer"){e=new Uint8Array(e)}return decode_utf8(String.fromCharCode.apply(null,e))}function str2ab(e,t,n){e=encode_utf8(e);var o=e.length;if(n)o++;if(!t){t=new ArrayBuffer(o)}var i=new Uint8Array(t);if(n)i[e.length]=0;for(var r=0,a=e.length;r<a;r++){i[r]=e.charCodeAt(r)}return t}var slashN="\n".charCodeAt(0);function writeLine(e,t,n){if(t.constructor.name=="Object")t=JSON.stringify(t);writeString(e,t+"\n",n)}function readLine(e,t){var n=[];function o(){e.read(function(i){for(var r=0;r<i.byteLength;r++){if(i[r]==slashN){var a=i.subarray(0,r);n.push(a);var s="";for(var c in n){c=n[c];s+=ab2str(c)}var l=i.subarray(r+1);e.unshift(l);t(s);return}}n.push(i);o()})}o()}function readString(e,t){var n="";e.onClose=function(){t(n)};function o(t){n+=ab2str(t);e.read(o)}e.read(o)}function writeString(e,t,n){if(t.constructor.name=="Object")t=JSON.stringify(t);e.write(str2ab(t),n)}function appendBuffer(e,t){var n=new Uint8Array(e.byteLength+t.byteLength);n.set(e,0);n.set(t,e.byteLength);return n}var timeThing=(new Date).getTime();function timeTrace(e){var t=(new Date).getTime();console.log(e+": "+(t-timeThing));timeThing=t}function bufferToHex(e){var t=new Uint8Array(e);var n="";for(var o in t){o=t[o];if(o<16)n+="0"+o.toString(16);else n+=o.toString(16)}return n}function hexToBuffer(e){var t=new ArrayBuffer(e.length/2);var n=new Uint8Array(t);for(var o=0;o<e.length/2;o++){var i=e.substr(o*2,2);n[o]=parseInt(i,16)}return t}function base64ToArrayBuffer(e){var t=window.atob(e);var n=t.length;var o=new Uint8Array(n);for(var i=0;i<n;i++){var r=t.charCodeAt(i);o[i]=r}return o.buffer}function arrayBufferToBase64(e){var t="";var n=new Uint8Array(e);var o=n.byteLength;for(var i=0;i<o;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var b64pad="=";function hex2b64(e){var t;var n;var o="";for(t=0;t+3<=e.length;t+=3){n=parseInt(e.substring(t,t+3),16);o+=b64map.charAt(n>>6)+b64map.charAt(n&63)}if(t+1==e.length){n=parseInt(e.substring(t,t+1),16);o+=b64map.charAt(n<<2)}else if(t+2==e.length){n=parseInt(e.substring(t,t+2),16);o+=b64map.charAt(n>>2)+b64map.charAt((n&3)<<4)}while((o.length&3)>0){o+=b64pad}return o}if(!String.prototype.startsWith){Object.defineProperty(String.prototype,"startsWith",{enumerable:false,configurable:false,writable:false,value:function(e,t){t=t||0;return this.lastIndexOf(e,t)===t}})}function getQueryVariable(e,t){if(!t)t=window.location;var n=t.search.substring(1);var o=n.split("&");for(var i=0;i<o.length;i++){var r=o[i].split("=");if(decodeURIComponent(r[0])==e){return decodeURIComponent(r[1])}}}Object.fromArray=function(e){var t={};for(var n in e){var o=e[n];t[o]=o}return t};$.ajaxTransport("+binary",function(e,t,n){if(window.FormData&&(e.dataType&&e.dataType=="binary"||e.data&&(window.ArrayBuffer&&e.data instanceof ArrayBuffer||window.Blob&&e.data instanceof Blob))){return{send:function(t,n){var o=new XMLHttpRequest,i=e.url,r=e.type,a=e.async||true,s=e.responseType||"blob",c=e.data||null,l=e.username||null,u=e.password||null;o.addEventListener("load",function(){var t={};t[e.dataType]=o.response;n(o.status,o.statusText,t,o.getAllResponseHeaders())});o.open(r,i,a,l,u);for(var d in t){o.setRequestHeader(d,t[d])}o.responseType=s;o.send(c)},abort:function(){n.abort()}}}});function throttleTimeout(e,t,n,o){if(!e)e={items:[]};e.items.push(t);if(!e.timeout){e.timeout=setTimeout(function(){delete e.timeout;o(e.items);e.items=[]},n)}return e}function copyTextToClipboard(e){var t=document.createElement("textarea");t.style.position="fixed";t.style.top=0;t.style.left=0;t.style.width="2em";t.style.height="2em";t.style.padding=0;t.style.border="none";t.style.outline="none";t.style.boxShadow="none";t.style.background="transparent";t.value=e;document.body.appendChild(t);t.select();try{var n=document.execCommand("copy")}catch(o){console.log("Oops, unable to copy")}document.body.removeChild(t)}function showNotification(e,t){console.log("notification:",e);if(!window.chrome||!window.chrome.notifications)return;var n=chrome.runtime.getManifest();var o=n.name;t=t||n.icons[128];chrome.notifications.create({type:"basic",iconUrl:t,title:o,message:e})}var blobFromUrl=function(){var e={};return function(t,n){if(e[t]){n(e[t]);return}var o=new XMLHttpRequest;o.open("GET",t,true);o.responseType="blob";o.onload=function(o){n(e[t]=window.URL.createObjectURL(this.response))};o.send()}}();function Success(){}(function(){function*e(){}var t=e();t.constructor.prototype.async=function(){var e=this;var t=e.next();if(t.done)return;function n(){t=e.throw(new Error(arguments));i()}function o(){var n=arguments[0];t=e.next(n);i()}function i(i){var r;var a;if(t.done)return;if(!t.value){t=e.next(o);return}if(t.value.constructor==Promise){t.value.then(o).catch(n);return}if(t.value==Error){r=true;t=e.next(n)}else if(t.value==Success){a=true;t=e.next(o)}else{throw new Error("Unexpected yield value for callback. Only Error and Success allowed.")}if(!t.value)throw new Error("Double yield callbacks must explicitly define both Error and Success");if(t.value==Error&&r)throw new Error("Error callback already defined");else if(t.value==Success&&a)throw new Error("Success callback already defined");else if(t.value!=Error&&t.value!=Success)throw new Error("Unexpected yield value for callback. Only Error and Success allowed.");if(r)t=e.next(o);else t=e.next(n)}i()}})();function spewSocket(e){e.read(function(t){console.log(ab2str(t));spewSocket(e)})}function getAuthToken(e,t){if(!window.chrome||!window.chrome.identity){console.error("no auth token implemented");process.nextTick(t);return}chrome.identity.getAuthToken({interactive:e,scopes:["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/chromewebstore.readonly"]},function(e){if(!e)console.error("unable to get authToken",chrome.runtime.lastError);t(e)})}window.isElectron=function(){return navigator.userAgent.indexOf("Electron")!=-1};if(!isElectron()){window.sharedGlobals=window}(function(){var e=console.log;var t=console.error;var n="";function o(e){try{for(var t in e){if(e[t]&&e[t].constructor!=String)e[t]=JSON.stringify(e[t])}n+=e.join(" ")+"\n"}catch(o){}}console.error=function(){t.apply(console,arguments);o(Array.prototype.slice.call(arguments))};console.log=function(){e.apply(console,arguments);o(Array.prototype.slice.call(arguments))};sharedGlobals.getConsoleLog=function(e){e(n)};function i(e){return new Promise(function(t,n){if(!e.getConsoleLog){t("getConsoleLog not found");return}e.getConsoleLog(function(e){t({content:e})})})}window.gistConsoleLog=function(e,t){chrome.runtime.getBackgroundPage(function(n){i(n).then(function(t){e["background.txt"]=t;var n=chrome.app.window.getAll();var o=n.map(function(t){return i(t.contentWindow).then(function(n){e["window-"+t.id+".txt"]=n})});return Promise.all(o)}).then(function(){var n={description:chrome.runtime.getManifest().name+" console log","public":false,files:e};fetch("https://api.github.com/gists",{method:"POST",body:JSON.stringify(n)}).then(function(e){e.json().then(function(e){t(e.html_url)})})})})}})();function showModal(e){var t=$("#notificationModal");var n=t.find("#modal-ok");var o=t.find("#modal-cancel");n.unbind("click");o.unbind("click");e.cancelButton=e.cancelButton||"Cancel";e.okButton=e.okButton||"OK";e.title=e.title||chrome.runtime.getManifest().name;e.body=e.body||"";if(e.hideCancel)o.hide();else o.show();n.text(e.okButton);o.text(e.cancelButton);t.find("#modal-title").text(e.title);t.find("#modal-body").html(e.body);n.click(function(){if(!e.ok||!e.ok())$("#notificationModal").modal("hide")});if(e.cancel)e.click(e.cancel);$("#notificationModal").modal();if(e.duration){setTimeout(function(){$("#notificationModal").modal("hide")},e.duration)}}function shortModal(e,t){showModal({title:e,body:t,duration:8e3,hideCancel:true})}(function(){function e(){chrome.usb.getUserSelectedDevices({multiple:true,filters:[{interfaceClass:255,interfaceSubclass:66,interfaceProtocol:1}]},function(e){$.each(e,function(e,t){var n=t.vendorId.toString(16)+":"+t.productId.toString(16);tracker.sendEvent("select-device",n);adbServer.refreshDevice(t,function(e){if(e){tracker.sendEvent("connect-device",e.properties["ro.product.name"],t.vendorId.toString(16)+":"+t.productId.toString(16),n)}else{var o=chrome.runtime.getManifest().name;chrome.notifications.create("reload",{type:"basic",iconUrl:"/icon.png",title:o,message:"An error occurred while connecting to the Android device. Restarting the Vysor app, or disconnecting and reconnecting the Android may resolve this issue.",buttons:[{title:"Reload"}]})}})})})}function t(){getAuthToken(false,function(e){if(licenseManager.isLicensed&&!licenseManager.isLicenseCached){$("#login-container").show();return}if(e||licenseManager.isLicenseCached)$("#login-container").hide();else $("#login-container").show()})}function n(){t();if(!licenseManager.isLicensed)return;$("#purchase").hide();$("#vysor-version").text("Vysor Pro Version "+chrome.runtime.getManifest().version);$(".navbar-brand").text("Vysor Pro")}sharedGlobals.refreshLicense=n;function o(){chrome.app.window.create("screen.html",{id:"tutorial",innerBounds:{width:576,height:1024}},function(e){tracker.sendEvent("open-tutorial");e.contentWindow.openList=openList;e.contentWindow.onload=function(){e.contentWindow.docReady()}})}$(document).ready(function(){if(navigator.platform.toLowerCase().indexOf("win")==-1){$("#windows").hide()}$("#bugreport").click(function(){var e;showModal({title:"Bug Report",body:"Creating bug report. Please wait...",okButton:"Cancel",hideCancel:true,ok:function(){e=true}});gistConsoleLog({"adb-devices.json":{content:JSON.stringify(a,null,2)}},function(e){function t(){showModal({cancelButton:"OK",okButton:"Copy Bug Report",ok:function(){$("#notificationModal").modal("hide");copyTextToClipboard(e);setTimeout(t,500)},title:"Bug Report",body:'Here is the <a href="'+e+'" target="_blank">link to your bug report</a>.<br/>Please copy the bug report link and submit it on the <a href="https://plus.google.com/110558071969009568835/posts/JLuG3yqRdSH" target="_blank">support forum</a>.'})}t()})});$("#logging-in").hide();$("#login-container").hide();$("#connect-android").click(e);$("#vysor-version").text("Vysor Version "+chrome.runtime.getManifest().version);$("#reload-vysor").click(function(){chrome.runtime.reload()});$("#share-all-check").change(function(){chrome.storage.local.set({"share-all-devices":this.checked});if(this.checked){startDeviceFarm(true,function(e,t){if(t){shortModal("Vysor Share Server",t);$("#share-all-check").prop("checked",false);return}updateVysorShareServer(e);var n=chrome.runtime.getManifest().name;shortModal("Copied "+n+" Share Server URL to clipboard.",e);copyTextToClipboard(e)})}else{stopDeviceFarm()}});chrome.storage.local.get("connect-automatically",function(e){var t=e["connect-automatically"]!==false;$("#connect-automatically-check").prop("checked",t)});$("#connect-automatically-check").change(function(){chrome.storage.local.set({"connect-automatically":this.checked})});$("#connect-android").hide();$("#tutorial").click(function(){o()});$("#purchase").click(function(){licenseManager.startPurchase()});chrome.storage.local.get("lastConnectAddress",function(e){if(e.lastConnectAddress)$("#connect-address")[0].value=e.lastConnectAddress});$("#connect-ok").click(function(){$("#connectModal").modal("hide");var e=$("#connect-address")[0].value;chrome.storage.local.set({lastConnectAddress:e});Adb.sendHostCommand("host:connect:"+e,function(e,t){if(!e)return;console.log("adb connect result",ab2str(t))})});$("#connect-cancel").click(function(){$("#connectModal").modal("hide")});$("#connect-network").click(function(){$("#connectModal").modal()});$("#purchase").click(function(){licenseManager.startPurchase()});$("#login").click(function(){$("#login-line").hide();$("#logging-in").show();getAuthToken(true,function(e){if(!e){shortModal(null,"Error retrieving auth token: "+chrome.runtime.lastError);$("#login-line").show();$("#logging-in").hide();return}$("#logging-in").hide();t();if(!licenseManager.isLicensed){licenseManager.refresh();return}if(!licenseManager.isLicenseCached){licenseManager.cacheLicense(true,function(e){if(e){shortModal(null,"Error saving license for offline use: "+e);$("#login-line").show();$("#logging-in").hide();return}$("#logging-in").hide();shortModal(null,"License was saved for offline use. Thanks!")})}})});function i(){chrome.storage.local.get(["vysorUsage"],function(e){var t=e.vysorUsage;if(!t)t=0;var n=t/(60*60*1e3);n=Math.round(n*2)/2;console.log("hours used",n);$("#used").html("You've used Vysor for "+n+" hours. Support Vysor. Go Pro.")});setTimeout(i,60*60*1e3)}n();i()});function i(e,t,n){return function(){if(!licenseManager.isLicensed){showModal({title:"Vysor Pro",body:"The "+e+" feature is only avaiable to Vysor Pro users.",okButton:"Upgrade",ok:function(){licenseManager.startPurchase()}});if(n)n.apply(this,arguments);return}t.apply(this,arguments)}}function r(e,t){var n=chrome.app.window.get(e);if(n&&n.contentWindow.showSettings){n.contentWindow.showSettings();n.show();return}loadDeviceSettings(e,function(n){var o=$("#settings-ok");var r=$("#settings-cancel");var a=$("#settings-defaults");var s=$("#new-display-name");s.prop("value",n.friendlyName);s.prop("placeholder",t);a.unbind("click");o.unbind("click");r.unbind("click");$(s).unbind("focus");$(s).unbind("keypress");$(s).bind("keypress",function(e){var t=e.which;if(t==13){c();return false}});function c(){$("#settings-modal").modal("hide");var o=$(s).prop("value");n.friendlyName=o;updateDeviceName(e,n.friendlyName||t);saveDeviceSettings(e,n)}o.click(c);a.click(function(){n=getDefaultDeviceSettings();applyDeviceSettings(n)});var l=t||friendlyName;$("#settings-title").text(l+" Settings");$("#softkeys-check").unbind("change");$("#pin-title-check").unbind("change");$("#always-on-top-check").unbind("change");$("#bitrate").unbind("change");$("#resolution").unbind("change");applyDeviceSettings(n);$("#softkeys-check").change(function(){n.showSoftKeys=this.checked});$("#pin-title-check").change(function(){n.pinTitleBar=this.checked});$("#always-on-top-check").change(i("Always On Top",function(){n.alwaysOnTop=this.checked},function(){this.checked=false}));$("#bitrate").change(i("Image Quality",function(){n.bitrate=this.selectedIndex},function(){this.selectedIndex=0}));$("#resolution").change(i("Image Quality",function(){n.resolution=this.selectedIndex},function(){this.selectedIndex=0}));$("#decoder").change(i("Image Quality",function(){n.decoder=this.selectedIndex},function(){this.selectedIndex=0}));$("#settings-modal").modal()})}var a={};function s(e,t,n,o,s,c,l,u,d,f,h){a=e;$("#share-all-check").prop("checked",u);if(Object.keys(e).length||!f)$("#not-found").hide();else $("#not-found").show();if(!d||f){$("#connect-android").show();$("#no-devices").hide()}else{$("#connect-android").hide();$("#no-devices").show()}if(!d){if(navigator.userAgent.indexOf("Windows NT 10")!=-1&&h==null){$("#adb-server-status").show();$("#adb-server-status").html("Windows 10 users MUST download the latest <a href='http://koush.com/post/universal-adb-driver' target='_blank'> Universal ADB Drivers</a>")}else{$("#adb-server-status").show();$("#adb-server-status").text("ADB not running. Click Find Devices to get started.")}}else{$("#adb-server-status").show();if(f){$("#adb-server-status").text("Using built-in Vysor ADB.")}else{$("#adb-server-status").text("Using Android SDK ADB binary.")}}var v=Object.keys(e);var g=Object.keys(o);$.each($(".vysor-device"),function(t,n){if(e[n.name])return;var i;$.each(g,function(e,t){var r=o[t];if(r.devices&&r.devices[n.name])i=true});if(!i)$(n).remove()});if(!v.length){var p=$("#devices").find("#no-vysor-devices");if(!p.length){p=$('<a id="no-vysor-devices" href="https://www.youtube.com/watch?v=Ucs34BkfPB0&feature=youtu.be" target="_blank"><div class="alert alert-danger">No devices found. Make sure Android USB Debugging is enabled.</div></a>');$("#devices").append(p)}if(!d||f){$("#choose-header").hide();p.hide()}}else{$("#no-vysor-devices").remove();$("#choose-header").show();$(v).each(function(n,o){if(t[o]&&t[o].farm)return;var u=e[o];var d=u.name;var f=$("#devices").find('.vysor-device[name="'+o+'"]');if(!f.length){f=$('<a class="list-group-item vysor-device"><button type="button" class="btn btn-sm device-settings btn-default"><i class="fa fa-gear" title="Device Settings"></i></button><button type="button" class="btn btn-sm wireless btn-default"><i class="fa fa-wifi" title="Go Wireless"></i></button><button type="button" class="btn btn-sm share btn-default">Share</button><button type="button" class="btn btn-sm btn-success">View</button><img class="avatar img-rounded"></img><h5 class="list-group-item-heading friendly-name"></h5><p class="list-group-item-text serialno"></p></a>');f[0].name=o;var h=f.find(".share");var v=f.find("img");v.click(function(e){e.stopPropagation();var t=s[o].userInfo;blobFromUrl(t.picture,function(e){shortModal("Vysor Share","Device in use by "+t.name)})});f.find(".wireless").click(i("Go Wireless",function(e){e.stopPropagation();startWireless(o)},function(e){e.stopPropagation()}));if(t[o]){$(h).removeClass("btn-default").addClass("btn-danger");h.text("Disconnect");h.click(function(e){e.stopPropagation();disconnectSharedDevice(o)})}else{$(h).removeClass("btn-danger").addClass("btn-default");h.click(i("Vysor Share",function(e){e.stopPropagation();toggleShare(o,function(e,t){if(t){shortModal("Vysor Share",t);return}copyTextToClipboard(e);var n=chrome.runtime.getManifest().name;shortModal("Copied "+n+" Share URL to clipboard",e);var i=l[o];if(i)closeWindow(i);closeWindow(o)})},function(e){e.stopPropagation()}))}$(f).find(".device-settings").click(function(e){e.stopPropagation();r(o,d)});f.click(function(){var e=a[o];if(e.status=="unauthorized"){shortModal(null,'Check your Android device and accept the "Allow USB Debugging" prompt. You may need to disconnect and reconnect your Android for the dialog to show.')}else if(e.status=="offline"){shortModal(null,"Your Android USB connection is offline. Please try rebooting your Android.")}else{function t(){tracker.sendEvent("click-device",d);var e=l[o];if(e)closeWindow(e);openWindow(o)}if(s[o]){showModal({title:"Android In Use",body:"This Android is currently shared. Do you want to end the share session?",okButton:"Unshare and View",ok:function(){var e=l[o];if(e)unshareDevice(e);unshareDevice(o);t()}});return}t()}});if(o.indexOf(":")!=-1)f.find(".wireless").hide();else f.find(".wireless").show();f.find(".serialno").text("Serial: "+o);$("#devices").append(f)}loadDeviceSettings(o,function(e){var t=e.friendlyName||d;if(u.status=="unauthorized")t="Unauthorized";if(u.status=="offline")t="Offline";updateDeviceName(o,t)});var g=c[o];if(g&&e[g])f.hide();else f.show();var h=f.find(".share");var v=f.find("img");if(s[o]&&s[o].userInfo&&s[o].userInfo.picture){var p=s[o].userInfo;v.attr("alt","Device in use by "+p.name);blobFromUrl(p.picture,function(e){v.attr("src",e)});v.show()}else{v.hide()}if(!t[o]){if(s[o])h.text("Unshare");else h.text("Share")}})}$.each($(".vysor-farm"),function(e,t){if(!o[t.name])$(t).remove()});$(g).each(function(e,t){var a=t;var s=i;if(a=="117634581230601031713"){s=function(e,t){return t}}t=o[t];if(!t.devices)return;var c=Object.keys(t.devices);if(!c.length)return;var l=$("#farms-list").find("#farm-list-"+a);if(!l.length){var u=$("<h5 class='list-header vysor-farm'>"+t.info.name+"'s Shared Devices <button class='btn btn-danger btn-xs' style='float: right;' type='button'>Disconnect</button></h5>");u[0].name=a;$("#farms-list").append(u);u.find("button").click(function(){destroyDeviceFarmConnection(a)});l=$("<div class='vysor-farm list-group'></div>");l[0].name=a;l.attr("id","farm-list-"+a);$("#farms-list").append(l)}$(c).each(function(e,o){var i=t.devices[o];var c=i.name;var u=c;var d;if(t.gcmConn.gcmConns[o])d="Serial: "+t.gcmConn.gcmConns[o].serialno;else d="Remote Serial: "+o;var f=$("#farms-list").find('.vysor-device[name="'+o+'"]');if(!f.length){f=$('<a class="list-group-item vysor-device"><button type="button" class="btn btn-sm device-settings btn-default"><i class="fa fa-gear" title="Device Settings"></i></button><button type="button" class="btn btn-sm connect"></button><button type="button" class="btn btn-sm btn-success">View</button><img class="avatar img-rounded"></img><h5 class="list-group-item-heading friendly-name"></h5><p class="list-group-item-text serialno"></p></a>');f[0].name=o;function h(e){if(t.sharedDevices&&t.sharedDevices[o]&&t.sharedDevices[o].userInfo){if(t.sharedDevices[o].userInfo.id==n.id){e();return}showModal({title:"Android In Use",body:"This Android is currently in use by "+g.name+". Do you want to boot them off?",okButton:"Connect Anyways",ok:e})}else{e()}}f.find(".device-settings").click(function(e){e.stopPropagation();r(o,c)});f.find(".connect").click(s("Vysor Share",function(e){e.stopPropagation();var n=t.gcmConn.gcmConns[o];if(n){closeWindow(n.serialno);n.destroy();f.find(".connect").text("Connect")}else{h(function(){f.find(".connect").text("Disconnect");createDeviceFarmConnection(a,o,function(e){quietSerial(e)})})}},function(e){e.stopPropagation()}));f.click(s("Vysor Share",function(e){h(function(){var e=t.gcmConn.gcmConns[o];if(e){openWindow(e.serialno)}else{f.find(".connect").text("Connect");openWindow(o);createDeviceFarmConnection(a,o,function(e){openWindow(e)})}})},function(e){e.stopPropagation()}));var v=f.find("img");v.click(function(e){e.stopPropagation();var n=t.sharedDevices[o].userInfo;shortModal("Vysor Share","Device in use by "+n.name)});loadDeviceSettings(o,function(e){var t=e.friendlyName||c;updateDeviceName(o,e.friendlyName||c)});f.find(".serialno").text(d);l.append(f)}var v=f.find("img");if(t.sharedDevices&&t.sharedDevices[o]&&t.sharedDevices[o].userInfo){var g=t.sharedDevices[o].userInfo;v.attr("alt","Device in use by "+g.name);blobFromUrl(g.picture,function(e){v.attr("src",e)});v.show()}else{v.hide()}if(t.gcmConn.gcmConns[o])f.find(".connect").text("Disconnect").removeClass("btn-default").addClass("btn-danger");else f.find(".connect").text("Connect").removeClass("btn-danger").addClass("btn-default")})})}chrome.notifications.onButtonClicked.addListener(function(e,t){if(e=="never-start-automatically"){$("#connect-automatically-check").prop("checked",false)}});sharedGlobals.refreshList=s})();function updateVysorShareServer(e){if(!e){$("#vysor-share-server-status").hide();$("#whitelist-count").hide()}else{$("#whitelist-count").show();getVysorWhitelistStatus(function(t){$("#whitelist-count a").text(t).click(function(t){chrome.app.window.create("whitelist.html",{id:"whitelist",innerBounds:{width:768,height:512,minWidth:768,minHeight:512}},function(t){t.onClosed.addListener(function(){updateVysorShareServer(e)})})})});$("#vysor-share-server-status").show();$("#vysor-share-server-status").html("Vysor is sharing your devices: "+'<a href="#">'+e+"</a>");var t=$("#vysor-share-server-status a");t.click(function(){copyTextToClipboard(e);var t=chrome.runtime.getManifest().name;shortModal("Copied "+t+" Share Server URL to clipboard.",e)})}}function findDeviceElement(e){return $('.vysor-device[name="'+e+'"]')}function updateDeviceName(e,t){var n=findDeviceElement(e);if(n)n.find(".friendly-name").text(t)}sharedGlobals.showModal=showModal;sharedGlobals.shortModal=shortModal;sharedGlobals.updateVysorShareServer=updateVysorShareServer;sharedGlobals.findDeviceElement=findDeviceElement;sharedGlobals.updateDeviceName=updateDeviceName;
