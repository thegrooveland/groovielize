var groovie, gl;

$(document).ready(function(){

    $(".fullscreen").fullscreen();
    $(".gl-btn").click()//onClick();
    collections();
});

/*****************************CUSTOM ELEMENTS*****************************/
    function collections(){
        var elements = $(".gl-coll");
        for(var i = 0; i < elements.length; i++){
            var element = elements.eq(i);
            var items = element.find(".gl-coll-item, .gl-coll-itemSpec");
            for(var j = 0; j < items.length; j++){
                items.eq(j).addIemColl();
            }
        }
    }
/*****************************CUSTOM ELEMENTS*****************************/

(function($){

/*CUSTOM FUNCTIONS*/

    /*
    *fullscreen function
    */
    $.fn.fullscreen = function(){
        var $window = $(window);
        var element = $(this);
        var attr = element.attr("data-height");

        var type = ((attr == "min" || attr == "max")? attr+"-" : "" )+"height";
        
        element.css(type,$window.height());            
        $window.on("resize",function(event){
            element.css(type,$window.height());
        });
    }

    /*
    *Add new ELEMENTS
    */
    $.fn.Add = function(){

    }

/*CUSTOM FUNCTIONS*/


/*CUSTOM EVENTS*/
    var attachEvent = document.attachEvent;
    /********************************resize event********************************/
        $.fn.coverImg = function(){
            this.each(function(){
                var $this = $(this);
                var naturalwidth = this.naturalWidth, naturalheight = this.naturalHeight;
                $this.addClass((naturalwidth/naturalheight > 1)?"wide":"tall")
            })
        }
    /********************************resize event********************************/

    /*******************************Click Function*******************************/
        var jQuery_click = $.fn.click;        
        $.event.special.Click = {
            setup: function(data){
                $(this).bind("click", function(event){
                    event.stopPropagation();
                    event.preventDefault();
        
                    if($(this).hasClass("gl-btn")){
                        clickButtons($(this));
                    }else{
                        $(this).trigger('Click');
                    }            
                    
                });        
            },
            
            teardown: function(){
                $(this).unbind("click");
            },
            
            _default: function(event){
                $(event.target).css("cursor","pointer");        
            }
        };

        $.fn.click = function(callback){
            if(typeof callback == "function"){
                $(this).bind("Click",callback);
            }else{
                $(this).bind("Click",function(){});
            }
        };

        var clickButtons = function(element,callback) {
            var _class = "clickedGl";
            if((element.hasClass("gl-btn") || element.hasClass("groovie-btn")) && !element.hasClass(_class)){
                element.addClass(_class)
                var color = new Color(element.css("background-color"));

                var ascent = (element.attr("data-ascent") != undefined)? element.attr("data-ascent") : "";
                if(ascent == ""){
                    ascent = color.modifyColor(.75,1).hex;
                }
                setTimeout(function(){
                    element.removeClass(_class);
                },400)
                element.transition({
                    "background-color" :  ascent
                },200,"easeInOutQuad").transition({
                    "background-color" : color.hex
                },200,"easeInOutQuad")
            }
        };

    /*******************************Click Function*******************************/

/*CUSTOM EVENTS*/

/*****************************CUSTOM ELEMENTS*****************************/
    /*******************************ITEM COLL*******************************/
        $.fn.addIemColl = function(){
            var item = $(this);                
            if(item.hasClass("gl-coll-item") || item.hasClass("gl-coll-itemSpec")){
                var actions = item.children(".actions");

                if(actions.length == 1){
                    actions.prev().append("<button class='gl-coll-btn'>...</button>")
                    actions.children().addClass("gl-btn").click();
                    var btn = actions.prev().children(".gl-coll-btn");
                    btn.click(function(){
                        if(!$(this).hasClass("clicked")){
                            $(this).addClass("clicked");
                            var openitems = item.siblings(".open");
                            for(var i = 0; i < openitems.length; i++){
                                var openItem = openitems.eq(i);
                                toggleItem(openItem);
                            }
                            toggleItem(item);
                        }
                    });
                }
            }

            if(item.hasClass("gl-coll-itemSpec")){
                var item_content = item.children().first();
                var img = item_content.children("img");;
                if(img.length > 0){                    
                    element = "<div class='gl-coll-itemSpec-img'>"+img.eq(0).prop('outerHTML')+"</div>";
                    img.eq(0).replaceWith(element);
                    for(var i = 1; i < img.length; i++){
                        img.eq(i).remove();
                    }
                    img = item_content.children(".gl-coll-itemSpec-img");
                    img.children().coverImg();
                }
            }

        }

        function toggleItem(item){
            var item_content = item.children(".actions").prev();
            var action_width = item.children(".actions").outerWidth(true);
            var item_width = item_content.width();        
            var item_content_padding_margin = item_content.outerWidth(true)-item_content.width();
            var shadow = "0px 3px 6px 0px rgba(0,0,0,0.25)";

            item_content.width(item_width);
            item.css("z-index",3);

            if(item.hasClass("open")){
                item.removeClass("open");
                new_width = item_width + action_width;
                shadow = "0px 3px 6px 0px rgba(0,0,0,0)";
                ResizeSensor.detach(item);
            }else{
                item.addClass("open")
                new_width = item_width - action_width;
                new ResizeSensor(item, function() {
                    var item_width = item.width()-item_content_padding_margin;
                    item_content.width(item_width - item.children(".actions").outerWidth(true));
                });
            }

            setTimeout(function() {
                if(!item.hasClass("open")){
                    item_content.removeAttr("style");
                    item.removeAttr("style");
                }
                item_content.children(".gl-coll-btn").removeClass("clicked");
            }, 300);
            item.transition({
                "-webkit-box-shadow": shadow,
                "-moz-box-shadow": shadow,
                "box-shadow": shadow
            },300, "easeInOutQuad");
            item_content.transition({
                width: new_width+"px",
                "-webkit-box-shadow": shadow,
                "-moz-box-shadow": shadow,
                "box-shadow": shadow
            },300, "easeInOutQuad");
        }
    /*******************************ITEM COLL*******************************/
/*****************************CUSTOM ELEMENTS*****************************/

}(jQuery));

/**********************************************/
/******************TRANSITION******************/
/**********************************************/

    (function(t,e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e(require("jquery"))}else{e(t.jQuery)}})(this,function(t){t.transit={version:"0.9.12",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var e=document.createElement("div");var n={};function i(t){if(t in e.style)return t;var n=["Moz","Webkit","O","ms"];var i=t.charAt(0).toUpperCase()+t.substr(1);for(var r=0;r<n.length;++r){var s=n[r]+i;if(s in e.style){return s}}}function r(){e.style[n.transform]="";e.style[n.transform]="rotateY(90deg)";return e.style[n.transform]!==""}var s=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;n.transition=i("transition");n.transitionDelay=i("transitionDelay");n.transform=i("transform");n.transformOrigin=i("transformOrigin");n.filter=i("Filter");n.transform3d=r();var a={transition:"transitionend",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var o=n.transitionEnd=a[n.transition]||null;for(var u in n){if(n.hasOwnProperty(u)&&typeof t.support[u]==="undefined"){t.support[u]=n[u]}}e=null;t.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeInCubic:"cubic-bezier(.550,.055,.675,.190)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};t.cssHooks["transit:transform"]={get:function(e){return t(e).data("transform")||new f},set:function(e,i){var r=i;if(!(r instanceof f)){r=new f(r)}if(n.transform==="WebkitTransform"&&!s){e.style[n.transform]=r.toString(true)}else{e.style[n.transform]=r.toString()}t(e).data("transform",r)}};t.cssHooks.transform={set:t.cssHooks["transit:transform"].set};t.cssHooks.filter={get:function(t){return t.style[n.filter]},set:function(t,e){t.style[n.filter]=e}};if(t.fn.jquery<"1.8"){t.cssHooks.transformOrigin={get:function(t){return t.style[n.transformOrigin]},set:function(t,e){t.style[n.transformOrigin]=e}};t.cssHooks.transition={get:function(t){return t.style[n.transition]},set:function(t,e){t.style[n.transition]=e}}}p("scale");p("scaleX");p("scaleY");p("translate");p("rotate");p("rotateX");p("rotateY");p("rotate3d");p("perspective");p("skewX");p("skewY");p("x",true);p("y",true);function f(t){if(typeof t==="string"){this.parse(t)}return this}f.prototype={setFromString:function(t,e){var n=typeof e==="string"?e.split(","):e.constructor===Array?e:[e];n.unshift(t);f.prototype.set.apply(this,n)},set:function(t){var e=Array.prototype.slice.apply(arguments,[1]);if(this.setter[t]){this.setter[t].apply(this,e)}else{this[t]=e.join(",")}},get:function(t){if(this.getter[t]){return this.getter[t].apply(this)}else{return this[t]||0}},setter:{rotate:function(t){this.rotate=b(t,"deg")},rotateX:function(t){this.rotateX=b(t,"deg")},rotateY:function(t){this.rotateY=b(t,"deg")},scale:function(t,e){if(e===undefined){e=t}this.scale=t+","+e},skewX:function(t){this.skewX=b(t,"deg")},skewY:function(t){this.skewY=b(t,"deg")},perspective:function(t){this.perspective=b(t,"px")},x:function(t){this.set("translate",t,null)},y:function(t){this.set("translate",null,t)},translate:function(t,e){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(t!==null&&t!==undefined){this._translateX=b(t,"px")}if(e!==null&&e!==undefined){this._translateY=b(e,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var t=(this.scale||"1,1").split(",");if(t[0]){t[0]=parseFloat(t[0])}if(t[1]){t[1]=parseFloat(t[1])}return t[0]===t[1]?t[0]:t},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var e=0;e<=3;++e){if(t[e]){t[e]=parseFloat(t[e])}}if(t[3]){t[3]=b(t[3],"deg")}return t}},parse:function(t){var e=this;t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,n,i){e.setFromString(n,i)})},toString:function(t){var e=[];for(var i in this){if(this.hasOwnProperty(i)){if(!n.transform3d&&(i==="rotateX"||i==="rotateY"||i==="perspective"||i==="transformOrigin")){continue}if(i[0]!=="_"){if(t&&i==="scale"){e.push(i+"3d("+this[i]+",1)")}else if(t&&i==="translate"){e.push(i+"3d("+this[i]+",0)")}else{e.push(i+"("+this[i]+")")}}}}return e.join(" ")}};function c(t,e,n){if(e===true){t.queue(n)}else if(e){t.queue(e,n)}else{t.each(function(){n.call(this)})}}function l(e){var i=[];t.each(e,function(e){e=t.camelCase(e);e=t.transit.propertyMap[e]||t.cssProps[e]||e;e=h(e);if(n[e])e=h(n[e]);if(t.inArray(e,i)===-1){i.push(e)}});return i}function d(e,n,i,r){var s=l(e);if(t.cssEase[i]){i=t.cssEase[i]}var a=""+y(n)+" "+i;if(parseInt(r,10)>0){a+=" "+y(r)}var o=[];t.each(s,function(t,e){o.push(e+" "+a)});return o.join(", ")}t.fn.transition=t.fn.transit=function(e,i,r,s){var a=this;var u=0;var f=true;var l=t.extend(true,{},e);if(typeof i==="function"){s=i;i=undefined}if(typeof i==="object"){r=i.easing;u=i.delay||0;f=typeof i.queue==="undefined"?true:i.queue;s=i.complete;i=i.duration}if(typeof r==="function"){s=r;r=undefined}if(typeof l.easing!=="undefined"){r=l.easing;delete l.easing}if(typeof l.duration!=="undefined"){i=l.duration;delete l.duration}if(typeof l.complete!=="undefined"){s=l.complete;delete l.complete}if(typeof l.queue!=="undefined"){f=l.queue;delete l.queue}if(typeof l.delay!=="undefined"){u=l.delay;delete l.delay}if(typeof i==="undefined"){i=t.fx.speeds._default}if(typeof r==="undefined"){r=t.cssEase._default}i=y(i);var p=d(l,i,r,u);var h=t.transit.enabled&&n.transition;var b=h?parseInt(i,10)+parseInt(u,10):0;if(b===0){var g=function(t){a.css(l);if(s){s.apply(a)}if(t){t()}};c(a,f,g);return a}var m={};var v=function(e){var i=false;var r=function(){if(i){a.unbind(o,r)}if(b>0){a.each(function(){this.style[n.transition]=m[this]||null})}if(typeof s==="function"){s.apply(a)}if(typeof e==="function"){e()}};if(b>0&&o&&t.transit.useTransitionEnd){i=true;a.bind(o,r)}else{window.setTimeout(r,b)}a.each(function(){if(b>0){this.style[n.transition]=p}t(this).css(l)})};var z=function(t){this.offsetWidth;v(t)};c(a,f,z);return this};function p(e,i){if(!i){t.cssNumber[e]=true}t.transit.propertyMap[e]=n.transform;t.cssHooks[e]={get:function(n){var i=t(n).css("transit:transform");return i.get(e)},set:function(n,i){var r=t(n).css("transit:transform");r.setFromString(e,i);t(n).css({"transit:transform":r})}}}function h(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function b(t,e){if(typeof t==="string"&&!t.match(/^[\-0-9\.]+$/)){return t}else{return""+t+e}}function y(e){var n=e;if(typeof n==="string"&&!n.match(/^[\-0-9\.]+/)){n=t.fx.speeds[n]||t.fx.speeds._default}return b(n,"ms")}t.transit.getTransitionValue=d;return t});

/**********************************************/
/******************TRANSITION******************/
/**********************************************/

/**********************************************/
/*********************COLOR********************/
/**********************************************/
    /*
    *Clase Color.
        *Clase para gestionar las conversiones de colores en formato de string.
        *@color {string} parametro que recibe un string en los siguiente formatos
        *rgb(int r, int g, int, b), #RRGGBB, hsv(int h, int s, int v)
        *los valores r,g,b son del 0 al 255, h es de 0 a 359 y s,v son de 0 a 100
    */
    function Color(color){
        var color = color;
        this.hex = null;
        this.rgb = null;
        this.hsv = null;
        this.modifyColor = function(light,saturate){
            var rgb = hsvToRgb(this.hsv.h,light*100,saturate*100);
            var hex = rgbToHex(rgb.r,rgb.g,rgb.b);
            var hsv = rgbToHsv(rgb.r,rgb.g,rgb.b);
            return {'rgb': rgb, 'hex': hex, 'hsv': hsv};
        }

        if(color.match(/rgb/g)){
            var rgb = ((color.split("(")[1]).split(")")[0]).split(",");
            this.rgb = {
                'color': color,
                'r': Number(rgb[0]),
                'g' : Number(rgb[1]),
                'b' : Number(rgb[2])
            }
            this.hex = rgbToHex(this.rgb.r,this.rgb.g,this.rgb.b).toUpperCase();
            this.hsv = rgbToHsv(this.rgb.r,this.rgb.g,this.rgb.b);

        }else if(color.match(/\#/g)){
            this.hex = color;
            this.rgb = hexToRgb(this.hex);
            this.hsv = rgbToHsv(this.rgb.r,this.rgb.g,this.rgb.b);
        }else if(color.match(/hsv/g)){
            var hsv = ((color.split("(")[1]).split(")")[0]).split(",");
            this.hsv = {
                'color': color,
                'h': Number(hsv[0]),
                's' : Number(hsv[1]),
                'v' : Number(hsv[2])
            }
            this.rgb = hsvToRgb(this.hsv.h,this.hsv.s,this.hsv.v);
            this.hex = rgbToHex(this.rgb.r,this.rgb.g,this.rgb.b).toUpperCase();
        }

        function hexToRgb(hex){
            var r = parseInt(hex.substr(1,2),16);
            var g = parseInt(hex.substr(3,2),16);
            var b = parseInt(hex.substr(5,2),16);
            return {'color': "rgb("+r+","+g+","+b+")", 'r':r, 'g':g, 'b':b}; 
        }

        function rgbToHex(r,g,b){
            return "#"+((r < 10 )? "0" : "")+r.toString(16)+((g < 10 )? "0" : "")+g.toString(16)+((b < 10 )? "0" : "")+b.toString(16);
        }

        function rgbToHsv(r,g,b){
            r /= 255, g /= 255, b /= 255;

            var max = Math.max(r,g,b), min = Math.min(r,g,b);
            var h,s,v = max;
            var delta = max-min;
            s = (max == 0)? 0 : delta/max;

            if(max == min){
                h = 0;   
            }else{
                switch(max){
                    case r: h = (g-b)/delta+((g<b)? 6:0);break;    
                    case g: h = (b-r)/delta+2;break;
                    case b: h = (r-g)/ delta+4;break;   
                }
                h*=60;
                if(h < 0)
                    h += 360
            }     

            h = Math.round(h);
            s = Number(s.toFixed(2))*100;
            v = Number(v.toFixed(2))*100;       
            
            return {"color":"hsv("+h+","+s+","+v+")",'h':h,'s':s,'v':v};
        }

        function hsvToRgb(h,s,v){
            var r = 0,g = 0,b = 0;
            
            var h = ((h < 0)? 0 : ((h >= 360)? 359 : h));
            var s = ((s < 0)? 0 : ((s > 100)? 100 : s));
            var v = ((v < 0)? 0 : ((v > 100)? 100 : v));

            s/=100;
            v/=100;

            var C = v*s;
            var H = h/60;
            var X = C*(1-Math.abs(H%2-1));
            var m = v-C;

            if(H >= 0 && H <= 1){
                r = C;
                g = X;
            }else if(H >= 1 && H <= 2){
                r = X;
                g = C;
            }else if(H >= 2 && H <= 3){
                g = C;
                b = X;
            }else if(H >= 3 && H <= 4){
                g = X;
                b = C;
            }else if(H >= 4 && H <= 5){
                r = X;
                b = C;
            }else{
                r = C;
                b = X;
            }


            r = Math.round((r+m)*255);
            g = Math.round((g+m)*255);
            b = Math.round((b+m)*255);

            return {"color":"rgb("+r+","+g+","+b+")",'r':r,'g':g,'b':b};
        }
        
    }
/**********************************************/
/*********************COLOR********************/
/**********************************************/

/**************************************************************************************/
/*************************************ResizeSensor*************************************/
/**************************************************************************************/
    /**
     * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
     * directory of this distribution and at
     * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
     */
    (function (root, factory) { if (typeof define === "function" && define.amd) { define(factory); } else if (typeof exports === "object") { module.exports = factory(); } else { root.ResizeSensor = factory(); }}(this, function () { if (typeof window === "undefined") {return null;} var requestAnimationFrame = window.requestAnimationFrame ||window.mozRequestAnimationFrame ||window.webkitRequestAnimationFrame ||function (fn) {return window.setTimeout(fn, 20);}; function forEachElement(elements, callback){var elementsType = Object.prototype.toString.call(elements);var isCollectionTyped = ('[object Array]' === elementsType|| ('[object NodeList]' === elementsType)|| ('[object HTMLCollection]' === elementsType)|| ('[object Object]' === elementsType)|| ('undefined' !== typeof jQuery && elements instanceof jQuery)|| ('undefined' !== typeof Elements && elements instanceof Elements));var i = 0, j = elements.length;if (isCollectionTyped) {for (; i < j; i++) {callback(elements[i]);}} else {callback(elements);}} var ResizeSensor = function(element, callback) { function EventQueue() {var q = [];this.add = function(ev) {q.push(ev);};var i, j;this.call = function() {for (i = 0, j = q.length; i < j; i++) {q[i].call();}};this.remove = function(ev) {var newQueue = [];for(i = 0, j = q.length; i < j; i++) {if(q[i] !== ev) newQueue.push(q[i]);}q = newQueue;};this.length = function() {return q.length;};}function getComputedStyle(element, prop) {if (element.currentStyle) {return element.currentStyle[prop];}if (window.getComputedStyle) {return window.getComputedStyle(element, null).getPropertyValue(prop);}return element.style[prop];} function attachResizeEvent(element, resized) { if (element.resizedAttached) { element.resizedAttached.add(resized); return; } element.resizedAttached = new EventQueue(); element.resizedAttached.add(resized); element.resizeSensor = document.createElement('div'); element.resizeSensor.className = 'resize-sensor'; var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;'; var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;'; element.resizeSensor.style.cssText = style; element.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="' + style + '">' + '<div style="' + styleChild + '"></div>' + '</div>' + '<div class="resize-sensor-shrink" style="' + style + '">' + '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' + '</div>'; element.appendChild(element.resizeSensor);if (getComputedStyle(element, 'position') == 'static') {element.style.position = 'relative';}var expand = element.resizeSensor.childNodes[0];var expandChild = expand.childNodes[0];var shrink = element.resizeSensor.childNodes[1];var dirty, rafId, newWidth, newHeight;var lastWidth = element.offsetWidth;var lastHeight = element.offsetHeight;var reset = function() {expandChild.style.width = '100000px';expandChild.style.height = '100000px';expand.scrollLeft = 100000;expand.scrollTop = 100000;shrink.scrollLeft = 100000;shrink.scrollTop = 100000;};reset();var onResized = function() {rafId = 0;if (!dirty) return;lastWidth = newWidth;lastHeight = newHeight;if (element.resizedAttached) {element.resizedAttached.call();}};var onScroll = function() {newWidth = element.offsetWidth;newHeight = element.offsetHeight;dirty = newWidth != lastWidth || newHeight != lastHeight;if (dirty && !rafId) {rafId = requestAnimationFrame(onResized);}reset();};var addEvent = function(el, name, cb) {if (el.attachEvent) {el.attachEvent('on' + name, cb);} else {el.addEventListener(name, cb);}};addEvent(expand, 'scroll', onScroll);addEvent(shrink, 'scroll', onScroll);}forEachElement(element, function(elem){attachResizeEvent(elem, callback);}); this.detach = function(ev){ResizeSensor.detach(element, ev);};};ResizeSensor.detach=function(element,ev){forEachElement(element,function(elem){if(elem.resizedAttached&&typeof ev=="function"){elem.resizedAttached.remove(ev);if(elem.resizedAttached.length())return;} if(elem.resizeSensor){if(elem.contains(elem.resizeSensor)){elem.removeChild(elem.resizeSensor);} delete elem.resizeSensor;delete elem.resizedAttached;}});};return ResizeSensor;}));
/**************************************************************************************/
/*************************************ResizeSensor*************************************/
/**************************************************************************************/