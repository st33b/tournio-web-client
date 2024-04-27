import { fn } from '@storybook/test';
import { BowlerForm } from '../components/Registration/BowlerForm/BowlerForm';


export default {
  title: 'Registration/BowlerForm',
  component: BowlerForm,
  parameters: {
    // params for the canvas
    layout: 'centered',
  },
  // enable auto-generated documentation
  tags: ['autodocs'],

  // use this to annotate args with information useful by addons
  argTypes: {
    // example: a "color" control type to instruct use of a color picker
  },
  args: {
    onClick: fn(),
  },
};

// {tournament, bowlerInfoSaved, bowlerData, availablePartners = [], nextButtonText}

export const FreshSolo = {
  args: {
    tournament: {},
    bowlerInfoSaved: {},
    bowlerData: {},
    availablePartners: [],
    nextButtonText: '',
  },
};
