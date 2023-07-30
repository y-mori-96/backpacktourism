function clickRouteBtn() {
  const btnOutwardTrip = $("#btn_outward_trip");
  const btnOneWay = $("#btn_one_way");
  const dateReturnJourney = $("#date_return_journey");

  /**
   * 経路ボタン　初期処理
   */
  btnOutwardTrip.addClass("active");
  dateReturnJourney.addClass("active");


  /**
   * 往復ボタン押下
   */
  btnOutwardTrip.on('click', function () {
    $(this).addClass("active");
    btnOneWay.removeClass("active");
    dateReturnJourney.addClass("active").prop("disabled", false);
  });
  /**
   * 片道ボタン押下
   */
  btnOneWay.on('click', function () {
    btnOutwardTrip.removeClass("active");
    $(this).addClass("active");
    dateReturnJourney.removeClass("active").prop("disabled", true).val("");
  });
}