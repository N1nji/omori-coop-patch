var PerformancePanel = PerformancePanel || {};

(() => {

    "use strict";

    function PerformancePanel() {

        HudPanel.call(
            this,
            "Performance"
        );

        this.SetOrder(90);

        this._lastTime = performance.now();
        this._fps = 60;
        this._frameTime = 0;

    }

    PerformancePanel.prototype =
        Object.create(
            HudPanel.prototype
        );

    PerformancePanel.prototype.constructor =
        PerformancePanel;

    //=========================================================================
    // Draw
    //=========================================================================

    PerformancePanel.prototype.OnDraw = function (renderer) {

        const now = performance.now();

        this._frameTime =
            now - this._lastTime;

        this._lastTime = now;

        if (this._frameTime > 0) {

            this._fps = Math.round(
                1000 / this._frameTime
            );

        }

        renderer.Property(
            "FPS",
            this._fps
        );

        renderer.Property(
            "Frame Time",
            this._frameTime.toFixed(2) + " ms"
        );

        renderer.Separator();

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
            "Events",
            $gameMap
                ? $gameMap.events().length
                : "-"
        );

        renderer.Property(
            "Followers",
            $gamePlayer
                ? $gamePlayer.followers().visibleFollowers().length
                : "-"
        );

    };

    window.PerformancePanel = PerformancePanel;

})();