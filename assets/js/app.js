'use strict()';

function ToggleMenu(menuBtn, navElem) {
    this.menuBtn = menuBtn;
    this.navElem = navElem;
    this.navVisible = false;
    tSelf = this;
    this.playhead = new TimelineMax({paused: true, yoyo: true});
    this.init();
}

ToggleMenu.prototype.init = function(){
    var navElemHeight = this.navElem.innerHeight(),
        navListContainer = this.navElem.find("ul"),
        navLists = this.navElem.find("li");


    this.playhead.set(tSelf.navElem, {height: "0px", overflow: "hidden"})
                .set(navListContainer, {autoAlpha: 0})
                .set(navLists, {autoAlpha: 0})
                .to(tSelf.navElem, 0.6, {display: "block", height: navElemHeight + "px", ease: Expo.easeOut})
                .to(navListContainer, 0.6, {autoAlpha: 1})
                .staggerTo(navLists, 0.6, {autoAlpha: 1}, 0.1, "-=1");

    this.menuBtn.on('click', this.showHideMenu);
};

ToggleMenu.prototype.showHideMenu = function() {
    console.log(tSelf.navVisible);
   if (tSelf.navVisible === false) {
        tSelf.showMenu();
   } else {
        tSelf.hideMenu();
   }

   tSelf.navVisible = !self.navVisible;
};

ToggleMenu.prototype.showMenu = function() {
    this.playhead.timeScale(1);
    this.playhead.play();
};

ToggleMenu.prototype.hideMenu = function() {
    this.playhead.timeScale(4);
    this.playhead.reverse();
};


function Service() {
  this.el = $(".service-overlay");
  this.links = $(".services").find(".container").find("a");
  this.linkIndex = 0;
  this.playHead = new TimelineMax({paused: true, yoyo: true});
  this.prevElem = this.el.find(".arrow-left");
  this.nextElem = this.el.find(".arrow-right");
  this.closeElem = this.el.find(".close");
  this.visible = false;
  self = this;
  this.init();

}

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


  this.nextElem.on('click', function(){
    self.next();
  });

  this.prevElem.on('click', function(){
    self.prev();
  });

  this.closeElem.on('click', function(){
    self.playHead.timeScale(3);
    self.close();
  });
};

Service.prototype.prev = function() {
   this.setIndex(this.linkIndex-1);
  this.load("", this.linkIndex);
};

Service.prototype.next = function() {
  this.setIndex(this.linkIndex+1);
  console.log(parseInt(this.linkIndex+1));
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


$(document).ready(function(){
   var $menu, $nav, _menu, $homeBanners, $services;

   $menu = $(".menu");
   $nav = $(".nav");
   $homeBanners = $(".home-banners");

   // Instantiate Menu Display Object

   _menu = new ToggleMenu($menu, $nav);

   $services = $(".services .item");

   if ($services.length > 0) {
      var service = new Service();
   }

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