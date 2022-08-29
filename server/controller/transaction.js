const Wallets = require('../models/wallets');
const Transactions = require('../models/transactions');
const bcrypt=require("bcryptjs");

const creditAccount = async ({ amount, username, purpose, reference, orderno, trnxSummary}) => {
    const wallet = await Wallets.findOne({ username });
    
    if (!wallet) {
        return {
            status: false,
            statusCode: 404,
            message: `User ${username} doesn\'t exist`
        }
    };
    
    
    let transaction = new Transactions({
        trnxType: 'CR',
        purpose,
        amount,
        username,
        reference,
        balanceBefore: Number(wallet.balance),
        balanceAfter: Number(wallet.balance) + Number(amount),
        trnxSummary,
        orderno
    });
    transaction.save().then(data=>{
        console.log(data);
    })
    .catch(err=>{
       console.log(err);
    })

    console.log(`Credit successful, ${amount} added to ${username}`);
    return {
        status: true,
        statusCode: 201,
        message: 'Credit successful, amount added to wallet',
      
        data: {  transaction }
    }

}

const debitAccount = async ({ amount, username, purpose, reference,orderno, trnxSummary }) => {
    const wallet = await Wallets.findOne({ username });
    if (!wallet) {
        return {
            status: false,
            statusCode: 404,
            message: `User ${username} doesn\'t exist`
        }
    };

    if (Number(wallet.balance) < amount) {
        return {
            status: false,
            statusCode: 400,
            message: `User ${username} has insufficient balance`
        }
    }

     let transaction = new Transactions({
        trnxType: 'DR',
        purpose,
        amount,
        username,
        reference,
        balanceBefore: Number(wallet.balance),
        balanceAfter: Number(wallet.balance) - Number(amount),
        trnxSummary,
        orderno
    });
    transaction.save().then(data=>{
        console.log(data);
    })
    .catch(err=>{
       console.log(err);
    })

    console.log(`Debit successful, ${amount} deducted from ${username}`);
    return {
        status: true,
        statusCode: 201,
        message: 'Debit successful, amount deducted from wallet',
        data: { transaction }
    }
}

module.exports = {
    creditAccount, debitAccount
};
