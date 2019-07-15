<section class="wallet frame" id="frame-wallet-intro">

    <div class="frame-spacer"></div>

    <button class="intro-back frame-button frame-button--left button button--transparent button--icon" data-click="frame" data-frame="intro">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
    </button>

    <div class="wallet-shield">
        <img src="" alt="" class="wallet-shield-image">
    </div>

    <div class="page-header page-header--center">
        <h4 class="page-header-title">
            <b>Back up your wallet!</b>
        </h4>
        <span class="page-header-subtitle page-header-subtitle--small">
            In the next step you will receive a recovery phrase that will allow you to recover your wallet.
        </span>
    </div>

    <div class="wallet-warning page-header page-header--center">
        <h5 class="page-header-title">
            What if I lost my phrase or password?
        </h5>
        <span class="page-header-subtitle page-header-subtitle--small">
            WARNING: If you lose your recovery phrase, you will be unable to recover access to your account!
        </span>
    </div>

    <div class="intro-buttons">
        <div class="intro-button button button--center button--large button--primary" data-click="frame" data-frame="wallet-create">Continue, I Understand</div>
    </div>

</section>
