import { t } from 'elysia';

export const userODT = {
  'sign': t.Object({
    email: t.String(),
    password: t.String()
  }),
  'create': t.Object({
    email: t.String(),
    password: t.String({
      minLength: 8
    }),
    name: t.String(),
    role: t.String({
      enum: ['admin', 'user']
    })
  }),
  'response': t.Object({
    id: t.Number(),
    email: t.String(),
    name: t.String(),
    role: t.String({
      enum: ['admin', 'user']
    }),
  }),
  'update': t.Object({
    email: t.Optional(t.String()),
    password: t.Optional(t.String({
      minLength: 8
    })),
    name: t.Optional(t.String()),
    role: t.Optional(t.String({
      enum: ['admin', 'user']
    }))
  }),
};


export const vehicleODT = {
  create: t.Object({
    plate: t.String(),
    color: t.Union([t.String(), t.Null()]),
    brand: t.String(),
    chassis: t.Union([t.String(), t.Null()]),
    supplierId: t.Number(),
  }),
  response: t.Object({
    id: t.Number(),
    plate: t.String(),
    color: t.Union([t.String(), t.Null()]),
    brand: t.String(),
    chassis: t.Union([t.String(), t.Null()]),
    supplierId: t.Number(),
  })
};

export const supplierODT = {
  create: t.Object({
    code: t.String(),
    name: t.String()
  }),
  response: t.Object({
    id: t.Number(),
    code: t.String(),
    name: t.String()
  })
};

export const factoryODT = {
  create: t.Object({
    code: t.String(),
    name: t.String()
  }),
  response: t.Object({
    id: t.Number(),
    code: t.String(),
    name: t.String()
  })
};

export const farmerODT = {
  create: t.Object({
    code: t.String(),
    name: t.String(),
    address: t.String(),
    phone: t.String(),
  }),
  response: t.Object({
    id: t.Number(),
    code: t.String(),
    name: t.String(),
    address: t.String(),
    phone: t.String(),
  })
};

export const transactionODT = {
  create: t.Object({
    code: t.String()
  }),
  response: t.Object({
    id: t.Number(),
    code: t.String()
  })
};
