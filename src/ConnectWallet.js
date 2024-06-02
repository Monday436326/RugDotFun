import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';

const ConnectWallet = ({ setSigner }) => {
    const [account, setAccount] = useState(null);
    const [onboard, setOnboard] = useState(null);

    useEffect(() => {
        const onboardInstance = Onboard({
            wallets: [injectedModule()],
            chains: [
                {
                    id: '0x38',
                    token: 'BNB',
                    label: 'BNB Smart Chain',
                    rpcUrl: 'https://bsc-dataseed.binance.org'
                },
            ],
            appMetadata: {
                name: 'Rug.fun',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" fill="#FFD700" /><path d="M50 10 L90 50 L50 90 L10 50 Z" fill="#8B4513" /><text x="50" y="60" font-family="Arial" font-size="12" text-anchor="middle" fill="#FFF">Rug.fun</text></svg>',
                description: 'A Memecoin Factory'
            }
        });

        setOnboard(onboardInstance);
    }, []);

    const connectWallet = async () => {
        if (onboard) {
            const wallets = await onboard.connectWallet();
            if (wallets[0]) {
                const ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider);
                setSigner(ethersProvider.getSigner());
                setAccount(wallets[0].accounts[0].address);
            }
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            {account ? (
                <Typography variant="h6">Connected: {account}</Typography>
            ) : (
                <Button variant="contained" color="primary" onClick={connectWallet}>
                    Connect Wallet
                </Button>
            )}
        </Box>
    );
};

export default ConnectWallet;
