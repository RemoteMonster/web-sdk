## [2.5.2](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.5.1...v2.5.2) (2019-10-30)


### Bug Fixes

* **url:** signalurl bug ([d4997b4](https://github.com/RemoteMonster/remon-web-sdk/commit/d4997b4))



## [2.5.2](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.5.1...v2.5.2) (2019-10-30)


### Bug Fixes

* **url:** signalurl bug ([d4997b4](https://github.com/RemoteMonster/remon-web-sdk/commit/d4997b4))



## [2.5.1](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.5.0...v2.5.1) (2019-10-30)


### Bug Fixes

* **deepcopy:** mediastream is not able to deepcopy ([ca94b6f](https://github.com/RemoteMonster/remon-web-sdk/commit/ca94b6f))



# [2.5.0](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.25...v2.5.0) (2019-10-30)


### Bug Fixes

* **Remon:** change merge method to deepmerge ([96f3c09](https://github.com/RemoteMonster/remon-web-sdk/commit/96f3c09))



## [2.4.25](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.23...v2.4.25) (2019-10-23)


### Features

* **auth:** add token to new auth system ([1104fb9](https://github.com/RemoteMonster/remon-web-sdk/commit/1104fb9))
* **conference:** Add method for conference ([420f586](https://github.com/RemoteMonster/remon-web-sdk/commit/420f586))
* **room:** add searchRoom method ([91d5f88](https://github.com/RemoteMonster/remon-web-sdk/commit/91d5f88))



## [2.4.24](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.23...v2.4.24) (2019-10-23)


### Features

* **auth:** add token to new auth system ([1104fb9](https://github.com/RemoteMonster/remon-web-sdk/commit/1104fb9))
* **conference:** Add method for conference ([420f586](https://github.com/RemoteMonster/remon-web-sdk/commit/420f586))
* **room:** add searchRoom method ([91d5f88](https://github.com/RemoteMonster/remon-web-sdk/commit/91d5f88))



## [2.4.24](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.23...v2.4.24) (2019-10-02)



## [2.4.23](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.22...v2.4.23) (2019-09-26)



## [2.4.21](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.20...v2.4.21) (2019-09-13)


### Bug Fixes

* renew api document ([9044e6c](https://github.com/RemoteMonster/remon-web-sdk/commit/9044e6c))


### Features

* **config:** we now have onlyturnserver-configuration ([b39d8e2](https://github.com/RemoteMonster/remon-web-sdk/commit/b39d8e2))



## [2.4.21](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.20...v2.4.21) (2019-09-13)


### Bug Fixes

* renew api document ([9044e6c](https://github.com/RemoteMonster/remon-web-sdk/commit/9044e6c))


### Features

* **config:** we now have onlyturnserver-configuration ([b39d8e2](https://github.com/RemoteMonster/remon-web-sdk/commit/b39d8e2))



## [2.4.19](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.18...v2.4.19) (2019-08-29)
### Features
- 처음부터 screenCapture할 수 있도록 config에 옵션 추가(screen)

## [2.4.18](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.17...v2.4.18) (2019-08-28)
### Features
- 갑작스런 네트워크 변경에 따른 signal연결에 대해 reconnect event를 호출하게 함
- framerate 2회 연속 0이면 reduce simulcast quality
- add localStream for external video input

## [2.4.16](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.15...v2.4.16) (2019-08-20)
### Features
- v.2.4.16: not use cpuoverusedetection


## [2.4.15](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.14...v2.4.15) (2019-08-15)
### Features
- v2.4.15: support samsung browser
- v2.4.15: add check if latest chrome browser when fetch transceiver


## [2.4.14](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.13...v2.4.14) (2019-08-07)
### Features
- v2.4.14: Add framrate option in captureScreen

## [2.4.13](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.12...v2.4.13) (2019-07-23)

### Features

- **record:** no send record file when url is local ([4b6cca8](https://github.com/RemoteMonster/remon-web-sdk/commit/4b6cca8))

## [2.4.12](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.11...v2.4.12) (2019-07-23)
- v2.4.12: fix bug broken stream at broadcast connected

## [2.4.11](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.10...v2.4.11) (2019-07-22)

### Features

- **SIMULCAST:** add simulcast for caster and viewer ([673af26](https://github.com/RemoteMonster/remon-web-sdk/commit/673af26))

## [2.4.10](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.9...v2.4.10) (2019-07-21)

### Bug Fixes

- **msg:** add channel id in to createChannel msg ([67ef659](https://github.com/RemoteMonster/remon-web-sdk/commit/67ef659))

## [2.4.9](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.8...v2.4.9) (2019-07-16)

### Bug Fixes

- **captureScreen:** fix bug screenCapture when no audio input ([7f6bddc](https://github.com/RemoteMonster/remon-web-sdk/commit/7f6bddc))

## [2.4.8](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.7...v2.4.8) (2019-07-16)

### Features

- **audioDevice:** add setAudioDevice(micId) method ([418c407](https://github.com/RemoteMonster/remon-web-sdk/commit/418c407))

## [2.4.7](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.6...v2.4.7) (2019-07-16)

### Features

- **inputDevice:** add setVideoDevice method ([f7f54c4](https://github.com/RemoteMonster/remon-web-sdk/commit/f7f54c4))

## [2.4.6](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.5...v2.4.6) (2019-07-14)

### Bug Fixes

- **audiomode:** could change audioMode for caster ([c717548](https://github.com/RemoteMonster/remon-web-sdk/commit/c717548))

## [2.4.5](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.4...v2.4.5) (2019-07-14)

### Bug Fixes

- **record:** no record when audio only mode ([8621250](https://github.com/RemoteMonster/remon-web-sdk/commit/8621250))

## [2.4.4](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.3...v2.4.4) (2019-07-11)
### Bug Fixes
- v2.4.4 fix bug on safari

## [2.4.3](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.2...v2.4.3) (2019-07-10)

### Features

- **screenCapture:** add screenCapture method [#23](https://github.com/RemoteMonster/remon-web-sdk/issues/23) ([ff16b41](https://github.com/RemoteMonster/remon-web-sdk/commit/ff16b41))

## [2.4.2](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.1...v2.4.2) (2019-07-10)

### Features

- **stat:** change health with new stat spec ([b59b391](https://github.com/RemoteMonster/remon-web-sdk/commit/b59b391))

## [2.4.1](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.4.0...v2.4.1) (2019-07-10)

# [2.4.0](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.10...v2.4.0) (2019-07-09)

### Bug Fixes

- remove legacy code for mediasoup ([b74348c](https://github.com/RemoteMonster/remon-web-sdk/commit/b74348c))

### Features

- **simulcast:** add rid based simulcast on chrome ([6369cbe](https://github.com/RemoteMonster/remon-web-sdk/commit/6369cbe))

## [2.3.11](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.10...v2.3.11) (2019-07-09)

### Bug Fixes

- remove legacy code for mediasoup ([b74348c](https://github.com/RemoteMonster/remon-web-sdk/commit/b74348c))


## [2.3.10](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.9...v2.3.10) (2019-06-21)
### Features
- v2.3.10: new Record Event

## [2.3.9](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.8...v2.3.9) (2019-06-09)
### Features
- v2.3.9 Recorder: recorder is allow only audio.


## [2.3.7](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.6...v2.3.7) (2019-04-25)

### Bug Fixes

- v2.3.7 fix muteLocalAudio using transceiver

## [2.3.6](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.5...v2.3.6) (2019-03-21)

### Bug Fixes

- v2.3.6 cameraSwith bug ([21bcbd1](https://github.com/RemoteMonster/remon-web-sdk/commit/21bcbd1))

## [2.3.6](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.5...v2.3.6) (2019-03-21)

### Bug Fixes

- v2.3.6 cameraSwith bug ([21bcbd1](https://github.com/RemoteMonster/remon-web-sdk/commit/21bcbd1))

## [2.3.6](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.5...v2.3.6) (2019-03-21)

### Bug Fixes

- v2.3.6 cameraSwith bug ([21bcbd1](https://github.com/RemoteMonster/remon-web-sdk/commit/21bcbd1))

## [2.3.4](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.3...v2.3.4) (2019-03-21)

### Bug Fixes

- switchCamera with config.media config ([5d668df](https://github.com/RemoteMonster/remon-web-sdk/commit/5d668df))


### Bug Fixes

- swtichCamera bug ([4bdd529](https://github.com/RemoteMonster/remon-web-sdk/commit/4bdd529))

## [2.3.2](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.1...v2.3.2) (2019-03-11)

### Bug Fixes

- swtichCamera bug ([4bdd529](https://github.com/RemoteMonster/remon-web-sdk/commit/4bdd529))

## [2.3.1](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.3.0...v2.3.1) (2019-03-06)

### Features

- change to esdoc to jsdoc ([f7fed3c](https://github.com/RemoteMonster/remon-web-sdk/commit/f7fed3c))
- comm example update ([78be097](https://github.com/RemoteMonster/remon-web-sdk/commit/78be097))
- comm example update ([38c943b](https://github.com/RemoteMonster/remon-web-sdk/commit/38c943b))
- comm example update ([21501e4](https://github.com/RemoteMonster/remon-web-sdk/commit/21501e4))
- comm example update ([c3d7c18](https://github.com/RemoteMonster/remon-web-sdk/commit/c3d7c18))
- comm example update ([b9c12f3](https://github.com/RemoteMonster/remon-web-sdk/commit/b9c12f3))
- live example update ([9ed1bfb](https://github.com/RemoteMonster/remon-web-sdk/commit/9ed1bfb))

# [2.3.0](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.2.1...v2.3.0) (2019-01-02)


### Bug Fixes

* **offline:** offline signaling event code is moved to init ([a0c60f7](https://github.com/RemoteMonster/remon-web-sdk/commit/a0c60f7))


### Features

* add unified plan ([91c4cd8](https://github.com/RemoteMonster/remon-web-sdk/commit/91c4cd8))
* add unified plan ([357a520](https://github.com/RemoteMonster/remon-web-sdk/commit/357a520))



## [2.2.2](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.2.1...v2.2.2) (2019-01-02)

### Bug Fixes

- **offline:** offline signaling event code is moved to init ([a0c60f7](https://github.com/RemoteMonster/remon-web-sdk/commit/a0c60f7))

### Features

- add unified plan ([357a520](https://github.com/RemoteMonster/remon-web-sdk/commit/357a520))

<a name="2.2.2"></a>

## [2.2.2](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.2.1...v2.2.2) (2018-10-29)

### Bug Fixes

- **offline:** offline signaling event code is moved to init ([a0c60f7](https://github.com/RemoteMonster/remon-web-sdk/commit/a0c60f7))

<a name="2.2.1"></a>

## [2.2.1](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.2.0...v2.2.1) (2018-10-29)

<a name="2.2.0"></a>

# [2.2.0](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.2.0-beta.0...v2.2.0) (2018-10-29)

### Features

- **reconnect:** add reconnect feature ([3b09d2c](https://github.com/RemoteMonster/remon-web-sdk/commit/3b09d2c))
- add cancel operation to websocket connector ([836656e](https://github.com/RemoteMonster/remon-web-sdk/commit/836656e))

<a name="2.1.3"></a>

## [2.1.3](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.1.2...v2.1.3) (2018-10-22)

### Bug Fixes

- **broadcast:** fix channel type to VIEWER when call the joinCast method ([a859b05](https://github.com/RemoteMonster/remon-web-sdk/commit/a859b05))

<a name="2.1.2"></a>

## [2.1.2](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.1.1-beta.2...v2.1.2) (2018-09-30)

<a name="2.1.0"></a>

# [2.1.0](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.1.0-beta.20...v2.1.0) (2018-09-21)

<a name="2.1.0-beta.14"></a>

# [2.1.0-beta.14](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.1.0-beta.11...v2.1.0-beta.14) (2018-09-20)

### Bug Fixes

- now simulcast config works ([83df7e5](https://github.com/RemoteMonster/remon-web-sdk/commit/83df7e5))
- waiting 4sec for gum from local ([bdca9e8](https://github.com/RemoteMonster/remon-web-sdk/commit/bdca9e8))
- wrong typo property remoteAudioPaketsLost ([d984833](https://github.com/RemoteMonster/remon-web-sdk/commit/d984833))

### Features

- add log server url config option feat ([d80ae8b](https://github.com/RemoteMonster/remon-web-sdk/commit/d80ae8b))
- change log server from matiz to signal for production ([62defab](https://github.com/RemoteMonster/remon-web-sdk/commit/62defab))

<a name="2.1.0-beta.13"></a>

# [2.1.0-beta.13](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.1.0-beta.11...v2.1.0-beta.13) (2018-09-20)

### Bug Fixes

- waiting 4sec for gum from local ([bdca9e8](https://github.com/RemoteMonster/remon-web-sdk/commit/bdca9e8))
- wrong typo property remoteAudioPaketsLost ([d984833](https://github.com/RemoteMonster/remon-web-sdk/commit/d984833))

### Features

- add log server url config option feat ([d80ae8b](https://github.com/RemoteMonster/remon-web-sdk/commit/d80ae8b))
- change log server from matiz to signal for production ([62defab](https://github.com/RemoteMonster/remon-web-sdk/commit/62defab))

<a name="2.1.0-beta.12"></a>

# [2.1.0-beta.12](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.1.0-beta.11...v2.1.0-beta.12) (2018-09-19)

### Bug Fixes

- waiting 4sec for gum from local ([bdca9e8](https://github.com/RemoteMonster/remon-web-sdk/commit/bdca9e8))

<a name="2.1.0-beta.10"></a>

# [2.1.0-beta.10](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.1.0-beta.9...v2.1.0-beta.10) (2018-09-17)

### Features

- add simulcast send to signaling server ([2ad0906](https://github.com/RemoteMonster/remon-web-sdk/commit/2ad0906))

<a name="2.1.0-beta.3"></a>

# [2.1.0-beta.3](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.1.0-beta.2...v2.1.0-beta.3) (2018-09-17)

### Features

- add select video qulity for simulcast ([27d7504](https://github.com/RemoteMonster/remon-web-sdk/commit/27d7504))

<a name="2.0.24"></a>

## [2.0.24](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.0.23...v2.0.24) (2018-08-21)

<a name="2.0.23"></a>

## [2.0.23](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.0.22...v2.0.23) (2018-08-16)

<a name="2.0.21"></a>

## [2.0.21](https://github.com/RemoteMonster/remon-web-sdk/compare/v2.0.20...v2.0.21) (2018-08-10)