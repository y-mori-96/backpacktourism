function createTicket() {
  const selectPointDeparture = $("select[name='point_departure']");
  const selectPointArrival = $("select[name='point_arrival']");
  const dateOutwardTrip = $("input[name='date_outward_trip']");
  const dateReturnJourneyTrip = $("input[name='date_return_journey']");
  const rangeMax = $("input[name='max']");
  const sort = $("select[name='sort']");
  const adult = $("input[name='adult']");
  const child = $("input[name='child']");
  const infant = $("input[name='infant']");
  const ticketClearBtn = $("#ticket_clear_btn");

  const btnOutwardTrip = $("#btn_outward_trip");
  const btnOneWay = $("#btn_one_way");

  /**
   * 初期値
   */
  let data = [];
  const container = $("#ticket_lists");

  let pointDepartureInput = "none";
  let pointArrivalInput = "none";
  let getDateOutwardTrip = "";
  let getDateReturnJourney = "";
  let getMaxValue = "";
  let sortBy = "low_price";
  let getAdultValue = "";
  let getChildValue = "";
  let getInfantValue = "";

  let searchFlag = false;
  let isActiveRoute = "outwardTrip";

  $.ajax({
    url: "data/ticket_data.json",
    dataType: "json",
  }).done(function (response) {
    data = response;
    // データ確認
    // console.log(data);

    createDataFlow();
  })
    .fail(function (status) {
      console.log(status + "「ticket_data」エラーが発生しました:");
    })
    .always(function () {
      console.log("「ticket_data」リクエストが完了しました");
    });

  /**
   * 往復ボタン押下
   */
  btnOutwardTrip.on('click', function () {
    isActiveRoute = "outwardTrip";
    createDataFlow();
  });
  /**
   * 片道ボタン押下
   */
  btnOneWay.on('click', function () {
    isActiveRoute = "oneWay";
    getDateReturnJourney = "";
    createDataFlow();
  });

  /**
   * 出発地
   */
  selectPointDeparture.on("change", function () {
    pointDepartureInput = $(this).val();
    searchFlag = true;
    createDataFlow();
  });

  /**
   * 目的地
   */
  selectPointArrival.on("change", function () {
    pointArrivalInput = $(this).val();
    searchFlag = true;
    createDataFlow();
  });

  /**
   *  往路出発日
   */
  dateOutwardTrip.on("change", function () {
    getDateOutwardTrip = $(this).val();
    searchFlag = true;
    createDataFlow();
  });
  /**
   *  復路出発日
   */
  dateReturnJourneyTrip.on("change", function () {
    getDateReturnJourney = $(this).val();
    searchFlag = true;
    createDataFlow();
  });
  /**
   *  大人
   */
  adult.on("input", function () {
    getAdultValue = $(this).val();
    searchFlag = true;
    createDataFlow();
  });
  /**
   *  子ども
   */
  child.on("input", function () {
    getChildValue = $(this).val();
    searchFlag = true;
    createDataFlow();
  });
  /**
   *  幼児
   */
  infant.on("input", function () {
    getInfantValue = $(this).val();
    searchFlag = true;
    createDataFlow();
  });
  /**
   *  最大
   */
  rangeMax.on("input", function () {
    getMaxValue = parseInt(rangeMax.val());
    searchFlag = true;
    createDataFlow();
  });

  /**
   * ソート
   */
  sort.on("change", function () {
    sortBy = $(this).val();
    searchFlag = true;
    createDataFlow();
  });

  /**
   * クリア
   */
  ticketClearBtn.on("click", function () {
    searchFlag = false;

    selectPointDeparture.val("none");
    selectPointArrival.val("none");
    dateOutwardTrip.val("");
    dateReturnJourneyTrip.val("");
    rangeMax.val("");
    sort.val("low_price");
    adult.val("");
    child.val("");
    infant.val("");

    resetValue();
    createDataFlow();
  });

  /**
   * データ作成フロー
   */
  function createDataFlow() {
    const filteredData = searchData();
    const sortedData = sortData(filteredData);

    container.empty();
    createData(sortedData, container);
  }

  /**
   * 検索（条件にヒットする要素数取得）
   */
  function searchData() {
    const searchedData = data.filter(function (item) {
      const pointDepartureMatches = (pointDepartureInput === item.point_departure_code);
      const pointArrivalMatches = (pointArrivalInput === item.point_arrival_code);

      const changeDepartureToArriveMatches = (pointDepartureInput === item.point_arrival_code);
      const changeArriveToDepartureMatches = (pointArrivalInput === item.point_departure_code);

      const dateOutwardTripMatches = (getDateOutwardTrip === item.departure_date.split(" ")[0]);
      const dateReturnJourneyTripMatches = (getDateReturnJourney === item.departure_date.split(" ")[0]);

      const MaxMatches = ((isNaN(getMaxValue) || getMaxValue <= 0) ? true : item.price_base <= getMaxValue);

      let itineraryMatches;
      if(isActiveRoute === "oneWay"){
        itineraryMatches = (pointDepartureMatches && pointArrivalMatches && dateOutwardTripMatches);
      }else{
        if((getDateOutwardTrip != "") && (getDateReturnJourney != "") ){
          itineraryMatches =
              (pointDepartureMatches && pointArrivalMatches && dateOutwardTripMatches)
           || (changeArriveToDepartureMatches && changeDepartureToArriveMatches && dateReturnJourneyTripMatches);
        }
      }

      return (
        itineraryMatches
        && MaxMatches
      );
    });

    return searchedData;
  }

  /**
   * ソート
   */
  function sortData(data) {
    let sortedData = data;

    // 料金が安い順に並べ替え
    if (sortBy === "low_price") {
      sortedData = sortedData.sort(function (a, b) {
        return a.price_base - b.price_base;
      });
    }
    // 料金が高い順に並べ替え
    else if (sortBy === "high_price") {
      sortedData = sortedData.sort(function (a, b) {
        return b.price_base - a.price_base;
      });
    }
    // 出発時間が早い順に並べ替え
    else if (sortBy === "early_departure") {
      sortedData = sortedData.sort(function (a, b) {
        const dateA = new Date(a.departure_date);
        const dateB = new Date(b.departure_date);
        return dateA - dateB;
      });
    }
    // 出発時間が遅い順に並べ替え
    else if (sortBy === "late_departure") {
      sortedData = sortedData.sort(function (a, b) {
        const dateA = new Date(a.departure_date);
        const dateB = new Date(b.departure_date);
        return dateB - dateA;
      });
    }
    // 到着時間が早い順に並べ替え
    else if (sortBy === "early_arrival") {
      sortedData = sortedData.sort(function (a, b) {
        const dateA = new Date(a.arrival_date);
        const dateB = new Date(b.arrival_date);
        return dateA - dateB;
      });
    }
    // 到着時間が遅い順に並べ替え
    else if (sortBy === "late_arrival") {
      sortedData = sortedData.sort(function (a, b) {
        const dateA = new Date(a.arrival_date);
        const dateB = new Date(b.arrival_date);
        return dateB - dateA;
      });
    }
    // 所要時間が短い順に並べ替え
    else if (sortBy === "short_flight_time") {
      sortedData = sortedData.sort(function (a, b) {
        const dateDepartureA = new Date(a.departure_date);
        const dateArrivalA = new Date(a.arrival_date);
        const dateDepartureB = new Date(b.departure_date);
        const dateArrivalB = new Date(b.arrival_date);
        const diffDateA = Math.abs(dateArrivalA - dateDepartureA);
        const diffDateB = Math.abs(dateArrivalB - dateDepartureB);
        return diffDateA - diffDateB;
      });
    }

    return sortedData;
  }

  /**
   * データ作成
   */
  function createData(data, container) {
    // データ確認
    // console.log(data);

    // 数を制限する
    const dataLength = data.length;
    const limitLength = Math.min(dataLength, 20);

    let element = "";

    if((limitLength === 0) && (searchFlag === false)) {
      element += `
        <div class="ticket_banner">
          <img src="images/early_booking_discount.png" alt="10％OFF　早割り　90日前からのご予約で割引適応！">
        </div>
      `;
      container.empty().append(element);
    }else{
      if(pointDepartureInput === "none") {
        element += `
          <p class="nothing_ticket">出発地を入力してください</p>
        `;
      }

      if(pointArrivalInput === "none") {
        element += `
          <p class="nothing_ticket">目的地を入力してください</p>
        `;
      }

      if(getDateOutwardTrip === "") {
        element += `
          <p class="nothing_ticket">往路出発日を入力してください</p>
        `;
      }

      if( (getDateReturnJourney === "")
        &&(isActiveRoute === "outwardTrip")
      ){
        element += `
          <p class="nothing_ticket">復路出発日を入力してください</p>
        `;
      }

      if((getAdultValue === "") || (getAdultValue <= 0) || isNaN(getAdultValue) ) {
        element += `
          <p class="nothing_ticket">大人の数を入力してください</p>
        `;
      }

      if(  (pointDepartureInput != "none")
        && (pointArrivalInput != "none")
        && (getDateOutwardTrip != "")
        && (  ((getDateReturnJourney != "") && (isActiveRoute === "outwardTrip") )
              ||(isActiveRoute === "oneWay")
           )
        && ((getAdultValue != "") && (getAdultValue > 0))
      ){
        if ((limitLength === 0) && (searchFlag === true)) {
          element += `
          <p class="nothing_ticket">対象の商品はございません。</p>
          <p class="nothing_ticket">別の条件でお探しください。</p>
          `;
        } else {
          for (let i = 0; i < limitLength; i++) {
            // 料金3桁区切り
            let getCalculatePrice = "";
            let changePrice = "";
            if (
              (getAdultValue <= 0)
              && (getChildValue <= 0)
              && (getInfantValue <= 0)) {
              changePrice = `${data[i].price_base.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
            } else {
              getCalculatePrice = calculatePrice(data[i].price_base);
              changePrice = getCalculatePrice.toLocaleString();
            }

            // 日付を年月に変更
            const departureDate = new Date(data[i].departure_date);
            const arrivalDate = new Date(data[i].arrival_date);

            const departureTime = `${departureDate.getHours()}:${departureDate.getMinutes()}`;
            const arrivalTime = `${arrivalDate.getHours()}:${arrivalDate.getMinutes()}`;
            const flightTime = calculateFlightTime(departureDate, arrivalDate);

            element += `
            <li class="ticket_item">
              <a href="${data[i].link}">
                <div class="contents">
                  <p class="title departure">${departureTime}</p>
                  <p class="title to">→</p>
                  <p class="title arrival">${arrivalTime}</p>
                  <p class="title flight_time">${flightTime}</p>
                  <p class="title price">${changePrice}<span>円<span></p>
                  <p class="headline departure">${data[i].point_departure_code} - 出発</p>
                  <p class="headline arrival">${data[i].point_arrival_code} - 到着</p>
                  <p class="headline flight_time">所要時間</p>
                  <p class="headline price">料金</p>
                </div>
              </a>
            </li>
          `;
          }
        }
      }
      // データを追加
      container.empty().append(element);
    }
  };

  /**
   * フライト時間算出　初期化処理
   */
  function calculateFlightTime(departureDate, arrivalDate) {
    const diffDate = (arrivalDate.getTime() - departureDate.getTime());
    const flightTimeMinutes = (Math.abs(diffDate) / (60 * 1000));

    return `${Math.floor(flightTimeMinutes / 60)
      }時間${flightTimeMinutes % 60}分`
  }

  /**
   * 料金計算
   */
  function calculatePrice(price_base) {
    const childSinglePriceRate = 0.75;
    const infantSinglePriceRate = 0;
    const infantMultiPriceRate = 0.5;

    let infantPriceRate = infantSinglePriceRate;

    if (getInfantValue <= 1) {
      infantPriceRate = infantSinglePriceRate;
    } else {
      infantPriceRate = infantMultiPriceRate;
    }

    let totalPrice = ((getAdultValue * price_base) +
      (getChildValue * (price_base * childSinglePriceRate)) +
      ((getInfantValue - 1) * (price_base * infantPriceRate))
    );

    return totalPrice;
  }

  /**
   * 変数　初期化処理
   */
  function resetValue() {
    pointDepartureInput = "none";
    pointArrivalInput = "none";
    getDateOutwardTrip = "";
    getDateReturnJourney = "";
    getMaxValue = "";
    sortBy = "low_price";
    getAdultValue = "";
    getChildValue = "";
    getInfantValue = "";
  }
}