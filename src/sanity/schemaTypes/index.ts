import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './categoryType'
import { productType } from './productType'
import { orderType } from './orderType'
import { settingsType } from './settingsType'
import { couponType } from './couponType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, productType, orderType, settingsType, couponType],
}
