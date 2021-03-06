type RTCIceCredentialType = 'oauth' | 'password';

interface RTCOAuthCredential {
    accessToken: string;
    macKey: string;
}

interface RTCIceServer {
    credential?: string | RTCOAuthCredential;
    credentialType?: RTCIceCredentialType;
    urls: string | string[];
    username?: string;
}

interface MyRTCConfiguration {
    iceServers?: RTCIceServer[];
}

interface RTCPeerConnection {
    restartIce: () => void
    setLocalDescription: () => Promise<void>
    RTCSessionDescriptionInit: undefined
}
