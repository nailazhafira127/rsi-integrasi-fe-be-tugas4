const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

const json = (schema: unknown) => ({
  'application/json': { schema },
});

const success = (schema: unknown) => ({
  description: 'Berhasil',
  content: json({
    type: 'object',
    required: ['status', 'data'],
    properties: {
      status: { type: 'string', example: 'success' },
      data: schema,
    },
  }),
});

const listSuccess = (schema: unknown) =>
  success({ type: 'array', items: schema });

const dataBody = (schema: unknown) => ({
  required: true,
  content: json(schema),
});

const error = (description: string) => ({
  description,
  content: json(ref('Error')),
});

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
};

const ok = (description: string) => ({ description });

const auth = [{ cookieAuth: [] }];

const denied = {
  401: error('Belum login'),
  403: error('Role tidak diizinkan'),
};

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'NyamNyam API - Hands-On 2',
    version: '1.0.0',
    description:
      'API integrasi frontend-backend untuk autentikasi cookie JWT, CRUD warung/menu/review, like, flag, dan audit log.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    { name: 'SYSTEM', description: 'Status server dan database' },
    { name: 'AUTH', description: 'Register, login, sesi, dan logout' },
    { name: 'STALLS', description: 'Kantin, menu kantin, dan review kantin' },
    { name: 'USERS', description: 'Manajemen pengguna oleh admin' },
    { name: 'MENU_ITEMS', description: 'Manajemen menu oleh admin' },
    { name: 'REVIEWS', description: 'Daftar dan penghapusan review oleh admin' },
    { name: 'LIKES', description: 'Like review oleh admin' },
    { name: 'FLAGS', description: 'Laporan review dan moderasi admin' },
    { name: 'AUDIT_LOGS', description: 'Audit log aktivitas admin' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'kantin_session',
        description: 'JWT disimpan sebagai cookie HttpOnly setelah login.',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        required: ['status', 'message'],
        properties: {
          status: { type: 'string', enum: ['fail', 'error'], example: 'fail' },
          message: { type: 'string', example: 'Data tidak ditemukan' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'format email tidak valid' },
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        required: ['id', 'name', 'email', 'role', 'createdAt'],
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Admin Kantin' },
          email: { type: 'string', format: 'email', example: 'admin@kantin.test' },
          role: { type: 'string', enum: ['admin', 'owner', 'customer'] },
          createdAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Stall: {
        type: 'object',
        required: ['id', 'ownerId', 'ownerName', 'name', 'avgRating', 'reviewCount', 'isPopular'],
        properties: {
          id: { type: 'integer' },
          ownerId: { type: 'integer' },
          ownerName: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string', nullable: true },
          location: { type: 'string', nullable: true },
          description: { type: 'string', nullable: true },
          avgRating: { type: 'number', example: 4.5 },
          reviewCount: { type: 'integer', example: 2 },
          isPopular: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Menu: {
        type: 'object',
        required: ['id', 'stallId', 'stallName', 'name', 'price', 'isAvailable'],
        properties: {
          id: { type: 'integer' },
          stallId: { type: 'integer' },
          stallName: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'integer', example: 15000 },
          isAvailable: { type: 'boolean' },
        },
      },
      Review: {
        type: 'object',
        required: ['id', 'stallId', 'userId', 'rating', 'likeCount', 'likedByMe'],
        properties: {
          id: { type: 'integer' },
          stallId: { type: 'integer' },
          stallName: { type: 'string' },
          userId: { type: 'integer' },
          userName: { type: 'string' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string', nullable: true },
          likeCount: { type: 'integer' },
          likedByMe: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time', nullable: true },
          updatedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      LikeState: {
        type: 'object',
        required: ['reviewId', 'liked', 'likeCount'],
        properties: {
          reviewId: { type: 'integer' },
          liked: { type: 'boolean' },
          likeCount: { type: 'integer' },
        },
      },
      Flag: {
        type: 'object',
        required: ['id', 'reviewId', 'reportedBy', 'status'],
        properties: {
          id: { type: 'integer' },
          reviewId: { type: 'integer' },
          reportedBy: { type: 'integer' },
          reporterName: { type: 'string' },
          reviewComment: { type: 'string', nullable: true },
          stallId: { type: 'integer' },
          stallName: { type: 'string' },
          reason: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['pending', 'resolved', 'dismissed'] },
          createdAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      AuditLog: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          userName: { type: 'string' },
          action: { type: 'string' },
          targetTable: { type: 'string' },
          targetId: { type: 'integer' },
          metadata: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100 },
          email: { type: 'string', format: 'email', maxLength: 150 },
          password: { type: 'string', minLength: 8, maxLength: 72 },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      CreateUserInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100 },
          email: { type: 'string', format: 'email', maxLength: 150 },
          password: { type: 'string', minLength: 8, maxLength: 72 },
          role: { type: 'string', enum: ['admin', 'owner', 'customer'], default: 'customer' },
        },
      },
      LikeInput: {
        type: 'object',
        required: ['reviewId'],
        properties: {
          reviewId: { type: 'integer', minimum: 1 },
        },
      },
      AuditLogInput: {
        type: 'object',
        required: ['action', 'targetTable', 'targetId'],
        properties: {
          action: { type: 'string', maxLength: 50 },
          targetTable: { type: 'string', maxLength: 50 },
          targetId: { type: 'integer', minimum: 1 },
          metadata: { type: 'object', additionalProperties: true },
        },
      },
      StallCreateInput: {
        type: 'object',
        required: ['ownerId', 'name'],
        properties: {
          ownerId: { type: 'integer' },
          name: { type: 'string', minLength: 3, maxLength: 100 },
          category: { type: 'string', nullable: true, maxLength: 50 },
          location: { type: 'string', nullable: true, maxLength: 100 },
          description: { type: 'string', nullable: true, maxLength: 1000 },
        },
      },
      StallUpdateInput: {
        type: 'object',
        properties: {
          ownerId: { type: 'integer' },
          name: { type: 'string', minLength: 3, maxLength: 100 },
          category: { type: 'string', nullable: true, maxLength: 50 },
          location: { type: 'string', nullable: true, maxLength: 100 },
          description: { type: 'string', nullable: true, maxLength: 1000 },
        },
      },
      MenuInput: {
        type: 'object',
        required: ['stallId', 'name', 'price'],
        properties: {
          stallId: { type: 'integer' },
          name: { type: 'string', minLength: 2, maxLength: 100 },
          price: { type: 'integer', minimum: 0 },
          isAvailable: { type: 'boolean', default: true },
        },
      },
      ReviewInput: {
        type: 'object',
        required: ['rating'],
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string', nullable: true, maxLength: 1000 },
        },
      },
      FlagStatusInput: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['resolved', 'dismissed'] },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['SYSTEM'],
        summary: 'Cek kesehatan server & database',
        responses: { 200: ok('Server dan database terhubung'), 500: error('Database error') },
      },
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['AUTH'],
        summary: 'Registrasi akun (selalu role customer)',
        requestBody: dataBody(ref('RegisterInput')),
        responses: { 201: success(ref('User')), 400: error('Validasi gagal'), 409: error('Email sudah terdaftar') },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['AUTH'],
        summary: 'Login, mengembalikan JWT',
        requestBody: dataBody(ref('LoginInput')),
        responses: { 200: success(ref('User')), 401: error('Email atau password salah') },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['AUTH'],
        summary: 'Profil user dari token (semua role)',
        security: auth,
        responses: { 200: success(ref('User')), 401: error('Belum login') },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['AUTH'],
        summary: 'Logout, hapus cookie sesi',
        responses: { 204: ok('Cookie sesi dihapus') },
      },
    },
    '/api/v1/stalls': {
      get: {
        tags: ['STALLS'],
        summary: 'Daftar kantin (publik)',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: listSuccess(ref('Stall')) },
      },
      post: {
        tags: ['STALLS'],
        summary: 'Tambah warung (admin memilih pemilik, owner untuk akun sendiri)',
        security: auth,
        requestBody: dataBody(ref('StallCreateInput')),
        responses: { 201: success(ref('Stall')), 400: error('Validasi gagal'), ...denied, 404: error('Owner tidak ditemukan') },
      },
    },
    '/api/v1/stalls/{id}': {
      get: {
        tags: ['STALLS'],
        summary: 'Detail kantin (publik)',
        parameters: [idParameter],
        responses: { 200: success(ref('Stall')), 404: error('Warung tidak ditemukan') },
      },
      put: {
        tags: ['STALLS'],
        summary: 'Update kantin (owner pemilik, admin)',
        security: auth,
        parameters: [idParameter],
        requestBody: dataBody(ref('StallUpdateInput')),
        responses: { 200: success(ref('Stall')), 400: error('Validasi gagal'), ...denied, 404: error('Tidak ditemukan') },
      },
      delete: {
        tags: ['STALLS'],
        summary: 'Hapus kantin (admin)',
        security: auth,
        parameters: [idParameter],
        responses: { 204: ok('Warung dihapus'), ...denied, 404: error('Warung tidak ditemukan') },
      },
    },
    '/api/v1/stalls/{id}/menus': {
      get: {
        tags: ['STALLS'],
        summary: 'Daftar menu sebuah kantin (owner pemilik, admin)',
        security: auth,
        parameters: [idParameter],
        responses: { 200: listSuccess(ref('Menu')), ...denied, 404: error('Warung tidak ditemukan') },
      },
    },
    '/api/v1/stalls/{id}/reviews': {
      get: {
        tags: ['STALLS'],
        summary: 'Daftar review sebuah kantin (publik, cookie opsional)',
        parameters: [idParameter],
        responses: { 200: listSuccess(ref('Review')), 404: error('Warung tidak ditemukan') },
      },
      post: {
        tags: ['STALLS'],
        summary: 'Tambah review ke kantin (semua role yang login)',
        security: auth,
        parameters: [idParameter],
        requestBody: dataBody(ref('ReviewInput')),
        responses: {
          201: success(ref('Review')),
          400: error('Validasi gagal'),
          401: error('Belum login'),
          404: error('Warung tidak ditemukan'),
          409: error('Sudah pernah review warung ini'),
        },
      },
    },
    '/api/v1/users': {
      get: {
        tags: ['USERS'],
        summary: 'Daftar pengguna (admin)',
        security: auth,
        parameters: [
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'owner', 'customer'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: listSuccess(ref('User')), ...denied },
      },
      post: {
        tags: ['USERS'],
        summary: 'Tambah pengguna (admin)',
        security: auth,
        requestBody: dataBody(ref('CreateUserInput')),
        responses: { 201: success(ref('User')), 400: error('Validasi gagal'), ...denied, 409: error('Email sudah terdaftar') },
      },
    },
    '/api/v1/menu-items': {
      get: {
        tags: ['MENU_ITEMS'],
        summary: 'Daftar menu (join stall) (publik)',
        parameters: [
          { name: 'stallId', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'available', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
        ],
        responses: { 200: listSuccess(ref('Menu')), ...denied },
      },
      post: {
        tags: ['MENU_ITEMS'],
        summary: 'Tambah menu (admin atau owner warung)',
        security: auth,
        requestBody: dataBody(ref('MenuInput')),
        responses: { 201: success(ref('Menu')), 400: error('Validasi gagal'), ...denied, 404: error('Warung tidak ditemukan') },
      },
    },
    '/api/v1/menu-items/{id}': {
      get: {
        tags: ['MENU_ITEMS'],
        summary: 'Detail menu (admin)',
        security: auth,
        parameters: [idParameter],
        responses: { 200: success(ref('Menu')), ...denied, 404: error('Menu tidak ditemukan') },
      },
      put: {
        tags: ['MENU_ITEMS'],
        summary: 'Ubah menu (admin atau owner warung)',
        security: auth,
        parameters: [idParameter],
        requestBody: dataBody(ref('MenuInput')),
        responses: { 200: success(ref('Menu')), 400: error('Validasi gagal'), ...denied, 404: error('Tidak ditemukan') },
      },
      delete: {
        tags: ['MENU_ITEMS'],
        summary: 'Hapus menu (admin atau owner warung)',
        security: auth,
        parameters: [idParameter],
        responses: { 204: ok('Menu dihapus'), ...denied, 404: error('Menu tidak ditemukan') },
      },
    },
    '/api/v1/reviews': {
      get: {
        tags: ['REVIEWS'],
        summary: 'Daftar review (join user) (admin)',
        security: auth,
        responses: { 200: listSuccess(ref('Review')), ...denied },
      },
    },
    '/api/v1/reviews/mine': {
      get: {
        tags: ['REVIEWS'],
        summary: 'Daftar review milik sendiri (customer)',
        security: auth,
        responses: { 200: listSuccess(ref('Review')), ...denied },
      },
    },
    '/api/v1/reviews/manage': {
      get: {
        tags: ['REVIEWS'],
        summary: 'Daftar review yang dikelola (admin, pemilik warung)',
        security: auth,
        responses: { 200: listSuccess(ref('Review')), ...denied },
      },
    },
    '/api/v1/reviews/{id}': {
      delete: {
        tags: ['REVIEWS'],
        summary: 'Hapus review (admin)',
        security: auth,
        parameters: [idParameter],
        responses: { 204: ok('Review dihapus'), ...denied, 404: error('Review tidak ditemukan') },
      },
    },
    '/api/v1/likes': {
      post: {
        tags: ['LIKES'],
        summary: 'Beri like pada review (admin)',
        security: auth,
        requestBody: dataBody(ref('LikeInput')),
        responses: {
          201: success(ref('LikeState')),
          400: error('Validasi gagal'),
          ...denied,
          404: error('Review tidak ditemukan'),
          409: error('Sudah like'),
        },
      },
    },
    '/api/v1/likes/{id}': {
      delete: {
        tags: ['LIKES'],
        summary: 'Hapus like (admin)',
        security: auth,
        parameters: [idParameter],
        responses: { 200: success(ref('LikeState')), ...denied, 404: error('Like tidak ditemukan') },
      },
    },
    '/api/v1/flags': {
      get: {
        tags: ['FLAGS'],
        summary: 'Daftar laporan review (admin)',
        security: auth,
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'resolved', 'dismissed'] } },
        ],
        responses: { 200: listSuccess(ref('Flag')), ...denied },
      },
    },
    '/api/v1/flags/{id}': {
      put: {
        tags: ['FLAGS'],
        summary: 'Perbarui status laporan (admin)',
        security: auth,
        parameters: [idParameter],
        requestBody: dataBody(ref('FlagStatusInput')),
        responses: { 200: success(ref('Flag')), 400: error('Validasi gagal'), ...denied, 404: error('Flag tidak ditemukan') },
      },
    },
    '/api/v1/audit-logs': {
      get: {
        tags: ['AUDIT_LOGS'],
        summary: 'Daftar audit log (admin)',
        security: auth,
        parameters: [
          { name: 'action', in: 'query', schema: { type: 'string' } },
          { name: 'targetTable', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: listSuccess(ref('AuditLog')), ...denied },
      },
      post: {
        tags: ['AUDIT_LOGS'],
        summary: 'Catat aktivitas audit (admin)',
        security: auth,
        requestBody: dataBody(ref('AuditLogInput')),
        responses: { 201: ok('Audit log berhasil dicatat'), 400: error('Validasi gagal'), ...denied },
      },
    },
  },
} as const;