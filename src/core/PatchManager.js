var PatchManager = window.PatchManager || {};

PatchManager.Initialize = function () {
    if (this._initialized) return;
    this._initialized = true;

    this._patches = [];
    Logger.Info("PatchManager initialized.");
};

PatchManager.Register = function (patch) {
    if (!this._patches) this._patches = [];
    if (patch) this._patches.push(patch);
};

PatchManager.RunAll = function () {
    if (!this._patches) return;

    for (var i = 0; i < this._patches.length; i++) {
        var patch = this._patches[i];
        if (patch && typeof patch.Initialize === "function") {
            patch.Initialize();
        }
    }
};

if (typeof window !== "undefined") {
    window.PatchManager = PatchManager;
}