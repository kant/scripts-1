include("engines.wine.engine.object");

const ShortcutInfoDTOBuilderClass = Java.type("org.phoenicis.library.dto.ShortcutInfoDTO.Builder");
const ShortcutDTOBuilderClass = Java.type("org.phoenicis.library.dto.ShortcutDTO.Builder");

/**
 * WineShortcut prototype
 */
// eslint-disable-next-line no-unused-vars
class WineShortcut {
    constructor() {
        this._shortcutManager = Bean("shortcutManager");
        this._appsManager = Bean("repositoryManager");
        this._fileSearcher = Bean("fileSearcher");
        this._winePrefixesDirectory =
            Bean("propertyReader").getProperty("application.user.containers") + "/" + WINE_PREFIX_DIR + "/";

        this._category = "Other";
        this._description = "";
    }

    /**
     * Sets the shortcut name
     *
     * @param {string} name The shortcut name
     * @returns {WineShortcut} The WineShortcut object
     */
    name(name) {
        this._name = name;
        return this;
    }

    /**
     * Sets the shortcut type
     *
     * @param {string} type The shortcut type
     * @returns {WineShortcut} The WineShortcut object
     */
    type(type) {
        this._type = type;
        return this;
    }

    /**
     * Sets the shortcut category
     *
     * @param {string} category The shortcut category
     * @returns {WineShortcut} The WineShortcut object
     */
    category(category) {
        this._category = category;
        return this;
    }

    /**
     * Sets the shortcut description
     *
     * @param {string} description The shortcut description
     * @returns {WineShortcut} The WineShortcut object
     */
    description(description) {
        this._description = description;
        return this;
    }

    /**
     * Sets the shortcut arguments
     *
     * @param {array} args The shortcut arguments
     * @returns {WineShortcut} The WineShortcut object
     */
    arguments(args) {
        this._arguments = args;
        return this;
    }

    /**
     * Sets the executable which shall be used
     *
     * @param {string} search The executable name
     * @returns {WineShortcut} The WineShortcut object
     */
    search(search) {
        this._search = search;
        return this;
    }

    /**
     * Sets the shortcut prefix
     *
     * @param {string} prefix The shortcut prefix
     * @returns {WineShortcut} The WineShortcut object
     */
    prefix(prefix) {
        this._prefix = prefix;
        return this;
    }

    /**
     * Sets the miniature for the shortcut
     *
     * @param {string[]|URI} miniature An array which specifies the application of which the miniature shall be used or URI of the miniature
     * @returns {WineShortcut} The WineShortcut object
     */
    miniature(miniature) {
        if (Array.isArray(miniature)) {
            // application of miniature given
            const application = this._appsManager.getApplication(miniature);
            if (application != null && application.getMainMiniature().isPresent()) {
                this._miniature = application.getMainMiniature().get();
            }
        } else {
            // miniature URI given
            this._miniature = miniature;
        }

        return this;
    }

    /**
     * Sets the shortcut environment variables
     *
     * @param {string} environment The environment variables
     * @returns {WineShortcut} The WineShortcut object
     */
    environment(environment) {
        this._environment = environment;
        return this;
    }

    /**
     * Sets the trust level
     *
     * @param {string} trustLevel The trust level
     * @returns {WineShortcut} The WineShortcut object
     */
    trustLevel(trustLevel) {
        this._trustLevel = trustLevel;
        return this;
    }

    /**
     * Creates a new shortcut
     *
     * @returns {void}
     */
    create() {
        const shortcutPrefixDirectory = this._winePrefixesDirectory + "/" + this._prefix;

        const executables = this._fileSearcher.search(shortcutPrefixDirectory, this._search);

        if (executables.length == 0) {
            throw tr("Executable {0} not found!", this._search);
        }

        const info = new ShortcutInfoDTOBuilderClass()
            .withCategory(this._category)
            .withName(this._name)
            .withDescription(this._description)
            .build();

        const myEnv = { WINEDEBUG: "-all" };
        if (typeof this._environment !== "undefined") {
            var envJSON = JSON.parse(this._environment);
            Object.keys(envJSON).forEach(function (key) {
                myEnv[key] = envJSON[key];
            });
        }

        let trustLevel;
        if (typeof this._trustLevel !== "undefined") {
            trustLevel = this._trustLevel;
        } else {
            trustLevel = "0"; //dummy value
        }

        const builder = new ShortcutDTOBuilderClass()
            .withId(this._name)
            .withInfo(info)
            .withScript(
                JSON.stringify({
                    type: "WINE",
                    environment: myEnv,
                    trustLevel: trustLevel,
                    winePrefix: this._prefix,
                    arguments: this._arguments,
                    workingDirectory: executables[0].getParentFile().getAbsolutePath(),
                    executable: executables[0].getAbsolutePath()
                })
            );

        if (this._miniature) {
            builder.withMiniature(this._miniature);
        }

        this._shortcutManager.createShortcut(builder.build());
    }
}
