// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapTokens {

    IERC20 public kmdToken; // продаем его
    IERC20 public kkdToken;
    address public owner;
    uint256 public price;

//    mapping (address => uint) public journal;

    constructor(
        address _KMDToken,
        address _KKDToken,
        uint256 _price
    ) {
        kmdToken = IERC20(_KMDToken);  // меняется тип на интерфейс, чтоbы проще взаимодейтсвовать с контрактом
        kkdToken = IERC20(_KKDToken);
        owner = msg.sender; // sender тот, кто отправляет
        require(_price > 0, 'Price = 0');
        price = _price;
    }

    function setPrice(uint256 priceNow) external {
        require(price > 0, 'Price can not = 0');
        price = priceNow;
    }

    function getPrice() public view returns(uint256) {
        return price;
    }

    function buying(uint256 amountToBuy) external {
        require(amountToBuy > 0, 'Can`t buy zero');

        uint256 allowance = kkdToken.allowance(msg.sender, address(this));
        require(allowance >= amountToBuy, 'Check allowance!');

//        uint allowanceTwo = kmdToken.allowance(address(this), msg.sender);
//        require(allowanceTwo >= amountToBuy, 'Check second allowance!');

        kkdToken.transferFrom(msg.sender, address(this), amountToBuy);  // sender который покупает. Отправляет money на контракт (this)
        kmdToken.transfer(msg.sender, amountToBuy); // заbрали деньги с контракта
    }
}

// TODO:
// 1. Юзер минтит коины на контракт
// 2. Второй контракт продает другим юзерам коины

// Апрув, чтоbы юзер смог снять ЧУЖИЕ коины с контракта
// Отправить коины на контракт в тесте
