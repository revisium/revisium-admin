import { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env/.env.development') })

const args = process.argv.slice(2)
const isDownload = args.includes('--download')

const disablePlugin = {
  add: {
    content: ['// @ts-ignore'],
  },
}

const scalars = {
  DateTime: 'string',
  JSON: '{ [key: string]: any } | string | number | boolean | null',
}

console.log('isDownload', isDownload)

const config: CodegenConfig = {
  overwrite: true,
  schema: `http://${process.env.REACT_APP_GRAPHQL_SERVER_HOST}:${process.env.REACT_APP_GRAPHQL_SERVER_PORT}${process.env.REACT_APP_GRAPHQL_SERVER_URL}`,
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    [`./src/__generated__/schema.graphql`]: {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
    ...(!isDownload
      ? {
          [`./src/__generated__/globalTypes.ts`]: {
            plugins: ['typescript'],
            config: {
              namingConvention: {
                enumValues: 'upper-case#upperCase',
              },
              scalars,
              nonOptionalTypename: true,
            },
          },
          './': {
            preset: 'near-operation-file',
            documents: `./src/**/*.graphql`,
            presetConfig: {
              folder: '__generated__',
              extension: '.generated.ts',
              baseTypesPath: `./src/__generated__/globalTypes`,
            },
            plugins: [disablePlugin, 'typescript-operations', 'typescript-react-apollo'],
            config: {
              scalars,
            },
          },
          [`./src/__generated__/graphql-request.ts`]: {
            documents: `./src/**/*.graphql`,
            plugins: [disablePlugin, 'typescript', 'typescript-operations', 'typescript-graphql-request'],
            config: {
              rawRequest: false,
              skipTypename: true,
              scalars,
            },
          },
        }
      : {}),
  },
}

export default config
