var LoggerPanel = LoggerPanel || {};

(() => {

    "use strict";

    function LoggerPanel() {

        HudPanel.call(
            this,
            "Logger"
        );

        this.SetOrder(100);

    }

    LoggerPanel.prototype =
        Object.create(
            HudPanel.prototype
        );

    LoggerPanel.prototype.constructor =
        LoggerPanel;

    //=========================================================================
    // Draw
    //=========================================================================

    LoggerPanel.prototype.OnDraw = function (renderer) {

        if (typeof Logger === "undefined") {

            renderer.Error(
                "Logger unavailable."
            );

            return;

        }

        if (!Logger._history) {

            renderer.Warning(
                "No history."
            );

            return;

        }

        renderer.Property(
            "Entries",
            Logger._history.length
        );

        renderer.Separator();

        const max =
            Math.min(
                Logger._history.length,
                8
            );

        const start =
            Math.max(
                0,
                Logger._history.length - max
            );

        for (let i = start; i < Logger._history.length; i++) {

            const entry =
                Logger._history[i];

            if (!entry)
                continue;

            renderer.Property(

                entry.type,

                entry.message

            );

        }

    };

    window.LoggerPanel = LoggerPanel;

})();