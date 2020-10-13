export default Remon;

declare class Remon {
  /**
   * Create Remon object with config object and listener object.
   *
   * ```javascript
   * var v = new Remon({ config: rtcConfig, listener: rtcListener });
   * ```
   */
  constructor(option?: RemonOption);

  /**
   * Capture the screen and use it as the source of local media.
   */
  captureScreen(): Promise<void>;

  /**
   * Close all Remon's resources.
   */
  close(): Promise<void>;

  /**
   * Create P2P channel, if there is no P2P channel with the id.
   *
   * Join the P2P channel, if there is P2P channel with the id.
   *
   * ```javascript
   * remon.connectCall("roomname1");
   * ```
   */
  connectCall(): Promise<void>;

  /**
   * Create P2P channel, if there is no P2P channel with the id.
   *
   * Join the P2P channel, if there is P2P channel with the id.
   *
   * ```javascript
   * remon.connectChannel("roomname1");
   * ```
   */
  connectChannel(): Promise<void>;

  /**
   * Create a broadcast room with a room id.
   */
  createCast(roomId?: string): Promise<void>;

  /**
   * Create a conference call room with a room id.
   */
  createRoom(roomId: string): Promise<void>;

  /**
   * Returns a list of currently waiting calls.
   */
  fetchCalls(roomId: string): Promise<Call[]>;

  /**
   * Returns a list of currently being broadcast.
   */
  fetchCasts(): Promise<Cast[]>;

  /**
   * Get channel id.
   */
  getChannelId(): string;

  /**
   * Retrieve current stream health information.
   */
  getHealth(): Health;

  /**
   * Retrieve current remon state information.
   */
  getState(): RemonState;

  /**
   * Retrieve current sdk version.
   *
   * ```javascript
   * const remon = new Remon({ config: rtcConfig });
   * console.log(remon.getVersion()); // "[major].[minor].[patch]"
   * ```
   */
  getVersion(): string;

  /**
   * Join a room by room id.
   */
  joinCast(roomId?: string): Promise<void>;

  /**
   * Mute local audio and mic stream.
   */
  muteLocalAudio(isMuted: boolean): void;

  /**
   * Mute remote audio stream.
   */
  muteRemoteAudio(isMuted: boolean): void;

  /**
   * Mute local video.
   */
  pauseLocalVideo(isMuted?: boolean): void;

  /**
   * Mute remote video.
   */
  pauseRemoteVideo(isMuted?: boolean): void;

  /**
   * Reduce current video quality as 1 step.
   */
  reduceVideoQuality(): void;

  /**
   * It's only function for P2P communication. send message to peer.
   */
  sendMessage(message?: string): void;

  /**
   * Change audio input.
   */
  setAudioDevice(microphoneId: string): void;

  /**
   * Change Video input.
   */
  setVideoDevice(cameraId: string): void;

  /**
   * Set video quality between HIGH, MEDIUM, LOW.
   */
  setVideoQuality(quality: VideoQuality): void;

  /**
   * Stop the captureScreen.
   */
  stopCaptureScreen(): void;

  /**
   * Switch camera with deviceId.
   */
  switchCamera(): void;
}

export type Call = any;
export type Cast = any;
export type RemonState = any;
export type Health = any;

export interface RemonOption {
  config?: RemonConfig;
  listener?: RemonListener;
}

export interface RemonConfig {
  credential?: Credential;
  view?: View;
  media?: Media;
  rtc?: RTC;
  sdk?: SDK;
}

  /**
   * Must be filled in to use the Remon SDK. You need to register the
   * RemoteMonster with the serviceId and key you receive. If this item is
   * missing, it can be used for testing or development purposes
   */
  export interface Credential {
    key: string;
    serviceId: string;

    /**
     * internals
     *
     * "wss://signal.remotemonster.com/ws"
     */
    wsurl?: string;

    /**
     * internals
     *
     * "https://signal.remotemonster.com/rest"
     */
    resturl?: string;
  }

  /**
   * Enter the id value of the video tag to represent the local and remote
   * streams on the web page in 'local' and 'remote', respectively. If you
   * don't get local stream through camera but get screen capture screen or
   * stream through canvas, you can input the stream's id to localStream
   * instead of 'local'.
   */
  export interface View {
    local?: string;
    remote?: string;
    localStream?: MediaStream;
  }

  /**
   * You can set several options for getting a local stream. The video tag is
   * for getting a local camera and the audio tag is for getting a local
   * microphone. The screen tag is an option you can use to capture the
   * screen. Details of each option are available at
   * https://developer.mozilla.org/en/docs/Web/API/MediaStreamConstraints and
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/ See
   * getDisplayMedia.
   */
  export interface Media {
    view?: any;
    audio?: boolean;
    video?: boolean | Video;
    screen?: boolean;
  }

  export interface Video {
    width?: string;
    height?: string;
    codec?: "VP8";
    maxBandwidth?: number;
    frameRate?: number;
  }

  /**
   * You can set various rtc related options. audioType may determine whether
   * or not the sound of local audio is heard well. If simulcast is set to
   * true, the receiver sends out various quality images so that the receiver
   * can select the desired quality images. If you want to use a TURN server
   * only communication, you can use the selectiveCandidate config.
   */
  export interface RTC {
    audioType?: AudioType;
    simulcast?: boolean;

    // internals
    localStream?: MediaStream;
    localVideo?: MediaStream;
    selectiveCandidate?: undefined;
    iceServers?: any[];
    sdpSemantics?: "unified-plan";
    cpuOveruseDetection?: boolean;
    sharding?: boolean;
  }

  export type AudioType = "voice" | "music";

  export interface SDK {
    logLevel?: LogLevel;
  }

  export type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG";

export interface RemonListener {
  /**
   * It is called when connection between client and signal server is
   * connected and authentication is completed. Return value is token by
   * authentication process.
   */
  onInit: OnInitListener;

  /**
   * It's called when you execute connectCall method with channelId and
   * there's no such channel id. Remon will create a room with the channel Id
   * and onCreateChannel method is called.
   */
  onCreateChannel: OnCreateChannelListener;

  /**
   * It's called when you execute connectCall method with channel ID and
   * there's such channel ID. Remon will connect peers. After this event,
   * signalling with peers will be executed.
   */
  onConnectChannel: OnConnectChannelListener;

  /**
   * Called when signaling is complete and the stream is well connected. From
   * this time, the video can be transmitted or viewed.
   */
  onComplete: OnCompleteListener;

  /**
   * Called when a local stream has been obtained. You can get a local stream
   * from this event.
   */
  onDisplayUserMedia: OnDisplayUserMediaListener;

  /**
   * Similar to onDisplayUserMedia, but occurs when signaling is complete.
   */
  onAddLocalStream: OnAddLocalStreamListener;

  /**
   * Occurs when signaling is complete and a remote stream can be received.
   * You can take a remote stream as an argument.
   */
  onAddRemoteStream: OnAddRemoteStreamListener;

  /**
   * State is classified into INIT, CONNECT, WAIT, COMPLETE, CLOSE, etc.
   * according to the connection state. This event is called when the state is
   * changed.
   */
  onStateChange: OnStateChangeListener;

  /**
   * Occurs when a connection is terminated by the other side or the network,
   * not by me.
   */
  onDisconnectChannel: OnDisconnectChannelListener;

  /**
   * If the other party sent an arbitrary message through the
   * Remon.sendMessage method, You can receive it via this event.
   */
  onMessage: OnMessageListener;

  /**
   * When communicating or broadcasting, you can check the current quality of
   * the stream every 3 seconds. There are several stat entries, but the
   * easiest way to know the current quality is 'ratings' property.
   */
  onStat: OnStatListener;

  /**
   * Event that can check the result when calling search method such as
   * fetchCall or fetchCast.
   */
  onSearch: OnSearchListener;

  /**
   * Occurs when the close command that I explicitly called actually
   * completes.
   */
  onClose: OnCloseListener;

  /**
   * Occurs when using conference mode. When someone enters or leaves the
   * room, join and leave events occur and you can connect to the user through
   * the join method through the channel information.
   */
  onRoomEvent: OnRoomEventListener;

  /**
   * Occurs when the viewer of the broadcast calls the joinCast command, when
   * the command actually completes and can receive the stream.
   */
  onJoin: OnJoinListener;

  /**
   * Several events about the recording process when a client wants to record
   * or record. Among the parameters to receive, event values include stop,
   * upload, error, and uploaded.
   */
  onRecordEvent: OnRecordEventListener;

  /**
   * All errors can be received in this event.
   */
  onError: OnErrorListener;
}

export type OnInitListener = (token: string) => void;
export type OnCreateChannelListener = (channelId: string) => void;
export type OnConnectChannelListener = (channelId: string) => void;
export type OnCompleteListener = () => void;
export type OnDisplayUserMediaListener = (stream: MediaStream) => void;
export type OnAddLocalStreamListener = (stream: MediaStream) => void;
export type OnAddRemoteStreamListener = (stream: MediaStream) => void;
export type OnStateChangeListener = (state: State) => void;
export type OnDisconnectChannelListener = () => void;
export type OnMessageListener = (message: string) => void;
export type OnStatListener = (stat: any) => void;
export type OnSearchListener = (message: Message) => void;
export type OnCloseListener = () => void;
export type OnRoomEventListener = (message: Message) => void;
export type OnJoinListener = () => void;
export type OnRecordEventListener = (event: OnRecordEvent) => void;
export type OnErrorListener = {
  /**
   * Service ID, Secret Key가 없음
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   */
  onError(
    code: "4101",
    message: "undefinedServiceId Or undefinedServiceKey"
  ): void;

  /**
   * 카메라 또는 마이크를 이용할 수 없음
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   *
   * @param error "UserMediaDeviceFailedError" + string
   */
  onError(code: "4182", error: string): void;

  /**
   * 리모트몬스터와 인증이 올바르게 이루어지지 않음 (클라이언트의 이유)
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   */
  onError(code: "4201", message: "initFailedError", error: Error): void;

  /**
   * 리모트몬스터와 인증이 올바르게 이루어지지 않음 (서버의 이유)
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   */
  onError(code: "4204", error: any): void;

  /**
   * 로컬피어 정보 획득 실패
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   *
   * @param message "Create offer failed :" + string
   */
  onError(code: "4231", message: string): void;

  /**
   * 로컬피어 정보 설정 실패
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   */
  onError(code: "4232", message: "set local offer is failed"): void;

  /**
   * ! UNDOCUMENTED ERROR CODE!
   */
  onError(code: "4233", message: "set remote sdp is failed"): void;

  /**
   * 네트워크 환경이 매우 좋지 않아 리모트몬스터 서버로 접속이 이루어지지 않음
   * 또는 끊어짐
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   */
  onError(code: "4241", message: "Disconnected from Signal Server"): void;

  /**
   * 미디어,접속 협상 실패
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   */
  onError(code: "4245", message: "ICEFailed"): void;

  /**
   * 피어 접속 연결 실패
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   */
  onError(code: '4246', message: 'add ice candidate failed'): void;

  /**
   * 네트워크 환경이 불안정함
   *
   * https://docs.remotemonster.com/common/error#errorcode_must
   */
  onError(code: "4343", message: "ICEClosed" | "ICEDisconnected After 3 seconds"): void;

  /**
   * 네트워크 환경의 변화
   *
   * https://docs.remotemonster.com/common/error#undefined
   */
  onError(code: "4344", message: "ICEDisconnected"): void;

  /**
   * 네트워크 환경의 변화
   *
   * https://docs.remotemonster.com/common/error#undefined
   */
  onError(
    code: "4345",
    message: "ICEDisconnected but Connected in 3 seconds"
  ): void;

  /**
   * - Websocket 통신 중 발생한 에러
   * - Send Error
   * - Receive Error
   *
   * https://docs.remotemonster.com/common/error#wserror-websocketerror
   */
  onError(message: "WebSocketFailedError", error: any): void;

  /**
   * ! UNDOCUMENTED ERROR CODE!
   */
  onError(code: string, message: string): void;

  /**
   * - peerConnection 생성 안될때
   * - SDP가 이미 있는데 또 자기것이 생성된 경우
   * - ICE, SDP가 파싱이 안되거나 추가가 안되는 경우
   *
   * https://docs.remotemonster.com/common/error#iceerror-icefailed
   */
  onError(message: "ICEFailedError"): void;

  /**
   * - new Remon시 인자가 잘못될 경우
   *   - config의 Key, Service Id, Local View, Remote View 혹은 config나
   *     Callback자체가 없는 경우이거나 너무 길이가 큰 경우
   * - connectChannel시에 잘못된 값(길이가 1이하이거나 필요이상으로 너무 큰
   *   경우 100이상)
   * - UnsupportedPlatformError
   *   - Browser가 지원하지 않는 경우
   *   - Version이 지원하지 않는 경우
   *
   * https://docs.remotemonster.com/common/error#invalidparametererror-invalidparametererror
   */
  onError(message: "InvalidParameterError"): void;

  /**
   * - create/connect의 반환에 channel정보가 없는 경우
   * - channel이 만료되거나 channel이 없는데 connect하는 경우는 알아서 서버가
   *   onCreateChannel로 변화시켜버림
   *
   * https://docs.remotemonster.com/common/error#connecterror-connectchannelfailed
   */
  onError(message: "ConnectChannelFailedError"): void;

  /**
   * - Media 특히 Camera를 못가져온 경우(Video를 On했음에도 불구하고))
   * - Video Capture를 못가져온 경우
   *
   * https://docs.remotemonster.com/common/error#mediaerror-usermediadeviceerror
   */
  onError(message: "UserMediaDeviceFailedError", error: Error): void;

  /**
   * ! UNDOCUMENTED CODE!
   */
  onError(message: "Signaling: 500 Error"): void;

  /**
   * ! UNDOCUMENTED CODE!
   */
  onError(message: "Signaling: 502 Error: Unknown token"): void;

  /**
   * ! UNDOCUMENTED CODE!
   */
  onError(message: "Signaling: 530 Error: No media server"): void;

  /**
   * ! UNDOCUMENTED CODE!
   */
  onError(message: "SSL authentication(https) is required."): void;

  /**
   * https://docs.remotemonster.com/common/error#unknown-unknown
   *
   * @param message 1. "mixer: unknown error"
   * @param message 2. "mixer:" + string
   */
  onError(message: string): void;
};

export type OnRecordEvent =
  | OnRecordEventUploaded
  | OnRecordEventProgress
  | OnRecordEventUpload
  | OnRecordEventStop
  | OnRecordEventError;

export interface OnRecordEventUploaded {
  event: "uploaded";
  id: string;
  size: number;
}

export interface OnRecordEventProgress {
  event: "progress";
  id: string;
  size: number;
}

export interface OnRecordEventUpload {
  event: "upload";
  id: string;
  size: string;
  file: any;
}

export interface OnRecordEventStop {
  event: "stop";
  id: string;
  size: number;
}

export interface OnRecordEventError {
  event: "error";
  id: string;
  size: number;
  error: any;
}

export type RecordEventType = OnRecordEvent["event"];

export interface Message {
  event: string;
  channel: string;
}

export type State =
  | "INIT"
  | "CONNECT"
  | "WAIT"
  | "COMPLETE"
  | "CLOSE"
  | "LOCALMEDIA"
  | "FAIL";

export type VideoQuality = "HIGH" | "MEDIUM" | "LOW";
