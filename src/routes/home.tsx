import { Link } from 'react-router-dom'
import { tw } from 'twind'
import { useLocalStorage } from '../hooks/localStorage'
import { PersistedIntegration } from '../integration/models'

export default function Home() {
  const [integrations] = useLocalStorage<
    PersistedIntegration[]
  >('integrations', [])

  return (
    <div
      className={tw`text-white text-center bg-gray-900 min-h-screen w-screen flex flex-col justify-center items-center`}
    >
      <div className={tw`max-w-screen-lg p-4`}>
        <h1 className={tw` text-4xl text-center w-full`}>VMCD</h1>
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
        </ul>
      </div>
    </div>
  )
}
