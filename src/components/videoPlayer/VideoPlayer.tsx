import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";

const VideoPlayer: React.FC<{ src: string; autoplay?: boolean; mimeType: string }> = ({
  src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  autoplay = false,
  mimeType,
}) => {
  return (
    <MediaPlayer
      src={{
        src,
        type:
          mimeType || src.endsWith(".webm")
            ? "video/webm"
            : src.endsWith(".ogg")
              ? "video/ogg"
              : "video/mp4",
      }}
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      crossOrigin
      autoPlay={autoplay}
      playsInline
      poster=""
    >
      <MediaProvider>
        <Poster className="vds-poster" />
      </MediaProvider>
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
