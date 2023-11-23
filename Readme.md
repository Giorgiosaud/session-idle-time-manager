# Session Idle Time Manager
this is a solution to manage the warning and logout of the user when the session is idle for a certain time, everithing from th frontend perspective. you only need to define some configurations to make it work and take some considerations, this library is implementated thinking in systems thaat are connected with a SSO and manage all the session at the backend, but doesnt provide a way to manage the session at the frontend, so this is the solution for that.

## Used Js Apis or features
- Broadcast Channel
- Local Storage
- Map

## How to use it
1. Import the library
```javascript
import { SessionIdleTimeManager } from 'session-idle-time-manager';
```
2. Use the singleton instance
```javascript
const sessionIdleTimeManager = SessionIdleTimeManager.getInstance();
```
