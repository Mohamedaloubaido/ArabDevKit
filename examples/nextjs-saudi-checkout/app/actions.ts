'use server';

import { normalizeAddress, type AddressValue } from '@arabdevkit/core';
import { sa } from '@arabdevkit/zod';
import { z } from 'zod';

const CheckoutSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: sa.phone(),
  vatNumber: z.union([sa.vatNumber(), z.literal('')]),
  address: sa.address()
});

export async function createCheckout(formData: FormData): Promise<void> {
  const address: AddressValue = normalizeAddress('SA', {
    buildingNumber: String(formData.get('buildingNumber') ?? ''),
    street: String(formData.get('street') ?? ''),
    district: String(formData.get('district') ?? ''),
    city: String(formData.get('city') ?? ''),
    subdivision: String(formData.get('subdivision') ?? ''),
    postalCode: String(formData.get('postalCode') ?? ''),
    secondaryNumber: String(formData.get('secondaryNumber') ?? ''),
    shortAddress: String(formData.get('shortAddress') ?? '')
  });

  const result = CheckoutSchema.safeParse({
    fullName: String(formData.get('fullName') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    vatNumber: String(formData.get('vatNumber') ?? ''),
    address
  });

  if (!result.success) {
    throw new Error(`Checkout validation failed: ${result.error.issues.map((issue) => issue.message).join('; ')}`);
  }

  // Persist result.data to your database or payment/order workflow here.
  console.info('Validated Saudi checkout', result.data);
}
