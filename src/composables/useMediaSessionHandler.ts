import { onMounted, watch } from "vue";

export function useMediaSessionHandler() {
  onMounted(() => {
    function actionHandler(detail: MediaSessionActionDetails) {
      console.log(`media action:${detail.action} triggerd.`);
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Unforgettable",
      artist: "Nat King Cole",
      album: "The Ultimate Collection (Remastered)",
      artwork: [
        {
          src: "https://dummyimage.com/96x96",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/128x128",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/192x192",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/256x256",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/384x384",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/512x512",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });
    if (navigator.mediaSession) {
      console.log(`Support media session.Adding handler`);
      navigator.mediaSession.setActionHandler("play", actionHandler);
      navigator.mediaSession.setActionHandler("pause", actionHandler);
      navigator.mediaSession.setActionHandler("seekbackward", actionHandler);
      navigator.mediaSession.setActionHandler("seekforward", actionHandler);
      navigator.mediaSession.setActionHandler("previoustrack", actionHandler);
      navigator.mediaSession.setActionHandler("nexttrack", actionHandler);
    }
  });
  onMounted(() => {
    navigator.mediaSession.setActionHandler("play", null);
    navigator.mediaSession.setActionHandler("pause", null);
    navigator.mediaSession.setActionHandler("seekbackward", null);
    navigator.mediaSession.setActionHandler("seekforward", null);
    navigator.mediaSession.setActionHandler("previoustrack", null);
    navigator.mediaSession.setActionHandler("nexttrack", null);
  });
}

export function useMediaSessionPlaybackState(playing: boolean) {
  watch(
    () => playing,
    (p) => {
      let playbackState: MediaSessionPlaybackState = "none";
      switch (p) {
        case true:
          playbackState = "playing";

          break;

        case false:
          playbackState = "paused";
        default:
          break;
      }
      navigator.mediaSession.playbackState = playbackState;
    }
  );
}
