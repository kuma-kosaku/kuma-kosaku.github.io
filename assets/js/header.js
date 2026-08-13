'use strict';
{
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("header");
    if (!target) return;

    // 現在のページのディレクトリを取得
    const currentDir = window.location.pathname.replace(/\/[^\/]*$/, "");

    // headerへの相対パスを自動生成
    const headerPath = currentDir + "/assets/header.html";

    fetch(headerPath)
      .then(res => res.text())
      .then(html => {
        target.innerHTML = html;

        // ホームリンクを正しく設定
        const homeLink = document.getElementById('home-link');
        if (homeLink) {
          // ルートの indexを指すようにする
          const root = currentDir.replace(/\/tool$/, "");
          homeLink.href = root + "/index.html";
        }
      })
      .catch(err => console.error("ヘッダー読み込み失敗", err));
  });
}
