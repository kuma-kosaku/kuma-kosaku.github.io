'use strict';

/* 通知ウィンドウ_01(右下に表示) */
function notify_01(message) {
  const box = document.getElementById('notify_01');
  // 引数のメッセージを設定して表示
  box.textContent = message;
  box.style.display = 'block';
  // 3秒後に消える
  setTimeout(() => {
    box.style.display = 'none';
  }, 3000);
}

/* 通知ウィンドウ_02(トースト風) */
function notify_02(message) {
  const box = document.getElementById('notify_02');
  // 引数のメッセージを設定して表示
  box.textContent = message;
  box.style.display = 'block';
  // 3秒後に消える
  setTimeout(() => {
    box.style.display = 'none';
  }, 3000);
}

/* 通知ウィンドウ_03(画像＋テキスト) */
function notify_03(imgPath, message) {
  const box = document.getElementById('notify_03');
  // 画像＋テキストのタグ作成
  box.innerHTML = `
  <img src="${imgPath}" alt="">
  <span>${message}</span>
  `;
  box.style.display = 'flex';
  // 3秒後に消える
  setTimeout(() => {
    box.style.display = 'none';
  }, 3000);
}


/* 通知ウィンドウ_無造作に生成 */
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

      // 3秒後に削除
      setTimeout(() => {
        box.remove();
      }, 3000);
    }, i * 200); // ウィンドウ生成の間隔
  }
}

/* 通知ウィンドウ_下から表示 */
function notify_crawl_up(imgPath, message) {
  // 新しい通知ウィンドウを作成
  const box = document.createElement('div');
  box.className = 'notify_crawl_up';
  box.innerHTML = `
    <img src="${imgPath}" alt="">
    <span>${message}</span>
  `;
  document.body.appendChild(box);

  // ウィンドウの初期位置
  box.style.transform = 'translateY(100%)';
  box.style.opacity = '0';

  // 次のフレームでアニメーション開始
  requestAnimationFrame(() => {
    box.style.transform = 'translateY(0)';
    box.style.opacity = '1';
  });

  // 4秒後にフェードアウトして削除
  setTimeout(() => {
    box.style.transform = 'translateY(100%)';
    box.style.opacity = '0';
    setTimeout(() => box.remove(), 1000);
  }, 4000);
}
