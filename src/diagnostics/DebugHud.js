var DebugHud = window.DebugHud || {};

(() => {

    "use strict";

    //=========================================================================
    // Constants
    //=========================================================================

    DebugHud.VERSION = "5.1.0";

    //=========================================================================
    // State
    //=========================================================================

    DebugHud._initialized = false;

    DebugHud._enabled = true;

    DebugHud._visible = false;

    DebugHud._attached = false;

    DebugHud._sprite = null;

    DebugHud._bitmap = null;

    DebugHud._renderer = null;

    //=========================================================================
    // Panels
    //=========================================================================

    DebugHud._panels = [];

    DebugHud._currentPage = 0;

    //=========================================================================
    // Marks
    //=========================================================================

    DebugHud._marks = [];

    DebugHud._maxMarks = 30;

    DebugHud._markLifetime = 300;

    //=========================================================================
    // Initialize
    //=========================================================================

    DebugHud.Initialize = function () {

        if (this._initialized)
            return;

        this._initialized = true;

        this.RegisterDefaultPanels();

        this.InstallHooks();

        Logger.Info("[DebugHud] Initialized.");

    };

    //=========================================================================
    // Panels
    //=========================================================================

    DebugHud.RegisterPanel = function (panel) {

        if (!panel)
            return;

        this._panels.push(panel);

        this._panels.sort(function (a, b) {

            return a.GetOrder() - b.GetOrder();

        });

    };

    DebugHud.RegisterDefaultPanels = function () {

        if (typeof ScenePanel !== "undefined")
            this.RegisterPanel(new ScenePanel());

        if (typeof PlayersPanel !== "undefined")
            this.RegisterPanel(new PlayersPanel());

        if (typeof TransferPanel !== "undefined")
            this.RegisterPanel(new TransferPanel());

        if (typeof EventPanel !== "undefined")
            this.RegisterPanel(new EventPanel());

        if (typeof SoftlockPanel !== "undefined")
            this.RegisterPanel(new SoftlockPanel());

    };

    //=========================================================================
    // Pages
    //=========================================================================

    DebugHud.GetPageCount = function () {

        return this._panels.length;

    };

    DebugHud.GetCurrentPage = function () {

        return this._currentPage;

    };

    DebugHud.GetCurrentPanel = function () {

        if (!this._panels.length)
            return null;

        return this._panels[this._currentPage];

    };

    DebugHud.NextPage = function () {

        if (!this._panels.length)
            return;

        this._currentPage++;

        if (this._currentPage >= this._panels.length)
            this._currentPage = 0;

        const panel = this.GetCurrentPanel();

        if (panel) {

            Logger.Info(

                "[DebugHud] Page -> " +

                panel.GetName()

            );

        }

    };

    DebugHud.PreviousPage = function () {

        if (!this._panels.length)
            return;

        this._currentPage--;

        if (this._currentPage < 0)
            this._currentPage = this._panels.length - 1;

        const panel = this.GetCurrentPanel();

        if (panel) {

            Logger.Info(

                "[DebugHud] Page -> " +

                panel.GetName()

            );

        }

    };

    //=========================================================================
    // Marks
    //=========================================================================

    DebugHud.Mark = function (name, data) {

        this._marks.push({

            frame: Graphics.frameCount,

            name: name,

            data: data

        });

        while (this._marks.length > this._maxMarks) {

            this._marks.shift();

        }

    };

    DebugHud.ClearMarks = function () {

        this._marks.length = 0;

    };

    DebugHud.UpdateMarks = function () {

        const frame = Graphics.frameCount;

        this._marks = this._marks.filter(function (mark) {

            return (frame - mark.frame) <= DebugHud._markLifetime;

        });

    };

    DebugHud.DrawMarks = function () {

        if (!this._renderer)
            return;

        if (!this._marks.length)
            return;

        this._renderer.Section(

            "Recent Events (" +

            this._marks.length +

            ")"

        );

        for (const mark of this._marks) {

            let value = "-";

            if (mark.data != null) {

                try {

                    value = JSON.stringify(mark.data);

                }

                catch (e) {

                    value = String(mark.data);

                }

            }

            this._renderer.KeyValue(

                mark.name,

                value

            );

        }

    };
    //=========================================================================
    // Hooks
    //=========================================================================

    DebugHud.InstallHooks = function () {

        this.HookSceneStart();

        this.HookSceneUpdate();

        this.HookInput();

    };

    //=========================================================================
    // Scene Start
    //=========================================================================

    DebugHud.HookSceneStart = function () {

        if (!window.Scene_Base)
            return;

        if (Scene_Base.prototype._coopEnhancedDebugHudStart)
            return;

        Scene_Base.prototype._coopEnhancedDebugHudStart = true;

        const original = Scene_Base.prototype.start;

        Scene_Base.prototype.start = function () {

            original.apply(this, arguments);

            DebugHud._attached = false;

            DebugHud._sprite = null;

            DebugHud._bitmap = null;

            DebugHud._renderer = null;

        };

    };

    //=========================================================================
    // Scene Update
    //=========================================================================

    DebugHud.HookSceneUpdate = function () {

        if (!window.Scene_Map)
            return;

        if (Scene_Map.prototype._coopEnhancedDebugHudUpdate)
            return;

        Scene_Map.prototype._coopEnhancedDebugHudUpdate = true;

        const original = Scene_Map.prototype.update;

        Scene_Map.prototype.update = function () {

            original.apply(this, arguments);

            DebugHud.Update();

        };

    };

    //=========================================================================
    // Keyboard
    //=========================================================================

    DebugHud.HookInput = function () {

        if (this._keyboardInstalled)
            return;

        this._keyboardInstalled = true;

        document.addEventListener(

            "keydown",

            function (event) {

                if (event.repeat)
                    return;

                switch (event.code) {

                    //---------------------------------------------------------
                    // Toggle HUD
                    //---------------------------------------------------------

                    case "F9":

                        event.preventDefault();

                        DebugHud.Toggle();

                        break;

                    //---------------------------------------------------------
                    // Next / Previous Page
                    //---------------------------------------------------------

                    case "Tab":

                        event.preventDefault();

                        if (!DebugHud._visible)
                            return;

                        if (event.shiftKey)
                            DebugHud.PreviousPage();
                        else
                            DebugHud.NextPage();

                        break;

                }

            }

        );

    };
    //=========================================================================
    // Sprite
    //=========================================================================

    DebugHud.Attach = function () {

        if (this._attached)
            return;

        const scene = SceneManager._scene;

        if (!scene)
            return;

        const panel = HudLayout.GetBestPanel();

        this._bitmap = new Bitmap(500, 340);

        this._sprite = new Sprite(this._bitmap);

        this._sprite.x = panel.x;
        this._sprite.y = panel.y;
        this._sprite.z = 999999;

        this._sprite.visible = this._visible;

        scene.addChild(this._sprite);

        this._renderer = new HudRenderer(this._bitmap);

        this._attached = true;

        Logger.Info("[DebugHud] Attached.");

    };

    //=========================================================================
    // Detach
    //=========================================================================

    DebugHud.Detach = function () {

        if (!this._attached)
            return;

        if (this._sprite) {

            if (this._sprite.parent)
                this._sprite.parent.removeChild(this._sprite);

        }

        this._sprite = null;

        this._bitmap = null;

        this._renderer = null;

        this._attached = false;

        Logger.Info("[DebugHud] Detached.");

    };

    //=========================================================================
    // Toggle
    //=========================================================================

    DebugHud.Toggle = function () {

        this._visible = !this._visible;

        if (this._sprite)
            this._sprite.visible = this._visible;

        Logger.Info(

            "[DebugHud] " +

            (this._visible ? "Enabled" : "Disabled")

        );

    };

    //=========================================================================
    // Update
    //=========================================================================

    DebugHud.Update = function () {

        if (!this._enabled)
            return;

        if (!SceneManager._scene)
            return;

        if (!this._attached)
            this.Attach();

        if (!this._renderer)
            return;

        if (!this._visible)
            return;

        this.UpdateMarks();

        this._renderer.Begin();

        this.DrawHeader();

        //-------------------------------------------------------------
        // Current Page
        //-------------------------------------------------------------

        const panel = this.GetCurrentPanel();

        if (panel &&
            panel.IsEnabled() &&
            panel.IsVisible()) {

            try {

                panel.Draw(this._renderer);

            }

            catch (e) {

                Logger.Error(e);

                this._renderer.Error(

                    panel.GetName()

                );

                this._renderer.Error(

                    e.message

                );

            }

        }

        //-------------------------------------------------------------
        // Shared Info
        //-------------------------------------------------------------

        this.DrawMarks();

        this.DrawFooter();

        this._renderer.End();

    };
    //=========================================================================
    // Header
    //=========================================================================

    DebugHud.DrawHeader = function () {

        this._renderer.Header(

            "OMORI Coop Enhanced",

            "v" + this.VERSION

        );

        const panel = this.GetCurrentPanel();

        if (!panel)
            return;

        this._renderer.Title(

            "< " +

            panel.GetName() +

            " (" +

            (this.GetCurrentPage() + 1) +

            "/" +

            this.GetPageCount() +

            ") >"

        );

    };

    //=========================================================================
    // Footer
    //=========================================================================

    DebugHud.DrawFooter = function () {

        this._renderer.Footer(

            "F9 Toggle | TAB Next | SHIFT+TAB Previous"

        );

    };

})();