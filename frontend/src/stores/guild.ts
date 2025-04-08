import { defineStore } from 'pinia';
import { api } from 'src/services/blizzardApi';
import { sortBy } from 'lodash';
import { ref } from 'vue';

export declare interface Character {
  id: number;
  name: string;
  level: number;
  playable_class: {
    id: number;
  };
  playable_race: {
    id: number;
  };
}

export declare interface Member {
  rank: number;
  character: Character;
}

export const useGuildStore = defineStore('guild', () => {
  const guild = ref();
  const members = ref<Member[]>([]);
  const initialized = ref(false);

  const initStore = async () => {
    if (initialized.value) return;
    await api.guild
      .get('sulfuron', 'insu')
      .then((resp) => {
        guild.value = resp.data;
      })
      .finally(() => (initialized.value = true));
    await api.guild.roster('sulfuron', 'insu').then(
      (resp) =>
        (members.value = sortBy(
          resp.data.members.filter((m: Member) => m.character.level === 85),
          'rank',
        )),
    );
  };

  return {
    guild,
    members,
    initStore,
  };
});
