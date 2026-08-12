'use strict';
{
      // Zalgo用の結合文字セット
    const zalgoUp = [
      '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310',
      '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343',
      '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350',
      '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d',
      '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369',
      '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f'
    ];

    const zalgoMid = [
      '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327',
      '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e',
      '\u035f', '\u0360', '\u0362', '\u0338', '\u0337', '\u0361', '\u0489'
    ];

    const zalgoDown = [
      '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f',
      '\u0320', '\u0323', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b',
      '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333',
      '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0346', '\u0347', '\u0348',
      '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359',
      '\u035a', '\u0323'
    ];

    // ランダムに結合文字を付与する関数
    const randomChars = (chars, count) =>
      Array.from({ length: count }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    // ASCII判定
    const isAscii = (char) => /^[\x00-\x7F]$/.test(char);

    // 全角判定（簡易：ASCII以外を全角扱い）
    const isZenkaku = (char) => !isAscii(char);

    // 全角→ASCII置換（20%）
    const maybeReplaceWithAscii = (char) => {
      if (!isZenkaku(char)) return char; // 全角でなければそのまま
      if (Math.random() > 0.2) return char; // 20%の確率で置換

      // ASCII候補（半角英数字＋記号）
      const asciiPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':\",.<>/?";
      return asciiPool[Math.floor(Math.random() * asciiPool.length)];
    };

    // ASCIIのみZalgo化
    const zalgoAsciiOnly = (char, level) => {
      if (!isAscii(char)) return char; // ASCII以外はZalgo化しない
      return char
        + randomChars(zalgoUp, level)
        + randomChars(zalgoMid, level)
        + randomChars(zalgoDown, level);
    };

    // メイン処理：全角20%でASCII化 → ASCIIのみZalgo化
    const toZalgoSelective = (text, level = 3) => {
      return text
        .split('')
        .map(char => {
          const replaced = maybeReplaceWithAscii(char); // 全角→ASCII置換（20%）
          return zalgoAsciiOnly(replaced, level);       // ASCIIのみZalgo化
        })
        .join('');
    };

    document.getElementById("zalgoButton").addEventListener("click", () => {
      const input = document.getElementById("inputText").value;
      const output = toZalgoSelective(input, 4);
      document.getElementById("output").textContent = output;
    });
}