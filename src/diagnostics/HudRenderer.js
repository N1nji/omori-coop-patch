alert("HudRenderer");
var HudRenderer = HudRenderer || {};

(() => {
    "use strict";

    //=========================================================================
    // Constructor
    //=========================================================================

    function HudRenderer(bitmap) {

        this._bitmap = bitmap;

        this._width = bitmap.width;
        this._height = bitmap.height;

        this._padding = 8;
        this._lineHeight = 18;

        this._cursorX = this._padding;
        this._cursorY = this._padding;

        this._headerHeight = 24;
        this._footerHeight = 22;

        this._backgroundColor = "rgba(0,0,0,0.72)";
        this._borderColor = "#00FF88";

        this._titleColor = "#00FF88";
        this._textColor = "#FFFFFF";

        this._successColor = "#6CFF6C";
        this._warningColor = "#FFD54F";
        this._errorColor = "#FF6666";
        this._infoColor = "#66CCFF";

    }

    window.HudRenderer = HudRenderer;

    //=========================================================================
    // Begin / End
    //=========================================================================

    HudRenderer.prototype.Begin = function () {

        this._bitmap.clear();

        this.ResetCursor();

        this.DrawBackground();

    };

    HudRenderer.prototype.End = function () {

    };

    //=========================================================================
    // Background
    //=========================================================================

    HudRenderer.prototype.DrawBackground = function () {

        this._bitmap.fillRect(

            0,
            0,

            this._width,
            this._height,

            this._backgroundColor

        );

        this._bitmap.fillRect(

            0,
            0,

            this._width,
            2,

            this._borderColor

        );

        this._bitmap.fillRect(

            0,
            this._height - 2,

            this._width,
            2,

            this._borderColor

        );

    };

    //=========================================================================
    // Cursor
    //=========================================================================

    HudRenderer.prototype.ResetCursor = function () {

        this._cursorX = this._padding;
        this._cursorY = this._padding;

    };

    HudRenderer.prototype.SetCursor = function (x, y) {

        this._cursorX = x;
        this._cursorY = y;

    };

    HudRenderer.prototype.MoveCursor = function (x, y) {

        this._cursorX += x;
        this._cursorY += y;

    };

    HudRenderer.prototype.Space = function (height) {

        this._cursorY += height || this._lineHeight;

    };

    HudRenderer.prototype.GetCursorX = function () {

        return this._cursorX;

    };

    HudRenderer.prototype.GetCursorY = function () {

        return this._cursorY;

    };

    //=========================================================================
    // Internal Draw
    //=========================================================================

    HudRenderer.prototype.DrawText = function (
        text,
        x,
        y,
        width,
        align,
        color
    ) {

        const previous =
            this._bitmap.textColor;

        this._bitmap.textColor =
            color || this._textColor;

        this._bitmap.drawText(

            String(text),

            x,

            y,

            width,

            this._lineHeight,

            align || "left"

        );

        this._bitmap.textColor =
            previous;

    };

    HudRenderer.prototype.FillRect = function (
        x,
        y,
        width,
        height,
        color
    ) {

        this._bitmap.fillRect(

            x,
            y,
            width,
            height,
            color

        );

    };

        //=========================================================================
    // Header
    //=========================================================================

    HudRenderer.prototype.Header = function (title, subtitle) {

        this.DrawText(

            title,

            this._padding,
            this._cursorY,

            this._width,

            "left",

            this._titleColor

        );

        if (subtitle) {

            this.DrawText(

                subtitle,

                0,

                this._cursorY,

                this._width - this._padding,

                "right",

                this._textColor

            );

        }

        this._cursorY += this._headerHeight;

    };

    //=========================================================================
    // Footer
    //=========================================================================

    HudRenderer.prototype.Footer = function (text) {

        this.DrawText(

            text,

            this._padding,

            this._height - this._footerHeight,

            this._width,

            "left",

            this._textColor

        );

    };

    //=========================================================================
    // Title
    //=========================================================================

    HudRenderer.prototype.Title = function (text) {

        this.Space(4);

        this.DrawText(

            text.toUpperCase(),

            this._padding,

            this._cursorY,

            this._width,

            "left",

            this._titleColor

        );

        this._cursorY += 20;

    };

    //=========================================================================
    // Line
    //=========================================================================

    HudRenderer.prototype.Line = function (
        label,
        value
    ) {

        this.DrawText(

            label,

            this._padding,

            this._cursorY,

            170,

            "left",

            this._textColor

        );

        this.DrawText(

            value,

            180,

            this._cursorY,

            this._width - 190,

            "left",

            this._textColor

        );

        this._cursorY += this._lineHeight;

    };

    //=========================================================================
    // Value
    //=========================================================================

    HudRenderer.prototype.Value = function (
        value,
        color
    ) {

        this.DrawText(

            value,

            this._padding,

            this._cursorY,

            this._width,

            "left",

            color || this._textColor

        );

        this._cursorY += this._lineHeight;

    };

    //=========================================================================
    // Boolean
    //=========================================================================

    HudRenderer.prototype.Boolean = function (
        label,
        value
    ) {

        let color =
            value
                ? this._successColor
                : this._errorColor;

        let text =
            value
                ? "YES"
                : "NO";

        this.DrawText(

            label,

            this._padding,

            this._cursorY,

            170,

            "left",

            this._textColor

        );

        this.DrawText(

            text,

            180,

            this._cursorY,

            this._width - 190,

            "left",

            color

        );

        this._cursorY += this._lineHeight;

    };

    //=========================================================================
    // Key / Value
    //=========================================================================

    HudRenderer.prototype.KeyValue = function (
        key,
        value,
        color
    ) {

        this.DrawText(

            key + ":",

            this._padding,

            this._cursorY,

            120,

            "left",

            this._titleColor

        );

        this.DrawText(

            value,

            125,

            this._cursorY,

            this._width - 130,

            "left",

            color || this._textColor

        );

        this._cursorY += this._lineHeight;

    };

    //=========================================================================
    // Dual Line
    //=========================================================================

    HudRenderer.prototype.DualLine = function (
        left,
        right
    ) {

        this.DrawText(

            left,

            this._padding,

            this._cursorY,

            this._width / 2,

            "left",

            this._textColor

        );

        this.DrawText(

            right,

            0,

            this._cursorY,

            this._width - this._padding,

            "right",

            this._textColor

        );

        this._cursorY += this._lineHeight;

    };

        //=========================================================================
    // Separator
    //=========================================================================

    HudRenderer.prototype.Separator = function () {

        this.Space(4);

        this.FillRect(

            this._padding,

            this._cursorY,

            this._width - (this._padding * 2),

            1,

            "rgba(255,255,255,0.18)"

        );

        this.Space(8);

    };

    //=========================================================================
    // Box
    //=========================================================================

    HudRenderer.prototype.Box = function (
        width,
        height,
        color
    ) {

        width = width || (this._width - (this._padding * 2));
        height = height || this._lineHeight;

        this.FillRect(

            this._padding,

            this._cursorY,

            width,

            height,

            color || "rgba(255,255,255,0.08)"

        );

        this._cursorY += height;

    };

    //=========================================================================
    // Info
    //=========================================================================

    HudRenderer.prototype.Info = function (text) {

        this.Value(

            text,

            this._infoColor

        );

    };

    //=========================================================================
    // Success
    //=========================================================================

    HudRenderer.prototype.Success = function (text) {

        this.Value(

            text,

            this._successColor

        );

    };

    //=========================================================================
    // Warning
    //=========================================================================

    HudRenderer.prototype.Warning = function (text) {

        this.Value(

            text,

            this._warningColor

        );

    };

    //=========================================================================
    // Error
    //=========================================================================

    HudRenderer.prototype.Error = function (text) {

        this.Value(

            text,

            this._errorColor

        );

    };

    //=========================================================================
    // Property
    //=========================================================================

    HudRenderer.prototype.Property = function (
        label,
        value
    ) {

        if (value === undefined ||
            value === null) {

            this.Line(
                label,
                "-"
            );

            return;
        }

        if (typeof value === "boolean") {

            this.Boolean(
                label,
                value
            );

            return;
        }

        this.Line(
            label,
            value
        );

    };

    //=========================================================================
    // Progress
    //=========================================================================

    HudRenderer.prototype.Progress = function (
        label,
        current,
        max
    ) {

        max = Math.max(1, max);

        const percent =
            Math.min(
                current / max,
                1
            );

        this.Line(

            label,

            current + " / " + max

        );

        const width =
            this._width -
            (this._padding * 2);

        this.FillRect(

            this._padding,

            this._cursorY,

            width,

            4,

            "rgba(255,255,255,0.10)"

        );

        this.FillRect(

            this._padding,

            this._cursorY,

            width * percent,

            4,

            this._successColor

        );

        this._cursorY += 10;

    };

    //=========================================================================
    // Badge
    //=========================================================================

    HudRenderer.prototype.Badge = function (
        text,
        color
    ) {

        const width =
            (String(text).length * 8) + 12;

        this.FillRect(

            this._padding,

            this._cursorY,

            width,

            18,

            color || this._titleColor

        );

        this.DrawText(

            text,

            this._padding,

            this._cursorY,

            width,

            "center",

            "#000000"

        );

        this._cursorY += 22;

    };

    //=========================================================================
    // Section
    //=========================================================================

    HudRenderer.prototype.Section = function (title) {

        this.Separator();

        this.Title(title);

    };

    //=========================================================================
    // Empty
    //=========================================================================

    HudRenderer.prototype.Empty = function () {

        this.Space(
            this._lineHeight
        );

    };

    //=========================================================================
    // Divider
    //=========================================================================

    HudRenderer.prototype.Divider = function () {

        this.Separator();

    };

        //=========================================================================
    // Cursor Helpers
    //=========================================================================

    HudRenderer.prototype.NextLine = function () {

        this._cursorY += this._lineHeight;

    };

    HudRenderer.prototype.ResetStyle = function () {

        this._bitmap.textColor = this._textColor;

    };

    //=========================================================================
    // Measurements
    //=========================================================================

    HudRenderer.prototype.GetWidth = function () {

        return this._width;

    };

    HudRenderer.prototype.GetHeight = function () {

        return this._height;

    };

    HudRenderer.prototype.GetPadding = function () {

        return this._padding;

    };

    HudRenderer.prototype.GetLineHeight = function () {

        return this._lineHeight;

    };

    //=========================================================================
    // Theme
    //=========================================================================

    HudRenderer.prototype.SetBackgroundColor = function (color) {

        this._backgroundColor = color;

    };

    HudRenderer.prototype.SetBorderColor = function (color) {

        this._borderColor = color;

    };

    HudRenderer.prototype.SetTitleColor = function (color) {

        this._titleColor = color;

    };

    HudRenderer.prototype.SetTextColor = function (color) {

        this._textColor = color;

    };

    HudRenderer.prototype.SetSuccessColor = function (color) {

        this._successColor = color;

    };

    HudRenderer.prototype.SetWarningColor = function (color) {

        this._warningColor = color;

    };

    HudRenderer.prototype.SetErrorColor = function (color) {

        this._errorColor = color;

    };

    HudRenderer.prototype.SetInfoColor = function (color) {

        this._infoColor = color;

    };

    //=========================================================================
    // State
    //=========================================================================

    HudRenderer.prototype.GetBitmap = function () {

        return this._bitmap;

    };

    HudRenderer.prototype.Clear = function () {

        this._bitmap.clear();

    };

    //=========================================================================
    // Debug
    //=========================================================================

    HudRenderer.prototype.DrawGrid = function (spacing) {

        spacing = spacing || 32;

        for (let x = 0; x < this._width; x += spacing) {

            this.FillRect(

                x,

                0,

                1,

                this._height,

                "rgba(255,255,255,0.06)"

            );

        }

        for (let y = 0; y < this._height; y += spacing) {

            this.FillRect(

                0,

                y,

                this._width,

                1,

                "rgba(255,255,255,0.06)"

            );

        }

    };

    HudRenderer.prototype.DrawBounds = function () {

        this.FillRect(
            0,
            0,
            this._width,
            1,
            "#FF0000"
        );

        this.FillRect(
            0,
            this._height - 1,
            this._width,
            1,
            "#FF0000"
        );

        this.FillRect(
            0,
            0,
            1,
            this._height,
            "#FF0000"
        );

        this.FillRect(
            this._width - 1,
            0,
            1,
            this._height,
            "#FF0000"
        );

    };

    //=========================================================================
    // Utilities
    //=========================================================================

    HudRenderer.prototype.MeasureText = function (text) {

        if (!text)
            return 0;

        return this._bitmap.measureTextWidth(
            String(text)
        );

    };

    HudRenderer.prototype.CenterText = function (text) {

        this.DrawText(

            text,

            0,

            this._cursorY,

            this._width,

            "center",

            this._textColor

        );

        this.NextLine();

    };

    HudRenderer.prototype.RightText = function (text) {

        this.DrawText(

            text,

            0,

            this._cursorY,

            this._width - this._padding,

            "right",

            this._textColor

        );

        this.NextLine();

    };

    //=========================================================================
    // Version
    //=========================================================================

    HudRenderer.VERSION = "1.0.0";

})();