/* global Remon */
/* eslint-disable no-console */

const initButton1 = document.querySelector("#initButton1");
const connectChannelButtonElement1 = document.querySelector('#connectChannelButton1');
const disconnectButtonElement1 = document.querySelector('#disconnectButton1');
const localVideoElement1 = document.querySelector('#localVideo1');
const remoteVideoElement1 = document.querySelector('#remoteVideo1');
const channelIdInputElement1 = document.querySelector('#channelIdInput1');

const initButton2 = document.querySelector("#initButton2");
const connectChannelButtonElement2 = document.querySelector('#connectChannelButton2');
const disconnectButtonElement2 = document.querySelector('#disconnectButton2');
const remoteVideoElement2 = document.querySelector('#remoteVideo2');
const channelIdInputElement2 = document.querySelector('#channelIdInput2');

const rtcConfig1 = {
  credential: {
    key: 'e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03',
    serviceId: 'simpleapp'
  },
  view: {
    local: '#localVideo1',
    remote: '#remoteVideo1'
  },
  dev: {
    logLevel: 'VERBOSE',
  },
}
const rtcConfig2 = {
  credential: {
    key: 'e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03',
    serviceId: 'simpleapp'
  },
  view: {
    local: '#localVideo1',
    remote: '#remoteVideo2'
  },
  dev: {
    logLevel: 'DEBUG',
  },
}
rtcConfig1.media = {
  audio: true,
  video: {
    width: {max: '640'},
    height: {max: '480'},
    codec: 'H264',
  }
};
rtcConfig2.media = {
  audio: true,
  video: {
    width: {max: '640'},
    height: {max: '480'},
    codec: 'H264',
  }
};
var r1;
var r2;
initButton1.addEventListener('click', (event) =>{
  console.log("init button1");
  rtcConfig1.media.video.width.max = document.querySelector('#width1').value;
  rtcConfig1.media.video.height.max = document.querySelector('#height1').value;
  rtcConfig1.media.video.codec = document.querySelector('#videoCodec1').value;
  rtcConfig1.media.video.frameRate = document.querySelector('#frameRate1').value;
  rtcConfig1.media.video.facingMode = (document.querySelector('#facingMode1').value)? "user": "environment";
  rtcConfig1.media.video = document.querySelector('#useVideo1').checked;
  console.log("config:"+JSON.stringify(rtcConfig1));
  r1 = new Remon({config: rtcConfig1, listener: rtcListener});
  event.preventDefault();
}, false);
initButton2.addEventListener('click', (event) =>{
  console.log("init button2");
  rtcConfig2.media.video.width.max = document.querySelector('#width2').value;
  rtcConfig2.media.video.height.max = document.querySelector('#height2').value;
  rtcConfig2.media.video.codec = document.querySelector('#videoCodec2').value;
  rtcConfig2.media.video.frameRate = document.querySelector('#frameRate2').value;
  rtcConfig2.media.video.facingMode = (document.querySelector('#facingMode2').value)? "user": "environment";
  rtcConfig2.media.video = document.querySelector('#useVideo2').checked;
  console.log("config:"+JSON.stringify(rtcConfig1));
  r2 = new Remon({config: rtcConfig2});
  event.preventDefault();
}, false);
connectChannelButtonElement1.addEventListener('click', (event) => {
  console.log(`[App] Try to connect channel: ${channelIdInputElement1.value}`);
  r1.connectChannel(channelIdInputElement1.value);
  event.preventDefault();
}, false);

connectChannelButtonElement2.addEventListener('click', (event) => {
  console.log(`[App] Try to connect channel: ${channelIdInputElement2.value}`);
  r2.connectChannel(channelIdInputElement2.value);
  event.preventDefault();
}, false);

disconnectButtonElement1.addEventListener('click', (event) => {
  console.log('[App] Try to disconnect.');
  r1.close();
  //event.preventDefault();
}, false);
disconnectButtonElement2.addEventListener('click', (event) => {
  console.log('[App] Try to disconnect.');
  r2.close();
  //event.preventDefault();
}, false);

const rtcListener = {
  onInit(token) { console.log(`EVENT FIRED : onInit: ${token}`); },
  onCreateChannel(channelId) {
    console.log(`EVENT FIRED : onCreateChannel: ${channelId}`);
  },
  onConnectChannel(channelId) { console.log(`EVENT FIRED : onConnectChannel ${channelId}`); },
  onComplete() { console.log('EVENT FIRED : onComplete'); },
  // onDisplayUserMedia() {
  //   localVideoTracksPauseCheckboxElement.checked = true;
  //   localAudioTracksMuteCheckboxElement.checked = true;
  // },
  onAddLocalStream(stream) { console.log(`EVENT FIRED : onAddLocalStream: ${stream}`); },
  // onAddRemoteStream(stream) {
  //   console.log(`EVENT FIRED : onAddRemoteStream: ${stream}`);
  //   remoteVideoTracksPauseCheckboxElement.checked = true;
  //   remoteAudioTracksMuteCheckboxElement.checked = true;
  // },
  onStateChange(state) { console.log(`EVENT FIRED : onStateChange: ${state}`); },
  onDisconnectChannel() { console.log('EVENT FIRED : onDisconnectChannel'); },
  // onMessage(message) {
  //   console.log(`EVENT FIRED : onMessage: ${message}`);
  //   let chatParagraph;
  //   chatParagraph = document.createElement('p');
  //   chatParagraph.classList.add('card-text', 'remote');
  //   chatParagraph.textContent = message;
  //   chatMessageHistoryElement.appendChild(chatParagraph);
  // },
  onError(error) { console.log(`EVENT FIRED : onError: ${error}`); },
  onStat(result){
    const stat = "l.cand:"+result.localCandidate+"/r.cand:"+result.remoteCandidate+"/l.res:"+result.localFrameWidth+" "+result.localFrameHeight+"/r.res:"+result.remoteFrameWidth+" "+result.remoteFrameHeight+"/l.rate:"+result.localFrameRate + "/r.rate:"+result.remoteFrameRate+"/s.BW:"+ result.availableSendBandwidth + "/r.BW"+ result.availableReceiveBandwidth + "/rtt:" + result.rtt + "/l.AFL:" + result.localAudioFractionLost + "/l.VFL:"+ result.localVideoFractionLost + "/r.AFL" + result.remoteAudioFractionLost + "/r.VFL" + result.remoteVideoFractionLost +"<br>";
    document.querySelector('#log').innerHTML += stat;
    //console.log(result);
  },
}

//rtc.init({ userConfig: rtcConfig, userListeners: rtcListener });
