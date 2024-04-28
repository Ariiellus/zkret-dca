// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DCAContract {
    ISwapRouter public immutable swapRouter;
    IERC20 public immutable ghoToken;
    address public immutable weth;

    // Timing for DCA
    uint public interval;
    uint public lastExecutionTime;

    constructor(address _router, address _ghoToken, address _weth, uint _interval) {
        swapRouter = ISwapRouter(_router);
        ghoToken = IERC20(_ghoToken);
        weth = _weth;
        interval = _interval;
        lastExecutionTime = block.timestamp;
    }

    // Ensure the function is called periodically
    modifier onlyAfterInterval() {
        require(block.timestamp >= lastExecutionTime + interval, "Interval not passed");
        _;
        lastExecutionTime = block.timestamp;
    }

    function swapGHOForWETH(uint256 amountIn, uint256 amountOutMinimum) external onlyAfterInterval {
        ghoToken.transferFrom(msg.sender, address(this), amountIn);
        ghoToken.approve(address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: address(ghoToken),
            tokenOut: weth,
            fee: 3000,  // Pool fee tier, adjust based on the specific pool's fee
            recipient: msg.sender,
            deadline: block.timestamp + 15 minutes,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0  // No price limit
        });

        swapRouter.exactInputSingle(params);
    }
}
