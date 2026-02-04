const box = document.getElementById('box');
const btn = document.getElementById('startButton');

let direction = 1;

let position = 0; 
let timer = null; 
let isMoving =false;
btn.addEventListener('click', () => {
  if(isMoving){
    clearInterval(timer);  // stop the movement loop
    isMoving=false;
    btn.innerText="Start";
  }
  else{
    isMoving=true;
    btn.innerText="Stop";
    timer=setInterval(moveBox,10); 
    //setting the movement loop  
    //10ms is the wait time before the next move
  }
});
  function moveBox() {
   position+=(2*direction);
   if(position>320){
    direction=-1;
   }
   if(position<0){
    direction=1;
   }
   box.style.left=position+'px';
  }
