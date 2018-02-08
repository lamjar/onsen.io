
// iframe lazy loader
$(function() {
  $.extend($.lazyLoadXT, {
    autoInit: false,
    edgeY: 0,
    srcAttr: 'data-src',
    throttle: 1000
  });

  var iframe = $('iframe');
  if (iframe.length > 0 && iframe.lazyLoadXT instanceof Function) {
    iframe.lazyLoadXT();
  }
});

// sticky menu
$(function() {
  var sticked = $('.content-info');

  if (sticked.length === 0) {
    return;
  }

  var elementTop = sticked.offset().top;
  var headerOffset = $('.header-fixed').height() || 0;
  var footerHeight = $('.footer-container').height();

  $(window).scroll(update);

  function update() {
    var scrollTop = $(window).scrollTop(),
      windowHeight = $(window).height(),
      documentHeight = $(window.document).height()
      offset = 10;

    if (scrollTop > elementTop - headerOffset) {
      if (scrollTop > documentHeight - windowHeight - footerHeight - offset) {
        sticked.removeClass('content-info-fixed');
        sticked.addClass('content-info-bottom');
        sticked.css({
          top: (documentHeight - windowHeight - footerHeight - offset) + 'px'
        });
      } else {
        sticked.removeClass('content-info-bottom');
        sticked.addClass('content-info-fixed');
        sticked.attr('style', '');
      }
    } else {
      sticked.removeClass('content-info-bottom content-info-fixed');
      sticked.attr('style', '');
    }
  }
});

// tracking
$(function() {
  $('[data-track-event]').click(function() {
    var eventName = '' + $(this).data('track-event');

    if (eventName.length > 0) {
      ga('send', 'event', 'website', eventName);
    }
  });
});

// footer newsletter
$(function() {
  $('.newsletter-signup form').submit(function(e) {
    e.preventDefault();
    var data = {email: $('input[name=email]', this).val()};

    $.post('https://monaca.mobi/ja/api/email/e458bcbcc4', data, function(data) {
      if (JSON.parse(data).status === 'success') {
        $('.newsletter-signup form').hide();
        $('.newsletter-signup-thankyou').show();
      } else {
        alert('Something wrong with the request. Sorry.');
      }
    });
  });
});

// header
$(function() {
  // for mobile website menu
  var header = $('.header')[0];
  $('.gnav-icon', header).click(function() {
    $('.header-navi', header).toggleClass('header-navi-open');
    $('.blog-header-navi', header).toggleClass('blog-header-navi-open');
  });
  $('.main-nav-icon').click(function() {
    $('#main-nav ul').toggleClass('open');
  });

  // for language switch dialog
  $('.language-dialog-button.close').click(function() {
    setCookie('language_dialog_accepted', 'true', 1);
    $('.language-dialog-mask').hide();
    $('.language-dialog').hide();

    return false;
  });

  (function($el) {
    if ($el.length) {
      $el.attr('href', $el.attr('href').replace(/\/$/, '') + window.location.pathname);
    }
  })($('.language-dialog-button.japanese-version'));

  if (window.SITE_ENV.lang == 'en' && window.SITE_ENV.hasAlternateLangPage) {
    if (browserLanguage() == 'ja' && !getCookie('language_dialog_accepted')) {
      $('.language-dialog-mask').show();
      $('.language-dialog').show();
    }
  }
});


// footer newsletter
$(function() {
  var info = $('#release-info');
  if (info.length) {
    var framework = info.data('framework');
    $.get('https://api.github.com/repos/OnsenUI/OnsenUI-dist/releases', function(data) {
      $('.version', info).html(data[0].name);
      $('time', info).html(moment(new Date(data[0].published_at)).fromNow());
    });
  }
});


var trackOutboundLink = function(url) {
  ga('send', 'event', 'outbound', 'click', url, {
    'hitCallback': function() {
      document.location = url;
    }
  });
}

var trackEventAndRedirect = function(params, url) {
  if (params) {
    ga('send', 'event', params.category, params.action, params.label, {
      'hitCallback': function() {
        url ? (window.location = url) : '';
      }
    });
  } else {
    url ? (window.location = url) : '';
  }
}

function browserLanguage() {
  try {
    return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
  } catch(e) {
    return undefined;
  }
}

function switchKeyVisualFrame() {
  var $frameIos = $('#keyvisual_ios'),
    $frameAndroid = $('#keyvisual_android');

  $frameAndroid.css('visibility', 'visible'); // FIXME

  if ($frameIos.is(':visible')) {
    $frameIos.hide();
    $frameAndroid.css("display", "inherit");
  } else if ($frameAndroid.is(':visible')) {
    $frameAndroid.hide();
    $frameIos.css("display", "inherit");
  }
}

function setCookie(c_name, value, expiredays) {
  var path = location.pathname;
  var paths = new Array();
  paths = path.split('/');
  if(paths[paths.length - 1] != ''){
    paths[paths.length - 1] = '';
    path = paths.join('/');
  }
  var extime = new Date().getTime();
  var cltime = new Date(extime + (60 * 60 * 24 * 1000 * expiredays));
  var exdate = cltime.toUTCString();
  var s = '';
  s += c_name + '=' + escape(value);
  s += '; path='+ path;
  if (expiredays) {
    s += '; expires=' +exdate+'; ';
  } else {
    s += '; ';
  }
  document.cookie=s;
}

function getCookie(c_name) {
  var st = '';
  var ed = '';
  if (document.cookie.length > 0) {
    st = document.cookie.indexOf(c_name + '=');
    if (st != -1) {
      st = st + c_name.length + 1;
      ed = document.cookie.indexOf(';', st);
      if (ed == -1) {
        ed = document.cookie.length;
      }
      return unescape(document.cookie.substring(st, ed));
    }
  }
  return '';
}

$(function() {
  $('.phone.ios iframe').load(function() {
    $('.phone-placeholder').css('opacity', 0);
  });
});

$(function() {
  $('.global-nav-checkbox').change(function(event) {
    if (event.target.checked) {
      document.body.scrollTop = 0;
      document.body.classList.add('noscroll');
    }
    else {
      document.body.classList.remove('noscroll');
    }
  });

  $(window).on('resize', function() {
    document.body.classList.remove('noscroll');
    $('.global-nav-checkbox').prop('checked', false);
  });
});

$(function() {
  var events = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';

  $('.keyvisual-image').on(events, function() {
    $(this).css('visibility', 'visible');
  });

  $('.keyvisual-switch').on(events, function() {
    $(this).css('visibility', 'visible');
  });
});

$(function() {
  setTimeout(function() {
    $('body').addClass('loaded');
  }, 500);
});

// Set target="_blank" to all the links in the article body
$(function() {
  $('.article-content a').attr('target' , '_blank');
});
