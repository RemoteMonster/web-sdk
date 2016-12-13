/* global Remon */
/* eslint-disable no-console */

const channelIdNoticeTitleElement = document.querySelector('#channelIdNoticeTitle');
const connectChannelButtonElement = document.querySelector('#connectChannelButton');
const disconnectButtonElement = document.querySelector('#disconnectButton');
const initButtonElement = document.querySelector('#initButton');
const localVideoElement = document.querySelector('#localVideo');
const remoteVideoElement = document.querySelector('#remoteVideo');
const channelIdInputElement = document.querySelector('#channelIdInput');
const localVideoTracksPauseCheckboxElement = document.querySelector('#localVideoTracksPauseCheckbox');
const localAudioTracksMuteCheckboxElement = document.querySelector('#localAudioTracksMuteCheckbox');
const remoteVideoTracksPauseCheckboxElement = document.querySelector('#remoteVideoTracksPauseCheckbox');
const remoteAudioTracksMuteCheckboxElement = document.querySelector('#remoteAudioTracksMuteCheckbox');
const chatMessageHistoryElement = document.querySelector('#chatMessageHistory');
const chatMessageInputElement = document.querySelector('#chatMessageInput');
const sendChatMessageButtonElement = document.querySelector('#sendChatMessageButton');
const rtc = Remon;

const rtcConfig = {
  credential: {
    key: '1234567890',
    serviceId: 'SERVICEID1'
  },
  view: {
    local: '#localVideo',
    remote: '#remoteVideo'
  },
  sdk: {
    logLevel: 'DEBUG',
  },
}

const rtcListener = {
  onInit(token) { console.log(`EVENT FIRED : onInit: ${token}`); },
  onCreateChannel(channelId) {
    console.log(`EVENT FIRED : onCreateChannel: ${channelId}`);
    channelIdNoticeTitleElement.textContent = channelId;
  },
  onConnectChannel(channelId) { console.log(`EVENT FIRED : onConnectChannel ${channelId}`); },
  onComplate() { console.log('EVENT FIRED : onComplate'); },
  onDisplayUserMedia() {
    localVideoTracksPauseCheckboxElement.checked = true;
    localAudioTracksMuteCheckboxElement.checked = true;
  },
  onAddLocalStream(stream) { console.log(`EVENT FIRED : onAddLocalStream: ${stream}`); },
  onAddRemoteStream(stream) {
    console.log(`EVENT FIRED : onAddRemoteStream: ${stream}`);
    remoteVideoTracksPauseCheckboxElement.checked = true;
    remoteAudioTracksMuteCheckboxElement.checked = true;
  },
  onStateChange(state) { console.log(`EVENT FIRED : onStateChange: ${state}`); },
  onDisconnectChannel() { console.log('EVENT FIRED : onDisconnectChannel'); },
  onMessage(message) {
    console.log(`EVENT FIRED : onMessage: ${message}`);
    let chatParagraph;
    chatParagraph = document.createElement('p');
    chatParagraph.classList.add('card-text', 'remote');
    chatParagraph.textContent = message;
    chatMessageHistoryElement.appendChild(chatParagraph);
  },
  onError(error) { console.log(`EVENT FIRED : onError: ${error}`); },
}

//rtc.init({ userConfig: rtcConfig, userListeners: rtcListener });

connectChannelButtonElement.addEventListener('click', (event) => {
  console.log(`[App] Try to connect channel: ${channelIdInputElement.value}`);
  rtc.connectChannel(channelIdInputElement.value);
  event.preventDefault();
}, false);

disconnectButtonElement.addEventListener('click', (event) => {
  console.log('[App] Try to disconnect.');
  if (rtc.disconnect)rtc.disconnect();
  event.preventDefault();
}, false);

initButtonElement.addEventListener('click', (event) => {
  console.log('[App] Try to Init');
  if (rtc.disconnect) rtc.disconnect();
  rtcConfig.media={
    audio: true,
    video: {
      width: {max: document.querySelector('#resolution_width').value},
      height: {max: document.querySelector('#resolution_height').value}
    }
  };
  rtc.init({ userConfig: rtcConfig, userListeners: rtcListener });
  event.preventDefault();
}, false);

sendChatMessageButtonElement.addEventListener('click', (event) => {
  console.log('[App] Try to send message');
  const message = chatMessageInputElement.value;
  let chatParagraph;

  if (message) {
    chatParagraph = document.createElement('p');
    chatParagraph.classList.add('card-text', 'text-xs-right', 'local');
    chatParagraph.textContent = message;
    chatMessageHistoryElement.appendChild(chatParagraph);
    rtc.sendMessage(message);
  }

  event.preventDefault();
}, false);

localVideoTracksPauseCheckboxElement.addEventListener('click', (event) => {
  console.log('[App] Try to local video pause/unpase');
  if (localVideoTracksPauseCheckboxElement.checked) {
    rtc.pauseLocalVideo(true);
  } else {
    rtc.pauseLocalVideo(false);
  }
})

localAudioTracksMuteCheckboxElement.addEventListener('click', (event) => {
  console.log('[App] Try to local audio mute/unmute');
  if (localVideoTracksPauseCheckboxElement.checked) {
    rtc.muteLocalAudio(true);
  } else {
    rtc.muteLocalAudio(false);
  }
})

remoteVideoTracksPauseCheckboxElement.addEventListener('click', (event) => {
  console.log('[App] Try to remote video pause/unpase');
  if (remoteVideoTracksPauseCheckboxElement.checked) {
    rtc.pauseRemoteVideo(true);
  } else {
    rtc.pauseRemoteVideo(false);
  }
})

remoteAudioTracksMuteCheckboxElement.addEventListener('click', (event) => {
  console.log('[App] Try to remote audio mute/unmute');
  if (remoteVideoTracksPauseCheckboxElement.checked) {
    rtc.muteRemoteAudio(true);
  } else {
    rtc.muteRemoteAudio(false);
  }
})
