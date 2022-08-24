// @ts-nocheck
import { FlumeConfig, Colors, Controls } from 'flume'

export function buildInvoiceMapConfig(propList) {
  const invoiceMapConfig = new FlumeConfig()
  invoiceMapConfig
  .addPortType({
    type: "referentialDict",
    name: "referentialDict",
    label: "Referential",
    hidePort: true,
    controls: [
      Controls.select({
        name: "referentialDict",
        label: "Referential Data",
        options: [
          {value: "asgasg", label: "Postcode to portfolio code"},
          {value: "asga", label: "Portfolio code to creditor Id"}
        ]
      })
    ]
  })
  .addPortType({
    type: "referentialList",
    name: "referentialList",
    label: "Referential",
    hidePort: true,
    controls: [
      Controls.select({
        name: "referentialList",
        label: "Referential Data",
        options: [
          {value: "asfasf", label: "NZ creditor Ids"}
        ]
      })
    ]
  })
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
      controls: [],
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
      inputs: (ports) => [ports.string({ name: 'input', label: 'Input' })],
      outputs: (ports) => [ports.instant({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'parseMoney',
      label: 'Convert To Money',
      description: 'Takes a string and attempts to convert it to Money',
      inputs: (ports) => [ports.string({ name: 'input', label: 'Input' })],
      outputs: (ports) => [ports.money({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'compose',
      label: 'Compose',
      description: 'Composes a parameterized string of text',
      initialWidth: 230,
      inputs: (ports) => (data) => {
        const template = (data && data.template && data.template.string) || ''
        const re = /\{(.*?)\}/g
        let res,
          ids = []
        while ((res = re.exec(template)) !== null) {
          if (!ids.includes(res[1])) ids.push(res[1])
        }
        return [
          ports.string({ name: 'template', label: 'Template', hidePort: true }),
          ...ids.map((id) => ports.string({ name: id, label: id })),
        ]
      },
      outputs: (ports) => [ports.string({ label: 'Output' })],
    })
    .addNodeType({
      type: 'now',
      label: 'Now',
      description: 'Gets the current DateTime',
      inputs: (ports) => [],
      outputs: (ports) => [ports.instant({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'formatDate',
      label: 'Format Date',
      description: 'Converts date to desired format',
      inputs: (ports) => [
        ports.instant({ name: 'input', label: 'Input', noControls: true }),
        ports.string({ name: 'format', label: 'Format' }),
      ],
      outputs: (ports) => [ports.string({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'lookup',
      label: 'Referential Lookup',
      description: 'Lookup from Referential Data',
      inputs: (ports) => [
        ports.string({ name: 'input', label: 'Input', noControls: true }),
        ports.referentialDict({ name: 'referential', label: 'Referential Data' }),
      ],
      outputs: (ports) => [ports.string({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'inList',
      label: 'In Referential List',
      description: 'Checks if a value exists in a referential list',
      inputs: (ports) => [
        ports.string({ name: 'input', label: 'Input', noControls: true }),
        ports.referentialList({ name: 'referential', label: 'Referential Data' }),
      ],
      outputs: (ports) => [ports.boolean({ name: 'output', label: 'Output' })],
    })
    .addNodeType({
      type: 'if',
      label: 'If',
      description: 'If input is Yes returns the Yes Value, otherwise returns the No Value',
      inputs: (ports) => [
        ports.boolean({ name: 'input', label: 'Input', noControls: true }),
        ports.string({ name: 'yes', label: 'Yes Value' }),
        ports.string({ name: 'no', label: 'No Value' })
      ],
      outputs: (ports) => [ports.string({ name: 'output', label: 'Output' })],
    })
    .addRootNodeType({
      type: 'invoice',
      label: 'Invoice',
      initialWidth: 170,
      inputs: (ports) => [
        ports.string({
          name: 'invoiceId',
          label: 'Invoice Id',
          noControls: true,
        }),
        ports.string({
          name: 'accountId',
          label: 'Account Number',
          noControls: true,
        }),
        ports.string({
          name: 'name',
          label: 'Name',
          noControls: true,
        }),
        ports.string({
          name: 'creditorId',
          label: 'Creditor',
        }),
        ports.money({
          name: 'amount',
          label: 'Amount Due',
          noControls: true,
        }),
        ports.instant({
          name: 'dueDate',
          label: 'Due Date',
          noControls: true,
        }),
      ],
    })
    .addRootNodeType({
      type: 'input',
      label: 'Input File',
      initialWidth: 170,
      outputs: (ports) =>
        propList?.map((k) =>
          ports.string({
            name: k,
            label: k,
            noControls: true,
          }),
        ) || [],
    })

  return invoiceMapConfig
}
