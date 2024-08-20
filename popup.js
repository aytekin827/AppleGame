let grid = [];
let score = 0;
let selectedCells = [];
let nickname;
let timerElement = document.getElementById('time-left');
let progressBar = document.getElementById('progress-bar');
let timeLeft = 20; 
let timerInterval;

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
    progressBar.classList.remove('blink')
    progressBar.classList.remove('fast-blink')
}

// 게임 보드를 화면에 렌더링하는 함수
function renderBoard() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item) => {
        const x = item.getAttribute('data-x');
        const y = item.getAttribute('data-y');
        const value = grid[x][y];

        if (value !== 0) {
            item.innerHTML = `<img src="images/apple_icon.png" alt="Apple"><span class="number">${value}</span>`;
            item.style.backgroundColor = '#f5c5d5';
        } else {
            item.innerHTML = '';
            item.style.backgroundColor = '#f5c5d5';
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
        item.querySelector('img').src = 'images/apple_icon.png'; // 이미지 원래대로 복원
    } else {
        // 새로운 셀 선택
        selectedCells.push({ x, y });
        item.querySelector('img').src = 'images/apple_icon_selected.png'; // 선택된 이미지로 변경
    }

    // 선택한 셀들의 숫자를 합산
    const sum = selectedCells.reduce((acc, cell) => acc + grid[cell.x][cell.y], 0);

    // 합이 10이면 사과 제거
    if (sum === 10) {
        selectedCells.forEach(cell => {
            const item = document.querySelector(`.grid-item[data-x="${cell.x}"][data-y="${cell.y}"]`);
            item.classList.add('pop'); // 애니메이션 클래스 추가

            // 애니메이션이 끝난 후 사과 제거
            setTimeout(() => {
                grid[cell.x][cell.y] = 0;
                item.innerHTML = '';
                item.style.backgroundColor = '#f5c5d5';
                item.classList.remove('pop'); // 테두리 색상 및 선택 상태 제거
            }, 500); // 애니메이션 지속 시간과 동일
        });
        updateScore(selectedCells.length);
        selectedCells = [];
    } else if (sum > 10) {
        // 합이 10을 넘으면 체크 해제
        clearSelectedCells();
    }
}

// 체크 해제 함수
function clearSelectedCells() {
    selectedCells.forEach(cell => {
        const item = document.querySelector(`.grid-item[data-x="${cell.x}"][data-y="${cell.y}"]`);
        item.querySelector('img').src = 'images/apple_icon.png'; // 이미지 원래대로 복원
    });
    selectedCells = [];
}

// 게임을 재시작하는 함수
function restartGame() {
    timeLeft = 20

    document.getElementById('grid-overlay').classList.add('off')
    document.getElementById('grid-overlay').classList.remove('on')

    score = 0;
    updateScore(0);
    selectedCells = [];
    initBoard();

    timerElement.textContent = `${timeLeft}`;
    progressBar.style.width = `100%`;

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function submitNickname() {
    nickname = document.getElementById('nickname-input')
    
}

// 게임 시작 함수
function startGame() {
    // 타이머 시작
    timeLeft = 20

    timerElement.textContent = `${timeLeft}`;
    progressBar.style.width = `100%`;

    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('home-button').classList.remove('hidden')

    // 초기 게임 셋업
    initializeGame();
}

function initTimer() {
    progressBar.style.width = `100%`;
    timeLeft = 20
    timerElement.textContent = `${timeLeft}`;
}

// 타이머 업데이트 함수
function updateTimer() {
    timeLeft--;
    timerElement.textContent = `${timeLeft}`;

    // 남은 시간을 백분율로 계산하여 progress bar의 너비 조정
    const progressPercentage = (timeLeft / 20) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
    } else if (timeLeft <= 3) {
        progressBar.classList.remove('blink');
        progressBar.classList.add('fast-blink');
    } else if (timeLeft <= 5) {
        progressBar.classList.add('blink');
    }
}

// 게임 종료 함수
function endGame() {
    document.getElementById('camera-button').classList.remove('hidden');
    document.getElementById('grid-overlay').classList.add('on')
    document.getElementById('grid-overlay').classList.remove('off')
    // 게임 종료 메시지 표시
    
    // 게임 종료 시 더 게임 플레이 못하도록 처리

    // 필요시 추가적인 게임 종료 로직을 여기서 처리
    // 예: 재시작 버튼 활성화, 점수 저장 등
}

// 타이머를 초기화하고 게임을 초기화하는 함수
function initializeGame() {
    // 여기에 게임 초기화 코드
    // 예: 그리드 초기화, 점수 초기화, 닉네임 표시 등
}

// 게임 시작 버튼을 눌렀을 때 시작하도록 이벤트 리스너 추가
document.getElementById('start-game').addEventListener('click', function() {
    document.getElementById("meta-info").classList.add('hidden')
    document.getElementById("game-board").classList.remove('hidden')
    startGame();
});

// 초기화 및 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    document.getElementById('restart').addEventListener('click', restartGame);
    document.querySelectorAll('.grid-item').forEach((item) => {
        item.addEventListener('click', handleItemClick);
    });

    // 마우스 오른쪽 버튼 클릭 시 체크 해제
    // document.addEventListener('contextmenu', (event) => {
    //     event.preventDefault(); // 기본 컨텍스트 메뉴 방지
    //     clearSelectedCells(); // 선택된 셀 체크 해제
    // });
});

document.getElementById('camera-button').addEventListener('click', function() {
    html2canvas(document.body).then(canvas => {
        // 스크린샷을 이미지로 변환하여 다운로드
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

document.getElementById('home-button').addEventListener('click', function() {
    document.getElementById("meta-info").classList.remove('hidden')
    document.getElementById("game-board").classList.add('hidden')
    document.getElementById('home-button').classList.add('hidden')

    clearInterval(timerInterval);

});