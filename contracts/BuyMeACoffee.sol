// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log
import "hardhat/console.sol";

// contract deployed at 0x0ADCeA22C7880D4884dc9feE05206f22457F8465

contract BuyMeACoffee {
    // Event to emit when a memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of All Memos received from friends.
    Memo[] memos;

    address payable owner;

    // Runs only one time(during deployment of the contract)
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buys coffee for the contract owner
     * @param _name name of the coffee buyer
     * @param _message message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "Can't buy coffee with 0eth :(");

        // Create and add memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // emit a log event when memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev withdraw the tips from the contract to owner address
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve all memos stored on blockchain
     */
    function getAllMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function transferOwnership(address to) public onlyOwner {
        owner = payable(to);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
