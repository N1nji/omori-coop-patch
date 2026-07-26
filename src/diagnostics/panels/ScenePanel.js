var ScenePanel = ScenePanel || {};

(() => {

    "use strict";

    function ScenePanel() {

        HudPanel.call(
            this,
            "Scene"
        );

        this.SetOrder(0);

    }

    ScenePanel.prototype =
        Object.create(
            HudPanel.prototype
        );

    ScenePanel.prototype.constructor =
        ScenePanel;

    //=========================================================================
    // Draw
    //=========================================================================

    ScenePanel.prototype.OnDraw = function (renderer) {

        renderer.Property(
            "Scene",
            SceneManager._scene
                ? SceneManager._scene.constructor.name
                : "-"
        );

        renderer.Property(
            "Map",
            $gameMap
                ? $gameMap.mapId()
                : "-"
        );

        renderer.Property(
            "Player X",
            $gamePlayer
                ? $gamePlayer.x
                : "-"
        );

        renderer.Property(
            "Player Y",
            $gamePlayer
                ? $gamePlayer.y
                : "-"
        );

        renderer.Property(
            "Can Move",
            $gamePlayer
                ? $gamePlayer.canMove()
                : false
        );

    };

    window.ScenePanel = ScenePanel;

})();