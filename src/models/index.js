// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Result, MindMap, GraphInfo, Nodes, Links, CreateMindMapResult, Profile, Register } = initSchema(schema);

export {
  Result,
  MindMap,
  GraphInfo,
  Nodes,
  Links,
  CreateMindMapResult,
  Profile,
  Register
};