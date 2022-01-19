import GenreLabel from './genreLabel';
import { Meta } from '@storybook/react';
import { GENRE_NAME_LIST } from '../index';

export default {
  title: 'Musician/genreLabel',
  component: GenreLabel,
  argTypes: {
    genre: {
      options: GENRE_NAME_LIST,
      control: { type: 'select' },
      defaultValue: GENRE_NAME_LIST[0],
    },
  },
} as Meta;

export { GenreLabel };
