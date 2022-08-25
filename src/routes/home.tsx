import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { tw } from 'twind'
import { useLocalStorage } from '../hooks/localStorage'
import { PersistedIntegration } from '../integration/models'
import dataComments from '../../data/comments.json';
import dataIntegrations from '../../data/integrations.json';

export default function Home() {
  const [integrations, setIntegrations] = useLocalStorage<
    PersistedIntegration[]
  >('integrations', [])
  const [allComments, setAllComments] = useLocalStorage<PersistedIntegration[]>(
    'comments',
    [],
  )

  const resetIntegrations = useCallback(
    () =>{
      setIntegrations(dataIntegrations);
      setAllComments(dataComments as any);
    },
    [setIntegrations],
  )

  useEffect(() => {
    if (integrations.length === 0) {
      resetIntegrations()
    }
  }, [resetIntegrations])

  return (
    <div
      className={tw`text-white text-center bg-gray-900 min-h-screen w-screen flex flex-col justify-center items-center`}
    >
      {/* <div>{JSON.stringify(allComments)}</div> */}
      <div className={tw`max-w-screen-lg p-4`}>
        <h1 className={tw` text-4xl text-center w-full`}>.:V:.:M:.:C:.:D:.</h1>
        <h2 className={tw`mb-12 text-gray-400`}>Open an integration</h2>

        <ul className={tw`flex flex-col gap-2`}>
          {integrations.filter(v=>!!v).map((v) => (
            <li key={v.id}>
              <Link
                className={tw`block tracking-wide px-4 py-2 hover:text-white rounded border-transparent border-solid border-2 active:text-white link:text-white hover:border-green-500`}
                to={`/editor/${v.id}`}
              >
                {v.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={resetIntegrations}
              className={tw`outline-none touch-none border-transparent tracking-wide rounded px-4 py-2 border-solid border-2 hover:border-red-500`}
              type="button"
            >
              Reset Integrations ⛔
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
