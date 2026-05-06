import { defineField, defineType } from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'cafeteriaName',
      title: 'Cafeteria Name',
      type: 'string',
      initialValue: 'Cafeteria App',
    }),
    defineField({
      name: 'taxRate',
      title: 'Tax Rate (%)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
    }),
  ],
})
