export const BnetIcon =
  'M19.157,9.58c-0.46-0.26-0.88-0.43-0.88-0.43c-1.51-0.68-3.31-1.23-5.32-1.55\tc-1.8-0.29-3.53-0.36-5.09-0.23c0.18-1.23,0.64-2.08,1.4-2.27c1.04-0.24,2.17,0.44,3.25,1.68c0.19,0.03,0.37,0.05,0.56,0.08\tc0.53,0.09,1.05,0.19,1.57,0.31c-1.97-3.7-4.61-5.78-6.62-5.01c-1.53,0.58-2.31,2.68-2.21,5.51c-1.99,0.42-3.58,1.2-4.52,2.24\tl-0.03,0.03c-0.05,0.06-0.15,0.19-0.11,0.26c0.03,0.05,0.12,0,0.16-0.03l0.03-0.01c0.96-0.72,2.62-1.25,4.53-1.51\tc0.16,1.64,0.59,3.48,1.32,5.38c0.65,1.71,1.45,3.23,2.35,4.52c0.64,0.96,1.28,1.63,1.28,1.63c1.36,1.52,2.83,2.5,4.2,2.8l0.04,0.01\tc0.08,0.01,0.24,0.03,0.28-0.04c0.03-0.05-0.06-0.1-0.1-0.13l-0.03-0.01c-1.1-0.48-2.4-1.65-3.57-3.17\tc-0.61-0.75-1.09-1.57-1.09-1.57c-0.62-1-1.15-2.05-1.58-3.15c-0.83-2.19-1.25-4.56-1.2-6.43c1.18-0.04,2.36,0.03,3.52,0.21\tc2.31,0.38,4.57,1.2,6.17,2.17c0.44,0.25,0.92,0.64,0.92,0.64c0.97,0.78,1.48,1.6,1.27,2.35c-0.31,1.02-1.47,1.66-3.08,1.97\tc-0.44,0.57-0.91,1.12-1.4,1.65c4.19,0.15,7.3-1.1,7.65-3.22C23.087,12.64,21.647,10.92,19.157,9.58z&&M10.827,20.18c-2.4,1.5-4.61,1.87-5.88,0.84c-1.67-1.36-1.19-4.68,1.03-8.24c0.16,0.51,0.33,1.02,0.52,1.51\tc0.07,0.18,0.14,0.36,0.21,0.53c-0.54,1.56-0.56,2.88,0.17,3.65c0.54,0.57,1.51,0.54,2.67,0.08\tC10.187,19.51,10.827,20.18,10.827,20.18z&&M18.387,11.51c-0.67,1.42-1.59,2.88-2.74,4.3c-1.28,1.57-2.66,2.87-4,3.83c-0.61-0.75-1.09-1.57-1.09-1.57\tc1.64-0.89,3.48-2.44,4.96-4.25c0.74-0.92,1.39-1.91,1.95-2.95C17.907,11.12,18.387,11.51,18.387,11.51z&&M19.157,9.58c-0.46-0.26-0.88-0.43-0.88-0.43c0.73-1.78,1.1-3.49,0.96-4.68V4.44c-0.01-0.05,0-0.15,0.06-0.15\tc0.08,0,0.14,0.15,0.17,0.22l0.01,0.04C19.907,5.89,19.787,7.65,19.157,9.58z';

export declare interface BnetUser {
  id: number;
  sub: string;
  battletag: string;
}

export declare interface Media {
  id: number;
  assets?: [
    {
      key: string;
      value: string;
    },
  ];
}

export declare interface Class {
  id: number;
  name: string;
  icon?: string;
  specializations: [
    {
      name: string;
      icon: string;
    },
    {
      name: string;
      icon: string;
    },
    {
      name: string;
      icon: string;
    },
  ];
}

export declare interface Specialization {
  is_active: boolean;
  specializations: [
    {
      specialization_name: string;
      spent_points: number;
      talents: [
        {
          talent_rank: number;
          talent: {
            id: number;
          };
          spell_tooltip: {
            spell: {
              id: number;
              name: string;
            };
            description: string;
          };
        },
      ];
    },
  ];
}

export declare interface Character {
  id: number;
  name: string;
  level: number;
  realm: {
    name: string;
    slug: string;
  };
  guild: {
    id: number;
    name: string;
  };
  character_class?: Class;
  playable_class: {
    id: number;
  };
  playable_race: {
    id: number;
  };
  specializations: Specialization[];
  equipped_items: EquippedItem[];
  average_item_level?: number;
}

export declare interface Member {
  rank: number;
  character: Character;
}

export declare interface Enchantment {
  enchantment_id: number;
  enchantment_slot: {
    id: number;
    type?: string;
  };
  source_item?: {
    id: number;
    name: string;
  };
}

export declare interface Stat {
  type: {
    type: string;
    name: string;
  };
  value: number;
}

export declare interface Item {
  id: number;
  name?: string;
  level?: number;
  media: {
    id: number;
    assets?: [{ value: string }];
  };
}

export declare interface EquippedItem {
  item: Item;
  name: string;
  media: Media;
  item_class: {
    id: number;
    name: string;
  };
  slot: {
    type: string;
    name: string;
  };
  binding: {
    type: string;
    name: string;
  };
  armor: {
    value: number;
  };
  quality: {
    type: string;
    name: string;
  };
  enchantments: Enchantment[];
  stats: Stat[];
  set?: {
    display_string: string;
    items: [
      {
        item: Item;
        is_equipped: boolean;
      },
    ];
  };
}

export declare interface Realm {
  id: number;
  name: {
    en_GB: string;
    fr_FR: string;
  };
  slug: string;
  timezone: string;
  locale: string;
  region: {
    id: number;
    name: {
      en_GB: string;
      fr_FR: string;
    };
  };
  type: {
    name: {
      en_GB: string;
      fr_FR: string;
    };
  };
  category: {
    en_GB: string;
    fr_FR: string;
  };
}

export declare interface SearchResult<T> {
  data: T;
}
