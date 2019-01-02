const videoViewEl = document.querySelector("#videoView");
const statusEl = document.querySelector("#status");
const chidInputEl = document.querySelector("#chidInput");
const widthSelEl = document.querySelector("#widthSel");
const heightSelEl = document.querySelector("#heightSel");
const videoCodecSelEl = document.querySelector("#videoCodecSel");
const frameRateInputEl = document.querySelector("#frameRateInput");
const useVideoInputEl = document.querySelector("#useVideoInput");
const unifiedPlanSDPInputEl = document.querySelector("#unifiedPlanSDPInput");
const simulcastInputEl = document.querySelector("#simulcastInput");
const logDialogContentsEl = document.querySelector("#logDialogContents");
const createBtnEl = document.querySelector("#createBtn");
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
  view: {},
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
  onCreate(mChid) {
    l(`EVENT FIRED : onConnect: ${chid}`);
    chid = mChid;
    statusEl.textContent = chid;
    videoViewEl.classList.add("remon-local-video");
    toggleBtn();
  },
  onJoin(chid) {
    l(`EVENT FIRED : onComplete: ${chid}`);
    statusEl.textContent = chid;
    videoViewEl.classList.remove("remon-local-video");
    toggleBtn();
  },
  onClose() {
    l("EVENT FIRED : onClose");
    statusEl.textContent = "";
    chid = "";
    if (!bored) toggleBtn();
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

createBtnEl.addEventListener(
  "click",
  event => {
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
      config.view.local = "#videoView";
      delete config.view.remote;
    }

    if (unifiedPlanSDPInputEl.checked) {
      config.rtc.sdpSemantics = "unified-plan";
    }

    if (simulcastInputEl.checked) {
      config.rtc.simulcast = true;
    }

    l("config:" + JSON.stringify(config));
    rtc = new Remon({ config, listener });
    rtc.createCast();

    event.preventDefault();
  },
  false
);

function joinCast(mChid) {
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
    config.view.remote = "#videoView";
    delete config.view.local;
  }
  rtc = new Remon({ config, listener });
  rtc.joinCast(chid);
}

function toggleBtn() {
  if (bored) {
    createBtnEl.style.visibility = "hidden";
    createBtnEl.style.display = "none";
    closeBtnEl.style.visibility = "visible";
    closeBtnEl.style.display = "block";
  } else {
    createBtnEl.style.visibility = "visible";
    createBtnEl.style.display = "block";
    closeBtnEl.style.visibility = "hidden";
    closeBtnEl.style.display = "none";
  }
  bored = !bored;
}

function l(msg) {
  logDialogContentsEl.innerHTML = msg + "<br>" + logDialogContentsEl.innerHTML;
}

const castsFetcher = new Remon({
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

const fetchCasts = async function() {
  try {
    const casts = await castsFetcher.fetchCasts();
    channelsEl.innerHTML = "";
    casts
      .filter(cast => {
        return chid.trim() != cast.id.trim();
      })
      .map(cast => {
        channelsEl.innerHTML += `
        <li class="mdc-list-item">
          <button class="mdc-button"
            onClick="javascript:joinCast('${cast.id}')">
            ${cast.id}
          </button>
        </li>
        `;
      });
  } catch (err) {
    console.log(err);
  }
};

setInterval(fetchCasts, 3000);
