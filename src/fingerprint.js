// fingerprint.js
import Fingerprint2 from "fingerprintjs2";
import { sendFingerprintId } from "./socket.js";

function handleOnGetComponents(components) {
  var values = components.map(function(component) {
    return component.value;
  });

  fingerprintId = Fingerprint2.x64hash128(values.join(""), 27);
  sendFingerprintId(fingerprintId);
}

module.exports.sendFingerprintId = function() {
  var options = {
    fonts: { extendedJsFonts: true },
    excludes: { userAgent: true },
    NOT_AVAILABLE: "not available",
    ERROR: "error",
    EXCLUDED: "excluded"
  };
  if (window.requestIdleCallback) {
    requestIdleCallback(function() {
      Fingerprint2.get(options, handleOnGetComponents);
    });
  } else {
    setTimeout(function() {
      Fingerprint2.get(options, handleOnGetComponents);
    }, 500);
  }
};
