var EventPatch = window.EventPatch || {};

EventPatch.Initialize = function () {
    if (this._initialized) return;
    this._initialized = true;

    this._tag = "[CoopEnhanced][Event]";

    this._hookCommand201();

    Logger.Info(this._tag, "initialized.");
};

EventPatch._log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Info) Logger.Info.apply(Logger, args);
    else if (console && console.log) console.log.apply(console, args);
};

EventPatch._warn = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._tag);

    if (Logger && Logger.Warn) Logger.Warn.apply(Logger, args);
    else if (console && console.warn) console.warn.apply(console, args);
    else if (console && console.log) console.log.apply(console, args);
};

EventPatch._hookCommand201 = function () {
    if (!Game_Interpreter || !Game_Interpreter.prototype) return;
    if (Game_Interpreter.prototype._coopEnhancedCommand201Hooked) return;
    Game_Interpreter.prototype._coopEnhancedCommand201Hooked = true;

    this._originalCommand201 = Game_Interpreter.prototype.command201;

    var self = this;
    Game_Interpreter.prototype.command201 = function () {
        self._warn("command201 (Transfer Player)");

        self._log("Interpreter state:", {
            eventId: this._eventId,
            index: this._index,
            mapId: window.$gameMap ? $gameMap._mapId : null
        });

        if (typeof Debug !== "undefined" && Debug.DumpAllPlayers) {
            Debug.DumpAllPlayers();
        }

        return self._originalCommand201.apply(this, arguments);
    };
};

if (typeof window !== "undefined") {
    window.EventPatch = EventPatch;
}