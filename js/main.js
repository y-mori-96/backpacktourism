$(function () {

  // パスの取得
  let path = location.pathname;
  let pathname = location.pathname.split('/');
  // console.log('path: ' + path);
  // console.log('pathname: ' + pathname[1]);

  let isPage = "topPage";
  let isSite = "corporate";
  let domain = "";

  if (pathname[1] === "backpacktourism") {
    // 本番環境
    domain = "/backpacktourism";
  } else {
    // 開発時
    domain = "";
  }

  // console.log('domain: ' + domain);

  if (path === (domain + "/index.html")) {
    isPage = "topPage";
    isSite = "corporate";
  } else if (path === (domain + "/company.html")) {
    isPage = "companyPage";
    isSite = "corporate";
  } else if (path === (domain + "/news.html")) {
    isPage = "newsPage";
    isSite = "corporate";
  } else if (path === (domain + "/reservation.html")) {
    isPage = "reservationPage";
    isSite = "reservation";
  }

  // console.log(domain + "/～.html");
  // console.log('isPage: ' + isPage);
  // console.log('isSite: ' + isSite);

  if (isPage === "topPage") {
    createNews(isPage);
  }
  else if (isPage === "newsPage") {
    createNews(isPage);
    newsSearchAccordion();
  }
  else if (isPage === "reservationPage") {
    createTicket();
    createTour();
    createFestival();
    createWorldHeritage();
    clickRouteBtn();
    tab();
  } else {
    // 処理なし
  }

  // 共通
  hamburger();
  pagetop();
});