// Shared interactions used by both BMW Explorer pages.
$(function () {
  // jQuery effect 1: open and close FAQ answers smoothly.
  $(".faq-question").on("click", function () {
    const $button = $(this);
    const $answer = $button.next(".faq-answer");
    const isOpen = $button.attr("aria-expanded") === "true";

    $(".faq-question").not($button).attr("aria-expanded", "false")
      .find("span").text("+");
    $(".faq-answer").not($answer).stop(true, true).slideUp(180, function () {
      this.hidden = true;
    });

    if (isOpen) {
      $button.attr("aria-expanded", "false").find("span").text("+");
      $answer.stop(true, true).slideUp(180, function () { this.hidden = true; });
    } else {
      $button.attr("aria-expanded", "true").find("span").text("−");
      $answer.stop(true, true).prop("hidden", false).hide().slideDown(220);
    }
  });

  // jQuery effect 2: smooth scroll for on-page links.
  $('a[href^="#"]').on("click", function (event) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").stop(true).animate({ scrollTop: target.offset().top - 70 }, 350);
    }
  });

  // jQuery hover effect: add a small lift to interactive cards.
  $(".feature-card, .model-card").hover(
    function () { $(this).addClass("is-hovered"); },
    function () { $(this).removeClass("is-hovered"); }
  );
});