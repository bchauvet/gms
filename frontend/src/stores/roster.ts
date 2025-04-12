import { defineStore } from 'pinia';
import { BnetApi, type Class, type Character, WclApi, type WclCharacter } from 'src/services/';
import { ref, computed, watch } from 'vue';
import { LocalStorage } from 'quasar';
import { debounce } from 'quasar';

export const useRosterStore = defineStore('roster', () => {
  const initialized = ref(false);
  const classes = ref<Class[]>([]);
  const characters = ref<Character[]>(LocalStorage.getItem('roster') || []);
  const logs = ref<WclCharacter[]>([]);

  const getClassIcon = computed(
    () => (class_id: number) => classes.value.find((cls) => cls.id === class_id)?.icon,
  );

  const initStore = async () => {
    if (initialized.value) return;
    await BnetApi.class
      .list()
      .then((resp) =>
        resp.data.classes.forEach((cls: Class) =>
          BnetApi.class
            .get_icon(cls.id)
            .then((icon) => classes.value.push({ id: cls.id, name: cls.name, icon: icon })),
        ),
      )
      .finally(() => (initialized.value = true));
  };

  const getCharacter = async (realm: string, name: string, force = false) => {
    const cache = characters.value.find((c) => c.name === name && c.realm.slug === realm);
    if (cache && !force) return cache;
    let result = <Character>{};
    await BnetApi.character.get(realm, name).then((resp) => {
      result = resp.data;
    });
    const eqItems = await BnetApi.character.getEquipment(realm, name);
    const items = await BnetApi.item.search(eqItems.map((i) => i.item.id));
    const medias = await BnetApi.media.search(
      'item',
      items.map((i) => i.id),
    );
    result = {
      ...result,
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
      logs.value.map((c) => (c.name === name && c.server.slug === realm ? WclChar : c));
    } else {
      logs.value.push(WclChar);
    }
    return WclChar.zoneRankings;
  };

  watch(
    () => characters.value,
    debounce((value) => LocalStorage.set('roster', value), 1000),
    { deep: true },
  );

  return {
    characters,
    logs,
    classes,
    getClassIcon,
    getCharacter,
    getCharacterLogs,
    initStore,
  };
});
