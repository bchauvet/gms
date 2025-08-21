<script setup lang="ts">
import { type EquippedItem } from 'src/services';
import { computed } from 'vue';

const equippedItem = defineModel<EquippedItem>('item', { required: true });

const getItemEnchantmentIds = computed(() => {
  return (
    equippedItem.value.enchantments
      ?.filter((e) => e.enchantment_slot?.type)
      .map((k) => k.enchantment_id)
      .join(':') ?? ''
  );
});

const getItemGemIds = computed(() => {
  return (
    equippedItem.value.enchantments
      ?.filter((e) => !e.enchantment_slot?.type)
      .map((k) => k.source_item?.id)
      .filter((e) => e)
      .join(':') ?? ''
  );
});

const getSetItemIds = computed(() => {
  return (
    equippedItem.value?.set?.items
      .filter((k) => k.is_equipped)
      .map((k) => k.item.id)
      .join(':') ?? ''
  );
});

const getItemIcon = computed(() => {
  return equippedItem.value.item.media?.assets
    ? equippedItem.value.item.media.assets[0]?.value.split('/').pop()
    : null;
});
</script>

<template>
  <a
    :href="`https://www.wowhead.com/mop-classic/item=${equippedItem.item.id}`"
    target="_blank"
    :data-wowhead="`gems=${getItemGemIds}&ench=${getItemEnchantmentIds}&pcs=${getSetItemIds}`"
  >
    <q-img width="2.4rem" :src="'https://wow.zamimg.com/images/wow/icons/large/' + getItemIcon">
      <div
        class="absolute-bottom text-center text-bold"
        style="
          font-size: 0.75rem;
          padding: 0;
          color: rgb(255, 209, 0);
        "
      >
        {{ equippedItem.item.level }}
      </div>
    </q-img>
  </a>
</template>
