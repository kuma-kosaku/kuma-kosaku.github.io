'use strict';
{
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("header");
    if (!target) return;

    fetch("../assets/header.html")
      .then(res => res.text())
      .then(html => {
        target.innerHTML = html;
      })
      .catch(err => console.error("ヘッダー読み込み失敗", err));
  });
}