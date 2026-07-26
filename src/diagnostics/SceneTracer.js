var SceneTracer = SceneTracer || {};

(() => {

    "use strict";

    //=========================================================================
    // Constants
    //=========================================================================

    const MAX_ENTRIES = 250;

    //=========================================================================
    // State
    //=========================================================================

    SceneTracer._enabled = true;

    SceneTracer._entries = [];

    SceneTracer._lastScene = null;

    SceneTracer._lastReady = null;

    SceneTracer._lastBusy = null;

    //=========================================================================
    // Public
    //=========================================================================

    SceneTracer.Enable = function () {

        this._enabled = true;

    };

    SceneTracer.Disable = function () {

        this._enabled = false;

    };

    SceneTracer.Toggle = function () {

        this._enabled = !this._enabled;

    };

    SceneTracer.IsEnabled = function () {

        return this._enabled;

    };

    SceneTracer.Clear = function () {

        this._entries.length = 0;

        this._lastScene = null;
        this._lastReady = null;
        this._lastBusy = null;

    };

    SceneTracer.GetEntries = function () {

        return this._entries;

    };

    //=========================================================================
    // Update
    //=========================================================================

    SceneTracer.Update = function () {

        if (!this._enabled)
            return;

        const scene = SceneManager._scene;

        if (!scene)
            return;

        const sceneName = scene.constructor.name;

        if (sceneName !== this._lastScene) {

            this.Trace(
                "Scene Changed",
                {
                    from: this._lastScene,
                    to: sceneName
                }
            );

            this._lastScene = sceneName;

        }

        if (typeof scene.isReady === "function") {

            const ready = scene.isReady();

            if (ready !== this._lastReady) {

                this.Trace(
                    "Scene Ready",
                    {
                        value: ready
                    }
                );

                this._lastReady = ready;

            }

        }

        if (typeof scene.isBusy === "function") {

            const busy = scene.isBusy();

            if (busy !== this._lastBusy) {

                this.Trace(
                    "Scene Busy",
                    {
                        value: busy
                    }
                );

                this._lastBusy = busy;

            }

        }

    };

    //=========================================================================
    // Trace
    //=========================================================================

    SceneTracer.Trace = function (message, data) {

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
                "[SCENE] " + message
            );

        }

    };

    //=========================================================================
    // Helpers
    //=========================================================================

    SceneTracer.Start = function () {

        this.Trace("Scene Start");

    };

    SceneTracer.Ready = function () {

        this.Trace("Scene Ready");

    };

    SceneTracer.Loaded = function () {

        this.Trace("Scene Loaded");

    };

    SceneTracer.Terminate = function () {

        this.Trace("Scene Terminate");

    };

    SceneTracer.FadeIn = function () {

        this.Trace("Fade In");

    };

    SceneTracer.FadeOut = function () {

        this.Trace("Fade Out");

    };

})();