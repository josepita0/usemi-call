"use client";

import { useCallback, useEffect, useState } from "react";
import { 
  GridLayout, 
  LiveKitRoom, MediaDeviceMenu, ParticipantLoop, ParticipantName,  ParticipantTile, RoomAudioRenderer, Toast, TrackToggle, VideoConference, useParticipantInfo, useParticipants, usePersistentUserChoices, useTracks } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { TestParticipants } from "./PreJoin";
import { Track } from 'livekit-client';
import { ControlBar } from "@/components/media-room/controlBar";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
};

export const MediaRoom = ({
  chatId,
  video,
  audio
}: MediaRoomProps) => {
  const { user } = useUser();

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !true });
  const [token, setToken] = useState("");
  

  const microphoneOnChange = useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled],
  );

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;
    
    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })()
  }, [user?.firstName, user?.lastName, chatId]);
  

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2
          className="h-7 w-7 text-zinc-500 animate-spin my-4"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Cargando...
        </p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      <TestParticipants/>
      <ControlBar
        controls={{
          camera: true,
          microphone: true,
          screenShare: true,
          leave: true
        }}
      />    
    </LiveKitRoom>
  )
}


function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(90vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}