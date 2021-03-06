var groovie, gl;

$(document).ready(function(){
    $("html").click(function(){
        $("[class^='gl-'].focus").removeClass("focus");
    });    

    $(".fullscreen").fullscreen();
    $(".fill-parent").fillParent();
    taskbar();
    $(".gl-btn").click()//onClick();
    collections();
    $(".gl-float-title").addTitle();
    cards();
    inputs();
    $(".gl-acordion").addAcordion();
    pagers();
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

    function taskbar(){
        var elements = $(".gl-taskbar");
        if(elements.length > 1){
            for (var i = 1; i < elements.length; i++){
                elements.eq(i).remove()
            }
        }
        return elements.eq(0).addTaskbar();
    }

    function cards(){
        var elements = $(".gl-card, .gl-card-v, .gl-simple-card, .gl-simple-card-s");
        for(var i = 0; i < elements.length; i++){
            var element = elements.eq(i);
            if(element.hasClass("gl-card") || element.hasClass("gl-card-v"))
                element.addCard();
            else if(element.hasClass("gl-simple-card") || element.hasClass("gl-simple-card-s"))
                element.addSimpleCard();
        }
    }

    function inputs(){
        $(".gl-text").each(function(){
            $(this).addText();
        });

        $(".gl-file").each(function(){
            $(this).addFileInput();
        })

        $(".gl-dropdown").each(function(){
            $(this).addDropdown();
        });

        $(".gl-checkbox").each(function(){
            $(this).addCheckBox();
        });

        $(".gl-statebox").each(function(){
            $(this).addStateBox();
        });

        $(".gl-radiobtn").each(function(){
            $(this).addRadioBtn();
        });

        $(".gl-spinner").each(function(){
            $(this).addSpinner();
        });
    }

    function pagers(){
        $(".gl-num-pager, gl-dot-pager").each(function(){
            $(this).addPagger();
        });
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
        $window.resize(function(event){              
            element.css(type,$window.height());         
            var taskbar = $(".gl-taskbar");
            var taskH = 0;
            if(taskbar.length > 0){
                taskH = taskbar.eq(0).height();
            }
            
            element.css(type,$window.height()-taskH);
        }).resize();
    }

    /*
    *Fill Parent
    */
    $.fn.fillParent = function(){
        var $window = $(window);
        var $this = $(this);
        var parent = $this.parent();
        var siblings = $this.siblings();

        $window.resize(function(event){            
            var siblingHeight = 0;
            for($i = 0; $i < siblings.length; $i++){
                siblingHeight += siblings.eq($i).outerHeight(true);
            }

            $this.css({
                "min-height": parent.height() - siblingHeight
            });
        }).resize();        
    }

    /*
    *Tag Name
    */
    $.fn.tagName = function(upper = false){
        tagname = undefined;
        this.each(function(){
            tagname = this.tagName;
            if(!upper)
                tagname = tagname.toLowerCase();
        })

        return tagname;
    }

    /*
    *GetBackgroundColor
    */
    function getBackground(jqueryElement) {
        // Is current element's background color set?
        var color = jqueryElement.css("background-color");
        if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            // if so then return that color
            return color;
        }

        // if not: are you at the body element?
        if (jqueryElement.is("body")) {
            // return known 'false' value
            return false;
        } else {
            // call getBackground with parent item
            return getBackground(jqueryElement.parent());
        }
    }

    /*
    *isEmpty()
    */
    $.fn.isEmpty = function(){
        return ($(this).val() != "")? false : true;
    }

    /*
    *Cover imgae
    */
    $.fn.coverImg = function(){
        this.each(function(){              
            var $this = $(this);   
            var parent = $this.parent();    
            if($this.attr("data-naturalSize")){
                var data = JSON.parse($this.attr("data-naturalSize"));
                var naturalwidth = data.width, naturalheight = data.height;                
                var imgS = naturalwidth/naturalheight, parentS = parent.width()/parent.height();
                var _class = "tall";
                    if((parentS === 1 && imgS > 1) || (parentS < 1 && imgS > 1) || (parentS < imgS)) _class = "wide";

                $this.removeClass("tall wide").addClass(_class);
            }else{   
                $this.on("load",function(){
                    var naturalwidth = this.naturalWidth, naturalheight = this.naturalHeight;
                    var imgS = naturalwidth/naturalheight, parentS = parent.width()/parent.height();
                    var _class = "tall";
                    if((parentS === 1 && imgS > 1) || (parentS < 1 && imgS > 1) || (parentS < imgS)) _class = "wide";

                    $this.addClass(_class).attr("data-naturalSize", JSON.stringify({width:naturalwidth,height:naturalheight}));
                });
            }                
        })
    }

    /*
    *is Groovie element
    */
    $.fn.isGroovie = function(){
        var result = false;
        $class = $(this).attr("class");
        
        if($class != undefined){
            $class = $class.split(" ");
            for(var i = 0; i < $class.length; i++){
                if($class[i].match(/^(gl-)/g)){
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    $.fn.isTextInput = function(){
        if($(this).hasClass("gl-text"))
            return true;
        return false;
    }

    /**
     * Check if element is required
     */
    $.fn.isRequired = function(){
        if($(this).isGroovie() && $(this).hasClass("required") && !$(this).hasClass("disabled"))
            return true;
        return false;
    }

    /*
    *function to get element value data
    */
    $.fn.jqVal = $.fn.val;
    $.fn.val = function(data = null){
        var tag = $(this).tagName();
        if(tag !== "textarea" && tag !== "input" && tag !== "select" && tag !== "option"){ 
            value = undefined;            
            if($(this).isGroovie()){    
                value = $(this).glVal(data);
            }else if(value == undefined){
                if(typeof data !== "function" && data !== null)
                    ($(this).attr("data-value") !== undefined)? $(this).attr("data-value",data) : $(this).text(data); 
                value = (($(this).attr("data-value") !== undefined)? $(this).attr("data-value") : $(this).text());
            }
        }else{ 
            if(data !== null)
                $(this).jqVal(data);
            value = $(this).jqVal();
        }
        return value;
    }

    $.fn.glVal = function(data = null){
        var value = undefined;

        if($(this).hasClass("gl-text"))                                                   value = $(this).textVal(data);
        else if($(this).hasClass("gl-dropdown"))                                          value = $(this).dropdownVal(data);
        else if($(this).hasClass("gl-checkbox"))                                          value = $(this).checkboxVal(data);
        else if($(this).hasClass("gl-statebox"))                                          value = $(this).stateboxVal(data);
        else if($(this).hasClass("gl-radiobtn"))                                          value = $(this).radiobtnVal(data);
        else if($(this).hasClass("gl-file"))                                              value = $(this).fileInputVal(data);
        else if($(this).hasClass("gl-spinner"))                                           value = $(this).spinnerVal(data);
        else if($(this).hasClass("gl-num-pager") || $(this).hasClass("gl-dot-pager"))     value = $(this).pagerVal(data);

        return value;
    }

    /*
    *Check all required inputs are filled
    */
    $.fn.checkRequired = function(){
        var result = true;
        var form = ($(this).tagName() == "form")? $(this) : $(this).parents("form");
        var childrens = form.find(".required");
        childrens.each(function(){
            if($(this).isRequired()){
                if($(this).isEmpty()){
                    $(this).find(".alert").addClass("show");
                    result = false;
                }else $(this).find(".alert").removeClass("show");    
            }
        });

        return result;
    }


/*CUSTOM FUNCTIONS*/


/*CUSTOM EVENTS*/
    var attachEvent = document.attachEvent;
    /********************************resize event********************************/
        
    /********************************resize event********************************/

    /*******************************Click Function*******************************/
        var jQuery_click = $.fn.click;        
        $.event.special.Click = {
            setup: function(data){
                $(this).bind("click", function(event){
                    event.stopPropagation();

                    if($(this).tagName() === "a" || $(this).tagName() === "button" || ($(this).tagName() === "input" && ($(this).attr("type") === "submit")))
                        event.preventDefault();

                    if($(this).hasClass("gl-btn") || $(this).hasClass("gl-menu-btn")){   
                        event.preventDefault();                       
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
                if($(event.target).tagName() != "body" && $(event.target).tagName() != "html")
                    $(event.target).css("cursor","pointer"); 
                
                if($(event.target).tagName() === "a"){
                    setTimeout(function(){
                        window.location.href = $(event.target).attr("href");
                    }, 10)
                }
                
                var submit = ($(event.target).attr("type") !== undefined)? $(event.target).attr("type") : "";
                if(($(event.target).tagName() == "button" || $(event.target).hasClass("gl-btn") || $(event.target).hasClass("gl-menu-btn")) && (submit === "submit")){
                    $(event.target).parents("form").submit();
                }
            }
        };

        $.fn.click = function(callback){
            if($(this).tagName() != "body" && $(this).tagName() != "html")
                $(this).css("cursor","pointer");

            if(typeof callback == "function"){
                $(this).bind("Click",callback);
            }else{
                $(this).bind("Click",function(){});
            }

            return this;
        };

        var clickButtons = function(element,callback) {
            var _class = "clickedGl";
            var _opened = "openedGL";
            var timed = 400;
            if(((element.hasClass("gl-btn") || element.hasClass("gl-state-btn")) && !element.hasClass(_class)) && !element.hasClass("gl-disabled")){
                element.addClass(_class)

                var color = new Color(getBackground(element));

                var ascent = (element.attr("data-ascent") != undefined)? element.attr("data-ascent") : "";
                if(ascent == ""){
                    ascent = color.modifyColor(.75,1).hex;
                }
                               
                if(element.hasClass("gl-state-btn")){
                    if(!element.attr("data-bgcolor")){
                        element.attr("data-bgcolor",color.hex);
                    }
                    timed = 200;
                    element.toggleClass(_opened);
                    var _color = element.attr("data-bgcolor");
                    if(element.hasClass(_opened)) _color =  ascent;
                    element.transition({
                        "background-color" : _color
                    },200,"easeInOutQuad");
                    
                }else{
                    element.transition({
                        "background-color" :  ascent
                    },200,"easeInOutQuad").transition({
                        "background-color" : color.hex
                    },200,"easeInOutQuad");
                }

                setTimeout(function(){
                    element.removeClass(_class);
                    element.trigger("Click");
                },timed)
            }
        };

    /*******************************Click Function*******************************/

    /********************************CHARS COUNTER*******************************/
        $.fn.inputMaxlenght = function(){
            if($(this).tagName() == "input" || $(this).tagName() == "textarea"){
                
            }
        }
    /********************************CHARS COUNTER*******************************/

    /********************************HIDE ELEMENT********************************/
        $.fn.hide = function(time = 300){
            $(this).transition({
                "opacity" : 0
            }, time, "ease").transition({
                "display": "none",
                "delay" : time    
            }, 50, "ease");
        }
    /********************************HIDE ELEMENT********************************/

    /********************************SHOW ELEMENT********************************/
        $.fn.show = function(time = 300){
            $(this).css({
                "display": "",
                "opacity" : 0
            }).transition({ 
                "opacity" : 1,               
                "delay" : 50    
            }, time, "ease");
        }
    /********************************SHOW ELEMENT********************************/

    /*******************************ISHIDE ELEMENT*******************************/
        $.fn.isHide = function(){
            if($(this).css("display") === "none") return true;
            return false;
        }
    /*******************************ISHIDE ELEMENT*******************************/

    /************************************AJAX************************************/
        $.sendAjax = function(data,url,callback,method){
            var ajaxFunctions = {
                beforeSend: ((callback && ("beforeSend" in callback) && (typeof callback.beforeSend === "function"))? callback.beforeSend : function(){}),
                complete: ((callback && ("complete" in callback) && (typeof callback.complete === "function"))? callback.complete : function(){}),
                error: ((callback && ("error" in callback) && (typeof callback.error === "function"))? callback.error : function(){}),
                success: ((callback && ("success" in callback) && (typeof callback.success === "function"))? callback.success : function(){}),
            };

            $.ajax({
                url: url,
                method: (method && method != "")? method : "get",
                type: (method && method != "")? method : "get",
                data: data,        
                beforeSend: ajaxFunctions.beforeSend,
                complete: ajaxFunctions.complete,
                error: ajaxFunctions.error,
                success: ajaxFunctions.success
            });
        }

        $.fn.sendForm = function(callback){
            if($(this).tagName() === "form"){
                var ajaxFunctions = {
                    beforeSend: ((callback && ("beforeSend" in callback) && (typeof callback.beforeSend === "function"))? callback.beforeSend : function(){}),
                    complete: ((callback && ("complete" in callback) && (typeof callback.complete === "function"))? callback.complete : function(){}),
                    error: ((callback && ("error" in callback) && (typeof callback.error === "function"))? callback.error : function(){}),
                    success: ((callback && ("success" in callback) && (typeof callback.success === "function"))? callback.success : function(){}),
                };
                
                var data = new FormData(this[0]);
                data.append("ajax",true);
                
                $.ajax({
                    url: this.attr("action"),
                    method: this.attr("method"),
                    type: this.attr("method"),
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    beforeSend: ajaxFunctions.beforeSend,
                    complete: ajaxFunctions.complete,
                    error: ajaxFunctions.error,
                    success: ajaxFunctions.success
                });
                
            }else{
                console.error("the tag element must be an form");
            }
        };
    /************************************AJAX************************************/

/*CUSTOM EVENTS*/

/*****************************CUSTOM ELEMENTS*****************************/
    /********************************TASK BAR********************************/
        $.fn.addTaskbar = function(data = null){
            var item = $(this);
            if(!item.hasClass("gl-taskbar")) item.addClass("gl-taskbar");

            var timeFormat = "hh:mm", dateFormat = "MM/DD/Y", updateTime = 1000;
            if(typeof data =='object' && data != null){
                timeFormat = ("time_format" in data)? data.time_format : timeFormat;
                dateFormat = ("date_format" in data)? data.date_format : dateFormat;
                updateTime = ("update_time" in data)? data.update_time : updateTime;
            }else{
                timeFormat = (item.attr("data-time-format") != "")? item.attr("data-time-format") : timeFormat;
                dateFormat = (item.attr("data-date-format") != "")? item.attr("data-date-format") : dateFormat;
                updateTime = (item.attr("data-update-time") != "")? item.attr("data-update-time") : updateTime;
            }

            item.removeAttr("data-time-format data-date-format data-update-time");

            if(timeFormat != null || dateFormat != null){
                item.append("<div id='gl-taskbar-time'><span></span></div>");
                item.find("#gl-taskbar-time span").addClock(dateFormat+"&br;"+timeFormat, updateTime);
            }

            menu = item.children(".gl-menu-container");
            if(menu.length > 0){               
                for(var i = 1; i < menu.length; i++){
                    menu.eq(i).remove();
                }

                menu = menu.eq(0);
                var title = (menu.attr("data-title"))? menu.attr("data-title") : null;
                var img = (menu.attr("data-img"))? menu.attr("data-img") : null;
                
                if(title != null){
                    if(title.length > 48){
                        title = title.substr(0,46)+"...";
                    }

                    menu.prepend("<div class='header'><div><div class='img'><img src='"+img+"' alt='"+title+"' title='"+title+"'></div><div class='title'><p>"+title+"</p></div></div></div>")
                    menu.find(".img img").coverImg();

                    menu.removeAttr("data-img data-title");
                }

                item.prepend("<button class='gl-menu-btn gl-state-btn'><i class='gli-menu'></i></button>")
                item.children(".gl-menu-btn").click(function(){                 
                    height = (menu.height() <= 0)? 500 : 0;
                    menu.transition({
                            height: height+"px",
                            top: "-"+height+"px",
                        },300, "easeInOutQuad");
                    });
            }

            var actions = item.children(".actions");
            if(actions.length > 0){
                for(var i = 1; i < actions.length; i++){
                    actions.eq(i).remove();
                }
                actions = actions.eq(0);
                var btns = actions.children();
                btns.addClass("gl-btn");
                for(var i = 0; i < btns.length; i++){
                    if(btns.eq(i).children().length == 2){
                        btns.eq(i).addClass("labeled").html("<aside>"+btns.eq(i).html()+"</aside>");
                    }
                }
            }     

            $(window).resize();
        }
    /********************************TASK BAR********************************/

    /******************************CLOCK & DATE******************************/
        $.fn.addClock = function(format = "MM-DD-Y&br;HH:mm:ss", updateTime = 1000){
            var clock = new Date();
            $this = $(this);
            clock = clock.format(format);
            $this.prepend("<b class='clock'>"+clock.time+"</b>");
            $this.append("<b class='date'>"+clock.date+"</b>")
            setInterval(function(){
                clock = new Date();                
                clock = clock.format(format);
                $this.children("b.clock").text(clock.time);
                $this.children("b.date").text(clock.date);
            },updateTime)
        }
    /******************************CLOCK & DATE******************************/

    /*******************************ITEM COLL*******************************/
        $.fn.addIemColl = function(){
            var item = $(this);                
            if(item.hasClass("gl-coll-item") || item.hasClass("gl-coll-itemSpec")){
                var actions = item.children(".actions");

                if(actions.length == 1){
                    actions.prev().append("<button class='gl-coll-btn'><i class='gli-options'></i></button>")
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

                item.children().first().addBadge();
            }
            
            if(item.hasClass("gl-coll-itemSpec")){
                var item_content = item.children().first();
                var img = item_content.children("img");
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
            var item = {
                element: item,
                width: item.width(),
                height: item.height()
            }
            
            var action = {
                element: item.element.children(".actions"),
                width: item.element.children(".actions").width(),
                height: item.element.children(".actions").height(),
                outerWidth: item.element.children(".actions").outerWidth(true), 
                outerHeight: item.element.children(".actions").outerHeight(true)
            };   
            action.paddingWidth = action.outerWidth - action.width;
            action.paddingHeight = action.outerHeight - action.height;

            var content = {
                element: action.element.prev(),
                width: action.element.prev().width(),
                height: action.element.prev().height(),
                outerWidth: action.element.prev().outerWidth(true),
                outerHeight: action.element.prev().outerHeight(true),
            };  
            content.paddingWidth = content.outerWidth - content.width;
            content.paddingHeight = content.outerHeight - content.height;

            var shadow = "0px 3px 6px 0px rgba(0,0,0,0.25)";
            var new_width = 0, new_height = 0, border_radius = 0;

            content.element.width(content.width);
            item.element.css("z-index",3);

            if(item.element.hasClass("open")){
                item.element.removeClass("open");
                if(item.width > 350){
                    new_width = content.width + action.outerWidth;
                    new_height = content.outerHeight;                    
                }else{                    
                    new_width = content.width;
                    new_height = content.outerHeight;
                }

                ResizeSensor.detach(item.element);
                shadow = "0px 3px 6px 0px rgba(0,0,0,0)";
            }else{
                item.element.addClass("open")

                if(item.width > 350){
                    new_width = content.width - action.outerWidth;
                    new_height = content.outerHeight;
                    border_radius = "0 6px 6px 0";
                }else{
                    new_width = content.width;
                    new_height = item.height + action.outerHeight;
                    action.element.css({
                        width: item.width - action.paddingWidth,
                        bottom: 0,
                        left:0,
                        top: "auto",
                        right: "auto",
                    });
                    border_radius = "0 0 6px 6px";
                }     

                
                new ResizeSensor(item.element, function() {
                    width = (item.element.width() - content.paddingWidth);
                    if(content.outerWidth >= 350)
                        width -= action.outerWidth;
                    else
                        action.element.width(item.element.width() - action.paddingWidth);
                    
                    content.element.width(width);
                });           
            }
            
            setTimeout(function() {
                if(!item.element.hasClass("open")){
                    content.element.removeAttr("style");
                    item.element.removeAttr("style");
                    action.element.removeAttr("style");
                }
                content.element.children(".gl-coll-btn").removeClass("clicked");
            }, 300);
            item.element.transition({
                height: new_height+"px",
                "-webkit-box-shadow": shadow,
                "-moz-box-shadow": shadow,
                "box-shadow": shadow,
                "border-radius": border_radius,
            },300, "easeInOutQuad");
            content.element.transition({
                width: new_width+"px",
                "-webkit-box-shadow": shadow,
                "-moz-box-shadow": shadow,
                "box-shadow": shadow
            },300, "easeInOutQuad");
        }
    /*******************************ITEM COLL*******************************/

    /*********************************TITLES*********************************/
        $.fn.addTitle = function(){
            element = $(this);
            if(element.hasClass("gl-float-title")){
                for(var i = 0;i < element.length; i++){
                    var text = element.eq(i).text();
                    element.eq(i).html("<span>"+text+"</span>");
                }
            }
        }

    /*********************************TITLES*********************************/

    /********************************BADGES*********************************/
        $.fn.addBadge = function (prepend = true){
            element = $(this);
            value = element.attr("data-badge");

            if(isNaN(value) && value != undefined){
                value = (value.toUpperCase() == "NEW")? -1 : value;
            }
            if(!isNaN(value)){
                if(prepend)
                    element.prepend("<span class='gl-badge'>new</span>");
                else
                    element.append("<span class='gl-badge'>new</span>");

                if(value > 0)
                    element.updateBadge(value);
            }
            return element;
        }
        $.fn.updateBadge = function(value){
            element = $(this);
            badge = element.children(".gl-badge");
            if(badge.length > 0){
                if(badge.length > 1){  
                    for(var i = 1; i < badge.length; i++){
                        badge.eq(i).remove();
                    }
                }
                if(!isNaN(value)){
                    if(value > 0){
                        if(value >= 100){
                            value = "+99";
                        }
                        badge.eq(0).text(value);
                    }else{
                        badge.eq(0).remove();
                    }   
                }           
            }
        }
        $.fn.rmBadge = function(){
            element = $(this);
            badge = element.children(".gl-badge");
            if(badge.length > 0){  
                for(var i = 0; i < badge.length; i++){
                    badge.eq(i).remove();
                }
            }
        }
    /********************************BADGES*********************************/

    /*********************************CARDS*********************************/
        $.fn.addCard = function(style = "horizontal"){
            var item = $(this);
            if(!item.hasClass("gl-card") && !item.hasClass("gl-card-v")){
                item.addClass("gl-card"+((style == "vertical")?"-v":""));
            }
            
            var img = item.eq(0).children(".img");
            if(img.length > 0){
                if(img.length > 1){
                    for(var i = 1; i < img.length; I++){    
                        img.eq(i).remove();
                    }
                }
                
                var imgUrl = (img.eq(0).attr("data-img") != "")? img.eq(0).attr("data-img") : null;
                var imgAlt = (img.eq(0).attr("data-alt") != "")? img.eq(0).attr("data-alt") : "";

                if(imgUrl != null){
                    img.eq(0).append("<img src='"+imgUrl+"' alt='"+imgAlt+"'>").removeAttr("data-img data-alt");
                    img.children("img").eq(0).coverImg();  
                    item.addClass("has-img")
                }else if(item.hasClass("gl-card")){
                    img.eq(0).remove();                    
                    item.css("padding-top","58px");
                    img = false;
                }else{
                    img = false;
                }
            }else if(item.hasClass("gl-card")){
                item.css("padding-top","58px");
                img = false;
            }else{
                img = false;
            }

            if(!img){
                item.width(item.children(".body").width());
            }

            var header = item.eq(0).children(".header");
            if(header.length > 0){
                if(header.length > 1){
                    for(var i = 1; i < header.length; I++){    
                        header.eq(i).remove();
                    }
                }

                var title = (header.eq(0).attr("data-title") != "")? header.eq(0).attr("data-title") : null;
                var subtitle = (header.eq(0).attr("data-subtitle") != "")? header.eq(0).attr("data-subtitle") : "";
                if(title != null){
                    header.width(item.width());
                    header.eq(0).append("<h3 class='title'><span>"+title+"</span>"+subtitle+"</h3>")

                    var imgUrl = (header.eq(0).attr("data-img") != "")? header.eq(0).attr("data-img") : null;
                    var imgAlt = (header.eq(0).attr("data-alt") != "")? header.eq(0).attr("data-alt") : "";

                    if(imgUrl != null){
                        header.eq(0).prepend("<aside class='img'><img src='"+imgUrl+"' alt='"+imgAlt+"'></aside>").removeAttr("data-img data-alt");
                        var hImg = header.children(".img");
                        if(hImg.length > 1){
                            for(var i = 1;i < hImg.length; i++){
                                hImg.eq(i).remove();
                            }
                        }
                        hImg.eq(0).children("img").eq(0).coverImg();
                    }
                }else{
                    header.remove();
                    item.css("padding-top","10px");
                }

            }else{
                item.css("padding-top","10px");
            }

            //<h3 class="title"><span>Title</span>Sub title</h3>
        }

        $.fn.addSimpleCard = function(style = "large"){
            var item = $(this);
            if(!item.hasClass("gl-simple-card") && !item.hasClass("gl-simple-card-s")){
                item.addClass("gl-simple-card"+((style == "small")?"-s":""));
            }

            var img = item.eq(0).children(".img");
            if(img.length > 0){
                if(img.length > 1){
                    for(var i = 1; i < img.length; I++){    
                        img.eq(i).remove();
                    }
                }
                
                var imgUrl = (img.eq(0).attr("data-img") != "")? img.eq(0).attr("data-img") : null;
                var imgAlt = (img.eq(0).attr("data-alt") != "")? img.eq(0).attr("data-alt") : "";

                if(imgUrl != null){
                    img.eq(0).append("<img src='"+imgUrl+"' alt='"+imgAlt+"'>").removeAttr("data-img data-alt");
                    img.children("img").eq(0).coverImg();  
                    item.addClass("has-img")
                }else{
                    img.eq(0).html("<i class='gli-error'></i>")
                }
            }else{
                item.prepend("<aside class='img'><i class='gli-error'></i></img>")
            }

            var action = item.eq(0).children(".action");
            if(action.length > 0){
                for(var i = 1; i < action.length; I++){    
                    action.eq(i).remove();
                }
                
                action.width(item.width()-30);
            }
        }
    /*********************************CARDS*********************************/

    /******************************TEXT INPUT*******************************/
        $.fn.addText = function(){
            if(($(this).tagName() == "input" && ($(this).attr("type") == "text" || $(this).attr("type") == "password")) || $(this.tagName() == "textarea")){
                var $this = $(this);

                var container = $("<div class='gl-text'></div>");                
                var placeHolder = ($this.attr("placeHolder"))? "<span class='placeholder'>"+$this.attr("placeHolder")+"</span><hr>" : "";

                var input = $this.clone().removeClass("gl-text").removeAttr("placeHolder");
                var classList = input.attr("class");
                input.removeAttr("class");

                if(!input.isEmpty())
                    classList += " fill";
                if(input.attr("disabled"))
                    classList += " disabled";

                container.append(placeHolder);
                container.append(input).addClass(classList);
                $this.replaceWith(container);

                if(input.attr("required")){
                    container.addClass("required");
                    requireText = (input.attr("data-required") && input.attr("data-required") != "")? input.attr("data-required") : "This field is required.";
                    container.append("<aside class='alert'>"+requireText+"</aside>");
                    input.removeAttr("required data-required");
                }

                if(input.attr("maxlength") && Number(input.attr("maxlength")) != NaN){
                    container.append("<aside class='counter'><span>0</span>/"+ Number(input.attr("maxlength"))+"</aside>");
                    input.removeAttr("maxlength");
                    input.keyup(maxlength).keydown(maxlength).bind('paste',function() {
                        counter = $(this).siblings(".counter");
                        maxL = counter.text().split("/")[1];
                        $this = $(this);
                        setTimeout(function() { 
                            if($this.val().length >= maxL){
                                $this.val($this.val().substring(0,maxL));
                            }                            
                            counter.children("span").text($this.val().length);
                        },100);
                    });
                }

                function maxlength(event){
                    allowedKeys = [8,9,13,16,17,18,19,27,33,34,35,36,37,38,39,40,45,46,91,93,110,112,113,114,115,116,117,118,119,120,121,122,123,144,145,190]
                    counter = $(this).siblings(".counter");
                    maxL = counter.text().split("/")[1];
                    counter.children("span").text($(this).val().length);
                    selection = false;
                    if (typeof this.selectionStart == "number") {
                        selection = this.selectionStart < this.selectionEnd;   
                    }
                    
                    if(maxL <= $(this).val().length && allowedKeys.indexOf(event.keyCode) == -1 && !event.ctrlKey && !selection){
                        event.preventDefault();
                    }else if(event.ctrlKey && event.keyCode == 86){
                        if($(this).val().length >= maxL){
                            $(this).val($(this).val().substring(0,maxL));
                        }
                    }        
         
                }

                container.children().click(function(event){
                    event.stopPropagation();
                    parent = $(this).parent();
                    if(!parent.hasClass("disabled")){
                        if(!parent.hasClass("focus")) parent.addClass("focus");
                        parent.children("input, textarea").focus();
                    }
                });

                input.focus( function(event) { 
                    event.stopPropagation();
                    $(".focus").removeClass("focus");
                    $(this).parent().addClass("focus");

                    if($(this).parent().hasClass("required")){
                        $(this).siblings(".alert").removeClass("show");
                    }

                }).focusout(function(event){
                    event.stopPropagation();
                    $(".focus").removeClass("focus");
                    $(this).parent().removeClass("fill");
                    if(!$(this).isEmpty()){
                        $(this).parent().addClass("fill");
                    }else{
                        if($(this).parent().hasClass("required")){
                            $(this).siblings(".alert").addClass("show");
                        }
                    }
                });
            }
        }

        $.fn.textVal = function(data = null){
            $this = (this);
            if($this.hasClass("gl-text")){
                if(data != null){
                    $this.find("input, textarea").val(data);
                    if(!$this.find("input, textarea").isEmpty()){
                        $this.addClass("fill");
                    }else{
                        $this.removeClass("fill");
                    }
                }
                return $this.find("input, textarea").val();
            }
            return undefined;
        }

        
    /******************************TEXT INPUT*******************************/

    /******************************FILE INPUT*******************************/
        $.fn.addFileInput = function(){
            if($(this).tagName() == "input" && $(this).attr("type") == "file"){
                var $this = $(this);

                var text = ($(this).attr("data-default") !== undefined)? $(this).attr("data-default") : "Select a file...";
                var container = $("<div class='gl-file'></div>");
                var button = $("<button class='gl-btn'><i class='gli-add'></i></button>");
                var fileBody = $("<div>"+text+"</div>");

                container.prepend(button).append(fileBody).append($this.clone().removeAttr("class").css("display","none"));

                if($this.attr("required")){
                    container.addClass("required");
                    requireText = ($this.attr("data-required") && $this.attr("data-required") != "")? $this.attr("data-required") : "This field is required.";
                    container.append("<aside class='alert'>"+requireText+"</aside>");
                    $this.removeAttr("required data-required");
                }
                
                $this.replaceWith(container);
                
                var color = new Color(getBackground(button));
                button.attr("data-ascent", color.modifyColor(.5,1).hex);

                container.children("input[type='file']").change(function(){
                    $(this).parent().val();
                    if($(this).parent().hasClass("required")){
                        if($(this).parent().isEmpty()) $(this).parent().find(".alert").addClass("show");
                        else $(this).parent().find(".alert").removeClass("show");
                    }  
                });
                button.click(function(){
                    $(this).parent().children("input[type='file']").trigger("click");
                });
            }
        }

        $.fn.fileInputVal = function(data = null){
            $this = $(this);
            if($this.hasClass("gl-file")){
                if(data != null){
                    $this.find("div").get(0).lastChild.nodeValue = data;
                    return $this.find("input[type='file']").val(data);
                }else{
                    var value = $this.find("input[type='file']").val();                    
                    if(!$this.find("input[type='file']").isEmpty())         
                        $this.find("div").get(0).lastChild.nodeValue = value;
                    return value;
                }
            }
            return undefined;
        }

    /******************************FILE INPUT*******************************/

    /******************************DROP DOWN********************************/
        $.fn.addDropdown = function(){
            if(($(this).tagName() == "select")){
                var $this = $(this);
                var value = ($this.val() == "default")? undefined : $this.val();
                var text = (value != undefined)? $this.children().eq($this.prop("selectedIndex")).text() : $this.attr("data-default");
                var name = ($this.attr("name") !== undefined)? $this.attr("name") : "";
                var size = ($this.attr("size") !== undefined)? Number($this.attr("size")) : 6;                
                var placeHolder = ($this.attr("placeHolder"))? "<span class='placeholder'>"+$this.attr("placeHolder")+"</span>" : "";


                var options = $("<ul data-size='"+size+"'></ul>");
                var container = $("<div class='gl-dropdown'></div>").append(placeHolder);
                var button = $("<button class='title'><b>"+text+"</b><i class='gli-arrow-down'></i></button>");
                var select = $("<input type='hidden' name='"+name+"' value='"+value+"'>");

                $this.children("option").each(function(){
                    var $this = $(this);
                    var text = $this.text();
                    var disabled = ($this.attr("disabled") != undefined)? "disabled" : false;
                    var selected = ($this.attr("selected") != undefined)? "selected" : false;
                    var value = ($this.attr("value") != undefined)? $this.attr("value") : false;
                    var option = $("<li>"+text+"</li>");
                    if(disabled)
                        option.addClass(disabled);
                    if(selected)
                        option.addClass(selected);
                    if(value)
                        option.attr("data-value",value);
                    
                    if(value !== "default")
                        options.append(option);
                });

                $this.removeClass("gl-dropdown");
                if($this.attr("disabled")){
                    button.attr("disabled", "");
                    container.addClass("disabled");
                }

                container.addClass($this.attr("class")).attr("id",$this.attr("id")).append(button).append(options).append(select);

                if($this.attr("required")){
                    container.addClass("required");
                    requireText = ($this.attr("data-required") && $this.attr("data-required") != "")? $this.attr("data-required") : "This field is required.";
                    container.append("<aside class='alert'>"+requireText+"</aside>");
                    $this.removeAttr("required data-required");
                }

                $this.replaceWith(container);
                $this = container;

                options.children("li").click(function(event){
                    event.stopPropagation(); 
                    if(!$(this).hasClass("disabled")){
                        var value = $(this).val();
                        $(this).parents(".gl-dropdown").val(value);
                    }

                    
                    if($(this).parents(".gl-dropdown").hasClass("required")){
                        if($(this).parents(".gl-dropdown").isEmpty())$(this).parents(".gl-dropdown").find(".alert").addClass("show");
                        else $(this).parents(".gl-dropdown").find(".alert").removeClass("show");   
                    }
                });


                button.click(function(event){
                    event.stopPropagation();
                    var select = $(this).children("select");
                    select.focus();
                    toggle($(this).parent());
                }).focusin(function(event) { 
                    event.stopPropagation();
                    $(this).parent().addClass("focus");
                }).focusout(function(event){
                    event.stopPropagation();        
                    $(this).parent().removeClass("focus");
                    toggle($(this).parent());
                });
                
                function toggle(element){
                    var options = element.children("ul");
                    var size = (options.attr("data-size") !== undefined)? Number(options.attr("data-size")) : 6;
                    var transitions;

                    if(element.hasClass("focus")){
                        var length = options.children().length;
                        var multiply = (length > size)? size : length;
                        var height = options.css("line-height").replace("px","") * multiply;

                        var elementHeight = height + element.outerHeight() + element.offset().top;

                        if(elementHeight > $("body").height())
                            options.addClass("upper");

                        element.css("z-index","9999");
                        if(length > size){
                            options.css("overflow", "auto").scrollTop(0);
                        }   
                        
                        if(options.hasClass("upper")){                            
                            transitions = {
                                "height" : height+12,
                            }
                            options.css({
                                "bottom" : (element.outerHeight()-7)+"px"
                            });
                        }else{
                            transitions = {
                                "height" : height+12,
                            }
                            options.css({
                                "top" : (element.outerHeight()-7)+"px"
                            });
                        }                        
                        options.transition(transitions,300);
                    }else{
                        setTimeout(function(){
                            element.removeAttr("style");
                            options.removeAttr("style").removeAttr("class");
                        },380)  
                        setTimeout(function(){
                            if(options.hasClass("upper")){                            
                            transitions = {
                                "height" : 0,
                            }
                            }else{
                                transitions = {
                                    "height" : 0,
                                }
                            } 
                            
                            options.transition(transitions,300);        
                        },120);                                
                    }

                }
            }
        }

        $.fn.dropdownVal = function(data = null){
            $this = $(this);
            if($this.hasClass("gl-dropdown")){
                var values = $this.children("ul").children("li");
                if(data != null){

                    for(var i = 0; i < values.length; i++){    
                        if(data == values.eq(i).val()){
                            $this.children(".title").children().eq(0).val(values.eq(i).text());
                            return $this.children("input").val(data);
                        }
                    }

                    var $default = $this.children("ul").attr("data-default");
                    $default = ($default == undefined)? "undefined" : $default;
                    $this.children(".title").children("b").val($default);
                    $this.children("input").val("");

                }else{
                    for(var i = 0; i < values.length; i++){   
                        if($this.children("input").val() == values.eq(i).val()){
                            return $this.children("input").val();
                        }
                    }
                    return "";
                }
            }
            return undefined;
        }
    /******************************DROP DOWN********************************/

    /*******************************CHECK BOX*******************************/
        $.fn.addCheckBox = function(){
            $this = $(this);
            if($this.tagName() == "input" && $this.attr("type") == "checkbox"){
                var container = $("<div class='gl-checkbox'></div>");
                if($this.prop("checked")) container.addClass("checked");

                var input = $("<button class='action'><i class='gli-check'></i></button>");
                var text = ($this.attr("data-text") != undefined)? $this.attr("data-text") : false;
                if(text)
                    container.append("<span class='text'>"+text+"</span>");

                
                input.append($this.clone().removeAttr("class").css("display", "none").removeAttr("data-text"));
                container.prepend(input);
                $this.replaceWith(container);

                container.children(".text").click(function(event){
                    $(this).prev().trigger("click");
                });

                input.click(function(event){
                    var check = $(this).children("input[type='checkbox']");
                    checked = ($(this).parent().val())? true : false
                    $(this).parent().val(!checked);

                }).focusin(function(event){
                    $(this).parent().addClass("focus");
                }).focusout(function(event){
                    $(this).parent().removeClass("focus");
                });
            }
        }

        $.fn.checkboxVal = function(data = null){
            $this = $(this);
            if($this.hasClass("gl-checkbox")){
                check = $this.children(".action").children("input[type='checkbox']");
                if(typeof data === "boolean")
                    check.prop("checked",data);

                if(check.prop("checked"))
                    $(this).addClass("checked");
                else
                    $(this).removeClass("checked");

                return  (check.prop("checked"))? check.val() : false; 
            }
        };
    /*******************************CHECK BOX*******************************/

    /*******************************STATE BOX*******************************/
        $.fn.addStateBox = function(){
            $this = $(this);
            if($this.tagName() == "input" && $this.attr("type") == "checkbox"){
                var container = $("<button class='gl-statebox'></button>");
                if($this.prop("checked")) container.addClass("checked");
                
                container.append($this.clone().removeAttr("class").css("display", "none"));
                $this.replaceWith(container);

                container.click(function(event){
                    var checked = ($(this).val())? true : false;
                    $(this).val(!checked);
                }).focusin(function(event){
                    $(this).addClass("focus");
                }).focusout(function(event){
                    $(this).removeClass("focus");
                });
            }
        }

        $.fn.stateboxVal = function(data = null){
            $this = $(this);
            if($this.hasClass("gl-statebox")){
                check = $this.children("input[type='checkbox']");
                if(typeof data === "boolean")
                    check.prop("checked",data);
                
                if(check.prop("checked"))
                    $(this).addClass("checked");
                else
                    $(this).removeClass("checked");

                return  (check.prop("checked"))? check.val() : false; 
            }
        };
    /*******************************STATE BOX*******************************/

    /*******************************RADIO BTN*******************************/
        $.fn.addRadioBtn = function(){
            $this = $(this);
            if($this.tagName() == "input" && $this.attr("type") == "radio"){
                var container = $("<div class='gl-radiobtn'></div>");
                if($this.prop("checked")) container.addClass("checked");

                var input = $("<button class='action'></button>");
                var text = ($this.attr("data-text") != undefined)? $this.attr("data-text") : false;
                if(text)
                    container.append("<span class='text'>"+text+"</span>");

                
                input.append($this.clone().removeAttr("class").css("display", "none").removeAttr("data-text"));
                container.prepend(input);
                $this.replaceWith(container);

                container.children(".text").click(function(event){
                    $(this).prev().trigger("click");
                });

                input.click(function(event){
                    var check = $(this).parent().children("input[type='radio']");
                    var  checked = ($(this).parent().val())? true : false;
                    $(this).parent().val(!checked);

                }).focusin(function(event){
                    $(this).parent().addClass("focus");
                }).focusout(function(event){
                    $(this).parent().removeClass("focus");
                });
            }
        }

        $.fn.radiobtnVal = function(data = null){
            $this = $(this);
            if($this.hasClass("gl-radiobtn")){                
                var check = $this.children(".action").children("input[type='radio']");
                var group = $(this).parents("form").find(".gl-radiobtn [name='"+check.attr("name")+"']");
                group.parents(".gl-radiobtn").removeClass("checked");
                if(typeof data === "boolean")
                    check.prop("checked",data);
                
                if(check.prop("checked"))
                    $(this).addClass("checked");
                else
                    $(this).removeClass("checked");

                return  (check.prop("checked"))? check.val() : false; 
            }
        };
    /*******************************RADIO BTN*******************************/

    /********************************POPUPS*********************************/
        /*
         *popup show a dialog with minimun 1 actions maximun 3 actions
         */
        $.popup = function(title,body, _button1 = null, _button2 = null, _button3 = null){

            buttons = "";

            button1 = {text: ((_button1 != null && typeof _button1.title === 'string')? _button1.title : "Accept"), class: ((_button1 != null && typeof _button1.class === 'string')? _button1.class : ""), action: function(){
                    $(this).parents(".gl-popup").removePopup();
                    if(typeof _button1.action ==  "function") _button1.action($(this))
                }
            };
            
            buttons = "<button class='gl-btn "+button1.class+"'>"+button1.text+"</button>";

            if(_button2 != null){
                button2 = {text: ((_button2 != null && typeof _button2.title === 'string')? _button2.title : "Accept"), class: ((_button2 != null && typeof _button2.class === 'string')? _button2.class : ""), action: function(){
                        $(this).parents(".gl-popup").removePopup();
                        if(typeof _button2.action ==  "function") _button2.action($(this))
                    }
                };

                buttons += "<button class='gl-btn "+button2.class+"'>"+button2.text+"</button>";
            }

            if(_button3 != null){
                button3 = {text: ((_button3 != null && typeof _button3.title === 'string')? _button3.title : "Accept"), class: ((_button3 != null && typeof _button3.class === 'string')? _button3.class : ""), action: function(){
                        $(this).parents(".gl-popup").removePopup();
                        if(typeof _button3.action ==  "function") _button3.action($(this))
                    }
                };
                
                buttons += "<button class='gl-btn "+button3.class+"'>"+button3.text+"</button>";
            }

            html = "<aside class='gl-popup'>"+
                        "<div class='middle'>"+
                            "<div class='container'>"+
                                "<div class='header'>"+
                                    "<p>"+title+"</p>"+
                                    "<hr>"+
                                "</div>"+
                                "<div class='body'>"+
                                    "<p>"+body+"</p>"+
                                "</div>"+
                                "<div class='footer'>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</aside>"
            $("body").append(html);

            footer = $("body").find(".gl-popup > .middle > .container > .footer");
            footer.append(buttons);
            btns = footer.children(".gl-btn");

            for(i = 0; i < btns.length; i++){
                action = undefined;
                if(i == 0){
                    action = button1.action;
                }else if(i == 1){
                    action = button2.action;
                }else if(i == 2){
                    action = button3.action;
                }

                
                btns.eq(i).click(action);
            }

            $(".gl-popup").click(function(event){
                $(this).removePopup();
            });

            $(".gl-popup > .middle").find("*").click(function(event){
                event.stopPropagation();
            });

            setTimeout(function(){
                $("body").children(".gl-popup").addClass("show");
            },150);
        }

        $.fn.removePopup = function(){
            if($(this).hasClass("gl-popup")){
                $this = $(this);
                $this.removeClass("gl-popup show").addClass("gl-popup-rm");
                setTimeout(function(){
                    $this.remove();
                },350);
            }
        }
    /********************************POPUPS*********************************/

    /*******************************SPINNERS********************************/
        $.fn.addSpinner = function(){
            $this = $(this);

            if($this.tagName() == "input" && $this.attr("type") == "text"){
                var container = $("<div class='gl-spinner'></div>");
                var input = $this.clone();
                var value = (isNaN(input.val())? 0 : input.val());
                var actions = $("<button class='minus'><i class='gli-back'></i></button><input><button class='plus'><i class='gli-next'></i></button>")                
                var placeHolder = ($this.attr("placeHolder"))? "<span class='placeholder'>"+$this.attr("placeHolder")+"</span>" : "";

                input.removeClass("gl-spinner").removeAttr("placeHolder");
                container.addClass(input.attr("class")).attr("id", input.attr("id")); 
                input.removeAttr("class").removeAttr("id"); 

                input.mousedown(function(event){
                    event.preventDefault();
                }).keydown(function(event){
                    event.preventDefault();
                }).keyup(function(event){
                    event.preventDefault();
                });

                container.append(actions).prepend(placeHolder);
                container.find("input").replaceWith(input);
                $this.replaceWith(container);

                container.children("button").click(function(event){
                    var parent = $(this).parent();
                    var value = Number(parent.val());

                    if($(this).hasClass("minus")){
                        value -= 1;
                    }else if($(this).hasClass("plus")){
                        value += 1;
                    }

                    parent.val(value);
                }).mousedown(function(event){
                    $(this).addClass("active");
                }).mouseup(function(event){
                    $(this).removeClass("active")
                });
                container.val(value);
            }
        }

        $.fn.spinnerVal = function(data = null){
            $this = (this);
            if($this.hasClass("gl-spinner")){
                if(data != null){
                    data = (isNaN(data))? 0 : data;

                    if(data <= Number($(this).children("input").attr("data-min"))){
                        data = Number($(this).children("input").attr("data-min"));
                    }else if(data >= Number($(this).children("input").attr("data-max"))){
                        data = Number($(this).children("input").attr("data-max"))
                    }

                    $this.find("input").val(data);
                }
                return $this.find("input").val();
            }
            return undefined;
        }
    /*******************************SPINNERS********************************/

    /*******************************ACORDION********************************/
        $.fn.addAcordion = function(){
            $this = $(this);
            if($this.tagName() == "ul" && $this.find("li > h3, li > div").length >= 2){

                $this.children("li").each(function(){
                    if($(this).hasClass("open")){
                        var body = $(this).children("div").eq(0);
                        var height = 0;
                        var padding = 15;
                        body.children().each(function(){
                            height += $(this).height();
                        });
                        body.transition({
                            "height" : height+"px",
                            "padding-top" : padding+"px",
                            "padding-bottom" : padding+"px"
                        },300,"ease");

                        if($(this).parents(".gl-acordion").attr("data-mode") === "single"){
                            var opened = $(this).siblings(".open");
                            opened.removeClass("open");
                            opened.children("div").transition({
                                "height" : 0+"px",
                                "padding-top" : 0+"px",
                                "padding-bottom" : 0+"px",
                            },300,"ease")
                        }
                    }
                });

                $this.find("li > h3").click(function(event){
                    event.preventDefault();
                    var parent = $(this).parent();
                    parent.toggleClass("open");

                    var body = $(this).siblings("div").eq(0);
                    var height = 0;
                    var padding = 0;

                    if(parent.hasClass("open")){
                        padding = 15;
                        body.children().each(function(){
                            height += $(this).height();
                        });
                    }

                    body.transition({
                        "height" : height+"px",
                        "padding-top" : padding+"px",
                        "padding-bottom" : padding+"px"
                    },300,"ease")

                    if($(this).parents(".gl-acordion").attr("data-mode") === "single"){
                        var opened = parent.siblings(".open");
                        opened.removeClass("open");
                        opened.children("div").transition({
                            "height" : 0+"px",
                            "padding-top" : 0+"px",
                            "padding-bottom" : 0+"px",
                        },300,"ease")
                    }
                });

            }
        }
    /*******************************ACORDION********************************/

    /*******************************PAGERS*********************************/
        $.fn.addPagger = function(view = "number", type = "default"){
            var $this = $(this); 
            var isAjax = ($this.attr("data-ajax") !== undefined)? true : false;

            var next = {
                url : ($this.attr("data-nextUrl") != undefined)? $this.attr("data-nextUrl") : "#next",
                title : ($this.attr("data-nextTitle") != undefined)? $this.attr("data-nextTitle") : "next"
            } 
            var prev = {
                url : ($this.attr("data-prevUrl") != undefined)? $this.attr("data-prevUrl") : "#prev",
                title : ($this.attr("data-prevTitle") != undefined)? $this.attr("data-prevTitle") : "prev"
            }  

            var pages = {
                current: ($this.attr("data-page") != undefined)? $this.attr("data-page") : 1,
                last : ($this.attr("data-last") != undefined)? $this.attr("data-last") : 1
            }

            var container = $("<div class='container'></div>");
            var controls;
            
            if($this.hasClass("gl-num-pager") || $this.hasClass("gl-dot-pager"))
                view = ($this.hasClass("gl-num-pager")) ? "number" : "dot";
            else
                $this.addClass((view === "number")? "gl-num-pager" : "gl-dot-pager");
            
            if($this.attr("data-type") !== undefined)
                type = ($this.attr("data-type") === "min")? "min" : "default";
            else
                $this.attr("data-type",type);
            
            if(view === "number"){
                if(type === "min"){
                    controls = "<a class='previus' href='"+prev.url+"' title='"+prev.title+"'><i class='gli-previus'></i></a>"+
                               "<p class='display'><span class='current-page'></span>/<span class='max-page'>"+pages.last+"</span></p>"+
                               "<a class='next' href='"+next.url+"' title='"+next.title+"'><i class='gli-next'></i></a>";
                }
            }

            controls = $(controls);

            container.append(controls);
            $this.html("").append(container);
            $this.glVal(pages.current);

            if(isAjax){
                $this.find(".previus, .next").click(function(event){
                    event.preventDefault();
                    var $this = $(this);
                    var page = Number($this.siblings().children(".current-page").text());
                    var parent = $this.parents(".gl-num-pager");
                    if(parent.length == 0)
                        parent = $this.parents(".gl-dot-pager");

                    if($this.hasClass("next")) page++;
                    else if($this.hasClass("previus")) page--;

                    parent.glVal(page);
                    
                });
            }   
        }

        $.fn.pagerLast = function(last){
            $this = (this);
            if($this.hasClass("gl-num-pager") || $this.hasClass("gl-dot-pager")){
                last = (isNaN(last))? 1 : last;
                $this.find(".max-page").text(last);

                if(last <= 1)
                    $this.hide();
                else{
                    $this.show();
                }
            }
            return $(this);
        }

        function pagerToggleButton(element, page){
            $this = element;
            if($this.hasClass("gl-num-pager") || $this.hasClass("gl-dot-pager")){
                var maxPage = Number($this.find(".max-page").text());
                var margin = 0;
                var prev = $this.find(".previus");
                var next = $this.find(".next");

                if(page <= 1){
                    margin = prev.outerWidth(true);
                    prev.hide(300);

                    if(next.isHide()){
                        next.show(300);
                    }
                }else if(page >= maxPage){
                    margin = next.outerWidth(true);
                    next.hide(300);

                    if(prev.isHide()){
                        prev.show(300)
                    }
                }
            }
        }

        $.fn.pagerVal = function(data = null){
            $this = (this);
            if($this.hasClass("gl-num-pager") || $this.hasClass("gl-dot-pager")){
                if(data != null){
                    data = (isNaN(data))? 1 : data;

                    if(data <= 1){
                        data = 1;
                    }else if(data >= Number($this.find(".max-page").text())){
                        data = Number($this.find(".max-page").text());   
                    }

                    pagerToggleButton($this, data);

                    if($this.hasClass("gl-num-pager"))
                        $this.find(".current-page").text(data);
                }
                return Number($this.find(".current-page").text());
            }
            return undefined;
        }

        
    /*******************************PAGERS*********************************/

    /*******************************LOADING********************************/
        $.fn.loading = function(data){
            $this = $(this);
            var loading;

            var configs = {
                timer : 0,
                image : null,
                action : "show",
                color : null,
                opacity : 0.2
            }

            if(typeof data == "object"){
                for(var key in configs){
                    if(key in data)
                        configs[key] = data[key];
                }
            }

            if(configs.action !== "hide") {           
                loading = $("<div class='gl-load' style='display:none'><div class='container'><div class='loading'></div></div></div>");
                if(configs.image != null)
                    loading.find(".loading").css("background-image", "url("+configs.image+")");
                
                if(configs.color != null){
                    color = new Color(configs.color);
                    if(color != null){
                        loading.css("background-color","rgba("+color.rgb.r+","+color.rgb.g+","+color.rgb.b+","+configs.opacity+")")
                    }
                }

                var position = $this.css("position");
                if(position === "static"){
                    $this.css("position", "relative");
                }

                $this.append(loading);
                loading.show(150);

                if(configs.timer > 0){
                    setTimeout(function(){
                        console.log($this);
                        $this.loading({
                            action: "hide"
                        })
                    },configs.timer);
                }

            }else{
                loading = $this.find(".gl-load");
                loading.hide(150);
                setTimeout(function(){
                    loading.remove();
                },180)
            }

        }
    /*******************************LOADING********************************/


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
        *@param {string} color, parametro que recibe un string en los siguiente formatos
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

/**************************************************************************************/
/***********************************Date prototype JS**********************************/
/**************************************************************************************/

    /**
     * Date format able to format js date and time,
     * separate two format with two blanc spaces
     */
    Date.prototype.format = function(format){
        var format = format.split("&br;");
        return {date:this.formatDate(format[0]),time:this.formatTime(format[1])};
    }

    /**
     * Format Date values
     * DD -> Month Day 2 digits
     * D -> Month Day
     * DDD -> Month Day Text short
     * DDDD -> Month Day Text Full
     * MM -> Month Number 2 digits
     * M -> Month Number
     * MMM -> Month Name short
     * MMMM -> Month Name Long
     * Y -> Year
     * YY -> Year only 2 digits
     */
    Date.prototype.formatDate = function(formatDate){
        var date = "";
        var days = this.getDate();
        var month = this.getMonth()+1;
        var year = this.getFullYear();

        var formatChars = Array("DD","D","MM","M","YY","Y");
        for(var i = 0; i < formatChars.length; i++){
            if(formatDate.indexOf(formatChars[i]) > -1){
                if(formatChars[i] == "DD" || formatChars[i] == "D"){
                    days = (days < 10 && formatChars[i] == "DD")? "0"+days : days;                    
                    formatDate = formatDate.replace(formatChars[i],days);
                }else if(formatChars[i] == "MM" || formatChars[i] == "M"){
                    month = (month < 10 && formatChars[i] == "MM")? "0"+month : month;                    
                    formatDate = formatDate.replace(formatChars[i],month);
                }else if(formatChars[i] == "Y" || formatChars[i] == "YY"){
                    year += "";
                    year = (formatChars[i] == "YY")? year.substring(year.length,year.length - formatChars[i].length)  : year;  
                    year = (Number(year) < 10 && formatChars[i] != "Y")? "0"+year : year;

                    formatDate = formatDate.replace(formatChars[i],year);
                }
            }
        }

        return formatDate;         
    }

    /**
     * Format time values
     * HH -> 24 hours always 2 digit
     * H -> 24 hours
     * hh -> 12 hours 2 digits
     * h -> 12 hours
     * mm -> minutes 2 digit
     * m -> minutes
     * ss -> seconds 2 digits
     * s -> seconds
     */
    Date.prototype.formatTime = function(formatTime){
        var time = "";
        var h = this.getHours();
        var m = this.getMinutes();
        var s = this.getSeconds();
        var meridian = "";
        var formatChars = Array("HH","H","hh","h","mm","m","ss","s");

        for(var i = 0; i < formatChars.length; i++){
            if(formatTime.indexOf(formatChars[i]) > -1){

                if(formatChars[i] == "HH" || formatChars[i] == "H" || formatChars[i] == "hh" || formatChars[i] == "h"){
                    meridian = (formatChars[i] == "hh" || formatChars[i] == "h")? ((h > 12)? ".pm":".am") : "";
                    if((formatChars[i] == "hh" || formatChars[i] == "h") && h > 12) h = h - 12;
                    if((formatChars[i] == "HH" || formatChars[i] == "hh") && h < 10) h = "0"+h; 
                    formatTime = formatTime.replace(formatChars[i],h);
                }else if(formatChars[i] == "mm" || formatChars[i] == "m"){ 
                    m = (m < 10 && formatChars[i] == "mm") ? "0"+m : m;
                    formatTime = formatTime.replace(formatChars[i],m);
                }else if(formatChars[i] == "ss" || formatChars[i] == "s"){ 
                    s = (s < 10) ? "0"+s : s;
                    formatTime = formatTime.replace(formatChars[i],s);
                }
            }
        }
        
        formatTime += meridian;
        return formatTime; 
    }

    Date.prototype.incrementTime = function(seconds){
        var h = this.getHours();
        var m = this.getMinutes();
        var s = this.getSeconds();

        
        console.log("s:"+s);
        s += seconds;
        console.log("s1:"+s);
        if(s > 59){            
            s = s - 60;
            s = (s < 0)? 0 : s;
        }
        //this.setHours();
        console.log("s2:"+s);
    }
    
    
/**************************************************************************************/
/***********************************Date prototype JS**********************************/
/**************************************************************************************/
