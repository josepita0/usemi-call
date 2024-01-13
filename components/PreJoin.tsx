import { ParticipantLoop, ParticipantName, useParticipants } from "@livekit/components-react"

export const TestParticipants = () => {

    const participants = useParticipants()

    console.log({participants});
    
    return (
        <></>
    )
}