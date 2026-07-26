var SoftlockPatch = window.SoftlockPatch || {};

SoftlockPatch.Initialize = function () {
    if (this._initialized) return;
    this._initialized = true;

    this._tag = "[CoopEnhanced][Softlock]";
    this._frameCount = 0;
    this._lastSignature = "";
    this._stableFrames = 0;
    this._thresholdFrames = 180; // ~3 seconds at 60fps

    this._hookSceneMapUpdate();
    this._hookGamePlayerCanMove();
    this._hookSceneMapStart();

    Logger.Info(this._tag, "initialized.");
};

SoftlockPatch._log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Info) Logger.Info.apply(Logger, args);
    else if (console && console.log) console.log.apply(console, args);
};

SoftlockPatch._warn = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Warn) Logger.Warn.apply(Logger, args);
    else if (console && console.warn) console.warn.apply(console, args);
    else if (console && console.log) console.log.apply(console, args);
};

SoftlockPatch._error = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Error) Logger.Error.apply(Logger, args);
    else if (console && console.error) console.error.apply(console, args);
    else if (console && console.log) console.log.apply(console, args);
};

SoftlockPatch._getSceneName = function () {
    try {
        if (window.SceneManager && SceneManager._scene && SceneManager._scene.constructor) {
            return SceneManager._scene.constructor.name || "UnknownScene";
        }
    } catch (e) {}
    return "UnknownScene";
};

SoftlockPatch._buildSignature = function () {
    try {
        var sceneName = this._getSceneName();
        var mapId = window.$gameMap ? $gameMap._mapId : "null";

        var parts = [
            "scene:" + sceneName,
            "map:" + mapId
        ];

        if (window.$gamePlayer) {
            parts.push("p1:" + [
                $gamePlayer._x,
                $gamePlayer._y,
                $gamePlayer._realX,
                $gamePlayer._realY,
                typeof $gamePlayer.isMoving === "function" ? $gamePlayer.isMoving() : "na",
                typeof $gamePlayer.isTransferring === "function" ? $gamePlayer.isTransferring() : "na",
                typeof $gamePlayer.isJumping === "function" ? $gamePlayer.isJumping() : "na"
            ].join(","));
        }

        if (window.$allPlayers && $allPlayers.length) {
            for (var i = 0; i < $allPlayers.length; i++) {
                var p = $allPlayers[i];
                if (!p) continue;

                parts.push("p" + (i + 1) + ":" + [
                    p._x,
                    p._y,
                    p._realX,
                    p._realY,
                    typeof p.isMoving === "function" ? p.isMoving() : "na",
                    typeof p.isTransferring === "function" ? p.isTransferring() : "na",
                    typeof p.isJumping === "function" ? p.isJumping() : "na"
                ].join(","));
            }
        }

        return parts.join("|");
    } catch (e) {
        return "signature-error:" + e.message;
    }
};

SoftlockPatch._dumpState = function (reason) {
    try {
        this._warn("SOFTLOCK SUSPECTED:", reason);

        if (typeof Debug !== "undefined" && Debug.DumpAllPlayers) {
            Debug.DumpAllPlayers();
        } else {
            this._log("Scene:", this._getSceneName());
            this._log("Map:", window.$gameMap ? $gameMap._mapId : null);

            if (window.$gamePlayer) {
                this._log("P1:", {
                    x: $gamePlayer._x,
                    y: $gamePlayer._y,
                    realX: $gamePlayer._realX,
                    realY: $gamePlayer._realY,
                    moving: typeof $gamePlayer.isMoving === "function" ? $gamePlayer.isMoving() : null,
                    transferring: typeof $gamePlayer.isTransferring === "function" ? $gamePlayer.isTransferring() : null,
                    jumping: typeof $gamePlayer.isJumping === "function" ? $gamePlayer.isJumping() : null
                });
            }
        }
    } catch (e) {
        this._error("Dump failed:", e);
    }
};

SoftlockPatch._tickWatchdog = function () {
    var signature = this._buildSignature();

    if (signature === this._lastSignature) {
        this._stableFrames++;
    } else {
        this._lastSignature = signature;
        this._stableFrames = 0;
    }

    if (this._stableFrames === this._thresholdFrames) {
        this._dumpState("State unchanged for " + this._thresholdFrames + " frames");
    }
};

SoftlockPatch._hookSceneMapUpdate = function () {
    if (!Scene_Map || !Scene_Map.prototype) return;
    if (Scene_Map.prototype._coopEnhancedSoftlockUpdateHooked) return;
    Scene_Map.prototype._coopEnhancedSoftlockUpdateHooked = true;

    this._originalSceneMapUpdate = Scene_Map.prototype.update;

    var self = this;
    Scene_Map.prototype.update = function () {
        var result = self._originalSceneMapUpdate.apply(this, arguments);
        self._frameCount++;
        self._tickWatchdog();
        return result;
    };
};

SoftlockPatch._hookGamePlayerCanMove = function () {
    if (!Game_Player || !Game_Player.prototype) return;
    if (Game_Player.prototype._coopEnhancedSoftlockCanMoveHooked) return;
    Game_Player.prototype._coopEnhancedSoftlockCanMoveHooked = true;

    this._originalCanMove = Game_Player.prototype.canMove;

    var self = this;
    Game_Player.prototype.canMove = function () {
        var result = self._originalCanMove.apply(this, arguments);

        if (result === false && self._stableFrames % 60 === 0) {
            self._log("Game_Player.canMove() => false");
            self._dumpState("canMove returned false");
        }

        return result;
    };
};

SoftlockPatch._hookSceneMapStart = function () {
    if (!Scene_Map || !Scene_Map.prototype) return;
    if (Scene_Map.prototype._coopEnhancedSoftlockStartHooked) return;
    Scene_Map.prototype._coopEnhancedSoftlockStartHooked = true;

    this._originalSceneMapStart = Scene_Map.prototype.start;

    var self = this;
    Scene_Map.prototype.start = function () {
        self._log("Scene_Map.start");
        self._lastSignature = "";
        self._stableFrames = 0;
        return self._originalSceneMapStart.apply(this, arguments);
    };
};

if (typeof window !== "undefined") {
    window.SoftlockPatch = SoftlockPatch;
}