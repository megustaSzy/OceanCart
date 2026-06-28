import { z } from 'zod';

export const AuthValidator = {
    register: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        roles: z.array(z.string()).min(1, "At least one role is required")
    }),

    login: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required")
    }),

    selectRole: z.object({
        role: z.string().min(1, "Role is required")
    }),
    
    refreshToken: z.object({
        refreshToken: z.string().optional() // Can be in cookie instead
    })
};
