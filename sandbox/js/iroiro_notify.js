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
