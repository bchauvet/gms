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

const getItemUpgradeLvl = computed(() => {
  return equippedItem.value.upgrade_id === 447 ? 2 : equippedItem.value.upgrade_id === 446 ? 1 : 0;
});

const profEnchants = [
  'Goblin Glider',
  'Synapse Springs',
  'Nitro Boosts',
  'Enchanted: Lightweave Embroidery',
  'Enchanted: +500 Agility',
];
</script>

<template>
  <a
    :href="`https://www.wowhead.com/mop-classic/item=${equippedItem.item.id}`"
    target="_blank"
    :data-wowhead="`gems=${getItemGemIds}&ench=${getItemEnchantmentIds}&pcs=${getSetItemIds}&upgd=${getItemUpgradeLvl}`"
  >
    <q-img width="2.8rem" :src="'https://wow.zamimg.com/images/wow/icons/large/' + getItemIcon">
      <div
        class="absolute-bottom text-center text-bold"
        :style="`font-size: 0.8rem; padding: 0; color: ${getItemUpgradeLvl === 2 ? 'rgb(0,255,0)' : getItemUpgradeLvl === 1 ? 'rgb(255,209,0)' : 'rgb(255,0,0)'}`"
      >
        {{ (equippedItem.item.level || 0) + getItemUpgradeLvl * 4 }}
      </div>
      <div
        class="absolute-top-left"
        v-if="
          equippedItem.enchantments?.some((e) => profEnchants.includes(e.display_string)) ||
          equippedItem.enchantments?.some((e) => [5002, 3717, 3723].includes(e.enchantment_id))
        "
        style="
          font-size: 0.9rem;
          padding: 0;
          color: rgb(255, 209, 0);
          background-color: rgba(0, 0, 0, 0);
        "
      >
        <q-icon
          class="absolute-top"
          v-if="equippedItem.enchantments?.some((e) => e?.display_string?.includes('Lightweave'))"
          style="border: 2px solid rgb(0, 255, 0)"
          name="img:https://wow.zamimg.com/images/wow/icons/large/trade_tailoring.jpg"
        />
        <q-icon
          v-else-if="
            equippedItem.enchantments?.some((e) => e?.display_string?.includes('Enchanted: +500'))
          "
          style="border: 2px solid rgb(0, 255, 0)"
          name="img:https://wow.zamimg.com/images/wow/icons/large/trade_leatherworking.jpg"
        />
        <q-icon
          v-else-if="
            equippedItem.enchantments?.some((e) => profEnchants.includes(e?.display_string))
          "
          style="border: 2px solid rgb(0, 255, 0)"
          name="img:https://wow.zamimg.com/images/wow/icons/large/trade_engineering.jpg"
        />
        <q-icon
          v-if="
            equippedItem.enchantments?.some((e) => [5002, 3717, 3723].includes(e.enchantment_id))
          "
          style="border: 2px solid rgb(0, 255, 0)"
          name="img:https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg"
        />
      </div>
    </q-img>
  </a>
</template>
