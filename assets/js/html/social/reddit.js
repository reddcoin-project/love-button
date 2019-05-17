function injectReddit() {
    const tipImg = browser.extension.getURL("assets/images/reddit-tip-button.jpg");

    function getAuthorIdAndName(commentDiv) {
        const links = Array.from(commentDiv.getElementsByTagName('a')).filter(link => link.textContent);

        for (const link of links) {
            const authorId = getAuthorIdFromLinkNode(link);

            if (authorId) {
                const authorName = link.textContent;

                return {authorId, authorName};
            }
        }

        return {};
    }

    function getAuthorIdFromLinkNode(link) {
        const attribute = link.getAttribute('href');
        const userIndex = attribute.indexOf('/user/');

        if (userIndex > -1) {
            let authorId = attribute.slice(userIndex + '/user/'.length);
            if (authorId.indexOf('?') > -1) authorId = authorId.slice(0, authorId.indexOf('?'));
            if (authorId.indexOf('/') > -1) authorId = authorId.slice(0, authorId.indexOf('/'));
            return authorId;
        }

        return '';
    }

    function findButtonWithText(commentDiv, buttonText) {
        const buttons = Array.from(commentDiv.getElementsByTagName('button'));

        for (const button of buttons) {
            if (button.textContent.toLowerCase() === buttonText.toLowerCase()) {
                return button;
            }
        }

        return '';
    }

    function toAbsoluteUrl(url) {
        if (url.startsWith('http')) {
            return url;
        }

        return window.location.protocol + "//" + window.location.hostname + url;
    }

    function getUrlFromPost(postDiv) {
        const links = Array.from(postDiv.getElementsByTagName('a')).filter(link => link.dataset.clickId === 'timestamp');

        for (const link of links) {
            const url = link.getAttribute('href');

            if (url) {
                return toAbsoluteUrl(url);
            }
        }

        return document.location.href;
    }

    function getTitleFromPost(postDiv) {
        let titleCandidate = postDiv.querySelector('span>h2');

        if (!titleCandidate) {
            titleCandidate = postDiv.querySelector('span>a>h2');
        }

        if (titleCandidate) {
            return titleCandidate.textContent;
        }

        return null;
    }

    function getUrlFromComment(commentDiv) {
        const links = Array.from(commentDiv.getElementsByTagName('a')).filter(link => link.getElementsByTagName('span').length > 0);

        for (const link of links) {
            const url = link.getAttribute('href');

            if (url) {
                return toAbsoluteUrl(url);
            }
        }

        return document.location.href;
    }

    function getTitleFromFirstPost() {
        return Array.from(document.getElementsByClassName('Post')).find(post => getTitleFromPost(post));
    }

    let tipId = 0;
    const processedElements = [];

    const entryDivs = Array.from(document.getElementsByClassName('entry')).filter(commentNode => commentNode.tagName === 'DIV');

    if (entryDivs.length) {
        entryDivs.forEach(entryDiv => {
            console.log('old design detected');

            //Extract the username
            let authorNode = entryDiv.querySelector('a.author');
            if (authorNode) {
                const authorName = authorNode.textContent;
                const authorId = getAuthorIdFromLinkNode(authorNode);

                let titleSelector = entryDiv.querySelector('a.title');
                const title = (titleSelector && titleSelector.textContent) || document.title;

                const postLink = entryDiv.querySelector('a.title') || entryDiv.querySelector('a.bylink');
                let url = postLink.getAttribute('href');

                if (!url.startsWith('http')) {
                    url = window.location.protocol + "//" + window.location.hostname + url;
                }

                //Insert the user
                Users.push({
                    url,
                    title,
                    authorName: authorName,
                    authorId: authorId,
                });

                //Insert the tip link, find the last element
                const tipHtml = `<span><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;
                const containerNode = entryDiv.querySelector('ul.flat-list.buttons li:last-child');
                containerNode.insertAdjacentHTML('beforeend', tipHtml);
                registerTipClick(containerNode);

                tipId++;
            }
        });
    }
    else {
        console.log('new design detected');

        function addTippingOnPosts(posts) {
            const postDivs = posts.filter(commentNode => commentNode.tagName === 'DIV');
            postDivs.forEach(postDiv => {
                if (!processedElements.includes(postDiv)) {
                    processedElements.push(postDiv);

                    const button = findButtonWithText(postDiv, 'share');

                    if (button) {
                        const author = getAuthorIdAndName(postDiv);

                        if (author) {
                            Users.push({
                                url: getUrlFromPost(postDiv),
                                title: getTitleFromPost(postDiv) || document.title,
                                authorName: author.authorName,
                                authorId: author.authorId,
                            });

                            const tipHtml = `<span><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;
                            const containerNode = button.parentNode.parentNode;
                            containerNode.insertAdjacentHTML('beforeend', tipHtml);
                            registerTipClick(containerNode);

                            tipId++;
                        }
                    }
                }
            });
        }

        function addTippingOnComments(comments) {
            const commentDivs = comments.filter(commentNode => commentNode.tagName === 'DIV');

            commentDivs.forEach(commentDiv => {
                if (!processedElements.includes(commentDiv)) {
                    processedElements.push(commentDiv);

                    const button = findButtonWithText(commentDiv, 'Give gold');

                    if (button) {
                        const author = getAuthorIdAndName(commentDiv);

                        if (author) {
                            Users.push({
                                url: getUrlFromComment(commentDiv),
                                title: getTitleFromFirstPost() || document.title,
                                authorName: author.authorName,
                                authorId: author.authorId,
                            });

                            const tipHtml = `<span><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;
                            const containerNode = button.parentNode;
                            containerNode.insertAdjacentHTML('beforeend', tipHtml);
                            registerTipClick(containerNode);

                            tipId++;
                        }
                    }
                }
            });
        }

        // main post
        addTippingOnPosts(Array.from(document.getElementsByClassName('Post')));

        //comments
        addTippingOnComments(Array.from(document.getElementsByClassName('Comment')));

        // because reddit uses a long loading of comments, we need to inspect again when those new comments are loaded
        watchNewElementsWithClassName('Comment', (elements) => addTippingOnComments(elements));

        let urlPath = '';

        setInterval(() => {
            if (urlPath !== document.location.pathname) {
                console.log('scanning after url change');

                // main post
                addTippingOnPosts(Array.from(document.getElementsByClassName('Post')));

                //comments
                addTippingOnComments(Array.from(document.getElementsByClassName('Comment')));

                console.log('scanning done');

                urlPath = document.location.pathname;
            }
        }, 1790);
    }

    console.log(`extracted ${Users.length} users`);
}
