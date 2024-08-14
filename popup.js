let grid = [];
let score = 0;
let selectedCells = [];
let nickname;

// 게임 보드를 초기화하는 함수
function initBoard() {
    grid = [];
    for (let i = 0; i < 8; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            const randomValue = Math.floor(Math.random() * 9) + 1;
            row.push(randomValue);
        }
        grid.push(row);
    }
    renderBoard();
}

// 게임 보드를 화면에 렌더링하는 함수
function renderBoard() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item) => {
        const x = item.getAttribute('data-x');
        const y = item.getAttribute('data-y');
        const value = grid[x][y];

        if (value !== 0) {
            item.innerHTML = `<img src="images/apple_icon.png" alt="Apple"><span>${value}</span>`;
            item.style.backgroundColor = '#f0f0f0';
        } else {
            item.innerHTML = '';
            item.style.backgroundColor = '#ccc';
        }
    });
}

// 게임 점수를 업데이트하는 함수
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = `Score: ${score}`;
}

// 칸을 클릭했을 때 처리하는 함수
function handleItemClick(event) {
    const item = event.target.closest('.grid-item');
    const x = parseInt(item.getAttribute('data-x'));
    const y = parseInt(item.getAttribute('data-y'));

    // 이미 선택된 셀이라면 선택 취소
    if (selectedCells.some(cell => cell.x === x && cell.y === y)) {
        selectedCells = selectedCells.filter(cell => !(cell.x === x && cell.y === y));
        item.style.backgroundColor = '#f0f0f0';
    } else {
        // 새로운 셀 선택
        selectedCells.push({ x, y });
        item.style.backgroundColor = '#d0d0d0';
    }

    // 선택한 셀들의 숫자를 합산
    const sum = selectedCells.reduce((acc, cell) => acc + grid[cell.x][cell.y], 0);

    // 합이 10이면 사과 제거
    if (sum === 10) {
        selectedCells.forEach(cell => {
            grid[cell.x][cell.y] = 0;
            const item = document.querySelector(`.grid-item[data-x="${cell.x}"][data-y="${cell.y}"]`);
            item.innerHTML = '';
            item.style.backgroundColor = '#ccc';
        });
        updateScore(selectedCells.length);
        selectedCells = [];
    }
}

// 게임을 재시작하는 함수
function restartGame() {
    score = 0;
    updateScore(0);
    selectedCells = [];
    initBoard();
}

chrome.storage.sync.set({key: value}, function() {
    console.log('Value is set to ' + value);
  });
  
chrome.storage.sync.get(['key'], function(result) {
    console.log('Value currently is ' + result.key);
  });

function submitNickname() {
    nickname = document.getElementById('nickname-input')
    
}

// 초기화 및 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    document.getElementById('restart').addEventListener('click', restartGame);
    document.querySelectorAll('.grid-item').forEach((item) => {
        item.addEventListener('click', handleItemClick);
    });
});
