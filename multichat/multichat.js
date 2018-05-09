/* global Remon */
/* eslint-disable no-console */

const initButton1 = document.querySelector("#initButton1");
const closeButton = document.querySelector("#exitButton");
const localVideoElement1 = document.querySelector("#localVideo1");
const remoteVideoElement1 = document.querySelector("#remoteVideo1");
const channelIdInputElement1 = document.querySelector("#channelIdInput1");
const logElement = document.querySelector("#log");
const appTitleElement = document.querySelector("#appTitle");
const createButton = document.querySelector("#createButton");
let roomName = "";
let bored = true;
let currentRoomNumber = 0;
let originalRoomName = "";
let vList = [];
let latestRoom;
let isHost = false;
let isInitStatusCalled = false;
let isOnDisplayUserMediaCalled = false;
let r0;
let wsurl = "ws://localhost:8081/ws";
let resturl = "http://localhost:8081/rest/init";
// let wsurl= 'wss://remotemonster.com/ws';
// let resturl = 'https://remotemonster.com/rest';

const rtcConfig1 = {
  credential: {
    //key: 'e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03',
    //serviceId: 'simpleapp'
    key: "1234567890",
    serviceId: "SERVICEID1",
    //key: '72625d89cede53ec052a86e9a12867665190c110a9132222',
    //serviceId: 'firstnet'
    //key: '686a1ad4af61c5fed3c7c6cb403acf1cd50a84fcc0258ff3',
    //serviceId: 'peace'
    //wsurl: 'wss://remotemonster.com/ws',
    //resturl: 'https://remotemonster.com/rest'
    wsurl: wsurl,
    resturl: resturl
    //wsurl: 'wss://apius1.remotemonster.com/ws',
    //resturl: 'https://apius1.remotemonster.com/rest'
    //    url: 'wss://remotemonster.com/ws',
    //url: 'wss://apius1.remotemonster.com/ws',
    //url: 'ws://localhost:8081/ws',
  },
  view: {
    local: "#localVideo0",
    remote: "#remoteVideo" + currentRoomNumber
  },
  media: {
    audio: true,
    video: {
      width: { max: "640", min: "640" },
      height: { max: "480", min: "480" },
      codec: "H264",
      frameRate: 15
    },
    record: false
  },
  dev: {
    logLevel: "DEBUG"
  }
};

const rtcListener = {
  onInit(token) {
    l(`EVENT FIRED : onInit: ${token}`);
  },
  onCreateChannel(channelId) {
    l(`EVENT FIRED : onCreateChannel: ${channelId}`);
    appTitleElement.innerHTML = roomName + " - " + "Waiting";
  },
  onConnectChannel(channelId) {
    l(`EVENT FIRED : onConnectChannel ${channelId}`);
    appTitleElement.innerHTML = roomName + " - " + "Joining";
  },
  onComplete() {
    l("EVENT FIRED : onComplete");
    appTitleElement.innerHTML = roomName + " - " + "Join completed";
    if (isHost) createRemoteDiv();
  },
  onAddLocalStream(stream) {
    l(`EVENT FIRED : onAddLocalStream: ${stream}`);
  },
  onStateChange(state) {
    l(`EVENT FIRED : onStateChange: ${state}`);
    if (state == "CLOSE") {
      if (!bored) toggleButton();
      l("****************** closed");
    } else if (state == "FAIL") {
      if (!bored) toggleButton();
    } else if (state == "INIT") {
      isInitStatusCalled = true;
      if (isOnDisplayUserMediaCalled) {
        isOnDisplayUserMediaCalled = false;
        isInitStatusCalled = false;
        console.log("------------ roomname:" + roomName);
        latestRoom.connectChannel(roomName);
        currentRoomNumber++;
      }
    }
  },
  onDisconnectChannel() {
    l("EVENT FIRED : onDisconnectChannel");
    if (!bored) toggleButton();
  },
  onError(error) {
    l(`EVENT FIRED : onError: ${error}`);
    l(error);
    if (!bored) toggleButton();
  },
  onDisplayUserMedia(stream) {
    l("event fired: onDisplayUserMedia");
    isOnDisplayUserMediaCalled = true;
    if (isInitStatusCalled) {
      isInitStatusCalled = false;
      isOnDisplayUserMediaCalled = false;
      console.log("------------ roomname:" + roomName);
      latestRoom.connectChannel(roomName);
      currentRoomNumber++;
    }
  },
  onStat(result) {
    //const stat = "State: l.cand:"+result.localCandidate+"/r.cand:"+result.remoteCandidate+"/l.res:"+result.localFrameWidth+" "+result.localFrameHeight+"/r.res:"+result.remoteFrameWidth+" "+result.remoteFrameHeight+"/l.rate:"+result.localFrameRate + "/r.rate:"+result.remoteFrameRate+"/s.BW:"+ result.availableSendBandwidth + "/r.BW"+ result.availableReceiveBandwidth + "/rtt:" + result.rtt + "/l.AFL:" + result.localAudioFractionLost + "/l.VFL:"+ result.localVideoFractionLost + "/r.AFL" + result.remoteAudioFractionLost + "/r.VFL" + result.remoteVideoFractionLost +"<br>";
    //l(stat);
  },
  onSearch(result) {
    document.querySelector("#log").innerHTML += result;
  }
};

closeButton.addEventListener(
  "click",
  event => {
    console.log("[App] Try to disconnect.");
    for (var v in vList) {
      v.close();
    }
    if (!bored) toggleButton();
    event.preventDefault();
  },
  false
);

createButton.addEventListener(
  "click",
  event => {
    isHost = true;
    originalRoomName = document.querySelector("#channelIdInput1").value;
    roomName = originalRoomName + "_0";
    if (!document.querySelector("#useVideo1").checked) {
      rtcConfig1.media.video = false;
    } else {
      rtcConfig1.media.video.width.max = document.querySelector(
        "#width1"
      ).value;
      rtcConfig1.media.video.width.min = document.querySelector(
        "#width1"
      ).value;
      rtcConfig1.media.video.height.max = document.querySelector(
        "#height1"
      ).value;
      rtcConfig1.media.video.height.min = document.querySelector(
        "#height1"
      ).value;
      rtcConfig1.media.video.codec = document.querySelector(
        "#videoCodec1"
      ).value;
      rtcConfig1.media.video.frameRate.max = document.querySelector(
        "#frameRate1"
      ).value;
      rtcConfig1.media.video.frameRate.min = document.querySelector(
        "#frameRate1"
      ).value;
    }

    l("config:" + JSON.stringify(rtcConfig1));
    latestRoom = new Remon({ config: rtcConfig1, listener: rtcListener });
    vList.push(latestRoom);
    toggleButton();
    event.preventDefault();
  },
  false
);

function connectRoom(rName) {
  roomName = rName;
  if (!document.querySelector("#useVideo1").checked) {
    rtcConfig1.media.video = false;
  } else {
    rtcConfig1.media.video.width.max = document.querySelector("#width1").value;
    rtcConfig1.media.video.width.min = document.querySelector("#width1").value;
    rtcConfig1.media.video.height.max = document.querySelector(
      "#height1"
    ).value;
    rtcConfig1.media.video.height.min = document.querySelector(
      "#height1"
    ).value;
    rtcConfig1.media.video.codec = document.querySelector("#videoCodec1").value;
    rtcConfig1.media.video.frameRate.max = document.querySelector(
      "#frameRate1"
    ).value;
    rtcConfig1.media.video.frameRate.min = document.querySelector(
      "#frameRate1"
    ).value;
  }
  latestRoom = new Remon({ config: rtcConfig1, listener: rtcListener });
  vList.push(latestRoom);
  toggleButton();
}

function toggleButton() {
  if (bored) {
    document.querySelector("#createButton").style.visibility = "hidden";
    document.querySelector("#createButton").style.display = "none";
    document.querySelector("#exitButton").style.visibility = "visible";
    document.querySelector("#exitButton").style.display = "block";
  } else {
    document.querySelector("#createButton").style.visibility = "visible";
    document.querySelector("#createButton").style.display = "block";
    document.querySelector("#exitButton").style.visibility = "hidden";
    document.querySelector("#exitButton").style.display = "none";
  }
  bored = !bored;
}

function createRemoteDiv() {
  var videoTag = document.createElement("video");
  videoTag.id = "remoteVideo" + currentRoomNumber;
  videoTag.autoplay = "autoplay";
  videoTag.controls = "controls";
  var videoDiv = document.createElement("div");
  videoDiv.classname = "mdl-card__media video-container";
  videoDiv.appendChild(videoTag);
  var h2Div = document.createElement("h2");
  h2Div.className = "mdl-card__title-text";
  h2Div.innerHTML = "remote" + currentRoomNumber;
  var titleDiv = document.createElement("div");
  titleDiv.className = "mdl-card__title";
  titleDiv.appendChild(h2Div);
  var motherDiv = document.createElement("div");
  if (currentRoomNumber == 1) {
    console.log("currentCount:" + currentRoomNumber);
    motherDiv.className = "square-card mdl-card mdl-shadow--2dp";
  } else {
    motherDiv.className = "square-card mdl-card mdl-shadow--2dp";
    //motherDiv.style['top']= (currentRoomNumber-2)* 210 + 10 +"px";
  }
  //motherDiv.appendChild(titleDiv);
  motherDiv.appendChild(videoDiv);
  motherDiv.id = "viewerDiv" + currentRoomNumber;
  motherDiv.style["z-index"] = currentRoomNumber;

  var mainDiv = document.querySelector("#mainDiv");
  mainDiv.appendChild(motherDiv);
  createAdditionalRemonObject();
}

function createAdditionalRemonObject() {
  roomName = originalRoomName + "_" + currentRoomNumber;
  rtcConfig1.view.remote = "#remoteVideo" + currentRoomNumber;
  latestRoom = new Remon({ config: rtcConfig1, listener: rtcListener });
  vList.push(latestRoom);
}
// search관련 로직 시작
// remon object for just only search
const rtcConfig0 = {
  credential: {
    //key: 'e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03',
    //serviceId: 'simpleapp'
    key: "1234567890",
    serviceId: "SERVICEID1",
    //key: '686a1ad4af61c5fed3c7c6cb403acf1cd50a84fcc0258ff3',
    //serviceId: 'peace',
    //key: '72625d89cede53ec052a86e9a12867665190c110a9132222',
    //serviceId: 'firstnet'
    //wsurl: 'ws://localhost:8081/ws',
    //resturl: 'http://localhost:8081/rest',
    //wsurl: 'wss://apius1.remotemonster.com/ws',
    //resturl: 'https://apius1.remotemonster.com/rest'
    wsurl: wsurl,
    resturl: resturl
  },
  media: {
    audio: true,
    video: false
  },
  dev: {
    logLevel: "ERROR"
  }
};
function searchPoller() {
  r0.search();
}
function l(msg) {
  logElement.innerHTML = msg + "<br>" + logElement.innerHTML;
}
const rtcListener0 = {
  onInit(token) {
    searchPoller();
    setInterval(searchPoller, 5000);
  },
  onSearch(result) {
    var resultObj = JSON.parse(result);
    var search_list = document.querySelector("#search_list");
    search_list.innerHTML = "";
    for (var ch_i = 0; ch_i < resultObj.length; ch_i++) {
      if (
        resultObj[ch_i].status === "WAIT" &&
        roomName.trim() != resultObj[ch_i].id.trim()
      ) {
        var resultRoomName = resultObj[ch_i].id;
        var createTime = new Date(resultObj[ch_i].createTime).toTimeString();
        search_list.innerHTML +=
          "<div class='mdl-list__item' style='float:left;'>";
        search_list.innerHTML +=
          "<span class='mdl-list__item-primary-content'>";
        search_list.innerHTML +=
          "&nbsp;&nbsp;<span><button class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' onclick='connectRoom(\"" +
          resultRoomName +
          "\")'><i class='material-icons mdl-list__item-icon'>person</i>" +
          resultRoomName +
          "</button></span>";
        search_list.innerHTML += "</span></div>";
      }
    }
  }
};
r0 = new Remon({ config: rtcConfig0, listener: rtcListener0 });
