'use strict';

// イベント開始トリガーをすべて取得
const triggers = document.querySelectorAll('.trigger');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      console.log(id + "：実行");
      // イベントを実行
      execEvent(id);
      // 一度実行したら監視対象から外す
      observer.unobserve(entry.target);
    }
  });
});
// 要素の監視を開始
triggers.forEach(trigger => observer.observe(trigger));

/******************************/
/* イベントをIDに応じて実行する */
/******************************/
function execEvent(id) {
  switch (id) {
    case "event01":
      // 通知ウィンドウ
      notify("縺ゅｊ縺後→縺??隕九▽縺代※縺上ｌ縺ｦ");
      scroll_lock(1000);
      break;
    case "event02":
      // ちょっと長めの通知ウィンドウ
      notify("莉翫°繧峨◎縺｡繧峨↓陦後″縺ｾ縺吶?<br>縺顔､ｼ逕ｳ縺嶺ｸ翫￡縺ｾ縺吶?<br>縺顔､ｼ逕ｳ縺嶺ｸ翫￡縺ｾ縺吶?縺ゅｊ縺後→縺?≠繧翫′縺ｨ縺?≠繧翫′縺ｨ縺?<br>縺企?繧後＞縺溘＠縺ｾ縺吶?邯ｺ鮗励↑縺ｨ縺薙ｍ縺ｸ");
      scroll_lock(1000);
      break;
    case "event03":
      // 表示異常のエフェクトをかける
      document.body.classList.add("foggy");
      scroll_lock(1000);
      break;
    case "event04":
      // 通知ウィンドウ(画像＋テキスト)
      notify_img(
        "img/01_bbs/horror_icon.png",
        "もƯ̵̝̼̦̪͒̌ͮ̂̕͜すQ̸̬̞̭̬ͯ̎͒̆͘͟͡貴方をb̶̩̦͇̹̑͒́͂͘͘͢迎え(̧ͮͦͪ̏͡҉̧̦̦̜͔行きz̤̮̞͕̍̑̇̈́͜͟͢͞す。"
      );
      scroll_lock(1500);
      break;
    case "event05":
      // トースト表示後、ウィンドウを大量表示
      notify_img(
        "img/01_bbs/horror_icon.png",
        "貴f̷̡͇̩͉̪͌ͪ̉͗́͢の近z̢̛̻̱͚̯̓̈́͑̒̕͞にr̐̆̓̈͠͏҉̵͎͉͆ͅます。"
      );
      setTimeout(() => {
        notify_spawn(
          "img/01_bbs/horror_icon.png",
          "迎えC̷̨̳͇͔̪ͣ̽̈́ͣ́͞行y̷̶̤͔̞̮̅̄̂̉́͟ます",
          10
        );
        notify_spawn(
          "img/01_bbs/horror_icon.png",
          "連れI̵̧̢̤̜͕̮ͨͬͣ̍̕いȨ̶̸͚͇̥͎̐ͪ̇̔͠ます",
          10
        );
      }, 2000);
      // 最後に背景を暗く
      document.body.classList.add("turn_dark");
      scroll_lock(3000);
      break;
    case "event06":
      // スクロールをロック
      scroll_lock(10000);
      // 画像を下からフェードイン
      const img = document.getElementById("crawl_up");
      img.classList.add("show");
      // 別ページへ移動
      setTimeout(() => {
        location.href = "01_bbs_end.html";
      }, 10000);
      break;
  }
}

/***************************************/
/* 画面スクロールを指定のミリ秒ロックする */
/***************************************/
function scroll_lock(ms) {
  document.body.classList.add("scroll_lock");
  setTimeout(() => {
    document.body.classList.remove("scroll_lock");
  }, ms);
}

/****************************/
/* 通知ウィンドウ(トースト風) */
/****************************/
function notify(message) {
  const box = document.getElementById('notify');
  // 引数のメッセージを設定して表示
  box.innerHTML = message;
  box.style.display = 'block';
  // 5秒後に消える
  setTimeout(() => {
    box.style.display = 'none';
  }, 5000);
}

/********************************/
/* 通知ウィンドウ(画像＋テキスト) */
/********************************/
function notify_img(imgPath, message) {
  const box = document.getElementById('notify_img');
  // 画像＋テキストのタグ作成
  box.innerHTML = `
  <img src="${imgPath}" alt="">
  <span>${message}</span>
  `;
  box.style.display = 'flex';
  // 5秒後に消える
  setTimeout(() => {
    box.style.display = 'none';
  }, 5000);
}

/*****************************/
/* 通知ウィンドウ_無造作に生成 */
/*****************************/
function notify_spawn(imgPath, message, count) {
  // 少し間隔をあけて回数分ウィンドウを生成
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      // 新しい通知ウィンドウを作成
      const box = document.createElement('div');
      box.className = 'notify_spawn';
      box.innerHTML = `
      <img src="${imgPath}" alt="">
      <span>${message}</span>
      `;
      document.body.appendChild(box);
      // 画面サイズ
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const boxW = box.offsetWidth;
      const boxH = box.offsetHeight;
      // ランダム位置（画面内に収まるように調整）
      const randX = Math.random() * (screenW - boxW);
      const randY = Math.random() * (screenH - boxH);
      box.style.left = randX + 'px';
      box.style.top = randY + 'px';
      // 5秒後に削除
      setTimeout(() => {
        box.remove();
      }, 5000);
    }, i * 200); // ウィンドウ生成の間隔
  }
}
