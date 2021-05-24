import Sound from "react-native-sound";

export const playSoundFile = (soundFileName) => {
  console.log(`play sound file: ${soundFileName}`);
  Sound.setCategory("Playback");

  const mySound = new Sound(`${soundFileName}.mp3`, null, (error) => {
    if (error) {
      console.log("Error loading sound: ", error);
      return;
    }
    mySound.play((success) => {
      if (success) {
        console.log("play sound successfully");
      } else {
        console.log("playback failed due to audio decoding errors");
      }
    });
  });
  mySound.setVolume(1);
  mySound.release();
};