'use strict';
{
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("header");
    if (!target) return;
    // ローカルとGitHubでルートが異なる件について対応
    const parts = window.location.pathname.split("/");
    const repoName = parts[1];
    const isGitHub = location.hostname.endsWith("github.io");
    // GitHub上なら"/リポジトリ名"をルートにする
    const root = isGitHub ? '/' + repoName : "";

    fetch(root + "/assets/header.html")
      .then(res => res.text())
      .then(html => {
        target.innerHTML = html;
        // ホーム画面へのリンクを付与する
        const homeLink = document.getElementById('home-link');
        if (homeLink) {
          homeLink.href = root + '/index.html';
        }
      })
      .catch(err => console.error("ヘッダー読み込み失敗", err));
  });
}