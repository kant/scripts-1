include("engines.wine.quick_script.local_installer_script");
include("utils.functions.net.download");
include("utils.functions.filesystem.extract");
include("utils.functions.filesystem.files");
include("engines.wine.verbs.amstream");
include("engines.wine.verbs.quartz");
include("engines.wine.verbs.devenum");
include("engines.wine.verbs.d3drm");

new LocalInstallerScript()
    .name("Lego Rock Raiders")
    .editor("LEGO Media")
    .author("Zemogiter")
    .category("Games")
    .executable("LegoRR.exe")
    .wineVersion("3.0.3")
    .wineDistribution("upstream")
    .preInstall(function (wine, wizard) {
        wine.amstream();
        wine.quartz();
        wine.devenum();
        wine.d3drm();
        wizard.message(tr("When the game ask to install DirectX Media click yes. Click no when it ask for DirectX 6."));
    })
    .postInstall(function (wine, wizard) {
        wizard.message(
            tr(
                "This game needs a copy protection patch to work. It may be illegal in your country to patch copy protection. You must patch the game yourself."
            )
        );
        var zipLocation = wine.prefixDirectory() + "drive_c/RockRaidersCodec_490085.zip";
        new Downloader()
            .wizard(wizard)
            .url("http://rrubucket.s3.amazonaws.com/RockRaidersCodec_490085.zip")
            .checksum("991a343dc608c6a1914127a55f2e5b47")
            .algorithm("MD5")
            .to(zipLocation)
            .get();
        new Extractor()
            .wizard(wizard)
            .archive(wine.prefixDirectory() + "/drive_c/RockRaidersCodec_490085.zip")
            .to(wine.prefixDirectory() + "/drive_c/RockRaidersCodec/")
            .extract(["-F", "iv5setup.exe"]);
        wizard.message(
            tr(
                "When installing Indeo codecs you must choose custom installation type. Then uncheck ownload DirectShow filter and Indeo 5 Netscape Browser Extension or else the installer will crash."
            )
        );
        wine.run(wine.prefixDirectory() + "/drive_c/RockRaidersCodec/iv5setup.exe");
        wine.wait();
    });
