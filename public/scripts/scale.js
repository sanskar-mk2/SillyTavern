// Input url and secret
// Persist secret in secrets and url in settings
// Load url on page load
// Hook connect button to hit getstatus api
// make generate response api

import { saveSettingsDebounced } from "../script.js";
import {
    SECRET_KEYS,
    secret_state,
    writeSecret,
} from "./secrets.js";

let scale_settings;
let is_get_status_scale = false;
let is_api_button_press_scale = false;

export {
    is_get_status_scale,
    scale_settings,
    loadScaleSettings,
}

function loadScaleSettings(data, settings) {
}

function setScaleOnlineStatus(value) {
    is_get_status_scale = value;
}

function loadScaleSettings(data, settings) {

}

async function onConnectButtonClick(e) {
    console.log('onConnectButtonClick');
    e.stopPropagation();
    const api_key_scale = $('#api_key_scale').val().trim();

    if (api_key_scale.length) {
        await writeSecret(SECRET_KEYS.SCALE, api_key_scale);
    }

    if (!secret_state[SECRET_KEYS.SCALE]) {
        console.log('No secret key saved for Scale');
        return;
    }

    $("#api_loading_scale").css("display", "inline-block");
    $("#api_button_scale").css("display", "none");
    saveSettingsDebounced();
    is_get_status_scale = true;
    is_api_button_press_scale = true;
    await getStatusScale();
}

function resultCheckStatusOpen() {
    is_api_button_press_openai = false;
    checkOnlineStatus();
    $("#api_loading_scale").css("display", 'none');
    $("#api_button_scale").css("display", 'inline-block');
}


async function getStatusScale() {
    if (is_get_status_scale) {

        let data = {
            url: scale_settings.url,
        };

        return jQuery.ajax({
            type: 'POST', // 
            url: '/getstatus_scale', // 
            data: JSON.stringify(data),
            cache: false,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (!('error' in data))
                    setOnlineStatus('Valid');
                resultCheckStatusOpen();
            },
            error: function (jqXHR, exception) {
                setOnlineStatus('no_connection');
                console.log(exception);
                console.log(jqXHR);
                resultCheckStatusOpen();
            }
        });
    } else {
        setOnlineStatus('no_connection');
    }
}

$("document").ready(function () {
    $("#api_button_scale").on("click", onConnectButtonClick);
});
