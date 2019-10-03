<section class="settings frame" id="frame-settings">
    
    <section class="page-section">
        <div class="page-header">
            <h4 class="page-header-title">Settings</h4>
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
                <div class="button button--large button--green button--faded right" data-stopclick id="reset">Reset</div>
            </div>
        </b>

        <div class="settings-list list">
            <span class="list-item list-item--small" style='padding: 0;'>Build: 1</span>
            <span class="list-item list-item--small" style='padding: 0;'>Version: 1.6.0</span>
        </div>

        <!-- <div class="settings-links">
            <div class="settings-link link link--full link--large">
                <div class="icon">
                    <?= $svg('plus') ?>
                </div>
                <span class="inline-spacer"></span>

                Agreements & Policies

                <div class="icon right">
                    <?= $svg('arrow/head/small') ?>
                </div>
            </div>
        </div> -->
    </section>

</section>
