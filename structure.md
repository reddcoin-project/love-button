* UI css/js can be found in `/resources/assets/`
  * Before development execute `npm install` on this directory to install the required modules listed in `package.json`
  * Every subfolder is seperated by their `domain`
    * `/app/` contains the frames and or modules ( @see https://www.google.com/search?client=firefox-b-1-d&q=design+system+modules ) used by the extension
    * `/injected/` includes the css that is injected when you are browsing social media with reddid installed ( includes styles for the tip button, and the tip modal )
    * `/src/` contains the design system used to develop this extension
  * Each module includes its own css/js files
  * Use the npm scripts defined in `package.json` to compile css/js
* Most HTML can be found in `/resources/views/`
  * HTML is split into different `frames` to simplify development of each page/section
  * Once changes have been made execute `/resources/compile.php`
  * `compile.php` will merge all frames and output as `/popup.html`
  * `popup.html` is the single html/file opened by the browser to launch the extension
* HTML built using reddcoin blockchain data can be found within the `/assets/js/html/views/` directory
  * Once a user creates or loads a wallet the details are saved within `localStorage`
  * If a password is defined the seed will be encrypted before saving to `localStorage`
  * On extension load recent wallet transactions are fetched from the Reddcoin blockchain ( then saved to `localStorage`)
    * `setupWallet` contains the DOM listeners used to create or import wallets
    * `viewWalletAccounts` outputs all public addresses associated with the original wallet address ( @see deterministic wallets for more info )
    * `viewWalletBalance` outputs the current pending and confirmed balance of the account/address
    * `viewWalletHistory` loops through the primary wallet and injects the records found into the extension DOM ( wallet history section )
    * `viewWalletRegister` contains the DOM listeners used for reddid creation
    * `viewWalletSend` contains the functions required to send reddcoin within the send tab
    * `viewWalletSettings` contains the functions used within the settings tab
    * This currently only includes the functions to change the browser extension theme  
    * `viewWalletStatus` fetches/outputs various extension + blockchain details
	
* Browser extension configuration is located in `/manifest.json`
* Browser `manifest.json` documentation
  * Chrome  - https://developer.chrome.com/apps/manifest
  * Firefox - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json

* The reddcoin 'tip' button is injected on page load whenever you visit facebook, reddit, twitter or youtube.
* Each tip button for each social media site can be found in `assets/js/html/social/`
* The injection flow is simple
  * Add social media url to `content_scripts` in `/manifest.json` ( see configuration documentation for firefox/chrome manifest config )
  * On page load the browser/extension will execute the js defined in the manifest file.
  * Extension searches for all tweets, posts, etc. ( Every few seconds the timeline is rescanned )
  * Find `username`, `account name` ( slug ), `text` within each post ( facebook post text, tweet content, youtube title )
  * If all required information is found add the post to a global variable and inject tip button into facebook post, tweet, youtube video description, etc.
  * On tip button press the extension loads the information gathered during the steps listed above and auto populates several fields within the backend and frontend form
  * On submit send tip 

* Adjusting extension size 
  * The extension dimensions are fluid/adjustable by the user.
  * To modify the dimensions of the extension when it is opened by the user open `/assets/js/window.js` and modify the height/width properties. ( units are in pixels do not include px suffix )

