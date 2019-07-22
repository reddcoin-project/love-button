<section class="feed frame" id="frame-feed">
    <section class="page-section">
        <div class="feed-header page-header">
            <h4 class="page-header-title page-header-title--icon">
                <div class="page-header-title-icon icon icon--large">
                    <?= $svg('plus') ?>
                </div>

                Recent Tips
            </h4>
        </div>

        <section class="feed-items">
            <?php for($i = 0; $i < 5; $i++): ?>
                <div class="feed-item text-list text-list--full">
                    <div class="text text--full text--icon">
                        <div class="feed-item-social text-icon button button--icon button--reddit button--badge">
                            <div class="icon icon--small">
                                <?= $svg('social/reddit') ?>
                            </div>
                        </div>
                        <span class="inline-spacer inline-spacer--large"></span>
                        Reddit

                        <b class="right">now</b>
                    </div>

                    <b class="feed-item-address text text--full">Roo2stvAHmepciBeL3VSU4hqTaT2mzfs25</b>
                    <span class="text text--full">
                        received tip: <b>5,000 RDD</b>
                    </span>
                </div>
            <?php endfor; ?>
        </section>

    </section>
</section>
