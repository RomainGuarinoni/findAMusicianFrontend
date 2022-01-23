import { Meta } from '@storybook/react';
import LoginModal from './loginModal';
import PopUp from './popUp';

export default {
  title: 'Modal/Login',
  component: LoginModal,
} as Meta;

export const Primary = () => {
  return (
    <PopUp close={() => {}}>
      <LoginModal onForgetPassword={() => {}} />
    </PopUp>
  );
};
