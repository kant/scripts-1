include("engines.wine.quick_script.steam_script");
include("engines.wine.plugins.virtual_desktop");

new SteamScript()
    .name("Tom Clancy's Rainbow Six® 3 Gold")
    .editor("Red Storm Entertainment")
    .author("ImperatorS79")
    .appId(19830)
    .postInstall(function (wine /*, wizard*/) {
        wine.setVirtualDesktop(1280, 1024);
    });
