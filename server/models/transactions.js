const mongoose =require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    trnxType: {
      type: String,
      required: true,
      enum: ['CR', 'DR']
    },
    purpose:{
      type: String,
      enum : ['deposit', 'transfer', 'reversal', 'withdrawal']
    },
    amount: {
      type: Number,
      required: true,
      default: 0.00
    },
    walletUsername: {
      type: String,
      ref: 'Wallets'
    },
    reference: { type: String, required: true },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    summary: { type: String},
    trnxSummary:{ type: String }
  ,
  orederno:{
    type : Number
  },
},
  { timestamps: true }
);

const Transactions = mongoose.model('transactions', transactionSchema);
module.exports = Transactions;
