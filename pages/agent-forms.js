import React from 'react';
import Head from 'next/head';
import AgentForm from '../components/agent/AgentForm'; // Importing AgentForm component
import AbleForm from '../components/form/AbleForm'; // Importing AgentForm component

const AgentFormsPage = () => {
    return (
        <div>
            <Head>
                <title>Agent Forms - Smith Agency App</title>
            </Head>
            <main>
                <h1>Agent Forms</h1>
                <div className="container">
                <AgentForm />
                <AbleForm />
                </div>
            </main>
        </div>
    );
};

export default AgentFormsPage;
