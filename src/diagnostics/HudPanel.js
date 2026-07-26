alert("HudPanel");
var HudPanel = HudPanel || {};

(() => {
    "use strict";

    function HudPanel(name) {

        this._name = name || "Panel";

        this._enabled = true;
        this._visible = true;
        this._collapsed = false;
        this._order = 0;

    }

    window.HudPanel = HudPanel;

    //=========================================================================
    // Name
    //=========================================================================

    HudPanel.prototype.GetName = function () {

        return this._name;

    };

    //=========================================================================
    // Enabled
    //=========================================================================

    HudPanel.prototype.SetEnabled = function (enabled) {

        this._enabled = enabled;

    };

    HudPanel.prototype.IsEnabled = function () {

        return this._enabled;

    };

    //=========================================================================
    // Visible
    //=========================================================================

    HudPanel.prototype.SetVisible = function (visible) {

        this._visible = visible;

    };

    HudPanel.prototype.IsVisible = function () {

        return this._visible;

    };

    //=========================================================================
    // Collapsed
    //=========================================================================

    HudPanel.prototype.SetCollapsed = function (collapsed) {

        this._collapsed = collapsed;

    };

    HudPanel.prototype.IsCollapsed = function () {

        return this._collapsed;

    };

    //=========================================================================
    // Order
    //=========================================================================

    HudPanel.prototype.SetOrder = function (order) {

        this._order = order;

    };

    HudPanel.prototype.GetOrder = function () {

        return this._order;

    };

    //=========================================================================
    // Draw
    //=========================================================================

    HudPanel.prototype.Draw = function (renderer) {

    if (this.IsCollapsed())
        return;

        renderer.Section(this.GetName());

        this.OnDraw(renderer);

    };

    //=========================================================================
    // Override
    //=========================================================================

    HudPanel.prototype.OnDraw = function (renderer) {

    };

})();