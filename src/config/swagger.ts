import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CoWork Kerala Admin Panel API',
            version: '1.0.0',
            description: 'API documentation for CoWork Kerala Admin Panel - Manage coworking spaces, leads, and settings',
            contact: {
                name: 'CoWork Kerala Support',
                email: 'support@coworkkerala.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}/api/v1`,
                description: 'Development server',
            },
            {
                url: 'https://api.coworkkerala.com/v1',
                description: 'Production server',
            },
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization',
            },
            {
                name: 'Settings',
                description: 'User account settings',
            },
            {
                name: 'Upload',
                description: 'File upload and management with Cloudflare R2',
            },
            {
                name: 'Spaces',
                description: 'Coworking space management',
            },
            {
                name: 'Leads',
                description: 'Lead management and tracking',
            },
            {
                name: 'Locations',
                description: 'Location management (Cities, Areas)',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                        error: {
                            type: 'string',
                            example: 'Detailed error information',
                        },
                    },
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Validation error',
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        example: 'email',
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Invalid email address',
                                    },
                                },
                            },
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'admin@coworkkerala.com',
                        },
                        name: {
                            type: 'string',
                            example: 'Admin User',
                        },
                        role: {
                            type: 'string',
                            enum: ['admin', 'super_admin'],
                            example: 'admin',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'admin@coworkkerala.com',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'Admin@123456',
                        },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Operation successful',
                        },
                    },
                },
                ForgotPasswordRequest: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'admin@coworkkerala.com',
                        },
                    },
                },
                ResetPasswordRequest: {
                    type: 'object',
                    required: ['token', 'newPassword'],
                    properties: {
                        token: {
                            type: 'string',
                            example: 'reset-token-from-email',
                        },
                        newPassword: {
                            type: 'string',
                            format: 'password',
                            minLength: 8,
                            example: 'NewSecure@Password123',
                            description: 'Must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                        },
                    },
                },
                ChangePasswordRequest: {
                    type: 'object',
                    required: ['currentPassword', 'newPassword'],
                    properties: {
                        currentPassword: {
                            type: 'string',
                            format: 'password',
                            example: 'Admin@123456',
                        },
                        newPassword: {
                            type: 'string',
                            format: 'password',
                            minLength: 8,
                            example: 'NewSecure@Password123',
                            description: 'Must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                        },
                    },
                },
                Space: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        spaceId: {
                            type: 'string',
                            example: 'SP-2025-001',
                        },
                        spaceName: {
                            type: 'string',
                            example: 'WorkHub Kochi',
                        },
                        spaceType: {
                            type: 'string',
                            example: 'Coworking Space',
                        },
                        city: {
                            type: 'string',
                            example: 'Kochi',
                        },
                        spaceCategory: {
                            type: 'string',
                            example: 'Premium',
                        },
                        shortDescription: {
                            type: 'string',
                            example: 'Modern coworking space in the heart of Kochi',
                        },
                        longDescription: {
                            type: 'string',
                        },
                        amenities: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['WiFi', 'Coffee', 'Meeting Rooms', 'Parking'],
                        },
                        pricing: {
                            type: 'object',
                            properties: {
                                hotDesk: {
                                    type: 'number',
                                    example: 500,
                                },
                                dedicatedDesk: {
                                    type: 'number',
                                    example: 1000,
                                },
                                privateOffice: {
                                    type: 'number',
                                    example: 5000,
                                },
                            },
                        },
                        location: {
                            type: 'object',
                            properties: {
                                address: {
                                    type: 'string',
                                    example: '123 MG Road, Kochi',
                                },
                                pincode: {
                                    type: 'string',
                                    example: '682001',
                                },
                                latitude: {
                                    type: 'number',
                                    example: 9.9312,
                                },
                                longitude: {
                                    type: 'number',
                                    example: 76.2673,
                                },
                            },
                        },
                        contact: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'Manager Name',
                                },
                                email: {
                                    type: 'string',
                                    example: 'contact@workhub.com',
                                },
                                phone: {
                                    type: 'string',
                                    example: '+91 1234567890',
                                },
                            },
                        },
                        images: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['https://r2.example.com/space1.jpg'],
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'inactive', 'pending'],
                            example: 'active',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Lead: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        leadId: {
                            type: 'string',
                            example: 'LD-2025-001',
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com',
                        },
                        phone: {
                            type: 'string',
                            example: '+91 9876543210',
                        },
                        enquiredFor: {
                            type: 'string',
                            example: 'WorkHub Kochi',
                        },
                        spaceType: {
                            type: 'string',
                            example: 'Hot Desk',
                        },
                        numberOfSeats: {
                            type: 'integer',
                            example: 2,
                        },
                        location: {
                            type: 'string',
                            example: 'Kochi',
                        },
                        message: {
                            type: 'string',
                            example: 'I would like to schedule a visit',
                        },
                        date: {
                            type: 'string',
                            format: 'date-time',
                        },
                        status: {
                            type: 'string',
                            enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
                            example: 'new',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
