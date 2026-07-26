var OcRamPanel = OcRamPanel || {};

(() => {

    "use strict";

    function OcRamPanel() {

        HudPanel.call(
            this,
            "OcRam"
        );

        this.SetOrder(30);

    }

    OcRamPanel.prototype =
        Object.create(
            HudPanel.prototype
        );

    OcRamPanel.prototype.constructor =
        OcRamPanel;

    //=========================================================================
    // Draw
    //=========================================================================

    OcRamPanel.prototype.OnDraw = function (renderer) {

        //-------------------------------------------------------------------------
        // OcRam
        //-------------------------------------------------------------------------

        renderer.Property(
            "Loaded",
            typeof OcRam !== "undefined"
        );

        if (typeof OcRam === "undefined") {

            renderer.Error(
                "OcRam not found."
            );

            return;

        }

        renderer.Property(
            "Version",
            OcRam.version || "-"
        );

        renderer.Property(
            "Local Coop",
            !!OcRam.Local_Coop
        );

        if (!OcRam.Local_Coop) {

            renderer.Warning(
                "Local Coop unavailable."
            );

            return;

        }

        //-------------------------------------------------------------------------
        // Plugin Exploration
        //-------------------------------------------------------------------------

        renderer.Separator();

        const keys =
            Object.keys(
                OcRam.Local_Coop
            );

        renderer.Property(
            "Properties",
            keys.length
        );

        renderer.Property(
            "Type",
            typeof OcRam.Local_Coop
        );

        renderer.Separator();

        renderer.Title(
            "Members"
        );

        for (let i = 0; i < keys.length; i++) {

            const key = keys[i];

            let value;

            try {

                value =
                    OcRam.Local_Coop[key];

            } catch {

                value = "<error>";

            }

            if (typeof value === "function") {

                renderer.Property(
                    key,
                    "()"
                );

                continue;

            }

            if (Array.isArray(value)) {

                renderer.Property(
                    key,
                    "Array(" + value.length + ")"
                );

                continue;

            }

            if (typeof value === "object") {

                renderer.Property(
                    key,
                    "Object"
                );

                continue;

            }

            renderer.Property(
                key,
                String(value)
            );

        }

    };

    window.OcRamPanel = OcRamPanel;

})();