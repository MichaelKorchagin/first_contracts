pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KMDToken is ERC20 {
    address public owner = msg.sender;

constructor(string memory name, string memory symbol) public ERC20(name, symbol) {
        _mint(owner, 50);
    }

    function getAllMoneyFromContract() public {
        address payable _to = payable(owner);
        address _thisContract = address(this);
        _to.transfer(_thisContract.balance);
    }
}
