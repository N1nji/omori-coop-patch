var PlayerTracer = PlayerTracer || {};

(() => {

    "use strict";

    //=========================================================================
    // Constants
    //=========================================================================

    const MAX_ENTRIES = 250;

    //=========================================================================
    // State
    //=========================================================================

    PlayerTracer._enabled = true;

    PlayerTracer._entries = [];

    PlayerTracer._lastState = null;

    //=========================================================================
    // Public
    //=========================================================================

    PlayerTracer.Enable = function () {

        this._enabled = true;

    };

    PlayerTracer.Disable = function () {

        this._enabled = false;

    };

    PlayerTracer.Toggle = function () {

        this._enabled = !this._enabled;

    };

    PlayerTracer.IsEnabled = function () {

        return this._enabled;

    };

    PlayerTracer.Clear = function () {

        this._entries.length = 0;

        this._lastState = null;

    };

    PlayerTracer.GetEntries = function () {

        return this._entries;

    };

    //=========================================================================
    // Update
    //=========================================================================

    PlayerTracer.Update = function () {

        if (!this._enabled)
            return;

        if (!$gamePlayer)
            return;

        const state = {

            mapId: $gameMap.mapId(),

            x: $gamePlayer.x,

            y: $gamePlayer.y,

            direction: $gamePlayer.direction(),

            moving: $gamePlayer.isMoving(),

            stopping: $gamePlayer.isStopping(),

            transferring: $gamePlayer.isTransferring(),

            transparent: $gamePlayer.isTransparent(),

            through: $gamePlayer.isThrough(),

            canMove: $gamePlayer.canMove()

        };

        if (!this._lastState) {

            this._lastState = state;

            this.Trace(
                "Player Initialized",
                state
            );

            return;

        }

        for (const key in state) {

            if (state[key] !== this._lastState[key]) {

                this.Trace(
                    key,
                    {

                        old: this._lastState[key],

                        current: state[key]

                    }
                );

            }

        }

        this._lastState = state;

    };

    //=========================================================================
    // Trace
    //=========================================================================

    PlayerTracer.Trace = function (message, data) {

        const entry = {

            frame: Graphics.frameCount,

            time: performance.now(),

            scene: SceneManager._scene
                ? SceneManager._scene.constructor.name
                : "-",

            message: message,

            data: data || {}

        };

        this._entries.push(entry);

        if (this._entries.length > MAX_ENTRIES) {

            this._entries.shift();

        }

        if (typeof Logger !== "undefined") {

            Logger.Info(
                "[PLAYER] " + message
            );

        }

    };

})();