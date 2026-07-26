var EventPanel = EventPanel || {};

(() => {

    "use strict";

    function EventPanel() {

        HudPanel.call(
            this,
            "Events"
        );

        this.SetOrder(20);

    }

    EventPanel.prototype =
        Object.create(
            HudPanel.prototype
        );

    EventPanel.prototype.constructor =
        EventPanel;

    //=========================================================================
    // Draw
    //=========================================================================

    EventPanel.prototype.OnDraw = function (renderer) {

        const interpreter = $gameMap
            ? $gameMap._interpreter
            : null;

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

        if (!interpreter) {

            renderer.Warning(
                "Interpreter unavailable."
            );

            return;

        }

        renderer.Separator();

        renderer.Title(
            "Interpreter"
        );

        renderer.Property(
            "Running",
            interpreter.isRunning()
        );

        renderer.Property(
            "Event Id",
            interpreter._eventId
        );

        renderer.Property(
            "Index",
            interpreter._index
        );

        renderer.Property(
            "Wait Count",
            interpreter._waitCount
        );

        renderer.Property(
            "Wait Mode",
            interpreter._waitMode || "-"
        );

        renderer.Property(
            "Child",
            !!interpreter._childInterpreter
        );

        renderer.Property(
            "Depth",
            interpreter._depth
        );

        renderer.Property(
            "List",
            interpreter._list
                ? interpreter._list.length
                : 0
        );

        if (interpreter._list && interpreter._list.length > 0) {

            renderer.Separator();

            renderer.Title(
                "Current Command"
            );

            const command =
                interpreter._list[interpreter._index];

            if (command) {

                renderer.Property(
                    "Code",
                    command.code
                );

                renderer.Property(
                    "Indent",
                    command.indent
                );

            }

        }

    };

    window.EventPanel = EventPanel;

})();