var TransferPanel = TransferPanel || {};

(() => {

    "use strict";

    function TransferPanel() {

        HudPanel.call(
            this,
            "Transfer"
        );

        this.SetOrder(20);

    }

    TransferPanel.prototype =
        Object.create(
            HudPanel.prototype
        );

    TransferPanel.prototype.constructor =
        TransferPanel;

    //=========================================================================
    // Draw
    //=========================================================================

    TransferPanel.prototype.OnDraw = function (renderer) {

        const player = $gamePlayer;

        if (!player) {

            renderer.Error("Game_Player not available.");
            return;

        }

        const followers = player.followers();

        renderer.Property(
            "Transferring",
            player.isTransferring()
        );

        renderer.Property(
            "New Map",
            player._newMapId
        );

        renderer.Property(
            "New X",
            player._newX
        );

        renderer.Property(
            "New Y",
            player._newY
        );

        renderer.Property(
            "Direction",
            player._newDirection
        );

        renderer.Property(
            "Fade",
            player._fadeType
        );

        renderer.Separator();

        renderer.Property(
            "Moving",
            player.isMoving()
        );

        renderer.Property(
            "Stopping",
            player.isStopping()
        );

        renderer.Property(
            "Can Move",
            player.canMove()
        );

        renderer.Property(
            "Transparent",
            player.isTransparent()
        );
        renderer.Separator();

        renderer.Property(
            "Current Map",
            $gameMap.mapId()
        );

        renderer.Property(
            "Current X",
            player.x
        );

        renderer.Property(
            "Current Y",
            player.y
        );

        renderer.Property(
            "Direction",
            player.direction()
        );

        renderer.Separator();

        if (followers) {

            renderer.Property(
                "Followers",
                followers.visibleFollowers().length
            );

            renderer.Property(
                "Gathering",
                followers.areGathering()
            );

            renderer.Property(
                "Gathered",
                followers.areGathered()
            );

        } else {

            renderer.Warning(
                "Followers unavailable."
            );

        }

    };

    window.TransferPanel = TransferPanel;

})();