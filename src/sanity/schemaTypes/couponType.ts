import { defineField, defineType } from 'sanity'

export const couponType = defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: "The name of the promotion (e.g., Valentine's Day 20%)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'The code the user sees or enters (e.g., VDAY20)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage (%)', value: 'percentage' },
          { title: 'Fixed Amount ($)', value: 'fixed' },
        ],
      },
      initialValue: 'percentage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      description: 'The amount or percentage of the discount',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Master switch to manually turn the coupon on or off globally',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'code',
      isActive: 'isActive',
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title,
        subtitle: `${subtitle} - ${isActive ? '🟢 Active' : '🔴 Inactive'}`,
      }
    },
  },
})
