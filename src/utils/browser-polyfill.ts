// This polyfill ensures compatibility between Chrome and Firefox extension APIs
// The 'browser' object is used in Firefox extensions while 'chrome' is used in Chrome extensions

declare global {
  var browser: typeof chrome;
}

// Use browser if available (Firefox), otherwise use chrome (Chrome, Edge)
const browserAPI: typeof chrome = (typeof browser !== 'undefined' ? browser : chrome);
export default browserAPI;
