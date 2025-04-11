import { defineStore } from 'pinia';
import { BnetApi, type Member } from 'src/services/';
import { sortBy } from 'lodash';
import { ref } from 'vue';

export const useGuildStore = defineStore('guild', () => {
  const guild = ref();
  const members = ref<Member[]>([]);
  const initialized = ref(false);

  const initStore = async () => {
    if (initialized.value) return;
    await BnetApi.guild
      .get('sulfuron', 'insu')
      .then((resp) => {
        guild.value = resp.data;
      })
      .finally(() => (initialized.value = true));
    await BnetApi.guild.roster('sulfuron', 'insu').then(
      (resp) =>
        (members.value = sortBy(
          resp.data.members.filter((m: Member) => m.character.level === 85),
          'rank',
        )),
    );
    initialized.value = true;
  };

  return {
    guild,
    members,
    initStore,
  };
});
