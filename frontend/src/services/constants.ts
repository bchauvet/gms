import type { Class } from 'src/services/blizzard/models';

const itemSlots = [
  'HEAD',
  'NECK',
  'SHOULDER',
  'BACK',
  'CHEST',
  'WRIST',
  'HANDS',
  'WAIST',
  'LEGS',
  'FEET',
  'FINGER_1',
  'FINGER_2',
  'TRINKET_1',
  'TRINKET_2',
  'MAIN_HAND',
  'OFF_HAND',
  'RANGED',
];

const rankColors = {
  astounding: '#e268a8',
  legendary: '#ff8000',
  epic: '#a335ee',
  rare: '#0070ff',
  uncommon: '#1eff00',
  common: '#666',
};

const getRankColor = (value: number, max = 100) =>
  value / max >= 0.99
    ? rankColors.astounding
    : value / max >= 0.95
      ? rankColors.legendary
      : value / max >= 0.75
        ? rankColors.epic
        : value / max >= 0.5
          ? rankColors.rare
          : value / max >= 0.25
            ? rankColors.uncommon
            : rankColors.common;

const charClasses = [
  {
    id: 1,
    name: 'Warrior',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_warrior.jpg',
    specializations: [
      {
        name: 'Arms',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_savageblow.jpg',
      },
      {
        name: 'Fury',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_innerrage.jpg',
      },
      {
        name: 'Protection',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_defensivestance.jpg',
      }
    ]
  },
  {
    id: 2,
    name: 'Paladin',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_paladin.jpg',
    specializations: [
      {
        name: 'Holy',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_holybolt.jpg',
      },
      {
        name: 'Protection',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_paladin_shieldofthetemplar.jpg',
      },
      {
        name: 'Retribution',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_auraoflight.jpg',
      }
    ]
  },
  {
    id: 3,
    name: 'Hunter',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_hunter.jpg',
    specializations: [
      {
        name: 'Beastmastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_bestialdiscipline.jpg',
      },
      {
        name: 'Marksmanship',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_focusedaim.jpg',
      },
      {
        name: 'Survival',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_camouflage.jpg',
      }
    ]
  },
  {
    id: 7,
    name: 'Shaman',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_shaman.jpg',
    specializations: [
      {
        name: 'Elemental',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_lightning.jpg',
      },
      {
        name: 'Enhancement',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_lightning.jpg',
      },
      {
        name: 'Restoration',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_magicimmunity.jpg',
      },
    ],
  },
  {
    id: 4,
    name: 'Rogue',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_rogue.jpg',
    specializations: [
      {
        name: 'Combat',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_backstab.jpg',
      },
      {
        name: 'Subtlety',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_stealth.jpg',
      },
      {
        name: 'Assassination',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_eviscerate.jpg',
      }
    ],
  },
  {
    id: 8,
    name: 'Mage',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_mage.jpg',
    specializations: [
      {
        name: 'Arcane',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_magicalsentry.jpg',
      },
      {
        name: 'Fire',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_fire_firebolt02.jpg',
      },
      {
        name: 'Frost',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_frost_frostbolt02.jpg',
      }
    ]
  },
  {
    id: 5,
    name: 'Priest',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_priest.jpg',
    specializations: [
      {
        name: 'Discipline',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_powerwordshield.jpg',
      },
      {
        name: 'Holy',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_guardianspirit.jpg',
      },
      {
        name: 'Shadow',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_shadowwordpain.jpg',
      }
    ]
  },
  {
    id: 9,
    name: 'Warlock',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_warlock.jpg',
    specializations: [
      {
        name: 'Affliction',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_deathcoil.jpg',
      },
      {
        name: 'Demonology',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_metamorphosis.jpg',
      },
      {
        name: 'Destruction',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_rainoffire.jpg',
      }
    ]
  },
  {
    id: 11,
    name: 'Druid',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/classicon_druid.jpg',
    specializations: [
      {
        name: 'Feral Combat',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/ability_racial_bearform.jpg',
      },
      {
        name: 'Balance',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_starfall.jpg',
      },
      {
        name: 'Restoration',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_healingtouch.jpg',
      },
    ],
  },
  {
    id: 6,
    name: 'Death Knight',
    icon: 'https://render.worldofwarcraft.com/classic-eu/icons/56/spell_deathknight_classicon.jpg',
    specializations: [
      {
        name: 'Blood',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_bloodpresence.jpg',
      },
      {
        name: 'Frost',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_frostpresence.jpg',
      },
      {
        name: 'Unholy',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_unholypresence.jpg',
      }
    ]
  },
] as Class[];

export { itemSlots, rankColors, getRankColor, charClasses };
