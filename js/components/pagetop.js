function pagetop() {
  let topBtn = $('p.pagetop');

  // 初期状態
  topBtn.hide();

  // スクロールした時の処理
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      topBtn.fadeIn(300);
    } else {
      topBtn.fadeOut(300);
    }
  });

  // リンクをクリックしたときの処理
  $('p.pagetop a').click(function () {
    $('body, html').animate({
      scrollTop: 0
    }, 500);

    return false;
  });

  // 状態遷移禁止
  return false;
}