export declare interface zoneRankings {
  bestPerformanceAverage: number;
  metric: string;
  zone: number;
  rankings: encounterRanking[];
}

export declare interface encounterRanking {
  encounter: {
    id: number;
    name: string;
  };
  rankPercent: number;
  totalKills: number;
  fastestKill: number;
}

export declare interface WclCharacter {
  id: number;
  name: string;
  guildRank: number;
  server: {
    id: number;
    name: string;
    slug: string;
    region: {
      slug: string;
    };
  };
  zoneRankings: zoneRankings;
}

export declare interface WclReport {
  code: string;
  title: string;
  startTime: string;
  owner: {
    name: string;
  };
  fights: WclReportFight[];
  playerDetails: {
    data: {
      playerDetails: {
        tanks: WclFightActor[];
        dps: WclFightActor[];
        healers: WclFightActor[];
      };
    };
  };
}

export declare interface WclReportFight {
  id: number;
  name: string;
  kill: boolean;
  encounterID: number;
  size: number;
  startTime: number;
  difficulty: number;
}

export declare interface WclFightActor {
  name: string;
  server: string;
  icon: string;
  id: number;
  maxItemLevel: number;
  type: string;
}
