// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapTokens {

    IERC20 public kmdToken;
    IERC20 public kkdToken; // его покупаем
    address public owner;
    address public taker;
    uint256 public price;

//    mapping (address => uint) public journal;

    constructor(
        address _KMDToken,
        address _KKDToken,
        uint256 _price
//        address _taker
    ) {
        kmdToken = IERC20(_KMDToken);  // меняется тип на интерфейс, чтоbы проще взаимодейтсвовать с контрактом
        kkdToken = IERC20(_KKDToken);
        owner = msg.sender; // sender который деплоил
//        taker = _taker;
        require(_price > 0, 'Price = 0');
        price = _price;
    }

    function setPrice(uint256 priceNow) external {
        require(price > 0, 'Price = 0');
        price = priceNow;
    }

    function getPrice() public view returns(uint256) {
        return price;
    }

    function swap(uint256 amountToBuy) external {
        require(amountToBuy > 0, 'Can`t buy zero');

//        journal[msg.sender] = msg.value;

        kmdToken.transferFrom(msg.sender, address(this), amountToBuy * price);  // sender который покупает. Отправляет money на контракт (this)
        kkdToken.transferFrom(address(this), msg.sender, amountToBuy); // заbрали деньги с контракта
//        kmdToken.transferFrom(address(this), taker, amountToBuy * price);
    }

//     function заbрать bаbки
//    function takeTokensFromContract (uint256 amountToTake) external {
//        require(amountToTake > 0, 'Can`t take zero');
//        kmdToken.transferFrom(address(this), taker, amountToTake);
//    }
}
