import { fn } from '@storybook/test';
import { Text } from '../../components/ui/form/Text';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Registration/Form/Text',
  component: Text,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    inputType: 'text',
    maxLength: 100,
    name: 'firstName',
    id: 'firstName',
    label: 'First Name',
    value: '',
    required: false,
    placeholder: '',
    failedValidations: [],
    wasValidated: false,
  },
};

export const Optional = {
  args: {
    label: 'Something Optional',
    required: false,
  },
};

export const WithPlaceholder = {
  args: {
    label: 'With a placeholder',
    placeholder: 'Example: 12345',
  },
};

export const WithHelperLink = {
  args: {
    label: 'USBC ID',
    helper: {
      text: 'Look up your USBC ID',
      url: 'https://webapps.bowl.com/USBCFindA/Home/Member',
    }
  }
}

export const MissingRequiredValue = {
  args: {
    label: 'Something Missing',
    required: true,
    wasValidated: true,
    failedValidations: [
      'valueMissing',
    ],
  }
}

export const ImproperlyFormattedValue = {
  args: {
    label: 'Almost There',
    required: true,
    wasValidated: true,
    failedValidations: [
      'patternMismatch',
    ],
    errorMessages: {
      patternMismatch: 'Just digits and a hyphen, e.g., 123-4567',
    }
  }
}
