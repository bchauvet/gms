import { acceptHMRUpdate, defineStore } from 'pinia';
import { BnetApi, type Character, WclApi, type WclCharacter, charClasses } from 'src/services/';
import { ref, computed, watch } from 'vue';
import { LocalStorage } from 'quasar';
import { debounce } from 'quasar';

export declare interface CharacterWithLogs extends Character {
  logs?: WclCharacter['zoneRankings'];
}

export declare interface Roster {
  name: string;
  raid_size: number;
  characters: CharacterWithLogs[];
}

export const useRosterStore = defineStore('roster', () => {
  const characters = ref<Character[]>(LocalStorage.getItem('roster') || []);
  const logs = ref<WclCharacter[]>(LocalStorage.getItem('logs') || []);

  const getClassIcon = computed(
    () => (class_id: number) => charClasses.find((cls) => cls.id === class_id)?.icon,
  );

  const getSpecIcon = computed(
    () => (class_id: number, spec: string) =>
      charClasses.find((cls) => cls.id === class_id)?.specializations?.find((s) => s.name === spec)
        ?.icon,
  );

  const getCharacter = async (realm: string, name: string, force = false) => {
    const cache = characters.value.find((c) => c.name === name && c.realm.slug === realm);
    if (cache && !force) return cache;
    let result = <Character>{};
    await BnetApi.character.get(realm, name, !force).then((resp) => {
      result = resp.data;
    });
    const eqItems = await BnetApi.character.getEquipment(realm, name, !force);
    const specializations = await BnetApi.character.getSpec(realm, name, !force);
    const items = await BnetApi.item.searchByIds(eqItems.map((i) => i.item.id));
    const medias = await BnetApi.media.search(
      'item',
      items.map((i) => i.id),
    );
    result = {
      ...result,
      specializations: specializations.specialization_groups,
      equipped_items: eqItems.map((item) => ({
        ...item,
        item: {
          ...items.find((i) => i.id == item.item.id)!,
          media: medias.find((m) => m.id == item.item.id)!,
        },
      })),
    };
    if (force) {
      characters.value = characters.value.map((c) => (c.id === result.id ? result : c));
    } else {
      characters.value.push(result);
    }
    return result;
  };

  const getCharacterLogs = async (realm: string, name: string, force = false) => {
    const cache = logs.value.find((c) => c.name === name && c.server.slug === realm);
    if (cache && !force) return cache;
    const WclChar = await WclApi.getCharLogs(realm, name);
    if (force) {
      logs.value = logs.value.map((c) => (c.name === name && c.server.slug === realm ? WclChar : c));
    } else if (WclChar) {
      logs.value.push(WclChar);
    }
    return WclChar?.zoneRankings;
  };

  watch(
    () => characters.value,
    debounce((value) => {
      try {
        LocalStorage.set('roster', value);
      } catch (err) {
        console.log(err);
      }
    }, 1000),
    { deep: true },
  );

  watch(
    () => logs.value,
    debounce((value) => {
      try {
        LocalStorage.set('logs', value);
      } catch (err) {
        console.log(err);
      }
    }, 1000),
    { deep: true },
  );

  return {
    characters,
    logs,
    getClassIcon,
    getSpecIcon,
    getCharacter,
    getCharacterLogs,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRosterStore, import.meta.hot));
}
