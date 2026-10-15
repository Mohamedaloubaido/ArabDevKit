import { listAddressSubdivisions } from '@arabdevkit/core';
import { createCheckout } from './actions';

export default function SaudiCheckoutPage() {
  const regions = listAddressSubdivisions('SA');

  return (
    <main dir="rtl" lang="ar">
      <h1>مثال Checkout سعودي</h1>
      <p>التحقق الحقيقي يُعاد على السيرفر قبل حفظ الطلب.</p>

      <form action={createCheckout}>
        <label>
          الاسم الكامل
          <input name="fullName" autoComplete="name" required />
        </label>

        <label>
          رقم الجوال
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required />
        </label>

        <label>
          الرقم الضريبي — اختياري
          <input name="vatNumber" inputMode="numeric" />
        </label>

        <fieldset>
          <legend>العنوان الوطني</legend>

          <label>
            رقم المبنى
            <input name="buildingNumber" inputMode="numeric" required />
          </label>

          <label>
            الشارع
            <input name="street" autoComplete="address-line1" required />
          </label>

          <label>
            الحي
            <input name="district" autoComplete="address-level3" required />
          </label>

          <label>
            المدينة
            <input name="city" autoComplete="address-level2" required />
          </label>

          <label>
            المنطقة
            <select name="subdivision" autoComplete="address-level1">
              <option value="">—</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.nameAr}</option>
              ))}
            </select>
          </label>

          <label>
            الرمز البريدي
            <input name="postalCode" inputMode="numeric" autoComplete="postal-code" required />
          </label>

          <label>
            الرقم الفرعي
            <input name="secondaryNumber" inputMode="numeric" required />
          </label>

          <label>
            العنوان المختصر — اختياري
            <input name="shortAddress" dir="ltr" />
          </label>
        </fieldset>

        <button type="submit">تحقق وأكمل الطلب</button>
      </form>
    </main>
  );
}
