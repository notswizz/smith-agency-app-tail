import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { client, run } from '../../../lib/mongodb';

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // ...add more providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            try {
                await run();
                const db = client.db('TSA');
                const existingAgent = await db.collection('agents').findOne({ email: user.email });

                if (!existingAgent) {
                    const newAgent = {
                        email: user.email,
                        name: '', // or user.name if you want to use the name from Google
                        phone: '',
                        location: [],
                        instagram: '',
                        college: '',
                        shoeSize: '',
                        salesExperience: '',
                        clothingSize: '',
                        availability: [],
                        imageUrl: '',
                        resumeUrl: ''
                    };
                    await db.collection('agents').insertOne(newAgent);
                }

                return true; // Continue the sign-in process
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false; // Do not continue the sign-in process
            }
        },
        // ...other callbacks
    },
    // ...other configurations
});
