// const { Connection, clusterApiUrl, PublicKey } = require('@solana/web3.js');
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import fetch from 'node-fetch'
import { kiemTraChiaHetCho10, kiemTraSoKetThucBang99 } from './helper.js';

const binance2Wallet = new PublicKey('5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9');
const okxWallet = new PublicKey('5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD');
const bybitWWallet = new PublicKey('AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2');
const kucoinWallet = new PublicKey('BmFdpraQhkiDQE6SnfG5omcA1VwzqfXrwtNYBwWTymy6');
const mexcWallet = new PublicKey('ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ');
//sàn cỏ
const _5neps = new PublicKey('5ndLnEYqSFiA5yUFHo6LVZ1eWc6Rhh11K5CfJNkoHEPs');
const _dqmsr = new PublicKey('DQ5JWbJyWdJeyBxZuuyu36sUBud6L6wo3aN1QC1bRmsR');
const _8mtbt = new PublicKey('8mowmVCEewZ9W2cEaQyQeQEeSxhGr1hvRviLwozwNtBt');
const _byecx = new PublicKey('BY4StcU9Y2BpgH8quZzorg31EGE4L1rjomN8FNsCBEcx');
const _e98gf = new PublicKey('E9vf42zJXFv8Ljop1cG68NAxLDat4ZEGEWDLfJVX38GF');
const _g2d3t = new PublicKey('G2YxRa6wt1qePMwfJzdXZG62ej4qaTC7YURzuh2Lwd3t');
const _DfbGP = new PublicKey('DfDjexD59zyikdsJCLPdcM1hFBDd4Jb7Y5fFDcMkpbGP');


const hotWallets = [
    { address: '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9', name: 'Binance 2' },
    { address: '5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD', name: 'OKX' },
    { address: 'AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2', name: 'Bybit' },
    { address: 'BmFdpraQhkiDQE6SnfG5omcA1VwzqfXrwtNYBwWTymy6', name: 'Kucoin' },
    { address: 'ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ', name: 'MEXC' },
    { address: '5ndLnEYqSFiA5yUFHo6LVZ1eWc6Rhh11K5CfJNkoHEPs', name: '5n...EPs' },
    { address: 'DQ5JWbJyWdJeyBxZuuyu36sUBud6L6wo3aN1QC1bRmsR', name: 'DQ...msR' },
    { address: '8mowmVCEewZ9W2cEaQyQeQEeSxhGr1hvRviLwozwNtBt', name: '8m...tBt' },
    { address: 'BY4StcU9Y2BpgH8quZzorg31EGE4L1rjomN8FNsCBEcx', name: 'BY...Ecx' },
    { address: 'E9vf42zJXFv8Ljop1cG68NAxLDat4ZEGEWDLfJVX38GF', name: 'E9...8GF' },
    { address: 'G2YxRa6wt1qePMwfJzdXZG62ej4qaTC7YURzuh2Lwd3t', name: 'Photon' },
    { address: 'DfDjexD59zyikdsJCLPdcM1hFBDd4Jb7Y5fFDcMkpbGP', name: 'Df...bGP' }
];
const channelID = "-1002385144905";
const RPC = "https://misty-lively-sky.solana-mainnet.quiknode.pro/54f7bf49d8720d7df49a59c1067b9b1be5e7825d/";
const connection = new Connection(clusterApiUrl('mainnet-beta'), { commitment: 'confirmed' })
// const connection = new Connection(RPC, { commitment: 'confirmed' })
const connectionQuick = new Connection(RPC, { commitment: 'confirmed' })

const checkTxnCount = async (walletAddress) => {
    const wallet = await connectionQuick.getSignaturesForAddress(new PublicKey(walletAddress), { limit: 100 });
    if (wallet) {
        return wallet.length;
    }
    return 0;

}
const checkAndPrintTransferTransactions = async (signature) => {
    try {
        console.log('getParsedTransaction ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }

                console.log('[debug4] ' + signature);
                const solValue = lamports / 1000000000;
                if (solValue < 9) {
                    return;
                }

                // Check ví mới bằng Wallet Balance 
                var isNewWallet = true;
                const walletBallance = transaction.meta?.postBalances[2];
                const preWalletBallance = transaction.meta?.preBalances[2];
                if (preWalletBallance != 0 && lamports != walletBallance) {
                    isNewWallet = false;
                }

                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    isNewWallet = false;
                }

                if (isNewWallet == false) {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                console.log("isNewWallet: " + isNewWallet)
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": isNewWallet == true ? true : false,
                    "channelId": channelID
                }
                console.log('[debug6] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkBinance = async (signature) => {
    try {
        console.log('Start check Binance ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "Binance 2") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;
                console.log();

                var devName = "";
                var note = ""
                if (solValue == 89.99 || solValue == 90 || solValue == 99.99 || solValue == 100) {
                    devName = "John cena";
                    note = "Sol Balance: 89.99 | 90 | 99.99 | 100";
                }

                if (solValue == 129.99 || solValue == 134.99 || solValue == 139.99 || solValue == 144.99 || solValue == 154.99 || solValue == 164.99 || solValue == 169.99) {
                    devName = "Hammi";
                    note = "Sol Balance: 129.99 | 134.99 | 139.99 ... 169.99";
                }

                if (solValue >= 75 && solValue <= 799 && kiemTraSoKetThucBang99(solValue)) {
                    devName = "Cola";
                    note = "Sol Balance: 75 - 799";
                }

                if (solValue == 5.99) {
                    devName = "Coca PF";
                    note = "Sol Balance: 5.99";
                }

                if (devName == "") {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName,
                    "note": note
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkOkx = async (signature) => {
    try {
        console.log('Start check OKX ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "OKX") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;

                var devName = "";
                var note = ""
                if (solValue == 399.99 || solValue == 499.99 || solValue == 599.99 || solValue == 799.99) {
                    devName = "Coca";
                    note = "Sol Balance: 399.99 | 499.99 | 599.99 | 799.99";
                }

                if (solValue >= 50 && solValue <= 10000 && (kiemTraSoKetThucBang99(solValue) || kiemTraChiaHetCho10(solValue))) {
                    devName = "Coca";
                    note = "Sol Balance: 50-1000";
                }

                if (devName == "") {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName,
                    "note": note
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkBybit = async (signature) => {
    try {
        console.log('Start check Bybit ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "Bybit") {
                    return;
                }
                console.log('[debug5] ' + signature);

                const solValue = lamports / 1000000000;
                var devName = "";
                var note = ""
                var isNewWallet = true;

                if (solValue >= 2.3 && solValue <= 2.5) {
                    devName = "Coca";
                    note = "Sol Balance: Bybit 2.4";
                    isNewWallet = false;
                }

                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                // if (solValue == 399.99 || solValue == 499.99 || solValue == 599.99 || solValue == 799.99) {
                //     devName = "Coca";
                //     note = "Sol Balance: 399.99 | 499.99 | 599.99 | 799.99";
                // }

                if (solValue >= 50 && solValue <= 10000 && (kiemTraSoKetThucBang99(solValue) || kiemTraChiaHetCho10(solValue))) {
                    devName = "Coca";
                    note = "Sol Balance: 50-1000";
                }

                if (devName == "") {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": isNewWallet,
                    "channelId": channelID,
                    "devName": devName,
                    "note": note
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkKucoin = async (signature) => {
    try {
        console.log('Start check Kucoin ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "Kucoin") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;

                var devName = "";
                var note = ""
                // if (solValue == 399.99 || solValue == 499.99 || solValue == 599.99 || solValue == 799.99) {
                //     devName = "Coca";
                //     note = "Sol Balance: 399.99 | 499.99 | 599.99 | 799.99";
                // }

                if (solValue == 49.99) {
                    devName = "888 (Pumpfun)";
                    note = "Sol Balance: 49.99";
                }

                if (solValue == 9.99) {
                    devName = "888 (Ray)";
                    note = "Sol Balance: 9.99";
                }

                if (solValue == 99.99) {
                    devName = "Ultra";
                    note = "Sol Balance: 99.99";
                }

                if (devName == "") {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName,
                    "note": note
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkMexc = async (signature) => {
    try {
        console.log('Start check Mexc ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "MEXC") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;

                var devName = "";
                var note = ""
                // if (solValue == 399.99 || solValue == 499.99 || solValue == 599.99 || solValue == 799.99) {
                //     devName = "Coca";
                //     note = "Sol Balance: 399.99 | 499.99 | 599.99 | 799.99";
                // }

                if (solValue == 49.99) {
                    devName = "888 (Pumpfun)";
                    note = "Sol Balance: 49.99";
                }

                if (solValue == 9.99) {
                    devName = "888 (Ray)";
                    note = "Sol Balance: 9.99";
                }

                if (devName == "") {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName,
                    "note": note
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkBycex = async (signature) => {
    try {
        console.log('Start check Bycex ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "BY...Ecx") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;

                var devName = [];
                var note = []
                if (solValue == 89.99) {
                    devName.push("Bycex");
                    note.push("Sol Balance: 89.99");
                }

                if (solValue >= 50 && solValue <= 90) {
                    devName.push("PAT");
                    note.push("Sol Balance: 50-90");
                }

                if (devName.length == 0) {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName.join(', '),
                    "note": note.join(', ')
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const check5neps = async (signature) => {
    try {
        console.log('Start check 5neps ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "5n...EPs") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;

                var devName = [];
                var note = []
                if (solValue >= 20 && solValue <= 60) {
                    devName.push("Peet");
                    note.push("Sol Balance: 20-60");
                }

                if (solValue >= 6 && solValue <= 16) {
                    devName.push("yakuza/unfazetrump");
                    note.push("Sol Balance: 6-16");
                }

                if (solValue >= 50 && solValue <= 90) {
                    devName.push("PAT");
                    note.push("Sol Balance: 50-90");
                }

                if (devName.length == 0) {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName.join(', '),
                    "note": note.join(', ')
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const check8mtbt = async (signature) => {
    try {
        console.log('Start check 8mtbt ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "8m...tBt") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;

                var devName = [];
                var note = []
                if (solValue >= 20 && solValue <= 60) {
                    devName.push("Peet");
                    note.push("Sol Balance: 20-60");
                }

                if (solValue >= 50 && solValue <= 90) {
                    devName.push("PAT");
                    note.push("Sol Balance: 50-90");
                }

                if (devName.length == 0) {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName.join(', '),
                    "note": note.join(', ')
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkdqmsr = async (signature) => {
    try {
        console.log('Start check 8mtbt ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "DQ...msR") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;

                var devName = [];
                var note = []

                if (solValue >= 50 && solValue <= 90) {
                    devName.push("PAT");
                    note.push("Sol Balance: 50-90");
                }

                if (devName.length == 0) {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName.join(', '),
                    "note": note.join(', ')
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checke98gf = async (signature) => {
    try {
        console.log('Start check e98gf ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "E9...8GF") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);

                const solValue = lamports / 1000000000;

                var devName = [];
                var note = []

                if (solValue >= 4.5 && solValue <= 7) {
                    devName.push("Domokun PF");
                    note.push("Sol Balance: 4.5 - 7 ");
                }

                if (solValue >= 98 && solValue <= 100) {
                    devName.push("DEV lãi 16 sol");
                    note.push("Sol Balance: 98-100");
                }

                if (devName.length == 0) {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName.join(', '),
                    "note": note.join(', ')
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkg2d3t = async (signature) => {
    try {
        console.log('Start check g2d3t ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "Photon") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);
                const solValue = lamports / 1000000000;

                var devName = [];
                var note = []

                if (solValue >= 4.5 && solValue <= 7) {
                    devName.push("Domokun PF");
                    note.push("Sol Balance: 4.5 - 7");
                }

                if (solValue >= 8 && solValue <= 15) {
                    devName.push("Snolex/ Bananacat");
                    note.push("Sol Balance: 8 - 15");
                }

                if (solValue >= 98 && solValue <= 100) {
                    devName.push("DEV lãi 16 sol");
                    note.push("Sol Balance: 98-100");
                }

                if (devName.length == 0) {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName.join(', '),
                    "note": note.join(', ')
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const checkdfbgp = async (signature) => {
    try {
        console.log('Start check dfbgp ... ' + signature);
        const transaction = await connectionQuick.getParsedTransaction(signature);
        if (transaction == undefined || transaction == null) {
            return;
        }
        console.log('[debug1] ' + signature);
        const { transaction: { message: { accountKeys, instructions } } } = transaction;
        instructions.forEach(async (instruction) => {
            console.log('[debug2] ' + signature);
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
                // console.log(JSON.stringify(transaction));
                console.log('[debug3] ' + signature);
                const { info: { source, destination, lamports } } = instruction.parsed;

                // Check ví gửi có nằm trong danh sách ví HotWallet của sản không
                var hotWallet = hotWallets.find(x => x.address == source);
                if (hotWallet == undefined || hotWallet == null) {
                    return;
                }
                console.log('[debug4] ' + signature);

                if (hotWallet.name != "Df...bGP") {
                    return;
                }
                console.log('[debug5] ' + signature);
                // Check ví mới bằng số lượng txns <= 5
                var countTnxs = await checkTxnCount(destination);
                if (countTnxs > 5) {
                    return;
                }
                console.log('[debug6] ' + signature);
                const solValue = lamports / 1000000000;

                var devName = [];
                var note = []

                if (solValue == 0.5) {
                    devName.push("DEV 0.5");
                    note.push("Sol Balance: 0.5");
                }

                if (devName.length == 0) {
                    return;
                }

                var msg = `💸[${hotWallet.name}] ${solValue} SOL => ${destination} `;
                console.log(msg);
                var objMsg = {
                    "hash": signature,
                    "hotWalletName": hotWallet.name,
                    "hotWalletAddress": hotWallet.address,
                    "balance": solValue,
                    "desWallet": destination,
                    "isNewWallet": true,
                    "channelId": channelID,
                    "devName": devName.join(', '),
                    "note": note.join(', ')
                }
                console.log('[debug7] ' + signature);
                await sendMsg(objMsg);

            }
        }
        );

    } catch (error) {
        console.log(error.message);
    }

};

const url = 'http://34.126.151.205:44381/api/app/sender/send-to-hot-wallet-transfer-listener-v2';

const headers = {
    'accept': 'text/plain',
    'Content-Type': 'application/json',
    'RequestVerificationToken': 'CfDJ8GsOVzs4fx9FndyENtDz1zMdYOIp18hJNzI6uRbHAgHPlRWLFDX41_f4dNnQmVM-XEwxhyXbs5ja8nf_I9YFfeA5WiXTKu4f8Em0yLaKUb_L-EnXyGjS_vsN1vbIL6px1rpHtH40v5lTLPrZGcjn-Yc',
    'X-Requested-With': 'XMLHttpRequest'
};
async function sendMsg(msg) {
    console.log("Sending ...")
    debugger
    var body = JSON.stringify(msg);
    console.log(body);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

connection.onLogs(binance2Wallet, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`Phát hiện giao dịch với chữ ký: ${signature}`);
        checkBinance(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed');

connection.onLogs(okxWallet, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[OKX] Phát hiện giao dịch với chữ ký: ${signature}`);
        checkOkx(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed');

connection.onLogs(bybitWWallet, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[BYBIT] Phát hiện giao dịch với chữ ký: ${signature}`);
        checkBybit(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed');

connection.onLogs(mexcWallet, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[MEXC] Phát hiện giao dịch với chữ ký: ${signature}`);
        checkMexc(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed');

connection.onLogs(kucoinWallet, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[Kucoin] Phát hiện giao dịch với chữ ký: ${signature}`);
        checkKucoin(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed');

// // sàn cỏ
connection.onLogs(_5neps, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[5neps] Phát hiện giao dịch với chữ ký: ${signature}`);
        check5neps(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed')

connection.onLogs(_dqmsr, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[dqmsr] Phát hiện giao dịch với chữ ký: ${signature}`);
        checkdqmsr(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed')

connection.onLogs(_8mtbt, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[8mtbt] Phát hiện giao dịch với chữ ký: ${signature}`);
        check8mtbt(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed')

connection.onLogs(_byecx, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[byecx] Phát hiện giao dịch với chữ ký: ${signature}`);
        checkBycex(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed')

connection.onLogs(_e98gf, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[e98gf] Phát hiện giao dịch với chữ ký: ${signature}`);
        checke98gf(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed')

connection.onLogs(_g2d3t, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[g2d3t] Phát hiện giao dịch với chữ ký: ${signature}`);
        checkg2d3t(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed')

connection.onLogs(_DfbGP, (logInfo) => {
    try {
        const { signature } = logInfo;
        console.log(`[DfbGP] Phát hiện giao dịch với chữ ký: ${signature}`);
        checkdfbgp(signature);
    } catch (error) {
        console.log(error.message)
    }
}, 'confirmed')

console.log(`Following Transfers Txns from 4 sàn cỏ`);
