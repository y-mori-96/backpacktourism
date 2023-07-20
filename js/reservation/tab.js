function tab() {
  // タブ
  const tabLink = $(".tab_link");

  /**
   * 初期状態
   */
  $('#recommend_contents > div[id != "festival_info"]').hide();

  /**
   * クリック処理
   */
  tabLink.on('click', function () {
    // コンテンツ表示
    $("#recommend_contents > div").hide();
    $($(this).attr("href")).show();

    // タブ更新
    $(".active").removeClass("active");
    $(this).addClass("active");

    return false;
  });
}