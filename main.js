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

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
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
    }
    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis block", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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

let JSCoin = new Blockchain();

//run in CMD: node main.js

console.log('Mining Block 1...')
JSCoin.addBlock(new Block(1, "6/12/2018", { amount: 2 }));
console.log('Mining Block 2...')
JSCoin.addBlock(new Block(2, "6/12/2018", { amount: 5 }));
console.log('Mining Block 3...')
JSCoin.addBlock(new Block(3, "6/12/2018", { amount: 3 }));
console.log('Mining Block 4...')
JSCoin.addBlock(new Block(4, "6/12/2018", { amount: 10 }));

//return Blockchain
console.log(JSON.stringify(JSCoin, null, 1));

//return if blockchain is valid = TRUE
console.log('Blockchain valid? ' + JSCoin.isChainValid());

//attempt to override value of Block 2's transaction amount, return if blockchain is valid = FALSE
JSCoin.chain[2].data = { amount: 500 };
console.log('Blockchain valid? ' + JSCoin.isChainValid());

//attempt to override value of Block 2's transaction amount AND recalculate Block 2's hash, return if blockchain is valid = FALSE
JSCoin.chain[2].data = { amount: 500 };
JSCoin.chain[2].hash = JSCoin.chain[1].calculateHash();
console.log('Blockchain valid? ' + JSCoin.isChainValid());



