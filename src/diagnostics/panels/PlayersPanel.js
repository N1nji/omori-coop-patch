alert("PlayersPanel");
var PlayersPanel = PlayersPanel || {};

(() => {

    "use strict";

    function PlayersPanel() {

        HudPanel.call(this, "Players");

        this.SetOrder(10);

    }

    PlayersPanel.prototype =
        Object.create(HudPanel.prototype);

    PlayersPanel.prototype.constructor =
        PlayersPanel;

    //=========================================================================
    // Safe Call
    //=========================================================================

    PlayersPanel.prototype.SafeCall = function (
        object,
        method,
        fallback
    ) {

        if (!object)
            return fallback;

        if (typeof object[method] !== "function")
            return fallback;

        try {

            return object[method]();

        } catch (e) {

            return fallback;

        }

    };

    //=========================================================================
    // Draw
    //=========================================================================

    PlayersPanel.prototype.OnDraw = function (renderer) {

        if (!window.$gamePlayer) {

            renderer.Error("Game_Player unavailable.");

            return;

        }

        //---------------------------------------------------------------------
        // Overview
        //---------------------------------------------------------------------

        const leader =
            window.$gameParty
                ? $gameParty.leader()
                : null;

        renderer.Property(
            "Leader",
            leader
                ? leader.name()
                : "-"
        );

        renderer.Property(
            "Map",
            window.$gameMap
                ? $gameMap.mapId()
                : "-"
        );

        renderer.Property(
            "Party",
            window.$gameParty
                ? $gameParty.members().length
                : "-"
        );

        renderer.Property(
            "Players",
            window.$allPlayers
                ? $allPlayers.length
                : 1
        );

        renderer.Separator();

        //---------------------------------------------------------------------
        // Host
        //---------------------------------------------------------------------

        this.DrawPlayer(
            renderer,
            $gamePlayer,
            "HOST"
        );

        //---------------------------------------------------------------------
        // Coop Players
        //---------------------------------------------------------------------

        if (!window.$allPlayers)
            return;

        for (let i = 0; i < $allPlayers.length; i++) {

            const player = $allPlayers[i];

            if (!player)
                continue;

            if (player === $gamePlayer)
                continue;

            renderer.Separator();

            this.DrawPlayer(

                renderer,

                player,

                "PLAYER " + (i + 1)

            );

        }

    };

    //=========================================================================
    // Draw Player
    //=========================================================================

    PlayersPanel.prototype.DrawPlayer = function (

        renderer,

        player,

        title

    ) {

        renderer.Title(title);

        renderer.Property(
            "X",
            player.x
        );

        renderer.Property(
            "Y",
            player.y
        );

        renderer.Property(
            "Real X",
            player._realX
        );

        renderer.Property(
            "Real Y",
            player._realY
        );

        renderer.Property(
            "Direction",
            this.SafeCall(
                player,
                "direction",
                player._direction ?? "-"
            )
        );

        renderer.Property(
            "Moving",
            this.SafeCall(
                player,
                "isMoving",
                false
            )
        );

        renderer.Property(
            "Stopping",
            this.SafeCall(
                player,
                "isStopping",
                "N/A"
            )
        );

        renderer.Property(
            "Jumping",
            this.SafeCall(
                player,
                "isJumping",
                "N/A"
            )
        );

        renderer.Property(
            "Transfer",
            this.SafeCall(
                player,
                "isTransferring",
                "N/A"
            )
        );

        renderer.Property(
            "Transparent",
            this.SafeCall(
                player,
                "isTransparent",
                false
            )
        );

        renderer.Property(
            "Through",
            this.SafeCall(
                player,
                "isThrough",
                false
            )
        );

        renderer.Property(
            "Can Move",
            this.SafeCall(
                player,
                "canMove",
                "N/A"
            )
        );

    };

    window.PlayersPanel = PlayersPanel;

})();