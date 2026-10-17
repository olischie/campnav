// Pont entre campnav (index.html) et l'iPhone. Ce fichier n'existe que dans
// l'appli : la compilation le regroupe en www/native.js et l'ajoute en tête de
// la page. index.html y trouve window.CCNative ; dans un navigateur, il est absent.
import { Capacitor, registerPlugin } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { KeepAwake } from '@capacitor-community/keep-awake';

const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');

window.CCNative = {
  isNative: Capacitor.isNativePlatform(),
  platform: Capacitor.getPlatform(),
  BG: BackgroundGeolocation,   // GPS, y compris écran verrouillé
  TTS: TextToSpeech,           // voix de l'iPhone, baisse la musique pendant l'annonce
  KeepAwake: KeepAwake         // écran allumé pendant le guidage
};
