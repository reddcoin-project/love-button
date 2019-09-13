(function (exports) {

    // https://reddcoin.com/feed/json

    let parser = new DOMParser();


    function template(data) {
        let template = `
            <div class="news-article">
                <div class="text-group">
                    <a class="text text--small" href='${data.url}'>reddcoin.com</a>
                    <span class="text text--small">${data.time}</span>
                </div>

                <h4 class="news-article-title">
                    <a class='link link--primary link--inline' href='${data.url}'><b>${data.title}</b></a>
                </h4>

                <div class="text text--icon text--small">
                    <div class="text-icon icon icon--small">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.359"></circle><path d="M16 8c0-.272-.083-.525-.226-.735C13.099 2.467 8 2.674 8 2.674S2.901 2.467.226 7.266C.083 7.475 0 7.728 0 8s.083.526.226.735v-.001c.043.077.087.153.131.228C3.065 13.525 8 13.325 8 13.325s4.936.2 7.643-4.362h.001c.044-.075.088-.151.131-.228l-.001.001c.143-.21.226-.464.226-.736zm-8 3.679a3.678 3.678 0 1 1 0-7.358 3.679 3.679 0 1 1 0 7.358z"></path></svg>
                    </div>
                    -
                </div>

                <img src="${data.image}" alt="" class="news-article-image">
            </div>
        `;

        return Array.from( parser.parseFromString(template, 'text/html').body.children );
    }


    $.getJSON('https://reddcoin.com/feed/json', function(data) {
        let articles = data.items,
            fragment = document.createDocumentFragment();

        for (let i = 0, n = articles.length; i < n; i++) {
            let article = articles[i];

            fragment.appendChild(template({
                image: article.image,
                time: new Date(article.date_published).toLocaleString(),
                title: article.title,
                url: article.url
            })[0]);
        }

        $('#news-articles').html(fragment);

        $('#news-articles a').click(function(e) {
            e.preventDefault();

            if (chrome) {
                chrome.tabs.create({ url: $(this).attr('href')});
            }
            else {
                browser.tabs.create({ url: $(this).attr('href') });
            }
        });
    });

})(exports);
