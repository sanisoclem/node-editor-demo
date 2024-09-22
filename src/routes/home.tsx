import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tw } from "twind";
import { useLocalStorage } from "../hooks/localStorage";
import { PersistedIntegration } from "../integration/models";
import dataComments from "../../data/comments.json";
import dataIntegrations from "../../data/integrations.json";

export default function Home() {
  const [integrations, setIntegrations] = useLocalStorage<
    PersistedIntegration[]
  >("integrations", []);
  const [allComments, setAllComments] = useLocalStorage<PersistedIntegration[]>(
    "comments",
    []
  );

  const resetIntegrations = useCallback(() => {
    setIntegrations(dataIntegrations);
    setAllComments(dataComments as any);
  }, [setIntegrations]);

  useEffect(() => {
    if (integrations.length === 0) {
      resetIntegrations();
    }
  }, [resetIntegrations]);

  return (
    <>
      <div
        id="main-div"
        className={tw`text-white text-center bg-gray-900 min-h-[calc(100vh-64px)] w-screen flex flex-col justify-center items-center`}
      >
        {/* <div>{JSON.stringify(allComments)}</div> */}
        <div className={tw`max-w-screen-lg p-4`}>
          <h1 className={tw` text-4xl text-center w-full`}>
            .:V:.:M:.:C:.:D:.
          </h1>
          <h2 className={tw`mb-12 text-gray-400`}>Open an integration</h2>

          <ul className={tw`flex flex-col gap-2`}>
            {integrations
              .filter((v) => !!v)
              .map((v) => (
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
      <div
        className={tw`self-end bg-gray-900 text-white justify-self-end w-full px-8 py-4 flex flex-col md:flex-row gap-x-20 text-center md:text-left gap-y-8 text-xs justify-between`}
      >
        <div className={tw`flex justify-center flex-col`}>
          <p>
            This site was made with{" "}
            <a className={tw`external-link`} href="https://remix.run/">
              remix
            </a>
            {" "}and{" "}
            <a
              className={tw`external-link`}
              href="https://tailwindcss.com/docs"
            >
              tailwind
            </a>
            , and is hosted by{" "}
            <a
              className={tw`external-link`}
              href="https://pages.cloudflare.com/"
            >
              Cloudflare Pages
            </a>{" "}
            💖
          </p>
        </div>
        <div className={tw``}>
          <ul className={tw`flex justify-center gap-x-4 md:gap-x-8`}>
            <li>
              <a
                href="https://github.com/sanisoclem/node-editor-demo"
                className={tw`hover:text-amber-500 flex gap-x-2`}
              >
                <svg className={tw`h-8 w-8 fill-current`} viewBox="3 3 18 18">
                  <g id="code" opacity="0.75">
                    <path
                      id="left-bracket"
                      d="M4,12v-1h1c1,0,1,0,1-1V7.614C6,7.1,6.024,6.718,6.073,6.472C6.127,6.22,6.212,6.009,6.33,5.839
		C6.534,5.56,6.803,5.364,7.138,5.255C7.473,5.14,8.01,5,8.973,5H10v1H9.248c-0.457,0-0.77,0.191-0.936,0.408
		C8.145,6.623,8,6.853,8,7.476v1.857c0,0.729-0.041,1.18-0.244,1.493c-0.2,0.307-0.562,0.529-1.09,0.667
		c0.535,0.155,0.9,0.385,1.096,0.688C7.961,12.484,8,12.938,8,13.665v1.862c0,0.619,0.145,0.848,0.312,1.062
		c0.166,0.22,0.479,0.407,0.936,0.407L10,17l0,0v1H8.973c-0.963,0-1.5-0.133-1.835-0.248c-0.335-0.109-0.604-0.307-0.808-0.591
		c-0.118-0.165-0.203-0.374-0.257-0.625C6.024,16.283,6,15.9,6,15.387V13c0-1,0-1-1-1H4z"
                    />
                    <g
                      transform="matrix(-1,0,0,1,24,0)"
                      id="right-bracket"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <path
                        d="M4,12v-1h1c1,0,1,0,1-1V7.614C6,7.1,6.024,6.718,6.073,6.472C6.127,6.22,6.212,6.009,6.33,5.839
		C6.534,5.56,6.803,5.364,7.138,5.255C7.473,5.14,8.01,5,8.973,5H10v1H9.248c-0.457,0-0.77,0.191-0.936,0.408
		C8.145,6.623,8,6.853,8,7.476v1.857c0,0.729-0.041,1.18-0.244,1.493c-0.2,0.307-0.562,0.529-1.09,0.667
		c0.535,0.155,0.9,0.385,1.096,0.688C7.961,12.484,8,12.938,8,13.665v1.862c0,0.619,0.145,0.848,0.312,1.062
		c0.166,0.22,0.479,0.407,0.936,0.407L10,17l0,0v1H8.973c-0.963,0-1.5-0.133-1.835-0.248c-0.335-0.109-0.604-0.307-0.808-0.591
		c-0.118-0.165-0.203-0.374-0.257-0.625C6.024,16.283,6,15.9,6,15.387V13c0-1,0-1-1-1H4z"
                      />
                    </g>
                  </g>
                </svg>
                <span className={tw`leading-8`}>Source</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
