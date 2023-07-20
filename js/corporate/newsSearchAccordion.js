function newsSearchAccordion() {
  const newsSearchBtn = $("#news_search_btn");
  const newsSearchContents = $("#news_search_contents");

  // 初期状態
  newsSearchContents.hide();

  newsSearchBtn.on('click', function () {
    newsSearchContents.slideToggle(100);
    $(this).toggleClass('active');
  });
}