// @flow
import logger from '../../logger'
// import * as KBFSGen from '../kbfs-gen'
// import * as FsGen from '../fs-gen'
import * as LoginGen from '../login-gen'
import * as ConfigGen from '../config-gen'
import * as TeamsGen from '../teams-gen'
import * as Constants from '../../constants/config'
import * as GregorCreators from '../gregor'
import * as NotificationsGen from '../notifications-gen'
import * as RPCTypes from '../../constants/types/rpc-gen'
import * as Saga from '../../util/saga'
import * as PinentryGen from '../pinentry-gen'
import * as PlatformSpecific from '../platform-specific'
import avatarSaga from './avatar'
import engine from '../../engine'
// import {checkRPCOwnership} from '../../engine/index.platform'
import {createGetPeopleData} from '../people-gen'
import {defaultNumFollowSuggestions} from '../../constants/people'
// import {isMobile} from '../../constants/platform'
import {type AsyncAction} from '../../constants/types/flux'
import {type TypedState} from '../../constants/reducer'
// TODO convert to sagas

// isMobile &&
// module.hot &&
// module.hot.accept(() => {
// logger.info('accepted update in actions/config')
// })

// Must be an action which returns a promise so put.resolve continues to wait and work
// TODO could change this to use Take and make it 2 steps instead of using put.resolve()
// const getExtendedStatus = (): AsyncAction => dispatch => {
// return new Promise((resolve, reject) => {
// RPCTypes.configGetExtendedStatusRpcPromise()
// .then(extendedConfig => {
// dispatch(ConfigGen.createExtendedConfigLoaded({extendedConfig}))
// resolve(extendedConfig)
// })
// .catch(error => {
// reject(error)
// })
// })
// }

const registerListeners = (): AsyncAction => dispatch => {
  dispatch(GregorCreators.listenForNativeReachabilityEvents)
  // TODO: DESKTOP-6661 - Refactor `registerReachability` out of `actions/config.js`
  dispatch(GregorCreators.registerReachability())
  dispatch(PinentryGen.createRegisterPinentryListener())
}

// const _retryBootstrap = () =>
// Saga.sequentially([Saga.put(ConfigGen.createBootstrapRetry()), Saga.put(ConfigGen.createBootstrap({}))])

// TODO: It's unfortunate that we have these globals. Ideally,
// bootstrap would be a method on an object.
// let bootstrapSetup = false
// let didInitialNav = false

// we need to reset this if you log out, else we won't get configured accounts.
// This is a MESS, so i'm going to clean it up soon
// const clearDidInitialNav = () => {
// didInitialNav = false
// }

// Until bootstrap is sagaized
// function _bootstrap({payload}: ConfigGen.BootstrapPayload) {
// return Saga.put(bootstrap(payload))
// }

// const bootstrap = (opts: $PropertyType<ConfigGen.BootstrapPayload, 'payload'>): AsyncAction => (
// dispatch,
// getState
// ) => {
// const readyForBootstrap = getState().config.readyForBootstrap
// if (!readyForBootstrap) {
// logger.warn('Not ready for bootstrap/connect')
// return
// }

// if (!bootstrapSetup) {
// // bootstrapSetup = true
// // logger.info('[bootstrap] registered bootstrap')
// // engine().listenOnConnect('bootstrap', () => {
// // dispatch(ConfigGen.createDaemonError({daemonError: null}))
// // logger.info('[bootstrap] bootstrapping on connect')
// // dispatch(ConfigGen.createBootstrap({}))
// // // This calls rpc and so must wait for bootstrap
// // GregorCreators.registerGregorListeners()
// // })
// // dispatch(registerListeners())
// } else {
// logger.info('[bootstrap] performing bootstrap...', opts, didInitialNav)
// Promise.all([
// // dispatch(getBootstrapStatus()),
// // checkRPCOwnership(),
// // dispatch(waitForKBFS()),
// // dispatch(KBFSGen.createFuseStatus()),
// // dispatch(FsGen.createFuseStatus()),
// // dispatch(ConfigGen.createLoadConfig({logVersion: true})),
// ])
// .then(() => {
// dispatch(ConfigGen.createBootstrapSuccess())
// // engine().listenOnDisconnect('daemonError', () => {
// // dispatch(ConfigGen.createDaemonError({daemonError: new Error('Disconnected')}))
// // logger.flush()
// // })
// dispatch(NotificationsGen.createListenForKBFSNotifications())
// if (!didInitialNav) {
// dispatch(async () => {
// if (getState().config.loggedIn) {
// dispatch(LoginGen.createNavBasedOnLoginAndInitialState())
// // TODO move these to a bootstrapSuccess handler
// didInitialNav = true
// // If we're logged in, restore any saved route state and
// // then nav again based on it.
// // load people tab info on startup as well
// // also load the teamlist for auxiliary information around the app
// await dispatch(TeamsGen.createGetTeams())
// await dispatch(
// createGetPeopleData({
// markViewed: false,
// numFollowSuggestionsWanted: defaultNumFollowSuggestions,
// })
// )
// }
// })
// }
// })
// .catch(error => {
// logger.warn('[bootstrap] error bootstrapping: ', error)
// const triesRemaining = getState().config.bootstrapTriesRemaining
// dispatch(ConfigGen.createBootstrapAttemptFailed())
// if (triesRemaining > 0) {
// const retryDelay = Constants.bootstrapRetryDelay / triesRemaining
// logger.info(`[bootstrap] resetting engine in ${retryDelay / 1000}s (${triesRemaining} tries left)`)
// setTimeout(() => engine().reset(), retryDelay)
// } else {
// logger.error('[bootstrap] exhausted bootstrap retries')
// dispatch(ConfigGen.createBootstrapFailed())
// }
// logger.flush()
// })
// }
// }

// const getConfigOnce = (state: TypedState) =>

const setupEngineListeners = () => {
  engine().actionOnDisconnect('daemonError', () => {
    logger.flush()
    return ConfigGen.createDaemonError({daemonError: new Error('Disconnected')})
  })
  engine().actionOnConnect('handshake', () => ConfigGen.createStartHandshake())
}

// Only do this once
const rpcGetConfig = (state: TypedState, action: ConfigGen.DaemonHandshakePayload) =>
  !state.config.version &&
  Saga.sequentially([
    Saga.put(ConfigGen.createDaemonHandshakeWait({increment: true, name: 'config.version'})),
    Saga.call(function*() {
      const loadedAction = yield RPCTypes.configGetConfigRpcPromise().then((config: RPCTypes.Config) => {
        logger.info(`Keybase version: ${config.version}`)
        return ConfigGen.createConfigLoaded({
          version: config.version,
          versionShort: config.versionShort,
        })
      })
      yield Saga.put(loadedAction)
    }),
    Saga.put(ConfigGen.createDaemonHandshakeWait({increment: false, name: 'config.version'})),
  ])

const rpcGetBootstrapStatus = (state: TypedState, action: ConfigGen.DaemonHandshakePayload) =>
  Saga.sequentially([
    Saga.put(ConfigGen.createDaemonHandshakeWait({increment: true, name: 'config.getBootstrapStatus'})),
    Saga.call(function*() {
      const loadedAction = yield RPCTypes.configGetBootstrapStatusRpcPromise().then(
        (s: RPCTypes.BootstrapStatus) =>
          ConfigGen.createBootstrapStatusLoaded({
            deviceID: s.deviceID,
            deviceName: s.deviceName,
            followers: s.followers || [],
            following: s.following || [],
            loggedIn: s.loggedIn,
            registered: s.registered,
            uid: s.uid,
            username: s.username,
          })
      )
      yield Saga.put(loadedAction)
    }),
    Saga.put(ConfigGen.createDaemonHandshakeWait({increment: false, name: 'config.getBootstrapStatus'})),
  ])

let dispatchSetupEngineListenersOnce = false
const dispatchSetupEngineListeners = () => {
  if (dispatchSetupEngineListenersOnce) {
    return
  }
  dispatchSetupEngineListenersOnce = true
  return Saga.put(ConfigGen.createSetupEngineListeners())
}

let createDaemonHandshakeOnce = false
const startHandshake = () => {
  const firstTimeConnecting = !createDaemonHandshakeOnce
  createDaemonHandshakeOnce = true
  return Saga.put(ConfigGen.createDaemonHandshake({firstTimeConnecting}))
}

const maybeDoneWithDaemonHandshake = (state: TypedState) =>
  state.config.daemonHandshakeWaiters.size === 0 && Saga.put(ConfigGen.createDaemonHandshakeDone())

function* configSaga(): Saga.SagaGenerator<any, any> {
  yield Saga.actionToAction(ConfigGen.installerRan, dispatchSetupEngineListeners)
  yield Saga.actionToAction(ConfigGen.startHandshake, startHandshake)
  yield Saga.actionToAction(ConfigGen.daemonHandshakeWait, maybeDoneWithDaemonHandshake)
  yield Saga.actionToAction(ConfigGen.daemonHandshake, rpcGetConfig)
  yield Saga.actionToAction(ConfigGen.daemonHandshake, rpcGetBootstrapStatus)

  yield Saga.actionToAction(ConfigGen.setupEngineListeners, setupEngineListeners)

  // yield Saga.safeTakeEveryPure(LoginGen.logout, clearDidInitialNav)
  // yield Saga.safeTakeEveryPure(ConfigGen.bootstrap, _bootstrap)
  // yield Saga.safeTakeEveryPure(ConfigGen.retryBootstrap, _retryBootstrap)
  // yield Saga.actionToPromise(ConfigGen.loadConfig, getConfig)

  yield Saga.fork(PlatformSpecific.platformConfigSaga)
  yield Saga.fork(avatarSaga)
}

// export {getExtendedStatus}
export default configSaga
