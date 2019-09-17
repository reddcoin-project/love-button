function injectFacebook() {
    const tipImg = browser.extension.getURL("assets/images/reddid-tip-button.jpg");
    let tipId = 0;

    function inject() {
        var subtitles = document.querySelectorAll("[data-testid='story-subtitle']");

        subtitles.forEach(subtitle => {
            var title = subtitle.previousSibling,
                wrapper = subtitle.closest(".userContentWrapper");

            var authorId = null,
                authorName = title.textContent,
                group = wrapper.querySelector("[data-testid='fbFeedStoryUFI/feedbackSummary']").nextSibling || null;

            if (!group || group.querySelector('.reddid_tip_injected_button')) {
                return;
            }

            var traverse = title;

            while (!authorId) {
                traverse = traverse.firstChild;

                if (!traverse) {
                    break;
                }

                if (traverse.href) {
                    var segments = traverse.href.split('/');

                    authorId = segments[segments.indexOf('www.facebook.com') + 1];
                }
            }

            title = subtitle.querySelector("[data-testid='post_message']");

            if (!title) {
                title = 'Facebook Post';
            }
            else {
                const maxLength = 50;

                title = title.textContent;

                if (title.length > maxLength) {
                    title = title.substring(0, maxLength) + '...';
                }
            }

            Users.push({
                url: 'https://www.facebook.com/' + authorId,
                authorName,
                title,
                authorId
            });

            //Insert the tip link, find the last element
            const tipHtml = `<span><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;

            group.insertAdjacentHTML('beforeend', tipHtml);

            registerTipClick(group);

            tipId++;
        });
    }

    //immediately visible tweets
    inject();

    // React causes short load delay
    setTimeout(inject, 2500);

    // because facebook uses incremental loading of posts, we need to inspect again when those new posts are loaded
    watchNewElementsWithClassName('UFILikeLink', (elements) => inject);
}
