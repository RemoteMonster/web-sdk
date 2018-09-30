const statusEl = document.querySelector("#status");
const localVideoEl = document.querySelector("#localVideo");
const remoteVideoEl = document.querySelector("#remoteVideo");
const chidInputEl = document.querySelector("#chidInput");
const widthSelEl = document.querySelector("#widthSel");
const heightSelEl = document.querySelector("#heightSel");
const videoCodecSelEl = document.querySelector("#videoCodecSel");
const frameRateInputEl = document.querySelector("#frameRateInput");
const useVideoInputEl = document.querySelector("#useVideoInput");
const logDialogContentsEl = document.querySelector("#logDialogContents");
const connectBtnEl = document.querySelector("#connectBtn");
const closeBtnEl = document.querySelector("#closeBtn");
const channelsEl = document.querySelector("#channels");
let chid = "";
let bored = true;
let rtc;

const config = {
  credential: {
    key: "e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03",
    serviceId: "simpleapp"
  },
  view: {
    local: "#localVideo",
    remote: "#remoteVideo"
  },
  media: {
    audio: true,
    video: {
      width: { max: "320", min: "320" },
      height: { max: "240", min: "240" },
      codec: "H264",
      frameRate: 15
    }
  },
  dev: {
    logLevel: "VERBOSE"
  }
};

const listener = {
  onConnect(mChid) {
    l(`EVENT FIRED : onConnect: ${mChid}`);
    statusEl.textContent = `WAIT - ${mChid}`;
  },
  onComplete() {
    l(`EVENT FIRED : onComplete: ${chid}`);
    statusEl.textContent = `${chid}`;
  },
  onClose() {
    l("EVENT FIRED : onClose");
    if (!bored) toggleBtn();
    statusEl.textContent = "";
    chid = "";
  },
  onError(error) {
    l(`EVENT FIRED : onError: ${error}`);
    l(error);
    if (!bored) toggleBtn();
  },
  onStat(result) {
    const stat =
      "State: l.cand:" +
      result.localCandidate +
      "/r.cand:" +
      result.remoteCandidate +
      "/l.res:" +
      result.localFrameWidth +
      " " +
      result.localFrameHeight +
      "/r.res:" +
      result.remoteFrameWidth +
      " " +
      result.remoteFrameHeight +
      "/l.rate:" +
      result.localFrameRate +
      "/r.rate:" +
      result.remoteFrameRate +
      "/s.BW:" +
      result.availableSendBandwidth +
      "/r.BW" +
      result.availableReceiveBandwidth +
      "/rtt:" +
      result.rating +
      "<br>";
    l(stat);
  }
};

closeBtnEl.addEventListener(
  "click",
  event => {
    console.log("[App] Try to disconnect.");
    rtc.close();
    if (!bored) toggleBtn();
    event.preventDefault();
  },
  false
);

connectBtnEl.addEventListener(
  "click",
  event => {
    chid = chidInputEl.value;
    if (!useVideoInputEl.checked) {
      config.media.video = false;
    } else {
      config.media.video.width.max = widthSelEl.value;
      config.media.video.width.min = widthSelEl.value;
      config.media.video.height.max = heightSelEl.value;
      config.media.video.height.min = heightSelEl.value;
      config.media.video.codec = videoCodecSelEl.value;
      config.media.video.frameRate.max = frameRateInputEl.value;
      config.media.video.frameRate.min = frameRateInputEl.value;
    }

    l("config:" + JSON.stringify(config));
    rtc = new Remon({ config, listener });
    rtc.connectCall(chid);
    toggleBtn();
    event.preventDefault();
  },
  false
);

function connectCall(mChid) {
  chid = mChid;
  if (!useVideoInputEl.checked) {
    config.media.video = false;
  } else {
    config.media.video.width.max = widthSelEl.value;
    config.media.video.width.min = widthSelEl.value;
    config.media.video.height.max = heightSelEl.value;
    config.media.video.height.min = heightSelEl.value;
    config.media.video.codec = videoCodecSelEl.value;
    config.media.video.frameRate.max = frameRateInputEl.value;
    config.media.video.frameRate.min = frameRateInputEl.value;
  }
  rtc = new Remon({ config, listener });
  rtc.connectCall(chid);
  toggleBtn();
}

function toggleBtn() {
  if (bored) {
    connectBtnEl.style.visibility = "hidden";
    connectBtnEl.style.display = "none";
    closeBtnEl.style.visibility = "visible";
    closeBtnEl.style.display = "block";
  } else {
    connectBtnEl.style.visibility = "visible";
    connectBtnEl.style.display = "block";
    closeBtnEl.style.visibility = "hidden";
    closeBtnEl.style.display = "none";
  }
  bored = !bored;
}

function l(msg) {
  logDialogContentsEl.innerHTML = msg + "<br>" + logDialogContentsEl.innerHTML;
}

const callsFetcher = new Remon({
  config: {
    credential: {
      key: "e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03",
      serviceId: "simpleapp"
    },
    media: {
      audio: true,
      video: false
    },
    dev: {
      logLevel: "ERROR"
    }
  }
});

const fetchCalls = async function() {
  try {
    const calls = await callsFetcher.fetchCalls();
    channelsEl.innerHTML = "";
    calls
      .filter(call => {
        return call.status === "WAIT" && chid.trim() != call.id.trim();
      })
      .map(call => {
        channelsEl.innerHTML += `
        <li class="mdc-list-item">
          <button class="mdc-button" onClick="javascript:connectCall('${
            call.id
          }')">${call.id}</button>
        </li>
        `;
      });
  } catch (err) {
    console.log(err);
  }
};

setInterval(fetchCalls, 3000);
