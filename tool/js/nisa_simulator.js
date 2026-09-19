'use strict';
{
  function simulate() {
    console.log('NISA 積立シミュレーションを実行');

    const monthly = Number(document.getElementById('monthly').value);
    const startMonth = document.getElementById('startMonth').value;
    const annualRate = Number(document.getElementById('annualRate').value) / 100;
    const years = Number(document.getElementById('years').value);

    // 月単位で計算するので月利を計算する
    // 月ごとの複利があるため、年利を1/12乗した数値を月利とする
    const months = years * 12;
    const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;

    const maxInvest = 10800000;
    let totalInvest = 0;
    let profit = 0;
    let value = 0;
    let prevValue = 0;

    const container = document.getElementById('resultContainer');
    container.innerHTML = '';

    let [year, month] = startMonth.split('-').map(Number);
    let currentYear = null;
    let detailsEl = null;
    let tbody = null;

    for (let i = 0; i < months; i++) {
      // 計算前にひとつ前の金額として保持する
      prevValue = value;
      // 積立枠の限度額が上限に達した場合は制限する
      totalInvest += monthly;
      if (totalInvest >= maxInvest) {
        totalInvest = maxInvest;
      }
      // 評価額を（積立総額 + これまでの利益） * 利率で出す
      value = (totalInvest + profit) * (1 + monthlyRate);
      // 評価額 - 積立総額で利益を更新する
      profit = value - totalInvest;

      // 小数点を切り捨てておく
      value = Math.floor(value);
      profit = Math.floor(profit);

      // 年が変わったら新しいアコーディオンを作る
      if (currentYear !== year) {
        currentYear = year;

        detailsEl = document.createElement('details');
        detailsEl.style.marginBottom = '10px';

        const summaryEl = document.createElement('summary');
        summaryEl.textContent = `${year}年　年初の評価額：${prevValue.toLocaleString()}円`;
        summaryEl.style.cursor = 'pointer';
        summaryEl.style.fontWeight = 'bold';

        detailsEl.appendChild(summaryEl);

        // 年ごとのテーブル
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';
        table.innerHTML = `
        <thead>
          <tr>
            <th>年月</th>
            <th>累計積立額</th>
            <th>評価額</th>
            <th>利益</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
        tbody = table.querySelector('tbody');

        detailsEl.appendChild(table);
        container.appendChild(detailsEl);
      }

      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${year}-${String(month).padStart(2, '0')}</td>
      <td>${totalInvest.toLocaleString()}</td>
      <td>${value.toLocaleString()}</td>
      <td>${profit.toLocaleString()}</td>
    `;
      tbody.appendChild(row);

      month++;
      if (month > 12) { month = 1; year++; }
    }
  }

  document.getElementById('simulate').addEventListener('click', simulate);
}