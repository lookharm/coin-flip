pragma solidity >=0.7.0 <0.8.0;

contract Owner {
    address payable private _owner;
    
    constructor() {
        _owner = msg.sender;
    }
    
    function owner() public view returns(address) {
        return _owner;
    }
    
    function withdraw() external {
        require(msg.sender == _owner);
        _owner.transfer(address(this).balance);
    }
}