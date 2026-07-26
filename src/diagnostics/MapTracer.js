var MapTracer = MapTracer || {};

(() => {

    "use strict";

    //=========================================================================
    // Constants
    //=========================================================================

    const MAX_ENTRIES = 250;

    //=========================================================================
    // State
    //=========================================================================

    MapTracer._enabled = true;

    MapTracer._entries = [];

    //=========================================================================
    // Public
    //=========================================================================

    MapTracer.Enable = function () {

        this._enabled = true;

    };

    MapTracer.Disable = function () {

        this._enabled = false;

    };

    MapTracer.Toggle = function () {

        this._enabled = !this._enabled;

    };

    MapTracer.IsEnabled = function () {

        return this._enabled;

    };

    MapTracer.Clear = function () {

        this._entries.length = 0;

    };

    MapTracer.GetEntries = function () {

        return this._entries;

    };

    MapTracer.GetLastEntry = function () {

        if (!this._entries.length)
            return null;

        return this._entries[this._entries.length - 1];

    };

    //=========================================================================
    // Trace
    //=========================================================================

    MapTracer.Trace = function (message, data) {

        if (!this._enabled)
            return;

        const entry = {

            frame: Graphics.frameCount,

            time: performance.now(),

            mapId: $gameMap
                ? $gameMap.mapId()
                : null,

            scene: SceneManager._scene
                ? SceneManager._scene.constructor.name
                : null,

            playerX: $gamePlayer
                ? $gamePlayer.x
                : null,

            playerY: $gamePlayer
                ? $gamePlayer.y
                : null,

            transferring: $gamePlayer
                ? $gamePlayer.isTransferring()
                : false,

            message: message,

            data: data || null

        };

        this._entries.push(entry);

        if (this._entries.length > MAX_ENTRIES) {

            this._entries.shift();

        }

        if (typeof Logger !== "undefined") {

            Logger.Info(
                "[TRACE] " + message
            );

        }

    };

    //=========================================================================
    // Helpers
    //=========================================================================

    MapTracer.BeginTransfer = function () {

        this.Trace(
            "Transfer Begin"
        );

    };

    MapTracer.EndTransfer = function () {

        this.Trace(
            "Transfer End"
        );

    };

    MapTracer.Scene = function (name) {

        this.Trace(
            "Scene: " + name
        );

    };

    MapTracer.Command = function (code) {

        this.Trace(
            "Command " + code
        );

    };

    MapTracer.Event = function (id) {

        this.Trace(
            "Event " + id
        );

    };

    MapTracer.Wait = function (mode) {

        this.Trace(
            "Wait: " + mode
        );

    };

    MapTracer.Warning = function (message) {

        this.Trace(
            "WARNING: " + message
        );

    };

    MapTracer.Error = function (message) {

        this.Trace(
            "ERROR: " + message
        );

    };

})();