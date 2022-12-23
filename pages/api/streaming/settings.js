import { createClient, createMicrophoneAudioTrack } from "agora-rtc-react";

const appId = "f10d4c74ac1042cab20c1457a5cae852";
const token = null;

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAudioTrack = createMicrophoneAudioTrack();
export const channelName = "Main";
