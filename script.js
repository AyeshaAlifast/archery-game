// --- Game State Variables ---
let score = 0;
let arrowsLeft = 10;
let isFlying = false;

let flightProgress = 0; 

let arrowSpeed = 0.015; // Speed of the flight increment
let targetSpeed = 0.8;  // Vertical speed of the target
let arcHeight = 150;    // How high the arrow arcs

// Elements
const arrow = document.getElementById('arrow');
const target = document.getElementById('target');
const scorebox = document.getElementById('scorebox');
const arrowbox = document.getElementById('arrowbox');
const levelMenu = document.getElementById('level-menu');
const levelBtn = document.getElementById('level');

let targetY = 50;
let targetDir = 1;

function moveTarget() {
    
    if (targetY > 80 || targetY < 20) targetDir *= -1;
    targetY += targetSpeed * targetDir;
    target.style.top = targetY + "%";
    
    requestAnimationFrame(moveTarget);
}
moveTarget();

levelBtn.onclick = (e) => {
    e.stopPropagation();
    levelMenu.classList.toggle('hidden');
};


window.onclick = () => levelMenu.classList.add('hidden');

function setLevel(lvl) {
    if (lvl === 'easy') { targetSpeed = 0.4; arrowSpeed = 0.01; arcHeight = 100; }
    else if (lvl === 'medium') { targetSpeed = 0.8; arrowSpeed = 0.015; arcHeight = 150; }
    else if (lvl === 'hard') { targetSpeed = 2.0; arrowSpeed = 0.025; arcHeight = 200; }
    levelMenu.classList.add('hidden');
}


function shoot() {
    if (isFlying || arrowsLeft <= 0) return;
    
    isFlying = true;
    arrowsLeft--;
    arrowbox.innerText = arrowsLeft;
    flightProgress = 0; // Reset progress for the new shot
    performFlight();
}



function performFlight() {
    if (!isFlying) return;

    // flightProgress goes from 0 to 1
    flightProgress += arrowSpeed; 

    let startX = 12;
    let endX = 85;
    let currentX = startX + (endX - startX) * flightProgress;

    let startY = 52; 
    let arc = Math.sin(flightProgress * Math.PI) * arcHeight;
    let currentY = startY - (arc / 10); // Subtracting moves it "up" on the screen

    
    let angle = (flightProgress - 0.5) * -60; 

    // Update Styles
    arrow.style.left = currentX + "%";
    arrow.style.top = currentY + "%";
    arrow.style.transform = `translateY(-50%) rotate(${-angle}deg)`;

    // D. Collision Check
    if (checkCollision(arrow, target)) {
        score += 10;
        scorebox.innerText = score;
        resetArrow("Hit!");
    } else if (flightProgress >= 1) {
        resetArrow("Missed");
    } else {
        requestAnimationFrame(performFlight);
    }
}

function checkCollision(a, b) {
    let r1 = a.getBoundingClientRect();
    let r2 = b.getBoundingClientRect();
    
    // Check if the rectangles of the arrow and target overlap
    return !(
        r1.right < r2.left || 
        r1.left > r2.right || 
        r1.bottom < r2.top || 
        r1.top > r2.bottom
    );
}

function resetArrow(msg) {
    isFlying = false;
    
    // Snap arrow back to the bow position
    arrow.style.left = "12%";
    arrow.style.top = "52%";
    arrow.style.transform = "translateY(-50%) rotate(0deg)";
    
    if (arrowsLeft <= 0) {
        // Short delay so the player sees the last shot land
        setTimeout(() => {
            alert("Game Over! Your final score is: " + score);
            location.reload(); // Restart game
        }, 500);
    }
}