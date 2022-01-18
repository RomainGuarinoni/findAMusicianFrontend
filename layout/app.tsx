import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faDoorOpen, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthStateType, useAuth } from '../context/AuthContext';
import React, { useState } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { useAxios } from '../context/AxiosContext';
import Cookies from 'js-cookie';
import type { AxiosInstance } from 'axios';
import HambergerMenu from '../components/hambergerMenu';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { pathname, push } = useRouter();
  const { getProfil, setAuthState, isAuthenticated } = useAuth();
  const { authAxios } = useAxios();

  const [settingModal, setSettingModal] = useState(false);
  const [hambergerMenu, setHambergerMenu] = useState(false);

  const settingModalRef = useOnClickOutside(() => {
    setSettingModal(false);
  });

  const profil = getProfil();

  return (
    <div className="min-h-screen w-full flex flex-col py-2 px-5">
      {hambergerMenu && <HambergerMenu close={() => setHambergerMenu(false)} />}

      <div className="flex w-full items-center justify-between">
        <h2
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-800 to-purple-1000 cursor-pointer"
          onClick={() => {
            if (isAuthenticated()) {
              push('/musician');
            }
          }}
        >
          Find a musician
        </h2>

        {isAuthenticated() && (
          <ul className="md:flex hidden items-center justify-between ">
            <li
              className={`mx-2 cursor-pointer ${isLinkSelected(
                pathname,
                'musician',
              )}`}
              onClick={() => push('/musician')}
            >
              musiciens
            </li>
            <li
              className={`mx-2 cursor-pointer ${isLinkSelected(
                pathname,
                'groups',
              )}`}
              onClick={() => push('/groups')}
            >
              groupes
            </li>
            <li
              className={`mx-2 cursor-pointer ${isLinkSelected(
                pathname,
                'events',
              )}`}
              onClick={() => push('/events')}
            >
              évènements
            </li>
          </ul>
        )}

        {isAuthenticated() && (
          <div className="flex items-center">
            <div className="cursor-pointer relative mx-2">
              <FontAwesomeIcon icon={faBell} />
              <div className="text-white rounded-full bg-gradient-to-r from-red-600 via-red-800 to-purple-1000 text-sm absolute md:-top-2 md:-right-3 -top-0.5 -right-1 md:w-5 md:h-5 w-2 h-2 flex justify-center items-center ">
                <span className="hidden md:block">99</span>
              </div>
            </div>
            <div
              className="md:flex hidden items-center min-w-[180px] mx-2 cursor-pointer relative"
              onClick={() => {
                setSettingModal(!settingModal);
              }}
              ref={settingModalRef}
            >
              <div className="rounded-full w-7 h-7 bg-red-800 mx-2"></div>
              <p>
                {' '}
                {profil?.givenName} {profil?.familyName}
              </p>
              {settingModal && (
                <div className="absolute top-10 shadow-complete rounded-sm right-0">
                  <ul className="text-gray-700">
                    <li className="flex items-center py-3 px-2 transition-all hover:bg-red-100 hover:text-black">
                      <span className="mx-2">
                        <FontAwesomeIcon icon={faCog} />
                      </span>{' '}
                      Paramètres
                    </li>
                    <li
                      onClick={() => {
                        Logout(authAxios, setAuthState, push);
                      }}
                      className="flex items-center py-3 px-2 transition-all hover:bg-red-100 hover:text-black"
                    >
                      <span className="mx-2">
                        <FontAwesomeIcon icon={faDoorOpen} />
                      </span>{' '}
                      Se déconnecter{' '}
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <span
              onClick={() => {
                setHambergerMenu(true);
              }}
              className="block md:hidden mx-3 text-xl cursor-pointer"
            >
              <FontAwesomeIcon icon={faBars} />
            </span>
          </div>
        )}
      </div>
      <div className="flex-1">{children}</div>
      <div className="w-full md:flex hidden justify-center">
        <div className="flex items-center text-gray-500">
          <p className="mx-1 cursor-pointer">Nous contacter</p>
          <p className="mx-1">|</p>
          <p className="mx-1 cursor-pointer">Aide & services</p>
          <p className="mx-1 ">|</p>
          <p className="mx-1 cursor-pointer">FAQ</p>
        </div>
      </div>
    </div>
  );
}

function isLinkSelected(pathName: string, link: string): string {
  const path = pathName.split('/')[1];
  if (path === link) {
    return `text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-800 to-purple-1000`;
  } else {
    return '';
  }
}

export async function Logout(
  authAxios: AxiosInstance,
  setAuthState: React.Dispatch<React.SetStateAction<AuthStateType>>,
  push: (...args: any) => Promise<boolean>,
) {
  try {
    await authAxios.delete('/logout');

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    setAuthState({
      accessToken: '',
      refreshToken: '',
      profil: null,
      authenticated: false,
    });

    push('/login');
  } catch (err) {
    console.log('logout error', JSON.stringify(err));
  }
}