export type Nodes = Record<
  string,
  {
    type: string
    id: string
    root: boolean
    inputData: Record<string, Record<string, unknown>>
  }
> | any // no flume typedefs 😭

export interface PersistedIntegration {
  id: string
  name: string
  overview: Nodes
  inputFiles: Record<string, Nodes> | any
  invoiceMaps: Record<string, Nodes> | any
  filters: Record<string, Nodes> | any
}
