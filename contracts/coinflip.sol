pragma solidity >=0.7.0 <0.8.0;

import "./owner.sol";

contract CoinFlip is Owner {
    event Flip(uint _reward, bool _result);
    
    uint minStake = 10 wei;
    uint returnRate = 2;
    
    function _randNum(uint _moduloNum) private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp))) % _moduloNum;
    }
    
    function flip() external payable {
        require(msg.value >= minStake);
        
        uint currentBalnce = address(this).balance;
        uint reward = msg.value * returnRate;

        require(currentBalnce >= reward);
        uint rand = _randNum(100);
        
        //Sender win
        if (rand >= 50) {
            payable(msg.sender).transfer(reward);
        }
        
        emit Flip(reward, rand >= 50);
    }
    
    function donate() external payable {}
    
    function getBalance() external view returns(uint) {
        return address(this).balance;
    }
}