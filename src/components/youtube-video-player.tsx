import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, View, Alert } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function YoutubeVideoPlayer({ videoUrl, height, autoPlay }: { videoUrl: string, height: number, autoPlay: boolean }): JSX.Element {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (autoPlay && !playing) {
      setPlaying(true);
    }
  }, [autoPlay])

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);
 

  let videoId = videoUrl.split('/').at(-1) ?? videoUrl;
  
  
  return (
    <View>
      <YoutubePlayer
        height={height ?? 300}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
        webViewProps={{ allowsInlineMediaPlayback: false }}
      />
      {/* <Button title={playing ? "pause" : "play"} onPress={togglePlaying} /> */}
    </View>
  );
}