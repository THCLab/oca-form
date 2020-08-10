import Vue from 'vue';

var EventHandlerConstant = {
    ADD_CONTROL: 'add_control',
    REMOVE_CONTROL: 'remove_control',
    CHANGE_DATA_OPTION_IN_CONTROL: 'change_data_option_in_control',

    EXPORT_FORM: 'export_form',
    PUBLISH_FORM: 'publish_form',
    SAVE_PREVIEW: 'save_preview',
    ON_LANGUAGE_CHANGE: 'on_language_change',
    ERROR: 'error_occurred',
    // sidebar
    ACTIVATE_EDITOR_SIDEBAR: 'activate_editor_sidebar',
    ON_APPLY_EDITOR_SIDEBAR: 'on_apply_editor_sidebar',
};

// to receive event and pass...
const eventBus = new Vue();

export {
    EventHandlerConstant,
    eventBus
}
