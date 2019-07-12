<section class="settings frame" id="frame-settings" style='padding-bottom: 0;'>
    <div class="frame-spacer"></div>

    <button class="frame-button frame-button--left button button--black button--icon" data-click="frame" data-frame="wallet-interact">
        <div class="icon icon--rotate180">
            <?= $svg('arrow/small') ?>
        </div>
    </button>

    <div class="frame-wrapper">
        <div class="page-header">
            <h3 class="page-header-title">Settings</h3>
        </div>

        <div class="settings-field field field--full field--grey" data-focusinout="toggle">
            <span class="field-title">Background</span>

            <label class="field-text field-text--select" data-change="select">
                <div class="field-mask"></div>

                <select class="field-tag js-background-select" data-ref="trigger:change">
                    <option value="theme0">Remove Theme</option>
                    <option value="theme1">Theme 1</option>
                    <option value="theme2">Theme 2</option>
                </select>
            </label>
        </div>

        <b class="wallet-button button button--center button--large button--grey" data-click="frame" data-frame="status" id="menuStatus">Network Status</b>
        <b class="wallet-button button button--center button--large button--black right" id="logout">Logout</b>
    </div>
</section>
