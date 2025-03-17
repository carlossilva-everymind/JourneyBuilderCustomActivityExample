'use strict';

/*
    Arquivo JS que é entregue junto com o HTML da config da atividade
*/

const validateForm = function (cb) {
    $form = $('.js-settings-form');

    $form.validate({
        submitHandler: function (form) { },
        errorPlacement: function () { },
    });

    cb($form);
};

const connection = new Postmonger.Session();
let authTokens = {};
let payload = {};
let $form;
$(window).ready(onRender);

// Configurando os listeners de evento do SFMC
connection.on('initActivity', initialize);
connection.on('requestedTokens', onGetTokens);
connection.on('requestedEndpoints', onGetEndpoints);
connection.on('requestedInteraction', onGetInteraction);
connection.on('requestedSchema', onGetrequestedSchema);
connection.on('requestedTriggerEventDefinition', onGetTriggerEventDefinition);

connection.on('clickedNext', save);

const buttonSettings = {
    button: 'next',
    text: 'done',
    visible: true,
    enabled: false,
};

function onRender() {
    // Envia enventos para o SFMC
    connection.trigger('ready');
    connection.trigger('requestTokens');
    connection.trigger('requestEndpoints');
    connection.trigger('requestInteraction');
    connection.trigger('requestTriggerEventDefinition');
    connection.trigger('requestSchema');

    // validation
    validateForm(function ($form) {
        $form.on('change click keyup input paste', 'input, textarea', function () {
            buttonSettings.enabled = $form.valid();
            connection.trigger('updateButton', buttonSettings);
        });
    });
}

/**
 * Inicialização - é chamada quando o SFMC envia o evento initActivity
 *                  os dados passado são os dados salvos quando existentes
 * @param data
 */
function initialize(data) {
    console.log('Initializing Data', data);
    if (data) {
        payload = data;
    }
    const hasInArguments = Boolean(
        payload['arguments'] &&
        payload['arguments'].execute &&
        payload['arguments'].execute.inArguments &&
        payload['arguments'].execute.inArguments.length > 0
    );

    const inArguments = hasInArguments
        ? payload['arguments'].execute.inArguments
        : {};

    $.each(inArguments, function (index, inArgument) {
        $.each(inArgument, function (key, value) {
            const $el = $('#' + key);
            if ($el.attr('type') === 'checkbox') {
                $el.prop('checked', value === 'true');
            } else {
                $el.val(value);
            }
        });
    });

    validateForm(function ($form) {
        buttonSettings.enabled = $form.valid();
        connection.trigger('updateButton', buttonSettings);
    });
}

/**
 *
 *
 * @param {*} tokens
 */
function onGetTokens(tokens) {
    authTokens = tokens;
    console.log(authTokens);
}

/**
 *
 *
 * @param {*} endpoints
 */
function onGetEndpoints(endpoints) {
    console.log('Endpoint Requested', endpoints);
}

/**
 *
 *
 * @param {*} interaction
 */
function onGetInteraction(interaction) {
    console.log('Interaction Requested', interaction);
}

/**
 * 
 *  
 */
function onGetrequestedSchema(data) {
    console.log('onRequestedSchema:', data);
}

/**
 * 
 *  
 */
function onGetTriggerEventDefinition(data) {
    console.log('TriggerDefinition', data);
}

/**
 * Save settings
 * Pega as informações do "form" que são os inputs de configuração e passa
 * para o SFMC montando o json de config
 */
function save() {
    if ($form.valid()) {
        payload['metaData'].isConfigured = true;

        payload['arguments'].execute.inArguments = [
            {
                "contactKey": "{{Contact.Key}}"
            }
        ];

        $('.js-activity-setting').each(function () {
            const $el = $(this);
            const setting = {
                id: $(this).attr('id'),
                value: $(this).val()
            };

            $.each(payload['arguments'].execute.inArguments, function (index, value) {
                if ($el.attr('type') === 'checkbox') {
                    if ($el.is(":checked")) {
                        value[setting.id] = setting.value;
                    } else {
                        value[setting.id] = 'false';
                    }
                } else {
                    value[setting.id] = setting.value;
                }
            })
        });
        console.log('Updating Activity data:', JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }
}
