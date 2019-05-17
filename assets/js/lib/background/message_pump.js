const handleMessage = function (request, sender, sendResponse) {
  const msgDebug = false;

  if (msgDebug) {
    debug.info("Message Pump Received - " + JSON.stringify(request));
  };
  if (request.method) {
    if (Reddcoin.backgnd && Reddcoin.backgnd != {}) {
      if (msgDebug) {
        debug.info(`Calling Reddcoin.backgnd, method: ${request.method}`);
      }
      return new Promise(resolve => resolve(Reddcoin.backgnd[request.method](request)));
    } else {
      const err = `Reddcoin.backgnd is not initialized to call method ${request.method}`;
      debug.warn(err);
      return Promise.reject(err);
    }
  } else {
    const err = `Can't call Reddcoin.backgnd with unknown method. params: ${JSON.stringify(request)}`;
    debug.warn(err);
    return Promise.reject(err);
  }
};

browser.runtime.onMessage.addListener(handleMessage);