var SoftlockPanel = SoftlockPanel || {};

(() => {

    "use strict";

    function SoftlockPanel() {

        HudPanel.call(
            this,
            "Softlock"
        );

        this.SetOrder(40);

    }

    SoftlockPanel.prototype =
        Object.create(
            HudPanel.prototype
        );

    SoftlockPanel.prototype.constructor =
        SoftlockPanel;

    //=========================================================================
    // Draw
    //=========================================================================

    SoftlockPanel.prototype.OnDraw = function (renderer) {

        const scene = SceneManager._scene;
        const player = $gamePlayer;

        //-------------------------------------------------------------------------
        // Scene
        //-------------------------------------------------------------------------

        renderer.Property(
            "Scene",
            scene
                ? scene.constructor.name
                : "-"
        );

        renderer.Property(
            "Scene Ready",
            scene && scene.isReady
                ? scene.isReady()
                : "-"
        );

        renderer.Property(
            "Scene Busy",
            scene && scene.isBusy
                ? scene.isBusy()
                : "-"
        );

        //-------------------------------------------------------------------------
        // Player
        //-------------------------------------------------------------------------

        if (!player) {

            renderer.Warning(
                "Game_Player unavailable."
            );

            return;

        }

        renderer.Separator();

        renderer.Property(
            "Can Move",
            player.canMove()
        );

        renderer.Property(
            "Moving",
            player.isMoving()
        );

        renderer.Property(
            "Stopping",
            player.isStopping()
        );

        renderer.Property(
            "Transferring",
            player.isTransferring()
        );

        renderer.Property(
            "Transparent",
            player.isTransparent()
        );

        //-------------------------------------------------------------------------
        // Followers
        //-------------------------------------------------------------------------

        const followers = player.followers();

        if (followers) {

            renderer.Separator();

            renderer.Property(
                "Gathering",
                followers.areGathering()
            );

            renderer.Property(
                "Gathered",
                followers.areGathered()
            );

        }

        //-------------------------------------------------------------------------
        // Softlock Patch
        //-------------------------------------------------------------------------

        if (typeof SoftlockPatch !== "undefined") {

            renderer.Separator();

            if (SoftlockPatch.Debug) {

                renderer.Property(
                    "Active",
                    SoftlockPatch.Debug.active
                );

                renderer.Property(
                    "Timer",
                    SoftlockPatch.Debug.timer
                );

                renderer.Property(
                    "Timeout",
                    SoftlockPatch.Debug.timeout
                );

                renderer.Property(
                    "Reason",
                    SoftlockPatch.Debug.reason || "-"
                );

            } else {

                renderer.Info(
                    "Debug data unavailable."
                );

            }

        }

    };

    window.SoftlockPanel = SoftlockPanel;

})();