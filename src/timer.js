// src/timer.js
// A small timer abstraction used by the app. Works with seconds-level precision.
export function createTimer({ onTick = ()=>{}, onTarget = ()=>{}, onOvertime = ()=>{}, targetSeconds = 300 } = {}){
  let intervalId = null;
  let startAt = null; // epoch seconds
  let pausedElapsed = 0; // seconds
  let running = false;

  function nowSec(){ return Math.floor(Date.now()/1000); }
  function getElapsed(){
    if(!startAt) return pausedElapsed;
    return running ? Math.floor(nowSec() - startAt) : pausedElapsed;
  }

  function tick(){
    const elapsed = getElapsed();
    const capped = Math.min(elapsed, targetSeconds);
    const remaining = Math.max(0, targetSeconds - capped);
    try{ onTick(elapsed, remaining); }catch(e){ console.error('onTick handler failed', e); }
    if(elapsed >= targetSeconds){
      try{ onTarget(); }catch(e){ console.error('onTarget handler failed', e); }
    }
    if(elapsed > targetSeconds){
      try{ onOvertime(elapsed); }catch(e){ console.error('onOvertime handler failed', e); }
    }
  }

  function start(){
    if(running) return;
    startAt = nowSec() - pausedElapsed;
    intervalId = setInterval(tick, 1000);
    running = true;
    tick();
  }

  function pause(){
    if(!running) return;
    pausedElapsed = getElapsed();
    if(intervalId){ clearInterval(intervalId); intervalId = null; }
    running = false;
  }

  function resume(){ start(); }

  function stop(){
    if(intervalId){ clearInterval(intervalId); intervalId = null; }
    running = false;
    pausedElapsed = 0;
    startAt = null;
  }

  function setTarget(s){ targetSeconds = Number(s) || targetSeconds; }

  return { start, pause, resume, stop, getElapsed, isRunning: ()=>running, setTarget };
}
