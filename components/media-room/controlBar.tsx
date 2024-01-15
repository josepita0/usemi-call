import { DisconnectButton, LeaveIcon, MediaDeviceMenu, TrackToggle, useLocalParticipantPermissions, useMaybeLayoutContext, usePersistentUserChoices } from "@livekit/components-react";
import { Track } from "livekit-client";
import React, { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Member, Server } from "@prisma/client";
import { AssistanceButton } from "./asistanceButton";
import { DrawingButton } from "./drawingButton";

interface IControlBarProps {
  variation?: 'minimal' | 'verbose' | 'textOnly';
  controls?: {
    microphone?: boolean;
    camera?: boolean;
    chat?: boolean;
    drawing: boolean;
    assistance: boolean;
    screenShare?: boolean;
    leave?: boolean;
  }
  saveUserChoices?: boolean,
  member: Member & {server: Server},
  activeDrawing: Dispatch<SetStateAction<boolean>>

}

export function ControlBar({
    variation,
    controls,
    member,
    activeDrawing,
    saveUserChoices = true,
  }: IControlBarProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const layoutContext = useMaybeLayoutContext();
    useEffect(() => {
      if (layoutContext?.widget.state?.showChat !== undefined) {
        setIsChatOpen(layoutContext?.widget.state?.showChat);
      }
    }, [layoutContext?.widget.state?.showChat]);
  
    const defaultVariation = 'verbose';
    variation ??= defaultVariation;
  
    const visibleControls = { leave: true, ...controls };
  
    const localPermissions = useLocalParticipantPermissions();
  
    if (!localPermissions) {
      visibleControls.camera = false;
      visibleControls.chat = false;
      visibleControls.microphone = false;
      visibleControls.screenShare = false;
    } else {
      visibleControls.camera ??= localPermissions.canPublish;
      visibleControls.microphone ??= localPermissions.canPublish;
      visibleControls.screenShare ??= localPermissions.canPublish;
      visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
    }
  
    const showIcon = useMemo(
      () => variation === 'minimal' || variation === 'verbose',
      [variation],
    );
    const showText = useMemo(
      () => variation === 'textOnly' || variation === 'verbose',
      [variation],
    );
  
    const browserSupportsScreenSharing = supportsScreenSharing();
  
    const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  
    const onScreenShareChange = useCallback(
      (enabled: boolean) => {
        activeDrawing((prev) => {
          return !prev
        })
        setIsScreenShareEnabled(enabled);
      },
      [setIsScreenShareEnabled],
    );
  
  
    const {
      saveAudioInputEnabled,
      saveVideoInputEnabled,
      saveAudioInputDeviceId,
      saveVideoInputDeviceId,
    } = usePersistentUserChoices({ preventSave: !saveUserChoices });
  
    const microphoneOnChange = React.useCallback(
      (enabled: boolean, isUserInitiated: boolean) =>
        isUserInitiated ? saveAudioInputEnabled(enabled) : null,
      [saveAudioInputEnabled],
    );
  
    const cameraOnChange = React.useCallback(
      (enabled: boolean, isUserInitiated: boolean) =>
        isUserInitiated ? saveVideoInputEnabled(enabled) : null,
      [saveVideoInputEnabled],
    );
  
    return (
      <div className=" " >

        {/* <ScrollArea className='h-[10rem]'> */}

            <div className="flex sm:flex-row flex-col gap-2 justify-center items-center p-2">

              <div className="flex flex-row gap-2">

                {visibleControls.microphone && (
                <div className="lk-button-group">
                    <TrackToggle
                    source={Track.Source.Microphone}
                    showIcon={showIcon}
                    onChange={microphoneOnChange}
                    >
                    <span className="hidden sm:block ">
                        {showText && 'Micrófono'}
                    </span>
                    </TrackToggle>
                    <div className="lk-button-group-menu">
                    <MediaDeviceMenu
                        kind="audioinput"
                        onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? '')}
                    />
                    </div>
                </div>
                )}
                {visibleControls.camera && (
                <div className="lk-button-group">
                    <TrackToggle source={Track.Source.Camera} showIcon={showIcon} onChange={cameraOnChange}>
                    
                    <span className="hidden sm:block ">
                        {showText && 'Cámara'}
                    </span>
                    </TrackToggle>
                    <div className="lk-button-group-menu">
                    <MediaDeviceMenu
                        kind="videoinput"
                        onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? '')}
                    />
                    </div>
                </div>
                )}
                {visibleControls.screenShare && browserSupportsScreenSharing && (
                <TrackToggle
                    source={Track.Source.ScreenShare}
                    captureOptions={{ audio: true, selfBrowserSurface: 'include' }}
                    showIcon={showIcon}
                    onChange={onScreenShareChange}
                >
                    <span className="hidden sm:block ">
                    {showText && (isScreenShareEnabled ? 'Detener pantalla compartida' : 'Compartir pantalla')}
                    </span>
                </TrackToggle>
                )}

              </div>

              <div className="flex flex-row gap-2">
                
                {visibleControls.assistance && (

                    <AssistanceButton
                      className={member.server.name}
                    />
                )}

                {/* {visibleControls.chat && (
                <ChatToggle>
                    {showIcon && <ChatIcon />}
                    {showText && 'Chat'}
                </ChatToggle>
                )} */}

                {visibleControls.drawing && browserSupportsScreenSharing && (

                    <>

                      <TrackToggle
                      source={Track.Source.ScreenShare}
                      captureOptions={{ audio: true, selfBrowserSurface: 'include' }}
                      showIcon={false}
                      onChange={onScreenShareChange}
                      >
                      <DrawingButton 
                        // onClick={onScreenShareChange}
                        activeDrawing={activeDrawing as Dispatch<SetStateAction<boolean>>}
                      />
           
                    </TrackToggle>
                    </>
                )}
                {visibleControls.leave && (


                      <DisconnectButton>
                          {showIcon && <LeaveIcon />}
                          {/* {showText && 'Abandonar'} */}
                      </DisconnectButton>
                    
                )}
              </div>


            </div>

      {/* //       <ScrollBar orientation="horizontal" />
      //   </ScrollArea> */}

      </div>
    );
  }

function supportsScreenSharing(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      !!navigator.mediaDevices.getDisplayMedia
    );
  }


