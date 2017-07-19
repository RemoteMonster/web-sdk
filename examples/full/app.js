/* global Remon */
/* eslint-disable no-console */

let roomName = "";
let bored = true;
const initButton1 = document.querySelector("#initButton1");
const closeButton = document.querySelector('#exitButton');
const localVideoElement1 = document.querySelector('#localVideo1');
const remoteVideoElement1 = document.querySelector('#remoteVideo1');
const channelIdInputElement1 = document.querySelector('#channelIdInput1');
const logElement = document.querySelector('#log');
let appTitleElement = document.querySelector('#appTitle');
const createButton = document.querySelector('#createButton');
var isInitStatusCalled =false;
var isOnDisplayUserMediaCalled = false;
var r0;
var r1;

const rtcConfig1 = {
  credential: {
    key: 'e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03',
    serviceId: 'simpleapp'
  },
  view: {
    local: '#localVideo1',
    remote: '#remoteVideo1'
  },
  media:{
    audio: true,
    video: {
      width: {max: '320', min: '320'},
      height: {max: '240', min: '240'},
      codec: 'H264',
      frameRate: 15,
    },
  },
  dev: {
    logLevel: 'VERBOSE',
  },
};

const rtcListener = {
  onInit(token) {
    l(`EVENT FIRED : onInit: ${token}`);
  },
  onCreateChannel(channelId) {
    l(`EVENT FIRED : onCreateChannel: ${channelId}`);
    appTitleElement.innerHTML = roomName+" - "+ "Waiting";
  },
  onConnectChannel(channelId) {
    l(`EVENT FIRED : onConnectChannel ${channelId}`);
    appTitleElement.innerHTML = roomName+" - "+ "Joining";
  },
  onComplete() {
    l('EVENT FIRED : onComplete');
    appTitleElement.innerHTML = roomName+" - "+ "Join completed";
  },
  onAddLocalStream(stream) {
    l(`EVENT FIRED : onAddLocalStream: ${stream}`);
  },
  onStateChange(state) {
    l(`EVENT FIRED : onStateChange: ${state}`);
    if (state == 'CLOSE'){
      if (!bored)toggleButton();
    }else if(state == 'FAIL'){
      if (!bored)toggleButton();
    }else if (state == 'INIT'){
      isInitStatusCalled = true;
      if (isOnDisplayUserMediaCalled){
        r1.connectChannel(roomName);
      }
    }
  },
  onDisconnectChannel() {
    l('EVENT FIRED : onDisconnectChannel');
    if (!bored)toggleButton();
  },
  onError(error) {
    l(`EVENT FIRED : onError: ${error}`);
    l(error);
    if (!bored)toggleButton();
  },
  onDisplayUserMedia(stream) {
    l('event fired: onDisplayUserMedia');
    isOnDisplayUserMediaCalled = true;
    if (isInitStatusCalled){
      r1.connectChannel(roomName);
    }
  },
  onStat(result){
    const stat = "State: l.cand:"+result.localCandidate+"/r.cand:"+result.remoteCandidate+"/l.res:"+result.localFrameWidth+" "+result.localFrameHeight+"/r.res:"+result.remoteFrameWidth+" "+result.remoteFrameHeight+"/l.rate:"+result.localFrameRate + "/r.rate:"+result.remoteFrameRate+"/s.BW:"+ result.availableSendBandwidth + "/r.BW"+ result.availableReceiveBandwidth + "/rtt:" + result.rating +"<br>";
    l(stat);
  },
  onSearch(result){
    document.querySelector('#log').innerHTML += result;
  }
};

closeButton.addEventListener('click', (event) => {
  console.log('[App] Try to disconnect.');
  r1.close();
  if (!bored)toggleButton();
  event.preventDefault();
}, false);

createButton.addEventListener('click', (event) =>{
  roomName = document.querySelector('#channelIdInput1').value;
  if (!document.querySelector('#useVideo1').checked){
    rtcConfig1.media.video = false;
  }else{
    rtcConfig1.media.video.width.max = document.querySelector('#width1').value;
    rtcConfig1.media.video.width.min = document.querySelector('#width1').value;
    rtcConfig1.media.video.height.max = document.querySelector('#height1').value;
    rtcConfig1.media.video.height.min = document.querySelector('#height1').value;
    rtcConfig1.media.video.codec = document.querySelector('#videoCodec1').value;
    rtcConfig1.media.video.frameRate.max = document.querySelector('#frameRate1').value;
    rtcConfig1.media.video.frameRate.min = document.querySelector('#frameRate1').value;
  }

  l("config:"+JSON.stringify(rtcConfig1));
  r1 = new Remon({config: rtcConfig1, listener: rtcListener});
  toggleButton();
  event.preventDefault();
}, false);

function connectRoom(rName){
  roomName = rName;
  if (!document.querySelector('#useVideo1').checked){
    rtcConfig1.media.video = false;
  }else{
    rtcConfig1.media.video.width.max = document.querySelector('#width1').value;
    rtcConfig1.media.video.width.min = document.querySelector('#width1').value;
    rtcConfig1.media.video.height.max = document.querySelector('#height1').value;
    rtcConfig1.media.video.height.min = document.querySelector('#height1').value;
    rtcConfig1.media.video.codec = document.querySelector('#videoCodec1').value;
    rtcConfig1.media.video.frameRate.max = document.querySelector('#frameRate1').value;
    rtcConfig1.media.video.frameRate.min = document.querySelector('#frameRate1').value;
  }
  r1 = new Remon({config: rtcConfig1, listener: rtcListener});
  toggleButton();
}

function toggleButton(){
  if (bored){
    document.querySelector("#createButton").style.visibility="hidden";
    document.querySelector("#createButton").style.display="none";
    document.querySelector("#exitButton").style.visibility="visible";
    document.querySelector("#exitButton").style.display="block";
  }else{
    document.querySelector("#createButton").style.visibility="visible";
    document.querySelector("#createButton").style.display="block";
    document.querySelector("#exitButton").style.visibility="hidden";
    document.querySelector("#exitButton").style.display="none";
  }
  bored = !bored;
}


// remon object for just only search
const rtcConfig0 = {
  credential: {
    key: 'e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03',
    serviceId: 'simpleapp'
  },
  media: {
    audio:true,
    video:false,
  },
  dev: {
    logLevel: 'ERROR',
  },
};

function searchPoller(){
  r0.search();
}
function l(msg){
    logElement.innerHTML = msg+"<br>"+logElement.innerHTML;
}
const rtcListener0 = {
  onInit(token) {
    searchPoller();
    setInterval(searchPoller,5000);
  },
  onSearch(result){
    var resultObj = JSON.parse(result);
    var search_list = document.querySelector('#search_list');
    search_list.innerHTML = "";
    for( var ch_i=0;ch_i<resultObj.length; ch_i++){
      if (resultObj[ch_i].status==="WAIT" && roomName.trim() != resultObj[ch_i].id.trim()){
        var resultRoomName = resultObj[ch_i].id;
        var createTime = new Date(resultObj[ch_i].createTime).toTimeString();
        search_list.innerHTML += "<div class='mdl-list__item' style='float:left;'>";
        search_list.innerHTML += "<span class='mdl-list__item-primary-content'>";
        search_list.innerHTML += "&nbsp;&nbsp;<span><button class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' onclick='connectRoom(\""+resultRoomName+"\")'><i class='material-icons mdl-list__item-icon'>person</i>"+createTime+"&nbsp;- "+resultRoomName+"</button></span>";
        search_list.innerHTML += "</span></div>";
      }
    }

  }
};
r0 = new Remon({config: rtcConfig0, listener: rtcListener0});
