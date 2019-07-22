<section class="news frame" id="frame-news">
    <section class="page-section">
        <div class="news-header page-header">
            <h4 class="page-header-title page-header-title--icon">
                <div class="page-header-title-icon icon icon--large">
                    <?= $svg('plus') ?>
                </div>

                Recent News
            </h4>
        </div>

        <section class="news-articles">
            <?php for($i = 0; $i < 5; $i++): ?>
                <div class="news-article">
                    <div class="text-group">
                        <span class="text text--small">Source</span>
                        <span class="text text--small">1m</span>
                    </div>

                    <h5 class="news-article-title">
                        Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit
                    </h5>

                    <div class="text text--icon text--small">
                        <div class="text-icon icon icon--small">
                            <?= $svg('eyeball') ?>
                        </div>
                        420
                    </div>

                    <img src="" alt="" class="news-article-image">
                </div>
            <?php endfor; ?>
        </section>

    </section>
</section>
