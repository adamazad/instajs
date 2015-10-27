/*========================================================= 
   InstaJS | Instagram feed with templating supprot
   Authoer | AdamA
   Version | v1.0
   License | MIT License
=========================================================*/
;(function($){
	
	"use strict";
	
	$.fn.instaJS = function(settings){
	// default settings
        var settings = $.extend({
            username     : null,        // a text string, username of Instagram
            accessToken  : null,        // a base64 (for security) string, required 
            limit        : 4,           // photos limit, default 4
            photoClass   : 'photo',  // Custom class for photo container, optional
            captionClass : 'caption', // Custom class for photo caption, optional
            template     : '<article class="{{photoClass}}">\
                                <a href="{{photo_link}}" title="View on Instagram">\
                                <img src="{{photo_url}}" alt="{{photo_caption}}"></a>\
                                <p class="{{caption_class}}">{{photo_caption}}</p>\
                            </article>'
        }, settings);

        /** FUNCTIONS **/        
        function get_feed(userid) {
           
                $.ajax({
                    url: 'https://api.instagram.com/v1/users/' + userid + '//media/recent/',
                    type: 'GET',
                    dataType: 'jsonp',
                    data: {
                        access_token : settings.accessToken,
                        count        : settings.limit
                    },
                    success: function(media){
                          $.each(media.data, function(i, media) {

                            photoWrapper = templating(media);
                            $(photoWrapper).appendTo(instaJSContainer);            

                          });
                          
                    },
                    error: function(e) {
                       console.log('InstaJS | something went wrong; get_feed::error');
                    }
                });                

        };

        function templating(media) {

            var temp = settings.template;

                temp = temp.replace( new RegExp('{{photoClass}}',    'gi'), settings.photoClass)
                           .replace( new RegExp('{{caption_class}}', 'gi'), settings.captionClass)
                           .replace( new RegExp('{{photo_link}}',    'gi'), media.link)
                           .replace( new RegExp('{{photo_url}}',     'gi'), media.images.standard_resolution.url)
                           .replace( new RegExp('{{photo_caption}}', 'gi'), media.caption.text);

            return temp;
        };

        function get_id(username) {

            return $.ajax({
                   	url: 'https://api.instagram.com/v1/users/search?q=' + username.toLowerCase(),
                   	type: 'GET',
                   	dataType: 'jsonp',
                       async: false,
                   	data: {
                           access_token : settings.accessToken,
                   	},
                   	success: function(search){
                           $.each(search.data, function(i, query){
                               if(query.username === username) {
                                  $('body').data('user-id', query.id);
                               }
                           });
                   	},
                   	error: function(e) {
                           console.log('InstaJS | something went wrong; get_id::error');
                   	}
                   });   

        };

        var instaJSContainer = $(this);

        if (typeof settings.username === 'undefined' || settings.username === null) {
            console.log('InstaJS | the username is requireed, please provide it'); 
            return false;
        }
        if (typeof settings.accessToken === 'undefined' || settings.accessToken === null) {
            console.log('InstaJS | 'an access token is requireed to access the API resource'); 
            return false;
        }
       
        $.when( get_id(settings.username) ).done( function(){
            get_feed($('body').data('user-id'));
        });


	};

})(jQuery);
