import { Genre, Instrument } from '../../types';
import { ISearch } from '../icons';
import { Input, Dropdown } from '.';
import { Options } from './Dropdown';
import { capitalize } from '../../utils/string';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAxios } from '../../context/AxiosContext';
import useSWR from 'swr';

type Props = {
  usedFilters: ('instruments' | 'genres' | 'name' | 'location')[];
  setFilters: Dispatch<SetStateAction<FiltersType>>;
};

export type FiltersType = {
  params: {
    name?: string;
    location?: string[];
    genres?: string[];
    instruments?: string[];
  };
};

export function Filters({ usedFilters, setFilters }: Props): JSX.Element {
  const { publicAxios } = useAxios();

  const { data: genres } = useSWR<Genre[]>('/genres', (url) =>
    publicAxios.get(url).then((res) => res.data),
  );

  const { data: instruments } = useSWR<Instrument[]>('/instruments', (url) =>
    publicAxios.get(url).then((res) => res.data),
  );

  const optionsSite: Options<string>[] = [
    {
      label: 'Douai',
      value: 'Douai',
    },
    {
      label: 'Lille',
      value: 'Lille',
    },
  ];

  const [selectedInstrument, setSelectedInstrument] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const [selectedSite, setSelectedSite] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    let res: FiltersType = { params: {} };
    if (searchValue.length) res.params.name = searchValue;
    if (selectedSite.length) res.params.location = selectedSite;
    if (selectedInstrument.length) res.params.instruments = selectedInstrument;
    if (selectedGenre.length) res.params.genres = selectedGenre;
    setFilters(res);
  }, [
    setFilters,
    searchValue,
    selectedSite,
    selectedGenre,
    selectedInstrument,
  ]);

  return (
    <div className="sticky top-28 pb-2 -mb-2 bg-white flex flex-wrap gap-4 justify-between z-10">
      <div className="flex flex-wrap gap-4">
        {instruments && usedFilters.includes('instruments') && (
          <Dropdown
            label="Instruments"
            options={instruments.map((instrument) => {
              return {
                label: capitalize(instrument.name),
                value: instrument.name,
              };
            })}
            selected={selectedInstrument}
            setSelected={setSelectedInstrument}
          />
        )}
        {genres && usedFilters.includes('genres') && (
          <Dropdown
            label="Genres"
            options={genres.map((genre) => {
              return { label: capitalize(genre.name), value: genre.name };
            })}
            selected={selectedGenre}
            setSelected={setSelectedGenre}
          />
        )}
        {usedFilters.includes('location') && (
          <Dropdown
            label="Sites"
            options={optionsSite}
            selected={selectedSite}
            setSelected={setSelectedSite}
          />
        )}
      </div>

      {usedFilters.includes('name') && (
        <Input
          id="rechercher"
          placeholder="rechercher"
          label="searchbar"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          icon={<ISearch />}
        />
      )}
    </div>
  );
}

export default Filters;
