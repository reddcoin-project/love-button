function injectFacebook() {
    const tipImg = browser.extension.getURL("assets/images/reddid-tip-button.jpg");
    let tipId = 0;
    const processedTipLinks = [];

    function getAuthorIdAndName(wrapper) {
        if (wrapper.type === 'post') {
            return getAuthorIdAndNameFromPost(wrapper.element);
        }
        else if (wrapper.type === 'comment') {
            return getAuthorIdAndNameFromComment(wrapper.element);
        }

        return null;
    }

    function getAuthorIdAndNameFromPost(post) {
        const links = Array.from(post.querySelectorAll('A'))
            .filter(linkNode => linkNode.parentElement.tagName === 'SPAN'
                && linkNode.parentElement.parentElement.tagName === 'SPAN'
                && !linkNode.previousElementSibling
                && linkNode.getAttribute('href').includes('facebook.com/')
            );

        for (const link of links) {
            const authorId = getAuthorIdFromLinkNode(link);

            if (authorId) {
                return {authorId, authorName: link.textContent};
            }
        }

        return {};
    }

    function getAuthorIdAndNameFromComment(comment) {
        const link = comment.querySelector('A.UFICommentActorName');

        if (link) {
            const authorId = getAuthorIdFromLinkNode(link);

            if (authorId) {
                return {authorId, authorName: link.textContent};
            }
        }

        return {};
    }


    function getAuthorIdFromLinkNode(link) {
        const attribute = link.getAttribute('href');
        const userIndex = attribute.indexOf('facebook.com/');

        if (userIndex > -1) {
            let authorId = attribute.slice(userIndex + 'facebook.com/'.length);
            if (authorId.indexOf('?') > -1) authorId = authorId.slice(0, authorId.indexOf('?'));
            if (authorId.indexOf('/') > -1) authorId = authorId.slice(0, authorId.indexOf('/'));

            return authorId;
        }

        return '';
    }

    function getWrapper(element) {
        let className = element.className;

        if (className && className.length) {
            if (className.includes('userContentWrapper')) return {type: 'post', element};
            if (className.includes('UFICommentContentBlock')) return {type: 'comment', element};
        }

        if (element.parentElement) return getWrapper(element.parentElement);

        return null;
    }

    function getParentWithClass(element, wantedCss) {
        if (element.className.includes(wantedCss)) return element;
        if (element.parentElement) return getParentWithClass(element.parentElement, wantedCss);
        return null;
    }

    function getParentWithTagName(element, wantedTadName) {
        if (element.tagName === wantedTadName) return element;
        if (element.parentElement) return getParentWithTagName(element.parentElement, wantedTadName);
        return null;
    }

    function makeAbsoluteUrl(url) {
        const site = 'https://facebook.com';
        if (url && !url.startsWith('http')) {
            if (url.startsWith('/')) return `${site}${url}`;
            else return `${site}/${url}`;
        }

        return url;
    }

    function getUrl(wrapper, likeLink) {
        if (wrapper.type === 'post') {
            const timestampContent = wrapper.element.querySelector('.timestampContent');

            if (timestampContent) {
                const postLinkElement = getParentWithTagName(timestampContent, 'A');

                if(postLinkElement) {
                    return makeAbsoluteUrl(postLinkElement.getAttribute('href'));
                }
            }
        }
        else if (wrapper.type === 'comment') {
            const commentActions = getParentWithClass(likeLink, 'UFICommentActions');

            if (commentActions) {
                const commentLinkElement = commentActions.querySelector('.uiLinkSubtle');

                if (commentLinkElement) {
                    return makeAbsoluteUrl(commentLinkElement.getAttribute('href'));
                }
            }
        }
        return document.location.href;
    }

    function getTitle(wrapper) {
        let textBody;

        if (wrapper.type === 'post') {
            textBody = wrapper.element.querySelector('.userContent');
        }
        else if (wrapper.type === 'comment') {
            textBody = wrapper.element.querySelector('.UFICommentBody');
        }

        if (textBody) {
            let text = textBody.textContent;

            const maxLength = 50;

            if (text.length > maxLength) {
                text = text.substring(0, maxLength) + '...';
            }

            return text;
        }

        return 'Facebook';
    }

    function addTipping(likeLinks) {
        likeLinks.forEach(likeLink => {
            if (!processedTipLinks.includes(likeLink)) {
                processedTipLinks.push(likeLink);

                const wrapper = getWrapper(likeLink);

                if (wrapper) {
                    const author = getAuthorIdAndName(wrapper);

                    Users.push({
                        url: getUrl(wrapper, likeLink),
                        title: getTitle(wrapper),
                        authorName: author.authorName,
                        authorId: author.authorId,
                    });

                    //Insert the tip link, find the last element
                    let tipContainer = likeLink.parentElement.parentElement;
                    const tipHtml = `<span class="reddid_tip_container"><img src="${tipImg}" class="reddid_tip_injected_button tip-link" data-tipid='${tipId}'></span>`;
                    const containerNode = tipContainer.parentElement;
                    containerNode.insertAdjacentHTML('beforeend', tipHtml);
                    registerTipClick(containerNode);

                    tipId++;
                }
            }
        });
    }

    //immediately visible posts
    addTipping(Array.from(document.getElementsByClassName('UFILikeLink')));

    // because facebook uses incremental loading of posts, we need to inspect again when those new posts are loaded
    watchNewElementsWithClassName('UFILikeLink', (elements) => addTipping(elements));
}
