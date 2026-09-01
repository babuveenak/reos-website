import rawDeveloperBook from "./dldDeveloperBook.json";

export type DldDeveloperService = {
  id: string;
  title: string;
  description: string;
  channel: string;
  channelUrl: string | null;
  time: string;
  fees: string;
  documents: string;
};

export type DldDeveloperBranch = {
  id: string;
  authority: string;
  sourceUrl: string;
  services: DldDeveloperService[];
};

export type DldDeveloperSubphase = {
  id: string;
  label: string;
  branches: DldDeveloperBranch[];
};

export type DldDeveloperBook = {
  source: {
    authority: string;
    title: string;
    url: string;
    checkedOn: string;
    siteUpdatedOn: string;
    scope: string;
    warning: string;
  };
  stages: {
    preDevelopment: {
      id: "pre-development";
      label: string;
      description: string;
      sequenceNote: string;
      sourceUrl: string;
      services: DldDeveloperService[];
    };
    development: {
      id: "development";
      label: string;
      description: string;
      sequenceNote: string;
      sourceUrl: string;
      subphases: DldDeveloperSubphase[];
    };
    postDevelopment: {
      id: "post-development";
      label: string;
      description: string;
      sequenceNote: string;
      sourceUrl: string;
      services: DldDeveloperService[];
    };
  };
};

export const dldDeveloperBook = rawDeveloperBook as DldDeveloperBook;

const { preDevelopment, development, postDevelopment } = dldDeveloperBook.stages;

if (preDevelopment.services.length !== 6) throw new Error("DLD pre-development sequence must contain six services.");
if (development.subphases.length !== 3) throw new Error("DLD development sequence must contain three sub-phases.");
if (development.subphases.some((subphase) => subphase.branches.length !== 6)) throw new Error("Every DLD development sub-phase must preserve all six authority branches.");
if (postDevelopment.services.length !== 2) throw new Error("DLD post-development sequence must contain two services.");
