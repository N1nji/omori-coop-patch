var PluginPatch = PluginPatch || {};

(() => {

    "use strict";

    //=========================================================================
    // Constants
    //=========================================================================

    const VERSION = "1.0.0";

    //=========================================================================
    // State
    //=========================================================================

    PluginPatch.VERSION = VERSION;

    PluginPatch._patches = {};

    //=========================================================================
    // Public
    //=========================================================================

    PluginPatch.Register = function (name) {

        if (!name)
            return;

        if (this._patches[name])
            return;

        this._patches[name] = {

            name: name,

            enabled: true,

            installed: false,

            calls: 0,

            errors: 0,

            totalTime: 0,

            averageTime: 0,

            maxTime: 0,

            lastCall: null

        };

    };

    PluginPatch.Install = function (name) {

        this.Register(name);

        this._patches[name].installed = true;

    };

    PluginPatch.Enable = function (name) {

        this.Register(name);

        this._patches[name].enabled = true;

    };

    PluginPatch.Disable = function (name) {

        this.Register(name);

        this._patches[name].enabled = false;

    };

    PluginPatch.IsEnabled = function (name) {

        return this._patches[name]
            ? this._patches[name].enabled
            : false;

    };

    PluginPatch.Begin = function (name) {

        this.Register(name);

        this._patches[name]._startTime =
            performance.now();

    };

    PluginPatch.End = function (name) {

        const patch =
            this._patches[name];

        if (!patch)
            return;

        const elapsed =
            performance.now() - patch._startTime;

        patch.calls++;

        patch.lastCall =
            Graphics.frameCount;

        patch.totalTime += elapsed;

        patch.averageTime =
            patch.totalTime / patch.calls;

        if (elapsed > patch.maxTime) {

            patch.maxTime = elapsed;

        }

    };

    PluginPatch.Error = function (name) {

        this.Register(name);

        this._patches[name].errors++;

    };

    PluginPatch.Reset = function () {

        Object.values(this._patches)
            .forEach(patch => {

                patch.calls = 0;

                patch.errors = 0;

                patch.totalTime = 0;

                patch.averageTime = 0;

                patch.maxTime = 0;

                patch.lastCall = null;

            });

    };

    PluginPatch.Get = function (name) {

        return this._patches[name] || null;

    };

    PluginPatch.GetAll = function () {

        return Object.values(
            this._patches
        );

    };

})();