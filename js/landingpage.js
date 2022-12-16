// HEADER ANIMATION
window.onscroll = function() {scrollFunction()};
var element = document.getElementById("body");

function scrollFunction() {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
      $(".navbar").addClass("fixed-top");
      element.classList.add("header-small");
      $("body").addClass("body-top-padding");

  } else {
      $(".navbar").removeClass("fixed-top");
      element.classList.remove("header-small");
      $("body").removeClass("body-top-padding");
  }
}

// OWL-CAROUSAL
$('.owl-carousel').owlCarousel({
    items: 3,
    loop:true,
    nav:false,
    dot:true,
    autoplay: true,
    slideTransition: 'linear',
    autoplayHoverPause: true,
    responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:3
      }
  }
})

// SCROLLSPY
$(document).ready(function() {
  $(".nav-link").click(function() {
      var t = $(this).attr("href");
      $("html, body").animate({
          scrollTop: $(t).offset().top - 75
      }, {
          duration: 1000,
      });
      $('body').scrollspy({ target: '.navbar',offset: $(t).offset().top });
      return false;
  });

  $('form').on('submit', function(e){
    e.preventDefault()

    clearErrors()

    $.ajax({
      url: 'contact.php',
      type: 'POST',
      data: $(this).serialize(),

      beforeSend: function () {
        $('#btn-contact').css('display', 'none');
        const spinner = `<div class="spinner-border text-primary" role="status" id="spinner-contact">
                          <span class="sr-only">Loading...</span>
                        </div>`
                        
        $('.modal-footer').append(spinner)
      },

      success:function(data) {
        data = JSON.parse(data)

        if (data.success) {
          clearInputs()
        } else {
          if (data.errors){
            showErrors(data.errors)
          }
        }

        if (data.msg) {
          showContactMessage(data)
          clearInputs()
          grecaptcha.reset();
        }
      },

      error:function(e) {
        console.log('e', e.errors)
      },

      complete: function () {
        $('#spinner-contact').remove()
        $('#btn-contact').css('display', 'block');
      }

    })
  })

  $('#exampleModal').on('hidden.bs.modal', function (event) {
    $('#contact-message').remove()
    clearErrors()
    clearInputs()
    grecaptcha.reset();
  })

});

// AOS
AOS.init({
    offset: 120, 
    delay: 0,
    duration: 1200, 
    easing: 'ease', 
    once: true, 
    mirror: false, 
    anchorPlacement: 'top-bottom', 
    disable: "mobile"
  });

  //SIDEBAR-OPEN
  $('#navbarSupportedContent').on('hidden.bs.collapse', function () {
    $("body").removeClass("sidebar-open");
  })

  $('#navbarSupportedContent').on('shown.bs.collapse', function () {
    $("body").addClass("sidebar-open");
  })


  window.onresize = function() {
    var w = window.innerWidth;
    if(w>=992) {
      $('body').removeClass('sidebar-open');
      $('#navbarSupportedContent').removeClass('show');
    }
  }

  //Form handle
  function showErrors (errors) {
    errors.forEach(e => {
      $('#msg-'+ e.field).html('')
      $('#msg-'+ e.field).html(e.message)
    });
  }

  const contactInputs = ['name', 'email', 'message', 'g-recaptcha-response']

  function clearErrors () {
    contactInputs.forEach(e => $(`#msg-${e}`).html(''))
  }

  function clearInputs () {
    $(`form input[name="name"]`).val('')
    $(`form input[name="email"]`).val('')
    $(`form textarea[name="message"]`).val('')
  }

  function showContactMessage (data) {
    const alertClass = data.success ? 'alert-success' : 'alert-danger'
    const e = `<div class="alert ${alertClass}" role="alert" id="contact-message">${data.msg}</div>`
    $('.modal-body').append(e)
  }

  