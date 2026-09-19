'use strict'
{
  // アコーディオン
  function toggleAccordion(el) {
    const body = el.nextElementSibling;
    body.style.display = (body.style.display === "block") ? "none" : "block";
  }

  // 繰上げ返済行追加
  function addPrepayRow() {
    const tbody = document.querySelector("#prepayTable tbody");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td><input type="month" class="pp-month"></td>
    <td><input type="number" class="pp-amount" value="100000"></td>
    <td>
      <select class="pp-type">
        <option value="shorten">期間短縮</option>
        <option value="reduce">返済額軽減</option>
      </select>
    </td>
    <td><button onclick="this.parentNode.parentNode.remove()">削除</button></td>
  `;
    tbody.appendChild(row);
  }

  // 元利均等返済の月額計算
  function calcMonthlyPayment(principal, annualRate, months) {
    const r = annualRate / 12;
    return Math.ceil(principal * r / (1 - Math.pow(1 + r, -months)));
  }

  function simulate() {
    const loanAmount = Number(document.getElementById("loanAmount").value);
    const interestRate = Number(document.getElementById("interestRate").value) / 100;
    const discountRate = Number(document.getElementById("discountRate").value) / 100;
    const discountYears = Number(document.getElementById("discountYears").value);
    const loanYears = Number(document.getElementById("loanYears").value);

    const totalMonths = loanYears * 12;
    const discountMonths = discountYears * 12;

    let balance = loanAmount;
    let monthlyRate;
    let monthlyPayment;

    // 初期返済額（優遇金利適用）
    monthlyRate = discountRate / 12;
    monthlyPayment = calcMonthlyPayment(balance, discountRate, totalMonths);

    // 繰上げ返済データ
    const prepayList = [];
    document.querySelectorAll("#prepayTable tbody tr").forEach(row => {
      const m = row.querySelector(".pp-month").value;
      const amt = Number(row.querySelector(".pp-amount").value);
      const type = row.querySelector(".pp-type").value;
      if (m) {
        const [y, mm] = m.split("-").map(Number);
        prepayList.push({ year: y, month: mm, amount: amt, type });
      }
    });

    // 結果格納
    const result = {};
    let currentYear = new Date().getFullYear();
    let yearCounter = 0;

    for (let i = 0; i < totalMonths; i++) {
      const year = currentYear + Math.floor(i / 12);
      const month = (i % 12) + 1;

      // 金利切替
      if (i < discountMonths) {
        monthlyRate = discountRate / 12;
      } else {
        monthlyRate = interestRate / 12;
      }

      // 利息
      const interest = Math.floor(balance * monthlyRate);

      // 元金
      let principal = monthlyPayment - interest;
      if (principal < 0) principal = 0;

      // 繰上げ返済チェック
      const pp = prepayList.find(p => p.year === year && p.month === month);
      if (pp) {
        balance -= pp.amount;
        if (balance < 0) balance = 0;

        if (pp.type === "shorten") {
          // 期間短縮 → 残高に応じて返済額はそのまま
          monthlyPayment = monthlyPayment;
        } else {
          // 返済額軽減 → 残り期間で再計算
          const remainMonths = totalMonths - i;
          monthlyPayment = calcMonthlyPayment(balance, (i < discountMonths ? discountRate : interestRate), remainMonths);
        }
      }

      balance -= principal;
      if (balance < 0) balance = 0;

      // 年ごとにまとめる
      if (!result[year]) result[year] = [];
      result[year].push({
        ym: `${year}-${String(month).padStart(2, "0")}`,
        monthlyPayment,
        principal,
        interest,
        balance
      });

      if (balance <= 0) break;
    }

    // アコーディオン表示
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    Object.keys(result).forEach(year => {
      const header = document.createElement("div");
      header.className = "acc-header";
      header.textContent = `${year}年（${result[year][0].ym} の支払から）`;
      header.onclick = () => toggleAccordion(header);

      const body = document.createElement("div");
      body.className = "acc-body";

      let html = `<table><thead>
      <tr><th>年月</th><th>返済総額</th><th>（元金分）</th><th>（利息分）</th><th>残高</th></tr>
    </thead><tbody>`;

      result[year].forEach(r => {
        html += `
        <tr>
          <td>${r.ym}</td>
          <td>${r.monthlyPayment.toLocaleString()}</td>
          <td>${r.principal.toLocaleString()}</td>
          <td>${r.interest.toLocaleString()}</td>
          <td>${r.balance.toLocaleString()}</td>
        </tr>
      `;
      });

      html += "</tbody></table>";
      body.innerHTML = html;
      resultDiv.appendChild(header);
      resultDiv.appendChild(body);
    });
  }

  document.getElementById('addPrepayRow').addEventListener('click', addPrepayRow);
  document.getElementById('simulate').addEventListener('click', simulate);
}