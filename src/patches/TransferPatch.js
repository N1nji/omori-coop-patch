var TransferPatch = window.TransferPatch || {};

TransferPatch.Initialize = function () {
    if (this._initialized) return;
    this._initialized = true;

    this._tag = "[CoopEnhanced][Transfer]";

    this._hookReserveTransfer();
    this._hookPerformTransfer();
    this._hookClearTransferInfo();
    this._hookGather();

    Logger.Info(this._tag, "initialized.");
};

TransferPatch._log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Info) Logger.Info.apply(Logger, args);
    else if (console && console.log) console.log.apply(console, args);
};

TransferPatch._warn = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Warn) Logger.Warn.apply(Logger, args);
    else if (console && console.warn) console.warn.apply(console, args);
    else if (console && console.log) console.log.apply(console, args);
};

TransferPatch._error = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Error) Logger.Error.apply(Logger, args);
    else if (console && console.error) console.error.apply(console, args);
    else if (console && console.log) console.log.apply(console, args);
};

TransferPatch._trace = function (name, data) {
    if (typeof DebugHud !== "undefined") {
        DebugHud.Mark(name, data);
    }
    this._warn(name);
    this._dumpState("TRACE: " + name);
};

TransferPatch._dumpState = function (stage) {
    try {
        this._log("---- " + stage + " ----");

        var sceneName = "UnknownScene";
        if (window.SceneManager && SceneManager._scene && SceneManager._scene.constructor) {
            sceneName = SceneManager._scene.constructor.name || "UnknownScene";
        }

        this._log("Scene:", sceneName);
        this._log("Map:", window.$gameMap ? $gameMap._mapId : null);

        if (window.$gamePlayer) {
            this._log("P1:", {
                x: $gamePlayer._x,
                y: $gamePlayer._y,
                realX: $gamePlayer._realX,
                realY: $gamePlayer._realY,
                direction: $gamePlayer._direction,
                moving: typeof $gamePlayer.isMoving === "function" ? $gamePlayer.isMoving() : null,
                jumping: typeof $gamePlayer.isJumping === "function" ? $gamePlayer.isJumping() : null,
                transferring: typeof $gamePlayer.isTransferring === "function" ? $gamePlayer.isTransferring() : null,
                followersGathering: typeof $gamePlayer.areFollowersGathering === "function" ? $gamePlayer.areFollowersGathering() : null
            });
        }

        if (window.$allPlayers && $allPlayers.length) {
            for (var i = 0; i < $allPlayers.length; i++) {
                var p = $allPlayers[i];
                if (!p) continue;

                this._log("P" + (i + 1) + ":", {
                    x: p._x,
                    y: p._y,
                    realX: p._realX,
                    realY: p._realY,
                    moving: typeof p.isMoving === "function" ? p.isMoving() : null,
                    jumping: typeof p.isJumping === "function" ? p.isJumping() : null,
                    transferring: typeof p.isTransferring === "function" ? p.isTransferring() : null
                });
            }
        }

        this._log("----------------------");
    } catch (e) {
        this._error("State dump failed:", e);
    }
};

TransferPatch._hookReserveTransfer = function () {
    if (!Game_Player || !Game_Player.prototype) return;
    if (Game_Player.prototype._coopEnhancedReserveTransferHooked) return;
    Game_Player.prototype._coopEnhancedReserveTransferHooked = true;

    this._originalReserveTransfer = Game_Player.prototype.reserveTransfer;

    var self = this;
    Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
        self._trace("reserveTransfer", {
            mapId: mapId,
            x: x,
            y: y,
            direction: d,
            fadeType: fadeType
        });

        return self._originalReserveTransfer.apply(this, arguments);
    };
};

TransferPatch._hookPerformTransfer = function () {
    if (!Game_Player || !Game_Player.prototype) return;
    if (Game_Player.prototype._coopEnhancedPerformTransferHooked) return;
    Game_Player.prototype._coopEnhancedPerformTransferHooked = true;

    this._originalPerformTransfer = Game_Player.prototype.performTransfer;

    var self = this;
    Game_Player.prototype.performTransfer = function () {
        self._trace("performTransfer");
        return self._originalPerformTransfer.apply(this, arguments);
    };
};

TransferPatch._hookClearTransferInfo = function () {
    if (!Game_Player || !Game_Player.prototype) return;
    if (Game_Player.prototype._coopEnhancedClearTransferInfoHooked) return;
    Game_Player.prototype._coopEnhancedClearTransferInfoHooked = true;

    this._originalClearTransferInfo = Game_Player.prototype.clearTransferInfo;

    var self = this;
    Game_Player.prototype.clearTransferInfo = function () {
        self._trace("clearTransferInfo");
        return self._originalClearTransferInfo.apply(this, arguments);
    };
};

TransferPatch._hookGather = function () {
    if (!Game_Followers || !Game_Followers.prototype) return;
    if (Game_Followers.prototype._coopEnhancedGatherHooked) return;
    Game_Followers.prototype._coopEnhancedGatherHooked = true;

    this._originalGather = Game_Followers.prototype.gather;

    var self = this;
    Game_Followers.prototype.gather = function () {
        self._trace("Game_Followers.gather");
        return self._originalGather.apply(this, arguments);
    };
};

if (typeof window !== "undefined") {
    window.TransferPatch = TransferPatch;
}