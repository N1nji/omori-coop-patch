var HudLayout = HudLayout || {};

(() => {
    "use strict";

    //=========================================================================
    // Configuration
    //=========================================================================

    HudLayout._margin = 8;

    //=========================================================================
    // Initialization
    //=========================================================================

    HudLayout.Initialize = function () {
        // Reservado para futuras configurações.
    };

    //=========================================================================
    // Viewport
    //=========================================================================

    HudLayout.GetViewport = function () {

        return {

            width: Graphics.width,
            height: Graphics.height
        };

    };

    //=========================================================================
    // Game Area
    //=========================================================================

    HudLayout.GetGameArea = function () {

        return {

            width: Graphics.boxWidth,
            height: Graphics.boxHeight
        };

    };

    //=========================================================================
    // Offsets
    //=========================================================================

    HudLayout.GetOffsets = function () {

        const viewport = this.GetViewport();
        const game = this.GetGameArea();

        return {

            x: Math.floor((viewport.width - game.width) / 2),
            y: Math.floor((viewport.height - game.height) / 2)

        };

    };

    //=========================================================================
    // Black Bars
    //=========================================================================

    HudLayout.GetLeftBar = function () {

        const offsets = this.GetOffsets();

        return {

            x: 0,
            y: 0,
            width: offsets.x,
            height: Graphics.height

        };

    };

    HudLayout.GetRightBar = function () {

        const offsets = this.GetOffsets();
        const game = this.GetGameArea();

        return {

            x: offsets.x + game.width,
            y: 0,
            width: offsets.x,
            height: Graphics.height

        };

    };

    HudLayout.GetTopBar = function () {

        const offsets = this.GetOffsets();

        return {

            x: offsets.x,
            y: 0,
            width: Graphics.boxWidth,
            height: offsets.y

        };

    };

    HudLayout.GetBottomBar = function () {

        const offsets = this.GetOffsets();

        return {

            x: offsets.x,
            y: offsets.y + Graphics.boxHeight,
            width: Graphics.boxWidth,
            height: offsets.y

        };

    };

    //=========================================================================
    // HUD Panels
    //=========================================================================

    HudLayout.GetLeftPanel = function () {

        const bar = this.GetLeftBar();

        return {

            x: bar.x + this._margin,
            y: bar.y + this._margin,
            width: Math.max(bar.width - this._margin * 2, 0),
            height: Math.max(bar.height - this._margin * 2, 0)

        };

    };

    HudLayout.GetRightPanel = function () {

        const bar = this.GetRightBar();

        return {

            x: bar.x + this._margin,
            y: bar.y + this._margin,
            width: Math.max(bar.width - this._margin * 2, 0),
            height: Math.max(bar.height - this._margin * 2, 0)

        };

    };

    HudLayout.GetTopPanel = function () {

        const bar = this.GetTopBar();

        return {

            x: bar.x + this._margin,
            y: bar.y + this._margin,
            width: Math.max(bar.width - this._margin * 2, 0),
            height: Math.max(bar.height - this._margin * 2, 0)

        };

    };

    HudLayout.GetBottomPanel = function () {

        const bar = this.GetBottomBar();

        return {

            x: bar.x + this._margin,
            y: bar.y + this._margin,
            width: Math.max(bar.width - this._margin * 2, 0),
            height: Math.max(bar.height - this._margin * 2, 0)

        };

    };

    //=========================================================================
    // Helpers
    //=========================================================================

    HudLayout.HasLeftPanel = function () {

        return this.GetLeftPanel().width > 0;

    };

    HudLayout.HasRightPanel = function () {

        return this.GetRightPanel().width > 0;

    };

    HudLayout.HasTopPanel = function () {

        return this.GetTopPanel().height > 0;

    };

    HudLayout.HasBottomPanel = function () {

        return this.GetBottomPanel().height > 0;

    };

    HudLayout.GetBestPanel = function () {

        const panels = [

            this.GetLeftPanel(),
            this.GetRightPanel(),
            this.GetTopPanel(),
            this.GetBottomPanel()

        ];

        let best = panels[0];

        let bestArea = best.width * best.height;

        for (let i = 1; i < panels.length; i++) {

            const panel = panels[i];

            const area = panel.width * panel.height;

            if (area > bestArea) {

                best = panel;
                bestArea = area;

            }

        }

        return best;

    };

    //=========================================================================
    // Debug
    //=========================================================================

    HudLayout.Print = function () {

        console.group("HudLayout");

        console.log("Viewport", this.GetViewport());
        console.log("Game Area", this.GetGameArea());
        console.log("Offsets", this.GetOffsets());

        console.log("Left Bar", this.GetLeftBar());
        console.log("Right Bar", this.GetRightBar());
        console.log("Top Bar", this.GetTopBar());
        console.log("Bottom Bar", this.GetBottomBar());

        console.log("Left Panel", this.GetLeftPanel());
        console.log("Right Panel", this.GetRightPanel());
        console.log("Top Panel", this.GetTopPanel());
        console.log("Bottom Panel", this.GetBottomPanel());

        console.groupEnd();

    };

})();