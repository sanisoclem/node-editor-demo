// @ts-nocheck
import { FlumeConfig, Colors, Controls } from 'flume'
import { tw } from 'twind';
import { ChangeEvent, useState } from 'react'

const config = new FlumeConfig()
config
  .addPortType({
    type: 'sampleFile',
    name: 'sampleFile',
    label: 'Sample File',
    color: Colors.green,
    hidePort: true,
    controls: [
      Controls.custom({
        name: 'upload',
        label: 'upload',
        render: (data, onChange) => {
          const handleChange = (e) => {
            try{
              const reader = new FileReader();
              var dec = new TextDecoder("utf-8");
              reader.onload = function() {
                const arrayBuffer = this.result,
                  array = new Uint8Array(arrayBuffer);

                const cols = dec.decode(array).split('\n')[0].split(',').map(k=>k.trim());
                onChange(cols.filter((c, i, s) => s.indexOf(c) === i));
              }
              reader.readAsArrayBuffer(e.target.files[0]);
            } catch(e)
            {
              console.error(e);
            }
          }
          return (
            <div style={{ fontSize: '16px' }}>
              <label>
                <span className={tw`block mb-2`}>
                  Upload Example
                </span>{' '}
                <input type="file" onChange={handleChange} />
              </label>
              <p className={tw`m-1`}>Fields</p>
              <ul className={tw`flex flex-col gap-1 m-1 ml-2`}>
                {(data || []).map(k=><li key={k}>► {k}</li>)}
              </ul>
            </div>
          )
        },
      }),
    ],
  })
  .addPortType({
    type: 'string',
    name: 'string',
    label: 'String',
    color: Colors.green,
    hidePort: true,
    controls: [
      Controls.text({
        name: 'string',
        label: 'String',
      }),
    ],
  })
  .addPortType({
    type: 'boolean',
    name: 'boolean',
    label: 'True/False',
    color: Colors.blue,
    controls: [
      Controls.checkbox({
        name: 'boolean',
        label: 'True/False',
      }),
    ],
  })
  .addPortType({
    type: 'number',
    name: 'number',
    label: 'Integer',
    color: Colors.red,
    controls: [],
  })
  .addPortType({
    type: 'byteStream',
    name: 'byteStream',
    label: 'Data',
    color: Colors.orange,
    controls: [],
  })
  .addPortType({
    type: 'objectStream',
    name: 'objectStream',
    label: 'Rows',
    color: Colors.pink,
    controls: [],
  })
  .addPortType({
    type: 'invoiceStream',
    name: 'invoiceStream',
    label: 'Invoices',
    color: Colors.purple,
    controls: [],
  })
  .addPortType({
    type: 'accountStream',
    name: 'accountStream',
    label: 'Accounts',
    color: Colors.yellow,
    controls: [],
  })
  .addPortType({
    type: 'metadataStream',
    name: 'metadataStream',
    label: 'metadata',
    color: Colors.grey,
    controls: [],
  })
  .addRootNodeType({
    type: 'systemInput',
    label: 'Data Ingress',
    initialWidth: 170,
    inputs: ports => (data, connections) => {
      return [
        ports.invoiceStream({
          name: 'invoiceStream',
          label: 'Invoices',
        }),
        ...([...Array((Object.keys(connections?.inputs|| {}).filter(k=> /^invoiceStream\d*/.test(k)).length || 0)).keys()].map(i => ports.invoiceStream({
          name: `invoiceStream${i}`,
          label: 'Invoices',
        })))
        ,
        ports.accountStream({
          name: 'accountStream',
          label: 'Accounts',
        }),
        ...([...Array((Object.keys(connections?.inputs|| {}).filter(k=> /^accountStream\d*/.test(k)).length || 0)).keys()].map(i => ports.accountStream({
          name: `accountStream${i}`,
          label: 'Accounts',
        })))
        ,
        ports.metadataStream({
          name: 'metadataStream',
          label: 'Metadata',
        }),
        ...([...Array((Object.keys(connections?.inputs|| {}).filter(k=> /^metadataStream\d*/.test(k)).length || 0)).keys()].map(i => ports.metadataStream({
          name: `metadataStream${i}`,
          label: 'Metadata',
        })))
      ];
    },
  })
  .addNodeType({
    type: 'readDelimited',
    label: 'Read Delimited File',
    description: 'Reads a delimited file',
    initialWidth: 300,
    inputs: (ports) => [
      ports.byteStream({
        name: 'byteStream',
        label: 'Data',
      }),
      ports.sampleFile({
        name: 'sampleFile',
        label: 'Sample File',
      }),
    ],
    outputs: (ports) => [ports.objectStream({ name: 'rows', label: 'Rows' })],
  })
  .addNodeType({
    type: 'mapInvoice',
    label: 'Map Invoice',
    description: 'Combines inputs to create an invoice',
    inputs: (ports) => [
      ports.string({ name: 'name', label: 'Name (descriptive only)' }),
      ports.objectStream({ name: 'objectStream', label: 'Rows' }),
    ],
    outputs: (ports) => [
      ports.invoiceStream({ name: 'invoiceStream', label: 'Invoices' }),
    ],
  })
  .addNodeType({
    type: 'mapAccount',
    label: 'Map Account',
    description: 'Combines inputs to create an invoice',
    inputs: (ports) => [
      ports.string({ name: 'name', label: 'Name (descriptive only)' }),
      ports.objectStream({ name: 'objectStream', label: 'Rows' }),
    ],
    outputs: (ports) => [
      ports.accountStream({ name: 'accountStream', label: 'Accounts' }),
    ],
  })
  .addNodeType({
    type: 'mapMetadata',
    label: 'Map Metadata',
    description: 'Combines inputs to create an invoice',
    inputs: (ports) => [
      ports.string({ name: 'name', label: 'Name (descriptive only)' }),
      ports.objectStream({ name: 'objectStream', label: 'Rows' }),
    ],
    outputs: (ports) => [
      ports.metadataStream({ name: 'metadataStream', label: 'Metadata' }),
    ],
  })
  .addNodeType({
    type: 'filter',
    label: 'Filter',
    description: 'Filters rows of data',
    inputs: (ports) => [
      ports.string({ name: 'name', label: 'Name (descriptive only)' }),
      ports.objectStream({ name: 'objectStream', label: 'Rows' }),
    ],
    outputs: (ports) => [
      ports.objectStream({ name: 'objectStream', label: 'Filtered Rows' }),
    ],
  })
  .addNodeType({
    type: 'inputFile',
    label: 'Input File',
    description: 'A file we get from the client',
    inputs: (ports) => [
      ports.string({ name: 'name', label: 'Name (descriptive only)' }),
    ],
    outputs: (ports) => [
      ports.byteStream({ name: 'byteStream', label: 'Data' }),
    ],
  })
  .addNodeType({
    type: 'decrypt',
    label: 'Decrypt',
    description: 'Decrypts a file',
    inputs: (ports) => [
      ports.byteStream({ name: 'byteStream', label: 'Data' }),
    ],
    outputs: (ports) => [
      ports.byteStream({ name: 'byteStream', label: 'Data' }),
    ],
  })

export { config }
