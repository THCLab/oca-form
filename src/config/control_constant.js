// icon
import {faEdit, faCalculator, faCalendarAlt, faClock, faCheck, faDatabase, faNetworkWired} from '@fortawesome/free-solid-svg-icons';

// GUI Control
import GUICheckboxControl from '@/gui/ui/controls/CheckboxControl';
import GUIDatePickerControl from '@/gui/ui/controls/DatePickerControl';
import GUINumberControl from '@/gui/ui/controls/NumberControl';
import GUISelectControl from '@/gui/ui/controls/SelectControl';
import GUITextControl from '@/gui/ui/controls/TextControl';
import GUITimePickerControl from '@/gui/ui/controls/TimePickerControl';
import GUIReferenceControl from '@/gui/ui/controls/ReferenceControl';

// TEMPLATE Control
import TEMPLATETextControl from '@/template/ui/common/controls/TextControl';
import TEMPLATENumberControl from '@/template/ui/common/controls/NumberControl';
import TEMPLATECheckboxControl from '@/template/ui/common/controls/CheckboxControl';
import TEMPLATEDatePickerControl from '@/template/ui/common/controls/DatePickerControl';
import TEMPLATETimePickerControl from '@/template/ui/common/controls/TimePickerControl';
import TEMPLATESelectControl from '@/template/ui/common/controls/SelectControl';
import TEMPLATEReferenceControl from '@/template/ui/common/controls/ReferenceControl';

// CONFIG CONTROL
import SIDEBARDatePickerControl from '@/template/ui/sidebar_items/DatePickerConfigComponent';
import SIDEBARTimePickerControl from '@/template/ui/sidebar_items/TimePickerConfigComponent';
import SIDEBARSelectControl from '@/template/ui/sidebar_items/SelectConfigComponent';
import SIDEBARNumberControl from '@/template/ui/sidebar_items/NumberConfigComponent';
import SIDEBARTextControl from '@/template/ui/sidebar_items/TextConfigComponent';
import SIDEBARCheckboxControl from '@/template/ui/sidebar_items/CheckboxConfigComponent';
import SIDEBARReferenceControl from '@/template/ui/sidebar_items/ReferenceConfigComponent';

// Template Control
// special key for control:
// other_properties: {
//     x: "zzz",
//     c: "xxx",
//     ...
// },
// validation_func: function() {
//  // validation function here
// }
//
const CONTROL_TYPES = {
    text: {
        label:"Text Input",
        icon: faEdit,
        source: {
            gui: GUITextControl,
            template: TEMPLATETextControl,
            config: SIDEBARTextControl
        }
    },
    number: {
        label:"Number Input",
        icon: faCalculator,
        source: {
            gui: GUINumberControl,
            template: TEMPLATENumberControl,
            config: SIDEBARNumberControl
        }
    },
    datepicker: {
        label: "Date Picker",
        icon: faCalendarAlt,
        source: {
            gui: GUIDatePickerControl,
            template: TEMPLATEDatePickerControl,
            config: SIDEBARDatePickerControl,
        }
    },
    timepicker: {
        label:"Time Picker",
        icon: faClock,
        source: {
            gui: GUITimePickerControl,
            template: TEMPLATETimePickerControl,
            config: SIDEBARTimePickerControl,
        }
    },
    select: {
        label: "Select Option",
        icon: faDatabase,
        source: {
            gui: GUISelectControl,
            template: TEMPLATESelectControl,
            config: SIDEBARSelectControl
        }
    },
    checkbox: {
        label:"Checkbox",
        icon: faCheck,
        source: {
            gui: GUICheckboxControl,
            template: TEMPLATECheckboxControl,
            config: SIDEBARCheckboxControl
        }
    },
    reference: {
        label: "Reference",
        icon: faNetworkWired,
        source: {
            gui: GUIReferenceControl,
            template: TEMPLATEReferenceControl,
            config: SIDEBARReferenceControl
        }
    }
};

export {
    CONTROL_TYPES
}
