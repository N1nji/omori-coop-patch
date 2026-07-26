alert("Debug");
var Debug = window.Debug || {};

Debug.Initialize = function () {
    if (this._initialized) return;
    this._initialized = true;

    this._enabled = true;
    this._stateDumpEnabled = true;

    Logger.Info("Debug initialized.");
};

Debug.SetEnabled = function (enabled) {
    this._enabled = !!enabled;
};

Debug.SetStateDumpEnabled = function (enabled) {
    this._stateDumpEnabled = !!enabled;
};

Debug.Log = function () {
    if (!this._enabled) return;
    Logger.Info.apply(Logger, arguments);
};

Debug.Warn = function () {
    if (!this._enabled) return;
    Logger.Warn.apply(Logger, arguments);
};

Debug.Error = function () {
    if (!this._enabled) return;
    Logger.Error.apply(Logger, arguments);
};

Debug.DumpScene = function () {
    if (!this._enabled || !this._stateDumpEnabled) return;

    try {
        var sceneName = "UnknownScene";
        if (window.SceneManager && SceneManager._scene && SceneManager._scene.constructor) {
            sceneName = SceneManager._scene.constructor.name || "UnknownScene";
        }

        Logger.Group("Scene Dump");
        Logger.Info("Scene:", sceneName);
        Logger.Info("Map:", window.$gameMap ? $gameMap._mapId : null);
        Logger.Info("In battle:", window.$gameParty ? $gameParty.inBattle() : null);
        Logger.GroupEnd();
    } catch (e) {
        Logger.Error("DumpScene failed:", e);
    }
};

Debug.DumpPlayer = function (player, label) {
    if (!this._enabled || !this._stateDumpEnabled) return;

    try {
        if (!player) {
            Logger.Warn(label || "Player", "is null");
            return;
        }

        Logger.Group(label || "Player Dump");
        Logger.Info({
            x: player._x,
            y: player._y,
            realX: player._realX,
            realY: player._realY,
            direction: player._direction,
            moving: typeof player.isMoving === "function" ? player.isMoving() : null,
            jumping: typeof player.isJumping === "function" ? player.isJumping() : null,
            transferring: typeof player.isTransferring === "function" ? player.isTransferring() : null,
            through: typeof player.isThrough === "function" ? player.isThrough() : null,
            transparent: typeof player.isTransparent === "function" ? player.isTransparent() : null
        });
        Logger.GroupEnd();
    } catch (e) {
        Logger.Error("DumpPlayer failed:", e);
    }
};

Debug.DumpAllPlayers = function () {
    if (!this._enabled || !this._stateDumpEnabled) return;

    try {
        Logger.Group("All Players Dump");

        this.DumpScene();

        if (window.$gamePlayer) {
            this.DumpPlayer($gamePlayer, "P1");
        }

        if (window.$allPlayers && $allPlayers.length) {
            for (var i = 0; i < $allPlayers.length; i++) {
                var p = $allPlayers[i];
                if (!p || p === $gamePlayer) continue;
                this.DumpPlayer(p, "P" + (i + 1));
            }
        }

        Logger.GroupEnd();
    } catch (e) {
        Logger.Error("DumpAllPlayers failed:", e);
    }
};

Debug.Trace = function (label) {
    if (!this._enabled) return;
    Logger.Info(label);
    this.DumpAllPlayers();
};

if (typeof window !== "undefined") {
    window.Debug = Debug;
}