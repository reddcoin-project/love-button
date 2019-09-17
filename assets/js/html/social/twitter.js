function injectTwitter() {
    const tipImg = browser.extension.getURL("assets/images/reddid-tip-button.jpg");
    let tipId = 0;

    function inject() {
        var tweets = document.querySelectorAll("[data-testid='tweet']");

        if ([null, undefined].includes(tweets)) {
            return;
        }

        tweets = Array.from(tweets);

        tweets.forEach(t => {
            var link = t.getElementsByTagName('a')[1];

            if (!link || t.querySelector('.reddid_tip_injected_button')) {
                return;
            }

            var authorId = null,
                authorName = null,
                group = t.querySelector("[role='group']");

            var traverse = link;

            while (!authorId) {
                traverse = traverse.firstChild;

                if (traverse.textContent) {
                    authorId = traverse.textContent.split('@')[1];
                    authorName = traverse.textContent.split('@')[0];
                }
            }

            Users.push({
                url: 'https://www.twitter.com/' + authorId,
                authorName,
                title: 'Twitter post',
                authorId
            });

            //Insert the tip link, find the last element
            const tipHtml = `<span><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;

            group.insertAdjacentHTML('beforeend', tipHtml);

            registerTipClick(group);

            tipId++;
        });
    }

    console.log('extracted users:');
    console.log(Users);

    //immediately visible tweets
    inject();

    // React causes short load delay
    setTimeout(inject, 2500);

    // because twitter uses incremental loading of posts, we need to inspect again when those new posts are loaded
    watchNewElementsWithClassName('tweet', (elements) => inject());

    let urlPath = '';

    setInterval(() => {
        if (urlPath !== document.location.pathname) {
            console.log('scanning after url change');

            inject();
            console.log('scanning done');

            urlPath = document.location.pathname;
        }
    }, 1790);
}
