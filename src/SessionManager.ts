export class SessionManager {
  private listeners: Listeners = new Map();

  private static instance: SessionManager;
  private warningTimeoutId?: number;
  private logoutTimeoutId?: number;
  private bcPost: BroadcastChannel;
  private bcReceive: BroadcastChannel;

  public secondsToLogout: number = 100;
  public secondsToWarning: number = 5;
  public isRaisedModal: boolean = false;
  public warningLocalKey: string = "timeToRaiseWarning";
  public logoutLocalKey: string = "timeToLogout";
  public tabIdKey: string = "tabId";
  public broadcastChannelName: string = "session-manager";
  private constructor(Config?: SessionManagerConfig) {
    this.setConfig(Config);
   
    this.bcPost = new BroadcastChannel(this.broadcastChannelName);
    this.bcReceive = new BroadcastChannel(this.broadcastChannelName);
    this.init();
  }

  public subscribe(event: AllowedEvents, callback: PubTypeFn<DeclaredEvents>) {
    const eventListeners = (!this.listeners.has(event) ? this.listeners.set(event, new Map()) : this.listeners.get(event)) as Listener;
    if (eventListeners && !eventListeners.has(callback)) {
      eventListeners.set(callback, callback);
    }
  }
  public unsubscribe(event: AllowedEvents, callback: PubTypeFn<DeclaredEvents>) {
    if (this.listeners.has(event)) {
      const eventListeners = (this.listeners.get(event)) as Listener;
      if (eventListeners.has(callback)) {
        eventListeners.delete(callback);
      }
    }
  }
  public emit(event: AllowedEvents, data?: DeclaredEvents[AllowedEvents]) {
    if (this.listeners.has(event)) {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        for (const callback of eventListeners.values()) {
          callback(data);
        }
      }
    }
  }
  public setConfig(Config: SessionManagerConfig | undefined) {
    this.warningLocalKey = Config?.warningLocalKey ?? this.warningLocalKey;
    this.logoutLocalKey = Config?.logoutLocalKey ?? this.logoutLocalKey;
    this.tabIdKey = Config?.tabIdKey ?? this.tabIdKey;
    this.broadcastChannelName = Config?.broadcastChannelName ?? this.broadcastChannelName;
    this.isRaisedModal = Config?.isRaisedModal ?? this.isRaisedModal;
    this.secondsToLogout = Config?.secondsToLogout ?? this.secondsToLogout;
    this.secondsToWarning = Config?.secondsToWarning ?? this.secondsToWarning;
    if (this.secondsToLogout / this.secondsToWarning <= 2) {
      throw new TypeError("Seconds of logout must me at least double than warning and take in consideration that token duration must be less than warning to be effective");
    }
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }
  private secondsToMilisecs(secs: number) {
    return secs * 1000;
  }

  init() {
    this.bcReceive.onmessage = (event) => {
      if (event.data == "reset-iddle-time") {
        this.resetIdleTime.bind(this)();
      }
    };
    this.bcPost.postMessage("reset-iddle-time");
  }
  resetIdleTime() {
    console.log("reset:idle");
    if (this.isRaisedModal) {
      this.emit(AllowedEvents.closeWarning);
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      delete this.warningTimeoutId;
    }
    if (this.logoutTimeoutId) {
      clearTimeout(this.logoutTimeoutId);
      delete this.logoutTimeoutId;
    }
    this.updateTimeStampToRaiseWarning();
    this.updateTimeStampToLogout();
  }
  updateTimeStampToRaiseWarning() {
    const SessionRMT = new Date().getTime() + this.secondsToMilisecs(this.secondsToWarning);
    localStorage.setItem(this.warningLocalKey, String(SessionRMT));
    this.warningTimeoutId = this.startWarningTimeout();
  }
  updateTimeStampToLogout() {
    const SessionET = new Date().getTime() + this.secondsToMilisecs(this.secondsToLogout);
    localStorage.setItem(this.logoutLocalKey, String(SessionET));
    this.logoutTimeoutId = this.startLogoutTimeout();
  }

  getTimeToRaiseWarning() {
    const timeStampToRaiseWarning = Number(localStorage.getItem(this.warningLocalKey));
    return timeStampToRaiseWarning - new Date().getTime();
  }
  getTimeToLogout() {
    const timeStampToLogout = Number(localStorage.getItem(this.warningLocalKey));

    return timeStampToLogout - new Date().getTime();
  }
  startWarningTimeout() {
    return setTimeout(this.raiseWarning, this.getTimeToRaiseWarning(), this);
  }
  startLogoutTimeout() {
    return setTimeout(this.logOut, this.getTimeToLogout(), this);
  }

  raiseWarning(that: SessionManager) {
    that.isRaisedModal = true;
    that.emit(AllowedEvents.openWarning, {
      time: Math.round(that.getTimeToLogout() / 1000)
    });
  }
  logOut(that: SessionManager) {
    clearTimeout(that.logoutTimeoutId);
    localStorage.clear();
    that.emit(AllowedEvents.logout, {
      logout: true
    });
  }
}