'use strict()';

/* 
** Show or hide sidebar menu on mobile screens.
** works by clicking the hamburger menu on mobile
*/
function ToggleMenu(menuBtn, navElem) {
    this.menuBtn = menuBtn;
    this.navElem = navElem;
    this.navVisible = false;
    tSelf = this;
    this.playhead = new TimelineMax({paused: true, yoyo: true});
    this.init();
}

//Initialize ToggleMenu Class {Constructor}

ToggleMenu.prototype.init = function(){
    var navElemHeight = this.navElem.innerHeight(), // Full height of Nav element 
        navListContainer = this.navElem.find("ul"),
        navLists = this.navElem.find("li");

    //Set Nav element to zero height opacity, animate to full height, then fade each individual link element into view
    this.playhead.set(tSelf.navElem, {height: "0px", overflow: "hidden"})
        .set(navListContainer, {autoAlpha: 0})
        .set(navLists, {autoAlpha: 0})
        .to(tSelf.navElem, 0.6, {display: "block", height: navElemHeight + "px", force3D: true, ease: Expo.easeOut})
        .to(navListContainer, 0.6, {autoAlpha: 1})
        .staggerTo(navLists, 0.6, {autoAlpha: 1}, 0.1, "-=1");

    //Click handler for button
    this.menuBtn.on('click', this.showHideMenu);
};

/*
** Show or hide Nav element, depending on the visibility of the Nav Element
*/
ToggleMenu.prototype.showHideMenu = function() {
   if (tSelf.navVisible === false) {
        tSelf.showMenu();
   } else {
        tSelf.hideMenu();
   }

   tSelf.navVisible = !tSelf.navVisible;
};

// Reset timeline playhead animate the Nav element into view
ToggleMenu.prototype.showMenu = function() {
    this.playhead.timeScale(1);
    this.playhead.play();
};

// Speedup timeline's playhead and hide Nav element from view
ToggleMenu.prototype.hideMenu = function() {
    this.playhead.timeScale(4);
    this.playhead.reverse();
};


/*
** Service Class
** Loads a new Service item in the Service page and displays it.
** Loads elements with JSON and insert them into an overlay view.
*/
function Service() {
    // The Service Overlay element 
    this.el = $(".service-overlay");

    // Get clicked service link
    this.links = $(".services").find(".container").find("a");
    this.linkIndex = 0;
    
    // Animation timeline playhead
    this.playHead = new TimelineMax({paused: true, yoyo: true});

    // Overlay nagivation elements
    this.prevElem = this.el.find(".arrow-left");
    this.nextElem = this.el.find(".arrow-right");
    this.closeElem = this.el.find(".close");

    // Visibility state of Services Overlay
    this.visible = false;
    self = this;
    
    // Initialize Initializer
    this.init();

}


/** Services Initializer
**  Fades the Overlay element into view and initialize animation timeline
**/
Service.prototype.init = function(){
    var overlayImage = this.el.find(".overlay_image"),
        overlayText = this.el.find(".overlay_text"),
        overlayNavs = this.el.find('.overlay_arrows .arrow');

    this.playHead.set(this.el, {display: "block", xPercent: "100%", autoAlpha: 0, onReverseComplete: function(){self.visible=false; self.resetPlayHead();}})
                  .set(overlayImage, {yPercent: "50%", autoAlpha: 0})
                  .set(overlayText, {yPercent: "20%", autoAlpha: 0})
                  .set(overlayNavs, {autoAlpha: 0})
                  .set(self.closeElem, {autoAlpha: 0})
                  .to(".services .container", 1, {className: "+=gray"})
                  .to(this.el, 1, {xPercent: "0%", autoAlpha: "1", force3D: true, ease: Expo.easeInOut})
                  .to(overlayImage, 0.8, {yPercent: "0%", autoAlpha: "1", force3D: true, ease: Expo.easeOut})
                  .to(overlayText, 1, {yPercent: "0%", autoAlpha: "1", force3D: true, ease: Expo.easeOut})
                  .staggerTo(overlayNavs, 1, {autoAlpha: 1, force3D: true, ease: Power4.easeOut}, 0.5)
                  .to(self.closeElem, 0.3, {autoAlpha: "1", force3D: true, ease: Quad.easeOut}, 1);


    // Event handlers for navigation elements

    // Trigger Previous Service Event
    this.prevElem.on('click', function(){
        $(window).trigger('servicePrev');
    });

     // Trigger Next Service Event
    this.nextElem.on('click', function(){
        $(window).trigger('serviceNext');
    });

    // Trigger Close Service Event
    this.closeElem.on('click', function(){
        $(window).trigger('serviceClose');
    });

    // Fulfill Prev Service trigger
    $(window).on('servicePrev', function() {
        self.prev();
    });

    // Fulfill Next Service trigger
    $(window).on('serviceNext', function(){
        self.next();
    });

    // Fulfill Close Service trigger
    $(window).on('serviceClose', function(){
        self.playHead.timeScale(3);
        self.close();
    });

    /*
    ** Enable keys for navigation
    ** Close Overlay if Esc key is pressed
    ** Go to next Service if Forward and Down Key is pressed
    ** Go to previous Service if Up and Back Key is pressed
    */
    $(window).on('keydown', function(e) {
        if (self.isVisible()) {
            if (e.which == 27) {
                $(window).trigger('serviceClose');
            }
            if (e.which == 37) {
                $(window).trigger('servicePrev');
            }
            if (e.which == 38) {
                $(window).trigger('servicePrev');
            }
            if (e.which == 40) {
                $(window).trigger('serviceNext');
            }
            if (e.which == 39) {
                $(window).trigger('serviceNext');
            }
        }

        e.preventDefault();
    });
};

Service.prototype.prev = function() {
    this.setIndex(this.linkIndex-1);
    this.load("", this.linkIndex);
};

Service.prototype.next = function() {
    this.setIndex(this.linkIndex+1);
    this.load("", parseInt(this.linkIndex));
};

Service.prototype.close = function() {
    this.playHead.reverse();
};

Service.prototype.isVisible = function() {
  return this.visible;
};

Service.prototype.show = function() {
  if (!this.isVisible()) {
     this.playHead.play();
     this.visible = true;
  }
};

Service.prototype.resetPlayHead = function() {
  this.playHead.timeScale(1);
};

Service.prototype.setIndex = function(index) {
  var linksLength = this.links.length;

  if (index < 0) { this.linkIndex = linksLength - 1; }
  else if (index > linksLength - 1) { this.linkIndex = 0; }
  else { this.linkIndex = index; }
};

Service.prototype.load = function(elem, index) {
  if(elem) {
    this.setIndex(elem.index());
  } else {
    this.setIndex(index);
  }

  $elem = this.links.parent().find('a:eq('+this.linkIndex+')');

  if (!this.isVisible()) { self.show(); }

  // Disable scroll on body
  this.setIndex($elem.index());
  
  var elemHREF = $elem.attr('href');

  $.ajax({
    url: elemHREF
  }).done(function(data){
      self.replaceContent(data);
  });
};

Service.prototype.replaceContent = function(data) {
  $(".overlay_image").find(".col").fadeOut(500, function(){
    $(this).html('<img src="' + data.image + '" alt="'+data.title+'">').fadeIn();
  });
  $(".overlay_text_main_heading").fadeOut(500, function(){
    $(this).html(data.title).fadeIn();
   });
  $(".overlay_text_main_body").fadeOut(500, function(){
    $(this).html(data.text).fadeIn();
  });
  
};

function SignupsOverlay() {
  this.el = $(".login-overlay");
  this.closeBtn = this.el.find('.close');
  this.signIn = this.el.find('.sign-in');
  this.signInBtn = this.el.find('.signInBtn');
  this.signUp = this.el.find('.sign-up');
  this.signUpBtn = this.el.find('.signUpBtn');
  this.retrievePassBtn = this.el.find('.retrievePassBtn');
  this.retrievePassCont = this.el.find('.password-forgot');
  this.playHead = new TimelineMax({paused: true});
  this.rt = new TimelineMax({paused: true});
  this.sut = new TimelineMax({paused: true});
  this.loginForm = $(".login-form");
  this.forgotPasswordForm = $(".forgot-password-form");
  this.signUpForm = $('.sign-up-form');
  this.init();
  SOSelf = this;
}

SignupsOverlay.prototype.init = function() {
  this.loginForm.prop("disabled", true);

  this.playHead.set(this.el, {display: "block"})
          .from(this.el, 1, {autoAlpha: 1, yPercent: "-100%", force3D: true, ease:Expo.easeOut});

  this.rt.set(this.retrievePassCont, {display: "block"})
          .from(this.retrievePassCont, 1, {autoAlpha: 1, xPercent: "100%", force3D: true, ease:Expo.easeOut});

  this.sut.set(this.signUp, {display: "block"})
          .from(this.signUp, 1, {autoAlpha: 1, xPercent: "100%", force3D: true, ease:Expo.easeOut});

  this.closeBtn.on('click', function(){
    SOSelf.close();
  });

  this.retrievePassBtn.on('click', function(e){
    SOSelf.retrievePassOpen();

    e.preventDefault();
  });

  this.signUpBtn.on('click', function(e){
    SOSelf.signUpOpen();

    e.preventDefault();
  });

  this.signInBtn.on('click', function(e){
    SOSelf.signInOpen();

    e.preventDefault();
  });

  this.loginForm.on('submit', function(e){
      var param = {};
      param.email = $(this).find(".email").val();
      param.password = $(this).find('.password').val();
      param.mode = "login";
      var lF = $.post("http://www.garmentcareltd.com/testsite/functionality.php", param, function (data){
      }).done(function(data){
        data = $.trim(data);
        //console.log(data);
        if (data == "-2") {
          document.location.href = "http://www.garmentcareltd.com/testsite/dashboard.php";
        } else if (data == "0" ) {
          SOSelf.loginForm.find('.error').html('<strong>Invalid Login Details.</strong> Please use your correct email and password.').addClass('show');
        } else if (data == "-1") {
          SOSelf.loginForm.find('.error').html('<strong>Sorry, your account has been disabled.</strong>').addClass('show');
        }
      });

      e.preventDefault();
  });

  this.forgotPasswordForm.on('submit', function(e) {
    var param = {};
    param.email = $(this).find('.email').val();
    param.mode = "forgotPassword";


    var fPP = $.post("http://www.garmentcareltd.com/testsite/functionality.php", param, function (data){
      }).done(function(data){
        data = $.trim(data);
        console.log(data);
        if (data == "-1") {
          SOSelf.forgotPasswordForm.find('.error').html("<strong>A new password has been emailed to you. <br> Please follow the instructions to reset your password</strong>");
        } else if (data == "-2" ) {
          SOSelf.forgotPasswordForm.find('.error').html('<strong>Sorry.</strong> There is no account with that email address. <br>Signup for a new account').addClass('show');
        } else if (data == "0") {
          SOSelf.forgotPasswordForm.find('.error').html('<strong>There was an issue sending a new password to your email box. Please try again, or contact us if this error persists</strong>').addClass('show');
        } else {
          SOSelf.forgotPasswordForm.find('.error').html('<strong>There was an issue sending a new password to your email box. Please try again, or contact us if this error persists</strong>').addClass('show');
        }
      });

      e.preventDefault();
  });

this.signUpForm.on('submit', function(e) {
    var param = {};
    param.name = $(this).find('.fname').val();
    param.lname = $(this).find('.lname').val();
    param.email = $(this).find('.email').val();
    param.password = $(this).find('.pword').val();
    param.mobile = $(this).find('.phone').val();
    param.mode = "register";


    var fPP = $.post("http://www.garmentcareltd.com/testsite/functionality.php", param, function (data){
      }).done(function(data){
        data = $.trim(data);
        console.log(data);
        if (data == "0") {
          SOSelf.signUpForm.find('.error').html("<strong>Account already exists</strong>");
        } else if (data == "-1" ) {
          SOSelf.signUpForm.find('.error').html('<strong>Password must be more than 3 characters in length.</strong>').addClass('show');
        } else if (data == "-2") {
          SOSelf.signUpForm.find('.error').html('<strong>Congratulations! account is created, check your email for verification.</strong>').addClass('show');
        }  else if (data == "-3") {
          SOSelf.signUpForm.find('.error').html('<strong>An unknown error occurred, please try again.</strong>').addClass('show');
        } else {
          SOSelf.signUpForm.find('.error').html('<strong>Error: '+data+' </strong>').addClass('show');
        }
      });

      e.preventDefault();
  });

};

SignupsOverlay.prototype.retrievePassOpen = function() {
  this.rt.play();
};

SignupsOverlay.prototype.open = function() {
  this.playHead.play();
};

SignupsOverlay.prototype.signInOpen = function() {
  this.rt.reverse();
  this.sut.reverse();
};

SignupsOverlay.prototype.signUpOpen = function() {
  this.rt.reverse();
  this.sut.play();
};

SignupsOverlay.prototype.close = function() {
  this.playHead.reverse();
};

function map(elem, elIndex){
  var el = $(elem);
  var lat = el.data('lat');
  var lng = el.data('lng');
  var contentString  = '<div class="content">' + el.find('.contact_text').html() + '</div>'; 
  contentString = contentString.replace("<h3>", "<h3>Garment Care ");
  var mapCanvas = document.querySelectorAll(".map")[elIndex].querySelector(".mapCanvas");

  var latLng = new google.maps.LatLng(lat, lng);

      //Map Styles
      var mapStyles = [
      {
        stylers: [
          { hue: "#45468c" },
          { saturation: 0 }
        ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { lightness: 100 },
          { visibility: "simplified" }
        ]
      },{
        featureType: "road",
        elementType: "labels",
        stylers: [
          //{ visibility: "off" }
          { lightness: 20 }
        ]
      }
    ];


      var styledMap = new google.maps.StyledMapType(mapStyles, {name: "Styled Map"});

      // Map Options
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
      };

      var infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
      });

      var marker = new google.maps.Marker({
          position: latLng,
          title: "Hello World!",
          animation: google.maps.Animation.DROP,
          //icon: image
      });

    var gMap = new google.maps.Map(mapCanvas, mapOptions);
    gMap.mapTypes.set('map_style', styledMap);
    gMap.setMapTypeId('map_style');

    // Add Marker to map
    marker.setMap(gMap);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(gMap,marker);
    });

}

google.maps.event.addDomListener(window, 'load', function(){
  buildMaps();
});


function buildMaps() {
  var maps = $(".map");

  if (maps.length <= 0 ) { 
    return 0;
  }
  
  for (var i=0; i < maps.length; i++) {
    map(maps[i], i);
  }

}

$(document).ready(function(){

   var $menu, $nav, _menu, $homeBanners, $services, signups, $loginBtn;

   $menu = $(".menu");
   $nav = $(".nav");
   $homeBanners = $(".home-banners");
   $loginBtn = $(".loginBtn");

   // Instantiate Menu Display Object

   _menu = new ToggleMenu($menu, $nav);

   $services = $(".services .item");

   if ($services.length > 0) {
      var service = new Service();
   }

   sO = new SignupsOverlay();

   $loginBtn.each(function(){
      $this = $(this);
      $this.on('click', function(e){
        TweenMax.to("body", 1, {scrollTop: 0, ease:Expo.easeInOut, onComplete: function(){
            sO.open();
          }});

        e.preventDefault();
     });
   });

   $services.each(function(){
      $(this).on('click', function(e){
          var thisLink = $(this);

          TweenMax.to("body", 1, {scrollTop: $(".services").offset().top, ease:Expo.easeInOut, onComplete: function(){
            service.load(thisLink);
          }});

          e.preventDefault();
      });
   });

});

$(window).load(function(){
  var $homeBanners = $(".home-banners");
     // Homepage banner slideshow 
  try {
    $homeBanners.cycle({
      speed: 600,
      manualSpeed: 300,
      delay: 5,
      fx: 'fade',
      swipe: true,
      //autoHeight: "calc",
      pauseOnHover: true,
      prev: ".arrow-left",
      next: ".arrow-right"
    });
  } catch (e) {
    console.log(e);
  }

  if ($homeBanners.length > 0)  $homeBanners.animate({height: $homeBanners.get(0).scrollHeight}, 1000);
});