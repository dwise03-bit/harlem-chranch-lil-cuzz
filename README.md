# Harlem Cranch landing page

A self-contained cinematic landing page for CranchNYC and the LIL CUZZ AI Assistant.

## Preview

Serve this folder with any static web server. For example:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Media notes

- Supplied source: 720 × 720 H.264, approximately 24 fps, 35 seconds.
- Web derivative: 960 × 960 H.264, muted for background playback.
- The page is styled for 4K displays but does not claim the source video is native 4K.
- Reduced-motion and data-saver visitors receive the real poster image without autoplay.
- The soundtrack is extracted from the supplied master and plays only after the visitor turns sound on.
- Four accessible scene selectors jump the visual to real timestamps in the source film.
- Additional motion-mark source (`IMG_1651.MP4`): 1920 × 1080 H.264, 24 fps, approximately 8 seconds.
- Motion-mark web derivative: 1280 × 720 H.264 with a real-frame poster fallback and a dedicated pause/play control.
- LIL CUZZ appears as an identity-preserving digital-twin illustration derived from clear public Chranch NYC Facebook photography, including his wheelchair presence.
- The assistant includes guided prompts, typed keyword responses, and opt-in browser speech synthesis. It does not clone or imitate a specific person's voice.

## Free local voice

`voice-config.js` uses the Apache-2.0 Kokoro 82M ONNX text-to-speech model through Kokoro.js. The page begins warming the model after load; LIL CUZZ waits for the natural model instead of using a robotic system-voice fallback. The selected `am_michael` voice runs at a measured 0.86 speed. The quantized model runs in the visitor's browser with WebGPU when available and WASM otherwise, so no paid API key is required and chat text is not sent to a voice provider. The model downloads on first use and is then cached by the browser.
