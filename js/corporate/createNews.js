function createNews(isPage) {
  // console.log(isPage);

  const topPage = $("#get_news_toppage");
  const newsPage = $("#get_news_newspage");

  const keywordInput = $("#keyword_input");
  const selectReleaseDate = $("select[name='release_year']");
  const sort = $("select[name='sort']");
  const newsCategoryInput = $("input[name='news_category']");
  const clearButton = $("input[type='button']");

  /**
   * 初期値
   */
  let data = [];
  let container = "";

  if (isPage === "topPage") {
    container = topPage;
  } else if (isPage === "newsPage") {
    container = newsPage;
  }

  let keyword = "";
  let releaseYear = "all";
  let sortBy = "release_new";
  let checkedNewsCategoryValue = initCheckBox();

  // チェックボックスの選択処理
  // このファイルじゃなくてもいい
  clickCheckBox();

  $.ajax({
    url: "data/news_data.json",
    dataType: "json",
  }).done(function (response) {
    data = response;
    // データ確認
    console.log(data);

    // ソート
    const sortedData = sortData(data);

    // データ作成
    createData(sortedData, container);
  })
    .fail(function (status) {
      console.log(status + "「news_data」エラーが発生しました:");
    })
    .always(function () {
      console.log("「news_data」リクエストが完了しました");
    });

  /**
   * フリーワード
   */
  keywordInput.on("input", function () {
    keyword = $(this).val().toLowerCase();
    createDataFlow();
  });

  /**
   * 公開日
   */
  selectReleaseDate.on("change", function () {
    releaseYear = $(this).val();
    // console.log(releaseYear);
    createDataFlow();
  });

  /**
   * ソート
   */
  sort.on("change", function () {
    sortBy = $(this).val();
    // console.log(sortBy);
    createDataFlow();
  });

  /**
   * ニュースカテゴリー
   */
  newsCategoryInput.on("change", function () {
    // チェックのものを新たな配列に取り出し
    checkedNewsCategoryValue = newsCategoryInput.filter(":checked")
      .map(function () {
        return $(this).val();
      })
      .get();

    createDataFlow();
  });

  /**
   * クリア
   */
  clearButton.on("click", function () {
    keywordInput.val("");
    selectReleaseDate.val("all");
    sort.val("release_new");
    newsCategoryInput.filter("[name='news_category']").prop("checked", true);

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
      const textMatches = item.text.toLowerCase().includes(keyword);
      const dateMatches = item.date.toLowerCase().includes(keyword);
      const releaseYearMatches = releaseYear === "all" || releaseYear === item.date.split("-")[0];
      const newsCategoryMatches = checkedNewsCategoryValue.includes(item.category);

      return (
        (textMatches || dateMatches)
        && releaseYearMatches
        && newsCategoryMatches
      );
    });

    return searchedData;
  }

  /**
   * ソート
   */
  function sortData(data) {
    let sortedData = data;

    // 新着順に並べ替え
    if (sortBy === "release_new") {
      sortedData = sortedData.sort(function (a, b) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
    }
    // 投稿順に並べ替え
    else if (sortBy === "release_old") {
      sortedData = sortedData.sort(function (a, b) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
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
    let length = "";
    const dataLength = data.length;
    const limitLength = Math.min(dataLength, 5);

    if (isPage === "topPage") {
      length = limitLength;
    } else if (isPage === "newsPage") {
      length = dataLength;
    }

    let element = "";
    let category = "";

    for (let i = 0; i < length; i++) {
      // 日付を年月に変更
      const date = new Date(data[i].date);
      const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

      // カテゴリー
      if (data[i].category === 'promotion_info') {
        category = "商品情報"
      } else if (data[i].category === 'company_info') {
        category = "企業情報"
      } else if (data[i].category === 'fiscal_info') {
        category = "決算情報"
      }


      element += `
        <li>
          <table>
            <thead>
              <tr>
                <td>
                  <time datetime="${data[i].date}">
                    ${formattedDate}
                  </time>
                </td>
                <td class="category ${data[i].category}">
                   ${category}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a href="${data[i].link}" class="news_link">
                    <p>
                      ${data[i].text}
                    </p>
                  </a>
                </td>
              </tr>
            </tbody>
            </tr>
          </table>
        </li>
      `;
    }

    // データを追加
    container.append(element);
  };

  /**
   * 変数　初期化処理
   */
  function resetValue() {
    keyword = "";
    releaseYear = "all";
    sortBy = "release_new";
    checkedNewsCategoryValue = initCheckBox();
  }

  /**
   * ニュースカテゴリ　初期処理
   */
  function initCheckBox() {
    return newsCategoryInput.filter(":checked")
      .map(function () {
        return $(this).val();
      })
      .get();
  }

  /**
   * ニュースカテゴリ　クリック処理
   */
  function clickCheckBox() {
    const allCheckbox = $("input[name='news_category'][value='all']");
    const otherCheckboxes = $("input[name='news_category']").not(allCheckbox);

    // 初期状態
    allCheckbox.prop("checked", true);
    otherCheckboxes.prop("checked", true);

    // 「すべて」のチェックが変更されたときの処理
    allCheckbox.on("change", function () {
      if ($(this).prop("checked")) {
        otherCheckboxes.prop("checked", true);
      } else {
        otherCheckboxes.prop("checked", false);
      }
    });

    // 他のチェックボックスが変更されたときの処理
    otherCheckboxes.on("change", function () {
      allCheckbox.prop("checked", false);
    });
  }
}