import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { ethers } from 'ethers';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
const { abi: ierc20Abi } = require("./artifacts/IERC20.json");

const AirdropLaunchpad = ({ signer }) => {
    const [recipients, setRecipients] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const fileName = file.name;
        const fileExtension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);

        if (fileExtension === 'csv') {
            Papa.parse(file, {
                complete: (results) => {
                    const recipientList = results.data.flat().filter(Boolean);
                    setRecipients(recipientList.join(','));
                },
                error: (error) => {
                    console.error('Error parsing CSV file:', error);
                    setFeedback('Failed to parse CSV file.');
                }
            });
        } else if (['xls', 'xlsx'].includes(fileExtension)) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const recipientList = XLSX.utils.sheet_to_json(sheet, { header: 1 }).flat().filter(Boolean);
                setRecipients(recipientList.join(','));
            };
            reader.readAsArrayBuffer(file);
        } else {
            setFeedback('Unsupported file format. Please upload a CSV or Excel file.');
        }
    };

    const executeAirdrop = async () => {
        if (!signer) {
            setFeedback('Please connect your wallet first.');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(tokenAddress, ierc20Abi, signer);

            const recipientList = recipients.split(',').map(addr => addr.trim());

            const transactions = await Promise.all(
                recipientList.map(async (recipient) => {
                    const tx = await contract.transfer(recipient, ethers.utils.parseUnits(tokenAmount, 18));
                    await tx.wait();
                    return tx;
                })
            );

            console.log('Transactions:', transactions);

            setFeedback('Airdrop executed successfully!');
        } catch (error) {
            console.error("Failed to execute airdrop", error);
            setFeedback('Failed to execute airdrop.');
        }
    };

    return (
        <Paper sx={{ p: 4, mt: 4, mx: 'auto', maxWidth: 500 }}>
            <Typography variant="h5" gutterBottom>Launch Airdrop</Typography>
            <Box component="form" noValidate autoComplete="off">
                <TextField
                    fullWidth
                    margin="normal"
                    label="Recipient Addresses (comma separated), or upload csv/excel file"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                />
                <input
                    type="file"
                    accept=".csv, .xls, .xlsx"
                    onChange={handleFileUpload}
                    style={{ marginTop: '16px', display: 'block' }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Token Amount per Recipient"
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Token Address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={executeAirdrop}
                    sx={{ mt: 2 }}
                >
                    Execute Airdrop
                </Button>
                {feedback && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {feedback}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default AirdropLaunchpad;
