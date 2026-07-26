var CutscenePatch = window.CutscenePatch || {};

CutscenePatch.Initialize = function () {
    if (this._initialized) return;
    this._initialized = true;

    this._tag = "[CoopEnhanced][Scene]";

    this._hookSceneMapStart();
    this._hookSceneMapIsReady();
    this._hookSceneMapOnMapLoaded();

    Logger.Info(this._tag, "initialized.");
};

CutscenePatch._log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Info) Logger.Info.apply(Logger, args);
    else if (console && console.log) console.log.apply(console, args);
};

CutscenePatch._warn = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Warn) Logger.Warn.apply(Logger, args);
    else if (console && console.warn) console.warn.apply(console, args);
    else if (console && console.log) console.log.apply(console, args);
};

CutscenePatch._hookSceneMapStart = function () {
    if (!Scene_Map || !Scene_Map.prototype) return;
    if (Scene_Map.prototype._coopEnhancedStartHooked) return;
    Scene_Map.prototype._coopEnhancedStartHooked = true;

    this._originalStart = Scene_Map.prototype.start;

    var self = this;
    Scene_Map.prototype.start = function () {
        self._warn("Scene_Map.start");
        if (typeof Debug !== "undefined" && Debug.DumpScene) Debug.DumpScene();
        return self._originalStart.apply(this, arguments);
    };
};

CutscenePatch._hookSceneMapIsReady = function () {
    if (!Scene_Map || !Scene_Map.prototype) return;
    if (Scene_Map.prototype._coopEnhancedIsReadyHooked) return;
    Scene_Map.prototype._coopEnhancedIsReadyHooked = true;

    this._originalIsReady = Scene_Map.prototype.isReady;

    var self = this;
    Scene_Map.prototype.isReady = function () {
        var result = self._originalIsReady.apply(this, arguments);
        self._log("Scene_Map.isReady =", result);
        return result;
    };
};

CutscenePatch._hookSceneMapOnMapLoaded = function () {
    if (!Scene_Map || !Scene_Map.prototype) return;
    if (Scene_Map.prototype._coopEnhancedOnMapLoadedHooked) return;
    Scene_Map.prototype._coopEnhancedOnMapLoadedHooked = true;

    this._originalOnMapLoaded = Scene_Map.prototype.onMapLoaded;

    var self = this;
    Scene_Map.prototype.onMapLoaded = function () {
        self._warn("Scene_Map.onMapLoaded");
        if (typeof Debug !== "undefined" && Debug.DumpScene) Debug.DumpScene();
        return self._originalOnMapLoaded.apply(this, arguments);
    };
};

if (typeof window !== "undefined") {
    window.CutscenePatch = CutscenePatch;
}