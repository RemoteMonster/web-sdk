const $ = sel => document.querySelector(sel);
$.all = sel => document.querySelectorAll(sel);
$.emit = ev => el => el.dispatchEvent(new Event(ev));
$.html = h => document.createRange().createContextualFragment(h);

const _ = {};
_.isEmpty = x =>
  x === undefined ||
  x === null ||
  x === "" ||
  (Object.keys(x).length === 0 && x.constructor === Object);
_.omit = (...keys) => o =>
  Object.entries(o)
    .filter(([k]) => !keys.includes(k))
    .reduce((acc, [k, v]) => ({ ...acc, ...{ [k]: v } }), {});
_.pathA = xs => o =>
  xs.reduce((acc, cur) => (_.isEmpty(acc) ? null : acc[cur]), o);
_.pathS = x => o => _.pathA(x.split("."))(o);
_.path = x => o =>
  typeof x === "string"
    ? _.pathS(x)(o)
    : Array.isArray(x)
    ? _.pathA(x)(o)
    : false;

_.oCreatePath = (path, v) =>
  path.reduceRight(
    (acc, cur) =>
      Object.keys(acc).length === 0 ? { [cur]: v } : { [cur]: acc },
    {}
  );

const P = new URLSearchParams(window.location.search);

const S = key => {
  try {
    S.isExist(key) || new Error(`S/load/not_exist/${key}`);
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.error("S/load", err);
  }
};
S.load = () => S;
S.isExist = key => !(localStorage.getItem(key) === null);
S.save = key => x => {
  try {
    return localStorage.setItem(key, JSON.stringify(x));
  } catch (err) {
    console.error("S/save", err);
  }
};
S.remove = key =>
  S.isExist(key)
    ? localStorage.removeItem(key)
    : console.warn("S/remove/not_exist", key);

const resolutions = [
  {
    label: "8K",
    value: "7680 x 4320",
    width: 7680,
    height: 4320,
    ratio: "16:9"
  },
  {
    label: "4K",
    value: "4096 x 2160",
    width: 4096,
    height: 2160,
    ratio: "16:9"
  },
  {
    label: "1080(FHD)",
    value: "1920 x 1080",
    width: 1920,
    height: 1080,
    ratio: "16:9"
  },
  {
    label: "1080(FHD) portrait",
    value: "1080 x 1920",
    width: 1080,
    height: 1920,
    ratio: "16:9"
  },
  {
    label: "UXGA",
    value: "1600 x 1200",
    width: 1600,
    height: 1200,
    ratio: "4:3"
  },
  {
    label: "720(HD)",
    value: "1280 x 720",
    width: 1280,
    height: 720,
    ratio: "16:9"
  },
  {
    label: "720(HD) portrait",
    value: "720 x 1280",
    width: 720,
    height: 1280,
    ratio: "16:9"
  },
  { label: "VGA", value: "640 x 480", width: 640, height: 480, ratio: "4:3" },
  { label: "CIF", value: "352 x 288", width: 352, height: 288, ratio: "4:3" },
  { label: "QVGA", value: "320 x 240", width: 320, height: 240, ratio: "4:3" }
];
const codecs = ["vp8", "vp9", "h264"];
const servers = [
  {
    type: "localhost",
    wsurl: "ws://localhost:8081/ws",
    resturl: "http://localhost:8081/rest",
    logServerUrl: "https://localhost:2001/topics"
  },
  {
    type: "matiz",
    wsurl: "wss://matiz.remotemonster.com/ws",
    resturl: "https://matiz.remotemonster.com/rest",
    logServerUrl: "https://matiz.remotemonster.com:2001/topics"
  },
  {
    type: "jaguar",
    wsurl: "wss://jaguar.remotemonster.com/ws",
    resturl: "https://jaguar.remotemonster.com/rest",
    logServerUrl: "https://jaguar.remotemonster.com:2001/topics"
  },
  {
    type: "signal",
    wsurl: "wss://signal.remotemonster.com/ws",
    resturl: "https://signal.remotemonster.com/rest",
    logServerUrl: "https://signal.remotemonster.com:2001/topics"
  }
];
let selectedDevice = {
  video: "",
  audio: ""
};
let chid = "";
let devices = {};
let services = {};
let selectedService = "";
let rtc;
let callsFetcher;
let fetchCallsInterval;
let config = {
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
    video: true
  },
  dev: {
    logLevel: "VERBOSE"
  }
};

const listener = {
  onConnect(mChid) {
    $("#status").textContent = `WAIT - ${mChid}`;
    toggleBtn(false);
    [{ config }, { devices }, { selectedDevice }].forEach(o =>
      Object.entries(o).forEach(([k, v]) => S.save(k)(v))
    );
  },
  onComplete() {
    $("#status").textContent = `${chid}`;
    toggleBtn(false);
  },
  onClose() {
    toggleBtn(true);
    chid = "";
    $("#status").textContent = "";
    $.all(".js-video-info").forEach(el => (el.textContent = ""));
  },
  onError(err) {
    console.error(err);
    toggleBtn(true);
    ["selectedSDK", "devices", "selectedDevice", "config", "server"].forEach(
      x => S.remove(x)
    );
  }
};

const cachedOptionTpl = (value, text = value) =>
  `<option value="${value}" data-cached>${text}</option>`;

document.addEventListener("DOMContentLoaded", ev => {
  S.isExist("selectedSDK") &&
    (cachedOptionTpl(
      S("selectedSDK"),
      S("selectedSDK") === "local" ? "Local Dev SDK" : S("selectedSDK")
    ),
    $.emit("change")($("#sdkSel")));

  [$("#serverSel")].forEach(el => {
    P.get("server")
      ? ((el.innerHTML = cachedOptionTpl(P.get("server"))),
        $.emit("change")(el))
      : S.isExist("server")
      ? ((el.innerHTML = cachedOptionTpl(S("server"))), $.emit("change")(el))
      : console.log("app/server/default");
  });

  S.isExist("devices") && (devices = S("devices"));
  S.isExist("selectedDevice") && (selectedDevice = S("selectedDevice"));
  [...$.all(".js-device-sel")].forEach(
    el =>
      _.isEmpty(selectedDevice[el.dataset.kind].deviceId) ||
      ((el.innerHTML = cachedOptionTpl(
        selectedDevice[el.dataset.kind].deviceId,
        devices
          .filter(x => x.deviceId === selectedDevice[el.dataset.kind].deviceId)
          .reduce((acc, cur) => acc + cur.label, "")
      )),
      (el.selectedIndex = 0),
      $.emit("change")(el))
  );

  S.isExist("config") && (config = S("config"));
  $("#widthInput").value = _.path("media.video.width.exact")(config) || "";
  $("#heightInput").value = _.path("media.video.height.exact")(config) || "";
  _.isEmpty(config.media.video.codec) ||
    [$("#videoCodecSel")].forEach(
      el => (el.innerHTML = cachedOptionTpl(config.media.video.codec)),
      (el.selectedIndex = 0),
      $.emit("change")(el)
    );
  $("#maxFrameRateInput").value =
    _.path("media.video.frameRate.max")(config) || "";
  $("#maxBitrateInput").value = _.path("media.video.maxBitrate")(config) || "";

  $.all(".js-audio-config").forEach(el =>
    _.isEmpty(config.media.audio[el.dataset.configKey])
      ? (el.indeterminate = true)
      : config.media.audio[el.dataset.configKey]
      ? (el.checked = true)
      : (el.checked = false)
  );
  $.all(".js-rtc-config").forEach(el =>
    _.isEmpty((config.rtc || {})[el.dataset.configKey])
      ? (el.indeterminate = true)
      : config.rtc[el.dataset.configKey]
      ? (el.checked = true)
      : (el.checked = false)
  );

  $("#defaultServiceKeyInput").value =
    "e3ee6933a7c88446ba196b2c6eeca6762c3fdceaa6019f03";
  $("#defaultServiceIdInput").value = "simpleapp";
  ![P.get("serviceId"), P.get("key")].every(_.isEmpty)
    ? ((config.credential.serviceId = P.get("serviceId")),
      (config.credential.key = P.get("key")))
    : S.isExist("services")
    ? ((services = S("services")),
      Object.entries(services).forEach(([k, v]) => {
        $(`#services`).appendChild(serviceHtml(k));
        $(`.js-service[data-id="${k}"] .js-service-id`).value = v.id;
        $(`.js-service[data-id="${k}"] .js-service-key`).value = v.key;
      }),
      Object.entries(services)
        .filter(([k, v]) => v.id === config.credential.serviceId)
        .forEach(
          ([k, v]) =>
            ($(
              `.js-service[data-id="${k}"] input[name="service"][type="radio"]`
            ).checked = true)
        ))
    : console.log("app/service/default");

  fetchCalls();
  [[P.get("chid"), $("#connectBtn")]].forEach(
    ([chid, el]) => _.isEmpty(chid) || ((el.value = chid), $.emit("click")(el))
  );
});

$.all(".js-close-btn").forEach(el =>
  el.addEventListener("click", ev => {
    console.log("app/close");
    rtc.close();
    rtc = null;
    ev.preventDefault();
  })
);

$.all(".js-connect-btn").forEach(el =>
  el.addEventListener("click", ev => {
    console.log("app/connect");
    connectCall($("#chidInput").value);
    ev.preventDefault();
  })
);

$.all(".js-device-sel").forEach(el =>
  el.addEventListener("focus", async ev => {
    _.isEmpty(devices) && (await getDevices());
    ev.target.options[0].dataset.cached !== undefined &&
      (ev.target.innerHTML = `<option value="">Choose...</option>`);
    ev.target.length === 1 &&
      devices
        .filter(x => x.kind === `${ev.target.dataset.kind}input`)
        .forEach(x => {
          ev.target.appendChild(
            $.html(`<option value="${x.deviceId}">${x.label}</option>`)
          );
        });
  })
);

$.all(".js-device-sel").forEach(el =>
  el.addEventListener("change", async ev => {
    _.isEmpty(ev.target.value)
      ? ((selectedDevice[ev.target.dataset.kind] = {}),
        delete config.media[ev.target.dataset.kind].deviceId,
        ($(`#${ev.target.dataset.info}`).innerHTML = ""),
        ev.target.dataset.kind === "video" &&
          [
            $("#widthInput"),
            $("#heightInput"),
            $("#maxFrameRateInput")
          ].forEach(el => {
            el.min = "";
            el.max = "";
            $.emit("input")(el);
          }))
      : ((selectedDevice[ev.target.dataset.kind] = await getDeviceCapabilities(
          ev.target.dataset.kind,
          ev.target.value
        )),
        config.media[ev.target.dataset.kind] === true &&
          (config.media[ev.target.dataset.kind] = {}),
        (config.media[ev.target.dataset.kind].deviceId =
          selectedDevice[ev.target.dataset.kind].deviceId),
        ev.target.dataset.kind === "video" &&
          [
            $("#widthInput"),
            $("#heightInput"),
            $("#maxFrameRateInput")
          ].forEach(el => {
            el.min = selectedDevice.video[el.dataset.meta].min;
            el.max = selectedDevice.video[el.dataset.meta].max;
            $.emit("input")(el);
          }),
        ($(`#${ev.target.dataset.info}`).innerHTML = JSON.stringify(
          _.omit("deviceId", "groupId")(selectedDevice[ev.target.dataset.kind])
        )));
  })
);

$("#resSel").addEventListener("focus", ev => {
  const tplToHtml = t =>
    ev.target.appendChild(
      $.html(
        `<option value="${t.value}" data-width="${t.width}" data-height="${
          t.height
        }">
          ${t.label} &nbsp&nbsp ${t.value} &nbsp&nbsp ${t.ratio}
        </option>`
      )
    );
  ev.target.length === 1 &&
    (_.isEmpty(selectedDevice.video)
      ? resolutions.forEach(t => tplToHtml(t))
      : getSupportedResolution(selectedDevice.video)(resolutions).forEach(t =>
          tplToHtml(t)
        ));
});

$("#resSel").addEventListener("change", ev => {
  _.isEmpty(ev.target.value)
    ? [$("#widthInput"), $("#heightInput")].forEach(el => {
        el.value = "";
        $.emit("input")(el);
      })
    : [$("#widthInput"), $("#heightInput")].forEach(el => {
        el.value =
          ev.target.options[ev.target.selectedIndex].dataset[el.dataset.meta];
        $.emit("input")(el);
      });
});

[$("#widthInput"), $("#heightInput"), $("#maxFrameRateInput")].forEach(el =>
  el.addEventListener("input", ev => {
    if (!$("#cameraCheckbox").checked) return;
    _.isEmpty(ev.target.value)
      ? (delete config.media.video[ev.target.dataset.meta],
        ev.target.classList.remove("is-invalid"))
      : (!_.isEmpty(ev.target.min && ev.target.max) &&
          (Number(ev.target.value) >= Number(ev.target.min) &&
          Number(ev.target.value) <= Number(ev.target.max)
            ? ev.target.classList.remove("is-invalid")
            : ev.target.classList.add("is-invalid")),
        config.media.video === true && (config.media.video = {}),
        Object.assign(
          config.media.video,
          _.oCreatePath(ev.target.dataset.configKey.split("."), ev.target.value)
        ));
  })
);

$("#maxBitrateInput").addEventListener("input", ev => {
  if (!$("#cameraCheckbox").checked) return;
  _.isEmpty(ev.target.value)
    ? delete config.media.video.maxBitrate
    : (config.media.video === true && (config.media.video = {}),
      Object.assign(config.media.video, { maxBitrate: ev.target.value }));
});

$("#videoCodecSel").addEventListener("change", ev => {
  if (!$("#cameraCheckbox").checked) return;
  _.isEmpty(ev.target.value)
    ? delete config.media.video.codec
    : (config.media.video === true && (config.media.video = {}),
      Object.assign(config.media.video, { codec: ev.target.value }));
});

$("#videoCodecSel").addEventListener("focus", ev => {
  ev.target.options[0].dataset.cached !== undefined &&
    (ev.target.innerHTML = `<option value="">Choose...</option>`);
  ev.target.length === 1 &&
    codecs.forEach(x => {
      ev.target.appendChild($.html(`<option value="${x}">${x}</option>`));
    });
});

const rotateStateCheckbox = ev =>
  ev.target.readOnly
    ? (ev.target.checked = ev.target.readOnly = false)
    : !ev.target.checked &&
      (ev.target.readOnly = ev.target.indeterminate = true);

$.all(".js-rtc-config").forEach(el =>
  el.addEventListener("click", rotateStateCheckbox)
);
$.all(".js-audio-config").forEach(el =>
  el.addEventListener("click", rotateStateCheckbox)
);

$.all(".js-rtc-config").forEach(el =>
  el.addEventListener("change", ev =>
    ev.target.indeterminate
      ? delete config.rtc[ev.target.dataset.configKey]
      : ev.target.checked
      ? ((config.rtc || (config.rtc = {}))[ev.target.dataset.configKey] = true)
      : ((config.rtc || (config.rtc = {}))[ev.target.dataset.configKey] = false)
  )
);

$.all(".js-audio-config").forEach(el =>
  el.addEventListener("change", ev =>
    ev.target.indeterminate
      ? delete config.media.audio[ev.target.dataset.configKey]
      : ev.target.checked
      ? (config.media.audio === true && (config.media.audio = {}),
        Object.assign(config.media.audio, {
          [ev.target.dataset.configKey]: true
        }))
      : (config.media.audio === true && (config.media.audio = {}),
        Object.assign(config.media.audio, {
          [ev.target.dataset.configKey]: false
        }))
  )
);

$("#cameraCheckbox").addEventListener("change", ev =>
  !ev.target.checked
    ? ((config.media.video = false),
      $.all(".js-video-config").forEach(el => (el.value = "")))
    : [...$.all(".js-video-config"), ...$("#cameraSel")]
        .map(el => _.isEmpty(el.value))
        .every(x => x === true)
    ? (config.media.video = true)
    : ((config.media.video = {
        width: { exact: $("#widthInput").value },
        height: { exact: $("#heightInput").value },
        codec: $("#videoCodecSel").value,
        frameRate: { max: $("#maxFrameRateInput").value },
        maxBitrate: maxBitrateInput.value,
        deviceId: $("#cameraSel").value
      }),
      $.all(".js-video-config").forEach(el => {
        el.tagName === "INPUT" && $.emit("input")(el);
        el.tagName === "SELECT" && $.emit("change")(el);
      }))
);

$("#micCheckbox").addEventListener("change", ev =>
  !ev.target.checked
    ? ((config.media.audio = false),
      $.all(".js-audio-config").forEach(el => {
        el.checked = false;
        el.indeterminate = true;
      }))
    : [...$.all(".js-audio-config")]
        .map(el => el.indeterminate)
        .every(x => x === true)
    ? (config.media.audio = true)
    : ((config.media.audio = {
        autoGainControl: $("#autoGainControlCheckbox").checked,
        echoCancellation: $("#echoCancellationCheckbox").checked,
        noiseSuppression: $("#noiseSuppressionCheckbox").checked,
        deviceId: $("#micSel").value
      }),
      [$("#micSel")].forEach(el => {
        el.tagName === "INPUT" && $.emit("input")(el);
        el.tagName === "SELECT" && $.emit("change")(el);
      }))
);

$.all("video").forEach(el =>
  el.addEventListener(
    "loadedmetadata",
    ev =>
      ($(`#${el.id}Info`).textContent =
        !_.isEmpty(el.srcObject) &&
        JSON.stringify(
          el.srcObject.getTracks().map(t => ({
            kind: t.kind,
            enabled: t.enabled,
            label: t.label,
            readyState: t.readyState,
            constraints: _.omit("deviceId", "groupId")(t.getConstraints()),
            settings: _.omit("deviceId", "groupId")(t.getSettings())
          }))
        ))
  )
);

$("#sdkSel").addEventListener("focus", ev => {
  ev.target.innerHTML = `<option value="">Choose...</option>`;
  (location.hostname === "localhost" || location.hostname === "127.0.0.1") &&
    ev.target.appendChild(
      $.html(`<option value="local">Local Dev SDK</option>`)
    );
  fetchSDKVersions()
    .then(x =>
      x.forEach(x => {
        ev.target.appendChild($.html(`<option value="${x}">${x}</option>`));
      })
    )
    .catch(err => console.error("app/fetchSDKVersions", err));
});

$("#sdkSel").addEventListener("change", ev => {
  clearFetchCalls();
  !!Remon && (Remon = null);
  $.all("script[data-loaded]").forEach(el => el.remove());
  ev.target.value === "local"
    ? loadSDK(`/remon.js`)
        .then(r => S.save("selectedSDK")(ev.target.value))
        .catch(err => console.error("app/loadSDK/local", err))
    : loadSDK(
        `https://cdn.jsdelivr.net/npm/@remotemonster/sdk@${
          ev.target.value
        }/remon.min.js`
      )
        .then(r => S.save("selectedSDK")(ev.target.value))
        .catch(err => console.error("app/loadSDK", err));
});

$("#serverSel").addEventListener("focus", ev => {
  ev.target.length === 1 &&
    (P.delete("server"),
    (ev.target.innerHTML = `<option value="">Choose...</option>`),
    servers.forEach(x =>
      ev.target.appendChild(
        $.html(`<option value="${x.type}">${x.type}</option>`)
      )
    ));
});

$("#serverSel").addEventListener("change", ev => {
  const setServer = key => {
    config.credential.wsurl = servers
      .filter(x => x.type === key)
      .reduce((acc, cur) => cur.wsurl, "");
    config.credential.resturl = servers
      .filter(x => x.type === key)
      .reduce((acc, cur) => cur.resturl, "");
    (config.logServer || (config.logServer = {})).url = servers
      .filter(x => x.type === key)
      .reduce((acc, cur) => cur.logServerUrl, "");
    S.save("server")(key);
  };
  clearFetchCalls();
  _.isEmpty(ev.target.value)
    ? (delete config.credential.wsurl,
      delete config.credential.resturl,
      delete config.logServer,
      P.delete("server"),
      S.remove("server"))
    : (servers.map(x => x.type).includes(ev.target.value) &&
        setServer(ev.target.value),
      P.set("server", ev.target.value));
  fetchCalls();
});

$("#clearCacheBtn").addEventListener("click", ev => {
  clearCache();
  ev.preventDefault();
});

const serviceHtml = id =>
  $.html(`
  <li class="input-group input-group-sm my-1 js-service" data-id="${id}">
    <div class="input-group-prepend">
      <div class="input-group-text">
        <input name="service" type="radio">
      </div>
      <span class="input-group-text">Id | Key</span>
    </div>
    <input type="text" class="form-control js-service-id">
    <input type="text" class="form-control js-service-key">
    <div class="input-group-append">
      <button class="btn btn-secondary js-remove-service-btn" type="button" id="button-addon2">X</button>
    </div>
  </li>
`);

$("#serviceConfig").addEventListener("click", ev => {
  ev.target === $(`#serviceAddBtn`) &&
    [Date.now()].forEach(x => {
      $(`#services`).appendChild(serviceHtml(x));
      services[x] = { id: "", key: "" };
    });
  [...ev.currentTarget.querySelectorAll(`.js-remove-service-btn`)].includes(
    ev.target
  ) &&
    (delete services[ev.target.closest(".js-service").dataset.id],
    ev.target.closest(`.js-service`).remove(),
    S.save(`services`)(services));
  [
    ...ev.currentTarget.querySelectorAll(`input[name="service"][type="radio"]`)
  ].includes(ev.target) &&
    ((config.credential.key = ev.target
      .closest(`.js-service`)
      .querySelector(`.js-service-key`).value),
    (config.credential.serviceId = ev.target
      .closest(`.js-service`)
      .querySelector(`.js-service-id`).value),
    clearFetchCalls(),
    fetchCalls(),
    P.set("serviceId", config.credential.serviceId),
    P.set("key", config.credential.key),
    S.save("config")(config));
});

$("#serviceConfig").addEventListener("input", ev => {
  [...$.all(`.js-service-key`)].includes(ev.target) &&
    ((services[ev.target.closest(".js-service").dataset.id].key =
      ev.target.value),
    S.save(`services`)(services));
  [...$.all(`.js-service-id`)].includes(ev.target) &&
    ((services[ev.target.closest(".js-service").dataset.id].id =
      ev.target.value),
    S.save(`services`)(services));
});

function connectCall(mChid) {
  chid = mChid;
  rtc = new Remon({ config, listener });
  rtc.connectCall(chid);
}

async function getDevices() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    devices = await navigator.mediaDevices.enumerateDevices();
    console.log("app/getDevices", devices);
    mediaStream.getTracks().forEach(track => track.stop());
  } catch (err) {
    console.error("app/getDevices", err, err.name, err.message);
  }
}

async function getDeviceCapabilities(kind, deviceId) {
  const videoConstraints = {
    audio: false,
    video: {
      deviceId: deviceId ? { exact: deviceId } : undefined
    }
  };

  const audioConstraints = {
    audio: {
      deviceId: deviceId ? { exact: deviceId } : undefined
    },
    video: false
  };

  let constraints = !kind
    ? undefined
    : kind === "audio"
    ? audioConstraints
    : kind === "video"
    ? videoConstraints
    : new Error(`app/getDeviceCapabilities/unexpected_args/${kind}`);

  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    let capa;
    mediaStream.getTracks().forEach(track => {
      capa = track.getCapabilities();
      track.stop();
    });
    console.log("app/getDeviceCapabilities/constraints", capa, constraints);
    return capa;
  } catch (err) {
    console.error("app/getDeviceCapabilities", err);
  }
}

function getSupportedResolution(capabilitie) {
  return template =>
    template.filter(
      x =>
        x.width <= capabilitie.width.max &&
        x.width >= capabilitie.width.min &&
        x.height <= capabilitie.height.max &&
        x.height >= capabilitie.height.min
    );
}

function toggleBtn(isConnect) {
  isConnect
    ? ($.all(".js-connect-btn").forEach(el => (el.disabled = false)),
      $.all(".js-close-btn").forEach(el => (el.disabled = true)))
    : ($.all(".js-connect-btn").forEach(el => (el.disabled = true)),
      $.all(".js-close-btn").forEach(el => (el.disabled = false)));
}

function clearCache() {
  [
    "selectedSDK",
    "devices",
    "selectedDevice",
    "config",
    "server",
    "services",
    "selectedService"
  ].forEach(x => S.remove(x));
}

function fetchSDKVersions() {
  return fetch(
    `https://api.allorigins.ml/get?url=${encodeURIComponent(
      "https://registry.npmjs.org/@remotemonster/sdk"
    )}`
  )
    .then(r => r.ok && r.json())
    .then(r => JSON.parse(r.contents).versions)
    .then(r =>
      Object.keys(r).filter(
        x => Number(x.charAt(0) > 1) && Number(x.charAt(2) > 1)
      )
    )
    .catch(err => console.error("app/getSDKVersions", err));
}

function loadSDK(url) {
  return new Promise((resolve, reject) => {
    const sdk = document.createElement("script");
    sdk.src = url;
    sdk.dataset.loaded = "";
    sdk.addEventListener("load", () => {
      console.log("app/loadSDK", sdk.src);
      resolve();
    });
    sdk.addEventListener("error", () => reject(new Error("app/loadSDK")));
    document.head.appendChild(sdk);
  });
}

function clearFetchCalls() {
  !!fetchCallsInterval && clearInterval(fetchCallsInterval);
  !!callsFetcher && (callsFetcher.close(), (callsFetcher = null));
  console.log("app/clearFetchCalls");
}

function fetchCalls() {
  callsFetcher = new Remon({
    config: {
      credential: config.credential,
      media: {
        audio: true,
        video: false
      },
      dev: {
        logLevel: "ERROR"
      },
      logServer: config.logServer
    }
  });
  console.log(
    "app/fetchCalls",
    callsFetcher.version,
    callsFetcher.config.credential
  );

  fetchCallsInterval = setInterval(async () => {
    try {
      const calls = await callsFetcher.fetchCalls();
      $("#channels").innerHTML = "";
      calls
        .filter(call => {
          return call.status === "WAIT" && chid.trim() != call.id.trim();
        })
        .forEach(call => {
          $("#channels").innerHTML += `
        <li class="list-group-item" onClick="javascript:connectCall('${
          call.id
        }')">
          ${call.id}
        </li>
        `;
        });
    } catch (err) {
      console.error("app>fetchCalls", err);
    }
  }, 3000);
}
