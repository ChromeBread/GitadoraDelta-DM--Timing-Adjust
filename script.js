document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const overlayOk = document.getElementById('overlay-ok');
    const langEn = document.getElementById('lang-en');
    const langJa = document.getElementById('lang-ja');
    const calculateBtnEn = document.getElementById('calculate-btn-en');
    const calculateBtnJa = document.getElementById('calculate-btn-ja');
    const bpmInput = document.getElementById('bpm-input');
    const result = document.getElementById('result');

    let currentLang = 'en';

    // オーバーレイを閉じる
    overlayOk.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // 言語切り替え
    langEn.addEventListener('click', () => switchLanguage('en'));
    langJa.addEventListener('click', () => switchLanguage('ja'));

    function switchLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[id*="-en"]').forEach(el => {
            el.classList.toggle('hidden', lang !== 'en');
        });
        document.querySelectorAll('[id*="-ja"]').forEach(el => {
            el.classList.toggle('hidden', lang !== 'ja');
        });
        langEn.classList.toggle('active', lang === 'en');
        langJa.classList.toggle('active', lang === 'ja');
    }

    // 計算ロジック
    function calculateSettings(bpm) {
        // HI-SPEEDの計算（線形補間）
        const bpmMin = 180;
        const bpmMax = 400;
        const hiSpeedMin = 8.5;
        const hiSpeedMax = 1.5;
        const hiSpeedReference = 3.75;

        let hiSpeed;
        if (bpm <= bpmMin) {
            hiSpeed = hiSpeedReference;
        } else if (bpm >= bpmMax) {
            hiSpeed = hiSpeedMax;
        } else {
            // 線形補間
            const ratio = (bpm - bpmMin) / (bpmMax - bpmMin);
            hiSpeed = hiSpeedReference + (hiSpeedMax - hiSpeedReference) * ratio;
        }
        hiSpeed = Math.round(hiSpeed * 100) / 100;

        // ノーツ表示調整の計算
        const refreshRate = 60; // Hz
        const monitorDelay = 9; // ms
        const baseNoteAdjust = -6; // BPM:180での基準値
        const noteAdjust = Math.round(baseNoteAdjust * (bpmMin / bpm) * (hiSpeedReference / hiSpeed));

        // 緑数字の計算（疑似的、IIDXの緑数字はスクロール速度に基づく）
        const greenNumber = Math.round((60000 / (bpm * hiSpeed)) * (refreshRate / 60));

        return { hiSpeed, noteAdjust, greenNumber };
    }

    // 計算ボタンの処理
    calculateBtnEn.addEventListener('click', calculate);
    calculateBtnJa.addEventListener('click', calculate);

    function calculate() {
        const bpm = parseFloat(bpmInput.value);
        if (isNaN(bpm) || bpm <= 0) {
            alert(currentLang === 'en' ? 'Please enter a valid BPM.' : '有効なBPMを入力してください。');
            return;
        }

        const { hiSpeed, noteAdjust, greenNumber } = calculateSettings(bpm);

        document.getElementById('hi-speed-value').textContent = `x${hiSpeed.toFixed(2)}`;
        document.getElementById('hi-speed-value-ja').textContent = `x${hiSpeed.toFixed(2)}`;
        document.getElementById('note-adjust-value').textContent = noteAdjust;
        document.getElementById('note-adjust-value-ja').textContent = noteAdjust;
        document.getElementById('green-number-value').textContent = greenNumber;
        document.getElementById('green-number-value-ja').textContent = greenNumber;

        result.classList.remove('hidden');
    }
});
