// ...existing code...
let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];

function setup() {
    // ...existing code...
    // 修改：固定畫布大小並置中，並將整個視窗背景設為 #121220
    let canvas = createCanvas(800, 600);
    canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    rectMode(CENTER);
    document.body.style.backgroundColor = '#121220';
    objs.push(new DynamicShape());
}

function draw() {
    // 修改：使用透明背景以顯示整個視窗的底色
    clear();
    for (let i of objs) {
        i.run();
    }

    // 在畫布中心加入文字
    push();
    textSize(48);
    textAlign(CENTER, CENTER);
    fill('#ffffff');  // 白色文字
    text('教科一B 賴思米', width/2, height/2);
    pop();

    if (frameCount % int(random([40, 80])) == 0) {
        let addNum = int(random(1, 30));
        for (let i = 0; i < addNum; i++) {
            objs.push(new DynamicShape());
        }
    }
    for (let i = 0; i < objs.length; i++) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }
}

// 新增：視窗大小變動時重新置中畫布
function windowResized() {
    if (typeof canvas !== 'undefined') {
        // 重新置中
        let cnv = document.querySelector('canvas');
        if (cnv) {
            cnv.style.position = 'absolute';
            cnv.style.left = ((windowWidth - width) / 2) + 'px';
            cnv.style.top = ((windowHeight - height) / 2) + 'px';
        }
    }
}

function easeInOutExpo(x) {
    return x === 0 ? 0 :
        x === 1 ?
        1 :
        x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
        (2 - Math.pow(2, -20 * x + 10)) / 2;
}

class DynamicShape {
    constructor() {
        this.x = random(0.3, 0.7) * width;
        this.y = random(0.3, 0.7) * height;
        this.reductionRatio = 1;
        this.shapeType = int(random(4));
        this.animationType = 0;
        this.maxActionPoints = int(random(2, 5));
        this.actionPoints = this.maxActionPoints;
        this.elapsedT = 0;
        this.size = 0;
        this.sizeMax = width * random(0.01, 0.05);
        this.fromSize = 0;
        this.init();
        this.isDead = false;
        this.clr = random(colors);
        this.changeShape = true;
        this.ang = int(random(2)) * PI * 0.25;
        this.lineSW = 0;
    }

    show() {
        push();
        translate(this.x, this.y);
        rotate(this.ang); 
        if (this.animationType == 1) scale(1, this.reductionRatio);
        if (this.animationType == 2) scale(this.reductionRatio, 1);
        fill(this.clr);
        stroke(this.clr);
        strokeWeight(this.size * 0.05);
        if (this.shapeType == 0) {
            noStroke();
            circle(0, 0, this.size);
        } else if (this.shapeType == 1) {
            noFill();
            circle(0, 0, this.size);
        } else if (this.shapeType == 2) {
            noStroke();
            rect(0, 0, this.size, this.size);
        } else if (this.shapeType == 3) {
            noFill();
            rect(0, 0, this.size * 0.9, this.size * 0.9);
        } else if (this.shapeType == 4) {
            line(0, -this.size * 0.45, 0, this.size * 0.45);
            line(-this.size * 0.45, 0, this.size * 0.45, 0);
        }
        pop();
        strokeWeight(this.lineSW);
        stroke(this.clr);
        line(this.x, this.y, this.fromX, this.fromY);
    }

    move() {
        let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
        if (0 < this.elapsedT && this.elapsedT < this.duration) {
            if (this.actionPoints == this.maxActionPoints) {
                this.size = lerp(0, this.sizeMax, n);
            } else if (this.actionPoints > 0) {
                if (this.animationType == 0) {
                    this.size = lerp(this.fromSize, this.toSize, n);
                } else if (this.animationType == 1) {
                    this.x = lerp(this.fromX, this.toX, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 2) {
                    this.y = lerp(this.fromY, this.toY, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 3) {
                    if (this.changeShape == true) {
                        this.shapeType = int(random(5));
                        this.changeShape = false;
                    }
                }
                this.reductionRatio = lerp(1, 0.3, sin(n * PI));
            } else {
                this.size = lerp(this.fromSize, 0, n);
            }
        }

        this.elapsedT++;
        if (this.elapsedT > this.duration) {
            this.actionPoints--;
            this.init();
        }
        if (this.actionPoints < 0) {
            this.isDead = true;
        }
    }

    run() {
        this.show();
        this.move();
    }

    init() {
        this.elapsedT = 0;
        this.fromSize = this.size;
        this.toSize = this.sizeMax * random(0.5, 1.5);
        this.fromX = this.x;
        this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
        this.fromY = this.y;
        this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
        this.animationType = int(random(3));
        this.duration = random(20, 50);
    }
}

// 新增：左側固定選單
const leftMenu = document.createElement('aside');
leftMenu.id = 'leftMenu';
leftMenu.innerHTML = `
    <nav>
        <ul>
            <li id="menu-item-works">第一單元作品</li>
            <li id="menu-item-notes">第一單元講義</li>
            <li id="menu-item-quiz">第二單元測驗系統</li>
            <li id="menu-item-midterm">期中考作品筆記</li>
            <li id="menu-item-exam">測驗卷作品筆記</li>
            <li id="menu-item-home">回到首頁</li>
        </ul>
    </nav>
`;
document.body.appendChild(leftMenu);

const style = document.createElement('style');
style.innerHTML = `
    #leftMenu {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 300px;
        background: rgba(18,18,32,0.98);
        color: #ffffff;
        padding: 40px 24px;
        box-sizing: border-box;
        z-index: 9999;
        -webkit-font-smoothing: antialiased;
    }
    #leftMenu nav ul { list-style: none; margin: 0; padding: 0; }
    #leftMenu nav ul li {
        font-size: 32px; /* 32px */
        margin: 20px 0;
        cursor: pointer;
        user-select: none;
    }
    #leftMenu nav ul li:hover { opacity: 0.9; }

    /* iframe overlay */
    #iframeOverlay {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.6);
        z-index: 10000;
    }
    #iframeOverlay.visible { display: flex; }
    #iframeOverlay .iframe-wrap {
        position: relative;
    }
    #contentIframe {
        width: 70vw;       /* 70% 視窗寬 */
        height: 85vh;      /* 85% 視窗高 */
        border: none;
        border-radius: 6px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.6);
        background: #fff;
    }
    #closeIframe {
        position: absolute;
        right: -12px;
        top: -12px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: #111;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }
`;
document.head.appendChild(style);

// 新增：iframe overlay 組件（預設隱藏）
const overlay = document.createElement('div');
overlay.id = 'iframeOverlay';
overlay.innerHTML = `
    <div class="iframe-wrap">
        <button id="closeIframe" aria-label="關閉">×</button>
        <iframe id="contentIframe" src="about:blank" allowfullscreen></iframe>
    </div>
`;
document.body.appendChild(overlay);

// 點擊處理：選單項目 => 顯示 iframe（70% 寬，85% 高）
const worksBtn = document.getElementById('menu-item-works');
const notesBtn = document.getElementById('menu-item-notes');
const quizBtn = document.getElementById('menu-item-quiz');

const midtermBtn = document.getElementById('menu-item-midterm');
const examBtn = document.getElementById('menu-item-exam');

const iframeOverlay = document.getElementById('iframeOverlay');
const contentIframe = document.getElementById('contentIframe');
const closeBtn = document.getElementById('closeIframe');

worksBtn && worksBtn.addEventListener('click', () => {
  contentIframe.src = 'https://mina1150278-debug.github.io/20251101-1/';
  iframeOverlay.classList.add('visible');
});

notesBtn && notesBtn.addEventListener('click', () => {
  contentIframe.src = 'https://hackmd.io/@YPlb5MOlSYySCINSKemhhA/HJ5cPQRoxx';
  iframeOverlay.classList.add('visible');
});

quizBtn && quizBtn.addEventListener('click', () => {
  contentIframe.src = 'https://mina1150278-debug.github.io/20251110-quiz/';
  iframeOverlay.classList.add('visible');
});

// 期中考作品的點擊事件 (已更新連結)
midtermBtn && midtermBtn.addEventListener('click', () => {
  contentIframe.src = 'https://hackmd.io/@YPlb5MOlSYySCINSKemhhA/r1Ocb-ulbg'; 
  iframeOverlay.classList.add('visible');
});

// ✨ 測驗卷作品的點擊事件 (已更新連結)
examBtn && examBtn.addEventListener('click', () => {
  contentIframe.src = 'https://hackmd.io/@YPlb5MOlSYySCINSKemhhA/rJXG7-Olbe';
  iframeOverlay.classList.add('visible');
});

closeBtn && closeBtn.addEventListener('click', () => {
  iframeOverlay.classList.remove('visible');
  // 延遲清空 src，避免背景持續載入
  setTimeout(() => { contentIframe.src = 'about:blank'; }, 300);
});

// 回到首頁
document.getElementById('menu-item-home').addEventListener('click', () => {
    window.location.href = '/';
});
