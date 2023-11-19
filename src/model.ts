import { t } from 'elysia';

export const ModelObt = {
    'user.create': t.Object({
      email: t.String(),
      password: t.String({
        minLength: 8
      }),
      nama: t.String(),
      role: t.String({
        enum: ['admin', 'user']
      })
    }),
    'user.response': t.Object({ 
      id: t.Number(),
      email: t.String(),
      nama: t.String(),
    }),
    'supplier.create': t.Object({
      kode: t.String(),
      nama: t.String()
    }),
    'supplier.response': t.Object({
      id: t.Number(),
      kode: t.String(),
      nama: t.String()
    }),
    'factory.create': t.Object({
      kode: t.String(),
      nama: t.String()
    }),
    'factory.response': t.Object({
      id: t.Number(),
      kode: t.String(),
      nama: t.String()
    }),
    'farmer.create': t.Object({
      kode: t.String(),
      nama: t.String()
    }),
    'farmer.response': t.Object({
      id: t.Number(),
      kode: t.String(),
      nama: t.String()
    }),
    'vehicle.create': t.Object({
      plat: t.String(),
      warna: t.Union([t.String(), t.Null()]),
      merk: t.String(),
      rangka: t.Union([t.String(), t.Null()]),
      kodeSupplier: t.String(),
    }),
    'vehicle.response': t.Object({
      id: t.Number(),
      plat: t.String(),
      warna: t.Union([t.String(), t.Null()]),
      merk: t.String(),
      rangka: t.Union([t.String(), t.Null()]),
      kodeSupplier: t.String(),
    }),
  };

