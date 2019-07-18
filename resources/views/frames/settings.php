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
        <b class="wallet-button button button--center button--large button--black right tooltip" data-click="toggle">
            Reset
            <div class="tooltip-content tooltip-content--black tooltip-content--ne" data-stopclick style="padding: 16px;text-align: left;width: 240px;">
                <p style='padding-bottom: 16px;'>Resetting the extension will wipe your seed. Do not process if you do not have it saved</p>
                <div class="button button--large button--primary right" data-stopclick id="reset">Reset</div>
            </div>
        </b>
    </div>
</section>
