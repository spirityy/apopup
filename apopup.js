(function(){

    $.fn.apopup = function(options, callback) {

        if ($.isFunction(options)) {
            callback 		= options;
            options 		= null;
        }

        var o 				= $.extend({}, $.fn.apopup.defaults, options);

        var $popup 			= this
          , d 				= $(document)
          , w 				= $(window)
		  , vPos
          , hPos
		  , height
		  , width
		  , autoCloseObj;

      function triggerCall(func,arg){
			$.isFunction(func) && func.call($popup, arg);
      }

      function init() {
            triggerCall(o.onOpen);
            height = $popup.outerHeight(true),
            width = $popup.outerWidth(true);
            open();
        };

       	function calcPosition(){
            vPos	= o.position[1]!=='auto' ? o.position[1] : Math.max(0, ((w.height()- $popup.outerHeight(true)) / 2) - o.amsl);
			hPos    = o.position[0]!=='auto' ? o.position[0] : (w.width() - $popup.outerWidth(true)) / 2;
		};

        function open(){
			//MASK
            if (o.mask && !$('.apopup-mask').length) {
                $('<div class="apopup-mask"></div>').css({backgroundColor: o.maskColor, position: 'fixed', top: 0, right:0, bottom:0, left: 0, opacity: 0, zIndex: o.zIndex,opacity:o.opacity}).appendTo(o.appendTo);
            }

			// POPUP
            calcPosition();
            $popup.css({
                  'left':hPos
                , 'top':vPos
                , 'position': o.positionStyle
                , 'z-index': o.zIndex + 1
            }).addClass(o.className).each(function() {
                if(o.appending) {
                    $(this).appendTo(o.appendTo);
                    reposition();
                }
            });

            if(o.transition === 'fade'){ 
                $popup.fadeIn(o.speed)
            }else{
                $popup.show();
            }

            bindEvents();
            triggerCall(callback);
            triggerCall(o.onComplete);
            if(o.autoClose){
                autoCloseObj = setTimeout(close, o.autoClose);
            }
		};


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
                });
            }else{
                $popup.hide();
                triggerCall(o.onClose);
            }
            return false; // Prevent default
        };


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
        };

        function unbindEvents() {
            $('.apopup-mask').off('click');
            d.off('keydown.apopup');
            $('.'+o.closeClass).off('click', close).data('apopup', null);
        };

		function reposition(){
                calcPosition();
                //animateSpeed = animateSpeed || o.speed;
                $popup.each(function() {
                    $(this).css({ 'left': hPos, 'top': vPos });
                });
		};

        //PUBLIC
        $popup.close = function(){
            close();
        }

        $popup.reposition = function() {
            reposition();
        };

        return $popup.each(function() {
            init();
        });

    };


    $.fn.apopup.defaults = {
          amsl: 			0
        , appending: 		true
        , appendTo: 		'body'
        , className: 		'apopup'
		, autoClose:	    false
        , closeClass: 		'p-close'
        , escClose: 		true
        , mask: 			true
        , maskClose: 		true
        , maskColor: 		'#000'
        , opacity: 			0.7
        , position: 		['auto', 'auto']
        , positionStyle: 	'fixed'
		, transition:		false
		, transitionClose:	false
		, speed: 			250
        , zIndex: 			9997
        , onClose: 			false
        , onOpen: 			false
        , onComplete: 		false
    };

    $.atip = function(text,options, callback) {

        if(!text) return false;

        if ($.isFunction(options)) {
            callback 		= options;
            options 		= null;
        }

        var o 				= $.extend({}, $.atip.defaults, options);

        return $('<div>'+text+'</div>').apopup(o,callback);
    }

    $.atip.defaults = {
		autoClose:2000,
        mask:false,
        transition:'fade',
        transitionClose:true,
        className:'atip',
        onClose:function(){
            $(this).remove();
        }
    }

})()
