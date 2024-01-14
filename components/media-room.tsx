"use client";

import { useCallback, useEffect, useState } from "react";
import { 
  GridLayout, 
  LiveKitRoom, MediaDeviceMenu, ParticipantLoop, ParticipantName,  ParticipantTile, RoomAudioRenderer, Toast, TrackToggle, VideoConference, useParticipantInfo, useParticipants, usePersistentUserChoices, useTracks } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel, Member, MemberRole, Server } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Track } from 'livekit-client';
import { ControlBar } from "@/components/media-room/controlBar";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
};

export const MediaRoom = ({
  member,
  chatId,
  video,
  audio
}: MediaRoomProps & { member: Member & {server: Server} }) => {

  const { user } = useUser();

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !true });
  const [token, setToken] = useState("");
  
  const haveAssistance:boolean = member.role === MemberRole.ADMIN || member.role === MemberRole.MODERATOR 

  const microphoneOnChange = useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled],
  );

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;
    
    const metadata = {
      firstName: user?.firstName ? user?.firstName : "N/A",
      lastName: user?.lastName ? user?.lastName : "N/A",
      pid: user?.unsafeMetadata?.pid ? user?.unsafeMetadata?.pid : "N/A",
      role: member.role,
      email: user?.primaryEmailAddress?.emailAddress ? user?.primaryEmailAddress?.emailAddress : "N/A"
    }

    const name = `${user.lastName}, ${user.firstName}`;
    
    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}&metadata=${JSON.stringify(metadata)}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
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
      <ControlBar
        member={member}
        controls={{
          camera: true,
          assistance: haveAssistance,
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