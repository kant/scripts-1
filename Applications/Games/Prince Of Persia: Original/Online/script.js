include("engines.wine.quick_script.zip_script");

new ZipScript()
    .name("Prince Of Persia: Original")
    .editor("Broderbund Softwared")
    .applicationHomepage("")
    .author("Quentin PÂRIS")
    .url("https://repository.playonlinux.com/divers/oldware/prince.zip")
    .checksum("6c4148233f840011715c351c399d35b0fc716ae7")
    .category("Games")
    .wineVersion(LATEST_DOS_SUPPORT_VERSION)
    .wineDistribution("dos_support")
    .executable("PRINCE.EXE");
