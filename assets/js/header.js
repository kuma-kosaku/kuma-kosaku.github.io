'use strict';
{
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("header");
    if (!target) return;

    // 現在のページの階層に応じて相対パスを決める
    const isToolPage = window.location.pathname.includes("/tool/");
    const headerPath = isToolPage
      ? "../assets/header.html"
      : "./assets/header.html";

    fetch(headerPath)
      .then(res => res.text())
      .then(html => {
        target.innerHTML = html;

        // ホームリンク設定
        const homeLink = document.getElementById('home-link');
        if (homeLink) {
          homeLink.href = isToolPage
            ? "../index.html"
            : "./index.html";
        }
      })
      .catch(err => console.error("ヘッダー読み込み失敗", err));
  });
}
