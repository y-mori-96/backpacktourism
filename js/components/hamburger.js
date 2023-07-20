function hamburger() {
  const hamburger = $(".hamburger");
  const nav = $("header nav");
  const header = $("header");

  hamburger.click(function () {
    $(this).find(".hamburger_bar").toggleClass("active");
    nav.toggleClass("active");
    header.toggleClass("active");
  });
}