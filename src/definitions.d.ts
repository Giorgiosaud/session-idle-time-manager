type configurableSettings="secondsToLogout"|"secondsToWarning"|"broadcastChannelName"|"isRaisedModal"|"warningLocalKey"|"tabIdKey"|"logoutLocalKey";

type SessionManagerConfig = Pick<SessionManager,configurableSettings>;

enum AllowedEvents {
  openWarning = "open-warning",
  closeWarning = "close-warning",
  logout = "logout"
}

interface DeclaredEvents{
  [AllowedEvents.openWarning]:{time:number},
  [AllowedEvents.closeWarning]:undefined,
  [AllowedEvents.logout]:{logout:boolean}
}

type PubTypeFn<T> = <Key extends keyof T>(
  data: T[Key],
  ) => void

  
type Listeners=Map<string,Listener>

type Listener=Map<PubTypeFn<DeclaredEvents>,PubTypeFn<DeclaredEvents>>

