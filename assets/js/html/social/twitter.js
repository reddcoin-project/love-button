function injectTwitter() {
    const tipImg = browser.extension.getURL("assets/images/reddid-tip-button.jpg");
    let tipId = 0;

    function addTipping(tweets) {
        const filteredTweets = tweets.filter(tNode => tNode.tagName === 'DIV' && !tNode.querySelector('.reddid_tip_injected_button'));

        if (filteredTweets.length) {
            filteredTweets.forEach(tweet => {
                //Extract the username
                const authorId = tweet.dataset.screenName;

                if (authorId) {
                    const authorName = tweet.dataset.name;
                    const url = window.location.protocol + "//" + window.location.hostname + tweet.dataset.permalinkPath;

                    let tweetText = tweet.querySelector('.tweet-text').textContent || 'Twitter post';
                    const maxLength = 50;

                    if (tweetText.length > maxLength) {
                        tweetText = tweetText.substring(0, maxLength) + '...';
                    }

                    //Insert the user
                    Users.push({
                        url,
                        title: tweetText,
                        authorName,
                        authorId,
                    });

                    //Insert the tip link, find the last element
                    const tipHtml = `<span><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;
                    const containerNode = tweet.querySelector('.ProfileTweet-actionList');
                    containerNode.insertAdjacentHTML('beforeend', tipHtml);
                    registerTipClick(containerNode);

                    tipId++;
                }
            })
        }
    }

    console.log('extracted users:');
    console.log(Users);

    //immediately visible tweets
    addTipping(Array.from(document.getElementsByClassName('tweet')));

    // because twitter uses incremental loading of posts, we need to inspect again when those new posts are loaded
    watchNewElementsWithClassName('tweet', (elements) => addTipping(elements));

    let urlPath = '';

    setInterval(() => {
        if (urlPath !== document.location.pathname) {
            console.log('scanning after url change');
            addTipping(Array.from(document.getElementsByClassName('tweet')));
            console.log('scanning done');

            urlPath = document.location.pathname;
        }
    }, 1790);
}
