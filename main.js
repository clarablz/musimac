// Player Initialization
player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');


// Create a player to play the sequence we'll get from the model.
music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
music_rnn.initialize();
rnnPlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
rnn_steps = 100;
rnn_temperature = 1;



// Musical Functions

function play(music) {
  if (rnnPlayer.isPlaying()) {
    rnnPlayer.stop();

  }
  if(player.isPlaying()){
    player.stop();

  }
  player.start(music);
  player.stop();
}

function stop(){
  if (rnnPlayer.isPlaying()) {
    rnnPlayer.stop();

  }
  if(player.isPlaying()){
    player.stop();

  }  
}

function play_impro(music) {
  if (rnnPlayer.isPlaying()) {
    rnnPlayer.stop();
  }
  if(player.isPlaying()){
    player.stop();

  }
  

  // The model expects a quantized sequence, and ours was unquantized:
  const qns = mm.sequences.quantizeNoteSequence(music, 5);
  music_rnn
    .continueSequence(qns, rnn_steps, rnn_temperature)
    .then((sample) => rnnPlayer.start(sample));
}


//Convert a MIDI file to a "magenta.js-friendly" object
async function getMidiNote(url) {
  const midi = await Midi.fromUrl(url)
  var midiTab = []

  midi.tracks.forEach(track => {
    const notes = track.notes

    notes.forEach(note => {
      midiTab.push(note.midi)
    })

  })

  return midiTab;

}


async function getMidiDuration(url) {

  const midi = await Midi.fromUrl(url)
  var midiTab = []

  midi.tracks.forEach(track => {
    const notes = track.notes

    notes.forEach(note => {
      midiTab.push(note.duration)
    })

  })

  return midiTab;

}


async function loadLocalFile(src) {

  const MIDI = await getMidiNote(src);
  const DURATION = await getMidiDuration(src);

  LOCAL_SEQUENCE = {
    notes: [],
    totalTime: 20,

  }
  //Fill the notes sequence so that magenta.js and MusicRNN can read the MIDI file
  let start = 0.0
  for (let i = 0; i < 130; i++) {
    LOCAL_SEQUENCE.notes.push({ pitch: MIDI[i], startTime: start, endTime: start + DURATION[i] })
    start += DURATION[i];
  }
  console.log(LOCAL_SEQUENCE)
  // to cope with the Error "note outside the range" to continueSequence
  const local_seq = mm.sequences.clone(LOCAL_SEQUENCE);
    local_seq.notes = LOCAL_SEQUENCE.notes.filter(
        note => note.pitch >= this.minPitch && note.pitch <= this.maxPitch);

  play(LOCAL_SEQUENCE));
  continue_button.addEventListener('click', () => play_impro(local_seq));
}



document.querySelector("#FileDrop input").addEventListener("change", e => {
  //get the files
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    getMidiDownload(file);
  }
});



async function getMidiDownload(file) {
  //read the file
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function (e) {
    const midi = new Midi(e.target.result);
    console.log(midi)
    var midiNote = []
    var midiDuration = []

    midi.tracks.forEach(track => {
      const notes = track.notes

      notes.forEach(note => {
        //note.midi, note.time, note.duration, note.name
        midiNote.push(note.midi)
        midiDuration.push(note.duration)
      })


    })

    SEQUENCE = {
      notes: [],
      totalTime: 15,

    }


    //Fill the notes sequence so that magenta.js and MusicRNN can read the MIDI file
    let start = 0.0
    for (let i = 0; i < 130; i++) {
      SEQUENCE.notes.push({ pitch: midiNote[i], startTime: start, endTime: start + midiDuration[i] })
      start += midiDuration[i];
    }
    const seq = mm.sequences.clone(SEQUENCE);
    seq.notes = SEQUENCE.notes.filter(
        note => note.pitch >= this.minPitch && note.pitch <= this.maxPitch);
  
    const play_button_file = document.querySelector('#play_button_file');
    play_button_file.addEventListener('click', () => play(SEQUENCE));

    const continue_button = document.querySelector('#continue_button_file');
    continue_button.addEventListener('click', () => play_impro(seq));

  };

}


// WEBSITE INTERACTIONS


const rightBox=document.querySelector('.right_box');
const title=document.querySelector('.title');
const body=document.querySelector('body');
const startButtons=document.querySelector('.start_buttons');
const libraryButton=document.querySelector('#access_library');
const uploadButton=document.querySelector('#access_drop_file');
const home=document.querySelector('#home_button');
const about=document.querySelector('#about_button');
const playYourOwn=document.querySelector('#play_button_file');
const continueYourOwn=document.querySelector('#continue_button_file')
const uploadDiv=document.querySelector('.upload_file')
const libButtons=document.querySelector('.lib_buttons')
const play_button = document.querySelector('#play_button')
const stop_button = document.querySelector('#stop_button')
const stop_button_2 = document.querySelector('#stop_button_2')
const continue_button = document.querySelector('.continue_button');
const divAbout=document.querySelector('.about');



const divLib = document.createElement('div');

var lib_song_src;


home.addEventListener('click',() =>displayHome())
title.addEventListener('click',() =>displayHome())

libraryButton.addEventListener('click',() =>displayLib());
uploadButton.addEventListener('click',() =>displayUpload());

about.addEventListener('click',() =>displayAbout())

const hide =(element) => {
  element.style.display = "none";
}

const displayBlock=(element)=> {
  element.style.display="block";
}

const displayFlex=(element) => {

  element.style.display="flex";
}

const displayGrid=(element) => {

  element.style.display="grid";
}

const cleanDiv=(div) => {

  div.innerHTML='';
}

const displayHome=() =>{
  hide(divLib);
  hide(uploadDiv);
  hide(libButtons)
  hide(divAbout);

  displayFlex(startButtons);
  if (rnnPlayer.isPlaying()) {
    rnnPlayer.stop();
  }
  if(player.isPlaying()){
    player.stop();

  }
}

const displayAbout=() =>{
  hide(divLib);
  hide(uploadDiv);
  hide(libButtons);
  hide(startButtons);

  if (rnnPlayer.isPlaying()) {
    rnnPlayer.stop();
  }
  if(player.isPlaying()){
    player.stop();
  }


 displayFlex(divAbout)
 divAbout.scrollTo(0,0)
}



const displayUpload=() =>{
  hide(startButtons);
  cleanDiv(divLib)
  displayFlex(uploadDiv)
  



  displayBlock(playYourOwn);
  displayBlock(continueYourOwn);



}


const choseSong=(src) =>{
  loadLocalFile(src);
}



const displayLib=() =>{
  hide(startButtons);
  cleanDiv(divLib)
  displayFlex(divLib)
  divLib.scrollTo(0,0)
  displayGrid(libButtons);


  const title_div=document.createElement('h2');
  title_div.classList.add("secondary_title")


  //SONG 1
  const song_1=document.createElement('div');
  song_1.classList.add("song_list");

  const title_song_1=document.createElement('h3');
  title_song_1.classList.add("song_name")

  const artist_1=document.createElement('h3');
  artist_1.classList.add("artist_name");

  title_div.innerText = "Our library";
  title_song_1.innerText = "Für Elise "
  artist_1.innerText="Beethoven"

  const img1=document.createElement('img');
  img1.src="img/cercle_1.png"
  img1.classList.add("img_circles")
  
  song_1.appendChild(title_song_1);
  song_1.appendChild(artist_1);
  song_1.appendChild(img1);

  title_song_1.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Fur_Elise.mid"));
  img1.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Fur_Elise.mid"));
  

  //SONG 2

  const song_2=document.createElement('div');
  song_2.classList.add("song_list");

  const title_song_2=document.createElement('h3');
  title_song_2.classList.add("song_name")

  const artist_2=document.createElement('h3');
  artist_2.classList.add("artist_name");

  title_song_2.innerText = "Boulevard of Broken Dreams "
  artist_2.innerText="Green Day"

  const img2=document.createElement('img');
  img2.src="img/cercle_2.png"
  img2.classList.add("img_circles")

  song_2.appendChild(title_song_2);
  song_2.appendChild(artist_2);
  song_2.appendChild(img2)

  title_song_2.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Boulevard_of_Broken_Dreams.mid"));
  img2.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Boulevard_of_Broken_Dreams.mid"));
  
  //SONG 3

  const song_3=document.createElement('div');
  song_3.classList.add("song_list");

  const title_song_3=document.createElement('h3');
  title_song_3.classList.add("song_name")

  const artist_3=document.createElement('h3');
  artist_3.classList.add("artist_name");

  title_song_3.innerText = "Merry Go Round of Life (Howl's Moving Castle) "
  artist_3.innerText="Joe Hisaishi"

  const img3=document.createElement('img');
  img3.src="img/cercle_3.png"
  img3.classList.add("img_circles")

  song_3.appendChild(title_song_3);
  song_3.appendChild(artist_3);
  song_3.appendChild(img3)

  title_song_3.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Merry_Go_Round_of_Life.mid"));
  img3.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Merry_Go_Round_of_Life.mid"));

  //SONG 4
  const song_4=document.createElement('div');
  song_4.classList.add("song_list");

  const title_song_4=document.createElement('h3');
  title_song_4.classList.add("song_name")

  const artist_4=document.createElement('h3');
  artist_4.classList.add("artist_name");

  title_song_4.innerText = "Yesterday"
  artist_4.innerText="The Beatles"

  const img4=document.createElement('img');
  img4.src="img/cercle_4.png"
  img4.classList.add("img_circles")

  song_4.appendChild(title_song_4);
  song_4.appendChild(artist_4);
  song_4.appendChild(img4)

  title_song_4.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Yesterday.mid"));
  img4.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Yesterday.mid"));


  //SONG 5
  const song_5=document.createElement('div');
  song_5.classList.add("song_list");

  const title_song_5=document.createElement('h3');
  title_song_5.classList.add("song_name")

  const artist_5=document.createElement('h3');
  artist_5.classList.add("artist_name");

  title_song_5.innerText = "Nothing Else Matters"
  artist_5.innerText="Metallica"

  const img5=document.createElement('img');
  img5.src="img/cercle_5.png"
  img5.classList.add("img_circles")

  song_5.appendChild(title_song_5);
  song_5.appendChild(artist_5);
  song_5.appendChild(img5);

  title_song_5.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Nothing_Else_Matters.mid"));
  img5.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Nothing_Else_Matters.mid"));

  //SONG6
  const song_6=document.createElement('div');
  song_6.classList.add("song_list");

  const title_song_6=document.createElement('h3');
  title_song_6.classList.add("song_name")

  const artist_6=document.createElement('h3');
  artist_6.classList.add("artist_name");

  title_song_6.innerText = "Fantaisie Impromptu"
  artist_6.innerText="Chopin"

  const img6=document.createElement('img');
  img6.src="img/cercle_6.png"
  img6.classList.add("img_circles")

  song_6.appendChild(title_song_6);
  song_6.appendChild(artist_6);
  song_6.appendChild(img6)

  title_song_6.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Fantaisie_Impromptu.mid"));
  img6.addEventListener('click', () =>choseSong("https://clarablz.github.io/musimac-box/MIDI/Fantaisie_Impromptu.mid"));

  //LINK TO DIVLIB
  divLib.appendChild(title_div);
  divLib.appendChild(song_1);
  divLib.appendChild(song_2);
  divLib.appendChild(song_3);
  divLib.appendChild(song_4);
  divLib.appendChild(song_5);
  divLib.appendChild(song_6);
  divLib.classList.add("lib_box");
  body.appendChild(divLib)
}



stop_button.addEventListener('click',() =>stop())
stop_button_2.addEventListener('click',() =>stop())
