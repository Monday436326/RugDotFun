import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, FormControlLabel, Switch, CircularProgress } from '@mui/material';
import { ethers } from 'ethers';
const { abi: fixedSupplyTokenAbi } = require("./artifacts/RugFunTokenFactory.json");
const { bytecode: fixedSupplyTokenBytecode } = require("./artifacts/RugFunTokenFactory.json");
const { abi: variableSupplyTokenAbi } = require("./artifacts/RugFunFactory.json");
const { bytecode: variableSupplyTokenBytecode } = require("./artifacts/RugFunFactory.json");


const TokenFactory = ({ signer }) => {
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [tokenSupply, setTokenSupply] = useState('');
    const [fixedSupply, setFixedSupply] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [txHash, setTxHash] = useState('');
    const [explorerUrl, setExplorerUrl] = useState('');
    const [loading, setLoading] = useState(false); // New state variable for loading status

    const createToken = async () => {
        if (!signer) {
            setFeedback('Please connect your wallet first.');
            return;
        }

        setLoading(true); // Set loading to true when the process starts
        setFeedback('');
        setTxHash('');
        setExplorerUrl('');

        try {
            // Retrieve the signer's address
            const signerAddress = await signer.getAddress();
            const network = await signer.provider.getNetwork();
            // Determine the appropriate explorer URL based on the network
            let baseExplorerUrl;
            switch (network.chainId) {
                case 1: // Mainnet
                    baseExplorerUrl = 'https://etherscan.io';
                    break;
                case 56: // Binance Smart Chain Mainnet
                    baseExplorerUrl = 'https://bscscan.com';
                    break;
                case 97: // Binance Smart Chain Testnet
                    baseExplorerUrl = 'https://testnet.bscscan.com';
                    break;
                case 204: // OP Binance Smart Chain Mainnet
                    baseExplorerUrl = 'http://opbnbscan.com';
                    break;
                case 5611: // OP Binance Smart Chain Testnet
                    baseExplorerUrl = 'http://testnet.opbnbscan.com';
                    break;
                // Add more networks as needed
                default:
                    baseExplorerUrl = '';
                    break;
            }
            const supply = tokenSupply;
            let factory;
            if (fixedSupply) {
                factory = new ethers.ContractFactory(fixedSupplyTokenAbi, fixedSupplyTokenBytecode, signer);
            } else {
                factory = new ethers.ContractFactory(variableSupplyTokenAbi, variableSupplyTokenBytecode, signer);
            }
            const contract = await factory.deploy(tokenName, tokenSymbol, supply, signerAddress);
            const tx = await contract.deployTransaction.wait();

            setTxHash(tx.transactionHash);
            setExplorerUrl(`${baseExplorerUrl}/tx/${tx.transactionHash}`);

            setFeedback('Token created successfully!');
        } catch (error) {
            console.error("Failed to create token", error);
            setFeedback('Failed to create token.');
        } finally {
            setLoading(false); // Set loading to false when the process is complete
        }
    };

    return (
        <Paper sx={{ p: 4, mt: 4, mx: 'auto', maxWidth: 500 }}>
            <Typography variant="h5" gutterBottom>Create Your Token</Typography>
            <Box component="form" noValidate autoComplete="off">
                <TextField
                    fullWidth
                    margin="normal"
                    label="Token Name"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Token Symbol"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Supply"
                    type="number"
                    value={tokenSupply}
                    onChange={(e) => setTokenSupply(e.target.value)}
                />
                <FormControlLabel
                    control={<Switch checked={fixedSupply} onChange={() => setFixedSupply(!fixedSupply)} />}
                    label="Fixed Supply"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={createToken}
                    sx={{ mt: 2 }}
                    disabled={loading} // Disable button while loading
                >
                    Create Token
                </Button>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
                {feedback && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {feedback}
                    </Typography>
                )}
                {txHash && (
                    <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                        Transaction Hash: <a href={explorerUrl} target="_blank" rel="noopener noreferrer">{txHash}</a>
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default TokenFactory;
