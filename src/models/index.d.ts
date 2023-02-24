import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class Result {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly description?: string | null;
  readonly author_admins?: string | null;
  readonly current_version?: number | null;
  readonly latest_version?: number | null;
  readonly isPublic?: boolean | null;
  readonly isPinned?: boolean | null;
  readonly published_date?: string | null;
  readonly last_modified_date?: string | null;
  constructor(init: ModelInit<Result>);
}

export declare class MindMap {
  readonly search_title?: string | null;
  readonly maps?: string | null;
  constructor(init: ModelInit<MindMap>);
}

export declare class GraphInfo {
  readonly nodes?: (Nodes | null)[] | null;
  readonly links?: (Links | null)[] | null;
  constructor(init: ModelInit<GraphInfo>);
}

export declare class Nodes {
  readonly id?: string | null;
  readonly label?: string | null;
  readonly title: string;
  readonly description?: string | null;
  readonly url?: string | null;
  readonly author?: string | null;
  readonly contributors?: (string | null)[] | null;
  readonly current_version?: number | null;
  readonly latest_version?: number | null;
  readonly isPublic?: boolean | null;
  readonly isPinned?: boolean | null;
  readonly published_date?: string | null;
  readonly last_modified_date?: string | null;
  constructor(init: ModelInit<Nodes>);
}

export declare class Links {
  readonly source?: string | null;
  readonly target?: string | null;
  readonly type?: string | null;
  constructor(init: ModelInit<Links>);
}

export declare class CreateMindMapResult {
  readonly result?: string | null;
  constructor(init: ModelInit<CreateMindMapResult>);
}

export declare class Profile {
  readonly search_name?: string | null;
  readonly usage?: string | null;
  readonly belong_to?: string | null;
  readonly authored_by?: string | null;
  readonly affiliated_with?: string | null;
  readonly people?: string | null;
  readonly made_by?: string | null;
  constructor(init: ModelInit<Profile>);
}

export declare class Register {
  readonly result?: string | null;
  constructor(init: ModelInit<Register>);
}



