import {describe,it,expect,vi} from 'vitest'
import {SessionManager} from '../../src/sessionManager'
const sessionManager=SessionManager.getInstance();
describe('sessionManager', ()=>{
  it('should be able to create a session manager', ()=>{
    expect(sessionManager).instanceOf(SessionManager)
  })
  it('all instances generated are the same Singleton', ()=>{
    const sessionManager2=SessionManager.getInstance();
    const sessionManager3=SessionManager.getInstance();
    
    const sessionManager4=SessionManager.getInstance();
    expect(sessionManager).toBe(sessionManager2)
    expect(sessionManager).toBe(sessionManager3)
    expect(sessionManager).toBe(sessionManager4)

  })
  it('fails if parameters are bad set',()=>{
    const sm=SessionManager.getInstance()
    
    expect(()=>sm.setConfig({secondsToLogout:1,secondsToWarning:3})).toThrowError()
  })
})