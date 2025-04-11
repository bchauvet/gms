import { defineStore } from 'pinia';
import { BnetApi, type Class, type Character } from 'src/services/';
import { ref, computed } from 'vue';

export const useCharStore = defineStore('character', () => {
  const initialized = ref(false);
  const classes = ref<Class[]>([]);
  const characters = ref<Character[]>([]);

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

  return {
    characters,
    classes,
    getClassIcon,
    getCharacter,
    initStore,
  };
});
