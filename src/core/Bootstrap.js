alert("Bootstrap");
var Bootstrap = window.Bootstrap || {};
window.Bootstrap = Bootstrap;
Bootstrap.Initialize = function () {

    Logger.Initialize();
    Debug.Initialize();

    PatchManager.Initialize();

    PluginPatch.Register("TransferPatch");
    PluginPatch.Register("CutscenePatch");
    PluginPatch.Register("EventPatch");
    PluginPatch.Register("SoftlockPatch");

    TransferPatch.Initialize();
    CutscenePatch.Initialize();
    EventPatch.Initialize();
    SoftlockPatch.Initialize();
    HudLayout.Initialize();

    DebugHud.Initialize();

};