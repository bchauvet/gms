import { defineStore } from 'pinia';
import { api, type Class } from 'src/services/blizzardApi';
import { ref, computed } from 'vue';

export const useCharStore = defineStore('character', () => {
  const initialized = ref(false);
  const classes = ref<Class[]>([]);

  const getClassIcon = computed(
    () => (class_id: number) => classes.value.find((cls) => cls.id === class_id)?.icon,
  );

  const initStore = async () => {
    if (initialized.value) return;
    await api.class
      .list()
      .then((resp) =>
        resp.data.classes.forEach((cls: Class) =>
          api.class
            .get_icon(cls.id)
            .then((icon) => classes.value.push({ id: cls.id, name: cls.name, icon: icon })),
        ),
      )
      .finally(() => (initialized.value = true));
  };

  return {
    classes,
    getClassIcon,
    initStore,
  };
});
