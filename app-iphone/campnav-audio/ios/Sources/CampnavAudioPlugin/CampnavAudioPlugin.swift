import Foundation
import AVFoundation
import Capacitor

/// Voix de guidage de campnav.
///
/// Deux sorties possibles :
/// - "auto" : la sortie choisie par iOS — l'autoradio en Bluetooth ou par câble
///   s'il est branché, sinon le haut-parleur. La musique est baissée pendant
///   l'annonce, puis remonte.
/// - "speaker" : toujours le haut-parleur du téléphone, même si l'autoradio est
///   connecté. iOS ne permet de forcer le haut-parleur qu'en mode « lecture et
///   enregistrement » : il demande donc une fois l'accès au micro, que campnav
///   n'utilise jamais.
@objc(CampnavAudioPlugin)
public class CampnavAudioPlugin: CAPPlugin, CAPBridgedPlugin, AVSpeechSynthesizerDelegate {
    public let identifier = "CampnavAudioPlugin"
    public let jsName = "CampnavAudio"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "speak", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getVoices", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setOutput", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getRoute", returnType: CAPPluginReturnPromise)
    ]

    private let synth = AVSpeechSynthesizer()
    private var pending: [ObjectIdentifier: CAPPluginCall] = [:]
    private var output = "auto"
    private var releaseWork: DispatchWorkItem?

    public override func load() {
        synth.delegate = self
    }

    // MARK: - Sortie du son

    @objc func setOutput(_ call: CAPPluginCall) {
        let wanted = call.getString("output") ?? "auto"
        DispatchQueue.main.async {
            self.output = (wanted == "speaker") ? "speaker" : "auto"
            // Rien ne joue : on ne garde pas la session active (la musique reste normale).
            if !self.synth.isSpeaking { self.releaseSession(after: 0) }
            call.resolve(self.routeInfo())
        }
    }

    @objc func getRoute(_ call: CAPPluginCall) {
        DispatchQueue.main.async { call.resolve(self.routeInfo()) }
    }

    private func routeInfo() -> [String: Any] {
        let outs = AVAudioSession.sharedInstance().currentRoute.outputs
        let first = outs.first
        return [
            "output": output,
            "portType": first?.portType.rawValue ?? "",
            "portName": first?.portName ?? "",
            "bluetooth": outs.contains { [.bluetoothA2DP, .bluetoothHFP, .bluetoothLE, .carAudio].contains($0.portType) }
        ]
    }

    private func activateSession() {
        let s = AVAudioSession.sharedInstance()
        do {
            if output == "speaker" {
                try s.setCategory(.playAndRecord, mode: .default, options: [.duckOthers, .defaultToSpeaker])
                try s.setActive(true)
                try s.overrideOutputAudioPort(.speaker)
            } else {
                try s.setCategory(.playback, mode: .voicePrompt,
                                  options: [.duckOthers, .interruptSpokenAudioAndMixWithOthers])
                try s.setActive(true)
            }
        } catch {
            // En cas d'échec, iOS parle quand même avec la sortie par défaut.
            try? s.setCategory(.playback, options: [.duckOthers])
            try? s.setActive(true)
        }
    }

    /// Rend la main aux autres applis (la musique remonte) un peu après la
    /// dernière annonce, pour ne pas faire « pomper » le volume entre deux phrases.
    private func releaseSession(after delay: Double) {
        releaseWork?.cancel()
        let work = DispatchWorkItem { [weak self] in
            guard let self = self, !self.synth.isSpeaking else { return }
            try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        }
        releaseWork = work
        DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: work)
    }

    // MARK: - Voix

    @objc func speak(_ call: CAPPluginCall) {
        guard let text = call.getString("text"), !text.isEmpty else {
            call.reject("Texte manquant")
            return
        }
        let lang = call.getString("lang") ?? "fr-FR"
        let rate = Float(call.getDouble("rate") ?? 1.0)
        let voiceId = call.getString("voice")
        DispatchQueue.main.async {
            self.releaseWork?.cancel()
            self.activateSession()
            let u = AVSpeechUtterance(string: text)
            if let id = voiceId, !id.isEmpty, let v = AVSpeechSynthesisVoice(identifier: id) {
                u.voice = v
            } else {
                u.voice = AVSpeechSynthesisVoice(language: lang)
            }
            let r = AVSpeechUtteranceDefaultSpeechRate * rate
            u.rate = min(max(r, AVSpeechUtteranceMinimumSpeechRate), AVSpeechUtteranceMaximumSpeechRate)
            self.pending[ObjectIdentifier(u)] = call
            self.synth.speak(u)
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.synth.stopSpeaking(at: .immediate)
            call.resolve()
        }
    }

    @objc func getVoices(_ call: CAPPluginCall) {
        let voices = AVSpeechSynthesisVoice.speechVoices().map { v -> [String: Any] in
            var quality = "default"
            if v.quality == .enhanced { quality = "enhanced" }
            if #available(iOS 16.0, *), v.quality == .premium { quality = "premium" }
            return ["id": v.identifier, "name": v.name, "lang": v.language, "quality": quality]
        }
        call.resolve(["voices": voices])
    }

    private func finish(_ u: AVSpeechUtterance, _ result: [String: Any]) {
        if let call = pending.removeValue(forKey: ObjectIdentifier(u)) {
            call.resolve(result)
        }
        if !synth.isSpeaking && pending.isEmpty { releaseSession(after: 0.8) }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { self.finish(utterance, ["done": true]) }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { self.finish(utterance, ["done": false]) }
    }
}
