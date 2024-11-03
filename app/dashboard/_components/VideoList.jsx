import React, { useState } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
function VideoList({ videoList }) {
  const [openPlayDialog, setOpenPlayerDialog] = useState(false);
  const [videoId, setVideoId] = useState();
  return (
    <div
      className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-10"
    >
      {videoList?.map((video, index) => (
        <div
          key={video.id}
          className="cursor-pointer 
                hover:scale-105 transition-all"
          onClick={() => {
            setOpenPlayerDialog(Date.now());
            setVideoId(video?.id);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setOpenPlayerDialog(Date.now());
              setVideoId(video?.id);
            }
          }}
          tabIndex={0}
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="button"
        >
          <Thumbnail
            component={RemotionVideo}
            compositionWidth={250}
            compositionHeight={390}
            frameToDisplay={30}
            durationInFrames={120}
            fps={30}
            style={{
              borderRadius: 15,
            }}
            inputProps={{
              ...video,
              setDurationInFrame: (v) => console.log(v),
            }}
          />
        </div>
      ))}
      <PlayerDialog playVideo={openPlayDialog} videoId={videoId} />
    </div>
  );
}

export default VideoList;
