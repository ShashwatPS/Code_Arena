// pages/api/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import pclient from 'db/prisma';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await pclient.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await pclient.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
}
