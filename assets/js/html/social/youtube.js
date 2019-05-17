function injectYouTube() {
    const tipImg = browser.extension.getURL("assets/images/reddit-tip-button.jpg");
    let tipId = 0;

    function getAuthorIdAndName(commentDiv) {
        const author = commentDiv.querySelector('#author-text');

        if (author) {
            const authorId = getAuthorIdFromLinkNode(author);

            if (authorId) {
                const authorName = author.querySelector('span').textContent.trim();

                return {authorId, authorName};
            }
        }

        return null;
    }

    function getAuthorIdFromLinkNode(link) {
        const attribute = link.getAttribute('href');
        const splitted = attribute.split('/');

        const authorId = splitted && splitted[splitted.length - 1];

        if (authorId) {
            if (authorId.startsWith('UC')) {
                console.log('author;d' + authorId)
                return authorId;
            }
            else {
                console.log(`Only channels allowed, skipping ${authorId}`);
            }
        }

        return null;
    }

    function getTitle() {
        const titles = Array.from(document.getElementsByClassName('title'));

        if (titles && titles.length) {
            const titleString = titles[0].querySelector('yt-formatted-string');

            if (titleString) {
                return titleString.textContent.trim();
            }
        }

        return document.title;
    }

    function addTippingOnVideo() {
        const buttonbar = document.getElementById('info').querySelector('#top-level-buttons');

        if (buttonbar.querySelector('.reddid_tip_injected_button')) return; //prevent double insertions

        const authorContainer = document.getElementById('owner-container');

        if (authorContainer) {
            const authorId = getAuthorIdFromLinkNode(authorContainer.querySelector('A'));
            const authorName = authorContainer.textContent.trim();

            if (buttonbar && authorId && authorName) {
                Users.push({
                    url: document.location.href,
                    title: getTitle(),
                    authorName,
                    authorId,
                });

                const tipHtml = `<span class="reddid_tip_container"><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;
                buttonbar.insertAdjacentHTML('beforeend', tipHtml);
                registerTipClick(buttonbar);

                tipId++;
            }
        }
    }

    function getCommentUrl(comment) {
        const commentUrlA = comment.querySelector('#published-time-text>a');

        if (commentUrlA) {
            const href = commentUrlA.getAttribute('href');

            if (href) {
                if (!href.startsWith('http')) {
                    return window.location.protocol + "//" + window.location.hostname + href;
                }
                return href;
            }
        }

        return document.location.href;
    }

    function addTippingOnComments(comments) {
        comments
            .filter(comment => !comment.querySelector('.reddid_tip_injected_button'))
            .forEach(commentDiv => {
                const toolbar = commentDiv.querySelector('#toolbar');
                const author = getAuthorIdAndName(commentDiv);

                if (toolbar && author) {
                    Users.push({
                        url: getCommentUrl(commentDiv),
                        title: getTitle(),
                        authorName: author.authorName,
                        authorId: author.authorId,
                    });


                    const tipHtml = `<span class="reddid_tip_container"><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;
                    toolbar.insertAdjacentHTML('beforeend', tipHtml);
                    registerTipClick(toolbar);

                    tipId++;
                }
            });
    }

    // because youtube uses a long loading of comments, we need to inspect again when those new comments are loaded
    watchNewElementsWithTagName('ytd-comment-renderer', (elements) => addTippingOnComments(elements));

    let url = '';
    
    setInterval(() => {
        if (url !== document.location.href) {
            console.log('scanning after url change');

            // main video
            addTippingOnVideo();

            console.log('scanning done');

            url = document.location.href;
        }
    }, 1251);
}
