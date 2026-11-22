'use strict';
{
  const storageKey = 'kuma-kosaku_income';
  const monthCount = 12;

  function setStatus(message) {
    document.getElementById('status').textContent = message;
  }

  function createIncomeRow(savedData) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'income-name';
    nameInput.required = true;
    nameInput.setAttribute('aria-label', '銘柄');
    nameInput.value = savedData ? savedData.name : '';
    nameCell.appendChild(nameInput);
    row.appendChild(nameCell);

    const amountCell = document.createElement('td');
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.className = 'income-amount';
    amountInput.min = '0';
    amountInput.step = '1';
    amountInput.required = true;
    amountInput.setAttribute('aria-label', '保有金額（円）');
    amountInput.value = savedData ? savedData.amount : '';
    amountCell.appendChild(amountInput);
    row.appendChild(amountCell);

    const rateCell = document.createElement('td');
    const rateInput = document.createElement('input');
    rateInput.type = 'number';
    rateInput.className = 'income-rate';
    rateInput.min = '0';
    rateInput.step = '0.01';
    rateInput.required = true;
    rateInput.setAttribute('aria-label', '想定年利（%）');
    rateInput.value = savedData ? savedData.rate : '';
    rateCell.appendChild(rateInput);
    row.appendChild(rateCell);

    for (let month = 1; month <= monthCount; month++) {
      const monthCell = document.createElement('td');
      monthCell.className = 'month-cell';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'income-month';
      checkbox.value = String(month);
      checkbox.setAttribute('aria-label', `${month}月`);
      checkbox.checked = Boolean(savedData && savedData.months.includes(month));
      monthCell.appendChild(checkbox);
      row.appendChild(monthCell);
    }

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => row.remove());
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    document.querySelector('#incomeTable tbody').appendChild(row);
  }

  function readIncomeRows() {
    const rows = [];
    let yearlyTotal = 0;
    for (const row of document.querySelectorAll('#incomeTable tbody tr')) {
      const name = row.querySelector('.income-name').value.trim();
      const amountInput = row.querySelector('.income-amount');
      const rateInput = row.querySelector('.income-rate');
      const months = Array.from(row.querySelectorAll('.income-month:checked'))
        .map(checkbox => Number(checkbox.value));

      if (!name) {
        row.querySelector('.income-name').setCustomValidity('銘柄を入力してください。');
        row.querySelector('.income-name').reportValidity();
        return null;
      }
      row.querySelector('.income-name').setCustomValidity('');
      if (!amountInput.checkValidity() || !rateInput.checkValidity()) {
        (amountInput.value && amountInput.checkValidity() ? rateInput : amountInput).reportValidity();
        return null;
      }
      if (months.length === 0) {
        setStatus(`${name}の受取月を1つ以上選択してください。`);
        return null;
      }

      const amount = Number(amountInput.value);
      const rate = Number(rateInput.value);
      const annualIncome = Math.round(amount * rate / 100);
      if (!Number.isSafeInteger(annualIncome)) {
        setStatus(`${name}の年間見込み額が大きすぎます。金額または年利を確認してください。`);
        return null;
      }
      yearlyTotal += annualIncome;
      if (!Number.isSafeInteger(yearlyTotal)) {
        setStatus('年間合計額が大きすぎます。保有金額または年利を確認してください。');
        return null;
      }

      rows.push({ name, amount, rate, months, annualIncome });
    }
    return rows;
  }

  function saveSettings(rows) {
    const data = rows.map(({ name, amount, rate, months }) => ({
      name,
      amount,
      rate,
      months
    }));
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      setStatus('入力内容をブラウザーに保存できませんでした。ブラウザーの設定を確認してください。');
      console.error('income simulator: failed to save settings', error);
      return false;
    }
  }

  function renderResult(rows) {
    const monthlyTotals = Array(monthCount).fill(0);
    let total = 0;

    rows.forEach(({ months, annualIncome }) => {
      const monthlyBase = Math.floor(annualIncome / months.length);
      const remainder = annualIncome % months.length;
      months.forEach((month, index) => {
        monthlyTotals[month - 1] += monthlyBase + (index < remainder ? 1 : 0);
      });
      total += annualIncome;
    });

    const resultBody = document.getElementById('resultBody');
    resultBody.replaceChildren();
    monthlyTotals.forEach((amount, index) => {
      const row = document.createElement('tr');
      const monthCell = document.createElement('th');
      monthCell.scope = 'row';
      monthCell.textContent = `${index + 1}月`;
      const amountCell = document.createElement('td');
      amountCell.textContent = `${amount.toLocaleString()}円`;
      row.append(monthCell, amountCell);
      resultBody.appendChild(row);
    });
    document.getElementById('resultTotal').textContent = `${total.toLocaleString()}円`;
  }

  function simulate() {
    setStatus('');
    const rows = readIncomeRows();
    if (!rows || rows.length === 0) {
      if (rows && rows.length === 0) {
        setStatus('銘柄を1件以上入力してください。');
      }
      return;
    }

    const saved = saveSettings(rows);
    renderResult(rows);
    if (saved) {
      setStatus('入力内容を保存し、年間の見込み額を計算しました。');
    }
  }

  function loadSettings() {
    let stored;
    try {
      const rawData = localStorage.getItem(storageKey);
      if (rawData === null) {
        createIncomeRow();
        return;
      }
      stored = JSON.parse(rawData);
    } catch (error) {
      createIncomeRow();
      setStatus('保存データを読み込めませんでした。入力し直して決定してください。');
      console.error('income simulator: failed to load settings', error);
      return;
    }

    if (!Array.isArray(stored) || stored.some(item =>
      !item || typeof item.name !== 'string' ||
      !Number.isFinite(Number(item.amount)) ||
      !Number.isFinite(Number(item.rate)) ||
      !Array.isArray(item.months) ||
      item.months.some(month => !Number.isInteger(month) || month < 1 || month > monthCount)
    )) {
      createIncomeRow();
      setStatus('保存データの形式が正しくありません。入力し直して決定してください。');
      return;
    }

    if (stored.length === 0) {
      createIncomeRow();
      return;
    }
    stored.forEach(item => createIncomeRow({
      name: item.name,
      amount: item.amount,
      rate: item.rate,
      months: item.months
    }));
  }

  document.getElementById('addIncomeRow').addEventListener('click', () => createIncomeRow());
  document.getElementById('simulate').addEventListener('click', simulate);
  loadSettings();
}
