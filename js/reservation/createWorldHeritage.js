function createWorldHeritage() {
  const container = $("#get_world_heritage_toppage");

  let data = [];

  $.ajax({
    url: "data/world_heritage_data.json",
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
      console.log(status + "「world_heritage_data」エラーが発生しました:");
    })
    .always(function () {
      console.log("「world_heritage_data」リクエストが完了しました");
    });

  /**
   * ソート
   *
   * 新着順に更新
   */
  function sortData(data) {
    let sortedData = data;
    sortedData = sortedData.sort(function (a, b) {
      const dateA = new Date(a.update);
      const dateB = new Date(b.update);
      return dateB - dateA;
    });

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
    const limitLength = Math.min(dataLength, 6);

    let element = "";

    for (let i = 0; i < limitLength; i++) {

      element += `
        <li class="card_item">
          <a href="${data[i].link}" class="card_link">
            <div class="card_header">
              <img src="${data[i].image}" alt="${data[i].title}">
            </div>
            <div class="card_body">
              <p class="world_heritage_country">
                ${data[i].country}
              </p>
              <p class="world_heritagel_title">
                ${data[i].title}
              </p>
            </div>
          </a>
        </li>
      `;
    }

    // データを追加
    container.append(element);
  };
}