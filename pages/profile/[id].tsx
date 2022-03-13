import ContentLayout from '../../layout/content';
import {
  ProfileBanner,
  ProfileSection,
  ProfileInformation,
  ProfileGroup,
} from '../../components/Profile';
import Header from '../../components/Header';
import NewButton from '../../components/NewButton';
import { IPeople } from '../../components/icons';
import useSwr from 'swr';
import { useAxios } from '../../context/AxiosContext';
import { useRouter } from 'next/router';
import { MenuContext } from '../../context/MenuContext';
import { useContext } from 'react';
import useSWR from 'swr';
import { Musician, Groups } from '../../types';
import Card from '../../components/Card';

export default function Profile() {
  const { isMenuOpen, setIsMenuOpen } = useContext(MenuContext);
  const router = useRouter();
  const { id } = router.query;
  const { authAxios } = useAxios();

  const { data: groupList } = useSWR<Groups[]>('/groups', (url) =>
    authAxios
      .get(url)
      .then((res) => res.data)
      .then((res) => {
        if (id)
          return res.filter((group: Groups) =>
            JSON.stringify(group.members).includes(id as string),
          );
        return res;
      }),
  );

  const { data } = useSwr(`/musicians/${id}`, (url) =>
    authAxios.get(url).then(({ data }) => data),
  );

  return (
    <ContentLayout
      Header={
        <Header
          title="Profil"
          icon={<IPeople />}
          rightComponents={
            <NewButton label="Modifier mon profil" className="rounded-full" />
          }
          hamburgerOnClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      }
    >
      {data && (
        <>
          <ProfileBanner
            firstname={data.givenName}
            lastname={data.familyName}
          />
          {data.description && (
            <ProfileSection title="A propos">
              <p>{data.description}</p>
            </ProfileSection>
          )}
          <ProfileInformation
            promotion={data.promotion}
            email={data.email}
            localisation={data.location}
            genres={data.genres}
            instruments={data.instruments}
          />
          {!!groupList?.length && (
            <ProfileGroup>
              <>
                {groupList.map((group) => (
                  <Card
                    key={group.id}
                    title={group.name}
                    genres={group.genres.map((genre) => genre.name)}
                    href={`/groups/${group.id}`}
                  />
                ))}
              </>
            </ProfileGroup>
          )}
        </>
      )}
    </ContentLayout>
  );
}
