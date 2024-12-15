import { mst } from 'reactotron-mst'
import Reactotron from 'reactotron-react-js'
import { rootStore } from 'src/shared/model/RootStore.ts'

Reactotron.configure({}).use(mst({})).connect()

// @ts-expect-error waiting for trackMstNode types
Reactotron.trackMstNode(rootStore)
