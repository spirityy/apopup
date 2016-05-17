(function(){

    $.fn.apopup = function(options, callback) {

        if ($.isFunction(options)) {
            callback 		= options;
            options 		= null;
        }

        function triggerCall(func,arg){
          if($.isFunction(func)) func.call($popup, arg);
        }

        var o = $.extend({}, $.fn.apopup.defaults, options);

        var $popup = this,
            d = $(document) ,
            w = $(window) ,
            vPos ,
            hPos ,
            height ,
            width ,
            autoCloseObj;


        function getsize(){
            height = $popup.outerHeight(true);
            width = $popup.outerWidth(true);
            //calc new element size
            if(height === 0 || width ===0){
                var temp = $popup.clone().css({ position: 'absolute', visibility: 'hidden', display: 'block' }).addClass('temp-popup').addClass(o.className).appendTo('body');
                height = temp.outerHeight(true);
                width = temp.outerWidth(true);
                $('.temp-popup').remove();
            }
        }

        function init() {
            triggerCall(o.onOpen);
            getsize();
            open();
        }

       	function calcPosition(){
            getsize();
            vPos	= o.position[1]!=='auto' ? o.position[1] : Math.max(0, ((w.height()- height) / 2) - o.amsl);
            hPos    = o.position[0]!=='auto' ? o.position[0] : (w.width() - width) / 2;
    		}

        function open(){
          if (o.mask && !$('.apopup-mask').length) {
              $('<div class="apopup-mask"></div>').css({backgroundColor: o.maskColor, position: 'fixed', top: 0, right:0, bottom:0, left: 0, zIndex: o.zIndex,opacity:o.opacity||0}).appendTo(o.appendTo);
          }

          calcPosition();
          $popup.css({
            'left':hPos ,
            'top':vPos ,
            'position': o.positionStyle ,
            'z-index': o.zIndex + 1
            }).addClass(o.className).each(function() {
              if(o.appending) {
                  $(this).appendTo(o.appendTo);
              }
            });

            if(o.transition === 'fade'){
                $popup.fadeIn(o.speed);
            }else if(o.csstransition){
              $popup.show().addClass(o.csstransitionclass).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                $popup.removeClass(o.csstransitionclass);
              });
            }else{
                $popup.show();
            }
            bindEvents();
            triggerCall(callback);
            triggerCall(o.onComplete);
            if(o.autoClose){
                autoCloseObj = setTimeout(close, o.autoClose);
            }
  		    }


        function close() {
			      unbindEvents();
            if (o.mask) {
                $('.apopup-mask').remove();
            }
            // Clean up
      			clearTimeout(autoCloseObj);
      			// Close
            if(o.transitionClose){
                $popup.fadeOut(o.speed,function(){
                    triggerCall(o.onClose);
                    if(o.closeRemove) $popup.remove();
                });
            }else if(o.csstransitionClose){
                $popup.addClass(o.csstransitioncloseclass).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                    if ($('.apopup-mask')) $('.apopup-mask').remove();
                    $popup.removeClass(o.csstransitioncloseclass);
                    $popup.hide();
                    triggerCall(o.onClose);
                    if(o.closeRemove) $popup.remove();
                });
            }else{
                $popup.hide();
                triggerCall(o.onClose);
                if(o.closeRemove) $popup.remove();
            }
            return false; // Prevent default
        }

        function bindEvents() {
    			$('.'+o.closeClass).on('click', close);
          if (o.maskClose) {
              $('.apopup-mask').css('cursor', 'pointer').on('click', close);
          }
          if (o.escClose) {
              d.on('keydown.apopup', function(e) {
                  if (e.which == 27) {
                      close();
                  }
              });
          }
        }

        function unbindEvents() {
            $('.apopup-mask').off('click');
            d.off('keydown.apopup');
            $('.'+o.closeClass).off('click', close).data('apopup', null);
        }

    		function reposition(){
            calcPosition();
            $popup.css({ 'left': hPos, 'top': vPos });
    		}

        //PUBLIC
        $popup.close = function(){
            close();
        };

        $popup.reposition = function() {
            reposition();
        };

        return $popup.each(function() {
            init();
        });

    };

    $.fn.apopup.defaults = {
        amsl:0,
        appending:true,
        appendTo:'body',
        className:'apopup',
        autoClose:false,
        closeClass:'p-close',
        escClose:true,
        closeRemove:false,
        mask:true,
        maskClose:true,
        maskColor:'#fff',
        opacity:0.6,
        position:['auto', 'auto'],
        positionStyle:'fixed',
        csstransition:true,
        csstransitionClose:false,
        csstransitionclass:'zoom-in',
        csstransitioncloseclass:'zoom-out',
		    transition:false,
		    transitionClose:false,
		    speed:250,
        zIndex:9997,
        onClose:false,
        onOpen:false,
        onComplete:false
    };

    $.atip = function(text,options, callback) {

        if(!text) return false;

        if ($.isFunction(options)) {
          options.onClose = options;
        }else if($.isFunction(callback)){
          options.onClose = callback;
        }

        var o = $.extend({}, $.atip.defaults, options);

        return $('<div>'+text+'</div>').apopup(o);
    };

    $.atip.defaults = {
        position:['auto', 60],
		    autoClose:1000,
        mask:false,
        csstransition:true,
        csstransitionClose:true,
        csstransitionclass:'move-in',
        csstransitioncloseclass:'move-out',
        className:'atip',
        closeRemove:true
    };

    $.atip.success = function(text,options,callback){
      $.atip(text,options,callback).addClass('success-tip');
    };

    $.atip.error = function(text,options,callback){
      $.atip(text,options,callback).addClass('error-tip');
    };

})();
