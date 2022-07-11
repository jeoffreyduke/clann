import { createClient, createMicrophoneAudioTrack } from "agora-rtc-react";

const appId = "c9f4839da8cb4978a058483f58feec3e";
const token = null;

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAudioTrack = createMicrophoneAudioTrack();
export const channelName = "Main";
