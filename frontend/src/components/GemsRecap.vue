<script setup lang="ts">
import { type Character, gems } from 'src/services';
import { computed } from 'vue';
import { uniqBy, identity, reduce, orderBy } from 'lodash';

const character = defineModel<Character>('character', { required: true });

const gemsRecap = computed(() => {
  const gemIds = character.value.equipped_items
    .map((i) => i.enchantments?.map((e) => e.source_item?.id))
    .flat()
    .filter((id) => !!id) as number[];
  const _list = uniqBy(gemIds, identity)
    .map((g) => ({
      id: g,
      quality: gems.epic.includes(g) ? 'epic' : gems.rare.includes(g) ? 'rare' : null,
      count: gemIds.filter((id) => id === g).length,
    }))
    .filter((g) => g.quality);
  return {
    count_epic: reduce(_list, (sum, n) => (n.quality === 'epic' ? sum + n.count : sum), 0),
    count_rare: reduce(_list, (sum, n) => (n.quality === 'rare' ? sum + n.count : sum), 0),
    count_total: reduce(_list, (sum, n) => sum + n.count, 0),
    list: orderBy(_list, 'count').reverse(),
  };
});
</script>

<template>
  <span>
    {{ gemsRecap.count_epic }} / {{ gemsRecap.count_total }}
    <q-tooltip>
      <pre>{{ gemsRecap }}</pre>
    </q-tooltip>
  </span>
</template>
