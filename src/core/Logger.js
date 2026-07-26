alert("Logger carregou");
var Logger = window.Logger || {};

Logger.Initialize = function () {
    if (this._initialized) return;
    this._initialized = true;

    this._enabled = true;
    this._prefix = "[CoopEnhanced]";

    this.Info("Logger initialized.");
};

Logger.SetEnabled = function (enabled) {
    this._enabled = !!enabled;
};

Logger.SetPrefix = function (prefix) {
    if (typeof prefix === "string" && prefix.length > 0) {
        this._prefix = prefix;
    }
};

Logger._write = function (method, args) {
    if (!this._enabled) return;

    var list = Array.prototype.slice.call(args);
    list.unshift(this._prefix);

    if (console && console[method]) {
        console[method].apply(console, list);
    } else if (console && console.log) {
        console.log.apply(console, list);
    }
};

Logger.Info = function () {
    this._write("log", arguments);
};

Logger.Warn = function () {
    this._write("warn", arguments);
};

Logger.Error = function () {
    this._write("error", arguments);
};

Logger.Debug = function () {
    this._write("log", arguments);
};

Logger.Group = function (label) {
    if (!this._enabled) return;
    if (console && console.group) {
        console.group(this._prefix + " " + label);
    }
};

Logger.GroupEnd = function () {
    if (!this._enabled) return;
    if (console && console.groupEnd) {
        console.groupEnd();
    }
};

if (typeof window !== "undefined") {
    window.Logger = Logger;
}