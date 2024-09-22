import { useState } from 'react'
import { tw } from 'twind'
import { Link, useParams } from 'react-router-dom'
import { useLocalStorage } from '../hooks/localStorage'
import { Nodes, PersistedIntegration } from '../integration/models'
import { NodeEditor } from 'flume'
import {
  config,
  buildInvoiceMapConfig,
  buildFilterConfig,
} from '../integration'

type FlowType =
  | { tag: 'overview' }
  | { tag: 'none' }
  | { tag: 'ref' }
  | { tag: 'inputFile'; name: string }
  | { tag: 'filter'; name: string }
  | { tag: 'invoiceMap'; name: string }

const IntegrationOverview: FlowType = { tag: 'overview' }
const hack = undefined as any // deal with bugs with flume

const getFlow = (t: FlowType, i?: PersistedIntegration): Nodes | undefined => {
  if (!i) return undefined
  switch (t.tag) {
    case 'overview':
      return i.overview
    case 'inputFile':
      return i.inputFiles[t.name]
    case 'filter':
      return i.filters[t.name]
    case 'invoiceMap':
      return i.invoiceMaps[t.name]
  }
}

const setFlow = (t: FlowType, f: Nodes, i?: PersistedIntegration) => {
  if (!i) return
  switch (t.tag) {
    case 'overview':
      i.overview = f
      break
    case 'inputFile':
      i.inputFiles = { ...i.inputFiles, [t.name]: f }
      break
    case 'filter':
      i.filters = { ...i.filters, [t.name]: f }
      break
    case 'invoiceMap':
      i.invoiceMaps = { ...i.invoiceMaps, [t.name]: f }
      break
  }
}

export default function Editor() {
  let params = useParams()
  const [nothing, setNothing] = useState(() => Math.random())
  const [integrations, setIntegrations] = useLocalStorage<
    PersistedIntegration[]
  >('integrations', [])
  const [allComments, setAllComments] = useLocalStorage<PersistedIntegration[]>(
    'comments',
    [],
  )
  const integration = integrations.find((i) => i.id === params.integrationId)
  const comments = allComments.find((i) => i.id === params.integrationId)
  const [activeFlow, setActiveFlow] = useState<FlowType>(IntegrationOverview)
  const [nodes, setNodes] = useState(getFlow(activeFlow, integration) || {})
  const [commentNodes, setCommentNodes] = useState(
    getFlow(activeFlow, comments) || {},
  )

  const [invoiceMapNodeConfig, setInvoiceMapNodeConfig] = useState<any>()
  const [filterMapNodeConfig, setFilterMapNodeConfig] = useState<any>()

  if (!integration) return <div>Nothing here</div>

  const save = () => {
    setIntegrations((v) => {
      const int = v.find((i) => i.id === params.integrationId)
      if (int) {
        setFlow(activeFlow, nodes, int)

        if (activeFlow.tag === 'overview') {
          Object.keys(nodes).forEach((k) => {
            if (nodes[k].type === 'inputFile' && !int.inputFiles[k]) {
              int.inputFiles[k] = {}
            }
          })

          Object.keys(int.inputFiles).forEach((k) => {
            if (!nodes[k]) {
              delete int.inputFiles[k]
            }
          })

          Object.keys(nodes).forEach((k) => {
            if (nodes[k].type === 'mapInvoice' && !int.invoiceMaps[k]) {
              int.invoiceMaps[k] = {} as any
            }
          })

          Object.keys(int.invoiceMaps).forEach((k) => {
            if (!nodes[k]) {
              delete int.invoiceMaps[k]
            }
          })

          Object.keys(nodes).forEach((k) => {
            if (nodes[k].type === 'filter' && !int.filters[k]) {
              int.filters[k] = {} as any
            }
          })

          Object.keys(int.filters).forEach((k) => {
            if (!nodes[k]) {
              delete int.filters[k]
            }
          })
        }
      }
      return v
    })

    setAllComments((v) => {
      let int = v.find((i) => i.id === params.integrationId)
      if (!int) {
        int = {
          id: params.integrationId!,
          name: params.integrationId!,
          overview: {},
          inputFiles: {},
          invoiceMaps: {},
          filters: {},
        }
        v.push(int)
      }
      setFlow(activeFlow, commentNodes, int)
      return v
    })

    // hack to force render
    setTimeout(() => {
      setNothing(Math.random())
    })
  }

  const getFields = (flow: Nodes, id: string): string[] => {
    const cols = flow[id].inputData?.sampleFile?.upload
    if (cols) return cols

    const input = flow[id].connections?.inputs?.objectStream?.[0]?.nodeId
    if (!input) return []
    return getFields(flow, input)
  }
  const loadFlow = (flow: FlowType) => () => {
    const f = getFlow(flow, integration) || {}

    if (flow.tag === 'invoiceMap' || flow.tag === 'filter') {
      const cols = getFields(integration.overview, flow.name)
      setInvoiceMapNodeConfig(buildInvoiceMapConfig(cols))
      setFilterMapNodeConfig(buildFilterConfig(cols))
      Object.keys(f)
        .filter((k) => f[k].root && f[k].type === 'input')
        .forEach((k) => {
          Object.keys(f[k]?.connections?.outputs || []).forEach((keyOutput) => {
            if (cols.indexOf(keyOutput) === -1) {
              delete f[k].connections.outputs[keyOutput]
            }
          })

          cols.forEach((colKey: string) => {
            f[k].connections.outputs[colKey] =
              f[k].connections.outputs[colKey] || []
          })
        })
    }
    setActiveFlow({ tag: 'none' })
    setNodes(() => f)
    setCommentNodes(() => getFlow(flow, comments) || {})

    // hack
    setTimeout(() => {
      setActiveFlow(flow)
    }, 100)
  }

  return (
    <>
      {/* <div>{JSON.stringify(nodes)}</div> */}
      <div
        id="main-div"
        className={tw`text-white w-screen flex h-screen flex-row items-stretch justify-center workspace`}
      >
        <div className={tw`flex-grow-0 flex-shrink-0 bg-gray-900 p-4 w-3/12`}>
          <h3>💻 {integration.name}</h3>
          <Link to="/">
            <sub>Open a different integration</sub>
          </Link>
          <ul className={tw`mt-8 flex flex-col items-stretch`}>
            <li>
              <button
                className={
                  activeFlow.tag === 'overview' ? tw`text-green-500` : tw``
                }
                onClick={loadFlow(IntegrationOverview)}
              >
                Overview
              </button>
            </li>
            <li>
              Input Files
              <ul className={tw`ml-2`}>
                {Object.keys(integration.inputFiles).map((k) => (
                  <li key={k}>
                    <button
                      className={
                        activeFlow.tag === 'inputFile' && activeFlow.name === k
                          ? tw`text-green-500`
                          : tw``
                      }
                      onClick={loadFlow({ tag: 'inputFile', name: k })}
                    >
                      {`📋 ${
                        integration.overview[k].inputData.name.string as string
                      }`}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              Filters
              <ul className={tw`ml-2`}>
                {Object.keys(integration.filters).map((k) => (
                  <li key={k}>
                    <button
                      className={
                        activeFlow.tag === 'filter' && activeFlow.name === k
                          ? tw`text-green-500`
                          : tw``
                      }
                      onClick={loadFlow({ tag: 'filter', name: k })}
                    >
                      {`⚙ ${
                        integration.overview[k].inputData?.name
                          ?.string as string
                      }`}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              Transforms
              <ul className={tw`ml-2`}>
                {Object.keys(integration.invoiceMaps).map((k) => (
                  <li key={k}>
                    <button
                      className={
                        activeFlow.tag === 'invoiceMap' && activeFlow.name === k
                          ? tw`text-green-500`
                          : tw``
                      }
                      onClick={loadFlow({ tag: 'invoiceMap', name: k })}
                    >
                      {`⚙ ${
                        integration.overview[k].inputData?.name
                          ?.string as string
                      }`}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <button
                className={activeFlow.tag === 'ref' ? tw`text-green-500` : tw``}
                onClick={loadFlow({ tag: 'ref' })}
              >
                Referential Data
              </button>
            </li>
            {/* {Object.keys(integration.flows).map(k=><li>{k}</li> ) } */}
          </ul>
        </div>
        <div className={tw`flex-grow justify-self-stretch relative`}>
          <button
            onClick={save}
            className={tw`absolute top-2 right-2 bg-gray-900 px-4 py-1`}
            style={{ zIndex: 10000 }}
            type="button"
          >
            Save
          </button>
          {activeFlow.tag === 'overview' ? (
            <NodeEditor
              portTypes={config.portTypes}
              nodeTypes={config.nodeTypes}
              nodes={nodes}
              onChange={setNodes}
              comments={commentNodes}
              onCommentsChange={setCommentNodes}
              defaultNodes={[
                {
                  type: 'systemInput',
                  x: 190,
                  y: -150,
                },
              ]}
            />
          ) : activeFlow.tag === 'invoiceMap' ? (
            <NodeEditor
              portTypes={invoiceMapNodeConfig?.portTypes}
              nodeTypes={invoiceMapNodeConfig?.nodeTypes}
              comments={commentNodes}
              onCommentsChange={setCommentNodes}
              nodes={nodes}
              onChange={setNodes}
              defaultNodes={[
                {
                  type: 'invoice',
                  x: 190,
                  y: -150,
                },
                {
                  type: 'input',
                  x: -390,
                  y: -150,
                },
              ]}
            />
          ) : activeFlow.tag === 'filter' ? (
            <NodeEditor
              portTypes={filterMapNodeConfig?.portTypes}
              nodeTypes={filterMapNodeConfig?.nodeTypes}
              comments={commentNodes}
              onCommentsChange={setCommentNodes}
              nodes={nodes}
              onChange={setNodes}
              defaultNodes={[
                {
                  type: 'shouldInclude',
                  x: 190,
                  y: -150,
                },
                {
                  type: 'input',
                  x: -390,
                  y: -150,
                },
              ]}
            />
          ) : activeFlow.tag === 'inputFile' ? (
            <div
              className={tw`flex h-screen w-full justify-center items-center`}
            >
              TODO: Define file config here
            </div>
          ) : activeFlow.tag === 'ref' ? (
            <div
              className={tw`flex h-screen w-full justify-center items-center`}
            >
              TODO: Referential data management
            </div>
          ) : (
            <div
              className={tw`flex h-screen w-full justify-center items-center`}
            >
              Loading
            </div>
          )}
        </div>
      </div>
      {/* <div className={tw`block w-screen`}>{JSON.stringify(integration)}</div> */}
    </>
  )
}
