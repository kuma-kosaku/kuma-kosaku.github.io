'use strict';
{
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("header");
    if (!target) return;

    // 現在のページの階層に応じて相対パスを決める
    const isSubPage =
      window.location.pathname.includes("/tool/") ||
      window.location.pathname.includes("/sandbox/") ||
      window.location.pathname.includes("/work/");
    const headerPath = isSubPage
      ? "../assets/header.html"
      : "./assets/header.html";

    fetch(headerPath)
      .then(res => res.text())
      .then(html => {
        target.innerHTML = html;

        // ホームリンク設定
        const homeLink = document.getElementById('home-link');
        if (homeLink) {
          homeLink.href = isSubPage
            ? "../index.html"
            : "./index.html";
        }
      })
      .catch(err => console.error("ヘッダー読み込み失敗", err));
  });
}
