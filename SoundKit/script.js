// odtwarzanie dzwieku
function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if (!audio) return;

    recObjects.map(el => {
        if (el.isRecording)
            el.recordSound(audio)
    });

    key.classList.add('active');
    setTimeout(() => {
        key.classList.remove('active');
    }, audio.duration * 200);
    audio.currentTime = 0;
    audio.play();
}

//nagrywanie sekwencji dźwięków
let Rec = function(recRef) {
    this.recRef = recRef;
    this.recRef.addEventListener("click", () => { this.switchState() });

    this.isRecording = false;
    this.currentTime = 0;
    this.switchState = function() {
        if (this.isRecording) {
            this.isRecording = false;
            this.recRef.classList.remove('active');
            console.log("rec stop")
        } else {
            this.isRecording = true;
            this.recRef.classList.add('active');
            this.currentTime = Date.now();
            console.log(this.currentTime);
        }
    }

    this.recordedSounds = [];

    this.recordSound = function(sound) {
        this.recordedSounds.push({
            sound: sound,
            time: Date.now() - this.currentTime
        });
        this.currentTime = Date.now();
    }

    // odtwarzanie
    this.play = function(i) {
        i = i ? i : 0;
        if (this.recordedSounds <= 0) return;
        setTimeout(() => {
            this.recordedSounds[i].sound.currentTime = 0;
            this.recordedSounds[i].sound.play();
            if (i < this.recordedSounds.length - 1) this.play(++i);
        }, this.recordedSounds[i].time);
    }
    console.log(this);
}

window.addEventListener('keydown', playSound);

let recBtns = Array.from(document.querySelectorAll('.record'));

console.log(recBtns);

let recObjects = recBtns.map((el) => {
    return new Rec(el);
});
document.querySelectorAll(".play").forEach((el, id) => el.addEventListener('click', () => { recObjects[id].play() }));