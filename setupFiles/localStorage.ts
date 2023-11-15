import { beforeAll } from "vitest";
beforeAll(()=>{
  // @ts-expect-error type
  globalThis.localStorage = {
  storage: {},
  getItem: function(key) {
    return this.storage[key];
  },
  setItem: function(key, value) {
    this.storage[key] = value;
  },
  removeItem: function(key) {
    delete this.storage[key];
  },
  clear: function() {
    this.storage = {};
  }
};
})