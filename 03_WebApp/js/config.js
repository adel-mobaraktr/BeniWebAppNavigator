// Web_Navigator_App - Configuration Engine

let Config = {
    Settings: {},
    Themes: {},
    Labels: {},
    Messages: {},
    Features: {}
};


function buildConfig(configData) {

    Config.Settings = {};
    Config.Themes = {};
    Config.Labels = {};
    Config.Messages = {};
    Config.Features = {};


    if (configData.Settings) {

        configData.Settings.forEach(item => {
            Config.Settings[item.Setting_Key] = item.Setting_Value;
        });

    }


    if (configData.Themes) {

        configData.Themes.forEach(item => {
            Config.Themes[item.Theme_Key] = item.Theme_Value;
        });

    }


    if (configData.Labels) {

        configData.Labels.forEach(item => {
            Config.Labels[item.Label_Key] = item.Label_Value;
        });

    }


    if (configData.Messages) {

        configData.Messages.forEach(item => {
            Config.Messages[item.Message_Key] = item.Message_Value;
        });

    }


    if (configData.Features) {

        configData.Features.forEach(item => {
            Config.Features[item.Feature_Key] = item.Feature_Value;
        });

    }


    console.log("Configuration Engine initialized.");
    console.log("Config:", Config);
}





function applyTheme() {

    const root = document.documentElement;

    root.style.setProperty(
        "--primary-color",
        Config.Themes.Primary_Color
    );

    root.style.setProperty(
        "--secondary-color",
        Config.Themes.Secondary_Color
    );

    root.style.setProperty(
        "--accent-color",
        Config.Themes.Accent_Color
    );

    root.style.setProperty(
        "--background-color",
        Config.Themes.Background_Color
    );

    root.style.setProperty(
        "--surface-color",
        Config.Themes.Surface_Color
    );

    root.style.setProperty(
        "--text-color",
        Config.Themes.Text_Color
    );

    root.style.setProperty(
        "--text-secondary-color",
        Config.Themes.Text_Secondary_Color
    );

    root.style.setProperty(
        "--border-color",
        Config.Themes.Border_Color
    );

    root.style.setProperty(
        "--success-color",
        Config.Themes.Success_Color
    );

    root.style.setProperty(
        "--warning-color",
        Config.Themes.Warning_Color
    );

    root.style.setProperty(
        "--danger-color",
        Config.Themes.Danger_Color
    );

    root.style.setProperty(
        "--info-color",
        Config.Themes.Info_Color
    );

    root.style.setProperty(
        "--font-family",
        Config.Themes.Font_Family
    );

    root.style.setProperty(
        "--border-radius",
        Config.Themes.Border_Radius
    );

    root.style.setProperty(
        "--button-radius",
        Config.Themes.Button_Radius
    );

    root.style.setProperty(
        "--shadow",
        Config.Themes.Shadow
    );

    console.log("Theme Engine initialized.");
}






function getLabel(key) {

    return Config.Labels[key] || key;

}


function getMessage(key) {

    return Config.Messages[key] || key;

}


function isFeatureEnabled(key) {

    return Config.Features[key] === true ||
           Config.Features[key] === "true";

}


console.log("Labels Engine initialized.");
console.log("Messages Engine initialized.");
console.log("Features Engine initialized.");
