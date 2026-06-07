import { defineField, defineType, defineArrayMember } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'tableNumber',
      title: 'Table Number',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
            }),
            defineField({
              name: 'priceAtTime',
              title: 'Price at Time of Order',
              type: 'number',
            }),
          ],
          preview: {
            select: {
              title: 'product.name',
              quantity: 'quantity',
              price: 'priceAtTime',
            },
            prepare(selection) {
              const { title, quantity, price } = selection
              return {
                title: `${quantity}x ${title}`,
                subtitle: `$${price}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Received', value: 'received' },
          { title: 'Preparing', value: 'preparing' },
          { title: 'Ready', value: 'ready' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'received',
    }),
    defineField({
      name: 'mercadoPagoPaymentId',
      title: 'Mercado Pago Payment ID',
      type: 'string',
    }),
    defineField({
      name: 'userId',
      title: 'Customer User ID (Clerk)',
      type: 'string',
      description: 'Optional: If the customer was logged in.',
    }),
    defineField({
      name: 'appliedCoupon',
      title: 'Applied Coupon',
      type: 'reference',
      to: [{ type: 'coupon' }],
      description: 'The coupon that was applied to this order.',
    }),
  ],
  preview: {
    select: {
      title: 'tableNumber',
      subtitle: 'orderStatus',
      media: '',
    },
    prepare({ title, subtitle }) {
      return {
        title: `Table: ${title}`,
        subtitle: `Status: ${subtitle}`,
      }
    },
  },
})
