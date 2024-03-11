//Tone.setContext(foo); 
Tone.context.lookAhead = 0.5;
// Tone.context.updateInterval = .5;
console.log("lookAhead: " + Tone.getContext().lookAhead);
console.log("latencyHint: " + Tone.getContext().latencyHint);
//const raw = Tone.context.rawContext;
//raw.createScriptProcessor(2048, 2, 2);
//console.log("base latency: " + raw.baseLatency);


let pB = document.getElementById("powerButton");
pB.addEventListener('click', async () => {
  //Tone.setContext(new Tone.Context({ latencyHint : "playback", lookAhead : 0.5 }));

  //Tone.context.resume();   
  //console.log(resume);
  console.log("Tone state: " + Tone.getContext().state);
  console.log("lookahead doublecheck: " + Tone.getContext().lookAhead);
  console.log("updateInterval doublecheck: " + Tone.getContext().updateInterval);
  console.log("latencyHint doublecheck: " + Tone.getContext().latencyHint);
  console.log ("bpm " + Tone.Transport.bpm.value);
  Tone.context.resume();
  startTransport();
});

