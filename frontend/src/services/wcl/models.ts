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
    }
  };
  zoneRankings: zoneRankings;
}
