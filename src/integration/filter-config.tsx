// @ts-nocheck
import { FlumeConfig, Colors, Controls } from 'flume'

export function buildFilterConfig(propList) {
  const filterConfig = new FlumeConfig()
  filterConfig
    .addPortType({
      type: 'string',
      name: 'string',
      label: 'String',
      color: Colors.green,
      controls: [
        Controls.text({
          name: 'string',
          label: 'Text',
        }),
      ],
    })
    .addPortType({
      type: 'boolean',
      name: 'boolean',
      label: 'True/False',
      color: Colors.blue,
      acceptTypes: ['boolean', 'booleanNoPort'],
      controls: [
        Controls.checkbox({
          name: 'boolean',
          label: 'True/False',
        }),
      ],
    })
    .addPortType({
      type: 'booleanNoPort',
      name: 'booleanNoPort',
      label: 'True/False',
      color: Colors.blue,
      hidePort: true,
      controls: [
        Controls.checkbox({
          name: 'boolean',
          label: 'True/False',
        }),
      ],
    })
    .addPortType({
      type: 'instant',
      name: 'instant',
      label: 'DateTime',
      color: Colors.pink,
      controls: [],
    })
    .addPortType({
      type: 'money',
      name: 'money',
      label: 'Money',
      color: Colors.grey,
      controls: [
        Controls.number({
        name: 'number',
        label: 'Money',
      }),],
    })
    .addPortType({
      type: 'number',
      name: 'number',
      label: 'Integer',
      color: Colors.red,
      controls: [],
    })
    .addNodeType({
      type: 'parseInstant',
      label: 'Convert To DateTime',
      description: 'Takes a string and attempts to convert it to a DateTime',
      inputs: (ports) => [ports.string({ name: 'input', label: 'Input', noControls: true })],
      outputs: (ports) => [ports.instant({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'parseMoney',
      label: 'Convert To Money',
      description: 'Takes a string and attempts to convert it to Money',
      inputs: (ports) => [ports.string({ name: 'input', label: 'Input', noControls: true })],
      outputs: (ports) => [ports.money({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'parseBoolean',
      label: 'Convert To Yes/No',
      description: 'Takes a string and attempts to convert it to Yes/No',
      inputs: (ports) => [ports.string({ name: 'input', label: 'Input', noControls: true })],
      outputs: (ports) => [ports.boolean({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'constantBool',
      label: 'Yes/Now',
      description: 'Creates a Yes/No value',
      inputs: (ports) => [ports.booleanNoPort({ name: 'input', label: 'Input' })],
      outputs: (ports) => [ports.boolean({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'greaterThan',
      label: '> Greater Than',
      description: 'Checks if an amount is greater than a particular value',
      inputs: (ports) => [
        ports.money({ name: 'input', label: 'Amount to check', noControls: true }),
        ports.money({ name: 'than', label: 'Amount to compare against' })
      ],
      outputs: (ports) => [ports.boolean({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'and',
      label: 'And',
      description: 'Outputs a Yes if all inputs are Yes',
      inputs: ports => (data, connections) => {
        return [
          ports.boolean({ name: 'input', label: 'Input', noControls: true }),
          ...([...Array((Object.keys(connections.inputs || {}).filter(k => /^input\d*/.test(k)).length || 0)).keys()] .map(i => ports.boolean({
            name: `input${i}`,
            label: 'Input',
            noControls: true
          })))
        ]
      },
      outputs: (ports) => [ports.boolean({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'anyOf',
      label: 'Any Of',
      description: 'Takes a string and attempts to convert it to Money',
      inputs: ports => (data, connections) => {
        return [
          ports.string({ name: 'input', label: 'Input', noControls: true }),
          ports.string({ name: 'anyMatch', label: 'Criteria' }),
          ...([...Array((Object.keys(data || {}).filter(k => /^anyMatch\d*/.test(k) && data[k]?.string).length || 0)).keys()] .map(i => ports.string({
            name: `anyMatch${i}`,
            label: 'Criteria',
          })))
        ]
      },
      outputs: (ports) => [ports.boolean({ name: 'matched', label: 'Matched Any' })],
    })
    .addRootNodeType({
      type: 'shouldInclude',
      label: 'Filter',
      initialWidth: 170,
      inputs: (ports) => [
        ports.boolean({
          name: 'Include',
          label: 'Include?',
          noControls: true,
        })
      ],
    }).addRootNodeType({
      type: 'input',
      label: 'Input File',
      initialWidth: 170,
      outputs: (ports) => propList.map(k =>
        ports.string({
          name: k,
          label: k,
          noControls: true,
        }))
    });


  return filterConfig
}
