//run in CMD: node main.js

/*Notes:
Proof of Work(PoW) - mining, requires lot computing power, which is the Difficulty level (can be adjusted).
PoW prevents massive spamming.
PoW prevents possibility someone changing 1 block, then recalculating the hash for all blocks afterwards, creating a valid chain.
*/

/*SHA256 not available in Javascript by default, import library: 
1. npm install --save crypto-js
2. import here:
*/
const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
      return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    //setting difficulty level is done by requiring a certian amount of zeroes at the beginning of the hash
    mineBlock(difficulty) {
        //while loop keep running until hash starts with determined zeroes
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            //the hash of a block wont change unless the content of the block changes; this is the purpose of including a nonce, which can be changed to random number. this increments nonce as long as the hash doesnt start with enough zeroes
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        //set blockchain difficulty (how many zeros the hash must start with(as you increase difficulty, it takes longer to run...i.e. controlling how fast blocks can be added to the blockchain))
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 3;
    }
    createGenesisBlock() {
        return new Block("01/01/2018", "Genesis block", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        //add new blocks to chain
        this.chain.push(block);

        //reset pending transactions & give miner his reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    //add transactions into pending transactions array
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    //check balance of address (not really stored in an address, just stored on blockchain)
    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                //sending reduces balance
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                //receiving increases balance
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    //verify integrity of blockchain:
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            //check validity of current hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            //check validity of previous hash
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        //if meets validity checks
        return true;
    }
}


//run in CMD: node main.js


let JSCoin = new Blockchain();

JSCoin.createTransaction(new Transaction('address1','address2', 1000));
JSCoin.createTransaction(new Transaction('address2', 'address1', 400));

console.log('\n Starting the miner...');
JSCoin.minePendingTransactions('cadi-address');
//returns mining reward balance-rewards arent added until the next block is mined
console.log('\n Balance of Cadi is ', JSCoin.getBalanceOfAddress('cadi-address'));

console.log('\n Starting the miner again...');
JSCoin.minePendingTransactions('cadi-address');
//returns mining reward balance-rewards arent added until the next block is mined
console.log('\n Balance of Cadi is ', JSCoin.getBalanceOfAddress('cadi-address'));

console.log('\n Starting the miner again...');
JSCoin.minePendingTransactions('cadi-address');
//returns mining reward balance-rewards arent added until the next block is mined
console.log('\n Balance of Cadi is ', JSCoin.getBalanceOfAddress('cadi-address'));


/*this code was from earlier in tutorial
//return Blockchain
console.log(JSON.stringify(JSCoin, null, 1));

//breakdown hash per block
console.log('Mining Block 1...')
JSCoin.addBlock(new Block(1, "6/12/2018", { amount: 2 }));
console.log('Mining Block 2...')
JSCoin.addBlock(new Block(2, "6/12/2018", { amount: 5 }));
console.log('Mining Block 3...')
JSCoin.addBlock(new Block(3, "6/12/2018", { amount: 3 }));
console.log('Mining Block 4...')
JSCoin.addBlock(new Block(4, "6/12/2018", { amount: 10 }));

//return if blockchain is valid = TRUE
console.log('Blockchain valid? ' + JSCoin.isChainValid());

//attempt to override value of Block 2's transaction amount, return if blockchain is valid = FALSE
JSCoin.chain[2].data = { amount: 500 };
console.log('Blockchain valid? ' + JSCoin.isChainValid());

//attempt to override value of Block 2's transaction amount AND recalculate Block 2's hash, return if blockchain is valid = FALSE
JSCoin.chain[2].data = { amount: 500 };
JSCoin.chain[2].hash = JSCoin.chain[1].calculateHash();
console.log('Blockchain valid? ' + JSCoin.isChainValid());
*/


