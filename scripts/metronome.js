/** 
* This script sets up a basic metronome click with tempo and sync adjustment
* Also creates a transport start/stop button
*/
//Tone.context.latencyHint = "balanced";
var bpm = 138; // default tempo

console.log("default tempo: " + bpm + " bpm");

Tone.Transport.bpm.value = bpm;

//const ostSynth = new Tone.PolySynth(Tone.Synth).toDestination();
var ostSynth = synthLibrary[0].synth; // pull from synth library
const ostLoop = new Tone.Part(function (time, value){
  ostSynth.triggerAttackRelease(value.note, "16n", time);
}, [{"time" : 0, "note" : ["C3", "C5"]}, 
    {"time" : "0:1:0", "note" : ["C5"]},
    {"time" : "0:2:0", "note" : ["C5"]},
    {"time" : "0:3:0", "note" : ["C5"]}
   ]);
ostLoop.loop = true;

function startOstinato(){
  switch(ostinato){
    case "off":
      ostinato = "on";
      console.log("ostinato " + ostinato);
      //click.style.background = '#e1a820'; 
      //click.style.color = '#5d0024';
      if(Tone.Transport.state == "stopped"){
        startTransport();
      }

      ostLoop.start(getNextbeat()); // start on next quarter note
      //dbClickLoop.start(getNextMeasure());
      break;
    case "on":
      ostinato = "off";
      console.log("ostinato " + ostinato);
      //click.style.background = '#a0144f';
      //click.style.color = '#febc17';
      ostLoop.stop();
      //dbClickLoop.stop();
      break;
    default:
      Tone.Transport.start();
  }
}

var metro = "off"; // metronome state
var ostinato = "off"; // ostinato state

let m = document.getElementById("metronome");
//'metronome' div is in the Start menu
let sync = document.createElement("div");
sync.className = "sync";
let mGUI = new p5(metroGUI, sync);
m.appendChild(sync);
// transport button
let transport = document.createElement("button");
transport.innerHTML = "Transport";
transport.className = "metro-button";
transport.id = "transport";
transport.addEventListener('click', () => {
  startTransport();
});
/* moved to setContext.js
let pB = document.getElementById("powerButton");
pB.addEventListener('click', async () => {
  await Tone.start();
  console.log("audio is ready");
  startTransport();
});
*/

function startTransport(){
  //make this function accessible from other buttons
  //Tone.start(); 
  switch (Tone.Transport.state) {
    case "stopped":
      Tone.Transport.bpm.value = bpm;
      Tone.Transport.start("0.1");
      console.log("transport " + Tone.Transport.state);
      transport.style.background = '#4caf50';
      transport.innerHTML = "Stop";
      pB.classList.add('active');
      break;
    case "started":
      Tone.Transport.stop();
      console.log("transport " + Tone.Transport.state);
      transport.style.background = '#a8a8a8';
      transport.innerHTML = "Start";
      pB.classList.remove('active');
      break;
    default:
      Tone.Transport.start("0.1");
  }
}

// Tempo number box
let tempoLabel = document.createElement('label');
tempoLabel.innerHTML = " tempo: ";

let tempo = document.createElement('input');
tempo.type="number";
tempo.value = bpm;
tempo.className = "tempo-box";
tempo.inputmode="numeric";
tempo.addEventListener('change', () => {
  console.log("new tempo: " + tempo.value);
  bpm = tempo.value;
  Tone.Transport.bpm.value = bpm;
});

// Metronome click
let click = document.createElement("button");
click.innerHTML = "Click";
click.className = "metro-button";
click.id = "click";
click.addEventListener('click', () => {
  startClick();  
});
// noloop
let noloop = document.createElement("button");
noloop.innerHTML = "noloop";
noloop.className = "metro-button";
noloop.id = "noloop";
noloop.addEventListener('click', () => {
  sketches[0].noLoop();  
});

const clickLoop = new Tone.Loop((time) => {
	// triggered every quarter note.
	//console.log(time);
//  clickSampler.triggerAttackRelease("F4", "8n", time);
  drumSampler.triggerAttackRelease("F4", "8n", time);
  //metroClick.triggerAttackRelease(500, "128n", time);
}, "4n");

const dbClickLoop = new Tone.Loop((time) => {
	// triggered every measure.
	//console.log(time);
  drumSampler.triggerAttackRelease("A3", "8n", time);
  //metroClick.triggerAttackRelease(500, "128n", time);
}, "1m");

function startClick(){
    switch(metro){
    case "off":
      metro = "on";
      console.log("click " + metro);
      click.style.background = '#e1a820'; 
      click.style.color = '#5d0024';
      if(Tone.Transport.state == "stopped"){
        startTransport();
      }

      clickLoop.start(getNextbeat()); // start on next quarter note
      //dbClickLoop.start(getNextMeasure());
      break;
    case "on":
      metro = "off";
      console.log("click " + metro);
      click.style.background = '#a0144f';
      click.style.color = '#febc17';
      clickLoop.stop();
      dbClickLoop.stop();
      break;
    default:
      Tone.Transport.start();
  }
}

function getNextbeat(){
  let t = Tone.Transport.position;    
  let times = t.split(':');
  times[2] = 0; // set to downbeat;
  times[1] = Number(times[1]) + 1; // move up to the next downbeat;
  if (times[1] > 3) {
    times[1] = 0;
    times[0] = Number(times[0]) + 1;
  }
  t = times[0] + ":" + times[1] + ":" + times[2];
  return t;
}

function getNextMeasure(){
  let t = Tone.Transport.position;    
  let times = t.split(':');
  times[2] = 0; // set to downbeat;
  times[1] = 0; // set to beginning of measure
  times[0] = Number(times[0]) + 1; // move up to the next measure;
  t = times[0] + ":" + times[1] + ":" + times[2];
  return t;
}

